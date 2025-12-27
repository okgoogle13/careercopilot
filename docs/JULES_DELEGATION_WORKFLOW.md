# Jules Delegation Workflow - Complete Reference

**Version**: 1.0
**Date**: November 14, 2025
**Status**: ✅ FULLY OPERATIONAL - All 8 batches launched

---

## Overview

This document provides the complete end-to-end workflow for delegating complex testing tasks to Jules, including:

1. **Task Preparation** - Creating Jules-compliant tasks
2. **Protocol Compliance** - Following the Jules Delegation Protocol
3. **Batch Launch** - Executing batches in parallel
4. **Monitoring & Results** - Tracking progress and collecting results
5. **Validation & Handoff** - Validating reports and passing results

---

## Part 1: Jules Autonomous Delegation Standard (JADS) v1.0

This standard defines the **non-negotiable input requirements** for task delegation to the autonomous Jules agent. Compliance ensures transparent planning, test validation, and successful, auditable task completion.

### 1.1 🎯 Task Execution Rules (Non-Negotiable)

| ID     | Rule                   | Description                                                                                                                                     |
| :----- | :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| **R1** | **Asynchronous Mode**  | All tasks are assumed to run in **asynchronous, autonomous mode**. No real-time interaction is expected during execution (use MCP for that).    |
| **R2** | **Relative Paths**     | All file references in the `SCOPE_AND_TESTS` block **MUST** use relative paths (starting with `./`).                                            |
| **R3** | **Single Line Format** | The task command **MUST** be written on a single continuous line for script compatibility.                                                      |
| **R4** | **Plan Approval Hook** | The task is **defaulted to require human approval** of the generated plan unless the `AUTO_APPROVE` flag is explicitly included in the command. |

### 1.2 📝 Structured Task Command Format

The task line uses four mandatory, colon-separated blocks to ensure clarity and full context.

**Template (Single Line):**

```
JADS_TASK: [CONTEXT] : [GOAL] : [SCOPE_AND_TESTS] : [OUTPUT_REPORT]
```

**Block Details:**

| Block               | Purpose                                       | Mandatory Contents                                                            | Example                                                                  |
| :------------------ | :-------------------------------------------- | :---------------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| **CONTEXT**         | **Why** the task is needed (business reason). | Must reference a **unique ID** (e.g., GitHub Issue ID, JIRA ticket).          | `ISSUE_1234: Bugfix for null pointer`                                    |
| **GOAL**            | **What** the final outcome must be.           | Must specify the **exact functional change** expected.                        | `Implement JWT token refresh logic and pass all existing tests.`         |
| **SCOPE_AND_TESTS** | **Where** to focus and **How** to validate.   | A list of files/directories to examine, plus the **test validation command**. | `SCOPE: ./auth/ \| TEST: Run 'npm test' in auth dir.`                    |
| **OUTPUT_REPORT**   | **Audit requirement** for history.            | A mandatory instruction for the final report file location.                   | `REPORT: Generate detailed markdown to /.ai_reports/Task_1234_report.md` |

### 1.3 🛠️ Operational Workflow

This section details how to execute the JADS tasks using the command line interface (CLI).

| Step               | Command/Action                                                                                                                                                                                                                                                                                                   | Notes                                                                                                              |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **Batch Launch**   | `bash -c 'grep "^JADS_TASK:" jads_tasks.txt \| while IFS= read -r line; do jules remote new --repo . --session "$line"; done'`                                                                                                                                                                                   | Launches all JADS-compliant tasks in batch mode.                                                                   |
| **Monitoring**     | `jules remote list --session \| awk '/^JADS_TASK:/ {session_id = $2; status = $4; full_prompt = ""; for (i = 5; i <= NF; i++) full_prompt = full_prompt $i " "; if (match(full_prompt, /REPORT: ([^ ]+)/, arr)) { print session_id, status, arr[1] } else { print session_id, status, "REPORT_PATH_UNKNOWN" }}'` | Extracts the **Session ID**, **Status**, and the final **Report Path** for easy human/script review.               |
| **Plan Approval**  | `jules task approve --id=task_abc123`                                                                                                                                                                                                                                                                            | **MANDATORY** action to approve the plan posted by Jules before execution begins (unless `AUTO_APPROVE` was used). |
| **Status Details** | `jules task status --id=task_abc123`                                                                                                                                                                                                                                                                             | Use to inspect the detailed status, logs, and execution plan of a single task.                                     |

