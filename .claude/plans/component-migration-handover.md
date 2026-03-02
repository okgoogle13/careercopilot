# Component Migration Handover Strategy for Gemini 3 Pro (Antigravity IDE)

**Prepared:** 2026-01-28
**Token Budget:** Optimized for MCP server coordination
**Target Execution:** Gemini 3 Pro via Antigravity IDE

---

## 1. PRE-HANDOVER SETUP (Claude Code)

### Context Preservation (Minimal Token Footprint)
Create a single consolidated task file instead of verbose documentation:

**File:** `.claude/tasks/component-migration.json`
```json
{
  "task_id": "component-migration-2026q1",
  "migration_status": {
    "total_components": 46,
    "migrated": 8,
    "legacy": 9,
    "unaddressed": 29,
    "completion_pct": 17
  },
  "critical_path": [
    {
      "priority": 1,
      "component": "Lens",
      "old_name": "M3TextField",
      "new_name": "TextField",
      "blocking": "form adoption",
      "files": ["frontend/src/components/inputs/Lens.tsx"],
      "dependencies": ["Pebble (button)", "token-system"]
    },
    {
      "priority": 2,
      "component": "Mark",
      "old_name": "M3Checkbox",
      "new_name": "Checkbox",
      "blocking": "KeywordTagGroup, bulk actions",
      "files": ["frontend/src/components/inputs/Mark.tsx"],
      "dependencies": ["Pebble"]
    },
    {
      "priority": 3,
      "component": "Jar",
      "old_name": "M3Select",
      "new_name": "Select",
      "blocking": "form flows",
      "files": ["frontend/src/components/inputs/Jar.tsx"],
      "dependencies": ["token-system"]
    },
    {
      "priority": 4,
      "component": "Valve",
      "old_name": "M3Switch",
      "new_name": "Switch",
      "blocking": "settings/toggles",
      "files": ["frontend/src/components/inputs/Valve.tsx"],
      "dependencies": ["token-system"]
    },
    {
      "priority": 5,
      "component": "Signal",
      "old_name": "M3Alert",
      "new_name": "Alert",
      "blocking": "error states",
      "files": ["frontend/src/components/feedback/Signal.tsx"],
      "dependencies": ["token-system"]
    },
    {
      "priority": 6,
      "component": "Cabinet",
      "old_name": "M3Modal",
      "new_name": "Modal",
      "blocking": "document review workflow",
      "files": ["frontend/src/components/containers/Cabinet.tsx"],
      "dependencies": ["Stone (card)"]
    }
  ],
  "cleanup_tasks": [
    {
      "task": "delete_duplicates",
      "files": [
        "frontend/src/components/core/Pebble 2.tsx",
        "frontend/src/components/core/Stone 2.tsx",
        "frontend/src/components/inputs/Jar 2.tsx",
        "frontend/src/components/inputs/Mark 2.tsx",
        "frontend/src/components/inputs/Valve 2.tsx",
        "frontend/src/components/inputs/Lens 2.tsx",
        "frontend/src/components/feedback/Signal 2.tsx",
        "frontend/src/components/content/Seed 2.tsx",
        "frontend/src/components/containers/Cabinet 2.tsx",
        "frontend/src/components/containers/Vessel 2.tsx"
      ],
      "count": 10,
      "priority": "phase_1"
    },
    {
      "task": "consolidate_core_ui",
      "description": "Consolidate Pebble and Stone (core vs ui folders)",
      "decision_needed": "which folder is canonical",
      "priority": "phase_1"
    }
  ],
  "token_system_reference": {
    "location": "frontend/src/design-tokens/kerala-rage-tokens.ts",
    "required_imports": [
      "ncFontDisplay",
      "ncFontBody",
      "ncColorBotanical",
      "ncShapeOrganic"
    ],
    "migration_checklist": [
      "Replace M3 semantic colors with [DEPRECATED_STYLE] palette",
      "Replace Inter/Roboto with kerala-rage typography stack",
      "Apply [DEPRECATED_STYLE] border-radius (asymmetric)",
      "Remove Material 3 elevation system, use kerala-rage shadow tokens"
    ]
  },
  "handover_receiver": {
    "agent": "gemini-3-pro",
    "ide": "antigravity",
    "transport": "mcp-server",
    "expected_flow": "autonomous-execution"
  }
}
```

---

## 2. MCP SERVER SETUP

