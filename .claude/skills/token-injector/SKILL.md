---
name: token-injector
description: Automated CSS variable injection from tokens.json. Parses design tokens → generates CSS custom properties → injects into stylesheets → replaces hardcoded values.
version: 1.0.0
tags: []
---

# Token-Injector Skill

## Purpose

Input: `tokens.json` + target CSS files
Output: Updated stylesheets with CSS variables

## When to Use

- When updating the project's design tokens in `tokens.json`.
- When automating the conversion of raw tokens into production-ready CSS variables.
- When replacing hardcoded style values with token-based custom properties.

## Process

1. Parse `tokens.json` from asset packages
2. Generate CSS custom properties
3. Inject into `:root` or component scope
4. Replace hardcoded values with `var()` references
5. Validate no broken references

## Token Mapping

**tokens.json:**

```json
{
  "background": "#1A1714",
  "palette": {
    "solidarity_red": "#F14714",
    "ink_gold": "#DAF674",
    "activist_green": "#48DA8B"
  }
}
```

**Generated CSS:**

```css
:root {
  --color-asphalt-black: #1a1714;
  --color-solidarity-red: #f14714;
  --color-ink-gold: #daf674;
  --color-activist-green: #48da8b;
}
```

## Replacement Logic

**Before:**

```css
.card {
  background: #1a1714;
  border: 1px solid #c45c4b;
}
```

**After:**

```css
.card {
  background: var(--color-asphalt-black);
  border: 1px solid var(--color-solidarity-red);
}
```

## Batch Mode

Process all asset `tokens.json` files:

```bash
token-injector --input /assets/*/tokens.json --output /frontend/src/styles/kerala-rage-tokens.css
```

## Integration

**Asset-Packager:** Generates source `tokens.json`
**Claude Code:** Executes injection on target files
**Stylelint:** Validates output

## Efficiency

**Before:** 30 min manual find-replace per component
**After:** 2 min automated injection
**Savings:** 93% reduction

---

_Tokens → CSS variables → automatic injection. Manual replacement eliminated._
