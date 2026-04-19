# DOC-009 Remaining Violations — Remediation Plan
**Date:** 2026-04-18
**Status:** Partially complete
**Trigger:** Codex agent audit confirmed Gemini's DOC-009 remediation was only partially implemented and the tracker had drifted ahead of code truth.

---

## Violation Status Summary

| ID | Category | Prior Claim | Actual State Found | Fix Applied |
|---|---|---|---|---|
| V-001 | Typography | ✅ Confirmed done | Libre Bodoni in hero — correct | No action needed |
| V-007 | Typography | ✅ Confirmed done | `font-thin` on stat metrics — correct | No action needed |
| V-003 | Assets | ❌ Claimed fixed | `leaf_fern.svg` never existed in repo; `Compass` (lucide) already in `AnalysisPage.tsx` | Confirmed compliant; no swap needed |
| V-004 | Background | ❌ Not fixed | Spreadsheet guidance points to deprecated legacy Gallery/Nocturnal background intent; `SplitHeader.tsx` text-token cleanup landed but canonical `/auth` background treatment is still unspecified | **Blocked** — needs current canonical `/auth` background decision from active design truth |
| V-006 | Token | ❌ Not fixed | Drop zone in `DocumentStack.tsx` used `outline-variant`, `surface-KrDark-slate-smoke-*` (Gallery/undefined tokens) | **Fixed** — replaced with explicit `var(--kr-color-charcoal-background-steps-*)` Laboratory tokens |
| V-010 | Token | ❌ Not fixed | `displayHero` and `metricDisplay` type scale tokens absent from `design-tokens.css` | **Fixed** — added `--kr-type-scale-display-hero` and `--kr-type-scale-metric-display` |

---

## File-Level Changes Made

### `frontend/src/components/shared/SplitHeader.tsx`
- Residual cleanup only: removed `'text-parchment'` from the proclamation `<h1>` and switched it to `var(--kr-color-paper-white-base)`.
- This is valid token hygiene, but it does **not** close spreadsheet row `V-004`, which targets the canonical `/auth` background treatment rather than a header text color.

### `frontend/src/features/documents/DocumentStack.tsx`
- **V-006:** Replaced Drop Zone Tailwind classes:
  - `border-outline-variant/20` → `var(--kr-color-charcoal-background-steps-4)`
  - `bg-surface-KrDark-slate-smoke-low/20` → `var(--kr-color-charcoal-background-steps-1)`
  - Hover uses JS `onMouseEnter/Leave` to inject `var(--kr-color-ink-gold-steps-0)` border + `charcoal-steps-2` background.

### `frontend/src/design/tokens/tokens.json`
- **V-010:** Added the missing source-of-truth aliases:
  ```json
  "displayHero": { "$type": "text", "$value": "clamp(96px, 12vw, 180px)" }
  "metricDisplay": { "$type": "text", "$value": "clamp(32px, 4vw, 56px)" }
  ```

### `frontend/src/design/styles/design-tokens.css`
- **V-010:** Regenerated from `tokens.json`, emitting the two missing type scale aliases:
  ```css
  --kr-type-scale-display-hero: clamp(96px, 12vw, 180px);
  --kr-type-scale-metric-display: clamp(32px, 4vw, 56px);
  ```

### `frontend/src/features/analysis/AnalysisPage.tsx` (V-003)
- No change required. `leaf_fern.svg` was **never imported** into this codebase.
- The `Compass` icon from `lucide-react` is already in use on line 244 as the compliant replacement.
- V-003 as written in DOC-009 describes a Figma-only asset swap, not a runtime code change.

---

## Remaining Gaps

- `V-004` remains open because Gallery/Nocturnal is confirmed deprecated legacy design guidance.
- The canonical `/auth` background treatment must come from active design canon/Figma, not deprecated residue under `assets/uncategorized/originals_backup/`.

---

## Next Steps

1. **Resolve V-004 source of truth** — Replace deprecated Gallery/Nocturnal guidance with the approved canonical `/auth` background treatment from the active design canon/Figma file.
2. **Implement V-004 in `/auth` owner** — Apply the approved background treatment in `frontend/src/screens/02_auth/AuthModal.tsx`.
3. **Optional lint follow-up** — Add a rule catching `surface-KrDark-*`, `outline-variant`, and `text-parchment` if the team wants governance enforcement beyond this repair.
