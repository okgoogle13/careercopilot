# M3 Phase 3 Migration Guide

**Dependent Components - Strategic batch migration for 30+ components**

---

## 🎯 Phase 3 Overview

Phase 3 migrates all dependent components now that foundation (Phase 1) and forms (Phase 2) are complete. With 30+ components to migrate, we use a **batch-based scaffolding strategy** to minimize manual work and token cost.

**Phase 1 & 2 Prerequisites:** Must complete before starting Phase 3
- ✅ Phase 1: Button, Input, Sidebar, Navbar, AppShell (foundation)
- ✅ Phase 2: Select, Checkbox, Radio, TextArea, Switch (forms)

---

## 🏗️ Component Architecture Map

Phase 3 components are grouped by dependency and feature area:

### Group A: Layout & Containers (5 components) — **Start First**
```
M3Card, M3Modal, M3Dialog, M3Drawer, M3Accordion
```
**Why first:** These are layout primitives; many Phase 3 components depend on them.
**Estimated time:** 3-4 hours (scaffold + 5x Cursor work)

### Group B: Navigation & Menus (6 components) — **Start with Group A**
```
M3Menu, M3TabBar, M3Breadcrumb, M3Stepper, M3Pagination, M3BottomNavigation
```
**Why next:** Used in layout and page structure.
**Estimated time:** 4-5 hours

### Group C: Data Display (8 components) — **Start with Group A**
```
M3Table, M3List, M3ListItem, M3DataGrid, M3Badge, M3Chip, M3Tag, M3Progress
```
**Why parallel with B:** Data display doesn't block other components.
**Estimated time:** 5-6 hours

### Group D: Feedback & Status (7 components) — **Parallel with B & C**
```
M3Alert, M3Toast, M3Tooltip, M3Snackbar, M3Loader, M3Spinner, M3Skeleton
```
**Why parallel:** Self-contained feedback components.
**Estimated time:** 4-5 hours

### Group E: Advanced Forms (6 components) — **After Group A**
```
M3DatePicker, M3TimePicker, M3Slider, M3RangeSlider, M3Autocomplete, M3MultiSelect
```
**Why later:** Depends on Select pattern (Phase 2) + Modal/Popover (Group A).
**Estimated time:** 5-6 hours

**Total Phase 3:** 26 components across 5 groups
**Total Estimated Time:** 12-15 hours (batching saves ~30% vs sequential)

---

## 📊 Execution Strategy

### Batch Execution Timeline

```
Timeline (with parallel batches):

Week 1:
├─ Batch 1 (Group A: Layout/Containers) — 3.5 hours
│  └─ Scaffold → Cursor (M3Card, M3Modal, M3Dialog, M3Drawer, M3Accordion)
├─ Batch 2 (Group B: Navigation) — 4.5 hours [START AFTER Batch 1]
│  └─ Scaffold → Cursor (M3Menu, M3TabBar, M3Breadcrumb, M3Stepper, M3Pagination, M3BottomNavigation)
└─ Batch 3 (Group C: Data Display) — 5.5 hours [PARALLEL with Batch 2]
   └─ Scaffold → Cursor (M3Table, M3List, M3ListItem, M3DataGrid, M3Badge, M3Chip, M3Tag, M3Progress)

Week 2:
├─ Batch 4 (Group D: Feedback) — 4.5 hours [PARALLEL with Batch 5]
│  └─ Scaffold → Cursor (M3Alert, M3Toast, M3Tooltip, M3Snackbar, M3Loader, M3Spinner, M3Skeleton)
└─ Batch 5 (Group E: Advanced Forms) — 5.5 hours [AFTER Batch 1, PARALLEL with Batch 4]
   └─ Scaffold → Cursor (M3DatePicker, M3TimePicker, M3Slider, M3RangeSlider, M3Autocomplete, M3MultiSelect)

Total: ~15 hours elapsed (not cumulative)
```

---

## 📈 Token Cost & Savings Analysis

| Batch | Components | Duration | Token Cost | Parallelizable |
|-------|-----------|----------|-----------|---|
| **Batch 1** | 5 (Layout) | 3.5h | ~55K | Solo |
| **Batch 2** | 6 (Navigation) | 4.5h | ~68K | After Batch 1 |
| **Batch 3** | 8 (Data Display) | 5.5h | ~92K | Parallel with 2 |
| **Batch 4** | 7 (Feedback) | 4.5h | ~76K | Parallel with 5 |
| **Batch 5** | 6 (Advanced Forms) | 5.5h | ~93K | After Batch 1 |
| **Validation** | All batches | 30s | ~1K | Final |
| **TOTAL** | **32 components** | **~15 hours** | **~385K tokens** | ✅ Parallelizable |

