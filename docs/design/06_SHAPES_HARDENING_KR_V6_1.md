# KR v6.1 Shapes Hardening: Code Audit

This document summarizes the findings from the audit of the Kerala Rage components in `frontend/src/components/kerala-rage/` for compliance with the KR Solidarity v6.1 design system.

## Summary of Findings

| Category | Count | Primary Locations |
| :--- | :--- | :--- |
| **Hardcoded Border Radius** | 5+ | `NexusInput`, `SolidarityProgress`, `Manifesto*`, `SolidarityCard` |
| **Legacy Archetype Names** | 10+ | `Pebble`, `Stone`, `Slab` (found in comments and JSDoc) |
| **Font Literal Usage** | 4+ | `ActionButton`, `ManifestoSlab`, `NexusInput` |
| **Deprecated Tokens** | 1 | `LayeredHero` (`labWrenMetalBlue`) |

## Detailed Audit by Component

### 1. ActionButton.tsx (Strike Archetype)

- **Status**: Mostly compliant but needs minor hardening.
- **Findings**:
  - **Font Literal**: Uses `var(--sys-type-fontFamilies-primary, "Work Sans", sans-serif)`.
  - **Mapping**: Should be strictly `var(--sys-type-fontFamilies-primary)`.
- **Action**: Remove fallback font literals.

### 2. ManifestoSlab.tsx (Scaffold Archetype)

- **Status**: High non-compliance (Legacy).
- **Findings**:
  - **Legacy Name**: References `Slab` (Legacy).
  - **Hardcoded Radius**: Uses `var(--shape-scaffoldFrame01)` (v5.x prefix).
  - **Font Literals**: `var(--sys-type-font-work-sans, "Work Sans", sans-serif)`, `var(--sys-type-font-fraunces, "Fraunces", serif)`.
- **Action**: Map to `Scaffold` archetype tokens; unify types to `--sys-type-fontFamilies-*`.

### 3. NexusInput.tsx (ScaffoldInput Archetype)

- **Status**: High non-compliance (Legacy).
- **Findings**:
  - **Legacy Name**: References `Pebble`.
  - **Hardcoded Radius**: Uses Tailwind class `rounded-pebble`.
  - **Font Literal**: Uses `var(--font-primary)`.
- **Action**: Map to `Scaffold` (base) or `ScaffoldInput` tokens.

### 4. SolidarityCard.tsx (Placard Archetype)

- **Status**: Moderate non-compliance.
- **Findings**:
  - **Hardcoded Radius**: Uses `var(--shape-placardTorn01)` (v5.x prefix).
- **Action**: Update to `var(--sys-shape-placardTorn01)`.

### 5. UnifiedPane.tsx / UnifiedColumn.tsx (Placard/Scaffold)

- **Status**: Legacy references.
- **Findings**:
  - **Legacy Name**: References `Stone`.
- **Action**: Update JSDoc to reference `Placard` or `Scaffold`.

### 6. SolidarityProgress.tsx (Kinetic)

- **Status**: Compliant but verification required.
- **Findings**:
  - Uses `borderRadius` array for morphing.
- **Action**: Ensure all tokens used in the array are v6.1 verified.

### 7. LayeredHero.tsx (Substrate)

- **Status**: Deprecated token usage.
- **Findings**:
  - Uses `labWrenMetalBlue`.
- **Action**: Replace with `protestMetalBlue`.

## Resolution & Verification (v6.1 Hardened Baseline)

The following refactorings were completed on 2026-03-29:

| Component | Refactor Description | Status |
| :--- | :--- | :--- |
| **ActionButton** | Removed font literal fallbacks; strictly using `var(--sys-type-fontFamilies-*)`. | ✅ |
| **ManifestoSlab** | Updated JSDoc to `Scaffold` archetype; mapped radii to `var(--sys-shape-scaffoldFrame01)`. | ✅ |
| **NexusInput** | Updated JSDoc to `ScaffoldInput`; replaced Tailwind `rounded-pebble` with `var(--sys-shape-scaffoldFrame01)`. | ✅ |
| **SolidarityCard** | Updated shape token prefix to `var(--sys-shape-placardTorn01)`. | ✅ |
| **UnifiedPane/Column** | Updated JSDoc to replace legacy `Stone` archetype with `Placard/Scaffold`. | ✅ |
| **LayeredHero** | Replaced deprecated `labWrenMetalBlue` with `protestMetalBlue`. | ✅ |
| **ManifestoCard** | Updated JSDoc; mapped radii and fonts to semantic tokens; replaced hardcoded `bg-asphalt-black`. | ✅ |

### Verification Status

- **Type Check**: `yarn type-check` passed (Exit Code 0).
- **Linting**: `yarn lint` passed for `kerala-rage` components (existing test-level failures unrelated to hardening).
- **Design Review**: Shape tokens (Puff, Organic, Tectonic) are now the canonical kinetic baseline.

**This baseline establishes the hardened v6.1 shapes for CareerCopilot.**
