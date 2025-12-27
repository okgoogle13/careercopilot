# Week 2 Complete Remediation - Cascade Delegation Instructions

**Date:** November 14, 2025
**Objective:** Complete Week 2 testing delegation (Days 1-5) - 20 components, 120-150 tests, 90%+ pass rate
**Timeline:** 4-6 hours
**Status:** Ready for immediate Cascade execution

---

## Executive Summary

### Current State
- **Week 2 Day 1:** 4 components with 3/22 tests passing (13.6%)
- **Week 2 Days 2-5:** 0 components, 0 tests (not started)
- **Blocker:** div→Box structural issues + test assertion mismatches

### Target State
- **Week 2 Day 1:** All 4 components with 18+/22 tests passing (85%+)
- **Week 2 Days 2-5:** 16 components with 120-150 tests passing (90%+)
- **Total:** 20 components, 120-150 tests, **all passing**

### Success Criteria
✅ All tests compile and run without errors
✅ 85%+ pass rate on Day 1 (18+/22 tests)
✅ 90%+ pass rate on Days 2-5 (110+/120 tests)
✅ Clear handover reports for each day
✅ Clean git history with 5 commits (Days 1-5)

---

## Part 1: Complete Day 1 Fixes (4 components)

### Components to Fix
1. CareerGrowthHub.tsx
2. CareerIntelligence.tsx
3. FilterPanel.tsx
4. InterviewPrep.tsx

### Current Issues
- **Structural:** ~300 instances of `<div sx={{...}}>` (sx prop only works on Material-UI components)
- **Test Assertions:** Text content mismatches between tests and actual component output
- **Status:** Tests run but fail due to rendering issues and assertion mismatches

### Fix Strategy

#### Step 1: Replace div→Box (Bulk Fix - 1 hour)

**For each of the 4 components:**

1. **Find all div elements with sx props:**
   ```bash
   grep -n '<div sx={{' frontend/src/components/features/opportunities/CareerGrowthHub.tsx
   ```

2. **Replace each `<div sx={{` with `<Box sx={{`**
   - Use surgical find-replace (not regex bulk)
   - Each replacement must be validated
   - Keep track of matched pairs

3. **Replace closing `</div>` with `</Box>`**
   - Only where corresponding opening tag was replaced
   - Verify nesting is correct
   - Use block context to avoid replacing regular divs

**Expected Changes:**
- CareerGrowthHub.tsx: ~150 div→Box replacements
- CareerIntelligence.tsx: ~80 div→Box replacements
- FilterPanel.tsx: ~20 div→Box replacements
- InterviewPrep.tsx: ~70 div→Box replacements
- **Total: ~320 replacements**

#### Step 2: Fix Test Assertions (30 min)

Update test expectations to match actual component output:

**CareerGrowthHub.test.tsx:**
- Test: "renders the component with all main sections"
  - Update text queries to match actual component rendering
  - May need to check component source for exact text

**CareerIntelligence.test.tsx:**
- "renders the component with skill gap analysis"
  - Verify component renders "Career Intelligence" and "Skill Gap Analysis" sections
  - May need to update text selectors

**FilterPanel.test.tsx:**
- "renders the filter panel with all filter sections"
  - Verify all filter sections render correctly
  - May need to adjust selectors for dynamically rendered content

**InterviewPrep.test.tsx:**
- "renders the interview preparation interface"
  - Verify all question categories render
  - Check for async state updates (may need waitFor)

**Approach:**
1. Run tests individually and examine failure output
2. Check actual component to see what text/elements are rendered
3. Update test assertions to match reality
4. Do NOT change component implementations
5. Add `await waitFor()` where needed for async state

#### Step 3: Validate Day 1 (30 min)

```bash
npm test -- CareerGrowthHub CareerIntelligence FilterPanel InterviewPrep --passWithNoTests --no-coverage
```

**Target:** 18+/22 tests passing (85%+)

**If not met:**
- Document failures
- Review component source to understand rendering
- Update remaining assertions
- Re-run tests

### Day 1 Deliverable

**Handover Report:** `.ai_reports/Day1_Completion_Report.md`

