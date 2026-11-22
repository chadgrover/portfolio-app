import { describe, expect, test } from 'vitest';
import { parseProfileLinks, toProfileLinkAddress } from './profile-links';

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

describe('toProfileLinkAddress', () => {
  test('drops the scheme, www and trailing slash so the address reads on paper', () => {
    expect(toProfileLinkAddress('https://www.linkedin.com/in/example/')).toBe('linkedin.com/in/example');
  });

  test('keeps an address that has no www or trailing slash', () => {
    expect(toProfileLinkAddress('https://github.com/example')).toBe('github.com/example');
  });

  test('keeps the port, so a typed address reaches the same server', () => {
    expect(toProfileLinkAddress('https://github.com:8443/example')).toBe('github.com:8443/example');
  });

  test('keeps the query and fragment, so a typed address opens the same view', () => {
    expect(toProfileLinkAddress('https://github.com/example?tab=repositories#projects')).toBe(
      'github.com/example?tab=repositories#projects',
    );
  });

  test('keeps the final slash of a path that a query follows', () => {
    expect(toProfileLinkAddress('https://www.linkedin.com/in/example/?trk=profile')).toBe('linkedin.com/in/example/?trk=profile');
  });

  test('keeps percent-encoding as written, so a typed address reaches the same page', () => {
    expect(toProfileLinkAddress('https://github.com/example%FF')).toBe('github.com/example%FF');
    expect(toProfileLinkAddress('https://example.com/a%252Fb')).toBe('example.com/a%252Fb');
  });
});
