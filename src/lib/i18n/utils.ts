import type { Language } from './types';

export function selectLanguage(primaryLanguage?: string | null): Language {
  return primaryLanguage?.split('-')[0].toLowerCase() === 'ja' ? 'ja' : 'en';
}

