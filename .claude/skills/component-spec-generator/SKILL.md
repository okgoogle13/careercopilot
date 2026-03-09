---
name: component-spec-generator
description: Transform wireframe markdown into detailed React component implementation
  specifications with TypeScript interfaces and test stubs.
metadata:
  legacy_frontmatter:
    tags:
    - react
    - typescript
    - testing
    - spec
    version: 1.0.0
---

# Component Spec Generator

## Purpose

Transforms wireframe markdown into detailed React component implementation specifications with TypeScript interfaces, state management requirements, accessibility specs, and test stubs.

## Process

1. **Parse Wireframe**: Read wireframe markdown from `wireframe-annotator`
2. **Generate TypeScript Interface**: Create complete props and types definition
3. **Define State Management**: Specify local vs global state requirements
4. **Accessibility Spec**: Define ARIA roles, labels, keyboard navigation
5. **Map Design Tokens**: Generate exact CSS-in-JS / Tailwind classes
6. **Create Test Stubs**: Generate Jest + React Testing Library test cases
7. **Output README**: Write `src/components/[name]/README.md`

## When to Use

- After wireframe annotation is complete
- Before implementing React components
- When defining component contracts
- When ensuring design token compliance

## Input

Wireframe markdown files from `wireframe-annotator`

## Output

`README.md` file in component directory (`src/components/[name]/README.md`)

## Content Generated

1. **TypeScript Interface**: complete props + types definition
2. **State Management**: local vs global state requirements
3. **Accessibility Spec**: ARIA roles, labels, keyboard navigation
4. **Design Token Mapping**: Exact CSS-in-JS / Tailwind classes
5. **Test Stubs**: Jest + React Testing Library test cases

## Usage

"Generate specs for [Component Name] based on [Wireframe File]"

## Validation

Checks token validity using `design-token-validator`.
If `design-token-validator` is not available, perform manual review against `TERMINOLOGY_GUIDE.md` or use `m3-expressive-ui-evaluator` scoring as a proxy for compliance.

## INPUT
- `raw_spec`: JSON array from scaffolder
- `tokens_path`: "frontend/src/design/tokens/tokens.json"

## ENHANCEMENTS REQUIRED
Each spec gains:
- `"motion": {"type": "spring", "stiffness": "--sys-motion-stiffness-hero"}`
- `"shapes": {"pebble_variance": ">0.2", "asymmetric": true}`
- `"typography": ["Fraunces 700+", "Work Sans", "JetBrains Mono"]`
