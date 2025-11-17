# M3 Typography Classifier

**Purpose:** Replace hardcoded typography with M3 Expressive type scale tokens.

**Input:** Component file path + tokens-expressive.json
**Output:** Refactored component using M3 type scale tokens

---

## Overview

This skill is Step 3 in the 8-step M3 migration protocol. It:

1. Detects all hardcoded typography (fontSize, fontWeight, lineHeight, fontFamily)
2. Classifies text elements into M3 semantic type scales
3. Replaces with type scale references
4. Ensures typographic hierarchy and consistency
5. Preserves responsive typography patterns

---

## M3 Expressive Type Scales

The M3 Expressive typography system uses 13 semantic type scales:

| Scale | Size | Weight | Line Height | Use Case |
|-------|------|--------|-------------|----------|
| `display-large` | 57px | 400 | 64px | Hero headings |
| `display-medium` | 45px | 400 | 52px | Large headings |
| `display-small` | 36px | 400 | 44px | Section headings |
| `headline-large` | 32px | 400 | 40px | Page titles |
| `headline-medium` | 28px | 400 | 36px | Section titles |
| `headline-small` | 24px | 400 | 32px | Subsection titles |
| `title-large` | 22px | 400 | 28px | Card titles |
| `title-medium` | 16px | 500 | 24px | List titles |
| `title-small` | 14px | 500 | 20px | Small titles |
| `body-large` | 16px | 400 | 24px | Primary body text |
| `body-medium` | 14px | 400 | 20px | Secondary body text |
| `body-small` | 12px | 400 | 16px | Captions, footnotes |
| `label-large` | 14px | 500 | 20px | Buttons, tabs |

---

## Detection Patterns

### Pattern 1: Font Size

```tsx
// ❌ Before
<Typography sx={{ fontSize: '24px' }} />
<h1 style={{ fontSize: 32 }} />
const headingStyle = { fontSize: '28px' };

// ✅ After
<Typography sx={{ fontSize: 'var(--sys-type-headline-small-size)' }} />
<h1 style={{ fontSize: 'var(--sys-type-headline-large-size)' }} />
const headingStyle = { fontSize: 'var(--sys-type-headline-medium-size)' };
```

**Regex:**
```javascript
/(fontSize):\s*['"]?(\d+)(px)?['"]?/g
```

### Pattern 2: Font Weight

```tsx
// ❌ Before
<Typography sx={{ fontWeight: 500 }} />
<span style={{ fontWeight: 'bold' }} />

// ✅ After
<Typography sx={{ fontWeight: 'var(--sys-type-title-medium-weight)' }} />
<span style={{ fontWeight: 'var(--sys-type-title-medium-weight)' }} />
```

**Regex:**
```javascript
/(fontWeight):\s*['"]?(bold|normal|\d+)['"]?/g
```

### Pattern 3: Line Height

```tsx
// ❌ Before
<Typography sx={{ lineHeight: '24px' }} />
<p style={{ lineHeight: 1.5 }} />

// ✅ After
<Typography sx={{ lineHeight: 'var(--sys-type-body-large-lineHeight)' }} />
<p style={{ lineHeight: 'var(--sys-type-body-large-lineHeight)' }} />
```

**Regex:**
```javascript
/(lineHeight):\s*['"]?(\d+\.?\d*)(px)?['"]?/g
```

### Pattern 4: Font Family

```tsx
// ❌ Before
<Typography sx={{ fontFamily: 'Inter, sans-serif' }} />

// ✅ After
<Typography sx={{ fontFamily: 'var(--sys-type-family-body)' }} />
```

**Regex:**
```javascript
/(fontFamily):\s*['"]([^'"]+)['"]?/g
```

### Pattern 5: Material-UI Typography Variant

```tsx
// ❌ Before
<Typography variant="h4" />
<Typography variant="body1" />

// ✅ After (keep variant, add sx for tokens)
<Typography variant="h4" sx={{
  fontSize: 'var(--sys-type-headline-small-size)',
  fontWeight: 'var(--sys-type-headline-small-weight)',
  lineHeight: 'var(--sys-type-headline-small-lineHeight)'
}} />
```

---

## Classification Algorithm

