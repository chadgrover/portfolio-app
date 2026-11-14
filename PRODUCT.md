# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: **recruiters** assessing whether Chad fits a full-stack web role. They need role fit, background, contact, and a résumé path within seconds, without exploring the interface. When audience needs conflict, the recruiter's skim wins.

Secondary (confirmed by the research briefs in `docs/research/`): **engineering managers** checking ownership, trade-offs under constraints, and outcomes. **Fellow engineers** inspecting implementation, architecture, and quality practices. They get optional depth: a summary leads to a case study, and the case study leads to source evidence.

Visitors arrive in English or Japanese and must be able to stay in their chosen language.

## Product Purpose

A bilingual (EN/JA) static portfolio that presents Chad's professional information to portfolio visitors (see `GLOSSARY.md`). Success means a recruiter quickly identifies Chad as a full-stack web developer and can contact him. Deeper visitors find credible evidence of engineering judgment.

## Positioning

Chad is presented as a **full-stack web** developer who works professionally in both Japanese and English. Most of his professional work is private, so the portfolio's own public repository (code, ADRs, tests, research notes) serves as inspectable proof of how he works. Private work is described at an approved level of detail.

## Operating Context

- Visitors read on desktop and mobile, often arriving from a résumé, application, or profile link.
- Language routes are `/en/` and `/ja/`. The research recommends replacing the root's automatic redirect with an explicit language chooser (not yet implemented).
- The repository is public by design (ADR 0001). Committed content and its Git history count as published, and Cloudflare Pages builds `main`.

## Capabilities and Constraints

- Static Astro output; core reading and navigation must work without JavaScript.
- Content is validated by the schema in `src/lib/portfolio-content/schema.ts`. It currently covers only the hero (name, role, introduction).
- Content approval covers public Git history as well as the rendered site. Nothing private or unapproved gets committed.
- Both languages must be complete for core pages, with matching facts, dates, ownership, and links.
- Open: production domain, contact method, résumé format/language, availability, and which private work can be named.

## Evidence on Hand

- Only **fictional fixtures** exist today (`fixtures/published/en.json`, `ja.json`), and they are labelled as a demonstration.
- Real professional work is **mostly private**. It may be described only at a level the owner approves, without employer code, internal diagrams, or customer data.
- The portfolio repository itself is public, showcased evidence.
- There are no testimonials, metrics, or publishable case studies yet. Do not fabricate any.

## Product Principles

1. **Recruiter-first, depth on demand.** Answer role fit and contact at a glance, and layer deeper evidence behind it.
2. **Truth over polish.** Every claim must be approved and defensible. Missing evidence is labelled, never invented.
3. **Equal languages.** Japanese and English are first-class versions, not one translated from the other.
4. **The site is the specimen.** Its craft, performance, and accessibility are part of the evidence.

## Accessibility & Inclusion

WCAG 2.2 AA is the binding target in both languages, assessed with automated checks plus manual review. Use correct `lang` attributes and typesetting that suits Japanese text.
