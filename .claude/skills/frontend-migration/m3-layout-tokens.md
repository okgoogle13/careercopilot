# M3 Layout Refactor

**Purpose:** Replace hardcoded spacing values with M3 Expressive spacing tokens and update layout patterns.

**Input:** Component file path + tokens-expressive.json
**Output:** Refactored component using `var(--sys-space-*)` tokens

---

## Overview

This skill is Step 1 in the 8-step M3 migration protocol. It:

1. Detects all hardcoded spacing values (padding, margin, gap)
2. Maps them to appropriate M3 spacing tokens
3. Replaces with CSS variable references
4. Updates flexbox/grid layout patterns
5. Ensures consistent spacing hierarchy

---

## M3 Expressive Spacing Scale

The M3 Expressive spacing system uses a 12-stop scale based on 4px increments:

| Token            | Value | Use Case                          |
| ---------------- | ----- | --------------------------------- |
| `--sys-space-0`  | 0px   | No spacing                        |
| `--sys-space-1`  | 4px   | Extra tight spacing, icon padding |
| `--sys-space-2`  | 8px   | Tight spacing, compact UI         |
| `--sys-space-3`  | 12px  | Small spacing, button padding     |
| `--sys-space-4`  | 16px  | Base spacing, card padding        |
| `--sys-space-5`  | 20px  | Medium spacing                    |
| `--sys-space-6`  | 24px  | Large spacing, section padding    |
| `--sys-space-7`  | 28px  | Extra large spacing               |
| `--sys-space-8`  | 32px  | Container padding                 |
| `--sys-space-10` | 40px  | Section margins                   |
| `--sys-space-12` | 48px  | Large section spacing             |
| `--sys-space-16` | 64px  | Extra large section spacing       |

---

## Detection Patterns

### Pattern 1: Padding Values

```tsx
// ❌ Before
<Box sx={{ padding: '16px' }} />
<div style={{ padding: '20px 24px' }} />
const styles = { paddingTop: 12, paddingBottom: 16 };

// ✅ After
<Box sx={{ padding: 'var(--sys-space-4)' }} />
<div style={{ padding: 'var(--sys-space-5) var(--sys-space-6)' }} />
const styles = {
  paddingTop: 'var(--sys-space-3)',
  paddingBottom: 'var(--sys-space-4)'
};
```

**Regex:**

```javascript
/(padding|paddingTop|paddingRight|paddingBottom|paddingLeft):\s*['"]?(\d+)px['"]?/g;
```

### Pattern 2: Margin Values

```tsx
// ❌ Before
<Button sx={{ margin: '24px 0' }} />
<div style={{ marginBottom: 32 }} />

// ✅ After
<Button sx={{ margin: 'var(--sys-space-6) 0' }} />
<div style={{ marginBottom: 'var(--sys-space-8)' }} />
```

**Regex:**

```javascript
/(margin|marginTop|marginRight|marginBottom|marginLeft):\s*['"]?(\d+)px['"]?/g;
```

### Pattern 3: Gap Values (Flexbox/Grid)

```tsx
// ❌ Before
<Stack spacing={2} />
<Box sx={{ gap: '16px' }} />
<div style={{ gap: '24px 12px' }} />

// ✅ After
<Stack spacing="var(--sys-space-2)" />
<Box sx={{ gap: 'var(--sys-space-4)' }} />
<div style={{ gap: 'var(--sys-space-6) var(--sys-space-3)' }} />
```

**Regex:**

```javascript
/(gap|rowGap|columnGap):\s*['"]?(\d+)px['"]?/g
/spacing=\{(\d+)\}/g
```

---

## Spacing Mapping Algorithm

### Step 1: Extract Spacing Value

```javascript
function extractSpacingValue(match) {
  // Extract numeric value
  const value = parseInt(match.match(/\d+/)[0], 10);

  // Handle compound values (e.g., "16px 24px")
  const values = match.match(/\d+/g).map((v) => parseInt(v, 10));

  return values;
}
```

### Step 2: Map to Closest Token

```javascript
const spacingScale = {
  0: "var(--sys-space-0)",
  4: "var(--sys-space-1)",
  8: "var(--sys-space-2)",
  12: "var(--sys-space-3)",
  16: "var(--sys-space-4)",
  20: "var(--sys-space-5)",
  24: "var(--sys-space-6)",
  28: "var(--sys-space-7)",
  32: "var(--sys-space-8)",
  40: "var(--sys-space-10)",
  48: "var(--sys-space-12)",
  64: "var(--sys-space-16)",
};

function mapToSpacingToken(value) {
  // Find closest token
  const scaleValues = [0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64];
  const closest = scaleValues.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));

  return spacingScale[closest];
}
```

### Step 3: Handle Compound Values

```javascript
function mapCompoundSpacing(values) {
  // Map each value separately
  const tokens = values.map((v) => mapToSpacingToken(v));

  // Reconstruct compound value
  return tokens.join(" ");
}

// Example:
// "16px 24px" → "var(--sys-space-4) var(--sys-space-6)"
// "12px 16px 12px 16px" → "var(--sys-space-3) var(--sys-space-4)"
```

---

## Layout Pattern Updates

### Pattern 1: Card Containers

```tsx
// ❌ Before
const Card = styled.div`
  padding: 24px;
  margin: 16px 0;
  gap: 12px;
`;

// ✅ After
const Card = styled.div`
  padding: var(--sys-space-6);
  margin: var(--sys-space-4) 0;
  gap: var(--sys-space-3);
`;
```

### Pattern 2: Flexbox Layouts

