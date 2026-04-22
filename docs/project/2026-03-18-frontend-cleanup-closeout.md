# Frontend Cleanup Closeout Plan

> **For agentic workers:** use subagent-driven-development. Fresh implementer per batch, then spec review, then code-quality review. Do not mark a batch done on narrative progress alone.

## Goal

Finish the frontend cleanup in a way that is truthful about the current repo, minimizes architectural drift, and produces a closeout pack backed by live manifests rather than retired PM/control artifacts.

## Recommendation

Use a **manifests-first closeout** strategy, not a narrative “100% migrated” claim.

The current repo is still split between:

- runtime truth in [`frontend/src/App.tsx`](/Users/okgoogle13/Projects/careercopilot/frontend/src/App.tsx)
- route intent in [`frontend/src/config/route-registry.ts`](/Users/okgoogle13/Projects/careercopilot/frontend/src/config/route-registry.ts)
- generated evidence in [`docs/manifests/routes.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/routes.json), [`docs/manifests/screens.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/screens.json), and [`docs/manifests/orphans.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/orphans.json)
- component structure in [`frontend/component-inventory.json`](/Users/okgoogle13/Projects/careercopilot/frontend/component-inventory.json)

The best way forward is:

1. refresh evidence
2. reconcile runtime and route metadata
3. integrate route-level gap-fill planning
4. clean stale prototype and manifest artifacts
5. rerun verification and publish a manifests-based closeout note

Do not claim a terminal features-first state until runtime and manifests actually reflect that state.

## Current Evidence Baseline

### What is already true

- `App.tsx` is the live runtime router.
- `check-screen-pairs` currently passes.
- the old `frontend/src/prototype-features/` runtime tree is no longer present.

### What is still drifted

- runtime routing is still pages-first for core product surfaces, while `route-registry.ts` describes a features-first intended state
- `routes.json` mirrors live runtime, so it is useful evidence but not yet evidence of the intended closure target
- `orphans.json` currently signals architectural drift, not just dead code
- `component-inventory.json` is structurally useful but not yet a trustworthy statement of canonical feature ownership
- stale prototype cleanup manifests still point at deleted or retired prototype paths

### Decision lock

This plan treats the old `docs/project/active/frontend-source-of-truth-migration/control/*` workflow as archived context only.

The active closeout evidence layer is:

- `docs/manifests/*`
- `frontend/component-inventory.json`
- `frontend/reports/*`
- `docs/design/layered-component-blueprint.json`

## Success Criteria

- [ ] `App.tsx`, `route-registry.ts`, and `routes.json` agree on canonical routes and redirect-only compatibility paths
- [ ] `orphans.json` is refreshed and any remaining drift is explained, not accidental
- [ ] `screens.json` matches the real paired screen set and screen mappings are not misleading
- [ ] `component-inventory.json` is regenerated after route authority decisions
- [ ] stale prototype cleanup manifests are either regenerated or removed from the closeout evidence layer
- [ ] route-level ambiguity is resolved through explicit plan outputs, not implied by old docs
- [ ] route integrity, screen pairing, type-check, and targeted tests pass

## Batch Structure

### Batch A: Snapshot and Evidence Refresh

**Objective:** replace stale narrative with fresh manifests and inventory outputs.

**Write scope:**
- `docs/manifests/*`
- `frontend/component-inventory.json`
- `frontend/reports/*`
- `docs/design/layered-component-blueprint.json`

**Tasks**
- [ ] run the full manifests and inventory routine from [`frontend-snapshot-methodology.md`](/Users/okgoogle13/Projects/careercopilot/docs/project/active/frontend-snapshot-methodology.md)
- [ ] record the new counts for routes, screens, orphaned features, orphaned pages, and inventory category totals
- [ ] confirm whether `routes.json` still reflects pages-first runtime
- [ ] confirm whether `orphans.json` still reports features as unrouted because of pages-first ownership

**Exit evidence**
- fresh `routes.json`
- fresh `screens.json`
- fresh `orphans.json`
- fresh `component-inventory.json`

### Batch B: Runtime Authority Reconciliation

**Objective:** decide and document one consistent route story.

**Write scope:**
- `frontend/src/App.tsx`
- `frontend/src/config/route-registry.ts`
- `tools/scripts/scan-routes.ts`
- `tools/ci/check-route-integrity.ts`

**Tasks**
- [ ] enumerate every reachable path from `App.tsx`
- [ ] compare that list with `route-registry.ts`
- [ ] explicitly classify each path as one of:
  - canonical route
  - redirect-only compatibility path
  - internal/support route
  - deprecated path pending removal
- [ ] remove optimistic language that implies feature-owned runtime where the runtime is still pages-first
- [ ] decide whether this branch will:
  - stabilize the current pages-first runtime and document features-first as future state
  - or finish the features-first runtime migration now

**Recommendation**
- choose the first option unless the remaining route-family cutovers are already small and isolated

**Exit evidence**
- fresh `routes.json`
- `check-route-integrity` green or down to understood warnings only

### Batch C: Route-Level Gap-Fill Planning

**Objective:** integrate [`derive-gap-fill-plan.py`](/Users/okgoogle13/Projects/careercopilot/scripts/derive-gap-fill-plan.py) into the closeout process as a route-level reconciliation gate.

**Write scope:**
- `scripts/derive-gap-fill-plan.py`
- optional helper inputs if needed under `tmp/migration/`

**Tasks**
- [ ] adapt `derive-gap-fill-plan.py` away from the retired control-tree inputs and onto the current manifests-based inputs
- [ ] preserve its useful outputs:
  - selected runtime base
  - reuse mode
  - token drift
  - blocking gaps
  - source-of-truth chain
- [ ] run the adapted planner for the highest-drift routes:
  - `/auth`
  - `/dashboard-overview`
  - `/kanban`
  - `/ingestion`
  - `/feed`
  - `/studio`
  - `/editor`
  - any route family flagged by `orphans.json` or inventory drift
- [ ] emit one JSON plan per route under `tmp/migration/`

**Required decision states**
- `terminal`
- `redirect_only`
- `needs_runtime_cleanup`
- `needs_manifest_cleanup`
- `blocked`

**Exit evidence**
- route-level gap-fill JSON outputs
- explicit disposition for each ambiguous route family

### Batch D: Shell and Holdout Resolution

**Objective:** close the remaining shell/layout ambiguity without mixing route authority work with broad component cleanup.

**Write scope:**
- `frontend/src/App.tsx`
- `frontend/src/layouts/**`
- touched holdout route surfaces only

**Primary targets**
- `/welcome`
- `/documents`
- `/asset-library`

**Tasks**
- [ ] decide whether each holdout is canonical, redirect-only, support-only, or explicitly blocked
- [ ] if a holdout is promoted, write or update targeted tests first
- [ ] if a holdout remains support-only, ensure the manifests and docs say so explicitly

**Exit evidence**
- shell/layout decisions reflected in runtime and manifests

### Batch E: Stale Prototype and Reference Artifact Cleanup

**Objective:** remove stale evidence that still points at deleted prototype trees or misleading route mappings.

**Write scope:**
- `docs/manifests/prototype-features-cleanup-map.json`
- `docs/manifests/prototype-features-cleanup-map.csv`
- `docs/manifests/orphans.json`
- `frontend/src/screens/*/mapping.json` if route mappings are misleading

**Tasks**
- [ ] regenerate or retire the prototype cleanup manifests if their source paths no longer exist
- [ ] fix any stale `/kr/*` route mappings that make healthy screens appear unrouted
- [ ] ensure the evidence layer does not describe deleted runtime surfaces as live

**Exit evidence**
- no stale prototype references remain in the active closeout evidence layer

### Batch F: Shared UI Boundary Cleanup

**Objective:** resolve duplicate primitive ownership after route authority is stable.

**Write scope:**
- `frontend/src/components/ui/**`
- `frontend/packages/ui/**`
- imports in touched route owners only

**Tasks**
- [ ] inventory overlapping primitives such as button, table, metric-card, use-mobile, icon-badge, and similar wrappers
- [ ] assign one owner per primitive:
  - generic reusable primitive in `frontend/packages/ui/**`
  - app-specific KR wrapper in `frontend/src/components/ui/**`
- [ ] update imports only after route authority work is complete, so ownership decisions do not fight active route moves

**Exit evidence**
- duplicate primitive ownership decisions documented in code and reflected in imports

### Batch G: Verification and Closeout Pack

**Objective:** produce the final proof set.

**Write scope:**
- manifests and inventory outputs if refreshed again
- closeout note updates

**Tasks**
- [ ] rerun the full snapshot routine
- [ ] rerun:
  - `npx tsx tools/ci/check-route-integrity.ts`
  - `npx tsx tools/ci/check-screen-pairs.ts`
  - `cd frontend && yarn type-check`
- [ ] run targeted tests for every changed route family
- [ ] record remaining warnings separately from blockers
- [ ] publish a manifests-based closeout summary rather than reviving the old PM/control-doc workflow

## Delegation Model

Use one fresh implementer subagent per batch. Do not combine unrelated write scopes.

### Recommended agent grouping

- **Explorer A**
  - refresh and interpret manifests drift
- **Explorer B**
  - review screen mappings and prototype/reference artifacts
- **Implementer 1**
  - Batch A only
- **Implementer 2**
  - Batch B only
- **Implementer 3**
  - Batch C only
- **Implementer 4**
  - Batch D and E only if their write scopes do not overlap
- **Implementer 5**
  - Batch F only
- **Spec reviewer**
  - review each batch against this plan
- **Code-quality reviewer**
  - review each batch after spec compliance passes

### Review order per batch

1. implementer completes the batch
2. spec reviewer checks that the batch met the plan and produced the required evidence
3. code-quality reviewer checks maintainability and safety
4. only then mark the batch complete

## Verification Commands

```bash
yarn install
npx tsx tools/scripts/scan-routes.ts
npx tsx tools/scripts/scan-screens.ts
npx tsx tools/scripts/scan-api-usage.ts
python3 tools/scripts/scan-endpoints.py
npx tsx tools/scripts/detect-orphans.ts

cd frontend
npx tsx scripts/component-inventory.ts
npx tsx scripts/inventory-postprocess.ts
npx tsx scripts/component-inventory.ts --raw
npx tsx scripts/generate-layered-blueprint.ts
yarn type-check
cd ..

npx tsx tools/ci/check-route-integrity.ts
npx tsx tools/ci/check-screen-pairs.ts
rg "prototype-features|QUARANTINE" frontend/src docs/manifests
```

## Completion Rule

The closeout is complete only when:

- the evidence refresh is current
- route authority decisions are explicit
- route-level drift cases have a disposition
- stale prototype evidence is gone or formally retired
- verification is green

Anything less is not terminal closeout. It is merely another snapshot.