### A. Filesystem MCP Configuration
**Purpose:** Gemini 3 Pro can read component files directly without repeated context

**Query Pattern (Efficient):**
```
GET /workspace/frontend/src/components/<category>/<Component>.tsx
→ Returns file content only (no verbose paths)
```

**Benefit:** 1 request = full component context (vs. multiple grep/cat calls)

---

### B. Git MCP Configuration
**Purpose:** Track which files changed, which are safe to edit

**Query Pattern:**
```
GET /git/status --components-only
GET /git/diff frontend/src/components/
→ Returns only modified component files
```

**Benefit:** Gemini knows what's staged vs. dirty; avoids conflicting edits

---

### C. Testing MCP Configuration
**Purpose:** Validate migrations don't break existing tests

**Query Pattern:**
```
POST /test/run --components --filter=<ComponentName>
→ Returns PASS/FAIL only (no verbose output)
```

**Benefit:** Fast feedback loop; Gemini can iterate on fix

---

## 3. HANDOVER MANIFEST (Paste to Gemini 3 Pro)

**Format:** Single structured prompt (token-efficient)

```markdown
# Component Migration Autonomous Task - Gemini 3 Pro

## Context (Read from .claude/tasks/component-migration.json)
- 46 total frontend components
- 17% migrated (8/46)
- 20% explicit Material 3 legacy (9/46)
- 63% unaddressed (29/46)

## Your Task
Execute component migrations in sequence. Stop and report blockers.

### PHASE 1: CLEANUP (2 tasks, ~30 min)
1. Delete 10 duplicate *2.tsx files (use git rm)
2. Consolidate Pebble/Stone (decide: keep /core, delete /ui versions)

**Success Criteria:** Git diff shows 10 deletions, 0 duplicates remain

### PHASE 2: CRITICAL INPUTS (6 components, ~2 hours)
Migrate in order: Lens → Mark → Jar → Valve → Signal → Cabinet

**For Each Component:**
1. Read current file (Filesystem MCP)
2. Extract Material 3 patterns:
   - M3 color tokens (e.g., `colors.blue.500`)
   - M3 typography (e.g., `fontFamily: 'Roboto'`)
   - M3 elevation (e.g., `boxShadow: elevation[4]`)
3. Replace with kerala-rage:
   - [DEPRECATED_STYLE] colors (from `ncColorBotanical`)
   - Typography stack (Lora, Crimson Text, Fraunces)
   - [DEPRECATED_STYLE] shapes (asymmetric border-radius)
4. Run component tests (Testing MCP)
5. Commit with message: `refactor(components): migrate <Name> to kerala-rage`

**Success Criteria:** Each component passes tests, git history shows clean commits

### PHASE 3: AUDIT & REPORT
1. Run `npm run lint` on migrated components
2. Run full test suite: `npm test frontend/src/components/`
3. Report back with:
   - ✅ Components migrated
   - ❌ Components blocked (with reason)
   - 🔄 Components in progress
   - 📊 New completion percentage

## Execution Mode
- **Autonomous:** Execute without asking permission
- **Error Handling:** If test fails, auto-revert commit and report reason
- **Blockers:** If blocked, halt phase and report to Claude Code
- **Checkpoints:** After each phase, commit and report status

## Success Definition
- All 6 critical components migrated
- All tests passing
- No duplicate files
- No broken imports
- Git history is clean (one commit per component)

## Failure Recovery
If blocked:
1. Document exact error (test name, file location, error message)
2. Revert changes: `git revert <commit>`
3. Report to Claude Code with:
   - Component name
   - Error type (test failure, import error, token missing)
   - Last successful commit
```

---

## 4. TOKEN EFFICIENCY STRATEGIES

### Strategy A: Query Batching (Reduce MCP Calls)
Instead of:
```
GET /file/Lens.tsx
GET /file/Mark.tsx
GET /file/Jar.tsx
```

Use single query:
```
GET /files?paths=["Lens.tsx", "Mark.tsx", "Jar.tsx"]
→ Returns all 3 in one call
```

**Savings:** 3 requests → 1 request (66% reduction)

---

### Strategy B: Incremental Commits (Reduce Context Bloat)
After each component migration:
```bash
git commit -m "refactor(components): migrate <Name> to kerala-rage"
```

