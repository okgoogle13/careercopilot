# M3 Test Failures Analysis & Fix Guide

**Date:** 2025-01-XX  
**Current Status:** 36 failed tests (down from 39)  
**Progress:** ✅ 3 tests fixed

---

## 📊 Test Failure Breakdown

### Category 1: Missing Module Imports (Most Common)

**Pattern:** `Cannot find module '../ComponentName'`

**Affected Files:**
1. `ProfileGrid.test.tsx` → Cannot find `../ProfileGrid`
2. `ConfirmTagsModal.test.tsx` → Cannot find `../../ConfirmTagsModal`
3. `JobCard.test.tsx` (jobs) → Cannot find `../../features/JobCard`
4. `SettingsPage.test.tsx` → Cannot find `../SettingsPage`
5. `ProfileEditor.test.tsx` → Cannot find `../ProfileEditor`
6. `toast.test.tsx` → Cannot find `../toast`
7. `ApplicationGeneratorModal.test.tsx` → Cannot find `../ApplicationGeneratorModal`
8. `AnalysisPage.test.tsx` → Cannot find `../AnalysisPage`
9. `ImportWizard.test.tsx` → Cannot find `../ImportWizard`
10. `JobCard.test.tsx` (opportunities) → Cannot find `../JobCard`
11. `DashboardHeader.test.tsx` → Cannot find `../dashboard/DashboardHeader`

**Root Cause:** 
- Components may have been moved/renamed
- Import paths are incorrect
- Components may not exist yet

**Fix Strategy:**
1. Find actual component location using `glob_file_search`
2. Update import path to match actual location
3. Use absolute paths (`@/...`) when possible for consistency

---

### Category 2: Configuration Errors

**Pattern:** `Configuration error: Could not locate module`

**Affected Files:**
1. `DocumentsPage.test.tsx` → `@/components/documentsPage` mapping issue

**Root Cause:** 
- Jest moduleNameMapper configuration issue
- Path alias not configured correctly

**Fix Strategy:**
1. Check `jest.config.mjs` for `moduleNameMapper`
2. Verify path alias configuration
3. Update import to use correct alias or relative path

---

### Category 3: Navigation Config Missing

**Pattern:** `Cannot find module '../../../config/navigation'`

**Affected Files:**
1. `Navbar.test.tsx` → Missing navigation config

**Root Cause:** 
- Navigation config file doesn't exist or moved
- Test needs mock/stub

**Fix Strategy:**
1. Create navigation config mock in test
2. Or find actual navigation config location
3. Update import path

---

## 🔧 Quick Fix Commands

### Find Component Locations
```bash
# Find a component
find frontend/src -name "ProfileGrid.tsx" -o -name "ProfileGrid.ts"
find frontend/src -name "ConfirmTagsModal.tsx" -o -name "ConfirmTagsModal.ts"
find frontend/src -name "JobCard.tsx" -o -name "JobCard.ts"
```

### Fix Import Paths
```bash
# Example: Fix ProfileGrid import
# 1. Find actual location
find frontend/src -name "ProfileGrid.*"

# 2. Update test file import
# Change: import { ProfileGrid } from '../ProfileGrid';
# To: import { ProfileGrid } from '@/actual/path/to/ProfileGrid';
```

---

## 📋 Systematic Fix Plan

### Phase 1: Fix Missing Module Imports (Priority: High)

**Estimated Time:** 30-45 minutes  
**Expected Fixes:** 11 test suites

**Steps:**
1. For each failing test:
   - Find actual component location
   - Update import path
   - Verify test runs

**Files to Fix:**
- [ ] `ProfileGrid.test.tsx`
- [ ] `ConfirmTagsModal.test.tsx`
- [ ] `JobCard.test.tsx` (jobs)
- [ ] `SettingsPage.test.tsx`
- [ ] `ProfileEditor.test.tsx`
- [ ] `toast.test.tsx`
- [ ] `ApplicationGeneratorModal.test.tsx`
- [ ] `AnalysisPage.test.tsx`
- [ ] `ImportWizard.test.tsx`
- [ ] `JobCard.test.tsx` (opportunities)
- [ ] `DashboardHeader.test.tsx`

### Phase 2: Fix Configuration Issues (Priority: Medium)

**Estimated Time:** 15-20 minutes  
**Expected Fixes:** 1-2 test suites

**Steps:**
1. Check `jest.config.mjs` for path mappings
2. Fix DocumentsPage import
3. Verify configuration

### Phase 3: Fix Navigation Config (Priority: Low)

**Estimated Time:** 10-15 minutes  
**Expected Fixes:** 1 test suite

**Steps:**
1. Create navigation config mock
2. Or find actual config location
3. Update test

---

## 🎯 Expected Results After Fixes

**Current:** 36 failed tests  
**After Phase 1:** ~25 failed tests (11 fixed)  
**After Phase 2:** ~23-24 failed tests (1-2 fixed)  
**After Phase 3:** ~22-23 failed tests (1 fixed)

**Total Expected Improvement:** 13-14 tests fixed

---

## 🚀 Next Steps

1. **Run systematic fixes:**
   ```bash
   # Fix one test at a time
   yarn test ProfileGrid
   yarn test ConfirmTagsModal
   # etc.
   ```

2. **Verify fixes:**
   ```bash
   yarn test
   ```

3. **Document remaining failures:**
   - After fixing import issues, identify remaining failure patterns
   - Focus on logic/assertion failures next

---

## 📝 Notes

- Most failures are import path issues (easy to fix)
- Some components may need to be created if they don't exist
- Use absolute paths (`@/...`) for consistency
- Consider creating a test-utils helper for common mocks

---

**Last Updated:** 2025-01-XX  
**Status:** Analysis complete - Ready for systematic fixes

