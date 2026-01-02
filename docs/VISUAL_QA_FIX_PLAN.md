# Visual QA Fix Action Plan

**Date:** 2026-01-02  
**Priority:** PRE-LAUNCH CRITICAL  
**Est. Time:** 2-3 hours

---

## ✅ Good News: Login Component Already M3 Compliant!

Upon code inspection, the Login component (`frontend/src/features/auth/Login.tsx`) **already uses M3 organic shapes:**

```tsx
// Card
className="rounded-tech"  // ✅ M3 organic (24px 4px 24px 20px)

// Icon badge  
className="rounded-gem"   // ✅ M3 organic (40px 8px 40px 8px)

// Inputs
className="rounded-tech"  // ✅ M3 organic

// Button
className="rounded-pebble" // ✅ M3 organic (20px 20px 32px 32px)
```

**This means** the card detected with `border-radius: 12px` is likely:
1. A different component on the page
2. A child component within the login page
3. Or the M3 utility classes aren't being applied correctly due to CSS specificity issues

---

## 🔍 Investigation Required

### Check #1: CSS Specificity Conflict

The test detected:
```javascript
borderRadius: '12px'  // Generic symmetric
```

But code shows:
```tsx
className="rounded-tech"  // Should be 24px 4px 24px 20px
```

**Possible Causes:**
1. Tailwind's `rounded-md` or `rounded-lg` overriding custom utilities
2. Component library (Shadcn) styles taking precedence
3. M3 utilities not properly compiled

**Action:**
```bash
# Inspect compiled CSS
cd frontend
npm run build
# Check if .rounded-tech exists in dist/assets/*.css
```

### Check #2: Identify the 12px Card

Run this to find components with generic border-radius:

```bash
grep -r "rounded-xl\|rounded-lg\|rounded-md" src/features/auth/ --include="*.tsx"
```

---

## 🚨 Critical Issues to Fix

### Issue #1: Auth Barrier (BLOCKING)

**Problem:** Users can't access job search without logging in

**Solutions:**

#### Option A: Add Demo Mode Button (Quick Win)
```tsx
// In Login.tsx, add before the form:
<div className="mb-6">
  <Button
    onClick={() => navigate('/jobs?demo=true')}
    variant="outline"
    className="w-full rounded-pebble border-2 border-secondary text-secondary hover:bg-secondary/10"
  >
    🔍 Explore Jobs (No account needed)
  </Button>
</div>
```

#### Option B: Make Job Search Public (Proper Fix)
```tsx
// In App.tsx or routing config
<Route path="/jobs" element={<JobSearch />} />  // No auth required
<Route path="/jobs/:id" element={<PublicJobDetail />} />

// Only require auth for saving/applying:
const handleSaveJob = () => {
  if (!isAuthenticated) {
    navigate('/login?redirect=/jobs');
  } else {
    saveJob(jobId);
  }
};
```

#### Option C: Guest Session
```tsx
// In AuthContext.tsx
export function useAuth() {
  const startGuestSession = () => {
    setUser({ id: 'guest', isGuest: true, ...});
  };
  
  return { ..., startGuestSession };
}

// In Login.tsx
<button onClick={startGuestSession}>
  Continue as Guest
</button>
```

**Recommendation:** **Option A** (quickest) + **Option B** (proper long-term)

---

### Issue #2: Search Interface Not Found

**Problem:** After authentication, test couldn't locate search input

**Diagnosis Needed:**
1. What route do users land on after login? (Currently: `/dashboard`)
2. Is there a search input on the dashboard?
3. Where is the main job search page?

**Actions:**
```bash
# Find all search inputs in the codebase
grep -r 'type="search"\|placeholder.*Search' frontend/src --include="*.tsx"

# Find job search routes
grep -r 'path.*job\|path.*search' frontend/src --include="*.tsx"
```

**Likely Fix:**
```tsx
// Find the JobSearch or Opportunities page
// Ensure it has a clearly identifiable search input:
<input
  type="search"  // ← Important for test selector
  name="jobSearch"
  placeholder="Search jobs..."
  className="..."
/>
```

---

### Issue #3: No Test Auth Fixture

**Problem:** Tests require `tests/auth/user.json` which doesn't exist