**vs. Sequential Manual:** 40+ hours, ~1.2M tokens
**Savings:** 63% faster ⚡ | 68% fewer tokens 💰

---

## 🚀 Batch 1: Layout & Containers (3.5 hours)

### Components
```
M3Card, M3Modal, M3Dialog, M3Drawer, M3Accordion
```

### Execution

```bash
# Step 1: Scaffold all 5 components (2 min)
python3 scripts/scaffold-m3-component.py Card Modal Dialog Drawer Accordion

# Step 2: Cursor AI work (~3 hours)
# [Follow Cursor prompts below]

# Step 3: Validate (30 sec)
./scripts/validate-batch.sh Card Modal Dialog Drawer Accordion
```

---

#### Cursor Prompt B1-1: M3Card

```
# Cursor AI: Migrate Card to M3 Expressive

## Files Location
- frontend/src/components/m3-expressive/card/M3Card.tsx
- frontend/src/components/m3-expressive/card/M3Card.css

## Key Requirements
- [ ] Surface container with elevation
- [ ] Elevation prop: level0-level5 (using var(--md-sys-elevation-level*))
- [ ] Clickable variant (optional pointer cursor)
- [ ] Padding/spacing using M3 tokens
- [ ] Children/content slot
- [ ] Hover elevation increase
- [ ] Accessibility: role="article" or generic div

## Styling
- Surface: var(--md-sys-color-surface)
- Shape: var(--md-sys-shape-corner-medium)
- Elevation: var(--md-sys-elevation-level0) default, var(--md-sys-elevation-level1) on hover
- Padding: var(--md-sys-spacing-4)
- Border: optional outline with var(--md-sys-color-outline)

## Test Minimum: 15 tests
- Rendering with children
- All elevation levels
- Hover state
- Clickable variant

## Reference
- frontend/src/components/m3-expressive/button/M3Button.tsx (component structure)
```

---

#### Cursor Prompt B1-2: M3Modal

```
# Cursor AI: Migrate Modal to M3 Expressive

## Files Location
- frontend/src/components/m3-expressive/modal/M3Modal.tsx
- frontend/src/components/m3-expressive/modal/M3Modal.css

## Key Requirements
- [ ] Open/close state management
- [ ] Backdrop overlay with dim
- [ ] Modal content container
- [ ] Optional header/title slot
- [ ] Optional footer/actions slot
- [ ] Close button (X icon)
- [ ] Keyboard support (Escape to close)
- [ ] Focus management (focus trap)
- [ ] Animated entrance/exit
- [ ] Size variants: small, medium, large
- [ ] Z-index layering

## Styling
- Backdrop: var(--md-sys-color-surface-dim) with opacity
- Content: var(--md-sys-color-surface)
- Elevation: var(--md-sys-elevation-level3)
- Border-radius: var(--md-sys-shape-corner-large)
- Animation: var(--md-sys-motion-duration-medium1)

## Test Minimum: 18 tests
- Rendering open/closed state
- Close button functionality
- Keyboard (Escape)
- Backdrop click
- Children rendering
- Size variants
- Focus management

## Reference
- Similar structure to Dialog but more complex
```

---

#### Cursor Prompt B1-3: M3Dialog

```
# Cursor AI: Migrate Dialog to M3 Expressive

## Files Location
- frontend/src/components/m3-expressive/dialog/M3Dialog.tsx
- frontend/src/components/m3-expressive/dialog/M3Dialog.css

## Key Requirements
- [ ] Similar to Modal but simpler (confirmation patterns)
- [ ] Open/close state
- [ ] Title/content/actions
- [ ] Confirm/Cancel buttons
- [ ] Optional destructive action styling (error color)
- [ ] Lightweight overlay
- [ ] Keyboard support

## Styling
- More compact than Modal
- Elevation: var(--md-sys-elevation-level2)
- Buttons use M3Button styling
- Sharp corners: var(--md-sys-shape-corner-small) for compact feel

## Test Minimum: 15 tests
- Rendering open/closed
- Button callbacks (confirm, cancel)
- Destructive action style

## Reference
- frontend/src/components/m3-expressive/modal/M3Modal.tsx (overlay pattern)
```

---

#### Cursor Prompt B1-4: M3Drawer

