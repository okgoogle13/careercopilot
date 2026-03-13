# Tokens-First Gap-Fill Workflow

**Date:** 2026-03-14
**Status:** Active migration reference
**Related script:** `scripts/derive-gap-fill-plan.py`

## Why this exists

The runtime `frontend/src/features/**` tree often contains richer behavior than the screen-reference layer, but it was built inconsistently and cannot be trusted as a styling source of truth.

This workflow exists to avoid two failure modes:

1. rebuilding rich route behavior from scratch when useful runtime logic already exists
2. reusing inconsistent runtime presentation and hardening the inconsistency into the target component library

## Core rule

Use this decision model:

- reuse **behavior** and **route ownership** from runtime when they are already stronger
- reuse **layout intent** and **semantic structure** from canonical wireframes and approved build contracts
- reuse **presentation** only if the existing runtime file is already token-clean

In shorthand:

`reuse behavior from runtime`
`reuse presentation only if token-clean`
`otherwise rewrite styling to semantic tokens`

## Tokens-first formula

For each target component, derive one of these actions:

- `reuse_as_is`
- `keep_behavior_rewrite_styling`
- `keep_behavior_extend_tokens`
- `reference_only`
- `build_new`
- `blocked`

The planner should combine:

- route ownership from `2026-03-13-target-state-route-matrix.json`
- missing-component intent from `2026-03-13-backend-feature-frontend-component-gap-map.json`
- approved route build-contract constraints when available
- candidate TSX files found under `frontend/src/**`

## Required scoring dimensions

The planner evaluates each candidate file using:

- `behavior_score`
  - does it already own the live route or real backend flow?
- `ownership_score`
  - is it canonical or explicitly reusable in the tracked plan?
- `design_alignment_score`
  - does it align with the route’s approved screen/build-contract intent?
- `drift_penalty`
  - does it use hardcoded colors, legacy MUI, banned tokens, banned archetypes, or font drift?

Recommended weighting:

- behavior: `40`
- ownership: `25`
- design alignment: `10`
- drift penalty: `-25`

Default thresholds:

- `>= 80` and token-clean: `reuse_as_is`
- `>= 60`: `keep_behavior_rewrite_styling`
- `40-59`: `keep_behavior_extend_tokens`
- `< 40`: `build_new` or `blocked`

## Token rules

The planner must never treat an existing component as safe for full reuse unless it is already token-clean.

Token-clean means:

- no hardcoded `#hex`, `rgb(a)`, or `hsl(a)` values
- no banned deprecated token names
- no banned archetype names in new migration code
- no forbidden font drift
- semantic usage of `--sys-color-*`, `--sys-shape-*`, or `--sys-type-*` when styles are expressed in-code

Token-dirty components may still be reused for behavior, but only with:

- `keep_behavior_rewrite_styling`, or
- `keep_behavior_extend_tokens`

## Workflow sequence

Use this route-level sequence:

1. validate canonical wireframes with `scripts/validate-wireframe-workflow.py`
2. generate or review the route build contract
3. run `scripts/derive-gap-fill-plan.py`
4. generate implementation specs only for:
   - missing components
   - token-dirty presentation layers
   - structural mismatches against the build contract
5. run `token-enforcement` again on touched files before closure

## Output contract

The planner outputs one record per target component with:

- `component_name`
- `owner_route`
- `owner_surface`
- `canonical_status`
- `selected_base`
- `reuse_mode`
- `token_state`
- `existing_candidates`
- `required_actions`
- `source_of_truth`
- `blocking_gaps`

This is a planning artifact, not code generation.

## Do

- treat runtime richness as a reusable input
- treat token cleanliness as a prerequisite for presentation reuse
- preserve route ownership from the route matrix
- preserve missing-component intent from the gap map
- carry forward build-contract blockers instead of guessing around them

## Don’t

- do not reuse an existing feature component `as-is` just because it is more complete
- do not let token-dirty runtime styles become canonical by accident
- do not promote `phase3-batch*` or migration-kit artifacts into runtime truth
- do not build new components when the real missing work is a styling rewrite of an existing runtime owner
