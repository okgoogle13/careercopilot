# Phase 4C Migration Manifest

**Status:** In Progress (2/22 components migrated)
**Date Started:** November 26, 2025
**Orchestration:** batch-migration-orchestrator + manual migration skills

## Summary

Phase 4C targets 22 form and utility components for M3 migration. First batch (Alert, Badge) completed using manual migration. Remaining components will be migrated using frontend-migration skills.

---

## Migrated Components (2)

### ✅ Alert

- **Path:** `frontend/src/components/Alert/Alert.tsx`
- **Status:** MIGRATED
- **Changes:** MUI Alert wrapper → M3Alert wrapper
- **Tokens Used:** M3 CSS variables via M3Alert
- **Breaking Changes:** None (API compatible)
- **Test Status:** Pending update

### ✅ Badge

- **Path:** `frontend/src/components/badge/badge.tsx`
- **Status:** MIGRATED
- **Changes:** MUI Chip wrapper → M3Badge wrapper
- **Tokens Used:** M3 CSS variables via M3Badge
- **Breaking Changes:** None (API compatible)
- **Test Status:** Pending update

---

## Components Requiring Migration (20)

### HIGH PRIORITY: Dialog & Modal Components (5)

#### 1. Dialog (Core Modal)

- **Path:** `frontend/src/components/ui/Dialog/Dialog.tsx`
- **Current:** MUI Dialog wrapper with custom styling
- **Target:** M3Dialog wrapper
- **Complexity:** HIGH
- **Time Est:** 30-40 min
- **Migration Steps:**
  1. Replace MUI Dialog with M3Dialog
  2. Replace MUI DialogTitle with M3DialogHeader + M3DialogTitle
  3. Replace MUI DialogContent with M3DialogContent
  4. Replace MUI DialogActions with M3DialogActions
  5. Replace MUI Button with M3Button
  6. Update ref forwarding for M3Dialog
  7. Map theme.spacing() calls to M3 spacing tokens

**Key Issues to Fix:**

- `color: theme.palette.grey[500]` (line 253) → M3 token
- `theme.spacing()` for padding/margins → M3 spacing tokens
- MUI SxProps → M3 CSS classes

---

#### 2. ConfirmTagsModal

- **Path:** `frontend/src/components/ConfirmTagsModal/ConfirmTagsModal.tsx`
- **Current:** MUI Dialog with form controls
- **Target:** M3Dialog with M3 form components
- **Complexity:** HIGH
- **Time Est:** 40-50 min
- **Migration Steps:**
  1. Replace MUI Dialog with M3Dialog
  2. Replace MUI TextField with M3Input
  3. Replace MUI RadioGroup/Radio with M3RadioGroup/M3Radio
  4. Replace MUI Button with M3Button
  5. Add M3FormControl wrapper for validation
  6. Update all theme.spacing() and color references

**Key Issues to Fix:**

- Form validation styling
- Radio group layout and spacing
- Error message styling

---

#### 3. ApplicationGeneratorModal

- **Path:** `frontend/src/components/ApplicationGeneratorModal.tsx`
- **Current:** MUI Dialog with stepper and chip
- **Target:** M3Dialog with M3 stepper and badge
- **Complexity:** HIGH (includes Stepper)
- **Time Est:** 50-60 min
- **Migration Steps:**
  1. Replace MUI Dialog with M3Dialog
  2. Replace MUI Button with M3Button
  3. Replace MUI Chip with M3Badge
  4. Replace MUI LinearProgress with M3Progress
  5. Replace MUI Stepper (custom implementation needed)
  6. Update all token references

**Key Issues to Fix:**

- Stepper component (MUI Stepper → custom M3 stepper)
- LinearProgress styling
- Chip/Badge layout

---

#### 4. SmartUploadModal

