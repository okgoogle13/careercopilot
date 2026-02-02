# Asset Transformation Workflow

## Overview

This workflow defines the process of moving an image from generation (AI Studio) to production-ready asset integration.

## 1. Generation Phase

- **Tool**: Gemini 2.1 Pro / Design Flash Sidekick MCP.
- **Rules**:
  - Apply Universal System Instructions (Immutable Laws).
  - Ensure background is `#1A1714` (The Void).
  - Maximize geographic authenticity (Australian endemic).

## 2. Transformation Process

Assets rarely come out perfect. Manual or semi-automated transformation steps include:

### A. Background Flattening

- Use a threshold to ensure background pixels are exactly `#1A1714` or transparent.
- Preserve anti-aliased edges for watercolor/biological specimens.

### B. Color Grading

- Enforce jewel-tone saturation (crimson, gold, emerald).
- Desaturate any accidental "naturalistic" blue feathers or green leaves to align with the Northcote palette (Slate-Grey, Eucalypt Smoke).

### C. Transparency Assignment

- **Opaque**: Subject core.
- **Translucency**: Structural details (wings, spines).
- **Diaphanous**: Annotations, grids.

## 3. Validation Scoring (Compliance Score)

Every asset must be scored against the immutable laws before entering the manifest.

| Score Range | Designation      | Action                                   |
| :---------- | :--------------- | :--------------------------------------- |
| **95-100**  | Museum Quality   | Direct integration.                      |
| **85-94**   | Production Ready | Integration with minor refinement notes. |
| **< 85**    | Rejected         | Regenerate or heavily transform.         |

## 4. Manifest Registration

Update `northcote-curio-manifest.json` with entry:

- ID, Category, Motif Type, Translucency Band, Compliance Score.
