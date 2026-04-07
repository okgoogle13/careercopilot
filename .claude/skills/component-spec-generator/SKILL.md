---
name: component-spec-generator
description: Transform XML wireframes into detailed React component implementation
  specifications with TypeScript interfaces and test stubs, aligned to KR v6.1.
metadata:
  version: 6.1.0
  tags:
    - react
    - typescript
    - testing
    - spec
    - kerala-rage
    - m3-expressive
---

# Component Spec Generator (v6.1)

## Purpose

Transforms XML wireframes from `wireframe-annotator` into detailed React component implementation specifications. Bridges design intent to production-ready code contracts including v6.1 technical tokens.

## Process

1. **Parse XML Wireframe**: Extract `<element>` and `<orchestration>` nodes from `wireframe-annotator` output.
2. **Generate TypeScript Interface**: Define complete props, including `archetype` and `token` based variants.
3. **Map Design Tokens**:
   - Colors: `--sys-color-*-base`
   - Typography: `--sys-type-fontFamilies-*`
   - Shapes: Archetype-specific `--sys-shape-*`
   - Motion: Orchestration logic tokens (`--sys-logic-*`)
4. **State & Logic**: Specify local vs global state requirements per XML `<states>` block.
5. **Accessibility**: Define ARIA roles and landmarks from `<accessibility_overview>`.
6. **Test Scaffolding**: Generate Jest + React Testing Library test cases using `<testids>`.
7. **Production README**: Write `src/components/[name]/README.md`.

## When to Use

- After `wireframe-annotator` output is validated.
- Before implementing React components.
- When defining component contracts for parallel developers.

## Input

- `xml_wireframe`: Well-formed XML from `wireframe-annotator`.
- `tokens_path`: `frontend/src/design/tokens/tokens.json`.

## Output

`README.md` file in component directory (`src/components/[name]/README.md`).

## Content Structure

1. **Archetype Assignment**: Explicit Strike/March/Megaphone/Placard/Scaffold/Substrate role.
2. **TypeScript Interface**: `Props` and `Theme` definitions.
3. **Token Matrix**: Precise mapping of component elements to v6.1 tokens.
4. **Orchestration Logic**: Entry/Exit animations and async transition behaviors.
5. **Test Gates**: Required selectors and interaction assertions.

## Usage

"Generate specs for [Component Name] based on the wireframe for [Screen ID]"

## Constraints

- MUST align to `references/tokens.md`.
- MUST include `motion` and `shape` variances.
- MUST NOT use hardcoded hex or non-semantic Tailwind values.
- Verify tokens against `tokens.json`.
