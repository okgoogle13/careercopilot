# Frontend Design Orchestrator Plan (Workflow A Backbone)

## Decision Alignment

- Workflow A (Spec-first Canonical): **GO (primary)**
- Workflow B (Figma-first hybrid): **LATER / OPTIONAL**
- Workflow C (Runtime reverse-doc): **LATER / SUPPORTING**
- Workflow D (Asset-first composition): **DEFERRED**

## Sprint-style Execution Plan

### Sprint 1 — Orchestrator Skeleton + Artifacts (Current)

**Goal:** Establish a single batch entrypoint and produce deterministic run/readiness artifacts.

Delivered:
- `scripts/design/orchestrate.mjs`
- `yarn design:orchestrate:all`
- `yarn design:orchestrate:visual-audit`
- Run manifest output in `docs/design/runs/<timestamp>.json`
- CI readiness JSON output in `docs/design/generated/design-readiness.json`
- Human-readable readiness MD in `docs/design/design-readiness.md`
- Visual audit gallery in `docs/design/generated/visual-audit-gallery.md`

### Sprint 2 — Contract Hardening and Expanded Runtime Probes

**Goal:** Increase confidence in visual/runtime compliance on critical screens.

Planned:
- Expand `design/contracts/runtime-probes.json` with selector + CSS assertions per target
- Add explicit schema versioning for contracts
- Add stricter visual-audit failure semantics by target priority

### Sprint 3 — Wrap Legacy Skills Under Orchestrator

**Goal:** Keep existing custom skills but run them as sub-steps under one gate.

Planned:
- Wrap existing generators/linters under orchestrator stages
- Normalize all generated outputs to canonical paths
- Emit one consolidated readiness decision for CI/CD

### Sprint 4 — Optional Adapters and Cleanup

**Goal:** Add optional integrations and remove obsolete one-offs.

Planned:
- Optional Figma layout adapter (LATER)
- SKILL_REGISTRY consistency checker (lower-priority GO)
- Archive deprecated one-off skills after orchestrator parity

## Local Run Commands

```bash
# Full batch flow: audit + validate + visual checkpoint pass + reports
yarn design:orchestrate:all

# Visual-only checkpoint flow
yarn design:orchestrate:visual-audit
```

## Current Known Constraint

Visual audit requires reachable pages from `design/contracts/visual-audit-targets.json`
(base URL defaults to `http://127.0.0.1:5173`).


## Scaffold status (important)

- Current visual audit targets and runtime probes are **initial scaffolding/TODO**.
- They are not yet complete enforcement for all complex pages (Lens/Jar/etc.).
- Current probes are intentionally minimal and will be expanded in Sprint 2.

## Local verification outputs

After running either orchestrator command, check:

- `docs/design/generated/design-readiness.json`
- `docs/design/design-readiness.md`
- `docs/design/runs/<timestamp>.json`
- `docs/design/generated/visual-audit-gallery.md`
- `docs/design/generated/previews/<targetId>.png`


## Entrypoint Policy

- Primary top-level design automation entrypoint: orchestrator commands only.
- Legacy one-off skills may execute only as orchestrator-internal wrappers (not as primary release gates).


## Skill Invocation Policy (Cleanup Phase)

- Skill lifecycle decisions are tracked in `docs/design/design-skill-lifecycle.md`.
- Machine-readable lifecycle state is tracked in `design/contracts/skill-lifecycle.json`.
- Orchestrator wrapper stage (`legacy-skill-wrapper-map`) validates WRAP skills are present before downstream stages execute.
- Non-orchestrated direct skill usage is considered low-level/manual and should not be used as release gate authority.
