# Branch Consolidation Execution Log

**Date:** 2026-04-22
**Branch:** `consolidation/active-branches-to-develop-2026-04-22`

## Execution Events

- Created consolidation branch from local `develop` at `b54c4c05`.
- Refreshed remote refs with `git fetch --all --prune`.
- Fetch pruned three upstream-deleted remote refs:
  - `origin/copilot/generate-mermaid-architecture-diagram`
  - `origin/feat/frontend-source-of-truth-migration`
  - `origin/sprint/2026-04-22-notion-linear-automation`
- Created execution plan:
  - `docs/project/active/plans/2026-04-22-active-branch-cleanup-consolidation.md`
- Created branch ledger:
  - `docs/project/active/handovers/2026-04-22-active-branch-ledger.md`
- Cherry-picked Sprint 4 Task 5:
  - `a17c7d5e` from source `7b0ec627` (`frontend/e2e/analysis-pipeline.spec.ts`).
- Integrated Sprint 4 Task 6 conservatively:
  - `fb2c04cc` from source `8a5a3afb`.
  - Kept the repo's axios API layer.
  - Added optional `theme_id` support to typed export payloads.
  - Dropped stale direct-`fetch` `AnalysisPage` handlers from the older branch.
- Reviewed parity remediation source `58c456fd`.
  - Did not cherry-pick the full commit because it contained older component edits.
  - Preserved the useful hygiene fix by unignoring and tracking the existing local `frontend/src/lib/composeHero.ts` and its test.
  - Commit: `702252f2`.
- Observed commit `d549ef2c` on this branch:
  - `refactor: Restructure Perplexity sync prompts with explicit scoping + search-first rules`
  - Contains the prompt-file changes that were already dirty before this execution began.
  - This appears to have been created by repo automation/post-commit behavior rather than manual branch-consolidation staging.
- Fixed TypeScript errors in document sync helpers:
  - Commit: `ffbd4770`.
  - Files: `frontend/src/lib/document-store/notion.ts`, `frontend/src/lib/document-store/perplexity.ts`, `frontend/src/lib/issue-tracker/linear.ts`.

## Reviewed and Deferred

- CI/governance branches:
  - `origin/copilot/sub-pr-116`
  - `origin/copilot/sub-pr-116-again`
  - `origin/copilot/sub-pr-126`
  - `origin/copilot/sub-pr-126-again`
  - `origin/copilot/sub-pr-126-another-one`
  - `origin/copilot/audit-branch-activity`
  - local `copilot/ci-workflow-automation-cleanup`
- Result: not cherry-picked as branches. Their diffs delete or move current active design canon, coordination docs, or workflow files. Any workflow edits need explicit approval after CI guard review.
- Routing/UX branches:
  - `origin/copilot/create-mermaid-user-journey-map`
  - `origin/copilot/review-all-recommendations`
- Result: not cherry-picked. Their diffs rewrite `App.tsx`, route surfaces, and current feature files; this requires explicit route-promotion approval against active Figma/runtime authority.

## Pre-Existing Dirty Worktree Items

Not staged by this execution unless explicitly reviewed:

- `docs/project/prompts/decision-logged.md`
- `docs/project/prompts/sprint-close.md`
- `docs/project/prompts/sprint-open.md`
- `docs/project/prompts/task-done.md`
- `docs/project/prompts/INIT.md`

## Pending Integration Batches

- Batch 1: Sprint 4 worktree diff from `sprint/2026-04-29-pipeline-state-wiring`.
- Batch 2: parity remediation from `fix/frontend-parity-remediation`.
- Batch 3: routing/UX review branches.
- Batch 4: CI/governance branches.
- Batch 5: high-risk migration/deployment/legacy branches.

## Validation Log

- Pre-commit design drift check passed for `fb2c04cc`.
- Pre-commit design drift check and ESLint passed for `702252f2`.
- `node frontend/scripts/validate-governance-artifacts.mjs` passed.
- `python3 scripts/design-validation/validate-tokens.py` passed.
- `(cd frontend && yarn type-check)` passed after `ffbd4770`.
- Focused tests passed:
  - `src/lib/__tests__/composeHero.test.ts`
  - `src/stores/__tests__/analysisPipelineStore.test.ts`
  - `src/features/analysis/components/__tests__/ATSSignalBreakdown.test.tsx`
- Focused tests with known residual failures:
  - `src/lib/document-store/__tests__/notion.test.ts`
  - `src/lib/issue-tracker/__tests__/linear.test.ts`
  - These tests currently expect in-memory behavior, while the implementations call external APIs.
  - `src/lib/document-store/__tests__/perplexity.test.ts` passed.
