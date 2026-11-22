export const fontFaces = {
  latin: {
    family: 'Jost',
    weight: '100 900',
    source: '@fontsource-variable/jost/files/jost-latin-wght-normal.woff2',
  },
  'japanese-name': {
    family: 'Noto Sans JP Name',
    weight: '900',
    source: '@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-900-normal.woff2',
  },
} as const;

export type FontFace = keyof typeof fontFaces;

export const fontFaceUrl = (face: FontFace) => `/fonts/${face}.woff2`;

export const fontFaceCss = Object.entries(fontFaces)
  .map(([face, { family, weight }]) =>
    `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};font-display:swap;src:url(${fontFaceUrl(face as FontFace)}) format("woff2")}`)
  .join('');