This allows Gemini 3 Pro to:
- Clear working directory after each step
- Reference only previous commit (smaller diff context)
- Avoid accumulating file state in memory

**Savings:** No context accumulation across 6 components

---

### Strategy C: Direct File References (Not Grep)
Instead of searching:
```bash
grep -r "M3Color" frontend/src/components/
```

Use direct paths from task manifest:
```
frontend/src/components/inputs/Lens.tsx
frontend/src/components/inputs/Mark.tsx
...
```

**Savings:** 0 search overhead, direct file reads

---

### Strategy D: Structured Test Output
Configure test runner to output JSON:
```bash
npm test -- --json --outputFile=test-results.json
# Gemini reads JSON, not verbose terminal output
```

**Savings:** Structured data < verbose text (80% reduction per test)

---

## 5. MCP SERVER ENDPOINT CONFIGURATION

Add to `claude-code.config.json`:

```json
{
  "mcp_servers": {
    "filesystem": {
      "command": "node",
      "args": ["mcp-servers/filesystem.js"],
      "env": {
        "ROOT_PATH": "/Users/okgoogle13/Projects/careercopilot",
        "BATCH_READS": true,
        "RESPONSE_FORMAT": "compact"
      }
    },
    "git": {
      "command": "node",
      "args": ["mcp-servers/git.js"],
      "env": {
        "REPO_PATH": "/Users/okgoogle13/Projects/careercopilot",
        "FILTER": "components-only",
        "DIFF_FORMAT": "compact"
      }
    },
    "testing": {
      "command": "node",
      "args": ["mcp-servers/testing.js"],
      "env": {
        "REPO_PATH": "/Users/okgoogle13/Projects/careercopilot",
        "OUTPUT_FORMAT": "json",
        "VERBOSE": false
      }
    }
  }
}
```

---

## 6. HANDOVER CHECKLIST

**Before Handing Off to Gemini 3 Pro:**

- [ ] Task manifest saved: `.claude/tasks/component-migration.json`
- [ ] MCP server endpoints configured
- [ ] Git is clean (no dirty working directory)
- [ ] All tests passing before migration
- [ ] Backup branch created: `git checkout -b backup/main`
- [ ] Token system documentation accessible to Gemini
- [ ] Gemini has read access to:
  - `frontend/src/components/*`
  - `frontend/src/design-tokens/*`
  - `.claude/tasks/component-migration.json`

---

## 7. MONITORING & HANDBACK

### Real-Time Monitoring
```bash
# Watch Gemini's progress
git log --oneline | head -20

# Check test status
npm test frontend/src/components/ --watch
```

### Handback Trigger
When Gemini reports:
- ✅ Phase 1 cleanup complete
- ✅ Phase 2 all 6 components migrated
- ✅ Phase 3 tests passing

Then:
1. Pull latest changes
2. Run full test suite locally
3. Run linting
4. Create PR with Gemini's commits
5. Deploy to staging for visual audit (via `kerala-rage-visual-audit`)

---

## 8. POST-MIGRATION (Back to Claude Code)

After Gemini 3 Pro completes phases 1-3:

**Phase 4 (Visual Validation via Claude Code):**
```bash
# Take screenshots of migrated components
# Run kerala-rage-visual-audit on each
# Check typography, colors, spacing against standards
```

**Phase 5 (Shared Components):**
- Audit remaining 11 shared/legacy components
- Prioritize by usage (most-used first)
- Repeat migration cycle

---

## 9. ROLLBACK PLAN

If migration fails mid-way:

```bash
# Option 1: Revert to backup branch
git checkout backup/main

# Option 2: Revert to specific commit
git revert <commit-sha>

# Report to Gemini: restart from last successful phase
```

---

## Token Efficiency Summary

| Strategy | Savings |
|----------|---------|
| Batch MCP queries | 66% fewer requests |
| Incremental commits | No context bloat |
| Direct file references | 0 search overhead |
| JSON test output | 80% smaller output |
| Task manifest (vs docs) | 90% smaller context |
| **Total Estimated Savings** | **~70% token reduction** |

Expected token cost for 6-component migration:
- Claude Code (planning): ~10K tokens
- Gemini 3 Pro (execution): ~15K tokens (vs. 50K without optimization)
- **Total: ~25K tokens** (vs. 60K unoptimized)

---

**Ready to handoff.** Paste the "Handover Manifest" directly to Gemini 3 Pro in Antigravity IDE.
