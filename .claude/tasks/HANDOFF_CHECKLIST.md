# ✅ Handoff Checklist - Ready to Send to Gemini 3 Pro

## Pre-Handoff Verification (Complete these before sending)

### 1. Git Status
- [ ] Working directory is clean: `git status`
- [ ] No uncommitted changes in component folders
- [ ] Main branch is current: `git log --oneline -1`
- [ ] Create backup branch: `git checkout -b backup/main`

### 2. Task Files Created
- [ ] `.claude/plans/component-migration-handover.md` exists (full strategy)
- [ ] `.claude/tasks/component-migration.json` exists (structured manifest)
- [ ] `.claude/tasks/GEMINI_HANDOVER_MANIFEST.md` exists (copy-paste prompt)
- [ ] `.claude/tasks/HANDOVER_SUMMARY.txt` exists (quick reference)
- [ ] `.claude/config/mcp-gemini-config.json` exists (MCP config)
- [ ] `.claude/tasks/HANDOFF_CHECKLIST.md` exists (this file)

### 3. MCP Servers Available
- [ ] Filesystem MCP accessible: `ls -la mcp-servers/`
- [ ] Git MCP accessible and initialized
- [ ] Testing MCP accessible and configured
- [ ] Node.js available: `node --version`

### 4. Token System Available
- [ ] Token system file exists: `frontend/src/design-tokens/kerala-rage-tokens.ts`
- [ ] Contains required exports:
  - [ ] ncFontDisplay
  - [ ] ncFontBody
  - [ ] ncColorBotanical
  - [ ] ncShapeOrganic
  - [ ] ncShadow*

### 5. Component Files Readable
- [ ] `frontend/src/components/inputs/Lens.tsx` readable
- [ ] `frontend/src/components/inputs/Mark.tsx` readable
- [ ] `frontend/src/components/inputs/Jar.tsx` readable
- [ ] `frontend/src/components/inputs/Valve.tsx` readable
- [ ] `frontend/src/components/feedback/Signal.tsx` readable
- [ ] `frontend/src/components/containers/Cabinet.tsx` readable

### 6. Tests Passing (Before Handoff)
- [ ] `npm test frontend/src/components/` passes 100%
- [ ] `npm run lint frontend/src/components/` passes
- [ ] No test warnings or errors

### 7. Duplicate Files Visible
Verify these files exist (Gemini will delete them):
- [ ] `frontend/src/components/core/Pebble 2.tsx`
- [ ] `frontend/src/components/core/Stone 2.tsx`
- [ ] `frontend/src/components/inputs/Jar 2.tsx`
- [ ] `frontend/src/components/inputs/Mark 2.tsx`
- [ ] `frontend/src/components/inputs/Valve 2.tsx`
- [ ] `frontend/src/components/inputs/Lens 2.tsx`
- [ ] `frontend/src/components/feedback/Signal 2.tsx`
- [ ] `frontend/src/components/content/Seed 2.tsx`
- [ ] `frontend/src/components/containers/Cabinet 2.tsx`
- [ ] `frontend/src/components/containers/Vessel 2.tsx`

## Handoff Process

### Step 1: Final Verification
```bash
# Check git status
git status

# Verify all task files exist
ls -la .claude/tasks/
ls -la .claude/plans/
ls -la .claude/config/

# Backup current state
git checkout -b backup/main

# Return to main
git checkout main
```

### Step 2: Send to Gemini 3 Pro
1. Open Antigravity IDE
2. Open MCP console (Gemini 3 Pro connection)
3. Copy entire content of: `.claude/tasks/GEMINI_HANDOVER_MANIFEST.md`
4. Paste into chat with Gemini 3 Pro
5. Add context message:

```
Here's a component migration task for autonomous execution via MCP.

Task manifest: .claude/tasks/component-migration.json
Full strategy: .claude/plans/component-migration-handover.md

Execute phases 1-3 autonomously. Report status after each phase.
Token budget: ~15K (optimized)
Expected duration: ~3 hours

No permission needed - proceed autonomously.
```

6. Press send
7. Monitor Gemini's progress in real-time

## During Execution (Monitor)

### Real-Time Status Checks
```bash
# Watch git commits being created
git log --oneline | head -20

# Watch test results
npm test frontend/src/components/ --watch

# Check for errors
git status  # Should be clean after each commit
```

### Expected Checkpoints

**Checkpoint 1 (30 min):**
- ✅ PHASE 1 COMPLETE
- 10 duplicate files deleted
- Pebble/Stone consolidated
- Message: "PHASE 1 CLEANUP COMPLETE"