```markdown
# Week 2 Day 1 - Completion Report

**Status:** ✅ COMPLETE

## Components Fixed
- CareerGrowthHub.tsx: X/6 tests passing
- CareerIntelligence.tsx: X/4 tests passing
- FilterPanel.tsx: X/6 tests passing
- InterviewPrep.tsx: X/6 tests passing
- **Total: X/22 tests passing (X%)**

## Changes Made
- div→Box replacements: X instances
- Test assertion updates: Y files
- Import additions: Z

## Test Results
- Pass rate: X%
- Failures remaining: X tests
- Blocker status: [If any remaining, describe]

## Ready for Days 2-5: YES / NO
```

---

## Part 2: Generate Days 2-5 Tests (16 components)

### Day 2: JobCard, JobInput, Dashboard, Settings (4 components)

**Task:** Generate comprehensive Jest tests for 4 job/dashboard components

**Components:**
- JobCard.tsx (frontend/src/components/features/opportunities/JobCard.tsx)
- JobInput.tsx (frontend/src/components/features/opportunities/JobInput.tsx)
- Dashboard.tsx (frontend/src/components/features/dashboard/Dashboard.tsx)
- Settings.tsx (frontend/src/components/features/dashboard/Settings.tsx)

**Instructions:**
1. Examine each component source code FIRST
2. Create `.test.tsx` file for each component
3. Generate 15-20 comprehensive tests per component
4. Use Jest framework (jest.fn(), jest.clearAllMocks())
5. Test: render, user interactions, state changes, conditional rendering
6. Reference existing tests (CareerGrowthHub.test.tsx, etc.) for patterns
7. Run tests immediately: `npm test -- JobCard JobInput Dashboard Settings --passWithNoTests --no-coverage`
8. Target: 85%+ pass rate (14-16/16+ tests passing)

**Report:** `.ai_reports/Day2_Completion_Report.md`

---

### Day 3: DashboardHeader, DashboardStats, ATSAnalysisDashboard, ATSScoreCircle

**Task:** Generate comprehensive Jest tests for 4 dashboard/analytics components

**Components:**
- DashboardHeader.tsx
- DashboardStats.tsx
- ATSAnalysisDashboard.tsx
- ATSScoreCircle.tsx

**Instructions:** (Same as Day 2)
- Examine → Create tests → Run → Validate 85%+
- 15-20 tests per component
- 60-80 total tests expected

**Report:** `.ai_reports/Day3_Completion_Report.md`

---

### Day 4: ActionCard, ErrorCard, LoadingCard, LoadingStates

**Task:** Generate comprehensive Jest tests for 4 card/state components

**Components:**
- ActionCard.tsx
- ErrorCard.tsx
- LoadingCard.tsx
- LoadingStates.tsx

**Instructions:** (Same as Days 2-3)
- 60-80 total tests expected
- Target: 85%+ pass rate

**Report:** `.ai_reports/Day4_Completion_Report.md`

---

### Day 5: ApplicationCard, JobSearch, TimelineView, StandardizedLoadingStates + 3 Common

**Task:** Generate comprehensive Jest tests for 7 common/feature components

**Components:**
- ApplicationCard.tsx
- JobSearch.tsx
- TimelineView.tsx
- StandardizedLoadingStates.tsx
- + 3 common components (TBD based on directory inspection)

**Instructions:**
- 15-20 tests per component
- 7 components = 105-140 tests expected
- Target: 85%+ pass rate

**Report:** `.ai_reports/Day5_Completion_Report.md`

---

## Critical Guidelines

### Framework Compliance
❌ **DO NOT** use Vitest imports (`vi.fn()`, `import { vi } from 'vitest'`)
✅ **ALWAYS** use Jest (`jest.fn()`, `jest.clearAllMocks()`)

### Component Inspection
❌ **DO NOT** assume component structure without reading source
✅ **ALWAYS** examine component source code FIRST
- Read component props
- Check rendered elements
- Understand state management
- Note any special setup (context, hooks, etc.)

