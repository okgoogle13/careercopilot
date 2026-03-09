---
name: repo-bloat-deadcode-health-check
description: Detect repository bloat, dead code candidates, and run tech-debt health checks with safe cleanup sequencing.
---

# Repo Bloat Deadcode Health Check

Run a high-signal cleanup workflow that separates discovery, removal planning, and validation.

## Purpose

Maintain a lean, performant codebase by identifying stale artifacts, duplicate files, and unused dependencies that accumulate over time. This skill provides a systematic framework for safe repo-wide "pruning" without breaking runtime stability.

## When to Use

- **Pre-Release/Pre-PR Health**: Run as a final check before merging large features or cutting a release.
- **Codebase Slimming**: Use when the repository size grows unexpectedly or build times increase.
- **Dependency Audit**: Identify and remove unused runtime dependencies to reduce bundle size and security surface area.
- **Monorepo Maintenance**: Periodically audit sub-packages for redundant configurations or stale assets.

## Quick Start

1. **Run the scanner**:
   `python3 .claude/skills/repo-bloat-deadcode-health-check/scripts/repo_health_audit.py --root .`
2. **Review highest-risk items**:
   Focus on large files, generated artifacts in source control, duplicate files, and unused runtime dependencies.
3. **Build a removal plan**:
   Group items into confidence tiers: `high` (obvious artifacts), `medium` (duplicates), `low` (potential dead code).
4. **Validate batches**:
   Run the repo's lint/type-check/tests and re-run the scanner after each batch.

## Workflow

1. **Capture Baseline**: Record current `git status --short` and scanner output.
2. **Isolate Bloat**: Prioritize large/generated files (`dist/`, `build/`, coverage output, logs).
3. **Isolate Dead Code**: Start with unused runtime dependencies and exact duplicate files.
4. **Remove in Batches**: Keep each batch focused on one class of cleanup (e.g., "Remove stale logs").
5. **Run Health Checks**: Re-run type-check/lint/tests; if regressions appear, revert and split the batch.
6. **Report Results**: Document what was removed, what was deferred, and why.

## Interpretation Rules

- **Signal vs. Action**: Treat scanner output as candidates, not automatic deletions.
- **Runtime Proof**: Require proof of non-usage before deleting medium/low confidence items.
- **Dependency Caution**: Be conservative with dependencies in monorepos or plugin-based apps.
- **Reversible Edits**: Prefer `git rm` in small, descriptively named commits.
- **Broken Symlinks**: Verify if a broken symlink is intentional (e.g., optional build artifacts) before pruning.

## Troubleshooting

- **Large File Hanging**: If the script hangs on very large binaries, use `--max-duplicate-file-mb` to limit hashing.
- **Permission Denied**: Run with appropriate permissions or exclude sensitive directories using `IGNORE_DIRS` in the script.
- **Regex Misses**: The dependency scanner uses regex; it may miss dynamic imports. Verify manually before removal.

## Output Contract

1. **Findings**: Ordered by severity with file/path references.
2. **Cleanup Plan**: Grouped by confidence tier (`high`, `medium`, `low`).
3. **Validation Outcome**: List of commands run and their status.
4. **Deferred Risks**: List of items identified but not removed.

## Resources

- **Scanner**: `scripts/repo_health_audit.py`
  - Detects bloat signals, duplicates, and unused JS/TS dependencies.
- **Playbook**: `references/cleanup-playbook.md`
  - Defines tiers and safe deletion steps.

## Related Skills

- [project-health-checker](../project-health-checker/SKILL.md) - Comprehensive project validation.
- [audit-agent](../audit-agent/SKILL.md) - Detailed security and quality audits.
- [code-reviewer](../code-reviewer/SKILL.md) - Review code for logic and structural tech debt.
