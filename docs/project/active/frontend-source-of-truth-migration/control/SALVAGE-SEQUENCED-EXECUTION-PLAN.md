# Sequenced Prototype Salvage Execution Plan

**Date:** 2026-03-28
**Scope:** Salvage execution only. Harvest classification is frozen unless an authority conflict forces a stop-and-escalate decision.

---

## Non-Negotiable Separation

- **Harvest** = classification only. Output lives in `frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/PROTOTYPE_AUDIT_LOG.md`.
- **Salvage** = bounded extraction into canonical runtime. Output lives in `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`.
- A salvage executor must **not** re-open harvest by default.
- If a salvage row conflicts with runtime truth, route-registry, route-matrix, or the audit log, stop and emit a **Harvest Conflict Brief** instead of improvising.

---

## Recommended Agent Split

### Executor

- **Harness:** Claude Code
- **Primary agent:** `prototype-harvest-manager`
- **Skills:**
  - `blueprint` only when the batch has more than one uncertain row or route ownership is ambiguous
  - `route-migration` before touching destination files
  - `subagent-driven-development` for bounded implementation work
  - `token-enforcement` for any UI-bearing row
  - `design-orchestration` for S2, S4, and S5 UI-heavy batches
  - `verification-before-completion` before changing any tracker row to `PORTED`

### Reviewer

- **Harness:** Codex CLI
- **Mode:** review-first, bug/regression/authority drift
- **Skills:**
  - `migration-audit`
  - `token-enforcement` when UI-bearing files changed
  - direct code review against tracker row, runtime destination, and verification evidence

---

## MCP Efficiency Protocol

Use `flash-sidekick` to keep context small.

### Batch preflight

```text
flash-sidekick.batch_file_analysis({
  "analysis_type": "salvage_batch_preflight",
  "file_paths": [
    "docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md",
    "frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/PROTOTYPE_AUDIT_LOG.md",
    "frontend/src/App.tsx",
    "frontend/src/config/route-registry.ts",
    "docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json"
  ]
})
```

### Large prototype source compression

```text
flash-sidekick.generate_idf({
  "code": "<prototype source file contents>"
})
```

### Long control-doc compression

```text
flash-sidekick.quick_summarize({
  "text": "<only the long section needed for the current row>"
})
```

### Post-patch quality scan

```text
flash-sidekick.analyze_code_quality({
  "language": "typescript",
  "code": "<patched TS/TSX file contents>"
})
```

---

## Sequenced Execution

### Phase 0 — Governance Preflight

Do once before any salvage coding:

1. Confirm the target row is still `PENDING`.
2. Confirm the canonical owner using:
   - `frontend/src/App.tsx`
   - `frontend/src/config/route-registry.ts`
   - `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
3. Read the current runtime destination file.
4. Confirm the runtime gap exists.
5. If authority conflicts remain, stop and write a Harvest Conflict Brief.

### Phase 1 — Pilot Batch

Run a maximum of **2 rows**.

**Preferred pilot rows:**

- `src/hooks/useAiOutputs.ts`
- `src/components/feature/AiOutputsTabs.tsx`

**Fallback if the component row is ambiguous:** execute only `src/hooks/useAiOutputs.ts`.

Why this batch:

- same route family (`/analysis`)
- no page-upgrade ambiguity
- no Genkit client/backend conflict
- good test of hook + component salvage without route-shell drift

### Phase 2 — S1 Continuation

If the pilot passes Codex review:

- continue remaining S1 rows in batches of **2-3 rows max**
- keep rows within one route family when possible
- do not mix `/analysis` and `/apply/quick` in the same batch unless the shared seam is explicit

### Phase 3 — S3 Type Consolidation

- run after at least one S1 batch has succeeded
- keep to **1 row per batch**
- require backend/schema alignment proof before completion

### Phase 4 — S5 Non-Genkit UI

- execute only UI rows that remain genuinely non-canonical
- keep to **1-2 rows per batch**
- require `design-orchestration` + `token-enforcement`

### Phase 5 — S2 Templates

- run after S1 and S3 stabilize
- keep to **1 template system slice per batch**

### Phase 6 — S4 Page Upgrades

- one row at a time
- require explicit owner confirmation before coding
- do not combine page upgrades with any other strategy

### Phase 7 — S5 Genkit Rows

- run last
- only after backend ownership is explicitly resolved
- one row at a time

---

## Per-Batch Gate

Every batch follows this loop:

1. Claude executes the bounded batch.
2. Claude updates the salvage tracker row status and evidence.
3. Codex reviews the batch before the next batch begins.
4. Only after review passes may the next batch start.

No end-of-project bulk review. Review is per batch.

---

## Stop Conditions

Stop the execution lane immediately if any of the following happen:

- the runtime gap is not real
- the row’s canonical owner is ambiguous
- the prototype source and audit log disagree in a way not already documented
- a required tracker verification item cannot be completed
- Claude tries to widen scope beyond the active batch

---

## Success Condition

Salvage execution is considered healthy when:

- harvest remains frozen except for explicit conflict escalation
- each batch is bounded and review-gated
- tracker rows move only with evidence
- no duplicate owner surfaces are introduced
- Codex review happens before the next batch begins
