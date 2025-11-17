# M3 Shape Refactor

**Purpose:** Replace hardcoded border-radius values with M3 Expressive shape tokens.

**Input:** Component file path + tokens-expressive.json
**Output:** Refactored component using `var(--sys-shape-corner-*)` tokens

---

## Overview

This skill is Step 5 in the 8-step M3 migration protocol. It:

1. Detects all hardcoded border-radius values
2. Maps them to appropriate M3 shape tokens
3. Replaces with CSS variable references
4. Supports M3 Expressive organic/asymmetric shapes
5. Handles compound border-radius (per-corner variations)

---

## M3 Expressive Shape System

The M3 Expressive shape system uses 7 semantic corner radii:

| Token | Value | Use Case |
|-------|-------|----------|
| `--sys-shape-corner-none` | 0px | Sharp corners (alerts, dividers) |
| `--sys-shape-corner-extra-small` | 4px | Compact UI (chips, small buttons) |
| `--sys-shape-corner-small` | 8px | Standard UI (buttons, inputs) |
| `--sys-shape-corner-medium` | 12px | Cards, containers |
| `--sys-shape-corner-large` | 16px | Large cards, modals |
| `--sys-shape-corner-extra-large` | 28px | Hero sections, feature cards |
| `--sys-shape-corner-full` | 9999px | Pills, rounded buttons, avatars |

---

## Detection Patterns

### Pattern 1: Simple Border Radius

```tsx
// ❌ Before
<Button sx={{ borderRadius: '8px' }} />
<Card sx={{ borderRadius: 12 }} />
const styles = { borderRadius: '16px' };

// ✅ After
<Button sx={{ borderRadius: 'var(--sys-shape-corner-small)' }} />
<Card sx={{ borderRadius: 'var(--sys-shape-corner-medium)' }} />
const styles = { borderRadius: 'var(--sys-shape-corner-large)' };
```

**Regex:**
```javascript
/(borderRadius):\s*['"]?(\d+)(px)?['"]?/g
```

### Pattern 2: Compound Border Radius (Per-Corner)

```tsx
// ❌ Before
<Box sx={{
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
  borderBottomLeftRadius: '0px',
  borderBottomRightRadius: '0px'
}} />

// ✅ After
<Box sx={{
  borderTopLeftRadius: 'var(--sys-shape-corner-medium)',
  borderTopRightRadius: 'var(--sys-shape-corner-medium)',
  borderBottomLeftRadius: 'var(--sys-shape-corner-none)',
  borderBottomRightRadius: 'var(--sys-shape-corner-none)'
}} />
```

**Regex:**
```javascript
/(borderTopLeftRadius|borderTopRightRadius|borderBottomLeftRadius|borderBottomRightRadius):\s*['"]?(\d+)(px)?['"]?/g
```

### Pattern 3: CSS Shorthand (4 Values)

```tsx
// ❌ Before
borderRadius: '12px 12px 0 0'

// ✅ After
borderRadius: 'var(--sys-shape-corner-medium) var(--sys-shape-corner-medium) var(--sys-shape-corner-none) var(--sys-shape-corner-none)'
```

**Regex:**
```javascript
/(borderRadius):\s*['"](\d+px\s+\d+px\s+\d+px\s+\d+px)['"]?/g
```

### Pattern 4: Full Circles (50% or 9999px)

```tsx
// ❌ Before
<Avatar sx={{ borderRadius: '50%' }} />
<Chip sx={{ borderRadius: '9999px' }} />

// ✅ After
<Avatar sx={{ borderRadius: 'var(--sys-shape-corner-full)' }} />
<Chip sx={{ borderRadius: 'var(--sys-shape-corner-full)' }} />
```

**Regex:**
```javascript
/(borderRadius):\s*['"]?(50%|9999px)['"]?/g
```

---

## Shape Mapping Algorithm

### Step 1: Extract Border Radius Value

```javascript
function extractBorderRadius(match) {
  // Handle percentage values
  if (match.includes('%')) {
    if (match === '50%') return { type: 'full', value: 9999 };
    return { type: 'percentage', value: parseFloat(match) };
  }

  // Handle pixel values
  const value = parseInt(match.match(/\d+/)[0], 10);
  return { type: 'pixel', value };
}
```

### Step 2: Map to Closest Token

```javascript
const shapeScale = {
  0: 'var(--sys-shape-corner-none)',
  4: 'var(--sys-shape-corner-extra-small)',
  8: 'var(--sys-shape-corner-small)',
  12: 'var(--sys-shape-corner-medium)',
  16: 'var(--sys-shape-corner-large)',
  28: 'var(--sys-shape-corner-extra-large)',
  9999: 'var(--sys-shape-corner-full)'
};

function mapToShapeToken(value) {
  // Handle full circles
  if (value >= 50 || value === 9999) {
    return 'var(--sys-shape-corner-full)';
  }

  // Find closest token
  const scaleValues = [0, 4, 8, 12, 16, 28];
  const closest = scaleValues.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );

  return shapeScale[closest];
}
```

