import { z } from 'astro/zod';

export const profilePlatforms = ['linkedin', 'github'] as const;

export const profilePlatformSchema = z.enum(profilePlatforms);

export const profileLinksSchema = z.array(
  z.object({
    platform: profilePlatformSchema,
    url: z.url({ protocol: /^https$/ }),
  }),
);
