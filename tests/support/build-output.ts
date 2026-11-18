import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const distDirectory = fileURLToPath(new URL('../../dist/', import.meta.url));

export const buildOutputFiles = readdirSync(distDirectory, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => relative(distDirectory, join(entry.parentPath, entry.name)));

export const readBuildOutputBytes = (path: string) => readFileSync(join(distDirectory, path));
export const readBuildOutput = (path: string) => readBuildOutputBytes(path).toString('utf8');
export const compressedSize = (content: string | Buffer) => gzipSync(content, { level: 9 }).length;
