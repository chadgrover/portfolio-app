# AGENTS.md

Write self-documenting code: names, types, and structure carry the intent, and the code holds no comments.

Name each function verb-noun: read `docs/agents/function-verbs.md` before you name a function or change one.

## Domain and decisions

`GLOSSARY.md` defines the domain terms: use them when naming concepts, and check every commit against its **Private information** entry.

Before you commit portfolio content, change hosting or deployment, or change which files reach the upload (what the build puts in `dist/`), scan the ADR filenames in `docs/adr/` and read every ADR that bears on the change.

## Commits and pull requests

Title commits and pull requests as [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). A pull request ends its Summary section with the issue line (`Closes #N` or `Part of #N`) and carries labels from the repository's set.

## Single source of truth

Keep each fact in one place and point to it from everywhere else. Code, config, and the directory layout are sources too: a document names them instead of restating what they contain. Colocate what changes together: portfolio content lives in the per-language files in `src/content/portfolio/`, and interface text lives in `src/lib/i18n/interface-text.ts`. A value that is identical in every language, such as a profile link's URL, lives once in a shared file in that folder rather than copied into each language file.

## Tests

Tests assert what a portfolio visitor, a search engine, or the host receives: the language a browser tag selects, whether content passes validation, and in the build output the text, page language, link targets, accessible names, and metadata such as the page title and description.

## Libraries

Solve parsing, sanitizing, validating, encoding and file formats with an established library. Take the first that fits:

1. a direct dependency;
2. a package a dependency already installs, pinned in `package.json` before you import it;
3. a new package that is widely used, actively maintained and from a known publisher.

Write your own only when none fits, and name the gap in the PR.

## UI work

Before any UI change, load the `impeccable` skill.

## Agent skills

### Issue tracker

Issues live in GitHub Issues for chadgrover/portfolio-app (via `gh`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `GLOSSARY.md` plus `docs/adr/`. See `docs/agents/domain.md`.
