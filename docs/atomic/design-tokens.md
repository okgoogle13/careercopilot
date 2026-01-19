# Tokens Quick Reference

**Purpose:** Short guide to token usage without loading full token files.

## Color Tokens

Use semantic tokens, not hex values:
- `var(--sys-color-primary)`
- `var(--sys-color-on-primary)`
- `var(--sys-color-surface)`
- `var(--sys-color-on-surface)`
- `var(--sys-color-outline)`
- `var(--sys-color-error)`

## Shape Tokens

Prefer shape tokens for border-radius:
- `var(--sys-shape-corner-none)`
- `var(--sys-shape-corner-small)`
- `var(--sys-shape-corner-medium)`
- `var(--sys-shape-corner-large)`
- `var(--sys-shape-corner-full)`

## Elevation Tokens

Use elevation tokens for shadow:
- `var(--sys-elevation-level-0)` through `var(--sys-elevation-level-5)`

## Typography

Use typography tokens / classes defined in `frontend/src/globals.css`:
- `font-proclamation`, `font-bloom`, `font-field-note`, `font-annotation`
- Avoid hardcoded font sizes where tokenized classes exist

## Guidance

- Avoid hex/rgb values in component styles.
- Avoid hardcoded `border-radius` and `box-shadow`.
- Prefer design-system classes and CSS variables.

