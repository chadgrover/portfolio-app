import { supportedLanguages } from './i18n/constants';
import type { Language } from './i18n/types';

export type LanguageLinkPaths = Record<Language | 'x-default', string>;

export interface PageMetadata {
  title: string;
  description?: string;
  canonicalPath?: string;
  languageLinkPaths?: LanguageLinkPaths;
}

const languageLinkPaths: LanguageLinkPaths = {
  ...(Object.fromEntries(supportedLanguages.map((language) => [language, `/${language}/`])) as Record<Language, string>),
  'x-default': '/',
};

export const createHomePageMetadata = (language: Language, latinScriptName: string, introduction: string): PageMetadata => ({
  title: latinScriptName,
  description: introduction,
  canonicalPath: languageLinkPaths[language],
  languageLinkPaths,
});

export const createPageMetadata = (pageName: string, latinScriptName: string): PageMetadata => ({
  title: `${pageName} | ${latinScriptName}`,
});

export const createEntryPageMetadata = (latinScriptName: string): PageMetadata => ({
  title: latinScriptName,
  canonicalPath: languageLinkPaths['x-default'],
  languageLinkPaths,
});
