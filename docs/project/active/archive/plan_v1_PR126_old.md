# Frontend Source-of-Truth Migration Plan (PR126)

**Date:** 2026-03-15
**Status:** Active (updated)
**Canonical location:** `docs/project/active/frontend-source-of-truth-migration/control/plan.md`
**Supersedes for active planning:**
- `.claude/plans/2026-03-12-production-readiness-corrective-workflow-design.md`
- `.claude/plans/2026-03-12-frontend-source-of-truth-migration.md`
- `.claude/plans/2026-03-12-migration-critique.md`
- `.claude/plans/wireframe-source-of-truth-gap.md`

Execution truth:
- `docs/project/active/frontend-source-of-truth-migration/control/blueprint.md`
- `docs/project/active/frontend-source-of-truth-migration/control/workflow.md`

## Purpose

This document is the single working plan for the frontend migration.

The earlier planning docs identified real issues, but they spent too much time on governance structure and not enough time on the concrete recovery work. This version keeps only the minimum planning rules needed to avoid more drift and focuses on the two problems that matter most:

1. important backend-backed features exist but are not usable in the live frontend
2. the wireframe-to-component workflow is broken, so design screens are not reliably turning into real routed product pages

## What Is Actually Broken

### 1. Unwired backend features

The backend already supports product-relevant capabilities that the live frontend does not properly expose.

Current high-priority gaps in delivery order:
- `P0`: `applications` CRUD is real, but `/tracker` still behaves like a mock-backed surface
- `P0`: smart-ingestion endpoints exist, but there is no complete routed upload-to-save flow
- `P1`: document redlining exists in backend, but no live documents workspace owns it
- `P1`: voice profile capture exists, but no live route clearly owns it
- `P2`: resume audit exists, but the main flow is not properly integrated into the routed product

### 2. Broken wireframe-to-component workflow

The project has multiple layers that are being treated as if they were the same thing:
- screen references in `frontend/src/screens/**/*.wireframe.xml` and paired `*.tsx`
- live runtime pages in `frontend/src/features/**` and `frontend/src/pages/**`
- prototype `/kr/*` routes
- machine-generated migration artifacts

Because these layers are not clearly separated in day-to-day execution:
- some richer screen references are unrouted
- some live pages are thin or outdated
- prototype routes still confuse product truth
- migration work can target the wrong source material

## The Goal

This migration is successful only if it does all of the following:

- wires the important existing backend capabilities into the live product
- decides which current routed pages stay, which get upgraded, and which should be replaced by better screen-led implementations
- removes prototype ambiguity from the live app
- creates one repeatable workflow for turning a screen reference into a live route or feature update

This migration is **not** successful just because more governance JSON exists.

## Success Metrics

This migration should be considered successful only if the following checks are true:

- `100%` of live product routes are classified in the route matrix as `keep`, `merge`, `expand`, `replace`, or `retire`
- `100%` of retained backend-backed capabilities have one clear routed frontend owner
- `0` `/kr/*` prototype routes remain part of product truth after cleanup
- `0` high-priority mock-backed product routes remain after Phase 2
- `100%` of routes touched during migration pass token-enforcement checks before milestone closure
- `100%` of major component surfaces are classified as canonical, support, reference-only, deferred, or cleanup candidates

## Target Component State (Canonical vs Support vs Deferred)

Canonical route-owned surfaces (must be live, routed, and backend-wired):
- `/tracker`: `ApplicationTracker`
- `/documents`: `Documents`
- `/career/ingest`: `SmartIngestion`
- `/profile`: `ProfileView`
- `/analysis`: `AnalysisPage`
- `/opportunities`: `Opportunities`
- `/apply/quick`: `ApplyQuick`

Support components (route-owned or explicitly shared) and deferred components:
- source of truth: `control/gap-map.json` and `control/gap-map.md`

Rule:
- do not promote reference-only screen components into runtime truth without a route-matrix row and a build contract when wireframes are in scope

## Minimum Rules For This Work

These rules stay because they prevent the team from making the situation worse:

