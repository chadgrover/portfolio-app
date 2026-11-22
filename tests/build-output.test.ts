import { readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { imageMetadata } from 'astro/assets/utils';
import { parse, TEXT_NODE, type ElementNode, type Node } from 'ultrahtml';
import { querySelectorAll } from 'ultrahtml/selector';
import { describe, expect, test } from 'vitest';
import { supportedLanguages } from '../src/lib/i18n/constants';
import { toProfileLinkAddress } from '../src/lib/portfolio-content/profile-links';

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

const elementsOf = (html: string, selector: string) => querySelectorAll(parse(html), selector) as ElementNode[];
const textContentOf = (node: Node): string =>
  node.type === TEXT_NODE ? node.value : (node.children ?? []).map(textContentOf).join('');
const relTokens = (element: ElementNode) => (element.attributes.rel ?? '').toLowerCase().split(/\s+/);
const isThirdParty = (url: string) => /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(url.trim());
const isJavaScriptType = (type: string) =>
  ['', 'module'].includes(type.trim().toLowerCase()) || /(?:java|ecma)script/i.test(type);
const textOf = (html: string, selector: string) => elementsOf(html, selector).map((element) => textContentOf(element).trim());
const scriptEnabledTextOf = (node: Node): string =>
  node.type === TEXT_NODE
    ? node.value
    : ['script', 'style', 'noscript', 'template'].includes(node.name)
      ? ''
      : (node.children ?? []).map(scriptEnabledTextOf).join('');
const metaContent = (html: string, name: string) => elementsOf(html, `meta[name="${name}"]`)[0]?.attributes.content;
const anchors = (html: string) => elementsOf(html, 'a');
const toWords = (text: string) => text.trim().split(/\s+/u);
const portfolioContentOf = (language: string) =>
  JSON.parse(readFileSync(new URL(`../src/content/portfolio/${language}.json`, import.meta.url), 'utf8'));
const decorativeMarkSelectors = { linkedin: 'img', github: '[aria-hidden="true"] svg' };
const profileLinks: { id: keyof typeof decorativeMarkSelectors; name: string; url: string }[] = JSON.parse(
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
  ...elementsOf(html, 'script').filter(
    ({ attributes }) => isJavaScriptType(attributes.type ?? '') && !isThirdParty(attributes.src ?? ''),
  ),
  ...elementsOf(html, 'link').filter(
    (link) => relTokens(link).includes('modulepreload') && !isThirdParty(link.attributes.href ?? ''),
  ),
].map(({ attributes }) => attributes);

const deliveredCss = (html: string, pagePath: string) => {
  const inlineStyles = elementsOf(html, 'style').map(textContentOf);
  const linkedStylesheets = elementsOf(html, 'link')
    .filter((link) => relTokens(link).includes('stylesheet'))
    .map((link) => link.attributes.href ?? '')
    .filter((href) => href !== '' && !isThirdParty(href))
    .map((href) => readBuildOutput(buildOutputPathOf(href, pagePath)));
  return [...inlineStyles, ...linkedStylesheets].join('\n');
};

describe('entry page /', () => {
  const html = readBuildOutput('index.html');

  test('is titled with the Latin-script name alone', () => {
    expect(textOf(html, 'title')).toEqual(['Chad Grover']);
  });

  test('shows no text while its script chooses a language', () => {
    expect(scriptEnabledTextOf(elementsOf(html, 'body')[0]).trim()).toBe('');
  });

  test('links visitors without JavaScript to the English home page', () => {
    expect(elementsOf(html, 'noscript a').map((anchor) => anchor.attributes.href)).toContain('/en/');
  });
});

describe.each(supportedLanguages)('localized home page /%s/', (language) => {
  const html = readBuildOutput(`${language}/index.html`);

  test('declares its page language', () => {
    expect(elementsOf(html, 'html')[0]?.attributes.lang).toBe(language);
  });

  test('loads no first-party JavaScript', () => {
    expect(firstPartyJavaScript(html)).toEqual([]);
  });

  test('is titled with the Latin-script name alone', () => {
    expect(textOf(html, 'title')).toEqual(['Chad Grover']);
  });

  test('shows the name from its portfolio content', () => {
    expect(textOf(html, 'h1').map(toWords)).toEqual([toWords(portfolioContentOf(language).home.hero.displayName)]);
  });

  test('shows the role from its portfolio content', () => {
    expect(textOf(html, '.role')[0]).toContain(portfolioContentOf(language).home.hero.role);
  });

  test('describes itself with its introduction', () => {
    expect(metaContent(html, 'description')).toBe(portfolioContentOf(language).home.hero.introduction);
  });

  test('has a language switch that marks the current language', () => {
    const languageSwitch = elementsOf(html, 'nav a');
    expect(languageSwitch.map((anchor) => anchor.attributes.href)).toEqual(supportedLanguages.map((destination) => `/${destination}/`));
    expect(
      languageSwitch
        .filter((anchor) => anchor.attributes['aria-current'] === 'page')
        .map((anchor) => [anchor.attributes.href, textContentOf(anchor)]),
    ).toEqual([[`/${language}/`, languageSwitchCurrentLabels[language]]]);
  });

  test('lists the profile links in their shared file order', () => {
    const profileLinkUrls = profileLinks.map(({ url }) => url);
    expect(anchors(html).map((anchor) => anchor.attributes.href).filter((href) => profileLinkUrls.includes(href ?? ''))).toEqual(profileLinkUrls);
  });

  test.each(profileLinks)('shows the $name profile link as its official mark alone', ({ id, url }) => {
    const link = anchors(html).find((anchor) => anchor.attributes.href === url);
    expect(link && textContentOf(link).trim()).toBe('');
    expect(link && querySelectorAll(link, decorativeMarkSelectors[id])).toHaveLength(1);
    expect(link && (querySelectorAll(link, 'img') as ElementNode[]).filter((image) => image.attributes.alt !== '')).toEqual([]);
  });

  test.each(profileLinks)('gives the $name profile link its address to print in place of the mark', ({ url }) => {
    const link = anchors(html).find((anchor) => anchor.attributes.href === url);
    expect(link?.attributes['data-printed-address']).toBe(toProfileLinkAddress(url));
  });

  test.each(profileLinks)('links to the $name profile with a localized accessible name', ({ name, url }) => {
    const link = anchors(html).find((anchor) => anchor.attributes.href === url);
    expect(link?.attributes['aria-label']).toBe(profileLinkLabels[language][name as keyof (typeof profileLinkLabels)['en']]);
  });
});

describe('Japanese home page /ja/', () => {
  const html = readBuildOutput('ja/index.html');

  test('shows the name in katakana', () => {
    expect(textOf(html, 'h1').map(toWords)).toEqual([['グローヴァ', 'チャッド']]);
  });

  test('shows the Latin-script name from the English portfolio content', () => {
    expect(textOf(html, '.spine-name')).toEqual([portfolioContentOf('en').home.hero.displayName]);
  });
});

describe.each(buildOutputFiles.filter((path) => extname(path) === '.html'))('page %s', (path) => {
  test('carries no fictional placeholder notice', () => {
    expect(readBuildOutput(path)).not.toMatch(/fictional/i);
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
    const homeLinks = anchors(readBuildOutput('404.html')).filter((anchor) => anchor.attributes.href === href);
    expect(homeLinks.map((anchor) => textContentOf(anchor).trim())).toContain(label);
  });
});

describe('portfolio favicon', () => {
  test.each(['index.html', ...supportedLanguages.map((language) => `${language}/index.html`), '404.html'])(
    '%s links the SVG favicon and Apple touch icon',
    (path) => {
      const links = elementsOf(readBuildOutput(path), 'head link');
      const icon = links.find((link) => relTokens(link).includes('icon'));
      const touchIcon = links.find((link) => relTokens(link).includes('apple-touch-icon'));
      expect(icon?.attributes).toMatchObject({ href: '/favicon.svg', type: 'image/svg+xml' });
      expect(touchIcon?.attributes).toMatchObject({ href: '/apple-touch-icon.png', sizes: '180x180' });
    },
  );

  test.each([
    ['favicon.ico', { format: 'ico' }],
    ['favicon.svg', { format: 'svg' }],
    ['apple-touch-icon.png', { format: 'png', width: 180, height: 180 }],
  ] as const)('%s is served at the root in its declared format', async (path, metadata) => {
    await expect(imageMetadata(readBuildOutputBytes(path))).resolves.toMatchObject(metadata);
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
