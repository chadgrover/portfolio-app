import { getEntry } from 'astro:content';
import type { Language } from '../i18n/types';

export const portfolioContentFor = async (language: Language) => {
  const entry = await getEntry('portfolio', language);
  if (!entry) throw new Error(`Missing portfolio content: src/content/portfolio/${language}.json`);
  return entry.data;
};

export const getLatinScriptName = async () => (await portfolioContentFor('en')).home.hero.displayName;

export const getProfileLinks = async () => {
  const entry = await getEntry('profileLinks', 'profileLinks');
  if (!entry) throw new Error('Missing profile links: src/content/portfolio/profile-links.json');
  return entry.data.profileLinks;
};
