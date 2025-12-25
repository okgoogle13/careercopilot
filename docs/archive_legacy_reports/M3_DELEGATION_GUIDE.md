# M3 Component Migration - AI Agent Delegation Guide

## Overview

This guide enables parallel execution of M3 component migration batches by multiple AI agents. The migration is divided into 9 batches, with **Batches 5, 6, and 8** identified as easiest for delegation (85-90% automation).

---

## Quick Start for Delegated Agents

### Step 1: Understand the Context

You are migrating React components from Material-UI to the **M3 Expressive design system** with these constraints:

- **100% M3 token usage** (no hardcoded colors, spacing, or sizes)
- **TypeScript strict mode** compliance
- **WCAG AA accessibility** (4.5:1 contrast ratios)
- **Responsive design** (mobile/tablet/desktop)

### Step 2: Your Workflow (Per Component)

```bash
# 1. Generate base component (15-20 min)
python3 scripts/generate-m3-component.py \
  --name="ComponentName" \
  --type="feedback|input|card" \
  --output="frontend/src/components/ui"

# 2. Customize component logic (10-30 min)
# - Add component-specific functionality
# - Implement variants and states
# - Add accessibility attributes

# 3. Validate (5-10 min)
# - Visual check: yarn storybook
# - Type check: npx tsc --noEmit
# - Lint: yarn lint

# 4. Update tracker (2 min)
python3 scripts/migrate-to-m3.py

# 5. Commit (2 min)
git add -A
git commit -m "feat: Migrate M3ComponentName (Batch X)"
git push
```

### Step 3: Quality Checklist

Before committing, verify:

- ✅ Uses only M3 tokens (search for hardcoded `#` colors - should be 0)
- ✅ TypeScript compiles without errors
- ✅ All variants render correctly in Storybook
- ✅ Accessible (ARIA labels, roles, keyboard navigation)
- ✅ Responsive (test at 375px, 768px, 1440px)

---

## Batch Assignments (Easy → Hard)

### 🟢 BATCH 6: Utility Components (EASIEST - 90% automation)

**Ideal for:** Junior AI agents or parallel execution
**Time estimate:** 2 hours total
**Automation:** 90% (minimal customization)

| Component | Type    | Lines | Customization             |
| --------- | ------- | ----- | ------------------------- |
| Avatar    | display | ~80   | Add image fallback        |
| Tooltip   | overlay | ~100  | Add positioning logic     |
| Popover   | overlay | ~120  | Add click-outside handler |
| Separator | layout  | ~40   | Minimal (just styling)    |

**Delegation Command:**

```bash
# Component: Avatar
python3 scripts/generate-m3-component.py --name="Avatar" --type="feedback"
# Add: Image loading, fallback initials, size variants
```

---

### 🟢 BATCH 8: Layout Components (EASIEST - 90% automation)

**Ideal for:** Junior AI agents or parallel execution
**Time estimate:** 1.5 hours total
**Automation:** 90% (mostly CSS work)

| Component | Type   | Lines | Customization                  |
| --------- | ------ | ----- | ------------------------------ |
| Container | layout | ~60   | Add max-width breakpoints      |
| Grid      | layout | ~100  | Add 12-column grid system      |
| Divider   | layout | ~50   | Minimal (orientation variants) |

**Delegation Command:**

```bash
# Component: Grid
python3 scripts/generate-m3-component.py --name="Grid" --type="card"
# Add: Column spans (1-12), gap variants, responsive props
```

---

### 🟡 BATCH 5: Feedback Components (EASY - 85% automation)

**Ideal for:** Mid-level AI agents
**Time estimate:** 2.5 hours total
**Automation:** 85% (some animation logic)

| Component  | Type     | Lines | Customization           |
| ---------- | -------- | ----- | ----------------------- |
| Alert      | feedback | ~120  | Add close button, icons |
| Skeleton   | feedback | ~90   | Add pulse animation     |
| EmptyState | feedback | ~110  | Add illustration slot   |

**Delegation Command:**

```bash
# Component: Alert
python3 scripts/generate-m3-component.py --name="Alert" --type="feedback"
# Add: Severity variants (info, success, warning, error), close handler
```

---

### 🟡 BATCH 7: Form Controls (MODERATE - 75% automation)

**Ideal for:** Mid-level AI agents
**Time estimate:** 3 hours total
**Automation:** 75% (form state management)

| Component  | Type  | Lines | Customization           |
| ---------- | ----- | ----- | ----------------------- |
| Checkbox   | input | ~100  | Add indeterminate state |
| RadioGroup | input | ~120  | Add group context       |
| Switch     | input | ~90   | Add toggle animation    |
| Slider     | input | ~150  | Add drag handlers       |

**Delegation Command:**

