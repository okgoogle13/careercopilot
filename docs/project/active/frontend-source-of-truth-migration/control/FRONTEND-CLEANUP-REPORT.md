# Frontend Cleanup Report

**Status:** Open
**Primary execution owner:** `frontend-cleanup-manager`

## Executive Summary

The canonical frontend runtime is largely stable, but the migration control layer is still ahead of some cleanup execution and behind some live-runtime facts.

Current evidence:
- `frontend/src/App.tsx` mounts `31` live paths.
- `control/route-matrix.json` still reports `row_count: 27`.
- `control/status.md` previously reported `26/26 reachable paths`, which is no longer sufficient as a PM truth statement.
- runtime route integrity and screen-pair checks are green, but PM/control artifacts still need a formal resync and final archive path.

## Routing Drift

### Live paths that need explicit route-matrix classification

These live mounts in `frontend/src/App.tsx` need explicit representation or classification in the route-matrix layer:

- `/auth`
- `/animation-test`
- `/prototype/*`
- `/dashboard-overview`
- `/kanban`
- `/ingestion`
- `/feed`
- `/studio`
- `/editor`

### Required classification buckets

Every live mount must be categorized as one of:

- canonical product route
- support-only route
- redirect
- internal tool
- quarantine prototype route
- fallback

## Surface Ownership Drift

Single-owner rule:
- one canonical runtime owner per live route
- no competing `pages/`, `features/`, prototype, or migration-reference owners for the same live route

Known canonical owners:
- `/analysis` -> `frontend/src/features/analysis/AnalysisPage.tsx`
- `/apply/quick` -> `frontend/src/features/applications/ApplyQuick.tsx`
- `/tracker` -> `frontend/src/features/applications/ApplicationTracker.tsx`
- `/profile` -> `frontend/src/features/profile/ProfileView.tsx`
- `/asset-library` -> support-only surface, not a product-pillar owner
- `/prototype/*` -> quarantine support-reference access only

## Shell Drift

- `MigratedRouteLayout` is the canonical protected shell for most product routes.
- `ProtectedLayout` remains intentional for support-only surfaces such as `/asset-library` and `/test-tokens`.
- Prototype shell semantics are reference-only and must not re-enter canonical ownership.

## API Convergence Gaps

No new API-convergence blocker is introduced here. Remaining route closeout is still blocked by local Firebase/auth environment readiness for:

- `/tracker`
- `/profile`

## Unused / Dead Candidates

Candidates for retirement or archive review:

- retired `/kr/*` route residue in planning/history docs
- duplicate route-owner candidates under non-canonical surfaces
- migration-only artifacts that no longer affect runtime or design canon

## Safe Retirements

Safe retirement requires proof that a candidate is:

- not mounted by `App.tsx`
- not imported by live runtime code
- not the documented canonical owner of a live route

## Blockers

- route-matrix/runtime resync is still pending
- canonical destination mapping for surviving migration artifacts is still pending
- no-proof-no-delete rule still needs execution evidence for runtime import absence
- `/tracker` and `/profile` env-backed closeout remain blocked

## Canonical Destination Map Required

`frontend-cleanup-manager` must produce a destination map covering:

- runtime route code -> `frontend/src/features/**` or approved live runtime location
- shared primitives -> `frontend/src/components/ui/**`
- retained design canon -> `docs/design/**`
- migration-only analysis/control scaffolding -> retained archive/history or delete

## Execution Batches For `frontend-cleanup-manager`

### Batch A: Runtime-truth resync

- rescan live routes
- align `App.tsx`, `route-registry.ts`, `routes.json`, `route-matrix.json`, and `status.md`
- normalize route counts and route classes

### Batch B: Single-owner surface cleanup

- identify duplicate route-owner candidates
- keep one canonical owner per live route
- mark support-only and retire-only surfaces explicitly

### Batch C: Migration-workspace dependency proof

- prove no live runtime imports from `docs/project/active/frontend-source-of-truth-migration/**`
- block closeout if any runtime dependency remains

### Batch D: Terminal archive/dissolution closeout

- publish canonical destination map
- move surviving long-lived artifacts to canonical homes
- reduce `frontend-source-of-truth-migration` to retained archive/history only

## Recommended Next Batch

Run **Batch A: Runtime-truth resync** first, then update PM metrics and milestone tracking before retirement work proceeds.

## Downstream Salvage Handoff

This report does **not** complete prototype salvage by itself.

After Batch A establishes stable runtime owner mapping, run the separate salvage
lane recorded in `control/PROTOTYPE-SALVAGE-TRACKER.md`:
- salvage the remaining behavior-bearing prototype candidates into canonical runtime destinations
- or mark them `ALREADY_CANONICAL` / `DISCARDED` with evidence

`frontend-cleanup-manager` owns cleanup and closeout framing. The salvage pass is
a distinct execution stream that must finish before Batch D can claim the
migration workspace is safe to dissolve.
