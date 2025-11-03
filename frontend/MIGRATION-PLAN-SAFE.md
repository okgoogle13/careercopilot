# Frontend Cleanup and Migration Plan (SAFE VERSION)

## ⚠️ IMPORTANT: DO NOT USE ORIGINAL SCRIPTS

The original migration scripts in this directory have **critical issues** that would cause:
- Data loss (deletion of 48+ active component files)
- Test/story file deletion
- Application breakage
- No rollback capability

**Use this safe migration plan instead.**

---

## Current Issues (Analysis Complete)

1. **Workspace Not Configured** ✅ FIXED
   - `frontend/packages/*` now added to root workspace

2. **Theme Duplication** ✅ RESOLVED
   - packages/ui theme now re-exports main theme
   - Canonical theme: `src/theme/theme.ts`

3. **Component Reality vs Assumptions**
   - Original scripts assumed 33 components exist
   - **Reality**: Most don't exist or are in different locations
   - **Solution**: Use component-inventory.ts for accurate analysis

4. **Import Path Updates Not Implemented**
   - Original scripts didn't update consuming code
   - **Solution**: safe-migrate-component.ts uses AST to update all imports

5. **Destructive Operations Without Safety**
   - cleanup-redundant.ts would delete active files
   - **Solution**: Don't run it. Use safe cleanup approach instead.

---

## Target Structure

```
frontend/
├── packages/
│   └── ui/                              # Component library (registered in workspace) ✅
│       ├── src/
│       │   ├── components/              # Migrated reusable components
│       │   ├── theme/                   # Re-exports main theme ✅
│       │   └── index.ts                 # Public API with exports
│       └── package.json                 # @careercopilot/ui
│
└── src/                                  # Application code
    ├── components/                       # Gradually emptying during migration
    │   ├── features/                    # Feature-specific (stays here)
    │   └── layout/                      # Layout components (may migrate)
    ├── features/                         # Feature modules
    ├── pages/                            # Page components
    ├── services/                         # API services
    ├── theme/                            # Canonical theme ✅
    └── utils/                            # Utility functions
```

---

## Safe Migration Steps

### Phase 1: Preparation ✅ COMPLETED

- [x] **1.1 Create Safety Net**
  - Backup branch created (recommended: `frontend-migration-backup`)
  - Current working state documented

- [x] **1.2 Fix Infrastructure**
  - ✅ Root `package.json` workspaces now includes `"frontend/packages/*"`
  - ✅ Workspace resolution verified

- [x] **1.3 Resolve Theme Conflict**
  - ✅ Decided: Keep `src/theme/theme.ts` (canonical, extensively customized)
  - ✅ Updated `packages/ui/src/theme/theme.ts` to re-export main theme
  - ✅ No duplication or conflicts

- [x] **1.4 Generate Accurate Inventory**
  - ✅ Created `scripts/component-inventory.ts` using ts-morph
  - ✅ Generates JSON report of actual components and usage
  - ✅ Identifies reusable vs feature-specific components

### Phase 2: Build Enhanced Scripts ✅ COMPLETED

- [x] **2.1 Component Inventory Script**
  - **File**: `scripts/component-inventory.ts`
  - **Features**:
    - Uses TypeScript AST analysis (ts-morph)
    - Detects all import patterns
    - Tracks dependencies
    - Identifies test/story coverage
    - Categorizes by type
    - Generates recommendations

- [x] **2.2 Safe Migration Script**
  - **File**: `scripts/safe-migrate-component.ts`
  - **Features**:
    - Migrates ONE component at a time
    - Uses `git mv` (preserves history)
    - Updates ALL imports automatically
    - Runs tests after migration
    - Creates rollback script
    - Stops on first error
    - Dry-run mode available

### Phase 3: Run Initial Analysis 📋 NEXT STEP

**Before migrating any components:**

```bash
# 1. Generate component inventory
cd frontend
npx ts-node scripts/component-inventory.ts

# 2. Review the report
cat component-inventory.json

# 3. Identify which components to migrate first
#    Look for:
#    - Components in 'ui' or 'library' categories
#    - Components with high usage counts
#    - Components with tests and stories
#    - Simple complexity components
```

### Phase 4: Incremental Component Migration

**Migrate ONE component at a time:**

```bash
# 1. Test with dry-run first
npx ts-node scripts/safe-migrate-component.ts Button --dry-run

# 2. If dry-run looks good, migrate
npx ts-node scripts/safe-migrate-component.ts Button

# 3. Verify changes
git status
git diff

# 4. Test the application
yarn dev

# 5. Run full test suite
yarn test

# 6. If all good, commit
git add .
git commit -m "migrate: move Button to @careercopilot/ui"

# 7. If issues, rollback
./rollback-Button.sh
```

**Recommended Migration Order:**

1. **Start Small**: Button (already properly structured)
2. **Common UI**: Card, Input, Dialog
3. **Forms**: TextField, Select, Checkbox
4. **Feedback**: Alert, Snackbar, Progress
5. **Data Display**: Table, List
6. **Complex**: DataGrid, DatePicker (if they exist)

**Migration Rate**: 2-3 components per day (safe pace with full testing)

### Phase 5: Feature Reorganization

After UI components migrated:

1. **Review features directory structure**
   ```bash
   ls -la src/components/features/
   ```

