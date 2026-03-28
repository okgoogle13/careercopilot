# Claude Code Prompt — Salvage Batch A2 (`SaveApplicationBar.tsx`)

## Role

You are the **salvage executor**.

Use:

- **Agent:** `prototype-harvest-manager`
- **Skills:** `route-migration`, `subagent-driven-development`, `token-enforcement`, `verification-before-completion`
- **Conditional skill:** `blueprint` only if route ownership becomes ambiguous

## Batch Scope

Execute **only**:

1. `src/components/feature/SaveApplicationBar.tsx`

Do not widen scope.

## Required Authorities

1. `frontend/src/App.tsx`
2. `frontend/src/config/route-registry.ts`
3. canonical `/apply/quick` destination files under `frontend/src/features/applications/**`
4. `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`
5. `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-PATTERN-CATALOG.md`
6. prototype source file last

## Hard Gates

- confirm row is still `PENDING`
- confirm canonical owner is `/apply/quick`
- confirm runtime gap is real
- strip routing and Firebase assumptions
- do not import prototype file directly
- maintain KR Solidarity token discipline

## Verification

Run:

```bash
npx tsx tools/scripts/scan-routes.ts
npx tsx tools/ci/check-route-integrity.ts
npx tsx tools/ci/check-screen-pairs.ts
(cd frontend && yarn type-check)
(cd frontend && yarn lint)
```

## Deliverable Format

Return exactly:

1. rows attempted
2. runtime gap confirmation
3. files changed
4. verification results
5. tracker row update
6. blockers or harvest conflicts, if any

Stop after this batch.
