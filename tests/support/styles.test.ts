import * as cheerio from 'cheerio';
import { expect, test, vi } from 'vitest';
import { deliveredCss, fontFaces } from './styles';

vi.mock('./build-output', () => ({
  readBuildOutput: (path: string) => new Map([['_astro/page.css', 'body{margin:0}']]).get(path),
}));

test('deliveredCss joins inline style CSS with linked stylesheet CSS', () => {
  const $ = cheerio.load('<style>h1{color:red}</style><link rel="stylesheet" href="/_astro/page.css">');
  expect(deliveredCss($, 'en/index.html')).toBe('h1{color:red}\nbody{margin:0}');
});

test('fontFaces reads each font face source and its numeric unicode ranges, wildcards included', () => {
  const css =
    '@font-face{font-family:Sans;src:url(/_astro/sans.woff2) format("woff2");unicode-range:U+131,U+4??,U+2000-206F}';
  expect(fontFaces(css)).toEqual([
    {
      sourceUrls: ['/_astro/sans.woff2'],
      unicodeRanges: [
        { start: 0x131, end: 0x131 },
        { start: 0x400, end: 0x4ff },
        { start: 0x2000, end: 0x206f },
      ],
    },
  ]);
});
