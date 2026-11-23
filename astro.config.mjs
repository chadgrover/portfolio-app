import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const { PRODUCTION_ORIGIN, WORKERS_CI_BRANCH } = loadEnv('production', process.cwd(), '');

if (!PRODUCTION_ORIGIN && WORKERS_CI_BRANCH === 'main') {
  throw new Error('PRODUCTION_ORIGIN must be set to build the live site.');
}

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  site: PRODUCTION_ORIGIN || undefined,
});
