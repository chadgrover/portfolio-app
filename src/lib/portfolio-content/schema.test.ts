import { describe, expect, test } from 'vitest';
import { portfolioContentSchema } from './schema';

describe('portfolioContentSchema', () => {
  const hero = { displayName: 'Chad Grover', displayNameLines: ['Chad', 'Grover'], role: 'Full-Stack Developer', rolePhrases: ['Full-Stack', 'Developer'] };
  const profileLinkLabels = {
    linkedin: { name: 'LinkedIn', accessibleName: 'LinkedIn profile' },
    github: { name: 'GitHub', accessibleName: 'GitHub profile' },
  };
  const metaDescription = 'Chad Grover, full-stack developer.';
  const content = { home: { metaDescription, hero }, profileLinkLabels };
  const withHero = (overrides: Record<string, unknown>) => ({
    ...content,
    home: { metaDescription, hero: { ...hero, ...overrides } },
  });
  const requiredHeroFields = ['displayName', 'role'] as const;

  test('accepts complete portfolio content', () => {
    expect(portfolioContentSchema.safeParse(content).success).toBe(true);
  });

  test('accepts Japanese portfolio content', () => {
    const japaneseContent = {
      home: {
        metaDescription: 'フルスタックエンジニア、グローヴァ　チャッド。',
        hero: { displayName: 'グローヴァ　チャッド', displayNameLines: ['グローヴァ', 'チャッド'], role: 'フルスタックエンジニア', rolePhrases: ['フルスタック', 'エンジニア'] },
      },
      profileLinkLabels: {
        linkedin: { name: 'LinkedIn', accessibleName: 'LinkedInプロフィール' },
        github: { name: 'GitHub', accessibleName: 'GitHubプロフィール' },
      },
    };
    expect(portfolioContentSchema.safeParse(japaneseContent).success).toBe(true);
  });

  test('rejects content missing a platform label', () => {
    const result = portfolioContentSchema.safeParse({ ...content, profileLinkLabels: { linkedin: profileLinkLabels.linkedin } });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['profileLinkLabels', 'github']);
  });

  test.each(['name', 'accessibleName'])('rejects a blank label %s', (field) => {
    const result = portfolioContentSchema.safeParse({
      ...content,
      profileLinkLabels: { ...profileLinkLabels, github: { ...profileLinkLabels.github, [field]: ' ' } },
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['profileLinkLabels', 'github', field]);
  });

  describe.each(requiredHeroFields)('%s', (field) => {
    test.each([
      ['missing', undefined],
      ['empty', ''],
      ['whitespace-only', '   '],
      ['a number', 42],
      ['null', null],
    ])('rejects a value that is %s', (_, value) => {
      const result = portfolioContentSchema.safeParse(withHero({ [field]: value }));
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toEqual(['home', 'hero', field]);
    });
  });

  test.each([
    ['missing', undefined],
    ['whitespace-only', '  '],
  ])('rejects a meta description that is %s', (_, value) => {
    const result = portfolioContentSchema.safeParse({ ...content, home: { ...content.home, metaDescription: value } });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['home', 'metaDescription']);
  });

  describe('rolePhrases', () => {
    test.each([
      ['missing', undefined],
      ['empty', []],
      ['holding a blank phrase', ['Full-Stack', ' ']],
      ['spelling a different role', ['Full-Stack', 'Engineer']],
      ['out of order', ['Developer', 'Full-Stack']],
    ])('rejects phrases that are %s', (_, value) => {
      const result = portfolioContentSchema.safeParse(withHero({ rolePhrases: value }));
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path.slice(0, 3)).toEqual(['home', 'hero', 'rolePhrases']);
    });
  });

  describe('displayNameLines', () => {
    test.each([
      ['missing', undefined],
      ['empty', []],
      ['a string', 'Chad Grover'],
      ['holding a blank line', ['Chad', ' ']],
      ['spelling a different name', ['Chad', 'Grove']],
      ['out of order', ['Grover', 'Chad']],
    ])('rejects lines that are %s', (_, value) => {
      const result = portfolioContentSchema.safeParse(withHero({ displayNameLines: value }));
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path.slice(0, 3)).toEqual(['home', 'hero', 'displayNameLines']);
    });
  });
});
