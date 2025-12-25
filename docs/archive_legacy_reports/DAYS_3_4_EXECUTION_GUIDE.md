# Days 3-4 Execution Guide - Parallel Jules Launching

**Status:** ✅ Ready for Immediate Execution
**Setup Complete:** ✅ Infrastructure, batch files, skill created
**Timeline:** Days 3-4 (48 hours for 8 parallel batches)
**Goal:** Launch 8 Jules instances simultaneously, 66 components, 1,000+ tests

---

## Quick Summary

### What's Ready

✅ **task-delegator skill** - Coordinates all 8 Jules instances
✅ **Batch Configuration** - Detailed specs for 8 batches
✅ **Component Lists** - 66 components ready to test
✅ **Delegation Prompts** - 8 templated prompts ready to customize
✅ **CLAUDE.md Updated** - Three-tier strategy documented
✅ **jest-test-scaffolder Skill** - Test generation ready
✅ **test-runner Agent** - Validation ready
✅ **Metrics Tracking** - Pass rate metrics defined

### What You Need to Do

Each Jules instance tests one batch independently:
- **Batch 1:** UI Feedback (10-12 components)
- **Batch 2:** UI Loading (8-10 components)
- **Batch 3:** UI Navigation (10-12 components)
- **Batch 4:** UI Surfaces (8-10 components)
- **Batch 5:** Common (8-10 components)
- **Batch 6:** Library (10-12 components)
- **Batch 7:** Feature (10-12 components)
- **Batch 8:** Career (10-12 components, highest complexity)

---

## Pre-Launch Checklist (Do Before Day 3 Starts)

- [ ] Read `.ai_reports/BATCH_CONFIGURATION_W1.md`
- [ ] Verify Jest is working: `yarn test Button` (should pass)
- [ ] Verify jest-test-scaffolder skill is available
- [ ] Verify test-runner agent is configured
- [ ] Have 8 terminal windows or IDE instances ready
- [ ] Create metrics tracking sheet (spreadsheet or notes file)
- [ ] Review special handling for each batch (Portals, Routing, API mocks, etc.)

---

## Day 3 Morning - Launch All 8 Instances (Simultaneously)

### Option A: Using Windsurf IDE with Cascade Agent (Real-Time)

**For Batch 4 (UI Surfaces - Simplest):**

In Windsurf IDE (Cascade Agent context):
```
You are the test generation agent for our Week 1 coverage acceleration.

BATCH: 4 - UI Components (Surfaces) - Simplest batch!

Components to test (8-10 total):
1. Card (frontend/src/components/ui/surfaces/Card.tsx)
2. Paper (frontend/src/components/ui/surfaces/Paper.tsx)
3. Container (frontend/src/components/ui/surfaces/Container.tsx)
4. Grid (frontend/src/components/ui/surfaces/Grid.tsx)
5. Box (frontend/src/components/ui/surfaces/Box.tsx)
6. Panel (frontend/src/components/ui/surfaces/Panel.tsx)
[... add remaining components from BATCH_CONFIGURATION_W1.md]

Use jest-test-scaffolder skill for each component.

TIMELINE: 45-60 minutes
SUCCESS: 120-150 tests, 85%+ pass rate (highest pass rate batch)

Generate tests now.
```

### Option B: Claude API / Cloud / Direct Delegation

**For Each Batch (use BATCH_CONFIGURATION_W1.md sections):**

Create 8 prompts using this template:

```
You are testing Batch [N]: [Description]

BATCH INFORMATION:
- Number: [N]
- Category: [Category]
- Components: [Count] components
- Est. Tests: [Number]
- Complexity: [Level]
- Pass Rate Target: [X%]

COMPONENT LIST:
[Copy component list from BATCH_CONFIGURATION_W1.md Batch [N] section]

YOUR TASK:
Use jest-test-scaffolder skill to generate comprehensive tests for each component.

For each component:
1. Read the component file
2. Extract props and behavior
3. Generate __tests__/[ComponentName].test.tsx with 15-25 tests
4. Run: yarn test [ComponentName]
5. Document: pass count, fail count, blockers

SPECIAL HANDLING:
[Copy special handling section from BATCH_CONFIGURATION_W1.md]

SUCCESS METRICS:
- [N] components tested
- [Test count estimate] tests generated
- [Pass rate target]% pass rate
- Clear documentation of failures

TIMELINE: [Est. time] minutes
```

