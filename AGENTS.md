# AGENTS.md

Write self-documenting code: names, types, and structure carry the intent, and the code holds no comments.

## Domain and decisions

`GLOSSARY.md` defines the domain terms: use them when naming concepts, and check every commit against its **Private information** entry.

Before you commit portfolio content, change hosting or deployment, or change which files reach the upload (what the build puts in `dist/`), scan the ADR filenames in `docs/adr/` and read every ADR that bears on the change.

## Single source of truth

Keep each fact in one place and point to it from everywhere else. Code, config, and the directory layout are sources too: a document names them instead of restating what they contain. Colocate what changes together: portfolio wording lives in the per-language files in `src/content/portfolio/`. A value that is identical in every language, such as a profile link's URL, lives once in a shared file in that folder rather than copied into each language file.

## UI work

Before any UI change, load the `impeccable` skill.

## Agent skills

### Issue tracker

Issues live in GitHub Issues for chadgrover/portfolio-app (via `gh`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `GLOSSARY.md` plus `docs/adr/`. See `docs/agents/domain.md`.
