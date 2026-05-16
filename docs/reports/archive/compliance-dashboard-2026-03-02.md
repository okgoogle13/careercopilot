# Kerala Rage Compliance Dashboard

Generated: March 1, 2026
Scope: Static scan of `frontend/src/components`, `frontend/src/features`, and adjacent styling references in `frontend/src`
Method: Local `rg`-based code scan (no MCP dashboard server was available in this session)

## Overall Score

29/100

The frontend is still early in the migration from legacy MUI and generic styling conventions into kerala-rage kr-solidarity. The new shell branding work and `KrIcon` component improve asset adoption, but token usage is still sparse across feature components.

## Metric Breakdown

| Metric | Result | Notes |
| --- | --- | --- |
| Component migration progress | 19 / 193 component or feature `.tsx` files (9.8%) | Files explicitly using `--sys-color-*` remain a small minority. |
| Token adoption | 20 files with `design-tokens.css` or `var(--sys-color-*)` signals | Against the same scan set, token-aware styling is still limited. |
| Hardcoded color drift | 26 files in `frontend/src` still contain hex literals | Most are story/demo/design files, but they still indicate migration debt. |
| Typography compliance | 105 files reference approved kerala-rage typography signals; 47 still reference `Inter`, `Roboto`, or `Arial` | Typography migration is mixed, not complete. |
| Asset usage | 18 files reference Kerala Rage assets; 42 files still reference placeholder/storybook/demo assets | Brand asset adoption is improving but not yet dominant. |
| MUI dependency footprint | 30 files in `frontend/src` still import `@mui/*` | This remains the largest blocker to visual consistency. |

## Top 10 Non-Compliant Components

Priority is based on visible surface area plus direct `@mui/*` dependency.

1. `frontend/src/components/features/Documents/UploadResume.tsx`
2. `frontend/src/components/features/Documents/DocumentBrowser.tsx`
3. `frontend/src/components/features/Documents/DocumentPreview.tsx`
4. `frontend/src/components/documents/DocumentVersionHistory.tsx`
5. `frontend/src/components/features/opportunities/CareerIntelligence.tsx`
6. `frontend/src/components/features/opportunities/CareerGrowthHub.tsx`
7. `frontend/src/components/features/opportunities/JobMatching.tsx`
8. `frontend/src/components/features/opportunities/JobCard.tsx`
9. `frontend/src/components/features/opportunities/JobInput.tsx`
10. `frontend/src/components/features/opportunities/FilterPanel.tsx`

These files should be the next migration targets because they sit on user-facing flows and still pull MUI primitives into otherwise token-driven surfaces.

## Findings

- The strongest positive signal is typography token usage: kerala-rage font utilities are already present in many files.
- Semantic color token usage is still low enough that most of the app can still visually drift away from the design system.
- MUI is still embedded in multiple document and opportunities flows, which means component migration is incomplete at the feature layer.
- Placeholder and Storybook asset references still outnumber Kerala Rage asset references in the scanned frontend tree.
- No new hardcoded hex colors were introduced by the Task A or Task B work completed in this session.

## Recommended Next Actions

1. Replace the 10 priority MUI-heavy components above with kerala-rage UI primitives first.
2. Run `token-injector` or an equivalent codemod pass on the document and opportunities feature folders to replace color literals and legacy palette references.
3. Promote `KrIcon` into any navigation, status, and empty-state components still using text placeholders or generic icon sets.
4. Add a lint rule or CI check that flags new `@mui/*` imports in `frontend/src/components` and `frontend/src/features`.
5. Follow up with a visual pass once Playwright or design-system-sidekick is available, because this report is static-analysis only.
