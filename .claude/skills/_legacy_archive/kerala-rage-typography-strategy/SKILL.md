---
name: kerala-rage-typography-strategy
description: Apply "Agit-Prop / Viscous Fluidity" Kerala Rage typography using Variable
  and Recursive fonts. Orchestrates the Interaction Trinity within the single "Solidarity"
  mode, with dynamic axes (wght, slnt, CASL) for Agit-Prop aesthetic.
metadata:
  legacy_frontmatter:
    version: 2.0.0
    tags:
    - typography
    - kerala-rage
    - variable-fonts
---

## Purpose

Orchestrates the Kerala Migrant Rage "Agit-Prop" typography system using variable fonts. All typography serves the single "Solidarity" mode.

## When to Use

- When designing or implementing UI sections that require the Kerala Rage Agit-Prop aesthetic.
- When applying dynamic font axes (wght, slnt, CASL) for interactive or "living" text.
- When pairing brutalist headers with functional typography to balance rage and utility.

## Process

1. **Tier Identification**: Assign typography to one of three tiers (Workhorse, Expressive, Accent).
2. **Axis Manipulation**:
   - Use `GRAD` for layout-safe hover effects.
   - Use `SOFT` and `WONK` for "kerala-streetprint" personality in headers.
   - Map `wdth` to interactions for "breathing" text.
3. **Drafting**: Apply the "Dramatic Juxtaposition" strategy for script flourishes.
4. **Verification**: Check against the Anti-Patterns list (no system fonts, no weight shifts on hover).

## The Core Trinity (Solidarity Tiers)

### 1. Primary "Solidarity" (Headlines & Agit-Prop)

**Role**: The "Voice of the Union". High-impact, undeniable presence.
**Font**: **Inter Variable** (Display).
**Weight**: **900 (Black)**.
**Playfulness Strategy**:

- **Scroll Pressure**: Increase `wght` from 700 -> 900 on scroll.
- **Viscous Fluidity**: Use `cubic-bezier(0.34, 1.56, 0.64, 1)` for weight transitions.

### 2. Secondary "Direct Action" (UI & Controls)

**Role**: Functional, clear, ready for work.
**Font**: **Inter Variable** (Text).
**Weight**: **400-600**.
**Strategy**:

