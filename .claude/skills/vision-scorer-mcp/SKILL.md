---
name: vision-scorer-mcp
description: Deterministic MCP-based visual compliance scoring for Kerala Rage assets with hard gates for token usage, wireframe alignment, manifest integrity, and hero composition quality.
metadata:
  status: Production Ready
  type: mcp-server
  version: 2.1.0
  tags: [audit, vision, compliance, kerala-rage]
---

# Vision-Scorer MCP

## Purpose
Use vision scoring as the final quality gate for asset audits. This skill provides the framework and tools to ensure assets meet the strict "Solidarity Mode" aesthetics of Kerala Rage. Assets must score `>= 90` to pass packaging/deployment.

## Status: Production Ready
This skill is fully implemented and relies on the following infrastructure:
- **Vision Model:** Gemini 1.5 Pro (via Google AI Studio or Vertex AI)
- **Validation Scripts:** `scripts/design-validation/validate-tokens.py`, `frontend/scripts/kr/validate-manifest.mjs`
- **MCP Server:** Integrated via standard MCP protocol for asset analysis.

## Required Inputs
```json
{
  "image_path": "frontend/public/assets/kr-solidarity/...png",
  "asset_id": "KR-SOLID-001",
  "wireframe_ref": "docs/design/hifi/consolidated-hifi-wireframes.md",
  "manifest_path": "frontend/public/assets/kerala-rage-kr-solidarity-manifest.json",
  "hero_registry_path": "frontend/public/assets/kr-solidarity-hero-registry.json",
  "target_score": 90
}
```

## Setup & Authentication
1. **API Key:** Ensure `GOOGLE_API_KEY` is set in your environment for Vision API access.
2. **Dependencies:** Install validation dependencies:
   ```bash
   pip install pillow rich
   npm install --prefix frontend
   ```
3. **MCP Configuration:** Add the vision-scorer to your MCP settings if using an external server.

## Hard Rules
1. **Token Compliance:** Reject any UI output that uses hardcoded hex colors. Must use semantic tokens: `--sys-color-*` and `--sys-type-*`.
2. **Manifest Integrity:** Verify asset references exist in the manifest and filesystem.
3. **Placement Fidelity:** Verify placement intent against annotated wireframes (layering, anchor usage, motif role).
4. **Solidarity Leverage:**
   - No missing hero asset references.
   - Prefer layered compositions (`>= 4` layers) for hero-grade outputs.
   - **Nabla Usage:** Decorative icon-scale only. Fail if Nabla is a primary headline.
   - **Nabla Palette:** Must align with `@font-palette-values --nabla-solidarity`.
5. **Decision is Binary:**
   - `PACKAGE` only when `overall_score >= target_score`
   - `REGENERATE` otherwise

## Scoring Rubric (Max 100)
- **Token Compliance (25):** Correct usage of semantic tokens, zero hex-codes in UI paths.
- **Wireframe Fidelity (20):** Alignment with placement strategy and anchor points.
- **Manifest Integrity (15):** Proper indexing in Solidarity manifests and registries.
- **Visual Quality (25):** Contrast ratios (target 9:1), hierarchy (6:1 size ratio), Nabla role.
- **Solidarity Intent (15):** Motif usage accuracy and layer depth.

## Output Contract
```json
{
  "asset_id": "KR-SOLID-001",
  "overall_score": 92,
  "decision": "PACKAGE",
  "checks": {
    "token_compliance": 24,
    "wireframe_fidelity": 18,
    "manifest_integrity": 20,
    "visual_quality": 18,
    "hero_leverage": 12
  },
  "violations": [],
  "actions": []
}
```

## Troubleshooting & Error Handling
- **Vision API Failure:** If the connection to Gemini fails, the scorer will return `{"decision": "MANUAL_REVIEW", "error": "API_UNAVAILABLE"}`.
- **Rate Limiting:** If quota is exceeded, wait 60 seconds or switch API keys.
- **Invalid Schema:** If input JSON fails validation, the process terminates immediately with an error.
- **Inconsistent Results:** If scoring varies wildly, re-run with a higher temperature or check image resolution (min 1024px).

## Recommended Combo
1. `asset-placement-strategy` for wireframe placement checks.
2. `manifest-reconciler` for gap/orphan verification.
3. `batch-processor` for parallel scoring.

## Baseline Commands
```bash
# Validate tokens for code compliance
python3 scripts/design-validation/validate-tokens.py

# Validate manifest integrity
node frontend/scripts/kr/validate-manifest.mjs

# Check for unlinked assets (TODOs)
rg -n "TODO\[asset\]" docs/design frontend/src

# Audit for hardcoded hex colors
rg -n "#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\\b" frontend/src/components frontend/src/layouts frontend/src/pages
```
