---
name: component-builder
description: Production-grade UI component creator for Kerala Rage design system with
  M3 Expressive principles. Creates production-ready React/TypeScript components with
  100% design token compliance, ARIA accessibility, and kr-solidarity aesthetics.
  Solidarity Mode Only. Use when creating new components, building UI elements from
  scratch, or generating production-ready React components with the Kerala Rage typography
  stack and kr-solidarity morphology.
metadata:
  version: 3.0.0
  tags:
    - react
    - typescript
    - component-building
    - kerala-rage
    - m3-expressive
---

# Component Builder Skill (v3.0)

**Role:** Production-grade UI Component Creator for Kerala Rage kr-solidarity
**Context:** Material 3 Expressive + Kerala diaspora / Naarm-Melbourne aesthetics
**Output:** Production-ready React/TypeScript components with 100% `--sys-color-*` token compliance

---

## Core Principles

### 1. The Kerala Rage Typography Stack

**NEVER use Inter, Roboto, Arial, or System fonts.** Permitted fonts only:

| Font | Usage | CSS Variable |
|---|---|---|
| **Fraunces** | Headlines, hero moments (wght 700, variable SOFT/WONK axes) | `--sys-type-font-fraunces` |
| **Work Sans** | Body, UI labels, functional text (wght 400–600) | `--sys-type-font-work-sans` |
| **JetBrains Mono** | Code, data, technical values (wght 400–600) | `--sys-type-font-mono` |

Extreme contrast typography is the M3 Expressive standard — use dramatic weight ratios (wght 300 vs wght 900).

### 2. Kerala Rage Component Archetypes

All components map to a named archetype. Use archetype conventions for naming and structure:

| Archetype | Purpose | Examples |
|---|---|---|
| **Seed** | Atomic — single interactive element | Button, Chip, Badge |
| **Pebble** | Linear composition — stacked or sequential | Progress indicator, Stacked chips |
| **Lens** | Focal container — modal, overlay, inspection | Modal, Popover, Drawer |
| **Jar** | Simple frame — card, list item, container | Card, ListItem, Panel |
| **Cabinet** | Complex layout — grid, multi-column | Dashboard grid, Feature grid |
| **Stone** | Structural — divider, spacer, border | Divider, Spacer, Rule |

### 3. Kerala Rage Morphology

- **Asymmetric shapes**: Use varied border-radius (e.g., `32px 8px 28px 12px`), never uniform `8px` everywhere
- **Elevation via shadow**: Use `--sys-shadow-*` tokens, layered for depth
- **Texture**: Apply `bg-noise` or `halftone-grid` class to surfaces where appropriate
- **Z-layering**: substrate (Z-0) → atmospheric overlay (Z-1–2) → UI foreground (Z-3+)

### 4. Token Law — Colors

**All colors MUST use `--sys-color-*` CSS variables. Never hardcode hex.**

```css
/* ✅ Correct */
background: var(--sys-color-asphaltBlack);
color: var(--sys-color-paperWhite);
border-color: var(--sys-color-kr-ink-gold);

/* ❌ Forbidden */
background: #1A1714;
color: #F5F0E8;
border-color: #D4A84B;
```

Key semantic tokens:
- `--sys-color-asphaltBlack` — Global floor, dark backgrounds (`#1A1714`)
- `--sys-color-paperWhite` — Text on dark (`#F5F0E8`)
- `--sys-color-kr-ink-gold` — Primary brand (`#D4A84B`)
- `--sys-color-waratahRed` — Secondary brand, urgent actions (`#C45C4B`)
- `--sys-color-ochreEarth` — Tertiary, grounded elements (`#B8733D`)
- `--sys-color-gumLeafGreen` — Natural accents, shadows (`#6B7F6E`)
- `--sys-color-concreteGrey` — Neutral UI, borders, disabled (`#A39B8F`)
- Tonal steps: `--sys-color-primary-{0|10|40|50|90|100}`

