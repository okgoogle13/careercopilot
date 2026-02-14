---
name: figma-to-page
description: Generates React code for a full page based on pasted Figma 'Inspect'
  details. Uses the page scaffolder.
metadata:
  legacy_frontmatter:
    version: 1.0.0
    tags: []
---

## Purpose

Generates React code (TSX/CSS) for a full page based on pasted Figma 'Inspect' details, utilizing the standard page scaffolder for structure.

## When to Use

- When migrating high-fidelity designs from Figma to the React codebase.
- When needing to rapidly prototype pages from existing design specifications.
- When ensuring structural consistency between design and implementation.

## Process

1. **Page Identification**: Acquire the page name in `PascalCase`.
2. **Input Ingestion**: Collect Figma 'Inspect' details for the entire page.
3. **Scaffolding**: Run the `.claude/skills/react-page-scaffolder/scripts/create-page.sh` script.
4. **Code Generation**: Transform Figma specs into TSX and CSS modules.
5. **Finalization**: Write files, overwrite templates, and run `yarn lint:fix`.
