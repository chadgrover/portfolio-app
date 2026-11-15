import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file, glob } from 'astro/loaders';
import { supportedLanguages } from './lib/i18n/constants';
import { portfolioContentSchema } from './lib/portfolio-content/schema';
import { profileLinksSchema } from './lib/profile-links/schema';

const portfolioDirectory = './src/content/portfolio';
const portfolioFiles = glob({ pattern: `{${supportedLanguages.join(',')}}.json`, base: portfolioDirectory });

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

export const profileLinksEntryId = 'profile-links';

const profileLinks = defineCollection({
  loader: file(`${portfolioDirectory}/${profileLinksEntryId}.json`, {
    parser: (text) => ({ [profileLinksEntryId]: { links: JSON.parse(text) } }),
  }),
  schema: z.object({ links: profileLinksSchema }),
});

export const collections = { portfolio, profileLinks };
