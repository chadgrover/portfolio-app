import { expect, test } from 'vitest';
import { distinctiveContractPhrases } from './direction-contract';

test('distinctiveContractPhrases returns long contract sentences and the seed reference', () => {
  const surfaceBrief = [
    '# Surface brief',
    '## Direction contract',
    '**Signal** The hero carries one quiet signal across the whole viewport.',
    'Keep it calm.',
    'Seed: `seed:0123456789abcdef`.',
    '## Notes',
    'This later sentence sits outside the direction contract entirely.',
  ].join('\n');
  expect(distinctiveContractPhrases(surfaceBrief)).toEqual([
    'The hero carries one quiet signal across the whole viewport.',
    'seed:0123456789abcdef',
  ]);
});
