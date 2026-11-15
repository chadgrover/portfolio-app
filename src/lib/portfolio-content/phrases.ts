export function chunksAtPhrases(text: string, phrases: string[]): string[] {
  const starts = phrases.reduce<number[]>((found, phrase) => [...found, text.indexOf(phrase, found.at(-1) ?? 0)], []);
  return starts.map((start, index) => text.slice(index === 0 ? 0 : start, starts[index + 1] ?? text.length));
}
