import type { Language } from './i18n/types';
import { getLatinScriptName, portfolioContentFor } from './portfolio-content/entries';

export interface PageMetadata {
  title: string;
  description?: string;
}

export const createHomePageMetadata = async (language: Language): Promise<PageMetadata> => ({
  title: await getLatinScriptName(),
  description: (await portfolioContentFor(language)).home.hero.introduction,
});

export const createPageMetadata = async (pageName: string): Promise<PageMetadata> => ({
  title: `${pageName} | ${await getLatinScriptName()}`,
});

export const createEntryPageMetadata = async (): Promise<PageMetadata> => ({ title: await getLatinScriptName() });
