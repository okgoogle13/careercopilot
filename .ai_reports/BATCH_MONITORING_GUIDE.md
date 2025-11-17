# Jules Batch Monitoring Guide

**Last Updated**: November 14, 2025
**All Batches Status**: 🟢 ACTIVE (8/8 launched)

---

## Quick Status Check

```bash
# Check all active sessions in one command
jules remote list --session | grep "Task:"
```

Expected output shows all 8 batches with their current status (Planning → Running → Completed).

---

## Session IDs & Quick Reference

```
Batch 1 (Dialog, Toast, etc):          7401566218163211110
Batch 2 (LoadingSpinner, etc):         10499767118039153100
Batch 3 (Sidebar, Navbar, etc):        6625318013602397669
Batch 4 (Card, Paper, etc):            424616855579134593
Batch 5 (Header, Footer, etc):         8518950822405525130
Batch 6 (Modal, Dropdown, etc):        829580184813013471
Batch 7 (FormGroup, etc):              11466121218442005560
Batch 8 (KSCGenerator, etc):           4291377980303646738
```

---

## Monitoring Commands

### 1. Check Current Status of All Batches
```bash
jules remote list --session
```
Look for "Status" column: Planning → Running → Completed

### 2. Monitor Specific Batch (Real-Time Logs)
```bash
# Example: Monitor Batch 1
jules remote logs --session 7401566218163211110 -f

# Example: Monitor Batch 4 (easiest, should complete quickly)
jules remote logs --session 424616855579134593 -f
```

### 3. Check When Batch is Complete
```bash
# A batch is complete when:
# - Status changes from "Planning/Running" to "Completed"
# - Last active timestamp updates
# - Report file appears in .ai_reports/

ls -lah ./.ai_reports/*_report.md
```

### 4. Pull Results When Batch Completes
```bash
# Once a batch shows "Completed" status:
jules remote pull --session [SESSION_ID]

# Example - Pull Batch 1 results:
jules remote pull --session 7401566218163211110
```

### 5. Watch All Reports Generate in Real-Time
```bash
# Terminal 1: Watch report files being created
watch -n 5 'ls -1 .ai_reports/*_report.md 2>/dev/null | wc -l'

# Terminal 2: View the reports as they complete
ls -lt .ai_reports/*_report.md | head -10
```

---

## Batch Completion Indicators

### ✅ Batch Complete When:
1. **Status Changes**: `Planning/Running` → `Completed` in `jules remote list --session`
2. **Report File Exists**: Check for `.ai_reports/[Component]_report.md`
3. **Report Contains Metrics**: File has test count and pass rate values

### 📊 Expected Completion Timeline
- **Batch 4** (Surface components): 5-10 min (simplest, highest pass rate expected)
- **Batches 1, 2**: 10-15 min (straightforward UI components)
- **Batches 3, 5, 6**: 15-25 min (context/routing/interactions required)
- **Batches 7, 8**: 20-30 min (forms and AI services complexity)
- **Full Completion**: 30-60 minutes for all 8 batches

---

## Report File Structure

Each batch report follows this format:

```markdown
# [Component] Status

**Result:** [SUCCESS/FAILURE]

**Files Modified:**
- ./frontend/src/components/ui/.../[Component].test.tsx
- ... (other files)

**Test Coverage:**
- [X] tests generated
- [Y]% pass rate

**Pending Actions:**
- [Next steps if any blockers]
```

### Validate Report Completion
```bash
# Check if report has all sections (should have 4 matches per report)
grep -c "^Result:\|^Files Modified:\|^Test Coverage:\|^Pending Actions:" .ai_reports/Dialog_report.md
```

---

## Aggregate Monitoring

### View All Batch Progress
```bash
# Count completed batches
ls .ai_reports/*_report.md 2>/dev/null | wc -l

# Show which batches are done
for f in .ai_reports/*_report.md; do echo "✅ $(basename $f)"; done

# Show which batches are pending
for batch in Dialog LoadingSpinner Sidebar Card Header Modal FormGroup KSCGenerator; do
  if [ ! -f ".ai_reports/${batch}_report.md" ]; then
    echo "⏳ $batch"
  fi
done
```

### Quick Metrics Summary
```bash
# Total tests generated across all completed batches
for f in .ai_reports/*_report.md; do
  grep "tests generated" "$f" | grep -oE "[0-9]+" | head -1
done | awk '{sum += $1} END {print "Total: " sum " tests"}'

# Average pass rate
for f in .ai_reports/*_report.md; do
  grep "pass rate" "$f" | grep -oE "[0-9]+%" | sed 's/%//g'
done | awk '{sum += $1; count++} END {printf "Average: %.1f%% pass rate\n", sum/count}'
```

---

## Troubleshooting

### If a batch is stuck in "Planning"
```bash
# Check logs for errors
jules remote logs --session [SESSION_ID] | tail -20

# Check if Jules service is responsive
jules remote list --session | head -1
```

### If a batch shows "Running" for >30 minutes
```bash
# Check last active time (should be recent)
jules remote list --session | grep [SESSION_ID]

# Check logs for progress/errors
jules remote logs --session [SESSION_ID] | tail -50
```

### If report file is missing after batch completes
```bash
# Manually pull the results
jules remote pull --session [SESSION_ID]

# Check if report was generated but with different name
ls -la .ai_reports/*.md | grep -i [component_name]
```

---

## Success Indicators

✅ **Batch is Successful When:**
- [ ] Status shows "Completed" in session list
- [ ] Report file exists in `.ai_reports/`
- [ ] Pass rate ≥ target for that batch
- [ ] No error messages in logs

✅ **Week 2 is Successful When:**
- [ ] All 8 batches show "Completed" status
- [ ] All 8 report files exist in `.ai_reports/`
- [ ] Weighted average pass rate ≥ 65%
- [ ] 500+ total tests generated
- [ ] 48 components tested

---

## Command Aliases for Faster Monitoring

Add these to your `.bashrc` or `.zshrc`:

```bash
# Check all Jules sessions
alias j-status="jules remote list --session"

# Monitor specific batch (usage: j-log 7401566218163211110)
j-log() {
  jules remote logs --session "$1" -f
}

# Count completed batches
alias j-count="ls .ai_reports/*_report.md 2>/dev/null | wc -l"

# Show completed vs pending
alias j-progress='echo "✅ Completed:"; ls -1 .ai_reports/*_report.md 2>/dev/null | wc -l; echo "⏳ Total: 8"'
```

---

## Real-Time Monitoring Dashboard

```bash
# Terminal command for live monitoring (updates every 5 seconds)
watch -n 5 -c 'echo "=== Jules Batch Status ===" && \
jules remote list --session | grep "Task:" | awk "{print \$2, \$4, \$NF}" | column -t && \
echo "" && echo "Completed Reports:" && \
ls -1 .ai_reports/*_report.md 2>/dev/null | wc -l && \
echo "/8"'
```

---

## Done! What's Next?

1. **Watch Batches Run**: Use monitoring commands above
2. **Pull Results**: Once each batch completes, pull results
3. **Validate Reports**: Check each report for metrics
4. **Fix Failures**: If any batch has low pass rate, document blockers
5. **Merge Results**: Combine all batch results into master coverage report

---

**Status**: 🟢 All 8 batches launched and monitoring active
**Last Check**: November 14, 2025
