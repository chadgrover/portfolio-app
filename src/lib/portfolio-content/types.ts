import type { z } from 'astro/zod';
import type { portfolioContentSchema, profileLinkSchema } from './schema';

export type PortfolioContent = z.infer<typeof portfolioContentSchema>;
export type ProfileLink = z.infer<typeof profileLinkSchema>;
