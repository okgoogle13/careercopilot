# M3 Icon Replacer

**Purpose:** Update icon usage to M3 Expressive standards and patterns.

**Input:** Component file path + tokens-expressive.json
**Output:** Refactored component using M3 icon conventions

---

## Overview

This skill is Step 7 in the 8-step M3 migration protocol. It:

1. Updates icon sizing to M3 standard sizes (20px, 24px, 40px)
2. Applies semantic icon colors using M3 tokens
3. Ensures consistent icon button patterns
4. Updates icon imports (Material Icons → Material Symbols recommended)
5. Validates accessible icon labeling (aria-label, title)

---

## M3 Icon Sizing Standards

The M3 Expressive icon system uses 3 standard sizes:

| Size | Pixels | Use Case |
|------|--------|----------|
| Small | 20px | Dense UI, list items, inline icons |
| Medium | 24px | Standard UI, buttons, toolbars (default) |
| Large | 40px | Hero icons, empty states, feature highlights |

---

## Detection Patterns

### Pattern 1: Hardcoded Icon Sizes

```tsx
// ❌ Before
<IconButton>
  <Icon sx={{ fontSize: 18 }} />
</IconButton>
<CloseIcon sx={{ width: 16, height: 16 }} />

// ✅ After
<IconButton>
  <Icon sx={{ fontSize: '20px' }} /> {/* M3 small */}
</IconButton>
<CloseIcon sx={{ width: 20, height: 20 }} />
```

**Regex:**
```javascript
/(fontSize|width|height):\s*['"]?(\d+)(px)?['"]?/g
```

### Pattern 2: Icon Colors

```tsx
// ❌ Before
<Icon sx={{ color: '#757575' }} />
<DeleteIcon sx={{ color: '#d32f2f' }} />

// ✅ After
<Icon sx={{ color: 'var(--sys-color-on-surface-variant)' }} />
<DeleteIcon sx={{ color: 'var(--sys-color-error)' }} />
```

**Regex:**
```javascript
/(color):\s*['"]?(#[0-9a-fA-F]{3,6}|rgb\([^)]+\))['"]?/g
```

### Pattern 3: Icon Button Size

```tsx
// ❌ Before
<IconButton sx={{ padding: '8px' }}>
  <Icon />
</IconButton>

// ✅ After
<IconButton sx={{ padding: 'var(--sys-space-2)' }}>
  <Icon sx={{ fontSize: '24px' }} />
</IconButton>
```

### Pattern 4: Icon Imports (Material Icons)

```tsx
// ❌ Before (Material Icons - older style)
import CloseIcon from '@mui/icons-material/Close';

// ✅ After (keep, but prefer Material Symbols for new icons)
import CloseIcon from '@mui/icons-material/Close'; // OK for existing code

// 🌟 Best: Material Symbols (M3 standard)
import { Close } from '@mui/icons-material'; // Outlined variant
```

---

## M3 Icon Sizing Algorithm

### Step 1: Determine Context

```javascript
function determineIconSize(context) {
  // Inline icons (within text)
  if (context.isInline) {
    return '20px'; // Small
  }

  // Icon buttons
  if (context.isButton) {
    return '24px'; // Medium (default)
  }

  // Hero/Feature icons
  if (context.isHero || context.isEmptyState) {
    return '40px'; // Large
  }

  // List items
  if (context.isListItem) {
    return '20px'; // Small
  }

  // Default
  return '24px'; // Medium
}
```

### Step 2: Map Existing Size to M3 Standard

```javascript
const iconSizeMap = {
  // Round to nearest M3 standard
  16: '20px',  // Small
  18: '20px',  // Small
  20: '20px',  // Small
  22: '24px',  // Medium
  24: '24px',  // Medium
  28: '24px',  // Medium
  32: '40px',  // Large
  36: '40px',  // Large
  40: '40px',  // Large
  48: '40px'   // Large
};

function mapToM3IconSize(size) {
  const sizeNum = parseInt(size, 10);

  if (sizeNum <= 20) return '20px';
  if (sizeNum <= 28) return '24px';
  return '40px';
}
```

---

## Icon Color Mapping

### Semantic Icon Colors

