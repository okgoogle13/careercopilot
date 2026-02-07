---
name: storybook-scaffolder
description: "Generates a Storybook story file (*.stories.tsx) with M3 design token imports and interactive variant stories. Use when documenting React components for development and QA testing."
version: 2.0.0
tags: []
---

## Purpose

Generates a Storybook story file (\*.stories.tsx) with M3 design token imports and interactive variant stories for React components.

## When to Use

- When documenting new or existing React components.
- When creating interactive playgrounds for development and QA testing.
- When ensuring design tokens are correctly imported in the Storybook environment.

## Process

1. **Identify Component**: Get the absolute path to the target React component.
2. **Generate Story**: Use the standard template to create the `.stories.tsx` file.
3. **Inject Tokens**: Prepend `import 'src/styles/design-tokens.css';` to the top of the file.
4. **Verify**: Ensure the story renders correctly in the Storybook UI.