### Test Quality
✅ 15-20 tests per component (comprehensive)
✅ Use React Testing Library best practices
✅ Test user interactions (fireEvent, userEvent)
✅ Test state changes and conditional rendering
✅ Include edge cases (empty states, errors, loading)
✅ Use `data-testid` for stable selectors

### Test Validation
✅ Run tests immediately after generation
✅ Fix any failing tests before committing
✅ Target: 85%+ pass rate per component
✅ Document any remaining issues

### Git Commits
✅ One commit per day (Days 1-5)
✅ Message format: `test: Add Week 2 Day X tests - [Component Names]`
✅ Clean commit history

---

## Execution Checklist

### Pre-Execution
- [ ] Read this entire document
- [ ] Verify Jest framework is configured (jest.config.mjs exists)
- [ ] Check test-utils.tsx for custom render function
- [ ] Review existing test examples (CareerGrowthHub.test.tsx, etc.)

### Day 1 Execution
- [ ] Replace div→Box in 4 components (~320 replacements)
- [ ] Fix test assertions to match actual output
- [ ] Run tests: `npm test -- CareerGrowthHub CareerIntelligence FilterPanel InterviewPrep`
- [ ] Achieve 85%+ pass rate (18+/22)
- [ ] Create Day 1 report
- [ ] Commit changes: `test: Complete Week 2 Day 1 fixes - 4 components, 22 tests`

### Days 2-5 Execution (Per Day)
- [ ] Examine component source code
- [ ] Create .test.tsx files
- [ ] Generate 15-20 tests per component
- [ ] Run tests immediately
- [ ] Fix any failures
- [ ] Achieve 85%+ pass rate
- [ ] Create day report
- [ ] Commit changes: `test: Add Week 2 Day X tests - [Components]`

### Final Validation
- [ ] All 5 daily reports created
- [ ] All 20 components tested
- [ ] 120-150 total tests generated
- [ ] 90%+ pass rate overall
- [ ] Clean git history (5 commits)
- [ ] Create final summary: `.ai_reports/WEEK2_FINAL_SUMMARY.md`

---

## Success Metrics

| Metric | Target | Pass/Fail |
|--------|--------|-----------|
| **Day 1 Pass Rate** | 85%+ (18+/22) | |
| **Days 2-5 Pass Rate** | 85%+ per day | |
| **Total Tests Generated** | 120-150 | |
| **Overall Pass Rate** | 90%+ | |
| **Components Tested** | 20/20 | |
| **Blocker Status** | None | |
| **Git Commits** | 5 clean commits | |
| **Reports Created** | 6 reports (1 per day + final) | |

---

## Expected Timeline

- **Day 1 Fixes:** 2 hours (div→Box + assertions)
- **Day 2 Tests:** 1 hour (4 components × 15-20 tests)
- **Day 3 Tests:** 1 hour (4 components × 15-20 tests)
- **Day 4 Tests:** 1 hour (4 components × 15-20 tests)
- **Day 5 Tests:** 1.5 hours (7 components × 15-20 tests)
- **Validation & Reports:** 0.5 hours

**Total: 6.5 hours (can be done in one focused session)**

---

## Handoff

When all work is complete:

1. ✅ Create final summary: `.ai_reports/WEEK2_FINAL_SUMMARY.md`
2. ✅ Verify all reports exist
3. ✅ Run final validation:
   ```bash
   npm test -- "Week2|CareerGrowthHub|CareerIntelligence|FilterPanel|InterviewPrep" --passWithNoTests --no-coverage
   ```
4. ✅ Confirm 90%+ pass rate
5. ✅ Notify: "Week 2 delegation complete - ready for review"

---

## Questions / Blockers

If you encounter issues:

1. **Component won't compile:** Check imports, verify Material-UI usage
2. **Tests fail to render:** Likely div→Box issue remains, examine error stack
3. **Test assertions fail:** Read component source to understand actual output
4. **Missing components:** Check directory structure, may be nested differently
5. **Type errors:** Ensure test props match component interface

Document blockers in daily reports - do NOT skip ahead.

---

**Ready to execute. Awaiting Cascade deployment.**
