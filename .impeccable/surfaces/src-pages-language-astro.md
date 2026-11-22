---
version: 1
slug: "src-pages-language-astro"
primary_target: "src/pages/[language].astro"
related_targets: []
---

# Home page

Mode: Persuade (this surface only).

## Brief

- Audience: a recruiter or hiring manager in Japan scanning quickly, often in Japanese, sometimes on a phone; engineers second.
- Job: know who the portfolio owner is and reach a profile link (LinkedIn to get in touch, GitHub for source) from the first screen.
- Proof: the page's own craft and accessibility. No invented claims; the differentiator stays open.
- Scope now: `/en/` and `/ja/` hero plus profile links. A hub list (Work, About, Writing) is planned, not built, and must fit below the links later without a redesign.
- Each language has its own arrangement. The EN page shows no Japanese strings, except the 日本語 autonym in the language switch.
- Later: a professional photo takes a solid rectangular slot in the composition.
- Motion: bars sliding in on load plus a cross-document view transition between languages, both off under reduced motion.
- Constraints: WCAG 2.2 AA in both languages, no first-party JavaScript, dark only.
- Alternate palette on record: Blue-Black & Indigo.

## Direction contract

THESIS: The name is the architecture. Heavy type, bars and rules at 0° and 90° build the page; it refuses the centred avatar, tagline and button-pair hero.

OWN-WORLD: Ink & Ice. Near-black blue ground, ice-white type, one cyan reserved for what you can press, slate hairlines and one dim bar. Heavy gothic kana and geometric uppercase Latin; no radii, shadows, glows, gradients or grain.

STORY: The visitor reads a name built at architectural scale, understands a software engineer who cares about craft, and presses LinkedIn or GitHub.

FIRST VIEWPORT: A flush-left bar at the upper third; the name at 130–170px set in two lines beneath it; a full-height vertical hairline right of the name (the JA page sets the Latin name vertically beside it); role and introduction in a right column; both profile links on a cyan rule at its foot, inside the first screen on desktop and phone. Each profile link is the official LinkedIn or GitHub mark alone, unmodified, in its official white version, with one mark height of empty clear space around it (ADR 0003). The English / 日本語 switch sits top right on the gutter, uppercase Latin with a white underline on the current language.

FORM: Constructed Type, first on the ordered list after the user's narrowing steers (dark, bolder, less metaphor, Ink & Ice); seed:92cc99a75a0a8533.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
