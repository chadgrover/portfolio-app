import { readFileSync } from 'node:fs';
import { parse } from 'jsonc-parser';
import { expect, test } from 'vitest';

const hostConfig = parse(readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8'));

test('keeps the live site off workers.dev, where search engines would index it', () => {
  expect(hostConfig.workers_dev).toBe(false);
});

test('keeps previews on workers.dev, which tells search engines not to index them', () => {
  expect(hostConfig.preview_urls).toBe(true);
});
