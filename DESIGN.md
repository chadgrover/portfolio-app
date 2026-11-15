---
name: Portfolio
description: A bilingual developer portfolio set as a dark phosphor terminal on a single cell grid.
colors:
  black-glass: "#020507"
  phosphor-blue: "#39c8ff"
  phosphor-trace: "#7fdcff"
  phosphor-white: "#e6fbff"
  dormant-cell: "#0e2c3c"
  mark-tile-white: "#ffffff"
typography:
  display:
    fontFamily: "Misaki Gothic 2nd, drawn as lit cells at build time (no font file)"
    fontSize: "1 glyph pixel = 1 cell (var(--u))"
    lineHeight: "glyph height in cells, 2 cells between lines"
  headline:
    fontFamily: "Azeret Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "max(1.125rem, calc(var(--u) * 1.15))"
    fontWeight: 500
    lineHeight: "round(up, max(2 * var(--u), 1.5em), var(--u))"
    letterSpacing: "0.02em"
  body:
    fontFamily: "Azeret Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "max(1rem, calc(var(--u) * 0.7))"
    fontWeight: 500
    lineHeight: "round(up, max(2 * var(--u), 1.5em), var(--u))"
    letterSpacing: "0.08em"
  label:
    fontFamily: "Azeret Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "max(1rem, calc(var(--u) * 0.68))"
    fontWeight: 500
    letterSpacing: "0.08em"
  field:
    fontFamily: "Azeret Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "calc(var(--u) * 0.5)"
    fontWeight: 500
    lineHeight: 1
rounded:
  none: "0"
spacing:
  cell: "min(100cqi / 60, 100svh / 32)"
  cell-narrow: "min(100cqi / 52, 100svh / 32)"
  control: "round(up, max(2 * var(--u), 2.5rem), var(--u))"
  stack-gap: "calc(2 * var(--u))"
  inline-gap: "var(--u)"
  margin: "calc(4 * var(--u))"
  margin-narrow: "calc(2 * var(--u))"
components:
  block-control:
    backgroundColor: "{colors.black-glass}"
    textColor: "{colors.phosphor-white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "{spacing.control}"
  block-control-current:
    backgroundColor: "{colors.phosphor-blue}"
    textColor: "{colors.black-glass}"
    rounded: "{rounded.none}"
    height: "{spacing.control}"
  block-control-hover:
    backgroundColor: "{colors.phosphor-blue}"
    textColor: "{colors.black-glass}"
  lit-cell:
    backgroundColor: "{colors.phosphor-blue}"
    textColor: "{colors.black-glass}"
    typography: "{typography.field}"
    size: "{spacing.cell}"
  lit-cell-hover:
    backgroundColor: "{colors.phosphor-white}"
  dormant-cell:
    textColor: "{colors.dormant-cell}"
    typography: "{typography.field}"
    size: "{spacing.cell}"
  mark-tile:
    backgroundColor: "{colors.mark-tile-white}"
    width: "calc({spacing.control} - 2px)"
---

# Design System: Portfolio

## Overview

**Creative North Star: "The Phosphor Wake"**

The page is a dark terminal screen. Its background is a full grid of faint code characters that sit almost invisible until the pointer passes over them; each touched cell flares and then settles back over a few seconds, like persistence on an old phosphor tube. The name is not set in a font. It is drawn out of that same grid as solid lit cells, so the identity and the screen are one material. Everything else is plain, real text in a monospace voice.

Density is low and deliberate: one column, one left edge, a handful of elements spaced in whole cells. The register is late-twentieth-century screen graphics and developer tooling, carried entirely by grid, glow and colour, never by borrowed imagery. The system is dark only and uses a single hue family, so it reads the same way to English and Japanese visitors.

**Key Characteristics:**
- One cell unit (`--u`) measures every position, size and gap on the page.
- One phosphor hue (blue) in four steps on a near-black ground; no second accent.
- Display lettering is lit cells from an 8×8 bitmap face; all other text is live text.
- Square, outlined controls that invert to solid phosphor when current or hovered.
- Motion is CSS only, short, and fully disabled under reduced motion.

## Colors

A single blue phosphor family glowing on black glass, plus one white reserved for third-party marks.

