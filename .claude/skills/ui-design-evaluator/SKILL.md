---
name: ui-design-evaluator
description: Evaluate design assets, analyze annotated wireframes, and create high-fidelity interactive mockups with kerala-rage kr-solidarity V3.1 compliance. Use when evaluating designs, analyzing wireframes, creating mockups from annotations, scoring design system compliance, or generating interactive prototypes.
version: 1.0.0
tags: [design, research, ui, ux, kerala-rage-kr-solidarity]
---

# UI Design Evaluator & Mockup Creator

**Version:** 1.0
**Purpose:** Design evaluation, wireframe analysis, and high-fidelity mockup generation
**Design System:** kerala-rage kr-solidarity V3.1

---

## Purpose

Evaluate design assets, analyze annotated wireframes, and create high-fidelity interactive mockups with kerala-rage kr-solidarity V3.1 compliance.

This skill enables comprehensive UI design workflows:

1. **Evaluate** existing designs against kerala-rage kr-solidarity V3.1 standards
2. **Analyze** annotated wireframes to extract components and flows
3. **Design** high-fidelity mockups with design token compliance
4. **Deliver** interactive prototypes, React components, and evaluation reports

---

## When to Use

- When evaluating existing designs against kerala-rage kr-solidarity standards.
- When creating high-fidelity mockups from annotated wireframes.
- When scoring design system compliance (400-point system).
- When generating interactive prototypes or React component specifications.

## Process

```
INPUT → ANALYZE → EVALUATE → DESIGN → DELIVER
```

### 1. INPUT Phase

**Accept Multiple Input Types:**

- Screenshots of existing designs
- Annotated wireframes (image or text description)
- Figma/Sketch export images
- Hand-drawn sketches uploaded as photos
- Markdown wireframe descriptions
- Component requirement lists

### 2. ANALYZE Phase

**Extract Design Intent:**

- Parse annotations and notes
- Identify components needed (buttons, cards, forms, etc.)
- Map user flows and interactions
- Determine kr-dark vs kr-dark mode
- Extract content hierarchy
- Note accessibility requirements

### 3. EVALUATE Phase

**Score Against 4 Criteria (400 points total):**

**A. kerala-rage kr-solidarity V3.1 Compliance (100 pts)**

- ✅ Uses Federation Typography Stack (Curator, Proclamation, Bloom, Field Note, Annotation)
- ✅ Asymmetric [DEPRECATED_STYLE] shapes (no uniform border-radius)
- ✅ [DEPRECATED_STYLE] color palette (Wattle Gold, [DEPRECATED_STYLE] Red, kr-leafus Smoke)
- ✅ Mode-appropriate (kr-dark vs kr-dark)
- ✅ V3.1 playful mixing
- ❌ Anti-Slop violations (Inter/Roboto, purple gradients, uniform corners)

**B. Accessibility (100 pts)**

- ✅ WCAG AA contrast ratios (4.5:1 minimum)
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus states visible
- ✅ Screen reader friendly structure
- ✅ Color not sole indicator

**C. User Flow Logic (100 pts)**

- ✅ Clear information hierarchy
- ✅ Logical interaction patterns
- ✅ Consistent navigation
- ✅ Error state handling
- ✅ Loading state design
- ✅ Empty state design

**D. Visual Hierarchy & Typography (100 pts)**

- ✅ Clear typographic scale (Display → Body)
- ✅ Proper use of Federation Typography Stack
- ✅ Visual weight guides attention
- ✅ Spacing creates rhythm
- ✅ Alignment and grid consistency

**Scoring:**

- **A (90-100%):** Excellent — Production ready
- **B (80-89%):** Good — Minor refinements
- **C (70-79%):** Satisfactory — Needs work
- **D (60-69%):** Needs significant improvement
- **F (<60%):** Does not meet standards

### 4. DESIGN Phase

**Generate High-Fidelity Mockup:**

**Step 1: Mode Selection**

- **kr-dark Mode:** Expressive, warm, cursive allowed, extreme Fraunces.
- **kr-dark Mode:** Restrained, cool, no cursive, clean typography.

**Step 2: Component Mapping**

