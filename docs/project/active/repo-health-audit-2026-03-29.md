# Repository Health Audit — 2026-03-29

**Repository:** okgoogle13/careercopilot  
**Audit Date:** 2026-03-29  
**Scope:** Branch triage, PR triage, frontend cleanup readiness, develop merge eligibility

---

## Task 1 — Branch Audit

All active branches ranked by last commit date (most recent first).

| Branch | Last Commit | Open PR | Ahead of `develop` | Behind `develop` | Recommended Action | Justification |
|--------|------------|---------|-------------------|------------------|--------------------|---------------|
| `copilot/audit-branch-activity` | 2026-03-29 | PR #132 (WIP→`feat/prototype-harvest-ready-prep`) | +6 vs `develop` | 0 (develop has none of these CI fixes) | **MERGE** | Active audit branch; CI fixes + audit doc included; these 6 commits are not in `develop` |
| `feat/prototype-harvest-ready-prep` | 2026-03-25 | None (receives PR #132) | +many | 0 | **MERGE** | Identical to `feat/prototype-harvest-prep`; should merge to `develop` after PR #132 lands |
| `feat/prototype-harvest-prep` | 2026-03-25 | None | +many | 0 | **DELETE** | Exact duplicate of `feat/prototype-harvest-ready-prep` (same SHA `c4692afd`); no PR |
| `feat/frontend-source-of-truth-migration` | 2026-03-20 | PR #126 (open→`develop`) | Ahead | Slightly | **MERGE AFTER CLEANUP** | Large migration doc branch; CI mostly passing (Deploy to Vercel + secret-scanning fail); needs Vercel config fix before merge |
| `feat/migration-cleanup-jobs-opportunities` | 2026-03-18 | PR #130 (open→`develop`) | Ahead | Some | **MERGE AFTER CLEANUP** | Route cleanup work; secret-scanning CI failure blocks merge; otherwise healthy |
| `copilot/sub-pr-126-another-one` | 2026-03-14 | PR #129 (Draft→`feat/frontend-source-of-truth-migration`) | Ahead | Some | **CLOSE** | Draft sub-PR with superseded review notes; consolidated into parent PR #126 |
| `copilot/sub-pr-126-again` | 2026-03-14 | PR #128 (Draft→`feat/frontend-source-of-truth-migration`) | Ahead | Some | **CLOSE** | Draft sub-PR with Genkit decorator fix; content absorbed into PR #126 |
| `copilot/sub-pr-126` | 2026-03-13 | PR #127 (Draft→`feat/frontend-source-of-truth-migration`) | Ahead | Some | **CLOSE** | Draft sub-PR for review feedback; superseded by updated PR #126 |
| `copilot/generate-mermaid-architecture-diagram` | 2026-03-12 | PR #124 (Draft→`develop`) | Ahead | Some | **CLOSE** | Draft Mermaid diagram PR; stale since 2026-03-12; low-value for CI unblock |
| `copilot/review-all-recommendations` | 2026-03-09 | None | Ahead | Many | **DELETE** | Stale review branch with no open PR; 3+ weeks old, no activity |
| `copilot/sub-pr-116-again` | 2026-03-06 | None | Ahead | Many | **DELETE** | Stale sub-PR branch with no open PR; content superseded |
| `copilot/sub-pr-116` | 2026-03-06 | None | Ahead | Many | **DELETE** | Stale sub-PR branch with no open PR; content superseded |
| `copilot/analyze-project-structure` | 2026-03-03 | None | Ahead | Many | **DELETE** | Stale analysis branch; 26+ days old, no PR, content is exploratory only |
| `feat/supabase-to-firebase-migration` | 2026-03-03 | None | Ahead | Many | **CONSOLIDATE** | Old migration branch; if work is complete, squash-merge to `develop`; if abandoned, DELETE |
| `feature/chrome-extension` | 2026-03-04 | None | Ahead | Many | **KEEP** | Chrome extension work; no PR but unique feature scope — review with team before closing |
| `main` | 2026-03-04 | None (receives deploys) | 0 | Far behind `develop` | **KEEP** | Protected production branch; `develop` must pass CI before merging here |
| `develop` | 2026-03-12 | Receives PRs #124, #126, #130 | — | — | **KEEP** | Integration branch; CI currently failing (see Task 4) |

---

## Task 2 — Open PR Triage

| PR # | Title | Source → Target | CI Status | Review Status | Merge Conflicts | Recommended Action | Justification |
|------|-------|-----------------|-----------|---------------|-----------------|---------------------|---------------|
| #132 | [WIP] Audit repository health and cleanup plan | `copilot/audit-branch-activity` → `feat/prototype-harvest-ready-prep` | 🔄 In progress | No review | No | **MERGE AFTER CLEANUP** | This PR; includes CI fixes for `servers/requirements.txt` and `mcp-benchmarks.yml`; needs review |
| #130 | feat(migration): route cleanup, tracker closeout, and M1 gate | `feat/migration-cleanup-jobs-opportunities` → `develop` | ⚠️ Failing (secret-scanning, Deploy to Vercel) | No review | Unknown | **NEEDS REVIEW** | Good migration work; secret-scanning failure is likely a false-positive pattern match; Vercel deploy failure is env-secret related, not a code defect |
| #129 | docs(migration): consolidated PR #126 review + PR stack explanation | `copilot/sub-pr-126-another-one` → `feat/frontend-source-of-truth-migration` | N/A (Draft) | No review | Unknown | **CLOSE** | Draft sub-PR superseded by updated parent PR #126; review notes already incorporated |
| #128 | docs(plan): fix Genkit decorator placement in migration skill | `copilot/sub-pr-126-again` → `feat/frontend-source-of-truth-migration` | N/A (Draft) | No review | Unknown | **CLOSE** | Draft sub-PR for minor doc fix; the change should be squashed into PR #126 directly |
| #127 | fix(review): address PR review feedback — compat, config, CI | `copilot/sub-pr-126` → `feat/frontend-source-of-truth-migration` | N/A (Draft) | No review | Unknown | **CLOSE** | Draft sub-PR for review feedback; content absorbed into PR #126 base branch |
| #126 | docs(migration): add route build contracts and tokens-first guidelines | `feat/frontend-source-of-truth-migration` → `develop` | ⚠️ Failing (secret-scanning, Deploy to Vercel); MCP health ✅ | No review | No | **NEEDS REVIEW** | Core migration docs PR; MCP checks pass; only infra failures (Vercel secrets, secret-scan false-positive) block it |
| #124 | docs: add frontend-routes.mmd Mermaid architecture diagram | `copilot/generate-mermaid-architecture-diagram` → `develop` | N/A (Draft) | No review | Unknown | **CLOSE** | Draft Mermaid diagram; stale since 2026-03-12; diagram should be committed directly to `develop` if still relevant |

---

## Task 3 — Frontend Cleanup Prerequisite Check

PRs and branches that touch frontend files (`src/components`, `src/pages`, design tokens, CSS/SCSS, TSX):

- [x] **PR #126** (`feat/frontend-source-of-truth-migration` → `develop`) — touches `frontend/src/`, design tokens, wireframes, and migration docs. **BLOCKER** for clean develop merge: must be reviewed and merged (or explicitly deferred) before declaring develop stable. CI infra failures (Vercel + secret-scan) are not code defects.
- [x] **PR #130** (`feat/migration-cleanup-jobs-opportunities` → `develop`) — touches frontend route cleanup and migration tracker files. **NON-BLOCKER** if merged independently; no frontend code breakage expected.
- [x] **`feat/prototype-harvest-ready-prep`** (receives PR #132) — contains prototype-harvest frontend work in `frontend/src/prototype-features/`. **NON-BLOCKER** for develop CI; quarantine boundaries are respected (no `src/features/` or `src/components/ui/` changes).
- [x] **PR #124** (`copilot/generate-mermaid-architecture-diagram` → `develop`) — adds a single `.mmd` diagram file; no runtime frontend code. **NON-BLOCKER** but recommended to close as draft.
- [x] **`feature/chrome-extension`** — separate extension work; does not touch the main `frontend/src/` app tree. **NON-BLOCKER**.
- [x] **`feat/supabase-to-firebase-migration`** — old migration branch; if it contains frontend Firebase SDK changes, it could conflict with current auth patterns. **POTENTIAL BLOCKER** — review before attempting merge.

### CI Failures Identified (Blocking `develop` Stability)

| Failure | Workflow | Root Cause | Fix Applied |
|---------|----------|------------|-------------|
| `azure-ai-inference>=1.0.0` install fails | `mcp-health-checks.yml` | Package only has beta releases (`1.0.0b1`–`1.0.0b9`); stable `1.0.0` not published | ✅ Fixed in `servers/requirements.txt`: changed to `>=1.0.0b9` |
| `benchmark-results/flash-sidekick.json: No such file` | `mcp-benchmarks.yml` | Benchmark step runs `cd servers` then creates result file there, but comparison step reads from repo root | ✅ Fixed: removed `cd servers`, changed `sys.path` to `'servers'`; files now created at repo root |
| `benchmark-results/cloud-ops.json: No such file` | `mcp-benchmarks.yml` | Same path issue as above | ✅ Fixed: same change applied to cloud-ops benchmark job |

---

## Task 4 — Develop Merge Eligibility Assessment

### Current State of `develop`

| Check | Status | Details |
|-------|--------|---------|
| MCP Server Health Checks | ❌ FAILING | `azure-ai-inference>=1.0.0` unresolvable |
| MCP Server Benchmarks | ❌ FAILING | `benchmark-results/*.json` path mismatch |
| Scheduled CI (core tests) | ✅ PASSING | Last successful run 2026-03-22 |
| CodeQL (on open PRs) | ✅ PASSING | Both PR #126 and PR #130 pass CodeQL |
| Open merge conflicts | ✅ NONE | No reported conflicts in open PRs |
| Unresolved critical issues | ⚠️ PENDING | 2 CI failures + 5 open PRs need action |

### Recommended Merge Order (if all cleanup applied)

1. **Merge this PR (#132)** into `feat/prototype-harvest-ready-prep` — delivers CI fixes for `requirements.txt` and `mcp-benchmarks.yml`
2. **Close PRs #127, #128, #129, #124** — remove stale draft noise
3. **Review and merge PR #126** (`feat/frontend-source-of-truth-migration` → `develop`) — core migration docs; verify Vercel secrets and secret-scan false-positive before merge
4. **Review and merge PR #130** (`feat/migration-cleanup-jobs-opportunities` → `develop`) — route cleanup; resolve secret-scan flag first
5. **Merge `feat/prototype-harvest-ready-prep`** → `develop` — harvest-prep changes + CI fixes from this PR land
6. **Run full CI on `develop`** and verify green before any merge to `main`

### GO / NO-GO Verdict

> **NO-GO** — `develop` is NOT currently in a mergeable state for release to `main`.

**Conditions blocking a GO:**

- ❌ `mcp-health-checks.yml` is failing on `develop` due to `azure-ai-inference>=1.0.0` — fix provided in this PR but not yet merged into `develop`
- ❌ `mcp-benchmarks.yml` is failing on `develop` due to benchmark file path bug — fix provided in this PR but not yet merged
- ❌ PR #126 (significant migration doc PR) is open with CI infra failures (Vercel deploy, secret-scanning) — needs review decision before develop can be called stable
- ❌ PR #130 has an open secret-scanning failure — needs triage before merge
- ⚠️ 3 draft sub-PRs (#127, #128, #129) add noise; should be closed before merge

**Conditions for GO (once all above resolved):**

- ✅ Merge fix PRs (this PR) into `develop` chain to clear CI failures
- ✅ Close stale draft PRs (#124, #127, #128, #129)
- ✅ Merge or explicitly defer PR #126 and PR #130
- ✅ Confirm all MCP health checks pass on `develop`
- ✅ Run a full scheduled CI on `develop` post-cleanup and confirm green
- ✅ Then `develop` → `main` merge is safe to proceed
