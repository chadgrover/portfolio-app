import { describe, expect, test } from 'vitest';
import { selectLanguage } from './utils';

describe('selectLanguage', () => {
  test('a primary ja-JP preference selects Japanese', () => {
    expect(selectLanguage('ja-JP')).toBe('ja');
  });

  test.each(['JA-jp', 'ja-jp', 'Ja-Jp', 'JA'])('matches %s case-insensitively', (value) => {
    expect(selectLanguage(value)).toBe('ja');
  });

  test.each(['ja', 'ja-Osaka'])('selects Japanese for any Japanese form %s', (value) =>
    expect(selectLanguage(value)).toBe('ja'),
  );

  test.each(['en', 'en-US', 'fr-FR', '', undefined, null])(
    'defaults %s to English',
    (value) => expect(selectLanguage(value)).toBe('en'),
  );
});