- `frontend/src/App.tsx` defines what users can currently reach
- `frontend/src/screens/**/*.wireframe.xml` plus paired `*.tsx` define design/reference intent
- mounted backend endpoints define real capability
- governance JSON files are support artifacts only and must not override runtime truth, design truth, or backend capability truth
- `/kr/*` routes are not canonical product surfaces unless explicitly promoted

## Current State Summary

Current known facts from the existing review work:
- 27 live routes across 13 route families
- 17 likely page or screen surfaces identified in the frontend
- 10 likely surfaces currently routed
- 7 likely surfaces currently unrouted
- 5 live `/kr/*` prototype routes

This means the current app is not just "behind the wireframes." It is split across multiple overlapping frontend realities.

## Phase 1 Evidence: Three-Truth Discovery (Advisory)

These artifacts are evidence inputs only. They do not override runtime truth, design truth, or capability truth.

Evidence outputs (machine-readable):
- `docs/manifests/routes.json` (runtime routes scanned from `frontend/src/App.tsx`)
- `docs/manifests/screens.json` (design screens scanned from `frontend/src/screens/`)
- `docs/manifests/frontend-api-usage.json` (frontend API usage)
- `docs/manifests/backend-endpoints.json` (mounted backend endpoints)
- `docs/manifests/orphans.json` (cross-truth drift report)

Evidence commands:
- `npx tsx tools/scripts/scan-routes.ts`
- `npx tsx tools/scripts/scan-screens.ts`
- `npx tsx tools/scripts/scan-api-usage.ts`
- `python3 tools/scripts/scan-endpoints.py`
- `npx tsx tools/scripts/detect-orphans.ts`

Current evidence snapshot (2026-03-15):
- Runtime: 27 routes
- Design: 11 screen dirs (paired wireframe + TSX + mapping)
- Capability: 69 unique endpoints used by frontend; 57 endpoints mounted in backend

## Wireframe Workflow and Prior Learnings

The previous `.claude/wireframes` migration pass produced some useful material, but it is not a trustworthy completion record.

What can be reused:
- the motion taxonomy and spring-contract shape from `.claude/wireframes/MOTION_UPDATE_SPRING_PHYSICS.md`
- the asset-slot resolution data and rationale in `.claude/wireframes/placement_report.json`
- the basic pipeline ordering in `.claude/wireframes/SUMMARY.md`: wireframe -> asset placement -> spec -> build -> tests

What failed in the prior process:
- completion was asserted from summary documents, not proven against canonical files
- motion updates were documented as complete across all 11 wireframes, but actual XML coverage remained partial
- placement success was reported even when asset file-path integrity still failed
- `.claude/wireframes/*` artifacts were treated as if they were execution truth, instead of reference material
- there was no deterministic gate reconciling canonical wireframes with the route matrix, component gap map, and asset integrity checks

### Wireframe workflow

Use this sequence for wireframe-led migration work:

1. `wireframe-annotator`
   - generate or refresh wireframe intent only
2. `scripts/validate-wireframe-workflow.py`
   - validate canonical XML wireframes against schema quality, route coverage, component planning, and legacy drift
3. `contracts/wireframe-build-contract-prompt.md`
   - generate a deterministic build contract from one route-matrix row, one canonical wireframe XML, and one component-gap entry when applicable
4. `scripts/derive-gap-fill-plan.py`
   - generate a tokens-first reuse plan from the route matrix, component gap map, existing TSX files, and an approved build contract when present
   - classify each target component as `reuse_as_is`, `keep_behavior_rewrite_styling`, `keep_behavior_extend_tokens`, `reference_only`, `build_new`, or `blocked`
5. `asset-placement-strategy`
   - resolve asset slots only after the wireframe is structurally valid
6. `manifest-reconciler`
   - prove file, manifest, and hero-registry integrity after asset references or placement output change
7. `component-spec-generator`
   - generate implementation specs only after the wireframe passes validation, the build contract locks component ownership and decomposition, and the gap-fill plan isolates true new-build work from runtime reuse work
