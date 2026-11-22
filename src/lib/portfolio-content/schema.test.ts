import { describe, expect, test } from 'vitest';
import { portfolioContentSchema, profileLinkSchema } from './schema';

describe('portfolioContentSchema', () => {
  const hero = { displayName: 'Example Developer', role: 'Fictional developer', introduction: 'A fictional introduction.' };
  const profileLinks = [{ profileLink: 'example', purpose: 'Get in touch' }];
  const requiredHeroFields = ['displayName', 'role', 'introduction'] as const;
  const requiredProfileLinkFields = ['profileLink', 'purpose'] as const;
  const invalidTextValues = [
    ['missing', undefined],
    ['empty', ''],
    ['whitespace-only', '   '],
    ['a number', 42],
    ['null', null],
  ] as const;

  test('accepts complete portfolio content', () => {
    expect(portfolioContentSchema.safeParse({ home: { hero, profileLinks } }).success).toBe(true);
  });

  test('accepts Japanese portfolio content', () => {
    const japaneseHero = { displayName: '架空の開発者', role: '架空の役職', introduction: 'これは架空の紹介です。' };
    const japaneseProfileLinks = [{ profileLink: 'example', purpose: '連絡する' }];
    expect(portfolioContentSchema.safeParse({ home: { hero: japaneseHero, profileLinks: japaneseProfileLinks } }).success).toBe(true);
  });

  describe.each(requiredHeroFields)('%s', (field) => {
    test.each(invalidTextValues)('rejects a value that is %s', (_, value) => {
      const result = portfolioContentSchema.safeParse({ home: { hero: { ...hero, [field]: value }, profileLinks } });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toEqual(['home', 'hero', field]);
    });
  });

  test('rejects content without profile links', () => {
    const result = portfolioContentSchema.safeParse({ home: { hero, profileLinks: [] } });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['home', 'profileLinks']);
  });

  test('rejects a profile link listed twice', () => {
    const repeated = [...profileLinks, { profileLink: 'example', purpose: 'Source code' }];
    const result = portfolioContentSchema.safeParse({ home: { hero, profileLinks: repeated } });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['home', 'profileLinks', 1, 'profileLink']);
  });

  describe.each(requiredProfileLinkFields)('profile link %s', (field) => {
    test.each(invalidTextValues)('rejects a value that is %s', (_, value) => {
      const result = portfolioContentSchema.safeParse({ home: { hero, profileLinks: [{ ...profileLinks[0], [field]: value }] } });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toEqual(['home', 'profileLinks', 0, field]);
    });
  });
});

describe('profileLinkSchema', () => {
  test('accepts a named HTTPS profile link', () => {
    expect(profileLinkSchema.safeParse({ name: 'GitHub', url: 'https://github.com/example' }).success).toBe(true);
  });

  test.each([
    ['plain HTTP', 'http://github.com/example'],
    ['not a URL', 'github.com/example'],
    ['a script URL', 'javascript:alert(1)'],
    ['carrying user info that hides its real host', 'https://github.com@example.com/'],
  ])('rejects a URL that is %s', (_, url) => {
    const result = profileLinkSchema.safeParse({ name: 'GitHub', url });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['url']);
  });

  test('rejects a profile link without a name', () => {
    expect(profileLinkSchema.safeParse({ name: ' ', url: 'https://github.com/example' }).success).toBe(false);
  });
});
