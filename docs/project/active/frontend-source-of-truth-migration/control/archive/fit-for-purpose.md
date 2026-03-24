# Skills and Scripts Fit-for-Purpose Review

**Date:** 2026-03-14
**Status:** Updated after planning-input parity verification
**Purpose:** record whether migration-support skills and scripts are safe to use as execution infrastructure for the frontend source-of-truth migration

## Decision legend

- `approved`: safe to use as intended in this migration
- `approved_with_limits`: useful, but only for the explicitly allowed use below
- `not_fit_for_purpose`: should not be used as a migration gate or execution aid until corrected

## Review Table

| Name | Type | Migration Purpose | Decision | Allowed Use | Blocked Use | Required Fixes Before Approval | Reviewer | Review Date | Target Review Date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `sprint-coordinator` | `skill` | milestone tracking and readiness scoring | `approved_with_limits` | backlog sequencing, readiness scoring, and milestone dependency reporting only | redefining migration scope, changing route ownership, or creating alternative planning truth | none if limited to delivery tracking | Codex | 2026-03-13 | 2026-03-13 |
| `project-manager` | `skill` | project-phase orchestration and blocker escalation | `approved_with_limits` | executive snapshots, phase dependencies, and blocker reporting against canonical `control/` docs | redefining route ownership, treating PM artifacts as execution truth, or superseding `control/blueprint.md` / `control/workflow.md` | none if limited to orchestration against canonical control docs | Codex | 2026-03-16 | 2026-03-16 |
| `blueprint` | `skill` | extend the living migration blueprint with cold-start execution steps | `approved_with_limits` | extending `control/blueprint.md`, dependency-graph refreshes, and route-family gate framing | creating a parallel blueprint outside `control/`, overwriting authority order, or turning support artifacts into execution truth | none if it extends the living blueprint and preserves authority order | Codex | 2026-03-16 | 2026-03-16 |
| `design-orchestration` | `skill` | archetype mapping and generic-SaaS risk review for support-influenced TSX | `approved_with_limits` | advisory review of raw support-reference TSX and late-stage identity triage on implemented TSX | overriding route ownership, acting as the sole merge gate, or bypassing token/brand/typography checks | none if used as the identity review router inside Step 4 and Step 6B | Codex | 2026-03-16 | 2026-03-16 |
| `kerala-rage-brand-enforcer` | `skill` | de-SaaS visual review and Zero-Flora enforcement | `approved_with_limits` | final brand-drift review on TSX/screens after structural decisions are already made | choosing canonical route ownership, substituting for token-enforcement, or signing off generic SaaS layouts as acceptable | none if paired with token + typography review in the TSX identity gate | Codex | 2026-03-16 | 2026-03-16 |
| `m3-expressive-token-orchestrator` | `skill` | expressive token wiring and semantic token audit | `approved_with_limits` | final token-system review for implemented TSX after base token enforcement passes | replacing baseline token-enforcement, choosing layout/archetype direction, or approving raw support-reference code for direct promotion | none if used as a late-stage expressive token gate on implemented TSX | Codex | 2026-03-16 | 2026-03-16 |
| `kerala-rage-typography-strategy` | `skill` | typography voice audit for anti-generic route closure | `approved_with_limits` | final typography and voice review on implemented TSX after token wiring exists | acting as a layout/planning authority or replacing brand/token checks | none if used as the final voice gate in the late-stage TSX identity review | Codex | 2026-03-16 | 2026-03-16 |
| `frontend-backend-mapper` | `skill` | confirm route ownership matches backend capability | `approved_with_limits` | endpoint discovery, caller inventory, and route-to-capability cross-checks against canonical docs | choosing canonical routes or overriding the route matrix/gap map | none if limited to canonical-doc cross-checking and discovery | Claude | 2026-03-13 | 2026-03-14 |
| `api-contract-validator` | `skill` | validate frontend/backend integration contracts | `approved_with_limits` | checking request/response shape for retained contracts before component integration | treating deprecated or transitional ingestion paths as canonical | none if used only against retained mounted contracts | Codex | 2026-03-13 | 2026-03-14 |
| `migration-audit` | `skill` | audit route/screen/runtime alignment | `approved_with_limits` | auditing runtime/design/capability alignment after route decisions are already made, for routes that have a defined benchmark target and validated wireframe inputs when wireframes are in scope | deciding product truth from derived artifacts or unapproved prototype routes; auditing any non-auth route without a defined benchmark — default `auth-benchmark-v1` does not apply to `/tracker`, `/career/ingest`, `/documents`, `/profile`; trusting wireframe-derived evidence before `validate-wireframe-workflow.py` is reviewed | define benchmark targets for each non-auth migration route before using this skill against them | Claude | 2026-03-13 | 2026-03-14 |
| `verification-before-completion` | `skill` | enforce real verification before milestone closure | `approved_with_limits` | requiring explicit checks before closing migration tasks and milestones | inventing substitute checks for gates that are not yet defined | none if paired with this migration's named checks | Codex | 2026-03-13 | 2026-03-13 |
| `frontend/scripts/validate-governance-artifacts.mjs` | `script` | governance consistency gate | `approved_with_limits` | parity check against canonical `control/route-matrix.json` and `control/gap-map.json`, paired with `pytest tests/plans -q` as the stronger readiness signal | sole readiness gate without the Python governance tests; substitute for runtime/design/capability review | none if kept paired with `pytest tests/plans -q` and canonical `control/` inputs | Codex | 2026-03-14 | 2026-03-14 |
| `scripts/derive-gap-fill-plan.py` | `script` | route-level tokens-first reuse planner and Figma support gate | `approved_with_limits` | route-level candidate scoring from canonical runtime/design inputs plus `sources/consolidated-reference/**` as `support_reference`, provided the route still follows validator + build-contract workflow | direct promotion of raw support-reference code, overriding route ownership from the route matrix, or using the planner without route-level wireframe/build-contract review when those gates are required | none if kept inside the tracked Step-4 workflow and treated as a support planner rather than authority | Codex | 2026-03-16 | 2026-03-16 |
| `frontend/scripts/component-inventory.ts` | `script` | inventory canonical/support/reference-only surfaces | `approved_with_limits` | inventory support using the tracked route matrix and backend-feature component gap map as guidance inputs; preflight conflict detection (route-family conflicts, shared-shell inheritance, duplicate live-looking surfaces); lane-label reporting (`KEEP`/`WRAP`/`REWRITE`/`DELETE`) | sole source of truth for component ownership states; substituting its heuristics for the canonical migration docs; treating lane labels as canonical planning truth | none if treated as a support inventory and not as authoritative planning truth | Claude | 2026-03-13 | 2026-03-14 |