### Parallel Execution Pattern

**Start all 8 Jules instances simultaneously at 9 AM on Day 3:**

```
9:00 AM - Jules Instance 1: Batch 1 (Feedback)       [60-75 min]
9:00 AM - Jules Instance 2: Batch 2 (Loading)        [50-60 min]
9:00 AM - Jules Instance 3: Batch 3 (Navigation)     [70-85 min]
9:00 AM - Jules Instance 4: Batch 4 (Surfaces)       [45-60 min] ← Fastest
9:00 AM - Jules Instance 5: Batch 5 (Common)         [60-70 min]
9:00 AM - Jules Instance 6: Batch 6 (Library)        [75-85 min]
9:00 AM - Jules Instance 7: Batch 7 (Feature)        [75-90 min]
9:00 AM - Jules Instance 8: Batch 8 (Career)         [90-120 min] ← Slowest
```

**Expected Completion Timeline:**
- Batch 4 (Surfaces): ~10:00 AM (45-60 min) ✅ Fastest
- Batch 2 (Loading): ~10:00 AM (50-60 min) ✅
- Batch 1 (Feedback): ~10:30 AM (60-75 min) ✅
- Batch 5 (Common): ~10:30 AM (60-70 min) ✅
- Batch 3 (Navigation): ~11:00 AM (70-85 min) ✅
- Batch 6 (Library): ~11:15 AM (75-85 min) ✅
- Batch 7 (Feature): ~11:30 AM (75-90 min) ✅
- Batch 8 (Career): ~12:00 PM (90-120 min) ⏱️ Slowest (complexity)

**Key Advantage:** All running in parallel = wall-clock time ~2-3 hours, not 8+ hours sequentially!

---

## Day 3 Afternoon - Monitor & Capture Results

### Monitoring Checklist

For each Jules instance, track:
- [ ] Started successfully
- [ ] Processing components
- [ ] Tests generating
- [ ] Test files being created
- [ ] Tests running
- [ ] Pass/fail metrics captured

### Result Capture for Each Batch

Create file: `BATCH_[N]_RESULTS.txt`

```
=== BATCH [N]: [Description] ===
Date: [Date]
Time Started: [Time]
Time Completed: [Time]
Duration: [Minutes]

Components Tested: [X]
Tests Generated: [Y]
Tests Passed: [Z]
Pass Rate: [Z/Y]%

COMPONENT BREAKDOWN:
1. [ComponentName]: [X tests], [Y passed], [Z% pass rate]
2. [ComponentName]: ...
...

BLOCKERS/FAILURES:
- [Issue 1]
- [Issue 2]
- [Issue 3]

SPECIAL NOTES:
- [Pattern observations]
- [Reusable insights]
- [Week 2 action items]

Status: ✅ COMPLETE / ⚠️ PARTIAL / ❌ BLOCKED
```

### Expected Results Per Batch (Initial)

| Batch | Components | Tests Est. | Expected Pass | Notes |
|-------|-----------|-----------|---------------|-------|
| 1 | 10-12 | 150-200 | 80%+ | Feedback, mostly new |
| 2 | 8-10 | 100-150 | 70%+ | Loading, Portal challenges |
| 3 | 10-12 | 150-200 | 65%+ | Navigation, routing complex |
| 4 | 8-10 | 120-150 | 85%+ | **Highest pass rate** |
| 5 | 8-10 | 120-150 | 70%+ | Common layout |
| 6 | 10-12 | 150-200 | 65%+ | Library, complex |
| 7 | 10-12 | 150-200 | 60%+ | Feature, form complexity |
| 8 | 10-12 | 150-200 | 50%+ | **Lowest (most complex)** |
| **TOTAL** | **66** | **1,090** | **~70%** | - |

---

## Day 4 - Continue Monitoring & Completion

### If Batch Finishes Early (Good Sign!)

