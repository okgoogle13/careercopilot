# Code Review Handover - Post Dependency Fixes

## Overview
After successfully resolving all Yarn YN0078 dependency errors in PR #83, several code-level test failures remain. These require code changes (not dependency fixes) and should be addressed in a **separate PR** to keep dependency work isolated from code refactoring.

**Dependency Fix Status**: ✅ Complete - All installations passing
**Code Test Status**: ⚠️ Requires fixes in separate PR

---

## Failing CI Jobs

### 1. Frontend Tests - Component Import/Export Errors
**Status**: ❌ Failing
**Priority**: 🔴 HIGH (blocks other frontend work)

**Error Pattern**:
```
Element type is invalid: expected a string (for built-in components)
or a class/function (for composite components) but got: undefined
```

**Root Cause**: Storybook v7→v10 upgrade changed import/export patterns and API

**Tasks**:
- [ ] Run `yarn test:frontend` locally to reproduce failures
- [ ] Check all component files with `.stories.tsx` files
- [ ] Verify default vs named export consistency:
  - Components should use `export default ComponentName`
  - Stories should use proper Storybook v10 CSF format
- [ ] Update Storybook story files to v10 API:
  - Check `meta` object structure
  - Verify `component` property references
  - Update deprecated APIs (if any)
- [ ] Test Storybook locally: `yarn storybook`

**Files to Check**:
- All files in `frontend/src/components/` with corresponding `.stories.tsx`
- `frontend/src/setupTests.ts` - may need Storybook v10 compatibility updates

**References**:
- [Storybook v10 Migration Guide](https://storybook.js.org/docs/migration-guide)
- [Component Story Format 3.0](https://storybook.js.org/blog/component-story-format-3-0/)

---

### 2. Functions Tests - ESLint Errors
**Status**: ❌ Failing
**Priority**: 🟡 MEDIUM

**Tasks**:
- [ ] Run `yarn workspace functions lint` locally
- [ ] Review ESLint errors (likely related to Storybook eslint-plugin-storybook upgrade)
- [ ] Fix linting errors or update ESLint configuration if needed
- [ ] Verify: `yarn workspace functions test` passes after lint fixes

**Expected Issues**:
- Storybook-related ESLint rules may have changed
- May need to update `functions/eslint.config.js` for compatibility

---

### 3. Backend Static Checks - Linting & Formatting
**Status**: ❌ Failing (lint, format, mypy)
**Priority**: 🟢 LOW (quick wins, automated fixes available)

**Tasks**:
- [ ] **Formatting**: Run `black backend/ --line-length=100`
- [ ] **Linting**: Run `flake8 backend/app/`
- [ ] **Type Checking**: Run `mypy backend/`
- [ ] Commit formatting changes: `git commit -m "style(backend): apply black formatting"`

**Note**: These may be pre-existing issues unrelated to dependency changes. Check git diff to confirm.

---

### 4. Backend Tests - Test Failures
**Status**: ❌ Failing
**Priority**: 🟢 LOW (investigate if pre-existing)

**Tasks**:
- [ ] Run `pytest backend/app/tests/ -v` locally
- [ ] Identify failing tests and error messages
- [ ] Determine if failures are pre-existing or dependency-related
- [ ] If pre-existing: Document in separate issue, exclude from this PR scope
- [ ] If dependency-related: Debug and fix

**Investigation Steps**:
1. Check if tests passed before dependency changes (review CI history)
2. If pre-existing, create separate issue for backend team
3. If new, debug with `pytest --pdb` for interactive debugging

---

## Priority Order

1. **Frontend Component Import/Export Fixes** (HIGH) - Blocks other frontend work
2. **Backend Formatting** (LOW/QUICK) - Automated fixes, easy wins
3. **Functions Linting** (MEDIUM) - Required for Functions CI to pass
4. **Backend Tests** (LOW) - Investigate scope (pre-existing vs new)

---

## Dependency Fix Summary

### ✅ Successfully Resolved (This PR)
- All 15+ YN0078 errors eliminated
- Clean lockfile regeneration via nuclear option
- Frontend Tests - Install dependencies: ✅ PASSING
- Functions Tests - Install dependencies: ✅ PASSING
- 73 new packages added, 2352+ packages resolved cleanly

### 📦 Package Resolutions Added
See `DEPENDENCY_FIXES_SUMMARY.md` for complete list (14 resolutions total)

### 📚 Storybook Upgrades
- **v10.0.x**: react-vite, builder-vite, addon-a11y, addon-docs, addon-onboarding, addon-vitest
- **v8.6.14**: addon-essentials, addon-interactions, addon-links, blocks, react

---

## Success Criteria for Follow-Up PR

- [ ] All CI checks green (Frontend Tests, Functions Tests, Backend Tests, Backend Static Checks)
- [ ] No functional regression - existing features work correctly
- [ ] Storybook v10 running without errors: `yarn storybook`
- [ ] Frontend build succeeds: `yarn build:frontend`
- [ ] Functions build succeeds: `yarn build:functions`

---

## Testing Checklist

Before creating follow-up PR:
```bash
# Frontend
yarn test:frontend          # All tests passing
yarn storybook              # Storybook loads without errors
yarn build:frontend         # Build succeeds

# Functions
yarn workspace functions lint    # No lint errors
yarn workspace functions test    # Tests passing
yarn workspace functions build   # Build succeeds

# Backend
black backend/ --check      # Formatting verified
flake8 backend/app/         # No lint errors
mypy backend/               # Type checking passes
pytest backend/app/tests/   # Tests passing
```

---

## Notes for Code Reviewer Agent

- **DO NOT** mix dependency fixes with code fixes - keep them in separate PRs
- **DO** verify each fix locally before committing
- **DO** run full test suite after each major change
- **DO** commit related changes together (e.g., all frontend import fixes in one commit)
- **DO** use conventional commit format: `fix(frontend): resolve Storybook v10 import errors`

---

## References

- **Dependency Fixes**: See [DEPENDENCY_FIXES_SUMMARY.md](DEPENDENCY_FIXES_SUMMARY.md)
- **PR #83**: Current dependency fix PR on `final-consolidation` branch
- **CI Workflow**: `.github/workflows/ci.yml`
- **Storybook Config**: `frontend/.storybook/main.ts`, `frontend/.storybook/preview.ts`

---

**Created**: 2025-11-05
**Branch**: final-consolidation
**Related PR**: #83
**Next Action**: Create separate PR from `develop` to address code-level failures
