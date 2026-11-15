import { readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { describe, expect, test } from 'vitest';
import { supportedLanguages } from '../src/lib/i18n/constants';
import type { Language } from '../src/lib/i18n/types';
import type { PortfolioContent } from '../src/lib/portfolio-content/types';
import type { ProfileLink } from '../src/lib/profile-links/types';

const distDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
const contentDirectory = fileURLToPath(new URL('../src/content/portfolio/', import.meta.url));
const surfaceBriefDirectory = fileURLToPath(new URL('../.impeccable/surfaces/', import.meta.url));
const siteOrigin = 'https://site.invalid/';
const bytesPerKilobyte = 1000;
const cssBudgetBytes = 20_000;
const webFontBudgetBytes = 60_000;
const webFontExtensions = ['.woff2', '.woff', '.ttf', '.otf'];
const directionContractHeading = '## Direction contract';
const shortestDistinctiveSentenceLength = 40;
const seedReferencePattern = /seed:[0-9a-f]{16}/g;

const buildOutputFiles = readdirSync(distDirectory, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => relative(distDirectory, join(entry.parentPath, entry.name)));

const readBuildOutputBytes = (path: string) => readFileSync(join(distDirectory, path));
const readBuildOutput = (path: string) => readBuildOutputBytes(path).toString('utf8');
const compressedSize = (content: string | Buffer) => gzipSync(content, { level: 9 }).length;
const inKilobytes = (bytes: number) => `${bytes / bytesPerKilobyte} KB`;

const tags = (html: string, name: string) => html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? [];
const attributes = (tag: string) =>
  new Map(
    [...tag.matchAll(/\s([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].map(
      ([, name, doubleQuoted, singleQuoted, unquoted]) => [
        name.toLowerCase(),
        doubleQuoted ?? singleQuoted ?? unquoted ?? '',
      ],
    ),
  );
const relTokens = (tag: string) => (attributes(tag).get('rel') ?? '').toLowerCase().split(/\s+/);
const isThirdParty = (url: string) => /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(url.trim());
const isJavaScriptType = (type: string) =>
  ['', 'module'].includes(type.trim().toLowerCase()) || /(?:java|ecma)script/i.test(type);
const buildOutputPathOf = (href: string, pagePath: string) =>
  decodeURIComponent(new URL(href, new URL(pagePath, siteOrigin)).pathname.slice(1));

const readContentFile = (name: string) => JSON.parse(readFileSync(join(contentDirectory, name), 'utf8'));
const readPortfolioContent = (language: Language): PortfolioContent => readContentFile(`${language}.json`);
const readProfileLinks = (): ProfileLink[] => readContentFile('profile-links.json');
const withoutTags = (html: string) => html.replace(/<[^>]*>/g, '');
const visibleText = (html: string) => withoutTags(html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ''));
const elementTexts = (html: string, name: string) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, 'gi'))].map(([, inner]) => withoutTags(inner).trim());

