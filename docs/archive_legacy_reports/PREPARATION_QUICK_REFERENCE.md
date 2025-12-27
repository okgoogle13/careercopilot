# M3 Migration Preparation - Quick Reference Card

**Status:** ✅ READY TO EXECUTE
**Current Readiness:** 34%
**Target Readiness:** 70%

---

## One-Command Preparation

```bash
./scripts/prepare-for-migration.sh
```

Preview first:
```bash
./scripts/prepare-for-migration.sh --dry-run
```

---

## What Gets Fixed

| Issue | Before | After |
|-------|--------|-------|
| Index files coverage | 17% | Target: 95%+ |
| Component structure | Mixed formats | Standardized |
| Duplicate dirs | Ksc + KSC | Single ksc |
| Naming inconsistencies | 5 issues | 0 issues |
| Component manifest | None | Auto-generated |

---

## Individual Scripts

### 1. Audit Current State
```bash
./scripts/audit-component-structure.sh
```
**Output:** Readiness score, detailed breakdown, issues list

### 2. Consolidate Directories
```bash
./scripts/consolidate-duplicate-dirs.sh
```
**Does:** Merges Ksc/KSC, renames misnamed dirs, updates imports
**Safety:** Creates backup first

### 3. Standardize Structure
```bash
./scripts/standardize-component-structure.sh --dry-run
./scripts/standardize-component-structure.sh
```
**Does:** Adds index.ts to 108 components, restructures loose files
**Supports:** Dry-run mode for preview

### 4. Generate Manifest
```bash
./scripts/generate-component-manifest.ts
```
**Output:** component-manifest.json ready for automation tools

### 5. Validate Readiness
```bash
./scripts/pre-migration-validation.sh
```
**Checks:** TypeScript compilation, imports, structure, file permissions

---

## Timeline

| Phase | Duration | Work | Command |
|-------|----------|------|---------|
| Phase 1 | 2-3 days | Component prep | `./scripts/prepare-for-migration.sh` |
| Phase 2 | 3-4 days | Tests/Storybook | Use jest-test-scaffolder skill |
| Phase 3 | 1-2 weeks | Auto migration | M3 migration skills ready |
| Phase 4 | 1 week | Validation | Deploy to production |

---

## Available Infrastructure

### ✅ M3 Migration Skills (5,036 lines)
- 8 specialized refactoring skills
- Batch orchestrator for parallel execution
- Jules coordination framework
- Ready to execute after Phase 2

### ✅ Design System (Complete)
- 78 semantic color tokens
- CSS variables generation
- Validation and building scripts
- Production-ready

### ✅ Testing Framework
- Jest configuration with M3 awareness
- 91/126 components with existing tests
- Storybook templates ready
- Automation capability built-in

---

## Documentation

- **Quick Start:** [MIGRATION_PREP_QUICKSTART.md](../MIGRATION_PREP_QUICKSTART.md)
- **Full Assessment:** [docs/MIGRATION_READINESS.md](../docs/MIGRATION_READINESS.md)
- **Integration Details:** [.ai_reports/M3_MIGRATION_PREP_INTEGRATION_REPORT.md](./)
- **Backend Setup:** [CLAUDE.md](../CLAUDE.md) - M3 migration section

---

## Git Status

```
Branch: develop
Commits: 22 ahead of origin/develop
Status: Clean, ready for push
```

Push to remote:
```bash
git push origin develop
```

---

## Success Indicators

After preparation scripts complete:
- [ ] 95%+ index files coverage
- [ ] 0 naming inconsistencies
- [ ] Component manifest generated
- [ ] All imports updated
- [ ] TypeScript compiles cleanly
- [ ] Readiness score 45%+

---

## Next Commands to Run

**Option A: Execute preparation immediately**
```bash
./scripts/prepare-for-migration.sh --dry-run  # Preview
./scripts/prepare-for-migration.sh              # Execute
```

**Option B: Review first, then decide**
```bash
./scripts/audit-component-structure.sh  # See detailed report
./scripts/pre-migration-validation.sh   # Run checks
# Then review MIGRATION_PREP_QUICKSTART.md before proceeding
```

---

## Support

- **Issues?** Check `MIGRATION_READINESS.md` troubleshooting section
- **Questions?** Review `CLAUDE.md` M3 migration section
- **Help needed?** All scripts support `--help` flag

---

**Ready to proceed?** Confirm execution and run `./scripts/prepare-for-migration.sh`
