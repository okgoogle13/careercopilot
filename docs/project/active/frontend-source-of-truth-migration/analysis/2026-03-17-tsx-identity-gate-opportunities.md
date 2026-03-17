# TSX Identity Gate — `/opportunities`

**Filename:** `2026-03-17-tsx-identity-gate-opportunities.md`

## Route Metadata

- **Route id:** `opportunities`
- **Runtime owner:** `Opportunities` (`frontend/src/features/opportunities/Opportunities.tsx`)
- **Implemented TSX path:** `frontend/src/features/opportunities/Opportunities.tsx`
- **Build contract:** `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-opportunities.xml`
- **Support-reference audit:** `docs/project/active/frontend-source-of-truth-migration/analysis/2026-03-16-support-reference-audit-opportunities.md`

## Inputs Reviewed

- `frontend/src/features/opportunities/Opportunities.tsx`
- `docs/project/active/frontend-source-of-truth-migration/analysis/2026-03-16-support-reference-audit-opportunities.md`
- `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-opportunities.xml`
- `tmp/migration/opportunities-gap-fill-plan.json`

## Identity Review

- **Archetype mapping:** `Placard`-led lookout board with `Strike` dispatch CTA, jobs-family feed density, and route-owned search controls
- **Generic SaaS risk:** `medium` — the route can still drift toward a polished job-portal pattern if support-reference styling is copied too literally, but the current runtime keeps the page voice anchored to KR Solidarity lookout/discovery framing.

### `design-orchestration`

- **Finding:** The runtime route remains the authoritative owner of search flow, scout dispatch, and jobs-family sequencing. The current composition follows the approved `keep_behavior_rewrite_styling` reuse mode rather than directly promoting support-reference TSX.
- **Required rewrite:** completed — deprecated `Pebble` CTA usage was replaced with canonical `Strike`, keeping runtime ownership intact.

### `kerala-rage-brand-enforcer`

- **Finding:** The shared-shell and route surface now avoid the earlier deprecated archetype drift. The support-reference audit exclusions remain respected: no shell override, no backend contract inference, no mascot/flora motifs promoted from support assets.
- **Zero-Flora / anti-generic status:** `clean with guarded reuse` — route-specific lookout framing remains intact.

### `m3-expressive-token-orchestrator`

- **Finding:** `derive-gap-fill-plan.py --route-id opportunities` now returns `token_state: clean` and clears the previously required `swap_deprecated_archetypes` / `extend_token_coverage` actions.
- **Token wiring status:** `pass after rewrites`

### `kerala-rage-typography-strategy`

- **Finding:** The page keeps uppercase mono dispatch labels, display-weight lookout headers, and worklist pacing consistent with the KR Solidarity jobs family rather than a neutral enterprise listing board.
- **Voice / hierarchy status:** `pass`

## Outcome

- **Gate result:** `identity_pass_with_rewrites`
- **Blocking rewrites:** none
- **Closure decision:** `route may close`