const withoutMarkdownMarks =(text: string) => text.replace(/\*\*[^*]+\*\*\s*|`/g, '');
const distinctiveContractPhrases = (surfaceBrief: string) => {
  const [, afterHeading = ''] = surfaceBrief.split(directionContractHeading);
  const [contract] = afterHeading.split(/^## /m);
  const sentences = withoutMarkdownMarks(contract)
    .split(/\n|(?<=\.)\s/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= shortestDistinctiveSentenceLength);
  return [...sentences, ...(contract.match(seedReferencePattern) ?? [])];
};

const firstPartyJavaScript = (html: string) => [
  ...tags(html, 'script').filter((tag) => {
    const scriptAttributes = attributes(tag);
    return isJavaScriptType(scriptAttributes.get('type') ?? '') && !isThirdParty(scriptAttributes.get('src') ?? '');
  }),
  ...tags(html, 'link').filter(
    (tag) => relTokens(tag).includes('modulepreload') && !isThirdParty(attributes(tag).get('href') ?? ''),
  ),
];

const deliveredCss = (html: string, pagePath: string) => {
  const inlineStyles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1]);
  const linkedStylesheets = tags(html, 'link')
    .filter((tag) => relTokens(tag).includes('stylesheet'))
    .map((tag) => attributes(tag).get('href') ?? '')
    .filter((href) => href !== '' && !isThirdParty(href))
    .map((href) => readBuildOutput(buildOutputPathOf(href, pagePath)));
  return [...inlineStyles, ...linkedStylesheets].join('\n');
};

describe.each(supportedLanguages)('localized home page /%s/', (language) => {
  const html = readBuildOutput(`${language}/index.html`);

  test('declares its page language', () => {
    expect(html).toMatch(new RegExp(`<html[^>]*\\slang="${language}"`));
  });

  test('loads no first-party JavaScript', () => {
    expect(firstPartyJavaScript(html)).toEqual([]);
  });

  const { home, profileLinkLabels } = readPortfolioContent(language);

  test('shows the display name as its heading', () => {
    expect(elementTexts(html, 'h1')).toEqual([home.hero.displayName]);
  });

  test('describes itself with its meta description', () => {
    const descriptions = tags(html, 'meta')
      .map(attributes)
      .filter((meta) => meta.get('name') === 'description')
      .map((meta) => meta.get('content'));
    expect(descriptions).toEqual([home.metaDescription]);
  });

  test('shows the role', () => {
    expect(visibleText(html)).toContain(home.hero.role);
  });

  test.each(readProfileLinks())('links to the $platform profile with a localized accessible name', ({ platform, url }) => {
    const accessibleNames = tags(html, 'a')
      .map(attributes)
      .filter((anchor) => anchor.get('href') === url)
      .map((anchor) => anchor.get('aria-label'));
    expect(accessibleNames).toEqual([profileLinkLabels[platform].accessibleName]);
  });

  test('lists profile links in their content order', () => {
    const profileLinkUrls = new Set(readProfileLinks().map(({ url }) => url));
    const linkedUrls = tags(html, 'a')
      .map((anchor) => attributes(anchor).get('href') ?? '')
      .filter((href) => profileLinkUrls.has(href));
    expect(linkedUrls).toEqual([...profileLinkUrls]);
  });

  test('carries no fictional portfolio notice', () => {
    expect(visibleText(html)).not.toMatch(/fictional|架空/i);
  });
});

test('the Japanese home page shows the name in katakana', () => {
  expect(elementTexts(readBuildOutput('ja/index.html'), 'h1')).toEqual(['グローヴァ　チャッド']);
});

describe('404 page', () => {
  test('exists in the build output', () => {
    expect(buildOutputFiles).toContain('404.html');
  });

  test.each(supportedLanguages)('links home to /%s/', (language) => {
    expect(readBuildOutput('404.html')).toContain(`href="/${language}/"`);
  });
});

describe('performance budgets', () => {
  test.each(buildOutputFiles.filter((path) => extname(path) === '.html'))(
    `%s delivers compressed CSS of ${inKilobytes(cssBudgetBytes)} or less`,
    (path) => {
      expect(compressedSize(deliveredCss(readBuildOutput(path), path))).toBeLessThanOrEqual(cssBudgetBytes);
    },
  );

  test(`compressed web fonts total ${inKilobytes(webFontBudgetBytes)} or less`, () => {
    const webFontBytes = buildOutputFiles
      .filter((path) => webFontExtensions.includes(extname(path)))
      .reduce((total, path) => total + compressedSize(readBuildOutputBytes(path)), 0);
    expect(webFontBytes).toBeLessThanOrEqual(webFontBudgetBytes);
  });
});

describe('direction contracts', () => {
  const contractPhrases = readdirSync(surfaceBriefDirectory)
    .map((name) => readFileSync(join(surfaceBriefDirectory, name), 'utf8'))
    .flatMap(distinctiveContractPhrases);

  test('surface briefs hold a direction contract', () => {
    expect(contractPhrases).not.toEqual([]);
  });

  test.each(buildOutputFiles)('%s carries no direction contract phrase', (path) => {
    const content = withoutMarkdownMarks(readBuildOutput(path));
    expect(contractPhrases.filter((phrase) => content.includes(phrase))).toEqual([]);
  });
});
