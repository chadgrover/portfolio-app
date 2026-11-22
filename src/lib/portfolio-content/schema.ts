import { z } from 'astro/zod';

const text = z.string().trim().min(1);

export const portfolioContentSchema = z.object({
  home: z.object({
    hero: z.object({
      displayName: text,
      role: text,
      introduction: text,
    }),
    profileLinks: z.array(z.object({ profileLink: text, purpose: text })).min(1),
  }),
});

export const profileLinkSchema = z.object({
  name: text,
  url: z.url({ protocol: /^https$/ }),
});
