# Keep the live site's domain out of the repository

The live site's domain lives only in the `PRODUCTION_ORIGIN` environment variable, never in the public repository: not in source, config, tests, commits, issues, pull requests, or CI logs. The build reads it into Astro's `site` and writes it only into the HTML it serves, as canonical and language links. The portfolio owner sets it outside the repository:

- `PRODUCTION_ORIGIN` in the Workers Builds production build settings, so the live site carries its links.
- `PRODUCTION_ORIGIN` in the Workers Preview settings, so a preview carries the same links the live site will serve.
- The custom domain, attached to the Worker in the Cloudflare dashboard.
- A local `.env` (named in `.env.example`, ignored by Git) for building with the real domain.

Keeping the domain out of the repository keeps it easy to change and keeps it out of a public history that cannot be rewritten (ADR 0001).

This departs from ADR 0002, where serving configuration lives in `wrangler.jsonc` so the public repository shows it. The domain is the one serving value kept out; everything else that `wrangler.jsonc` can hold stays there.

## Considered Options

- **Domain in `wrangler.jsonc` and the Astro config**: one place to read, and every deploy applies it, but it commits the domain to the public history.
- **Domain as a GitHub secret read by CI**: GitHub masks secrets in logs, but CI would hold the real domain for no benefit, since the host builds the live site itself. CI builds with a fake domain instead.

## Consequences

When the guard or a test fails, fix the environment: the domain belongs in `PRODUCTION_ORIGIN`. Tests and CI use the fake domain that `.github/workflows/ci.yml` sets; tests resolve the expected origin from `PRODUCTION_ORIGIN` the same way the build does, so a local build with the real `.env` passes too.

A build of `main` in Workers Builds stops when `PRODUCTION_ORIGIN` is absent, so the live site never ships without its links. Every other build without it still succeeds and emits no canonical or language links.

Changing the domain is a settings change in the Cloudflare dashboard (the custom domain and both `PRODUCTION_ORIGIN` values), then a rebuild; no commit is involved.