### 5. Logic & Accessibility

- **ARIA First**: Every interactive element must have `aria-label` or `aria-labelledby`
- **States**: Handle `loading`, `disabled`, `error`, and `empty` states explicitly
- **Micro-interactions**: Spring physics via `cubic-bezier(0.34, 1.56, 0.64, 1)` for hovers
- **Focus states**: Visible, keyboard-navigable, never hidden

---

## Workflow

1. **Receive Spec**: Component name, archetype, props, and design intent
2. **Archetype Mapping**: Assign to Seed / Pebble / Lens / Jar / Cabinet / Stone
3. **Token Enforcement**: Enforce `--sys-color-*` only; Fraunces/Work Sans/JetBrains Mono only
4. **Generate Code**:
   - Use `lucide-react` for icons
   - Use `framer-motion` for complex spring physics
   - Use `clsx` + `tailwind-merge` for class management
   - Tailwind v4 classes consume `--sys-color-*` via CSS variable bridge
5. **Compliance Check**: Verify against Anti-Slop rules below
6. **Output**: `.tsx` file + brief archetype annotation

---

## Anti-Slop Rules (Hard Gates)

```
❌ Inter, Roboto, Arial, Helvetica as primary fonts
❌ Hardcoded hex values anywhere in styles
❌ Uniform border-radius (e.g., rounded-lg on everything)
❌ Purple or blue gradients
❌ Generic SaaS aesthetic (flat cards, neutral palette)
❌ White (#FFFFFF) backgrounds — use --sys-color-paperWhite on dark surfaces
❌ Missing ARIA labels on interactive elements
✅ All colors from --sys-color-* tokens
✅ Fraunces / Work Sans / JetBrains Mono only
✅ Asymmetric border-radius per archetype spec
✅ Spring physics on hover/active states
✅ Explicit loading, error, empty state handling
```

---

## Code Template

```tsx
// Example: Seed archetype — Primary Button
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

interface SeedButtonProps {
  label: string
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  'aria-label'?: string
}

export function SeedButton({
  label,
  variant = 'primary',
  disabled = false,
  loading = false,
  onClick,
  'aria-label': ariaLabel,
}: SeedButtonProps) {
  return (
    <motion.button
      className={clsx(
        // Base — asymmetric kr-solidarity shape
        'relative inline-flex items-center gap-2 px-6 py-3 font-work-sans font-semibold',
        'transition-all duration-[250ms]',
        // Archetype: Seed — pill with asymmetric radii
        'rounded-[40px_12px_40px_12px]',
        variant === 'primary' && [
          'bg-[--sys-color-kr-ink-gold] text-[--sys-color-asphaltBlack]',
          'hover:shadow-[0_8px_24px_rgba(212,168,75,0.35)]',
        ],
        variant === 'secondary' && [
          'bg-transparent border border-[--sys-color-waratahRed] text-[--sys-color-waratahRed]',
        ],
        variant === 'ghost' && [
          'bg-transparent text-[--sys-color-paperWhite] hover:bg-[--sys-color-primary-10]',
        ],
        disabled && 'opacity-40 cursor-not-allowed',
      )}
      whileHover={!disabled ? { scale: 1.03 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      aria-busy={loading}
    >
      {loading ? <span className="animate-spin">⟳</span> : null}
      {label}
    </motion.button>
  )
}
```

---

## Integration

**Post-build validation chain:**
```
component-builder (build)
  → component-visual-audit (visual compliance check)
  → jest-test-scaffolder (unit tests)
  → storybook-scaffolder (documentation)
```

**Related skills:**
- `wireframe-annotator` — Upstream annotated wireframe with asset slot specs
- `component-transformer` — Migrate existing components to kr-solidarity
- `asset-placement-strategy` — Place KR assets within hero sections
- `ui-design-evaluator` — Score visual compliance post-build

---

**Version:** 3.0.0 | **Last Updated:** 2026-02-28 | **Mode:** Solidarity Only
