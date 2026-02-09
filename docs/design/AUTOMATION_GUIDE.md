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

## Fidelity Levels

-   **Lo-Fi (ASCII)**: Best for validating layout, hierarchy, and content structure without visual distraction.
-   **Hi-Fi (HTML)**: Best for validating color, typography, motion physics, and emotional resonance.

## Troubleshooting

-   **Brief Not Found**: Ensure your design brief path is correct.
-   **Missing Directories**: The script auto-creates `docs/design/generated`, but ensure you have write permissions.
