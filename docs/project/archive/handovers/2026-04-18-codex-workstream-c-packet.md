# Codex Runtime-Sensitive Packet: Workstream C

**Date:** 2026-04-18
**Owner:** Codex subagent
**Execution venue:** This workspace via Codex subagent
**Coordinator:** Codex
**Batch:** Batch 2, mechanical cleanup

**Goal:** Clean up hardcoded hex and token residue in `OpportunitiesDiscovery.tsx` without changing route behavior, layout structure, or screen-pairing intent.

## Writable files

- `frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx`

## Read-only context

- `docs/project/active/handovers/2026-04-18-token-translation-table.md`
- `docs/design/01_CANON.md`
- `docs/design/02_SYSTEM.md`
- `docs/design/screen-map.json`
- `docs/project/active/figma-sync-order.json`
- `frontend/src/screens/06_opportunities/mapping.json`
- `frontend/src/screens/06_opportunities/06_opportunities.wireframe.xml`

## Approved mappings for this workstream

- `#1e2a2e` -> treat as ambiguous unless clearly background-only; report if encountered in mixed-use gradients
- `#48b3da` -> `var(--kr-color-protest-metal-blue-base)`
- `#2a1a18` -> `var(--kr-color-charcoal-background-base)`
- `#f14714` -> `var(--kr-color-solidarity-red-base)`
- `#daf674` -> `var(--kr-color-ink-gold-base)`
- `#48da8b` -> `var(--kr-color-kr-activist-smoke-green-base)`
- `#f6e748` -> `var(--kr-color-stencil-yellow-base)`
- `#323232` -> `var(--kr-color-charcoal-background-steps-4)`
- `#daf6b3` -> `var(--kr-color-worker-ash-base)`
- `#8daf75` -> `var(--kr-color-worker-ash-steps-1)`
- `#1a1a1a` -> `var(--kr-color-charcoal-background-steps-1)`
- `#2a2a2a` -> `var(--kr-color-charcoal-background-steps-3)`
- `#627a4f` -> `var(--kr-color-worker-ash-steps-0)`
- `#242424` -> `var(--kr-color-charcoal-background-steps-2)`
- `#da8b48` -> `var(--kr-color-solidarity-smoke-orange-base)`
- `#0f0f0f` -> `var(--kr-color-charcoal-background-steps-0)`

## Constraints

- Do not edit files outside the listed writable set.
- Do not change route exposure or screen identity.
- Do not alter `mapping.json`, wireframe XML, `App.tsx`, or `route-registry.ts`.
- Do not redesign the screen.
- Preserve behavior and component structure unless a small local extraction is required to replace color literals safely.
- Do not introduce `--sys-*`, donor surface vars, or new raw hex values.
- If a color mapping is semantically ambiguous, leave it unchanged and report it.

## Required verification

Run after changes:

```bash
python3 scripts/design-validation/check-design-drift.py | rg "OpportunitiesDiscovery|hardcoded hex color|banned legacy token" -n
(cd frontend && yarn type-check)
node frontend/scripts/validate-governance-artifacts.mjs
```

Expected:
- no new drift violations introduced by this file
- `yarn type-check` passes
- governance artifact validation passes

## Required return format

### 1. Status
- `DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, or `BLOCKED`

### 2. Changed File Summary
- short description of replacements made

### 3. Verification
- commands run
- pass/fail result

### 4. Ambiguities or Concerns
- any color mappings that should be reviewed before wider rollout

## Ready-to-Paste Prompt

```text
Workstream C. Runtime-sensitive cleanup.

Writable file:
- frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx

Read-only context:
- docs/project/active/handovers/2026-04-18-token-translation-table.md
- docs/design/01_CANON.md
- docs/design/02_SYSTEM.md
- docs/design/screen-map.json
- docs/project/active/figma-sync-order.json
- frontend/src/screens/06_opportunities/mapping.json
- frontend/src/screens/06_opportunities/06_opportunities.wireframe.xml

Goal:
Clean up hardcoded hex and token residue in OpportunitiesDiscovery.tsx without changing route behavior, layout structure, or screen-pairing intent.

Approved mappings:
- #48b3da -> var(--kr-color-protest-metal-blue-base)
- #2a1a18 -> var(--kr-color-charcoal-background-base)
- #f14714 -> var(--kr-color-solidarity-red-base)
- #daf674 -> var(--kr-color-ink-gold-base)
- #48da8b -> var(--kr-color-kr-activist-smoke-green-base)
- #f6e748 -> var(--kr-color-stencil-yellow-base)
- #323232 -> var(--kr-color-charcoal-background-steps-4)
- #daf6b3 -> var(--kr-color-worker-ash-base)
- #8daf75 -> var(--kr-color-worker-ash-steps-1)
- #1a1a1a -> var(--kr-color-charcoal-background-steps-1)
- #2a2a2a -> var(--kr-color-charcoal-background-steps-3)
- #627a4f -> var(--kr-color-worker-ash-steps-0)
- #242424 -> var(--kr-color-charcoal-background-steps-2)
- #da8b48 -> var(--kr-color-solidarity-smoke-orange-base)
- #0f0f0f -> var(--kr-color-charcoal-background-steps-0)

Ambiguous:
- #1e2a2e: report instead of guessing unless its role is clearly a background-only surface

Constraints:
- Do not edit files outside the listed writable set.
- Do not change route exposure or screen identity.
- Do not alter mapping.json, wireframe XML, App.tsx, or route-registry.ts.
- Do not redesign the screen.
- Preserve behavior and component structure unless a small local extraction is required to replace color literals safely.
- Do not introduce --sys-*, donor surface vars, or new raw hex values.
- If a color mapping is semantically ambiguous, leave it unchanged and report it.

Run verification:
- python3 scripts/design-validation/check-design-drift.py | rg "OpportunitiesDiscovery|hardcoded hex color|banned legacy token" -n
- (cd frontend && yarn type-check)
- node frontend/scripts/validate-governance-artifacts.mjs

Return exactly:
1. Status
2. Changed File Summary
3. Verification
4. Ambiguities or Concerns
```