```bash
# Component: Checkbox
python3 scripts/generate-m3-component.py --name="Checkbox" --type="input"
# Add: Checked/unchecked/indeterminate states, onChange handler
```

---

### 🟡 BATCH 4: Navigation Components (MODERATE - 70% automation)

**Ideal for:** Mid-level AI agents
**Time estimate:** 3.5 hours total
**Automation:** 70% (interaction logic)

| Component  | Type       | Lines | Customization                  |
| ---------- | ---------- | ----- | ------------------------------ |
| Tabs       | navigation | ~180  | Add active state, keyboard nav |
| Breadcrumb | navigation | ~100  | Add separator, truncation      |
| Sidebar    | layout     | ~200  | Add collapse/expand            |

**Delegation Command:**

```bash
# Component: Tabs
python3 scripts/generate-m3-component.py --name="Tabs" --type="card"
# Add: Tab selection state, keyboard navigation (arrow keys), ARIA roles
```

---

### 🟠 BATCH 3: Card Components (MODERATE-HARD - 60% automation)

**Ideal for:** Senior AI agents
**Time estimate:** 4 hours total
**Automation:** 60% (complex layouts)

| Component   | Type | Lines | Customization          |
| ----------- | ---- | ----- | ---------------------- |
| ActionCard  | card | ~377  | Migrate 9 MUI patterns |
| ProfileCard | card | ~234  | Migrate 6 MUI patterns |
| JobCard     | card | ~466  | Migrate 4 MUI patterns |

**Delegation Command:**

```bash
# Component: ActionCard
# Read existing: frontend/src/components/common/ActionCard.tsx
# Identify MUI patterns: sx prop, Box, Typography, Card
# Generate: python3 scripts/generate-m3-component.py --name="ActionCard" --type="card"
# Migrate logic from old component, replace MUI with M3 tokens
```

---

### 🔴 BATCH 2: Complex Inputs (HARD - 40% automation)

**Reserved for:** Lead AI agent (requires deep customization)
**Time estimate:** 3 hours total
**Automation:** 40% (heavy manual work)

| Component  | Type  | Lines | Customization                  |
| ---------- | ----- | ----- | ------------------------------ |
| Select     | input | ~214  | Dropdown, keyboard nav, search |
| DatePicker | input | ~223  | Calendar, date validation      |

**Status:** Reserved for current session continuation

---

## Component Generator Reference

### Basic Usage

```bash
python3 scripts/generate-m3-component.py \
  --name="ComponentName" \
  --type="button|input|card|feedback" \
  --output="frontend/src/components/ui"
```

### Type Mapping

- **button**: Button-like components (variants: filled, tonal, outlined, text, elevated)
- **input**: Form inputs (variants: outlined, filled)
- **card**: Surface components (variants: filled, elevated, outlined)
- **feedback**: Feedback/overlay components (variants: filled, outlined, tonal)

### Output Files

Each generation creates:

1. `M3ComponentName.tsx` - React component
2. `M3ComponentName.css` - M3 token styling
3. `M3ComponentName.stories.tsx` - Storybook documentation

---

## M3 Token Reference (Quick Access)

### Colors

```css
/* Primary color scale (13 tones) */
--md-sys-color-primary-0   /* Black */
--md-sys-color-primary-10  /* Darkest */
--md-sys-color-primary-50  /* Base (#00897B Teal) */
--md-sys-color-primary-100 /* White */

/* Semantic colors */
--md-sys-color-on-primary      /* Text on primary */
--md-sys-color-primary-container
--md-sys-color-on-primary-container
```

### Spacing

```css
--md-sys-spacing-1  /* 4px */
--md-sys-spacing-2  /* 8px */
--md-sys-spacing-3  /* 12px */
--md-sys-spacing-6  /* 24px */
--md-sys-spacing-8  /* 32px */
```

### Typography

```css
--md-sys-typescale-bodySmall-size    /* 12px */
--md-sys-typescale-bodyMedium-size   /* 14px */
--md-sys-typescale-bodyLarge-size    /* 16px */
--md-sys-typescale-headlineSmall-size /* 24px */
```

### Shape

```css
--md-sys-shape-corner-small   /* 8px */
--md-sys-shape-corner-medium  /* 12px */
--md-sys-shape-corner-large   /* 16px */
```

### Motion

```css
--md-sys-motion-duration-short2        /* 100ms */
--md-sys-motion-duration-medium1       /* 250ms */
--md-sys-motion-easing-standard        /* cubic-bezier(0.4, 0.0, 0.2, 1) */
--md-sys-motion-easing-emphasizedDecelerate /* cubic-bezier(0.05, 0.7, 0.1, 1.0) */
```

---

## Example: Complete Migration (Alert Component)

### Step 1: Generate Base

