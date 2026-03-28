# Claude Code Prompt — Salvage Batch D1 (`useDocumentExport.ts`)

## Role

You are the **salvage executor**.

Use:

- **Agent:** `prototype-harvest-manager`
- **Skills:** `route-migration`, `subagent-driven-development`, `verification-before-completion`
- **Conditional skill:** `blueprint` only if route ownership becomes ambiguous

## Batch Scope

Execute **only**:

1. `hooks/useDocumentExport.ts`

Do not widen scope.

## Required Authorities

1. `frontend/src/App.tsx`
2. `frontend/src/config/route-registry.ts`
3. canonical `/documents` destination files under `frontend/src/features/documents/**`
4. `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`
5. `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
6. prototype source file last

## Hard Gates

- confirm row is still `PENDING`
- confirm canonical owner is `/documents`
- confirm runtime gap is real
- keep export behavior aligned with canonical document services
- do not introduce a second document workflow owner

## Verification

Run:

```bash
npx tsx tools/scripts/scan-routes.ts
npx tsx tools/ci/check-route-integrity.ts
npx tsx tools/ci/check-screen-pairs.ts
(cd frontend && yarn type-check)
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
