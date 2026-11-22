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

  test('rejects a profile link without an id, naming the entry and field', () => {
    const text = JSON.stringify([{ name: 'LinkedIn', url: 'https://www.linkedin.com/in/example/' }]);
    expect(() => parseProfileLinks(text)).toThrow(
      expect.objectContaining({ issues: [expect.objectContaining({ path: [0, 'id'] })] }),
    );
  });

  test('rejects a profile link id that appears twice', () => {
    const text = JSON.stringify([
      { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/in/example/' },
      { id: 'linkedin', name: 'LinkedIn', url: 'https://example.com/' },
    ]);
    expect(() => parseProfileLinks(text)).toThrow('Profile link "linkedin" appears twice');
  });
});
