# M3 Migration Phase 1 - Agent Handover Todo List

**Status:** Ready to Execute
**Phase:** 1 of 3 (Foundation Components)
**Estimated Effort:** 16 hours / 2-3 days
**Target Completion:** Nov 28, 2025

---

## Phase 1 Goal
Migrate 5 foundation components that unblock 30+ dependent components.

---

## Priority Components (Do in This Order)

### Task 1: Migrate Button Component ⭐ HIGHEST PRIORITY
- **Location:** `frontend/src/components/ui/button/`
- **Impact:** 18 imports across codebase
- **Current State:** `styled(MuiButton)` with `theme.palette.*`
- **Target State:** M3 token-based with Box component
- **Estimated Effort:** 4 hours

**Checklist:**
- [ ] Read current implementation
- [ ] Read M3-compliant reference (check `profile/` or `library/` components)
- [ ] Identify all `theme.palette.*` references
- [ ] Replace with `var(--sys-color-*)`
- [ ] Replace spacing with 4px grid (4px, 8px, 12px, 16px, etc.)
- [ ] Remove `styled()` wrapper, use `sx` prop
- [ ] Test in 3 pages minimum
- [ ] Run `yarn lint:fix && yarn build`
- [ ] Create PR with changes

**M3 Token Reference:**
```
Primary: var(--sys-color-primary)
On Primary: var(--sys-color-on-primary)
Surface: var(--sys-color-surface)
On Surface: var(--sys-color-on-surface)
Error: var(--sys-color-error)
On Error: var(--sys-color-on-error)
```

---

### Task 2: Migrate Input Component ⭐ HIGH PRIORITY
- **Location:** `frontend/src/components/ui/input/`
- **Impact:** 12 imports (blocks all forms)
- **Current State:** `useTheme()`, `theme.palette.*`, `theme.spacing()`
- **Target State:** M3 token-based form input
- **Estimated Effort:** 4 hours

**Checklist:**
- [ ] Read current implementation
- [ ] Find all `useTheme()` calls and remove
- [ ] Replace `theme.palette.*` with M3 tokens
- [ ] Replace `theme.spacing()` with pixel values (4px grid)
- [ ] Test in form pages
- [ ] Verify focus states use M3 tokens
- [ ] Run `yarn lint:fix && yarn build`
- [ ] Create PR with changes

---

### Task 3: Migrate Sidebar Component
- **Location:** `frontend/src/components/layout/`
- **Impact:** 5 imports (main navigation)
- **Current State:** MUI styled components
- **Target State:** M3 layout tokens
- **Estimated Effort:** 3 hours

**Checklist:**
- [ ] Identify layout structure and styling
- [ ] Replace MUI styled components with Box + M3 tokens
- [ ] Update spacing (4px grid)
- [ ] Update colors (var(--sys-color-*))
- [ ] Test navigation functionality
- [ ] Run `yarn lint:fix && yarn build`
- [ ] Create PR with changes

---

### Task 4: Migrate Navbar Component
- **Location:** `frontend/src/components/layout/`
- **Impact:** 5 imports (top navigation)
- **Current State:** MUI theme patterns
- **Target State:** M3 navigation tokens
- **Estimated Effort:** 3 hours

**Checklist:**
- [ ] Identify navigation bar structure
- [ ] Replace MUI patterns with M3 tokens
- [ ] Update spacing and colors
- [ ] Test on multiple pages (should appear on 100% of pages)
- [ ] Run `yarn lint:fix && yarn build`
- [ ] Create PR with changes

---

### Task 5: Migrate AppShell Component
- **Location:** `frontend/src/components/layout/`
- **Impact:** 5 imports (page wrapper)
- **Current State:** MUI layout patterns
- **Target State:** M3 layout/spacing tokens
- **Estimated Effort:** 2 hours

**Checklist:**
- [ ] Identify layout wrapper structure
- [ ] Replace MUI layout patterns
- [ ] Update spacing (4px grid)
- [ ] Ensure all child components render correctly
- [ ] Run `yarn lint:fix && yarn build`
- [ ] Create PR with changes

---

## Reference Components (Use as Examples)

These components are 100% M3-compliant and can be used as reference:
- `frontend/src/components/profile/*` (ProfileEditor, ImportWizard)
- `frontend/src/components/library/*` (all components)
- `frontend/src/components/main/*` (Dashboard, FeatureHighlights)

**What to look for in references:**
- ✅ No `useTheme()` calls
- ✅ No `styled()` from MUI
- ✅ No `theme.palette.*`
- ✅ All colors: `var(--sys-color-*)`
- ✅ All spacing: pixel values (4px grid)
- ✅ Use Box component with `sx` prop

---

## Success Criteria (All Must Pass)

- [ ] No `useTheme()` calls in any file
- [ ] No `theme.palette.*` references
- [ ] No `styled()` from MUI (use `sx` prop instead)
- [ ] All color values use `var(--sys-color-*)`
- [ ] All spacing uses 4px grid (4px, 8px, 12px, 16px, 24px, 32px)
- [ ] TypeScript compilation: `yarn build` succeeds
- [ ] Linting: `yarn lint` shows no errors for modified files
- [ ] Visual review: Components look correct on 2+ pages each
- [ ] No broken imports or missing components

---

## Validation Commands

**Run these before creating PR:**
```bash
# Type check
yarn build

# Linting
yarn lint:fix

# Unit tests
yarn test --testPathPattern="button|input|sidebar|navbar|shell"

# Visual check
yarn dev
# Then navigate to pages using these components
```

---

## PR Template

Each PR should include:
```markdown
## Component(s) Migrated
- [Component Name]

## Changes Summary
- Removed `theme.palette.*`
- Replaced with `var(--sys-color-*)`
- Updated spacing to 4px grid
- Removed `useTheme()` calls

## Testing
- [ ] Tested on [page names]
- [ ] Build passes
- [ ] Linting passes
- [ ] No visual regressions

## M3 Compliance Checklist
- [ ] No `useTheme()` calls
- [ ] No `styled()` wrappers
- [ ] All colors use tokens
- [ ] All spacing uses 4px grid
```

---

## Next Phase (After Phase 1)

Once these 5 components are done:
- **30+ dependent components will be unblocked**
- Progress jumps from 13.9% → ~25%
- Phase 2 begins: Forms & Navigation components (5 more components)

---

## Questions or Blockers?

If you encounter issues:
1. Check M3 token reference above
2. Look at reference components (profile/, library/)
3. Check existing M3* components that were partially done
4. Consult M3_EXPRESSIVE_INFRASTRUCTURE.md for token system details

---

**Handover Status:** Ready to assign to frontend specialist agent
**Last Updated:** 2025-11-26
