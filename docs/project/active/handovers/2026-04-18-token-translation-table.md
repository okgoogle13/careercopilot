# Token Translation Table

**Date:** 2026-04-18
**Status:** Drafted in-repo baseline for delegated cleanup batches
**Coordinator:** Codex

This file is the current translation baseline for delegated cleanup work. It is intentionally scoped to the mappings already derived from repo-local canon and donor/reference inspection in this session.

Use this file for:
- mechanical `--sys-*` to `--kr-*` cleanup where the mapping is already clear
- archive donor variable translation where the semantic target is already stable
- identifying cases that must not be migrated mechanically

Do not use this file as permission to redesign surfaces or promote donor code directly into runtime.

## Canonical `--sys-*` -> `--kr-*`

- `--sys-color-charcoalBackground-base` -> `--kr-color-charcoal-background-base`
- `--sys-color-charcoalBackground-steps-0` -> `--kr-color-charcoal-background-steps-0`
- `--sys-color-charcoalBackground-steps-1` -> `--kr-color-charcoal-background-steps-1`
- `--sys-color-charcoalBackground-steps-2` -> `--kr-color-charcoal-background-steps-2`
- `--sys-color-charcoalBackground-steps-3` -> `--kr-color-charcoal-background-steps-3`
- `--sys-color-charcoalBackground-steps-4` -> `--kr-color-charcoal-background-steps-4`
- `--sys-color-concreteGrey-base` -> `--kr-color-concrete-grey-base`
- `--sys-color-inkGold-base` -> `--kr-color-ink-gold-base`
- `--sys-color-paperWhite-base` -> `--kr-color-paper-white-base`
- `--sys-color-protestMetalBlue-base` -> `--kr-color-protest-metal-blue-base`
- `--sys-color-worker-ash-base` -> `--kr-color-worker-ash-base`
- `--sys-color-solidarityRed-base` -> `--kr-color-solidarity-red-base`
- `--sys-color-primary` -> context-sensitive; do not migrate mechanically
- `--sys-color-primary-base` -> context-sensitive; do not migrate mechanically
- `--sys-color-primaryContainer-base` -> context-sensitive; do not migrate mechanically
- `--sys-color-nav-active-container` -> ambiguous; review in local design context
- `--sys-color-on-nav-active` -> ambiguous; review in local design context
- `--sys-color-outline-variant` -> `--kr-color-concrete-grey-steps-0` for borders/dividers unless local contrast demands stronger emphasis
- `--sys-shape-blockRiot01` -> `--kr-shape-block-riot01`
- `--sys-shape-blockRiot02` -> `--kr-shape-block-riot02`
- `--sys-shape-blockRiot03` -> `--kr-shape-block-riot03`
- `--sys-type-font-fraunces` -> `--kr-type-font-families-display` or `--kr-type-font-families-proclamation` depending on usage
- `--sys-type-font-mono` -> `--kr-type-font-families-mono`
- `--sys-type-font-work-sans` -> `--kr-type-font-families-primary`

## Archive Donor Vars -> `--kr-*`

- `--surface-dim` -> `--kr-color-charcoal-background-steps-0`
- `--surface-container-low` -> `--kr-color-charcoal-background-steps-1`
- `--surface-container` -> `--kr-color-charcoal-background-steps-2`
- `--surface-container-high` -> `--kr-color-charcoal-background-steps-3`
- `--surface-bright` -> `--kr-color-charcoal-background-steps-6`
- `--primary-sage` -> `--kr-color-kr-activist-smoke-green-base`
- `--action-terracotta` -> `--kr-color-solidarity-smoke-orange-base`
- `--on-surface` -> usually `--kr-color-paper-white-base` in archive light-text contexts; verify before replacing body copy globally
- `--on-surface-variant` -> `--kr-color-concrete-grey-base`
- `--outline` -> `--kr-color-concrete-grey-steps-0`
- `--outline-variant` -> `--kr-color-concrete-grey-steps-0`

## Direct Hex -> Canonical KR Tokens

- `#050403` -> `var(--kr-color-asphalt-black-steps-0)`
- `#0F0F0F` -> `var(--kr-color-charcoal-background-steps-0)`
- `#1A1714` -> `var(--kr-color-charcoal-background-base)`
- `#1A1A1A` -> `var(--kr-color-charcoal-background-steps-1)`
- `#242424` -> `var(--kr-color-charcoal-background-steps-2)`
- `#2A2A2A` -> `var(--kr-color-charcoal-background-steps-3)`
- `#323232` -> `var(--kr-color-charcoal-background-steps-4)`
- `#444444` -> `var(--kr-color-charcoal-background-steps-6)`
- `#A39B8F` -> `var(--kr-color-concrete-grey-base)`
- `#D4CEC3` -> `var(--kr-color-paper-white-steps-1)`
- `#F5F0E8` -> `var(--kr-color-paper-white-base)`
- `#48B3DA` -> `var(--kr-color-protest-metal-blue-base)`
- `#6BE5A8` -> `var(--kr-color-kr-activist-smoke-green-steps-4)`
- `#48DA8B` -> `var(--kr-color-kr-activist-smoke-green-base)`
- `#DA8B48` -> `var(--kr-color-solidarity-smoke-orange-base)`
- `#E8A96F` -> `var(--kr-color-solidarity-smoke-orange-steps-4)`
- `#F14714` -> `var(--kr-color-solidarity-red-base)`
- `#FF9490` -> `var(--kr-color-kr-charcoal-red-steps-4)`
- `#DAF674` -> `var(--kr-color-ink-gold-base)`
- `#F6E748` -> `var(--kr-color-stencil-yellow-base)`
- `#DAF6B3` -> `var(--kr-color-worker-ash-base)`
- `#8DAF75` -> `var(--kr-color-worker-ash-steps-1)`
- `#627A4F` -> `var(--kr-color-worker-ash-steps-0)`

## Do Not Migrate Mechanically

- `#1e2a2e` in `OpportunitiesDiscovery.tsx`
- `--sys-color-primary`, `--sys-color-primary-base`, and `--sys-color-primaryContainer-base`
- `--sys-color-nav-active-container` and `--sys-color-on-nav-active`
- donor-era `surface-container*` utility class names when the replacement requires utility-system surgery rather than a local token swap
- any Figma-exported `figma:asset/*` binding

These all require local semantic review or a runtime-safe replacement plan before editing.

## Chart and SVG Exceptions

Some charting contexts in `frontend/src/features/analysis/Analysis.tsx` currently rely on resolved hex literals because Recharts does not reliably consume CSS custom properties in every path.

Rules:
- do not blindly replace chart-only hex constants with `var(--kr-...)` inside Recharts config
- prefer eliminating duplicate inline literals by referencing a local canonical constant when that reduces drift without changing rendering behavior
- do not create a new global hex-token registry without explicit approval

## Reference-Only / Archive-Only Exclusions

- `docs/archive_legacy_reports/root_legacy/Career-Copilot-Web-App/**`
- `frontend/src/_reference/**` unless a task explicitly says to harvest donor fragments from it
- prototype or redirect-history `/kr/*` route artifacts not promoted into runtime

## Current Purpose

This baseline is sufficient for:
- Gemini inventory work
- Claude semantic review
- Claude Code Workstreams A, B, and D
- Codex Workstream C

If Claude review materially changes any mapping above, update this file before dispatching additional implementation work.
