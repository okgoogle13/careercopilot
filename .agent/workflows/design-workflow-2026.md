---
description: Unified Human + AI Design Workflow (2026 Best Practices)
---

# Design Workflow 2026

This workflow implements the "Iterative Chains" approach for AI-assisted UI/UX design, ensuring accessibility-by-default and machine-readable design intent.

## Step 1: Research & Briefing

1. Use the [design-brief.md](file:///Users/okgoogle13/Desktop/careercopilot/prompts/library/design-brief.md) template to turn raw insights into a structured brief.
2. **Human Check**: Review the brief for equity, inclusion, and strategic alignment.

## Step 2: Ideation & Flows

1. Use the [user-flows.md](file:///Users/okgoogle13/Desktop/careercopilot/prompts/library/user-flows.md) template to generate alternative journeys and edge cases.
2. **Human Check**: Select the most ethical and feasible flow.

## Step 3: Wireframing

1. Use the [wireframes-lowfi.md](file:///Users/okgoogle13/Desktop/careercopilot/prompts/library/wireframes-lowfi.md) template or the `wireframe-annotator` skill.
2. Ensure the output includes `<layout>`, `<tokens>`, and `<accessibility>` blocks.

## Step 3.5: Mockup Generation (Figma Dev Mode)

1. Feed wireframe to `ui-design-evaluator` or `m3-expressive-ui-evaluator`:
   - **Input**: Wireframe markdown (`<layout>`, `<tokens>`, `<accessibility>` blocks)
   - **Output**: Interactive HTML mockup + compliance score
   - **Gate**: Score must be ≥ 320/400

2. Push mockup to Figma via MCP:
   - Create frame in the [Career-Copilot Figma file](https://www.figma.com/design/OQizDLqM9Y3qitGXiabkAv/Career-Copilot)
   - Apply "Kerala Rage - Solidarity Mode" variable collection
   - Link to Code Connect declarations (`.figma.tsx` files)

3. Generate/update HiFi blueprint:
   - Output to `docs/design/hifi/{PageName}-hifi.md`
   - Include: layout regions, typography, color, spacing, motion, motif slots

4. For batch mockup generation via MCP, delegate to `task-router-mcp`:
   ```json
   {
     "task_id": "generate-mockup-{page-name}",
     "assigned_to": "ui-design-evaluator",
     "priority": "high",
     "inputs": {
       "wireframe_path": "docs/design/generated/wireframes/{page}-screen.md",
       "validation_threshold": 320,
       "output_figma": true
     }
   }
   ```

5. **Human Check**: Review mockup for visual coherence, editorial quality, and brand alignment.

## Step 4: UI Specification

1. Use the [ui-spec-hifi.md](file:///Users/okgoogle13/Desktop/careercopilot/prompts/library/ui-spec-hifi.md) template to translate wireframes into developer-ready specs.
2. Apply the [Asset Generation Prompting Strategy](file:///Users/okgoogle13/Desktop/careercopilot/Asset%20Generation%20Prompting%20Strategy.md) for refined visual assets.

## Step 5: Hero Asset Generation (Automated)

1. Generate hero compositions using the Gemini hero generator:
   ```bash
   npm run hero:generate -- <template-id> [context]
   ```
   Available templates (defined in `scripts/gemini-prompts/hero-composer.json`):
   - `deterministic-layered-hero` — Standard layered composition with manifest constraints
   - `cinematic-spiritual-hero` — Devotional/spiritual focal point (Shiva, mythic tone)
   - `resistance-hero-street` — Anti-colonial, urban, wheat-paste energy

2. The generator reads the asset manifest (`frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`), enforces layering rules (substrate → atmospheric → cultural/resistance/spiritual → typography → UI), and outputs a schema-valid JSON composition.

3. Validate and inject into the hero registry using the `hero-composition-injector` skill:
   - Checks ID uniqueness against `kr-solidarity.hero-registry.json`
   - Validates asset references exist in manifest
   - Updates registry metadata and `last_updated` timestamp

4. For batch generation via MCP, delegate to `task-router-mcp`:
   ```json
   {
     "task_id": "generate-hero-defiance",
     "assigned_to": "gemini-hero-generator",
     "priority": "medium",
     "inputs": {
       "template_id": "deterministic-layered-hero",
       "context": "Generate for emotional register: 'Defiance'. Cinematic asymmetry.",
       "validate_after": true
     }
   }
   ```

5. **Human Check**: Review generated composition for cultural sensitivity, visual coherence, and brand alignment.

## Step 6: Accessibility Audit

1. Prompt the AI for a heuristic review:
   > "Act as an accessibility specialist. Check this layout against WCAG 2.2 AA. List issues by severity and propose concrete fixes."
2. Document fixes in the `<accessibility>` block of the design spec.

## Step 7: Handoff

1. Export design tokens and component specs to the development team.
2. Include the structured XML blocks in the handoff documentation for automated verification.
3. Ensure hero registry is up-to-date (`kr-solidarity.hero-registry.json`) with all generated compositions.