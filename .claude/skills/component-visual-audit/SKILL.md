---
name: component-visual-audit
description: Analyze UI component screenshots against kerala-rage kr-solidarity standards.
  Validate typography (distinctiveness, hierarchy), color palette (Kerala Rage kr-solidarity),
  layout (organic spacing, asymmetry), cultural motif integration.
  Generate compliance assessments with narrative feedback and design evolution tracking.
metadata:
  legacy_frontmatter:
    version: 1.0.0
    tags:
    - validation
    - components
    - vision-analysis
    - kerala-rage
    - design-system
    - ui-audit
---

# Component Visual Audit Skill

## Purpose

Validate **UI component screenshots** against kerala-rage kr-solidarity visual standards using Claude's vision capabilities. Designed specifically for component coherence auditing, not asset generation. Ensures typography, color, and layout align with the Kerala Rage kr-solidarity aesthetic (Kerala diaspora + Naarm/Melbourne screenprint + wheat-paste poster aesthetics).

## When to Use This Skill

Use this skill when you need to:

- **Audit a component screenshot** against kerala-rage design standards
- **Validate typography choices** (are fonts distinctive and intentional?)
- **Check color palette adherence** (are colors true to Kerala Rage kr-solidarity palette?)
- **Assess layout coherence** (is spacing organic or mechanical?)
- **Compare component evolution** (Material Design → kerala-rage transformation)
- **Generate compliance reports** (pass/fail/needs-refinement assessments)
- **Identify design system drift** (are components becoming more or less kerala-rage?)

## Process

The skill uses Claude's vision capabilities to:

1. **Analyze visual properties** of rendered components
2. **Extract design data** (typography, colors, spacing, motifs)
3. **Validate against spec** (does it match kerala-rage standards?)
4. **Generate audit report** (structured assessment with pass/fail per criterion)
5. **Suggest refinements** (where and how to improve)

## Audit Criteria

### 1. Typography Audit

**Pass**: Distinctive fonts from Kerala Rage stack (Work Sans Variable wght 100-900 for body/UI, Fraunces Variable for headlines, Libre Bodoni for authoritative text, JetBrains Mono for code, Caveat for handwritten accents, Nabla for RESTRICTED hero moments) with clear display+body pairing
**Needs Refinement**: Good fonts but pairing unclear or emotion undefined
**Fail**: Generic fonts (Inter, Arial, Roboto, Space Grotesk, Plus Jakarta Sans, Sora, Poppins) or undefined hierarchy

### 2. Color Audit

