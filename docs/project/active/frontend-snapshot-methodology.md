# Frontend Snapshot and Closeout Methodology

*Repeatable evidence routine for frontend cleanup, drift analysis, and closeout decisions in CareerCopilot.*

## Purpose

This methodology defines the manifests-based checkpoint routine for the current frontend cleanup program.

It is designed to answer four questions with fresh evidence rather than narrative:

1. What routes are actually mounted in the runtime?
2. Which screens and components are structurally paired and still relevant?
3. Where does runtime truth diverge from route-registry intent and feature ownership?
4. Which routes need targeted reconciliation before closeout can be claimed?

This document replaces the old assumption that the retired `docs/project/active/frontend-source-of-truth-migration/control/*` tree is the active authority.

## Current Authority Order

Use this order whenever artifacts disagree:

1. Runtime mount truth:
   [`frontend/src/App.tsx`](/Users/okgoogle13/Projects/careercopilot/frontend/src/App.tsx)
2. Route intent and metadata:
   [`frontend/src/config/route-registry.ts`](/Users/okgoogle13/Projects/careercopilot/frontend/src/config/route-registry.ts)
3. Design pairing truth:
   `frontend/src/screens/**` plus generated [`docs/manifests/screens.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/screens.json)
4. Capability truth:
   [`docs/manifests/frontend-api-usage.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/frontend-api-usage.json) and [`docs/manifests/backend-endpoints.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/backend-endpoints.json)
5. Component structure and ownership signals:
   [`frontend/component-inventory.json`](/Users/okgoogle13/Projects/careercopilot/frontend/component-inventory.json)
6. Derived drift summaries:
   [`docs/manifests/routes.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/routes.json), [`docs/manifests/orphans.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/orphans.json), and [`docs/design/layered-component-blueprint.json`](/Users/okgoogle13/Projects/careercopilot/docs/design/layered-component-blueprint.json)

## Current Repo Reality

The current repo is not yet in a features-first terminal state.

- `App.tsx` remains the real runtime mountpoint.
- `route-registry.ts` describes the intended route model, but it is not yet fully derived from or enforced against the live runtime.
- `docs/manifests/routes.json` is useful evidence, but it currently reflects the live router, which is still pages-first for core product surfaces.
- `orphans.json` currently signals architectural drift, not just dead code.
- `component-inventory.json` is useful for structure, tests, and reuse analysis, but it is not yet a sufficient standalone statement of canonical route ownership.

Do not claim “feature-owned runtime” closeout until `App.tsx`, `route-registry.ts`, and `docs/manifests/routes.json` all tell the same story.

## Execution Batches

Run the checkpoint in four logical batches.

### Batch A: Manifest Refresh

Objective: regenerate the runtime, design, and capability evidence layer.

```bash
yarn install
npx tsx tools/scripts/scan-routes.ts
npx tsx tools/scripts/scan-screens.ts
npx tsx tools/scripts/scan-api-usage.ts
python3 tools/scripts/scan-endpoints.py
npx tsx tools/scripts/detect-orphans.ts
```

Primary outputs:

- [`docs/manifests/routes.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/routes.json)
- [`docs/manifests/screens.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/screens.json)
- [`docs/manifests/frontend-api-usage.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/frontend-api-usage.json)
- [`docs/manifests/backend-endpoints.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/backend-endpoints.json)
- [`docs/manifests/orphans.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/orphans.json)

### Batch B: Component and Layered Snapshot Refresh

Objective: refresh component-level ownership, reuse, and migration evidence.

```bash
cd frontend
npx tsx scripts/component-inventory.ts
npx tsx scripts/inventory-postprocess.ts
npx tsx scripts/component-inventory.ts --raw
npx tsx scripts/generate-layered-blueprint.ts
cd ..
```

Primary outputs:

- [`frontend/component-inventory.json`](/Users/okgoogle13/Projects/careercopilot/frontend/component-inventory.json)
- [`frontend/reports/summary.json`](/Users/okgoogle13/Projects/careercopilot/frontend/reports/summary.json)
- [`frontend/reports/migration-breakdown.json`](/Users/okgoogle13/Projects/careercopilot/frontend/reports/migration-breakdown.json)
- [`docs/design/layered-component-blueprint.json`](/Users/okgoogle13/Projects/careercopilot/docs/design/layered-component-blueprint.json)

### Batch C: Route-Level Gap-Fill Planning

