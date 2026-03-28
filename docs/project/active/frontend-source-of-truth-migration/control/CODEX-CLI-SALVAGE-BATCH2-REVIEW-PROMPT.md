# Codex CLI Prompt — Review Claude Salvage Batch 2 (`/analysis` S1 continuation)

## Role

You are the **batch reviewer**. Your job is to review Claude’s completed batch before any further salvage begins.

Use:

- **Mode:** code review mindset — findings first, ordered by severity
- **Skills:** `migration-audit`
- **Conditional skill:** `token-enforcement` only if UI-bearing files changed

Do not implement fixes unless explicitly asked. Review only.

## Review Scope

Review only this just-completed batch:

1. `hooks/useATSScoring.ts`
2. `services/atsScorer.ts`

If Claude stopped with a Harvest Conflict Brief instead of coding, review the brief and decide whether blocking was correct.

## Review Standard

The batch passes only if all of the following are true:

1. The active rows were genuinely `PENDING` before execution.
2. The canonical owner is correct.
3. The runtime gap was real before Claude patched it.
4. No duplicate or competing client-side analysis model was introduced.
5. No prototype file was promoted directly into runtime.
6. No duplicate owner surface was introduced.
7. The tracker row status and evidence now match the actual code.
8. Every required verification item named in the tracker row was actually completed.

## Authorities

Review against these in order:

1. `frontend/src/App.tsx`
2. `frontend/src/config/route-registry.ts`
3. `frontend/src/features/analysis/AnalysisPage.tsx`
4. `frontend/src/hooks/useAnalysis.ts`
5. `frontend/src/api/analysisService.ts`
6. the touched runtime destination files under `frontend/src/**`
7. `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`
8. `frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/PROTOTYPE_AUDIT_LOG.md`
9. `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
10. prototype source files only as support-reference

## MCP Token-Efficiency

Start with:

```text
flash-sidekick.batch_file_analysis({
  "analysis_type": "salvage_batch2_review",
  "file_paths": [
    "docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md",
    "frontend/src/App.tsx",
    "frontend/src/config/route-registry.ts",
    "frontend/src/features/analysis/AnalysisPage.tsx",
    "frontend/src/hooks/useAnalysis.ts",
    "frontend/src/api/analysisService.ts",
    "<touched runtime files>"
  ]
})
```

For patched TS/TSX review:

```text
flash-sidekick.analyze_code_quality({
  "language": "typescript",
  "code": "<patched file contents>"
})
```

If a control-doc section is long:

```text
flash-sidekick.quick_summarize({
  "text": "<relevant long section>"
})
```

## Review Procedure

1. Read the tracker rows Claude resolved or blocked.
2. Read the touched runtime destination files.
3. Verify the code now present matches the row transfer mode.
4. Verify the tracker evidence matches the commands and code touched.
5. Re-check for authority drift:
   - wrong owner
   - fake runtime gap
   - direct prototype promotion
   - widened scope
   - missing verification
   - competing scoring logic vs `useAnalysis.ts` or `analysisService.ts`

If Claude emitted a Harvest Conflict Brief:

- verify the conflict is real
- verify Claude stopped early enough
- verify no speculative partial port was left behind

If UI-bearing files changed, re-run token hygiene review. If the tracker row required token-enforcement, verify it was actually satisfied rather than merely mentioned.

## Output Format

Return:

1. **Findings** — severity ordered, with file/line references
2. **Open questions** — only if approval is impossible without clarification
3. **Decision** — `APPROVE NEXT BATCH` or `BLOCK NEXT BATCH`
4. **If blocked** — exact fixes Claude must make before another batch begins

Do not give general advice. Decide whether the next salvage batch may start.