**Pass**: Kerala Rage kr-solidarity palette with cohesive harmony:
- charcoalBackground (#1A1714) - foundational canvas (never white)
- solidarityRed (#F14714) - primary actions
- kr-activistSmokeGreen (#48DA8B) - calm sections
- inkGold (#DAF674) - celebratory states
- stencilYellow (#F6E748) - warnings
- worker-ash (#DAF6B3) - readable ink
- solidaritySmokeOrange (#DA8B48) - warmth
- labWrenMetalBlue (#48B3DA) - quiet accents
**Needs Refinement**: Correct colors but harmony feels off or theme inconsistent
**Fail**: Colors disconnected from kr-solidarity inspiration, purple gradients (generic default), or white backgrounds

### 3. Layout Audit

**Pass**: Organic spacing, intentional asymmetry (per archetype: Seed 40px 12px 40px 12px, Jar 32px 8px 28px 12px, Stone 16px 4px 12px 24px), clear visual hierarchy
**Needs Refinement**: Good spacing but feels slightly mechanical or hierarchy ambiguous
**Fail**: Grid-rigid, mechanical patterns or predictable cookie-cutter layouts

### 4. Cultural Motif Integration Audit

**Pass**: Kerala diaspora / First Nations solidarity motifs integrated meaningfully (screenprint layering, wheat-paste texture, backwater palm frames), supporting hierarchy or clarity
**Needs Refinement**: Motifs present but feel slightly ornamental or purpose unclear
**Fail**: No motifs (when expected) or motifs feel decorative/bolted-on

### 5. Overall Aesthetic Coherence

**Pass**: Component clearly embodies kerala-rage vision; unmistakably intentional
**Needs Refinement**: Good direction but missing some coherence or personalization
**Fail**: Feels generic or like multiple conflicting aesthetic directions

### 6. Microcopy Audit

**Pass**: Copy is immediately understandable; personality enhances without obscuring.
**Needs Refinement**: Personality present but action unclear (e.g., themed label without context).
**Fail**: Copy is so themed that users cannot determine what the element does.

**Key Test**: Can a first-time user understand the action within 2 seconds?

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
    "component_name": "Pebble Button",
    "audit_date": "2026-01-28T...",
    "overall_status": "pass|needs_refinement|fail",
    "compliance_score": 0-100,

    "dimensions": {
      "typography": {
        "status": "pass|needs_refinement|fail",
        "findings": "Lora display + Crimson Text body established",
        "specifics": {
          "display_font": "Fraunces Variable",
          "body_font": "Work Sans Variable",
          "hierarchy_clarity": "clear",
          "distinctiveness": "high"
        }
      },
      "color": {
        "status": "pass|needs_refinement|fail",
        "findings": "solidarityRed primary, inkGold accent, within Kerala Rage kr-solidarity palette",
        "palette_adherence": "100%",
        "theme_consistency": "solidarity_mode_cohesive"
      },
      "layout": {
        "status": "pass|needs_refinement|fail",
        "findings": "Organic spacing with intentional asymmetry",
        "spacing_quality": "organic",
        "hierarchy_clarity": "strong"
      },
      "cultural_motifs": {
        "status": "pass|needs_refinement|fail",
        "findings": "Screenprint layering supports visual weight",
        "integration_quality": "meaningful",
        "ornamental_risk": "low"
      }
    },

    "assessment": "Component strongly embodies kerala-rage vision",
    "recommendations": [
      "Consider slightly warmer undertone in accent color",
      "Screenprint motif could be slightly more prominent without becoming decorative"
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
- Spacing patterns (organic vs. mechanical)
- Visual hierarchy establishment
- Cultural motif presence and integration (screenprint, wheat-paste aesthetics)

### Comparative Analysis

Can compare:

- Before/after (Material Design → kerala-rage)
- Multiple variants (design iterations)
- Component families (consistency across types)
- Historical progression (maturity tracking)

### Pattern Recognition

Identifies:

- What's working well across components
- Where standards are being violated
- Edge cases needing attention
- Trends (improving or diverging?)

## Integration with Other Skills

### With kerala-rage-Typography-Strategy

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

- [ ] **Palette Compliance:** Is the red _solidarityRed_ (#F14714)? Is the gold _inkGold_ (#DAF674)? **Are there any forbidden purples or white backgrounds?**
- [ ] **Typography:** Are fonts from the approved stack (Work Sans, Fraunces, Libre Bodoni, JetBrains Mono, Caveat)? No Inter, Roboto, or generic system fonts?
- [ ] **Layout Asymmetry:** Does the component use asymmetric border radius per archetype specification?
- [ ] **Background:** Is the background charcoalBackground (#1A1714)? Is there dramatic contrast?
- [ ] **Cultural Context:** Does the design reflect Kerala diaspora / Naarm solidarity aesthetics (screenprint, wheat-paste)?

## Kerala Rage Identity Context

The kerala-rage kr-solidarity design system embodies:

- **Screenprint Aesthetic**: Layered, textured visual language inspired by grassroots poster art
- **Wheat-Paste Poster Feel**: Urban, guerrilla aesthetics with intentional imperfection
- **First Nations Solidarity Symbolism**: Restricted use of Aboriginal Flag colors (red #D81E05, yellow #FCD116, black #000000) in solidarity contexts only
- **Kerala Diaspora Cultural References**: Backwater motifs, palm frames, activist smoke green tones

## Validation Questions

Before deploying audit results, verify:

- Does the audit capture what you see visually?
- Are the findings specific and actionable?
- Do the recommendations improve the component?
- Is the assessment repeatable (would someone else agree)?
- Does this feed meaningful signal into your compliance dashboard?

If yes to all, the audit is reliable.

## Related Documentation

- **`references/component-visual-spec.md`** – Detailed audit criteria for each dimension (typography, color, layout, cultural motif elements, coherence, microcopy)
- **`references/passing-components.md`** – Real examples of pass/fail/needs-refinement components across Seed, Jar, Stone, Lens archetypes
- **`references/design-evolution-tracking.md`** – Methodology for documenting component maturity progression (v1 → v5), portfolio-level tracking, and design narrative

---

_Vision audit transforms design system management from specification-only to visually-validated. This closes the loop between intention and implementation._
