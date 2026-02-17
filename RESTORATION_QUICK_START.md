# KR-Rage-Figma Restoration Quick Start

> **TL;DR**: KR-Rage-Figma branch lost its git history (corruption), but all files are intact. The restoration-KR-Rage-Figma-v2.0 branch has everything, but deleted some valuable specs. Merge both strategically.

## 🚨 Critical Issue

**Git History Corruption**:
- KR-Rage-Figma: Only 1 commit (should have 30+)
- restoration-KR-Rage-Figma-v2.0: Complete history ✅
- **No file corruption** - all content is intact

## 🔥 Top 5 Files to Restore ASAP

1. **`tools/scripts/build-m3-tokens.py`** - Token pipeline automation
2. **`frontend/src/components/ui/M3Button.tsx`** - New M3 component
3. **`docs/design/hifi/*.md`** (11 files) - HiFi design specs (PRESERVE from KR-Rage-Figma!)
4. **`tools/scripts/design-validation/validate-tokens.py`** - Token validator
5. **`libs/design-system/`** (entire directory) - Formalized design system package

## 📋 Quick Restoration Commands

### Option 1: Fast File Copy (loses history)

```bash
# From restoration branch to current
git checkout restoration-KR-Rage-Figma-v2.0 -- \
  tools/scripts/build-m3-tokens.py \
  tools/scripts/design-validation/ \
  frontend/src/components/ui/M3Button.tsx \
  libs/design-system/

# Preserve HiFi specs from KR-Rage-Figma
mkdir -p docs/design/hifi-legacy
git checkout KR-Rage-Figma -- docs/design/hifi/
mv docs/design/hifi/* docs/design/hifi-legacy/
```

### Option 2: Clean Merge (preserves history)

```bash
# Create new branch combining both
git checkout -b kerala-rage-design-v2.0 restoration-KR-Rage-Figma-v2.0

# Cherry-pick valuable files from KR-Rage-Figma
git checkout KR-Rage-Figma -- docs/design/hifi/
mkdir -p docs/design/hifi-legacy
mv docs/design/hifi/* docs/design/hifi-legacy/

# Commit
git add .
git commit -m "Preserve HiFi specs from KR-Rage-Figma"
```

## ⚠️ Files to PRESERVE (Don't Delete)

These exist on KR-Rage-Figma and were intentionally removed in restoration:

1. **`docs/design/hifi/*.md`** (11 files) - Detailed implementation specs
2. **`frontend/src/components/ui/__tests__/*.test.tsx`** (5 files) - Component tests
3. **`frontend/src/components/ui/*.stories.tsx`** (9 files) - Storybook docs

**Action**: Move to `*-legacy/` directories instead of deleting.

## 📊 Statistics

| Metric | Count | Action |
|--------|-------|--------|
| Files corrupted | 0 | ✅ No action needed |
| Git commits lost | ~29 | Use restoration branch |
| Files to restore | 140+ | Follow priority matrix |
| Files to preserve | 25+ | From KR-Rage-Figma |
| New components | 1 | M3Button (restore) |
| Modified components | 35 | Restore all |
| New scripts | 100+ | Restore (deduplicate) |

## 🎯 Priority Levels

### 🔥 CRITICAL (Day 1)
- Token tooling (2 files)
- M3Button (1 file)
- HiFi specs preservation (11 files)

### ✅ HIGH (Week 1)
- libs/ structure (full directory)
- Claude skills (5+ directories)
- Component updates (35 files)
- New docs (20+ files)

### ⚠️ MEDIUM (Week 2-3)
- Automation scripts (100+ files, deduplicate)
- Audit tools (10+ files)

## 📖 Full Documentation

See **`KR_RAGE_FIGMA_RESTORATION_ANALYSIS.md`** for:
- Detailed file-by-file analysis
- Corruption assessment for each category
- 6-phase restoration action plan
- Git forensics and recovery options
- Complete recommendations

## 🤖 Automated Validation

After restoration, run:

```bash
# 1. Generate tokens
python3 tools/scripts/build-m3-tokens.py

# 2. Validate tokens
python3 tools/scripts/design-validation/validate-tokens.py

# 3. Build frontend
cd frontend && yarn build

# 4. Test components
yarn test
```

## 🆘 Quick Decision Tree

**Q: Should I use KR-Rage-Figma or restoration-KR-Rage-Figma-v2.0?**
- A: Use restoration as base, cherry-pick from KR-Rage-Figma

**Q: Which files are corrupted?**
- A: None! Only git history is corrupted

**Q: What's the fastest way to get working?**
- A: Copy 5 critical files (see top list above)

**Q: Should I delete the test files?**
- A: NO - preserve in legacy directories

**Q: Can I trust the design tokens?**
- A: YES - identical on both branches, fully intact

## ✅ Success Criteria

You'll know restoration is complete when:

- [ ] `build-m3-tokens.py` generates CSS without errors
- [ ] M3Button component renders in React
- [ ] HiFi specs exist in `docs/design/hifi-legacy/`
- [ ] Frontend builds successfully
- [ ] Token validation passes
- [ ] No TypeScript errors
- [ ] All 11 HiFi specs preserved

---

**Last Updated**: 2026-02-17  
**Status**: ✅ Analysis Complete - Ready for Restoration
