import { readFileSync, readdirSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { supportedLanguages } from '../src/lib/i18n/constants';
import { compressedSize, listBuildOutputFiles, readBuildOutput, readBuildOutputBytes } from './support/build-output';
import { readPortfolioContent, readProfileLinks } from './support/content';
import { distinctiveContractPhrases, surfaceBriefDirectory, withoutMarkdownMarks } from './support/direction-contract';
import { firstPartyJavaScript, loadBuildOutputPage, visibleText } from './support/html';
import { coversJapanese, deliveredCss, fontFaces } from './support/styles';

const bytesPerKilobyte = 1000;
const cssBudgetBytes = 20_000;
const webFontBudgetBytes = 60_000;
const webFontExtensions = ['.woff2', '.woff', '.ttf', '.otf'];

const inKilobytes = (bytes: number) => `${bytes / bytesPerKilobyte} KB`;

const buildOutputFiles = listBuildOutputFiles();

describe.each(supportedLanguages)('localized home page /%s/', (language) => {
  const $ = loadBuildOutputPage(`${language}/index.html`);

  test('declares its page language', () => {
    expect($('html').attr('lang')).toBe(language);
  });

  test('loads no first-party JavaScript', () => {
    expect(firstPartyJavaScript($)).toEqual([]);
  });

  const { home, profileLinkLabels } = readPortfolioContent(language);

  test('shows the display name as its heading', () => {
    expect(
      $('h1')
        .toArray()
        .map((heading) => $(heading).text().trim()),
    ).toEqual([home.hero.displayName]);
  });

  test('titles itself with the display name and role', () => {
    expect(
      $('title')
        .toArray()
        .map((title) => $(title).text().trim()),
    ).toEqual([`${home.hero.displayName} | ${home.hero.role}`]);
  });

  test('offers a language switch that marks only the current language', () => {
    const switchAnchors = $('nav a')
      .toArray()
      .map((anchor) => [$(anchor).attr('href'), $(anchor).attr('aria-current')])
      .filter(([href]) => supportedLanguages.some((destination) => href === `/${destination}/`));
    expect(switchAnchors).toEqual(
      supportedLanguages.map((destination) => [`/${destination}/`, destination === language ? 'page' : undefined]),
    );
  });

  test('describes itself with its meta description', () => {
    const descriptions = $('meta[name="description"]')
      .toArray()
      .map((meta) => $(meta).attr('content'));
    expect(descriptions).toEqual([home.metaDescription]);
  });

  test('shows the role', () => {
    expect(visibleText($)).toContain(home.hero.role);
  });

  test.each(readProfileLinks())('links to the $platform profile with a localized accessible name', ({ platform, url }) => {
    const accessibleNames = $('a')
      .toArray()
      .filter((anchor) => $(anchor).attr('href') === url)
      .map((anchor) => $(anchor).attr('aria-label'));
    expect(accessibleNames).toEqual([profileLinkLabels[platform].accessibleName]);
  });

  test('lists profile links in their content order', () => {
    const profileLinkUrls = new Set(readProfileLinks().map(({ url }) => url));
    const linkedUrls = $('a')
      .toArray()
      .map((anchor) => $(anchor).attr('href') ?? '')
      .filter((href) => profileLinkUrls.has(href));
    expect(linkedUrls).toEqual([...profileLinkUrls]);
  });

  test('carries no fictional portfolio notice', () => {
    expect(visibleText($)).not.toMatch(/fictional|架空/i);
  });
});

test('the Japanese home page shows the name in katakana', () => {
  const $ = loadBuildOutputPage('ja/index.html');
  expect(
    $('h1')
      .toArray()
      .map((heading) => $(heading).text().trim()),
  ).toEqual(['グローヴァ　チャッド']);
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
      expect(compressedSize(deliveredCss(loadBuildOutputPage(path), path))).toBeLessThanOrEqual(cssBudgetBytes);
    },
  );

  test(`compressed web fonts total ${inKilobytes(webFontBudgetBytes)} or less`, () => {
    const webFontBytes = buildOutputFiles
      .filter((path) => webFontExtensions.includes(extname(path)))
      .reduce((total, path) => total + compressedSize(readBuildOutputBytes(path)), 0);
    expect(webFontBytes).toBeLessThanOrEqual(webFontBudgetBytes);
  });

  test.each(buildOutputFiles.filter((path) => extname(path) === '.html'))(
    '%s declares only web fonts that leave Japanese text to system fonts',
    (path) => {
      const fontFacesReachingJapanese = fontFaces(deliveredCss(loadBuildOutputPage(path), path)).filter(
        ({ unicodeRanges }) => unicodeRanges.length === 0 || unicodeRanges.some(coversJapanese),
      );
      expect(fontFacesReachingJapanese).toEqual([]);
    },
  );

  test.each(buildOutputFiles.filter((path) => webFontExtensions.includes(extname(path))))(
    '%s is a web font declared for Latin text only',
    (fontPath) => {
      const declaringFontFaces = buildOutputFiles
        .filter((path) => extname(path) === '.html')
        .flatMap((path) => fontFaces(deliveredCss(loadBuildOutputPage(path), path)))
        .filter(({ sourceUrls }) => sourceUrls.some((url) => basename(url) === basename(fontPath)));
      expect(declaringFontFaces).not.toEqual([]);
      expect(declaringFontFaces.filter(({ unicodeRanges }) => unicodeRanges.some(coversJapanese))).toEqual([]);
    },
  );
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