2. **Consolidate duplicate directories**
   - Merge `documents/` and `document/`
   - Move `main/` components to appropriate features

3. **Update imports**
   - Shared UI: `from '@careercopilot/ui'`
   - Features: relative imports

### Phase 6: Safe Cleanup

**ONLY after successful migration:**

```bash
# 1. Find empty directories
find src/components -type d -empty

# 2. Archive (don't delete) deprecated components
mkdir -p src/components/_deprecated
mv src/components/old-component src/components/_deprecated/

# 3. Keep for 2-3 sprints before final deletion

# 4. NEVER delete:
#    - Test files
#    - Story files
#    - Active components
#    - Documentation
```

### Phase 7: Verification

**Full verification checklist:**

```bash
# 1. TypeScript check
yarn typecheck

# 2. Linting
yarn lint

# 3. Full test suite
yarn test

# 4. E2E tests
yarn test:e2e

# 5. Build
yarn build

# 6. Storybook
yarn storybook

# 7. Preview build
yarn preview
```

---

## Available Scripts

### Safe Scripts ✅

| Script | Purpose | Safety |
|--------|---------|--------|
| `component-inventory.ts` | Generate accurate component list | ✅ Read-only |
| `safe-migrate-component.ts` | Migrate single component safely | ✅ Full rollback |

### Unsafe Scripts ❌ DO NOT USE

| Script | Issues | Status |
|--------|--------|--------|
| `move-to-ui.ts` | Assumes non-existent components, no import updates | ❌ BROKEN |
| `cleanup-redundant.ts` | Deletes active files, no safety checks | ❌ DANGEROUS |
| `cleanup-frontend.ts` | Analysis only (safe but incomplete) | ⚠️ Misleading results |

---

## Script Usage Examples

### Generate Component Inventory

```bash
# Basic usage
npx ts-node scripts/component-inventory.ts

# Custom output location
npx ts-node scripts/component-inventory.ts --output inventory.json

# Expected output:
# - Total components found
# - Components by category
# - Usage statistics
# - Recommendations
# - Full JSON report
```

### Migrate Component Safely

```bash
# Dry run (no changes)
npx ts-node scripts/safe-migrate-component.ts Button --dry-run --verbose

# Actual migration
npx ts-node scripts/safe-migrate-component.ts Button

# With verbose output
npx ts-node scripts/safe-migrate-component.ts Card --verbose

# Help
npx ts-node scripts/safe-migrate-component.ts --help
```

---

## Success Criteria

- ✅ Zero breaking changes to application
- ✅ All tests continue passing
- ✅ Storybook continues working
- ✅ All imports use `@careercopilot/ui` pattern
- ✅ Git history preserved
- ✅ Full rollback capability
- ✅ Team documentation updated

---

## Realistic Timeline

| Phase | Duration | Notes |
|-------|----------|-------|
| Preparation | ✅ Complete | Workspace config, theme resolution |
| Enhanced Scripts | ✅ Complete | Inventory and migration tools ready |
| Initial Analysis | 1 day | Run inventory, plan migration order |
| Component Migration | 10-15 days | 2-3 components/day, ~35 total |
| Feature Reorganization | 3-5 days | Consolidate features directory |
| Cleanup & Verification | 2-3 days | Archive deprecated, full testing |
| **Total** | **~3-4 weeks** | With safety buffer |

---

## Rollback Procedures

### If Migration Fails

```bash
# 1. Use generated rollback script
./rollback-ComponentName.sh

# 2. Or manual rollback
git checkout HEAD -- .
yarn install

# 3. Verify rollback worked
yarn test
yarn build
```

### If Major Issues After Multiple Migrations

```bash
# 1. Return to backup branch
git checkout frontend-migration-backup

# 2. Create new branch from backup
git checkout -b frontend-migration-retry

# 3. Apply lessons learned
# Review what went wrong
# Adjust migration order
# Test more thoroughly
```

---

## Monitoring & Validation

### After Each Component Migration

- [ ] TypeScript compiles without errors
- [ ] All tests pass
- [ ] Application runs without errors
- [ ] Storybook loads successfully
- [ ] No console errors in browser
- [ ] Component functions correctly
- [ ] All imports resolve properly

### After Full Migration

- [ ] Run full E2E test suite
- [ ] Performance benchmarks (no regression)
- [ ] Bundle size analysis
- [ ] Documentation updated
- [ ] Team training completed

---

## Team Communication

### Before Starting

- Share this migration plan with team
- Explain changes and timeline
- Set up migration branch
- Schedule review sessions

### During Migration

- Daily updates on progress
- Share any issues encountered
- Coordinate on feature work
- Merge frequently to avoid conflicts

### After Completion

- Demo new import patterns
- Update component documentation
- Create import style guide
- Archive this migration plan

---

## References

- **Component Analysis**: See `component-inventory.json` after running analysis
- **Migration Logs**: Each migration creates a rollback script for reference
- **Original Issues**: See analysis section above
- **Theme Documentation**: See `src/theme/theme.ts` for canonical theme

---

## Questions & Support

If you encounter issues:

1. Check the rollback script for the component
2. Review the migration logs
3. Run component inventory again to verify state
4. Consult this document's troubleshooting section
5. Create a backup before attempting fixes

**Remember**: Migrate incrementally, test thoroughly, and always have a rollback plan.
