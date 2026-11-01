# Portfolio foundation

A minimal static Astro portfolio with manually authored English and Japanese Portfolio fixtures. All included content is fictional. See [issue #1](https://github.com/chadgrover/portfolio-app/issues/1), the [glossary](GLOSSARY.md), and the [repository decision](docs/adr/0001-public-application-repository.md).

## Local commands

Use Node **24.22.0** (`.node-version` / `.nvmrc`) and npm **12.2.1** (`npm install --global npm@12.2.1`). Dependencies are pinned in `package-lock.json`.

```sh
npm ci
npm run dev
npm run check        # explicit Astro/TypeScript check AND content validation
npm run check:content
npm test            # non-watch Vitest unit tests
npm run build       # provider-neutral static website in dist/
npm run preview
```

The two unit-test boundaries are the content loader and primary-browser-language policy. No browser/E2E runner or generated-HTML assertion suite is included. `astro build` does not replace the explicit type check.

## Content contract

`src/lib/portfolio.ts` owns the shared schema, supplied through `astro/zod`. `src/lib/languages.ts` explicitly registers `en` and `ja`; that list controls required files, generated routes, and language navigation. Adding another JSON filename alone cannot publish a language.

With `PORTFOLIO_CONTENT_DIR` unset, local development and CI load `fixtures/published/en.json` and `ja.json`. Set it to another directory holding the same files to validate and build that content instead.

Each language file requires non-empty string values for `displayName`, `role`, and `introduction`. Whitespace-only values fail. Missing files, unreadable or malformed JSON, and invalid required fields fail without fixture fallback when the setting is explicit (including an empty setting). Errors name files or fields without echoing content values. Only configured language files in the selected directory are read. Extra JSON fields are not rendered.

`/en/` and `/ja/` share one page. `/` uses only `navigator.language`: case-insensitive `ja-JP` selects `/ja/`; every other or unavailable value selects `/en/`. Navigation replaces the root history entry. Direct language links stay selected. JavaScript-disabled visitors receive an English meta redirect and visible English link. There are no cookies, stored preferences, secondary-language matching, or host root redirects. A top-level `404.html` provides bilingual recovery links and allows Cloudflare Pages to return HTTP 404 instead of SPA fallback.

## Deployment

Cloudflare Pages is connected to this repository and builds `main` with `npm run build`, publishing `dist/`. GitHub Actions runs `npm run check`, `npm test`, and `npm run build` on pull requests and `main` pushes. No deployment secrets are stored in the repository.
