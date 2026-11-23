import { describe, expect, test } from 'vitest';
import { createHomePage } from './home-page';
import type { PortfolioContent } from './portfolio-content/schema';

const englishRole = 'Software Engineer';

const englishContent: PortfolioContent = {
  homePage: { displayName: 'John Smith', role: englishRole, introduction: 'An introduction.' },
  latinScriptName: 'John Smith',
  profileLinks: [
    { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/in/example/' },
    { id: 'github', name: 'GitHub', url: 'https://github.com/example' },
  ],
};

const japaneseContent: PortfolioContent = {
  ...englishContent,
  homePage: { displayName: '山田　太郎', role: 'ソフトウェアエンジニア', introduction: '自己紹介です。' },
};

const createContentWithDisplayName = (displayName: string): PortfolioContent => ({
  ...englishContent,
  homePage: { ...englishContent.homePage, displayName },
});

describe('createHomePage', () => {
  test.each([
    ['one word', 'Smith', ['Smith'], 5],
    ['two words', 'John Smith', ['John', 'Smith'], 5],
    ['three words', 'John Q Smith', ['John', 'Q', 'Smith'], 5],
    ['two words of different lengths', 'Jo Smithson', ['Jo', 'Smithson'], 8],
  ])('shows a display name of %s one word per line, sized to its longest line', (_, displayName, nameLines, nameColumns) => {
    const homePage = createHomePage('en', createContentWithDisplayName(displayName), englishRole);
    expect(homePage.nameLines).toEqual(nameLines);
    expect(homePage.nameColumns).toBe(nameColumns);
  });

  test('breaks a Japanese display name at its full-width space', () => {
    const homePage = createHomePage('ja', japaneseContent, englishRole);
    expect(homePage.nameLines).toEqual(['山田', '太郎']);
    expect(homePage.nameColumns).toBe(2);
  });

  test('shows the role and introduction from the page language', () => {
    const homePage = createHomePage('ja', japaneseContent, englishRole);
    expect(homePage.role).toBe('ソフトウェアエンジニア');
    expect(homePage.introduction).toBe('自己紹介です。');
  });

  test('shows the English role and the Latin-script name on the Japanese home page', () => {
    const homePage = createHomePage('ja', japaneseContent, englishRole);
    expect(homePage.englishRole).toBe('Software Engineer');
    expect(homePage.latinScriptName).toBe('John Smith');
  });

  test('shows no second English role and no Latin-script name on the English home page', () => {
    const homePage = createHomePage('en', englishContent, englishRole);
    expect(homePage.englishRole).toBeUndefined();
    expect(homePage.latinScriptName).toBeUndefined();
  });

  test('lists the profile links in the given order, named and addressed for the English home page', () => {
    expect(createHomePage('en', englishContent, englishRole).profileLinks).toEqual([
      { id: 'linkedin', url: 'https://www.linkedin.com/in/example/', accessibleName: 'LinkedIn profile', printedAddress: 'linkedin.com/in/example' },
      { id: 'github', url: 'https://github.com/example', accessibleName: 'GitHub profile', printedAddress: 'github.com/example' },
    ]);
  });

  test('names the profile links in Japanese on the Japanese home page', () => {
    const homePage = createHomePage('ja', japaneseContent, englishRole);
    expect(homePage.profileLinks.map(({ accessibleName }) => accessibleName)).toEqual(['LinkedInのプロフィール', 'GitHubのプロフィール']);
  });

  test('keeps the profile links in the given order when it is reversed', () => {
    const reversed = { ...englishContent, profileLinks: [...englishContent.profileLinks].reverse() };
    expect(createHomePage('en', reversed, englishRole).profileLinks.map(({ id }) => id)).toEqual(['github', 'linkedin']);
  });

  test('lists no profile links when the portfolio has none', () => {
    expect(createHomePage('en', { ...englishContent, profileLinks: [] }, englishRole).profileLinks).toEqual([]);
  });
});
