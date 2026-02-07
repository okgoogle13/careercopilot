---
name: wireframe-annotator
description: Generate annotated ASCII wireframes based on the "Annotated Wireframe Protocol". Bridges the gap between high-level specs and developer-ready implementation guidance.
tags: [wireframing, design, spec-generation, design-to-code]
version: 2.0.0
---

# Wireframe Annotator Skill

## Purpose

This skill consumes the **Annotated Wireframe Protocol** (produced by the design-system-doc-generator) and outputs detailed, developer-ready wireframe visualizations. It translates abstract design tokens into concrete layout diagrams.

## Process

1. **Parse Protocol**: Read Annotated Wireframe Protocol and Orchestration Tokens
2. **Generate ASCII Layout**: Create visual text representation using `[ ]`, `| |`, `+--+` notation
3. **Add Token Annotations**: Map typography, color, and spacing tokens to elements
4. **Accessibility Audit**: define focus order, keyboard navigation patterns, and ARIA landmarks
5. **Define State Behaviors**: Document Empty, Loading, and Error states
6. **Specify Asset Placement**: Define coordinates and z-index for visual assets
7. **Output Wireframe**: Generate developer-ready wireframe markdown using XML-structured blocks

## When to Use

- After design system documentation is complete
- Before component spec generation
- When translating design specs into developer-ready layouts
- When defining screen structure and token mapping

## Inputs

- **Annotated Wireframe Protocol**: The source of truth for screen logic and tokens.
- **Orchestration Tokens**: The definition of available design variables.

## Output Structure per Screen

You MUST wrap the output in structured XML tags for machine-readability:

1. **<layout>**:
   - ASCII visual text representation using `[ ]`, `| |`, `+--+`.
2. **<tokens>**:
   - Mapping of typography, color, and spacing tokens.
3. **<accessibility>**:
   - Focus order, keyboard navigation, and ARIA landmarks.
4. **<states>**:
   - Descriptions of Empty, Loading, and Error states.
5. **<assets>**:
   - Coordinates and z-index rules for visual assets.

## Usage

"Generate annotated wireframe for [Screen Name] using the [Protocol File]"

## Integration

- **Upstream**: Consumes output from `design-system-doc-generator`.
- **Downstream**: Feeds into `component-spec-generator` or direct frontend implementation agents.
