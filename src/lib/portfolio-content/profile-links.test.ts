import { describe, expect, test } from 'vitest';
import { parseProfileLinks } from './profile-links';

describe('parseProfileLinks', () => {
  test('returns each profile link from the shared file', () => {
    const text = JSON.stringify([
      { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/in/example/' },
      { id: 'github', name: 'GitHub', url: 'https://github.com/example' },
    ]);
    expect(parseProfileLinks(text).map(({ id }) => id)).toEqual(['linkedin', 'github']);
  });

  test('accepts a shared file with no profile links', () => {
    expect(parseProfileLinks('[]')).toEqual([]);
  });

  test('rejects a profile link id that appears twice', () => {
    const text = JSON.stringify([
      { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/in/example/' },
      { id: 'linkedin', name: 'LinkedIn', url: 'https://example.com/' },
    ]);
    expect(() => parseProfileLinks(text)).toThrow('Profile link "linkedin" appears twice');
  });
});
