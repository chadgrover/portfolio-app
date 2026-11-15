---
version: 1
slug: "src-pages-language-astro"
primary_target: "src/pages/[language].astro"
related_targets: ["src/pages/404.astro"]
---

## Scope

The localized home page (`/en/` and `/ja/`), a Persuade surface, with the 404 page in the same world. Built code-led: no comp. Product truth, audience, budgets and accessibility targets live in `PRODUCT.md` and bind this direction.

## Job

The portfolio owner wants a portfolio visitor to leave believing three things: obsessive craft, a distinct personality, and a developer who is at home in both Japanese and English. Two outcomes count as failure even when polished: a page that looks like a template, and a Japanese page that feels secondary.

## Direction contract

**THESIS.** The page is a terminal whose screen is a field of dormant code. The pointer wakes the field and it fades; the portfolio owner's name is drawn from the field's own cells, the only ones that never go dark. It refuses the category default: a dark page with a large sans-serif name, a monospace kicker and two outlined buttons.

**OWN-WORLD.** Black glass ground `#020507`. One phosphor hue: blue `#39c8ff`, its lighter tint `#7fdcff`, near-white `#e6fbff`, dormant cells `#0e2c3c`. One cell grid rules the page: every element sits on it and measures whole cells. Display type is pixel type from Misaki Gothic 2nd, an 8×8 bitmap font under a free licence, drawn as cells and never shipped as a font file; small labels are monospace. Controls are outlined blocks two rows tall that invert when current or hovered.

**STORY.** The portfolio visitor reads a `whoami` prompt answered by a name, then a role, then two profile links. They believe this is a developer who sweats detail in two languages. They open LinkedIn or GitHub.

**FIRST VIEWPORT.** Measured on a 60-column grid of 24 px cells at 1440 × 900. One column with one left edge at column 4 and two empty rows between elements. `› whoami` on rows 3–4, marked as English code on the Japanese page. The name in lit cells, one name pixel per cell, on two lines (rows 7–13 and 16–22), the line break falling at the space the name already holds in each language. The role in the same pixel font at a quarter of that pixel size, near-white, on rows 25–26. The profile links on rows 29–30, the primary action: each is one block holding the official LinkedIn or GitHub mark, unmodified, on a white tile at its left and the platform's name at its right. The language switch sits alone at the top right on rows 1–2, current language filled. Positions are identical in both languages. The cell shrinks with the viewport so the whole column, profile links included, stays inside the first viewport on a laptop. Signature interaction: the pointer wake. A hovered cell lights at once in the lighter tint at a low fill, then fades over about three seconds, in CSS alone. Motion grammar: name cells switch on in one left-to-right sweep on load; on touch screens sparse cells drift for under five seconds after load, then rest; with reduced motion everything is off and the name is fully lit.

**FORM.** Phosphor Wake: a bioluminescent-wake form translated to phosphor persistence on a character grid. A dealt challenger from the bolder re-roll, so it holds no position on the grounded list. `seed:349f6d10f9ae9a89`. The portfolio owner's pins bind it: a developer's costume, dark only, ready for motion, and the colour and screen-graphics register of 1990s cyberpunk anime. Nothing from any such work appears on the site.

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Decisions the portfolio owner made

- Blue, chosen from a shortlist of blue, amber, aqua, green and violet. Each clears 4.5:1 for text against its ground and carries no negative reading in English or Japanese. Red was dropped: it reads as alarm in both, and a living person's name is not written in red in Japan.
- The name appears once. The header holds `whoami` and the language switch, not the name, which departs from the spec's header wording.
- The Japanese page shows the name in katakana only; the Latin spelling was removed.
- The name and role are lettered in Misaki in both languages. Every other piece of Japanese text uses system fonts.
- The name and role stay real heading and paragraph text for assistive technology; the cells are their visual form.

## Unresolved

- Cell size has three masters that the build must reconcile: fitting the first viewport on a laptop, reflowing at 320 CSS px, and growing with text enlarged to 200%.
- Lettering drawn as cells is an image of text. The name can stand as a wordmark; the role may need to become real text to meet WCAG 2.2 AA.
- How each language's content supplies the two name lines without code splitting the name.
- The hyphen in the English role is seven pixels wide in this font and may need shortening.
- The pointer wake is decorative; its strength was softened and is open to tuning in the build.
