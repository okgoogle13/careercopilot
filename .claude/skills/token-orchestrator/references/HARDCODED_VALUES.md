# Hardcoded Value Guide

What `analyze-m3-styling-consistency.sh` detects and how to fix.

## Contents
- [Colors](#1-colors)
- [Spacing](#2-spacing)
- [Shadows](#3-shadows)
- [Border radius](#4-border-radius)
- [Acceptable exceptions](#acceptable-exceptions)
- [Token mapping reference](#token-mapping-reference)

---

## 1. Colors

**Detects**: Hex (`#D4A84B`), RGB (`rgb(212, 168, 75)`), RGBA (`rgba(26, 23, 20, 0.8)`)

**Before** (hardcoded):
```css
background: #D4A84B;
color: rgb(26, 23, 20);
border: 1px solid rgba(212, 168, 75, 0.12);
```

**After** (using tokens):
```css
background: var(--sys-color-wattle-gold);
color: var(--sys-color-kr-motif-night);
border: 1px solid var(--sys-color-wattle-gold-container);
```

---

## 2. Spacing

**Detects**: Pixel values (`padding: 16px`, `margin: 24px`)

**Before** (hardcoded):
```css
padding: 16px;
margin: 24px 32px;
gap: 12px;
```

**After** (using tokens):
```css
padding: var(--sys-spacing-4);
margin: var(--sys-spacing-6) var(--sys-spacing-8);
gap: var(--sys-spacing-3);
```

---

## 3. Shadows

**Detects**: CSS box-shadow (`0 4px 24px rgba(0,0,0,0.5)`)

**Before** (hardcoded):
```css
box-shadow: 0 4px 24px rgba(20, 18, 16, 0.5);
```

**After** (using tokens):
```css
box-shadow: var(--sys-elevation-rest);
```

---

## 4. Border Radius

**Detects**: Pixel values (`border-radius: 16px`)

**Before** (hardcoded):
```css
border-radius: 16px;
border-radius: 20px 6px 16px 28px;
```

**After** (using tokens):
```css
border-radius: var(--sys-shape-stone);
border-radius: var(--sys-shape-pebble);
```

---

## Acceptable Exceptions

Valid hardcoded values:
- `0px`, `0`, `none` (neutral values)
- `100%`, `auto`, `inherit` (layout keywords)
- `transparent`, `currentColor` (CSS keywords)
- Component-specific overrides (document with `/* Exception: reason */`)

**Example exception**:
```css
/* Exception: Full viewport height for hero section */
height: 100vh;
```

---

## Token Mapping Reference

| CSS Property | Token Prefix | Example |
|--------------|--------------|---------|
| Colors | `--sys-color-` | `var(--sys-color-wattle-gold)` |
| Spacing | `--sys-spacing-` | `var(--sys-spacing-4)` |
| Shadows | `--sys-elevation-` | `var(--sys-elevation-rest)` |
| Shapes | `--sys-shape-` | `var(--sys-shape-stone)` |
| Typography | `--sys-font-` | `var(--sys-font-display-large)` |
| Motion | `--sys-duration-` | `var(--sys-duration-fast)` |

---

## Finding Replacements

**Search tokens.json**:
```bash
# Find color by hex value
grep -r "#D4A84B" frontend/src/design/tokens/tokens.json

# Find spacing by pixel value
grep -r "16px" frontend/src/design/tokens/tokens.json
```

**Use audit script**:
```bash
bash scripts/analyze-m3-styling-consistency.sh | grep "Component.tsx"
```

**Check design system docs**:
- [tokens.json](../frontend/src/design/tokens/tokens.json)
- [design-tokens.css](../frontend/src/styles/design-tokens.css)
