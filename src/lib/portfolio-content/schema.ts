import { z } from 'astro/zod';
import { profilePlatformSchema } from '../profile-links/schema';

const nonBlankText = z.string().trim().min(1);
const withoutWhitespace = (text: string) => text.replace(/\s/g, '');

export const portfolioContentSchema = z.object({
  home: z.object({
    metaDescription: nonBlankText,
    hero: z
      .object({
        displayName: nonBlankText,
        displayNameLines: z.array(nonBlankText).min(1),
        role: nonBlankText,
      })
      .refine(
        ({ displayName, displayNameLines }) => displayNameLines.join('') === withoutWhitespace(displayName),
        { path: ['displayNameLines'], message: 'Display name lines must spell the display name in order' },
      ),
  }),
  profileLinkLabels: z.record(
    profilePlatformSchema,
    z.object({ name: nonBlankText, accessibleName: nonBlankText }),
  ),
});
