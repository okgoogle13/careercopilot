---
name: wireframe-annotator
description: Generate annotated ASCII wireframes based on the "Annotated Wireframe
  Protocol". Bridges the gap between high-level specs and developer-ready implementation
  guidance. Outputs structured XML blocks with layout, tokens, accessibility, states,
  and asset placement — aligned to Kerala Rage kr-solidarity design system.
metadata:
  version: 3.0.0
  tags:
    - wireframing
    - design
    - spec-generation
    - design-to-code
    - kerala-rage
---

# Wireframe Annotator Skill (v3.0)

## Purpose

Consume high-level feature briefs or the **Annotated Wireframe Protocol** (from `design-system-doc-generator`) and output detailed, developer-ready annotated wireframes. Translates design intent into concrete ASCII layout diagrams with explicit Kerala Rage kr-solidarity token mappings, component archetype assignments, and asset placement slots.

---

## When to Use

- After design system documentation is complete (`design-system-doc-generator`)
- Before component spec generation (`component-spec-generator`)
- When translating design specs into developer-ready layouts
- When defining screen structure, token mapping, and asset slot assignments

---

## Process

1. **Parse Input**: Read feature brief, Annotated Wireframe Protocol, and any upstream design docs
2. **Assign Archetypes**: Map each UI element to a kr-solidarity archetype (Seed/Pebble/Lens/Jar/Cabinet/Stone)
3. **Generate ASCII Layout**: Visual text representation using `[ ]`, `| |`, `+--+` notation
4. **Add Token Annotations**: Map `--sys-color-*`, `--sys-type-*`, `--sys-shape-*` tokens to each element
5. **Define Asset Placement**: Specify coordinates, z-index layer (Z-0 through Z-3+), and `TODO[asset]` slots
6. **Accessibility Audit**: Define focus order, keyboard navigation patterns, and ARIA landmarks
7. **Define State Behaviors**: Document Empty, Loading, Error, and Disabled states
8. **Output Wireframe**: Produce developer-ready wireframe markdown using XML-structured blocks

---

## Kerala Rage Component Archetypes

Every element in the wireframe MUST be assigned an archetype:

| Archetype | Purpose | Token Shape |
|---|---|---|
| **Seed** | Atomic: button, chip, badge | `40px 12px 40px 12px` |
| **Pebble** | Linear: stacked chips, progress | `20px 6px 20px 6px` |
| **Lens** | Focal: modal, popover, drawer | `24px 8px 20px 8px` |
| **Jar** | Frame: card, list item, panel | `32px 8px 28px 12px` |
| **Cabinet** | Complex: grid, multi-column | flat / structural |
| **Stone** | Structural: divider, spacer | none / minimal |

---

## Token Reference for Annotations

### Colors (`--sys-color-*` only — no hardcoded hex)

```
--sys-color-asphaltBlack    → Global floor, dark backgrounds (#1A1714)
--sys-color-paperWhite      → Text on dark (#F5F0E8)
--sys-color-kr-ink-gold     → Primary brand (#D4A84B)
--sys-color-waratahRed      → Secondary brand, urgent (#C45C4B)
--sys-color-ochreEarth      → Tertiary, grounded (#B8733D)
--sys-color-gumLeafGreen    → Natural accent (#6B7F6E)
--sys-color-concreteGrey    → Neutral, disabled (#A39B8F)
--sys-color-primary-10      → Dark surface container (#2A1F0B)
--sys-color-primary-40      → Mid container (#8B7A35)
--sys-color-primary-90      → Light surface (#FFF8EB)
```

### Typography (`--sys-type-*`)

```
--sys-type-font-fraunces    → Headlines, hero (wght 700, variable SOFT/WONK)
--sys-type-font-work-sans   → Body, UI labels (wght 400–600)
--sys-type-font-mono        → Code, data values (wght 400–600)
```

### Asset Z-Index Layers

```
Z-0    → Substrate / base texture (background canvas)
Z-1–2  → Atmospheric / motif overlays
Z-3+   → UI foreground accents and focal cues
```

---

## Output Structure per Screen

MUST wrap output in structured XML tags for machine-readability:

### `<layout>`
ASCII visual representation using `[ ]`, `| |`, `+--+` notation.
Each element labelled with archetype, e.g. `[SEED: CTA Button]`.

### `<tokens>`
Explicit mapping of `--sys-color-*`, `--sys-type-*`, `--sys-shape-*` tokens per element.
No hardcoded hex. All token references validated against `tokens.json`.

### `<accessibility>`
- Focus order (Tab sequence)
- Keyboard navigation patterns
- ARIA landmarks (`role="main"`, `aria-label`, etc.)
- Screen reader structure

### `<states>`
- **Empty**: What renders when no data
- **Loading**: Skeleton or spinner variant
- **Error**: Error message presentation
- **Disabled**: Greyed-out interaction state

### `<assets>`
- Asset placement slots with z-index layer, token reference, and `TODO[asset]` markers
- Format: `slot_name [Z-n]: asset_id OR TODO[asset]` with token

---

## Example Wireframe Output

