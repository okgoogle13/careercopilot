# Claude Code Prompt — Governance Repair Batch (Salvage Finish-Line Discipline)

## Role

You are the **salvage executor** for a docs-only governance repair batch.

Use:

- **Agent:** `prototype-harvest-manager`
- **Skills:** `verification-before-completion`
- **Conditional skill:** `blueprint` only if you find a contradiction between tracker rules and route-owner authorities

Do **not** perform salvage implementation in this batch.

## Batch Scope

Execute **only** this governance batch:

1. tighten the salvage execution rules so future batches cannot falsely close rows
2. update only these control docs:
   - `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`
   - `docs/project/active/frontend-source-of-truth-migration/control/CLAUDE_PROTOTYPE_SALVAGE_PROMPT.md`
   - `docs/project/active/frontend-source-of-truth-migration/control/REMAINING-SALVAGE-SPRINT-PLAN.md`

Do not widen scope.

## Problem To Fix

The repeated failure pattern is now clear:

1. Claude has been treating a missing destination file as proof that a runtime gap is real.
2. Claude has been treating infrastructure progress as row completion.
3. Claude has been allowing off-route integration to count as route-local completion.
4. Claude has been reaching implementation before escalating architecture/governance conflicts.

This has already happened in:

- `/analysis` pilot before `AnalysisPage.tsx` integration
- `D1` DOCX export false close

Your job is to harden the process so these false-positive completions stop.

## Required Authorities

Use these as truth, in this order:

1. `frontend/src/App.tsx`
2. `frontend/src/config/route-registry.ts`
3. `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-PATTERN-CATALOG.md`
4. `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
5. `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`
6. `docs/project/active/frontend-source-of-truth-migration/control/CLAUDE_PROTOTYPE_SALVAGE_PROMPT.md`
7. `docs/project/active/frontend-source-of-truth-migration/control/REMAINING-SALVAGE-SPRINT-PLAN.md`

## Required Fixes

### 1. Add a mandatory preflight gate to the salvage prompt

Update `CLAUDE_PROTOTYPE_SALVAGE_PROMPT.md` so every future batch must prove all of the following **before any code changes**:

- the row is still `PENDING`
- the canonical route owner is confirmed from runtime truth
- the runtime gap is real in that exact owner
- the behavior is not already present in canonical runtime under a different implementation
- the row is not actually a governance conflict requiring escalation

Make this explicit: **if preflight fails, the batch stops without implementation**.

### 2. Tighten the completion rule

Update `CLAUDE_PROTOTYPE_SALVAGE_PROMPT.md` and the tracker guidance so a row may be marked `PORTED` only if:

- the behavior is live in the exact canonical route owner named in the tracker
- the behavior is mounted in runtime, not just present in a new file
- the tracker evidence cites that route-local runtime integration

Make this explicit: **helper code, shared infrastructure, or off-route usage does not by itself satisfy `PORTED`.**

### 3. Add explicit partial-progress wording without creating false closure

Do **not** invent a new tracker status unless the current docs already support it cleanly.

Instead, update the tracker guidance so if shared infrastructure exists but the route-local gap is still open, the row remains `PENDING` and the blocker/evidence text must say:

- infrastructure complete
- route integration pending

Use D1 as the model pattern:

- `useDocumentExport.ts` + `docxExport.ts` are real progress
- but `/documents` still lacks the structured content seam
- therefore the row stays `PENDING`

### 4. Add an explicit governance-conflict gate

Update the salvage prompt and sprint plan so Claude must emit a **Harvest Conflict Brief** instead of implementing whenever a row touches any of:

- competing scoring models
- competing route owners
- backend-vs-client authority conflicts
- duplicate API/domain models that require a product or architecture decision

Make Genkit/client backend differences the explicit example.

### 5. Tighten tracker semantics

Update `PROTOTYPE-SALVAGE-TRACKER.md` guidance so row meanings are explicit:

- `DISCARDED` = runtime gap not real, or prototype seam is obsolete/superseded
- `BLOCKED` = governance/authority decision required before salvage can proceed
- `PENDING` = real route-local gap remains and batch is still eligible

Do not rewrite the whole tracker. Tighten the governing language near the execution rules / exit criteria so future reviewers and executors apply statuses consistently.

### 6. Update the sprint plan to reflect the gating logic

Update `REMAINING-SALVAGE-SPRINT-PLAN.md` so it explicitly states:

- no batch begins without preflight proof
- no row closes without route-local runtime integration
- infrastructure progress does not equal completion
- governance conflicts are escalated, not implemented
- Codex review remains mandatory after every batch

Keep the plan structure intact. This is a governance tightening pass, not a re-plan of every milestone.

## Hard Constraints

- do not implement any product code
- do not change any runtime files under `frontend/src/**`
- do not reopen harvest classification
- do not add speculative backlog rows
- do not mark any new row `PORTED`
- do not create a new status unless absolutely necessary and already supported by current control-doc conventions

## MCP Efficiency

Use:

```text
flash-sidekick.batch_file_analysis({
  "analysis_type": "salvage_governance_repair",
  "file_paths": [
    "docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md",
    "docs/project/active/frontend-source-of-truth-migration/control/CLAUDE_PROTOTYPE_SALVAGE_PROMPT.md",
    "docs/project/active/frontend-source-of-truth-migration/control/REMAINING-SALVAGE-SPRINT-PLAN.md",
    "docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-PATTERN-CATALOG.md",
    "docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json",
    "frontend/src/App.tsx",
    "frontend/src/config/route-registry.ts"
  ]
})
```

## Verification

Run:

```bash
npx tsx tools/scripts/scan-routes.ts
npx tsx tools/ci/check-route-integrity.ts
npx tsx tools/ci/check-screen-pairs.ts
(cd frontend && yarn type-check)
```

Then confirm:

- only the 3 control docs changed
- all new rule text is internally consistent
- the new finish-line rule explicitly requires route-local runtime integration

## Deliverable Format

Return exactly:

1. files updated
2. rule changes made
3. verification results
4. confirmation that no salvage implementation was performed
5. confirmation that the new rules prevent false-positive row completion

Stop after this batch.
