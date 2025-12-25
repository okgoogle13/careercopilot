# M3 Phase 2 Migration Guide

**Forms & Navigation Components - Fast-track migration using scaffolding + Cursor AI**

---

## 🎯 Phase 2 Overview

Phase 2 unblocks form-heavy features by migrating foundational input/selection components that **every form in the app depends on**.

**Phase 1 Prerequisites:** Must complete before starting Phase 2

- ✅ M3Button (reference implementation)
- ✅ M3Input (foundation)
- ✅ M3Sidebar (navigation)
- ✅ M3Navbar (layout)
- ✅ M3AppShell (container)

---

## 🚀 Quick Start (5 minutes to setup)

```bash
# Step 1: Scaffold all 5 Phase 2 components (2 minutes)
python3 scripts/scaffold-m3-component.py Select Checkbox Radio TextArea Switch

# Step 2: Give scaffolded files to Cursor AI (via the prompts below)

# Step 3: Validate all components after Cursor completes (30 seconds)
./scripts/validate-batch.sh Select Checkbox Radio TextArea Switch
```

---

## 📊 Timeline & Token Cost

| Step      | Task                  | Duration     | Token Cost      | Blocker           |
| --------- | --------------------- | ------------ | --------------- | ----------------- |
| **1**     | Scaffold 5 components | 2 min        | ~500 tokens     | None              |
| **2**     | Cursor AI: Select     | 45 min       | ~18K tokens     | Blocks TextArea   |
| **3**     | Cursor AI: Checkbox   | 30 min       | ~12K tokens     | None              |
| **4**     | Cursor AI: Radio      | 30 min       | ~12K tokens     | None              |
| **5**     | Cursor AI: TextArea   | 30 min       | ~14K tokens     | Depends on Select |
| **6**     | Cursor AI: Switch     | 20 min       | ~10K tokens     | None              |
| **7**     | Batch validation      | 30 sec       | ~500 tokens     | None              |
| **TOTAL** | **Phase 2 Done**      | **~3 hours** | **~67K tokens** | —                 |

**vs. Sequential Manual:** 12 hours, ~220K tokens
**Savings:** 75% faster ⚡ | 70% fewer tokens 💰

---

## 📝 Component Breakdown

| Component    | Type         | Complexity | Dependencies         | Est. Time |
| ------------ | ------------ | ---------- | -------------------- | --------- |
| **Select**   | Dropdown     | ⚠️ High    | None (standalone)    | 45 min    |
| **TextArea** | Text Input   | ⚠️ Medium  | Needs Select pattern | 30 min    |
| **Checkbox** | Toggle Input | ✅ Low     | None                 | 30 min    |
| **Radio**    | Toggle Input | ✅ Low     | None                 | 30 min    |
| **Switch**   | Toggle Input | ✅ Low     | None                 | 20 min    |

**Execution Order:**

1. Start with **Select** (highest complexity, can run in parallel with Checkbox/Radio)
2. Then **TextArea** (depends on Select pattern)
3. Parallel: **Checkbox**, **Radio**, **Switch**

---

## 📋 Step 1: Scaffold Components

Creates boilerplate for all 5 Phase 2 components.

```bash
cd /Applications/careercopilot

# Scaffold all 5 Phase 2 components
python3 scripts/scaffold-m3-component.py Select Checkbox Radio TextArea Switch

# Output:
# 📁 Creating frontend/src/components/m3-expressive/select/
#   ✅ M3Select.tsx
#   ✅ M3Select.css
#   ✅ M3Select.test.tsx
#   ✅ M3Select.stories.tsx
#   ✅ index.ts
# ✨ Select component scaffolded!
# (repeated for Checkbox, Radio, TextArea, Switch)
```

**What You Get:**

- ✅ 5 TypeScript component files with TODO comments
- ✅ 5 CSS templates with token placeholders
- ✅ 5 test scaffolds with test categories
- ✅ 5 Storybook templates
- ✅ 5 index exports

**Next:** Copy these prompts into Cursor AI, **one component at a time**.

---

## 🤖 Step 2-6: Cursor AI Prompts