8. `token-enforcement`
   - enforce token and banned-term rules on implementation code
9. `design-orchestration`
   - map the implemented TSX to KR archetypes and record generic-SaaS risk before closure
10. `kerala-rage-brand-enforcer`
   - run deterministic brand-policy checks and de-SaaS the resulting design or code artifacts
11. `m3-expressive-token-orchestrator`
   - verify expressive semantic token wiring on the implemented TSX
12. `kerala-rage-typography-strategy`
   - confirm typography, voice, and hierarchy are distinctive enough for closure
   - save the review as `analysis/YYYY-MM-DD-tsx-identity-gate-<route>.md` using `analysis/tsx-identity-gate-template.md`

The build-contract prompt is the missing bridge between validated XML wireframes and TSX implementation planning.
It must reconcile:
- `control/route-matrix.json`
- `control/gap-map.json`
- one canonical `frontend/src/screens/**/*.wireframe.xml`

### Consolidated-reference and evaluated promotion

`docs/project/active/frontend-source-of-truth-migration/sources/consolidated-reference/` is a governed support layer assembled from external/Figma-derived material.

Use it only through the tokens-first workflow:

- reject "promote the strongest TSX" as a default migration strategy
- accept "evaluated promotion" only when `scripts/derive-gap-fill-plan.py` classifies a support-reference candidate for one route
- allow direct promotion only for candidates that survive the deterministic gate as `reuse_as_is`
- treat token-dirty, `figma:asset`, remote-asset, or motif-conflicted candidates as behavior/layout inputs that must be rewritten or kept reference-only

This preserves the authority order:

- runtime truth stays in `frontend/src/features/**` + `frontend/src/pages/**`
- design truth stays in `frontend/src/screens/**/*.wireframe.xml` + paired `*.tsx`
- support-reference candidates never override route ownership, wireframe intent, or backend capability truth

### Current build-contract gate status

The first route-level build contract exists for `/tracker` and is approved for execution.

Current status:
- route: `/tracker`
- artifact: `contracts/build-contract-tracker.xml`
- review state: `approved`
- gate result: `execution_ready`
- human approval recorded: `2026-03-14` (see `control/status.md`)
- current execution state: Step 3a `/tracker` CRUD `in_progress` (see `control/blueprint.md`)

### Do

- use `frontend/src/screens/**/*.wireframe.xml` as the canonical wireframe source
- validate wireframes against `control/route-matrix.json` before calling them migration-ready
- validate wireframes against `control/gap-map.json` before spec generation
- use the tracked build-contract prompt to produce route-level implementation contracts before `component-spec-generator` work begins
- use the tokens-first gap-fill planner to decide whether an existing runtime component should be reused for behavior only, reused with token cleanup, treated as reference-only, or replaced
- allow consolidated-reference TSX into the migration only as `support_reference` candidates scored by the gap-fill planner
- record archetype mapping plus `generic_saas_risk` for any selected support-reference TSX before Step 6B consumes it
- require a late-stage TSX identity review for any route that adopts support-reference patterns or generated TSX
- treat the identity gate artifact as the closure record for those routes
- use direct Figma MCP page harvest only as a structural accelerator for Step 4; keep it behind the same support-reference review path
- allow Figma MCP to draft build-contract inputs and wireframe XML diffs, but require human review before those outputs affect canonical files
- treat motion, asset placement, and brand polish as downstream enrichments after schema and planning consistency
- run `manifest-reconciler` whenever asset-bearing wireframes or placement outputs change
- allow shared-family wireframes only when the route matrix explicitly marks them as shared coverage

### Don't

- do not treat `.claude/wireframes/SUMMARY.md` or spring-physics summaries as proof that canonical files are complete
- do not mark asset placement as successful if manifest or file-path integrity still fails
- do not treat `asset-placement-strategy` as a substitute for wireframe schema validation
- do not use archived brand-enforcer instructions when the current KR Solidarity enforcer exists
- do not generate component specs from wireframes that are missing route ownership or component-planning alignment
- do not reuse existing `features/` presentation wholesale unless the candidate file is already token-clean
- do not directly promote raw consolidated-reference TSX into runtime truth
- do not derive backend schemas or API contracts from Figma labels, cards, or table text
- do not treat Figma variable output as token authority; keep repo token files and token-enforcement as the gate
- do not treat token-clean or visually polished output as sufficient if the final TSX still reads like generic SaaS
- do not prioritize motion embellishment ahead of structural wireframe quality

