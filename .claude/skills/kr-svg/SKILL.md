---
name: kr-svg
description: Generate Kerala Rage kr-solidarity UI primitive SVGs (strict tokens,
  organic asymmetry, 3-layer grouping). Output SVG only.
---

# KR SVG Generator (kr-solidarity)

## Goal
Create UI primitive SVGs for Kerala Rage kr-solidarity and save to:
`/frontend/public/assets/kr-solidarity/ui-kit/svg/{asset_id}.svg`

## Inputs
- asset_id (required): e.g. KR-UI-002
- name (required): human name
- intent (required): usage context (card/button/badge/tile/etc.)
- required_subgroups (optional): e.g. ["rest","active"]
- accent_usage (optional): where accent appears

## Output Contract (HARD)
Return **ONLY** a single valid `<svg>` element (no markdown, no prose).

### Canvas + A11y
- `viewBox="0 0 512 512"` (exact)
- Must include `<title>` and `<desc>`

### Required groups
Must include exactly these top-level groups (order ok):
- `<g id="base">`
- `<g id="content">`
- `<g id="accent">`

### Colors (STRICT)
Allowed fills/strokes ONLY:
- `var(--kr-surface)`
- `var(--kr-text)`
- `var(--kr-primary)`
- `var(--kr-secondary)`
- `var(--kr-tertiary)`

FORBIDDEN:
- Any `#` hex
- `rgb(` / `hsl(` / named colors

### Stroke rules
- Allowed `stroke-width`: `2 | 3 | 4 | 6` ONLY
- Must use `stroke-linecap="round"` and `stroke-linejoin="round"` wherever stroke is used

### Forbidden elements (STRICT)
Reject/regenerate if any of:
- `<image` `<text` `<tspan`
- `<filter` `<feGaussianBlur` (any filter)
- `<mask` `<pattern`
- `<foreignObject`
- external refs / linked stylesheets

## Style Rules (HARD-ISH)
Must feel “Kerala Rage / organic asymmetry”:
- Avoid perfect symmetry
- Avoid uniform radii everywhere
- Prefer slight offsets (2–10px), uneven rx/ry, imperfect circles (slightly off-center or ellipse/rounded path)
- Keep path count low; use simple geometry

If the SVG is technically valid but “sterile/symmetric”, REGENERATE once with:
- asymmetric margins
- uneven corner radii
- at least one imperfect/offset accent element

## Built-in Self-Check (SILENT)
Before output, verify:
- contains `viewBox="0 0 512 512"`
- contains `<title>` and `<desc>`
- contains `g id="base"`, `g id="content"`, `g id="accent"`
- no forbidden tokens: `#`, `rgb(`, `hsl(`, `<text`, `<filter`, `<mask`, `<pattern`, `<image`, `<foreignObject`
- all stroke-width ∈ {2,3,4,6}
- only allowed `var(--kr-*)` colors

If any check fails → regenerate (no explanation), then output SVG.

## Negative Examples (MUST REJECT)
### A) Hex + filter + text (reject)
- Any `#` or `<filter` or `<text` => regen.

### B) Wrong viewBox / missing groups / illegal stroke-width (reject)
- viewBox not 512/512 OR missing groups OR stroke-width=5 => regen.

### C) “Sterile symmetry” (soft reject => regen once)
- Perfect centered circle accent + uniform rx/ry + grid-perfect alignment => regen once with asymmetry.

## Generation Defaults
Unless intent demands otherwise:
- base: main container silhouette (rect/path) with stroke
- content: 2–6 placeholder blocks/lines (no text)
- accent: one small “seed/marker/fold” feature per accent_usage

## Examples (reference only; do not copy verbatim)
- Wheat Paste Tear: irregular torn edge contour, ripped poster feel — NOT a card/container
- Halo Disk: imperfect circle halo with inner arc ticks — NOT a button
- Screenprint Grit: sparse dots/specks for texture overlay — NOT a listing tile
- Blueprint Grid: thin technical grid lines with uneven offsets — NOT a document preview
- Charcoal Paper Substrate: subtle paper grain speckle — NOT a button primitive
- Blueprint Layout Watermark: faint layout rectangles/columns — NOT a drawer/sheet
- Screenprint Stamp: rough border + checkmark + abstract bars (no text) — NOT a slab container

CRITICAL: KR-UI primitives are texture/overlay/decoration elements, NOT UI card/tile layouts.
Do NOT generate card containers, button shapes, or listing tiles for these asset IDs.

## File Save
Write output to:
`/frontend/public/assets/kr-solidarity/ui-kit/svg/{asset_id}.svg`
