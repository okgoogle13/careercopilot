# Design Workflow Automation Guide

## Overview

This guide explains how to use the automated design workflow to transform high-level design briefs into production-ready assets and code.

The workflow leverages a 5-step process:
This guide explains how to use the **Two-Stage Design Workflow** to transform high-level design briefs into production-ready assets and code. The workflow separates structural definition from visual implementation, allowing for review and refinement.

### Stages
1.  **Structure (Lo-Fi)**: Validates layout, hierarchy, and API contract. Generates Protocols, Wireframes, and Specs.
2.  **Visuals (Hi-Fi)**: Applies visual design and implements code. Generates HTML Mockups and React Components.

## Usage

### Prerequisites
- Python 3.8+
- Access to `docs/design/KERALA_RAGE_BRAND_BRIEF.md`

### Running the Automation Script

    "Build the LoginCard component based on the specs in src/components/LoginCard/README.md"
    ```

## Reference Patterns

When generating new components or refactoring existing ones, use these "Strong" (Score > 360/400) components as canonical examples of Kerala Rage / Solidarity Mode morphology, motion, and accessibility:

1.  **[ManifestoCard](file:///Users/okgoogle13/Projects/careercopilot/src/components/ManifestoCard/index.tsx)** (380/400): Exemplar for torn edges (`clip-path-tear`), viscous shadows, and Solidarity Red accents.
2.  **[ProfileHeader](file:///Users/okgoogle13/Projects/careercopilot/src/components/ProfileHeader/index.tsx)** (374/400): Exemplar for high-contrast typography scaling and identity-first land acknowledgments.
3.  **[SkillBreakdownCard](file:///Users/okgoogle13/Projects/careercopilot/src/components/SkillBreakdownCard/index.tsx)** (368/400): Exemplar for blueprint watermarks, radial score gauges, and Ink Gold radiance.

*Future components should match the patterns, token usage, and motion physics established in these files.*

## Fidelity Levels

-   **Lo-Fi (ASCII)**: Best for validating layout, hierarchy, and content structure without visual distraction.
-   **Hi-Fi (HTML)**: Best for validating color, typography, motion physics, and emotional resonance.

## Troubleshooting

-   **Brief Not Found**: Ensure your design brief path is correct.
-   **Missing Directories**: The script auto-creates `docs/design/generated`, but ensure you have write permissions.
