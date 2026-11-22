---
name: Portfolio
description: A bilingual EN/JA developer portfolio built as constructed type on a near-black ground.
colors:
  press: "#7fd4f5"
  ground: "#0b0e12"
  type: "#e8eef2"
  body: "#c9d3db"
  secondary: "#93a3b1"
  hairline: "#2c3540"
  bar-dim: "#1c232c"
typography:
  display:
    fontFamily: "Jost, Hiragino Kaku Gothic ProN, Hiragino Sans, Noto Sans JP, sans-serif"
    fontSize: "min(10.75rem, 100cqi / (columns * 0.7))"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
  display-ja:
    fontFamily: "Noto Sans JP Name, Hiragino Kaku Gothic ProN, Hiragino Sans, Noto Sans JP, sans-serif"
    fontSize: "min(8.25rem, 100cqi / (columns * 1.05))"
    fontWeight: 900
    lineHeight: 1.02
    letterSpacing: "0.02em"
  page-heading:
    fontFamily: "Jost, Hiragino Kaku Gothic ProN, Hiragino Sans, Noto Sans JP, sans-serif"
    fontSize: "clamp(1.75rem, 1.25rem + 2.2vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.02em"
  page-heading-ja:
    fontFamily: "Hiragino Kaku Gothic ProN, Hiragino Sans, Noto Sans JP, Yu Gothic, Meiryo, sans-serif"
    fontSize: "clamp(1.625rem, 1.2rem + 1.9vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.04em"
  headline:
    fontFamily: "Jost, Hiragino Kaku Gothic ProN, Hiragino Sans, Noto Sans JP, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.45
  headline-ja:
    fontFamily: "Hiragino Kaku Gothic ProN, Hiragino Sans, Noto Sans JP, Yu Gothic, Meiryo, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.45
  title:
    fontFamily: "Jost, Hiragino Kaku Gothic ProN, Hiragino Sans, Noto Sans JP, sans-serif"
    fontSize: "clamp(1.25rem, 0.9rem + 1.6vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.04em"
  body:
    fontFamily: "Jost, Hiragino Kaku Gothic ProN, Hiragino Sans, Noto Sans JP, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  body-ja:
    fontFamily: "Jost, Hiragino Kaku Gothic ProN, Hiragino Sans, Noto Sans JP, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.95
  label:
    fontFamily: "Jost, Hiragino Kaku Gothic ProN, Hiragino Sans, Noto Sans JP, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0.16em"
rounded:
  none: "0px"
spacing:
  gutter: "clamp(1rem, 5vw, 4.5rem)"
  column-gap: "clamp(3rem, 8vw, 7.5rem)"
  measure: "36rem"
  stack-sm: "0.875rem"
  stack-md: "1.25rem"
  stack-lg: "2rem"
  inline: "2rem"
  mark-clear-space: "2rem"
components:
  language-switch-link:
    textColor: "{colors.type}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0 0.375rem"
  language-switch-link-current:
    textColor: "{colors.type}"
  profile-link:
    rounded: "{rounded.none}"
    padding: "{spacing.mark-clear-space}"
  profile-link-mark:
    height: "2rem"
  inline-link:
    textColor: "{colors.press}"
---

# Design System: Portfolio

## Overview

**Creative North Star: "Constructed Type"**

The page is built out of the name. Heavy display type, solid bars and thin rules, all set at 0° and 90°, carry the composition; there are no cards, panels or decorative surfaces to hold content. A near-black, faintly blue ground recedes and ice-white type stands forward, with a single cyan kept for whatever can be pressed. Density is low and the scale contrast is extreme: a display name sized to fill its column against small, widely tracked labels.

Japanese and English are set as equals, each in its own setting rather than one script borrowing the other's. Japanese gets a heavy gothic face, looser leading and phrase-aware breaking; Latin gets a geometric sans, uppercase for labels and the name. On the Japanese page the Latin name turns vertical and runs up a full-height rule beside the Japanese name, a device native to Japanese typesetting.

The surface is flat and dark only. Depth is a matter of value steps on one cool hue, never light effects.

