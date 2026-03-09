# Typography Guidelines Reference

This reference provides comprehensive specifications for creating expressive typography systems. Use this when developing typography in Step 3 of the creation process.

## Table of Contents

1. Font Selection Principles
2. Display Font Guidance
3. Body Font Guidance
4. Variable Axes Strategy
5. Type Scale and Role Mapping
6. Hierarchy and Contrast Rules
7. Accessibility Constraints
8. Pairing Patterns
9. Anti-Patterns
10. Output Checklist

## Font Selection Principles

### Display Font (Large Headlines, Hero Moments)

**Purpose**: Create visual impact and personality

**Requirements**:
- MUST be distinctive (not Inter, Roboto, system fonts)
- Should reflect the visual metaphor
- High contrast with body font family
- Suitable for large sizes (48px+)

**Good choices**:
- Variable display serif (e.g., Fraunces,递体, Crimson Pro)
- Geometric sans with personality (e.g., Space Grotesk, Darker Grotesque, Syne)
- Expressive script or decorative (use sparingly)
- Display condensed or extended fonts

**Avoid**:
- Generic sans-serif (Inter, Roboto, Arial)
- Overused "startup" fonts (Montserrat, Poppins)
- Fonts without personality

### Body Font (Readable Text)

**Purpose**: Ensure readability and support long-form content

**Requirements**:
- High readability at 14-18px
- Good character differentiation
- Supports required weights (400, 500, 600, 700)
- Works well at paragraph length

**Good choices**:
- Variable serif for editorial feel (e.g., Literata, Source Serif, Newsreader)
- Humanist sans for clarity (e.g., Fira Sans, Source Sans, Work Sans)
- Grotesque sans for neutrality (e.g., Archivo, Public Sans)

**Avoid**:
- Same family as display font (unless intentional monotype system)
- Condensed fonts (hard to read in paragraphs)
- Decorative or script fonts

### Optional Monospace Font

**Purpose**: Display code, data, or technical information

**Requirements**:
- Clear character differentiation (0 vs O, 1 vs l vs I)
- Suitable for code blocks
- Consistent character width

**Good choices**:
- JetBrains Mono, Fira Code, IBM Plex Mono, Source Code Pro

## Variable Font Axes

Variable fonts allow parametric control over appearance. When specifying variable fonts, define which axes to leverage:

### Common Axes

- **`wght`** (Weight): 100-900, use full range for dramatic contrast
- **`wdth`** (Width): 75-125, use for spatial emphasis or condensing
- **`slnt`** (Slant): -15 to 0, use for emphasis without italics
- **`opsz`** (Optical Size): 8-144, auto-adjust based on font size
- **`GRAD`** (Grade): Adjust stroke weight without changing width
- **`SOFT`** (Softness): Round or sharpen terminals
- **`CASL`** (Casual): Adjust formality (handwriting-like)

### Parametric Usage Rules

Define when to engage axes:
- **Headlines**: Max `wght` (900), max `wdth` (125) for impact
- **Emphasis**: Use `GRAD` to thicken without reflow
- **Subtle hierarchy**: Use `wdth` (85-115) instead of size changes
- **Display text**: Set `opsz` to match intended size

Example:
```css
/* Hero headline - maximize impact */
h1 {
  font-variation-settings: 'wght' 900, 'wdth' 125, 'opsz' 72;
}

/* Body text - optimize readability */
p {
  font-variation-settings: 'wght' 400, 'opsz' 16;
}
```

## Type Scale System

Define a complete hierarchy of text sizes with clear semantic roles:

### Material 3 Type Scale Roles

1. **Display Large** (57px, 64px line height)
   - Hero moments, splash screens
   - Weight: 400 (or 900 for impact)
   - Use: Very rare, 1-2x per page max

2. **Display Medium** (45px, 52px line height)
   - Section headers, feature callouts
   - Weight: 400 (or 700 for emphasis)
   - Use: Sparingly, 2-4x per page

3. **Display Small** (36px, 44px line height)
   - Page titles, major sections
   - Weight: 400
   - Use: 1x per major section

4. **Headline Large** (32px, 40px line height)
   - Card titles, prominent labels
   - Weight: 400
   - Use: Component-level headers

5. **Headline Medium** (28px, 36px line height)
   - Subsection headers
   - Weight: 400
   - Use: Common headers

6. **Headline Small** (24px, 32px line height)
   - Small headers, list titles
   - Weight: 400
   - Use: Frequent headers

7. **Title Large** (22px, 28px line height)
   - Emphasized content, call-to-action labels
   - Weight: 400 (or 500 medium)
   - Use: Buttons, prominent labels

8. **Title Medium** (16px, 24px line height)
   - Navigation items, tab labels
   - Weight: 500
   - Use: UI chrome, navigation

9. **Title Small** (14px, 20px line height)
   - Dense UI, compact labels
   - Weight: 500
   - Use: Dense layouts

10. **Body Large** (16px, 24px line height)
    - Main body text, paragraphs
    - Weight: 400
    - Use: Default reading text

