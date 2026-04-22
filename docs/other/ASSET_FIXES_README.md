# Asset Cataloguing & Naming Convention Fixes

This document describes the automated fix scripts and task queues generated to address critical asset cataloguing issues identified in the audit completed February 22, 2026.

## Overview

**Problem Statement**: The asset audit revealed 5 critical broken asset paths, 73 uncategorized assets, 42 assets in migration queue, and CSS variable format issues affecting 5 components and the design system.

**Solution**: Four automated fix scripts (Priority 1-2) and three task queues (Priority 3) to systematically address all issues.

---

## Phase 1: Automated Fix Scripts

### 1.1 Fix Broken Asset Paths

**File**: `scripts/fix-broken-asset-paths.py`

**What it does**:
- Fixes 5 broken `/src/assets/` references in React components
- Converts hardcoded paths to ES module imports
- Validates file existence before replacement
- Creates atomic git commit

**Broken references fixed**:
1. `KrDarkLanding.tsx:102` - `/src/assets/KrMotifs/the-sentry.png` → `sentry_kr-shiva.png`
2. `GalleryFeed.tsx:121` - `/src/assets/specimens/leaf-fern.png` → ES import
3. `GalleryFeed.tsx:130` - `/src/assets/specimens/beetle-scarab.png` → `/assets/specimens/northcote-beetle-scarab-variant.png`
4. `GalleryLanding.tsx:22` - `/src/assets/specimens/the-sentry.png` → `sentry_kookaburra.png`
5. `SidePanel.tsx:13` - `/src/assets/KrMotifs/lab-sentry.png` → `sentry_kr-shiva.png`

**Run**:
```bash
python3 scripts/fix-broken-asset-paths.py
```

**Verify**:
```bash
cd frontend && yarn build  # Should complete without asset errors
grep -r "/src/assets/" dist/ && echo "FAILED" || echo "OK"
```

---

### 1.2 Complete Triage Migration

**File**: `scripts/complete-triage-migration.sh`

**What it does**:
- Moves 42 approved assets from `_triage/keep/` to permanent kr-solidarity category folders
- Deletes assets in `_triage/discard/`
- Logs quarantine files for manual review
- Updates manifest with new entries
- Optionally creates git commit

**Assets affected**:
- 42 files moved from `_triage/keep/` → `kr-solidarity/{category}/`
- 2 files deleted from `_triage/discard/`
- 3 files remain in `_triage/quarantine/` (manual review needed)

**Run**:
```bash
bash scripts/complete-triage-migration.sh
```

**Verify**:
```bash
ls -la frontend/public/assets/_triage/keep/  # Should be empty
cat frontend/src/design/tokens/kr-solidarity-manifest.json | jq '.assets | length'
# Should show 41 + 42 = 83 assets
```

---

### 1.3 Standardize Asset Naming

**File**: `scripts/standardize-asset-naming.py`

**What it does**:
- Renames `kr-moti-*` files to `kr-motif-*` (2 files)
- Removes `[DEPRECATED_STYLE]-` prefix
- Consolidates duplicate specimens (deletes src versions, keeps public)
- Updates all import statements
- Updates manifest references
- Creates git commit

**Fixes applied**:
1. `kr-moti-kr-dark-test-asset-1024.png` → `kr-motif-kr-dark-test-asset-1024.png`
2. `kr-moti-kr-dark-test-final-verification-1024.png` → `kr-motif-kr-dark-test-final-verification-1024.png`
3. `[DEPRECATED_STYLE]-labyrinth.jpg` → `organic-labyrinth.jpg`
4. Delete duplicate `grinding_stone.jpg` from src/assets/

**Run**:
```bash
python3 scripts/standardize-asset-naming.py
```

**Verify**:
```bash
grep -r "\[DEPRECATED_STYLE\]" frontend/src/assets/  # Should return nothing
find frontend/public/assets/ -name "*_*.png" -o -name "*_*.jpg"  # Should be minimal
cd frontend && yarn test  # Should pass
```

---

### 1.4 Fix CSS Variable Format

**File**: `scripts/fix-css-variable-format.py`

