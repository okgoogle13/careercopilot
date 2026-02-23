# M3 Interaction Tokens (Icons + Motion)

**Purpose:** Unify icon sizing/colors and motion animations using M3 tokens.

**Input:** Component file path + tokens-expressive.json
**Output:** Refactored component using M3 interaction tokens

---

## Overview

Consolidates Steps 7-8 of the 8-step M3 migration protocol:

1. **Icon Standards** - Standardize icon sizing (20px, 24px, 40px) and semantic colors
2. **Motion Tokens** - Replace hardcoded durations/easing with M3 motion tokens

---

## Part 1: M3 Icon System

### Icon Sizing (3 Standard Sizes)

| Size   | Pixels | Use Case                                 |
| ------ | ------ | ---------------------------------------- |
| Small  | 20px   | Inline icons, list items, dense UI       |
| Medium | 24px   | Standard UI, buttons, toolbars (default) |
| Large  | 40px   | Hero icons, empty states, features       |

### Semantic Icon Colors

| Icon Type       | M3 Color Token                              | Use Case                      |
| --------------- | ------------------------------------------- | ----------------------------- |
| Primary actions | `var(--sys-color-primary)`                  | Important actions, links      |
| Secondary icons | `var(--sys-color-on-surface-variant)`       | Supporting icons              |
| Active/Selected | `var(--sys-color-primary)`                  | Navigation, selected items    |
| Disabled        | `var(--sys-color-on-surface)` @ 38% opacity | Disabled actions              |
| Error/Delete    | `var(--sys-color-error)`                    | Destructive actions, warnings |
| Success         | `var(--sys-color-tertiary)`                 | Success states, confirmations |
| On Primary      | `var(--sys-color-on-primary)`               | Icons on primary buttons      |

---

## Part 2: M3 Motion System

### Duration Tokens (16 Total)

| Token                                | Value  | Use Case                 |
| ------------------------------------ | ------ | ------------------------ |
| `--sys-motion-duration-short-1`      | 50ms   | Instant feedback         |
| `--sys-motion-duration-short-2`      | 100ms  | Quick transitions        |
| `--sys-motion-duration-short-3`      | 150ms  | Subtle animations        |
| `--sys-motion-duration-short-4`      | 200ms  | Small elements (default) |
| `--sys-motion-duration-medium-1`     | 250ms  | Standard transitions     |
| `--sys-motion-duration-medium-2`     | 300ms  | Default duration         |
| `--sys-motion-duration-medium-3`     | 350ms  | Larger elements          |
| `--sys-motion-duration-medium-4`     | 400ms  | Complex transitions      |
| `--sys-motion-duration-long-1`       | 450ms  | Large elements           |
| `--sys-motion-duration-long-2`       | 500ms  | Page transitions         |
| `--sys-motion-duration-long-3`       | 550ms  | Extended animations      |
| `--sys-motion-duration-long-4`       | 600ms  | Smooth transitions       |
| `--sys-motion-duration-extra-long-1` | 700ms  | Elaborate animations     |
| `--sys-motion-duration-extra-long-2` | 800ms  | Hero transitions         |
| `--sys-motion-duration-extra-long-3` | 900ms  | Expressive motion        |
| `--sys-motion-duration-extra-long-4` | 1000ms | Full-page transitions    |

### Easing Tokens (10 Total)

| Token                                       | Curve                                   | Use Case             |
| ------------------------------------------- | --------------------------------------- | -------------------- |
| `--sys-motion-easing-linear`                | linear                                  | Progress indicators  |
| `--sys-motion-easing-standard`              | cubic-bezier(0.2, 0, 0, 1)              | Standard transitions |
| `--sys-motion-easing-standard-accelerate`   | cubic-bezier(0.3, 0, 1, 1)              | Exit animations      |
| `--sys-motion-easing-standard-decelerate`   | cubic-bezier(0, 0, 0, 1)                | Enter animations     |
| `--sys-motion-easing-emphasized`            | cubic-bezier(0.2, 0, 0, 1)              | Important actions    |
| `--sys-motion-easing-emphasized-accelerate` | cubic-bezier(0.3, 0, 0.8, 0.15)         | Expressive exits     |
| `--sys-motion-easing-emphasized-decelerate` | cubic-bezier(0.05, 0.7, 0.1, 1)         | Expressive enters    |
| `--sys-motion-easing-expressive`            | cubic-bezier(0.4, 0, 0.2, 1)            | Playful motion       |
| `--sys-motion-easing-expressive-bounce`     | cubic-bezier(0.68, -0.55, 0.265, 1.55)  | Bounce effects       |
| `--sys-motion-easing-expressive-spring`     | cubic-bezier(0.175, 0.885, 0.32, 1.275) | Spring effects       |

---

## Detection Patterns

### Icon Pattern 1: Hardcoded Icon Sizes

