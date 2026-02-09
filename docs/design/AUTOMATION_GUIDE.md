# Design Workflow Automation Guide

## Overview

This guide explains how to use the automated design workflow to transform high-level design briefs into production-ready assets and code.

The workflow leverages a 5-step process:
1.  **Formalization**: Convert Design Brief -> Protocol
2.  **Wireframing (Lo-Fi)**: Protocol -> ASCII Wireframes
3.  **Visual Design (Hi-Fi)**: Wireframes -> HTML Mockups
4.  **Specification**: Mockups -> Component Specs
5.  **Implementation**: Specs -> React Code

## Usage

### Prerequisites
- Python 3.8+
- Access to `docs/design/KERALA_RAGE_BRAND_BRIEF.md`

### Running the Automation Script

The `automate_design_workflow.py` script orchestrates the first 3 steps (Formalization -> Mockup).

```bash
# Basic usage
python3 scripts/automate_design_workflow.py --component LoginCard

# Specify fidelity (lo-fi only)
python3 scripts/automate_design_workflow.py --component LoginCard --fidelity lo-fi

# Specify custom brief
python3 scripts/automate_design_workflow.py --component LoginCard --brief docs/design/CUSTOM_BRIEF.md
```

### Outputs

The script generates artifacts in `docs/design/generated/`:

-   `protocols/`: System protocols defining the rules.
-   `wireframes/`: ASCII wireframes for layout validation.
-   `mockups/`: High-fidelity HTML mockups for visual validation.

### Next Steps (Manual Handoff)

Once the artifacts are generated, proceed with the agent-assisted implementation:

1.  **Generate Specs**:
    ```bash
    # Feed the generated wireframe to the Component Spec Generator skill
    # (Agent Prompt Example)
    "Use component-spec-generator to create specs for LoginCard using docs/design/generated/wireframes/logincard.md"
    ```

2.  **Build Component**:
    ```bash
    # Feed the specs to the Component Builder skill
    # (Agent Prompt Example)
    "Build the LoginCard component based on the specs in src/components/LoginCard/README.md"
    ```

## Fidelity Levels

-   **Lo-Fi (ASCII)**: Best for validating layout, hierarchy, and content structure without visual distraction.
-   **Hi-Fi (HTML)**: Best for validating color, typography, motion physics, and emotional resonance.

## Troubleshooting

-   **Brief Not Found**: Ensure your design brief path is correct.
-   **Missing Directories**: The script auto-creates `docs/design/generated`, but ensure you have write permissions.
