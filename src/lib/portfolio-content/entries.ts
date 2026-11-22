import { getEntry } from 'astro:content';
import type { Language } from '../i18n/types';
import { profileLinksPath } from './profile-links';
import type { PortfolioContent } from './types';

export const portfolioContentFor = async (language: Language) => {
  const entry = await getEntry('portfolio', language);
  if (!entry) throw new Error(`Missing portfolio content: src/content/portfolio/${language}.json`);
  return entry.data;
};

const profileLinkFor = async (id: string) => {
  const entry = await getEntry('profileLinks', id);
  if (!entry) throw new Error(`Unknown profile link "${id}": add it to ${profileLinksPath}`);
  return entry.data;
};

export const profileLinksFor = (content: PortfolioContent) =>
  Promise.all(content.home.profileLinks.map(async ({ profileLink, purpose }) =>
    ({ ...(await profileLinkFor(profileLink)), purpose })));
