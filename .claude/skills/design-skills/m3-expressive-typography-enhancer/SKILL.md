---
name: m3-expressive-typography-enhancer
description: Elevate typography with Material Design 3 Expressive variable fonts, extreme weight contrasts (100 vs 900), optical sizing, and emotional tone mapping. Transforms generic defaults into intentional, memorable typography by enforcing M3 Expressive principles rather than specific font families.
version: 3.1.0
tags: []
---

# M3 Expressive Typography Enhancer

## Purpose

Elevate typography beyond basic token replacement with variable fonts, extreme weight contrasts, and emotional tone mapping. Transforms boring typography (Inter 400 vs 500) into expressive, memorable typography (100 vs 900) that conveys personality and meaning.

## When to Use

Use this skill when you need to:

- **Configure expressive typography** for a new design system
- **Implement variable fonts** with fluid weight/width transitions
- **Create extreme contrasts** (9x weight difference, not 1.25x)
- **Map typography to emotion** (playful, confident, elegant, technical)
- **Validate font choices** against M3 Expressive principles (Variable capability)
- **Establish font pairings** (Display + Body + Accent)
- **Upgrade existing typography** from timid to dramatic

**Trigger scenarios:**

- "This typography feels generic and boring"
- "How do I make typography more expressive?"
- "Define the variable font strategy for this brand"
- "Replace default system fonts with something intentional"

## Process

This skill enhances M3 typography with M3 Expressive principles:

1. **Semantic Role Definition** - Define Display, Body, and Accent roles.
2. **Variable Font Selection** - Choose fonts that support requisite axes (wght, opsz, sometimes wdth).
3. **Extreme Weight Contrasts** - Implement 100 vs 900 (not 400 vs 600).
4. **Optical Sizing** - Enable specific optical sizing for legibility and finesse.
5. **Anti-Slop Validation** - Reject "Default" implementations (e.g., Inter Static).

## M3 Expressive Type Scale (Semantic Roles)

Material Design 3 Expressive uses a semantic type scale. Map your chosen fonts to these roles:

| Role         | Concept      | Required Capabilities                                                                     |
| :----------- | :----------- | :---------------------------------------------------------------------------------------- |
| **Display**  | _The Hero_   | **Extreme Weights (100-900)**. Must look elegant at large sizes. Optical sizing critical. |
| **Headline** | _The Voice_  | **Width Axis (optional)**. Needs to be punchy and tight.                                  |
| **Body**     | _The Worker_ | **Legibility**. High x-height. Must support 400-700 weights clearly.                      |
| **Label**    | _The UI_     | **Utility**. Clear distinctions at small sizes.                                           |
| **Accent**   | _The Spark_  | **Distinctive**. Script, Monospace, or Display. High personality.                         |

**M3 Expressive Principle**: Use variable font axes to create **extreme contrasts**:

- **Display Large (Hero)**: `wght: 100` @ 57px (Thin & Tall)
- **Body Strong (Support)**: `wght: 900` @ 14px (Bold & Small)
- **Ratio**: 9x weight difference + 4x size difference = Visual Drama

## M3 Expressive Typography Principles

### 1. Variable Fonts (Fluid Typography)

**Requirement**: All fonts MUST be Variable Fonts (`.woff2`) supporting at least the `wght` axis.

**Why**: Static fonts require loading multiple files (Regular, Bold, ExtraBold), limiting your palette. Variable fonts allow you to animate from `300` to `800` smoothly, creating "living" typography.

**Implementation**:

```css
:root {
  /* Define Semantic Tokens, not just font families */
  --font-display: "Your Display Font Variable", sans-serif;
  --font-body: "Your Body Font Variable", sans-serif;
}

.expressive-heading {
  font-family: var(--font-display);
  font-variation-settings: "wght" 800; /* Precise control */
  transition: font-variation-settings 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.expressive-heading:hover {
  font-variation-settings: "wght" 900; /* Fluid shift */
}
```

### 2. Extreme Weight Contrasts

**Anti-Pattern (Boring):**

```tsx
// ❌ Timid contrast - 1.25x ratio
<h1 style={{ fontWeight: 400 }}>Heading</h1>
<p style={{ fontWeight: 500 }}>Body</p>
```

**M3 Expressive (Dramatic):**

```tsx
// ✅ Extreme contrast - 9x ratio
<h1 style={{
  fontWeight: 100, // Hairline
  fontSize: 'var(--sys-type-display-large-size)',
  letterSpacing: '-0.02em'
}}>Heading</h1>
<p style={{
  fontWeight: 900, // Black
  fontSize: 'var(--sys-type-body-small-size)'
}}>Subtext</p>
```

### 3. Optical Sizing (Critical for M3 Expressive)

Optical sizing automatically adjusts font details (stroke thickness, letter spacing) for readability at different sizes.

**Requirement**:

```css
:root {
  font-optical-sizing: auto; /* REQUIRED for all variable fonts */
}
```

- **At 12px**: Strokes thicken, spacing opens up (Readability).
- **At 72px**: Strokes thin, spacing tightens (Elegance).

### 4. Emotional Tone Mapping

Map your font choices to the brand's emotional intent.