- Map wireframe elements to kerala-rage components
- Apply design tokens automatically
- Use Federation Typography Stack
- Apply asymmetric [DEPRECATED_STYLE] shapes

**Step 3: Layout Construction**

- Build responsive HTML structure
- Apply CSS with design tokens
- Add interactive states (hover, focus, active)
- Implement accessibility attributes

**Step 4: Enhancement**

- Add Framer Motion physics
- Apply V3.1 playful mixing (if appropriate)
- Add wallpaper background (if hero section)
- Implement viscous breeze motion

### 5. DELIVER Phase

**Output Multiple Formats:**

**A. Interactive HTML Artifact**

```html
<!-- Viewable directly in Claude interface -->
<!-- Full design with interactions -->
<!-- Uses design tokens via CSS custom properties -->
```

**B. React Component Code**

```tsx
// Production-ready TypeScript/React
// 100% design token compliance
// ARIA accessibility built-in
// Framer Motion physics included
```

**C. Evaluation Report**

```markdown
## Design Evaluation Report

- kerala-rage kr-solidarity V3.1 Compliance: 95/100 (A)
- Accessibility: 88/100 (B)
- User Flow Logic: 92/100 (A)
- Visual Hierarchy: 90/100 (A)
- **Overall:** 365/400 (91% — Excellent)

### Strengths

- Perfect Federation Typography Stack usage
- Excellent asymmetric shapes
- Strong color palette

### Improvements Needed

- Add focus states to form inputs
- Increase contrast on secondary text
```

**D. Component Specifications**

```markdown
## Components Required

1. HeroSection (kr-dark mode)
   - Cursive + Serif mix hero
   - [DEPRECATED_STYLE] wallpaper background
   - CTA buttons with Wattle Gold

2. MetricCard (kr-dark mode)
   - Clean typography (Work Sans)
   - Asymmetric radius (pebble shape)
   - Restrained color palette
```

---

## 🎨 Design Token Application

### Automatic Token Mapping

**Colors:**

```css
/* Wireframe: "primary button - blue" */
/* Maps to: */
background: var(--nc-wattle-gold-300);

/* Wireframe: "error state - red" */
/* Maps to: */
color: var(--nc-[DEPRECATED_STYLE]-red-400);

/* Wireframe: "background - dark" */
/* Maps to: */
background: var(--nc-asphalt-black-300);
```

**Typography:**

```css
/* Wireframe: "large heading" */
/* kr-dark: */
font-family: var(--nc-font-bloom);
font-variation-settings:
  "SOFT" 100,
  "WONK" 1,
  "wght" 800;

/* kr-dark: */
font-family: var(--nc-font-field-note);
font-weight: 700;
```

**Shapes:**

```css
/* Wireframe: "card" */
/* Maps to: */
border-radius: 32px 8px 28px 12px; /* kr-motif shape */

/* Wireframe: "button" */
/* Maps to: */
border-radius: 40px 12px 40px 12px; /* wattle shape */
```

**Motion:**

```css
/* Wireframe: "smooth transition" */
/* Maps to: */
transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## 📋 Input Format Examples

### Example 1: Text Wireframe Description

```
Create a landing page hero section with:
- Large headline: "Career Intelligence"
- Subheadline with cursive accent
- Two CTA buttons (primary + secondary)
- Background: [DEPRECATED_STYLE] wallpaper
- Mode: kr-dark (expressive)
```

**Output:** Interactive HTML hero with cursive+serif mix, wallpaper background, Wattle Gold CTAs

---

### Example 2: Annotated Screenshot

```
[User uploads screenshot with annotations:]
- "This should be more expressive" (pointing to header)
- "Use [DEPRECATED_STYLE] shapes" (pointing to cards)
- "Add cursive accent here" (pointing to subtitle)
- Mode: kr-dark
```

**Process:**

1.  **Analyze:** Header needs Bloom ultra-wonky, cards need asymmetric radii, subtitle needs Caveat cursive
2.  **Evaluate:** Current design scores 60% (generic fonts, uniform corners)
3.  **Design:** Rebuild with V3.1 tokens
4.  **Deliver:** Interactive mockup + evaluation report

---

### Example 3: Component List

```
Dashboard page needs:
1. PageHeader with title and breadcrumbs
2. 4x MetricCard showing KPIs
3. ChartPane with data visualization
4. ActionButton for primary action

