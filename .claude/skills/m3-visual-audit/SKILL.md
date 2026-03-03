---
name: m3-visual-audit
description: Analyze component screenshots against Material Design 3 Expressive standards.
  Validate typography (variable fonts, extreme contrasts), color (vibrant tokens),
  layout (kr-solidarity organic asymmetry), motion (spring physics), and expressive distinctiveness.
  Generate compliance assessments with 0-100 scoring.
metadata:
  legacy_frontmatter:
    version: 1.0.0
    tags: []
---

# M3 Expressive Visual Audit Skill

## Purpose

Analyze component screenshots against Material Design 3 Expressive standards using Claude's vision capabilities. Validates typography, color, layout, and motion to ensure personality-driven design and prevent "AI slop".

## M3 Expressive Design Principles (Audit Context)

This skill validates components against M3 Expressive standards, which extend Material Design 3 baseline with:

| Principle      | M3 Baseline                   | M3 Expressive                                                       |
| -------------- | ----------------------------- | ------------------------------------------------------------------- |
| **Typography** | Clean, professional (Roboto)  | Solidarity Stack, 9× contrasts (Fraunces, Work Sans) |
| **Color**      | Semantic tokens, neutral      | Vibrant semantic tokens, high saturation (40-80%)                   |
| **Motion**     | Efficient (250-300ms, linear) | Springy, playful (250-400ms, cubic-bezier overshoot)                |
| **Layout**     | Grid-aligned, mechanical      | kr-solidarity organic asymmetry, intentional "imperfection"                       |
| **Components** | Predictable, minimal          | Personality-driven, visually distinctive                            |

This audit validates the **Expressive** layer, not just baseline M3 compliance.

## When to Use This Skill

Use this skill when you need to:

- **Audit a component screenshot** against M3 Expressive standards
- **Validate typography choices** (are fonts distinctive and intentional?)
- **Check color palette adherence** (are colors vibrant and M3 Expressive compliant?)
- **Assess layout coherence** (is spacing kr-solidarity organic or mechanical?)
- **Evaluate motion quality** (spring physics vs. linear easing?)
- **Compare component evolution** (Baseline M3 → M3 Expressive transformation)

## Process

1. **Input Screenshot**: Accept and process the component screenshot.
2. **Vision Analysis**: Use Claude Vision to detect fonts, weight contrasts, color tokens, and layout patterns.
3. **Audit Dimensions**:
   - Typography (Variable fonts, 3x+ weight ratio)
   - Color (Vibrant tokens, 40-80% saturation)
   - Layout (kr-solidarity organic asymmetry, varied spacing)
   - Motion (Spring physics, bloom effect)
4. **Generate Report**: Produce a structured JSON assessment with a 0-100 score and specific remediation steps.

## Audit Criteria

### 1. Typography Audit

**Pass**: Distinctive Solidarity stacks (Fraunces, Work Sans, Libre Bodoni) with extreme weight contrasts (9× ratio: 100-900). Optical sizing enabled. Clear hierarchy. Nabla used ONLY in First Nations solidarity contexts (decorative, icon-scale).

**Needs Refinement**: Correct fonts but timid contrasts (1.25x ratio) or hierarchy unclear. Nabla misused outside solidarity context.

**Fail**: Forbidden fonts (Inter, Roboto, Arial, Plus Jakarta Sans, Sora, Poppins, Montserrat, Space Grotesk, Crimson Pro, Playfair Display) or undefined hierarchy.

**Specifics to Check:**

- Font family: Work Sans Variable (wght 100-900), Fraunces Variable (opsz, wght, SOFT, WONK), Libre Bodoni, JetBrains Mono, Caveat ONLY
- Nabla Usage: **RESTRICTED to First Nations solidarity contexts**. Decorative icon-scale only. NEVER primary text or generic decoration.
- Weight contrast: 9× ratio (100 vs 900, not 400 vs 700)
- Size contrast: 6× ratio (72px vs 12px)
- Optical sizing: Enabled (font-optical-sizing: auto)
- Hierarchy: Display (Fraunces) → Proclamation (Bodoni) → Body (Work Sans) clear

### 2. Color Audit

**Pass**: M3 Expressive vibrant semantic tokens used (primary, secondary, tertiary, error, neutral at vibrant tones), tonal system applied with 40-80% saturation, dark mode coherent, no baseline M3 colors.

**Needs Refinement**: Correct tokens but saturation too muted or dark mode incomplete; mixing baseline + expressive tokens.

