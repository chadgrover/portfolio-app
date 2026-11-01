import { z } from 'astro/zod';

export const portfolioContentSchema = z.object({
  home: z.object({
    hero: z.object({
      displayName: z.string().trim().min(1),
      role: z.string().trim().min(1),
      introduction: z.string().trim().min(1),
    }),
  }),
});
