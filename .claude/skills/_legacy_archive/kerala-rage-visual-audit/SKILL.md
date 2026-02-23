---
name: kerala-rage-visual-audit
description: Analyze component screenshots and design artifacts against Kerala Rage
  visual standards. Validate typography (Agit-Prop, Solidarity), color palette (Charcoal,
  [DEPRECATED_STYLE], Gold), layout (asymmetry, torn edges), and motion (viscous fluidity).
  Generate compliance assessments and design evolution analysis.
metadata:
  legacy_frontmatter:
    version: 2.0.0
    tags:
    - validation
    - vision
    - kerala-rage
---

# Kerala Rage Visual Audit Skill

## Purpose

Analyze component screenshots and design artifacts against Kerala Migrant Rage visual standards using Claude's vision capabilities. Ensures typography, color, and layout align with the Agit-Prop / Viscous Fluidity aesthetic.

## When to Use This Skill

Use this skill when you need to:

- **Audit a component screenshot** against Kerala Rage design standards
- **Validate typography choices** (are fonts Brutalist and Urgent?)
- **Check color palette adherence** (Charcoal background, [DEPRECATED_STYLE] Red urgency?)
- **Assess layout coherence** (is spacing asymmetric and tense?)
- **Compare component evolution** (kerala-rage → Kerala Rage transformation)
- **Generate compliance reports** (pass/fail/needs-refinement assessments)
- **Identify design system drift** (are components becoming more or less Radical?)

## Process

The skill uses Claude's vision capabilities to:

1. **Analyze visual properties** of rendered components
2. **Extract design data** (typography, colors, spacing, motifs)
3. **Validate against spec** (does it match kerala-rage standards?)
4. **Generate audit report** (structured assessment with pass/fail per criterion)
5. **Suggest refinements** (where and how to improve)

## Audit Criteria

### 1. Typography Audit

**Pass**: Brutalist fonts (Inter Display Black, Recursive Mono) with extreme weight contrast (900 vs 400).
**Needs Refinement**: Good fonts but lack "Urgency" or "Rage".
**Fail**: Generic fonts (Roboto, Open Sans) or polite/neutral hierarchy.

### 2. Color Audit