- **Path:** `frontend/src/components/SmartUploadModal.tsx`
- **Current:** MUI Dialog with upload area
- **Target:** M3Dialog with M3Alert
- **Complexity:** MEDIUM
- **Time Est:** 30-40 min
- **Migration Steps:**
  1. Replace MUI Dialog with M3Dialog
  2. Replace MUI Alert with M3Alert
  3. Replace MUI Button with M3Button
  4. Replace MUI Chip with M3Badge
  5. Replace MUI Stack with flex layout using M3 spacing
  6. Update all token references

**Key Issues to Fix:**

- Alert styling
- Layout/spacing
- Button grouping

---

#### 5. Toast (Notification)

- **Path:** `frontend/src/components/ui/Toast/Toast.tsx`
- **Current:** MUI Snackbar + Alert
- **Target:** M3Toast (custom component) + M3Alert
- **Complexity:** MEDIUM
- **Time Est:** 30-40 min
- **Migration Steps:**
  1. Create custom M3Toast wrapper (replaces Snackbar)
  2. Replace MUI Alert with M3Alert
  3. Implement custom positioning CSS (replaces SnackbarOrigin)
  4. Add M3 motion tokens for animations
  5. Update ToastContext if needed

**Key Issues to Fix:**

- Snackbar positioning → CSS positioning classes
- Animation/transition tokens
- Duration/easing tokens

---

### MEDIUM PRIORITY: Form Components (2)

#### 6. M3Select (Incomplete)

- **Path:** `frontend/src/components/M3Select/M3Select.tsx`
- **Current:** Incomplete - renders as <input> not dropdown
- **Target:** Full M3 Select dropdown component
- **Complexity:** HIGH (requires implementation)
- **Time Est:** 60-90 min
- **Issues:**
  - Uses `React.inputAttributes` (typo - should be `React.InputHTMLAttributes`)
  - Missing dropdown menu rendering
  - Missing options list
  - Missing value management
  - CSS file exists but incomplete

**Implementation Needs:**

- Proper <select> or custom dropdown rendering
- Options list with M3 styling
- Value selection logic
- Keyboard navigation
- M3 shape/color/spacing tokens

---

#### 7. M3DatePicker (Incomplete)

- **Path:** `frontend/src/components/M3DatePicker/M3DatePicker.tsx`
- **Current:** Incomplete - renders as <input> not calendar
- **Target:** Full M3 DatePicker with calendar UI
- **Complexity:** VERY HIGH (requires calendar implementation)
- **Time Est:** 90-120 min
- **Issues:**
  - Uses `React.inputAttributes` (typo)
  - Missing calendar picker UI
  - Missing date selection logic
  - Missing validation/formatting
  - CSS file incomplete

**Implementation Needs:**

- Calendar grid rendering
- Month/year navigation
- Date selection logic
- Date validation and formatting
- M3 tokens for styling
- Accessibility (keyboard navigation, ARIA)

---

### LOW PRIORITY: Tooltip/Popover Enhancements (2)

#### 8. M3Tooltip (Skeleton)

- **Path:** `frontend/src/components/ui/M3Tooltip.tsx`
- **Current:** Skeleton - just styled div
- **Target:** Full Tooltip with trigger and positioning
- **Complexity:** MEDIUM
- **Time Est:** 40-50 min
- **Needs:**
  - Trigger element support (wrap pattern)
  - Positioning logic (top, bottom, left, right)
  - Show/hide animation with M3 motion tokens
  - Keyboard support (focus visibility)
  - Accessibility (role="tooltip", aria-label)
  - Collision detection

---

#### 9. M3Popover (Skeleton)

- **Path:** `frontend/src/components/ui/M3Popover.tsx`
- **Current:** Skeleton - just styled div
- **Target:** Full Popover with trigger and positioning
- **Complexity:** MEDIUM
- **Time Est:** 40-50 min
- **Needs:**
  - Trigger element support (wrap pattern)
  - Positioning logic (top, bottom, left, right)
  - Show/hide animation with M3 motion tokens
  - Click-outside handler
  - Keyboard support (Escape to close, Tab handling)
  - Accessibility (role="dialog", aria-modal)