### Step 1: Determine Element Type

```javascript
function getElementType(node) {
  // Check HTML tag
  if (node.tagName === 'h1') return 'heading-1';
  if (node.tagName === 'h2') return 'heading-2';
  if (node.tagName === 'h3') return 'heading-3';
  if (node.tagName === 'h4') return 'heading-4';
  if (node.tagName === 'h5') return 'heading-5';
  if (node.tagName === 'h6') return 'heading-6';
  if (node.tagName === 'p') return 'paragraph';
  if (node.tagName === 'button') return 'button';

  // Check component name
  if (node.componentName === 'Typography') {
    const variant = node.props.variant;
    return variant || 'body1';
  }

  return 'unknown';
}
```

### Step 2: Classify by Font Size

```javascript
const fontSizeClassification = {
  // Display scales (hero content)
  57: 'display-large',
  45: 'display-medium',
  36: 'display-small',

  // Headline scales (page structure)
  32: 'headline-large',
  28: 'headline-medium',
  24: 'headline-small',

  // Title scales (component headers)
  22: 'title-large',
  16: 'title-medium',
  14: 'title-small',

  // Body scales (content)
  16: 'body-large',
  14: 'body-medium',
  12: 'body-small'
};

function classifyByFontSize(fontSize, elementType, fontWeight) {
  const size = parseInt(fontSize, 10);

  // Ambiguous sizes (16px, 14px) - use context
  if (size === 16) {
    if (fontWeight >= 500 || elementType === 'button') {
      return 'title-medium';
    }
    return 'body-large';
  }

  if (size === 14) {
    if (fontWeight >= 500 || elementType === 'button') {
      return 'title-small';
    }
    return 'body-medium';
  }

  // Direct mapping
  return fontSizeClassification[size] || closestMatch(size);
}
```

### Step 3: Context-Aware Classification

```javascript
function classifyTypography(node) {
  const elementType = getElementType(node);
  const fontSize = extractFontSize(node);
  const fontWeight = extractFontWeight(node);
  const context = getContext(node);

  // Heading elements
  if (elementType === 'heading-1') return 'headline-large';
  if (elementType === 'heading-2') return 'headline-medium';
  if (elementType === 'heading-3') return 'headline-small';
  if (elementType === 'heading-4') return 'title-large';
  if (elementType === 'heading-5') return 'title-medium';
  if (elementType === 'heading-6') return 'title-small';

  // Button elements
  if (elementType === 'button') return 'label-large';

  // Hero/Display content
  if (context.isHero || fontSize >= 36) {
    if (fontSize >= 50) return 'display-large';
    if (fontSize >= 40) return 'display-medium';
    return 'display-small';
  }

  // Body content
  if (elementType === 'paragraph' || !fontWeight || fontWeight < 500) {
    return classifyByFontSize(fontSize, elementType, fontWeight);
  }

  // Default classification by font size
  return classifyByFontSize(fontSize, elementType, fontWeight);
}
```

---

## Font Size Mapping Table

### Exact Matches

| Pixel Value | M3 Type Scale |
|-------------|---------------|
| 57px | display-large |
| 45px | display-medium |
| 36px | display-small |
| 32px | headline-large |
| 28px | headline-medium |
| 24px | headline-small |
| 22px | title-large |
| 16px | body-large or title-medium (context-dependent) |
| 14px | body-medium or title-small (context-dependent) |
| 12px | body-small |

### Approximate Matches (Round to Nearest)

| Range | Map To |
|-------|--------|
| 50-64px | display-large (57px) |
| 38-49px | display-medium (45px) |
| 33-37px | display-small (36px) |
| 30-31px | headline-large (32px) |
| 26-27px | headline-medium (28px) |
| 23-25px | headline-small (24px) |
| 20-21px | title-large (22px) |
| 17-19px | body-large (16px) |
| 15px | body-medium (14px) |
| 13px | body-medium (14px) |
| 10-11px | body-small (12px) |

---

## Material-UI Typography Variant Mapping