```tsx
// ❌ Before
<Box sx={{
  display: 'flex',
  gap: '16px',
  padding: '20px',
  margin: '24px auto'
}} />

// ✅ After
<Box sx={{
  display: 'flex',
  gap: 'var(--sys-space-4)',
  padding: 'var(--sys-space-5)',
  margin: 'var(--sys-space-6) auto'
}} />
```

### Pattern 3: Grid Layouts

```tsx
// ❌ Before
<Grid container spacing={3} sx={{ padding: '32px' }}>
  <Grid item xs={12} md={6} />
</Grid>

// ✅ After
<Grid container spacing="var(--sys-space-3)" sx={{ padding: 'var(--sys-space-8)' }}>
  <Grid item xs={12} md={6} />
</Grid>
```

### Pattern 4: Material-UI Stack Component

```tsx
// ❌ Before
<Stack spacing={2} sx={{ padding: 3 }}>
  <Typography>Item 1</Typography>
  <Typography>Item 2</Typography>
</Stack>

// ✅ After
<Stack spacing="var(--sys-space-2)" sx={{ padding: 'var(--sys-space-3)' }}>
  <Typography>Item 1</Typography>
  <Typography>Item 2</Typography>
</Stack>
```

---

## Special Cases

### Case 1: Negative Margins

```tsx
// ❌ Before
marginTop: -16px

// ✅ After
marginTop: 'calc(-1 * var(--sys-space-4))'
```

### Case 2: Non-Standard Values

```javascript
// If value doesn't match scale exactly, round to nearest
function roundToNearestToken(value) {
  if (value <= 2) return "var(--sys-space-0)";
  if (value <= 6) return "var(--sys-space-1)";
  if (value <= 10) return "var(--sys-space-2)";
  // ... etc

  // Warn about non-standard values
  console.warn(`Non-standard spacing value: ${value}px`);
}
```

### Case 3: Percentage-Based Spacing

```tsx
// ✅ Keep as-is (not part of spacing system)
padding: "5%";
margin: "10% auto";
```

### Case 4: Auto Values

```tsx
// ✅ Keep as-is
margin: "0 auto";
padding: "auto";
```

---

## Example Transformations

### Example 1: Card Component

**Before:**

```tsx
const ProfileCard = styled.div`
  padding: 24px;
  margin: 16px;

  .header {
    margin-bottom: 20px;
  }

  .content {
    padding: 16px 20px;
    gap: 12px;
  }

  .footer {
    margin-top: 24px;
    padding-top: 16px;
  }
`;
```

**After:**

```tsx
const ProfileCard = styled.div`
  padding: var(--sys-space-6);
  margin: var(--sys-space-4);

  .header {
    margin-bottom: var(--sys-space-5);
  }

  .content {
    padding: var(--sys-space-4) var(--sys-space-5);
    gap: var(--sys-space-3);
  }

  .footer {
    margin-top: var(--sys-space-6);
    padding-top: var(--sys-space-4);
  }
`;
```

### Example 2: Form Layout

**Before:**

```tsx
<Box
  sx={{
    padding: "32px",
    "& .form-field": {
      marginBottom: "20px",
    },
    "& .button-group": {
      gap: "12px",
      marginTop: "28px",
    },
  }}
>
  {/* Form content */}
</Box>
```

**After:**

```tsx
<Box
  sx={{
    padding: "var(--sys-space-8)",
    "& .form-field": {
      marginBottom: "var(--sys-space-5)",
    },
    "& .button-group": {
      gap: "var(--sys-space-3)",
      marginTop: "var(--sys-space-7)",
    },
  }}
>
  {/* Form content */}
</Box>
```

### Example 3: Responsive Spacing

**Before:**

```tsx
<Container
  sx={{
    padding: { xs: "16px", sm: "24px", md: "32px" },
    margin: { xs: "12px", md: "24px" },
  }}
/>
```

**After:**

```tsx
<Container
  sx={{
    padding: {
      xs: "var(--sys-space-4)",
      sm: "var(--sys-space-6)",
      md: "var(--sys-space-8)",
    },
    margin: {
      xs: "var(--sys-space-3)",
      md: "var(--sys-space-6)",
    },
  }}
/>
```

---

## Validation

### Post-Replacement Checks

1. **Syntax Valid:** Code still parses correctly
2. **All Spacing Replaced:** No hardcoded pixel values remain (except edge cases)
3. **Tokens Exist:** All referenced tokens exist in tokens-expressive.json
4. **Visual Regression:** Component looks the same (spacing preserved)
5. **Responsive Behavior:** Breakpoints still work correctly

---

## Output Format

```json
{
  "file": "frontend/src/components/ui/Card/Card.tsx",
  "replacements": 12,
  "details": [
    {
      "line": 15,
      "property": "padding",
      "original": "24px",
      "token": "var(--sys-space-6)",
      "context": "Card container"
    },
    {
      "line": 16,
      "property": "margin",
      "original": "16px 0",
      "token": "var(--sys-space-4) 0",
      "context": "Card spacing"
    }
  ],
  "warnings": [
    {
      "line": 42,
      "message": "Non-standard value 18px rounded to 20px (space-5)"
    }
  ]
}
```

---

## Usage

**As standalone skill:**

```bash
# Pass component file path
m3-layout-refactor --file frontend/src/components/ui/Card/Card.tsx
```

**Within m3-migration-architect (Step 1):**

```javascript
const layoutRefactoredCode = await runSkill("m3-layout-refactor", {
  code: originalCode,
  tokens: tokensExpressive,
});
```

---

**Created:** 2025-11-17
**Version:** 1.0.0
**Status:** Ready for use in migration protocol
