---
description: Unified Human + AI Design Workflow (2026 Best Practices)
---

# Design Workflow 2026

This workflow implements the "Iterative Chains" approach for AI-assisted UI/UX design, ensuring accessibility-by-default and machine-readable design intent.

## Step 1: Research & Briefing

1. Use the [design-brief.md](file:///Users/okgoogle13/Projects/careercopilot/prompts/library/design-brief.md) template to turn raw insights into a structured brief.
2. **Human Check**: Review the brief for equity, inclusion, and strategic alignment.

## Step 2: Ideation & Flows

1. Use the [user-flows.md](file:///Users/okgoogle13/Projects/careercopilot/prompts/library/user-flows.md) template to generate alternative journeys and edge cases.
2. **Human Check**: Select the most ethical and feasible flow.

## Step 3: Wireframing

1. Use the [wireframes-lowfi.md](../../prompts/library/wireframes-lowfi.md) template or the `wireframe-annotator` skill.
2. Ensure the output includes `<layout>`, `<tokens>`, and `<accessibility>` blocks.

## Step 4: UI Specification

1. Use the [ui-spec-hifi.md](file:///Users/okgoogle13/Projects/careercopilot/prompts/library/ui-spec-hifi.md) template to translate wireframes into developer-ready specs.
2. Apply the [Asset Generation Prompting Strategy](file:///Users/okgoogle13/Projects/careercopilot/Asset%20Generation%20Prompting%20Strategy.md) for refined visual assets.

## Step 5: Accessibility Audit

1. Prompt the AI for a heuristic review:
   > "Act as an accessibility specialist. Check this layout against WCAG 2.2 AA. List issues by severity and propose concrete fixes."
2. Document fixes in the `<accessibility>` block of the design spec.

## Step 6: Handoff

1. Export design tokens and component specs to the development team.
2. Include the structured XML blocks in the handoff documentation for automated verification.