---
name: figma-to-component
description: "Generates React code for a component based on pasted Figma 'Inspect' details. Uses the component scaffolder."
---
# Figma to Component Workflow

1.  Ask for the component name in `PascalCase` (e.g., `FigmaButton`).
2.  Ask for the parent directory (e.g., `src/components/Figma`).
3.  Ask the user to paste all details from the Figma 'Inspect' panel (CSS, layout, structure, properties).
4.  **Execute scaffolder:**
    * Run `chmod +x .claude/skills/react-component-scaffolder/scripts/create-component.sh`
    * Run `.claude/skills/react-component-scaffolder/scripts/create-component.sh {{PARENT_DIR}} {{COMPONENT_NAME}}`
    * Report the output (the new file paths).
5.  **Generate Code:**
    * Read the user-pasted Figma details.
    * Generate the TSX code (with props) for `{{PARENT_DIR}}/{{COMPONENT_NAME}}/{{COMPONENT_NAME}}.tsx`.
    * Generate the corresponding CSS for `{{PARENT_DIR}}/{{COMPONENT_NAME}}/{{COMPONENT_NAME}}.module.css`.
6.  **Write Files:**
    * Write the new TSX content, overwriting the template.
    * Write the new CSS content, overwriting the template.
7.  **Lint:** Run `yarn lint:fix {{PARENT_DIR}}/{{COMPONENT_NAME}}` to clean up the new files.
8.  Report that the component has been created and populated from Figma details.