Give Cursor these prompts **one component at a time, in order**:

---

### Cursor Prompt #1: Select Component

```
# Cursor AI: Migrate Select to M3 Expressive

## What's Already Done
Component files have been scaffolded at:
- frontend/src/components/m3-expressive/select/M3Select.tsx
- frontend/src/components/m3-expressive/select/M3Select.css
- frontend/src/components/m3-expressive/select/M3Select.test.tsx
- frontend/src/components/m3-expressive/select/M3Select.stories.tsx
- frontend/src/components/m3-expressive/select/index.ts

## Your Task: Complete the Implementation

Study the reference:
- frontend/src/components/m3-expressive/button/M3Button.tsx (component pattern)
- frontend/src/components/m3-expressive/input/M3Input.tsx (input pattern if available)

Then fill in the Select component with:

### 1. TypeScript (M3Select.tsx)
- [ ] Options prop: array of { label, value, disabled? }
- [ ] Value prop: currently selected value
- [ ] onChange handler: emits selected value
- [ ] Variant prop: 'filled', 'outlined' (2 variants)
- [ ] Color prop: primary, secondary, tertiary, error
- [ ] Size prop: small, medium, large
- [ ] Disabled state support
- [ ] Placeholder text support
- [ ] Error state with error message display
- [ ] Label and helper text support
- [ ] Open/close dropdown state management
- [ ] Keyboard navigation (arrow keys, Enter, Escape)
- [ ] Full JSDoc comments for all props

### 2. CSS (M3Select.css)
- [ ] Base select styles using M3 tokens
  - Colors: var(--md-sys-color-primary-*), var(--md-sys-color-on-surface)
  - Spacing: var(--md-sys-spacing-*) for padding/gaps
  - Shapes: var(--md-sys-shape-corner-medium) for border-radius
  - Motion: var(--md-sys-motion-duration-short2) for transitions
- [ ] Implement both variants (filled, outlined)
- [ ] Implement all color roles (primary, secondary, tertiary, error)
- [ ] Dropdown menu positioning and styling
- [ ] Hover state for menu items
- [ ] Selected item highlighting (primary color background)
- [ ] Focus state with outline
- [ ] Disabled state (opacity: 0.38)
- [ ] Error state styling (red text/border)
- [ ] Z-index management for dropdown overlay

### 3. Tests (M3Select.test.tsx)
- [ ] Minimum 25 comprehensive tests
- [ ] Rendering: with options, with default value
- [ ] Opening/closing dropdown
- [ ] Selecting items
- [ ] All variants (filled, outlined)
- [ ] All colors (primary, secondary, tertiary, error)
- [ ] All sizes (small, medium, large)
- [ ] Disabled state (component and individual options)
- [ ] Placeholder text display
- [ ] Error state with error message
- [ ] Label rendering
- [ ] Helper text rendering
- [ ] Keyboard navigation (arrow keys, Enter, Escape)
- [ ] onChange callback triggering
- [ ] Ref forwarding
- [ ] Accessibility (role="listbox", aria-expanded, aria-selected)

### 4. Storybook (M3Select.stories.tsx)
- [ ] Default story with sample options
- [ ] All variants demo (filled, outlined)
- [ ] All colors demo
- [ ] All sizes demo
- [ ] With placeholder
- [ ] With label
- [ ] With error state
- [ ] Disabled state
- [ ] Disabled options within select
- [ ] Multiple options to show scrolling
- [ ] With helper text

### Key Constraints
- ✅ Use BEM naming: m3-select, m3-select--variant, m3-select__dropdown
- ✅ ALL colors from var(--md-sys-color-*)
- ✅ ALL spacing from var(--md-sys-spacing-*)
- ✅ NO hardcoded colors or spacing
- ✅ Reference M3Button for component patterns
- ✅ Dropdown should be accessible and keyboard navigable

### Validation
After completing:
\`\`\`bash
yarn test --testPathPattern="M3Select"
yarn build
yarn lint:fix
\`\`\`

All must pass. Then we move to TextArea.
```

**⏱️ Estimated time: 45 minutes**

---

