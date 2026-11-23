import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { supportedLanguages } from './lib/i18n/constants';
import { portfolioContentSchema, profileLinksSchema } from './lib/portfolio-content/schema';

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
  loader: {
    name: 'profileLinks',
    async load({ config, logger, parseData, store, watcher }) {
      const filePath = fileURLToPath(new URL('src/content/portfolio/profile-links.json', config.root));
      const updateProfileLinks = async () => {
        const data = { profileLinks: JSON.parse(await readFile(filePath, 'utf8')) };
        store.set({ id: 'profileLinks', data: await parseData({ id: 'profileLinks', data, filePath }) });
      };
      await updateProfileLinks();
      watcher?.add(filePath);
      watcher?.on('change', async (changedPath) => {
        if (changedPath === filePath) await updateProfileLinks().catch((error: Error) => logger.error(error.message));
      });
    },
  },
  schema: z.object({ profileLinks: profileLinksSchema }),
});

export const collections = { portfolio, profileLinks };
