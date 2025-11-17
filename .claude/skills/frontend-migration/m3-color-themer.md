# M3 Color Themer

**Purpose:** Replace all hardcoded colors in a component with M3 Expressive design tokens.

**Input:** Component file path + tokens-expressive.json
**Output:** Refactored component using `var(--sys-color-*)` tokens

---

## Overview

This skill is Step 2 in the 8-step M3 migration protocol. It:

1. Detects all hardcoded colors (hex, rgb, rgba, named colors)
2. Maps them to appropriate M3 semantic color roles
3. Replaces with CSS variable references
4. Preserves component functionality
5. Validates WCAG compliance

---

## Color Detection Patterns

### Pattern 1: Hex Colors

```tsx
// ❌ Before
<Button style={{ backgroundColor: '#1976d2' }} />
<Box sx={{ color: '#333' }} />
const theme = { primary: '#00897B' };

// ✅ After
<Button style={{ backgroundColor: 'var(--sys-color-primary)' }} />
<Box sx={{ color: 'var(--sys-color-on-surface)' }} />
const theme = { primary: 'var(--sys-color-primary)' };
```

**Regex:**
```javascript
/(['"]?)#([0-9a-fA-F]{3,8})\1/g
```

### Pattern 2: RGB/RGBA

```tsx
// ❌ Before
<div style={{ background: 'rgb(25, 118, 210)' }} />
<Box sx={{ borderColor: 'rgba(0, 0, 0, 0.12)' }} />

// ✅ After
<div style={{ background: 'var(--sys-color-primary)' }} />
<Box sx={{ borderColor: 'var(--sys-color-outline-variant)' }} />
```

**Regex:**
```javascript
/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/g
```

### Pattern 3: Named Colors

```tsx
// ❌ Before
<Button sx={{ color: 'blue' }} />
<Box sx={{ background: 'white' }} />

// ✅ After
<Button sx={{ color: 'var(--sys-color-primary)' }} />
<Box sx={{ background: 'var(--sys-color-surface)' }} />
```

**Regex:**
```javascript
/(red|blue|green|yellow|orange|purple|pink|black|white|gray|grey)/gi
```

### Pattern 4: Material-UI Theme Colors (Deprecated)

```tsx
// ❌ Before
<Button sx={{ color: 'primary.main' }} />
<Box sx={{ bgcolor: theme.palette.secondary.light }} />

// ✅ After
<Button sx={{ color: 'var(--sys-color-primary)' }} />
<Box sx={{ bgcolor: 'var(--sys-color-secondary-container)' }} />
```

**Regex:**
```javascript
/theme\.palette\.(primary|secondary|error|warning|info|success)\.(main|light|dark|contrastText)/g
```

---

## Color Mapping Algorithm

### Step 1: Extract Color from Code

```javascript
function extractColor(match) {
  // Hex color
  if (match.startsWith('#')) {
    return hexToRgb(match);
  }

  // RGB/RGBA
  if (match.startsWith('rgb')) {
    const [r, g, b, a] = parseRgb(match);
    return { r, g, b, a };
  }

  // Named color
  if (NAMED_COLORS[match.toLowerCase()]) {
    return NAMED_COLORS[match.toLowerCase()];
  }
}
```

### Step 2: Determine Color Role

```javascript
function determineColorRole(color, context) {
  const { r, g, b, a } = color;

  // Check if grayscale (neutral)
  if (isGrayscale(r, g, b)) {
    return determineNeutralRole(r, g, b, a, context);
  }

  // Check if error red
  if (isErrorRed(r, g, b)) {
    return determineErrorRole(context);
  }

  // Determine based on context
  if (context.property === 'backgroundColor' || context.property === 'background') {
    return determineSurfaceRole(r, g, b, a);
  }

  if (context.property === 'color') {
    return determineTextRole(r, g, b);
  }

  if (context.property === 'borderColor') {
    return determineOutlineRole(r, g, b, a);
  }

  // Default to primary
  return 'var(--sys-color-primary)';
}

function isGrayscale(r, g, b) {
  const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
  return maxDiff < 10; // Within 10 units = grayscale
}

function isErrorRed(r, g, b) {
  return r > 180 && g < 100 && b < 100; // Red-ish
}

function determineSurfaceRole(r, g, b, a) {
  const lightness = (r + g + b) / 3;

  if (lightness > 240) {
    return 'var(--sys-color-surface)'; // Very light = surface
  }

  if (lightness > 200) {
    return 'var(--sys-color-surface-variant)'; // Light = surface-variant
  }

  if (a && a < 0.5) {
    return 'var(--sys-color-surface-variant)'; // Transparent = variant
  }

  // Default background
  return 'var(--sys-color-background)';
}

function determineTextRole(r, g, b) {
  const lightness = (r + g + b) / 3;

  if (lightness < 50) {
    return 'var(--sys-color-on-surface)'; // Dark text
  }

  if (lightness < 100) {
    return 'var(--sys-color-on-surface-variant)'; // Medium text
  }

  return 'var(--sys-color-on-primary)'; // Light text (on dark background)
}

function determineOutlineRole(r, g, b, a) {
  if (a && a < 0.3) {
    return 'var(--sys-color-outline-variant)'; // Very transparent
  }

  return 'var(--sys-color-outline)'; // Standard outline
}
```

