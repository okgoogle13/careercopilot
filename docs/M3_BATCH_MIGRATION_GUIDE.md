# M3 Batch Migration Guide

**Fast-track migration for Phase 1 components using automation scripts + Cursor AI**

---

## 🚀 Quick Start (5 minutes to full setup)

```bash
# Step 1: Scaffold all Phase 1 components (2 minutes)
python3 scripts/scaffold-m3-component.py Input Sidebar Navbar AppShell

# Step 2: Give scaffolded files to Cursor AI (via the prompts below)

# Step 3: Validate all components after Cursor completes (30 seconds)
./scripts/validate-batch.sh Input Sidebar Navbar AppShell
```

---

## 📊 Timeline

| Step      | Task                 | Duration       | Token Cost      |
| --------- | -------------------- | -------------- | --------------- |
| **1**     | Scaffold components  | 2 min          | ~500 tokens     |
| **2**     | Cursor AI: Input     | 45 min         | ~15K tokens     |
| **3**     | Cursor AI: Sidebar   | 45 min         | ~15K tokens     |
| **4**     | Cursor AI: Navbar    | 45 min         | ~15K tokens     |
| **5**     | Cursor AI: AppShell  | 45 min         | ~15K tokens     |
| **6**     | Batch validation     | 30 sec         | ~500 tokens     |
| **TOTAL** | **All Phase 1 Done** | **~3.5 hours** | **~62K tokens** |

**vs. Sequential Manual:** 16 hours, ~200K tokens

---

## 📝 Step 1: Scaffold Components

Creates the file structure with boilerplate code. You just run this once.

```bash
cd /Applications/careercopilot

# Scaffold all 4 Phase 1 components
python3 scripts/scaffold-m3-component.py Input Sidebar Navbar AppShell

# Output:
# 📁 Creating frontend/src/components/m3-expressive/input/
#   ✅ M3Input.tsx
#   ✅ M3Input.css
#   ✅ M3Input.test.tsx
#   ✅ M3Input.stories.tsx
#   ✅ index.ts
# ✨ Input component scaffolded!
# (repeated for Sidebar, Navbar, AppShell)
```

### What Got Created:

- ✅ **M3[Component].tsx** - TypeScript component with TODO comments
- ✅ **M3[Component].css** - CSS template with token references
- ✅ **M3[Component].test.tsx** - Test scaffold with test categories
- ✅ **M3[Component].stories.tsx** - Storybook template
- ✅ **index.ts** - Export file

**Your task:** Nothing! The scaffolding is done. Now give these to Cursor.

---

## 🤖 Step 2-5: Fill in Details with Cursor AI

Give Cursor these prompts **one component at a time**:

### Cursor Prompt #1: Input Component

````
# Cursor AI: Migrate Input to M3 Expressive

## What's Already Done
Component files have been scaffolded at:
- frontend/src/components/m3-expressive/input/M3Input.tsx
- frontend/src/components/m3-expressive/input/M3Input.css
- frontend/src/components/m3-expressive/input/M3Input.test.tsx
- frontend/src/components/m3-expressive/input/M3Input.stories.tsx
- frontend/src/components/m3-expressive/input/index.ts

## Your Task: Complete the Implementation

Study the reference: frontend/src/components/m3-expressive/button/

Then fill in the Input component with:

### 1. TypeScript (M3Input.tsx)
- [ ] Add variant prop (e.g., 'filled', 'outlined')
- [ ] Add color prop (primary, secondary, tertiary, error)
- [ ] Add size prop (small, medium, large)
- [ ] Add state prop (default, hover, focus, disabled)
- [ ] Support all input types (text, email, password, etc.)
- [ ] Full JSDoc comments

### 2. CSS (M3Input.css)
- [ ] Base input styles using M3 tokens:
  - Colors: var(--md-sys-color-primary-*), var(--md-sys-color-on-surface)
  - Spacing: var(--md-sys-spacing-*) for padding
  - Shapes: var(--md-sys-shape-corner-small) for border-radius
  - Motion: var(--md-sys-motion-duration-short2) for transitions
- [ ] Implement all variants (filled, outlined)
- [ ] Implement all color roles (primary, secondary, tertiary, error)
- [ ] Focus state with outline
- [ ] Disabled state (opacity: 0.38)
- [ ] Error state styling (red text/border)

