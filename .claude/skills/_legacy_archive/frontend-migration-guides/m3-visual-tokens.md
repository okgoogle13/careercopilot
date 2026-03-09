# M3 Visual Tokens (Color, Shape, Elevation)

**Purpose:** Replace hardcoded colors, border-radius, and box-shadows with M3 Expressive design tokens in a single consolidated step.

**Input:** Component file path + tokens-expressive.json
**Output:** Refactored component using `var(--sys-color-*)`, `var(--sys-shape-corner-*)`, and `var(--sys-elevation-level-*)` tokens

---

## Overview

This unified skill applies three related visual token transformations in sequence:

1. **Color Tokens** - Replace hardcoded colors with M3 semantic color roles (78+ colors)
2. **Shape Tokens** - Replace border-radius with M3 shape system (7 corner radii)
3. **Elevation Tokens** - Replace box-shadow with M3 elevation levels (6 levels)

---

## Step 1: Color Token Replacement

### Detection Patterns

- **Hex colors:** `#1976d2`, `--sys-color-canvas`
- **RGB/RGBA:** `rgb(25, 118, 210)`, `rgba(0, 0, 0, 0.12)`
- **Named colors:** `blue`, `white`, `black`, `gray`
- **Material-UI:** `theme.palette.primary.main`, `primary.light`

### Color Mapping Algorithm

```javascript
function mapColorToToken(hexOrRgb, context) {
  const color = parseColor(hexOrRgb);
  const lightness = (color.r + color.g + color.b) / 3;

  // Background: light colors → surface
  if (context.property === "backgroundColor") {
    if (lightness > 240) return "var(--sys-color-surface)";
    if (lightness > 200) return "var(--sys-color-surface-variant)";
    return "var(--sys-color-background)";
  }

  // Text: dark colors → on-surface
  if (context.property === "color") {
    if (lightness < 50) return "var(--sys-color-on-surface)";
    if (lightness < 100) return "var(--sys-color-on-surface-variant)";
    return "var(--sys-color-on-primary)";
  }

  // Border: medium colors → outline
  if (context.property === "borderColor") {
    if (color.alpha && color.alpha < 0.3) return "var(--sys-color-outline-variant)";
    return "var(--sys-color-outline)";
  }

  return "var(--sys-color-primary)";
}
```

### Color Mapping Table

| Original               | Context       | M3 Token                           |
| ---------------------- | ------------- | ---------------------------------- |
| `#1976d2` (blue)       | Button bg     | `var(--sys-color-primary)`         |
| `--sys-color-canvas` (white)      | Text on color | `var(--sys-color-on-primary)`      |
| `#000000` (black)      | Text on light | `var(--sys-color-on-surface)`      |
| `--sys-color-surface-light` (light gray) | Surface       | `var(--sys-color-surface)`         |
| `rgba(0,0,0,0.12)`     | Divider       | `var(--sys-color-outline-variant)` |
| `#d32f2f` (red)        | Error         | `var(--sys-color-error)`           |

### Example: Color Transformation

```tsx
// Before
<Button sx={{
  backgroundColor: '#1976d2',
  color: '--sys-color-canvas',
  borderColor: '#e0e0e0'
}} />

// After
<Button sx={{
  backgroundColor: 'var(--sys-color-primary)',
  color: 'var(--sys-color-on-primary)',
  borderColor: 'var(--sys-color-outline-variant)'
}} />
```

---

## Step 2: Shape Token Replacement

### M3 Shape System (7 Levels)

| Token                            | Value  | Use Case            |
| -------------------------------- | ------ | ------------------- |
| `--sys-shape-corner-none`        | 0px    | Sharp corners       |
| `--sys-shape-corner-extra-small` | 4px    | Chips, compact UI   |
| `--sys-shape-corner-small`       | 8px    | Buttons, inputs     |
| `--sys-shape-corner-medium`      | 12px   | Cards, containers   |
| `--sys-shape-corner-large`       | 16px   | Large cards, modals |
| `--sys-shape-corner-extra-large` | 28px   | Hero sections       |
| `--sys-shape-corner-full`        | 9999px | Pills, avatars      |

### Detection Patterns

- **Simple:** `borderRadius: '8px'`
- **Compound:** `borderRadius: '12px 12px 0 0'`
- **Per-corner:** `borderTopLeftRadius: '12px'`
- **Full circle:** `borderRadius: '50%'` or `'9999px'`

### Shape Mapping Algorithm

