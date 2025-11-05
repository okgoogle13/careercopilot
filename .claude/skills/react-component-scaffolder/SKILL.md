---
name: react-component-scaffolder
description: "Scaffolds a new React component directory (with .tsx, .css, and index files) using a script. Use when asked to create a new component."
---
# React Component Scaffolder Workflow

1.  Ask for the component name in `PascalCase` (e.g., `MyButton`).
2.  Ask for the parent directory (e.g., `src/components/Common`).
3.  Make the script executable: `chmod +x .claude/skills/react-component-scaffolder/scripts/create-component.sh`
4.  Execute the script: `.claude/skills/react-component-scaffolder/scripts/create-component.sh {{PARENT_DIR}} {{COMPONENT_NAME}}`
5.  Report the full output of the script to the user.
