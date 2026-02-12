---
name: component-transformer
description: Orchestrates the migration of legacy MUI or generic components to the kerala-rage kr-solidarity design system. Specializes in "Refactor-on-Port" logic, ensuring visual transformation while preserving business state and behavioral integrity.
version: 1.0.0
tags: [migration, refactor, kerala-rage-kr-solidarity]
---

# Component Transformer Skill

## Purpose

Orchestrates the migration of legacy MUI or generic components to the kerala-rage kr-solidarity design system, ensuring visual transformation while preserving business state and behavioral integrity.

## When to Use

Use when porting legacy components (MUI, etc.) to the kerala-rage kr-solidarity design system or when refactoring generic components for better design system alignment.

## Process

1. **The Audit (Discovery)**: Scan file for hardcoded values (colors, spacing, radii) and generic fonts.
2. **The Context Selection**: Ensure the component aligns with the Kerala Rage Solidarity aesthetic (kr-dark).
3. **The Transformation (Mapping)**: Replace generic values with kerala-rage Token Set (Colors, Typography, Physics, Morphology).
4. **Behavioral Preservation**: Ensure no business logic or event handlers are lost.
5. **Verification**: Generate unit tests and Storybook stories.

## Post-Migration Validation

After transformation completes, run `m3-expressive-ui-evaluator`:
- **Input**: Migrated component directory.
- **Validate**: Meets Kerala Rage kr-solidarity / M3 Expressive standards.
- **Score Target**: ≥ 240/400 to proceed to production.
- **If issues found**: Iteratively re-transform or manually polish based on scoring feedback.

## Implementation Principles

- **Anti-Slop**: Reject any transformation that results in a "generic SaaS" look.
- **Parametric**: Engage variable font axes for interactive elements.
- **Layout-Safe**: Prefer GRAD over wght for hover animations.

"Transform Header.tsx to the kerala-rage kr-solidarity system."
