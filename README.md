# Portfolio foundation

A minimal static Astro portfolio with manually authored English and Japanese Portfolio fixtures. All included content is fictional. See [issue #1](https://github.com/chadgrover/portfolio-app/issues/1), the [glossary](GLOSSARY.md), and the [ownership decision](docs/adr/0001-separate-private-content.md).

## Local commands

Use Node **24.22.0** (`.node-version` / `.nvmrc`) and npm **12.2.1** (`npm install --global npm@12.2.1`). Dependencies and deployment tooling are pinned in `package-lock.json`.

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

With `PORTFOLIO_CONTENT_DIR` unset, local development and application CI load `fixtures/published/en.json` and `ja.json`. To use private published input, set it to the **published directory**, not its repository root:

```powershell
$env:PORTFOLIO_CONTENT_DIR = 'C:\path\to\portfolio-content\published'
npm run check
npm run build
Remove-Item Env:PORTFOLIO_CONTENT_DIR
```

```sh
PORTFOLIO_CONTENT_DIR=../portfolio-content/published npm run check
PORTFOLIO_CONTENT_DIR=../portfolio-content/published npm run build
```

Each language file requires non-empty string values for `displayName`, `role`, and `introduction`. Whitespace-only values fail. Missing files, unreadable or malformed JSON, and invalid required fields fail without fixture fallback when the setting is explicit (including an empty setting). Errors name files or fields without echoing content values. Only configured language files in the selected directory are read; keep `drafts/` outside `published/`. Extra JSON fields are not rendered. The read-only repository credential can technically read drafts too: loader exclusion is an application rule, not folder-level authorization.

`/en/` and `/ja/` share one page. `/` uses only `navigator.language`: case-insensitive `ja-JP` selects `/ja/`; every other or unavailable value selects `/en/`. Navigation replaces the root history entry. Direct language links stay selected. JavaScript-disabled visitors receive an English meta redirect and visible English link. There are no cookies, stored preferences, secondary-language matching, or host root redirects. A top-level `404.html` provides bilingual recovery links and allows Cloudflare Pages to return HTTP 404 instead of SPA fallback.

## Deployment setup (owner action, not yet provisioned)

Keep both `chadgrover/portfolio-app` and `chadgrover/portfolio-content` private. Create the content repository with `main`, fictional `published/en.json` and `published/ja.json`, and optional separate `drafts/`. It needs no schema implementation, deployment pipeline, dispatch workflow, or saved deployment credentials. The content-agent handoff is delivered separately in the owner's OS temporary directory.

Create a Cloudflare Pages **Direct Upload** project using its assigned `pages.dev` address and production branch `main`. Do not connect Git integration, add root redirects, enable paid features/spending, or change unrelated billing settings. No adapter, SSR, runtime service, or custom domain is needed.

Set exactly two custom application-repository Actions secrets:

| Secret | Credential scope |
| --- | --- |
| `PORTFOLIO_CONTENT_READ_TOKEN` | Fine-grained GitHub token, only `portfolio-content`, Contents read (plus GitHub's mandatory Metadata read). Reuse until rotation/expiry. |
| `CLOUDFLARE_API_TOKEN` | Cloudflare token, Account / Cloudflare Pages / Edit in the selected account. This is account-scoped, not restricted to one Pages project. |

Set two non-secret repository Actions variables: `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_PAGES_PROJECT`. GitHub supplies the application's own `GITHUB_TOKEN`; no third custom credential is saved. Never paste credential values into source, JSON, issues, handoffs, or logs.

PR checks use fixtures only and receive no private-content or deployment secrets. The workflow uses `pull_request`, never `pull_request_target`. Main pushes and manual runs from **main only** can deploy. From Actions, choose **Verify and deploy → Run workflow → main** to publish the latest approved content. Content-only pushes trigger nothing; the next app deployment picks them up.

A single deployment concurrency group lets an active run finish and coalesces waiting requests. Queue order is not guaranteed, so each job checks out the current `main` tips of both repositories after entering the group and records their commit SHAs in the run summary. It installs from the lockfile, checks/tests/builds fixtures, validates and rebuilds published content, then uses pinned Wrangler to upload **only `dist/`**. No content/build cache, source artifact, debug artifact, or draft upload is configured. Changing application main or its workflows is trusted deployment-code execution; review those changes accordingly.

Repository secrets avoid requiring paid GitHub environment features. Protection features depend on the private-repository plan; this setup does not promise an approval gate. Included private-repository Actions allowances are finite: exhaustion can delay deployment. Do not enable spending to work around the limit without a separate decision.

## Recovery and acceptance

A failure before upload leaves the existing deployment in place. Fix invalid published content (the error identifies the file/field), an expired credential, or failing application checks, then run the workflow on main again. For upload/network failures inspect the run and current Pages deployment, then retry; if an unwanted deployment became live, restore a known-good deployment through the Pages dashboard and fix the inputs before rerunning. Source SHAs in the Actions summary identify the release inputs.

Local implementation can be verified with `npm ci`, `npm run check`, `npm test`, and `npm run build`. Inspect `dist/` to confirm it contains only public pages/assets and no JSON, drafts, source, or credentials.

Live setup acceptance remains pending until repositories, secrets, and Pages are configured and this local branch is intentionally published:

- Check `/en/`, `/ja/`, visible focus/keyboard navigation, language attributes, and links.
- At `/`, check primary `ja-JP` and mixed-case variants select Japanese; `ja`, other tags, and unavailable preferences select English. Check direct language routes stay selected and JavaScript-disabled root visits reach English.
- Request an unknown path and verify bilingual recovery links and HTTP **404**.
- Demonstrate a successful application-main deployment and record both input SHAs.
- Change only fictional published content: verify no deployment starts; manually run the application workflow and verify that latest content appears.
- Introduce invalid fictional published content, verify failure before upload and the existing website remains available, then restore valid input.

References: [Astro type checking](https://docs.astro.build/en/guides/typescript/), [custom 404](https://docs.astro.build/en/basics/astro-pages/#custom-404-error-page), [Pages static serving](https://developers.cloudflare.com/pages/configuration/serving-pages/), [Direct Upload from CI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/), [GitHub concurrency](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency), [environment availability](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments), [Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