### 3. Tests (M3Input.test.tsx)
- [ ] Minimum 20 comprehensive tests
- [ ] Test rendering with different types
- [ ] Test all variants and colors
- [ ] Test disabled/focus states
- [ ] Test value changes and event handlers
- [ ] Test accessibility (required, aria-label, etc.)
- [ ] Test ref forwarding

### 4. Storybook (M3Input.stories.tsx)
- [ ] Default story
- [ ] All variants demo (filled, outlined)
- [ ] All colors demo
- [ ] Different input types (text, email, password)
- [ ] Disabled state
- [ ] With placeholder text
- [ ] With error state

### Key Constraints
- ✅ Use BEM naming: m3-input, m3-input--variant, m3-input__element
- ✅ ALL colors from var(--md-sys-color-*)
- ✅ ALL spacing from var(--md-sys-spacing-*)
- ✅ Reference M3Button for patterns
- ✅ NO hardcoded colors or spacing

### Validation
After completing:
```bash
yarn test --testPathPattern="M3Input"
yarn build
yarn lint:fix
````

All must pass. Then we validate the batch.

```

**Paste this ↑ into Cursor AI**

---

### Cursor Prompt #2: Sidebar Component

```

# Cursor AI: Migrate Sidebar to M3 Expressive

[Same structure as Input above]

## Files Location

- frontend/src/components/m3-expressive/sidebar/M3Sidebar.tsx
- frontend/src/components/m3-expressive/sidebar/M3Sidebar.css
- frontend/src/components/m3-expressive/sidebar/M3Sidebar.test.tsx
- frontend/src/components/m3-expressive/sidebar/M3Sidebar.stories.tsx

## Key Requirements for Sidebar

- [ ] Navigation list structure
- [ ] Active/inactive states for nav items
- [ ] Hover effects
- [ ] Icon support for nav items
- [ ] Collapsible/expandable support (optional)
- [ ] Background: var(--md-sys-color-surface-container)
- [ ] Text: var(--md-sys-color-on-surface)
- [ ] Active indicator using primary color

## Test Minimum: 25 tests (navigation component)

- Navigation item rendering
- Active state toggling
- Click handlers
- Icon support
- Keyboard navigation (a11y)

```

**Paste ↑ into Cursor AI (after Input is done)**

---

### Cursor Prompt #3: Navbar Component

```

# Cursor AI: Migrate Navbar to M3 Expressive

## Files Location

- frontend/src/components/m3-expressive/navbar/M3Navbar.tsx
- frontend/src/components/m3-expressive/navbar/M3Navbar.css
- frontend/src/components/m3-expressive/navbar/M3Navbar.test.tsx
- frontend/src/components/m3-expressive/navbar/M3Navbar.stories.tsx

## Key Requirements for Navbar

- [ ] Top navigation bar
- [ ] Logo/branding area
- [ ] Menu items
- [ ] User menu/dropdown
- [ ] Responsive (desktop/mobile)
- [ ] Background: var(--md-sys-color-surface)
- [ ] Elevation: var(--md-sys-elevation-level1)
- [ ] Text: var(--md-sys-color-on-surface)

## Important: Navbar appears on 100% of pages

- Test extensively across different pages
- Ensure responsive design works on mobile
- Verify dropdown menus work correctly

## Test Minimum: 30 tests (used everywhere)

- Rendering
- All menu variations
- Responsive behavior
- Dropdown interactions
- User menu

```

**Paste ↑ into Cursor AI (after Sidebar is done)**

---

### Cursor Prompt #4: AppShell Component

```

# Cursor AI: Migrate AppShell to M3 Expressive

## Files Location

- frontend/src/components/m3-expressive/appshell/M3AppShell.tsx
- frontend/src/components/m3-expressive/appshell/M3AppShell.css
- frontend/src/components/m3-expressive/appshell/M3AppShell.test.tsx
- frontend/src/components/m3-expressive/appshell/M3AppShell.stories.tsx

## Key Requirements for AppShell

- [ ] Page wrapper/container
- [ ] Grid or flex layout for main content
- [ ] Sidebar integration slot
- [ ] Navbar integration slot
- [ ] Main content area
- [ ] Proper spacing throughout
- [ ] Background: var(--md-sys-color-surface-default)
- [ ] All spacing from var(--md-sys-spacing-\*)

## Key Tokens to Use

- Surface colors for backgrounds
- Spacing tokens for layout gaps
- Ensure children render correctly

## Test Minimum: 20 tests

- Rendering with children
- Layout structure
- Slot content (sidebar, navbar, main)
- Responsive layout

````

**Paste ↑ into Cursor AI (after Navbar is done)**

---

## ✅ Step 6: Batch Validation

After all 4 components are done by Cursor, run:

```bash
./scripts/validate-batch.sh Input Sidebar Navbar AppShell
````