## Review Notes

- This review must be completed before any skill or script above is used as a migration gate.
- `approved_with_limits` items must have exact allowed use filled in before implementation milestones rely on them.
- Any tool marked `not_fit_for_purpose` must be excluded from migration execution until corrected and re-reviewed.
- Human review is still required before any item is upgraded from `approved_with_limits` to `approved`.
- Planning-input parity is now closed for the canonical `control/` workspace. `frontend/scripts/validate-governance-artifacts.mjs` may be used as a supporting parity gate, but `pytest tests/plans -q` remains the stronger readiness signal.
- For execution planning, non-auth benchmark creation is deferred by default. Do not schedule `migration-audit` on `/tracker`, `/career/ingest`, `/documents`, or `/profile` unless benchmark coverage is intentionally being introduced as part of that route's gate.
- **2026-03-14 sync update:**
  - `frontend-backend-mapper` token-path issue is corrected in the skill text.
  - `migration-audit` now explicitly requires benchmark coverage for non-auth routes and wireframe-workflow review when wireframes are in scope.
  - `frontend/scripts/component-inventory.ts` now reads the tracked route matrix and backend-feature component gap map instead of older `.claude` planning artifacts.
  - `frontend/scripts/component-inventory.ts` is approved for route preflight conflict detection and lane-label reporting (support-only).
  - `frontend/scripts/validate-governance-artifacts.mjs` now validates the canonical `control/` workspace and passes alongside `pytest tests/plans -q`.
- **2026-03-16 Figma support update:**
  - `sources/consolidated-reference/**` is confirmed as a support/reference layer, not execution truth.
  - `scripts/derive-gap-fill-plan.py` is now the only approved entry point for evaluating consolidated-reference TSX during Step 4.
  - The latest blueprint iteration is fit for purpose only when PM artifacts, status reporting, and the gap-fill planner stay aligned; direct promotion of raw support-reference code remains blocked.
  - Figma-informed routes now require a late-stage TSX identity gate: `design-orchestration` → `kerala-rage-brand-enforcer` → `m3-expressive-token-orchestrator` → `kerala-rage-typography-strategy`.
- **Codex initial review (2026-03-13) contained three errors corrected by Claude re-review (2026-03-14):**
  - `frontend-backend-mapper`: Codex reported no required fixes; Claude found wrong token path in `--include-design-tokens` mode.
  - `migration-audit`: Codex did not flag missing benchmark targets for non-auth routes; Claude added to blocked use.
  - `component-inventory.ts`: Codex understated the fix scope; Claude identified missing enum values (`support`, `deferred`) and unconfirmed population mechanism for `canonicalStatus`.
