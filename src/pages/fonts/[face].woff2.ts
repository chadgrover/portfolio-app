import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import subsetFont from 'subset-font';
import { fontFaces, type FontFace } from '../../lib/fonts/faces';
import { portfolioContentFor } from '../../lib/portfolio-content/entries';

const codePointRange = (first: number, last: number) =>
  String.fromCodePoint(...Array.from({ length: last - first + 1 }, (_, offset) => first + offset));

const glyphsFor: Record<FontFace, () => Promise<string>> = {
  latin: async () => codePointRange(0x20, 0x7e) + codePointRange(0xa0, 0xff) + codePointRange(0x2010, 0x2027),
  'japanese-name': async () => (await portfolioContentFor('ja')).homePage.displayName,
};

export const getStaticPaths = (() =>
  Object.keys(fontFaces).map((face) => ({ params: { face } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const face = params.face as FontFace;
  const source = await readFile(createRequire(import.meta.url).resolve(fontFaces[face].source));
  const subset = await subsetFont(source, await glyphsFor[face](), { targetFormat: 'woff2' });
  return new Response(new Uint8Array(subset), { headers: { 'Content-Type': 'font/woff2' } });
};
