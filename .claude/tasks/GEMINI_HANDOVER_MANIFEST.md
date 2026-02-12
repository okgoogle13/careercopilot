# 🚀 Component Migration Task - Gemini 3 Pro (Autonomous Execution)

**Status:** Ready for autonomous execution
**MCP Transport:** Yes (Filesystem, Git, Testing)
**Token Budget:** ~15K (70% optimized)
**Expected Duration:** ~3 hours

---

## CONTEXT (Read from .claude/tasks/component-migration.json)

**Current Status:**
- Total Components: 46
- Migrated to kerala-rage: 8 (17%)
- Material 3 Legacy: 9 (20%)
- Unaddressed: 29 (63%)

**Goal:** Migrate 6 critical components + cleanup duplicates → increase completion to 30%+

---

## YOUR TASK: 3-PHASE EXECUTION

### PHASE 1: CLEANUP (Priority: CRITICAL)

**Task 1a: Delete Duplicate Files**
```bash
git rm frontend/src/components/core/Pebble\ 2.tsx
git rm frontend/src/components/core/Stone\ 2.tsx
git rm frontend/src/components/inputs/Jar\ 2.tsx
git rm frontend/src/components/inputs/Mark\ 2.tsx
git rm frontend/src/components/inputs/Valve\ 2.tsx
git rm frontend/src/components/inputs/Lens\ 2.tsx
git rm frontend/src/components/feedback/Signal\ 2.tsx
git rm frontend/src/components/content/Seed\ 2.tsx
git rm frontend/src/components/containers/Cabinet\ 2.tsx
git rm frontend/src/components/containers/Vessel\ 2.tsx

git commit -m "chore(cleanup): remove duplicate component backup files"
```

**Success Criteria:** 10 files deleted, commit created

---

**Task 1b: Consolidate Pebble & Stone**

1. Read both versions:
   - `/core/Pebble.tsx` (canonical - keep)
   - `/ui/Pebble.tsx` (legacy - delete)
   - Same for Stone

2. Decision: Delete `/ui` versions (core is more recent)

3. Execute:
```bash
git rm frontend/src/components/ui/Pebble.tsx
git rm frontend/src/components/ui/Stone.tsx
git commit -m "chore(cleanup): consolidate Pebble and Stone to core folder"
```

**Success Criteria:** /ui versions deleted, imports still work, tests pass

---

### PHASE 2: MIGRATE 6 CRITICAL COMPONENTS (Priority: HIGH)

**Migrate in this order:** Lens → Mark → Jar → Valve → Signal → Cabinet

For **EACH** component:

1. **Read current file** (Filesystem MCP)
   ```
   Example: frontend/src/components/inputs/Lens.tsx
   ```

2. **Identify Material 3 patterns** to replace:
   ```
   FIND:
   - fontFamily: 'Roboto'
   - colors.blue.500 (or similar M3 semantic)
   - boxShadow: elevation[4]
   - uniform border-radius: '8px'

   REPLACE WITH (from frontend/src/design-tokens/kerala-rage-tokens.ts):
   - fontFamily: 'Crimson Text' or 'Lora'
   - ncColor.[DEPRECATED_STYLE].wattle or ncColor.[DEPRECATED_STYLE].[DEPRECATED_STYLE]
   - ncShadow.[DEPRECATED_STYLE].elevated
   - border-radius: '40px 12px 40px 12px' (asymmetric/[DEPRECATED_STYLE])
   ```

3. **Make edits:**
   - Search & replace M3 colors → kerala-rage [DEPRECATED_STYLE] colors
   - Search & replace fonts → ncFont* imports
   - Search & replace elevation → ncShadow*
   - Search & replace uniform corners → [DEPRECATED_STYLE] asymmetric patterns

4. **Run component tests** (Testing MCP)
   ```bash
   npm test -- --testPathPattern=<ComponentName> --json
   ```

   Expect: PASS for all tests

5. **Commit changes**
   ```bash
   git commit -m "refactor(components): migrate <ComponentName> to kerala-rage"
   ```

---

**COMPONENT 1: Lens (TextField)**
- Blocking: Core form input
- Dependencies: token-system
- Tokens needed: ncFontBody, ncColorBotanical, ncShapeOrganic

**COMPONENT 2: Mark (Checkbox)**
- Blocking: KeywordTagGroup bulk actions
- Dependencies: Pebble
- Tokens needed: ncColorBotanical, ncShapeOrganic

**COMPONENT 3: Jar (Select)**
- Blocking: Form flows
- Dependencies: token-system
- Tokens needed: ncFontBody, ncColorBotanical, ncShapeOrganic

