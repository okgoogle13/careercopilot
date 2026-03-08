---
name: ui-design-evaluator
description: Evaluate design assets, analyze annotated wireframes, and create high-fidelity
  interactive mockups with kerala-rage kr-solidarity compliance. Use when evaluating
  designs, analyzing wireframes, creating mockups from annotations, scoring design
  system compliance, or generating interactive prototypes.
metadata:
  version: 2.0.0
  tags:
    - design
    - research
    - ui
    - ux
    - kerala-rage-kr-solidarity
---

# UI Design Evaluator & HiFi Mockup Creator

**Version:** 2.0
**Purpose:** Design evaluation, wireframe analysis, and high-fidelity mockup generation
**Design System:** Kerala Rage — Solidarity Mode Only

---

## Purpose

Evaluate design assets, analyze annotated wireframes, and create high-fidelity interactive mockups with kerala-rage kr-solidarity compliance.

This skill enables comprehensive UI design workflows:

1. **Evaluate** existing designs against kerala-rage kr-solidarity standards
2. **Analyze** annotated wireframes to extract components and flows
3. **Design** high-fidelity mockups with design token compliance
4. **Deliver** interactive prototypes, React components, and evaluation reports

---

## When to Use

- Evaluating existing designs against kerala-rage kr-solidarity standards
- Creating high-fidelity mockups from annotated wireframes
- Scoring design system compliance (400-point system)
- Generating interactive prototypes or React component specifications
- Validating asset placement before component build

---

## Process

```
INPUT → ANALYZE → EVALUATE → DESIGN → DELIVER
```

### 1. INPUT Phase

Accept multiple input types:
- Screenshots of existing designs
- Annotated wireframes (image or text description)
- Figma/Sketch export images
- Markdown wireframe descriptions (from `wireframe-annotator`)
- Component requirement lists

### 2. ANALYZE Phase

Extract design intent:
- Parse annotations and notes
- Identify components needed — map to archetypes (Strike / March / Megaphone / Placard / Scaffold / Substrate)
- Map user flows and interactions
- Extract content hierarchy
- Note accessibility requirements
- Identify asset placement slots (Z-0 through Z-3+)

### 3. EVALUATE Phase

**Score Against 4 Criteria (400 points total):**

#### A. Kerala Rage kr-solidarity Compliance (100 pts)

