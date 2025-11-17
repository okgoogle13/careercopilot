# M3 Editorial Stylist

**Purpose:** Apply M3 Expressive editorial styling conventions to text content.

**Input:** Component file path + tokens-expressive.json
**Output:** Refactored component with consistent editorial styling patterns

---

## Overview

This skill is Step 4 in the 8-step M3 migration protocol. It:

1. Standardizes text alignment patterns
2. Applies consistent letter spacing (tracking)
3. Normalizes text transform usage
4. Implements text overflow handling (ellipsis, clamping)
5. Enforces editorial best practices (capitalization, line breaks)
6. Ensures accessibility-compliant text styling

---

## Editorial Styling Conventions

### Text Alignment

**M3 Expressive Guidelines:**
- Body text: left-aligned (LTR languages)
- Headings: left-aligned (avoid center unless hero content)
- Buttons/CTAs: inherit from container
- Form labels: left-aligned
- Error messages: left-aligned
- Captions: left-aligned or right-aligned (for images)

```tsx
// ❌ Before (inconsistent alignment)
<Typography sx={{ textAlign: 'center' }}>Body content</Typography>
<h2 style={{ textAlign: 'center' }}>Section Title</h2>

// ✅ After (M3 conventions)
<Typography sx={{ textAlign: 'left' }}>Body content</Typography>
<h2 style={{ textAlign: 'left' }}>Section Title</h2>

// ✅ Exception: Hero content CAN be centered
<Typography
  variant="display-large"
  sx={{ textAlign: 'center' }}
  className="hero-title"
>
  Welcome to Our Platform
</Typography>
```

### Letter Spacing (Tracking)

**M3 Expressive Guidelines:**
- Display text: -0.25px to 0px (tighter for large text)
- Headlines: 0px (normal)
- Titles: 0.1px (slightly loose for readability)
- Body text: 0px (normal)
- Labels/Buttons: 0.1px to 0.5px (loose for uppercase)
- All caps: 0.5px minimum (improved legibility)

```tsx
// ❌ Before
<Button sx={{ letterSpacing: '2px', textTransform: 'uppercase' }}>
  Submit
</Button>

// ✅ After (M3 conventions)
<Button sx={{
  letterSpacing: '0.5px', // Reduced excessive spacing
  textTransform: 'uppercase'
}}>
  Submit
</Button>
```

### Text Transform

**M3 Expressive Guidelines:**
- Buttons: `uppercase` (standard)
- Headings: `none` (sentence case or title case in content)
- Body text: `none` (preserve natural capitalization)
- Labels: `uppercase` for short labels, `none` for longer text
- Avoid `lowercase` (poor readability)

```tsx
// ❌ Before (poor practices)
<Typography sx={{ textTransform: 'lowercase' }}>
  IMPORTANT MESSAGE
</Typography>

// ✅ After
<Typography sx={{ textTransform: 'none' }}>
  Important message
</Typography>

// ✅ Buttons: uppercase OK
<Button sx={{ textTransform: 'uppercase' }}>
  Learn More
</Button>
```

### Text Overflow & Ellipsis

**M3 Expressive Guidelines:**
- Single-line truncation: `text-overflow: ellipsis`
- Multi-line clamping: `-webkit-line-clamp` (2-3 lines max)
- Avoid truncation for critical content (headings, error messages)
- Always provide full text access (tooltips, expand buttons)

