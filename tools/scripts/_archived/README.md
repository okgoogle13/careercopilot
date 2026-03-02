# Archived Scripts

This directory contains one-time migration scripts, deprecated scripts, and automation tools that are no longer needed in regular development workflows.

**IMPORTANT:** Do not use these scripts in new development without understanding their original purpose and confirming they are still applicable.

## Migration Scripts (Grid, MUI, UI Refactoring)

These scripts were used for one-time codebase migrations and should not be re-executed:

- `migrate-grid-to-grid2.sh` - Migrated from Grid v1 to Grid v2 (completed)
- `migrate_grid_v7.py` - Migrated to Grid v7 API (completed)
- `migrate_mui_grid.py` - Migrated MUI Grid components (completed)
- `add-grid2-imports.sh` - Added Grid2 imports (completed)
- `fix-grid.sh` - Fixed Grid-related issues (completed)
- `fix-mui-grid-v7.sh` - Fixed MUI Grid v7 compatibility (completed)
- `fix-mui-imports.sh` - Fixed MUI import paths (completed)
- `UI_setup.sh` - One-time UI component setup (completed)

## One-Time Configuration Migrations

Scripts that migrated or consolidated configuration:

- `add-remaining-secrets.sh` - Added remaining secrets (completed)
- `consolidate-env-config.sh` - Consolidated environment config (completed)
- `finalize-git-merge.sh` - Finalized git merge operations (completed)

## One-Time Code Fixes and Refactoring

Scripts that fixed specific issues and are no longer needed:

- `fix-import-paths.sh` - Fixed import paths (completed)
- `fix-gcp-iam-permissions.sh` - Fixed GCP IAM permissions (completed)
- `fix-eslint-issues.sh` - Fixed ESLint errors (completed)
- `fix-typescript-issues.sh` - Fixed TypeScript errors (completed)
- `fix-deployment-pipeline.sh` - Fixed deployment pipeline (completed)
- `fix-genkit-imports.py` - Fixed Genkit imports (completed)
- `autofix-typescript-errors.sh` - Auto-fixed TypeScript errors (completed)
- `autofix-remaining-errors.sh` - Auto-fixed remaining errors (completed)
- `autofix-critical-errors.sh` - Auto-fixed critical errors (completed)
- `run-code-refactor.sh` - Code refactoring tool (completed)

## Deprecated/Obsolete Scripts

Scripts that are outdated or replaced by newer versions:

- `commit-cleanup.sh` - Old cleanup tool (use git commands directly)
- `prep-production-env.sh` - Old production prep (use setup-production-secrets.py)
- `verify-rotation.sh` - Old rotation verification (use rotate-api-keys.sh)
- `verify-gcp-permissions.sh` - Old permission verification (use check-genkit-config.py)

## Personal/Non-Team Scripts

Scripts for personal automation that should not be run as part of the project:

- `personal_automation.py` - Personal automation script (do not use)
- `token-extract.sh` - Token extraction utility (personal tool)

## When to Archive New Scripts

Archive a script to this directory if:

1. It's a one-time migration tool (will not be run again)
2. It's been replaced by a newer, better version
3. It's deprecated or obsolete
4. It's personal/non-team automation

## If You Need to Use an Archived Script

1. Review the original script to understand what it does
2. Check git history to see when it was last used
3. Test thoroughly in a development environment first
4. Document why you're using an archived script
5. Consider whether you should update it for current codebase state

---

**Last Updated:** 2025-11-11
**Phase:** MEDIUM Priority Cleanup (Phase 3)