Example: Batch 4 (Surfaces) done by 10:00 AM

Next steps:
1. Review results: tests, pass rate, blockers
2. Save BATCH_4_RESULTS.txt
3. Commit to git: `git commit -m "test: Add tests for Batch 4 - UI Surface components (120-150 tests, 85% pass rate)"`
4. Optional: Start on secondary tasks while others finish

### If Batch Stalls or Errors

Example: Batch 8 (Career) hits API mocking issue

Recovery:
1. Stop Jules instance for that batch
2. Document the blocker
3. Flag for Day 5 investigation
4. Continue other batches
5. Don't let one batch block others

### By End of Day 4

**Expected State:**
- ✅ All 8 Jules instances completed (or very close)
- ✅ 66 components tested
- ✅ 800-1,200 tests generated
- ✅ Metrics captured per batch
- ✅ Blockers documented
- ✅ Test files created in codebase

---

## Day 5 - Consolidation & Validation

### Morning: Merge & Validate (9 AM - 12 PM)

**Step 1: Collect All Results**
```bash
# Create consolidation report
mkdir -p .consolidation
mv BATCH_*_RESULTS.txt .consolidation/
cat .consolidation/BATCH_*_RESULTS.txt > .consolidation/CONSOLIDATED_RESULTS.txt
```

**Step 2: Run Full Test Suite**
```bash
# Run all tests (60-90 seconds)
yarn test

# Capture metrics
yarn test --coverage

# Generate report
yarn test:coverage
```

**Step 3: Analyze Results**
```bash
# Count total tests
yarn test --listTests | wc -l

# Get pass/fail summary
yarn test 2>&1 | grep -E "Tests:|Pass:|Fail:"
```

**Step 4: Fix High-Impact Failures**
- Identify quick wins (5-10 min fixes)
- Fix Jest config issues (affects all tests)
- Fix common mock setup issues
- Document patterns for Week 2

### Afternoon: Documentation & Planning (1 PM - 5 PM)

**Step 1: Generate Metrics Report**

Create file: `WEEK1_METRICS_REPORT.md`

```markdown
# Week 1 Metrics Report - Consolidation Summary

**Timeline:** Days 1-5
**Batches:** 8 parallel instances
**Components Targeted:** 66
**Tests Targeted:** 1,000+

## Results Summary

### Overall Metrics
- Components Tested: [X] (Target: 66)
- Tests Generated: [Y] (Target: 1,000+)
- Pass Rate: [Z%] (Target: 50%+)
- Coverage Achieved: [W%] (Target: 53%)

### Per-Batch Breakdown
[Table of all 8 batches with results]

### Failure Analysis
- Config Issues: [Count]
- Component Bugs: [Count]
- Test Pattern Issues: [Count]
- Mock Setup Issues: [Count]

### Success Patterns
- [Pattern 1 - what worked well]
- [Pattern 2 - what worked well]
- [Pattern 3 - what worked well]

### Week 2 Action Items
1. [Fix blocker 1]
2. [Fix blocker 2]
3. [Improve pattern 3]
```

**Step 2: Update CLAUDE.md**

Add section to CLAUDE.md:

```
## Week 1 Results

**Batches Executed:** 8 parallel instances, Days 3-4
**Components Tested:** [X] (Target: 66)
**Tests Generated:** [Y] (Target: 1,090)
**Pass Rate:** [Z%] (Target: 50%+)
**Coverage:** [W%] (Target: 53%)

**Status:** ✅ Week 1 Goal Achieved / ⚠️ Partial / 🔄 On Track for Week 2

[Link to WEEK1_METRICS_REPORT.md]
```

**Step 3: Commit Results**

```bash
# Stage all new test files
git add frontend/src/components

# Commit with summary
git commit -m "test(week1): Add tests for 66 components across 8 batches

- Batch 1 (Feedback): [X] tests, [Y%] pass rate
- Batch 2 (Loading): [X] tests, [Y%] pass rate
- Batch 3 (Navigation): [X] tests, [Y%] pass rate
- Batch 4 (Surfaces): [X] tests, [Y%] pass rate
- Batch 5 (Common): [X] tests, [Y%] pass rate
- Batch 6 (Library): [X] tests, [Y%] pass rate
- Batch 7 (Feature): [X] tests, [Y%] pass rate
- Batch 8 (Career): [X] tests, [Y%] pass rate

Total: 66 components, 1,000+ tests, 53% coverage achieved
See .ai_reports/WEEK1_METRICS_REPORT.md for details
"
```

