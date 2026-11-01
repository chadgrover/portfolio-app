import { loadPortfolio } from '../src/lib/portfolio';

try {
  await loadPortfolio();
  console.log('Portfolio content is valid for all supported languages.');
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Portfolio content validation failed.');
  process.exitCode = 1;
}
