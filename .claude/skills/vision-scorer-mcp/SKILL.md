---
name: vision-scorer-mcp
description: Deterministic MCP-based visual compliance scoring for Kerala Rage assets with hard gates for token usage, wireframe alignment, manifest integrity, and hero composition quality.
metadata:
  status: Production Ready
  type: mcp-server
  version: 3.0.0
  tags: [audit, vision, compliance, kerala-rage]
---

# Vision-Scorer MCP (v3.0.0 Visual Guardian)

## Purpose
Use vision scoring as the final quality gate for asset audits. This skill provides the framework and tools to ensure assets meet the strict "Solidarity Mode" aesthetics of Kerala Rage. Assets must score `>= 90` to pass packaging/deployment.

## Status: Production Ready
This skill utilizes the **latest generation** of multimodal models. It operates on a tiered capability model to ensure both accuracy and uptime.

- **Vision Model Tiering Strategy:**
  - **Frontier Tier (Primary):** The current state-of-the-art reasoning model. (e.g., `gemini-3.1-pro` or latest). Used for primary scoring and complex archetypal analysis.
  - **Performance Tier (Secondary):** The highest speed, lowest latency production model. (e.g., `gemini-3.1-flash` or latest). Used for rapid checks and high-volume iterations.
  - **Utility Tier (Efficiency):** Cost-optimized or preview models for bulk auditing. (e.g., `gemini-3.1-flash-lite`).
  - **LTS Tier (Emergency):** The most stable, Long-Term Support high-fidelity fallback. (e.g., `gemini-1.5-pro`).

- **Validation Scripts:** `scripts/design-validation/validate-tokens.py`, `frontend/scripts/kr/validate-manifest.mjs`
- **MCP Server:** Integrated via standard MCP protocol for asset analysis.

## Available Tools (MCP)
- `score_asset_compliance(image_path, asset_id, target_score=90)`: Principal audit tool.
- `extract_visual_tokens(image_path)`: Extract colors, density, and typography tokens.
- `compare_attempts(attempt_paths)`: Compare multiple designs for progression.

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
1. **API Key:** Ensure `GEMINI_API_KEY` is set in your environment for Vision API access.
2. **Dependencies:** Install validation dependencies:
   ```bash
   pip install pillow rich
   npm install --prefix frontend
   ```
3. **MCP Configuration:** Add the vision-scorer to your MCP settings if using an external server.

## Visual Curation Gates (HARD FAIL)
```json
{
  "density_gate": {"max": 0.4, "method": "proxy|screenshot"},
  "hero_slots_max": 3,
  "hierarchy_contrast": ">12:1",
  "whitespace_ratio": ">0.6",
  "curation_actions": true
}
```

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

## Scoring Rubric v3 (Max 100)
- **Density Gate (25):** `assets/total_surface < 0.4`
- **Hierarchy Gate (25):** hero elements maintain `>12:1` contrast and prominence
- **Noise Gate (20):** decorative elements `< 25%`
- **Token Gate (20):** `--sys-*` only (no hex)
- **Motion Gate (10):** spring usage `< 12` events/screen

## Output Contract
```json
{
  "overall_score": 92,
  "decision": "CURATE_AND_PACKAGE",
  "checks": {
    "density_gate": 23,
    "hierarchy_gate": 24,
    "noise_gate": 18,
    "token_gate": 19,
    "motion_gate": 8
  },
  "curation_fixes": {
    "disable_slots": 28,
    "hero_boost": ["headline", "cta"],
    "tsx_patches": []
  }
}
```

## Troubleshooting & Error Handling

### Fallback Route
The system operates on an automated **Cascading Fallback** model:
1. **Failure on Frontier Tier:** Automatically promote/demote task to the **Performance Tier** for immediate resolution.
2. **Stability Check:** If high-latency or consistency issues arise on current-gen models, revert to the **LTS Tier** for a stable baseline.
3. **Lifecycle Management:** Deprecated model versions MUST be migrated to their current-gen successors (e.g., `.0` to `.1` increments) within 7 days of General Availability.
4. **Total API Outage:** If all cloud vision models are unreachable, return `{"decision": "MANUAL_REVIEW", "error": "API_UNAVAILABLE"}` and fallback to deterministic local heuristic scripts.
5. **Deterministic Proxy Rule:** If cloud Vision API is unavailable, the system will attempt to run "proxy gates" from the TSX structure and return `CURATE_AND_PACKAGE` only if visual thresholds (density/ratio) fail high-confidence checks.

### Common Issues
- **Rate Limiting:** If quota is exceeded on primary, trigger fallback immediately or wait 60 seconds.
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
