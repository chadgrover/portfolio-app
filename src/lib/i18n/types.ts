import type { supportedLanguages } from './constants';

export type Language = (typeof supportedLanguages)[number];
