import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { supportedLanguages } from './lib/i18n/constants';
import { portfolioContentSchema } from './lib/portfolio-content/schema';

const portfolioFiles = glob({ pattern: '*.json', base: './src/content/portfolio' });

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

export const collections = { portfolio };
