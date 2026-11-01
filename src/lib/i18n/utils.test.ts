import { describe, expect, test } from 'vitest';
import { selectLanguage } from './utils';

describe('selectLanguage', () => {
  test('a primary ja-JP preference selects Japanese', () => {
    expect(selectLanguage('ja-JP')).toBe('ja');
  });

  test.each(['JA-jp', 'ja-jp', 'Ja-Jp'])('matches %s case-insensitively', (value) => {
    expect(selectLanguage(value)).toBe('ja');
  });

  test.each(['ja', 'ja-Osaka', 'en', 'en-US', 'fr-FR', '', undefined, null])(
    'defaults %s to English',
    (value) => expect(selectLanguage(value)).toBe('en'),
  );
});
