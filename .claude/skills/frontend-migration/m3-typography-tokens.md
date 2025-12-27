# M3 Typography Tokens (Type Scale + Editorial)

**Purpose:** Unify typography styling using M3 type scale tokens and editorial conventions.

**Input:** Component file path + tokens-expressive.json
**Output:** Refactored component using `var(--sys-type-*)` and editorial styling

---

## Overview

Consolidates Steps 3-4 of the 8-step M3 migration protocol:

1. **Type Scale Classification** - Map hardcoded typography to 13 M3 semantic scales
2. **Editorial Conventions** - Apply text alignment, spacing, overflow, transform standards

---

## Part 1: M3 Type Scales (13 Total)

| Scale             | Size | Weight | Line Height | Use Case            |
| ----------------- | ---- | ------ | ----------- | ------------------- |
| `display-large`   | 57px | 400    | 64px        | Hero headings       |
| `display-medium`  | 45px | 400    | 52px        | Large headings      |
| `display-small`   | 36px | 400    | 44px        | Section headings    |
| `headline-large`  | 32px | 400    | 40px        | Page titles         |
| `headline-medium` | 28px | 400    | 36px        | Section titles      |
| `headline-small`  | 24px | 400    | 32px        | Subsection titles   |
| `title-large`     | 22px | 400    | 28px        | Card titles         |
| `title-medium`    | 16px | 500    | 24px        | List titles         |
| `title-small`     | 14px | 500    | 20px        | Small titles        |
| `body-large`      | 16px | 400    | 24px        | Primary body text   |
| `body-medium`     | 14px | 400    | 20px        | Secondary body text |
| `body-small`      | 12px | 400    | 16px        | Captions, footnotes |
| `label-large`     | 14px | 500    | 20px        | Buttons, tabs       |

---

## Part 2: Editorial Styling Conventions

### Text Alignment

- Body text: left-aligned (LTR)
- Headings: left-aligned (except hero: center OK)
- Form labels: left-aligned
- Avoid justified text (poor web readability)

### Letter Spacing

- Display text: -0.25px to 0px (tighter for large)
- Headlines: 0px (normal)
- Titles: 0.1px (slightly loose)
- Body text: 0px (normal)
- Labels/Buttons with uppercase: 0.5px minimum

### Text Transform

- Buttons: `uppercase` (standard)
- Headings/Body: `none` (sentence case)
- Avoid `lowercase` (poor readability)

### Text Overflow

- Single-line: `text-overflow: ellipsis` + `whiteSpace: nowrap`
- Multi-line: `-webkit-line-clamp` (2-3 lines max)
- Always provide full text access (tooltips, title attribute)

---

## Detection Patterns

### Pattern 1: Font Size

```tsx
// ❌ Before
<Typography sx={{ fontSize: '24px' }} />
<h1 style={{ fontSize: 32 }} />

// ✅ After
<Typography sx={{ fontSize: 'var(--sys-type-headline-small-size)' }} />
<h1 style={{ fontSize: 'var(--sys-type-headline-large-size)' }} />
```

**Regex:** `/(fontSize):\s*['"]?(\d+)(px)?['"]?/g`

### Pattern 2: Font Weight

```tsx
// ❌ Before
<Typography sx={{ fontWeight: 500 }} />

// ✅ After
<Typography sx={{ fontWeight: 'var(--sys-type-title-medium-weight)' }} />
```

**Regex:** `/(fontWeight):\s*['"]?(bold|normal|\d+)['"]?/g`

### Pattern 3: Line Height

```tsx
// ❌ Before
<Typography sx={{ lineHeight: '24px' }} />

// ✅ After
<Typography sx={{ lineHeight: 'var(--sys-type-body-large-lineHeight)' }} />
```

### Pattern 4: Text Alignment (Editorial)

```tsx
// ❌ Before (center-aligned body text)
<Typography sx={{ textAlign: 'center' }}>Body content</Typography>

// ✅ After
<Typography sx={{ textAlign: 'left' }}>Body content</Typography>
```

### Pattern 5: Letter Spacing (Editorial)