| Material-UI Variant | M3 Type Scale |
|---------------------|---------------|
| `h1` | headline-large |
| `h2` | headline-medium |
| `h3` | headline-small |
| `h4` | title-large |
| `h5` | title-medium |
| `h6` | title-small |
| `body1` | body-large |
| `body2` | body-medium |
| `caption` | body-small |
| `button` | label-large |
| `subtitle1` | title-medium |
| `subtitle2` | title-small |

---

## Replacement Strategies

### Strategy 1: Full Type Scale Application

```tsx
// ❌ Before
<Typography sx={{
  fontSize: '24px',
  fontWeight: 400,
  lineHeight: '32px'
}} />

// ✅ After
<Typography sx={{
  fontSize: 'var(--sys-type-headline-small-size)',
  fontWeight: 'var(--sys-type-headline-small-weight)',
  lineHeight: 'var(--sys-type-headline-small-lineHeight)'
}} />
```

### Strategy 2: Partial Replacement (Selective)

```tsx
// ❌ Before
<h2 style={{ fontSize: 28, color: '#333' }} />

// ✅ After (only replace typography)
<h2 style={{
  fontSize: 'var(--sys-type-headline-medium-size)',
  fontWeight: 'var(--sys-type-headline-medium-weight)',
  lineHeight: 'var(--sys-type-headline-medium-lineHeight)',
  color: '#333' // Will be replaced in Step 2 (color-themer)
}} />
```

### Strategy 3: Material-UI Typography Enhancement

```tsx
// ❌ Before
<Typography variant="h4" />

// ✅ After
<Typography
  variant="h4"
  sx={{
    fontSize: 'var(--sys-type-title-large-size)',
    fontWeight: 'var(--sys-type-title-large-weight)',
    lineHeight: 'var(--sys-type-title-large-lineHeight)',
    fontFamily: 'var(--sys-type-family-display)'
  }}
/>
```

---

## Example Transformations

### Example 1: Heading Hierarchy

**Before:**
```tsx
<div>
  <h1 style={{ fontSize: 32, fontWeight: 400 }}>Page Title</h1>
  <h2 style={{ fontSize: 24, fontWeight: 400 }}>Section</h2>
  <h3 style={{ fontSize: 16, fontWeight: 500 }}>Subsection</h3>
</div>
```

**After:**
```tsx
<div>
  <h1 style={{
    fontSize: 'var(--sys-type-headline-large-size)',
    fontWeight: 'var(--sys-type-headline-large-weight)',
    lineHeight: 'var(--sys-type-headline-large-lineHeight)'
  }}>
    Page Title
  </h1>
  <h2 style={{
    fontSize: 'var(--sys-type-headline-small-size)',
    fontWeight: 'var(--sys-type-headline-small-weight)',
    lineHeight: 'var(--sys-type-headline-small-lineHeight)'
  }}>
    Section
  </h2>
  <h3 style={{
    fontSize: 'var(--sys-type-title-medium-size)',
    fontWeight: 'var(--sys-type-title-medium-weight)',
    lineHeight: 'var(--sys-type-title-medium-lineHeight)'
  }}>
    Subsection
  </h3>
</div>
```

### Example 2: Body Text

**Before:**
```tsx
<Box>
  <Typography sx={{ fontSize: '16px', lineHeight: 1.5 }}>
    Main content goes here.
  </Typography>
  <Typography sx={{ fontSize: '14px', color: '#757575' }}>
    Secondary description text.
  </Typography>
  <Typography sx={{ fontSize: '12px' }}>
    Fine print or caption.
  </Typography>
</Box>
```

**After:**
```tsx
<Box>
  <Typography sx={{
    fontSize: 'var(--sys-type-body-large-size)',
    fontWeight: 'var(--sys-type-body-large-weight)',
    lineHeight: 'var(--sys-type-body-large-lineHeight)'
  }}>
    Main content goes here.
  </Typography>
  <Typography sx={{
    fontSize: 'var(--sys-type-body-medium-size)',
    fontWeight: 'var(--sys-type-body-medium-weight)',
    lineHeight: 'var(--sys-type-body-medium-lineHeight)',
    color: '#757575'
  }}>
    Secondary description text.
  </Typography>
  <Typography sx={{
    fontSize: 'var(--sys-type-body-small-size)',
    fontWeight: 'var(--sys-type-body-small-weight)',
    lineHeight: 'var(--sys-type-body-small-lineHeight)'
  }}>
    Fine print or caption.
  </Typography>
</Box>
```

