import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { portfolioContentSchema } from './lib/portfolio-content/schema';

const portfolio = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/portfolio' }),
  schema: portfolioContentSchema,
});

export const collections = { portfolio };