```tsx
// ❌ Before
<Button sx={{ letterSpacing: '2px', textTransform: 'uppercase' }}>Submit</Button>

// ✅ After
<Button sx={{ letterSpacing: '0.5px', textTransform: 'uppercase' }}>Submit</Button>
```

### Pattern 6: Text Overflow (Editorial)

```tsx
// ❌ Before
<Typography>{longText}</Typography>

// ✅ After (single-line)
<Typography sx={{
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}}>
  {longText}
</Typography>

// ✅ After (multi-line clamp)
<Typography sx={{
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  overflow: 'hidden'
}}>
  {longText}
</Typography>
```

---

## Type Scale Mapping

### Classification Algorithm

```javascript
function classifyTypography(node) {
  const elementType = getElementType(node); // h1, h2, p, button, etc.
  const fontSize = extractFontSize(node);
  const fontWeight = extractFontWeight(node);

  // Heading elements
  if (elementType === "heading-1") return "headline-large";
  if (elementType === "heading-2") return "headline-medium";
  if (elementType === "heading-3") return "headline-small";
  if (elementType === "heading-4") return "title-large";

  // Button elements
  if (elementType === "button") return "label-large";

  // Hero/Display content (font size >= 36px)
  if (fontSize >= 36) {
    if (fontSize >= 50) return "display-large";
    if (fontSize >= 40) return "display-medium";
    return "display-small";
  }

  // Ambiguous sizes - use context
  if (fontSize === 16) {
    return fontWeight >= 500 ? "title-medium" : "body-large";
  }
  if (fontSize === 14) {
    return fontWeight >= 500 ? "title-small" : "body-medium";
  }

  // Default by font size
  const sizeMap = {
    57: "display-large",
    45: "display-medium",
    36: "display-small",
    32: "headline-large",
    28: "headline-medium",
    24: "headline-small",
    22: "title-large",
    12: "body-small",
  };

  return sizeMap[fontSize] || "body-large";
}
```

### Font Size Mapping Table

| Range   | Maps To                |
| ------- | ---------------------- |
| 50-64px | display-large (57px)   |
| 38-49px | display-medium (45px)  |
| 33-37px | display-small (36px)   |
| 30-31px | headline-large (32px)  |
| 26-27px | headline-medium (28px) |
| 23-25px | headline-small (24px)  |
| 20-21px | title-large (22px)     |
| 15-19px | body-large (16px)      |
| 13-14px | body-medium (14px)     |
| 10-12px | body-small (12px)      |

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
  <h1
    style={{
      fontSize: "var(--sys-type-headline-large-size)",
      fontWeight: "var(--sys-type-headline-large-weight)",
      lineHeight: "var(--sys-type-headline-large-lineHeight)",
      textAlign: "left",
    }}
  >
    Page Title
  </h1>
  <h2
    style={{
      fontSize: "var(--sys-type-headline-small-size)",
      fontWeight: "var(--sys-type-headline-small-weight)",
      lineHeight: "var(--sys-type-headline-small-lineHeight)",
      textAlign: "left",
    }}
  >
    Section
  </h2>
  <h3
    style={{
      fontSize: "var(--sys-type-title-medium-size)",
      fontWeight: "var(--sys-type-title-medium-weight)",
      lineHeight: "var(--sys-type-title-medium-lineHeight)",
      textAlign: "left",
    }}
  >
    Subsection
  </h3>
</div>
```

### Example 2: Card Typography + Editorial

**Before:**

```tsx
const CardHeader = styled.div`
  h3 {
    font-size: 22px;
    font-weight: 400;
    line-height: 28px;
    text-align: center;
  }
  p {
    font-size: 14px;
    text-align: justify;
    overflow: hidden;
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
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  p {
    font-size: var(--sys-type-body-medium-size);
    font-weight: var(--sys-type-body-medium-weight);
    line-height: var(--sys-type-body-medium-lineHeight);
    text-align: left;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
`;
```

### Example 3: Button Typography + Letter Spacing

**Before:**

```tsx
<Button
  sx={{
    fontSize: "14px",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "2px",
  }}