Objective: run targeted reconciliation for routes that remain ambiguous, drifted, or blocked after the snapshot refresh.

Use [`scripts/derive-gap-fill-plan.py`](/Users/okgoogle13/Projects/careercopilot/scripts/derive-gap-fill-plan.py) as a route-level planner, not as a global truth source.

It should answer:

- which existing runtime surface is the best base
- which candidate is reference-only
- whether styling should be rewritten or merely extended
- whether the route is blocked on unresolved contract or token drift

Recommended target set:

- routes flagged by `orphans.json`
- routes whose runtime mount and registry intent disagree
- redirect-heavy compatibility paths such as `/auth`, `/dashboard-overview`, `/kanban`, `/ingestion`, `/feed`, `/studio`, and `/editor`
- any route family with token-dirty or ownership-ambiguous runtime owners

Important limitation:

[`derive-gap-fill-plan.py`](/Users/okgoogle13/Projects/careercopilot/scripts/derive-gap-fill-plan.py#L27) still points at the retired control-tree inputs. Before making it part of the standard closeout routine, adapt it so it reads the current manifests-based authority set.

### Batch D: Verification and Closeout Evidence

Objective: prove the refreshed artifacts and any cleanup work are coherent.

```bash
npx tsx tools/ci/check-route-integrity.ts
npx tsx tools/ci/check-screen-pairs.ts
rg "prototype-features|QUARANTINE" frontend/src docs/manifests
cd frontend && yarn type-check
```

If Batch C changed route ownership or runtime surfaces, rerun Batches A and B before calling the work stable.

## Generated Artifact Coverage

Use each artifact for a specific proof burden:

- `routes.json`: actual runtime paths, mounted component names, and layout classification
- `screens.json`: physical screen package completeness and mapping metadata
- `frontend-api-usage.json`: frontend API surface actually referenced by the app
- `backend-endpoints.json`: backend capability surface actually mounted
- `orphans.json`: drift signals across routes, features, pages, and screens
- `component-inventory.json`: component-level reuse, tests/stories/docs, token state, and migration signals
- `layered-component-blueprint.json`: structure-level grouping for cleanup and ownership work
- `tmp/migration/<route>-gap-fill-plan.json`: route-level reconciliation evidence after `derive-gap-fill-plan.py` is adapted

## Subagent Batch Execution

Use subagent-driven-development for implementation work that follows from the snapshot.

Recommended delegation model:

- Explorer agent:
  refresh evidence interpretation and identify the highest-signal drift items
- Implementer agent:
  own one non-overlapping batch or route family at a time
- Spec reviewer agent:
  verify the batch satisfied the plan and did not skip required evidence
- Code-quality reviewer agent:
  verify maintainability, isolation, and verification coverage

Recommended batch ownership:

- Batch A owner:
  manifests and scanners only
- Batch B owner:
  component inventory and blueprint only
- Batch C owner:
  route planner adapter plus route-level plan outputs
- Batch D owner:
  verification scripts and closeout note updates

Do not overlap write scopes between batches unless the dependency map explicitly requires it.

## Closeout Gates

Do not mark the frontend cleanup terminal until all of the following are true:

- `App.tsx`, `route-registry.ts`, and `routes.json` agree on canonical routes versus redirect-only compatibility paths
- `orphans.json` no longer reports drift that is merely a side effect of stale manifests
- `screens.json` and `check-screen-pairs` agree on the number of paired screens
- `component-inventory.json` is fresh and consistent with the current runtime ownership model
- stale prototype cleanup manifests are either regenerated or explicitly retired
- route-level drift cases have either a gap-fill plan or a documented terminal disposition
- verification commands pass with no unresolved route-integrity errors

## Known Limitations

- [`derive-gap-fill-plan.py`](/Users/okgoogle13/Projects/careercopilot/scripts/derive-gap-fill-plan.py#L27) still reads the retired control-tree files and must be adapted before it can be part of the default closeout routine.
- [`tools/ci/check-route-integrity.ts`](/Users/okgoogle13/Projects/careercopilot/tools/ci/check-route-integrity.ts) currently validates `docs/manifests/routes.json`, not `route-registry.ts` directly.
- `screens.json` can be structurally healthy while still being semantically unrouted if the mapping files still point at `/kr/*` or other non-mounted routes.
- `component-inventory.json` reflects the current runtime structure; if runtime remains pages-first, the inventory will understate feature ownership.
