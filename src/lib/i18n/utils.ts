import type { Language } from './types';

export function selectLanguage(primaryLanguage?: string | null): Language {
  return primaryLanguage?.toLowerCase() === 'ja-jp' ? 'ja' : 'en';
}

