---
name: m3-expressive-compliance-dashboard
description: Track KR Solidarity (Migrant Rage) M3 Expressive adoption metrics across
  components. Monitor font stack compliance, extreme-contrasts, spring-physics,
  vibrant-token, and kr-solidarity asymmetry percentages. Generate compliance reports
  and identify components needing expressiveness enhancement.
metadata:
  version: 6.0.0
  tags:
    - m3-expressive
    - kr-solidarity
    - compliance
    - design-system
---

# KR Solidarity M3 Expressive Compliance Dashboard (v6.0)

## Purpose

Track M3 Expressive adoption metrics across your KR Solidarity component library. Identify gaps, monitor progress, and guide design system maturation from baseline M3 to fully expressive KR Solidarity compliance.

## When to Use

- **Track KR Solidarity adoption** across component library
- **Monitor compliance metrics** (Solidarity Stack %, extreme contrasts %, etc.)
- **Identify components needing enhancement** (which are still baseline M3?)
- **Generate compliance reports** for stakeholders
- **Visualize design system maturity** over time
- **Prioritize refactoring work** (which components to upgrade first?)

## Core Metrics (KR Solidarity M3 Expressive Adoption)

### 1. Solidarity Stack Compliance (%)

**Definition**: Percentage of components using the KR Solidarity font stack (Work Sans, Fraunces, Libre Bodoni, JetBrains Mono, Caveat) instead of forbidden fonts (Inter, Roboto, Arial, Sora, Plus Jakarta Sans, Poppins).

**Calculation**:
```
(Components with Solidarity Stack / Total components) × 100
```

**Target**: 100%

**Red Flags**:
- Inter alone (forbidden — generic corporate)
- Roboto (baseline M3, not KR Solidarity)
- Sora or Plus Jakarta Sans (banned in v6.0)
- Arial, system-ui (forbidden)

### 2. Extreme Contrasts (%)

**Definition**: Percentage of components using extreme weight/size contrasts (9× ratio per the Solidarity Scale Mandate: `text-display`/`text-hero` at `font-black: 900` paired with `text-micro`/`text-small` at `300`) instead of timid contrasts.

**Calculation**:
```
(Components with 9× contrast / Total components) × 100
```

**Target**: 100%

**Red Flags**:
- Weight contrast 400 vs 600 (timid, not Solidarity)
- Size contrast 24px vs 16px (1.5×, not 6× mandate)
- No clear typographic hierarchy

### 3. Spring Physics (%)

**Definition**: Percentage of interactive components using spring physics easing (`cubic-bezier(0.34, 1.56, 0.64, 1)` overshoot) instead of linear or standard easing.

**Calculation**:
```
(Components with spring physics / Total interactive components) × 100
```

**Target**: 100%

**Red Flags**:
- Linear easing (feels stiff and corporate)
- Instant transitions (no motion)
- Standard easing (expressive-neutral, not alive)

### 4. Vibrant Solidarity Tokens (%)

**Definition**: Percentage of components using KR Solidarity semantic tokens (`--sys-color-*`) instead of hardcoded hex or generic M3 baseline colors.

**Calculation**:
```
(Components with --sys-color-* tokens / Total components) × 100
```

**Target**: 100%