11. **Body Medium** (14px, 20px line height)
    - Secondary text, descriptions
    - Weight: 400
    - Use: Supporting content

12. **Body Small** (12px, 16px line height)
    - Captions, small labels
    - Weight: 400
    - Use: Metadata, timestamps

13. **Label Large** (14px, 20px line height)
    - Form labels, button text
    - Weight: 500
    - Use: Interactive elements

14. **Label Medium** (12px, 16px line height)
    - Small button text, tags
    - Weight: 500
    - Use: Compact UI

15. **Label Small** (11px, 16px line height)
    - Tiny labels, dense tags
    - Weight: 500
    - Use: Very compact UI

## Contrast Requirements

Create **dramatic hierarchies** with extreme contrast:

### Weight Contrast
- **Minimum**: 3x difference (e.g., 300 vs 900)
- **Strong**: 5x+ difference (e.g., 100 vs 700)
- **Avoid**: Subtle differences (400 vs 500)

### Size Contrast
- **Minimum**: 3x difference (e.g., 12px vs 36px)
- **Strong**: 4x+ difference (e.g., 14px vs 57px)
- **Avoid**: Small differences (16px vs 18px)

### Example Hierarchy
```
Display Large:  57px / 900 weight
Headline Small: 24px / 400 weight  → 2.4x size, 2.25x weight
Body Large:     16px / 400 weight  → 1.5x size, 1x weight
Label Small:    11px / 500 weight  → 1.5x size, 1.25x weight
```

## High-Contrast Pairing

Display and body fonts MUST be different families to create visual interest:

### Effective Pairings

**Display Serif + Geometric Sans**
- Display: Fraunces, Crimson Pro, Spectral
- Body: DM Sans, Space Grotesk, Archivo
- Effect: Editorial, sophisticated

**Geometric Sans + Humanist Serif**
- Display: Space Grotesk, Darker Grotesque, Syne
- Body: Literata, Source Serif, Newsreader
- Effect: Modern, balanced

**Variable Display + Monospace**
- Display: Recursive, Inter Display (with variable axes)
- Body: JetBrains Mono, Fira Code
- Effect: Technical, precise

**Decorative + Neutral Sans**
- Display: Custom/unique display font
- Body: Work Sans, Public Sans, Fira Sans
- Effect: Distinctive, clear hierarchy

### Avoid

- **Monotone pairing**: Roboto + Roboto, Inter + Inter
- **Too similar**: Two geometric sans, two serifs from same era
- **Conflicting personality**: Playful display + formal serif body

## Parametric Typography Examples

### Example 1: Expressive Variable System
```css
:root {
  /* Display: Fraunces (variable serif) */
  --font-display: 'Fraunces', serif;

  /* Body: Work Sans (variable sans) */
  --font-body: 'Work Sans', sans-serif;
}

.hero-headline {
  font-family: var(--font-display);
  font-size: 57px;
  font-variation-settings:
    'wght' 900,     /* Maximum weight */
    'SOFT' 100,     /* Maximum softness */
    'WONK' 1;       /* Enable wonky alternates */
  line-height: 1.1;
}

.body-text {
  font-family: var(--font-body);
  font-size: 16px;
  font-variation-settings:
    'wght' 400,     /* Regular weight */
    'wdth' 100;     /* Normal width */
  line-height: 1.5;
}
```

### Example 2: Minimal Parametric System
```css
:root {
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Literata', serif;
}

.headline {
  font-family: var(--font-display);
  font-size: 45px;
  font-weight: 700;
  letter-spacing: -0.02em;  /* Tighter for display */
}

.paragraph {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.01em;   /* Looser for readability */
}
```

## Letter Spacing Guidelines

Adjust letter spacing based on font size and weight:

- **Display sizes (36px+)**: -0.02em to -0.01em (tighter)
- **Headline sizes (24-36px)**: -0.01em to 0em (slightly tight)
- **Body sizes (14-18px)**: 0em to 0.01em (default to slightly loose)
- **Small sizes (11-13px)**: 0.01em to 0.02em (looser for clarity)

**Heavy weights**: Decrease letter spacing by 0.01-0.02em
**Light weights**: Increase letter spacing by 0.01-0.02em

## Line Height Guidelines

Balance readability with visual density:

- **Display text**: 1.0-1.2 (tight for impact)
- **Headlines**: 1.2-1.3 (balanced)
- **Body text**: 1.5-1.6 (comfortable reading)
- **Dense UI**: 1.3-1.4 (compact but readable)

Longer line lengths need more line height; shorter line lengths can be tighter.

## Implementation Checklist

Before finalizing typography:

- [ ] Display font is distinctive (not Inter/Roboto/generic)
- [ ] High contrast between display and body families
- [ ] Variable font axes specified if using variable fonts
- [ ] Complete type scale defined (display, headline, title, body, label)
- [ ] Weight contrast ≥ 3x between largest and smallest text
- [ ] Size contrast ≥ 3x between largest and smallest text
- [ ] Letter spacing adjusted for different sizes
- [ ] Line height appropriate for text length and density
- [ ] All weights needed are available in chosen fonts
