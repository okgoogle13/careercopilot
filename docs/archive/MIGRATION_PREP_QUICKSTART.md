# Migration Preparation Quick Start Guide

**Last Updated:** 2025-11-17
**Purpose:** Prepare CareerCopilot frontend for M3 migration automation

---

## TL;DR - One Command

```bash
./scripts/prepare-for-migration.sh
```

This master script runs all preparation steps in the correct order with safety checks.

---

## What This Does

Prepares your frontend codebase for **Material Design 3 (M3) migration automation** by:

1. ✅ Standardizing component directory structure
2. ✅ Consolidating duplicate directories (Ksc/KSC)
3. ✅ Adding barrel exports (index.ts) to all components
4. ✅ Generating component manifest for automation tools
5. ✅ Validating readiness for migration

---

## Current State

**Readiness Score:** 12% (based on initial audit)

**Issues:**

- Only 18% of components have index files
- Only 17% have tests
- Only 2% have Storybook stories
- 5 PascalCase directory naming inconsistencies
- Duplicate Ksc/KSC directories

**Target:** 70% readiness before migration automation can run

---

## Step-by-Step Manual Process

If you prefer to run each step individually:

### Step 1: Audit Current State

```bash
./scripts/audit-component-structure.sh
```

**What it does:** Analyzes component structure and generates readiness report

**Output:** Console report with statistics

### Step 2: Consolidate Duplicate Directories

```bash
./scripts/consolidate-duplicate-dirs.sh
```

**What it does:**

- Merges `features/Ksc` and `features/KSC` into `features/ksc`
- Renames `features/Analysis` → `features/analysis`
- Renames `Documents` → `documents`
- Updates all imports automatically
- Creates backup before changes

**⚠️ Warning:** This modifies your codebase. Backup created in `./backups/`

### Step 3: Standardize Component Structure

```bash
# Preview changes first (dry run)
./scripts/standardize-component-structure.sh --dry-run

# Apply changes
./scripts/standardize-component-structure.sh
```

**What it does:**

- Moves loose component files into their own directories
- Creates `ComponentName/ComponentName.tsx` structure
- Adds `index.ts` barrel exports
- Moves associated test/story files

**Example:**

```
Before:
  components/library/ATSScoreCircle.tsx

After:
  components/library/ATSScoreCircle/
    ATSScoreCircle.tsx
    ATSScoreCircle.test.tsx    (if exists)
    ATSScoreCircle.stories.tsx (if exists)
    index.ts                   (created)
```

### Step 4: Generate Component Manifest

```bash
node scripts/generate-component-manifest.ts
```

**What it does:**

- Scans all 126 components
- Extracts metadata (MUI usage, Tailwind, complexity, etc.)
- Generates `component-manifest.json` for automation tools
- Creates `component-manifest-summary.md` report

**Output Files:**

- `component-manifest.json` - Full machine-readable manifest
- `component-manifest-summary.md` - Human-readable summary

### Step 5: Validate Readiness

```bash
./scripts/pre-migration-validation.sh
```

**What it does:**

- Checks component structure (80%+ need index files)
- Validates test coverage (40%+ required)
- Runs TypeScript compilation
- Runs linting
- Verifies build succeeds
- Checks for naming inconsistencies

**Exit codes:**

- `0` = Ready for migration
- `1` = Not ready, see failing checks

---

## What Gets Created

### Scripts (in `scripts/`)

1. **audit-component-structure.sh**
   - Comprehensive component analysis
   - Generates readiness statistics

2. **consolidate-duplicate-dirs.sh**
   - Merges duplicate directories
   - Updates imports automatically

3. **standardize-component-structure.sh**
   - Restructures loose component files
   - Adds barrel exports

4. **generate-component-manifest.ts**
   - Creates automation-ready manifest
   - Extracts component metadata

5. **pre-migration-validation.sh**
   - Validates all preparation complete
   - 10 comprehensive checks

6. **prepare-for-migration.sh** (Master)
   - Orchestrates all steps
   - Interactive with safety prompts

### Documentation (in `docs/`)

1. **MIGRATION_READINESS.md**
   - Complete readiness report
   - Phase-by-phase preparation plan
   - Risk assessment
   - Component inventory

### Generated Files (in root)

1. **component-manifest.json**
   - Machine-readable component data
   - Used by migration automation tools

2. **component-manifest-summary.md**
   - Human-readable manifest summary

### Backups (in `backups/`)

Each script creates timestamped backups before making changes:

- `backups/component-consolidation-YYYYMMDD-HHMMSS/`
- `backups/component-standardization-YYYYMMDD-HHMMSS/`

