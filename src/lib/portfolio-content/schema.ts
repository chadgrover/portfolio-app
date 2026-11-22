import { z } from 'astro/zod';

const text = z.string().trim().min(1);

export const portfolioContentSchema = z.object({
  home: z.object({
    hero: z.object({
      displayName: text,
      role: text,
      introduction: text,
    }),
    profileLinks: z.array(z.object({ profileLink: text, purpose: text })).min(1).superRefine((links, context) => {
      links.forEach(({ profileLink }, index) => {
        if (links.findIndex((link) => link.profileLink === profileLink) < index) {
          context.addIssue({ code: 'custom', message: `Profile link "${profileLink}" is listed twice`, path: [index, 'profileLink'] });
        }
      });
    }),
  }),
});

export const profileLinkSchema = z.object({
  name: text,
  url: z.url({ protocol: /^https$/ }).refine(
    (url) => { const parsed = URL.parse(url); return !parsed?.username && !parsed?.password; },
    'A profile link URL must not carry user info',
  ),
});