This runs:

1. ✅ Token validation
2. ✅ Build (yarn build)
3. ✅ Linting (yarn lint:fix)
4. ✅ All component tests
5. ✅ Generates summary

**Output:**

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
  • M3Input
  • M3Sidebar
  • M3Navbar
  • M3AppShell
```

---

## 💡 Reference for Cursor

When Cursor asks "what should I use as reference?", tell them:

```
Reference everything from:
- frontend/src/components/m3-expressive/button/M3Button.tsx (component pattern)
- frontend/src/components/m3-expressive/button/M3Button.css (token usage)
- frontend/src/components/m3-expressive/button/M3Button.test.tsx (test pattern)
- frontend/src/components/m3-expressive/button/M3Button.stories.tsx (storybook pattern)

Also read:
- .claude/docs/CURSOR_AI_M3_MIGRATION_PROMPT.md (complete guide, Part 5 for issues)
- frontend/src/styles/m3-design-tokens.css (available tokens)
```

---

## 📊 Progress Tracking

After completion:

```
M3 Migration Progress:
├── Phase 1: Foundation (4 components) ✅
│   ├── Button         ✅ Complete
│   ├── Input          ⏳ In Progress
│   ├── Sidebar        ⏳ In Progress
│   ├── Navbar         ⏳ In Progress
│   └── AppShell       ⏳ In Progress
├── Phase 2: Forms & Navigation (5 components)
├── Phase 3: Dependent Components (30+ components)
└── Total: 12% → [updated %] after completion
```

---

## 🎯 What to Do If Something Breaks

### "yarn build fails"

1. Check the error message
2. Usually missing token reference or syntax error
3. Give Cursor the error message with context

### "Tests fail"

1. Check which test failed
2. Look at M3Button tests for examples
3. Have Cursor fix the test logic

### "Token not found"

```bash
# Find available tokens
grep "md-sys-color" frontend/src/styles/m3-design-tokens.css | head -20
grep "md-sys-spacing" frontend/src/styles/m3-design-tokens.css | head -20
```

---

## 📝 Commands Quick Reference

```bash
# Scaffold all 4 components
python3 scripts/scaffold-m3-component.py Input Sidebar Navbar AppShell

# Test individual component
yarn test --testPathPattern="M3Input"

# Validate batch
./scripts/validate-batch.sh Input Sidebar Navbar AppShell

# Check design tokens available
grep "md-sys-color-" frontend/src/styles/m3-design-tokens.css | head -20
```

---

## ⏱️ Estimated Timeline

- **Scaffolding:** 2 minutes
- **Input (Cursor):** ~45 minutes (most complex - blocks forms)
- **Sidebar (Cursor):** ~45 minutes (nav component)
- **Navbar (Cursor):** ~45 minutes (used everywhere)
- **AppShell (Cursor):** ~30 minutes (layout wrapper)
- **Validation:** 30 seconds

**Total: ~3.5 hours to complete Phase 1**

Compare to:

- Manual (no scaffolding): ~16 hours
- **Savings: 75% faster ⚡**

---

## 🎓 After Phase 1

Once these 4 are done:

1. You have 5 reference implementations (Button + 4 Phase 1)
2. Can scaffold 30+ dependent components in batches
3. Each batch should be 2-3 hours
4. Full migration: ~12 hours total instead of 60+ hours

---

## 📚 Reference Files

- **M3Button Reference:** `frontend/src/components/m3-expressive/button/`
- **Scaffolding Script:** `scripts/scaffold-m3-component.py`
- **Batch Validation:** `scripts/validate-batch.sh`
- **Complete Guide:** `.claude/docs/CURSOR_AI_M3_MIGRATION_PROMPT.md`
- **Design Tokens:** `frontend/src/styles/m3-design-tokens.css`
- **Design System Docs:** `docs/design/M3_EXPRESSIVE_DESIGN_SYSTEM.md`

---

**Last Updated:** 2025-12-03
**Status:** ✅ Ready for Phase 1 Migration
