# Portfolio

A bilingual static portfolio built with Astro.

## Getting started

Use Node 24.22.0 and npm 12.2.1.

```sh
npm ci
npm run dev
```

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Start the development server at `localhost:4321` |
| `npm run check` | Check types and content |
| `npm test` | Run unit tests |
| `npm run build` | Build the static site to `dist/` |
| `npm run preview` | Preview the build locally |

## Content

English and Japanese portfolio content lives in `src/content/portfolio/en.json` and `ja.json`. Both files are required and are validated against the collection schema during `check` and `build`.

## Deployment

Cloudflare Pages builds `main` with `npm run build` and publishes `dist/`. See [ADR 0001](docs/adr/0001-public-application-repository.md) for why content lives in this repository.

Learn more in the [Astro documentation](https://docs.astro.build/).
