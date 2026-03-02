---
name: m3-expressive-ui-evaluator
description: Evaluate UI designs and mockups against Material Design 3 Expressive
  standards as applied through the Kerala Rage kr-solidarity design system. Generate
  high-fidelity M3 Expressive mockups from wireframes with 400-point scoring system
  (M3 Compliance, Accessibility, User Flow, Visual Hierarchy). Creates interactive
  HTML artifacts and React component code aligned to --sys-color-* tokens.
metadata:
  version: 2.0.0
  tags:
    - m3-expressive
    - kerala-rage
    - design-evaluation
    - wireframe
---

# M3 Expressive UI Evaluator & Mockup Creator

## Purpose

Evaluate designs against Material Design 3 Expressive standards as implemented through the **Kerala Rage kr-solidarity design system**. Generates high-fidelity M3 Expressive mockups from wireframes, screenshots, or descriptions — using the correct kr-solidarity token set, not generic M3 defaults.

## When to Use

- **Evaluate designs** for M3 Expressive compliance (kr-solidarity flavour)
- **Create high-fidelity mockups** from wireframes after `wireframe-annotator`
- **Generate interactive prototypes** with M3 Expressive spring physics
- **Score component visual maturity** (0–400 points)
- **Transform baseline components** into M3 Expressive kr-solidarity style
- **Validate design decisions** before passing to `component-builder`

## When to Invoke

### Option 1: Early Validation (Post-Wireframing)
- **After**: `wireframe-annotator` produces annotated wireframes
- **Purpose**: Validate M3 Expressive + kr-solidarity compliance before spec generation
- **Output**: Score + feedback for refinement
- **Gate**: Score ≥ 240/400 to proceed to `component-spec-generator`

### Option 2: Mockup Generation (Pre-Implementation)
- **After**: `component-spec-generator` produces implementation specs
- **Purpose**: Generate high-fidelity interactive mockups for stakeholder review
- **Output**: Interactive HTML prototype + React component scaffolding
- **Gate**: Mockup confirms visual intent matches technical specs before `component-builder`

---

## Process

```
INPUT → ANALYZE → EVALUATE → DESIGN → DELIVER
```

### 1. INPUT

- Wireframes (low-fidelity sketches or `wireframe-annotator` output)
- Screenshots (existing designs to evaluate)
- Text descriptions (requirements)
- Component specifications

### 2. ANALYZE

- Extract design intent and identify component archetypes (Seed/Pebble/Lens/Jar/Cabinet/Stone)
- Map user flows and interaction patterns
- Assess current kr-solidarity compliance level
- Identify asset placement slots (Z-0 through Z-3+)

### 3. EVALUATE

Score against M3 Expressive + kr-solidarity standards (400 points total).

### 4. DESIGN

Apply kr-solidarity tokens and M3 Expressive principles to generate mockup.

### 5. DELIVER

- Interactive HTML artifact
- React component code
- Evaluation report (0–400 score)
- Component specifications with archetype annotations

---

## Evaluation Scoring (400 Points)

### 1. M3 Expressive + kr-solidarity Compliance (100 points)

**Typography (25 points)**:
- ✅ Kerala Rage font stack only: Fraunces / Work Sans / JetBrains Mono — 10 pts
- ✅ Extreme weight contrasts (wght 300 vs 900, M3 Expressive standard) — 10 pts
- ✅ Variable font optical sizing enabled — 5 pts
- ❌ Forbidden: Inter, Roboto, Arial, Helvetica, Sora, Plus Jakarta Sans

