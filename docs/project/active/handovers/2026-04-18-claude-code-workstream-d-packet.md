# Claude Code Cleanup Packet: Workstream D

**Date:** 2026-04-18
**Owner:** Claude Code
**Execution venue:** External Claude Code session
**Coordinator:** Codex
**Batch:** Batch 2, mechanical cleanup

**Goal:** Remove bounded banned-token residue from shared shell files without changing route exposure, chrome ownership, or layout behavior.

## Writable files

- `frontend/src/layouts/shared/Footer.tsx`
- `frontend/src/layouts/shared/Sidebar.tsx`

## Read-only context

- `docs/project/active/handovers/2026-04-18-token-translation-table.md`
- `docs/design/01_CANON.md`
- `docs/design/02_SYSTEM.md`

## Approved mappings for this workstream

- `var(--sys-color-outline-variant)` -> `var(--kr-color-concrete-grey-steps-0)`
- `border-outline-variant` -> `border-[var(--kr-color-concrete-grey-steps-0)]`
- `var(--sys-color-charcoalBackground-base)` -> `var(--kr-color-charcoal-background-base)`
- `var(--sys-color-worker-ash-base)` -> `var(--kr-color-worker-ash-base)`
- `var(--sys-color-inkGold-base)` -> `var(--kr-color-ink-gold-base)`

## Ambiguous or out-of-scope in this packet

- `var(--sys-color-surface-container-low, #1D1B18)`
- `var(--sys-color-nav-active-container)`
- `var(--sys-color-on-nav-active)`
- `var(--sys-shape-blockRiot01)`
- `var(--sys-shape-blockRiot02)`

If touching those values is required to complete a clean, local banned-token removal on the same line, report it instead of guessing.

## Task

Apply deterministic cleanup only in the listed writable files:
- remove the banned `outline-variant` token usage
- replace directly mappable `--sys-color-*` references only where the KR replacement is already approved above
- preserve shell behavior, query-string preservation, and shared chrome structure

## Forbidden actions

- Do not edit files outside the listed writable set.
- Do not rename exports, route names, component names, or public interfaces.
- Do not change navigation behavior, query-param preservation, or route exposure.
- Do not redesign the sidebar or footer.
- Do not introduce new raw hex values.
- Do not introduce new `--sys-*`, donor surface vars, or archive variable families.
- Do not make a best-guess replacement for ambiguous navigation or active-state tokens.
- If a line requires wider shell-token surgery, stop and report it.

## Return exactly

### 1. Changed Files
- one bullet per file

### 2. Per-File Summary
- one short sentence per file describing the banned-token cleanup made

### 3. Ambiguities
- any token, line, or file that could not be changed safely

### 4. Out-of-Scope Findings
- optional, only if a nearby issue was seen but not changed

## Ready-to-Paste Prompt

```text
Apply deterministic cleanup only in this writable file set:
- frontend/src/layouts/shared/Footer.tsx
- frontend/src/layouts/shared/Sidebar.tsx

Goal:
Remove bounded banned-token residue from shared shell files without changing route exposure, chrome ownership, or layout behavior.

Read-only context:
- docs/project/active/handovers/2026-04-18-token-translation-table.md
- docs/design/01_CANON.md
- docs/design/02_SYSTEM.md

Approved mappings for this workstream:
- var(--sys-color-outline-variant) -> var(--kr-color-concrete-grey-steps-0)
- border-outline-variant -> border-[var(--kr-color-concrete-grey-steps-0)]
- var(--sys-color-charcoalBackground-base) -> var(--kr-color-charcoal-background-base)
- var(--sys-color-worker-ash-base) -> var(--kr-color-worker-ash-base)
- var(--sys-color-inkGold-base) -> var(--kr-color-ink-gold-base)

Ambiguous or out-of-scope:
- var(--sys-color-surface-container-low, #1D1B18)
- var(--sys-color-nav-active-container)
- var(--sys-color-on-nav-active)
- var(--sys-shape-blockRiot01)
- var(--sys-shape-blockRiot02)

Task:
- remove the banned outline-variant token usage
- replace directly mappable --sys-color-* references only where the KR replacement is already approved above
- preserve shell behavior, query-string preservation, and shared chrome structure

Forbidden actions:
- Do not edit files outside the listed writable set.
- Do not rename exports, route names, component names, or public interfaces.
- Do not change navigation behavior, query-param preservation, or route exposure.
- Do not redesign the sidebar or footer.
- Do not introduce new raw hex values.
- Do not introduce new --sys-*, donor surface vars, or archive variable families.
- Do not make a best-guess replacement for ambiguous navigation or active-state tokens.
- If a line requires wider shell-token surgery, stop and report it.

Return exactly:
1. Changed Files
2. Per-File Summary
3. Ambiguities
4. Out-of-Scope Findings
```
