---
name: kerala-rage-brand-enforcer
description: Auto-applies Kerala Rage brand guidelines (Agit-Prop aesthetic, Worker
  Solidarity motifs) to ensure design consistency.
metadata:
  legacy_frontmatter:
    tags:
    - brand
    - compliance
    - kerala-rage
    - design
    version: 2.0.0
---

# Kerala Rage Brand Enforcer skill

## Purpose

Guardrails to ensure all AI-generated content matches the Kerala Migrant Rage (Agit-Prop / Viscous Fluidity) aesthetic.

## Process

1. **Review Output**: Analyze generated content (wireframes, specs, documentation)
2. **Validate Colors**: Ensure Charcoal (#1A1714) bg, [DEPRECATED_STYLE] Red (--sys-color-solidarity-red) primary, Baru Gold (--sys-color-ink-gold) accent.
3. **Check Typography**: Verify Inter Variable (display/body) with extreme weights (900 vs 200), Recursive (expressive). NO Roboto/Arial.
4. **Validate Layout**: Confirm [DEPRECATED_STYLE] asymmetry, torn edges, "Viscous" motion physics.
5. **Verify Visual**: Ensure Agit-Prop aesthetic, worker solidarity motifs, Malayalam typography integration.
6. **Report Violations**: Flag non-compliant elements (e.g., "kerala-streetprint", "[DEPRECATED_STYLE]") with specific corrections

## When to Use

- After wireframe annotation to validate brand compliance
- Before component spec generation to ensure design consistency
- When reviewing design system documentation
- When auditing visual outputs for Kerala Rage adherence

## Enforcement Rules

- **Colors**: Charcoal (#1A1714) bg, [DEPRECATED_STYLE] Red (--sys-color-solidarity-red), Baru Gold (--sys-color-ink-gold).
- **Typography**: Inter Variable (Display 900 / Body 200), Recursive (Expressive). NO Bebas/Space Grotesk.
- **Layout**: Asymmetric grids, torn edges (clip-path), Viscous motion (spring physics).
- **Visual**: Agit-Prop, Solidarity Icons (Fist, Star), Malayalam script, Glitch effects.

## Validates Outputs From

- wireframe-annotator
- component-spec-generator
- design-system-doc-generator

## Usage

"Check [File/Output] for brand compliance"