**Key Characteristics:**
- Solid bars and hairline rules at right angles do the structural work.
- Display name sized by container query to fill its column.
- One cyan, reserved for pressable things and the rule that frames them.
- Per-script typesetting: face, weight, leading and tracking change with `lang`.
- Flat, square, dark: no radius, shadow, glow, gradient or grain anywhere in the build.

## Colors

One cool blue-slate hue carries every neutral from ground to type; a single light cyan is the only chroma.

### Primary
- **Ice Cyan** (press): link names (the 404's home links, inline links), the 3px rule above a group of links and its 6px segment over a hovered profile link, focus rings, text selection and form `accent-color`. It is the one colour that means "you can act here".

### Neutral
- **Blue-Black Ground** (ground): page and body background, browser `theme-color`, the text colour inside a selection.
- **Ice White** (type): display name, role, 404 headings, the language switch's autonyms and current-language underline, the vertical spine name on wide screens, and the solid bar that opens each page.
- **Frost Body** (body): running text (the home introduction, the 404 explanations), one step down from Ice White so a paragraph sits behind the heading above it.
- **Slate Secondary** (secondary): small supporting text (the English gloss under a Japanese role, the flat Latin name on narrow screens) and the hover underline on the language switch.
- **Slate Hairline** (hairline): 1px structural rules (the full-height spine, the rule over the role column, the rule under the flat Latin name) and the scrollbar thumb. Decorative only, never text.
- **Dim Bar** (bar-dim): one low-contrast counterweight bar beneath the name on wide screens.

The official LinkedIn and GitHub marks render in the white their owners supply, not in a palette token: their brand guidelines forbid recolouring, so they sit outside the One Hue Rule (ADR 0003).

The Blue-Black & Indigo alternate palette is recorded in the home surface brief; it has not shipped and has no tokens here.

On paper the value ladder turns over so the page prints as ink: the ground becomes the paper (#fff), and each role takes the step from the other end of the ladder. Type takes Blue-Black Ground, running text Dim Bar, supporting text Slate Hairline, rules Slate Secondary and the dim bar Frost Body. Ice Cyan's role goes to Blue-Black Ground, because nothing on paper can be pressed.

### Named Rules
**The Pressable Cyan Rule.** Ice Cyan marks what can be pressed and the rule that frames a group of pressables. Static text, headings and decorative bars never take it.

**The One Hue Rule.** Every neutral is a value step on the same cool blue-slate hue. A new neutral is a new step on that hue, not a warm grey or a pure grey.

## Typography

**Display Font:** Jost (variable, 100–900, self-hosted) for Latin; Noto Sans JP Name (Noto Sans JP 900, self-hosted) for the Japanese name
**Body Font:** Jost, falling back per glyph to the system Japanese gothic stack (Hiragino Kaku Gothic ProN, Hiragino Sans, Noto Sans JP, Noto Sans CJK JP, Yu Gothic UI, Yu Gothic, Meiryo); Japanese-only settings (the role, 404 headings, the language switch's 日本語) use that system stack directly

**Character:** A geometric Latin sans paired with a black-weight Japanese gothic. Latin brings precise circles and an uppercase, widely tracked voice for labels; the Japanese face brings mass.

### Hierarchy
- **Display** (700, up to 10.75rem, line-height 1, uppercase, -0.01em): the Latin name, one word per line, each line kept unbroken. Japanese variant: 900, up to 8.25rem, line-height 1.02, 0.02em.
- **Page Heading** (700, `clamp(1.75rem, 1.25rem + 2.2vw, 2.75rem)`, line-height 1.15, 0.02em, uppercase, balanced wrap): the title of a non-home page, such as the 404. Japanese variant: 700 in the system gothic stack, `clamp(1.625rem, 1.2rem + 1.9vw, 2.5rem)`, line-height 1.3, 0.04em, no case change.
- **Headline** (line-height 1.45, balanced wrap): the role line. Latin 600 at 1.5rem, rising to 1.625rem from 80rem; Japanese 700 at 1.375rem, rising to 1.5rem from 80rem.
- **Title** (400, line-height 1.3, 0.04em): link names on a rule, such as the 404's home links. `clamp(1.25rem, 0.9rem + 1.6vw, 1.5rem)` below 80rem; from 80rem `clamp(1.5rem, 3.75vw − 1.5rem, 1.875rem)` (24px at 1280px, 30px from 1440px).
- **Body** (400, 1.0625rem, line-height 1.7 Latin; 1rem, line-height 1.95 Japanese; pretty wrap; max 34em): the introduction and the 404 explanations.
- **Label** (400, 0.875–0.9375rem, 0.16em, uppercase): language switch and the English gloss under a Japanese role. Japanese labels keep their case and tighten to 0.08em.
- **Spine** (400, 1.875rem, 0.42em, uppercase, vertical-rl rotated to read bottom-up): the Latin name running up the spine on the Japanese page. Below 80rem it lies flat at 0.9375rem and 0.3em in Slate Secondary.

### Named Rules
**The Fill-the-Column Rule.** The display name's size is computed from its column width divided by its longest line's character count times a per-script advance (0.7 Latin, 1.05 Japanese), capped at the display maximum (and at 10svh on short viewports). Name lines never wrap. Never set the name at a fixed breakpoint size.

**The Script Owns Its Setting Rule.** Face, weight, leading and tracking are chosen by `:lang()`, not by page. Japanese text runs `line-break: strict` and phrase-aware `word-break: auto-phrase`; uppercase transforms and wide tracking are Latin-only.

## Layout

Below 80rem the home page is a single column with a responsive gutter (`gutter`) and content capped at the reading measure (`measure`, 36rem). The opening Ice White bar bleeds off the left edge into the gutter at 0.875rem thick and min(70%, measure + gutter) long, followed by name, flat Latin name over a hairline, role column, then profile links. Stacks step at 0.875rem, 1.25rem and 2rem.

Short viewports below 80rem (height 36rem or less) tighten so both profile links land inside the first screen even at 320×568 and 390×450: the masthead drops into normal flow (right-aligned, 1rem top padding) so content always starts below it at any text size; the main column's top padding drops to 0; the opening bar thins to 0.625rem, shortens to 50% so it ends before the switch, and sits 0.5rem above the name; the name is capped at 10svh; stacks close up (spine 0.5rem, about 0.75rem, introduction 0.5rem with leading 1.8, links 0.75rem). The profile links keep their full mark size and clear space.

From 80rem the home page becomes a full-viewport six-column grid: gutter, name column, a 3rem spine column, `column-gap`, the text column, gutter. The text column is `clamp(20rem, 100vw − 2·gutter − 3rem − column-gap − 43rem, 30.5rem)`, so the name column always keeps at least 43rem and the name holds roughly 130px Japanese and 164px or more Latin from 1280px. The name column stops widening at the name's largest size (longest line's character count × per-script advance × display maximum), so on very wide screens the spine stays beside the name and the extra width goes to `column-gap`, which never shrinks below `clamp(3rem, 8vw, 7.5rem)`. Rows are sized in `svh` so the bar sits near the upper third and the profile links land inside the first screen. The opening bar spans gutter and name column at 88% and 1.375rem thick; the spine column carries a full-height hairline on its right edge; the role column bottom-aligns above the profile links.

The language switch sits in a masthead absolutely placed top-right on the gutter, outside the grid (except on short viewports, above).

In print the home page takes the single-column layout with 15mm margins on whatever paper the visitor chooses, and fits one A4 or Letter page. The masthead is left out, the main column drops its top padding and full-height minimum, and the opening bar prints solid.

Links on a rule lay out as a wrapping flex row (2rem column gap) on a 3px Ice Cyan top rule; the same pattern serves the home's profile links and the 404's home links. Profile links set their clear-space boxes edge to edge instead of using the column gap.

The 404 has its own layout rather than the home grid: flush-left, max 64rem, top padding `clamp(4rem, 14svh, 8rem)`, the opening Ice White bar bleeding into the gutter (0.875rem, 1.375rem from 80rem). Below 48rem it is one column. From 48rem it is an explicit two-column grid (column gap `clamp(2rem, 6vw, 5rem)`) with the English and Japanese blocks side by side as equals, their home links aligned beneath in the same columns, and the bar ending exactly at the first column's edge. Later pages get their own layouts in the same vocabulary rather than reusing the home grid.

The base `main` rule (a centred 44rem column, 3rem/1.5rem padding, `clamp(2rem, 7vw, 3rem)` heading at line-height 1.2) still styles pages with no layout of their own, such as the fallback the entry page shows a portfolio visitor without JavaScript.

## Elevation & Depth

Flat. There are no shadows, glows, blurs or gradients. Depth is tonal only: Blue-Black Ground, Dim Bar, Slate Hairline, Slate Secondary, Frost Body and Ice White form a value ladder, and an element's importance is its step on that ladder. Layering is limited to the masthead sitting above the grid with `z-index: 1`.

### Named Rules
**The Value Ladder Rule.** To make something recede, step it down the ladder; to bring it forward, step it up. Never add a shadow or a lighter surface panel.

## Shapes

Every corner is square (0px). Form comes from solid rectangles and 1px or 3px rules set strictly horizontal or vertical: the opening bar, the dim bar, the spine hairline, the hairline over the role column, the 3px cyan rule above a group of links (6px over a hovered profile link), and the 3px underline on the current language. The favicon takes its curves from the display lettering. The official LinkedIn and GitHub marks retain the forms their owners supply.

### Named Rules
**The Right Angle Rule.** Bars and rules run at 0° or 90° and end square. Thickness carries hierarchy: 1px hairlines for structure, 3px for interactive framing, solid bars for the composition's anchors.

## Components

### Portfolio Favicon

The C sits one step above and to the left of the G, echoing the two lines of the Latin-script display name. Both initials use Ice White on a square Blue-Black Ground. The gap between the letters keeps them distinct at browser-tab size.

- `public/favicon.svg` is the master artwork. The portfolio owner selected the “Compact step” concept from image-generated studies based on the site's Jost 700 nameplate. The two outlines were redrawn as SVG paths and spaced for 16×16 display.
- `public/favicon.ico` contains 16×16, 32×32 and 48×48 rasterizations of the SVG. Sharp rendered each size and Pillow packaged them into the ICO for the browser's default icon request.
- `public/apple-touch-icon.png` is an opaque 180×180 PNG rendered from the same SVG with Sharp.

### Language Switch
Quiet, typographic, top-right.
- **Style:** each language's autonym in its own script, Label type in Ice White, no underline, a 3px transparent bottom border, 1.75rem apart. Start padding equal to the tracking balances the trailing letter space, so the border overhangs both ends of the word equally.
- **Hover:** border turns Slate Secondary over 200ms on the shared ease-out.
- **Current:** a 3px Ice White underline laid over the border; `aria-current="page"`. When the visitor switches language, the cross-document view transition carries the underline to the other autonym over 300ms on the shared ease-out.
- **Focus:** 3px solid Ice Cyan outline, 6px offset.
- **Reduced motion:** transition off, and the underline does not travel.
- **Forced colours:** the bottom border is removed, because a contrast theme would draw the transparent border under every autonym; the current-language underline is drawn in the theme's link colour (`LinkText`) and is the only line.

### Links on a Rule
The shared pattern for a page's way onward, set as type on a rule rather than as buttons.
- **Structure:** a 3px Ice Cyan rule above a wrapping row; each link is a Title-size name in Ice Cyan, or an official mark (Profile Links, below). No fill, no border, no radius, no arrow, no secondary line.
- **Hover:** the name underlines.
- **Focus:** 3px solid Ice Cyan outline, 5px offset.
- **Uses:** the home's profile links (marks, below) and the 404's home links ("English Home", 「日本語のホーム」), which are names.

### Profile Links
The home's call to action: Links on a Rule where each link is its company's official mark alone, with no name beside it (ADR 0003 records why and the brand terms behind it).
- **Mark:** the official white mark, 2rem tall (never below the 21px floor), width following its own proportions, decorative and hidden from assistive tech; the link's accessible name comes from interface text.
- **Clear space:** one mark height (`mark-clear-space`) on every side holds only the ground. Each link's box is the mark plus that clear space, so the rule sits one mark height above the mark, neighbouring marks sit two clear spaces apart, and every link is 96px tall.
- **Hover:** the link's segment of the rule thickens from 3px to 6px, upward, away from the clear space, over 200ms on the shared ease-out. Under forced colours the segment is drawn in the theme's link colour (`LinkText`).
- **Focus:** 3px solid Ice Cyan outline drawn on the edge of the clear space (inset 3px into the link's box), not 5px from the mark.
- **Print:** the mark is left out and the link prints its address (the URL without scheme, `www` or trailing slash, with a non-Latin path in its own script) in Title type on the rule, so a printed page still shows the way to each profile and a saved PDF keeps the link. The mark and the address never appear together (ADR 0003).
- **Provenance:** both files live in `src/assets/profile-link-marks/` and ship unmodified; both were downloaded 2026-11-22.
  - `GitHub_Invertocat_White.svg`: byte-for-byte from GitHub's official logo package (https://brand.github.com/GitHub_Logos.zip, `GitHub Logos/SVG/GitHub_Invertocat_White.svg`), inlined as-is. Guidelines: https://brand.github.com/foundations/logo.
  - `InBug-White.png`: byte-for-byte from LinkedIn's official in-logo package (https://content.linkedin.com/content/dam/me/business/en-us/amp/xbu/linkedin-revised-brand-guidelines/logos/in-logo.zip, `in-logo/InBug-White.png`, 840×779, including its ®; LinkedIn ships no SVG), served as-is with no resizing. Guidelines: https://brand.linkedin.com/in-logo.

### Inline Links
Ice Cyan text with the browser underline offset 0.2em; focus is a 3px Ice Cyan outline at 5px offset.

### Spine Name
The signature device on the Japanese page: the Latin name, hidden from assistive tech as a duplicate, runs vertically up a full-height hairline between the Japanese name and the role column. On narrow screens it lies flat beneath the name over a hairline.

## Do's and Don'ts

### Do:
- **Do** build structure from solid bars and 1px/3px rules at 0° and 90°, ending square.
- **Do** keep Ice Cyan for pressable elements, their framing rule, focus rings and selection.
- **Do** size the display name with the container-query formula and per-script advance (0.7 Latin, 1.05 Japanese), capped at 10.75rem Latin and 8.25rem Japanese, with each name line unbroken.
- **Do** switch face, weight, leading and tracking by `:lang()`; give Japanese `line-break: strict` and `word-break: auto-phrase`.
- **Do** use a 3px Ice Cyan outline with a 5–6px offset for every focus state; a profile link draws it on its clear-space edge instead.
- **Do** run state transitions at 200ms on `cubic-bezier(0.16, 1, 0.3, 1)` and turn them off under `prefers-reduced-motion`.
- **Do** let the home page's bars slide in from the left edge on load (the opening bar over 700ms; the Dim Bar over 600ms after 120ms, on the shared ease-out) while the type stays still, and crossfade between languages with a cross-document view transition that carries the current-language underline to the other autonym; turn both off under `prefers-reduced-motion`.
- **Do** print in ink: turn the value ladder over on white paper, print the bars solid, leave out controls that only work on screen, and print an address wherever a link shows only a mark.
- **Do** put a page's onward links on a 3px Ice Cyan rule as Title-size cyan names or official marks, using the shared links-on-rule pattern.
- **Do** show a profile link as its official mark alone (ADR 0003): the owner's file unmodified, 2rem tall, with one mark height of empty clear space on every side.

### Don't:
- **Don't** round corners, or add shadows, glows, gradients or grain; depth is a step on the value ladder.
- **Don't** use Ice Cyan on static text, headings or decorative bars.
- **Don't** introduce a neutral off the cool blue-slate hue.
- **Don't** uppercase or widely track Japanese text; tracking above 0.08em and uppercase transforms are Latin-only.
- **Don't** wrap content in cards or filled panels; content sits directly on the ground, separated by rules.
- **Don't** set Slate Hairline or Dim Bar as a text colour.
- **Don't** recolour, redraw or resize-and-re-export an official mark; keep its name, rules and state indicators outside its clear space.
