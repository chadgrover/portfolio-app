import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const { PRODUCTION_ORIGIN, WORKERS_CI_BRANCH } = loadEnv('production', fileURLToPath(new URL('../../', import.meta.url)), '');

export const productionOrigin = PRODUCTION_ORIGIN || undefined;

export const isLiveSiteBuild = WORKERS_CI_BRANCH === 'main';
