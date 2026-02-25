---
name: kerala-rage-typography-strategy
description: Apply "Maximum Expressive Playful" kerala-rage kr-solidarity typography
  using Variable and Color fonts. Orchestrates 3 interaction tiers (Workhorse, Expressive,
  Accent) with dynamic axes (GRAD, WONK, SOFT) for kerala-streetprint-meets-Cyberpunk
  aesthetic.
metadata:
  legacy_frontmatter:
    version: 1.0.0
    tags: []
---

## Purpose

Orchestrates the kerala-rage kr-solidarity "Maximum Expressive Playful" typography system using variable and color fonts across three interaction tiers (Workhorse, Expressive, Accent).

## When to Use

- When designing or implementing UI sections that require the kerala-rage kerala-streetprint-meets-Cyberpunk aesthetic.
- When applying dynamic font axes (GRAD, WONK, SOFT) for interactive or animated text.
- When pairing script fonts with functional typography to balance readability and personality.

## Process

1. **Tier Identification**: Assign typography to one of three tiers (Workhorse, Expressive, Accent).
2. **Axis Manipulation**:
   - Use `GRAD` for layout-safe hover effects.
   - Use `SOFT` and `WONK` for "kerala-streetprint" personality in headers.
   - Map `wdth` to interactions for "breathing" text.
3. **Drafting**: Apply the "Dramatic Juxtaposition" strategy for script flourishes.
4. **Verification**: Check against the Anti-Patterns list (no system fonts, no weight shifts on hover).

## The Core Trinity (Magic Number 3)

### 1. Primary "Workhorse" (Body & UI)

**Role**: High-readability, functional backbone for navigation and content.
**Font**: **Work Sans Variable**.
**M3 Category**: Baseline.
**Playfulness Strategy**:
- **Grade (`GRAD`)**: Use for layout-safe hover effects (swelling).
- **Scale Contrast**: Enforce 6× size ratio (12px body vs 72px+ display).

### 2. Secondary "Expressive" (Display & Headlines)

**Role**: The "Solidarity Voice". High impact and personality.
**Font**: **Fraunces Variable** (Hero Headlines) & **Libre Bodoni** (Proclamation).
**M3 Category**: Emphasized.
**Playfulness Strategy**:
- **Fraunces Softness/Wonk**: Animate `SOFT` (0-100) and `WONK` (0-1) for "streetprint" personality.
- **Bodoni Declarations**: Use for declarative statements and editorial "Interruptions".
- **Optical Size (`opsz`)**: Mandatory auto-scaling for high-contrast elegance.

### 3. Tertiary "Accent" (Layered Flourish & Annotations)

**Role**: High-impact brand moments and personal touches.
**Primary Stack**: **Caveat** (Curator/Annotations) & **JetBrains Mono** (Technical).
**Color Accent**: **Nabla (COLRv1)**.
- **Usage Rule**: Decorative, **icon-scale color glyphs** only.
- **Layering Check**: Used VERY OCCASIONALLY as an additional layer for "Hero Moments".
**M3 Category**: Accent/Decor.
**Playfulness Strategy**:
* **The "Hand-Signed"**: Use **Caveat** for metadata/annotations against the strict grid.
* **Nabla Pulses**: Use CSS `@font-palette-values --nabla-solidarity` for icon-scale flourishes.
* **Depth Animation**: Animate Nabla's internal axes on interaction.

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

| Axis        | Tag    | kerala-rage Usage                                                                                         |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------- |
| **Weight**  | `wght` | **Fluid Steps**. Don't use 400/700. Use `450` for "slightly emphatic", `820` for "heavy impact".        |
| **Width**   | `wdth` | **Container Fit**. Compress headlines (`wdth: 75`) to fit mobile screens without shrinking `font-size`. |
| **Optical** | `opsz` | **Always Auto**. css: `font-optical-sizing: auto;`. Ensures finesse at all sizes.                       |
| **Grade**   | `GRAD` | **Interaction**. Hover `GRAD: 0` -> `GRAD: 150`. **Never** use `wght` for hover (causes reflow).        |

