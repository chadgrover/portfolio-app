import { readBuildOutput } from './build-output';
import { attributes, isThirdParty, relTokens, tags } from './html';

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
export const fontFaceRules = (css: string) => css.match(/@font-face\s*{[^}]*}/gi) ?? [];
export const unicodeRangesOf = (fontFace: string) =>
  (fontFace.match(/unicode-range\s*:\s*([^;}]+)/i)?.[1] ?? '')
    .split(',')
    .map((range) => range.trim())
    .filter((range) => range !== '')
    .map((range) => {
      const [start, end = start] = range.replace(/^u\+/i, '').split('-');
      return [parseInt(start.replace(/\?/g, '0'), 16), parseInt(end.replace(/\?/g, 'f'), 16)];
    });
export const coversJapanese = ([start, end]: number[]) =>
  japaneseCodePoints.some(([japaneseStart, japaneseEnd]) => start <= japaneseEnd && end >= japaneseStart);

export const deliveredCss = (html: string, pagePath: string) => {
  const inlineStyles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1]);
  const linkedStylesheets = tags(html, 'link')
    .filter((tag) => relTokens(tag).includes('stylesheet'))
    .map((tag) => attributes(tag).get('href') ?? '')
    .filter((href) => href !== '' && !isThirdParty(href))
    .map((href) => readBuildOutput(buildOutputPathOf(href, pagePath)));
  return [...inlineStyles, ...linkedStylesheets].join('\n');
};