### Step 3: Context-Aware Mapping

**Context includes:**
- Property name (backgroundColor, color, borderColor)
- Parent component type (Button, Card, Input)
- Semantic intent (primary action, secondary, error, etc.)

```javascript
function getContext(node, property) {
  return {
    property: property,
    componentType: getComponentType(node),
    intent: getSemanticIntent(node),
    parentContext: getParentContext(node)
  };
}

function getSemanticIntent(node) {
  // Check for variant props
  if (node.attributes) {
    if (hasAttribute(node, 'variant', 'primary')) return 'primary';
    if (hasAttribute(node, 'variant', 'secondary')) return 'secondary';
    if (hasAttribute(node, 'color', 'error')) return 'error';
  }

  // Check for semantic class names
  if (hasClassName(node, 'error')) return 'error';
  if (hasClassName(node, 'warning')) return 'warning';

  return 'default';
}
```

---

## Smart Color Mapping Table

### Common UI Patterns

| Original Color | Lightness | Context | M3 Token |
|---------------|-----------|---------|----------|
| `#1976d2` (blue) | Medium | Button background | `var(--sys-color-primary)` |
| `#ffffff` (white) | Very light | Text on colored bg | `var(--sys-color-on-primary)` |
| `#000000` (black) | Very dark | Text on light bg | `var(--sys-color-on-surface)` |
| `#f5f5f5` (light gray) | Very light | Surface | `var(--sys-color-surface)` |
| `#e0e0e0` (gray) | Light | Border | `var(--sys-color-outline-variant)` |
| `#757575` (dark gray) | Medium | Secondary text | `var(--sys-color-on-surface-variant)` |
| `rgba(0,0,0,0.12)` | Transparent | Divider | `var(--sys-color-outline-variant)` |
| `rgba(0,0,0,0.87)` | Dark | Primary text | `var(--sys-color-on-surface)` |
| `#d32f2f` (red) | Medium | Error state | `var(--sys-color-error)` |
| `#fff` on `#d32f2f` | White on red | Error text | `var(--sys-color-on-error)` |

### Material-UI Palette Mapping

| Material-UI | M3 Expressive Token |
|------------|---------------------|
| `primary.main` | `var(--sys-color-primary)` |
| `primary.light` | `var(--sys-color-primary-container)` |
| `primary.dark` | `var(--sys-palette-primary-30)` |
| `primary.contrastText` | `var(--sys-color-on-primary)` |
| `secondary.main` | `var(--sys-color-secondary)` |
| `secondary.light` | `var(--sys-color-secondary-container)` |
| `error.main` | `var(--sys-color-error)` |
| `error.light` | `var(--sys-color-error-container)` |
| `background.default` | `var(--sys-color-background)` |
| `background.paper` | `var(--sys-color-surface)` |
| `text.primary` | `var(--sys-color-on-surface)` |
| `text.secondary` | `var(--sys-color-on-surface-variant)` |
| `divider` | `var(--sys-color-outline-variant)` |

---

## Replacement Strategy

### Strategy 1: Simple String Replacement

```javascript
function replaceColor(code, match, token) {
  // Replace exact match with token
  return code.replace(match, token);
}
```

### Strategy 2: Preserve Opacity

```javascript
function replaceColorPreserveOpacity(code, match, token) {
  // If original has opacity, preserve it
  const alpha = extractAlpha(match);

  if (alpha && alpha < 1) {
    // Use rgba() with token
    return `rgba(from ${token} r g b / ${alpha})`;
    // Or use opacity property separately
  }

  return token;
}
```

### Strategy 3: Context-Aware Replacement