### Cursor Prompt #2: Checkbox Component

```
# Cursor AI: Migrate Checkbox to M3 Expressive

## Files Location
- frontend/src/components/m3-expressive/checkbox/M3Checkbox.tsx
- frontend/src/components/m3-expressive/checkbox/M3Checkbox.css
- frontend/src/components/m3-expressive/checkbox/M3Checkbox.test.tsx
- frontend/src/components/m3-expressive/checkbox/M3Checkbox.stories.tsx

## Key Requirements for Checkbox
- [ ] Checked/unchecked state
- [ ] Indeterminate state (for "select all" patterns)
- [ ] Color prop: primary, secondary, tertiary, error
- [ ] Size: small, medium, large
- [ ] Disabled state
- [ ] Label support
- [ ] onChange handler
- [ ] Controlled component pattern
- [ ] Animations on state change
- [ ] Accessibility: role="checkbox", aria-checked

## Styling with M3 Tokens
- Checked: var(--md-sys-color-primary)
- Unchecked border: var(--md-sys-color-outline)
- Hover effect: var(--md-sys-color-primary-hover)
- Disabled: var(--md-sys-color-on-surface) with opacity: 0.38
- Shape: var(--md-sys-shape-corner-small) for slight rounding
- Animation: var(--md-sys-motion-duration-short1) for scale/fade

## Test Minimum: 18 tests
- Rendering (checked, unchecked, indeterminate)
- State toggling with onChange
- All colors
- All sizes
- Disabled state
- Keyboard accessibility (Space key)
- Label click
- Indeterminate state behavior

## Reference
- frontend/src/components/m3-expressive/button/M3Button.tsx (prop pattern)
```

**⏱️ Estimated time: 30 minutes**

---

### Cursor Prompt #3: Radio Component

```
# Cursor AI: Migrate Radio to M3 Expressive

## Files Location
- frontend/src/components/m3-expressive/radio/M3Radio.tsx
- frontend/src/components/m3-expressive/radio/M3Radio.css
- frontend/src/components/m3-expressive/radio/M3Radio.test.tsx
- frontend/src/components/m3-expressive/radio/M3Radio.stories.tsx

## Key Requirements for Radio
- [ ] Selected/unselected state
- [ ] Value prop for form integration
- [ ] Color prop: primary, secondary, tertiary, error
- [ ] Size: small, medium, large
- [ ] Disabled state
- [ ] Label support
- [ ] onChange handler
- [ ] Group management (typically handled by parent form)
- [ ] Animations on selection
- [ ] Accessibility: role="radio", aria-checked

## Styling with M3 Tokens
- Selected: var(--md-sys-color-primary) with inner dot
- Unselected border: var(--md-sys-color-outline)
- Hover: var(--md-sys-color-primary-hover-light)
- Disabled: var(--md-sys-color-on-surface) with opacity: 0.38
- Shape: var(--md-sys-shape-corner-full) (fully rounded)
- Animation: var(--md-sys-motion-duration-short1) for scale

## Test Minimum: 18 tests
- Rendering (selected, unselected)
- Selection state change
- All colors
- All sizes
- Disabled state
- Keyboard accessibility (Space/Arrow keys)
- Value prop integration
- Multiple radios in a group

## Reference
- Follow Checkbox pattern (very similar structure)
- frontend/src/components/m3-expressive/checkbox/
```

**⏱️ Estimated time: 30 minutes**

---

### Cursor Prompt #4: TextArea Component