```markdown
# Landing Page Hero — Annotated Wireframe

<layout>
+------------------------------------------------------------------+
| [STONE: TopNav divider]                                          |
|  [SEED: Logo]          [SEED: Nav links]    [SEED: CTA Button]  |
+------------------------------------------------------------------+
|                                                                  |
|  [CABINET: Hero Grid — 2 col]                                   |
|  +----------------------------+  +---------------------------+  |
|  | [JAR: Hero Content Panel]  |  | [JAR: Hero Visual Panel]  |  |
|  |                            |  |                           |  |
|  |  [PEBBLE: Eyebrow label]   |  |  KR asset hero (Z-0)      |  |
|  |  [SEED: H1 Headline]       |  |  Atmospheric overlay(Z-1) |  |
|  |  [PEBBLE: Subhead]         |  |  UI accent (Z-3)          |  |
|  |                            |  |                           |  |
|  |  [SEED: Primary CTA]       |  |                           |  |
|  |  [SEED: Secondary CTA]     |  |                           |  |
|  +----------------------------+  +---------------------------+  |
|                                                                  |
+------------------------------------------------------------------+
| [JAR: Feature strip — 3 cols]                                   |
|  [JAR: Feature 1]    [JAR: Feature 2]    [JAR: Feature 3]       |
+------------------------------------------------------------------+
</layout>

<tokens>
TopNav:
  background: --sys-color-asphaltBlack
  border-bottom: 1px solid --sys-color-concreteGrey

Logo:
  color: --sys-color-kr-ink-gold
  font-family: --sys-type-font-fraunces
  font-variation-settings: "wght" 700

Nav links:
  color: --sys-color-paperWhite
  font-family: --sys-type-font-work-sans
  font-weight: 400

CTA Button (Seed):
  background: --sys-color-kr-ink-gold
  color: --sys-color-asphaltBlack
  border-radius: 40px 12px 40px 12px
  font-family: --sys-type-font-work-sans
  font-weight: 600

Hero Content Panel (Jar):
  background: --sys-color-primary-10
  border-radius: 32px 8px 28px 12px

H1 Headline (Seed):
  font-family: --sys-type-font-fraunces
  font-variation-settings: "wght" 900, "SOFT" 80, "WONK" 1
  color: --sys-color-paperWhite

Subhead (Pebble):
  font-family: --sys-type-font-work-sans
  font-weight: 400
  color: --sys-color-concreteGrey

Secondary CTA (Seed):
  border: 1px solid --sys-color-waratahRed
  color: --sys-color-waratahRed
  border-radius: 40px 12px 40px 12px

Feature Cards (Jar):
  background: --sys-color-primary-10
  border-radius: 32px 8px 28px 12px
  border: 1px solid --sys-color-concreteGrey
</tokens>

<accessibility>
Focus order:
  1. Logo (skip-to-content link)
  2. Nav links (Tab through)
  3. Primary CTA
  4. Secondary CTA
  5. Feature cards (Tab through, Enter to activate)

ARIA landmarks:
  role="banner" → TopNav
  role="main" → Hero + Feature sections
  aria-label="Primary navigation" → Nav links
  aria-label="Get started with CareerCopilot" → Primary CTA

Keyboard:
  Tab: moves focus forward
  Shift+Tab: moves focus backward
  Enter/Space: activates buttons
  Esc: dismisses any Lens (modal/popover)
</accessibility>

<states>
Loading:
  - H1 replaced with Fraunces skeleton (pulsing --sys-color-primary-40)
  - CTA buttons show spinner, disabled state (opacity: 0.4)
  - Feature cards show grey skeleton blocks

Empty:
  - N/A for Landing — static content

Error:
  - If hero asset fails to load: fallback to --sys-color-primary-10 background
  - If nav data fails: show cached nav links

Disabled:
  - CTA buttons: opacity 0.4, cursor: not-allowed
  - color: --sys-color-concreteGrey
</states>

<assets>
hero_background [Z-0]:
  - TODO[asset]: Select from KR-SOLID-021 to KR-SOLID-030 (devotional/16:9)
  - token: --sys-color-asphaltBlack (fallback)
  - layer: substrate

hero_overlay [Z-1]:
  - TODO[asset]: Abstract motif overlay
  - token: --sys-color-primary-40
  - opacity: 0.6
  - layer: atmospheric

hero_accent [Z-3]:
  - asset_id: KR-UI-016 (corner accent SVG)
  - token: --sys-color-kr-ink-gold
  - placement: top-right corner
  - layer: ui-kit
</assets>
```

---

## Usage

```
"Generate annotated wireframe for [Screen Name] using [feature brief / Protocol File]"

Examples:
- "Generate annotated wireframe for the Dashboard screen"
- "Generate annotated wireframe for the Job Application form flow"
- "Generate annotated wireframes for all 3 onboarding steps"
```

---

## Integration

**Upstream (what feeds into this skill):**
- `design-system-doc-generator` — Produces Annotated Wireframe Protocol
- Feature briefs and user flow docs

**Downstream (what consumes this output):**
- `asset-placement-strategy` — Resolves `TODO[asset]` slots and scores placements
- `m3-expressive-ui-evaluator` — Evaluates M3 Expressive compliance of the wireframe
- `ui-design-evaluator` — Generates HiFi mockup from the annotated wireframe
- `component-spec-generator` — Transforms wireframe into React component specs

**Full pipeline:**
```
design-system-doc-generator
  → wireframe-annotator (this skill)
    → asset-placement-strategy (resolve TODO[asset])
    → m3-expressive-ui-evaluator (score + HiFi mockup)
    → component-spec-generator (TypeScript specs)
      → component-builder (production code)
      → component-transformer (migrate existing)
```

---

**Version:** 3.0.0 | **Last Updated:** 2026-02-28 | **Mode:** Solidarity Only
