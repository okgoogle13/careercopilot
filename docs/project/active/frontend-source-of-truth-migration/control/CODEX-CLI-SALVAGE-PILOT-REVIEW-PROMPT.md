# Codex CLI Prompt — Review Claude Salvage Pilot Batch

## Role

You are the **batch reviewer**. Your job is to review Claude’s completed salvage pilot batch before any further salvage begins.

Use:

- **Mode:** code review mindset — findings first, ordered by severity
- **Skills:** `migration-audit`, `token-enforcement` when UI-bearing files changed

Do not implement fixes unless explicitly asked. Review only.

## Review Scope

Review only the just-completed pilot batch:

1. `src/hooks/useAiOutputs.ts`
2. `src/components/feature/AiOutputsTabs.tsx`

If Claude executed only row 1, review only row 1.

## Review Standard

The batch passes only if all of the following are true:

1. The active row was genuinely `PENDING` before execution.
2. The canonical owner is correct.
3. The runtime gap was real before Claude patched it.
4. No prototype file was promoted directly into runtime.
5. No duplicate owner surface was introduced.
6. The tracker row status and evidence now match the actual code.
7. Every required verification item named in the tracker row was actually completed.

## Authorities

Review against these in order:

1. `frontend/src/App.tsx`
2. `frontend/src/config/route-registry.ts`
3. the touched runtime destination files under `frontend/src/**`
4. `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`
5. `frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/PROTOTYPE_AUDIT_LOG.md`
6. `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
7. prototype source files only as support-reference

## MCP Token-Efficiency

Start with:

```text
flash-sidekick.batch_file_analysis({
  "analysis_type": "salvage_pilot_review",
  "file_paths": [
    "docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md",
    "frontend/src/App.tsx",
    "frontend/src/config/route-registry.ts",
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

1. Read the tracker row that Claude resolved.
2. Read the touched runtime destination files.
3. Verify the code now present matches the row’s transfer mode.
4. Verify the tracker evidence matches the commands and code touched.
5. Re-check for authority drift:
   - wrong owner
   - fake runtime gap
   - direct prototype promotion
   - widened scope
   - missing verification

If UI-bearing files changed, re-run token hygiene review. If the tracker row required token-enforcement, verify it was actually satisfied rather than merely mentioned.

## Output Format

Return:

1. **Findings** — severity ordered, with file/line references
2. **Open questions** — only if a row cannot be approved without clarification
3. **Decision** — `APPROVE NEXT BATCH` or `BLOCK NEXT BATCH`
4. **If blocked** — exact fixes Claude must make before batch 2 begins

Do not give general advice. Decide whether the next salvage batch may start.