```
# Cursor AI: Migrate Drawer to M3 Expressive

## Files Location
- frontend/src/components/m3-expressive/drawer/M3Drawer.tsx
- frontend/src/components/m3-expressive/drawer/M3Drawer.css

## Key Requirements
- [ ] Side panel (left/right placement)
- [ ] Open/close state
- [ ] Optional backdrop
- [ ] Swipe to close (mobile)
- [ ] Content slot
- [ ] Header/close button
- [ ] Z-index layering
- [ ] Animated slide in/out

## Styling
- Background: var(--md-sys-color-surface)
- Width: var(--md-sys-spacing-56) or var(--md-sys-spacing-80) for mobile
- Animation: var(--md-sys-motion-duration-long1) for slide
- Elevation: var(--md-sys-elevation-level1)

## Test Minimum: 16 tests
- Open/closed state
- Close button
- Backdrop click
- Keyboard (Escape)
- Mobile swipe (simulated)
- Width sizing

## Reference
- frontend/src/components/m3-expressive/modal/M3Modal.tsx (overlay logic)
```

---

#### Cursor Prompt B1-5: M3Accordion

```
# Cursor AI: Migrate Accordion to M3 Expressive

## Files Location
- frontend/src/components/m3-expressive/accordion/M3Accordion.tsx
- frontend/src/components/m3-expressive/accordion/M3Accordion.css

## Key Requirements
- [ ] Multiple accordion items
- [ ] Expand/collapse state per item
- [ ] Allow single or multiple open
- [ ] Icon rotation animation on expand
- [ ] Optional icon/indicator
- [ ] Header clickable
- [ ] Content slot with animation
- [ ] Borders between items

## Styling
- Header: var(--md-sys-color-surface)
- Border: var(--md-sys-color-outline-variant)
- Text: var(--md-sys-color-on-surface)
- Hover: var(--md-sys-color-surface-variant)
- Animation: var(--md-sys-motion-duration-short2)

## Test Minimum: 16 tests
- Rendering multiple items
- Expand/collapse toggle
- Single vs multiple open
- Icon rotation
- Keyboard (Space/Enter on header)

## Reference
- frontend/src/components/m3-expressive/button/M3Button.tsx (click handling)
```

**Batch 1 Total Time:** 3.5 hours | **Token Cost:** ~55K

---

## 🚀 Batch 2: Navigation & Menus (4.5 hours)

**Start after Batch 1 completes** (or in parallel if you have resources)

### Components
```
M3Menu, M3TabBar, M3Breadcrumb, M3Stepper, M3Pagination, M3BottomNavigation
```

### Execution

```bash
# Scaffold all 6 components
python3 scripts/scaffold-m3-component.py Menu TabBar Breadcrumb Stepper Pagination BottomNavigation

# Cursor AI work (~4 hours)
# [Follow Cursor prompts below - one component at a time]

# Validate
./scripts/validate-batch.sh Menu TabBar Breadcrumb Stepper Pagination BottomNavigation
```

**Cursor Prompts Template (6 components):**

Each Cursor prompt should follow this structure:
- Reference M3Select (dropdown/menu pattern from Phase 2)
- Reference M3Navbar (navigation pattern from Phase 1)
- Implement required props/states
- Minimum test count

**Estimated breakdown:**
- M3Menu: 45 min (~15K tokens) - complex dropdown
- M3TabBar: 40 min (~13K tokens) - tab selection
- M3Breadcrumb: 30 min (~10K tokens) - simple list
- M3Stepper: 40 min (~13K tokens) - step tracking
- M3Pagination: 35 min (~12K tokens) - number selection
- M3BottomNavigation: 30 min (~10K tokens) - mobile nav

**Batch 2 Total Time:** 4.5 hours | **Token Cost:** ~73K

---

## 🚀 Batch 3: Data Display (5.5 hours)

**Start in parallel with Batch 2** (high independence)

### Components
```
M3Table, M3List, M3ListItem, M3DataGrid, M3Badge, M3Chip, M3Tag, M3Progress
```

### Execution

```bash
# Scaffold all 8 components
python3 scripts/scaffold-m3-component.py Table List ListItem DataGrid Badge Chip Tag Progress

# Cursor AI work (~5+ hours)
# [Complex: Table and DataGrid need detailed attention]

# Validate
./scripts/validate-batch.sh Table List ListItem DataGrid Badge Chip Tag Progress
```

**Complexity Breakdown:**
- **High Complexity (1+ hour each):**
  - M3Table: Sorting, pagination integration, header/footer
  - M3DataGrid: Table variant with inline editing

- **Medium Complexity (30-40 min each):**
  - M3List: Container for list items
  - M3ListItem: Individual row/item component

