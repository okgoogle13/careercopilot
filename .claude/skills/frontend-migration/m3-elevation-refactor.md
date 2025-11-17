# M3 Elevation Refactor

**Purpose:** Replace hardcoded box-shadow values with M3 Expressive elevation tokens.

**Input:** Component file path + tokens-expressive.json
**Output:** Refactored component using `var(--sys-elevation-level-*)` tokens

---

## Overview

This skill is Step 6 in the 8-step M3 migration protocol. It:

1. Detects all hardcoded box-shadow values
2. Maps them to appropriate M3 elevation levels
3. Replaces with CSS variable references
4. Understands component elevation hierarchy (cards < modals < overlays)
5. Handles Material-UI elevation prop conversions

---

## M3 Expressive Elevation System

The M3 Expressive elevation system uses 6 levels (0-5):

| Token | Elevation | Use Case |
|-------|-----------|----------|
| `--sys-elevation-level-0` | none | Flat surfaces (backgrounds, dividers) |
| `--sys-elevation-level-1` | 0-1dp | Resting cards, tiles |
| `--sys-elevation-level-2` | 1-3dp | Raised cards, hovered buttons |
| `--sys-elevation-level-3` | 3-6dp | Dropdowns, tooltips |
| `--sys-elevation-level-4` | 6-12dp | Bottom sheets, modals |
| `--sys-elevation-level-5` | 12-24dp | Navigation drawers, overlays |

---

## Detection Patterns

### Pattern 1: Simple Box Shadow

```tsx
// ❌ Before
<Card sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
<Button sx={{ boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }} />

// ✅ After
<Card sx={{ boxShadow: 'var(--sys-elevation-level-1)' }} />
<Button sx={{ boxShadow: 'var(--sys-elevation-level-2)' }} />
```

**Regex:**
```javascript
/(boxShadow):\s*['"]([^'"]+)['"]?/g
```

### Pattern 2: Material-UI Elevation Prop

```tsx
// ❌ Before
<Paper elevation={3} />
<Card elevation={2} />

// ✅ After
<Paper sx={{ boxShadow: 'var(--sys-elevation-level-3)' }} />
<Card sx={{ boxShadow: 'var(--sys-elevation-level-2)' }} />
```

**Regex:**
```javascript
/elevation=\{(\d+)\}/g
```

### Pattern 3: Multiple Shadows (Layered)

```tsx
// ❌ Before
boxShadow: '0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)'

// ✅ After
boxShadow: 'var(--sys-elevation-level-1)' // M3 already includes layered shadows
```

### Pattern 4: CSS Drop Shadow (Filter Property)

```tsx
// ❌ Before
filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'

// ✅ After (convert to box-shadow)
boxShadow: 'var(--sys-elevation-level-2)'
```

---

## Elevation Mapping Algorithm

### Step 1: Parse Shadow Value

```javascript
function parseShadow(shadowValue) {
  // Extract blur radius (primary indicator of elevation)
  const blurMatch = shadowValue.match(/\s(\d+)px\s+(\d+)px\s+(\d+)px/);

  if (!blurMatch) return { blur: 0, spread: 0, offset: 0 };

  const [_, offsetX, offsetY, blur, spread] = blurMatch.map(v => parseInt(v, 10));

  return { offsetX, offsetY, blur, spread };
}
```

### Step 2: Map to Elevation Level

```javascript
function mapToElevationLevel(shadow) {
  const { blur, spread, offsetY } = parseShadow(shadow);

  // No shadow
  if (blur === 0 && spread === 0) {
    return 'var(--sys-elevation-level-0)';
  }

  // Level 1: blur 2-3px, offset 1-2px
  if (blur <= 3 && offsetY <= 2) {
    return 'var(--sys-elevation-level-1)';
  }

  // Level 2: blur 4-6px, offset 2-4px
  if (blur <= 6 && offsetY <= 4) {
    return 'var(--sys-elevation-level-2)';
  }

  // Level 3: blur 7-9px, offset 4-6px
  if (blur <= 9 && offsetY <= 6) {
    return 'var(--sys-elevation-level-3)';
  }

  // Level 4: blur 10-12px, offset 6-10px
  if (blur <= 12 && offsetY <= 10) {
    return 'var(--sys-elevation-level-4)';
  }

  // Level 5: blur >12px, offset >10px
  return 'var(--sys-elevation-level-5)';
}
```

### Step 3: Context-Aware Mapping

