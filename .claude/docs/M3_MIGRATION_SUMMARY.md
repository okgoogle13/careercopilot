# Material Design 3 Migration - Executive Summary & Quick Reference
---

## Current State Overview

### Component Distribution (Actual Audit)
```
✅ M3 Token-Based:        30 components (Complete)
⏳ Hybrid/Incomplete:     86 components (Partial M3, needs finishing)
⏳ MUI v5 Legacy:        100 components (Pure theme.palette, theme.spacing)
🗑️  Deprecated:           19 components (Should remove from _deprecated/)
❓ Other/Utility:          1 component (Keep)
─────────────────────────────────────────────
📊 TOTAL:               216 components
   Progress: 30 complete / 186 remaining = 13.9%
   Note: 23 "M3*" components were started but not finished


## 3-Phase Execution Plan (Revised Based on Audit)

### 📍 Phase 1: Foundation Components (2-3 days) - 16 Hours
**Goal:** Unblock entire app by migrating base components
- Migrate **Button** (18 imports) - `styled()` to M3 tokens
- Migrate **Input** (12 imports) - `theme.palette` to M3 tokens
- Migrate **Sidebar** (5 imports) - Layout restructure
- Migrate **Navbar** (5 imports) - Navigation bar
- Migrate **AppShell** (5 imports) - Page wrapper

**Unblocks:** 30+ dependent components
**Progress:** 13.9% → ~25%

---

### 🎯 Phase 2: Forms & Navigation (2-3 days) - 14 Hours
**Goal:** Complete all user interaction patterns
- Finish **Toast** (9 imports, hybrid component)
- Migrate **Dialog** (9 imports) - Modals
- Migrate **Select** (8 imports) - Dropdowns
- Migrate **Tabs** (7 imports) - Tab navigation
- Migrate **PageHeader** (4 imports) - Section headers

**Unblocks:** All forms, dialogs, navigation
**Progress:** ~25% → ~40%

---

### 📦 Phase 3: Finish M3* Components & Cleanup (3-4 days) - 20 Hours
**Goal:** Complete migration infrastructure and remove technical debt

**Part A - Finish 23 Incomplete M3* Components (10 hours)**
- These have M3 token CSS but still use `styled()` and theme patterns
- Use as reference: profile/, library/, main/ (100% M3-compliant)
- Migrate 4-5 per day

**Part B - Delete Deprecated Files (2 hours)**
- Remove 19 files from `frontend/src/components/_deprecated/`
- Clean up old Button, Dialog, Card duplicates

**Part C - Validate & Test (8 hours)**
- Visual regression testing (all pages)
- Accessibility audit (WCAG AA)
- TypeScript compilation check
- Storybook updates

**Progress:** ~40% → ~70%

---

## Top 10 Components to Migrate (By Impact)

### 🔴 CRITICAL - FOUNDATION PHASE (5 files, 2-3 days)
1. **Button** (18 imports) - MUI v5 `styled()`, affects entire app
2. **Input** (12 imports) - MUI v5 theme patterns, all forms blocked
3. **Sidebar** (5 imports) - App layout, navigation
4. **Navbar** (5 imports) - Main navigation bar
5. **AppShell** (5 imports) - Page wrapper

### 🟠 HIGH - FORMS PHASE (5 files, 2-3 days)
6. **Dialog** (9 imports) - Modal interactions
7. **Select** (8 imports) - Dropdown/selection
8. **Tabs** (7 imports) - Tab navigation
9. **Toast** (9 imports) - Notifications (hybrid - finish)
10. **PageHeader** (4 imports) - Section headers

**Note:** Button + Input alone unblock 30+ dependent components

---

## Migration Pattern (One Pattern Does Everything)

### Before: MUI v5 (Old Way)
```typescript
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,      // ❌ Hardcoded
  color: theme.palette.primary.contrastText,        // ❌ Theme-bound
  padding: theme.spacing(2),                         // ❌ Spacing unit
  margin: '12px',                                    // ❌ Magic number
}));
```

### After: M3 Tokens (New Way)
```typescript
const TokenBox = () => (
  <Box sx={{
    backgroundColor: 'var(--sys-color-primary)',    // ✅ Token
    color: 'var(--sys-color-on-primary)',           // ✅ Token
    padding: '8px',                                  // ✅ 4px grid (2x4)
    margin: '12px',                                  // ✅ 4px grid (3x4)
  }} />
);
```

### Key Changes
- Replace `theme.palette.*` with `var(--sys-color-*)`
- Convert spacing to pixel multiples of 4 (4px, 8px, 12px, 16px, 24px, 32px)
- Use proper `<Typography>` component instead of styled divs
- Ensure colors have sufficient contrast for accessibility

---

## Token Reference (Most Common)

### Colors
```
Primary:          var(--sys-color-primary)
On Primary:       var(--sys-color-on-primary)
Secondary:        var(--sys-color-secondary)
On Secondary:     var(--sys-color-on-secondary)
Error:            var(--sys-color-error)
On Error:         var(--sys-color-on-error)
Surface:          var(--sys-color-surface)
On Surface:       var(--sys-color-on-surface)
Background:       var(--sys-color-background)
On Background:    var(--sys-color-on-background)
```

### Spacing Grid (4px base)
```
4px   = spacing 1x
8px   = spacing 2x
12px  = spacing 3x
16px  = spacing 4x
24px  = spacing 6x
32px  = spacing 8x
```

### Typography Variants
```
<Typography variant="h1" />   - Display Large
<Typography variant="h2" />   - Display Medium
<Typography variant="h3" />   - Display Small
<Typography variant="h4" />   - Headline Large
<Typography variant="h5" />   - Headline Medium
<Typography variant="h6" />   - Headline Small
<Typography variant="body1" /> - Body Large
<Typography variant="body2" /> - Body Medium
<Typography variant="caption" /> - Body Small
```

--