| Emotion                      | Font Archetype       | Example Strategy                                         |
| :--------------------------- | :------------------- | :------------------------------------------------------- |
| **Playful & Energetic**      | Geometric + Rounded  | `Montserrat` (Display) + `Nunito` (Body)                 |
| **Confident & Professional** | Grotesque + Humanist | `Inter Variable` (Display 900) + `Inter Variable` (Body) |
| **Elegant & Premium**        | Serif + Sans         | `Playfair Display` + `Lato`                              |
| **Tech-Forward / Brutalist** | Mono + Grotesque     | `JetBrains Mono` + `Inter Variable`                      |
| **kerala-streetprint / [DEPRECATED_STYLE]**   | Serif + Slab         | `Fraunces` (Soft/Wonk) + `Lora`                          |

### 5. Intentional Font Pairing

Contrast is key. Avoid pairing two similar fonts unless they are the _same_ super-family.

- **Display + Monospace**: High technical contrast.
- **Serif + Geometric**: High era contrast.
- **Variable Super-Family**: Use one font (e.g., `Inter Variable`) for _everything_, but use extreme axes (Display = `wght: 900`, Body = `wght: 400`) to create distinction.

### 6. Variable Font Animation (M3 Expressive Motion)

M3 Expressive brings typography to life through variable font axis animation.

**Pattern: Scroll-Driven Typography**

As user scrolls, typography transforms via variable font axes:

```tsx
import { motion, useScroll, useTransform } from "framer-motion";

export const ScrollExpressiveHeader = () => {
  const { scrollYProgress } = useScroll();

  // As user scrolls (0 → 1), weight changes (300 → 700)
  const weight = useTransform(scrollYProgress, [0, 1], [300, 700]);

  return (
    <motion.h1
      style={{
        fontFamily: "var(--font-display)",
        fontVariationSettings: weight.get() ? `"wght" ${weight}` : '"wght" 300',
      }}
    >
      Expressive Typography
    </motion.h1>
  );
};
```

**M3 Expressive Motion Easing**: Always use `cubic-bezier(0.34, 1.56, 0.64, 1)` for that characteristic "springy" feel.

## Usage

This skill is invoked when you request typography enhancement with phrases like:

- "Elevate this typography to M3 Expressive standards"
- "Make typography more expressive with variable fonts"
- "Apply extreme weight contrasts to this design"
- "Map this interface to emotional tone using variable fonts"
- "Validate typography against M3 Expressive principles"

**How Claude Invokes This Skill:**

When you describe typography that needs enhancement, Claude will apply M3 Expressive principles to:

1. **Identify current typography** - Assess existing font choices, weight ranges, sizing
2. **Apply M3 Expressive transformation** - Suggest extreme weight contrasts (100 vs 900), optical sizing, emotional tone mapping
3. **Provide implementation** - Return CSS custom properties, Framer Motion code, semantic token definitions
4. **Validate against checklist** - Ensure result meets all M3 Expressive standards

## M3 Expressive Validation Checklist

- [ ] **Intentional Fonts**: No "Default" imports (e.g., `import { Inter } from 'google-fonts'` without variable config).
- [ ] **Weight Contrast ≥ 3x**: Display at 100/300 weight, Body at 700/900 weight (or similar extreme).
- [ ] **Size Contrast ≥ 3x**: Display 57px vs Body 14px (or similar 3x+ ratio).
- [ ] **Variable Fonts Enabled**: Using `.woff2` variable files, not static weights.
- [ ] **Optical Sizing**: `font-optical-sizing: auto` set globally.
- [ ] **Emotional Tone**: Typography conveys intended emotion (playful, confident, elegant, technical).
- [ ] **Visual Hierarchy**: Clear distinction between Display, Body, and Accent roles.
- [ ] **Letter Spacing**: Applied intentionally (`-0.02em` for Display, `0em` for Body).
- [ ] **Animation**: Typography responds to user interaction (scroll, hover) via variable axes.
- [ ] **Motion Easing**: Uses M3 Expressive easing (cubic-bezier overshoot), not linear.
- [ ] **No AI Slop**: Typography feels intentional, not generic.

## Troubleshooting

### Variable Fonts Not Loading

**Solution:** Ensure you are importing the full variable range (e.g., `wght 100..900`), not just specific weights.

### Weight Contrast Too Extreme

**Solution:** Start with 300 vs 700, gradually increase to 100 vs 900 as the design matures.

### Font Pairing Incoherent

**Solution:** Use a "Super-Family" (same font, different optical sizes or axes) for guaranteed harmony.

## Related Skills

- [m3-anti-slop-validator](../m3-anti-slop-validator/SKILL.md) - Validate typography against M3 Expressive standards
- [m3-visual-audit](../../../m3-visual-audit/SKILL.md) - Audit component typography rendering
- [expressive-typography-manipulation](../../../expressive-typography-manipulation/SKILL.md) - Technical implementation patterns
- [brand-brief-optimizer](../../../brand-brief-optimizer/SKILL.md) - Brief clarity on typography standards

---

**Version:** 3.1.0 (M3 Expressive - Font Agnostic)
**Status:** Production Ready