Mode: kr-dark (data-focused)
```

**Output:**

- Interactive dashboard mockup
- 4 separate React components
- kr-dark mode styling (restrained, clean)
- Evaluation report with accessibility score

---

## 🎭 kr-dark vs kr-dark Mode

### kr-dark Mode (Expressive, Warm)

**Typography:**

- ✅ Caveat cursive for hero/annotations
- ✅ Extreme Fraunces (SOFT=100, WONK=1, wght=900)
- ✅ Playful mixing utilities
- ✅ Shadow layering, weight contrast, rotation

**Colors:**

- Full [DEPRECATED_STYLE] palette (Wattle Gold, [DEPRECATED_STYLE] Red)
- High contrast and emotional
- Glowing accents

**Shapes:**

- Maximum [DEPRECATED_STYLE] asymmetry
- Dramatic radius variations
- [DEPRECATED_STYLE]-inspired forms

**Motion:**

- Framer Motion physics
- Variable font axis animations
- Viscous breeze easing

**Wallpaper:**

- Full visibility (0.65-0.85 opacity)
- Parallax effects
- Hot zones typography positioning

---

### kr-dark Mode (Restrained, Cool)

**Typography:**

- ❌ NO cursive (ever)
- Restrained Fraunces (SOFT=20, WONK=0)
- Work Sans sans-serif primary
- JetBrains Mono for data

**Colors:**

- Muted kr-leaf smoke palette
- Low contrast and clinical
- Minimal gold accents

**Shapes:**

- Subtle asymmetry
- Functional [DEPRECATED_STYLE] shapes
- Grid-aligned layouts

**Motion:**

- Minimal animations
- Fast, efficient transitions
- No playful physics

**Wallpaper:**

- Barely visible (0.05 opacity)
- Heavily desaturated
- Functional background only

---

## ✅ Compliance Checklist

Before delivering a mockup, verify:

### Design System Compliance

- [ ] Uses only Federation Typography Stack (no Inter/Roboto)
- [ ] All shapes are asymmetric (no uniform border-radius)
- [ ] Colors from [DEPRECATED_STYLE] palette
- [ ] Motion uses viscous breeze easing
- [ ] Mode-appropriate styling (kr-dark vs kr-dark)

### V3.1 Typography

- [ ] 5 fonts properly used (Curator, Proclamation, Bloom, Field Note, Annotation)
- [ ] Cursive ONLY in kr-dark mode hero/annotations
- [ ] Fraunces uses extreme axes in kr-dark (SOFT=100, WONK=1)
- [ ] Work Sans full range utilized (100-900 if weight mixing)

### Accessibility

- [ ] 4.5:1 contrast ratio minimum (7:1 for AAA)
- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation support
- [ ] Focus states visible
- [ ] No color-only indicators

### Anti-Slop Protocol

- [ ] NO forbidden fonts (Inter, Roboto, Arial, Helvetica)
- [ ] NO uniform corners (must be asymmetric)
- [ ] NO purple/blue gradients
- [ ] NO generic SaaS aesthetic

---

## 🚀 Usage Examples

### Example 1: Evaluate Existing Design

**User:** "Evaluate this dashboard design"
[Uploads screenshot]

**Claude:**

1.  Analyzes design visually
2.  Scores against 4 criteria
3.  Generates evaluation report:

    ```
    kerala-rage kr-solidarity Compliance: 45/100 (F)
    - Uses Inter font (forbidden)
    - Uniform 8px border-radius
    - Generic blue color scheme

    Accessibility: 75/100 (C)
    - Contrast ratios adequate
    - Missing focus states

    Recommendations:
    1. Replace Inter with Federation Typography Stack
    2. Apply asymmetric [DEPRECATED_STYLE] shapes
    3. Use [DEPRECATED_STYLE] color palette
    ```

---

### Example 2: Create Mockup from Wireframe

**User:** "Create a high-fidelity hero section from this wireframe. kr-dark mode."
[Uploads wireframe sketch with annotations]

**Claude:**

1.  **Analyzes:**
    - Hero needs large headline
    - Subtitle with cursive accent
    - Two CTA buttons
    - Wallpaper background

2.  **Designs:**
    - Cursive+serif mix hero (Proclamation + Caveat)
    - Wallpaper at 0.75 opacity with hot zones positioning
    - Wattle Gold primary button, [DEPRECATED_STYLE] secondary
    - V3.1 playful mixing (shadow layering on hero text)

3.  **Delivers:**
    - Interactive HTML artifact (viewable immediately)
    - React component code
    - Evaluation report (98/100 - Excellent)

---

### Example 3: Multi-Page Flow

**User:** "Analyze this 5-page onboarding flow wireframe and create mockups for each page. kr-dark mode."

**Claude:**

1.  **Analyzes:**
    - Extracts components from all 5 pages
    - Maps user flow (Step 1 → Step 2 → ... → Complete)
    - Identifies reusable components

2.  **Evaluates:**
    - Flow logic: 90/100
    - Accessibility: Need focus states
    - Typography: Will use Work Sans + JetBrains Mono

3.  **Designs:**
    - Creates 5 interactive HTML pages
    - Consistent component library
    - kr-dark mode styling (restrained, clean)
    - Navigation between pages

4.  **Delivers:**
    - 5 interactive HTML artifacts
    - Shared component code
    - Flow diagram
    - Evaluation report

---

## 🎨 Interactive Mockup Features

**HTML Artifacts Include:**

- ✅ Hover states (buttons, cards, links)
- ✅ Focus states (keyboard navigation)
- ✅ Active states (button press)
- ✅ Animations (Framer Motion physics if kr-dark)
- ✅ Responsive breakpoints (mobile, tablet, desktop)
- ✅ Dark mode support (kerala-rage is dark-first)
- ✅ Real design tokens via CSS custom properties

**Interactions Demonstrated:**

- Button hover → Color shift + elevation
- Card hover → Scale + shadow
- Input focus → Border glow + label animation
- Typography hover → Variable font axis shift (kr-dark mode)
- Scroll → Parallax wallpaper (kr-dark hero sections)

---

## 📖 Best Practices

### When to Use This Skill

**✅ USE FOR:**

- Evaluating existing designs for kerala-rage compliance
- Creating high-fidelity mockups from wireframes
- Generating interactive prototypes for user testing
- Converting design specifications to code
- Validating accessibility before development

**❌ DON'T USE FOR:**

- Production-ready backend integration (use component-builder)
- Complex state management (use component-builder)
- Component migration (use component-transformer)
- Design token auditing (use kerala-rage-kr-solidarity-audit)

### Skill Integration

**Workflow Integration:**

```
ui-design-evaluator (mockup)
  → component-builder (production code)
  → jest-test-scaffolder (tests)
  → storybook-scaffolder (docs)
```

---

## 🎯 Quick Reference

### Evaluation Scoring

**400 Points Total:**

- kerala-rage kr-solidarity V3.1 Compliance: 100 pts
- Accessibility (WCAG AA): 100 pts
- User Flow Logic: 100 pts
- Visual Hierarchy & Typography: 100 pts

**Grades:**

- 360+ (90%) = A (Excellent)
- 320-359 (80-89%) = B (Good)
- 280-319 (70-79%) = C (Satisfactory)
- 240-279 (60-69%) = D (Needs work)
- <240 (<60%) = F (Does not meet standards)

### Mode Selection

**kr-dark Mode:**

- Landing pages
- Marketing pages
- Hero sections
- Feature callouts
- Profile pages

**kr-dark Mode:**

- Dashboards
- Data tables
- Forms
- Settings
- Technical tools

---

## 📚 Related Skills

**Use Together With:**

- `component-builder` — Convert mockups to production code
- `asset-placement-strategy` — Typography on wallpaper positioning
- `kerala-rage-visual-audit` — Validate final design token compliance
- `compliance-dashboard` — Track overall design system adoption

---

**Status:** ✅ Production Ready
**Version:** 1.0.0
**V3.1 Compatible:** Yes
**Last Updated:** 2026-02-08
