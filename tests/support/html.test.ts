import * as cheerio from 'cheerio';
import { expect, test } from 'vitest';
import { firstPartyJavaScript, visibleText } from './html';

test('visibleText returns paragraph text and leaves out title, script and style text', () => {
  const $ = cheerio.load(
    '<title>Tab</title><style>p { color: red }</style><p>Hello</p><script>const greeting = 1;</script>',
  );
  expect(visibleText($)).toBe('Hello');
});

test('firstPartyJavaScript finds a local script and ignores a third-party one', () => {
  const $ = cheerio.load('<script src="/_astro/page.js"></script><script src="https://cdn.example/widget.js"></script>');
  expect(firstPartyJavaScript($)).toEqual(['<script src="/_astro/page.js"></script>']);
});
