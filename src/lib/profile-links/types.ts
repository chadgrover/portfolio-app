import type { z } from 'astro/zod';
import type { profileLinksSchema, profilePlatformSchema } from './schema';

export type ProfilePlatform = z.infer<typeof profilePlatformSchema>;
export type ProfileLink = z.infer<typeof profileLinksSchema>[number];