**Color (25 points)**:
- ✅ All colors via `--sys-color-*` semantic tokens — 10 pts
- ✅ Kerala Rage palette: asphaltBlack, kr-ink-gold, waratahRed, ochreEarth, gumLeafGreen — 10 pts
- ✅ No purple/blue gradients — 5 pts
- ❌ Forbidden: hardcoded hex, `--nc-*` tokens, generic M3 purple (#6750a4)

**Motion (25 points)**:
- ✅ Spring physics easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` — 10 pts
- ✅ Hover bloom: scale + elevation on interactive elements — 10 pts
- ✅ Duration tokens: 50ms / 250ms / 500ms — 5 pts

**Layout (25 points)**:
- ✅ Asymmetric border-radius per archetype (not uniform) — 10 pts
- ✅ Varied spacing rhythm (not mechanical grid) — 10 pts
- ✅ Layered depth / elevation — 5 pts

### 2. Accessibility (100 points)

**WCAG Compliance (40 points)**:
- ✅ Color contrast ≥ 4.5:1 AA — 20 pts
- ✅ Focus indicators visible — 10 pts
- ✅ Touch targets ≥ 44×44px — 10 pts

**ARIA (30 points)**:
- ✅ Semantic HTML structure — 10 pts
- ✅ ARIA labels on interactive elements — 10 pts
- ✅ Role attributes correct — 10 pts

**Keyboard Navigation (30 points)**:
- ✅ Tab order logical — 10 pts
- ✅ All actions keyboard-accessible — 10 pts
- ✅ Escape/Enter behaviors correct — 10 pts

### 3. User Flow Logic (100 points)

**Hierarchy (40 points)**:
- ✅ Primary action clear — 15 pts
- ✅ Secondary actions distinct — 10 pts
- ✅ Visual weight matches importance — 15 pts

**Patterns (30 points)**:
- ✅ Follows established UI patterns — 15 pts
- ✅ Consistent with kr-solidarity conventions — 15 pts

**Error Handling (30 points)**:
- ✅ Error states designed — 10 pts
- ✅ Empty states designed — 10 pts
- ✅ Loading states designed — 10 pts

### 4. Visual Hierarchy (100 points)

**Type Scale (40 points)**:
- ✅ Kerala Rage typographic hierarchy applied — 20 pts
- ✅ Hierarchy clear at a glance — 20 pts

**Spacing (30 points)**:
- ✅ Rhythm intentional (8px / 16px / 24px / 40px increments) — 15 pts
- ✅ Not mechanically uniform — 15 pts

**Alignment (30 points)**:
- ✅ Elements aligned intentionally — 15 pts
- ✅ Asymmetry serves visual purpose — 15 pts

---

## Grade Scale

- **A (320–400)**: Exceptional — Production-ready M3 Expressive kr-solidarity
- **B (240–319)**: Good — Minor refinements needed, proceed with notes
- **C (160–239)**: Acceptable — Needs improvement before `component-builder`
- **D (80–159)**: Below standards — Significant rework required
- **F (<80)**: Critical — Redesign recommended, run `wireframe-annotator` again

---

## Design Tokens Applied (Kerala Rage kr-solidarity)

### Color Tokens (`--sys-color-*`)

```css
/* Core backgrounds */
--sys-color-asphaltBlack: #1A1714;       /* Global floor */
--sys-color-primary-10: #2A1F0B;         /* Dark container */
--sys-color-primary-40: #8B7A35;         /* Container */

/* Brand */
--sys-color-kr-ink-gold: #D4A84B;        /* Primary accent */
--sys-color-waratahRed: #C45C4B;         /* Action / urgent */
--sys-color-ochreEarth: #B8733D;         /* Tertiary grounded */
--sys-color-gumLeafGreen: #6B7F6E;       /* Natural accent */
--sys-color-concreteGrey: #A39B8F;       /* Neutral / disabled */

/* Text */
--sys-color-paperWhite: #F5F0E8;         /* Primary text on dark */
```

### Typography Tokens

```css
/* Headlines — Fraunces variable */
font-family: var(--sys-type-font-fraunces);
font-variation-settings: "wght" 700, "SOFT" 50, "WONK" 0;
/* For expressive hero: "wght" 900, "SOFT" 100, "WONK" 1 */

/* Body / UI — Work Sans */
font-family: var(--sys-type-font-work-sans);
font-weight: 400; /* to 600 for emphasis */

/* Code / data — JetBrains Mono */
font-family: var(--sys-type-font-mono);
font-weight: 400;
```

### Motion Tokens

```css
--sys-motion-easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--sys-motion-duration-short: 50ms;
--sys-motion-duration-medium: 250ms;
--sys-motion-duration-long: 500ms;
```

### Shape Tokens (Asymmetric)

```css
/* Seed (button) */
--sys-shape-seed: 40px 12px 40px 12px;

/* Jar (card) */
--sys-shape-jar: 32px 8px 28px 12px;

/* Lens (modal) */
--sys-shape-lens: 24px 8px 20px 8px;

/* Pebble (chip/stack) */
--sys-shape-pebble: 20px 6px 20px 6px;
```

---

## M3 Expressive Validation Checklist

Before delivering a mockup:

### Typography
- [ ] Kerala Rage font stack only (Fraunces / Work Sans / JetBrains Mono)
- [ ] No forbidden fonts (Inter, Roboto, Arial, Sora, Plus Jakarta Sans)
- [ ] Weight contrast ≥ 3x (e.g., wght 300 body vs wght 900 headline)
- [ ] Variable fonts enabled (.woff2 with font-variation-settings)
- [ ] Optical sizing enabled (font-optical-sizing: auto)

### Color
- [ ] All colors via `--sys-color-*` tokens — zero hardcoded hex
- [ ] Kerala Rage palette only (no generic M3 purple, no --nc-* prefix)
- [ ] No purple gradients (#7C4DFF → #9C27B0)
- [ ] No generic Material Blue (#2196F3)

### Motion
- [ ] Spring physics: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- [ ] Hover bloom: scale(1.02–1.05) + elevation increase
- [ ] Duration tokens applied (50ms, 250ms, 500ms)
- [ ] `@media prefers-reduced-motion` respected

### Layout
- [ ] Asymmetric border-radius per archetype (not `rounded-lg` everywhere)
- [ ] Varied spacing rhythm
- [ ] Layered depth strategy (Z-0 substrate, Z-1–2 atmospheric, Z-3+ UI)
- [ ] Visual hierarchy clear

### States
- [ ] All 6 states: default, hover, active, disabled, focus, error
- [ ] State transitions smooth (spring physics)
- [ ] Loading, empty, error states included

### Accessibility
- [ ] Color contrast ≥ 4.5:1 (WCAG AA)
- [ ] Focus indicators visible
- [ ] Touch targets ≥ 44×44px
- [ ] Keyboard navigation logical
- [ ] ARIA labels present

---

## Example React Output

```tsx
// Archetype: Seed — Primary CTA Button (M3 Expressive)
import { motion } from 'framer-motion'

export function SeedCTA({ label, onClick }: { label: string; onClick: () => void }) {
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

- `wireframe-annotator` — Upstream: produces annotated wireframes with asset slots
- `ui-design-evaluator` — Parallel: full kr-solidarity visual compliance evaluation
- `component-builder` — Downstream: build production components from mockup specs
- `component-transformer` — Migrate existing components to M3 Expressive kr-solidarity
- `m3-expressive-compliance-dashboard` — Track M3 Expressive adoption across codebase
- `design-token-validator` — Validate tokens.json before evaluating

---

**Version:** 2.0.0 | **Status:** Production Ready | **Last Updated:** 2026-02-28