### Step 3: Handle Compound Values

```javascript
function mapCompoundBorderRadius(values) {
  // Parse shorthand: "12px 12px 0 0" → [12, 12, 0, 0]
  const radii = values.split(/\s+/).map(v => parseInt(v, 10));

  // Map each value separately
  const tokens = radii.map(v => mapToShapeToken(v));

  // Reconstruct compound value
  return tokens.join(' ');
}

// Example:
// "12px 12px 0 0" → "var(--sys-shape-corner-medium) var(--sys-shape-corner-medium) var(--sys-shape-corner-none) var(--sys-shape-corner-none)"
```

---

## M3 Expressive Shape Patterns

### Pattern 1: Standard Components (Consistent Radii)

```tsx
// ❌ Before
const Button = styled.button`
  border-radius: 8px;
`;

// ✅ After
const Button = styled.button`
  border-radius: var(--sys-shape-corner-small);
`;
```

### Pattern 2: Cards (Medium Radii)

```tsx
// ❌ Before
<Card sx={{ borderRadius: '12px' }} />

// ✅ After
<Card sx={{ borderRadius: 'var(--sys-shape-corner-medium)' }} />
```

### Pattern 3: Pills & Chips (Full Radii)

```tsx
// ❌ Before
<Chip sx={{ borderRadius: '9999px' }} />
<Badge sx={{ borderRadius: '50%' }} />

// ✅ After
<Chip sx={{ borderRadius: 'var(--sys-shape-corner-full)' }} />
<Badge sx={{ borderRadius: 'var(--sys-shape-corner-full)' }} />
```

### Pattern 4: Top-Rounded Modals/Drawers

```tsx
// ❌ Before
<Drawer sx={{
  borderRadius: '16px 16px 0 0'
}} />

// ✅ After
<Drawer sx={{
  borderRadius: 'var(--sys-shape-corner-large) var(--sys-shape-corner-large) var(--sys-shape-corner-none) var(--sys-shape-corner-none)'
}} />

// ✅ Alternative: Use longhand for clarity
<Drawer sx={{
  borderTopLeftRadius: 'var(--sys-shape-corner-large)',
  borderTopRightRadius: 'var(--sys-shape-corner-large)',
  borderBottomLeftRadius: 'var(--sys-shape-corner-none)',
  borderBottomRightRadius: 'var(--sys-shape-corner-none)'
}} />
```

### Pattern 5: Organic/Asymmetric Shapes (M3 Expressive)

```tsx
// ❌ Before (asymmetric but hardcoded)
<Box sx={{
  borderTopLeftRadius: '28px',
  borderTopRightRadius: '8px',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '28px'
}} />

// ✅ After (M3 Expressive organic shape)
<Box sx={{
  borderTopLeftRadius: 'var(--sys-shape-corner-extra-large)',
  borderTopRightRadius: 'var(--sys-shape-corner-small)',
  borderBottomLeftRadius: 'var(--sys-shape-corner-small)',
  borderBottomRightRadius: 'var(--sys-shape-corner-extra-large)'
}} />
```

---

## Example Transformations

### Example 1: Button Component

**Before:**
```tsx
const Button = styled.button`
  border-radius: 8px;
  padding: 12px 24px;

  &.pill {
    border-radius: 9999px;
  }

  &.sharp {
    border-radius: 0;
  }
`;
```

**After:**
```tsx
const Button = styled.button`
  border-radius: var(--sys-shape-corner-small);
  padding: var(--sys-space-3) var(--sys-space-6);

  &.pill {
    border-radius: var(--sys-shape-corner-full);
  }

  &.sharp {
    border-radius: var(--sys-shape-corner-none);
  }
`;
```

### Example 2: Card Component

**Before:**
```tsx
<Card sx={{
  borderRadius: '12px',
  overflow: 'hidden'
}}>
  <CardMedia
    sx={{
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px'
    }}
  />
  <CardContent>
    Content
  </CardContent>
</Card>
```

**After:**
```tsx
<Card sx={{
  borderRadius: 'var(--sys-shape-corner-medium)',
  overflow: 'hidden'
}}>
  <CardMedia
    sx={{
      borderTopLeftRadius: 'var(--sys-shape-corner-medium)',
      borderTopRightRadius: 'var(--sys-shape-corner-medium)'
    }}
  />
  <CardContent>
    Content
  </CardContent>
</Card>
```

### Example 3: Modal with Top Radii

**Before:**
```tsx
const Modal = styled.div`
  border-radius: 16px 16px 0 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
`;
```

**After:**
```tsx
const Modal = styled.div`
  border-top-left-radius: var(--sys-shape-corner-large);
  border-top-right-radius: var(--sys-shape-corner-large);
  border-bottom-left-radius: var(--sys-shape-corner-none);
  border-bottom-right-radius: var(--sys-shape-corner-none);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