```bash
python3 scripts/generate-m3-component.py --name="Alert" --type="feedback"
```

### Step 2: Customize Logic

Read the generated `M3Alert.tsx` and add:

```typescript
export interface M3AlertProps {
  severity?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

// Add severity-specific icons
const severityIcons = {
  info: <InfoIcon />,
  success: <CheckCircleIcon />,
  warning: <WarningIcon />,
  error: <ErrorIcon />,
};

// Add close button if onClose provided
{onClose && (
  <button onClick={onClose} aria-label="Close alert">
    <CloseIcon />
  </button>
)}
```

### Step 3: Update CSS with M3 Tokens

```css
/* In M3Alert.css */
.m3-alert--info {
  background-color: var(--md-sys-color-primary-95);
  color: var(--md-sys-color-on-primary-container);
  border-color: var(--md-sys-color-primary-50);
}

.m3-alert--error {
  background-color: var(--md-sys-color-error-95);
  color: var(--md-sys-color-on-error-container);
  border-color: var(--md-sys-color-error-50);
}
```

### Step 4: Storybook Story

Edit `M3Alert.stories.tsx`:

```typescript
export const AllSeverities: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <M3Alert severity="info">This is an info alert</M3Alert>
      <M3Alert severity="success">Success message</M3Alert>
      <M3Alert severity="warning">Warning message</M3Alert>
      <M3Alert severity="error">Error occurred</M3Alert>
    </div>
  ),
};
```

### Step 5: Commit

```bash
git add -A
git commit -m "feat: Migrate M3Alert component (Batch 5)

- Info/success/warning/error severity variants
- Optional close button with onClose handler
- Severity-specific icons and colors
- 100% M3 token usage
- WCAG AA compliant contrast ratios"
git push
```

---

## Common Pitfalls & Solutions

### ❌ Pitfall 1: Hardcoded Colors

```typescript
// WRONG
style={{ backgroundColor: '#00897B' }}

// CORRECT
style={{ backgroundColor: 'var(--md-sys-color-primary-50)' }}
```

### ❌ Pitfall 2: Missing Accessibility

```typescript
// WRONG
<div onClick={handleClick}>Click me</div>

// CORRECT
<button onClick={handleClick} aria-label="Action button">
  Click me
</button>
```

### ❌ Pitfall 3: Non-Responsive Sizing

```css
/* WRONG */
.component {
  width: 800px;
}

/* CORRECT */
.component {
  width: 100%;
  max-width: var(--md-sys-spacing-200); /* Token-based */
}

@media (max-width: 768px) {
  .component {
    max-width: 100%;
  }
}
```

---

## Coordination & Handover

### Before Starting a Batch

1. Check `design-system/migration-tracker.json` - ensure batch not already in progress
2. Mark your batch in tracker (optional: add "in_progress" status)
3. Estimate completion time based on automation percentage

### During Execution

1. Commit after each component (not batched at end)
2. Use format: `feat: Migrate M3ComponentName (Batch X)`
3. Push frequently to avoid conflicts

### Upon Completion

1. Run migration scanner: `python3 scripts/migrate-to-m3.py`
2. Verify tracker shows all batch components as "migrated"
3. Create summary comment in commit with component list

### Example Handover Message

```
Batch 6 (Utility Components) - COMPLETE

Components migrated:
- M3Avatar (80 lines, 95% token coverage)
- M3Tooltip (100 lines, 100% token coverage)
- M3Popover (120 lines, 100% token coverage)
- M3Separator (40 lines, 100% token coverage)

Total: 4/4 components
Time: 1.8 hours (under 2 hour estimate)
Quality: All components pass TypeScript, ESLint, Storybook
Next batch: Ready for Batch 8 (Layout)
```

---

## Progress Tracking

**Current Status:**

- ✅ Batch 1: Complete (3/3 components)
- 🔄 Batch 2: In progress (lead agent)
- ⏳ Batch 3: Pending (moderate-hard)
- ⏳ Batch 4: Pending (moderate)
- 🟢 Batch 5: **READY FOR DELEGATION** (easy)
- 🟢 Batch 6: **READY FOR DELEGATION** (easiest)
- ⏳ Batch 7: Pending (moderate)
- 🟢 Batch 8: **READY FOR DELEGATION** (easiest)
- ⏳ Batch 9: Pending (TBD)

**Week 2 Target:** 32+ components (8 migrated, 24 remaining)
**Automation Efficiency:** 88% time savings per component

---

## Questions & Support

If you encounter issues:

1. Check existing M3 components for reference (M3Button, M3Card, M3Input)
2. Review M3_WEEK2_PLAN.md for context
3. Consult design-system/tokens.json for available tokens
4. Run `python3 scripts/migrate-to-m3.py` to validate progress

**Good luck with your batch! 🚀**
