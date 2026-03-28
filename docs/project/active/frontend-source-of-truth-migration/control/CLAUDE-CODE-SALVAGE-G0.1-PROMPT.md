# Claude Code Prompt — Salvage Batch G0.1 (ATS blocker wording cleanup)

## Role

You are the **salvage executor** for a docs-only governance repair batch.

Use:

- **Agent:** `prototype-harvest-manager`
- **Skills:** `verification-before-completion`

Do not perform salvage implementation in this batch.

## Batch Scope

Execute **only** this docs-only batch:

1. tighten the blocked-row wording for:
   - `hooks/useATSScoring.ts`
   - `services/atsScorer.ts`
2. update only:
   - `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`

## Required Truth

Use these authorities:

1. `frontend/src/features/analysis/AnalysisPage.tsx`
2. `frontend/src/api/analysisService.ts`
3. `frontend/src/hooks/useAnalysis.ts`
4. `frontend/src/layouts/LaboratoryShell/components/anchors/AnalysisAnchor.tsx`
5. `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`

## Required edits

- keep both rows non-terminal
- remove any claim that `compromise` would be a *new* dependency
- replace wording that says `useAnalysis.ts` is orphaned/unused with:
  - it is a non-canonical client-side scoring path
  - it is not wired to `AnalysisPage.tsx`
  - it is used outside canonical `/analysis`
- preserve the core blocker:
  - backend-backed canonical `/analysis`
  - competing client-side scoring path exists
  - prototype scorer would become a third scoring model

## Verification

Run:

```bash
(cd frontend && yarn type-check)
```

Then confirm only the tracker doc changed.

## Deliverable Format

Return exactly:

1. rows updated
2. exact wording changes
3. verification result
4. confirmation that no salvage implementation was performed

Stop after this batch.
