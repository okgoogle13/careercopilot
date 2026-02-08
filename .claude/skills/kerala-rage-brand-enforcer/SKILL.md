---
name: kerala-rage-brand-enforcer
description: Auto-applies kerala-rage brand guidelines (Melbourne laneway aesthetic, endemic flora) to ensure design consistency.
tags: [brand, compliance, kerala-rage, design]
version: 1.0.0
---

# kerala-rage Brand Enforcer skill

## Purpose

Guardrails to ensure all AI-generated content matches the kerala-rage Contemporary Australian aesthetic.

## Process

1. **Review Output**: Analyze generated content (wireframes, specs, documentation)
2. **Validate Colors**: Ensure dark ironbark bg, kr-leafus accent, soft white text
3. **Check Typography**: Verify Bebas Neue (display), Space Grotesk (headers), NO Roboto/Arial
4. **Validate Layout**: Confirm 8px grid, appropriate corner radius, M3 shadows
5. **Verify Visual**: Ensure Melbourne laneway aesthetic and Australian endemic flora motifs
6. **Report Violations**: Flag non-compliant elements with specific corrections

## When to Use

- After wireframe annotation to validate brand compliance
- Before component spec generation to ensure design consistency
- When reviewing design system documentation
- When auditing visual outputs for kerala-rage adherence

## Enforcement Rules

- **Colors**: Dark ironbark bg, kr-leafus accent, soft white text
- **Typography**: Bebas Neue (display), Space Grotesk (headers), NO Roboto/Arial
- **Layout**: 8px grid, sharp corners (0px) or subtle (4-8px), M3 shadows
- **Visual**: Melbourne laneway aesthetic, Australian endemic flora motifs

## Validates Outputs From

- wireframe-annotator
- component-spec-generator
- design-system-doc-generator

## Usage

"Check [File/Output] for brand compliance"