- **Clarity**: High legibility for tools and data.
- **Urgency**: Use **Red (#F14714)** for active states.

### 3. Tertiary "Code" (Technical)

**Role**: The "Intellectual / Cyberpunk" layer.
**Font**: **Recursive** (Monospace/Sans Hybrid).
**Strategy**:

- **Casual Axis (`CASL`)**: Animate `CASL` from 0 (Code) to 1 (Human) on hover.
- **Slant (`slnt`)**: Use `-15deg` for "Urgent" annotations.

---

## The "Dramatic Juxtaposition" Strategy

_How to mix Cursive with Clean for "Maximum Playfulness"._

1. **The "Check signature"**: Use _Birthstone Bounce_ (Variable) for specific metadata (e.g., "Verified by Claude") against a strict grid of _Lora_.
   - _Why?_ It feels like a human signing a machine-generated document.
2. **The "Interrupting Thought"**: Use Script font for <code>&lt;aside&gt;</code> notes that break the layout grid.
   - _Why?_ Visualizes the "Author's Voice" interrupting the "System's Data".
3. **Motion**: Animate the `wght` (Weight) of the script font on scroll to simulate "ink drying" or pressure applied to the page.

---

## Variable Axis Strategy (The "How-To")

### 1. The Registered Axes (Standard)

| Axis        | Tag    | Kerala Rage Usage                                                                       |
| ----------- | ------ | --------------------------------------------------------------------------------------- |
| **Weight**  | `wght` | **Extreme Contrast**. Use `100` (Hairline) vs `900` (Black). Avoid middle weights.      |
| **Slant**   | `slnt` | **Urgency**. Use `-10` to `-15` for "Shouted" text or urgent alerts.                    |
| **Optical** | `opsz` | **Always Auto**. css: `font-optical-sizing: auto;`.                                     |
| **Casual**  | `CASL` | **Recursive Only**. `CASL: 1` for "Human/Handwritten" feel, `CASL: 0` for "Robot/Code". |

### 2. The Custom Axes (Agit-Prop)

| Axis        | Tag    | Font      | Effect                                                                         |
| ----------- | ------ | --------- | ------------------------------------------------------------------------------ |
| **Cursive** | `CRSV` | Recursive | `CRSV: 1` enables "Schoolbook" style (simplified). Use for instructional text. |
| **Mono**    | `MONO` | Recursive | `MONO: 1` for Code/Data, `MONO: 0` for Human UI. Animate between them.         |

---

## Technical Implementation Patterns

### Pattern 1: Layout-Safe "Breathing" Button

_Standard boldness shifts break layouts. Grade (`GRAD`) does not._

```css
.kerala-rage-button {
  font-family: "Lora Variable", serif;
  font-weight: 500;
  font-variation-settings: "GRAD" 0;
  transition: font-variation-settings 0.3s ease;
}

.kerala-rage-button:hover {
  /* Text gets "heavier" visually, but occupies exact same pixel width */
  font-variation-settings: "GRAD" 150;
  cursor: pointer;
}
```

### Pattern 2: The "Living" Header (React + Framer Motion)

_Map scroll to Width/Wonk for "alive" text._

```tsx
<motion.h1
  style={{
    fontFamily: "Fraunces Variable",
    fontVariationSettings: `'wdth' ${scrollP * 0.5 + 100}, 'WONK' 1`,
  }}
>
  The Curator's Collection
</motion.h1>
```

### Pattern 3: Color Font Palette Switching

_kerala-streetprint Day -> Cyberpunk Night._

```css
@font-palette-values --kerala-rage-sepia {
  font-family: "Nabla";
  base-palette: 0; /* Default */
  override-colors:
    0 #4a3b32,
    1 #d4c5b0; /* Brown/Cream */
}

@font-palette-values --kerala-rage-neon {
  font-family: "Nabla";
  base-palette: 1;
  override-colors:
    0 #ff00ff,
    1 #00ffff; /* Magenta/Cyan */
}

.hero-accent {
  font-family: "Nabla";
  font-palette: var(--current-palette, --kerala-rage-sepia);
  transition: font-palette 0.5s;
}
```

---

## Typography Emotion Dimensions (Revised)

| Dimension             | Implementation                                                    |
| --------------------- | ----------------------------------------------------------------- |
| **Worker Power**      | `Inter`, `wght: 900`, `tight tracking` (Solid, Unmovable)         |
| **Migrant Theory**    | `Recursive`, `CASL: 1`, `MONO: 0` (Intellectual, Human, Adaptive) |
| **Urgent Revolution** | `Inter`, `slnt: -10`, `color: #F14714` (Shouting, Fast)           |
| **System Control**    | `Recursive`, `MONO: 1`, `wght: 400` (Technical, Precise)          |

---

## Anti-Patterns (What NOT to do)

❌ **Static Font Files**: Do not import `Lora-Bold.ttf`. Use `Lora-Variable.ttf`.
❌ **Weight Shifts on Hover**: `font-weight: bold` on hover causes "layout jump". Use `GRAD` instead.
❌ **Axis Overload**: Don't animate `wght`, `wdth`, `slnt`, and `opsz` all at once. "Visual Chaos" != Expressive.
❌ **System Fonts**: New kerala-rage standard **bans** usage of system fonts for "Workhorse" tier.

---

## Typography-Voice Alignment

Typography tiers reinforce the voice tier system defined in [DOC-006](file:///Users/okgoogle13/Desktop/careercopilot/docs/archive/atomic-v2/DOC-006_Voice_and_Microcopy.md):

| Typography Tier           | Font                      | Voice Tier                      | Copy Style                  |
| :------------------------ | :------------------------ | :------------------------------ | :-------------------------- |
| **Workhorse (Lora)**      | Primary body/UI           | Tier 1 (Functional)             | Clear, direct labels        |
| **Expressive (Fraunces)** | Display headers           | Tier 2-3 (Contextual/Character) | Playful, kerala-streetprint          |
| **Accent (Script/Color)** | Annotations, celebrations | Tier 3 (Character)              | Flourishes, "human" touches |

**Rule**: If the typography is Workhorse (Lora/Work Sans), the copy should be Tier 1 (functional). Personality flourishes belong with Expressive typography.

---

## Checklist for Implementation

1.  **Load Variable Files**: Ensure `Inter-Variable.woff2` and `Recursive-Variable.woff2` are loaded.
2.  **Define CSS Tokens**:
    ```css
    --sys-typescale-display-large-font: "Inter Variable";
    --sys-typescale-display-large-variations: "wght" 900;
    --sys-typescale-body-large-font: "Recursive";
    ```
3.  **Enable Optical Sizing**: Global CSS `html { font-optical-sizing: auto; }`.
4.  **Verify Dark Mode**: Ensure text contrast passes APCA/WCAG on `#1A1714` (Charcoal).
