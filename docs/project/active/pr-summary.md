# PR Summary — P16 Donor Documentation Parity

**Date**: 2026-04-18

## Summary

- Updates active planning docs to use the current active Figma file for sync truth and the Figma Make donor as the documentation parity baseline.
- Rewrites stale reporting artifacts that still described the old rescue file and older route model.
- Refreshes screen manifests so canonical routes, redirect-history surfaces, and donor-aligned screen naming no longer contradict each other.
- Aligns token/governance enforcement and a few directly-related frontend surfaces with the same parity pass so docs, lint messaging, and runtime token usage no longer disagree.

## Changes

### Planning docs
- `TASKS.md` — narrows near-ready confirmation work, removes `/dashboard` from that queue, fixes `/profile` task-state inconsistency, and records donor-doc parity as completed.
- `docs/project/active/implementation-plan.json` — replaced old rescue-file page plan with a donor-documentation parity plan covering route-model parity, screen-manifest parity, and reporting parity.
- `docs/project/active/compliance-report.md` — replaced the old P15 branch-specific report with a doc-parity compliance record.
- `docs/project/active/pr-summary.md` — updated to reflect the actual mixed docs/governance scope of this branch.

### Screen manifests
- `docs/design/screen-map.json` — updated to current screen directories, canonical route names, and redirect-history notes.
- `docs/manifests/screens.json` — updated to current paired screen mappings and donor-aligned route metadata.

### Governance and frontend alignment
- `.github/workflows/ci.yml` and `.husky/pre-commit` — wire design drift checks so CI still shows the backlog while pre-commit checks are scoped to staged frontend files.
- `scripts/design-validation/check-design-drift.py` and `frontend/package.json` — add and expose the drift checker consistently.
- `frontend/eslint.config.mjs` and `CLAUDE.md` — align messaging and guidance to canonical `--kr-*` token usage.
- `frontend/src/features/analysis/components/feature/MatchScoreHeader.tsx`, `frontend/src/features/documents/DocumentStack.tsx`, and `frontend/src/features/landing/LandingPage.tsx` — repair small token/interaction/typography regressions directly tied to the parity review.

## Verification

Run:

- `python3 -m json.tool docs/project/active/implementation-plan.json >/dev/null`
- `python3 -m json.tool docs/design/screen-map.json >/dev/null`
- `python3 -m json.tool docs/manifests/screens.json >/dev/null`
- `python3 scripts/design-validation/check-design-drift.py frontend/src/features/analysis/components/feature/MatchScoreHeader.tsx frontend/src/features/documents/DocumentStack.tsx frontend/src/features/landing/LandingPage.tsx >/dev/null`
- `node frontend/scripts/validate-governance-artifacts.mjs`

## Deferred

- Archive and analysis docs outside the active planning set still contain older `/kr/*` and `06_lookout` references.
- `frontend/src/screens/04_ingestion/mapping.json` remains a redirect-history pairing artifact and is not changed in this pass.
- `/dashboard` still needs an actual redesign in the active Figma file before any code-target confirmation work can proceed.
