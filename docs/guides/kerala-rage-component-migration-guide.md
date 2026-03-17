# Kerala Rage kr-solidarity - Component Migration Guide (v1.0)

## Overview
This guide documents the technical rationale and standard procedures for migrating legacy M3/Firebase-era components to the **Kerala Rage kr-solidarity** design system.

The primary goal is to ensure 100% compliance with the **Solidarity Mode** (no mode-switching), **archetype-specific shapes**, and **semantic design tokens**.

---

## The 8 Gold Standard Components
These components represent the "Source of Truth" for the design system. Use them as reference for any new components.

| Component | Archetype | File Path |
|-----------|-----------|-----------|
| **ActionButton** | Seed | `frontend/src/components/kerala-rage/ActionButton.tsx` |
| **KeralaRageButton** | Seed | `frontend/src/components/ui/KeralaRageButton.tsx` |
| **SolidarityCard** | Jar | `frontend/src/components/kerala-rage/SolidarityCard.tsx` |
| **Jar** (Select) | Jar | `frontend/src/components/ui/Jar.tsx` |
| **ManifestoSlab** | Cabinet | `frontend/src/components/kerala-rage/ManifestoSlab.tsx` |
| **Stone** | Stone | `frontend/src/components/ui/Stone.tsx` |
| **Lens** (Input) | Lens | `frontend/src/components/ui/Lens.tsx` |
| **StatusBadge** | Signal | `frontend/src/components/ui/StatusBadge/StatusBadge.tsx` |

---

## Core Migration Principles

### 1. Remove Mode-Switching
The `kr-solidarity` theme is a unified, high-contrast mode. Components should **never** check for `mode === 'KrDark'` or similar. All styling must be driven by CSS variables which are globally configured for the Solidarity experience.

### 2. Archetype Shapes (Asymmetric Radii)
Standardize border-radii using the archetype definitions:
- **Seed**: `40px 12px 40px 12px`
- **Jar**: `32px 8px 28px 12px`
- **Lens**: `24px 8px 20px 4px`
- **Cabinet**: `0px 32px 0px 32px`

### 3. Use Semantic Tokens
Never use hardcoded hex codes or RGBA values. Always use `--sys-color-*` tokens:
- **Primary Action**: `var(--sys-color-inkGold-base)`
- **Background**: `var(--sys-color-charcoalBackground-base)`
- **Error/High Alert**: `var(--sys-color-solidarityRed-base)`
- **Secondary Text**: `var(--sys-color-concreteGrey-base)`

---

## Migration Checklist
- [ ] Remove `useMode` or `ThemeContext` usages.
- [ ] Replace `rgba(...)` with partial tokens where possible (e.g., `rgba(var(--sys-color-inkGold-rgb), 0.15)`).
- [ ] Update Typography to use `var(--sys-type-font-work-sans)` or `var(--sys-type-font-sora)`.
- [ ] Create Storybook story using `storybook-scaffolder`.
- [ ] Verify using the `m3-expressive-ui-evaluator` skill.
