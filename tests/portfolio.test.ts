import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, test, vi } from 'vitest';
import { loadPortfolio } from '../src/lib/portfolio';

const directories: string[] = [];
const english = { displayName: 'Example Developer', role: 'Fictional developer', introduction: 'A fictional introduction.' };
const japanese = { displayName: '架空の開発者', role: '架空の役職', introduction: 'これは架空の紹介です。' };

async function publishedDirectory() {
  const directory = await mkdtemp(join(tmpdir(), 'portfolio-test-'));
  directories.push(directory);
  await writeFile(join(directory, 'en.json'), JSON.stringify(english));
  await writeFile(join(directory, 'ja.json'), JSON.stringify(japanese));
  return directory;
}

afterEach(async () => {
  vi.unstubAllEnvs();
  await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

test('loads independently authored published content for both configured languages', async () => {
  vi.stubEnv('PORTFOLIO_CONTENT_DIR', await publishedDirectory());
  expect(await loadPortfolio()).toEqual({ en: english, ja: japanese });
});

test.each(['displayName', 'role', 'introduction'] as const)('rejects invalid required %s values without exposing content', async (field) => {
  const directory = await publishedDirectory();
  vi.stubEnv('PORTFOLIO_CONTENT_DIR', directory);
  for (const value of [undefined, '', '   ', 42, null]) {
    await writeFile(join(directory, 'en.json'), JSON.stringify({ ...english, [field]: value }));
    await expect(loadPortfolio()).rejects.toThrow(new RegExp(`en.json.*${field}`));
  }
});

test('rejects a missing configured language instead of using fixtures', async () => {
  const directory = await publishedDirectory();
  await rm(join(directory, 'ja.json'));
  vi.stubEnv('PORTFOLIO_CONTENT_DIR', directory);
  await expect(loadPortfolio()).rejects.toThrow(/ja.json/);
});

test('rejects malformed explicit input without printing its value or using fixtures', async () => {
  const directory = await publishedDirectory();
  await writeFile(join(directory, 'en.json'), 'PRIVATE_DRAFT_VALUE');
  vi.stubEnv('PORTFOLIO_CONTENT_DIR', directory);
  await expect(loadPortfolio()).rejects.toThrow('Cannot read portfolio content in en.json');
});

test('rejects an explicitly selected missing directory without fixture fallback', async () => {
  const directory = await publishedDirectory();
  vi.stubEnv('PORTFOLIO_CONTENT_DIR', join(directory, 'missing'));
  await expect(loadPortfolio()).rejects.toThrow(/Cannot read portfolio content in (en|ja).json/);
});

test('an explicitly empty directory setting does not select fixtures', async () => {
  vi.stubEnv('PORTFOLIO_CONTENT_DIR', '');
  await expect(loadPortfolio()).rejects.toThrow(/Cannot read portfolio content/);
});

test('ignores drafts and unregistered language files', async () => {
  const directory = await publishedDirectory();
  await writeFile(join(directory, 'drafts.json'), 'invalid draft');
  await writeFile(join(directory, 'fr.json'), 'invalid unregistered language');
  vi.stubEnv('PORTFOLIO_CONTENT_DIR', directory);
  expect(await loadPortfolio()).toEqual({ en: english, ja: japanese });
});

test('uses committed fictional fixtures only when the directory setting is unset', async () => {
  vi.stubEnv('PORTFOLIO_CONTENT_DIR', undefined);
  expect((await loadPortfolio()).en.displayName).toBe('Example Developer');
});
