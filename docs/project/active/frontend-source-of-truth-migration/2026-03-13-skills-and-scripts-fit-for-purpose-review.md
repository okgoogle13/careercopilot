# Skills and Scripts Fit-for-Purpose Review

**Date:** 2026-03-13
**Status:** Initial review completed with limits
**Purpose:** record whether migration-support skills and scripts are safe to use as execution infrastructure for the frontend source-of-truth migration

## Decision legend

- `approved`: safe to use as intended in this migration
- `approved_with_limits`: useful, but only for the explicitly allowed use below
- `not_fit_for_purpose`: should not be used as a migration gate or execution aid until corrected

## Review Table

| Name | Type | Migration Purpose | Decision | Allowed Use | Blocked Use | Required Fixes Before Approval | Reviewer | Review Date | Target Review Date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `sprint-coordinator` | `skill` | milestone tracking and readiness scoring | `approved_with_limits` | backlog sequencing, readiness scoring, and milestone dependency reporting only | redefining migration scope, changing route ownership, or creating alternative planning truth | none if limited to delivery tracking | Codex | 2026-03-13 | 2026-03-13 |
| `frontend-backend-mapper` | `skill` | confirm route ownership matches backend capability | `approved_with_limits` | endpoint discovery, caller inventory, and route-to-capability cross-checks against canonical docs | choosing canonical routes or overriding the route matrix/gap map | none if limited to canonical-doc cross-checking and discovery | Claude | 2026-03-13 | 2026-03-14 |
| `api-contract-validator` | `skill` | validate frontend/backend integration contracts | `approved_with_limits` | checking request/response shape for retained contracts before component integration | treating deprecated or transitional ingestion paths as canonical | none if used only against retained mounted contracts | Codex | 2026-03-13 | 2026-03-13 |
| `migration-audit` | `skill` | audit route/screen/runtime alignment | `approved_with_limits` | auditing runtime/design/capability alignment after route decisions are already made, for routes that have a defined benchmark target and validated wireframe inputs when wireframes are in scope | deciding product truth from derived artifacts or unapproved prototype routes; auditing any non-auth route without a defined benchmark — default `auth-benchmark-v1` does not apply to `/tracker`, `/career/ingest`, `/documents`, `/profile`; trusting wireframe-derived evidence before `validate-wireframe-workflow.py` is reviewed | define benchmark targets for each non-auth migration route before using this skill against them | Claude | 2026-03-13 | 2026-03-14 |
| `verification-before-completion` | `skill` | enforce real verification before milestone closure | `approved_with_limits` | requiring explicit checks before closing migration tasks and milestones | inventing substitute checks for gates that are not yet defined | none if paired with this migration's named checks | Codex | 2026-03-13 | 2026-03-13 |
| `frontend/scripts/validate-governance-artifacts.mjs` | `script` | governance consistency gate | `not_fit_for_purpose` | ad hoc local inspection only until parity is fixed | milestone gate or pass/fail source for migration readiness | align with Python tests and cover route/component artifact invariants before approval | Codex | 2026-03-13 | 2026-03-14 |
| `frontend/scripts/component-inventory.ts` | `script` | inventory canonical/support/reference-only surfaces | `approved_with_limits` | inventory support using the tracked route matrix and backend-feature component gap map as guidance inputs | sole source of truth for component ownership states; substituting its heuristics for the canonical migration docs | none if treated as a support inventory and not as authoritative planning truth | Claude | 2026-03-13 | 2026-03-14 |

## Review Notes

- This review must be completed before any skill or script above is used as a migration gate.
- `approved_with_limits` items must have exact allowed use filled in before implementation milestones rely on them.
- Any tool marked `not_fit_for_purpose` must be excluded from migration execution until corrected and re-reviewed.
- Human review is still required before any item is upgraded from `approved_with_limits` to `approved`.
- **2026-03-14 sync update:**
  - `frontend-backend-mapper` token-path issue is corrected in the skill text.
  - `migration-audit` now explicitly requires benchmark coverage for non-auth routes and wireframe-workflow review when wireframes are in scope.
  - `frontend/scripts/component-inventory.ts` now reads the tracked route matrix and backend-feature component gap map instead of older `.claude` planning artifacts.
- **Codex initial review (2026-03-13) contained three errors corrected by Claude re-review (2026-03-14):**
  - `frontend-backend-mapper`: Codex reported no required fixes; Claude found wrong token path in `--include-design-tokens` mode.
  - `migration-audit`: Codex did not flag missing benchmark targets for non-auth routes; Claude added to blocked use.
  - `component-inventory.ts`: Codex understated the fix scope; Claude identified missing enum values (`support`, `deferred`) and unconfirmed population mechanism for `canonicalStatus`.
