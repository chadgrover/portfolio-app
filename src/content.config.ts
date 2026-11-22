import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { supportedLanguages } from './lib/i18n/constants';
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

const profileLinks = defineCollection({
  loader: file('./src/content/portfolio/profile-links.json'),
  schema: profileLinkSchema,
});

export const collections = { portfolio, profileLinks };