```tsx
// ❌ Before
<IconButton>
  <Icon sx={{ fontSize: 18 }} />
</IconButton>

// ✅ After
<IconButton>
  <Icon sx={{ fontSize: '20px' }} /> {/* M3 small */}
</IconButton>
```

**Regex:** `/(fontSize|width|height):\s*['"]?(\d+)(px)?['"]?/g`

### Icon Pattern 2: Icon Colors

```tsx
// ❌ Before
<Icon sx={{ color: '#757575' }} />
<DeleteIcon sx={{ color: '#d32f2f' }} />

// ✅ After
<Icon sx={{ color: 'var(--sys-color-on-surface-variant)' }} />
<DeleteIcon sx={{ color: 'var(--sys-color-error)' }} />
```

**Regex:** `/(color):\s*['"]?(#[0-9a-fA-F]{3,6}|rgb\([^)]+\))['"]?/g`

### Motion Pattern 1: Transition Duration

```tsx
// ❌ Before
<Button sx={{ transition: 'all 0.3s' }} />

// ✅ After
<Button sx={{
  transition: `all var(--sys-motion-duration-medium-2) var(--sys-motion-easing-standard)`
}} />
```

**Regex:** `/(transition|transitionDuration):\s*['"]?(\d+)(ms|s)?['"]?/g`

### Motion Pattern 2: Easing Curves

```tsx
// ❌ Before
<Box sx={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }} />

// ✅ After
<Box sx={{ transitionTimingFunction: 'var(--sys-motion-easing-expressive)' }} />
```

**Regex:** `/(easing|transitionTimingFunction):\s*['"]?([^'";}]+)['"]?/g`

### Motion Pattern 3: Animation Duration

```tsx
// ❌ Before
.fade { animation: fadeIn 0.3s ease-in-out; }

// ✅ After
.fade {
  animation: fadeIn var(--sys-motion-duration-medium-2) var(--sys-motion-easing-standard-decelerate);
}
```

---

## Icon Sizing Algorithm

```javascript
function determineIconSize(context) {
  // Inline icons (within text)
  if (context.isInline) return "20px"; // Small

  // Icon buttons
  if (context.isButton) return "24px"; // Medium (default)

  // Hero/Feature icons
  if (context.isHero || context.isEmptyState) return "40px"; // Large

  // List items
  if (context.isListItem) return "20px"; // Small

  // Default
  return "24px"; // Medium
}

// Mapping existing sizes
const iconSizeMap = {
  16: "20px",
  18: "20px",
  20: "20px", // Small
  22: "24px",
  24: "24px",
  28: "24px", // Medium
  32: "40px",
  36: "40px",
  40: "40px",
  48: "40px", // Large
};

function mapToM3IconSize(size) {
  const sizeNum = parseInt(size, 10);
  if (sizeNum <= 20) return "20px";
  if (sizeNum <= 28) return "24px";
  return "40px";
}
```

---

## Motion Duration Mapping

```javascript
const durationMap = {
  50: "var(--sys-motion-duration-short-1)",
  100: "var(--sys-motion-duration-short-2)",
  150: "var(--sys-motion-duration-short-3)",
  200: "var(--sys-motion-duration-short-4)",
  250: "var(--sys-motion-duration-medium-1)",
  300: "var(--sys-motion-duration-medium-2)",
  350: "var(--sys-motion-duration-medium-3)",
  400: "var(--sys-motion-duration-medium-4)",
  450: "var(--sys-motion-duration-long-1)",
  500: "var(--sys-motion-duration-long-2)",
  550: "var(--sys-motion-duration-long-3)",
  600: "var(--sys-motion-duration-long-4)",
  700: "var(--sys-motion-duration-extra-long-1)",
  800: "var(--sys-motion-duration-extra-long-2)",
  900: "var(--sys-motion-duration-extra-long-3)",
  1000: "var(--sys-motion-duration-extra-long-4)",
};

function mapToDurationToken(durationMs) {
  const durations = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 700, 800, 900, 1000];
  const closest = durations.reduce((prev, curr) => (Math.abs(curr - durationMs) < Math.abs(prev - durationMs) ? curr : prev));
  return durationMap[closest];
}
```

---

## Example Transformations

### Example 1: Icon Button

**Before:**

```tsx
<IconButton sx={{ padding: "8px" }}>
  <CloseIcon sx={{ fontSize: 18, color: "#757575" }} />
</IconButton>
```

**After:**

```tsx
<IconButton sx={{ padding: "var(--sys-space-2)" }} aria-label="Close">
  <CloseIcon
    sx={{
      fontSize: "20px",
      color: "var(--sys-color-on-surface-variant)",
    }}
  />
</IconButton>
```

### Example 2: Motion - Button Hover

**Before:**

```tsx
const Button = styled.button`
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: #1565c0;
  }
`;
```

**After:**