---

## Execution Strategy

### Batch 1: Dialog & Modal Components (High Priority)

**Expected Time:** 3-4 hours
**Components:** Dialog, ConfirmTagsModal, ApplicationGeneratorModal, SmartUploadModal, Toast

**Orchestration Approach:**

1. Use `batch-migration-orchestrator` to coordinate all 8 frontend-migration skills
2. Skills will process in sequence:
   - m3-layout-refactor: Handle spacing/layout
   - m3-color-themer: Handle colors
   - m3-typography-classifier: Handle type scales
   - m3-editorial-stylist: Handle editorial conventions
   - m3-shape-refactor: Handle border radius
   - m3-elevation-refactor: Handle shadows
   - m3-icon-replacer: Handle icons
   - m3-motion-applier: Handle animations
3. Manual review and testing after batch completion

### Batch 2: Form Components (Lower Priority)

**Expected Time:** 3-4 hours
**Components:** M3Select completion, M3DatePicker completion

**Approach:**

- These require implementation (not just token replacement)
- May need custom component development
- Consider deferring to Phase 4D if time-constrained

### Batch 3: Tooltip/Popover Enhancements

**Expected Time:** 2-3 hours
**Components:** M3Tooltip completion, M3Popover completion

**Approach:**

- Build out trigger logic and positioning
- Add animations with M3 motion tokens
- Comprehensive accessibility testing

---

## Validation Checklist (Per Component)

After each component migration:

- [ ] TypeScript compilation clean (`yarn build`)
- [ ] No hardcoded color values (grep for `#[0-9a-f]{3,6}`)
- [ ] All spacing uses M3 tokens (`--md-sys-spacing-*`)
- [ ] All colors use M3 tokens (`--md-sys-color-*`)
- [ ] All typography uses M3 type scale (`--md-sys-typescale-*`)
- [ ] All shapes use M3 tokens (`--md-sys-shape-corner-*`)
- [ ] All shadows use M3 elevation tokens (`--md-sys-elevation-*`)
- [ ] All animations use M3 motion tokens (`--md-sys-motion-*`)
- [ ] WCAG contrast compliance verified
- [ ] No performance regression
- [ ] Responsive design verified (mobile/tablet/desktop)
- [ ] Storybook stories updated (if exists)
- [ ] Unit tests updated (if exists)

---

## Success Criteria

**Phase 4C Complete When:**

- ✅ 22 components migrated to M3
- ✅ 0 hardcoded colors/spacing values
- ✅ 100% M3 token compliance
- ✅ All TypeScript errors resolved
- ✅ All tests passing
- ✅ WCAG AA compliance verified
- ✅ Visual regression testing passed

---

## Risk Mitigation

| Risk                          | Probability | Impact | Mitigation                                 |
| ----------------------------- | ----------- | ------ | ------------------------------------------ |
| Select/DatePicker complexity  | Medium      | Medium | Defer implementation to Phase 4D if needed |
| Modal state management issues | Low         | Medium | Comprehensive state testing                |
| Responsive design breaks      | Low         | Medium | Test all breakpoints (xs, sm, md, lg, xl)  |
| Animation performance         | Low         | Low    | Use GPU-accelerated CSS transforms only    |

---

## Notes

- Dialog component is critical (core pattern for modals)
- Toast component impacts UX (notifications)
- M3Select and M3DatePicker are incomplete implementations (consider deferring)
- Tooltip/Popover enhancements are nice-to-have (can defer)
- All other components follow similar MUI → M3 migration pattern

---

## Timeline (Estimated)

- **Batch 1 (Dialogs):** 1-2 days
- **Batch 2 (Forms):** 1 day (or defer)
- **Batch 3 (Tooltip/Popover):** 0.5 days (or defer)
- **Validation & Testing:** 1 day
- **Total Phase 4C:** 3-4 days
