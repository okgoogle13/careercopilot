---
name: m3-visual-audit
description: Analyze component screenshots and design artifacts against Material Design 3 visual standards. Validate typography (type scale, semantic fonts), color palette (semantic tokens), layout (Material 3 spacing grid), and component states. Generate compliance assessments and design maturity analysis.
---

# Material Design 3 Visual Audit Skill

## Overview

Closes the gap between Material Design 3 specification and reality. Uses Claude's vision capabilities to visually analyze component screenshots and validate them against M3 standards.

This skill transforms design system management from **specification-heavy and hope-driven** to **visually-grounded and continuously validated**.

## When to Use This Skill

Use this skill when you need to:

- **Audit a component screenshot** against Material Design 3 standards
- **Validate typography choices** (type scale, semantic usage)
- **Check color palette adherence** (semantic tokens, tonal system)
- **Assess layout coherence** (Material 3 spacing grid, elevation)
- **Compare component evolution** (design iteration maturity)
- **Generate compliance reports** (pass/fail/needs-refinement assessments)
- **Identify design system drift** (are components drifting from M3?)
- **Validate component states** (disabled, hover, active, focus, error)

## How It Works

The skill uses Claude's vision capabilities to:

1. **Analyze visual properties** of rendered components
2. **Extract design data** (typography, colors, spacing, elevation, states)
3. **Validate against M3 spec** (does it match Material Design 3 standards?)
4. **Generate audit report** (structured assessment with pass/fail per criterion)
5. **Suggest refinements** (where and how to improve)

## Audit Criteria

### 1. Typography Audit

**Pass**: Material 3 type scale applied (Display Large → Label Small), fonts render as intended, hierarchy clear
**Needs Refinement**: Good fonts but scale inconsistent or hierarchy ambiguous
**Fail**: Off-scale typography, generic fonts (Inter, Arial), hierarchy unclear

**Specifics to Check:**
- Type scale applied correctly (Display Large, Display Medium, Display Small, Headline Large/Medium/Small, Title Large/Medium/Small, Body Large/Medium/Small, Label Large/Medium/Small)
- Font family intentional (primary semantic font, secondary if present)
- Weight applied correctly (300-400 for body, 500-700 for emphasis)
- Optical sizing enabled (if variable fonts used)
- Hierarchy unambiguous (size, weight, color separation)

### 2. Color Audit

**Pass**: Semantic tokens used (primary, secondary, tertiary, error, neutral), tonal system applied, dark mode coherent
**Needs Refinement**: Correct tokens but tonal harmony feels off or dark mode incomplete
**Fail**: Arbitrary hex values, colors disconnected from Material 3 palette, no dark mode support

**Specifics to Check:**
- Semantic tokens applied (primary, secondary, tertiary, error, neutral tones)
- On-surface variants present (text readability ensured)
- Contrast ratios meet WCAG AA (4.5:1 body text, 3:1 large text)
- Dark mode consistent (if applicable)
- No hardcoded hex values (all from M3 semantic token set)

### 3. Layout Audit

**Pass**: Material 3 spacing grid applied (8dp), elevation tokens used, clear hierarchy, responsive behavior intentional
**Needs Refinement**: Good spacing but slightly mechanical or grid inconsistent
**Fail**: Grid-agnostic, mechanical patterns, hierarchy ambiguous

**Specifics to Check:**
- Spacing follows 8dp grid (or defined spacing scale)
- Elevation tokens applied (not hardcoded shadows)
- Component padding/margin consistent with M3 standards
- State changes visible and distinct (hover, active, disabled, focus)
- Responsive behavior intentional (breakpoints, reflow)

### 4. Component State Audit

**Pass**: All states present, visually distinct, accessible, and follow M3 state layer system
**Needs Refinement**: States present but some visually ambiguous
**Fail**: Missing states, states hard to distinguish, focus state invisible

**Specifics to Check:**
- Default state clear
- Hover state visible (opacity layer or elevation change)
- Active state distinct
- Disabled state clearly indicated (reduced opacity, no interaction)
- Focus state visible (outline or fill change, keyboard accessible)
- Error state uses semantic error token
- Loading state indicated clearly