**Fail**: Arbitrary hex values, baseline M3 colors (not vibrant), purple gradients, generic blue (#2196F3), no dark mode support.

**M3 Expressive Specific Checks:**

- ✅ charcoalBackground (#1A1714) used (NOT #0F0F0F)
- ✅ solidarityRed (#F14714) / inkGold (#DAF674) accents used
- ✅ Saturation 40-80% (vibrant, not muted)
- ❌ No purple gradients (#7C4DFF → #9C27B0)
- ❌ No WHITE backgrounds (#FFFFFF)
- ❌ No generic Material Blue (#2196F3)
- ✅ Tonal variants have purpose (on-surface for text, container for backgrounds)
- ✅ Dark mode uses vibrant tokens, not desaturated versions

### 3. Layout Audit

**Pass**: kr-solidarity organic spacing, intentional asymmetry, clear visual hierarchy, varied spacing rhythm (8px, 16px, 24px, 40px).

**Needs Refinement**: Good spacing but feels slightly mechanical or hierarchy ambiguous.

**Fail**: Grid-rigid, mechanical patterns, uniform spacing, predictable cookie-cutter layouts.

**Specifics to Check:**

- Spacing rhythm: Varied (not uniform 16px everywhere)
- Asymmetry: Intentional (not grid-mechanical)
- Visual hierarchy: Clear and dramatic (not subtle)
- Elevation: Layered depth (not flat)

### 4. State Visibility Audit

**Pass**: All states present (default, hover, active, disabled, focus, error), clearly distinct, accessible.

**Needs Refinement**: States present but distinctions subtle or focus state unclear.

**Fail**: Missing states, states indistinguishable, no focus indicator.

### 5. Motion Audit

**Pass (M3 Baseline)**: Duration tokens applied (short/medium/long), standard M3 easing curves (emphasized/standard/decelerate), motion supports clarity.

**Pass (M3 Expressive)**: Duration tokens applied, M3 Expressive spring physics easing (cubic-bezier(0.34, 1.56, 0.64, 1)), hover states show "bloom" effect (scale + elevation), motion feels alive and responsive.

**Needs Refinement**: Motion present but easing curves inconsistent or lacks spring physics personality.

**Fail**: No motion, static components, linear easing, motion hinders clarity, seizure-risk patterns.

**M3 Expressive Motion Specifics:**

- ✅ Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (spring physics with overshoot)
- ✅ Hover state: Scale increase (1.02-1.05) + elevation increase = "bloom" effect
- ✅ Duration: 250-400ms (M3 Expressive is slower for springiness)
- ✅ State transitions: smooth, not jarring
- ✅ Reduced motion: Respects `prefers-reduced-motion` (instant state change, no motion)
- ✅ Interaction feedback: Clear and immediate
- ❌ Not: Linear easing (feels stiff)
- ❌ Not: Instant transitions (feels unresponsive)
- ❌ Not: Motion that obscures clarity

**M3 Expressive Motion Philosophy**: Motion should make components feel **alive and responsive**, not functional and efficient.

### 6. Expressive Distinctiveness Audit (NEW - M3 Expressive Only)

**Purpose**: Validates that component has intentional personality, not generic/slop aesthetics.

**Pass**: Component shows clear personality, intentional design choices, high-contrast elements, distinctive form.

**Needs Refinement**: Component has some personality but could be bolder or more distinctive.

**Fail**: Generic/cookie-cutter design, looks like "AI slop," no personality.

**Specifics to Check:**

- Font distinctiveness: Does typography show personality? (not Inter alone)
- Weight contrast: Are weight differences extreme (3x+)? or timid (1.25x)?
- Shape distinctiveness: Does component have kr-solidarity organic asymmetry? or mechanical uniformity?
- Visual hierarchy: Is hierarchy dramatic and clear? or subtle and timid?
- Color personality: Do colors feel intentional and vibrant? or safe and muted?
- Motion personality: Do interactions feel springy and alive? or stiff and functional?
- Overall: Does this component feel like "M3 Expressive" (personality-driven)? or "M3 Baseline" (restrained)?

**Validation Checklist:**

- [ ] Typography shows personality (not generic font alone)
- [ ] Weight/size contrasts are extreme (3x+, not timid)
- [ ] Shapes show kr-solidarity organic asymmetry (not mechanical grid)
- [ ] Colors feel vibrant and intentional (not safe/muted)
- [ ] Interactions show spring physics (cubic-bezier overshoot)
- [ ] Overall personality clear (this is M3 Expressive, not baseline)
- [ ] No "AI slop" markers (purple gradients, timid contrasts, generic fonts)

### 7. Overall Aesthetic Coherence

**Pass (M3 Baseline)**: Component clearly embodies Material Design 3 standards; unmistakably intentional and on-spec.

**Pass (M3 Expressive)**: Component clearly embodies M3 Expressive principles (distinctive personality, extreme contrasts, spring physics, vibrant tokens, kr-solidarity organic asymmetry); unmistakably intentional and personality-driven, not generic/slop.

**Needs Refinement**: Good direction but missing some M3 Expressive coherence (colors too muted, typography too restrained, motion too stiff, shapes too mechanical, personality unclear).

**Fail**: Feels generic ("AI slop"), inconsistent, ignores M3 Expressive principles, no personality.

**M3 Expressive Coherence Test:**
Look at the component and ask:

- ✅ Does this feel like intentional M3 Expressive design? (personality-driven, springy, extreme contrasts)
- ❌ Or does it feel like baseline M3? (restrained, minimal, efficient)
- ❌ Or does it feel like generic/slop? (purple gradients, generic fonts, flat layout, cookie-cutter)

If you answer baseline or slop, needs refinement or fail.

## The Audit Report Format

Structured JSON output for integration with compliance dashboards:

```json
{
  "audit": {
    "component_name": "M3 Expressive Button",
    "design_system": "Material Design 3 Expressive",
    "audit_date": "2026-02-07T...",
    "overall_status": "pass|needs_refinement|fail",
    "compliance_score": 0-100,
    "m3_expressive_score": 0-100,

    "dimensions": {
      "typography": {
        "status": "pass|needs_refinement|fail",
        "findings": "Work Sans Variable, weight 600, distinctive personality",
        "m3_expressive_assessment": "Excellent - uses vibrant variable font with extreme weight contrast",
        "specifics": {
          "font_family": "Fraunces Variable / Work Sans Variable",
          "nabla_usage": "decorative_icon_only",
          "weight_applied": 900,
          "hierarchy_clarity": "clear",
          "distinctiveness": "high",
          "generic_font_risk": "none"
        }
      },
      "color": {
        "status": "pass|needs_refinement|fail",
        "findings": "Primary vibrant semantic token, high saturation",
        "m3_expressive_assessment": "Excellent - uses M3 Expressive vibrant token, no baseline colors",
        "specifics": {
          "primary_token": "used",
          "token_vibrance": "expressive",
          "saturation_level": "65%",
          "no_purple_gradients": true,
          "no_generic_blue": true
        }
      },
      "motion": {
        "status": "pass|needs_refinement|fail",
        "findings": "Spring physics on hover, bloom effect with overshoot easing",
        "m3_expressive_assessment": "Excellent - uses signature M3 Expressive spring physics",
        "specifics": {
          "duration": "300ms (medium token)",
          "easing_curve": "cubic-bezier(0.34, 1.56, 0.64, 1)",
          "easing_type": "spring_physics",
          "hover_effect": "bloom (scale 1.03 + elevation)",
          "motion_personality": "alive_and_responsive"
        }
      },
      "expressive_distinctiveness": {
        "status": "pass|needs_refinement|fail",
        "findings": "Component shows clear personality and intentional distinctiveness",
        "specifics": {
          "personality_level": "high",
          "generic_risk": "none",
          "ai_slop_markers": "none",
          "visual_distinctiveness": "high_contrast_intentional"
        }
      }
    },

    "m3_expressive_validation": {
      "no_generic_fonts": true,
      "extreme_contrasts": true,
      "spring_physics_applied": true,
      "vibrant_tokens_used": true,
      "organic_asymmetry": true,
      "intentional_personality": true,
      "zero_ai_slop": true
    },

    "assessment": "Component strongly embodies Material Design 3 Expressive standards with personality-driven design, extreme typography contrasts, and spring physics interactions",
    "recommendations": [
      "Consider increasing saturation to 70% for even more vibrancy",
      "Hover bloom effect could include slight rotation (±2deg) for maximum personality"
    ],

    "design_narrative": "This button demonstrates strong M3 Expressive mastery: Work Sans Variable 600 weight creates personality without being overly bold, vibrant solidarityRed token shows intentional color choice, spring physics easing on hover creates the characteristic 'alive' feel of M3 Expressive. Zero generic markers. Production-ready."
  }
}
```

## Execution & Validation Checklist

Before checking off a component as audit-complete, ensure it passes the **Material Design 3 Expressive Visual Audit**:

**M3 Baseline Checks:**

- [ ] **Type Scale Compliance:** Follows M3 type scale (Display Large → Label Small)
- [ ] **Semantic Token Usage:** Uses M3 semantic tokens (primary, secondary, tertiary, error)
- [ ] **Spacing Grid:** Follows 8dp grid
- [ ] **State Visibility:** All states present (default, hover, active, disabled, focus, error)
- [ ] **Motion Basics:** Duration and easing intentional

**M3 Expressive Checks (Required):**

- [ ] **No Generic Fonts:** Zero use of Inter, Roboto, Arial alone (if present, paired with distinctive display font)
- [ ] **Extreme Typography Contrasts:** Weight 3x+ or size 3x+ (not timid 1.25x)
- [ ] **Vibrant Tokens Only:** All colors from M3 Expressive vibrant tokens (saturation 40-80%)
- [ ] **No Purple Gradients:** Zero purple gradient patterns in any context
- [ ] **No Generic Blue:** Zero use of #2196F3 or similar generic Material Blue
- [ ] **Spring Physics Motion:** Easing uses cubic-bezier(0.34, 1.56, 0.64, 1) on interactions
- [ ] **Hover Bloom Effect:** Hover states show scale increase + elevation increase
- [ ] **kr-solidarity organic Asymmetry:** Shapes show intentional asymmetry (not uniform border-radius)
- [ ] **Intentional Personality:** Component feels distinctive, not generic/slop
- [ ] **Zero AI Slop Markers:** No flat layouts, no timid contrasts, no cookie-cutter design

## M3 Expressive Design Principles (Audit Reference)

This audit validates five core M3 Expressive principles:

### 1. Distinctive Typography (No Generic Fonts)

- ❌ Forbidden: Inter, Roboto, Arial, Plus Jakarta Sans, Sora, Poppins, Montserrat, Space Grotesk, system fonts
- ✅ Required: Variable fonts (Work Sans wght 100-900, Fraunces opsz/wght/SOFT/WONK, Libre Bodoni, JetBrains Mono, Caveat, Nabla-restricted) with extreme weight contrasts
- ✅ Required: Optical sizing enabled (font-optical-sizing: auto)
- ✅ Required: 9x+ weight ratio (100 vs 900, not 400 vs 500)

### 2. Extreme Contrasts (Visual Drama)

- ✅ Typography: 3x+ weight or size difference
- ✅ Color: Vibrant saturation (40-80%), no muted tones
- ✅ Layout: Varied spacing (8px, 16px, 24px), not uniform
- ✅ Components: High-contrast visual hierarchy

### 3. Spring Physics Motion (Alive Interactions)

- ✅ Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (overshoot/spring feel)
- ✅ Hover: Bloom effect (scale + elevation increase)
- ✅ Duration: 250-400ms (slow enough to feel springy)
- ✅ Feedback: Clear state indication on all interactions

### 4. Vibrant Tokens (M3 Expressive Colors)

- ✅ Semantic tokens at expressive saturation (not baseline)
- ✅ Dominant color in palette (not evenly distributed)
- ✅ High-saturation colors (vibrant, not timid)
- ❌ No purple gradients (clichéd)
- ❌ No generic blue #2196F3 (baseline Material)

### 5. kr-solidarity organic Asymmetry (Intentional Distinctiveness)

- ✅ Layout: Varied spacing and alignment (not grid-mechanical)
- ✅ Shapes: Asymmetric border-radius (pebble, stone, leaf-inspired)
- ✅ Hierarchy: Clear visual rhythm, not uniform
- ✅ Personality: Component feels intentionally designed, not generic

**M3 Expressive Audit Principle**: A component passes when it shows **personality-driven design** that feels intentional, not generic or "AI slop".

## Validation Questions

Before deploying audit results, verify:

- Does the audit capture what you see visually?
- Are the findings specific and actionable?
- Do the recommendations improve the component?
- Is the assessment repeatable (would someone else agree)?
- Does this feed meaningful signal into your compliance dashboard?

If yes to all, the audit is reliable.

## Related Skills

- [m3-anti-slop-validator](../design-skills/m3-anti-slop-validator/SKILL.md) - Validate components against M3 Expressive standards
- [m3-expressive-typography-enhancer](../design-skills/m3-expressive-typography-enhancer/SKILL.md) - Enhance typography with variable fonts
- [brand-brief-optimizer](../brand-brief-optimizer/SKILL.md) - Stress-test briefs for M3 Expressive clarity
- [design-token-validator](file:///.claude/skills/design-token-validator/SKILL.md)
- Validate M3 Expressive semantic tokens

---

**Version:** 3.0.0 (M3 Expressive)
**Status:** Production Ready

_Vision audit transforms design system management from specification-only to visually-validated. This closes the loop between intention and implementation._