**Checkpoint 2 (60 min):**
- ✅ LENS MIGRATED
- Tests passing
- Commit created
- Message: "LENS MIGRATION COMPLETE"

**Checkpoint 3 (90 min):**
- ✅ MARK, JAR, VALVE MIGRATED
- Tests passing for all 3
- Message: "MARK/JAR/VALVE MIGRATED"

**Checkpoint 4 (120 min):**
- ✅ SIGNAL, CABINET MIGRATED
- All 6 components done
- Message: "PHASE 2 MIGRATION COMPLETE"

**Checkpoint 5 (150 min):**
- ✅ PHASE 3 AUDIT COMPLETE
- Linting passed
- Tests passed (100%)
- Final metrics reported
- Message: "FINAL REPORT - 30% COMPLETION"

## After Execution Completes

### Immediate Actions
1. [ ] Pull latest changes: `git pull`
2. [ ] Verify commits locally: `git log --oneline | head -20`
3. [ ] Run full test suite: `npm test frontend/src/components/`
4. [ ] Run linting: `npm run lint frontend/src/components/`
5. [ ] Review commit messages: `git log --format="%h %s"`

### Quality Assurance
1. [ ] All 10 duplicates deleted (no *2.tsx files remain)
2. [ ] All 6 components migrated (Lens, Mark, Jar, Valve, Signal, Cabinet)
3. [ ] All tests passing (100%)
4. [ ] All linting passing
5. [ ] No broken imports: `npm test --no-coverage 2>&1 | grep -i "cannot find module"`

### Next Phase Setup
1. [ ] Create feature branch: `git checkout -b feature/component-migration-phase4`
2. [ ] Document results in commit: `git commit --allow-empty -m "Phase 2-3 completion: 6 components migrated, 30% overall"`
3. [ ] Create PR to main with Gemini's commits
4. [ ] Add PR description with metrics and next steps

### Phase 4 Planning (Claude Code)
After Gemini completes:
1. Run `kerala-rage-visual-audit` on 6 migrated components
2. Compare before/after visuals
3. Generate compliance report
4. Plan Phase 5 (secondary components) and Phase 6 (shared components)

## Rollback If Needed

If migration fails mid-way:

```bash
# Option 1: Return to safe state
git checkout backup/main

# Option 2: Revert specific commits
git revert <commit-sha>

# Option 3: Reset to before migration
git reset --hard <safe-commit-sha>

# After rollback, notify Gemini with:
# "Migration rolled back to commit <sha>. Ready to retry Phase X."
```

## Success Criteria Summary

**Phase 1 Complete:**
- ✅ 10 duplicates deleted
- ✅ Pebble/Stone consolidated
- ✅ Clean git history

**Phase 2 Complete:**
- ✅ 6 components migrated
- ✅ 100% tests passing
- ✅ No broken imports
- ✅ 6 commits (1 per component)

**Phase 3 Complete:**
- ✅ Linting passes
- ✅ All tests pass
- ✅ Metrics: 14/46 (30%), 0 failures
- ✅ Final report generated

---

## Final Verification Before Sending

**Do this right before sending to Gemini:**

```bash
# 1. Git clean
git status
# Expected: On branch main, nothing to commit, working tree clean

# 2. All task files exist
ls -la .claude/tasks/component-migration.json
ls -la .claude/tasks/GEMINI_HANDOVER_MANIFEST.md
# Expected: Both files exist and readable

# 3. All component files exist
ls frontend/src/components/inputs/Lens.tsx
ls frontend/src/components/inputs/Mark.tsx
ls frontend/src/components/inputs/Jar.tsx
ls frontend/src/components/inputs/Valve.tsx
ls frontend/src/components/feedback/Signal.tsx
ls frontend/src/components/containers/Cabinet.tsx
# Expected: All 6 files readable

# 4. Token system exists
ls frontend/src/design-tokens/kerala-rage-tokens.ts
# Expected: File exists and contains ncColor*, ncFont*, ncShape* exports

# 5. Tests pass
npm test frontend/src/components/ 2>&1 | tail -3
# Expected: PASS or "Tests: XX passed"

# 6. Backup branch created
git branch | grep backup
# Expected: backup/main exists
```

If all checks pass: ✅ READY TO HANDOFF

---

**Prepared by:** Claude Code
**Prepared for:** Gemini 3 Pro (Antigravity IDE)
**Date:** 2026-01-28
**Status:** Ready for autonomous execution