---

## Migration Automation Skills

These skills are being built and will be deployed soon:

1. **m3-layout-refactor** - Layout patterns → M3 spacing/grid
2. **m3-color-themer** - Apply M3 color system
3. **m3-typography-classifier** - Update to M3 type scale
4. **m3-editorial-stylist** - Standardize content styling
5. **m3-shape-refactor** - Apply M3 shape system
6. **m3-elevation-refactor** - Migrate shadows → M3 elevation
7. **m3-icon-replacer** - Swap to Material Symbols
8. **m3-motion-applier** - Add M3 motion patterns

**Location:** `.claude/skills/frontend-migration/`

**Status:** Placeholder files created, implementation in progress

---

## Safety Features

### Backups

All scripts create timestamped backups before modifying files

### Dry-Run Mode

Component standardization script supports `--dry-run` to preview changes

### TypeScript Validation

All scripts run TypeScript compilation after changes to catch errors

### Git Integration

- Master script checks for uncommitted changes
- Optional `--auto-commit` flag to commit after each phase
- All changes are git-trackable

### Rollback

If anything goes wrong:

```bash
# Restore from backup
cp -r backups/component-standardization-YYYYMMDD-HHMMSS/components/* frontend/src/components/

# Or use git
git checkout frontend/src/components
```

---

## Troubleshooting

### TypeScript Errors After Restructuring

**Problem:** Import paths broken after moving files

**Solution:**

```bash
# The consolidation script auto-updates imports, but if needed:
# 1. Check component manifest for correct paths
# 2. Update imports manually
# 3. Run TypeScript compiler to find remaining issues:
cd frontend && npx tsc --noEmit
```

### Validation Fails on Test Coverage

**Problem:** Only 17% test coverage, need 40%+

**Solution:**

```bash
# Use the jest-test-scaffolder skill to generate tests
# Ask Claude: "Generate tests for all components in library/"
# Then re-run validation
./scripts/pre-migration-validation.sh
```

### Duplicate Directory Issues

**Problem:** Both Ksc and KSC exist, conflicting

**Solution:**

```bash
# Run consolidation script
./scripts/consolidate-duplicate-dirs.sh

# This will merge them into lowercase 'ksc' and update imports
```

### Permission Denied Errors

**Problem:** Scripts not executable

**Solution:**

```bash
chmod +x scripts/*.sh
```

---

## Next Steps After Preparation

Once validation passes (70%+ readiness):

1. **Review Changes**

   ```bash
   git status
   git diff
   ```

2. **Run Tests**

   ```bash
   yarn test
   ```

3. **Commit Changes**

   ```bash
   git add -A
   git commit -m "chore: prepare frontend for M3 migration automation"
   git push origin <branch>
   ```

4. **Wait for Migration Skills**
   - Monitor `.claude/skills/frontend-migration/` for updates
   - Skills will be deployed when ready

5. **Run Migration Automation**
   - When skills are ready, Claude will guide you through migration
   - Migration will be automated based on component manifest

---

## FAQ

### Q: Will this break my app?

**A:** No. All scripts:

- Create backups before changes
- Update imports automatically
- Validate TypeScript compilation
- Can be rolled back via git/backups

### Q: How long does preparation take?

**A:** About 10-15 minutes for the automated steps, plus manual test generation if needed.

### Q: Do I need to run this if readiness is already high?

**A:** Run `./scripts/audit-component-structure.sh` first to check. If readiness is >70%, you may be ready.

### Q: Can I run these scripts multiple times?

**A:** Yes, all scripts are idempotent (safe to run multiple times).

### Q: What if I only want to fix specific issues?

**A:** Run individual scripts instead of the master script:

- Duplicate dirs only: `./scripts/consolidate-duplicate-dirs.sh`
- Structure only: `./scripts/standardize-component-structure.sh`

### Q: When will migration automation be available?

**A:** The M3 migration skills are being built and will be deployed soon. This preparation ensures a smooth migration when they're ready.

---

## Resources

- **Full Readiness Report:** `docs/MIGRATION_READINESS.md`
- **Component Manifest:** `component-manifest.json`
- **Migration Skills:** `.claude/skills/frontend-migration/`
- **Project Docs:** `CLAUDE.md`

---

## Support

If you encounter issues:

1. Check backups in `./backups/`
2. Review TypeScript errors: `cd frontend && npx tsc --noEmit`
3. Check git status: `git status`
4. Restore from backup if needed
5. Ask Claude for help with specific error messages

---

**Ready to begin?**

```bash
./scripts/prepare-for-migration.sh
```
