# DOC-009 Fix Tickets

## Priority 1 (Breaking / Mode Contamination)

### [FIX] Page 4 Ingestion: Mode Contamination

**Severity**: 🔴 BREAKING
**File**: `frontend/src/features/ingestion/IngestionPage.tsx`
**Instruction**:
Refactor the "Drop Zone" container to use strictly Laboratory tokens.

- Change `border-flannel-flower/20` -> `border-eucalypt-smoke-light` (or correct Lab token)
- Change background hover states to Lab-appropriate dark modes, avoiding Gallery warmth.

### [FIX] System: Add Missing Tokens

**Severity**: 🟠 HIGH (Systemic)
**File**: `design-system/tokens.json`
**Instruction**:
Add the following definitions:

```json
"typography": {
  "scale": {
    "displayHero": { "font": "Libre Bodoni", "size": "96px", "weight": 700 },
    "metricDisplay": { "font": "Work Sans", "size": "var(--scale-24)", "weight": 200 }
  }
}
```

## Priority 2 (High / Asset Loyalty)

### [FIX] Page 1 Landing: Restore Libre Bodoni

**Severity**: 🟠 HIGH
**File**: `frontend/src/features/landing/LandingPage.tsx`
**Instruction**:
Replace the "Proclamation" text class to use the new `displayHero` or specifically apply `font-family: 'Libre Bodoni'` to the "Career" wordmark, ensuring it matches the 96px specification.

### [FIX] Page 2 Auth: Restore Compass Metaphor

**Severity**: 🟠 HIGH
**File**: `frontend/src/features/auth/Login.tsx`
**Instruction**:
Remove `specimenGrid` (Fern) import.
Import `compass` asset (placeholder if needed, but named correctly).
Set `className="animate-spin-slow"` properly on the compass.

### [FIX] Page 5 Analysis: Scientific Weights

**Severity**: 🟠 HIGH
**File**: `frontend/src/features/analysis/Analysis.tsx`
**Instruction**:
Target the "Score" or "Key Metric" numbers.
Remove `font-bold` / `font-black`.
Apply `font-weight: 200` (or `font-light` if 200 unavailable) to align with "Clinical/Laboratory" aesthetic.

## Priority 3 (Medium / Polish)

### [FIX] Page 6 Opportunity: Sentry Animation

**Severity**: 🟡 MEDIUM
**File**: `frontend/src/features/opportunities/Opportunities.tsx`
**Instruction**:
Add a `useInterval` or CSS animation to the Kookaburra image that rotates it `2deg` and back every 8-12 seconds to simulate a "Live Sentry".
