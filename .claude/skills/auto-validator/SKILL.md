---
name: auto-validator
description: Programmatic visual compliance validation for KR Solidarity assets with deterministic scoring, decision gates, and correction prompts.
metadata:
  version: 1.1.0
  tags:
    - assets
    - ai
    - accessibility
    - visual-validation
---

# Auto-Validator

## Purpose

Automate pre-manifest visual validation for generated KR Solidarity assets. Input an asset image and receive a deterministic score, violations list, and correction prompt.

## When to Use

- After Gemini/DALL-E asset generation attempts.
- Before promoting assets into manifest/registry workflows.
- During rapid iteration loops where manual review is too slow.

## Decision Gate

- `PACKAGE` when score >= 90 and no critical violations.
- `REGENERATE` when score < 90 or critical violations exist.

## Validation Scorecard (100)

1. Semantic Token Alignment (25)
- Palette intent aligns to canonical KR Solidarity tokens.
- Reject hardcoded off-canon color behavior in UI-oriented outputs.

2. M3 Expressive Typography (20)
- Expressive hierarchy and contrast.
- Approved families only: `Work Sans`, `Fraunces`, `JetBrains Mono`, `Libre Bodoni`, `Caveat`, `Nabla` (restricted decorative use).
- Banned defaults: `Inter`, `Roboto`, `Arial`, `Sora`, `Plus Jakarta Sans`.

3. Color Palette Compliance (20)
- Canonical references include:
  - `--sys-color-asphaltBlack-base`
  - `--sys-color-paperWhite-base`
  - `--sys-color-solidarityRed-base`
  - `--sys-color-inkGold-base`
  - `--sys-color-stencilYellow-base`
  - `--sys-color-kr-activistSmokeGreen-base`
  - `--sys-color-worker-ash-base`
  - `--sys-color-concreteGrey-base`
- Reject purple-generic drift and white-first expressive surfaces.

4. Asymmetric Composition (15)
- Shape language aligns to expressive asymmetry.
- Reject rigid symmetry and `border-radius: 50%` dependency for core forms.

5. Accessibility (10)
- WCAG 2.2 AA contrast targets (4.5:1 text, 3:1 UI elements).
- Focus visibility and touch target expectations.

6. Identity & Social Framing (10)
- Urban solidarity framing and culturally respectful representation.
- Reject bureaucratic/corporate sterility and appropriation patterns.

## Workflow

Input:
- image path
- asset id
- target score (default 90)

Process:
1. Extract palette and composition signals.
2. Infer typography and hierarchy quality.
3. Evaluate contrast and accessibility signals.
4. Score each dimension.
5. Generate violations and correction prompt.

Output:

```json
{
  "asset_id": "KR-SOLID-HERO-001",
  "overall_score": 87,
  "decision": "REGENERATE|PACKAGE",
  "dimensions": {
    "semantic_token_alignment": {"score": 20, "violations": []},
    "m3_expressive_typography": {"score": 18, "violations": []},
    "color_palette_compliance": {"score": 19, "violations": []},
    "asymmetric_composition": {"score": 14, "violations": []},
    "accessibility": {"score": 8, "violations": []},
    "identity_social_framing": {"score": 8, "violations": []}
  },
  "critical_violations": [],
  "correction_prompt": "string",
  "iteration_priority": "high|medium|low"
}
```

## Integration

- With `prompt-composer`: apply correction prompt for next attempt.
- With `asset-packager`: pass through only when `decision=PACKAGE`.
- With `vision-scorer-mcp`: final post-manifest validation after integration.

## Troubleshooting

### Low-resolution image

- Return `needs_more_evidence` note and avoid critical typography judgments.

### OCR/font ambiguity

- Downgrade confidence and avoid hard fails unless corroborated by multiple signals.

### Contrast calculation uncertainty

- Re-run with cleaner screenshot and explicit foreground/background surfaces.

### False positives on palette drift

- Compare against canonical token intent in `frontend/src/design/styles/design-tokens.css`.

### Missing model or vision service

- Return deterministic failure object with `service_unavailable` and no scoring.

## Important Limits

- Vision-based checks are inference-driven and should be human-reviewed for final approvals.
- This skill does not validate manifest integrity or registry linkage.

## Critical Difference vs `vision-scorer-mcp`

- `auto-validator`: pre-manifest generation loop optimizer.
- `vision-scorer-mcp`: post-manifest deterministic system gate.

Last Updated: 2026-03-08 | Version: 1.1.0
