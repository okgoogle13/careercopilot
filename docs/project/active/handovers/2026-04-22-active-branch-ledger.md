# Active Branch Cleanup Ledger

**Date:** 2026-04-22
**Consolidation branch:** `consolidation/active-branches-to-develop-2026-04-22`
**Baseline:** local `develop` at `b54c4c05` (`origin/develop` + 4 local commits)

## Worktree Notes

- The worktree already had uncommitted prompt changes before execution:
  - `docs/project/prompts/decision-logged.md`
  - `docs/project/prompts/sprint-close.md`
  - `docs/project/prompts/sprint-open.md`
  - `docs/project/prompts/task-done.md`
  - `docs/project/prompts/INIT.md`
- These were not created by the branch cleanup execution and must not be staged unless explicitly reviewed.

## Branch Ledger

| Branch | Scope | Unique vs consolidation | Tip | Disposition |
|---|---:|---:|---|---|
| `origin/copilot/analyze-project-structure` | remote | 2 ahead / 184 behind | `1e6477f0` ci: migrate workflows from Supabase/Docker to Firebase/Vercel | ask-first: deployment/CI policy |
| `origin/copilot/audit-branch-activity` | remote | 4 ahead / 55 behind | `d867d6b2` docs(design): shape tokens M3 expressive integration readiness review | review/cherry-pick if still useful |
| `origin/copilot/create-mermaid-user-journey-map` | remote | 3 ahead / 43 behind | `0175f961` fix(routing): address code review feedback | review/cherry-pick only if route authority agrees |
| `origin/copilot/review-all-recommendations` | remote | 3 ahead / 148 behind | `0e779ffd` feat(ux): implement all remaining recommendations | review/cherry-pick if current UX still wants it |
| `origin/copilot/sub-pr-116` | remote | 4 ahead / 165 behind | `8cd9da8e` fix(ci): make changes job run on workflow_dispatch | review with CI guard |
| `origin/copilot/sub-pr-116-again` | remote | 4 ahead / 165 behind | `a1a63a32` fix(ci+orchestrate): workflow_dispatch gating | review with CI guard; likely newer duplicate of sub-pr-116 |
| `origin/copilot/sub-pr-126` | remote | 2 ahead / 101 behind | `85b06862` fix(review): address PR review feedback | review/cherry-pick if still relevant |
| `origin/copilot/sub-pr-126-again` | remote | 2 ahead / 101 behind | `9783d1f3` docs(plan): fix Genkit decorator placement | review/cherry-pick if still relevant |
| `origin/copilot/sub-pr-126-another-one` | remote | 4 ahead / 101 behind | `d1600566` docs(migration): add PR stack overview | review/cherry-pick if still relevant |
| `origin/copilot/update-sprint-plan-transition` | remote | 0 ahead / 20 behind | `6bd05fd9` feat: remediate visual parity | already represented/superseded; delete after merge |
| `origin/feat/migration-cleanup-jobs-opportunities` | remote | 13 ahead / 97 behind | `255c8e2c` chore(frontend): M2/M3 cleanup | high-risk review; do not bulk merge |
| `origin/feat/prototype-harvest-ready-prep` | remote | 0 ahead / 53 behind | `1882cb5c` feat(frontend): harden KR shapes v6.1 | already represented/superseded; delete after merge |
| `origin/feat/supabase-to-firebase-migration` | remote | 2 ahead / 184 behind | `0bf313c3` feat: complete Supabase to Firebase migration | ask-first: migration/deployment policy |
| `origin/feature/chrome-extension` | remote | 1 ahead / 180 behind | `66b57ce0` feat(chrome-extension): add integration test | keep separate |
| `origin/feature/kr-solidarity-gold-tokens` | remote | 0 ahead / 52 behind | `a8ee04f3` feat: finalize design system hardening | already represented/superseded; delete after merge |
| `KR-Rage-Figma` | local | 993 ahead / 2210 behind | `d1af07ec` KR-Rage-Figma Branch Recovery | local archive/high-risk; do not bulk merge |
| `claude/intelligent-thompson` | local | 0 ahead / 125 behind | `68debe6c` docs: plan location rule | already represented; local delete candidate |
| `codex/route-convergence-tasks` | local | 0 ahead / 39 behind | `42d68a20` chore: clean up agent tooling artifacts | already represented; local delete candidate |
| `codex/token-fix` | local | 0 ahead / 38 behind | `c3bc9a37` chore: clean up agent tooling artifacts | already represented; local delete candidate |
| `copilot/ci-workflow-automation-cleanup` | local | 2 ahead / 18 behind | `fc93194e` chore: close Sprint 3, stage Sprint 4 | review/cherry-pick if still useful |
| `copilot/update-sprint-plan-transition` | local | 0 ahead / 18 behind | `a452d727` chore: purge stale assets | already represented/superseded; local delete candidate |
| `feat/frontend-source-of-truth-migration` | local | 0 ahead / 70 behind | `a1ffa8be` feat(analysis): AI Studio closeout | remote gone; local delete candidate |
| `feat/migration-cleanup-jobs-opportunities` | local | 20 ahead / 97 behind | `66e44457` docs(migration): guidance | high-risk review; do not bulk merge |
| `feat/prototype-harvest-ready-prep` | local | 0 ahead / 53 behind | `1882cb5c` feat(frontend): KR shapes v6.1 | already represented/superseded; local delete candidate |
| `feature/chrome-extension` | local | 1 ahead / 180 behind | `66b57ce0` feat(chrome-extension): API integration test | keep separate |
| `feature/kr-solidarity-gold-tokens` | local | 0 ahead / 52 behind | `a8ee04f3` feat: design hardening | already represented/superseded; local delete candidate |
| `feature/northcote-design-update` | local | 946 ahead / 2210 behind | `098e10e5` merge refactor branch | local archive/high-risk; do not bulk merge |
| `fix/frontend-parity-remediation` | local | 1 ahead / 22 behind | `58c456fd` feat(parity): composeHero/AuthModal | low-risk review/cherry-pick candidate |
| `kerala-rage-branch` | local | 990 ahead / 2210 behind | `1cb437e7` design/token/model config work | local archive/high-risk; do not bulk merge |
| `restoration-KR-Rage-Figma-v2.0` | local | 0 ahead / 1184 behind | `c05195f3` cleanup conflict resolution | remote gone; local delete candidate |
| `sprint/2026-04-22-notion-linear-automation` | local worktree | 0 ahead / 5 behind | `f7275b67` doc consolidation closeout | remote gone; local worktree cleanup candidate |
| `sprint/2026-04-29-pipeline-state-wiring` | local worktree | 6 ahead / 4 behind | `8a5a3afb` themed document renderer integration | low-risk Sprint 4 consolidation candidate |

## Remote Branches Already Deleted Upstream During Fetch

- `origin/copilot/generate-mermaid-architecture-diagram`
- `origin/feat/frontend-source-of-truth-migration`
- `origin/sprint/2026-04-22-notion-linear-automation`

## Keepers

- `origin/main`
- `origin/develop`
- `origin/feature/chrome-extension` until extension repo split
