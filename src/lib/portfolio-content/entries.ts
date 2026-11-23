import { getEntry } from 'astro:content';
import type { Language } from '../i18n/types';
import type { PortfolioContent } from './schema';

const getPortfolioEntry = async (language: Language) => {
  const entry = await getEntry('portfolio', language);
  if (!entry) throw new Error(`Missing portfolio content: src/content/portfolio/${language}.json`);
  return entry.data;
};

const getProfileLinks = async () => {
  const entry = await getEntry('profileLinks', 'profileLinks');
  if (!entry) throw new Error('Missing profile links');
  return entry.data.profileLinks;
};

export const getPortfolioContent = async (language: Language): Promise<PortfolioContent> => ({
  homePage: (await getPortfolioEntry(language)).homePage,
  latinScriptName: (await getPortfolioEntry('en')).homePage.displayName,
  profileLinks: await getProfileLinks(),
});
