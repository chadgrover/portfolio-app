export const supportedLanguages = ['en', 'ja'] as const;
export type Language = (typeof supportedLanguages)[number];

export function selectLanguage(primaryLanguage?: string | null): Language {
  return primaryLanguage?.toLowerCase() === 'ja-jp' ? 'ja' : 'en';
}

