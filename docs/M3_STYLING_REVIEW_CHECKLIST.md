# M3 Styling Review Checklist

**Purpose:** Systematic review of all M3 components for visual consistency  
**Status:** Ready to begin  
**Estimated Time:** 2-3 hours

---

## 📊 Current Status (From Analysis)

- **Total CSS Files:** 52
- **Total Token Usage:** 2,015 tokens ✅
- **Files with Issues:** 49
- **Hardcoded Colors:** 6 (low priority)
- **Hardcoded Spacing:** 193 (high priority)
- **Hardcoded Shadows:** 1 (low priority)
- **Components with No Issues:** 3 ✅

---

## ✅ Phase 1: Automated Fixes (30 min)

### Step 1: Fix Hardcoded Spacing
```bash
# Review what will be changed
grep -rE "\b(4|8|12|16|20|24|28|32|48|64)px\b" frontend/src/components/m3-expressive --include="*.css" | head -20

# Run automated fix (creates backups)
./scripts/fix-hardcoded-spacing.sh

# Review changes
git diff frontend/src/components/m3-expressive

# If satisfied, remove backups
find frontend/src/components/m3-expressive -name "*.bak" -delete
```

**Expected Result:** ~193 hardcoded spacing values fixed

---

### Step 2: Fix Hardcoded Colors
```bash
# Find hardcoded colors
grep -rE "(#[0-9a-fA-F]{3,6}|rgb\(|rgba\()" frontend/src/components/m3-expressive --include="*.css"

# Review each instance and replace manually
# Common replacements:
# #00897B → var(--md-sys-color-primary-50)
# #FF7043 → var(--md-sys-color-secondary-50)
# #D32F2F → var(--md-sys-color-error-50)
```

**Expected Result:** 6 hardcoded colors fixed

---

### Step 3: Fix Hardcoded Shadows
```bash
# Find hardcoded shadows
grep -rE "box-shadow:\s*[0-9]" frontend/src/components/m3-expressive --include="*.css"

# Replace with elevation tokens
# box-shadow: 0 2px 4px rgba(0,0,0,0.1) → box-shadow: var(--md-sys-elevation-level1)
```

**Expected Result:** 1 hardcoded shadow fixed

---

## ✅ Phase 2: Visual Consistency Review (1 hour)

### Component Categories to Review

#### Layout Components
- [ ] **M3Card** - Padding, elevation, border-radius
- [ ] **M3Modal** - Backdrop, elevation, spacing
- [ ] **M3Dialog** - Compact spacing, elevation
- [ ] **M3Drawer** - Width, slide animation
- [ ] **M3Accordion** - Item spacing, borders

#### Navigation Components
- [ ] **M3Menu** - Dropdown spacing, elevation
- [ ] **M3TabBar** - Tab spacing, indicator
- [ ] **M3Breadcrumb** - Separator, spacing
- [ ] **M3Stepper** - Step spacing, colors
- [ ] **M3Pagination** - Button spacing
- [ ] **M3BottomNavigation** - Icon sizes, spacing

#### Data Display Components
- [ ] **M3Table** - Row height, cell padding
- [ ] **M3List** - Item spacing, dividers
- [ ] **M3DataGrid** - Cell padding, borders
- [ ] **M3Badge** - Size variants, positioning
- [ ] **M3Chip** - Spacing, delete button
- [ ] **M3Tag** - Variant colors, sizes
- [ ] **M3Progress** - Bar height, track

#### Feedback Components
- [ ] **M3Alert** - Severity colors, icon spacing
- [ ] **M3Toast** - Position, animation
- [ ] **M3Snackbar** - Bottom spacing, actions
- [ ] **M3Tooltip** - Delay, placement
- [ ] **M3Loader** - Size variants
- [ ] **M3Spinner** - Animation, size
- [ ] **M3Skeleton** - Animation, dimensions