### Figma MCP acceleration decisions

Use the direct page-node inventory in `analysis/2026-03-16-figma-mcp-inventory-and-accelerators.md` as the current evidence source for the connected Figma file.

Adopt now:
- draft build-contract generation from Scaffold nodes
- draft wireframe XML generation or drift-diff support from page structure

Pilot only:
- structural scaffold injection for shell decomposition or scratch scaffolds

Reject for now:
- backend schema generation from Figma text labels
- token auto-reconciliation from Figma variables

These accelerators are allowed only when their outputs stay reviewable, support-only, and subordinate to runtime truth, design truth, and capability truth.

## The Recovery Strategy

The work runs in phases aligned to the blueprint execution steps. Use `control/pm/dashboard.md` for the executive snapshot and `control/pm/phase-plan.yaml` for the phase definitions.

### Phase 1: Fix the planning inputs

Purpose:
- make the existing planning artifacts trustworthy enough to guide implementation

Actions:
- fix the broken capability gap matrix so each tracked capability has a clear status
- align `frontend/scripts/validate-governance-artifacts.mjs` with the Python governance tests
- define token-enforcement expectations for any route or component surface touched by migration work
- keep only the governance artifacts needed to drive implementation under `control/`:
  - `control/route-matrix.json`
  - `control/gap-map.json`
- stop treating governance output as the main deliverable

Acceptance:
- `pytest tests/plans -q` passes
- `node frontend/scripts/validate-governance-artifacts.mjs` catches the same minimum integrity failures as the tests
- token-enforcement expectations are defined for routes and surfaces touched by migration work
- planning artifacts are internally consistent enough to drive implementation sequencing

### Phase 1A: Review skills and scripts infrastructure

Purpose:
- confirm that supporting automation is trustworthy enough to help execute this migration
- prevent custom skills or helper scripts from becoming an unverified second planning system

What must be reviewed:
- custom skills used during migration support:
  - `sprint-coordinator`
  - `frontend-backend-mapper`
  - `api-contract-validator`
  - `migration-audit`
  - `verification-before-completion`
- scripts used as migration gates or inventories:
  - `frontend/scripts/validate-governance-artifacts.mjs`
  - `frontend/scripts/component-inventory.ts`
  - any later route-matrix or component-gap-map validation scripts

Review criteria:
- correct scope for this migration
- no stale assumptions about source of truth
- outputs are compatible with the canonical plan, route matrix, and component gap map
- failures are actionable rather than vague
- tools do not undermine semantic design-token enforcement during migration
- no tool overrides runtime truth, design truth, or backend capability truth with derived artifacts

Acceptance:
- each reviewed skill or script is classified as `approved`, `approved_with_limits`, or `not_fit_for_purpose`
- any `approved_with_limits` item includes exact allowed use
- any `not_fit_for_purpose` item is excluded from migration gates until fixed
- the review is recorded in a tracked artifact in this migration folder

### Phase 2: Wire the real backend features into the live product

Purpose:
- stop leaving real backend capability stranded behind mock or missing UI

Priority order:

#### 2.1 Applications

Target owner:
- `/tracker`

Problem:
- applications CRUD exists in backend; `/tracker` is now wired to the canonical `applicationService` path but still requires live-session verification and final brand signoff before closure

Required outcome:
- the tracker becomes the real owner of application list, detail, edit, and status actions

Next implementation actions:
- ensure no mock fallback remains in the primary runtime path
- add missing detail and status-change flows
- merge any useful `KanbanTracker` or `ApplicationFinalization` ideas into the routed tracker experience rather than creating another parallel surface

#### 2.2 Smart ingestion

Target owner:
- `/career/ingest`

