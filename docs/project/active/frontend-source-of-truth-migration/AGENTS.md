# AGENTS.md — PR126 Frontend Source-of-Truth Migration

This file is the migration-specific agent guide. It complements the repo-root `AGENTS.md` and applies only to work under `docs/project/active/frontend-source-of-truth-migration/`.

## Execution Truth (Read First)

- `control/COMET-MANIFEST.md` (active prototype prompting + harvest sequence authority)
- `control/AI-STUDIO-PROMPT-PACK.md` (expanded batch prompts)
- `control/status.md` (current program state and blockers)
- `control/pm/dashboard.md` (visibility + delegation support; not authority)
- `control/archive/route-matrix.json` and `control/archive/route-matrix.md` (retained route-planning baseline)
- `control/archive/implementation-backlog.md` and `control/archive/workflow.md` (retained backlog and workflow baseline)

## Authority Layers (In Order)

- **Runtime truth**: `frontend/src/App.tsx` (what users can reach today)
- **Design truth**: `frontend/src/screens/**/*.wireframe.xml` + paired `frontend/src/screens/**/*.tsx`
- **Capability truth**: mounted endpoints in `backend/app/api/endpoints/`
- **Contracts (route-level execution locks)**: `contracts/*.xml`
- **Support artifacts**: `control/archive/route-matrix.json`, `control/archive/implementation-backlog.md`, manifests, and prototype/reference outputs

Rule: support artifacts may inform decisions but must never override runtime/design/capability truth.

## Canonical Inputs (Route-Level Work)

- `control/archive/route-matrix.json` (route classification + owner)
- `control/archive/implementation-backlog.md` (retained milestone and backlog baseline)
- `control/archive/workflow.md` (retained workflow/gate baseline)
- `contracts/*.xml` (build contracts + supplementary briefs)
- `frontend/src/App.tsx` (route reachability)
- `frontend/src/screens/**` (wireframe + paired TSX truth)
- `backend/app/api/endpoints/` (real backend capability)

## Evidence Manifests (Discovery Outputs)

These are evidence inputs only (useful for drift detection, not authority):

- `docs/manifests/routes.json` (runtime scan)
- `docs/manifests/screens.json` (design scan)
- `docs/manifests/frontend-api-usage.json` (frontend capability usage)
- `docs/manifests/backend-endpoints.json` (backend capability inventory)
- `docs/manifests/orphans.json` (cross-truth drift)

## Working Method (One Route at a Time)

1. Pick a route from `control/archive/route-matrix.json` and confirm it is reachable in `frontend/src/App.tsx`.
2. **Global Primitive Check**: Audit the route for shared primitives that must be migrated or synced (e.g., `Logo`, `Sidebar`, `TopNav`, `Footer`, `AuthGuard`, `KrDarkDock`).
3. Confirm the intended design surface exists under `frontend/src/screens/` (or record it as missing).
4. Confirm backend capability exists (mounted endpoint + any required auth expectations).
5. If wireframes are in scope: validate first, then lock execution with a build contract in `contracts/`.
6. Implement in runtime truth (`frontend/src/features/**` + `frontend/src/pages/**`) while preserving the authority order.
7. Run route-local gates (`token-enforcement`, and `migration-audit` when the workflow requires it).
8. Update `control/status.md` and `control/pm/dashboard.md` with what changed, what’s blocked, and the next executable step.

## Support-Reference & Identity Gate Addendum

- Use the approved route audit packs for `landing`, `dashboard`, and `analysis` as the sole governed gateway for Figma-derived inputs. Do not treat other `sources/consolidated-reference` files as authoritative until a gap-fill planner + audit-pack decision explicitly authorizes them.
- Require the late-stage TSX identity gate (`design-orchestration` → `kerala-rage-brand-enforcer` → `m3-expressive-token-orchestrator` → `kerala-rage-typography-strategy`) for any route that consumes support-reference or generated TSX, and record the result through `analysis/tsx-identity-gate-template.md` before closing the route.

## Gates & Validation (Order Matters)

Repo-level planning/gov gates:

```bash
pytest tests/plans -q
node frontend/scripts/validate-governance-artifacts.mjs
```

Wireframe workflow gates (when XML wireframes are in scope):

```bash
python3 scripts/validate-wireframe-workflow.py
```

Route-local gates (run for every touched route):

```bash
bash .claude/skills/token-enforcement/scripts/run-token-enforcement.sh <route>
```

Optional/conditional route-local audit gate (only when `control/archive/workflow.md` says so):

```bash
bash .claude/skills/migration-audit/scripts/run-migration-audit.sh <route>
```

Output location for validators: `tmp/migration/` (do not commit).

## Advisory-Only Protocol Notes

Gemini-updated skills, protocol writeups, and orchestration notes are **advisory only**. They may improve logistics (sequencing, delegation, checklists), but they do not change the authority order or gate ownership. Human direction is required for any migration decision.

## Docs Hygiene

- Keep all execution changes reflected in `control/` (not in `analysis/`).
- Prefer small, PR-sized edits to control docs that preserve a single source of truth.
- If a doc disagrees with runtime/design/capability truth, record the discrepancy in `control/status.md` and fix the root cause.