`;
```

### Example 4: Avatar Component

**Before:**
```tsx
<Avatar
  src="/user.jpg"
  sx={{
    borderRadius: '50%',
    width: 48,
    height: 48
  }}
/>
```

**After:**
```tsx
<Avatar
  src="/user.jpg"
  sx={{
    borderRadius: 'var(--sys-shape-corner-full)',
    width: 48,
    height: 48
  }}
/>
```

### Example 5: Input Field

**Before:**
```tsx
const TextField = styled.input`
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  padding: 12px;
`;
```

**After:**
```tsx
const TextField = styled.input`
  border-radius: var(--sys-shape-corner-extra-small);
  border: 1px solid var(--sys-color-outline-variant);
  padding: var(--sys-space-3);
`;
```

---

## Edge Cases

### Case 1: Percentage-Based Radii (Non-50%)

```tsx
// ❌ Before
borderRadius: '10%'

// ⚠️ Keep as-is (non-standard, requires manual review)
borderRadius: '10%' // REVIEW: Map to token or keep dynamic?
```

### Case 2: Calc-Based Radii

```tsx
// ❌ Before
borderRadius: 'calc(var(--size) / 2)'

// ⚠️ Keep as-is (dynamic calculation)
borderRadius: 'calc(var(--size) / 2)' // Dynamic - keep
```

### Case 3: Non-Standard Values

```javascript
// If value doesn't match scale exactly, round to nearest
function roundToNearestShapeToken(value) {
  if (value === 0) return 'var(--sys-shape-corner-none)';
  if (value <= 6) return 'var(--sys-shape-corner-extra-small)';
  if (value <= 10) return 'var(--sys-shape-corner-small)';
  if (value <= 14) return 'var(--sys-shape-corner-medium)';
  if (value <= 22) return 'var(--sys-shape-corner-large)';
  if (value <= 35) return 'var(--sys-shape-corner-extra-large)';
  return 'var(--sys-shape-corner-full)';

  // Warn about non-standard values
  console.warn(`Non-standard border-radius value: ${value}px`);
}
```

### Case 4: Clipped Shapes (clip-path)

```tsx
// ✅ Keep as-is (not border-radius)
clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)'
```

---

## M3 Expressive Shape Presets

### Preset 1: Organic (Asymmetric Corners)

```tsx
// M3 Expressive "Organic" shape style
const OrganicCard = styled.div`
  border-top-left-radius: var(--sys-shape-corner-extra-large);
  border-top-right-radius: var(--sys-shape-corner-small);
  border-bottom-left-radius: var(--sys-shape-corner-small);
  border-bottom-right-radius: var(--sys-shape-corner-extra-large);
`;
```

### Preset 2: Rounded (Consistent Medium)

```tsx
// M3 Expressive "Rounded" shape style
const RoundedCard = styled.div`
  border-radius: var(--sys-shape-corner-medium);
`;
```

### Preset 3: Sharp-Soft (Mix of 0px and Rounded)

```tsx
// M3 Expressive "Sharp-Soft" shape style
const SharpSoftCard = styled.div`
  border-top-left-radius: var(--sys-shape-corner-none);
  border-top-right-radius: var(--sys-shape-corner-medium);
  border-bottom-left-radius: var(--sys-shape-corner-medium);
  border-bottom-right-radius: var(--sys-shape-corner-none);
`;
```

---

## Validation

### Post-Replacement Checks

1. **Syntax Valid:** Code still parses correctly
2. **All Radii Replaced:** No hardcoded pixel/percentage values remain (except edge cases)
3. **Tokens Exist:** All referenced tokens exist in tokens-expressive.json
4. **Visual Regression:** Component shapes look the same
5. **Consistency:** Similar components use same shape tokens
6. **Overflow Handling:** `overflow: hidden` still clips content correctly

---

## Output Format

```json
{
  "file": "frontend/src/components/ui/Card/Card.tsx",
  "replacements": 5,
  "details": [
    {
      "line": 12,
      "property": "borderRadius",
      "original": "12px",
      "token": "var(--sys-shape-corner-medium)",
      "context": "Card container"
    },
    {
      "line": 25,
      "property": "borderRadius",
      "original": "9999px",
      "token": "var(--sys-shape-corner-full)",
      "context": "Avatar"
    }
  ],
  "warnings": [
    {
      "line": 42,
      "message": "Non-standard value 10px rounded to 12px (corner-medium)"
    }
  ]
}
```

---

## Usage

**As standalone skill:**
```bash
# Pass component file path
m3-shape-refactor --file frontend/src/components/ui/Card/Card.tsx
```

**Within m3-migration-architect (Step 5):**
```javascript
const shapeRefactoredCode = await runSkill('m3-shape-refactor', {
  code: editorialStyledCode,
  tokens: tokensExpressive
});
```

---

**Created:** 2025-11-17
**Version:** 1.0.0
**Status:** Ready for use in migration protocol