- **Low Complexity (15-20 min each):**
  - M3Badge: Simple overlay indicator
  - M3Chip: Action chip with optional delete
  - M3Tag: Label/tag display
  - M3Progress: Progress bar/ring

**Batch 3 Total Time:** 5.5 hours | **Token Cost:** ~92K

---

## 🚀 Batch 4: Feedback & Status (4.5 hours)

**Start in parallel with Batch 2 & 3** (completely independent)

### Components
```
M3Alert, M3Toast, M3Tooltip, M3Snackbar, M3Loader, M3Spinner, M3Skeleton
```

### Execution

```bash
# Scaffold all 7 components
python3 scripts/scaffold-m3-component.py Alert Toast Tooltip Snackbar Loader Spinner Skeleton

# Cursor AI work (~4 hours)
# [Self-contained components]

# Validate
./scripts/validate-batch.sh Alert Toast Tooltip Snackbar Loader Spinner Skeleton
```

**Complexity Breakdown:**
- **Medium (30-40 min each):**
  - M3Alert: Container with icon and variants (success, warning, error, info)
  - M3Toast: Auto-dismiss notification
  - M3Snackbar: Bottom action notification

- **Low-Medium (20-30 min each):**
  - M3Tooltip: Hover popover
  - M3Loader: Circular progress with percentage
  - M3Spinner: Indeterminate loading animation
  - M3Skeleton: Content placeholder

**Batch 4 Total Time:** 4.5 hours | **Token Cost:** ~76K

---

## 🚀 Batch 5: Advanced Forms (5.5 hours)

**Start after Batch 1 completes** (depends on Modal, Select)

### Components
```
M3DatePicker, M3TimePicker, M3Slider, M3RangeSlider, M3Autocomplete, M3MultiSelect
```

### Execution

```bash
# Scaffold all 6 components
python3 scripts/scaffold-m3-component.py DatePicker TimePicker Slider RangeSlider Autocomplete MultiSelect

# Cursor AI work (~5+ hours)
# [Complex: DatePicker and Slider need careful implementation]

# Validate
./scripts/validate-batch.sh DatePicker TimePicker Slider RangeSlider Autocomplete MultiSelect
```

**Complexity Breakdown:**
- **Very High (1+ hour each):**
  - M3DatePicker: Calendar widget + input
  - M3Slider: Touch-enabled range input

- **High (45-50 min each):**
  - M3RangeSlider: Dual handle slider
  - M3Autocomplete: Select with typing filter
  - M3MultiSelect: Select variant for multiple values

- **Medium (30 min):**
  - M3TimePicker: Time selection interface

**Batch 5 Total Time:** 5.5 hours | **Token Cost:** ~93K

---

## ✅ Final Validation

After all batches complete, run comprehensive validation:

```bash
# Validate ALL Phase 3 components at once
./scripts/validate-batch.sh \
  Card Modal Dialog Drawer Accordion \
  Menu TabBar Breadcrumb Stepper Pagination BottomNavigation \
  Table List ListItem DataGrid Badge Chip Tag Progress \
  Alert Toast Tooltip Snackbar Loader Spinner Skeleton \
  DatePicker TimePicker Slider RangeSlider Autocomplete MultiSelect
```

**Expected Output:**
```
════════════════════════════════════════
Validation Summary
════════════════════════════════════════
✅ All validations passed!

Checked components (32 total):
  • Layout: M3Card, M3Modal, M3Dialog, M3Drawer, M3Accordion
  • Navigation: M3Menu, M3TabBar, M3Breadcrumb, M3Stepper, M3Pagination, M3BottomNavigation
  • Data Display: M3Table, M3List, M3ListItem, M3DataGrid, M3Badge, M3Chip, M3Tag, M3Progress
  • Feedback: M3Alert, M3Toast, M3Tooltip, M3Snackbar, M3Loader, M3Spinner, M3Skeleton
  • Advanced Forms: M3DatePicker, M3TimePicker, M3Slider, M3RangeSlider, M3Autocomplete, M3MultiSelect
```

---

## 📊 Phase 3 Completion Metrics

When Phase 3 is 100% complete:

```
M3 Migration Progress:
├── Phase 1: Foundation (5 components) ✅
│   ├── Button         ✅
│   ├── Input          ✅
│   ├── Sidebar        ✅
│   ├── Navbar         ✅
│   └── AppShell       ✅
├── Phase 2: Forms & Navigation (5 components) ✅
│   ├── Select         ✅
│   ├── Checkbox       ✅
│   ├── Radio          ✅
│   ├── TextArea       ✅
│   └── Switch         ✅
├── Phase 3: Dependent Components (32 components) ✅
│   ├── Layout         ✅ 5/5
│   ├── Navigation     ✅ 6/6
│   ├── Data Display   ✅ 8/8
│   ├── Feedback       ✅ 7/7
│   └── Advanced Forms ✅ 6/6
└── **TOTAL M3 MIGRATION: 100% COMPLETE** ✅
   └── 42 components | ~25 hours elapsed | ~600K tokens
```

