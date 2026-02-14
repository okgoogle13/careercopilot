---
name: m3-expressive-ui-evaluator
description: Evaluate UI designs and mockups against Material Design 3 Expressive
  standards. Generate high-fidelity M3 Expressive mockups from wireframes with 400-point
  scoring system (M3 Compliance, Accessibility, User Flow, Visual Hierarchy). Creates
  interactive HTML artifacts and React component code.
metadata:
  legacy_frontmatter:
    version: 1.0.0
    tags: []
---

# M3 Expressive UI Evaluator & Mockup Creator

## Purpose

Evaluate designs against M3 Expressive standards and generate high-fidelity M3 Expressive mockups from wireframes, screenshots, or descriptions.

## When to Use

Use this skill when you need to:

- **Evaluate designs** for M3 Expressive compliance
- **Create high-fidelity mockups** from wireframes
- **Generate interactive prototypes** with M3 Expressive components
- **Score component visual maturity** (0-400 points)
- **Transform baseline M3** designs into M3 Expressive
- **Validate design decisions** against M3 Expressive principles

## When to Invoke

### Option 1: Early Validation (Post-Wireframing)
- **After**: `wireframe-annotator` produces wireframes.
- **Purpose**: Validate M3 Expressive compliance before spec generation.
- **Output**: Score + feedback for refinement.
- **Gate**: Aim for score ≥ 240/400 to proceed to specs.

### Option 2: Mockup Generation (Pre-Implementation)
- **After**: `component-spec-generator` produces implementation specs.
- **Purpose**: Generate high-fidelity interactive mockups for stakeholder review.
- **Output**: Interactive HTML prototype + React component scaffolding.
- **Gate**: Use mockup to verify visual intent matches technical specs.

## Process

```
INPUT → ANALYZE → EVALUATE → DESIGN → DELIVER
```

### 1. INPUT

- Wireframes (low-fidelity sketches)
- Screenshots (existing designs)
- Descriptions (text-based requirements)
- Component specifications

### 2. ANALYZE

- Extract design intent
- Identify component types
- Map user flows
- Assess current M3 compliance level

### 3. EVALUATE

- Score against M3 Expressive standards (400 points)
- Identify gaps and violations
- Generate recommendations

### 4. DESIGN

- Apply M3 Expressive design tokens
- Generate high-fidelity mockups
- Create interactive prototypes

### 5. DELIVER

- Interactive HTML artifact
- React component code
- Evaluation report (0-100 score)
- Component specifications

## Evaluation Scoring (400 Points)

### 1. M3 Expressive Compliance (100 points)

**Typography (25 points)**:

- ✅ No forbidden fonts (Inter, Roboto, Arial alone) - 10 points
- ✅ Extreme weight contrasts (3x+ ratio) - 10 points
- ✅ Variable fonts with optical sizing - 5 points

**Color (25 points)**:

- ✅ Vibrant semantic tokens (40-80% saturation) - 10 points
- ✅ No purple gradients - 5 points
- ✅ No generic blue (#2196F3) - 5 points
- ✅ Dominant color in palette - 5 points

**Motion (25 points)**:

- ✅ Spring physics easing (cubic-bezier overshoot) - 10 points
- ✅ Hover bloom effect (scale + elevation) - 10 points
- ✅ Duration tokens applied (50/250/500ms) - 5 points

**Layout (25 points)**:

- ✅ [DEPRECATED_STYLE] asymmetry (not grid-mechanical) - 10 points
- ✅ Varied spacing rhythm - 10 points
- ✅ Dramatic elevation (layered depth) - 5 points

### 2. Accessibility (100 points)

**WCAG Compliance (40 points)**:

- ✅ Color contrast 4.5:1 minimum (AA) - 20 points
- ✅ Focus indicators visible - 10 points
- ✅ Touch targets 44x44px minimum - 10 points

**ARIA (30 points)**:

- ✅ Semantic HTML structure - 10 points
- ✅ ARIA labels on interactive elements - 10 points
- ✅ Role attributes correct - 10 points

**Keyboard Navigation (30 points)**:

- ✅ Tab order logical - 10 points
- ✅ All actions keyboard-accessible - 10 points
- ✅ Escape/Enter behaviors correct - 10 points

### 3. User Flow Logic (100 points)

**Hierarchy (40 points)**:

- ✅ Primary action clear - 15 points
- ✅ Secondary actions distinct - 10 points
- ✅ Visual weight matches importance - 15 points

**Patterns (30 points)**:

- ✅ Follows established UI patterns - 15 points
- ✅ Consistent with platform conventions - 15 points

**Error Handling (30 points)**:

- ✅ Error states designed - 10 points
- ✅ Empty states designed - 10 points
- ✅ Loading states designed - 10 points

### 4. Visual Hierarchy (100 points)

**Type Scale (40 points)**:

- ✅ M3 type scale applied (Display → Label) - 20 points
- ✅ Hierarchy clear at a glance - 20 points

**Spacing (30 points)**:

- ✅ Follows 8dp grid - 15 points
- ✅ Rhythm intentional (not uniform) - 15 points

**Alignment (30 points)**:

- ✅ Elements aligned intentionally - 15 points
- ✅ Asymmetry serves purpose - 15 points

## M3 Expressive Validation Checklist

Before delivering a mockup, verify:

### Typography

- [ ] No forbidden fonts (Inter, Roboto, Arial alone)
- [ ] Weight contrast ratio ≥ 3x (100 vs 900, not 400 vs 600)
- [ ] Size contrast ratio ≥ 3x (57px vs 12px, not 24px vs 16px)
- [ ] Variable fonts enabled (.woff2)
- [ ] Optical sizing enabled (font-optical-sizing: auto)

### Color

- [ ] Vibrant semantic tokens used (M3 Expressive, not baseline)
- [ ] Saturation 40-80% (vibrant, not muted)
- [ ] No purple gradients (#7C4DFF → #9C27B0)
- [ ] No generic Material Blue (#2196F3)
- [ ] Dominant color in palette (not evenly distributed)

### Motion

- [ ] Spring physics on interactions (cubic-bezier(0.34, 1.56, 0.64, 1))
- [ ] Hover bloom effect (scale 1.02-1.05 + elevation)
- [ ] Duration tokens applied (50ms, 250ms, 500ms)
- [ ] Reduced motion respected (@media prefers-reduced-motion)

### Layout

- [ ] [DEPRECATED_STYLE] asymmetry (not grid-mechanical)
- [ ] Varied spacing rhythm (8px, 16px, 24px, 40px)
- [ ] Dramatic elevation (layered depth, not subtle shadows)
- [ ] Visual hierarchy clear (primary action obvious)

### States

- [ ] All states designed (default, hover, active, disabled, focus, error)
- [ ] State transitions smooth (not jarring)
- [ ] Loading states included
- [ ] Empty states included

### Accessibility

- [ ] Color contrast ≥ 4.5:1 (WCAG AA)
- [ ] Focus indicators visible
- [ ] Touch targets ≥ 44x44px
- [ ] Keyboard navigation logical
- [ ] ARIA labels present

## Design Tokens Applied

### Typography Tokens

```css
/* Display (Sora Variable) */
--sys-type-display-large: 57px / 64px, weight 300-900 --sys-type-display-medium: 45px / 52px, weight 400-800 --sys-type-display-small: 36px / 44px, weight 500-700 /* Body (Plus Jakarta Sans Variable) */ --sys-type-body-large: 16px / 24px, weight 300-500 --sys-type-body-medium: 14px / 20px, weight 300-500 --sys-type-body-small: 12px / 16px, weight 300-500 /* Label (Plus Jakarta Sans Variable) */ --sys-type-label-large: 14px / 20px, weight 500-700 --sys-type-label-medium: 12px / 16px, weight 400-600 --sys-type-label-small: 11px / 16px, weight 400-600;
```

### Motion Tokens

```css
/* M3 Expressive Spring Physics */
--sys-motion-easing-expressive: cubic-bezier(0.34, 1.56, 0.64, 1) --sys-motion-duration-short: 50ms --sys-motion-duration-medium: 250ms --sys-motion-duration-long: 500ms;
```

### Color Tokens (Vibrant)

```css
/* M3 Expressive Vibrant Semantic Tokens */
--sys-color-primary: #6750a4 (vibrant purple) --sys-color-secondary: #625b71 (vibrant gray-purple) --sys-color-tertiary: #7d5260 (vibrant mauve) --sys-color-error: #b3261e (vibrant red) --sys-color-surface: #1a1714 (dark background) --sys-color-on-surface: #f5f0e8 (light text);
```

### Shape Tokens ([DEPRECATED_STYLE] Asymmetry)

```css
/* Asymmetric border-radius (pebble, stone, leaf-inspired) */
--sys-shape-corner-small: 4px 6px 4px 6px --sys-shape-corner-medium: 8px 12px 8px 12px --sys-shape-corner-large: 16px 20px 16px 20px;
```

## Report Output

### Evaluation Report (JSON)

```json
{
  "evaluation": {
    "component_name": "M3 Expressive Login Form",
    "design_system": "Material Design 3 Expressive",
    "evaluation_date": "2026-02-07T...",
    "overall_score": 0-400,
    "grade": "A|B|C|D|F",

    "scores": {
      "m3_expressive_compliance": 0-100,
      "accessibility": 0-100,
      "user_flow_logic": 0-100,
      "visual_hierarchy": 0-100
    },

    "m3_expressive_validation": {
      "no_generic_fonts": true,
      "extreme_contrasts": true,
      "spring_physics_applied": true,
      "vibrant_tokens_used": true,
      "organic_asymmetry": true,
      "zero_ai_slop": true
    },

    "recommendations": [
      "Increase weight contrast from 400-600 to 300-900 for more drama",
      "Apply spring physics easing to button hover states",
      "Use vibrant primary token instead of baseline"
    ],

    "design_narrative": "This login form demonstrates strong M3 Expressive fundamentals with Plus Jakarta Sans typography and vibrant semantic tokens. The primary CTA uses spring physics hover effect. Minor improvements: increase weight contrast for headline."
  }
}
```

### Interactive HTML Artifact

Generated mockup includes:

- Fully styled HTML/CSS
- Interactive hover states
- Spring physics animations
- Responsive layout
- Accessibility attributes

### React Component Code

```tsx
import styled from "styled-components";

export const M3ExpressiveButton = styled.button`
  font-family: var(--font-body);
  font-weight: 500;
  font-variation-settings: "wght" 500;
  background: var(--sys-color-primary);
  color: var(--sys-color-on-primary);
  padding: 12px 24px;
  border-radius: 8px 12px 8px 12px;
  border: none;
  cursor: pointer;
  scale: 1;
  transition:
    font-variation-settings 300ms var(--sys-motion-easing-expressive),
    scale 300ms var(--sys-motion-easing-expressive),
    box-shadow 300ms var(--sys-motion-easing-expressive);

  &:hover {
    font-variation-settings: "wght" 700;
    scale: 1.03;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    font-variation-settings: "wght" 300;
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
```

## Usage Examples

### Example 1: Evaluate Wireframe

**Input**: "Evaluate this login form wireframe against M3 Expressive standards"

**Output**:

1. Evaluation score (0-400)
2. Gap analysis (what's missing)
3. Recommendations (specific improvements)
4. High-fidelity mockup (M3 Expressive compliant)

### Example 2: Transform Baseline M3 to Expressive

**Input**: "Transform this baseline M3 button into M3 Expressive"

**Output**:

1. Before/after comparison
2. Changes made (fonts, colors, motion)
3. React component code
4. Interactive HTML demo

### Example 3: Generate from Description

**Input**: "Create an M3 Expressive dashboard card showing user stats"

**Output**:

1. High-fidelity mockup
2. Component specifications
3. React code
4. Accessibility audit

## Grade Scale

- **A (320-400)**: Exceptional - Production-ready M3 Expressive
- **B (240-319)**: Good - Minor refinements needed
- **C (160-239)**: Acceptable - Needs improvement
- **D (80-159)**: Below standards - Significant work needed
- **F (<80)**: Critical - Complete redesign recommended

## Related Skills

- [m3-visual-audit](../m3-visual-audit/SKILL.md) - Audit component screenshots
- [m3-anti-slop-validator](../design-skills/m3-anti-slop-validator/SKILL.md) - Validate against slop patterns
- [m3-expressive-typography-enhancer](../design-skills/m3-expressive-typography-enhancer/SKILL.md) - Typography guidance
- [brand-brief-optimizer](../brand-brief-optimizer/SKILL.md) - Stress-test design briefs

---

**Version:** 1.0.0 (M3 Expressive)
**Status:** Production Ready
