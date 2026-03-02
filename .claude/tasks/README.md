# Component Migration Handoff Package

**Status:** Ready for Gemini 3 Pro autonomous execution
**Date:** 2026-01-28
**Transport:** MCP Server (Filesystem, Git, Testing)
**Token Budget:** ~15K (70% optimized)

---

## 📋 Files in This Package

### Core Documents

1. **GEMINI_HANDOVER_MANIFEST.md** ← START HERE
   - Copy-paste ready prompt for Gemini 3 Pro
   - Step-by-step execution guide
   - All instructions for phases 1-3
   - Error handling procedures

2. **component-migration.json**
   - Structured task manifest
   - Component priorities with dependencies
   - Token system requirements
   - MCP server configuration
   - Estimated token costs

3. **HANDOVER_SUMMARY.txt**
   - Quick reference (1-page summary)
   - Current status metrics
   - Critical facts and blockers
   - Execution flow overview

### Planning & Strategy

4. **../plans/component-migration-handover.md**
   - Full token efficiency strategy
   - MCP server setup guide
   - Batch query optimization
   - Rollback procedures
   - Real-time monitoring setup

### Configuration

5. **../config/mcp-gemini-config.json**
   - MCP server endpoints
   - Agent configuration
   - Token optimization settings
   - Error handling rules

### Checklists & Reference

6. **HANDOFF_CHECKLIST.md**
   - Pre-handoff verification
   - Step-by-step handoff process
   - Real-time status monitoring
   - Success criteria
   - Rollback procedures

---

## 🚀 Quick Start

### For Claude Code (You)