**What it does**:
- Parses design tokens from DTCG JSON source
- Regenerates `design-tokens.css` with proper CSS syntax
- Converts JSON objects to flat CSS custom properties
- Maintains 100% DTCG compliance
- Creates git commit

**Problem fixed**:
```css
/* Before (invalid): */
--sys-color-primary: {'DEFAULT': '#D4A84B', 'container': '#8B7A35', ...};

/* After (valid): */
--sys-color-primary-default: #D4A84B;
--sys-color-primary-container: #8B7A35;
```

**Run**:
```bash
python3 scripts/fix-css-variable-format.py
```

**Verify**:
```bash
grep "{'" frontend/src/styles/design-tokens.css  # Should return nothing
head -20 frontend/src/styles/design-tokens.css  # Should show proper CSS format
yarn storybook  # Visual regression test
```

---

## Phase 2: Task Queue for Agent Migration

Three JSON task queues are available for handoff to multi-agent workflows via `/task-router-mcp`:

### 2.1 Uncategorized Asset Migration

**File**: `.claude/tasks/uncategorized-asset-migration.json`

**Purpose**: Classify 73 uncategorized/raw-generated assets into semantic categories

**Task chain**:
1. **Batch 1-3 Classification** (Gemini) → Visual analysis of assets
2. **Batch 1-3 Validation** (Claude Code) → Verify classifications
3. **Consolidate & Migrate** (Claude Code) → Rename, move, update manifest
4. **Final Audit** (Claude Code) → Verify 100% compliance

**Assets**: 73 files in `frontend/public/assets/uncategorized/`

**Categories**:
- `abstract` - Atmospheric, generative art, gradients
- `motif` - Botanical patterns, symbolic elements
- `texture` - Substrates, materials, tactile patterns
- `portrait` - Faces, people, resistance icons
- `devotional` - Spiritual, sacred, ancestral imagery
- `landscape` - Geographic scenes, urban, terrain
- `specimen` - Natural history, Northcote archive
- `discard` - Low quality, duplicates, test assets

**Activate**:
```bash
# Via task-router-mcp MCP server
mcp.call_tool("task-router", "create_task", {
  "task_id": "classify-batch-1",
  "assigned_to": "gemini",
  "inputs": {...}  # See .claude/tasks/uncategorized-asset-migration.json
})
```

---

### 2.2 Orphaned UI Asset Integration

**File**: `.claude/tasks/orphaned-ui-asset-integration.json`

**Purpose**: Audit and integrate 12 orphaned UI SVG files into manifest

**Task chain**:
1. **Audit Orphaned SVGs** (Claude Code) → Identify orphaned files
2. **Classify SVG Purpose** (Gemini) → Analyze visual purpose & usage
3. **Integrate into Manifest** (Claude Code) → Add to manifest with metadata
4. **Verify Integration** (Claude Code) → Ensure consistency & completeness

**Assets**: 12 SVG files (KR-UI-008 through KR-UI-019)

**Location**: `frontend/public/assets/kr-solidarity/ui-kit/svg/`

**Expected outcome**: All 12 SVGs added to manifest with proper categorization

---

### 2.3 Asset Path Validation (Recurring)

**File**: `.claude/tasks/asset-path-validation.json`

**Purpose**: Ongoing weekly validation of all asset references to prevent broken paths

**Task chain**:
1. **Scan Component References** → Check `.tsx/.ts` files
2. **Scan Markdown References** → Check `.md` documentation
3. **Scan CSS References** → Check `.css` and `url()` patterns
4. **Consolidate Report** → Generate comprehensive validation report
5. **Fix Broken Refs** (if any) → Automated fixes or manual review queue

**Frequency**: Weekly (configurable)

**Automation**: Can be triggered on `git push` to main branch

---

## Execution Guide

### Recommended Order (Priority 1-3)

```bash
# PRIORITY 1 (Immediate - Fix Critical Errors)

# Fix 5 broken asset paths
python3 scripts/fix-broken-asset-paths.py
cd frontend && yarn build  # Verify

# Complete triage migration (42 assets)
bash scripts/complete-triage-migration.sh
# Review logs: triage-migration.log
```

