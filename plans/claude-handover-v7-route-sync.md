# Claude Handover — v7 Route Sync And Runtime Alignment

Date: 2026-04-01
Prepared by: Codex
Audience: Claude Code taking over active sprint execution

## Purpose

Take over execution of the v7 migration plan with route authority grounded in the live React runtime, not in stale route-intent artifacts.

Read first:

1. `plans/figma-sync-spec.md`
2. `plans/sprint-plan-v7-FINAL.md`
3. `frontend/src/App.tsx`
4. `frontend/src/config/route-registry.ts`
5. `frontend/src/config/navigation.schema.ts`

## Verified Current Status

### Verified In This Session

- `plans/figma-sync-spec.md` was updated to reflect runtime authority and the current route inventory.
- `plans/sprint-plan-v7-FINAL.md` was updated with a route sync addendum, corrected authority stack, and stronger stop conditions.
- No production route code was changed in this session.

### Live Runtime Route Map

Public and internal:

- `/`
- `/auth`
- `/login`
- `/register`
- `/style-guide`
- `/design-sidekick`
- `/animation-test`

Migrated product routes:

- `/dashboard`
- `/profile`
- `/opportunities`
- `/applications`
- `/analysis`
- `/apply`
- `/generation`
- `/settings`
- `/onboarding`

Support-only protected routes:

- `/asset-library`
- `/test-tokens`

Legacy redirects still mounted:

- `/tracker` -> `/applications`
- `/kanban` -> `/applications`
- `/lookout` -> `/opportunities`
- `/feed` -> `/opportunities`
- `/career/ingest` -> `/ingestion` -> `/profile`
- `/apply/quick` -> `/apply`
- `/ksc-generator` -> `/generation`
- `/cover-letter-generator` -> `/generation`
- `/job-queue` -> `/dashboard`
- `/identity` -> `/profile`
- `/dossier` -> `/profile`
- `/welcome` -> `/onboarding`
- `/documents` -> `/docs`
- `/editor` -> `/docs`

## Known Route Drift

This drift is real and must be fixed in code, not hand-waved in docs:

1. Runtime and nav use `/applications`, but `route-registry.ts` still defines `/tracker` as the migrated route.
2. Runtime exposes `/apply` and `/generation`, but `route-registry.ts` still centers legacy `/apply/quick`, `/ksc-generator`, and `/cover-letter-generator`.
3. `navigation.schema.ts` points to `/docs`, but `App.tsx` does not mount a `/docs` route.
4. `route-registry.ts` and design canon still describe `/documents`, while runtime redirects `/documents` to `/docs`.
5. `DocsPage` is imported in `App.tsx` but not mounted.

## Confirm Before Changing Code

These points need explicit confirmation from the code while you work:

1. `App.tsx` remains the runtime authority over `route-registry.ts` whenever they disagree.
2. `MigratedRouteLayout` remains the correct shell for product routes and `ProtectedLayout` remains support-only.
3. `/settings` is still a distinct migrated product route and should not be merged into `/profile`.
4. There is still no live `/profile/workbench` route.
5. `TemplateGallery` or equivalent workbench integration inside profile was not verified in this session and should be confirmed from code before any Figma-driven assumptions are adopted.

## Required Code Changes

### 1. Sync Route Registry To Runtime

Update `frontend/src/config/route-registry.ts` so it matches the live runtime route family.

Required outcomes:

- Add or promote:
  - `/applications`
  - `/apply`
  - `/generation`
- Demote legacy paths to redirect intent entries:
  - `/tracker`
  - `/kanban`
  - `/apply/quick`
  - `/ksc-generator`
  - `/cover-letter-generator`
- Keep `/settings` as its own migrated route.
- Keep `/profile` as its own migrated route.
- Do not collapse `/settings`, `/apply`, or `/generation` into `/profile`.

### 2. Resolve The `/documents` vs `/docs` Split

This is the highest-risk route mismatch because navigation currently points to a route that is not mounted.

Preferred resolution:

- Make `/documents` the canonical route.
  - Reason: this matches the design canon and existing route-intent docs better than `/docs`.
- Mount `DocsPage` at `/documents`.
- Add `/docs` as a redirect to `/documents`.
- Change `navigation.schema.ts` from `/docs` to `/documents`.
- Change `/editor` redirect target to `/documents`.

If you choose a different resolution, document the evidence and update all three authorities together:

- `App.tsx`
- `route-registry.ts`
- `navigation.schema.ts`

Do not leave mixed authority behind.

### 3. Preserve Shell Split

- `MigratedRouteLayout` remains the shell for product routes.
- `ProtectedLayout` remains support-only until explicitly retired.
- Do not move `/style-guide` into protected migrated routes unless there is an explicit product decision.

### 4. Keep Figma Sync Honest

Figma should mirror runtime truth first.

- Do not model a future-state consolidated `ProfileHub` with `/profile/workbench` unless the route is actually implemented.
- If the Figma file contains workbench content, map it to the current route decision for documents/generation instead of inventing hidden nested profile routes.

## Stop Conditions

Stop and document before continuing if any of the following is true:

1. `App.tsx` and `route-registry.ts` still disagree after the proposed edits.
2. `navigation.schema.ts` still points to a dead route after edits.
3. The `/documents` vs `/docs` decision cannot be resolved cleanly across runtime, nav, and registry in one pass.
4. Figma assumptions require routes that do not exist in the app.

## Verification Required Before Claiming Completion

Run at minimum:

```bash
(cd frontend && yarn type-check)
(cd frontend && yarn test --passWithNoTests)
npx tsx tools/ci/check-route-integrity.ts
npx tsx tools/ci/check-screen-pairs.ts
```

If visual route work changes:

```bash
./scripts/run-visual-audit.sh
```

## Pick Up Here

Take over sprint execution from the current docs baseline and do the route-alignment code work first.

Execution order:

1. Fix route authority drift in `route-registry.ts`.
2. Resolve and implement the `/documents` vs `/docs` decision.
3. Re-run route integrity and type-check gates.
4. Only then continue broader Figma sync and page-level implementation.

## Deliverables Expected

- Updated `frontend/src/config/route-registry.ts`
- Updated `frontend/src/config/navigation.schema.ts`
- Updated `frontend/src/App.tsx` if needed for the docs route resolution
- Short status note describing:
  - what drift was fixed
  - what route was chosen as canonical for docs/workbench
  - what remains deferred
