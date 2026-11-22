import { readFile } from 'node:fs/promises';
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { supportedLanguages } from './lib/i18n/constants';
import { parseProfileLinks, profileLinksPath } from './lib/portfolio-content/profile-links';
import { portfolioContentSchema, profileLinkSchema } from './lib/portfolio-content/schema';

const portfolioFiles = glob({
  pattern: supportedLanguages.map((language) => `${language}.json`),
  base: './src/content/portfolio',
});

const portfolio = defineCollection({
  loader: {
    name: 'portfolio',
    async load(context) {
      await portfolioFiles.load(context);
      const missing = supportedLanguages.filter((language) => !context.store.has(language));
      if (missing.length > 0) {
        throw new Error(`Missing portfolio content: ${missing.map((language) => `src/content/portfolio/${language}.json`).join(', ')}`);
      }
    },
  },
  schema: portfolioContentSchema,
});

const profileLinksFile = file(profileLinksPath);

const profileLinks = defineCollection({
  loader: {
    name: 'profileLinks',
    async load(context) {
      parseProfileLinks(await readFile(profileLinksPath, 'utf8'));
      await profileLinksFile.load(context);
    },
  },
  schema: profileLinkSchema,
});

export const collections = { portfolio, profileLinks };
