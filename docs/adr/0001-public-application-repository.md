# Keep the application repository public

The application repository is public so portfolio visitors can read its source code and README. Portfolio content is committed alongside the code because the live site presents it anyway. Git history is permanent, so this relies on private information never being committed. The host builds `main` through its own connection to GitHub, so the repository holds no deployment credentials (see ADR 0002).

## Considered Options

A private content repository, with a GitHub Actions workflow uploading `dist/` to Cloudflare, would have kept portfolio content and its history private until publication. It was rejected because it needed a cross-repository read credential, a stored Cloudflare token, and coordination between two repositories. Work in progress stays on the portfolio owner's machine instead.
