import { readFile } from 'node:fs/promises';
import { getCollection, getEntry } from 'astro:content';
import type { Language } from '../i18n/types';
import { parseProfileLinks, profileLinksPath } from './profile-links';

export const portfolioContentFor = async (language: Language) => {
  const entry = await getEntry('portfolio', language);
  if (!entry) throw new Error(`Missing portfolio content: src/content/portfolio/${language}.json`);
  return entry.data;
};

export const getLatinScriptName = async () => (await portfolioContentFor('en')).home.hero.displayName;

export const getProfileLinks = async () => {
  const fileOrder = parseProfileLinks(await readFile(profileLinksPath, 'utf8')).map(({ id }) => id);
  return (await getCollection('profileLinks'))
    .sort((first, second) => fileOrder.indexOf(first.data.id) - fileOrder.indexOf(second.data.id))
    .map(({ data }) => data);
};
