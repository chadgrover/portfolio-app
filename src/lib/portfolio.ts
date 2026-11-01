import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'astro/zod';
import { supportedLanguages, type Language } from './languages';

const portfolioSchema = z.object({
  displayName: z.string().trim().min(1),
  role: z.string().trim().min(1),
  introduction: z.string().trim().min(1),
});
export type Portfolio = z.infer<typeof portfolioSchema>;

export async function loadPortfolio(): Promise<Record<Language, Portfolio>> {
  const directory = process.env.PORTFOLIO_CONTENT_DIR ?? resolve('fixtures/published');
  const entries = await Promise.all(supportedLanguages.map(async (language) => {
    const filename = `${language}.json`;
    let content: unknown;
    try {
      content = JSON.parse(await readFile(resolve(directory, filename), 'utf8'));
    } catch {
      throw new Error(`Cannot read portfolio content in ${filename}: file missing, unreadable, or malformed JSON`);
    }
    const result = portfolioSchema.safeParse(content);
    if (!result.success) {
      const fields = result.error.issues.map((issue) => issue.path.join('.') || 'document');
      throw new Error(`Invalid portfolio content in ${filename}: ${fields.join(', ')}`);
    }
    return [language, result.data] as const;
  }));
  return Object.fromEntries(entries) as Record<Language, Portfolio>;
}

