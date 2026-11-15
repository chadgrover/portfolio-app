# AGENTS.md

## Domain and decisions

`GLOSSARY.md` defines the domain terms: use them when naming concepts, and check every commit against its **Private information** entry.

Before you commit portfolio content, change hosting or deployment, or change which files reach the upload (what the build puts in `dist/`), scan the ADR filenames in `docs/adr/` and read every ADR that bears on the change.

## UI work

Before any UI change, load the `impeccable` skill.

## Agent skills

### Issue tracker

Issues live in GitHub Issues for chadgrover/portfolio-app (via `gh`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `GLOSSARY.md` plus `docs/adr/`. See `docs/agents/domain.md`.
