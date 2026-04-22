# DOC-011: System Integration & Shared Source of Truth

## Overview

This document defines how the kerala-rage kr-solidarity Design System acts as a **Shared Source of Truth (SSoT)** for cross-platform agents and automated tools.

## The Triad of Truth

To ensure perfect alignment between design vision, AI generation, and frontend implementation, three core documents work in unison:

### 1. The Design Principles ([kerala-rage-design-principles.md](file:///Users/okgoogle13/Projects/careercopilot/docs/design/kerala-rage-design-principles.md))

- **Role:** Aesthetic Governance.
- **Used by:** Gemini (Self-Correction) and DALL-E (via Design Flash Sidekick).
- **Contents:** Translucency bands, color policies, motif philosophies (Anatomical vs Geometric).

### 2. The Design Tokens ([01-tokens.md](file:///Users/okgoogle13/Projects/careercopilot/docs/design/01-tokens.md))

- **Role:** Technical Implementation.
- **Used by:** Gemini (Implementation Engine), Frontend Developers, and kr-dark Mode UI controllers.
- **Contents:** Color Hectors, Border Radii, Motion Curves, and Grid/Annotation System specifications.

### 3. The Asset Manifest ([kr-solidarity-manifest.json](../../frontend/public/assets/kr-solidarity-manifest.json))

- **Role:** Production & Automation.
- **Used by:** Asset pipelines, validation scripts, and dynamic UI loading logic.
- **Contents:** File paths, `interactive_grid_profile` (snap points), and prioritized asset status.

---

## Agentic Workflows

### For Image Generation (via Design Flash Sidekick MCP)

1. **Reference** the [Universal System Instructions](file:///Users/okgoogle13/Projects/careercopilot/Asset%20Generation%20Prompting%20Strategy.md#system-instructions).
2. **Execute** generation using the Design Flash Sidekick toolset.
3. **Audit** results against the [Immutable Laws](file:///Users/okgoogle13/Projects/careercopilot/Asset%20Generation%20Prompting%20Strategy.md#aesthetic-foundation-the-five-immutable-laws).

### For UI Implementation (Gemini-Lead)

1. **Query** the [Manifest](../../frontend/public/assets/kr-solidarity-manifest.json) independently.
2. **Implement** changes using the repo-aware code modification tools.
3. **Verify** compliance using the technical tokens in `01-tokens.md`.

---

## Maintenance Policy

- **Machine Readability First:** Always update the JSON manifest when adding or moving assets.
- **Version Parity:** Changes to the `01-tokens.md` should trigger a manifest version increment.
- **Explicit Links:** All design documents must use absolute file-system-safe links for local IDE/Agent navigation.
