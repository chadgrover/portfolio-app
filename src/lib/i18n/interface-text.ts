import type { Language } from './types';

export const languageNames = {
  en: 'English',
  ja: '日本語',
} as const satisfies Record<Language, string>;

interface InterfaceText {
  languageSwitchLabel: string;
  profileLinkLabel: (parts: { profileLink: string }) => string;
  homeLinkLabel: (parts: { languageName: string }) => string;
  pageNames: { notFound: string };
  notFoundExplanation: string;
}

export const interfaceText = {
  en: {
    languageSwitchLabel: 'Language',
    profileLinkLabel: ({ profileLink }) => `${profileLink} profile`,
    homeLinkLabel: ({ languageName }) => `${languageName} Home`,
    pageNames: { notFound: 'Page not found' },
    notFoundExplanation: 'The requested page could not be found.',
  },
  ja: {
    languageSwitchLabel: '言語',
    profileLinkLabel: ({ profileLink }) => `${profileLink}のプロフィール`,
    homeLinkLabel: ({ languageName }) => `${languageName}のホーム`,
    pageNames: { notFound: 'ページが見つかりません' },
    notFoundExplanation: 'お探しのページは見つかりませんでした。',
  },
} as const satisfies Record<Language, InterfaceText>;
