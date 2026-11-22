# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary portfolio visitor is a recruiter or technical hiring manager at a company in Japan, deciding whether to invite the portfolio owner to interview for a full-time role. Engineers evaluating the portfolio owner's work are a secondary audience. Domain terms follow `GLOSSARY.md`.

## Product Purpose

The portfolio presents a frontend/UI developer's professional information in English and Japanese. Success is a portfolio visitor in Japan concluding the portfolio owner is worth interviewing and reaching them through a contact method.

## Positioning

Accessibility and craft are the signature: accessible, performant, carefully built UI. The portfolio itself is evidence of the claim, so its own quality, accessibility, and public source (ADR 0001) must hold up to inspection by an engineer.

## Operating Context

Recruiters and hiring managers in Japan scan quickly, often in Japanese, sometimes on mobile; engineers may read the public source. Japanese is an equal-first language, not a translation courtesy: both languages carry the same portfolio content, and language routing is defined in `src/lib/i18n/`.

## Capabilities and Constraints

- Static site; hosting and what reaches the upload are governed by `docs/adr/`.
- Portfolio content lives in the per-language files in `src/content/portfolio/`, validated by `src/lib/portfolio-content/schema.ts`.
- Page titles: the home page's title is the portfolio owner's Latin-script name. Each other page's title is its page name in the page's language, then ` | `, then the Latin-script name.
- Nothing in the portfolio or its source may include private information as defined in `GLOSSARY.md`.
- Undecided: the differentiator beyond accessibility and craft (specific stack, seniority, or domain) has not been stated.

## Brand Commitments

None confirmed beyond the bilingual EN/JA presentation.

## Evidence on Hand

The home page display name, role, introduction and profile links in `src/content/portfolio/` are real and reviewed by the portfolio owner.

Planned, not yet written: project case studies, work history, and writing/talks. Contact methods will be profile links to LinkedIn and GitHub; no email is planned.

Absent, and must not be fabricated: testimonials, employer or client names, metrics, project details, dates, or any portfolio content the portfolio owner has not supplied.

## Product Principles

1. Japanese and English are equals: every surface works and reads naturally in both.
2. The portfolio proves the claim: its own accessibility, performance, and craft are the first case study.
3. Make the hiring decision easy: a portfolio visitor in Japan can quickly judge fit and find a contact method.
4. Real content only: placeholders stay visibly fictional until the portfolio owner supplies the real thing.

## Accessibility & Inclusion

WCAG 2.2 AA is the floor for every surface, in both languages.
