---
name: kr-solidarity-brand-enforcer
description: Auto-applies KR Solidarity v6.0 brand guidelines (Migrant Rage theme).
metadata:
  version: 6.0.0
  tags:
    - brand
    - compliance
    - kr-solidarity
    - migrant-rage
---

# KR Solidarity: Brand Enforcer (v6.0)


## Purpose

Guardrails to ensure all content matches the **KR Solidarity (Migrant Rage)** theme and adheres to the [Design Canon](../../docs/design/01_CANON.md).

## Process

1. **Review Output**: Analyze generated content (wireframes, specs, code, logs).
2. **Validate Colors**: Enforce **Solidarity Charcoal** (#1A1714), **Solidarity Crimson** (--sys-color-solidarity-red), and **Ink Gold** (--sys-color-ink-gold).
3. **Check Typography**: Verify the **Solidarity Stack** from [02_SYSTEM.md](../../docs/design/02_SYSTEM.md). NO Work Sans/Work Sans/Work Sans.
4. **Validate Layout**: Confirm **Stone / Slab / Pebble** asymmetric radii and 8px grid.
5. **Verify Visuals**: Enforce **STRICT ZERO-FLORA LOCKDOWN**. Confirm urban/human-centric motifs (laneways, posters, resistance portraiture).
6. **Report Violations**: Flag non-compliant elements (e.g., perfect circles, white backgrounds, botanical motifs).


## When to Use

- After wireframe annotation to validate brand compliance
- Before component spec generation to ensure design consistency
- When reviewing design system documentation
- When auditing visual outputs for kerala-rage adherence

## Enforcement Rules

- **Colors**:
    - **Background**: Solidarity Charcoal (#1A1714). **STRICT NO WHITE BACKGROUNDS**.
    - **Accents**: Solidarity Crimson (--sys-color-solidarity-red), Ink Gold (--sys-color-ink-gold), Stencil Yellow (--sys-color-stencil-yellow), Activist Smoke (--sys-color-kr-activist-smoke-green).
- **Typography**:
    - **Solidarity Stack**: Work Sans, Fraunces, Libre Bodoni, JetBrains Mono, Caveat.
    - **Nabla (COLRv1)**: Authorized ONLY for icon-scale Hero hits. MUST use Solidarity palette.
- **Layout**: Asymmetric radii (**Stone / Slab / Pebble** shapes). **BANNED**: `border-radius: 50%`.
- **Visual**: Melbourne laneway/stencilled aesthetic, resistance portraiture, wheat-paste textures.
- **FORBIDDEN**: Flora, Australian endemic botanicals, or soft organic 'nature' elements.


## Validates Outputs From

- wireframe-annotator
- component-spec-generator
- design-system-doc-generator

## Usage

"Check [File/Output] for brand compliance"