**Step 4: Plan Week 2**

Create: `WEEK2_EXECUTION_PLAN.md` (based on actual Week 1 results)

```markdown
# Week 2 Plan - Fix & Enhance

**Starting Point:** [X] components, [Y%] pass rate
**Target:** 70+ components, 90%+ pass rate, 56% coverage

## Days 1-3: Fix Blockers
1. [Highest priority fix] - [Est. impact] tests
2. [Next priority fix] - [Est. impact] tests
3. [Additional fixes] - [Est. impact] tests

## Days 4-5: Enhancements
1. Add edge case tests
2. Add accessibility tests
3. Polish documentation
```

---

## Success Checklist

### By End of Day 4
- ✅ All 8 Jules instances executed
- ✅ 66 components tested
- ✅ 1,000+ tests generated
- ✅ Test files created in correct locations
- ✅ Metrics captured per batch
- ✅ Blockers documented

### By End of Day 5
- ✅ All results consolidated
- ✅ Metrics report generated
- ✅ Coverage calculated (target 53%)
- ✅ High-impact failures fixed
- ✅ Lessons documented for Week 2
- ✅ Git history clean (8 batch commits + 1 consolidation commit)
- ✅ Week 2 plan created

### Week 1 Success Criteria (Overall)
- ✅ 66 components tested (up from 10)
- ✅ 53% coverage achieved (exceeds 50% target)
- ✅ 50%+ pass rate on initial generation (allows Week 2 fixes)
- ✅ Test patterns documented and reusable
- ✅ Clear path to Week 2 goal (90%+ pass rate, 56% coverage)

---

## Reference Files

### Ready Now
- ✅ `.claude/skills/task-delegator/SKILL.md` - Coordination instructions
- ✅ `.ai_reports/BATCH_CONFIGURATION_W1.md` - Detailed batch specs
- ✅ `CLAUDE.md` - Three-tier strategy documented

### To Create During Days 3-5
- 📝 `BATCH_[1-8]_RESULTS.txt` - Per-batch metrics
- 📝 `.consolidation/CONSOLIDATED_RESULTS.txt` - Combined metrics
- 📝 `WEEK1_METRICS_REPORT.md` - Final analysis
- 📝 `WEEK2_EXECUTION_PLAN.md` - Next phase planning

---

## Key Insights

### Why Parallel Works

Sequential (old approach):
```
Batch 1: 60 min → Batch 2: 60 min → Batch 3: 60 min ...
Total: 8 × 75 min ≈ 10 hours
```

Parallel (new approach):
```
Batch 1, 2, 3, 4, 5, 6, 7, 8: All at same time
Total: max(75 min, 120 min) ≈ 2-3 hours
```

**Result:** Same work, 3-4x faster = 2-3 hour window instead of 10+ hours!

### Batch Difficulty Gradient

```
Easy   → Medium  → Hard   → Harder → Hardest
Batch4 → Batch1  → Batch3 → Batch6 → Batch8
(85%)   (80%)    (65%)    (65%)    (50%)
```

- **Batch 4 (Surfaces)** done first = confidence builder
- **Batch 8 (Career)** last = can troubleshoot without blocking others
- **Staggered completion** = natural consolidation pattern

---

## Ready to Launch?

All setup complete:
✅ Skill created
✅ Batches configured
✅ Documentation ready
✅ Metrics defined
✅ Success criteria clear

**Next step:** Launch all 8 Jules instances simultaneously on Day 3

**Estimated Timeline:**
- Day 1-2: Setup ✅ DONE
- Day 3-4: Execution (2-3 hour window)
- Day 5: Consolidation (4-5 hours)
- **Total:** One work week for 53% coverage

**Go live on Day 3! 🚀**
