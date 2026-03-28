# Codex CLI Prompt — Review Claude Salvage Batch D1

## Role

You are the **batch reviewer**.

Use:

- **Mode:** code review mindset — findings first, ordered by severity
- **Skills:** `migration-audit`

Do not implement fixes unless explicitly asked.

## Review Scope

Review only the just-completed D1 batch:

1. `hooks/useDocumentExport.ts`

## Review Standard

Approve only if:

1. the row was genuinely `PENDING`
2. canonical owner `/documents` is correct
3. runtime gap was real before patching
4. export behavior aligns with canonical document services
5. no duplicate document owner surface was introduced
6. tracker evidence matches the code and verification

## Authorities

1. `frontend/src/App.tsx`
2. `frontend/src/config/route-registry.ts`
3. touched runtime files under `frontend/src/features/documents/**`
4. `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`
5. `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`

## Output Format

Return:

1. **Findings** — severity ordered, with file/line references
2. **Decision** — `APPROVE NEXT BATCH` or `BLOCK NEXT BATCH`
3. **If blocked** — exact fixes required