```javascript
function mapElevationByContext(component, shadow) {
  const baseLevel = mapToElevationLevel(shadow);

  // Override based on component type
  if (component.type === 'Card' && !component.props.elevated) {
    return 'var(--sys-elevation-level-1)'; // Cards default to level-1
  }

  if (component.type === 'Modal' || component.type === 'Dialog') {
    return 'var(--sys-elevation-level-4)'; // Modals at level-4
  }

  if (component.type === 'Drawer' || component.type === 'Menu') {
    return 'var(--sys-elevation-level-3)'; // Menus at level-3
  }

  if (component.type === 'Tooltip' || component.type === 'Popover') {
    return 'var(--sys-elevation-level-2)'; // Tooltips at level-2
  }

  return baseLevel;
}
```

---

## M3 Elevation Specifications

### Level 0: Flat (No Shadow)

```css
--sys-elevation-level-0: none;
```

**Use Cases:**
- Background surfaces
- Dividers
- Flat buttons
- Disabled elements

### Level 1: Resting (0-1dp)

```css
--sys-elevation-level-1: 0px 1px 2px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15);
```

**Use Cases:**
- Cards (resting state)
- Tiles
- List items
- Surface containers

### Level 2: Raised (1-3dp)

```css
--sys-elevation-level-2: 0px 1px 2px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15);
```

**Use Cases:**
- Hovered cards
- Raised buttons
- Chips
- FAB (resting)

### Level 3: Floating (3-6dp)

```css
--sys-elevation-level-3: 0px 1px 3px rgba(0,0,0,0.3), 0px 4px 8px 3px rgba(0,0,0,0.15);
```

**Use Cases:**
- Dropdowns
- Select menus
- Tooltips
- FAB (pressed)

### Level 4: Overlays (6-12dp)

```css
--sys-elevation-level-4: 0px 2px 3px rgba(0,0,0,0.3), 0px 6px 10px 4px rgba(0,0,0,0.15);
```

**Use Cases:**
- Modals
- Dialogs
- Bottom sheets
- Date pickers

### Level 5: Navigation (12-24dp)

```css
--sys-elevation-level-5: 0px 4px 4px rgba(0,0,0,0.3), 0px 8px 12px 6px rgba(0,0,0,0.15);
```

**Use Cases:**
- Navigation drawers
- Full-screen overlays
- Top app bars (scrolled)
- Persistent overlays

---

## Example Transformations

### Example 1: Card Component

**Before:**
```tsx
const Card = styled.div`
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 24px;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;
```

**After:**
```tsx
const Card = styled.div`
  box-shadow: var(--sys-elevation-level-1);
  border-radius: var(--sys-shape-corner-medium);
  padding: var(--sys-space-6);

  &:hover {
    box-shadow: var(--sys-elevation-level-2);
  }
`;
```

### Example 2: Material-UI Paper

**Before:**
```tsx
<Paper elevation={3}>
  <Typography>Content</Typography>
</Paper>
```

**After:**
```tsx
<Paper sx={{ boxShadow: 'var(--sys-elevation-level-3)' }}>
  <Typography>Content</Typography>
</Paper>
```

### Example 3: Modal Dialog

**Before:**
```tsx
const Modal = styled.div`
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  position: fixed;
  z-index: 1000;
`;
```

**After:**
```tsx
const Modal = styled.div`
  box-shadow: var(--sys-elevation-level-4);
  border-radius: var(--sys-shape-corner-large);
  position: fixed;
  z-index: 1000;
`;
```

### Example 4: Dropdown Menu

**Before:**
```tsx
<Menu
  anchorEl={anchorEl}
  sx={{
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }}
>
  <MenuItem>Option 1</MenuItem>
</Menu>
```

**After:**
```tsx
<Menu
  anchorEl={anchorEl}
  sx={{
    boxShadow: 'var(--sys-elevation-level-3)'
  }}
>
  <MenuItem>Option 1</MenuItem>
</Menu>
```

### Example 5: FAB (Floating Action Button)

**Before:**
```tsx
<Fab
  sx={{
    boxShadow: '0 6px 10px rgba(0,0,0,0.15)',
    '&:active': {
      boxShadow: '0 8px 12px rgba(0,0,0,0.2)'
    }
  }}
>
  <AddIcon />
</Fab>
```

**After:**
```tsx
<Fab
  sx={{
    boxShadow: 'var(--sys-elevation-level-3)',
    '&:active': {
      boxShadow: 'var(--sys-elevation-level-4)'
    }
  }}
>
  <AddIcon />
</Fab>
```

---

## Edge Cases

### Case 1: Inset Shadows

```tsx
// ❌ Before
boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'