| Icon Type | M3 Color Token | Use Case |
|-----------|---------------|----------|
| Primary actions | `var(--sys-color-primary)` | Important actions, links |
| Secondary icons | `var(--sys-color-on-surface-variant)` | Supporting icons, metadata |
| Active/Selected | `var(--sys-color-primary)` | Active navigation, selected items |
| Disabled | `var(--sys-color-on-surface)` with 38% opacity | Disabled actions |
| Error/Delete | `var(--sys-color-error)` | Destructive actions, warnings |
| Success | `var(--sys-color-tertiary)` | Success states, confirmations |
| On Primary | `var(--sys-color-on-primary)` | Icons on primary-colored buttons |

```tsx
// Examples
<AddIcon sx={{ color: 'var(--sys-color-primary)' }} /> // Primary action
<InfoIcon sx={{ color: 'var(--sys-color-on-surface-variant)' }} /> // Supporting info
<DeleteIcon sx={{ color: 'var(--sys-color-error)' }} /> // Destructive action
<CheckIcon sx={{ color: 'var(--sys-color-tertiary)' }} /> // Success
```

---

## Example Transformations

### Example 1: Icon Button

**Before:**
```tsx
<IconButton sx={{ padding: '8px' }}>
  <CloseIcon sx={{ fontSize: 18, color: '#757575' }} />
</IconButton>
```

**After:**
```tsx
<IconButton sx={{ padding: 'var(--sys-space-2)' }}>
  <CloseIcon sx={{
    fontSize: '20px', // M3 small size
    color: 'var(--sys-color-on-surface-variant)'
  }} />
</IconButton>
```

### Example 2: List Item Icon

**Before:**
```tsx
<ListItem>
  <ListItemIcon>
    <FolderIcon sx={{ fontSize: 20, color: '#1976d2' }} />
  </ListItemIcon>
  <ListItemText primary="Documents" />
</ListItem>
```

**After:**
```tsx
<ListItem>
  <ListItemIcon>
    <FolderIcon sx={{
      fontSize: '20px', // M3 small size for list items
      color: 'var(--sys-color-primary)'
    }} />
  </ListItemIcon>
  <ListItemText primary="Documents" />
</ListItem>
```

### Example 3: Hero Icon (Empty State)

**Before:**
```tsx
<Box sx={{ textAlign: 'center' }}>
  <SearchIcon sx={{ fontSize: 48, color: '#bdbdbd' }} />
  <Typography>No results found</Typography>
</Box>
```

**After:**
```tsx
<Box sx={{ textAlign: 'center' }}>
  <SearchIcon sx={{
    fontSize: '40px', // M3 large size for hero icons
    color: 'var(--sys-color-on-surface-variant)'
  }} />
  <Typography>No results found</Typography>
</Box>
```

### Example 4: Button with Icon

**Before:**
```tsx
<Button
  startIcon={<AddIcon />}
  sx={{ fontSize: '14px' }}
>
  Add Item
</Button>
```

**After:**
```tsx
<Button
  startIcon={<AddIcon sx={{ fontSize: '20px' }} />} // Small icon for button
  sx={{
    fontSize: 'var(--sys-type-label-large-size)',
    fontWeight: 'var(--sys-type-label-large-weight)'
  }}
>
  Add Item
</Button>
```

### Example 5: Inline Icon (Within Text)

**Before:**
```tsx
<Typography>
  Click here <HelpIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /> for help
</Typography>
```

**After:**
```tsx
<Typography>
  Click here <HelpIcon sx={{
    fontSize: '20px', // M3 small size for inline
    verticalAlign: 'middle',
    color: 'var(--sys-color-primary)'
  }} /> for help
</Typography>
```

### Example 6: Action Icons (Toolbar)

**Before:**
```tsx
const Toolbar = styled.div`
  .icon {
    font-size: 24px;
    color: #333;
    margin: 0 8px;
  }
`;
```

**After:**
```tsx
const Toolbar = styled.div`
  .icon {
    font-size: 24px; // M3 medium (standard for toolbars)
    color: var(--sys-color-on-surface);
    margin: 0 var(--sys-space-2);
  }
`;
```

---

## Icon Button Patterns

### Standard Icon Button

```tsx
<IconButton
  sx={{
    padding: 'var(--sys-space-2)', // 8px padding
    borderRadius: 'var(--sys-shape-corner-full)', // Circular
    '&:hover': {
      backgroundColor: 'var(--sys-color-surface-variant)'
    }
  }}
  aria-label="Close"
>
  <CloseIcon sx={{ fontSize: '24px' }} />
</IconButton>
```

### Icon Button with Badge

