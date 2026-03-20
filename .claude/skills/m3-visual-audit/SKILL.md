---
name: m3-visual-audit
description: Audit UI screenshots against KR Solidarity M3 Expressive standards with deterministic scoring and actionable remediation.
commands:
  - // turbo
  - /visual-audit
  - /audit-visual
  - /m3-audit
metadata:
  version: 6.2.0
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
- `screenshot` required: path to screenshot evidence
- `--component`: component or screen name for context
- `--context`: short description of UI state being audited
- `--output`: optional output path, default `m3-visual-audit-report.json`

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
- motion intent inference from visual cues

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
- whether the screen feels intentionally KR Solidarity / M3 Expressive instead of generic
- whether motion intent is inferable from the visual treatment
- whether the composition avoids flat, timid, or AI-slop defaults

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

### Screen is structurally compliant but still scores low
- this is expected when visual hierarchy, composition, or expressiveness is weak
- route the implementation to `kerala-rage-typography-strategy` or `component-visual-audit` depending on whether the problem is page-wide or local

## Related Skills

- `component
- `vision-scorer-mcp`
- `ui-design-evaluator`
- `web-design-guidelines`
-brand-enforcer`
