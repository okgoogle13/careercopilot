# Claude Code Prompt — Salvage Batch 2 (`/analysis` S1 continuation)

## Role

You are the **salvage executor**. You are not re-running harvest classification.

Use these agents and skills:

- **Agent:** `prototype-harvest-manager`
- **Skills:** `route-migration`, `subagent-driven-development`, `verification-before-completion`
- **Conditional skill:** `token-enforcement` only if this batch changes UI-bearing files
- **Conditional skill:** `blueprint` only if route ownership or batch scope becomes ambiguous

## Batch Scope

Execute **only** this bounded batch:

1. `hooks/useATSScoring.ts`
2. `services/atsScorer.ts`

Do not widen scope.
Do not pull in adjacent rows.
Do not touch `/apply/quick`, `/documents`, or cross-cutting rows in this batch.

## Hard Boundary: Harvest vs Salvage

- **Harvest is frozen.**
- `PROTOTYPE_AUDIT_LOG.md` is classification output only.
- `PROTOTYPE-SALVAGE-TRACKER.md` is the execution tracker.
- If a row cannot be reconciled with runtime truth, stop and produce a **Harvest Conflict Brief** instead of coding.

## Required Authorities

Read and obey in this order:

1. `frontend/src/App.tsx`
2. `frontend/src/config/route-registry.ts`
3. `frontend/src/features/analysis/AnalysisPage.tsx`
4. `frontend/src/hooks/useAnalysis.ts`
5. `frontend/src/api/analysisService.ts`
6. `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`
7. `frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/PROTOTYPE_AUDIT_LOG.md`
8. `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
9. prototype source files last, as support-reference only

## MCP Token-Efficiency

Run these before broad reading:

```text
flash-sidekick.batch_file_analysis({
  "analysis_type": "salvage_batch2_preflight",
  "file_paths": [
    "docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md",
    "frontend/src/App.tsx",
    "frontend/src/config/route-registry.ts",
    "frontend/src/features/analysis/AnalysisPage.tsx",
    "frontend/src/hooks/useAnalysis.ts",
    "frontend/src/api/analysisService.ts"
  ]
})
```

Before reading any prototype source file over ~200 lines:

```text
flash-sidekick.generate_idf({
  "code": "<prototype source file contents>"
})
```

After each touched TS/TSX file:

```text
flash-sidekick.analyze_code_quality({
  "language": "typescript",
  "code": "<patched file contents>"
})
```

## Critical Duplicate-Logic Gate

This batch is approved for execution **only if** preflight proves the prototype artifacts represent a real missing client-side interaction seam on canonical `/analysis`.

If `hooks/useATSScoring.ts` or `services/atsScorer.ts` duplicates, conflicts with, or would create a competing analysis model alongside:

- `frontend/src/hooks/useAnalysis.ts`
- `frontend/src/api/analysisService.ts`
- backend-backed `/analysis` contracts already in use by `AnalysisPage.tsx`

then **do not improvise a merge**.

Stop and emit:

```text
Harvest Conflict Brief
=====================

Rows:
- hooks/useATSScoring.ts
- services/atsScorer.ts

Conflict Type: duplicate runtime logic | competing scoring model | authority mismatch

Conflicting Sources:
- <path>
- <path>

Why Execution Must Stop:
- <bullet>

Recommended Resolution:
- discard row
- split behavior seam only
- or reclassify after governance review
```

## Execution Sequence

### Phase A — Preflight

For each active row:

1. Confirm the row is still `PENDING`.
2. Confirm canonical owner is still `/analysis` via `AnalysisPage.tsx`.
3. Confirm the runtime gap is real.
4. Audit overlap against existing runtime logic in:
   - `frontend/src/features/analysis/AnalysisPage.tsx`
   - `frontend/src/hooks/useAnalysis.ts`
   - `frontend/src/api/analysisService.ts`
5. Confirm the row’s transfer mode still makes sense.

If any of the above fails, stop and emit a Harvest Conflict Brief.

### Phase B — Implement the bounded batch only if the gap is real

- Prefer salvaging `services/atsScorer.ts` first.
- Salvage `hooks/useATSScoring.ts` only if it clearly wraps the service without introducing a second competing analysis model.
- Integrate only into `AnalysisPage.tsx`.
- Keep the data seam explicit and consumer-owned.
- Do not introduce hardcoded criteria, mock scoring constants, or another route owner.

### Phase C — Verification

Run required repo checks:

```bash
npx tsx tools/scripts/scan-routes.ts
npx tsx tools/ci/check-route-integrity.ts
npx tsx tools/ci/check-screen-pairs.ts
(cd frontend && yarn type-check)
```

If this batch changes UI-bearing files, also run:

```bash
(cd frontend && yarn lint)
```

Also satisfy every tracker-row verification item. No row-specific verification item may be skipped.

### Phase D — Tracker update

Only after verification passes:

- update the active tracker row
- name the exact destination path
- record verification evidence

If preflight proves the rows are duplicates rather than real gaps:

- do not mark them `PORTED`
- either keep them `PENDING` with blocker evidence, or mark them `DISCARDED` only if the authority trail clearly justifies that status

## Deliverable Format

Return exactly:

1. rows attempted
2. runtime gap confirmation for each row
3. overlap/duplicate-logic assessment
4. files changed
5. verification results
6. tracker row updates
7. blockers or harvest conflicts, if any

Stop after this batch.
Do not begin another batch until Codex reviews it.