```tsx
<IconButton aria-label="Notifications">
  <Badge badgeContent={4} color="error">
    <NotificationsIcon sx={{
      fontSize: '24px',
      color: 'var(--sys-color-on-surface)'
    }} />
  </Badge>
</IconButton>
```

### Disabled Icon Button

```tsx
<IconButton
  disabled
  sx={{
    '& .MuiSvgIcon-root': {
      fontSize: '24px',
      color: 'var(--sys-color-on-surface)',
      opacity: 0.38 // M3 disabled opacity
    }
  }}
>
  <DeleteIcon />
</IconButton>
```

---

## Accessibility Requirements

### Always Provide Labels

```tsx
// ❌ Before (no label)
<IconButton>
  <CloseIcon />
</IconButton>

// ✅ After (with aria-label)
<IconButton aria-label="Close">
  <CloseIcon />
</IconButton>

// ✅ Alternative: with title
<IconButton title="Close">
  <CloseIcon />
</IconButton>
```

### Decorative Icons

```tsx
// Icons that are purely decorative (text already describes action)
<Button startIcon={<AddIcon aria-hidden="true" />}>
  Add Item
</Button>
```

---

## Special Cases

### Case 1: Non-Standard Icon Sizes

```tsx
// ❌ Before
<Icon sx={{ fontSize: 32 }} />

// ✅ After (round to nearest M3 standard)
<Icon sx={{ fontSize: '40px' }} /> // 32px → 40px (large)
```

### Case 2: Custom SVG Icons

```tsx
// ✅ Apply M3 sizing and colors
<SvgIcon sx={{
  fontSize: '24px',
  color: 'var(--sys-color-on-surface)',
  width: 24,
  height: 24
}}>
  <path d="..." />
</SvgIcon>
```

### Case 3: Icon Fonts (Font Awesome, etc.)

```tsx
// ✅ Apply M3 sizing
<i className="fa fa-close" style={{
  fontSize: '24px',
  color: 'var(--sys-color-on-surface)'
}} />
```

### Case 4: Responsive Icon Sizes

```tsx
// ✅ Use M3 sizes at each breakpoint
<Icon sx={{
  fontSize: {
    xs: '20px', // Small on mobile
    md: '24px'  // Medium on desktop
  }
}} />
```

---

## Material Symbols (M3 Preferred)

**Material Symbols** is the M3-native icon set. It offers:
- Outlined, Rounded, and Sharp variants
- Variable font with adjustable weight, fill, and grade
- Better M3 design language alignment

```tsx
// ✅ Material Symbols (recommended for new code)
import { Close, Add, Delete } from '@mui/icons-material'; // Default: Outlined

// Configure variant globally
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiSvgIcon: {
      defaultProps: {
        fontSize: 'medium' // 24px
      }
    }
  }
});
```

---

## Validation

### Post-Replacement Checks

1. **Sizes Standardized:** All icons use 20px, 24px, or 40px
2. **Colors Tokenized:** All icon colors use M3 color tokens
3. **Accessibility:** All interactive icons have aria-label or title
4. **Consistency:** Similar components use same icon size
5. **Visual Regression:** Icons render correctly at new sizes

---

## Output Format

```json
{
  "file": "frontend/src/components/ui/Header/Header.tsx",
  "replacements": 8,
  "details": [
    {
      "line": 15,
      "icon": "CloseIcon",
      "original": { "fontSize": 18, "color": "#757575" },
      "updated": { "fontSize": "20px", "color": "var(--sys-color-on-surface-variant)" },
      "context": "Icon button"
    },
    {
      "line": 32,
      "icon": "DeleteIcon",
      "original": { "fontSize": 24, "color": "#d32f2f" },
      "updated": { "fontSize": "24px", "color": "var(--sys-color-error)" },
      "context": "Delete action"
    }
  ],
  "warnings": [
    {
      "line": 45,
      "message": "Icon button missing aria-label (accessibility issue)"
    }
  ]
}
```

---

## Usage

**As standalone skill:**
```bash
# Pass component file path
m3-icon-replacer --file frontend/src/components/ui/Header/Header.tsx
```

**Within m3-migration-architect (Step 7):**
```javascript
const iconReplacedCode = await runSkill('m3-icon-replacer', {
  code: elevationRefactoredCode,
  tokens: tokensExpressive
});
```

---

**Created:** 2025-11-17
**Version:** 1.0.0
**Status:** Ready for use in migration protocol
