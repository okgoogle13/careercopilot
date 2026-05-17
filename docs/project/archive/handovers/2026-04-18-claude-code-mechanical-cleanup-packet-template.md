# Claude Code Mechanical Cleanup Packet Template

**Date:** 2026-04-18
**Owner:** Claude Code
**Execution venue:** External Claude Code session
**Coordinator:** Codex
**Batch:** Batch 2, mechanical cleanup

## Purpose

Use this template to create bounded mechanical-cleanup packets for `Claude Code` after the token translation table is approved.

This template is only for deterministic transforms in disjoint file sets.

Do not use this template for:
- runtime authority conflicts
- route exposure changes
- Figma donor/runtime reconciliation
- architecture decisions
- ambiguous semantic mappings

Those stay with `Codex` or go to `Claude Code`.

## Packet Header

Fill these fields before handing the packet to Claude Code:

- **Workstream ID:** `A`, `B`, `C`, or `D`
- **Goal:** one sentence
- **Writable files:** exact paths only
- **Approved mappings source:** `docs/project/active/handovers/2026-04-18-token-translation-table.md`
- **Validation command(s):** exact commands Codex will run after reintegration

## Required Inputs

Every Claude Code packet must include:

1. Exact writable files
2. Exact goal
3. The subset of approved mappings relevant to those files
4. Explicit forbidden actions
5. Required return format

## Required Constraints

Copy these constraints into every packet:

- Do not edit files outside the listed writable set.
- Do not rename exports, component names, route names, or public interfaces.
- Do not change route exposure, navigation structure, or runtime behavior.
- Do not introduce new raw hex values.
- Do not introduce `--sys-*`, `--surface-*`, `--primary-*`, `--on-surface*`, or archive donor variables.
- Do not replace tokens unless the mapping is explicitly approved in the translation table.
- If a mapping is ambiguous, stop and report it instead of guessing.
- Preserve layout and behavior; this is cleanup, not redesign.

## Required Return Format

Require Claude Code to return exactly:

### 1. Changed Files
- one bullet per file

### 2. Per-File Summary
- one short sentence per file describing the deterministic replacements made

### 3. Ambiguities
- any line, token, or file that could not be changed safely

### 4. Out-of-Scope Findings
- optional, only if a nearby issue was seen but not changed

## Workstream Packet Template

```markdown
# Claude Code Cleanup Packet: Workstream <ID>

**Goal:** <one-sentence goal>

**Writable files:**
- <exact/path/one>
- <exact/path/two>

**Approved mappings source:**
- `docs/project/active/handovers/2026-04-18-token-translation-table.md`

**Approved mappings for this workstream:**
- `<source token or hex>` -> `<approved --kr-* target>`
- `<source token or hex>` -> `<approved --kr-* target>`

**Task:**
Apply deterministic cleanup only in the listed writable files:
- replace hardcoded hex values with approved `--kr-*` token references where explicitly mapped
- replace banned legacy token strings where explicitly mapped
- preserve behavior and layout

**Forbidden actions:**
- Do not edit files outside the listed writable set.
- Do not rename exports, component names, route names, or public interfaces.
- Do not change route exposure, navigation structure, or runtime behavior.
- Do not introduce new raw hex values.
- Do not introduce `--sys-*`, `--surface-*`, `--primary-*`, `--on-surface*`, or archive donor variables.
- Do not replace tokens unless the mapping is explicitly approved in the translation table.
- If a mapping is ambiguous, stop and report it instead of guessing.
- Preserve layout and behavior; this is cleanup, not redesign.

**Return exactly:**
1. Changed Files
2. Per-File Summary
3. Ambiguities
4. Out-of-Scope Findings
```

## Example Packet Skeleton

```markdown
# Claude Code Cleanup Packet: Workstream A

**Goal:** Replace donor-era hardcoded hex values in resume constants and landing files with approved KR semantic tokens.

**Writable files:**
- `frontend/src/config/resume-constants.ts`
- `frontend/src/features/landing/LandingPage.tsx`
- `frontend/src/features/landing/LandingPage.module.css`

**Approved mappings source:**
- `docs/project/active/handovers/2026-04-18-token-translation-table.md`

**Approved mappings for this workstream:**
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

**Task:**
Apply deterministic cleanup only in the listed writable files:
- replace hardcoded hex values with approved `--kr-*` token references where explicitly mapped
- preserve behavior and layout

**Forbidden actions:**
- Do not edit files outside the listed writable set.
- Do not rename exports, component names, route names, or public interfaces.
- Do not change route exposure, navigation structure, or runtime behavior.
- Do not introduce new raw hex values.
- Do not introduce `--sys-*`, `--surface-*`, `--primary-*`, `--on-surface*`, or archive donor variables.
- Do not replace tokens unless the mapping is explicitly approved in the translation table.
- If a mapping is ambiguous, stop and report it instead of guessing.
- Preserve layout and behavior; this is cleanup, not redesign.

**Return exactly:**
1. Changed Files
2. Per-File Summary
3. Ambiguities
4. Out-of-Scope Findings
```

## Reintegration Notes For Codex

After Claude Code returns a packet result:

1. Verify it only touched the allowed file set
2. Verify all replacements resolve to approved `--kr-*` targets
3. Reject any guessed mappings
4. Run the narrow validations:

```bash
python3 scripts/design-validation/check-design-drift.py
(cd frontend && yarn type-check)
node frontend/scripts/validate-governance-artifacts.mjs
```

5. Only then integrate the patch into the active batch
