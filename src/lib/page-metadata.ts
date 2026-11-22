import type { Language } from './i18n/types';
import { portfolioContentFor } from './portfolio-content/entries';

export interface PageMetadata {
  title: string;
  description?: string;
}

const latinScriptName = async () => (await portfolioContentFor('en')).home.hero.displayName;

export const homePageMetadata = async (language: Language): Promise<PageMetadata> => ({
  title: await latinScriptName(),
  description: (await portfolioContentFor(language)).home.hero.introduction,
});

export const pageMetadata = async (pageName: string): Promise<PageMetadata> => ({
  title: `${pageName} | ${await latinScriptName()}`,
});