### 1.4 Legacy Format Support

The previous `Task:` format is deprecated but still supported for backward compatibility. New tasks should use the `JADS_TASK:` format exclusively.

---

## Part 2: Protocol Compliance Checklist

Before launching batches, verify:

- [ ] **All paths are relative** (start with `./frontend/src/...`)
- [ ] **Each task is a single line** (no newlines within task)
- [ ] **Handover hook is present** (each task ends with report file instruction)
- [ ] **Report structure is exact** (# Component Status, **Result:**, **Files Modified:**, **Test Coverage:**, **Pending Actions:**)
- [ ] **File path in hook matches Batch** (Dialog_report.md for Dialog batch, etc.)
- [ ] **Expected pass rates are reasonable** (85%+ for simple, 50%+ for complex)
- [ ] **All components listed** (complete component names, not abbreviated)

### Validation Script

```bash
# Count tasks that are properly formatted
grep "^JADS_TASK:" jads_tasks.txt | wc -l

# Verify all paths are relative (should be 0 absolute paths)
grep "^JADS_TASK:" jads_tasks.txt | grep -c "/Applications" || echo "✅ All paths relative"

# Verify all tasks are single-line (should match task count)
grep "^JADS_TASK:" jads_tasks.txt | wc -l
```

---

## Part 3: Batch Launch

### 3.1 Fixed Launch Command

**JADS v1.0 Command**:

```bash
bash -c 'grep "^JADS_TASK:" jads_tasks.txt | while IFS= read -r line; do jules remote new --repo . --session "$line"; done'
```

**Or simplified** (if using plain bash):

```bash
cat jads_tasks.txt | while IFS= read -r line; do
  [ "$line" != "${line#JADS_TASK:}" ] && jules remote new --repo . --session "$line"
done
```

### 3.2 Launch Verification

After launching, verify all sessions exist:

```bash
# Should show 8 sessions with "Planning" status
jules remote list --session | grep "^.*JADS_TASK:" | wc -l
```

### 3.3 Session IDs (Week 2 Launch)

```
Batch 1: 7401566218163211110     (Dialog, Toast, etc)
Batch 2: 10499767118039153100    (LoadingSpinner, etc)
Batch 3: 6625318013602397669     (Sidebar, Navbar, etc)
Batch 4: 424616855579134593      (Card, Paper, etc - EASIEST)
Batch 5: 8518950822405525130     (Header, Footer, etc)
Batch 6: 829580184813013471      (Modal, Dropdown, etc)
Batch 7: 11466121218442005560    (FormGroup, etc)
Batch 8: 4291377980303646738     (KSCGenerator, etc - HARDEST)
```

---

## Part 4: Monitoring & Progress Tracking

### 4.1 Status Commands

```bash
# Check all batches in one command
jules remote list --session | grep "JADS_TASK:" | awk '{print $2, $4, $NF}'

# Monitor specific batch logs (real-time)
jules remote logs --session 7401566218163211110 -f

# Count completed batches
ls .ai_reports/*_report.md 2>/dev/null | wc -l
```

### 4.2 Status Transitions

```
Launch (t=0s)     → Planning (next 5-10 min) → Running (30-60 min) → Completed
         ↓                    ↓                        ↓                    ↓
    Created          Queued for Jules        Actively generating    Results ready
                     (minimal activity)      tests & validating     (pull available)
```

### 4.3 Batch Ordering by Complexity & Speed

**Fastest to Slowest**:

1. **Batch 4** (Card, Paper, etc) - 5-10 min (simplest, highest pass rate)
2. **Batch 1** (Dialog, Toast, etc) - 10-15 min
3. **Batch 2** (LoadingSpinner, etc) - 10-15 min
4. **Batch 5** (Header, Footer, etc) - 15-20 min (context mocking)
5. **Batch 3** (Sidebar, Navbar, etc) - 15-20 min (routing)
6. **Batch 6** (Modal, Dropdown, etc) - 20-25 min (complex interactions)
7. **Batch 7** (FormGroup, etc) - 20-25 min (form logic)
8. **Batch 8** (KSCGenerator, etc) - 25-30 min (AI service mocking - HARDEST)

**Expected Total Time**: 30-60 minutes for all 8 batches (parallel execution)

---

## Part 5: Results Collection

### 5.1 Report File Locations

```
./.ai_reports/Dialog_report.md              (Batch 1)
./.ai_reports/LoadingSpinner_report.md      (Batch 2)
./.ai_reports/Sidebar_report.md             (Batch 3)
./.ai_reports/Card_report.md                (Batch 4)
./.ai_reports/Header_report.md              (Batch 5)
./.ai_reports/Modal_report.md               (Batch 6)
./.ai_reports/FormGroup_report.md           (Batch 7)
./.ai_reports/KSCGenerator_report.md        (Batch 8)
```

### 5.2 Validate Report Structure

Each report must contain:

```markdown
# [Component] Status

**Result:** [SUCCESS/FAILURE]

**Files Modified:**
./frontend/src/components/.../[Component].test.tsx
[... other files]

**Test Coverage:**
[X] tests generated, [Y]% pass rate

**Pending Actions:**
[Any blockers or next steps]
```

### 5.3 Pull Results When Batch Completes

```bash
# Once batch status = "Completed", pull results
jules remote pull --session 7401566218163211110

# This writes the report file to .ai_reports/
```

---

## Part 6: Validation & Metrics

### 6.1 Success Criteria

**Per Batch**:

- [ ] Report file exists
- [ ] Result = SUCCESS
- [ ] Test count ≥ 90 (15×6 components minimum)
- [ ] Pass rate ≥ batch target
- [ ] All relative paths in report

**Overall (Week 2)**:

- [ ] All 8 batches completed
- [ ] All 8 report files exist
- [ ] Total tests ≥ 720 (8 batches × 90 tests)
- [ ] Average pass rate ≥ 65%
- [ ] 48 total components tested (6-7 per batch)

### 6.2 Extract Metrics

```bash
# Count total tests across all reports
for f in .ai_reports/*_report.md; do
  grep -oE "[0-9]+ tests" "$f"
done | awk '{sum += $1} END {print "Total: " sum}'

# Extract all pass rates
for f in .ai_reports/*_report.md; do
  echo "$(basename $f): $(grep -oE '[0-9]+%' $f | tail -1)"
done

# Calculate weighted average
for f in .ai_reports/*_report.md; do
  grep -oE '[0-9]+%' "$f" | sed 's/%//' | tail -1
done | awk '{sum += $1; count++} END {printf "Avg: %.1f%%\n", sum/count}'
```

### 6.3 Expected Results (Week 2)

| Metric            | Expected | Range                  | Notes                  |
| ----------------- | -------- | ---------------------- | ---------------------- |
| Total Tests       | 900      | 720-1,200              | 15-25 per component    |
| Total Components  | 48       | 42-54                  | 6-7 per batch          |
| Avg Pass Rate     | 68%      | 50%-85%                | Weighted by complexity |
| Batch 1 Pass Rate | 80%+     | Feedback components    |
| Batch 2 Pass Rate | 70%+     | Loading components     |
| Batch 3 Pass Rate | 65%+     | Navigation (routing)   |
| Batch 4 Pass Rate | 85%+     | Surfaces (simplest)    |
| Batch 5 Pass Rate | 70%+     | Common (context)       |
| Batch 6 Pass Rate | 65%+     | Library (interactions) |
| Batch 7 Pass Rate | 60%+     | Forms (complex logic)  |
| Batch 8 Pass Rate | 50%+     | Career (AI mocking)    |

---

## Part 7: Troubleshooting

### Issue: Batch stuck in "Planning" for >5 minutes

**Diagnosis**:

```bash
# Check if Jules is responsive
jules remote list --session | head -3

# Check batch logs for errors
jules remote logs --session [SESSION_ID] | tail -20
```

**Solution**:

```bash
# Cancel stuck batch
jules remote cancel --session [SESSION_ID]

# Re-launch specific batch
jules remote new --repo . --session "[Task line from tasks.txt]"
```

### Issue: Very low pass rate (<50%) on batch

**Diagnosis**:

```bash
# Check batch report for specific failures
cat .ai_reports/[Component]_report.md | grep -A 5 "Pending Actions"

# Check batch logs for error patterns
jules remote logs --session [SESSION_ID] | grep -i error
```

**Resolution**:

- Document blockers in report's Pending Actions
- Plan targeted fixes for Week 2 refinement
- Move forward with next batch (parallel approach)

### Issue: Report file missing but batch shows "Completed"

**Diagnosis**:

```bash
# Verify batch is truly complete
jules remote list --session | grep [SESSION_ID]

# Check if pull worked
jules remote pull --session [SESSION_ID]
```

**Solution**:

- Manually create report file based on batch logs
- Extract test count from batch output
- Manually calculate pass rate if needed
- Document as "Manual Report - Metrics from Logs"

---

## Part 8: Post-Launch Activities

### 8.1 Real-Time Monitoring (During Execution)

```bash
# Terminal 1: Watch batch status
watch -n 5 "jules remote list --session | grep 'Task:' | awk '{print \$2, \$4, \$NF}'"

# Terminal 2: Watch reports being created
watch -n 3 "ls -1 .ai_reports/*_report.md | wc -l"

# Terminal 3: Monitor specific batch logs
jules remote logs --session 424616855579134593 -f  # Batch 4 (fastest)
```

### 8.2 Result Collection (As Batches Complete)

```bash
# Check every 10 minutes for new completions
watch -n 600 "ls -lt .ai_reports/*_report.md | head -3"

# Or use cron for automated pulls
# Add to crontab: */5 * * * * cd /path/to/repo && jules remote pull --session [ID] 2>/dev/null
```

### 8.3 Final Validation (After All Complete)

```bash
# Run validation checklist
echo "✅ Checking completion..."
echo "Completed batches: $(ls .ai_reports/*_report.md 2>/dev/null | wc -l) / 8"
echo "Total tests: $(for f in .ai_reports/*_report.md; do grep -oE '[0-9]+ tests' $f; done | awk '{s+=$1} END {print s}')"
echo "Average pass rate: $(for f in .ai_reports/*_report.md; do grep -oE '[0-9]+%' $f | tail -1; done | sed 's/%//' | awk '{s+=$1; c++} END {printf "%.1f%%\n", s/c}')"
```

---

## Part 9: Documentation Requirements

Files that must exist after completion:

```
CLAUDE.md                                  (Protocol & Launch commands)
tasks.txt                                  (Original task specifications)
.ai_reports/JULES_BATCH_LAUNCH_SUMMARY.md (Launch status & metrics)
.ai_reports/BATCH_MONITORING_GUIDE.md     (How to monitor)
.ai_reports/JULES_DELEGATION_WORKFLOW.md  (This file)
.ai_reports/Dialog_report.md               (Batch 1 results)
.ai_reports/LoadingSpinner_report.md       (Batch 2 results)
.ai_reports/Sidebar_report.md              (Batch 3 results)
.ai_reports/Card_report.md                 (Batch 4 results)
.ai_reports/Header_report.md               (Batch 5 results)
.ai_reports/Modal_report.md                (Batch 6 results)
.ai_reports/FormGroup_report.md            (Batch 7 results)
.ai_reports/KSCGenerator_report.md         (Batch 8 results)
```

---

## Part 10: Next Workflow Executions

For future Jules delegations:

1. **Prepare Task**: Follow single-line format from Part 1
2. **Add to tasks.txt**: One task per line, all matching Protocol
3. **Launch Command**: Use corrected syntax from Part 3
4. **Monitor**: Use commands from Part 4
5. **Collect**: Pull results when status = Completed
6. **Validate**: Check pass rates against targets in Part 6
7. **Document**: Create summary report matching Part 9

---

## Summary

**Jules Delegation Workflow**: Prepare → Comply → Launch → Monitor → Collect → Validate

**Current Status**: ✅ All 8 batches launched, active, monitoring live

**Next Action**: Use commands from Part 4 to track progress as batches complete

**Expected Completion**: 30-60 minutes (all batches parallel)

**Documentation**: All guides available in `.ai_reports/` directory

---

**Reference**:

- Jules Protocol: `CLAUDE.md` lines 575-643
- Launch Commands: `CLAUDE.md` lines 645-688
- Monitoring Guide: `.ai_reports/BATCH_MONITORING_GUIDE.md`
- This Workflow: `.ai_reports/JULES_DELEGATION_WORKFLOW.md`

**Version History**:

- v1.0 (Nov 14, 2025): Initial comprehensive workflow documentation