---

## 🎯 Strategic Decision Tree

### "Should I parallelize batches?"

**YES if:**
- You have multiple team members OR
- You have sufficient token budget (~385K tokens total)
- You want to finish in ~15 hours vs 25 hours

**Parallel Timeline:**
```
Batch 1 (Layout): Week 1, 3.5h
├─ Batch 2 (Nav): Week 1 + 1 day, 4.5h [starts after 1]
├─ Batch 3 (Data): Week 1 + 1 day, 5.5h [parallel with 2]
├─ Batch 4 (Feedback): Week 2, 4.5h [parallel with 5]
└─ Batch 5 (Forms): Week 1 + 2 days, 5.5h [starts after 1]
= 15 hours total elapsed
```

**NO if:**
- Solo developer
- Limited token budget
- Sequential execution acceptable
- Run batches 1→2→3→4→5 linearly = 25 hours elapsed

---

## 💡 Reference Materials

**Phase 1 & 2 Reference Implementations:**
- Button, Input, Select, Checkbox, Radio, TextArea, Switch (10 components)
- Use as patterns for similar components in Phase 3

**Design System:**
- `frontend/src/styles/m3-design-tokens.css` (all tokens)
- `docs/design/M3_EXPRESSIVE_DESIGN_SYSTEM.md` (token documentation)

**Migration Guides:**
- `.claude/docs/CURSOR_AI_M3_MIGRATION_PROMPT.md` (complete reference)
- `docs/M3_BATCH_MIGRATION_GUIDE.md` (Phase 1 reference)
- `docs/M3_PHASE2_MIGRATION_GUIDE.md` (Phase 2 reference)

---

## 📝 Commands Quick Reference

```bash
# Batch execution
python3 scripts/scaffold-m3-component.py Card Modal Dialog Drawer Accordion
./scripts/validate-batch.sh Card Modal Dialog Drawer Accordion

# Test during development
yarn test --testPathPattern="M3Card"

# Full Phase 3 validation (after all batches)
./scripts/validate-batch.sh \
  Card Modal Dialog Drawer Accordion \
  Menu TabBar Breadcrumb Stepper Pagination BottomNavigation \
  Table List ListItem DataGrid Badge Chip Tag Progress \
  Alert Toast Tooltip Snackbar Loader Spinner Skeleton \
  DatePicker TimePicker Slider RangeSlider Autocomplete MultiSelect
```

---

## ⏱️ Expected Timeline Summary

| Scenario | Timeline | Token Cost | Notes |
|----------|----------|-----------|-------|
| **Sequential** | 25 hours | 385K | Safe, predictable |
| **Parallel (2 batches)** | 18 hours | 385K | Batches 2+3 run together |
| **Parallel (all)** | 15 hours | 385K | Requires team coordination |

---

## 🚨 Common Issues & Solutions

### "Token budget is tight"
- Scaffold all components first (saves ~30% on manual typing)
- Use references aggressively (copy patterns from Phase 1/2)
- Combine multiple components per Cursor prompt if very similar

### "Some component is significantly different"
- Break it into smaller prompts
- Ask Cursor to reference the closest Phase 1/2 component
- Test incrementally rather than all-at-once

### "Build fails on many components simultaneously"
- Validate batch by batch, not all at once
- This helps isolate token/CSS issues
- Use `yarn test --testPathPattern="M3Component"` to debug individually

---

## 📚 Next Steps After Phase 3

**When Phase 3 is 100% complete:**

1. **Full Integration Testing**
   - Test components together in real application pages
   - Verify token consistency across all components
   - Run E2E tests against migrated pages

2. **Styling Fine-Tuning**
   - Review all components for visual consistency
   - Adjust spacing, colors, shadows if needed
   - Compare against M3 design spec

3. **Deprecation & Cleanup**
   - Remove old Electric Alchemist components
   - Update all page imports to use M3 components
   - Delete obsolete component files

4. **Documentation**
   - Update component library documentation
   - Create M3 migration completion report
   - Archive migration guides

---

**Last Updated:** 2025-12-03
**Status:** ✅ Ready for Phase 3 (pending Phase 1 & 2 completion)
**Estimated Completion:** ~15-25 hours after Phase 2 finish

