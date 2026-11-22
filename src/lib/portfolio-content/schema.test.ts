import { describe, expect, test } from 'vitest';
import { portfolioContentSchema, profileLinkSchema } from './schema';

describe('portfolioContentSchema', () => {
  const hero = { displayName: 'Example Developer', role: 'Fictional developer', introduction: 'A fictional introduction.' };
  const requiredHeroFields = ['displayName', 'role', 'introduction'] as const;
  const invalidTextValues = [
    ['missing', undefined],
    ['empty', ''],
    ['whitespace-only', '   '],
    ['a number', 42],
    ['null', null],
  ] as const;

  test('accepts complete portfolio content', () => {
    expect(portfolioContentSchema.safeParse({ home: { hero } }).success).toBe(true);
  });

  test('accepts Japanese portfolio content', () => {
    const japaneseHero = { displayName: '架空の開発者', role: '架空の役職', introduction: 'これは架空の紹介です。' };
    expect(portfolioContentSchema.safeParse({ home: { hero: japaneseHero } }).success).toBe(true);
  });

  describe.each(requiredHeroFields)('%s', (field) => {
    test.each(invalidTextValues)('rejects a value that is %s', (_, value) => {
      const result = portfolioContentSchema.safeParse({ home: { hero: { ...hero, [field]: value } } });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toEqual(['home', 'hero', field]);
    });
  });
});

describe('profileLinkSchema', () => {
  const profileLink = { id: 'github', name: 'GitHub', url: 'https://github.com/example' };

  test.each(['linkedin', 'github'])('accepts a named HTTPS %s profile link', (id) => {
    expect(profileLinkSchema.safeParse({ ...profileLink, id }).success).toBe(true);
  });

  test('rejects a profile link for an unknown platform', () => {
    const result = profileLinkSchema.safeParse({ ...profileLink, id: 'mastodon' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['id']);
  });

  test.each([
    ['plain HTTP', 'http://github.com/example'],
    ['not a URL', 'github.com/example'],
    ['a script URL', 'javascript:alert(1)'],
    ['carrying user info that hides its real host', 'https://github.com@example.com/'],
  ])('rejects a URL that is %s', (_, url) => {
    const result = profileLinkSchema.safeParse({ ...profileLink, url });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['url']);
  });

  test('rejects a profile link without a name', () => {
    expect(profileLinkSchema.safeParse({ ...profileLink, name: ' ' }).success).toBe(false);
  });
});