**Red Flags**:
- Hardcoded hex values (any `#` in CSS)
- Purple gradients (#7C4DFF → #9C27B0) — banned
- Generic blue (#2196F3) — banned
- White backgrounds (#FFFFFF) — banned
- `--nc-*` token prefix (legacy, replaced by `--sys-*`)

### 5. KR Solidarity Organic Asymmetry (%)

**Definition**: Percentage of components using kr-solidarity asymmetric radii (Stone/Slab/Pebble shapes) instead of mechanical uniform shapes.

**Calculation**:
```
(Components with kr-solidarity asymmetric shapes / Total components) × 100
```

**Target**: 100%

**Red Flags**:
- Uniform `border-radius: 8px` on all corners
- `border-radius: 50%` (perfect circles — strictly banned)
- Grid-mechanical layouts with no intentional asymmetry
- Flat backgrounds (no elevation or texture)

## Dashboard Metrics

### Overall KR Solidarity Expressive Score

**Calculation**:
```
Average of 5 core metrics / 5
```

**Grade Scale**:
- **A (90–100%)**: Production KR Solidarity — ship it
- **B (75–89%)**: Good — minor gaps to close
- **C (60–74%)**: Needs work before release
- **D (40–59%)**: Significant non-compliance — refactor required
- **F (<40%)**: Not KR Solidarity — considered baseline M3 or generic

### Component Maturity Distribution

| Maturity Level           | Definition         | Count | %   |
| ------------------------ | ------------------ | ----- | --- |
| **KR Solidarity**        | All 5 metrics pass | X     | X%  |
| **Mostly Expressive**    | 4/5 metrics pass   | X     | X%  |
| **Partially Expressive** | 2–3/5 metrics pass | X     | X%  |
| **Baseline M3**          | 0–1/5 metrics pass | X     | X%  |

## Dashboard Report Format

### JSON Output

```json
{
  "compliance_dashboard": {
    "report_date": "2026-03-07T...",
    "design_system": "KR Solidarity (Migrant Rage) v6.0",
    "total_components": 42,

    "overall_score": 73,
    "grade": "C",

    "metrics": {
      "solidarity_stack": {
        "percentage": 85,
        "compliant_count": 36,
        "non_compliant_count": 6,
        "status": "good",
        "violations": ["LoginForm uses Inter alone", "DashboardCard uses Roboto"]
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
      "kr_solidarity_asymmetry": {
        "percentage": 61,
        "compliant_count": 26,
        "non_compliant_count": 16,
        "status": "needs_improvement"
      }
    },

    "maturity_distribution": {
      "kr_solidarity": { "count": 18, "percentage": 43 },
      "mostly_expressive": { "count": 12, "percentage": 29 },
      "partially_expressive": { "count": 8, "percentage": 19 },
      "baseline_m3": { "count": 4, "percentage": 9 }
    },

    "components_needing_enhancement": [
      {
        "component": "LoginForm",
        "current_maturity": "baseline_m3",
        "failing_metrics": ["solidarity_stack", "extreme_contrasts", "spring_physics"],
        "priority": "high"
      },
      {
        "component": "DashboardCard",
        "current_maturity": "partially_expressive",
        "failing_metrics": ["kr_solidarity_asymmetry", "extreme_contrasts"],
        "priority": "medium"
      }
    ],

    "recommendations": [
      "Replace Inter/Roboto with Work Sans Variable in 6 components",
      "Upgrade weight contrasts to 9× ratio (wght 300 body vs 900 headline) in 13 components",
      "Add spring physics cubic-bezier(0.34, 1.56, 0.64, 1) to 12 interactive components",
      "Apply kr-solidarity asymmetric border-radius to 16 components"
    ]
  }
}
```

## Component Audit Checklist

For each component, validate:

### Typography
- [ ] Uses **Solidarity Stack** only: Work Sans Variable, Fraunces Variable, Libre Bodoni, JetBrains Mono, Caveat
- [ ] No forbidden fonts: Inter, Roboto, Arial, Sora, Plus Jakarta Sans, Poppins, Montserrat, Space Grotesk
- [ ] Weight contrast ≥ 9× ratio (wght 300 body vs 900 headline, per Scale Hierarchy Mandate)
- [ ] Size contrast ≥ 6× ratio (72px display vs 12px micro)
- [ ] Variable font axes used: `GRAD` for hover, `WONK`/`SOFT` for headers

### Color
- [ ] All colors via `--sys-color-*` tokens — zero hardcoded hex
- [ ] Solidarity Charcoal background (#1A1714 via `--sys-color-charcoalBackground-base`)
- [ ] No purple gradients (#7C4DFF → #9C27B0) — banned
- [ ] No generic blue (#2196F3) — banned
- [ ] No white backgrounds (#FFFFFF) — banned

### Motion
- [ ] Spring physics easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` on interactions
- [ ] Hover bloom effect: scale(1.02–1.05) + elevation increase
- [ ] Duration tokens applied (50ms / 250ms / 500ms)
- [ ] `@media prefers-reduced-motion` respected

### Layout
- [ ] KR Solidarity asymmetric border-radius (Stone/Slab/Pebble shapes)
- [ ] No `border-radius: 50%` — strictly banned
- [ ] Varied spacing rhythm (8px / 16px / 24px / 40px)
- [ ] Layers: Z-0 substrate, Z-1–2 atmospheric, Z-3+ UI foreground

### Overall
- [ ] Component feels KR Solidarity Expressive (personality-driven, resistance aesthetic)
- [ ] Not baseline M3 (restrained, minimal, corporate)
- [ ] Not generic/slop (cookie-cutter, purple gradients, AI-bland)
- [ ] Zero-Flora Lockdown respected (no botanical motifs)

## Priority Scoring (Which Components to Upgrade First?)

**High Priority** (upgrade immediately):
- Components with 0–1/5 metrics passing (baseline M3)
- High-visibility hero components (landing page, hero sections)
- Frequently used components (buttons, inputs, cards)

**Medium Priority** (upgrade next):
- Components with 2–3/5 metrics passing (partially expressive)
- Modal, dialog, and drawer components

**Low Priority** (upgrade later):
- Components with 4/5 metrics passing (mostly expressive)
- Tooltips, badges, and rarely-used UI elements

## Scanning Commands

```bash
# Detect forbidden fonts in source
rg -n "(Inter|Roboto|Arial|Sora|Plus Jakarta Sans|Poppins|Montserrat)" frontend/src/

# Find hardcoded hex values (bypass token system)
rg -n "#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b" frontend/src/components frontend/src/layouts

# Find perfect circles (border-radius: 50%)
rg -n "border-radius:\s*50%" frontend/src/

# Find non-spring easing
rg -n "ease-in|ease-out|linear" --type css frontend/src/

# Run token validator
python3 scripts/design-validation/validate-tokens.py
```

## Process

1. **Dashboard Execution**: Scan component library using commands above.
2. **Metric Analysis**: Review scores across 5 KR Solidarity dimensions.
3. **Gap Identification**: Find "Baseline M3" and generic components.
4. **Actionable Output**: Follow priority list and scanning commands.
5. **Continuous Monitoring**: Re-audit before each sprint end.

## Related Skills

- [m3-visual-audit](../m3-visual-audit/SKILL.md) — Audit individual component screenshots
- [kerala-rage-brand-enforcer](../kerala-rage-brand-enforcer/SKILL.md) — Brand compliance enforcement
- [vision-scorer-mcp](../vision-scorer-mcp/SKILL.md) — Deterministic visual quality gate

---

**Version:** 6.0.0 | **Status:** Production Ready | **Updated:** 2026-03-07

_Dashboard transforms KR Solidarity adoption from aspirational to measurable. Track progress, identify gaps, guide the system to full Solidarity Expressive compliance._
