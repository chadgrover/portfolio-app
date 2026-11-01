import { loadPortfolioContent } from '../src/lib/portfolio-content/load';

try {
  await loadPortfolioContent();
  console.log('Portfolio content is valid for all supported languages.');
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Portfolio content validation failed.');
  process.exitCode = 1;
}
