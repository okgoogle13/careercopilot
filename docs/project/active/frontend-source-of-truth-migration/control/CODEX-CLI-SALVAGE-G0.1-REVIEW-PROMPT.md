# Codex CLI Prompt — Review Claude Salvage Batch G0.1

## Role

You are the **batch reviewer**. Review only the docs-only blocker cleanup batch.

Use:

- **Mode:** code review mindset — findings first, ordered by severity

Do not implement fixes unless explicitly asked.

## Review Scope

Review only:

- `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`

## Review Standard

Approve only if:

1. ATS rows remain blocked and non-terminal
2. the wording no longer claims `compromise` is a new dependency
3. the wording no longer says `useAnalysis.ts` is orphaned/unused
4. the core scoring authority conflict remains clear
5. no runtime code was changed

## Authorities

1. `frontend/src/features/analysis/AnalysisPage.tsx`
2. `frontend/src/api/analysisService.ts`
3. `frontend/src/hooks/useAnalysis.ts`
4. `frontend/src/layouts/LaboratoryShell/components/anchors/AnalysisAnchor.tsx`
5. `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`

## Output Format

Return:

1. **Findings** — severity ordered, with file/line references
2. **Decision** — `APPROVE NEXT BATCH` or `BLOCK NEXT BATCH`
3. **If blocked** — exact wording fixes required
