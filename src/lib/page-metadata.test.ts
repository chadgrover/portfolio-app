import { describe, expect, test } from 'vitest';
import { createEntryPageMetadata, createHomePageMetadata, createPageMetadata } from './page-metadata';

const latinScriptName = 'John Smith';
const languageLinkPaths = { en: '/en/', ja: '/ja/', 'x-default': '/' };

describe('createHomePageMetadata', () => {
  test.each([
    ['en', 'An introduction.', '/en/'],
    ['ja', '自己紹介です。', '/ja/'],
  ] as const)('titles the %s home page with the Latin-script name and describes it with its introduction', (language, introduction, canonicalPath) => {
    expect(createHomePageMetadata(language, latinScriptName, introduction)).toEqual({
      title: 'John Smith',
      description: introduction,
      canonicalPath,
      languageLinkPaths,
    });
  });
});

describe('createPageMetadata', () => {
  test('titles a page with its page name, then the Latin-script name', () => {
    expect(createPageMetadata('Page not found', latinScriptName)).toEqual({ title: 'Page not found | John Smith' });
  });
});

describe('createEntryPageMetadata', () => {
  test('titles the entry page with the Latin-script name and points it at the language set', () => {
    expect(createEntryPageMetadata(latinScriptName)).toEqual({ title: 'John Smith', canonicalPath: '/', languageLinkPaths });
  });
});
