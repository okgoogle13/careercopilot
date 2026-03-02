---
name: component-transformer
description: Orchestrates the migration of legacy MUI or generic components to the
  kerala-rage kr-solidarity design system. Specializes in "Refactor-on-Port" logic,
  ensuring visual transformation while preserving business state and behavioral integrity.
  Outputs --sys-color-* compliant components with Kerala Rage typography and asymmetric
  morphology.
metadata:
  version: 2.0.0
  tags:
    - migration
    - refactor
    - kerala-rage-kr-solidarity
    - component-transformation
---

# Component Transformer Skill (v2.0)

## Purpose

Orchestrates the migration of legacy MUI, generic, or Northcote-era components to the **kerala-rage kr-solidarity design system**, ensuring visual transformation while preserving business state and behavioral integrity.

---

## When to Use

- Porting legacy MUI components (Button, Card, Dialog, etc.) to kr-solidarity
- Refactoring generic/hardcoded-color components for design system alignment
- Removing deprecated `--nc-*` or hardcoded hex tokens from existing components
- Assigning archetype classifications to previously unclassified components

---

## Process

### 1. The Audit (Discovery)

Scan the target component file for violations:

```bash
# Find hardcoded hex values
grep -n "#[0-9A-Fa-f]\{3,6\}" ComponentName.tsx

# Find --nc-* deprecated tokens
grep -n "\-\-nc\-" ComponentName.tsx

# Find forbidden fonts
grep -n "Inter\|Roboto\|Arial\|Helvetica\|Sora\|Plus Jakarta" ComponentName.tsx

# Find uniform border-radius (anti-pattern)
grep -n "rounded-lg\|border-radius: 8px\|borderRadius: '8px'" ComponentName.tsx
```

**Audit output format:**
```
VIOLATIONS FOUND in ComponentName.tsx:
  Line 14: Hardcoded color #1A1714 → use --sys-color-asphaltBlack
  Line 23: Font 'Inter' → use Work Sans (--sys-type-font-work-sans)
  Line 31: Uniform radius 8px → use archetype-specific asymmetric radius
  Line 45: --nc-wattle-gold-300 → use --sys-color-kr-ink-gold
```

### 2. The Context Selection

- Assign the component to a kr-solidarity **archetype**:
  - **Seed**: Atomic (button, chip, badge)
  - **Pebble**: Linear composition (stacked items, progress)
  - **Lens**: Focal container (modal, popover, drawer)
  - **Jar**: Simple frame (card, list item, panel)
  - **Cabinet**: Complex layout (grid, multi-column)
  - **Stone**: Structural (divider, spacer)
- Confirm the component is Solidarity mode only (no mode-switching logic)

### 3. The Transformation (Token Mapping)

Apply the following substitution table:

#### Color Token Migration

| Legacy / Hardcoded | kr-solidarity Token | Hex |
|---|---|---|
| `#1A1714` / `--nc-asphalt-black-*` | `--sys-color-asphaltBlack` | `#1A1714` |
| `#F5F0E8` / `--nc-paper-white-*` | `--sys-color-paperWhite` | `#F5F0E8` |
| `#D4A84B` / `--nc-wattle-gold-*` | `--sys-color-kr-ink-gold` | `#D4A84B` |
| `#C45C4B` / `--nc-*-red-*` | `--sys-color-waratahRed` | `#C45C4B` |
| `#B8733D` / `--nc-ochre-*` | `--sys-color-ochreEarth` | `#B8733D` |
| `#6B7F6E` / `--nc-gum-*` | `--sys-color-gumLeafGreen` | `#6B7F6E` |
| `#A39B8F` / `--nc-concrete-*` | `--sys-color-concreteGrey` | `#A39B8F` |
| Dark container | `--sys-color-primary-10` | `#2A1F0B` |
| Mid container | `--sys-color-primary-40` | `#8B7A35` |
| Base primary | `--sys-color-primary-50` | `#D4A84B` |

#### Typography Token Migration

| Legacy | kr-solidarity |
|---|---|
| `font-family: Inter` | `font-family: var(--sys-type-font-work-sans)` |
| `font-family: Roboto` | `font-family: var(--sys-type-font-work-sans)` |
| `font-family: Sora` | `font-family: var(--sys-type-font-fraunces)` (headlines) |
| MUI `Typography variant="h1"` | Fraunces, `font-variation-settings: "wght" 700` |
| MUI `Typography variant="body1"` | Work Sans, `font-weight: 400` |
| `font-family: 'JetBrains Mono'` | `font-family: var(--sys-type-font-mono)` ✓ |
| Caveat / Nabla / Proclamation | **Remove** — not in kr-solidarity stack |

#### Shape Migration

