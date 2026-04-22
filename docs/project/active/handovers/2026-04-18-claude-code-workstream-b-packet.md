# Claude Code Cleanup Packet: Workstream B

**Date:** 2026-04-18
**Owner:** Claude Code
**Execution venue:** External Claude Code session
**Coordinator:** Codex
**Batch:** Batch 2, mechanical cleanup

**Goal:** Reduce deterministic chart-color residue in `Analysis.tsx` without changing rendering behavior, route exposure, or component structure.

## Writable files

- `frontend/src/features/analysis/Analysis.tsx`

## Read-only context

- `docs/project/active/handovers/2026-04-18-token-translation-table.md`
- `docs/design/01_CANON.md`
- `docs/design/02_SYSTEM.md`

## Approved mappings for this workstream

- `#48B3DA` -> KR protest metal blue
- `#6BE5A8` -> KR activist smoke green steps 4
- `#E8A96F` -> KR solidarity smoke orange steps 4
- `#FF9490` -> KR charcoal red steps 4
- `#1A1A1A` -> KR charcoal background steps 1
- `#D4CEC3` -> KR paper white steps 1
- `#444444` -> KR charcoal background steps 6
- `#DAF674` -> KR ink gold base

Use the exact canonical names from `2026-04-18-token-translation-table.md` if you need to restate them.

## Task

Apply deterministic cleanup only in the listed writable file:
- replace repeated inline hex literals with the existing `CHART_COLORS` keys where that preserves behavior
- replace repeated inline literals like `'#444444'` and `'#DAF674'` with `CHART_COLORS.grid` and `CHART_COLORS.heroHighlight` where safe
- keep the chart-specific rendering behavior intact

## Special constraint

`Analysis.tsx` documents that Recharts color paths currently require resolved hex values. Do not replace the top-level chart constants with CSS vars, and do not create a new global token-hex registry in this task.

This packet is for deterministic residue cleanup, not architectural refactoring.

## Forbidden actions

- Do not edit files outside the listed writable set.
- Do not rename exports, component names, route names, or public interfaces.
- Do not change route exposure, navigation structure, or runtime behavior.
- Do not replace chart constants with `var(--kr-...)` in Recharts config.
- Do not introduce new raw hex values.
- Do not introduce `--sys-*`, `--surface-*`, `--primary-*`, `--on-surface*`, or archive donor variables.
- Do not touch unrelated banned-token issues in this file.
- If a cleanup requires a wider token-source decision, stop and report it.

## Return exactly

### 1. Changed Files
- one bullet per file

### 2. Per-File Summary
- one short sentence describing the deterministic cleanup made

### 3. Unresolved Drift
- any remaining lines in this file that still need architectural approval or a different workstream

### 4. Ambiguities
- anything that could not be changed safely inside the packet scope

## Ready-to-Paste Prompt

```text
Apply deterministic cleanup only in this writable file:
- frontend/src/features/analysis/Analysis.tsx

Goal:
Reduce deterministic chart-color residue in Analysis.tsx without changing rendering behavior, route exposure, or component structure.

Read-only context:
- docs/project/active/handovers/2026-04-18-token-translation-table.md
- docs/design/01_CANON.md
- docs/design/02_SYSTEM.md

Approved mappings in this file:
- #48B3DA -> KR protest metal blue
- #6BE5A8 -> KR activist smoke green steps 4
- #E8A96F -> KR solidarity smoke orange steps 4
- #FF9490 -> KR charcoal red steps 4
- #1A1A1A -> KR charcoal background steps 1
- #D4CEC3 -> KR paper white steps 1
- #444444 -> KR charcoal background steps 6
- #DAF674 -> KR ink gold base

Task:
- replace repeated inline hex literals with the existing CHART_COLORS keys where that preserves behavior
- replace repeated inline literals like '#444444' and '#DAF674' with CHART_COLORS.grid and CHART_COLORS.heroHighlight where safe
- keep the chart-specific rendering behavior intact

Special constraint:
- Analysis.tsx documents that Recharts color paths currently require resolved hex values
- do not replace the top-level chart constants with CSS vars
- do not create a new global token-hex registry in this task

Forbidden actions:
- Do not edit files outside the listed writable set.
- Do not rename exports, component names, route names, or public interfaces.
- Do not change route exposure, navigation structure, or runtime behavior.
- Do not replace chart constants with var(--kr-...) in Recharts config.
- Do not introduce new raw hex values.
- Do not introduce --sys-*, --surface-*, --primary-*, --on-surface*, or archive donor variables.
- Do not touch unrelated banned-token issues in this file.
- If a cleanup requires a wider token-source decision, stop and report it.

Return exactly:
1. Changed Files
2. Per-File Summary
3. Unresolved Drift
4. Ambiguities
```
