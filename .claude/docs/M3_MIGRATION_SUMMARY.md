# Material Design 3 Migration - Executive Summary & Quick Reference
---

## Current State Overview

### Consolidated Skill Structure (Updated 2025-11-28)

**4 Core M3 Token Skills + 1 Orchestrator + 1 Generator:**

- **m3-visual-tokens** - Color (78+ tokens), shape (7 scales), elevation (6 levels)
- **m3-typography-tokens** - Type scale (13 variants), font families, editorial conventions
- **m3-layout-tokens** - Spacing grid (4px, 8px, 12px...64px), sizing, gaps
- **m3-interaction-tokens** - Icon sizes, motion durations (16 scales), easing (10 curves), spring physics
- **batch-migration-orchestrator** - 4-step migration protocol (layout → visual → typography → interaction)
- **m3-design-system-generator** - Unified token generation (150+ tokens), WCAG validation, CSS variables

### Component Distribution (Audit as of 2025-11-28)
```
✅ M3 Token-Based:        30 components (Complete)
⏳ Hybrid/Incomplete:     86 components (Partial M3, needs finishing)
⏳ MUI v5 Legacy:        100 components (Pure theme.palette, theme.spacing)
🗑️  Deprecated:           19 components (Marked for removal)
❓ Other/Utility:          1 component (Keep)
─────────────────────────────────────────────
📊 TOTAL:               216 components
   Progress: 30 complete / 186 remaining = 13.9%
   Note: 23 components in progress with new token system


## 4-Phase Migration Strategy (Updated 2025-11-28)

### 🏗️ Phase 0: Design System Foundation (2-3 days) - 8 Hours
**Goal:** Establish unified token system with consolidated skills

**Primary Tool:** `m3-design-system-generator`
```
Request: "Generate complete M3 design system with 150+ tokens"
Output: tokens.json + CSS variables + Tailwind patch + WCAG report
```

**Tasks:**
- [ ] Execute m3-design-system-generator (generates all tokens automatically)
- [ ] Review WCAG compliance report
- [ ] Integrate tokens into frontend build
- [ ] Document token naming conventions

**Outcome:** Production-ready M3 token system with accessibility validation
**Progress:** 13.9% → 20%

---

### 📍 Phase 1: Core Components (2-3 days) - 12 Hours
**Goal:** Migrate atomic design components using batch-migration-orchestrator

**Primary Tool:** `batch-migration-orchestrator` (4-step protocol)

**Components (5 priority):**
- Button (18 imports) - m3-visual-tokens + m3-layout-tokens
- Input (12 imports) - m3-interaction-tokens + m3-visual-tokens
- Select (8 imports) - batch-migration-orchestrator (full)
- Navbar (5 imports) - m3-layout-tokens + m3-visual-tokens
- Sidebar (5 imports) - m3-layout-tokens + m3-visual-tokens

**Process:**
```
Ask Claude: "Migrate Button, Input, Select, Navbar, Sidebar to M3 Expressive"
batch-migration-orchestrator will:
  1. Apply m3-layout-tokens (spacing, sizing)
  2. Apply m3-visual-tokens (colors, elevation, shape)
  3. Apply m3-typography-tokens (if needed)
  4. Apply m3-interaction-tokens (motion, icon sizes)
  5. Validate compliance
```

**Unlocks:** 45+ dependent components
**Progress:** 20% → 35%

---

### 🎯 Phase 2: Composite Components (3-4 days) - 18 Hours
**Goal:** Migrate complex components and patterns

**Primary Tool:** `batch-migration-orchestrator` (full 4-step)

**Component Groups:**
- **Surfaces** (AppShell, Dialog, PageHeader) - Layout + Visual + Typography
- **Feedback** (Toast, Snackbar, Tooltip) - Visual + Interaction
- **Forms** (Select, Checkbox, Radio) - Layout + Interaction

**Process:**
```
Ask Claude: "Migrate AppShell, Dialog, PageHeader, Toast to M3 Expressive"
Tools will apply all 4 migration steps automatically
```

**Unlocks:** All app layouts and user flows
**Progress:** 35% → 60%

---

### 🧹 Phase 3: Batch Migration & Cleanup (5-6 days) - 40 Hours
**Goal:** Complete remaining components and remove deprecated code

**Batch Execution with Orchestrator:**
- Batch A: Layout components (AppLayout, Grid/Flex) - 5 hrs
- Batch B: Form components (all inputs, selects) - 6 hrs
- Batch C: Data display (Table, List, Card variants) - 8 hrs
- Batch D: Feature components (Job, Document, Career) - 20 hrs

**Cleanup:**
- Remove 18 deprecated components - 1.5 hrs
- Delete old theme.palette references - 1 hr

**Final Validation:**
- M3 compliance audit (all skills) - 3 hrs
- Visual regression testing - 4 hrs
- Accessibility audit - 2 hrs
- Performance optimization - 1.5 hrs

**Progress:** 60% → 100%

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