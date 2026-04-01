# Manifest Drift Summary — P05
**Generated:** 2026-04-01 | **Phase:** P05 Route-Level Gap-Fill Planning

---

## Executive Summary

| Metric | Count |
| --- | --- |
| Total production routes | 33 |
| Already canonical (features/* source) | 12 |
| Redirect-only (no source migration needed) | 13 |
| **Needs migration** (pages/* → features/*) | **8** |
| Needs registry entry only | 4 |
| Quarantine candidates (dev utilities) | 2 |
| Prototype routes (excluded from sprint) | 9 |

**Sprint P06 workload: 8 App.tsx import remounts + 4 registry entries + 2 quarantine moves.**

---

## Route Drift Detail

### IN_APP_ONLY (5 routes missing from route-registry.ts)

| Path | Current Source | Action |
| --- | --- | --- |
| `/lookout` | `screens/06_lookout/LookoutDiscovery` | Add registry entry |
| `/applications` | `features/applications/ApplicationTracker` | Add registry entry (source already canonical) |
| `/docs` | `pages/DocsPage` | Migrate + add registry entry |
| `/apply` | `pages/ApplyPage` | Add registry redirect entry |
| `/opportunities` | `react-router-dom/Navigate` | Add registry entry |

### IN_REGISTRY_ONLY (9 prototype routes not in App.tsx)

All 9 `/prototype/*` routes are correctly absent from App.tsx — they are support-reference surfaces, not live routes. No action required.

### NON-CANONICAL SOURCES (13 routes still importing from pages/)

| Path | pages/ Component | Target features/ Owner |
| --- | --- | --- |
| `/` | `LandingPage` | `features/landing` |
| `/animation-test` | `AnimationTest` | QUARANTINE |
| `/dashboard` | `DashboardPage` | `features/dashboard` |
| `/profile` | `ProfilePage` | `features/profile` |
| `/lookout` | (screens/06_lookout) | `features/opportunities` |
| `/applications` | (already features/) | — |
| `/analysis` | `AnalysisPage` | `features/analysis` |
| `/docs` | `DocsPage` | `features/documents` |
| `/apply` | `ApplyPage` | `features/applications` |
| `/generation` | `GenerationPage` | `features/documents` |
| `/settings` | `SettingsPage` | `features/settings` |
| `/onboarding` | `OnboardingPage` | `features/onboarding` |
| `/test-tokens` | (components/debug) | QUARANTINE |

---

## Token Drift

| Gap | Severity | Resolve At |
| --- | --- | --- |
| Shape tokens in tokens.json not exported to CSS | HIGH | P07 |
| Radius tokens in tokens.json not exported to CSS | HIGH | P07 |
| `--sys-color-*` in docs vs `--kr-color-*` in CSS | MEDIUM | P15 (docs update) |
| Motion tokens hardcoded in components | LOW | Backlog |
| Hardcoded hex in `features/analysis/Analysis.tsx` | MEDIUM | P07 |
| 2 duplicate primitives (Button, metric-card) | MEDIUM | P07 |

---

## P06 Execution Order (recommended)

Run in this sequence to minimise broken-import windows:

1. Add 4 missing registry entries (no code changes — registry only)
2. Remount 8 pages/* imports to features/* in App.tsx (batch edit)
3. Run `npx tsc --noEmit` — confirm 0 errors
4. Run `quarantine_dead_routes.sh --dry-run` — review 2 quarantine candidates
5. Run `quarantine_dead_routes.sh --execute` — move /animation-test + /test-tokens
6. Run `scripts/sprint/generate_manifests.sh` — refresh routes.json + orphans.json
7. Confirm `orphans.json` nonFeatureRoutes count drops from 31 → target ≤5

---

## Authority Conflicts

**None detected.** App.tsx and route-registry.ts are consistent where entries overlap. The 5 IN_APP_ONLY routes are gaps (missing entries) not conflicts (contradictory entries). Safe to proceed to P06.
