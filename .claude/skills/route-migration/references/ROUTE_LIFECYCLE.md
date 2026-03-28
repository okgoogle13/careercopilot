# Route Migration Lifecycle

## Overview

The current route-migration lifecycle is route-matrix-first and runtime-owner-first.

It applies only after a route already has a canonical owner in the main app.

Sequence:
1. authority-lock
2. wireframe-and-gap-fill
3. route-local implementation
4. closure-and-readiness

## 1. authority-lock

**Entry**
- Route exists in `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
- Human-readable route row exists in `docs/project/active/frontend-source-of-truth-migration/control/archive/route-matrix.md`

**Exit**
- Canonical runtime owner is confirmed from the route matrix and reachable from `frontend/src/App.tsx`

**Checks**
```bash
npx tsx tools/ci/check-route-integrity.ts
```

**Rules**
- Preserve route path unless the route matrix says otherwise
- Do not start implementation if ownership is still ambiguous
- Do not use prototype shell semantics as route authority

## 2. wireframe-and-gap-fill

**Entry**
- Route owner is known

**Exit**
- Gap-fill plan exists for the route and any support-reference input is classified

**Checks**
```bash
python3 scripts/validate-wireframe-workflow.py
python3 scripts/derive-gap-fill-plan.py --route-id <route>
```

**Outputs**
- route-level wireframe validity
- candidate token list and token drift
- reuse mode:
  - `reuse_as_is`
  - `keep_behavior_rewrite_styling`
  - `keep_behavior_extend_tokens`
  - `build_new`
  - `reference_only`
  - `blocked`

**Rules**
- Treat external prototype or consolidated-reference TSX as support-only until classified
- Do not promote raw support-reference TSX directly into runtime truth

## 3. route-local implementation

**Entry**
- Route has a gap-fill decision

**Exit**
- Canonical runtime surface implements the route according to the chosen reuse mode

**Checks**
```bash
(cd frontend && yarn type-check)
(cd frontend && yarn lint)
```

**Rules**
- Edit only canonical runtime surfaces
- Use semantic tokens only
- Keep public labels plain and user-facing
- Keep KR archetypes internal to design-system mapping
- Do not reintroduce migration-kit feature flags or RouteGate cutovers

## 4. closure-and-readiness

**Entry**
- Route implementation is in place

**Exit**
- Route passes token, audit, and readiness checks for closeout

**Checks**
```bash
npx tsx tools/ci/check-route-integrity.ts
npx tsx tools/ci/check-screen-pairs.ts
./scripts/test-deployment.sh
```

**Required skill gates**
- `token-enforcement`
- `migration-audit`

**Additional rule**
- For support-influenced routes, complete the TSX identity gate from `control/archive/workflow.md` before closure

## Do Not Use This Lifecycle For

- Comet batches in `prototype_v2.0`
- top-level navigation naming reviews
- direct prototype shell promotion
- `careercopilot-migration-kit-v3` RouteGate rollout rehearsal
