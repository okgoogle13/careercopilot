# Wireframe Workflow Findings

**Date:** 2026-03-14
**Status:** Active migration reference
**Related validator:** `scripts/validate-wireframe-workflow.py`

## Why this exists

This note captures what was learned from reviewing the prior `.claude/wireframes` migration output and defines the workflow now expected for canonical wireframes.

It exists because the last wireframe pass produced useful reference material, but it also overstated completion and did not prove alignment against the canonical repo state.

## What can be reused

- `MOTION_UPDATE_SPRING_PHYSICS.md`
  - useful motion taxonomy
  - useful spring-contract XML shape
- `placement_report.json`
  - useful slot-to-asset decisions
  - useful rationale for asset placement choices
- `SUMMARY.md`
  - useful high-level pipeline ordering only

These are reference inputs, not execution truth.

## What failed in the prior process

- Completion was asserted from summary docs instead of canonical files.
- Spring-motion rollout was documented as complete, but actual canonical wireframes still show partial adoption.
- Placement was treated as successful even though asset file-path integrity was still broken.
- `.claude/wireframes/*` was allowed to drift into source-of-truth territory.
- There was no deterministic gate reconciling wireframes with:
  - the route matrix
  - the backend-feature component gap map
  - asset manifest integrity

## Current workflow

1. Generate or refresh wireframe intent with `wireframe-annotator`.
2. Validate canonical wireframes with `scripts/validate-wireframe-workflow.py`.
3. Generate a route-level build contract with `contracts/wireframe-build-contract-prompt.md`.
4. Run `scripts/derive-gap-fill-plan.py` to determine whether each target component should reuse runtime behavior, rewrite styling to semantic tokens, remain reference-only, or be built fresh.
5. Resolve asset slots with `asset-placement-strategy`.
6. Reconcile asset integrity with `manifest-reconciler` when asset references changed.
7. Generate implementation specs with `component-spec-generator` only after wireframe validation, build-contract generation, and gap-fill planning pass.
8. Enforce implementation-token hygiene with `token-enforcement`.
9. Run final deterministic brand checks with `kerala-rage-brand-enforcer`.

## Missing Piece Closed: Build Contract Prompt

The migration stack now includes a tracked prompt artifact that defines the missing bridge between:

- canonical XML wireframes
- one route-matrix row
- one backend-feature component gap entry when applicable
- implementation-ready TSX planning

This prompt is the required planning input before route-level spec generation for wireframe-backed work.

## Do

- Use `frontend/src/screens/**/*.wireframe.xml` as the canonical wireframe source.
- Compare wireframes to the tracked route matrix before calling them ready.
- Compare wireframes to the backend-feature component gap map before spec generation.
- Treat motion and asset placement as downstream enrichments after structural validity.
- Run `manifest-reconciler` when placement output or asset references change.
- Keep shared-family wireframes explicit in the route matrix.
- Treat existing runtime components as behavior inputs, not styling truth, unless they are already token-clean.

## Don't

- Do not treat summary docs as evidence that canonical files are complete.
- Do not treat placement success as integrity success.
- Do not use `asset-placement-strategy` as a substitute for schema validation.
- Do not generate component specs from wireframes that are misaligned with route or component planning.
- Do not let inconsistent `features/` presentation become canonical without a tokens-first reuse decision.
- Do not prioritize motion embellishment before wireframe structure and ownership are correct.

## Current validator signals

The first run of `scripts/validate-wireframe-workflow.py` found:

- 11 canonical wireframes
- 0 files with the upgraded structural schema
- 2 known live product routes still missing wireframes:
  - `/ksc-generator`
  - `/cover-letter-generator`
- legacy claim mismatch:
  - spring rollout docs say complete, canonical files do not
- asset-integrity warning:
  - `placement_report.json` passes placement while still reporting invalid asset file paths

Use the JSON report at `tmp/migration/wireframe-workflow-report.json` as the current evidence source, not summary prose.
