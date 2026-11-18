import { existsSync } from 'node:fs';
import { defineConfig } from 'astro/config';

if (existsSync('.env')) process.loadEnvFile();

const { PRODUCTION_ORIGIN } = process.env;
if (!PRODUCTION_ORIGIN) throw new Error('Set PRODUCTION_ORIGIN in .env or the build environment; see .env.example');

export default defineConfig({
  site: PRODUCTION_ORIGIN,
  output: 'static',
  trailingSlash: 'always',
});