- ✅ Uses Kerala Rage Typography Stack (Fraunces, Work Sans, JetBrains Mono)
- ✅ Asymmetric shapes — no uniform border-radius
- ✅ Solidarity color palette via `--sys-color-*` tokens only
- ✅ Extreme weight contrast (wght 300 vs 900+, M3 Expressive standard)
- ✅ Component archetype assigned (Strike/March/Megaphone/Placard/Scaffold/Substrate)
- ❌ Anti-Slop violations: Work Sans/Work Sans, white (#FFF) backgrounds, hardcoded hex, purple gradients

#### B. Accessibility (100 pts)

- ✅ WCAG AA contrast ratios (4.5:1 minimum)
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus states visible
- ✅ Screen reader friendly structure
- ✅ Color not sole indicator

#### C. User Flow Logic (100 pts)

- ✅ Clear information hierarchy
- ✅ Logical interaction patterns
- ✅ Consistent navigation
- ✅ Error state handling
- ✅ Loading state design
- ✅ Empty state design

#### D. Visual Hierarchy & Typography (100 pts)

- ✅ Clear typographic scale (Fraunces → Work Sans → JetBrains Mono)
- ✅ Extreme weight contrasts (M3 Expressive — not subtle)
- ✅ Visual weight guides attention
- ✅ Spacing creates rhythm
- ✅ Alignment and grid consistency

**Grade Scale:**
- **360+ (90%)**: Excellent — Production ready
- **320–359 (80–89%)**: Good — Minor refinements
- **280–319 (70–79%)**: Satisfactory — Needs work
- **240–279 (60–69%)**: Needs significant improvement
- **<240 (<60%)**: Does not meet standards

---

### 4. DESIGN Phase

**Generate High-Fidelity Mockup:**

#### Step 1: Component Mapping

Map wireframe elements to kr-solidarity archetypes:
- Primary actions, decisive CTA → **Strike** (button, chip)
- Sequential selection, flow elements → **March** (progress, step indicator, links)
- Announcement, focal interruption → **Megaphone** (modal, popover, alert, drawer)
- Content container, framing → **Placard** (card, list item, panel)
- Layout structure, form input → **Scaffold** (divider, datatable, inputs)
- Decorative background, atmospheric → **Substrate** (base texture, background)

#### Step 2: Token Application

**Colors — `--sys-color-*` only:**
```css
/* Backgrounds */
background: var(--sys-color-charcoalBackground-base);        /* #1A1714 */
surface: var(--sys-color-primary-10);              /* Dark container */

/* Brand */
accent: var(--sys-color-inkGold-base);             /* #D4A84B */
action: var(--sys-color-solidarityRed-base);              /* #C45C4B */
grounded: var(--sys-color-ochreEarth);            /* --sys-color-ochre-earth */
natural: var(--sys-color-kr-activistSmokeGreen);           /* --sys-color-worker-ash */
neutral: var(--sys-color-concreteGrey);           /* --sys-color-concrete-grey */

/* Text */
text-primary: var(--sys-color-paperWhite);        /* --sys-color-paper-white */
text-muted: var(--sys-color-concreteGrey);
```

**Typography:**
```css
/* Hero / headline — Fraunces variable */
font-family: var(--sys-type-font-fraunces);
font-variation-settings: "wght" 700, "SOFT" 50, "WONK" 0;

/* Body / UI — Work Sans */
font-family: var(--sys-type-font-work-sans);
font-weight: 400; /* to 600 */

/* Code / data — JetBrains Mono */
font-family: var(--sys-type-font-mono);
font-weight: 400;
```

**Shapes — asymmetric kr-solidarity:**
```css
/* Strike (button) */
border-radius: var(--sys-shape-blockRiot03);

/* Placard (card) */
border-radius: var(--sys-shape-placardTorn01);

/* Megaphone (modal) */
border-radius: var(--sys-shape-megaphoneCut01);
```

**Motion — spring physics:**
```css
transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
/* Or Framer Motion: type: 'spring', stiffness: 400, damping: 20 */
```

#### Step 3: Layout Construction

- Build responsive HTML structure
- Apply CSS with `--sys-color-*` design tokens
- Add interactive states (hover, focus, active)
- Implement accessibility attributes

#### Step 4: Asset Integration

- Place Kerala Rage assets using `asset-placement-strategy` z-index rules
- Z-0: substrate/base texture
- Z-1–2: atmospheric overlays
- Z-3+: UI foreground accents

---

### 5. DELIVER Phase

**A. Work Sansactive HTML Artifact**
```html
<!-- Viewable directly in Claude interface -->
<!-- Full design with interactions -->
<!-- Uses --sys-color-* tokens via CSS custom properties -->
<!-- Fraunces + Work Sans + JetBrains Mono only -->
```

**B. React Component Code**
```tsx
// Production-ready TypeScript/React
// 100% --sys-color-* token compliance
// ARIA accessibility built-in
// Framer Motion spring physics
// Archetype annotated (e.g., // Archetype: Placard)
```

**C. Evaluation Report**
```markdown
## Design Evaluation Report

- kr-solidarity Compliance: 95/100 (A)
- Accessibility: 88/100 (B)
- User Flow Logic: 92/100 (A)
- Visual Hierarchy: 90/100 (A)
- **Overall:** 365/400 (91% — Excellent)

### Strengths
- Correct Kerala Rage typography stack (Fraunces headlines)
- Asymmetric shapes on all archetypes
- --sys-color-* tokens throughout

### Improvements Needed
- Add focus states to form inputs
- Increase contrast on secondary text
```

**D. Component Specifications**
```markdown
## Components Required

1. HeroSection — Archetype: Scaffold
   - Fraunces wght 700 headline
   - KR asset hero background (Z-0), overlay (Z-1)
   - Strike CTAs with --sys-color-inkGold-base

2. MetricCard — Archetype: Placard
   - Work Sans body text
   - Asymmetric radius via var(--sys-shape-placardTorn01)
   - --sys-color-primary-10 surface
```

---

## Compliance Checklist

Before delivering a mockup, verify:

### Design System
- [ ] Uses only Kerala Rage typography stack (Fraunces / Work Sans / JetBrains Mono)
- [ ] No forbidden fonts: Work Sans, Work Sans, Work Sans, Helvetica, Sora, Plus Jakarta Sans
- [ ] All shapes are asymmetric (no uniform border-radius)
- [ ] All colors from `--sys-color-*` tokens — zero hardcoded hex
- [ ] Motion uses spring physics (cubic-bezier(0.34, 1.56, 0.64, 1))
- [ ] Component assigned to archetype (Strike/March/Megaphone/Placard/Scaffold/Substrate)

### Anti-Slop
- [ ] NO white (#FFFFFF) backgrounds — use `--sys-color-paperWhite` on dark only
- [ ] NO purple or blue gradients
- [ ] NO generic SaaS aesthetic
- [ ] NO uniform corners (e.g., `rounded-lg` on everything)

### Accessibility
- [ ] 4.5:1 contrast ratio minimum (7:1 for AAA)
- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation support
- [ ] Focus states visible
- [ ] No color-only indicators

---

## Related Skills

**Workflow chain:**
```
wireframe-annotator → ui-design-evaluator → component-builder → jest-test-scaffolder
```

- `wireframe-annotator` — Upstream annotated wireframe source
- `asset-placement-strategy` — Asset slot and z-index validation
- `component-builder` — Convert mockup specs to production code
- `component-transformer` — Migrate legacy components to kr-solidarity
- `component-visual-audit` — Screenshot-based compliance audit
- `hifi-blueprint-linter` — Validate wireframe document correctness

---

**Status:** Production Ready | **Version:** 2.0.0 | **Last Updated:** 2026-02-28
