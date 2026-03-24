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
- External prototype references (including one-off Vite apps, extensions, or demo repos)
  - useful for IA/layout decomposition patterns, interaction sequencing, and copy tone exploration
  - must be treated as `support_reference` candidates and classified by the gap-fill planner before any reuse is recorded

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
   - consolidated-reference TSX may enter only here, as `support_reference` candidates
   - for any selected support-reference TSX, run `design-orchestration` before audit-pack approval to record archetype mapping and generic-SaaS risk
   - when Figma MCP page access is available, use direct page-node harvest only to draft build-contract inputs or wireframe diffs; keep those outputs support-only until reviewed
5. Resolve asset slots with `asset-placement-strategy`.
6. Reconcile asset integrity with `manifest-reconciler` when asset references changed.
7. Generate implementation specs with `component-spec-generator` only after wireframe validation, build-contract generation, and gap-fill planning pass.
8. Enforce implementation-token hygiene with `token-enforcement`.
9. Run `design-orchestration` on implemented TSX to map the output to KR archetypes and flag generic-SaaS drift.
10. Run `kerala-rage-brand-enforcer` to de-SaaS the visuals and enforce Zero-Flora.
11. Run `m3-expressive-token-orchestrator` to confirm the semantic token system is expressive and correctly wired.
12. Run `kerala-rage-typography-strategy` so the final TSX has a non-generic voice before route closure.
    - save the identity review as `analysis/YYYY-MM-DD-tsx-identity-gate-<route>.md` using `analysis/tsx-identity-gate-template.md`

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
- Treat `sources/consolidated-reference/**` as support/reference input only. It must be classified by the gap-fill planner before any route-level reuse decision is recorded.
- Treat external prototype codebases the same way as consolidated-reference and Figma outputs: support-only until reviewed against route ownership, canonical wireframes, and backend capability truth.
- Treat direct Figma MCP outputs the same way: support-only until reviewed against route ownership, wireframes, and capability truth.
- Treat late-stage TSX identity review as a required closure gate for any support-influenced route, not an optional polish pass.

## Don't

- Do not treat summary docs as evidence that canonical files are complete.
- Do not treat placement success as integrity success.
- Do not use `asset-placement-strategy` as a substitute for schema validation.
- Do not generate component specs from wireframes that are misaligned with route or component planning.
- Do not let inconsistent `features/` presentation become canonical without a tokens-first reuse decision.
- Do not prioritize motion embellishment before wireframe structure and ownership are correct.
- Do not promote raw consolidated-reference TSX directly into runtime truth. It must first pass route-level gap-fill classification and any required audit pack review.
- Do not promote raw external prototype TSX directly into runtime truth. At most, port structure/approach after gap-fill classification, and require the TSX identity gate for any support-influenced implementation.
- Do not derive backend schemas or API contracts from Figma page text or card labels.
- Do not treat Figma variable output as token authority while repo token files remain canonical.
- Do not treat token-clean output as sufficient if the final TSX still reads as generic SaaS. The identity gate must pass before closure.

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
