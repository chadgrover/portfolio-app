import { readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { describe, expect, test } from 'vitest';
import { supportedLanguages } from '../src/lib/i18n/constants';

const distDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
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
const textOf = (html: string, name: string) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, 'gi'))].map(([, inner]) => inner.replace(/<[^>]+>/g, '').trim());
const metaContent = (html: string, name: string) =>
  tags(html, 'meta').map(attributes).find((meta) => meta.get('name') === name)?.get('content');
const anchors = (html: string) => tags(html, 'a').map(attributes);
const portfolioContentOf = (language: string) =>
  JSON.parse(readFileSync(new URL(`../src/content/portfolio/${language}.json`, import.meta.url), 'utf8'));
const profileLinks: { name: string; url: string }[] = JSON.parse(
  readFileSync(new URL('../src/content/portfolio/profile-links.json', import.meta.url), 'utf8'),
);
const profileLinkLabels = {
  en: { LinkedIn: 'LinkedIn profile', GitHub: 'GitHub profile' },
  ja: { LinkedIn: 'LinkedInのプロフィール', GitHub: 'GitHubのプロフィール' },
};
const languageSwitchCurrentLabels = { en: 'English', ja: '日本語' };

const buildOutputPathOf = (href: string, pagePath: string) =>
  decodeURIComponent(new URL(href, new URL(pagePath, siteOrigin)).pathname.slice(1));

const withoutMarkdownMarks = (text: string) => text.replace(/\*\*[^*]+\*\*\s*|`/g, '');
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

  test('is titled with the Latin-script name alone', () => {
    expect(textOf(html, 'title')).toEqual(['Chad Grover']);
  });

  test('describes itself with its introduction', () => {
    expect(metaContent(html, 'description')).toBe(portfolioContentOf(language).home.hero.introduction);
  });

  test('has a language switch that marks the current language', () => {
    const [languageSwitchNav = ''] = html.match(/<nav\b[^>]*>[\s\S]*?<\/nav>/i) ?? [];
    const languageSwitch = anchors(languageSwitchNav);
    expect(languageSwitch.map((anchor) => anchor.get('href'))).toEqual(supportedLanguages.map((destination) => `/${destination}/`));
    expect(languageSwitch.filter((anchor) => anchor.get('aria-current') === 'page').map((anchor) => anchor.get('href'))).toEqual([`/${language}/`]);
    expect(html).toMatch(new RegExp(`aria-current="page"[^>]*>${languageSwitchCurrentLabels[language]}<`));
  });

  test('lists the profile links in their shared file order', () => {
    const profileLinkUrls = profileLinks.map(({ url }) => url);
    expect(anchors(html).map((anchor) => anchor.get('href')).filter((href) => profileLinkUrls.includes(href ?? ''))).toEqual(profileLinkUrls);
  });

  test.each(profileLinks)('links to the $name profile with a localized accessible name', ({ name, url }) => {
    const link = anchors(html).find((anchor) => anchor.get('href') === url);
    expect(link?.get('aria-label')).toBe(profileLinkLabels[language][name as keyof (typeof profileLinkLabels)['en']]);
  });
});

describe('404 page', () => {
  test('exists in the build output', () => {
    expect(buildOutputFiles).toContain('404.html');
  });

  test.each(supportedLanguages)('links home to /%s/', (language) => {
    expect(readBuildOutput('404.html')).toContain(`href="/${language}/"`);
  });

  test('is titled with its page name, then the Latin-script name', () => {
    expect(textOf(readBuildOutput('404.html'), 'title')).toEqual(['Page not found | Chad Grover']);
  });

  test.each([['English Home', '/en/'], ['日本語のホーム', '/ja/']])('labels its home link %s', (label, href) => {
    expect(readBuildOutput('404.html')).toMatch(new RegExp(`href="${href}"[^>]*>${label}<`));
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
