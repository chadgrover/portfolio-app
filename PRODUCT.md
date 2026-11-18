# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: **recruiters** assessing whether the portfolio owner fits a full-stack role. Within seconds, and without exploring the interface, they need to know who the owner is, which roles fit, and how to reach them or get a résumé. When audience needs conflict, the recruiter's skim wins.

Secondary: **engineering managers** checking what the owner owned, how they decide under constraints, and what changed because of their work. **Fellow engineers** inspecting implementation, architecture, and how quality is checked. They get optional depth: a summary leads to a case study, and the case study leads to source evidence.

Visitors arrive in English or Japanese and stay in their chosen language.

## Product Purpose

A bilingual (EN/JA) static portfolio that presents the portfolio owner's professional information to portfolio visitors (see `GLOSSARY.md`). Success means a recruiter quickly identifies the owner as a full-stack developer and can reach them. Deeper visitors find credible evidence of engineering judgment.

## Positioning

The owner is presented as a **Full-Stack Developer** (フルスタックエンジニア) who works professionally in both Japanese and English. Most of their professional work is private, so the portfolio's own public repository serves as inspectable proof of how they work. Private work is described at an approved level of detail.

## Operating Context

- Visitors read on desktop and mobile, often arriving from a résumé, application, or profile link.
- `/` redirects by browser language on purpose: visitors read Japanese or English, so a visible chooser adds a step without serving anyone.
- The repository is public by design (ADR 0001): committed content and its Git history count as published. Hosting follows ADR 0002.

## Capabilities and Constraints

- Static output; core reading and navigation work without JavaScript.
- Content approval covers public Git history as well as the rendered site. Private information (see `GLOSSARY.md`) never gets committed.
- Third-party marks, such as the GitHub and LinkedIn logos, appear as their official artwork, unmodified.
- The production origin is the `PRODUCTION_ORIGIN` environment variable (see `.env.example`).
- Open: an email contact method on the production domain, résumé format and language, availability, and which private work can be named.

### Bilingual publishing

- Both languages are complete for core pages, with matching facts, dates, ownership, and links.
- Each page declares its language, and a passage in the other language carries its own `lang`.
- Each page is self-canonical and lists its counterpart through reciprocal `hreflang` links.
- Switching language lands on the same page in the other language.
- A page missing a translation says so and links to the available language.
- Translation covers navigation, accessible names, captions, metadata, and error text, as well as prose.

### Performance budgets

Measured on the production build, compressed, cold cache:

- Initial viewport: 300 KB or less across HTML, CSS, JS, fonts, and visible images.
- First-party JavaScript: 0 KB, with a 10 KB ceiling for a justified enhancement.
- CSS: 20 KB or less.
- Web fonts: Latin faces only, self-hosted, 60 KB or less in total; Japanese text uses system fonts.
- Mobile Lighthouse, median of three cold runs per localized home: LCP 2.5 s or less and CLS 0.1 or less. These are lab gates, not field metrics.

## Evidence on Hand

- Real professional work is **mostly private**, described only at a level the owner approves, without employer code, internal diagrams, or customer data.
- The portfolio repository itself is public, showcased evidence.
- There are no testimonials, metrics, or publishable case studies yet.

## Product Principles

1. **Recruiter-first, depth on demand.** Answer role fit and contact at a glance, and layer deeper evidence behind it.
2. **Truth over polish.** Every claim is approved and defensible, and missing evidence is labelled. A specific qualitative outcome beats a number whose measurement cannot be shown; a team result names the team and the owner's part in it.
3. **Localized, not translated.** Japanese and English are first-class versions, each written and designed for its reader. Colour, symbols, imagery, and conventions carry different meanings across the two cultures (a ✓ can read as "wrong" in Japan, where ○ marks correct), so every design element keeps its meaning in both.
4. **The site is the specimen.** Its craft, performance, and accessibility are part of the evidence.

## Accessibility & Inclusion

WCAG 2.2 AA is the binding target in both languages, assessed with automated checks plus manual review. Every page reflows without horizontal scrolling at 320 CSS px and at 200% text size. Interactive targets are at least 44 px. Japanese text is typeset for Japanese, checked with real punctuation and mixed Latin identifiers.