### 2. The Custom Axes (Playful/kerala-streetprint)

| Axis         | Tag    | Font                 | Effect                                                                                 |
| ------------ | ------ | -------------------- | -------------------------------------------------------------------------------------- |
| **Wonky**    | `WONK` | Fraunces             | Introduces kerala-streetprint "typesetter irregularity". Use `WONK: 1` for "Hand-printed" feel. |
| **Softness** | `SOFT` | Fraunces             | `SOFT: 50` creates "Ink Spread" effect (vintage paper feel).                           |
| **Ascender** | `YTAS` | Roboto Flex / Others | "Stretch" the vertical rhythm of tall letters (`h`, `l`, `d`) for editorial headers.   |

---

## Technical Implementation Patterns

### Pattern 1: Layout-Safe "Breathing" Button

_Standard boldness shifts break layouts. Grade (`GRAD`) does not._

```css
.kerala-rage-button {
  font-family: "Work Sans Variable", sans-serif;
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

| Dimension             | Implementation                                                          |
| --------------------- | ----------------------------------------------------------------------- |
| **Scholarly Rigor**   | `Fraunces`, `WONK: 0`, `SOFT: 0`, `opsz: 144` (Sharp, High Contrast)    |
| **Street Truth**      | `Libre Bodoni`, extreme weight/contrast                                |
| **Melancholy Breath** | `Fraunces`, `WONK: 1`, `SOFT: 50`, `opsz: 14` (Soft, Inky)             |
| **Interactive Pulse** | `Work Sans`, `GRAD` animation (0 -> 150) on interact                    |

---

## Anti-Patterns (What NOT to do)

❌ **Static Font Files**: Do not import `Lora-Bold.ttf`. Use `Lora-Variable.ttf`.
❌ **Weight Shifts on Hover**: `font-weight: bold` on hover causes "layout jump". Use `GRAD` instead.
❌ **Axis Overload**: Don't animate `wght`, `wdth`, `slnt`, and `opsz` all at once. "Visual Chaos" != Expressive.
❌ **System Fonts**: New kerala-rage standard **bans** usage of system fonts for "Workhorse" tier.

---

## Typography-Voice Alignment

Typography tiers reinforce the voice tier system defined in [DOC-006](file:///Users/okgoogle13/Projects/careercopilot/docs/archive/atomic-v2/DOC-006_Voice_and_Microcopy.md):

| Typography Tier           | Font                      | Voice Tier                      | Copy Style                  |
| :------------------------ | :------------------------ | :------------------------------ | :-------------------------- |
| **Workhorse**             | Work Sans                 | Tier 1 (Functional)             | Clear, direct labels        |
| **Expressive**            | Fraunces / Libre Bodoni   | Tier 2-3 (Contextual/Character) | Playful, Stencilled         |
| **Accent (Curator)**      | Caveat / Nabla            | Tier 3 (Character)              | Flourishes, icon-glyphs     |

**Rule**: If the typography is Workhorse (Work Sans), the copy should be Tier 1 (functional). Personality flourishes belong with Expressive typography.

---

## Checklist for Implementation

1.  **Load Variable Files**: Ensure `Fraunces[SOFT,WONK,opsz,wght].woff2` and `WorkSans[wght].woff2` are loaded.
2.  **Define CSS Tokens**:
    ```css
    --sys-typescale-display-large-font: "Fraunces Variable";
    --sys-typescale-display-accent: "Nabla"; /* RESTRICTED: Layered icon-scale only */
    --sys-typescale-display-large-variations: "SOFT" 50, "WONK" 1, "wght" 300;
    ```
3.  **Enable Optical Sizing**: Global CSS `html { font-optical-sizing: auto; }`.
4.  **Register Palettes**: Define `@font-palette-values --nabla-solidarity` in `global.css`.
5.  **Audit Layering**: Ensure Nabla is never the sole font in a headline; it must complement the Solidarity stack.