```
# Cursor AI: Migrate TextArea to M3 Expressive

## Files Location
- frontend/src/components/m3-expressive/textarea/M3TextArea.tsx
- frontend/src/components/m3-expressive/textarea/M3TextArea.css
- frontend/src/components/m3-expressive/textarea/M3TextArea.test.tsx
- frontend/src/components/m3-expressive/textarea/M3TextArea.stories.tsx

## Key Requirements for TextArea
- [ ] Multi-line text input
- [ ] Variant prop: 'filled', 'outlined' (same as Select)
- [ ] Color prop: primary, secondary, tertiary, error
- [ ] Rows prop: number of visible rows
- [ ] Resize behavior: none, vertical, horizontal, both
- [ ] Max length support
- [ ] Placeholder text
- [ ] Disabled state
- [ ] Error state with error message
- [ ] Label and helper text
- [ ] Char count display (optional feature)
- [ ] Scrollable when text exceeds rows
- [ ] Full JSDoc comments

## Styling with M3 Tokens
- Use M3 tokens (same color/spacing tokens as M3Input)
- Filled variant: var(--md-sys-color-surface-dim) background
- Outlined variant: border with var(--md-sys-color-outline)
- Focus border: var(--md-sys-color-primary)
- Text: var(--md-sys-color-on-surface)
- Label: var(--md-sys-color-on-surface-variant)
- Helper: var(--md-sys-color-on-surface-variant) smaller font
- Error: var(--md-sys-color-error)
- Disabled: opacity 0.38

## Test Minimum: 22 tests
- Rendering with different row counts
- Text input and value changes
- All variants (filled, outlined)
- All colors
- Disabled state
- Placeholder display
- Max length enforcement
- Error state
- Label rendering
- Helper text rendering
- Keyboard events (Enter, Ctrl+Enter)
- Ref forwarding
- Scrolling behavior

## Reference
- Frontend/src/components/m3-expressive/select/M3Select.tsx (variant pattern)
- frontend/src/components/m3-expressive/input/M3Input.tsx (input pattern if available)
```

**⏱️ Estimated time: 30 minutes**

---

### Cursor Prompt #5: Switch Component

```
# Cursor AI: Migrate Switch to M3 Expressive

## Files Location
- frontend/src/components/m3-expressive/switch/M3Switch.tsx
- frontend/src/components/m3-expressive/switch/M3Switch.css
- frontend/src/components/m3-expressive/switch/M3Switch.test.tsx
- frontend/src/components/m3-expressive/switch/M3Switch.stories.tsx

## Key Requirements for Switch
- [ ] On/off toggle state
- [ ] Color prop: primary, secondary, tertiary, error
- [ ] Size: small, medium, large
- [ ] Disabled state
- [ ] Label support (usually on left or right)
- [ ] onChange handler
- [ ] Icon support (optional: show icons on/off state)
- [ ] Animations on toggle
- [ ] Accessibility: role="switch", aria-checked

## Styling with M3 Tokens
- On state: var(--md-sys-color-primary)
- Off state: var(--md-sys-color-surface-variant)
- Thumb: var(--md-sys-color-on-primary) when on, var(--md-sys-color-outline) when off
- Hover: var(--md-sys-color-primary-hover)
- Disabled: opacity 0.38
- Track height: var(--md-sys-spacing-4)
- Thumb size: var(--md-sys-spacing-6)
- Animation: var(--md-sys-motion-duration-short2) for smooth slide

## Test Minimum: 15 tests
- Rendering (on/off states)
- Toggle with onChange
- All colors
- All sizes
- Disabled state
- Label rendering
- Keyboard accessibility (Space key)
- Icon support if implemented
- Animation transitions

## Reference
- frontend/src/components/m3-expressive/checkbox/M3Checkbox.tsx (toggle pattern)
- Simpler than Checkbox (no indeterminate state)
```

**⏱️ Estimated time: 20 minutes**

---

## ✅ Step 7: Batch Validation

After all 5 components are done by Cursor, run:

```bash
./scripts/validate-batch.sh Select Checkbox Radio TextArea Switch
```

This runs:

1. ✅ Token validation
2. ✅ Build (yarn build)
3. ✅ Linting (yarn lint:fix)
4. ✅ All component tests
5. ✅ Generates summary

**Expected Output:**

```
════════════════════════════════════════
Step 1/5: Token System Validation
════════════════════════════════════════
✅ Token schema validation passed.

Step 2/5: Build (yarn build)
✅ Build succeeded

Step 3/5: Linting (yarn lint:fix)
✅ Linting passed

Step 4/5: Component Tests
✅ All component tests passed

════════════════════════════════════════
Validation Summary
════════════════════════════════════════
✅ All validations passed!

Checked components:
  • M3Select
  • M3Checkbox
  • M3Radio
  • M3TextArea
  • M3Switch
```