Problem:
- smart-ingestion backend exists, but the frontend does not own a complete guided flow

Required outcome:
- one routed flow covers upload, extraction, tagging or confirmation, and save

Next implementation actions:
- converge on `/api/v1/ingest` as the canonical ingestion contract
- retire or quarantine non-canonical ingestion paths from active frontend planning
- build the full intake flow around the mounted smart-ingestion endpoints

#### 2.3 Voice profile

Target owner:
- `/profile`

Problem:
- voice profile capture is real backend capability but has no clear live owner

Required outcome:
- `/profile` becomes the single canonical surface for voice profile creation and management

Next implementation actions:
- add create and manage voice-profile UI to the profile flow
- keep `/settings` and asset-related surfaces as secondary integrations only if needed

#### 2.4 Documents redline

Target owner:
- `/documents`

Problem:
- backend supports document redline processing but the documents area does not expose a redline workspace

Required outcome:
- the documents route owns redline and review workflows rather than leaving them as latent backend capability

Next implementation actions:
- add redline entry points to the live documents experience
- integrate a review workspace into the routed documents surface instead of creating an isolated duplicate page

#### 2.5 Resume audit

Target owner:
- `/analysis` or a clearly promoted routed audit surface

Problem:
- resume audit capability exists, but routing and history support are incomplete

Required outcome:
- the team makes an explicit choice: either wire a minimum viable audit flow now or defer it until backend support is complete

Next implementation actions:
- decide whether the current audit page is promoted into the live route graph
- if history is missing server-side, ship evaluation-only support first and defer history explicitly

Acceptance for Phase 2:
- each retained backend capability has one clear routed frontend owner
- no high-priority capability remains in "real backend, no live owner" state
- mock-backed placeholders are removed or explicitly deferred

### Phase 3: Repair the wireframe-to-component workflow

Purpose:
- make design references useful again without confusing them with runtime code

Required workflow:
1. identify the live route that currently owns the product surface
2. identify the best matching screen reference
3. compare runtime behavior, design intent, and backend capability
4. audit route-adjacent shared primitives and shell chrome (`Logo`, `Sidebar`, `TopNav`, `Footer`, `AuthGuard`, `KrDarkDock`) so shared-layer drift is recorded before route decisions are made
5. choose one action:
   - keep the current route and upgrade it
   - merge the route with the screen-led reference
   - replace the route with a stronger screen-led implementation
   - retire the screen or route if it should not survive
6. verify the touched route still uses semantic design tokens and does not introduce new hardcoded style values before closing the work item

Priority product areas:
- landing
- dashboard
- analysis
- applications
- documents
- ingestion
- account and profile
- jobs

Required outputs from this phase:
- each major route has one best design reference
- each major screen reference is either promoted, merged, deferred, or retired
- `/kr/*` routes are removed from product truth and treated only as prototype or reference material unless explicitly promoted

Acceptance for Phase 3:
- the team can answer "which screen reference drives this live route?" for every major product area
- no important route remains ambiguous between runtime code and a competing prototype path

### Phase 4: Cleanup after route ownership is stable

Purpose:
- remove duplicates and dead code only after the replacement path is known

Actions:
- remove `/kr/*` routes from the live router after any useful ideas are backported
- clean up duplicate or abandoned screen candidates only after live ownership decisions are made
- sanitize `frontend/src` folder ownership after route-family workflow stabilization:
  - keep route-family runtime code in `features/<family>/**`
  - keep `pages/**` as route entrypoints or thin route shells only
  - keep `screens/**` as design/reference TSX plus wireframe XML only
  - retire or clearly mark `phase3-batch*` and other duplicate/reference-only surfaces
- update inventory and reporting scripts so they show:
  - live routed owner
  - paired screen reference
  - backend dependency
  - mock-backed status
  - retirement candidate status

Acceptance for Phase 4:
- cleanup happens after replacement, not before
- no useful product surface is deleted before a real owner exists
- runtime folder ownership aligns with the route matrix for touched route families without a repo-wide reorg