```tsx
// ❌ Before (no truncation handling)
<Typography>{longText}</Typography>

// ✅ After (single-line ellipsis)
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

## Detection Patterns

### Pattern 1: Text Alignment

**Regex:**
```javascript
/(textAlign):\s*['"]?(left|center|right|justify)['"]?/g
```

**Detection:**
- Center-aligned body text → Flag for review
- Center-aligned headings → Flag unless hero content
- Justified text → Flag (poor web readability)

### Pattern 2: Letter Spacing

**Regex:**
```javascript
/(letterSpacing):\s*['"]?([-\d.]+)(px|em|rem)?['"]?/g
```

**Detection:**
- Excessive spacing (>1px) → Reduce to 0.5px max
- Negative spacing on small text (<16px) → Remove
- Uppercase text without spacing → Add 0.5px

### Pattern 3: Text Transform

**Regex:**
```javascript
/(textTransform):\s*['"]?(uppercase|lowercase|capitalize|none)['"]?/g
```

**Detection:**
- `lowercase` usage → Convert to `none`
- `uppercase` on long text (>20 chars) → Convert to `none`
- `capitalize` on body text → Flag for content review

### Pattern 4: Text Overflow

**Regex:**
```javascript
/(textOverflow|overflow|whiteSpace|WebkitLineClamp):\s*['"]?([^'";}]+)['"]?/g
```

**Detection:**
- `overflow: hidden` without `text-overflow: ellipsis` → Add ellipsis
- Multi-line text without clamp → Add line clamp
- Long text in cards → Add truncation

---

## Editorial Styling Rules

### Rule 1: Heading Alignment (Left-Aligned by Default)

```tsx
// ❌ Before
const PageHeader = styled.h1`
  text-align: center;
`;

// ✅ After
const PageHeader = styled.h1`
  text-align: left;
`;

// ✅ Exception: Hero sections
const HeroHeader = styled.h1`
  text-align: center; // OK for hero content
`;
```

### Rule 2: Button Letter Spacing (0.5px for Uppercase)

```tsx
// ❌ Before
<Button sx={{
  textTransform: 'uppercase',
  letterSpacing: '0px'
}}>
  Continue
</Button>

// ✅ After
<Button sx={{
  textTransform: 'uppercase',
  letterSpacing: '0.5px' // Improved legibility
}}>
  Continue
</Button>
```

### Rule 3: Text Truncation (Single Line)

```tsx
// ❌ Before
<Typography className="card-title">
  {title}
</Typography>

// ✅ After
<Typography
  className="card-title"
  sx={{
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%'
  }}
  title={title} // Accessibility: full text in tooltip
>
  {title}
</Typography>
```

### Rule 4: Multi-Line Clamping

```tsx
// ❌ Before
<Typography className="card-description">
  {longDescription}
</Typography>

// ✅ After
<Typography
  className="card-description"
  sx={{
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
    overflow: 'hidden',
    lineHeight: 'var(--sys-type-body-medium-lineHeight)'
  }}
>
  {longDescription}
</Typography>
```

### Rule 5: Avoid Justified Text

```tsx
// ❌ Before (poor web readability)
<Typography sx={{ textAlign: 'justify' }}>
  Long paragraph content...
</Typography>

// ✅ After
<Typography sx={{ textAlign: 'left' }}>
  Long paragraph content...
</Typography>
```

---

## Example Transformations

### Example 1: Card Component

**Before:**
```tsx
const Card = styled.div`
  .title {
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  .description {
    text-align: justify;
    overflow: hidden;
  }
`;
```

**After:**
```tsx
const Card = styled.div`
  .title {
    text-align: left; // M3 convention
    text-transform: none; // Title case in content
    letter-spacing: 0.1px; // Subtle for readability
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .description {
    text-align: left; // Readable on web
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
`;
```

### Example 2: Button Styling

**Before:**
```tsx
<Button sx={{
  textTransform: 'uppercase',
  letterSpacing: '2px',
  textAlign: 'center'
}}>
  Get Started Now
</Button>
```

**After:**
```tsx
<Button sx={{
  textTransform: 'uppercase',
  letterSpacing: '0.5px', // Reduced excessive spacing
  // textAlign removed (buttons inherit alignment)
}}>
  Get Started Now
</Button>
```

### Example 3: Form Labels

**Before:**
```tsx
<FormLabel sx={{
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontSize: '12px'
}}>
  Email Address
</FormLabel>
```

**After:**
```tsx
<FormLabel sx={{
  textTransform: 'none', // Better readability
  letterSpacing: '0px',
  fontSize: 'var(--sys-type-body-small-size)',
  fontWeight: 'var(--sys-type-body-small-weight)'
}}>
  Email address
</FormLabel>
```

### Example 4: List Item Truncation

**Before:**
```tsx
<ListItem>
  <ListItemText
    primary={item.title}
    secondary={item.description}
  />
</ListItem>
```

**After:**
```tsx
<ListItem>
  <ListItemText
    primary={item.title}
    secondary={item.description}
    primaryTypographyProps={{
      sx: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }}
    secondaryTypographyProps={{
      sx: {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        overflow: 'hidden'
      }
    }}
  />
</ListItem>
```

---

## Special Cases

### Case 1: Hero Content (Center Alignment OK)

```tsx
// ✅ Exception: Hero sections can be centered
<Box className="hero-section" sx={{ textAlign: 'center' }}>
  <Typography variant="display-large">
    Welcome to CareerCopilot
  </Typography>
  <Typography variant="body-large" sx={{ maxWidth: '600px', margin: '0 auto' }}>
    Your AI-powered career companion
  </Typography>
</Box>
```

### Case 2: RTL Language Support

```tsx
// ✅ Use logical properties for RTL support
<Typography sx={{
  textAlign: 'start', // 'start' instead of 'left' (RTL-aware)
  paddingInlineStart: 'var(--sys-space-4)' // Logical property
}}>
  Content
</Typography>
```

### Case 3: Monospace Text (Code Blocks)

```tsx
// ✅ Preserve monospace styling
<Typography
  component="code"
  sx={{
    fontFamily: 'monospace',
    letterSpacing: '0px', // No extra spacing for code
    whiteSpace: 'pre-wrap', // Preserve formatting
    textAlign: 'left'
  }}
>
  {codeSnippet}
</Typography>
```

### Case 4: All-Caps Headers (Legacy)

```tsx
// ❌ Before (all-caps with no spacing)
<Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
  Section Header
</Typography>

// ✅ After (add letter spacing for legibility)
<Typography variant="h6" sx={{
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
}}>
  Section Header
</Typography>

// ✅ Better: Remove transform, use natural case
<Typography variant="h6" sx={{
  textTransform: 'none',
  letterSpacing: '0px'
}}>
  Section header
</Typography>
```

---

## Accessibility Considerations

### WCAG Guidelines

1. **Text Alignment:**
   - Avoid justified text (causes uneven spacing)
   - Prefer left-aligned for LTR languages
   - Use `text-align: start` for RTL support

2. **Letter Spacing:**
   - Minimum 0.12em (1.92px for 16px text) for readability
   - Avoid negative letter spacing on body text
   - Increase spacing for all-caps text

3. **Text Transform:**
   - Avoid all lowercase (poor scannability)
   - Screen readers may mispronounce all-caps text
   - Prefer natural capitalization

4. **Text Truncation:**
   - Always provide access to full text (tooltip, expand)
   - Don't truncate critical content (error messages, CTAs)
   - Use `title` attribute for truncated text

---

## Validation

### Post-Styling Checks

1. **Text Alignment:** Body text is left-aligned (or `start` for RTL)
2. **Letter Spacing:** Uppercase text has ≥0.5px spacing
3. **Text Transform:** No `lowercase` usage
4. **Truncation:** Full text accessible via tooltip/expand
5. **Readability:** Text is scannable and legible
6. **Accessibility:** Meets WCAG 2.1 Level AA

---

## Output Format

```json
{
  "file": "frontend/src/components/ui/Card/Card.tsx",
  "replacements": 6,
  "details": [
    {
      "line": 15,
      "property": "textAlign",
      "original": "center",
      "updated": "left",
      "reason": "M3 convention: body text left-aligned"
    },
    {
      "line": 22,
      "property": "letterSpacing",
      "original": "2px",
      "updated": "0.5px",
      "reason": "Reduced excessive spacing on uppercase text"
    },
    {
      "line": 30,
      "added": "text-overflow: ellipsis",
      "reason": "Added truncation handling for long titles"
    }
  ],
  "warnings": [
    {
      "line": 45,
      "message": "Justified text detected - poor web readability"
    }
  ]
}
```

---

## Usage

**As standalone skill:**
```bash
# Pass component file path
m3-editorial-stylist --file frontend/src/components/ui/Card/Card.tsx
```

**Within m3-migration-architect (Step 4):**
```javascript
const editorialStyledCode = await runSkill('m3-editorial-stylist', {
  code: typographyClassifiedCode,
  tokens: tokensExpressive
});
```

---

**Created:** 2025-11-17
**Version:** 1.0.0
**Status:** Ready for use in migration protocol
