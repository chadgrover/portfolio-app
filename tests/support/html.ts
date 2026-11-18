export const tags = (html: string, name: string) => html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? [];
export const attributes = (tag: string) =>
  new Map(
    [...tag.matchAll(/\s([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].map(
      ([, name, doubleQuoted, singleQuoted, unquoted]) => [
        name.toLowerCase(),
        doubleQuoted ?? singleQuoted ?? unquoted ?? '',
      ],
    ),
  );
export const relTokens = (tag: string) => (attributes(tag).get('rel') ?? '').toLowerCase().split(/\s+/);
export const isThirdParty = (url: string) => /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(url.trim());
const isJavaScriptType = (type: string) =>
  ['', 'module'].includes(type.trim().toLowerCase()) || /(?:java|ecma)script/i.test(type);

const withoutTags = (html: string) => html.replace(/<[^>]*>/g, '');
export const visibleText = (html: string) => withoutTags(html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ''));
export const elementBodies = (html: string, name: string) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, 'gi'))].map(([, inner]) => inner);
export const elementTexts = (html: string, name: string) =>
  elementBodies(html, name).map((inner) => withoutTags(inner).trim());

export const firstPartyJavaScript = (html: string) => [
  ...tags(html, 'script').filter((tag) => {
    const scriptAttributes = attributes(tag);
    return isJavaScriptType(scriptAttributes.get('type') ?? '') && !isThirdParty(scriptAttributes.get('src') ?? '');
  }),
  ...tags(html, 'link').filter(
    (tag) => relTokens(tag).includes('modulepreload') && !isThirdParty(attributes(tag).get('href') ?? ''),
  ),
];
