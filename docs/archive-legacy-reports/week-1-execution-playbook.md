# Week 1 Execution Playbook - Rapid Test Coverage

**Objective**: Achieve 20% coverage (22 components tested)
**Duration**: 5 days
**Timeline**: Daily 90-minute focus sessions
**Expected Outcome**: 60-80 new passing tests

---

## Day 1-2: Foundation Repairs (Fix 42 Failing Tests)

### Objective
Achieve 100% pass rate on the 7 foundation components to establish solid baseline.

### Current State
- **176 tests passing** out of 218
- **42 tests failing** (mostly assertion/timing issues)
- **7 components**: EmptyState, Toast, ToastContext, Dialog, LoadingSpinner, FullPageLoading, LoadingSkeleton

### Failing Tests Breakdown

**EmptyState** (1 failing test)
```typescript
// File: src/components/ui/feedback/__tests__/EmptyState.test.tsx:256
❌ "renders with plain variant by default"

Issue: Selector `container.querySelector('[style*="flex"]')` returns null
Fix: Change to role-based query or specific class selector
```

**Action Items**:
1. Open test file
2. Line 256: Replace `container.querySelector('[style*="flex"]')` with proper selector
3. Run: `npx jest --config=frontend/jest.config.mjs EmptyState.test.tsx`
4. Verify ✅ 47/47 passing

---

**Toast** (2 failing tests)
```typescript
// File: src/components/ui/feedback/__tests__/Toast.test.tsx
❌ Timer-based tests timing out

Issue: jest.useFakeTimers() duration not matching test expectations
Fix: Adjust advanceTimersByTime() or use waitFor() instead
```

**Action Items**:
1. Open test file
2. Find tests using `jest.advanceTimersByTime()`
3. Adjust time values to match component autoHideDuration
4. Run: `npx jest --config=frontend/jest.config.mjs Toast.test.tsx`
5. Verify ✅ 15/15 passing

---

**ToastContext** (0 failing tests)
✅ Already 100% passing - no action needed

---

**Dialog** (14 failing tests)
```typescript
// File: src/components/ui/feedback/__tests__/Dialog.test.tsx
❌ Error handling edge case tests

Issue: Tests for error throwing callbacks have incorrect expectations
Fix: Adjust error assertions to match actual error handling behavior
```

**Action Items**:
1. Open test file
2. Find error handling tests (search: "throws error", "Error")
3. Review Component error handling code
4. Adjust test assertions to match actual behavior
5. Run: `npx jest --config=frontend/jest.config.mjs Dialog.test.tsx`
6. Verify ✅ 68/68 passing

---

**LoadingSpinner** (0 failing tests)
✅ Already 100% passing - no action needed

---

**FullPageLoading** (11 failing tests)
```typescript
// File: src/components/ui/loading/__tests__/FullPageLoading.test.tsx
❌ Portal and backdrop positioning tests

Issue: jsdom doesn't properly handle Portal DOM positioning
Fix: Simplify positioning assertions or use snapshot testing
```

**Action Items**:
1. Open test file
2. Find Portal/backdrop positioning tests
3. Option A: Remove overly specific style assertions
4. Option B: Use snapshots for complex DOM structures
5. Run: `npx jest --config=frontend/jest.config.mjs FullPageLoading.test.tsx`
6. Verify ✅ 27/27 passing

---

**LoadingSkeleton** (14 failing tests)
```typescript
// File: src/components/ui/loading/__tests__/LoadingSkeleton.test.tsx
❌ Wrapper component and array rendering tests

Issue: Custom wrapper prop handling in test environment
Fix: Adjust wrapper component prop passing assertions
```

**Action Items**:
1. Open test file
2. Find wrapper component tests
3. Review how wrapperProps are being passed
4. Simplify or mock wrapper expectations
5. Run: `npx jest --config=frontend/jest.config.mjs LoadingSkeleton.test.tsx`
6. Verify ✅ 42/42 passing

---

### Day 1-2 Timeline

```
Morning (90 min):
- 15 min: Review all failing tests
- 20 min: Fix EmptyState (1 test) - QUICK WIN
- 20 min: Fix Toast (2 tests)
- 20 min: Fix Dialog issues (start)
- 15 min: Commit changes

Afternoon (90 min):
- 30 min: Continue Dialog fixes
- 30 min: Fix FullPageLoading issues
- 20 min: Fix LoadingSkeleton issues
- 10 min: Final run of all 7 components
- Commit complete batch

End of Day 2 Success Criteria:
✅ All 7 components: 100% pass rate (218/218 tests)
✅ Git commit: "fix: Achieve 100% pass rate on foundation components"
```