// ✅ Keep as-is (inset shadows not part of M3 elevation)
boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' // KEEP: Inset shadow
```

### Case 2: Colored Shadows

```tsx
// ❌ Before
boxShadow: '0 4px 8px rgba(255,0,0,0.3)' // Red shadow

// ⚠️ Replace with standard elevation (M3 uses neutral shadows)
boxShadow: 'var(--sys-elevation-level-2)' // Neutral shadow
```

### Case 3: None/0 Shadow

```tsx
// ❌ Before
boxShadow: 'none'
boxShadow: 0

// ✅ After
boxShadow: 'var(--sys-elevation-level-0)'
```

### Case 4: Material-UI Elevation 0

```tsx
// ❌ Before
<Paper elevation={0} />

// ✅ After
<Paper sx={{ boxShadow: 'var(--sys-elevation-level-0)' }} />
```

---

## Material-UI Elevation Prop Mapping

| Material-UI elevation | M3 Elevation Token |
|-----------------------|--------------------|
| `elevation={0}` | `var(--sys-elevation-level-0)` |
| `elevation={1}` | `var(--sys-elevation-level-1)` |
| `elevation={2}` | `var(--sys-elevation-level-1)` |
| `elevation={3}` | `var(--sys-elevation-level-2)` |
| `elevation={4}` | `var(--sys-elevation-level-2)` |
| `elevation={6}` | `var(--sys-elevation-level-3)` |
| `elevation={8}` | `var(--sys-elevation-level-3)` |
| `elevation={12}` | `var(--sys-elevation-level-4)` |
| `elevation={16}` | `var(--sys-elevation-level-4)` |
| `elevation={24}` | `var(--sys-elevation-level-5)` |

---

## Component-Specific Elevation Guidelines

### Cards

```tsx
// Resting state: Level 1
<Card sx={{ boxShadow: 'var(--sys-elevation-level-1)' }} />

// Hovered state: Level 2
<Card sx={{
  boxShadow: 'var(--sys-elevation-level-1)',
  '&:hover': { boxShadow: 'var(--sys-elevation-level-2)' }
}} />

// Pressed state: Level 0 (temporary)
<Card sx={{
  '&:active': { boxShadow: 'var(--sys-elevation-level-0)' }
}} />
```

### Modals & Dialogs

```tsx
// Always Level 4
<Dialog sx={{ boxShadow: 'var(--sys-elevation-level-4)' }} />
```

### Menus & Tooltips

```tsx
// Level 3
<Menu sx={{ boxShadow: 'var(--sys-elevation-level-3)' }} />
<Tooltip sx={{ boxShadow: 'var(--sys-elevation-level-3)' }} />
```

### App Bars

```tsx
// Flat (no scroll): Level 0
<AppBar sx={{ boxShadow: 'var(--sys-elevation-level-0)' }} />

// Scrolled: Level 2
<AppBar sx={{ boxShadow: 'var(--sys-elevation-level-2)' }} />
```

---

## Validation

### Post-Replacement Checks

1. **Syntax Valid:** Code still parses correctly
2. **All Shadows Replaced:** No hardcoded box-shadow values remain (except inset)
3. **Tokens Exist:** All referenced tokens exist in tokens-expressive.json
4. **Visual Regression:** Component elevations look the same
5. **Hierarchy Consistent:** Overlays > Modals > Cards > Flat
6. **Accessibility:** Shadows don't interfere with text contrast

---

## Output Format

```json
{
  "file": "frontend/src/components/ui/Card/Card.tsx",
  "replacements": 4,
  "details": [
    {
      "line": 12,
      "property": "boxShadow",
      "original": "0 2px 4px rgba(0,0,0,0.1)",
      "token": "var(--sys-elevation-level-1)",
      "context": "Card resting state"
    },
    {
      "line": 18,
      "property": "boxShadow",
      "original": "0 4px 8px rgba(0,0,0,0.15)",
      "token": "var(--sys-elevation-level-2)",
      "context": "Card hover state"
    }
  ],
  "warnings": [
    {
      "line": 32,
      "message": "Colored shadow detected - replaced with neutral elevation"
    }
  ]
}
```

---

## Usage

**As standalone skill:**
```bash
# Pass component file path
m3-elevation-refactor --file frontend/src/components/ui/Card/Card.tsx
```

**Within m3-migration-architect (Step 6):**
```javascript
const elevationRefactoredCode = await runSkill('m3-elevation-refactor', {
  code: shapeRefactoredCode,
  tokens: tokensExpressive
});
```

---

**Created:** 2025-11-17
**Version:** 1.0.0
**Status:** Ready for use in migration protocol
