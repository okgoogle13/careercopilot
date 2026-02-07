---
name: m3-expressive-compliance-dashboard
description: Track Material Design 3 Expressive adoption metrics across components. Monitor no-generic-fonts percentage, extreme-contrasts percentage, spring-physics percentage, vibrant-tokens percentage, and organic-asymmetry percentage. Generate compliance reports and identify components needing expressiveness enhancement.
version: 1.0.0
tags: []
---

# M3 Expressive Compliance Dashboard

## Purpose

Track M3 Expressive adoption metrics across your component library. Identify gaps, monitor progress, and guide design system maturation from baseline M3 to M3 Expressive.

## When to Use

Use this skill when you need to:

- **Track M3 Expressive adoption** across component library
- **Monitor compliance metrics** (no generic fonts %, extreme contrasts %, etc.)
- **Identify components needing enhancement** (which are still baseline M3?)
- **Generate compliance reports** for stakeholders
- **Visualize design system maturity** over time
- **Prioritize refactoring work** (which components to upgrade first?)

## Core Metrics (M3 Expressive Adoption)

### 1. No Generic Fonts (%)

**Definition**: Percentage of components using M3 Expressive variable fonts (Sora, Plus Jakarta Sans, Poppins) instead of generic fonts (Inter, Roboto, Arial).

**Calculation**:

```
(Components with M3 Expressive fonts / Total components) × 100
```

**Target**: 100% (zero generic fonts)

**Red Flags**:

- Inter alone (not paired with display font)
- Roboto (baseline M3, not expressive)
- Arial, system-ui (generic)

### 2. Extreme Contrasts (%)

**Definition**: Percentage of components using extreme weight/size contrasts (3x+ ratio) instead of timid contrasts (1.25x ratio).

**Calculation**:

```
(Components with 3x+ contrast / Total components) × 100
```

**Target**: 100% (all components have dramatic hierarchy)

**Red Flags**:

- Weight contrast 400 vs 600 (1.5x, timid)
- Size contrast 24px vs 16px (1.5x, timid)
- No visual hierarchy (uniform weights)

### 3. Spring Physics (%)

**Definition**: Percentage of interactive components using spring physics easing (cubic-bezier overshoot) instead of linear or standard easing.

**Calculation**:

```
(Components with spring physics / Total interactive components) × 100
```

**Target**: 100% (all interactions feel alive)

**Red Flags**:

- Linear easing (feels stiff)
- Instant transitions (no motion)
- Standard easing (not expressive)

### 4. Vibrant Tokens (%)

**Definition**: Percentage of components using M3 Expressive vibrant semantic tokens (40-80% saturation) instead of baseline M3 colors.

**Calculation**:

```
(Components with vibrant tokens / Total components) × 100
```

**Target**: 100% (all colors are vibrant)

**Red Flags**:

- Baseline M3 colors (not vibrant)
- Purple gradients (#7C4DFF → #9C27B0)
- Generic blue (#2196F3)
- Hardcoded hex values (not tokens)

### 5. Organic Asymmetry (%)

**Definition**: Percentage of components using organic asymmetric shapes instead of mechanical uniform shapes.

**Calculation**:

```
(Components with asymmetric shapes / Total components) × 100
```

**Target**: 100% (all shapes feel intentional)

**Red Flags**:

- Uniform border-radius (8px all corners)
- Grid-mechanical layouts (no asymmetry)
- Flat backgrounds (no elevation)

## Dashboard Metrics

### Overall M3 Expressive Score

**Calculation**:

```
Average of 5 core metrics (No Generic Fonts + Extreme Contrasts + Spring Physics + Vibrant Tokens + Organic Asymmetry) / 5
```

**Grade Scale**:

- **A (90-100%)**: Exceptional - Production M3 Expressive
- **B (75-89%)**: Good - Minor gaps
- **C (60-74%)**: Acceptable - Needs work
- **D (40-59%)**: Below standards - Significant gaps
- **F (<40%)**: Critical - Mostly baseline M3

### Component Maturity Distribution

| Maturity Level           | Definition         | Count | %   |
| ------------------------ | ------------------ | ----- | --- |
| **M3 Expressive**        | All 5 metrics pass | X     | X%  |
| **Mostly Expressive**    | 4/5 metrics pass   | X     | X%  |
| **Partially Expressive** | 2-3/5 metrics pass | X     | X%  |
| **Baseline M3**          | 0-1/5 metrics pass | X     | X%  |

### Trend Analysis (Over Time)

Track metrics week-over-week to visualize progress:

```
Week 1: 45% → Week 2: 52% → Week 3: 61% → Week 4: 73%
```

**Insight**: "M3 Expressive adoption increased 28 percentage points in 4 weeks. At current pace, 100% adoption in 8 weeks."

## Dashboard Report Format

### JSON Output

```json
{
  "compliance_dashboard": {
    "report_date": "2026-02-07T...",
    "design_system": "Material Design 3 Expressive",
    "total_components": 42,

    "overall_score": 73,
    "grade": "C",

    "metrics": {
      "no_generic_fonts": {
        "percentage": 85,
        "compliant_count": 36,
        "non_compliant_count": 6,
        "status": "good"
      },
      "extreme_contrasts": {
        "percentage": 68,
        "compliant_count": 29,
        "non_compliant_count": 13,
        "status": "needs_improvement"
      },
      "spring_physics": {
        "percentage": 72,
        "compliant_count": 30,
        "non_compliant_count": 12,
        "status": "acceptable"
      },
      "vibrant_tokens": {
        "percentage": 79,
        "compliant_count": 33,
        "non_compliant_count": 9,
        "status": "good"
      },
      "organic_asymmetry": {
        "percentage": 61,
        "compliant_count": 26,
        "non_compliant_count": 16,
        "status": "needs_improvement"
      }
    },

    "maturity_distribution": {
      "m3_expressive": {
        "count": 18,
        "percentage": 43,
        "definition": "All 5 metrics pass"
      },
      "mostly_expressive": {
        "count": 12,
        "percentage": 29,
        "definition": "4/5 metrics pass"
      },
      "partially_expressive": {
        "count": 8,
        "percentage": 19,
        "definition": "2-3/5 metrics pass"
      },
      "baseline_m3": {
        "count": 4,
        "percentage": 9,
        "definition": "0-1/5 metrics pass"
      }
    },

    "components_needing_enhancement": [
      {
        "component": "LoginForm",
        "current_maturity": "baseline_m3",
        "failing_metrics": ["no_generic_fonts", "extreme_contrasts", "spring_physics"],
        "priority": "high"
      },
      {
        "component": "DashboardCard",
        "current_maturity": "partially_expressive",
        "failing_metrics": ["organic_asymmetry", "extreme_contrasts"],
        "priority": "medium"
      }
    ],

    "recommendations": ["Upgrade 6 components still using Inter font to Plus Jakarta Sans", "Increase weight contrasts in 13 components (400-600 → 300-900)", "Add spring physics easing to 12 interactive components", "Apply asymmetric border-radius to 16 components"],

    "trend_analysis": {
      "week_1": 45,
      "week_2": 52,
      "week_3": 61,
      "week_4": 73,
      "improvement": "+28 percentage points in 4 weeks",
      "projection": "100% adoption in ~8 weeks at current pace"
    }
  }
}
```

### HTML Dashboard Artifact

Generated dashboard includes:

- Overall M3 Expressive score (0-100%)
- 5 core metrics with progress bars
- Component maturity distribution (pie chart)
- Trend analysis (line chart)
- Components needing enhancement (table)
- Recommendations (actionable list)

## Usage Examples

### Example 1: Generate Compliance Report

**Input**: "Generate M3 Expressive compliance dashboard for component library"

**Output**:

1. Overall score (0-100%)
2. 5 core metrics with percentages
3. Component maturity distribution
4. Components needing enhancement
5. Recommendations

### Example 2: Track Progress Over Time

**Input**: "Show M3 Expressive adoption trend over last 4 weeks"

**Output**:

1. Week-over-week metrics
2. Improvement percentage
3. Projection to 100% adoption
4. Insights and recommendations

### Example 3: Identify Priority Components

**Input**: "Which components should we upgrade to M3 Expressive first?"

**Output**:

1. Components ranked by priority (high/medium/low)
2. Failing metrics per component
3. Estimated effort per component
4. Recommended upgrade sequence

## Component Audit Checklist

For each component, validate:

### Typography

- [ ] Uses M3 Expressive fonts (Sora, Plus Jakarta Sans, Poppins)
- [ ] No generic fonts (Inter, Roboto, Arial alone)
- [ ] Weight contrast ≥ 3x (300 vs 900, not 400 vs 600)
- [ ] Size contrast ≥ 3x (57px vs 12px, not 24px vs 16px)

### Color

- [ ] Uses vibrant semantic tokens (40-80% saturation)
- [ ] No purple gradients
- [ ] No generic blue (#2196F3)
- [ ] No hardcoded hex values

### Motion

- [ ] Uses spring physics easing (cubic-bezier overshoot)
- [ ] Hover bloom effect (scale + elevation)
- [ ] Duration tokens applied (50/250/500ms)

### Layout

- [ ] Organic asymmetry (not grid-mechanical)
- [ ] Varied spacing rhythm (8px, 16px, 24px, 40px)
- [ ] Dramatic elevation (layered depth)

### Overall

- [ ] Component feels M3 Expressive (personality-driven)
- [ ] Not baseline M3 (restrained)
- [ ] Not generic/slop (cookie-cutter)

## Priority Scoring (Which Components to Upgrade First?)

**High Priority** (upgrade immediately):

- Components with 0-1/5 metrics passing (baseline M3)
- High-visibility components (landing page, hero sections)
- Frequently used components (buttons, inputs, cards)

**Medium Priority** (upgrade next):

- Components with 2-3/5 metrics passing (partially expressive)
- Medium-visibility components (modals, dialogs)
- Moderately used components (tabs, accordions)

**Low Priority** (upgrade later):

- Components with 4/5 metrics passing (mostly expressive)
- Low-visibility components (tooltips, badges)
- Rarely used components (niche features)

## Compliance Tracking Workflow

### 1. Initial Audit

Run compliance dashboard to establish baseline.

**Output**: Overall score, component maturity distribution, priority list.

### 2. Set Goals

Define target metrics and timeline.

**Example**: "Achieve 90% M3 Expressive adoption in 8 weeks"

### 3. Upgrade Components

Work through priority list, upgrading components to M3 Expressive.

**Track**: Components upgraded per week, metrics improving.

### 4. Re-Audit Weekly

Run compliance dashboard weekly to track progress.

**Output**: Trend analysis, updated priority list, recommendations.

### 5. Achieve 100% Adoption

All components pass all 5 metrics.

**Celebrate**: Design system is fully M3 Expressive!

## Process

1. **Dashboard Execution**: Run the compliance dashboard tool to generate adoption metrics.
2. **Metric Analysis**: Review scores for fonts, contrasts, motion, tokens, and asymmetry.
3. **Gap Identification**: Identify "Baseline M3" components needing enhancement.
4. **Actionable Output**: Follow recommendations and priority lists to upgrade components.
5. **Continuous Monitoring**: Re-audit weekly to track maturity trajectory.

## Related Skills

- [m3-visual-audit](../m3-visual-audit/SKILL.md) - Audit individual component screenshots
- [m3-expressive-ui-evaluator](../m3-expressive-ui-evaluator/SKILL.md) - Evaluate designs with 400-point scoring
- [m3-anti-slop-validator](../design-skills/m3-anti-slop-validator/SKILL.md) - Validate against slop patterns
- [m3-expressive-design-token-validator](../m3-expressive-design-token-validator/SKILL.md) - Validate design tokens

---

**Version:** 1.0.0 (M3 Expressive)
**Status:** Production Ready

_The dashboard transforms M3 Expressive adoption from aspirational to measurable. Track progress, identify gaps, and guide your design system to full expressiveness._