#### Advanced Forms
- [ ] **M3DatePicker** - Calendar spacing, day buttons
- [ ] **M3TimePicker** - Input consistency
- [ ] **M3Slider** - Track height, thumb size
- [ ] **M3RangeSlider** - Handle spacing
- [ ] **M3Autocomplete** - Dropdown elevation
- [ ] **M3MultiSelect** - Chip spacing

---

## ✅ Phase 3: Cross-Component Comparison (30 min)

### Spacing Consistency Check
- [ ] All buttons have consistent padding
- [ ] All inputs have consistent height
- [ ] All cards have consistent padding
- [ ] All modals have consistent spacing
- [ ] All lists have consistent item spacing

### Color Consistency Check
- [ ] Primary actions use primary color
- [ ] Error states use error color
- [ ] Success states use appropriate color
- [ ] Disabled states use consistent opacity
- [ ] Hover states use consistent colors

### Elevation Consistency Check
- [ ] Cards use level 1-2
- [ ] Modals use level 3
- [ ] Hover states increase by 1 level
- [ ] Dropdowns use appropriate elevation

---

## ✅ Phase 4: M3 Design Spec Comparison (30 min)

### Reference Materials
- **M3 Design Spec:** https://m3.material.io/
- **Token Reference:** `docs/M3_DESIGN_SPEC_REFERENCE.md`
- **Design Tokens:** `frontend/src/styles/m3-design-tokens.css`

### Comparison Points
- [ ] Component sizes match M3 spec
- [ ] Spacing follows M3 4px grid
- [ ] Colors match M3 color system
- [ ] Typography uses M3 type scale
- [ ] Elevation levels are appropriate
- [ ] Motion timing follows M3 spec

---

## 🔧 Tools Available

### 1. Token Consistency Checker
```bash
./scripts/verify-m3-token-consistency.sh
```

### 2. Styling Report Generator
```bash
python3 scripts/generate-m3-styling-report.py
# Output: m3-styling-report.json
```

### 3. Hardcoded Spacing Fixer
```bash
./scripts/fix-hardcoded-spacing.sh
# Creates backups, fixes common spacing values
```

### 4. Visual Inspection
```bash
# Storybook
yarn storybook

# Integration test page
# Navigate to: http://localhost:3000/m3-integration-test
```

---

## 📋 Review Workflow

### Day 1: Automated Fixes
1. Run spacing fixer script
2. Review and commit changes
3. Fix remaining hardcoded colors
4. Fix hardcoded shadows

### Day 2: Visual Review
1. Open Storybook
2. Review each component category
3. Note visual inconsistencies
4. Create fix list

### Day 3: Implementation
1. Fix identified issues
2. Re-run analysis tools
3. Verify visual consistency
4. Update documentation

---

## ✅ Success Criteria

**Styling Fine-Tuning Complete When:**
- ✅ All hardcoded values replaced with tokens
- ✅ Visual consistency across all components
- ✅ Components match M3 design spec
- ✅ Styling report shows < 5 issues
- ✅ Visual inspection passes
- ✅ All tests pass

---

## 📊 Progress Tracking

| Phase | Status | Time | Issues Fixed |
|-------|--------|------|--------------|
| Phase 1: Automated Fixes | ⏳ Pending | 30 min | ~200 |
| Phase 2: Visual Review | ⏳ Pending | 1 hour | TBD |
| Phase 3: Cross-Component | ⏳ Pending | 30 min | TBD |
| Phase 4: Spec Comparison | ⏳ Pending | 30 min | TBD |

**Total Estimated Time:** 2.5 hours

---

## 🎯 Priority Order

1. **High Priority:** Fix hardcoded spacing (193 instances)
2. **Medium Priority:** Visual consistency review
3. **Low Priority:** Hardcoded colors (6 instances)
4. **Low Priority:** Hardcoded shadows (1 instance)

---

**Last Updated:** 2025-01-XX  
**Status:** ✅ Ready to begin styling fine-tuning

