# Component Migration Template (Updated 2025-11-28)

## Quick Start: Using Consolidated Skills

### Single Component Migration
```
Ask Claude: "Migrate Button component to M3 Expressive"

Claude will:
1. m3-layout-tokens: Convert spacing to var(--sys-space-*)
2. m3-visual-tokens: Replace colors with var(--sys-color-*)
3. m3-typography-tokens: Update fonts to semantic types
4. m3-interaction-tokens: Add motion/animation tokens
5. Validate: 100% token usage, no hardcoded values
```

### Batch Component Migration
```
Ask Claude: "Migrate Button, Input, Select, Navbar to M3 Expressive"

Claude uses batch-migration-orchestrator:
- Coordinates all 4 steps for each component
- Validates compliance for each
- Generates migration report
```

---

## Pattern 1: Styled Component (Layout → Visual)

### BEFORE: MUI v5 Hardcoded
```tsx
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#1E1E23',        // ❌ Hardcoded
  color: '#F8FAFC',                 // ❌ Hardcoded
  padding: '20px',                  // ❌ Hardcoded
  margin: '12px',                   // ❌ Magic number
  borderColor: '#48464F',           // ❌ Hardcoded
}));
```

### AFTER: M3 Design Tokens
```tsx
// Via m3-layout-tokens + m3-visual-tokens
const StyledCard = styled(Card)(() => ({
  backgroundColor: 'var(--sys-color-surface-container)',  // ✅ Token
  color: 'var(--sys-color-on-surface)',                   // ✅ Token
  padding: 'var(--sys-space-5)',        // 20px = 5 × 4px grid
  margin: 'var(--sys-space-3)',         // 12px = 3 × 4px grid
  borderColor: 'var(--sys-color-outline)',                // ✅ Token
}));
```

---

## Pattern 2: Typography (m3-typography-tokens)

### BEFORE: Inline Styles
```tsx
<div style={{ fontSize: '24px', fontWeight: 600, margin: '12px 0' }}>
  Heading Text
</div>
```

### AFTER: M3 Typography Token
```tsx
<Typography
  variant="h4"  // M3 Headline Large
  sx={{
    margin: 'var(--sys-space-3)',  // 12px
  }}
>
  Heading Text
</Typography>
```

**M3 Typography Variants:**
- `h1` → Display Large | `h2` → Display Medium | `h3` → Display Small
- `h4` → Headline Large | `h5` → Headline Medium | `h6` → Headline Small
- `body1` → Body Large | `body2` → Body Medium | `caption` → Body Small

---

## Pattern 3: Spacing Grid (m3-layout-tokens)

### BEFORE: Hardcoded Pixels
```tsx
<Box sx={{
  color: '#F8FAFC',           // ❌ Hardcoded color
  padding: '20px',            // ❌ Magic pixel
  margin: '12px',             // ❌ Magic pixel
  gap: '8px',                 // ❌ Magic pixel
}}>
  Content
</Box>
```

### AFTER: M3 Spacing Scale (4px base)
```tsx
<Box sx={{
  color: 'var(--sys-color-on-background)',  // ✅ Token (m3-visual-tokens)
  padding: 'var(--sys-space-5)',    // 20px = 5 × 4px
  margin: 'var(--sys-space-3)',     // 12px = 3 × 4px
  gap: 'var(--sys-space-2)',        // 8px = 2 × 4px
}}>
  Content
</Box>
```

**Spacing Scale (4px grid):**
```
--sys-space-1 = 4px     --sys-space-5 = 20px
--sys-space-2 = 8px     --sys-space-6 = 24px
--sys-space-3 = 12px    --sys-space-8 = 32px
--sys-space-4 = 16px    --sys-space-10 = 40px
```

---

## Pattern 4: Colors & Elevation (m3-visual-tokens)

### BEFORE: theme.palette
```tsx
<Button sx={{
  backgroundColor: theme.palette.primary.main,        // ❌ Deprecated
  color: theme.palette.primary.contrastText,         // ❌ Deprecated
  '&:hover': {
    backgroundColor: theme.palette.primary.light,    // ❌ Deprecated
  },
  boxShadow: theme.shadows[4],                        // ❌ Deprecated
}}>
```

### AFTER: M3 Color Tokens
```tsx
<Button sx={{
  backgroundColor: 'var(--sys-color-primary)',        // ✅ Token
  color: 'var(--sys-color-on-primary)',               // ✅ Token
  '&:hover': {
    backgroundColor: 'var(--sys-color-primary-container)',  // ✅ Token
  },
  boxShadow: 'var(--sys-elevation-2)',                // ✅ Token (6px)
}}>
```

**Common Color Tokens:**
```
Primary:          var(--sys-color-primary)
On Primary:       var(--sys-color-on-primary)
Primary Container: var(--sys-color-primary-container)
Secondary:        var(--sys-color-secondary)
Error:            var(--sys-color-error)
Surface:          var(--sys-color-surface)
Background:       var(--sys-color-background)
```

---

## Pattern 5: Motion & Animation (m3-interaction-tokens)

### BEFORE: Hardcoded Animation
```tsx
<Box sx={{
  transition: 'all 0.3s ease-in-out',  // ❌ Hardcoded
  animation: 'fadeIn 300ms linear',    // ❌ Hardcoded
}}>
```

### AFTER: M3 Motion Tokens
```tsx
<Box sx={{
  transition: `all var(--sys-motion-duration-standard) var(--sys-motion-easing-standard)`,
  animation: `fadeIn var(--sys-motion-duration-medium-2) var(--sys-motion-easing-standard)`,
}}>
```

**Motion Scales:**
```
Duration: --sys-motion-duration-short-1 (50ms) → --sys-motion-duration-long (500ms)
Easing: --sys-motion-easing-standard, --sys-motion-easing-emphasized, --sys-motion-easing-spring
```

---

## Migration Workflow with Skills

### Step-by-Step Using Claude Skills

**Step 1: Layout Tokens (m3-layout-tokens)**
- Convert all padding/margin/gap to `var(--sys-space-*)`
- Replace hardcoded pixels with spacing scale
- Update border-radius to `var(--sys-shape-*)`

**Step 2: Visual Tokens (m3-visual-tokens)**
- Replace hardcoded hex colors with `var(--sys-color-*)`
- Replace shadow/elevation with `var(--sys-elevation-*)`
- Ensure WCAG AA contrast compliance

**Step 3: Typography Tokens (m3-typography-tokens)**
- Replace `<div>` with `<Typography variant="..."/>`
- Update font sizes to M3 semantic scales
- Apply font weights and line heights

**Step 4: Interaction Tokens (m3-interaction-tokens)**
- Replace hardcoded animation durations
- Replace easing curves with M3 standard/emphasized/spring
- Add icon sizing via `var(--sys-icon-size-*)`

**Step 5: Validate**
- No hardcoded colors (#hex, rgb())
- No hardcoded spacing (px values)
- All theme.palette references removed
- 100% token-based styling
