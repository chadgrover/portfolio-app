import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import { readBuildOutput } from './build-output';

export const isThirdParty = (url: string) => /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(url.trim());
const isJavaScriptType = (type: string) =>
  ['', 'module'].includes(type.trim().toLowerCase()) || /(?:java|ecma)script/i.test(type);

export const loadBuildOutputPage = (path: string) => cheerio.load(readBuildOutput(path));

export const visibleText = ($: CheerioAPI) => $('html').prop('innerText');

export const firstPartyJavaScript = ($: CheerioAPI) =>
  [
    ...$('script').filter(
      (_, script) => isJavaScriptType($(script).attr('type') ?? '') && !isThirdParty($(script).attr('src') ?? ''),
    ),
    ...$('link[rel~="modulepreload" i]').filter((_, link) => !isThirdParty($(link).attr('href') ?? '')),
  ].map((element) => $.html(element));