### 5. Motion Audit (If Present)

**Pass**: Duration tokens applied, easing curves intentional (emphasized/standard/decelerate), motion supports clarity
**Needs Refinement**: Motion present but easing curves inconsistent or durations off-spec
**Fail**: No motion consistency, seizure-risk patterns, motion hinders clarity

**Specifics to Check:**
- Duration tokens applied (short: 50ms, medium: 250ms, long: 500ms per M3)
- Easing curves use M3 standard (emphasized: cubic-bezier(0.05, 0.7, 0.1, 1), standard: cubic-bezier(0.4, 0, 0.2, 1), decelerate: cubic-bezier(0, 0, 0.2, 1))
- Motion purpose clear (emphasize, guide attention, provide feedback)
- No seizure-risk patterns
- Respects `prefers-reduced-motion` media query

### 6. Overall Aesthetic Coherence

**Pass**: Component clearly embodies Material Design 3 vision; unmistakably intentional and on-spec
**Needs Refinement**: Good direction but missing some M3 coherence or feels slightly off
**Fail**: Feels generic, inconsistent, or like it ignores M3 principles

## Usage Examples

### Example 1: Basic Component Audit

"Audit this Material Design 3 button screenshot against M3 standards"

Upload screenshot. Claude will:

1. Identify fonts, colors, spacing, elevation
2. Assess against each criterion
3. Generate pass/fail for each dimension
4. Provide specific recommendations
5. Return structured JSON report

### Example 2: Comparative Analysis

"Compare this old Material Design 2 button to the new M3 version and document the evolution"

Upload both screenshots. Claude will:

1. Analyze original (Material Design 2 aesthetics)
2. Analyze updated (Material Design 3 aesthetic)
3. Document typography transformation
4. Assess color palette shift (to M3 semantic system)
5. Evaluate motion/elevation changes
6. Tell the story of the design transformation

### Example 3: Batch Component Auditing

"Audit all components in this directory screenshot collection against M3 standards"

Multiple screenshots. Claude will:

1. Audit each component individually
2. Generate pass/fail for each
3. Identify patterns (what's working, what's not)
4. Summarize compliance across portfolio
5. Highlight priority refinement targets

### Example 4: Design Evolution Tracking

"Show me how this component has evolved through versions toward M3 compliance"

Historical screenshots. Claude will:

1. Analyze progression across versions
2. Identify where M3 principles solidified
3. Note when intentionality increased
4. Document visual maturity trajectory
5. Assess current alignment with M3

## The Audit Report Format

Structured JSON output for integration with compliance dashboards:

```json
{
  "audit": {
    "component_name": "M3 Button",
    "design_system": "Material Design 3",
    "audit_date": "2026-02-05T...",
    "overall_status": "pass|needs_refinement|fail",
    "compliance_score": 0-100,

    "dimensions": {
      "typography": {
        "status": "pass|needs_refinement|fail",
        "findings": "Roboto type scale applied, Display Large for emphasis",
        "specifics": {
          "type_scale": "Label Large",
          "font_family": "Roboto Flex",
          "weight_applied": 500,
          "hierarchy_clarity": "clear"
        }
      },
      "color": {
        "status": "pass|needs_refinement|fail",
        "findings": "Primary semantic token, on-surface variant for text",
        "specifics": {
          "primary_token": "used",
          "on_surface_variant": "applied",
          "contrast_ratio": "4.8:1",
          "dark_mode": "coherent"
        }
      },
      "layout": {
        "status": "pass|needs_refinement|fail",
        "findings": "8dp spacing grid applied, elevation token used",
        "specifics": {
          "spacing_grid": "8dp",
          "elevation_token": "level3",
          "padding": "16dp vertical, 24dp horizontal",
          "hierarchy_clarity": "strong"
        }
      },
      "component_states": {
        "status": "pass|needs_refinement|fail",
        "findings": "All states present and visually distinct",
        "specifics": {
          "default": "clear",
          "hover": "elevation increase + opacity layer",
          "active": "state layer applied",
          "disabled": "opacity 38%",
          "focus": "outline visible",
          "error": "semantic error token"
        }
      },
      "motion": {
        "status": "pass|needs_refinement|fail",
        "findings": "Duration tokens applied, easing curves intentional",
        "specifics": {
          "duration": "250ms (medium token)",
          "easing_curve": "standard",
          "purpose": "state transition feedback"
        }
      }
    },

    "assessment": "Component strongly embodies Material Design 3 standards",
    "recommendations": [
      "Consider using emphasis easing for focus state entrance",
      "Error state label could be more prominent"
    ],

    "design_narrative": "This button demonstrates solid M3 mastery..."
  }
}
```

