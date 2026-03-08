---
name: kr-solidarity-brand-enforcer
description: Enforce KR Solidarity brand compliance across design/code artifacts using deterministic rule checks and structured violation reporting.
metadata:
  version: 6.1.0
  tags:
    - brand
    - compliance
    - kr-solidarity
    - migrant-rage
---

# KR Solidarity Brand Enforcer (v6.1)

## Purpose

Apply deterministic KR Solidarity brand checks to wireframes, specs, and frontend code outputs before merge or release.

## When to Use

- After wireframe/spec generation.
- Before component implementation handoff.
- During PR review for brand consistency.
- During release readiness audits.

## Canon References

- `docs/design/01_CANON.md`
- `docs/design/02_SYSTEM.md`
- `frontend/src/design/styles/design-tokens.css`

## Core Enforcement Rules

1. Color policy
- Background baseline uses `--sys-color-charcoalBackground-base`.
- Accent tokens must use canonical variables such as:
  - `--sys-color-solidarityRed-base`
  - `--sys-color-inkGold-base`
  - `--sys-color-stencilYellow-base`
  - `--sys-color-kr-activistSmokeGreen-base`
- Hardcoded white backgrounds and arbitrary hex in implementation-facing output are violations.

2. Typography policy
- Allowed stack: `Work Sans`, `Fraunces`, `Libre Bodoni`, `JetBrains Mono`, `Caveat`, `Nabla` (restricted decorative use).
- Banned defaults: `Inter`, `Roboto`, `Arial`, `Sora`, `Plus Jakarta Sans`.
- Require clear hierarchy and expressive contrast.

3. Shape/layout policy
- Prefer Stone/Slab/Pebble asymmetric language.
- `border-radius: 50%` is a violation.
- Avoid uniform mechanical spacing/radius patterns.

4. Visual motif policy
- Zero-Flora lockdown: no floral/botanical motifs.
- Favor urban/human-centered solidarity framing.

## Deterministic Output Contract

```json
{
  "brand_audit": {
    "target": "string",
    "status": "pass|needs_refinement|fail",
    "score": 0,
    "violations": [
      {
        "severity": "critical|high|medium|low",
        "rule": "string",
        "location": "string",
        "evidence": "string",
        "fix": "string"
      }
    ],
    "summary": {
      "critical": 0,
      "high": 0,
      "medium": 0,
      "low": 0
    },
    "recommendations": []
  }
}
```

Status guide:
- `pass`: score >= 90 and no critical violations.
- `needs_refinement`: score 75-89 or any high violations.
- `fail`: score < 75 or any critical violations.

## Process

1. Inspect target artifact(s).
2. Apply rule checks by category (color, typography, shape/layout, motifs).
3. Record violations with severity + concrete fix.
4. Compute status + score.
5. Emit JSON report.

## Edge Cases

- If token aliases are present, resolve to canonical `--sys-color-*` names before flagging.
- If screenshot-only input is provided, mark uncertain findings as `medium` with `visual_inference` note.
- If artifact contains mixed old/new brand terms, prioritize current canon and report legacy drift.

## Troubleshooting

### Token mismatch false positives

- Confirm against `frontend/src/design/styles/design-tokens.css` canonical names.
- Normalize hyphen/camel naming drift before final judgment.

### Ambiguous typography detection

- Request higher-resolution screenshot or source snippet.
- Downgrade confidence and avoid critical flags without clear evidence.

### Conflicting style guidance

- Follow `docs/design/01_CANON.md` as highest precedence.
- Treat legacy guidance as informational only.

## Validates Outputs From

- `wireframe-annotator`
- `component-spec-generator`
- `design-system-doc-generator`
- frontend component/style diffs

## Usage

`Check <file_or_output> for KR Solidarity brand compliance and return structured JSON violations.`

Last Updated: 2026-03-08 | Version: 6.1.0
