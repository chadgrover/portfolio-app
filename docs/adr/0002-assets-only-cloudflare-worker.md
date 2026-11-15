# Serve the site as an assets-only Cloudflare Worker

The site is deployed as a Cloudflare Worker that only serves the files in `dist/`, with no Worker script. Workers Builds builds `main` through its own connection to GitHub and serves it as the site; every other pushed branch becomes a Preview on its `workers.dev` URL. Cloudflare is putting its effort into Workers rather than Pages, and keeping the Worker assets-only means `npm run build -> dist/` stays the entire contract with the host. `wrangler.jsonc` holds the serving configuration, so it can be read in the public repository.

## Considered Options

- **Cloudflare Pages**: serves this site equally well today, but Cloudflare is moving new development to Workers, so choosing Pages would likely mean migrating later.
- **GitHub Pages**: simplest, but cannot set response headers such as a Content Security Policy.

## Consequences

Adding a Worker script, or any Cloudflare runtime service, is a new decision, not an extension of this one.

Previews are public, and render only branches already pushed to the public repository (ADR 0001). Keep them on their `workers.dev` URLs, which send `X-Robots-Tag: noindex`; a Preview on a custom domain would lack that header and needs Cloudflare Access to stay out of search results.

Everything in `dist/` is uploaded and publicly served, and the build copies all of `public/` into `dist/` alongside the pages built from `src/pages/`. To keep a file out of the upload, keep it out of `dist/`: move it out of `public/` and `src/pages/`. When a file must exist in `dist/` but stay out of the upload, list it in `public/.assetsignore` (`.gitignore` syntax); Wrangler reads that file from the root of `dist/`. The file is out of the upload when, after `npm run build`, it is absent from `dist/` or matched by a pattern in `dist/.assetsignore`.