---

## 💡 Reference Materials

**Button (M3 Reference Implementation):**

- `frontend/src/components/m3-expressive/button/M3Button.tsx` (component pattern)
- `frontend/src/components/m3-expressive/button/M3Button.css` (token usage)
- `frontend/src/components/m3-expressive/button/M3Button.test.tsx` (test pattern)
- `frontend/src/components/m3-expressive/button/M3Button.stories.tsx` (storybook pattern)

**Phase 1 References (if available):**

- `frontend/src/components/m3-expressive/input/` (input pattern)
- `frontend/src/components/m3-expressive/sidebar/` (variant pattern)

**Design System:**

- `frontend/src/styles/m3-design-tokens.css` (all available tokens)
- `.claude/docs/CURSOR_AI_M3_MIGRATION_PROMPT.md` (complete migration guide, Part 5 for issues)

---

## 📊 Progress Tracking

After Phase 2 completion:

```
M3 Migration Progress:
├── Phase 1: Foundation (4 components) ✅
│   ├── Button         ✅ Complete
│   ├── Input          ✅ Complete
│   ├── Sidebar        ✅ Complete
│   ├── Navbar         ✅ Complete
│   └── AppShell       ✅ Complete
├── Phase 2: Forms & Navigation (5 components) ✅
│   ├── Select         ✅ Complete
│   ├── Checkbox       ✅ Complete
│   ├── Radio          ✅ Complete
│   ├── TextArea       ✅ Complete
│   └── Switch         ✅ Complete
├── Phase 3: Dependent Components (30+ components) ⏳
└── Total: 34% → ready for Phase 3
```

---

## 🎯 What to Do If Something Breaks

### "yarn build fails"

1. Check the error message (usually missing token reference or syntax error)
2. Give Cursor the error message with file/line context
3. Likely causes:
   - Missing `var(--md-sys-color-*)` token reference
   - CSS syntax error in BEM class names
   - TypeScript type error in props interface

### "Tests fail"

1. Check which test failed and the assertion
2. Look at M3Button tests for patterns on similar issues
3. Have Cursor fix the test logic or component implementation

### "Token not found"

```bash
# Find available tokens
grep "md-sys-color" frontend/src/styles/m3-design-tokens.css | head -20
grep "md-sys-spacing" frontend/src/styles/m3-design-tokens.css | head -20
grep "md-sys-shape" frontend/src/styles/m3-design-tokens.css | head -20
grep "md-sys-motion" frontend/src/styles/m3-design-tokens.css | head -20
```

---

## 📝 Commands Quick Reference

```bash
# Scaffold all Phase 2 components
python3 scripts/scaffold-m3-component.py Select Checkbox Radio TextArea Switch

# Test individual component
yarn test --testPathPattern="M3Select"

# Validate all Phase 2 components
./scripts/validate-batch.sh Select Checkbox Radio TextArea Switch

# Check design tokens available
grep "md-sys-color-" frontend/src/styles/m3-design-tokens.css | head -30
```

---

## ⏱️ Execution Timeline

**Optimal Execution (with parallelization where possible):**

1. **Scaffold** (2 min): All 5 at once
2. **Cursor Work** (3 hours):
   - Select: 45 min (start first, blocks TextArea)
   - Checkbox + Radio + Switch: 80 min parallel (while Select runs)
   - TextArea: 30 min (after Select)
3. **Validation** (30 sec): All 5 at once

**Total: ~3 hours** (sequential: ~3.5 hours)

---

## 📚 Next Steps

After Phase 2 is complete:

1. Phase 3 becomes unblocked (can migrate all dependent components)
2. See `docs/M3_PHASE3_MIGRATION_GUIDE.md` for strategic approach
3. You'll have 10 reference implementations (Button + 4 Phase 1 + 5 Phase 2)
4. Phase 3 components can be scaffolded in batches of 10

---

**Last Updated:** 2025-12-03
**Status:** ✅ Ready for Phase 2 Migration (pending Phase 1 completion)