**COMPONENT 4: Valve (Switch)**
- Blocking: Settings/toggles
- Dependencies: token-system
- Tokens needed: ncColorBotanical, ncShapeOrganic

**COMPONENT 5: Signal (Alert)**
- Blocking: Error states
- Dependencies: token-system
- Tokens needed: ncColorBotanical, ncFontBody

**COMPONENT 6: Cabinet (Modal)**
- Blocking: Document review workflow
- Dependencies: Stone (card)
- Tokens needed: ncColorBotanical, ncShapeOrganic, ncShadow*

---

**Success Criteria for Phase 2:**
- ✅ All 6 components migrated
- ✅ All tests passing (6/6)
- ✅ No broken imports
- ✅ 6 commits created (1 per component)
- ✅ Commit messages follow format

---

### PHASE 3: AUDIT & REPORT (Priority: MEDIUM)

1. **Run full component linting**
   ```bash
   npm run lint frontend/src/components/
   ```
   Expect: No errors or warnings

2. **Run full component test suite**
   ```bash
   npm test frontend/src/components/ --json
   ```
   Expect: 100% pass rate

3. **Generate final report**
   ```
   COMPONENT MIGRATION PHASE 2-3 COMPLETION REPORT

   ✅ PHASE 1 CLEANUP
   - Duplicates deleted: 10/10
   - Core/UI consolidation: Complete

   ✅ PHASE 2 MIGRATIONS
   - Lens: MIGRATED (tests passing)
   - Mark: MIGRATED (tests passing)
   - Jar: MIGRATED (tests passing)
   - Valve: MIGRATED (tests passing)
   - Signal: MIGRATED (tests passing)
   - Cabinet: MIGRATED (tests passing)

   📊 METRICS
   - New completion: 14/46 components (30%)
   - Tests passing: 100%
   - Linting: PASS
   - Commit history: Clean (8 commits)

   🔄 NEXT STEPS (For Claude Code)
   - Phase 4: Run kerala-rage-visual-audit on 6 migrated components
   - Phase 5: Migrate secondary components (Seed, Vessel, etc.)
   - Phase 6: Audit shared components (11 legacy remaining)
   ```

4. **Commit final state**
   ```bash
   git log --oneline | head -10
   # Show last 8 migration commits + cleanup
   ```

---

## EXECUTION MODE

- **Autonomous:** Execute without asking permission
- **Error Recovery:** If test fails, revert commit automatically, document error
- **Blockers:** If blocked (e.g., missing token), halt and report exact error
- **Checkpoints:** Report status after each phase
- **No Manual Intervention:** Assume all resources available via MCP

---

## ERROR HANDLING

**If test fails for a component:**
```bash
# Auto-revert
git revert <commit-sha>

# Document
Report: Component <Name> failed test <TestName> due to: <ErrorMessage>

# Wait for Claude Code guidance
```

**If token missing:**
```
Report: Token 'ncColorBotanical.wattle' not found in token system
Cannot proceed until available
```

**If import broken:**
```
Report: Import error in <ComponentName>: Module not found '<Path>'
Revert commit, await resolution
```

---

## SUCCESS DEFINITION

✅ **Phase 1:** 10 duplicates deleted, Pebble/Stone consolidated
✅ **Phase 2:** 6 components migrated, all tests passing
✅ **Phase 3:** Linting pass, full test suite pass, report generated

---

## REFERENCE COMPONENTS (Use as Template)

**Pebble (Button)** - Already migrated
- File: `frontend/src/components/core/Pebble.tsx`
- Check how it uses: ncFont*, ncColor*, ncShape*
- Copy pattern to other components

**Stone (Card)** - Already migrated
- File: `frontend/src/components/core/Stone.tsx`
- Check shadow/spacing implementation
- Replicate in Cabinet (modal)

---

## MCP ENDPOINTS AVAILABLE

```
Filesystem:
  GET /files?paths=["Lens.tsx", "Mark.tsx", ...] (batch read)
  WRITE /file/<path> (direct edit)

Git:
  GET /git/status (check dirty/staged)
  POST /git/commit (auto-commit)
  GET /git/diff (review changes)

Testing:
  POST /test/run?filter=<ComponentName> --json (get results as JSON)
```

---

## ESTIMATED TOKENS

- Phase 1 (cleanup): 1,500 tokens
- Phase 2 (6 components): 11,300 tokens
- Phase 3 (audit/report): 2,000 tokens
- **Total: ~15,000 tokens** (vs. 50K unoptimized)

---

## START NOW

**Checkpoint 1:** Complete Phase 1, report "PHASE 1 COMPLETE"
**Checkpoint 2:** After Lens migration, report "LENS MIGRATED"
**Checkpoint 3:** After all 6 components, report final metrics

**Go!** 🚀