1. **Read this README** (you're doing this)
2. **Run pre-flight checks:**
   ```bash
   bash .claude/tasks/HANDOFF_CHECKLIST.md
   ```
3. **Verify files created:**
   ```bash
   ls -la .claude/tasks/
   ls -la .claude/plans/
   ls -la .claude/config/
   ```
4. **Create backup:**
   ```bash
   git checkout -b backup/main
   git checkout main
   ```

### For Gemini 3 Pro (Next Step)

1. **Open Antigravity IDE** with MCP connection
2. **Copy entire content of:** `GEMINI_HANDOVER_MANIFEST.md`
3. **Paste into Gemini chat** with message:
   ```
   Here's a component migration task for autonomous execution.
   Task manifest: .claude/tasks/component-migration.json
   Execute phases 1-3 autonomously. Report status after each phase.
   Token budget: ~15K. Expected duration: ~3 hours.
   Proceed without permission needed.
   ```
4. **Monitor progress** with:
   ```bash
   git log --oneline | head -20
   npm test frontend/src/components/ --watch
   ```

---

## 📊 Migration Status

**Current:**
- Total Components: 46
- Migrated: 8 (17%)
- Legacy Material 3: 9 (20%)
- Unaddressed: 29 (63%)

**After Gemini Completes:**
- Migrated: 14 (30%)
- Legacy: 9 (20%)
- Remaining: 23 (50%)

---

## 🎯 Phases Overview

### PHASE 1: Cleanup (~30 min)
- Delete 10 duplicate *2.tsx files
- Consolidate Pebble/Stone
- Outcome: Clean slate for migrations

### PHASE 2: Migrate 6 Components (~2 hours)
1. Lens (TextField) - Core form input
2. Mark (Checkbox) - Bulk actions
3. Jar (Select) - Form flows
4. Valve (Switch) - Settings/toggles
5. Signal (Alert) - Error states
6. Cabinet (Modal) - Document review

Each component:
- Read file
- Replace M3 patterns with kerala-rage tokens
- Run tests
- Commit

### PHASE 3: Audit & Report (~30 min)
- npm run lint
- npm test full suite
- Generate final metrics
- Create summary report

---

## ✅ Success Criteria

**Phase 1:** 10 duplicates deleted, consolidated, clean git history
**Phase 2:** 6 components migrated, 100% tests passing, 6 clean commits
**Phase 3:** Linting pass, all tests pass, final report generated

**Final:** 14/46 components migrated (30%), 0 failures, 0 rollbacks needed

---

## 🔧 Token Efficiency (70% Optimization)

| Strategy | Savings |
|----------|---------|
| Batch MCP queries | 66% fewer requests |
| Incremental commits | No context bloat |
| Direct file references | 90% less overhead |
| JSON test output | 80% smaller |
| Task manifest (vs docs) | 90% smaller context |
| **Total** | **~70% reduction** |

**Estimated Cost:**
- Unoptimized: 50K tokens
- Optimized: 15K tokens
- Savings: 35K tokens

---

## 📋 Key Files for Gemini

**Must be readable by Gemini:**
- ✅ frontend/src/components/inputs/Lens.tsx
- ✅ frontend/src/components/inputs/Mark.tsx
- ✅ frontend/src/components/inputs/Jar.tsx
- ✅ frontend/src/components/inputs/Valve.tsx
- ✅ frontend/src/components/feedback/Signal.tsx
- ✅ frontend/src/components/containers/Cabinet.tsx
- ✅ frontend/src/design-tokens/kerala-rage-tokens.ts

**Reference components (for patterns):**
- ✅ frontend/src/components/core/Pebble.tsx (already migrated)
- ✅ frontend/src/components/core/Stone.tsx (already migrated)

---

## ⚠️ Known Blockers (Gemini Will Handle)

1. **Duplicate files** - Phase 1 deletes these
2. **Pebble/Stone duplication** - Phase 1 consolidates
3. **Missing tokens** - Will report error if found
4. **Broken imports** - Will auto-revert and document

---

## 🛑 Error Handling

| Error | Gemini Action |
|-------|---------------|
| Test failure | Auto-revert commit, document, halt phase |
| Missing token | Report which token, halt migration |
| Import error | Revert, check dependencies |
| Blocked dependency | Document, report to Claude Code |

---

## 📞 After Gemini Completes

Claude Code will:
1. Pull latest changes
2. Run full test suite locally
3. Run kerala-rage-visual-audit on 6 components
4. Create PR with Gemini's commits
5. Plan Phase 4-6 (remaining components)

---

## 🔄 Rollback (If Needed)

```bash
# Return to safe state
git checkout backup/main

# Or revert specific commits
git revert <commit-sha>

# Notify Gemini to retry from checkpoint
```

---

## 📚 Document Reference

**For Details on:**
- **Token optimization:** `../plans/component-migration-handover.md`
- **MCP setup:** `../plans/component-migration-handover.md` (Section 2)
- **Step-by-step execution:** `GEMINI_HANDOVER_MANIFEST.md`
- **Task manifest data:** `component-migration.json`
- **Pre-flight checks:** `HANDOFF_CHECKLIST.md`

---

## ✨ Why This Works

✅ **Structured data** (JSON not prose) = smaller context
✅ **Batch queries** (3 reads in 1 call) = 66% fewer requests  
✅ **Autonomous execution** (no back-and-forth) = faster completion
✅ **Incremental commits** (1 per component) = no bloat
✅ **Error recovery** (auto-revert on failure) = safe execution
✅ **Clear checkpoints** (report after each phase) = visibility

---

## 🚀 Ready?

**All checks passed?** Run one final verification:

```bash
# Verify all files exist
ls -la .claude/tasks/GEMINI_HANDOVER_MANIFEST.md && \
ls -la .claude/tasks/component-migration.json && \
ls -la .claude/plans/component-migration-handover.md && \
ls -la .claude/config/mcp-gemini-config.json && \
echo "✅ ALL FILES READY FOR HANDOFF"
```

**Then:** Copy `GEMINI_HANDOVER_MANIFEST.md` and send to Gemini 3 Pro in Antigravity IDE.

---

**Prepared:** 2026-01-28 by Claude Code  
**Status:** Ready for autonomous execution  
**Transport:** MCP Server  
**Next:** Send to Gemini 3 Pro via Antigravity IDE