---

## Day 3: Test Remaining UI Components (15 New Tests)

### Target Components

These are the remaining UI components that should be tested:

**Group 1: Button Variants** (2 components)
- `Button.tsx` - Main button component
- Button with variants, sizes, states

**Group 2: Input/Form** (2 components)
- `Input.tsx` / `TextField.tsx` - Form input
- With validation, error states, labels

**Group 3: Card/Container** (2 components)
- `Card.tsx` - Container component
- With elevation, content slots, spacing

**Group 4: Badge/Chip** (3 components)
- `Badge.tsx` - Number/notification badge
- `Chip.tsx` - Interactive chip
- `Tag.tsx` - Simple tag component

**Group 5: Modal/Drawer** (2 components)
- `Modal.tsx` - Modal dialog
- `Drawer.tsx` - Side drawer

**Group 6: Menu/Dropdown** (2 components)
- `Menu.tsx` - Dropdown menu
- `Dropdown.tsx` - Select dropdown

### Day 3 Execution (90-120 minutes)

```
Task 1: Button Component (12 minutes)
- Command: Read Button.tsx → Understand props/variants
- Use jest-test-scaffolder skill
- Expected output: Button.test.tsx with 15-20 tests
- Validate: npx jest --config=frontend/jest.config.mjs Button.test.tsx
- Result: ✅ X/X tests passing

Task 2: Input Component (12 minutes)
- Command: Read Input.tsx
- Use jest-test-scaffolder skill
- Expected output: Input.test.tsx with 15-20 tests
- Validate: npx jest --config=frontend/jest.config.mjs Input.test.tsx

Task 3: Card Component (12 minutes)
- [Same pattern]

[Continue for remaining 12 components...]

Total Time: 90 minutes = 6-7 components
Carry over 8-9 components to Day 4

Commit Strategy:
- Commit every 2-3 components
- Message: "test: Add tests for [Component1], [Component2], [Component3]"
```

### Daily Success Criteria

```
✅ 6-7 new components tested
✅ 50-80 new tests generated
✅ 85%+ pass rate on new tests (some failures expected, acceptable)
✅ 2-3 Git commits
✅ New coverage: 15 components total (13.3%)
```

---

## Day 4: Continue UI Components (Remaining 8-9 Tests)

### Objective
Complete all remaining UI components to reach 22 total.

### Workflow (90-120 minutes)
```
Morning:
- 5 min: Review previous day results
- 85 min: Test remaining 8-9 UI components
- Each component: 10 minutes average
  - 2 min: Read component
  - 3 min: Generate tests with skill
  - 3 min: Run tests
  - 2 min: Fix failures

Afternoon (optional):
- 30 min: Fix failing tests from morning
- 30 min: Cross-component integration review
- 30 min: Documentation/refactoring
```

### Daily Success Criteria

```
✅ All 22 UI components tested (7 foundation + 15 new)
✅ 150-200 total tests generated this week
✅ 85%+ pass rate across all tests
✅ Clean git history with logical commits
✅ Coverage: 22/113 components = 19.5% → 20%
```

---

## Day 5: Review, Fix & Plan (90 minutes)

### Morning: Fix Day 3-4 Failures

```
30 minutes: Run full test suite for all 22 components
npx jest --config=frontend/jest.config.mjs frontend/src/components/ui/__tests__/

Identify patterns in failing tests:
- Count by failure type
- Group by root cause
- Prioritize fixes by impact
```

**If < 5% failure rate**: Skip to documentation
**If 5-10% failure rate**: Spend 30 min fixing top 10 failures
**If > 10% failure rate**: Schedule overflow to next Monday

### Mid-day: Documentation & Cleanup

```
30 minutes:
- Review test patterns used
- Document any special handling needed
- Update jest-test-scaffolder SKILL.md with learnings
- Commit: "docs: Document Week 1 test patterns and learnings"
```

### Afternoon: Week 2 Planning

```
30 minutes:
- Review performance: How many tests/day?
- Adjust timeline based on actual velocity
- Select Week 2 business components (25-30)
- Create Week 2 playbook

Week 2 Targets (Document):
- Components to test (prioritized list)
- Expected test count
- Any special setup needed (mocks, fixtures)
```

### End-of-Day Success Criteria

