# Kerala Rage Asset Cataloger

## Scope

This folder contains the KR Solidarity asset cataloging skill, references, and helper scripts.

## Current Status

- Mode support: `kerala-rage-solidarity` only.
- Policy: Zero-Flora lockdown enforced in guidance.
- Output model: deterministic metadata catalog (not autonomous visual triage).

## Contents

- `SKILL.md`: canonical skill instructions.
- `references/`: mode compliance, gap targets, inventory notes.
- `scripts/`: helper scripts for cataloging, PNG standardization, packaging, and large-batch routing payloads.
- `INTEGRATION.md`: integration flow for manual curation pipeline.
- `MANIFEST-WORKFLOW.md`: manifest-driven operational workflow.

## Notes

- Keep destructive file operations in explicit human-reviewed steps.
- Keep all updates aligned with `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`.
