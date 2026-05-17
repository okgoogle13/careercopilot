# Active Branch Cleanup and Develop Consolidation Plan

> Superpowers note: this is a planning/branch-operations task, not production-code implementation. Use `superpowers:test-driven-development` if any consolidation step requires new feature, bugfix, refactor, or behavior-changing code. For pure branch, doc, and cleanup operations, use the validation gates in this plan.

**Goal:** consolidate all active non-extension work into one temporary feature branch, merge that branch into `develop`, then delete/archive remote branches so the long-term branch set is only:

- `main`
- `develop`
- `feature/chrome-extension` until it is migrated to its own browser extension repo

**Target consolidation branch:** `consolidation/active-branches-to-develop-2026-04-22`

**Current baseline observed on 2026-04-22:**

- Local `develop` is ahead of `origin/develop` by 4 commits:
  - `97d92ac4` Perplexity-driven Notion + Linear sync via post-commit hook
  - `2a203a67` analysisPipelineStore Tasks 1+2
  - `3e893ad7` ExportActionBar server export routing
  - `b54c4c05` ATS Signal Breakdown Task 4
- `sprint/2026-04-29-pipeline-state-wiring` has 6 commits and overlaps with local Sprint 4 work.
- `feature/chrome-extension` has 1 unique commit and should be preserved for now, not merged into web app cleanup.
- Several Figma/prototype/design branches are ancestors of `develop` or superseded by current active docs.
- Several remote Copilot branches contain small, review-style changes that should be cherry-picked or explicitly dropped.

**Non-negotiable guardrails:**

- Do not delete remote branches until the consolidation PR is merged and validated.
- Do not merge `feature/chrome-extension` into `develop`; keep it separate until repository split.
- Ask before changing auth policy, database migration policy, model-selection policy, required environment variables, or deployment configuration.
- Preserve KR Solidarity constraints: semantic `--kr-*` tokens, no hardcoded hex in production UI, no new prototype-era `figma:asset/*` bindings.
- Treat current Figma sync artifacts as settled unless a branch proves a real missing runtime fix.

---

## Phase 0: Freeze and Inventory

**Purpose:** stop new branch drift while producing a precise branch disposition list.

- [ ] **Step 1: Announce branch freeze**
  - Ask humans and agents to stop pushing to non-`develop` branches except `feature/chrome-extension`.
  - New work should target `consolidation/active-branches-to-develop-2026-04-22` or wait.

- [ ] **Step 2: Fetch and record branch state**
  ```bash
  git fetch --all --prune
  git branch -a -vv
  git log --oneline --decorate --graph --all --max-count=160
  ```

- [ ] **Step 3: Create a branch ledger**
  - Create `docs/project/active/handovers/2026-04-22-active-branch-ledger.md`.
  - Record every local and remote branch, its tip commit, ahead/behind count, owner if known, and proposed disposition.

- [ ] **Step 4: Verify local `develop` first**
  ```bash
  git checkout develop
  git status --short --branch
  node frontend/scripts/validate-governance-artifacts.mjs
  python3 scripts/design-validation/validate-tokens.py
  ```
  - If local `develop` is intended to be the new baseline, push it before creating the consolidation branch.
  - If not, move the 4 local commits into the consolidation branch instead.

---

## Phase 1: Create the Single Consolidation Branch

**Purpose:** gather every intended commit into one branch and one PR.

- [ ] **Step 1: Create branch from current `develop`**
  ```bash
  git checkout develop
  git checkout -b consolidation/active-branches-to-develop-2026-04-22
  ```

- [ ] **Step 2: Protect the branch with checkpoints**
  ```bash
  git tag pre-active-branch-consolidation-2026-04-22
  ```
  - Push the tag only after confirming it contains no secrets and points to the intended baseline.

- [ ] **Step 3: Add a consolidation log**
  - Create `docs/project/active/handovers/2026-04-22-branch-consolidation-log.md`.
  - Record every cherry-pick, skipped branch, conflict, validation command, and final disposition.

---

## Phase 2: Branch Disposition

### A. Already Merged or Superseded: Delete After PR Merge

These show `ahead=0` relative to current `develop`/`origin/develop` or are superseded by current active Figma/runtime state:

- `origin/copilot/generate-mermaid-architecture-diagram`
- `origin/copilot/update-sprint-plan-transition`
- `origin/feat/frontend-source-of-truth-migration`
- `origin/feat/prototype-harvest-ready-prep`
- `origin/feature/kr-solidarity-gold-tokens`
- local `claude/intelligent-thompson`
- local `codex/route-convergence-tasks`
- local `codex/token-fix`
- local `restoration-KR-Rage-Figma-v2.0`
- local `sprint/2026-04-22-notion-linear-automation`

Action:

- [ ] Confirm each branch has no unique diff against the consolidation branch.
- [ ] Mark as `delete-after-merge` in the branch ledger.
- [ ] Do not cherry-pick.

### B. Keep Separate

- `feature/chrome-extension`

Action:

- [ ] Keep remote branch.
- [ ] Add note that the intended future state is a separate `careercopilot-chrome-extension` repo.
- [ ] Do not merge into `develop` unless the user explicitly reverses the extension strategy.

### C. Consolidate Into the Single Branch

Cherry-pick or manually apply the useful commits from these branches:

- local `sprint/2026-04-29-pipeline-state-wiring`
- local `fix/frontend-parity-remediation`
- local `copilot/ci-workflow-automation-cleanup`
- `origin/copilot/create-mermaid-user-journey-map`
- `origin/copilot/review-all-recommendations`
- `origin/copilot/sub-pr-126-another-one`
- `origin/copilot/sub-pr-126`
- `origin/copilot/sub-pr-126-again`
- `origin/copilot/sub-pr-116`
- `origin/copilot/sub-pr-116-again`
- `origin/copilot/audit-branch-activity`

Action:

- [ ] Cherry-pick in the order defined in Phase 3.
- [ ] Prefer one logical commit per feature area after conflict resolution.
- [ ] Drop duplicate `Initial plan` commits unless they contain active plan material that belongs under `docs/project/active/plans/`.

### D. High-Risk / Ask-First Branches

These touch migration, CI, Firebase/Vercel, route authority, backend tests, or old large design baselines. They need explicit review before inclusion:

- `origin/feat/migration-cleanup-jobs-opportunities`
- local `feat/migration-cleanup-jobs-opportunities`
- `origin/feat/supabase-to-firebase-migration`
- `origin/copilot/analyze-project-structure`
- local `KR-Rage-Figma`
- local `kerala-rage-branch`
- local `feature/northcote-design-update`

Action:

- [ ] Generate file-level diffs for each branch.
- [ ] Classify each commit as `include`, `already-present`, `superseded`, or `requires-human-approval`.
- [ ] Do not bulk merge these branches.
- [ ] If useful code exists, cherry-pick only narrow commits after validating against current authority order.

---

## Phase 3: Consolidation Order

**Rule:** integrate from lowest-risk to highest-risk so failures are easy to isolate.

### Batch 1: Finish Current Sprint 4 Work

Source:

- `sprint/2026-04-29-pipeline-state-wiring`

Candidate commits:

- `7b0ec627` e2e pipeline persistence test
- `8a5a3afb` themed document renderer integration

Notes:

- Tasks 1-4 appear partly duplicated by local `develop`.
- Do not blindly cherry-pick `24ed9362`, `b3edbf39`, `ff26b402`, or `1a8fbd0c` unless the diff shows they contain work missing from local `develop`.

Validation:

```bash
(cd frontend && yarn type-check)
(cd frontend && yarn test)
```

### Batch 2: Small Runtime Parity Fixes

Source:

- `fix/frontend-parity-remediation`

Candidate:

- `58c456fd` composeHero utility, AuthModal edits, and screen tests

Validation:

```bash
(cd frontend && yarn type-check)
python3 scripts/design-validation/check-design-drift.py frontend/src/features/landing/LandingPage.tsx
```

### Batch 3: Routing and UX Review Branches

Sources:

- `origin/copilot/create-mermaid-user-journey-map`
- `origin/copilot/review-all-recommendations`

Candidates:

- `2b019539`, `03e9eb1b`, `0175f961`
- `7f79c09c`, `0e779ffd`

Review requirements:

- Confirm `frontend/src/App.tsx` and `frontend/src/config/route-registry.ts` still intentionally agree.
- Confirm no alias/redirect-history route is promoted unless active docs say it is canonical.
- Confirm onboarding/auth gates still match current runtime decisions.

Validation:

```bash
(cd frontend && yarn type-check)
node frontend/scripts/validate-governance-artifacts.mjs
```

### Batch 4: CI / Governance Review Branches

Sources:

- `origin/copilot/sub-pr-116`
- `origin/copilot/sub-pr-116-again`
- `origin/copilot/sub-pr-126`
- `origin/copilot/sub-pr-126-again`
- `origin/copilot/sub-pr-126-another-one`
- `origin/copilot/audit-branch-activity`
- local `copilot/ci-workflow-automation-cleanup`

Review requirements:

- Use `ci-guard` before editing `.github/workflows/*.yml`.
- Do not add CI jobs that require missing secrets or new environment variables without user approval.
- Prefer the latest corrected version when duplicate branches represent repeated review attempts.

Validation:

```bash
node frontend/scripts/validate-governance-artifacts.mjs
python3 scripts/design-validation/validate-tokens.py
```

### Batch 5: Migration / Firebase / Large Legacy Branches

Sources:

