import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { supportedLanguages } from '../i18n/constants';
import type { Language } from '../i18n/types';
import { portfolioContentSchema } from './schema';
import type { PortfolioContent } from './types';

export async function loadPortfolioContent(): Promise<Record<Language, PortfolioContent>> {
  const directory = process.env.PORTFOLIO_CONTENT_DIR ?? resolve('fixtures/published');
  const entries = await Promise.all(supportedLanguages.map(async (language) => {
    const filename = `${language}.json`;
    let content: unknown;
    try {
      content = JSON.parse(await readFile(resolve(directory, filename), 'utf8'));
    } catch {
      throw new Error(`Cannot read portfolio content in ${filename}: file missing, unreadable, or malformed JSON`);
    }
    const result = portfolioContentSchema.safeParse(content);
    if (!result.success) {
      const fields = result.error.issues.map((issue) => issue.path.join('.') || 'document');
      throw new Error(`Invalid portfolio content in ${filename}: ${fields.join(', ')}`);
    }
    return [language, result.data] as const;
  }));
  return Object.fromEntries(entries) as Record<Language, PortfolioContent>;
}

