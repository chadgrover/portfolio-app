import misakiGothic2nd from './misaki-gothic-2nd.bdf?raw';

type CellRow = boolean[];

interface Glyph {
  advance: number;
  rows: CellRow[];
}

const fullWidthOffset = 0xfee0;
const ideographicSpace = 0x3000;
const firstPrintableAscii = 0x21;
const lastPrintableAscii = 0x7e;

const property = (bdf: string, name: string) => Number(bdf.match(new RegExp(`^${name} (-?\\d+)`, 'm'))?.[1]);

const parseGlyphs = (bdf: string) => {
  const ascent = property(bdf, 'FONT_ASCENT');
  const descent = property(bdf, 'FONT_DESCENT');
  const glyphs = new Map<number, Glyph>();
  for (const [, body] of bdf.matchAll(/^STARTCHAR [^\n]*\n([\s\S]*?)^ENDCHAR/gm)) {
    const codePoint = Number(body.match(/^ENCODING (\d+)/m)?.[1]);
    const advance = Number(body.match(/^DWIDTH (\d+)/m)?.[1]);
    const [width, height, offsetX, offsetY] = (body.match(/^BBX (.+)$/m)?.[1] ?? '').split(' ').map(Number);
    const bitmapRows = (body.split(/^BITMAP\n/m)[1] ?? '').trim().split('\n').map((hex) => parseInt(hex, 16));
    const bitsPerRow = Math.ceil(width / 8) * 8;
    const topRow = ascent - height - offsetY;
    const rows = Array.from({ length: ascent + descent }, (_, row) =>
      Array.from({ length: advance }, (_, column) => {
        const bitmapRow = bitmapRows[row - topRow];
        const bit = column - offsetX;
        return bitmapRow !== undefined && bit >= 0 && bit < width && ((bitmapRow >> (bitsPerRow - 1 - bit)) & 1) === 1;
      }),
    );
    glyphs.set(codePoint, { advance, rows });
  }
  return { glyphs, ascent };
};

const misaki = parseGlyphs(misakiGothic2nd);

const toFullWidth = (character: string) => {
  const codePoint = character.codePointAt(0)!;
  if (codePoint === 0x20) return ideographicSpace;
  if (codePoint >= firstPrintableAscii && codePoint <= lastPrintableAscii) return codePoint + fullWidthOffset;
  return codePoint;
};

const glyphFor = (character: string) => {
  const glyph = misaki.glyphs.get(toFullWidth(character));
  if (!glyph) throw new Error(`Misaki Gothic 2nd has no glyph for "${character}"`);
  return glyph;
};

const isBlank = (row: CellRow) => row.every((lit) => !lit);

export function letterCells(text: string): CellRow[] {
  const glyphs = [...text].map(glyphFor);
  const rows = glyphs[0].rows.map((_, row) => glyphs.flatMap((glyph) => glyph.rows[row]));
  const descenderRows = rows.slice(misaki.ascent);
  return descenderRows.every(isBlank) ? rows.slice(0, misaki.ascent) : rows;
}
