# Planning Layer Trust Restoration Design

## Summary

Restore trust in the frontend migration planning layer by aligning the canonical control artifacts, the JS governance validator, the Python governance tests, the `/tracker` contract metadata, and the operator skills that depend on them.

This is a planning-layer-only pass. It does not change live route behavior, runtime ownership, `/tracker` CRUD wiring, `/career/ingest` implementation, or `/kr/*` routing.

## Goals

- Make the JS governance validator operate on the canonical migration workspace under `docs/project/active/frontend-source-of-truth-migration/control/`.
- Remove stale or misleading metadata from the canonical planning artifacts and tracker contract documents.
- Fix the currently failing governance data so the Python tests and JS validator evaluate the same planning truth.
- Rewrite the mission-critical migration skills so their instructions match this repo's current layout and operating constraints.

## Non-Goals

- No runtime route implementation changes
- No route ownership reclassification beyond metadata consistency fixes
- No migration-kit refactor or shared validator framework
- No visual audit or token enforcement implementation changes outside skill instructions

## Canonical Sources After This Pass

- Execution blueprint:
  - `docs/project/active/frontend-source-of-truth-migration/control/blueprint.md`
- Workflow guidance:
  - `docs/project/active/frontend-source-of-truth-migration/control/workflow.md`
- Planning inputs:
  - `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
  - `docs/project/active/frontend-source-of-truth-migration/control/gap-map.json`
- Governance tests:
  - `tests/plans/test_governance_consistency.py`
- JS governance validator:
  - `frontend/scripts/validate-governance-artifacts.mjs`

The JS validator and Python tests must both be treated as checks over the same canonical planning layer. Re-anchoring `tests/plans` to the canonical `control/` workspace is in scope for this pass. Legacy `.claude` planning artifacts may remain only where they are still needed as compatibility documents, not as primary validation inputs.

## Design

### 1. JS Governance Validator

`frontend/scripts/validate-governance-artifacts.mjs` will stop reading legacy `.claude` JSON artifacts and will validate the canonical `control/` workspace instead.

It should validate:

- `route-matrix.json` exists and has a `rows` array
- `gap-map.json` exists and has a `features` array
- route-matrix top-level metadata:
  - `artifact`
  - `generated_at`
  - `canonical_plan`
  - `schema_version`
  - `row_count`
- gap-map top-level metadata:
  - `artifact`
  - `generated_at`
  - `canonical_plan`
  - `canonical_route_matrix`
- route-matrix row decisions use the canonical status vocabulary:
  - `keep`
  - `expand`
  - `merge`
  - `replace`
  - `retire`
- each gap-map feature has:
  - `feature_id`
  - `owner_route`
  - `owner_surface`
  - `backend_status`
  - `frontend_status`
- each gap-map `owner_route` appears in the route matrix target-route set when the route is a product route
- canonical metadata fields point at the stable workspace using these exact mappings:
  - `route-matrix.json.canonical_plan` -> `docs/project/active/frontend-source-of-truth-migration/control/blueprint.md`
  - `gap-map.json.canonical_plan` -> `docs/project/active/frontend-source-of-truth-migration/control/blueprint.md`
  - `gap-map.json.canonical_route_matrix` -> `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`

The script should produce one deterministic JSON result with this shape:

```json
{
  "ok": true,
  "validated": ["route-matrix", "gap-map"],
  "artifacts": {
    "route_matrix": "<absolute path>",
    "gap_map": "<absolute path>"
  }
}
```

On failure, it should exit non-zero and print a single error message describing the first invalid invariant. It should not silently succeed by validating the wrong files.

### 2. Canonical Planning Artifacts

The `control/route-matrix.json` and `control/gap-map.json` metadata must stop referencing the superseded `control/plan.md` path and instead use the exact canonical mappings defined above.

This pass should also re-anchor `tests/plans` to the canonical `control/` workspace wherever they still read legacy planning artifacts. If a compatibility artifact under `.claude/` must remain temporarily for a still-valid test case, the test should make that compatibility purpose explicit instead of treating the legacy file as primary truth.

The current known blocker is missing `resolution_status` for `genkit_job_analysis`. Any required metadata completion should be the minimum change needed to satisfy the current governance contract without changing substantive route decisions.

### 3. Tracker Contract Metadata

The `/tracker` contract documents are structurally useful but still carry dated artifact references. Those references should be normalized to the stable filenames now used in the migration workspace wherever a stable canonical name exists.

Targets:

- `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-tracker.xml`
- `docs/project/active/frontend-source-of-truth-migration/contracts/tracker-supplementary-component-briefs.xml`

This pass is metadata cleanup only. It does not reopen ownership decisions or change component contracts.

### 4. Skill Rewrites

The following skills should be rewritten to be repo-centric and directly usable in this repository:

- `migration-audit`
- `token-enforcement`
- `api-contract-validator`

Required changes:

- remove instructions that assume `careercopilot-migration-kit-v3`
- remove `apps/web` path assumptions
- point at current repo-root paths
- preserve the current fit-for-purpose limits already recorded in `control/fit-for-purpose.md`
- keep the instructions execution-first and explicit about allowed use versus blocked use

The rewrite should reduce operator error, not expand process weight.

## Validation

This work is complete when all of the following are true:

- `pytest tests/plans -q` passes
- `tests/plans` read the canonical `control/` planning artifacts as their primary inputs
- `node frontend/scripts/validate-governance-artifacts.mjs` validates the canonical `control/` artifacts
- the JS validator no longer references legacy `.claude` planning artifacts as its primary inputs
- rewritten skills contain no migration-kit-specific operating assumptions unless explicitly called out as historical/non-canonical
- tracker contract docs use stable canonical references where available
- no runtime files such as `frontend/src/App.tsx` or feature route implementations are modified

## Risks and Constraints

- Re-anchoring `tests/plans` may expose additional stale assumptions that were previously hidden by legacy `.claude` inputs. That is acceptable and should be fixed in this pass if it stays within planning-layer scope.
- The JS validator does not need perfect one-to-one parity with every Python assertion, but it must check the same canonical workspace and must not produce false-green results.
- Skill rewrites must stay aligned with `control/fit-for-purpose.md`; they should not silently promote a limited tool into an unconditional gate.

## Implementation Handoff

The implementation plan should cover four workstreams:

1. JS validator realignment
2. Governance metadata repair
3. Tracker contract reference normalization
4. Skill instruction rewrites

Each workstream should have explicit verification commands and should avoid touching runtime route implementation.
