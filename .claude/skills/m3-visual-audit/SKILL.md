---
name: m3-visual-audit
description: Audit UI screenshots against KR Solidarity M3 Expressive standards with deterministic scoring and actionable remediation.
commands:
  - // turbo
  - /visual-audit
  - /audit-visual
  - /m3-audit
metadata:
  version: 6.3.0
  tags:
    - visual-audit
    - m3-expressive
    - kr-solidarity
---

# M3 Visual Audit

## Purpose

Evaluate screenshot-level M3 Expressive compliance for KR Solidarity interfaces using `vision-scorer-mcp` as the primary scoring engine for deterministic findings.

## Usage

### Via slash command

```bash
/m3-visual-audit --screenshot /absolute/path/to/capture.png
/m3-visual-audit --route /dashboard --output /absolute/path/results.json
/m3-audit screenshot.png --component LoginScreen
/audit-visual screenshot.png --context "Login form, default state"
```

### Via skill tool

```bash
claude-code --skill m3-visual-audit --screenshot screenshot.png
```

Arguments:
- `--screenshot <absolute-path>`: required string path to a PNG, JPG, or WebP screenshot
- `--component <name>`: optional string label for the screen or component under review
- `--context <text>`: optional string describing state, viewport, and user journey position
- `--output <absolute-path>`: optional string path for the JSON report; defaults to `m3-visual-audit-report.json`
- `--mode <baseline|regression|exploratory>`: optional enum; defaults to `baseline`

## When to Use

- During visual QA before merge.
- During regression checks after token/layout/motion changes.
- When a design review needs objective pass/fail scoring.

## Shared References

- `../shared-references/BRAND_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`
- `../shared-references/AUDIT_OUTPUT_CONTRACT.md`
- `references/SCORING.md`
- `references/OUTPUT_EXAMPLE.json`
- `references/EVIDENCE_GUIDE.md`
- `references/SCREENSHOT_EXAMPLES.md`

## Scope

This skill focuses on screenshot evidence for:
- typography hierarchy and contrast
- color expressiveness and token alignment
- layout asymmetry and depth
- motion intent inference from comparative visual cues

## Audit Dimensions (100)

- Typography: 25
- Color/token compliance: 25
- Layout and hierarchy: 25
- Expressive distinctiveness: 25

## Scoring Methodology

Score each dimension independently using screenshot evidence, then total the result.

Typography:
- headline/body/action contrast
- readability at the captured size
- appropriateness for the screen context

Color/token compliance:
- semantic token fidelity
- contrast and emphasis quality
- absence of off-brand or generic palette drift

Layout and hierarchy:
- asymmetry, depth, spacing rhythm, and panel balance
- whether the primary action and information order are obvious

Expressive distinctiveness:
- whether the composition uses at least one deliberate asymmetry anchor such as an offset scaffold, non-centered hero mass, or staggered panel edge
- whether the surface system shows at least two depth cues such as grain, torn edge logic, layered substrate, or high-contrast panel separation
- whether accent deployment is intentional: one dominant emphasis signal and one supporting highlight, without generic frosted-glass or flat SaaS neutrality
- whether motion intent is evidenced by comparative states; static single-state screenshots may only score this sub-point at reduced confidence

Status thresholds:
- `>= 90`: pass
- `75-89`: needs refinement
- `< 75`: fail

## Process

1. Validate screenshot quality and context.
2. Invoke `vision-scorer-mcp` with screenshot evidence.
3. Classify findings using Solidarity audit dimensions (Typography, Color, Layout, Expressiveness).
4. Classify violations by severity.
5. Emit structured report with fixes.
6. Downgrade confidence when evidence is incomplete instead of inferring absent states.

## Evidence Requirements

Preferred evidence:
- one default-state screenshot
- one interaction-state screenshot where relevant
- one mobile or narrow-width screenshot when layout behavior matters

Concrete repo examples:
- `frontend/docs/design/generated/previews/login.png`
- `frontend/docs/design/generated/previews/register.png`
- `frontend/docs/design/generated/previews/run-2026-03-09_21-27-57/login.png`

If evidence is incomplete:
- mark confidence down
- avoid overclaiming motion or state-specific findings

## Edge Cases

### No screenshot available
- Do not fabricate a visual score.
- Return `status: "blocked_missing_evidence"`.
- Ask for at least one default-state capture before scoring.

### Single screenshot only
- Score typography, color, and layout normally if visible.
- Cap motion-related confidence at `low`.
- Mark any state-specific recommendation as provisional.

### Regression mode
- Prefer paired `before` and `after` evidence with the same viewport.
- Call out delta findings first: regressions, unchanged failures, and resolved violations.
- Do not rescore unchanged unknown areas with artificial precision.

## Output Contract

Use shared audit contract shape with wrapper key `visual_audit`.

Minimum JSON shape:

```json
{
  "visual_audit": {
    "target": "LoginScreen",
    "status": "needs_refinement",
    "score": 84,
    "dimension_scores": {
      "typography": 20,
      "color_token_compliance": 22,
      "layout_hierarchy": 21,
      "expressive_distinctiveness": 21
    },
    "evidence": ["login-default.png", "login-focus.png"],
    "violations": [],
    "recommendations": []
  }
}
```

## Troubleshooting

### Low-resolution screenshot
- Request higher-resolution capture.
- Mark uncertain findings as medium severity.

### Missing interaction states
- Request hover/focus/active captures.
- Avoid high-confidence motion judgments without state evidence.

### Regression audit with mismatched viewports
- Treat the comparison as advisory only.
- Do not claim a regression win or loss on spacing, hierarchy, or depth if the capture sizes differ materially.

### Screen is structurally compliant but still scores low
- this is expected when visual hierarchy, composition, or expressiveness is weak
- route the implementation to `kerala-rage-typography-strategy` or `component-visual-audit` depending on whether the problem is page-wide or local

## Related Skills

- `component-visual-audit`
- `vision-scorer-mcp`
- `ui-design-evaluator`
- `web-design-guidelines`
- `kerala-rage-brand-enforcer`