**Fix:**
```bash
cd frontend

# Option A: Create auth state manually
mkdir -p tests/auth
npx playwright codegen http://localhost:5173/login \
  --save-storage=tests/auth/user.json

# Then log in during recording, navigate to dashboard, close browser
# This saves the authenticated state

# Option B: Use environment variable (current workaround)
# Update package.json:
{
  "scripts": {
    "test:e2e": "VITE_USE_MOCK_AUTH=true playwright test"
  }
}
```

---

## 📝 Implementation Plan

### Phase 1: Quick Wins (30 min)

1. ✅ **Add "Explore as Guest" button to Login**
   - File: `frontend/src/features/auth/Login.tsx`
   - Add button before login form
   - Routes to `/jobs?demo=true`

2. ✅ **Create auth fixture for tests**
   ```bash
   mkdir -p frontend/tests/auth
   # Create mock auth state
   echo '{"cookies":[],"origins":[]}' > frontend/tests/auth/user.json
   ```

### Phase 2: Navigation Fixes (1 hour)

3. ⚠️ **Verify job search page exists and is accessible**
   - Check routes in `App.tsx`
   - Ensure `/jobs` route exists
   - Add search input with proper selectors

4. ⚠️ **Add navigation to job search from dashboard**
   - Add prominent "Search Jobs" button/link
   - Include in main navigation

### Phase 3: Testing & Validation (1 hour)

5. ⚠️ **Re-run Visual QA test**
   ```bash
   cd frontend
   npx playwright test tests/e2e/job-search-qa.spec.ts --project=chromium --headed
   ```

6. ⚠️ **Verify M3 compliance**
   - Check that all cards show organic shapes
   - Inspect computed styles in DevTools
   - Fix any remaining `border-radius: 12px` instances

7. ⚠️ **Complete the user journey**
   - Search for "Software Engineer"
   - Apply filters
   - Save a job
   - Verify visual feedback (toast/notification)

---

## 🎯 Success Criteria

Before marking complete, ensure:

- [ ] Users can access job search without authentication
- [ ] Visual QA test passes completely
- [ ] All cards use M3 organic shapes (no generic 12px)
- [ ] Search → Filter → Save workflow works end-to-end
- [ ] Screenshots show proper M3 design
- [ ] No console errors during user journey
- [ ] Toast/notification appears after saving job
- [ ] All interactive elements are responsive

---

## Files to Modify

1. `frontend/src/features/auth/Login.tsx` - Add guest access button
2. `frontend/src/App.tsx` - Make job search routes public
3. `frontend/tests/auth/user.json` - Create auth fixture (new file)
4. `frontend/package.json` - Add E2E test script with mock auth
5. Any components with `rounded-xl/lg/md` - Replace with M3 organic shapes

---

## Testing Commands

```bash
# Run Visual QA with mock auth
VITE_USE_MOCK_AUTH=true npx playwright test tests/e2e/job-search-qa.spec.ts

# Run with headed browser to watch
VITE_USE_MOCK_AUTH=true npx playwright test tests/e2e/job-search-qa.spec.ts --headed

# View trace for debugging
npx playwright show-trace test-results/[trace-file].zip

# View HTML report
npx playwright show-report
```

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Guest access creates security issue | Low | Medium | Limit guest features, require auth for saves |
| Public job search affects performance | Low | Low | Implement pagination, caching |
| M3 fixes break existing layouts | Medium | Low | Test all pages after changes |
| Test fixture doesn't work in CI | Medium | Medium | Use VITE_USE_MOCK_AUTH env var |

---

## Next Actions - Prioritized

### NOW (30 min):
1. Add "Explore as Guest" button to Login.tsx
2. Create empty auth fixture file
3. Re-run test to see if it gets further

### SOON (1-2 hours):
4. Make /jobs route public
5. Verify search interface exists and is findable
6. Fix any remaining M3 border-radius issues

### BEFORE LAUNCH:
7. Complete full Visual QA pass
8. Document guest access limitations
9. Add analytics to track guest→registered conversion

---

**Status:** 🟡 IN PROGRESS  
**Next Review:** After implementing Phase 1 quick wins  
**Owner:** Development Team  
**Due:** Before production deployment
