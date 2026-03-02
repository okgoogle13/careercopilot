---
name: repo-bloat-deadcode-health-check
description: Detect GitHub repository bloat, surface dead code candidates, and run fast health checks with safe cleanup sequencing. Use when asked to slim a codebase, remove unused files or dependencies, find stale/duplicate artifacts, or produce a pre-PR/pre-release health report with prioritized cleanup actions.
---

# Repo Bloat Deadcode Health Check

Run a high-signal cleanup workflow that separates discovery, removal planning, and validation.

## Quick Start

1. Run the scanner:
   `python3 .claude/skills/repo-bloat-deadcode-health-check/scripts/repo_health_audit.py --root .`
2. Review the highest-risk items first:
   large files, generated artifacts in source control, duplicate files, unused runtime dependencies.
3. Build a removal plan with confidence tiers:
   `high` (obvious generated artifacts), `medium` (duplicates/stale files), `low` (possible dead code).
4. Validate after each cleanup batch:
   run the repo's lint/type-check/tests and re-run the scanner.

## Workflow

1. Capture baseline state with `git status --short` and scanner output.
2. Isolate bloat candidates:
   prioritize files that are both large and generated (`dist/`, `build/`, coverage output, logs, temp files).
3. Isolate dead code candidates:
   start with unused runtime dependencies and duplicate files.
4. Remove in small batches:
   keep each batch focused on one class of cleanup.
5. Run health checks:
   re-run type-check/lint/tests; if regressions appear, revert the batch and split further.
6. Report results:
   include what was removed, what was deferred, and why.

## Interpretation Rules

- Treat scanner output as candidate signals, not automatic deletions.
- Require runtime proof before deleting medium/low confidence items.
- Treat dependency findings conservatively in monorepos and plugin-based apps.
- Prefer reversible cleanup (`git rm` in commit-sized batches) over bulk deletes.

## Output Contract

Return:

1. Findings ordered by severity with file/path references.
2. Cleanup plan grouped by confidence tier (`high`, `medium`, `low`).
3. Validation commands run and outcomes.
4. Residual risk list for deferred candidates.

## Resources

- Scanner: `scripts/repo_health_audit.py`
  - Detects bloat signals: largest files/dirs, duplicate files, stale files, artifact candidates.
  - Detects dead-code signals: unused runtime dependencies from JS/TS imports.
  - Runs optional health commands when requested.
- Playbook: `references/cleanup-playbook.md`
  - Defines confidence tiers, safe deletion steps, and report format.

Load the playbook before making destructive edits.