| Legacy | Archetype | kr-solidarity Radius |
|---|---|---|
| `rounded-lg` / `borderRadius: 8` | Seed (button) | `40px 12px 40px 12px` |
| `rounded-xl` / `borderRadius: 12` | Jar (card) | `32px 8px 28px 12px` |
| `rounded-2xl` / `borderRadius: 16` | Lens (modal) | `24px 8px 20px 8px` |
| `rounded-full` / `borderRadius: 50%` | Pebble (chip) | `20px 6px 20px 6px` |
| None / flat | Stone / Cabinet | minimal or structural |

#### Motion Migration

| Legacy | kr-solidarity |
|---|---|
| `transition: all 0.3s ease` | `transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `ease-in-out` | Spring: `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| No hover physics | `whileHover={{ scale: 1.03 }}` with Framer Motion |

#### MUI Component Mapping

| MUI Component | kr-solidarity Archetype | Notes |
|---|---|---|
| `Button` | Seed | Replace MUI props with Framer Motion |
| `Chip` | Seed / Pebble | Asymmetric radius |
| `Card` | Jar | Remove `elevation` prop, use `--sys-shadow-*` |
| `Dialog` | Lens | Preserve `open`/`onClose` behavior |
| `Alert` | Lens | Map severity colors to kr-solidarity tokens |
| `TextField` | Seed (input) | Replace outlined/filled with kr-solidarity styles |
| `Divider` | Stone | Minimal styling, `--sys-color-concreteGrey` |
| `Grid` | Cabinet | Keep layout logic, replace styling |
| `List` / `ListItem` | Jar | Map to card-style Jar |
| `CircularProgress` | Pebble | Replace with kr-solidarity spinner |

### 4. Behavioral Preservation

**Never remove or alter:**
- Event handlers (`onClick`, `onChange`, `onSubmit`, etc.)
- State management logic (useState, useReducer, Zustand store connections)
- Business logic (calculations, validation)
- API calls and data fetching
- Props interfaces (may extend, not break)

**Safe to transform:**
- All visual styling (className, sx prop, inline styles)
- Typography elements
- Color references
- Animation/transition definitions
- Border radius values
- Shadow/elevation values

### 5. Verification

After transformation, run:

```bash
# Check for remaining hardcoded hex
grep -n "#[0-9A-Fa-f]\{3,6\}" ComponentName.tsx
# Expected: 0 matches

# Check for remaining --nc-* tokens
grep -n "\-\-nc\-" ComponentName.tsx
# Expected: 0 matches

# Check for forbidden fonts
grep -n "Inter\|Roboto\|Arial\|Sora" ComponentName.tsx
# Expected: 0 matches
```

Then validate visually with `m3-expressive-ui-evaluator`:
- **Input**: Migrated component directory
- **Score Target**: ≥ 240/400 to proceed to production
- **If issues found**: Re-transform specific violations, re-run

---

## Implementation Principles

- **Anti-Slop**: Reject any transformation that results in generic SaaS look
- **Parametric typography**: Engage variable font axes (wght, SOFT, WONK) for interactive elements
- **Layout-safe motion**: Prefer `GRAD` axis or `scale` over `wght` for hover — avoids layout reflow
- **ARIA preserved**: Never remove aria attributes; add missing ones
- **No mode logic**: Remove any kr-dark/kr-light mode switching — Solidarity is the only mode

---

## Example Transformation

**Before (legacy MUI):**
```tsx
import { Button } from '@mui/material'

export function ActionButton({ label, onClick }) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        backgroundColor: '#D4A84B',
        fontFamily: 'Inter',
        borderRadius: '8px',
        '&:hover': { backgroundColor: '#C4983B' }
      }}
    >
      {label}
    </Button>
  )
}
```

**After (kr-solidarity Seed):**
```tsx
// Archetype: Seed
import { motion } from 'framer-motion'

export function ActionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      style={{
        fontFamily: 'var(--sys-type-font-work-sans)',
        fontWeight: 600,
        background: 'var(--sys-color-kr-ink-gold)',
        color: 'var(--sys-color-asphaltBlack)',
        padding: '12px 24px',
        borderRadius: '40px 12px 40px 12px',
        border: 'none',
        cursor: 'pointer',
      }}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(212,168,75,0.35)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onClick={onClick}
      aria-label={label}
    >
      {label}
    </motion.button>
  )
}
```

---

## Related Skills

**Workflow:**
```
component-transformer (migrate)
  → m3-expressive-ui-evaluator (score ≥ 240/400)
  → component-visual-audit (screenshot validation)
  → jest-test-scaffolder (unit tests for migrated component)
```

- `component-builder` — Build new components from scratch instead of migrating
- `design-token-validator` — Validate token.json before running transformation
- `token-injector` — Bulk-replace CSS variables across stylesheets
- `hifi-blueprint-linter` — Validate wireframe docs post-migration

---

**Version:** 2.0.0 | **Last Updated:** 2026-02-28 | **Mode:** Solidarity Only