```javascript
function replaceInContext(code, match, context) {
  const token = determineColorRole(extractColor(match), context);

  // Special handling for sx prop
  if (context.isSxProp) {
    return token; // Already a string in sx
  }

  // Special handling for style prop
  if (context.isStyleProp) {
    return `'${token}'`; // Needs quotes
  }

  return token;
}
```

---

## Example Transformations

### Example 1: Button Component

**Before:**
```tsx
const Button = styled.button`
  background-color: #1976d2;
  color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.12);

  &:hover {
    background-color: #1565c0;
  }

  &:disabled {
    background-color: rgba(0, 0, 0, 0.12);
    color: rgba(0, 0, 0, 0.38);
  }
`;
```

**After:**
```tsx
const Button = styled.button`
  background-color: var(--sys-color-primary);
  color: var(--sys-color-on-primary);
  border: 1px solid var(--sys-color-outline);

  &:hover {
    background-color: var(--sys-palette-primary-30); /* Darker shade */
  }

  &:disabled {
    background-color: var(--sys-color-surface-variant);
    color: var(--sys-color-on-surface-variant);
  }
`;
```

### Example 2: Card Component

**Before:**
```tsx
<Card sx={{
  backgroundColor: '#ffffff',
  borderColor: '#e0e0e0',
  color: '#000000',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}}>
  <Typography sx={{ color: '#757575' }}>
    Secondary text
  </Typography>
</Card>
```

**After:**
```tsx
<Card sx={{
  backgroundColor: 'var(--sys-color-surface)',
  borderColor: 'var(--sys-color-outline-variant)',
  color: 'var(--sys-color-on-surface)',
  boxShadow: 'var(--sys-elevation-level-1)'
}}>
  <Typography sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
    Secondary text
  </Typography>
</Card>
```

### Example 3: Material-UI Theme Migration

**Before:**
```tsx
<Button sx={{
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  '&:hover': {
    bgcolor: 'primary.dark'
  }
}} />
```

**After:**
```tsx
<Button sx={{
  bgcolor: 'var(--sys-color-primary)',
  color: 'var(--sys-color-on-primary)',
  '&:hover': {
    bgcolor: 'var(--sys-palette-primary-30)'
  }
}} />
```

---

## Edge Cases

### Edge Case 1: Gradients

```tsx
// ❌ Before
background: linear-gradient(90deg, #1976d2, #1565c0)

// ✅ After
background: linear-gradient(90deg, var(--sys-color-primary), var(--sys-palette-primary-30))
```

### Edge Case 2: Color Functions

```tsx
// ❌ Before
color: darken('#1976d2', 10%)

// ✅ After
color: var(--sys-palette-primary-30) // Use darker tonal shade
```

### Edge Case 3: Transparent Colors

```tsx
// ❌ Before
backgroundColor: 'transparent'

// ✅ After
backgroundColor: 'transparent' // Keep as-is
```

### Edge Case 4: currentColor

```tsx
// ❌ Before
borderColor: 'currentColor'

// ✅ After
borderColor: 'currentColor' // Keep as-is
```

---

## Validation

### Post-Replacement Checks

1. **Syntax Valid:** Code still parses correctly
2. **All Colors Replaced:** No hardcoded colors remain
3. **Tokens Exist:** All referenced tokens exist in tokens-expressive.json
4. **Visual Regression:** Component looks the same (use screenshots)

---

## Output Format

```json
{
  "file": "frontend/src/components/ui/Button/Button.tsx",
  "replacements": 15,
  "details": [
    {
      "line": 12,
      "original": "#1976d2",
      "token": "var(--sys-color-primary)",
      "property": "backgroundColor",
      "context": "Button background"
    },
    {
      "line": 13,
      "original": "#ffffff",
      "token": "var(--sys-color-on-primary)",
      "property": "color",
      "context": "Button text"
    }
  ],
  "warnings": [
    {
      "line": 45,
      "message": "Gradient detected - manual review recommended"
    }
  ]
}
```

---

## Usage

**As standalone skill:**
```bash
# Pass component file path
m3-color-themer --file frontend/src/components/ui/Button/Button.tsx
```

**Within m3-migration-architect (Step 2):**
```javascript
const colorThemedCode = await runSkill('m3-color-themer', {
  code: layoutRefactoredCode,
  tokens: tokensExpressive
});
```

---

**Created:** 2025-11-17
**Version:** 1.0.0
**Status:** Ready for use in migration protocol