- `origin/feat/migration-cleanup-jobs-opportunities`
- local `feat/migration-cleanup-jobs-opportunities`
- `origin/feat/supabase-to-firebase-migration`
- `origin/copilot/analyze-project-structure`
- local `KR-Rage-Figma`
- local `kerala-rage-branch`
- local `feature/northcote-design-update`

Required preflight:

```bash
git diff --stat develop..origin/feat/migration-cleanup-jobs-opportunities
git diff --stat develop..origin/feat/supabase-to-firebase-migration
git diff --stat develop..origin/copilot/analyze-project-structure
```

Decision rules:

- Include backend tests or service fixes only if they still apply to current mounted endpoints.
- Include Firebase/Vercel migration changes only after explicit approval because they may change deployment policy.
- Exclude old KR/Figma/northcote branches unless a specific file-level diff is still valuable and not already superseded.
- Exclude any generated/prototype route copy that would reintroduce Figma-bound artifacts.

Validation:

```bash
(cd backend && pytest)
(cd backend && ruff check .)
(cd frontend && yarn type-check)
(cd frontend && yarn lint)
node frontend/scripts/validate-governance-artifacts.mjs
python3 scripts/design-validation/validate-tokens.py
```

---

## Phase 4: Final Integration PR

- [ ] **Step 1: Run full relevant validation**
  ```bash
  (cd frontend && yarn type-check)
  (cd frontend && yarn lint)
  (cd frontend && yarn test)
  (cd backend && pytest)
  (cd backend && ruff check .)
  node frontend/scripts/validate-governance-artifacts.mjs
  python3 scripts/design-validation/validate-tokens.py
  ```

- [ ] **Step 2: Update active task board if Sprint 4 state changed**
  - `TASKS.md` currently tracks Sprint 4 Tasks 2-6.
  - Mark items complete only if the committed runtime and tests prove completion.

- [ ] **Step 3: Push consolidation branch**
  ```bash
  git push -u origin consolidation/active-branches-to-develop-2026-04-22
  ```

- [ ] **Step 4: Open PR to `develop`**
  - Title: `Consolidate active branch work into develop`
  - Body must include:
    - included branches
    - skipped branches
    - branches kept separate
    - validation commands and results
    - explicit ask-first decisions

- [ ] **Step 5: Merge PR after review**
  - Prefer squash merge if the branch is noisy.
  - Prefer merge commit if preserving individual commits matters for audit.

---

## Phase 5: Branch Cleanup After Merge

Only after the consolidation PR is merged and `origin/develop` is validated:

- [ ] **Step 1: Confirm merged state**
  ```bash
  git fetch --all --prune
  git branch -r --merged origin/develop
  ```

- [ ] **Step 2: Tag or record archival references**
  - Do not create hundreds of tags.
  - Record final branch tip SHAs in `docs/project/active/handovers/2026-04-22-active-branch-ledger.md`.

- [ ] **Step 3: Delete remote branches except keepers**
  Keep:
  - `origin/main`
  - `origin/develop`
  - `origin/feature/chrome-extension`

  Delete after approval:
  - all merged/superseded `origin/copilot/*`
  - `origin/feat/frontend-source-of-truth-migration`
  - `origin/feat/migration-cleanup-jobs-opportunities`
  - `origin/feat/prototype-harvest-ready-prep`
  - `origin/feat/supabase-to-firebase-migration` if explicitly skipped or consolidated
  - `origin/feature/kr-solidarity-gold-tokens`
  - old sprint branches already merged

- [ ] **Step 4: Delete stale local branches**
  - Delete only branches whose tips are recorded in the ledger.
  - Do not delete worktree-backed branches until their worktrees are removed or repointed.

---

## Success Criteria

- One merged consolidation PR contains all intentionally preserved non-extension work.
- `origin/develop` includes the selected Sprint 4, route, parity, CI/governance, and migration fixes.
- `TASKS.md` reflects the true current Sprint 4 state.
- Remote branches are reduced to `main`, `develop`, and `feature/chrome-extension`.
- No raw `figma:asset/*` production dependencies are introduced.
- KR Solidarity token validation and governance validation pass.
- Backend and frontend validation pass, or any failures are documented with owner and follow-up.

---

## Open Decisions for Human Approval

- Whether to push the 4 local `develop` commits directly to `origin/develop` before consolidation, or move them into the consolidation PR.
- Whether Firebase/Vercel migration commits from `origin/feat/supabase-to-firebase-migration` are still desired.
- Whether route/UX changes from `origin/copilot/create-mermaid-user-journey-map` should be promoted into current runtime.
- Whether old local-only KR/Figma/northcote branches should be deleted after recording their tips, or retained as local archive until the branch cleanup is complete.
- Whether `feature/chrome-extension` should remain in this repo temporarily or immediately move to a separate repository.