```bash
# PRIORITY 2 (This Sprint - Improve Compliance)

# Standardize naming conventions
python3 scripts/standardize-asset-naming.py
cd frontend && yarn test  # Verify

# Fix CSS variable format
python3 scripts/fix-css-variable-format.py
yarn storybook  # Visual regression test
```

```bash
# PRIORITY 3 (Next Sprint - Complete Classification)

# Launch task queues via task-router-mcp
# Delegate to Gemini/Claude agents for classification

# 1. Uncategorized asset classification (73 assets)
#    → .claude/tasks/uncategorized-asset-migration.json

# 2. Orphaned UI asset integration (12 assets)
#    → .claude/tasks/orphaned-ui-asset-integration.json

# 3. Weekly asset path validation (recurring)
#    → .claude/tasks/asset-path-validation.json
```

---

## Success Metrics

### Before Audit
- Asset compliance: 62%
- Broken paths: 5
- Uncategorized assets: 73
- Manifest-filesystem sync: 96%
- CSS variable format issues: 9 variables

### After Phase 1 (Fix Scripts)
- Broken paths: 0 ✅
- Asset compliance: 75%
- Triage migration: 42/42 complete ✅
- CSS variables: 0 format issues ✅

### After Phase 2 (Task Queues)
- Asset compliance: 95%+
- Uncategorized assets: 0 ✅
- Manifest-filesystem sync: 100% ✅
- Orphaned UI assets: 0 ✅

---

## Rollback Procedures

### If fix-broken-asset-paths.py fails:
```bash
git revert <commit-sha>
# Review script output for errors
# Fix issues and re-run
```

### If complete-triage-migration.sh fails:
```bash
# Restore from backup
cp frontend/public/assets/_triage/.backup/* frontend/public/assets/_triage/keep/
# Review triage-migration.log for error
# Fix and re-run
```

### If standardize-asset-naming.py fails:
```bash
git revert <commit-sha>
# Check for import errors in script output
# Fix and re-run
```

### If fix-css-variable-format.py fails:
```bash
git revert <commit-sha>
# Rebuild manually
cd frontend && node scripts/build-m3-tokens.py
```

---

## File Organization Summary

### Scripts Created
```
scripts/
├── fix-broken-asset-paths.py          # Priority 1
├── complete-triage-migration.sh       # Priority 1
├── standardize-asset-naming.py        # Priority 2
└── fix-css-variable-format.py         # Priority 2
```

### Task Queues Created
```
.claude/tasks/
├── uncategorized-asset-migration.json    # Priority 3
├── orphaned-ui-asset-integration.json    # Priority 3
└── asset-path-validation.json            # Priority 3 (recurring)
```

### Files Modified
```
frontend/src/layouts/
├── KrDarkShell/views/KrDarkLanding.tsx
├── GalleryShell/views/GalleryFeed.tsx
├── GalleryShell/views/GalleryLanding.tsx
└── LaboratoryShell/components/SidePanel.tsx

frontend/src/styles/
└── design-tokens.css

frontend/src/design/tokens/
└── kr-solidarity-manifest.json
```

---

## Monitoring & Maintenance

**Post-fix checklist**:
- [ ] All scripts executed without errors
- [ ] `yarn build` completes successfully
- [ ] `yarn test` passes all tests
- [ ] `yarn storybook` shows no visual regressions
- [ ] `git log` shows clean commit history
- [ ] Manifest contains expected asset counts
- [ ] No `/src/assets/` paths in production build
- [ ] CSS variables render correctly in components

**Weekly maintenance**:
- [ ] Run asset path validation task queue
- [ ] Review broken reference report (if any)
- [ ] Check manifest-filesystem sync status
- [ ] Monitor asset health metrics

---

## Questions or Issues?

Refer to the audit report: Asset audit results are documented in the comprehensive analysis output from Haiku 4.5 model execution (Feb 22, 2026).

For task queue execution via MCP, see: `.claude/skills/task-router-mcp/SKILL.md`
