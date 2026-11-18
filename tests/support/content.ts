import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Language } from '../../src/lib/i18n/types';
import type { PortfolioContent } from '../../src/lib/portfolio-content/types';
import type { ProfileLink } from '../../src/lib/profile-links/types';

const contentDirectory = fileURLToPath(new URL('../../src/content/portfolio/', import.meta.url));

const readContentFile = (name: string) => JSON.parse(readFileSync(join(contentDirectory, name), 'utf8'));
export const readPortfolioContent = (language: Language): PortfolioContent => readContentFile(`${language}.json`);
export const readProfileLinks = (): ProfileLink[] => readContentFile('profile-links.json');
