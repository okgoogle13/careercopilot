# Claude Code Prompt — Salvage Pilot Batch

## Role

You are the **salvage executor**. You are not re-running harvest classification.

Use these agents and skills:

- **Agent:** `prototype-harvest-manager`
- **Skills:** `route-migration`, `subagent-driven-development`, `token-enforcement`, `verification-before-completion`
- **Conditional skill:** `blueprint` only if route ownership or batch scope becomes ambiguous
- **Conditional skill:** `design-orchestration` only if the active row changes visible UI

## Batch Scope

Execute **only** this pilot batch:

1. `src/hooks/useAiOutputs.ts`
2. `src/components/feature/AiOutputsTabs.tsx`

If row 2 fails owner/gap preflight, execute **only** row 1 and stop.

Do not widen scope. Do not pull in adjacent rows.

## Hard Boundary: Harvest vs Salvage

- **Harvest is frozen.**
- `PROTOTYPE_AUDIT_LOG.md` is classification output only.
- `PROTOTYPE-SALVAGE-TRACKER.md` is the execution tracker.
- If a row cannot be reconciled with runtime truth, stop and produce a **Harvest Conflict Brief** instead of coding.

## Required Authorities

Read and obey in this order:

1. `frontend/src/App.tsx`
2. `frontend/src/config/route-registry.ts`
3. the current destination file under `frontend/src/**`
4. `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`
5. `frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/PROTOTYPE_AUDIT_LOG.md`
6. `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
7. prototype source files last, as support-reference only

## MCP Token-Efficiency

Run these before broad reading:

```text
flash-sidekick.batch_file_analysis({
  "analysis_type": "salvage_pilot_preflight",
  "file_paths": [
    "docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md",
    "frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/PROTOTYPE_AUDIT_LOG.md",
    "frontend/src/App.tsx",
    "frontend/src/config/route-registry.ts",
    "docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json"
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

## Execution Sequence

### Phase A — Preflight

For each active row:

1. Confirm the row is still `PENDING`.
2. Confirm the canonical owner.
3. Read the current runtime destination.
4. Confirm the runtime gap is real.
5. Confirm the row’s transfer mode still makes sense.

If any of the above fails, stop and emit:

```text
Harvest Conflict Brief
=====================

Row: <tracker row>
Conflict Type: owner | runtime gap | authority mismatch | verification mismatch
Conflicting Sources:
- <path>
- <path>
Why Execution Must Stop:
- <bullet>
Recommended Resolution:
- <bullet>
```

### Phase B — Implement the bounded batch

- Port behavior only.
- Do not import raw prototype files directly.
- Do not create a parallel owner surface.
- Keep changes limited to the declared destination and required support files.

### Phase C — Verification

Run required repo checks:

```bash
npx tsx tools/scripts/scan-routes.ts
npx tsx tools/ci/check-route-integrity.ts
npx tsx tools/ci/check-screen-pairs.ts
(cd frontend && yarn type-check)
```

If UI-bearing files changed, also run:

```bash
(cd frontend && yarn lint)
```

Also satisfy every tracker-row verification item. No row-specific verification item may be skipped.

### Phase D — Tracker update

Only after verification passes:

- update the active tracker row
- name the exact destination path
- record verification evidence

## Deliverable Format

Return exactly:

1. rows attempted
2. runtime gap confirmation for each row
3. files changed
4. verification results
5. tracker row updates
6. blockers or harvest conflicts, if any

Do not start the next batch. Stop after this pilot batch is complete.
