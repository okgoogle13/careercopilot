# Sprint Brief

## Sprint Window

- **Sprint:** Sprint 2
- **Dates:** 2026-04-21 → TBD
- **Status:** Active — Figma site audit complete, remediation in progress
- **Status view:** `dashboard.html` is the UI over `TASKS.md`; no separate dashboard tracker is maintained

## Objective

Remediate the 16 findings from the Figma site audit (`https://fake-pound-31010647.figma.site`). Priority order: rendering failures first, then token hygiene, then typography fidelity. Two copy/interaction decisions must be made before those tasks start.

## Current State

- Sprint 1 closed 2026-04-21: all parity validation gates passed, drift-cleanup complete, design-drift CI wired.
- Figma site audit completed 2026-04-21: 16 findings across 8 files.
  - 4 rendering failures (undefined CSS tokens causing invisible styles)
  - 5 token hygiene gaps (hardcoded values, wrong namespace)
  - 7 typography/copy mismatches vs. Figma donor
- Active board: 15 remediation tasks in `TASKS.md` + 2 decisions required before last 4 tasks.

## Findings Summary (from 2026-04-21 audit)

| Severity | Count | Key files |
|---|---|---|
| Rendering failure | 4 | `AuthModal.tsx`, `JobCard.tsx`, `KSCResponsesView.tsx` |
| Token hygiene | 3 | `LandingPage.tsx`, `OpportunitiesDiscovery.tsx` |
| Typography | 4 | `LandingPage.tsx`, `AuthModal.tsx`, `OpportunitiesDiscovery.tsx` |
| Copy/interaction | 4 | `LandingPage.tsx`, `AuthModal.tsx`, `Dashboard.tsx` (decision-gated) |

## Active Board Contract

`TASKS.md` is the only active board. Tasks are ordered: rendering failures → token hygiene → typography → copy/interaction decisions.

## Acceptance Gate For Sprint Close

- All rendering-failure tasks resolved and verified
- All token hygiene tasks resolved
- Typography tasks resolved or explicitly deferred with rationale in `DECISIONS.md`
- Copy/interaction decisions recorded in `DECISIONS.md`
- No new route-shell regressions introduced
