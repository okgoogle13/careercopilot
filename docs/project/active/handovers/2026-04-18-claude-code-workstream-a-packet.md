# Claude Code Cleanup Packet: Workstream A

**Date:** 2026-04-18
**Owner:** Claude Code
**Execution venue:** External Claude Code session
**Coordinator:** Codex
**Batch:** Batch 2, mechanical cleanup

**Goal:** Replace donor-era hardcoded hex values in resume constants and landing files with approved KR semantic token references.

## Writable files

- `frontend/src/config/resume-constants.ts`
- `frontend/src/features/landing/LandingPage.tsx`
- `frontend/src/features/landing/LandingPage.module.css`

## Approved mappings source

- `docs/project/active/handovers/2026-04-18-token-translation-table.md`

## Approved mappings for this workstream

- `#1A1714` -> `var(--kr-color-charcoal-background-base)`
- `#A39B8F` -> `var(--kr-color-concrete-grey-base)`
- `#DAF6B3` -> `var(--kr-color-worker-ash-base)`
- `#F14714` -> `var(--kr-color-solidarity-red-base)`
- `#48B3DA` -> `var(--kr-color-protest-metal-blue-base)`
- `#DAF674` -> `var(--kr-color-ink-gold-base)`
- `#48DA8B` -> `var(--kr-color-kr-activist-smoke-green-base)`
- `#F6E748` -> `var(--kr-color-stencil-yellow-base)`
- `#DA8B48` -> `var(--kr-color-solidarity-smoke-orange-base)`
- `#F5F0E8` -> `var(--kr-color-paper-white-base)`
- `#D4CEC3` -> `var(--kr-color-paper-white-steps-1)`
- `#444444` -> `var(--kr-color-charcoal-background-steps-6)`
- `#050403` -> `var(--kr-color-asphalt-black-steps-0)`
- `#f0ead6` -> `var(--kr-color-paper-white-steps-1)`
- `#d4a84b` -> `var(--kr-color-solidarity-smoke-orange-steps-4)`
- `#c45c4b` -> `var(--kr-color-solidarity-red-steps-3)`
- `#e8c77a` -> `var(--kr-color-stencil-yellow-steps-4)`
- `#e6e1d6` -> `var(--kr-color-paper-white-steps-1)`

## Task

Apply deterministic cleanup only in the listed writable files:
- replace hardcoded hex values with approved `--kr-*` token references where explicitly mapped
- preserve behavior and layout
- keep existing exports and data structures intact

## Forbidden actions

- Do not edit files outside the listed writable set.
- Do not rename exports, component names, route names, or public interfaces.
- Do not change route exposure, navigation structure, or runtime behavior.
- Do not introduce new raw hex values.
- Do not introduce `--sys-*`, `--surface-*`, `--primary-*`, `--on-surface*`, or archive donor variables.
- Do not replace tokens unless the mapping is explicitly approved in the translation table.
- If a mapping is ambiguous, stop and report it instead of guessing.
- Preserve layout and behavior; this is cleanup, not redesign.

## Return exactly

### 1. Changed Files
- one bullet per file

### 2. Per-File Summary
- one short sentence per file describing the deterministic replacements made

### 3. Ambiguities
- any line, token, or file that could not be changed safely

### 4. Out-of-Scope Findings
- optional, only if a nearby issue was seen but not changed

## Ready-to-Paste Prompt

```text
Apply deterministic cleanup only in this writable file set:
- frontend/src/config/resume-constants.ts
- frontend/src/features/landing/LandingPage.tsx
- frontend/src/features/landing/LandingPage.module.css

Goal: replace donor-era hardcoded hex values with approved KR semantic token references while preserving behavior and layout.

Approved mappings source:
- docs/project/active/handovers/2026-04-18-token-translation-table.md

Approved mappings for this workstream:
- #1A1714 -> var(--kr-color-charcoal-background-base)
- #A39B8F -> var(--kr-color-concrete-grey-base)
- #DAF6B3 -> var(--kr-color-worker-ash-base)
- #F14714 -> var(--kr-color-solidarity-red-base)
- #48B3DA -> var(--kr-color-protest-metal-blue-base)
- #DAF674 -> var(--kr-color-ink-gold-base)
- #48DA8B -> var(--kr-color-kr-activist-smoke-green-base)
- #F6E748 -> var(--kr-color-stencil-yellow-base)
- #DA8B48 -> var(--kr-color-solidarity-smoke-orange-base)
- #F5F0E8 -> var(--kr-color-paper-white-base)
- #D4CEC3 -> var(--kr-color-paper-white-steps-1)
- #444444 -> var(--kr-color-charcoal-background-steps-6)
- #050403 -> var(--kr-color-asphalt-black-steps-0)
- #f0ead6 -> var(--kr-color-paper-white-steps-1)
- #d4a84b -> var(--kr-color-solidarity-smoke-orange-steps-4)
- #c45c4b -> var(--kr-color-solidarity-red-steps-3)
- #e8c77a -> var(--kr-color-stencil-yellow-steps-4)
- #e6e1d6 -> var(--kr-color-paper-white-steps-1)

Task:
- replace hardcoded hex values with approved `--kr-*` token references where explicitly mapped
- preserve behavior and layout
- keep existing exports and data structures intact

Forbidden actions:
- Do not edit files outside the listed writable set.
- Do not rename exports, component names, route names, or public interfaces.
- Do not change route exposure, navigation structure, or runtime behavior.
- Do not introduce new raw hex values.
- Do not introduce `--sys-*`, `--surface-*`, `--primary-*`, `--on-surface*`, or archive donor variables.
- Do not replace tokens unless the mapping is explicitly approved in the translation table.
- If a mapping is ambiguous, stop and report it instead of guessing.
- Preserve layout and behavior; this is cleanup, not redesign.

Return exactly:
1. Changed Files
2. Per-File Summary
3. Ambiguities
4. Out-of-Scope Findings
```
