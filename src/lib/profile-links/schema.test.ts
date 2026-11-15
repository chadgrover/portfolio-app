import { describe, expect, test } from 'vitest';
import { profileLinksSchema } from './schema';

describe('profileLinksSchema', () => {
  const linkedin = { platform: 'linkedin', url: 'https://www.linkedin.com/in/chadgrover/' };
  const github = { platform: 'github', url: 'https://github.com/chadgrover' };

  test('accepts known platforms with https URLs in order', () => {
    expect(profileLinksSchema.parse([linkedin, github])).toEqual([linkedin, github]);
  });

  test('accepts an empty list', () => {
    expect(profileLinksSchema.safeParse([]).success).toBe(true);
  });

  test.each([
    ['an unknown platform', { ...github, platform: 'instagram' }, [1, 'platform']],
    ['an http URL', { ...github, url: 'http://github.com/chadgrover' }, [1, 'url']],
    ['a malformed URL', { ...github, url: 'github.com/chadgrover' }, [1, 'url']],
    ['a missing URL', { platform: 'github' }, [1, 'url']],
  ])('rejects %s at its path', (_, entry, path) => {
    const result = profileLinksSchema.safeParse([linkedin, entry]);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(path);
  });
});
