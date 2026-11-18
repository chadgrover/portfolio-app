import type { CheerioAPI } from 'cheerio';
import { transform, type UnicodeRange } from 'lightningcss';
import { readBuildOutput } from './build-output';
import { isThirdParty } from './html';

const siteOrigin = 'https://site.invalid/';

const buildOutputPathOf = (href: string, pagePath: string) =>
  decodeURIComponent(new URL(href, new URL(pagePath, siteOrigin)).pathname.slice(1));

const japaneseCodePoints = [
  [0x3000, 0x30ff],
  [0x3400, 0x4dbf],
  [0x4e00, 0x9fff],
  [0xf900, 0xfaff],
  [0xff00, 0xffef],
];
export const fontFaces = (css: string) => {
  const declaredFontFaces: { sourceUrls: string[]; unicodeRanges: UnicodeRange[] }[] = [];
  transform({
    filename: 'delivered.css',
    code: Buffer.from(css),
    visitor: {
      Rule: {
        'font-face': ({ value: { properties } }) => {
          declaredFontFaces.push({
            sourceUrls: properties.flatMap((property) =>
              property.type === 'source'
                ? property.value.flatMap((source) => (source.type === 'url' ? [source.value.url.url] : []))
                : [],
            ),
            unicodeRanges: properties.flatMap((property) => (property.type === 'unicode-range' ? property.value : [])),
          });
        },
      },
    },
  });
  return declaredFontFaces;
};
export const coversJapanese = ({ start, end }: UnicodeRange) =>
  japaneseCodePoints.some(([japaneseStart, japaneseEnd]) => start <= japaneseEnd && end >= japaneseStart);

export const deliveredCss = ($: CheerioAPI, pagePath: string) => {
  const inlineStyles = $('style')
    .toArray()
    .map((style) => $(style).text());
  const linkedStylesheets = $('link[rel~="stylesheet" i]')
    .toArray()
    .map((link) => $(link).attr('href') ?? '')
    .filter((href) => href !== '' && !isThirdParty(href))
    .map((href) => readBuildOutput(buildOutputPathOf(href, pagePath)));
  return [...inlineStyles, ...linkedStylesheets].join('\n');
};
