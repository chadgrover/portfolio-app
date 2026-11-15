import { z } from 'astro/zod';
import { profilePlatformSchema } from '../profile-links/schema';

const nonBlankText = z.string().trim().min(1);
const withoutWhitespace = (text: string) => text.replace(/\s/g, '');
const spells = (parts: string[], text: string) => parts.join('') === withoutWhitespace(text);

export const portfolioContentSchema = z.object({
  home: z.object({
    metaDescription: nonBlankText,
    hero: z
      .object({
        displayName: nonBlankText,
        displayNameLines: z.array(nonBlankText).min(1),
        role: nonBlankText,
        rolePhrases: z.array(nonBlankText).min(1),
      })
      .refine(({ displayName, displayNameLines }) => spells(displayNameLines, displayName), {
        path: ['displayNameLines'],
        message: 'Display name lines must spell the display name in order',
      })
      .refine(({ role, rolePhrases }) => spells(rolePhrases, role), {
        path: ['rolePhrases'],
        message: 'Role phrases must spell the role in order',
      }),
  }),
  profileLinkLabels: z.record(
    profilePlatformSchema,
    z.object({ name: nonBlankText, accessibleName: nonBlankText }),
  ),
});
