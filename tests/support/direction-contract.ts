import { fileURLToPath } from 'node:url';

export const surfaceBriefDirectory = fileURLToPath(new URL('../../.impeccable/surfaces/', import.meta.url));
const directionContractHeading = '## Direction contract';
const shortestDistinctiveSentenceLength = 40;
const seedReferencePattern = /seed:[0-9a-f]{16}/g;

export const withoutMarkdownMarks = (text: string) => text.replace(/\*\*[^*]+\*\*\s*|`/g, '');
export const distinctiveContractPhrases = (surfaceBrief: string) => {
  const [, afterHeading = ''] = surfaceBrief.split(directionContractHeading);
  const [contract] = afterHeading.split(/^## /m);
  const sentences = withoutMarkdownMarks(contract)
    .split(/\n|(?<=\.)\s/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= shortestDistinctiveSentenceLength);
  return [...sentences, ...(contract.match(seedReferencePattern) ?? [])];
};
