---
name: route-migration
description: Execute or validate canonical route-local migration work in the main CareerCopilot app after route ownership is already decided in route-matrix.md.
---

# Route Migration

## Purpose

Use this skill for canonical route work in the main app after the route already has a clear owner in the tracked migration artifacts.

This skill is for:
- porting one canonical route in `frontend/src/**`
- validating a route-local implementation against the current migration workflow
- closing a route after token, wireframe, and identity gates

This skill is not for:
- Comet / prototype support-reference work
- nav-label decisions
- greenfield page scaffolding
- the old `careercopilot-migration-kit-v3` RouteGate workflow
- promoting raw prototype or consolidated-reference TSX directly into runtime truth

## Read First

- `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.md`
- `docs/project/active/frontend-source-of-truth-migration/control/workflow.md`
- `docs/project/active/frontend-source-of-truth-migration/control/COMET-MANIFEST.md`

Read `references/ROUTE_LIFECYCLE.md` for the current route-level sequence and `assets/route-checklist-template.md` when you need a route handoff or closure checklist.

## When To Use

- A route owner is already explicit in `route-matrix.md`
- The work is in the canonical app, not the prototype shell
- The route needs gap-fill planning, implementation, or closure evidence
- You need to verify a route against route integrity, screen pairing, and token/identity gates

## Required Inputs

- one route id or current route from `route-matrix.json`
- the current route row from `route-matrix.md`
- the paired screen reference / wireframe path if present
- the canonical runtime owner in `frontend/src/features/**` or `frontend/src/pages/**`
- any approved build contract or support-reference input already classified by the gap-fill planner

If route ownership is still ambiguous, stop and use `blueprint` or `prototype-harvest-manager` first.

## Canonical Workflow

### 1. Authority Lock

- Confirm the route is present in `route-matrix.md`
- Confirm the runtime owner is reachable from `frontend/src/App.tsx`
- Confirm backend capability ownership from the route matrix before changing the route
- Preserve route paths unless the route matrix explicitly says otherwise

### 2. Wireframe And Gap-Fill Planning

- Validate canonical wireframes:
  - `python3 scripts/validate-wireframe-workflow.py`
- Generate a tokens-first gap-fill plan for the route:
  - `python3 scripts/derive-gap-fill-plan.py --route-id <route>`
- Use the gap-fill output to decide:
  - reuse runtime behavior as-is
  - keep behavior and rewrite styling to semantic tokens
  - keep behavior and extend token coverage
  - build new
  - block the route until missing contracts are resolved
- Treat support-reference TSX as support-only until the gap-fill planner classifies it. Never promote raw external prototype TSX directly.

### 3. Route-Local Implementation

- Modify only the canonical runtime surface for the route
- Prefer `frontend/src/features/**`; use `frontend/src/pages/**` only when that route is already owned there
- Keep public UI language plain and user-facing
- Use semantic tokens only: `--sys-color-*`, `--sys-shape-*`, `--sys-type-*`
- Do not introduce hardcoded colors, forbidden fonts, or deprecated aliases
- Do not let design-reference or support-reference styling override runtime ownership

### 4. Closure Gates

- Route integrity:
  - `npx tsx tools/ci/check-route-integrity.ts`
- Screen pairing:
  - `npx tsx tools/ci/check-screen-pairs.ts`
- Frontend validation:
  - `(cd frontend && yarn type-check)`
  - `(cd frontend && yarn lint)`
- Run `token-enforcement`
- Run `migration-audit`
- For support-influenced routes, complete the TSX identity gate described in `workflow.md`
- Use `./scripts/test-deployment.sh` when the route is part of broader closeout or readiness validation

## Guardrails

- Route matrix and `frontend/src/App.tsx` are the authority for route ownership
- `workflow.md` is the authority for wireframe and gap-fill sequencing
- `COMET-MANIFEST.md` governs prototype support-reference work, not canonical route cutover
- Plain primitive naming is preferred in planning outputs; KR archetypes are internal mappings only
- No direct prototype-to-runtime consolidation
- No migration-kit-specific scripts, RouteGate wiring, or feature-flag rollback model

## Recommended Output

Return a concise route report with:
- route
- canonical runtime owner
- paired screen reference
- gap-fill reuse mode
- files touched or to be touched
- unresolved blockers
- closure evidence collected

## Related Skills

- `@blueprint` for route planning when ownership or sequence is unclear
- `@prototype-harvest-manager` for support-reference classification before canonical porting
- `@token-enforcement` for token/copy hygiene
- `@migration-audit` for deterministic route-quality audit
- `@systematic-debugging` when checks fail or the route behaves unexpectedly