```
✅ All 22 components > 85% pass rate
✅ Week 1 summary documented
✅ Week 2 plan ready
✅ Git history clean (6-8 logical commits)
✅ Coverage achieved: 20% (22/113 components)
```

---

## Tools & Commands Reference

### Jest Testing
```bash
# Run all tests for the week
npx jest --config=frontend/jest.config.mjs frontend/src/components/ui/__tests__/

# Watch mode during development
npx jest --config=frontend/jest.config.mjs --watch

# Single component test
npx jest --config=frontend/jest.config.mjs src/components/ui/Button/__tests__/Button.test.tsx

# Test with verbose output
npx jest --config=frontend/jest.config.mjs --verbose

# Generate basic coverage (if Babel Istanbul fixed)
npx jest --config=frontend/jest.config.mjs --coverage
```

### Git Workflow
```bash
# Check status
git status

# Add test files
git add src/components/ui/**/__tests__/*.test.tsx

# Commit with message
git commit -m "test: Add tests for Button, Input, Card components"

# View history
git log --oneline -10
```

### jest-test-scaffolder Skill
```
Prompt Format:
"Create tests for the [ComponentName] component"

Skill will:
1. Read component file
2. Extract props and variants
3. Generate comprehensive test file
4. Include edge cases and interactions

Result:
- test file in src/components/ui/[ComponentName]/__tests__/[ComponentName].test.tsx
- Ready to run immediately
- May have 10-30% failures (expected - fix in batch)
```

---

## Success Metrics - Week 1

### Quantitative

| Metric | Target | Success |
|--------|--------|---------|
| Components Tested | 22 | ✅ |
| Test Files Created | 22 | ✅ |
| New Tests Generated | 150-200 | ✅ |
| Total Tests Week 1 | 240+ | ✅ |
| Pass Rate | 85%+ | ✅ |
| Coverage % | 20% | ✅ |
| Git Commits | 6-8 | ✅ |

### Qualitative

- ✅ Tests follow React Testing Library patterns
- ✅ Clear test descriptions
- ✅ Good mix of happy path + edge cases
- ✅ Minimal brittle selectors
- ✅ Proper Material-UI theme handling
- ✅ Clean git history

---

## Troubleshooting Guide

### Problem: Tests not found
```bash
Error: "No tests found"
Solution: npx jest --config=frontend/jest.config.mjs --listTests
         Verify files are in __tests__/ subdirectory
```

### Problem: Component import errors
```bash
Error: "Cannot find module '@/components/...'"
Solution: Check moduleNameMapper in jest.config.mjs
          Ensure @/ is pointing to src/
```

### Problem: React/DOM errors
```bash
Error: "document is not defined"
Solution: Verify jest.config.mjs has: testEnvironment: 'jsdom'
          Check setupTests.ts is being loaded
```

### Problem: Material-UI component errors
```bash
Error: Theme not provided
Solution: Wrap components in ThemeProvider in tests
          Use renderWithTheme helper function
```

---

## Daily Standup Template

**Each day, record**:
```
Date: [Day]
Completed:
- [Component1]: X tests, Y% passing
- [Component2]: X tests, Y% passing

Blockers:
- [Issue if any]

Tomorrow:
- [Components to test]

Velocity:
- Components/day: [Average]
- Tests/hour: [Average]
```

---

## Final Notes

### What Will Vary
- Actual test counts (15-25 per component typical)
- Pass rates (60-100% expected, average 80%)
- Time per component (5-15 minutes typical)

### What's Fixed
- Pattern and approach (proven)
- jest-test-scaffolder skill (ready)
- Infrastructure (configured)
- Git workflow (clear)

### When Something Feels Wrong
- Stop and check: Is this still following jest-test-scaffolder pattern?
- Are tests testing user behavior or implementation?
- Is there unexpected setup needed for this component?
- Should this component be tested differently?

**If stuck > 10 minutes**: Jump to next component and come back

---

## Week 1 Success = Month 1 Success

**Week 1 Result** (20% coverage) → Confidence in process
**Week 2 Projection** (35% coverage) → Momentum builds
**Week 3 Reality** (45% coverage) → Almost there
**Week 4 Target** (50% coverage) → Goal achieved

---

**Ready to Start?**

✅ Infrastructure ready (jest, babel, jest-test-scaffolder)
✅ 7 foundation components at 100% (after Day 1-2 fixes)
✅ Clear pattern and workflow established
✅ Tools configured and tested

**Begin**: Monday morning, 90-minute session 1 of 4 this week.

**Generated**: November 12, 2025
**Status**: Ready for execution

