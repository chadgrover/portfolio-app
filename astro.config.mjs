import { defineConfig } from 'astro/config';
import { isLiveSiteBuild, productionOrigin } from './src/lib/build-environment';

if (!productionOrigin && isLiveSiteBuild) {
  throw new Error('PRODUCTION_ORIGIN must be set to build the live site.');
}

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  site: productionOrigin,
});
