import { z } from 'astro/zod';

const text = z.string().trim().min(1);

export const portfolioContentSchema = z.object({
  home: z.object({
    hero: z.object({
      displayName: text,
      role: text,
      introduction: text,
    }),
  }),
});

export const profileLinkIds = ['linkedin', 'github'] as const;

export type ProfileLinkId = (typeof profileLinkIds)[number];

export const profileLinkSchema = z.object({
  id: z.enum(profileLinkIds),
  name: text,
  url: z.url({ protocol: /^https$/ }).refine(
    (url) => { const parsed = URL.parse(url); return !parsed?.username && !parsed?.password; },
    'A profile link URL must not carry user info',
  ),
});

export const profileLinksSchema = z.array(profileLinkSchema).superRefine((profileLinks, context) => {
  profileLinks.forEach(({ id }, index) => {
    if (profileLinks.findIndex((profileLink) => profileLink.id === id) < index) {
      context.addIssue({ code: 'custom', message: `Profile link "${id}" appears twice`, path: [index, 'id'] });
    }
  });
});