```javascript
function mapBorderRadiusToToken(pixelValue) {
  const value = parseInt(pixelValue, 10);
  if (value >= 50 || value === 9999) return "var(--sys-shape-corner-full)";

  const scale = [0, 4, 8, 12, 16, 28];
  const closest = scale.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));

  const mapping = {
    0: "var(--sys-shape-corner-none)",
    4: "var(--sys-shape-corner-extra-small)",
    8: "var(--sys-shape-corner-small)",
    12: "var(--sys-shape-corner-medium)",
    16: "var(--sys-shape-corner-large)",
    28: "var(--sys-shape-corner-extra-large)",
  };

  return mapping[closest];
}
```

### Example: Shape Transformation

```tsx
// Before
<Card sx={{
  borderRadius: '12px',
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px'
}} />

// After
<Card sx={{
  borderRadius: 'var(--sys-shape-corner-medium)',
  borderTopLeftRadius: 'var(--sys-shape-corner-medium)',
  borderTopRightRadius: 'var(--sys-shape-corner-medium)'
}} />
```

---

## Step 3: Elevation Token Replacement

### M3 Elevation System (6 Levels)

| Token                     | Use Case                               |
| ------------------------- | -------------------------------------- |
| `--sys-elevation-level-0` | Flat surfaces (no shadow)              |
| `--sys-elevation-level-1` | Resting cards, tiles (0-1dp)           |
| `--sys-elevation-level-2` | Raised cards, hovered buttons (1-3dp)  |
| `--sys-elevation-level-3` | Dropdowns, tooltips (3-6dp)            |
| `--sys-elevation-level-4` | Modals, dialogs (6-12dp)               |
| `--sys-elevation-level-5` | Navigation drawers, overlays (12-24dp) |

### Detection Patterns

- **Box shadow:** `boxShadow: '0 2px 4px rgba(0,0,0,0.1)'`
- **Material-UI:** `elevation={3}`
- **Filter:** `filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'`

### Elevation Mapping Algorithm

```javascript
function mapShadowToElevationLevel(shadow) {
  const blurMatch = shadow.match(/(\d+)px\s+(\d+)px/);
  if (!blurMatch) return "var(--sys-elevation-level-0)";

  const [_, offsetY, blur] = blurMatch.map(parseInt);

  if (blur <= 3 && offsetY <= 2) return "var(--sys-elevation-level-1)";
  if (blur <= 6 && offsetY <= 4) return "var(--sys-elevation-level-2)";
  if (blur <= 9 && offsetY <= 6) return "var(--sys-elevation-level-3)";
  if (blur <= 12 && offsetY <= 10) return "var(--sys-elevation-level-4)";
  return "var(--sys-elevation-level-5)";
}

// Material-UI elevation mapping
const elevationMap = {
  0: 0,
  1: 1,
  2: 1,
  3: 2,
  4: 2,
  6: 3,
  8: 3,
  12: 4,
  16: 4,
  24: 5,
};
```

### Example: Elevation Transformation

```tsx
// Before
<Card sx={{
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }
}} />

// After
<Card sx={{
  boxShadow: 'var(--sys-elevation-level-1)',
  '&:hover': { boxShadow: 'var(--sys-elevation-level-2)' }
}} />
```

---

## Transformation Example: Complete Card Component

```tsx
// Before
const Card = styled.div`
  background-color: --sys-color-canvas;
  color: #000000;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

// After (all 3 visual token types applied)
const Card = styled.div`
  background-color: var(--sys-color-surface);
  color: var(--sys-color-on-surface);
  border: 1px solid var(--sys-color-outline-variant);
  border-radius: var(--sys-shape-corner-medium);
  box-shadow: var(--sys-elevation-level-1);
  padding: var(--sys-space-6);

  &:hover {
    box-shadow: var(--sys-elevation-level-2);
  }
`;
```

---

## Validation

1. **All colors replaced** - No hex, rgb, or named colors remain
2. **All border-radius replaced** - No hardcoded pixel values
3. **All shadows replaced** - No hardcoded box-shadow values
4. **Tokens exist** - All referenced tokens in tokens-expressive.json
5. **Visual regression** - Component appearance unchanged

---

## Output Format

```json
{
  "file": "frontend/src/components/ui/Card/Card.tsx",
  "total_replacements": 12,
  "color_replacements": 4,
  "shape_replacements": 2,
  "elevation_replacements": 2,
  "warnings": ["Line 45: Non-standard color replaced - manual review recommended"]
}
```

---

**Version:** 1.0.0
**Status:** Consolidated skill combining color, shape, and elevation token migrations