## Key Capabilities

### Visual Data Extraction

Claude can identify:

- Actual type scale applied (not what you hoped)
- Semantic tokens used (versus arbitrary hex)
- Spacing patterns (grid adherence)
- Elevation/shadow implementation
- Component state presence and clarity
- Motion curves and durations (if animated)

### Comparative Analysis

Can compare:

- Before/after (Material Design 2 → M3)
- Multiple variants (design iterations)
- Component families (consistency across types)
- Historical progression (maturity tracking)

### Pattern Recognition

Identifies:

- What's M3-compliant across components
- Where standards are being violated
- Edge cases needing attention
- Trends (improving or diverging from M3?)

## Integration with Other Skills

### With Token-Orchestrator

Validates that semantic token definitions are actually rendering as intended.

### With Frontend-Design

Assesses whether components match Material Design 3 aesthetic direction.

### With Compliance-Dashboard

Audit results feed into dashboard for continuous M3 compliance tracking.

### With Brand-Brief-Optimizer

Reveals where brief language is clear (audits consistent) vs. vague (audits inconsistent).

### With Component-Builder

Verify that built components pass M3 visual audit criteria.

## Important Limitations

This skill:

✅ Analyzes rendered visual output with high accuracy
✅ Identifies Material Design 3 adherence through visual analysis
✅ Detects patterns across multiple components
✅ Provides structured assessment for automation

❌ Cannot measure pixel-perfect specifications
❌ Cannot validate accessibility beyond visual appearance (ARIA, keyboard navigation)
❌ Cannot assess performance or rendering speed
❌ Judgments should be human-verified for high-stakes decisions

## Best Practices

1. **Provide context**: Tell Claude the component name and Material Design 3 purpose
2. **Screenshot quality**: Use clean, well-lit screenshots for accuracy
3. **Multiple images**: For complex components, screenshot different states (default, hover, active, disabled, error)
4. **Human verification**: Audit results should feed into human review loop
5. **Iteration**: Use feedback to refine both components and design system brief

## Execution & Validation Checklist

Before checking off a component as audit-complete, ensure it passes the **Material Design 3 Visual Audit**:

- [ ] **Type Scale Compliance:** Is the label using `Label Large` or `Label Small`? Is Display/Headline hierarchy clear?
- [ ] **Semantic Token Usage:** Are colors sourced from M3 semantic tokens? Is there on-surface variant for text?
- [ ] **Spacing Grid:** Does padding follow 8dp grid? Is elevation intentional (not hardcoded shadow)?
- [ ] **State Visibility:** Are all states present? Is disabled clearly distinct? Is focus visible?
- [ ] **Motion Consistency:** Are durations and easing curves intentional? Does motion support clarity?

## Validation Questions

Before deploying audit results, verify:

- Does the audit capture what you see visually?
- Are the findings specific and actionable?
- Do the recommendations improve the component?
- Is the assessment repeatable (would someone else agree)?
- Does this feed meaningful signal into your compliance dashboard?

If yes to all, the audit is reliable.

## Related Skills

- **Brand-Brief-Optimizer**: Validates that your M3 brief language is clear and coherent
- **Token-Orchestrator**: Ensures semantic tokens are properly defined and applied
- **Component-Builder**: Use audit feedback to build or refine components
- **Compliance-Dashboard**: Aggregate audit results for system-wide M3 compliance tracking

## Related Documentation

See Material Design 3 official documentation: https://m3.material.io/

---

_Visual audit transforms design system management from specification-only to visually-validated. This closes the loop between M3 intention and implementation._
