# Pre-Migration Checklist

**Before starting the frontend cleanup and migration, verify all prerequisites are met.**

---

## ✅ Infrastructure Readiness

- [x] **Workspace Configuration**
  - Root `package.json` includes `"frontend/packages/*"` in workspaces
  - Run `yarn install` successfully
  - Verify `@careercopilot/ui` package is accessible

- [x] **Theme Resolution**
  - Canonical theme identified: `src/theme/theme.ts`
  - Duplicate theme updated to re-export main theme
  - No conflicting theme definitions

- [ ] **Git Safety**
  - All current changes committed
  - Working tree clean (`git status`)
  - Backup branch created: `frontend-migration-backup`
  - Pushed to remote for safety

---

## 📊 Analysis Complete

- [ ] **Component Inventory Generated**
  ```bash
  cd frontend
  npx ts-node scripts/component-inventory.ts
  ```
  - [ ] `component-inventory.json` exists
  - [ ] Reviewed component categories
  - [ ] Identified reusable vs feature-specific components
  - [ ] Noted components with/without tests
  - [ ] Reviewed usage statistics

- [ ] **Migration Plan Created**
  - [ ] Component migration order determined
  - [ ] Priority components identified
  - [ ] Timeline estimated
  - [ ] Team informed

---

## 🔧 Tools Verified

- [ ] **TypeScript & ts-morph**
  ```bash
  yarn add -D ts-morph
  ```
  - [ ] ts-morph installed (version 27.0.0+)
  - [ ] TypeScript compilation works
  - [ ] tsconfig.json valid

- [ ] **Scripts Executable**
  ```bash
  chmod +x frontend/scripts/component-inventory.ts
  chmod +x frontend/scripts/safe-migrate-component.ts
  ```
  - [ ] Scripts have execute permissions
  - [ ] ts-node available
  - [ ] Scripts run without errors

- [ ] **Git Available**
  ```bash
  git --version
  ```
  - [ ] Git installed and working
  - [ ] `git mv` command available
  - [ ] Git history preserved

---

## 🧪 Testing Infrastructure

- [ ] **Test Suite Running**
  ```bash
  yarn test
  ```
  - [ ] All tests currently pass
  - [ ] No flaky tests
  - [ ] Test timeout configured (15s)

- [ ] **TypeScript Check**
  ```bash
  yarn typecheck
  ```
  - [ ] No TypeScript errors
  - [ ] All types resolve correctly

- [ ] **Build Success**
  ```bash
  yarn build
  ```
  - [ ] Build completes without errors
  - [ ] No warnings (or acceptable warnings documented)

- [ ] **Storybook Working**
  ```bash
  yarn storybook
  ```
  - [ ] Storybook starts successfully
  - [ ] All stories load
  - [ ] No console errors

---

## 📝 Documentation Ready

- [ ] **Migration Plan**
  - [ ] Read `MIGRATION-PLAN-SAFE.md` thoroughly
  - [ ] Understand rollback procedures
  - [ ] Know where to find help

- [ ] **Team Communication**
  - [ ] Team notified of upcoming migration
  - [ ] Timeline shared
  - [ ] Questions answered
  - [ ] Code freeze or coordination arranged (if needed)

---

## 🎯 First Component Selected

- [ ] **Button Component** (Recommended for first migration)
  - [ ] Component exists and located
  - [ ] Has tests
  - [ ] Has stories
  - [ ] Usage count known
  - [ ] Dependencies identified

---

## ⚠️ Risk Assessment

- [ ] **Backup Strategy**
  - [ ] Backup branch exists: `frontend-migration-backup`
  - [ ] Remote backup pushed
  - [ ] Can restore from backup if needed

- [ ] **Rollback Plan**
  - [ ] Know how to run rollback scripts
  - [ ] Tested rollback script generation
  - [ ] Rollback procedures documented

- [ ] **Time Allocation**
  - [ ] Sufficient time for migration (no rush)
  - [ ] Can pause if issues arise
  - [ ] Team bandwidth available for testing

---

## 🚦 Final Go/No-Go Checklist

**Before proceeding with ANY migration:**

| Criterion | Status | Notes |
|-----------|--------|-------|
| All infrastructure checks pass | ⬜ | |
| Component inventory generated | ⬜ | |
| Tools verified and working | ⬜ | |
| Tests all passing | ⬜ | |
| Build successful | ⬜ | |
| Backup created and pushed | ⬜ | |
| Team informed | ⬜ | |
| First component selected | ⬜ | |
| Rollback plan understood | ⬜ | |

**If ALL boxes checked ✅ → PROCEED with migration**

**If ANY box unchecked ⬜ → STOP and resolve issues first**

---

## 🎬 Ready to Start?

Once all checklist items are complete:

```bash
# 1. Final verification
cd frontend
git status  # Should be clean
yarn test   # Should pass
yarn build  # Should succeed

# 2. Start with dry run
npx ts-node scripts/safe-migrate-component.ts Button --dry-run

# 3. Review dry run output carefully

# 4. If satisfied, proceed with actual migration
npx ts-node scripts/safe-migrate-component.ts Button

# 5. Test thoroughly before committing
yarn test
yarn build
yarn dev

# 6. Commit if all tests pass
git add .
git commit -m "migrate: move Button to @careercopilot/ui"
```

---

## 📞 Need Help?

- **Documentation**: See `MIGRATION-PLAN-SAFE.md`
- **Script Help**: Run scripts with `--help` flag
- **Issues**: Check rollback procedures first
- **Questions**: Review the safe migration plan

**Good luck with the migration! 🚀**
