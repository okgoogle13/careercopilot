---
name: design-system-doc-generator
description: Framework for generating machine-readable design documentation that enables seamless AI-orchestrated frontend development. Standardizes the bridge between design intent and automated code generation.
tags: [design-system, documentation, ai-orchestration, low-code, design-to-code]
version: 2.0.0
---

# AI Design-to-Code Orchestrator

## Purpose

This skill defines the standard for "AI-Orchestrated Design Documentation." It ensures that design decisions are documented not just for humans, but as high-context instruction sets (specs) that allow other AI agents to autonomously build and verify UI code.

## Core Artifact Standards

### 1. The Design Identity Brief

Defines the "Soul" and "Rules" of the project.

- **Persona & Context**: Who is this for? What is the environment?
- **Core Directives**: Non-negotiable principles (e.g., "Minimalist", "High-Contrast").
- **Anti-Slop Protocol**: Explicit bans on common generic patterns (e.g., "No default Inter font", "No generic 8px radius").

### 2. Orchestration Tokens (The Source of Truth)

A machine-readable bridge between style and code.

- **Identity Tokens**: Semantic naming for color, type, and spacing.
- **Motion Physics**: Tokenized easing curves and durations for consistent animation.
- **Asset Manifest**: Catalog of available visual assets with IDs and usage rules.

### 3. Annotated Wireframe Protocol

Step-by-step specifications optimized for Large Language Model (LLM) parsing.

- **Region-to-Token Mapping**: Every UI area linked to specific design tokens.
- **State Logic**: Explicit definitions for Empty, Loading, Error, and Success states.
- **Asset Integration**: Precise coordinates for visual asset placement (Z-index, parallax, etc.).

### 4. Emotion Tracing Matrix

A mapping of user journey psychological states to technical UI variables.

- **Journey Stage**: The specific point in the user flow.
- **Emotional Register**: The intended user feeling (e.g., "Confidence", "Urgency").
- **Technical Mapping**: Specific font-weights, contrast levels, and interaction speeds required to convey that feeling.

## Process (Formalization Phase)

1. **Ingest Research & Visuals (Steps 1 & 2)**: Analyze the `visual-intelligence-report.md` (filled via External AI) to extract raw intent and aesthetic data.
2. **Research Identity**: Synthesize the "Perplexity" goals into a Design Identity Brief.
3. **Standardize Tokens**: Convert "DALL-E" visual cues into Orchestration Tokens (JSON/CSS).
4. **Draft Wireframes**: Create annotated specifications for key journey screens.
5. **Bridge States**: Map journey emotions to technical settings in the Emotion Tracing Matrix.
6. **Orchestrate**: Provide the full documentation set to the Implementation Agent for frontend generation.

## When to Use

- **Step 3 (Formalization)**: After you have gathered research and mood boards from External AI.
- **Project Setup**: Before any frontend code is written.
- **Visual Pivot**: When a brand's aesthetic or voice changes.
- **Agent Handover**: Before delegating UI construction to a sub-agent.