```tsx
const Button = styled.button`
  transition: all var(--sys-motion-duration-short-4) var(--sys-motion-easing-standard);
  &:hover {
    background-color: var(--sys-color-primary-30);
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
```

### Example 3: Motion - Modal Enter/Exit

**Before:**

```tsx
<Modal open={open} TransitionComponent={Fade} transitionDuration={300}>
  <Box sx={{ animation: "slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}>Content</Box>
</Modal>
```

**After:**

```tsx
<Modal
  open={open}
  TransitionComponent={Fade}
  transitionDuration={300}
  TransitionProps={{
    easing: {
      enter: "var(--sys-motion-easing-emphasized-decelerate)",
      exit: "var(--sys-motion-easing-emphasized-accelerate)",
    },
  }}
>
  <Box
    sx={{
      animation: `slideIn var(--sys-motion-duration-medium-2) var(--sys-motion-easing-expressive)`,
    }}
  >
    Content
  </Box>
</Modal>
```

### Example 4: Icon Colors - Semantic

**Before:**

```tsx
<ListItem>
  <ListItemIcon>
    <FolderIcon sx={{ fontSize: 20, color: "#1976d2" }} />
  </ListItemIcon>
</ListItem>
```

**After:**

```tsx
<ListItem>
  <ListItemIcon>
    <FolderIcon
      sx={{
        fontSize: "20px",
        color: "var(--sys-color-primary)",
      }}
    />
  </ListItemIcon>
</ListItem>
```

### Example 5: Motion - Loading Spinner

**Before:**

```css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spinner {
  animation: spin 1s linear infinite;
}
```

**After:**

```css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spinner {
  animation: spin var(--sys-motion-duration-extra-long-4) var(--sys-motion-easing-linear) infinite;
}
```

---

## Icon Button Patterns

### Standard Icon Button

```tsx
<IconButton
  sx={{
    padding: "var(--sys-space-2)",
    borderRadius: "var(--sys-shape-corner-full)",
    "&:hover": { backgroundColor: "var(--sys-color-surface-variant)" },
  }}
  aria-label="Close"
>
  <CloseIcon sx={{ fontSize: "24px" }} />
</IconButton>
```

### Disabled Icon Button

```tsx
<IconButton
  disabled
  sx={{
    "& .MuiSvgIcon-root": {
      fontSize: "24px",
      color: "var(--sys-color-on-surface)",
      opacity: 0.38,
    },
  }}
>
  <DeleteIcon />
</IconButton>
```

---

## Motion Use Cases

### Micro-Interactions (Short)

- Button hover: **short-4** (200ms)
- Checkbox animation: **short-2** (100ms)
- Tooltip fade: **short-3** (150ms)

### Standard Transitions (Medium)

- Card hover: **medium-1** (250ms)
- Dropdown: **medium-2** (300ms)
- Tab switch: **medium-3** (350ms)

### Complex Animations (Long)

- Modal: **long-2** (500ms)
- Drawer slide: **long-3** (550ms)
- Page transition: **long-4** (600ms)

### Expressive Motion (Extra-Long)

- Hero animation: **extra-long-2** (800ms)
- Onboarding: **extra-long-3** (900ms)
- Full-page: **extra-long-4** (1000ms)

---

## Accessibility: Reduced Motion

**CRITICAL:** Always respect user's motion preferences:

```tsx
// With prefers-reduced-motion support
<Button
  sx={{
    transition: "all var(--sys-motion-duration-medium-2) var(--sys-motion-easing-standard)",
    "@media (prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  }}
/>
```

---

## Icon Accessibility

**Always provide labels:**

```tsx
// ✅ With aria-label
<IconButton aria-label="Close">
  <CloseIcon />
</IconButton>

// ✅ Decorative icons (text describes action)
<Button startIcon={<AddIcon aria-hidden="true" />}>
  Add Item
</Button>
```

---

## Validation

### Post-Replacement Checks

1. **Syntax Valid:** Code parses correctly
2. **Icons:** All use 20px, 24px, or 40px (3 M3 standards)
3. **Colors:** All use M3 color tokens
4. **Motion:** All durations and easing use tokens
5. **Accessibility:** Icons have aria-label or title, prefers-reduced-motion supported
6. **Visual Regression:** Icons/animations render correctly

---

## Output Format

```json
{
  "file": "frontend/src/components/ui/Header/Header.tsx",
  "replacements": 12,
  "icon_replacements": 6,
  "motion_replacements": 6,
  "details": [
    {
      "line": 15,
      "icon": "CloseIcon",
      "original": { "fontSize": 18, "color": "#757575" },
      "updated": { "fontSize": "20px", "color": "var(--sys-color-on-surface-variant)" }
    },
    {
      "line": 22,
      "property": "transitionDuration",
      "original": "0.3s",
      "token": "var(--sys-motion-duration-medium-2)"
    }
  ],
  "warnings": [{ "line": 45, "message": "Icon button missing aria-label (accessibility)" }]
}
```

---

**Version:** 1.0.0
**Status:** Consolidated skill combining icon standards + motion tokens