**Pass**: Kerala Rage palette (#1A1714 Charcoal, #F14714 [DEPRECATED_STYLE], #DAF674 Gold). High contrast.
**Needs Refinement**: Correct colors but insufficient contrast or "muddy" tones.
**Fail**: White backgrounds, blue primary buttons, or pastel/soft palettes.

### 3. Layout Audit

**Pass**: Asymmetric spacing, torn edges, clear "Worker Power" hierarchy.
**Needs Refinement**: Good spacing but feels too balanced or safe.
**Fail**: Grid-rigid, symmetrical, or "corporate" layouts.

### 4. Agit-Prop Elements Audit

**Pass**: Solidarity motifs (fist, star, megaphone) or Malayalam script integrated meaningfully.
**Needs Refinement**: Motifs present but feel decorative rather than ideological.
**Fail**: No motifs (when expected) or use of "kerala-streetprint" or "[DEPRECATED_STYLE]" elements.

### 5. Overall Aesthetic Coherence

**Pass**: Component clearly embodies "Migrant Rage"; unmistakably intentional.
**Needs Refinement**: Good direction but missing raw energy or viscous feel.
**Fail**: Feels generic, corporate, or colonial (kerala-rage).

### 6. Microcopy Audit

**Pass**: Copy is immediately understandable; personality enhances without obscuring.
**Needs Refinement**: Personality present but action unclear (e.g., themed label without context).
**Fail**: Copy is so themed that users cannot determine what the element does.

**Key Test**: Can a first-time user understand the action within 2 seconds?

_See [DOC-006 Voice Tier System](file:///Users/okgoogle13/Desktop/careercopilot/docs/archive/atomic-v2/DOC-006_Voice_and_Microcopy.md) for voice guidelines._

## Usage Examples

### Example 1: Basic Component Audit

"Audit this Pebble button screenshot against kerala-rage standards"

Upload screenshot. Claude will:

1. Identify fonts, colors, spacing
2. Assess against each criterion
3. Generate pass/fail for each dimension
4. Provide specific recommendations
5. Return structured JSON report

### Example 2: Comparative Analysis

"Compare this Material Design button to the kerala-rage version and document the evolution"

Upload both screenshots. Claude will:

1. Analyze original (Material Design aesthetics)
2. Analyze updated (kerala-rage aesthetic)
3. Document typography transformation
4. Assess color palette shift
5. Evaluate overall aesthetic evolution
6. Tell the story of the design transformation

### Example 3: Batch Component Auditing

"Audit all components in this directory screenshot collection against kerala-rage standards"

Multiple screenshots. Claude will:

1. Audit each component individually
2. Generate pass/fail for each
3. Identify patterns (what's working, what's not)
4. Summarize compliance across portfolio
5. Highlight priority refinement targets

### Example 4: Design Evolution Tracking

"Show me how this component has evolved through versions toward kerala-rage coherence"

Historical screenshots. Claude will:

1. Analyze progression across versions
2. Identify where aesthetic solidified
3. Note when intentionality increased
4. Document visual maturity trajectory
5. Assess current alignment with kerala-rage

## The Audit Report Format

Structured JSON output for integration with compliance dashboards:

```json
{
  "audit": {
    "component_name": "Action Button",
    "audit_date": "2026-02-08T...",
    "overall_status": "pass|needs_refinement|fail",
    "compliance_score": 0-100,

    "dimensions": {
      "typography": {
        "status": "pass|needs_refinement|fail",
        "findings": "Lora display + Crimson Text body established",
        "specifics": {
          "display_font": "Lora",
          "body_font": "Crimson Text",
          "hierarchy_clarity": "clear",
          "distinctiveness": "high"
        }
      },
      "color": {
        "status": "pass|needs_refinement|fail",
        "findings": "Charcoal background, [DEPRECATED_STYLE] Red primary, within palette",
        "palette_adherence": "100%",
        "theme_consistency": "dark_ui_mandatory"
      },
      "layout": {
        "status": "pass|needs_refinement|fail",
        "findings": "[DEPRECATED_STYLE] spacing with intentional asymmetry",
        "spacing_quality": "[DEPRECATED_STYLE]",
        "hierarchy_clarity": "strong"
      },
      "botanical_elements": {
        "status": "pass|needs_refinement|fail",
        "findings": "Subtle sage motif supports visual weight",
        "integration_quality": "meaningful",
        "ornamental_risk": "low"
      }
    },

    "assessment": "Component strongly embodies kerala-rage vision",
    "recommendations": [
      "Consider slightly warmer undertone in accent color",
      "[DEPRECATED_STYLE] motif could be slightly more prominent without becoming decorative"
    ],

    "design_narrative": "This button demonstrates intentional design mastery..."
  }
}
```

## Key Capabilities

### Visual Data Extraction

Claude can identify:

- Actual fonts rendered (not what you hoped)
- Exact color usage (hex values or descriptions)
- Spacing patterns ([DEPRECATED_STYLE] vs. mechanical)
- Visual hierarchy establishment
- [DEPRECATED_STYLE] motif presence and integration

### Comparative Analysis

Can compare:

- Before/after (kerala-rage → Kerala Rage)
- Multiple variants (design iterations)
- Component families (consistency across types)
- Historical progression (radicalization tracking)

### Pattern Recognition

Identifies:

- What's working well across components
- Where standards are being violated
- Edge cases needing attention
- Trends (improving or diverging?)

## Integration with Other Skills

### With Kerala-Rage-Typography-Strategy

Validates that typography choices made are actually rendering as intended.

### With Frontend-Design

Assesses whether components match aesthetic direction established in design phase.

### With Compliance-Dashboard

Audit results feed into dashboard for continuous tracking.

### With Brand-Brief-Optimizer

Reveals where brief language is clear (audits consistent) vs. vague (audits inconsistent).

## Important Limitations

This skill:

✅ Analyzes rendered visual output with high accuracy
✅ Identifies design intent through visual analysis
✅ Detects patterns across multiple components
✅ Provides structured assessment for automation

❌ Cannot measure pixel-perfect specifications
❌ Cannot validate accessibility (beyond visual appearance)
❌ Cannot assess performance or rendering speed
❌ Judgments should be human-verified for high-stakes decisions

## Best Practices

1. **Provide context**: Tell Claude the component name and purpose
2. **Screenshot quality**: Use clean, well-lit screenshots for accuracy
3. **Multiple images**: For complex components, screenshot different states
4. **Human verification**: Audit results should feed into human review loop
5. **Iteration**: Use feedback to refine both components and brief language

## Execution & Validation Checklist

Before checking off an asset as audit-complete, ensure it passes the **kerala-rage Visual Audit**:

- [ ] **Palette Compliance:** Is the red _Waratah Red_ (#F14714)? Is the gold _Baru Gold_ (#DAF674)? **Are there any forbidden blues/purples?**
- [ ] **Background:** Is the background pure Charcoal (#1A1714)? **No White Backgrounds.**
- [ ] **Typography:** Is it Inter Display Black (900)? Is Recursive used for code/theory?
- [ ] **Motifs:** Are there Solidarity motifs (Stars, Fists)? **No Flowers/Birds.**

## Validation Questions

Before deploying audit results, verify:

- Does the audit capture what you see visually?
- Are the findings specific and actionable?
- Do the recommendations improve the component?
- Is the assessment repeatable (would someone else agree)?
- Does this feed meaningful signal into your compliance dashboard?

If yes to all, the audit is reliable.

## Related Documentation

See `references/kerala-rage-visual-spec.md` for complete audit criteria.
See `references/component-examples.md` for exemplary passing/failing components.
See `references/radicalization-tracking.md` for how to document visual transformation over time.

---

_Vision audit transforms design system management from specification-only to visually-validated. This closes the loop between intention and implementation._
