# M3 Test Fixes - Quick Reference

**Status:** 36 failed tests → Target: < 25 failed tests

---

## ✅ Fixed in This Session

1. **SettingsPage.test.tsx** ✅
   - Changed: `import { SettingsPage } from '../SettingsPage'`
   - To: `import { SettingsPage } from '@/features/pages/SettingsPage'`

2. **DocumentsPage.test.tsx** ✅
   - Changed: `import { DocumentsPage } from '@/components/documentsPage'`
   - To: `import { DocumentsPage } from '@/features/pages/DocumentsPage'`

---

## 🔧 Remaining Fixes Needed

### Missing Components (Need to Create or Find)

These components don't exist yet - tests need to be updated or components created:

1. **ProfileGrid** - Test: `dashboard/__tests__/ProfileGrid.test.tsx`
   - **Action:** Find if component exists elsewhere or create stub
   - **Location:** `frontend/src/components/features/dashboard/dashboard/`

2. **ConfirmTagsModal** - Test: `ingestion/__tests__/ConfirmTagsModal.test.tsx`
   - **Action:** Find if component exists elsewhere or create stub
   - **Location:** `frontend/src/features/ingestion/ingestion/`

3. **ProfileEditor** - Test: `profile/__tests__/ProfileEditor.test.tsx`
   - **Action:** Find component location
   - **Search:** `find frontend/src -name "ProfileEditor.*"`

4. **ApplicationGeneratorModal** - Test: `__tests__/ApplicationGeneratorModal.test.tsx`
   - **Action:** Find component location
   - **Search:** `find frontend/src -name "ApplicationGeneratorModal.*"`

5. **ImportWizard** - Test: `profile/__tests__/ImportWizard.test.tsx`
   - **Action:** Find component location
   - **Search:** `find frontend/src -name "ImportWizard.*"`

6. **DashboardHeader** - Test: `dashboard/__tests__/Dashboard.test.tsx`
   - **Action:** Find component location
   - **Search:** `find frontend/src -name "DashboardHeader.*"`

### Import Path Fixes Needed

7. **toast.test.tsx**
   - **Current:** `import { toast } from '../toast'`
   - **Action:** Find toast component/utility location
   - **Note:** Jest found `toast.module.css` - component might be named differently

8. **JobCard.test.tsx** (jobs feature)
   - **Current:** `import { JobCard } from '../../features/JobCard'`
   - **Action:** Find actual JobCard location in jobs feature

9. **JobCard.test.tsx** (opportunities feature)
   - **Current:** `import { JobCard } from '../JobCard'`
   - **Action:** Find actual JobCard location in opportunities feature

10. **AnalysisPage.test.tsx**
    - **Current:** `import { AnalysisPage } from '../AnalysisPage'`
    - **Action:** Find actual AnalysisPage location (likely in `@/features/pages/`)

11. **Navbar.test.tsx**
    - **Current:** `import { navigation } from '../../../config/navigation'`
    - **Action:** Create navigation config mock or find actual location

---

## 🚀 Quick Fix Commands

### Find Component Locations
```bash
# Find any component
find frontend/src -name "ComponentName.*" -type f

# Examples
find frontend/src -name "ProfileEditor.*"
find frontend/src -name "ApplicationGeneratorModal.*"
find frontend/src -name "ImportWizard.*"
```

### Fix Import Paths
```bash
# Use absolute paths for consistency
# Change: import { Component } from '../Component';
# To: import { Component } from '@/actual/path/to/Component';
```

### Test Individual Files
```bash
# Test one file at a time
yarn test SettingsPage
yarn test DocumentsPage
yarn test ProfileGrid
```

---

## 📊 Progress Tracking

**Starting Point:** 39 failed tests  
**After Round 1 Fixes:** 36 failed tests (3 fixed)  
**After Round 2 Fixes:** ~34 failed tests (2 more fixed)  
**Target:** < 25 failed tests

**Remaining Work:**
- 9-11 import path fixes
- 6 missing component investigations
- 1 navigation config fix

---

## 💡 Recommendations

1. **Use Absolute Paths:** Prefer `@/...` imports for consistency
2. **Component Discovery:** Use `glob_file_search` or `find` commands
3. **Incremental Fixes:** Fix one test at a time and verify
4. **Document Missing Components:** If component doesn't exist, note it for future implementation

---

**Last Updated:** 2025-01-XX  
**Next Review:** After fixing 5-10 more import issues