### Primary
- **Phosphor Blue** (`phosphor-blue`): lit name cells, control outlines, the filled state of current and hovered controls, link colour, the prompt mark and text selection. It is the colour of anything that is "on".

### Secondary
- **Phosphor Trace** (`phosphor-trace`): the waking colour only. A dormant cell under the pointer, or a drifting cell on touch screens, switches to this tint with a 12% fill of the same tint behind it, then decays back.

### Neutral
- **Black Glass** (`black-glass`): the ground of every page and the resting fill of controls. Also the text colour on inverted controls and the hairline gap drawn inside each lit cell.
- **Phosphor White** (`phosphor-white`): all running text (prompt, role, control labels, 404 copy) and the focus ring. Lit cells flash to it on hover.
- **Dormant Cell** (`dormant-cell`): the field characters at rest, and the scrollbar thumb. Present everywhere, legible nowhere until woken.
- **Mark Tile White** (`mark-tile-white`): the square tile behind official third-party marks. Used for nothing else.

### Named Rules
**The One Phosphor Rule.** Every colour on the page is a step of the blue phosphor family or the black ground. Do not add a second hue. Red is excluded outright: it reads as alarm in both languages, and a living person's name is not written in red in Japan.

**The Dark Only Rule.** `color-scheme: dark` is the only scheme. There is no light theme and no theme toggle.

## Typography

**Display Font:** Misaki Gothic 2nd (8×8 bitmap), rendered as cells at build time; never shipped as a font file
**Body Font:** Azeret Mono 500, self-hosted Latin subset with a Latin-only `unicode-range` (falls back to ui-monospace, SFMono-Regular, Menlo, Consolas)
**Japanese:** system gothic (Hiragino Sans, Hiragino Kaku Gothic ProN, Yu Gothic, Noto Sans JP, Meiryo), with strict line breaking and phrase-aware word breaking

**Character:** A blocky bitmap wordmark against a wide, evenly tracked monospace. The bitmap face carries identity; the monospace carries information and stays fully selectable, zoomable and translatable.

### Hierarchy
- **Display** (lit cells, one glyph pixel per cell, 2 cells between lines): the portfolio owner's name on the home page and the status code on the 404 page. Latin input is mapped to full-width forms before lookup, so English and Japanese names are drawn at the same pixel scale.
- **Headline** (500, role size, whole-cell line height, 0.02em): the role line on the home page and the 404 headings.
- **Body** (500, prompt size, whole-cell line height, 0.08em): the `whoami` prompt and 404 explanatory text.
- **Label** (500, control size, 0.08em; 0.06em in the language switch): text inside block controls.
- **Field** (500, half a cell, line height 1): dormant field characters and the character shown inside a lit cell. Lit-cell characters are hidden below 60rem wide or 32rem tall, where they would be too small to read.

### Named Rules
**The Cells Are Only For Display Rule.** Only the name and other display lettering are drawn as cells. The role and every other line stay real text in Azeret Mono or system gothic, so they meet WCAG 1.4.4 (resize text) and 1.4.5 (images of text). The lettering itself is `aria-hidden`, with the real name in a visually hidden heading.

**The Content Breaks Lines Rule.** Line and phrase breaks come from per-language content (`displayNameLines`, `rolePhrases`). Code never splits a name or a role; it only inserts break opportunities between the phrases content supplies.

**The Whole Cell Rule.** Text line heights round up to whole cells (at least 2 cells, at least 1.5em), so every line box lands back on the grid.

## Layout

One cell grid rules the page. The cell `--u` is the smaller of the container width divided by the column count and the small viewport height divided by 32, so the whole first screen scales down together on short laptops instead of scrolling.

- **Columns:** 60 columns with 4-column side margins at 40rem and wider; below 40rem, 52 columns with 2-column margins.
- **Content box:** its width rounds down to whole cells and centres, so the content grid and the dormant field share cell boundaries.
- **Column:** a single left-aligned column. The language switch is the one element pushed to the right edge, alone in the top rows.
- **Vertical rhythm:** 1 cell of top padding, then 2 cells between stacked elements (prompt, name, role, links), 3 cells at the foot.
- **Inline rhythm:** sibling controls in a row (profile links, 404 home links) sit 1 cell apart; the language switch blocks touch and share their border.
- **Controls:** at least 2 cells tall and at least 2.5rem, rounded up to whole cells; hit areas extend to at least 44px.
- **Reflow:** flex rows wrap, `overflow-wrap: anywhere` on the body, and minimum rem sizes on all live text keep the page usable at 320px and at 200% text size.