>
  Click Me
</Button>
```

**After:**

```tsx
<Button
  sx={{
    fontSize: "var(--sys-type-label-large-size)",
    fontWeight: "var(--sys-type-label-large-weight)",
    lineHeight: "var(--sys-type-label-large-lineHeight)",
    textTransform: "uppercase",
    letterSpacing: "0.5px", // Reduced excessive spacing
  }}
>
  Click Me
</Button>
```

### Example 4: Form Label + Editorial

**Before:**

```tsx
<FormLabel
  sx={{
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontSize: "12px",
  }}
>
  Email Address
</FormLabel>
```

**After:**

```tsx
<FormLabel
  sx={{
    fontSize: "var(--sys-type-body-small-size)",
    fontWeight: "var(--sys-type-body-small-weight)",
    lineHeight: "var(--sys-type-body-small-lineHeight)",
    textTransform: "none",
    letterSpacing: "0px",
  }}
>
  Email address
</FormLabel>
```

---

## Editorial Rules

### Rule 1: Heading Alignment (Left by Default)

```tsx
// ❌ Before
const PageHeader = styled.h1`
  text-align: center;
`;

// ✅ After
const PageHeader = styled.h1`
  text-align: left;
`;

// ✅ Exception: Hero sections can be centered
const HeroHeader = styled.h1`
  text-align: center; /* OK for hero */
`;
```

### Rule 2: Button Letter Spacing (0.5px for Uppercase)

```tsx
// ❌ Before
<Button sx={{ textTransform: 'uppercase', letterSpacing: '0px' }}>Submit</Button>

// ✅ After
<Button sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Submit</Button>
```

### Rule 3: Single-Line Truncation

```tsx
// ✅ Add ellipsis handling
<Typography
  sx={{
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    title: title, // Accessibility
  }}
>
  {title}
</Typography>
```

### Rule 4: Multi-Line Clamping

```tsx
// ✅ Clamp to 3 lines max
<Typography
  sx={{
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 3,
    overflow: "hidden",
  }}
>
  {longDescription}
</Typography>
```

### Rule 5: Avoid Justified Text

```tsx
// ❌ Before
<Typography sx={{ textAlign: 'justify' }}>Long text...</Typography>

// ✅ After
<Typography sx={{ textAlign: 'left' }}>Long text...</Typography>
```

---

## Accessibility Considerations

1. **Text Alignment:** Use `text-align: start` for RTL support
2. **Letter Spacing:** Minimum 0.12em (1.92px for 16px text)
3. **Text Transform:** Avoid all lowercase; prefer natural capitalization
4. **Text Truncation:** Always provide full text access (tooltip, title attribute)
5. **Font Size:** Maintain minimum 12px for body text
6. **Line Height:** Ensure readability (typically 1.5x font size)

---

## Validation

### Post-Replacement Checks

1. **Syntax Valid:** Code still parses correctly
2. **All Typography Replaced:** No hardcoded font properties remain
3. **Tokens Exist:** All referenced tokens in tokens-expressive.json
4. **Visual Regression:** Typography looks the same
5. **Hierarchy Preserved:** Semantic heading levels maintained
6. **Accessibility:** Font sizes ≥ 12px, line-height ratios appropriate

---

## Output Format

```json
{
  "file": "frontend/src/components/ui/Card/Card.tsx",
  "replacements": 14,
  "typography_replacements": 8,
  "editorial_replacements": 6,
  "details": [
    {
      "line": 12,
      "element": "h3",
      "original": { "fontSize": "22px", "fontWeight": 400 },
      "typeScale": "title-large",
      "tokens": { "size": "var(--sys-type-title-large-size)" }
    },
    {
      "line": 22,
      "property": "textAlign",
      "original": "center",
      "updated": "left",
      "reason": "M3 convention: body text left-aligned"
    }
  ],
  "warnings": [{ "line": 45, "message": "Non-standard font size 18px rounded to 16px" }]
}
```

---

**Version:** 1.0.0
**Status:** Consolidated skill combining typography classification + editorial styling
