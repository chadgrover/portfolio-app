import type { z } from 'astro/zod';
import type { portfolioContentSchema } from './schema';

export type PortfolioContent = z.infer<typeof portfolioContentSchema>;