### Named Rules
**The Whole Cell Rule (layout).** Every element measures whole cells. If a value cannot be expressed as a multiple of `--u` (or rounded up to one), it does not belong in this system.

## Elevation & Depth

The system is flat. Depth comes from light, not from stacking: the dormant field sits behind a transparent content layer, and the only shadow in the system is the phosphor bloom around lit cells, a soft blue glow with no offset (`0 0 0.7u`, phosphor blue at 45%), paired with an inset hairline of ground colour that separates neighbouring cells. Controls and surfaces cast nothing.

### Named Rules
**The Glow Not Shadow Rule.** Depth is emitted light around lit cells only. No offset shadows, no layered cards, no blur panels.

## Shapes

Every shape is a square or a rectangle of whole cells with zero radius. Borders are 1px phosphor-blue hairlines on controls. The lit cell is a solid square with an inner ground-coloured hairline, which keeps the bitmap readable as discrete pixels rather than a merged blob.

## Components

### Block Control (buttons, links, language switch)
Outlined blocks that read as terminal keys.
- **Shape:** square corners (0), 1px phosphor-blue border, height of one control (2 cells minimum).
- **Rest:** black-glass fill, phosphor-white label in the label style.
- **Current / Hover:** fills solid phosphor blue with black-glass text. `aria-current="page"` drives the current state.
- **Focus:** 2px phosphor-white outline, 3px offset.
- **Hit area:** an invisible extension above and below brings the target to at least 44px without changing the drawn block.

### Language Switch
Two block controls side by side at the top right, overlapping by one border so they read as a single segmented block. Each label carries its own `lang` and `hreflang`; the current language is filled. Width rounds up to whole cells.

### Profile Link
A block control with the platform's official mark, unmodified, centred at 62% on a white square tile flush to the left edge, and the platform name to its right with 1 cell of inline padding.

### Dormant Field (signature)
A full-bleed grid of single characters, one per cell, in dormant-cell colour, hidden from assistive technology and search snippets.
- **Pointer wake (hover-capable devices):** a hovered cell lights instantly in phosphor trace over a 12% trace fill, then decays over 3s on a fast-out curve (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Touch drift (no hover):** a sparse subset of cells pulses once each on load, staggered, and the field is still within 5s.

### Cell Lettering (signature)
The name drawn as lit cells, one bitmap pixel per cell, each lit cell showing a field character in black glass.
- **Load:** each line sweeps on left to right once, in steps of one column, after a short delay.
- **Hover:** a lit cell flashes to phosphor white and decays back over 3s.
- **Known gap:** a lit cell does not yet show the exact character of the field cell it covers (issue #23).

### Prompt Line
A phosphor-blue `›` mark followed by `whoami` set as English code, even on the Japanese page.

## Do's and Don'ts

### Do:
- **Do** size and place everything in whole cells of `--u`: 2-cell controls, 2-cell vertical gaps, line heights rounded up to the cell.
- **Do** keep motion in CSS with zero first-party JavaScript, and turn all of it off under `prefers-reduced-motion: reduce`, leaving the name fully lit.
- **Do** draw display lettering from Misaki Gothic 2nd at build time, mapping Latin to full-width forms.
- **Do** take name and role breaks from per-language content, never from code.
- **Do** show third-party marks as official artwork, unmodified, on the white mark tile.
- **Do** give every interactive target at least 44px of hit area.

### Don't:
- **Don't** add a light theme or a second hue; never use red.
- **Don't** render the role, body copy or any control label as cells or as an image of text.
- **Don't** ship Misaki Gothic 2nd, or any Japanese web font, as a font file.
- **Don't** round corners or add offset shadows; the only depth is the lit-cell glow.
- **Don't** add JavaScript-driven animation, looping motion, or touch motion that runs past 5s.
