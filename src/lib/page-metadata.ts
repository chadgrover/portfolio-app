import { supportedLanguages } from './i18n/constants';
import type { Language } from './i18n/types';
import { getLatinScriptName, portfolioContentFor } from './portfolio-content/entries';

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

export const createHomePageMetadata = async (language: Language): Promise<PageMetadata> => ({
  title: await getLatinScriptName(),
  description: (await portfolioContentFor(language)).homePage.introduction,
  canonicalPath: languageLinkPaths[language],
  languageLinkPaths,
});

export const createPageMetadata = async (pageName: string): Promise<PageMetadata> => ({
  title: `${pageName} | ${await getLatinScriptName()}`,
});

export const createEntryPageMetadata = async (): Promise<PageMetadata> => ({
  title: await getLatinScriptName(),
  canonicalPath: languageLinkPaths['x-default'],
  languageLinkPaths,
});