### Example 3: Button Typography

**Before:**
```tsx
<Button sx={{
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'uppercase'
}}>
  Click Me
</Button>
```

**After:**
```tsx
<Button sx={{
  fontSize: 'var(--sys-type-label-large-size)',
  fontWeight: 'var(--sys-type-label-large-weight)',
  lineHeight: 'var(--sys-type-label-large-lineHeight)',
  textTransform: 'uppercase'
}}>
  Click Me
</Button>
```

### Example 4: Card Component

**Before:**
```tsx
const CardHeader = styled.div`
  h3 {
    font-size: 22px;
    font-weight: 400;
    line-height: 28px;
  }

  p {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }
`;
```

**After:**
```tsx
const CardHeader = styled.div`
  h3 {
    font-size: var(--sys-type-title-large-size);
    font-weight: var(--sys-type-title-large-weight);
    line-height: var(--sys-type-title-large-lineHeight);
  }

  p {
    font-size: var(--sys-type-body-medium-size);
    font-weight: var(--sys-type-body-medium-weight);
    line-height: var(--sys-type-body-medium-lineHeight);
  }
`;
```

---

## Edge Cases

### Case 1: Responsive Typography

```tsx
// ❌ Before
<Typography sx={{
  fontSize: { xs: '24px', md: '32px' }
}} />

// ✅ After
<Typography sx={{
  fontSize: {
    xs: 'var(--sys-type-headline-small-size)',
    md: 'var(--sys-type-headline-large-size)'
  },
  fontWeight: {
    xs: 'var(--sys-type-headline-small-weight)',
    md: 'var(--sys-type-headline-large-weight)'
  },
  lineHeight: {
    xs: 'var(--sys-type-headline-small-lineHeight)',
    md: 'var(--sys-type-headline-large-lineHeight)'
  }
}} />
```

### Case 2: Calculated Font Sizes

```tsx
// ❌ Before
fontSize: `${baseSize * 1.5}px`

// ⚠️ Manual Review Required
// Replace with appropriate type scale or keep dynamic calculation
```

### Case 3: Inherited Typography

```tsx
// ✅ Keep as-is if relying on parent
<span>Text inherits from parent</span>
```

### Case 4: Font Weight Names

```javascript
// Map font weight names to numbers
const fontWeightMap = {
  'normal': 400,
  'bold': 700,
  'lighter': 300,
  'bolder': 600
};
```

---

## Validation

### Post-Replacement Checks

1. **Syntax Valid:** Code still parses correctly
2. **All Typography Replaced:** No hardcoded font properties remain
3. **Tokens Exist:** All referenced tokens exist in tokens-expressive.json
4. **Visual Regression:** Typography looks the same
5. **Hierarchy Preserved:** Semantic heading levels maintained
6. **Accessibility:** Font sizes meet minimum 12px requirement

---

## Output Format

```json
{
  "file": "frontend/src/components/ui/Card/Card.tsx",
  "replacements": 8,
  "details": [
    {
      "line": 12,
      "element": "h3",
      "original": {
        "fontSize": "22px",
        "fontWeight": 400,
        "lineHeight": "28px"
      },
      "typeScale": "title-large",
      "tokens": {
        "size": "var(--sys-type-title-large-size)",
        "weight": "var(--sys-type-title-large-weight)",
        "lineHeight": "var(--sys-type-title-large-lineHeight)"
      }
    }
  ],
  "warnings": [
    {
      "line": 45,
      "message": "Non-standard font size 18px rounded to 16px (body-large)"
    }
  ]
}
```

---

## Usage

**As standalone skill:**
```bash
# Pass component file path
m3-typography-classifier --file frontend/src/components/ui/Card/Card.tsx
```

**Within m3-migration-architect (Step 3):**
```javascript
const typographyClassifiedCode = await runSkill('m3-typography-classifier', {
  code: colorThemedCode,
  tokens: tokensExpressive
});
```

---

**Created:** 2025-11-17
**Version:** 1.0.0
**Status:** Ready for use in migration protocol
