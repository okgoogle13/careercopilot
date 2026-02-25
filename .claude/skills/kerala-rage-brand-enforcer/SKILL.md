---
name: kerala-rage-brand-enforcer
description: Auto-applies kerala-rage brand guidelines (Melbourne laneway aesthetic,
  endemic flora) to ensure design consistency.
metadata:
  legacy_frontmatter:
    tags:
    - brand
    - compliance
    - kerala-rage
    - design
    version: 1.0.0
---

# kerala-rage Brand Enforcer skill

## Purpose

Guardrails to ensure all AI-generated content matches the kerala-rage Contemporary Australian aesthetic.

## Process

1. **Review Output**: Analyze generated content (wireframes, specs, documentation)
2. **Validate Colors**: Ensure **Step 0** bg (#0F0F0F), **Solidarity Red** (#F14714), **Ink Gold** (#DAF674).
3. **Check Typography**: Verify **Work Sans** (Body/UI), **Fraunces** (Display), **Libre Bodoni** (Proclamation), **JetBrains Mono** (Mono), **Caveat** (Curator), and **Nabla** (Accent). NO Inter/Roboto/Arial.
4. **Validate Layout**: Confirm "Stone/Slab" asymmetric radii, 8px grid, M3 shadows.
5. **Verify Visual**: Ensure Melbourne laneway aesthetic ("Solidarity Mode") and Australian endemic flora motifs.
6. **Report Violations**: Flag non-compliant elements (e.g., perfect circles, white backgrounds).

## When to Use

- After wireframe annotation to validate brand compliance
- Before component spec generation to ensure design consistency
- When reviewing design system documentation
- When auditing visual outputs for kerala-rage adherence

## Enforcement Rules

- **Colors**: 
    - **Background**: Step 0 (#0F0F0F) / Step 1 (#1A1A1A). **NO WHITE BACKGROUNDS**.
    - **Accents**: Solidarity Red (#F14714), Ink Gold (#DAF674), Stencil Yellow (#F6E748).
- **Typography**: 
    - **Solidarity Stack**: Work Sans (Body), Fraunces (Display), Libre Bodoni (Proclamation), JetBrains Mono (Mono), Caveat (Curator).
    - **Nabla (COLRv1)**: Authorized ONLY for decorative, icon-scale color glyphs/Hero moments. MUST use `--nabla-solidarity`.
    - **Rules**: 9× weight ratio (100 vs 900), 6× size ratio.
- **Layout**: Asymmetric radii (**Stone/Slab/Pebble** shapes). **BANNED**: `border-radius: 50%`.
- **Visual**: Melbourne laneway/stencilled aesthetic, Australian endemic flora motifs.

## Validates Outputs From

- wireframe-annotator
- component-spec-generator
- design-system-doc-generator

## Usage

"Check [File/Output] for brand compliance"