## Delegation and Status (Project-Manager Overlay)

PM artifacts exist to improve visibility and delegation. They do not override execution truth.

- dashboard: `control/pm/dashboard.md`
- phases and gates: `control/pm/phase-plan.yaml`
- milestones and owners: `control/pm/milestone-tracking.json`
- recommended backlog anchors: `control/implementation-backlog.md`

## Route-Level Priority Table

### Applications
- Current problem: `/tracker` is wired to the real applications API path but still needs live-session verification and final brand gate closure
- Owner route: `/tracker`
- Backend dependency: applications CRUD endpoints
- Next action: ensure no mock fallback remains in the primary runtime path, then close verification and brand gates

### Ingestion
- Current problem: split contracts and incomplete routed flow
- Owner route: `/career/ingest`
- Backend dependency: smart-ingestion endpoints and canonical `/api/v1/ingest`
- Next action: build one complete upload-to-save path and stop planning around duplicate ingestion contracts

### Documents
- Current problem: redline exists in backend but not in live UI
- Owner route: `/documents`
- Backend dependency: documents redline processing
- Next action: add redline and review workspace ownership to the routed documents experience

### Profile and Voice
- Current problem: voice feature exists without a live owner
- Owner route: `/profile`
- Backend dependency: voice profile endpoint
- Next action: add create and manage voice-profile UI

### Analysis and Resume Audit
- Current problem: audit capability is partially stranded
- Owner route: `/analysis` or promoted audit route
- Backend dependency: resume audit evaluation endpoint
- Next action: decide minimum viable routed audit flow and explicitly defer history if backend support is incomplete

### Jobs
- Current problem: route ownership is fragmented between opportunities, queue, and analysis behavior
- Owner route: jobs family routes already in runtime
- Backend dependency: job analysis endpoints
- Next action: decide whether the current jobs surfaces are upgraded in place or merged into a stronger workbench pattern

## What The Team Should Stop Doing

- stop treating migration-kit JSON artifacts as the main design authority
- stop treating governance files as the main definition of progress
- stop creating parallel product surfaces when a live route already exists
- stop leaving important backend capabilities as "someday" items without explicit ownership decisions
- stop keeping `/kr/*` routes live in a way that confuses current product behavior

## Verification

Planning integrity:
- `pytest tests/plans -q`
- `node frontend/scripts/validate-governance-artifacts.mjs`

Execution integrity for each product area:
- confirm the routed page uses the real backend contract
- confirm the routed page has a named design reference or an explicit reason for divergence
- confirm removed mock flows are no longer active
- confirm prototype routes are not being treated as product truth
- confirm touched routes and components still use semantic design tokens rather than new hardcoded values

## Risks And Explicit Deferrals

Key risks:
- the backend may still be incomplete for parts of resume audit or workflow orchestration
- duplicate routes or screens may be deleted too early if ownership decisions are not made first
- the team may keep adding governance layers instead of shipping routed feature ownership
- token drift may be introduced when screen-reference patterns are merged into live routes without semantic token checks
- monorepo dependency drift across frontend, shared tooling, or validation scripts may break incremental route work unless touched areas are re-verified after cleanup
- cleanup may balloon into a broad frontend reorg unless it is explicitly bounded to route-family alignment and duplicate/reference-only surfaces

Allowed deferrals:
- backend-blocked flows can be deferred only if the blocker is explicit and recorded
- lower-value internal or design-system-only capability families can remain out of scope

## Final Definition Of Success

This migration is complete when:
- the most important backend-backed features are reachable in the live app
- each major routed product area has one clear owner
- each major routed product area has one clear design reference or an explicit reason not to
- prototype `/kr/*` routes no longer confuse product truth
- governance artifacts support execution instead of replacing it

## Appendix: Retained Decisions

These decisions from earlier planning still stand unless later implementation work proves they are wrong:
- canonical ingestion contract: `/api/v1/ingest`
- canonical voice ownership: `/profile`
- `/kr/*` routes are not canonical product routes
- governance files remain useful as support artifacts, but not as the primary measure of migration progress
