---
name: component-transformer
description: Orchestrates the migration of legacy MUI or generic components to the
  kerala-rage kr-solidarity design system (v6.1). Specializes in "Refactor-on-Port" logic,
  incorporating semantic action archetypes and shape-morphing.
metadata:
  version: 3.0.0
  tags:
    - migration
    - refactor
    - kerala-rage-kr-solidarity
    - component-transformation
---

# Component Transformer Skill (v3.0)

## Purpose

Orchestrates the migration of legacy MUI, generic, or Northcote-era components to the **kerala-rage kr-solidarity design system (v6.1)**, ensuring visual transformation while preserving business state and behavioral integrity.

---

## When to Use

- Porting legacy components to **KR Solidarity v6.1** standards.
- Refactoring components to use **Semantic Action Archetypes**.
- Removing deprecated tokens (`--nc-*`, legacy `--sys-*`) and hardcoded values.
- Enforcing **Zero-Flora** and **No-Monarchy** visual compliance.

---

## Process

### 1. The Audit (Discovery)

Scan the target component file for violations:

```bash
# Find hardcoded hex values
grep -n "#[0-9A-Fa-f]\{3,6\}" ComponentName.tsx

# Find forbidden patterns (Flora, Monarchy, AI-hype)
grep -n "leaf\|eucalyptus\|crown\|seal\|potential\|powered by" ComponentName.tsx

# Find uniform border-radius
grep -n "rounded-lg\|border-radius: 8px" ComponentName.tsx
```

### 2. The Archetype Selection

Assign the component to a **Semantic Action Archetype (v6.0)**:

- **Strike**: Primary action (Buttons, CTAs).
- **March**: Sequence/Flow (Chips, Steps, Progress).
- **Megaphone**: Announcement (Alerts, Banners).
- **Placard**: Container (Cards, Modals).
- **Scaffold**: Static Structure (Nav, Sidebar).
- **Substrate**: Decorative (Backgrounds).

### 3. The Transformation (Token Mapping)

#### Color Token Migration (v3.2)

| Legacy / Hardcoded | KR v6.1 Token | Role |
|---|---|---|
| `#1A1714` / `--sys-color-asphaltBlack` | `--sys-color-charcoal-bg` | Floor substrate |
| `--sys-color-worker-ash` / `--sys-color-paperWhite` | `--sys-color-worker-ash` | Primary Ink |
| `--sys-color-ink-gold` / `--sys-color-kr-ink-gold` | `--sys-color-solidarity-gold` | Radiance / Focus |
| `--sys-color-solidarity-red` / `--sys-color-waratahRed` | `--sys-color-solidarity-crimson` | Resistance / Peak |
| `--sys-color-stencil-yellow` / `--sys-color-stencilYellow` | `--sys-color-stencil-yellow` | Attention |
| `--sys-color-concrete-grey` / `--sys-color-concreteGrey` | `--sys-color-concrete-grey` | The Grit |

#### Typography Token Migration (v4.0)

| Legacy Font | KR v4.0 Role | CSS Variable |
|---|---|---|
| `Inter` / `Roboto` | Workhorse | `--sys-type-font-work-sans` |
| `Sora` / `Fraunces` | Expressive | `--sys-type-font-fraunces` |
| `Libre Bodoni` | Proclamation | `--sys-type-font-proclamation` |
| `JetBrains Mono` | Technical | `--sys-type-font-mono` |
| `Caveat` | Signature | `--sys-type-font-curator` |

#### Shape Migration (v6.1)

| Legacy Radius | Archetype | KR Shape Token |
|---|---|---|
| `rounded-lg` (8px) | Strike | `var(--sys-shape-block03)` |
| `rounded-xl` (12px) | Placard | `var(--sys-shape-slab01)` |
| `rounded-full` (circle) | March | `var(--sys-shape-pill01)` |
| Uniform Radius | Any | **REPLACE** with asymmetric `shape.*` tokens |

### 4. Behavioral Preservation

**Never remove or alter:** Event handlers, State logic, Business logic, API calls.

**Safe to transform:** All CSS-in-JS or Tailwind classNames, Typography components, Color references.

---

## Example Transformation

**Before (Legacy):**
```tsx
export function NavButton({ label }) {
  return (
    <button style={{
      backgroundColor: '--sys-color-ink-gold',
      borderRadius: '8px',
      fontFamily: 'Inter'
    }}>
      {label}
    </button>
  )
}
```

**After (KR v6.1 Strike):**
```tsx
import { motion } from 'framer-motion'

export function NavButton({ label }) {
  return (
    <motion.button
      className="bg-[var(--sys-color-solidarity-gold)] text-[var(--sys-color-charcoal-bg)] p-4"
      style={{
        fontFamily: 'var(--sys-type-font-work-sans)',
        borderRadius: 'var(--sys-shape-block03)',
        fontWeight: 700
      }}
      whileHover={{ scale: 1.03, borderRadius: 'var(--sys-shape-block02)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {label}
    </motion.button>
  )
}
```

---

**Version:** 3.0.0 | **Last Updated:** 2026-03-07 | **Mode:** Solidarity Only

## INPUT CHAIN
- `skeleton`: JSX from builder
- `enriched_spec`: JSON from generator

## FINAL POLISH
- Framer Motion springs: `transition={{type:"spring", stiffness:400}}`
- WCAG AA: `aria-*`, `@media (prefers-reduced-motion)`
- **ASSET GATE**: Preserve ALL `data-slot` attributes exactly
