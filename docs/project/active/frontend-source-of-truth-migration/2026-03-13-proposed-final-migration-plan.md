# Proposed Final Migration Plan

**Date:** 2026-03-13
**Status:** Proposed consolidated plan
**Canonical location:** `docs/project/active/frontend-source-of-truth-migration/2026-03-13-proposed-final-migration-plan.md`
**Supersedes for active planning:**
- `.claude/plans/2026-03-12-production-readiness-corrective-workflow-design.md`
- `.claude/plans/2026-03-12-frontend-source-of-truth-migration.md`
- `.claude/plans/2026-03-12-migration-critique.md`
- `.claude/plans/wireframe-source-of-truth-gap.md`

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

## The Recovery Strategy

The work should run in four phases. The first phase is a planning cleanup phase; the next three are execution-driven.

### Phase 1: Fix the planning inputs

Purpose:
- make the existing planning artifacts trustworthy enough to guide implementation

Actions:
- fix the broken capability gap matrix so each tracked capability has a clear status
- align `frontend/scripts/validate-governance-artifacts.mjs` with the Python governance tests
- define token-enforcement expectations for any route or component surface touched by migration work
- keep only the governance artifacts needed to drive implementation:
  - `.claude/route-family-map.json`
  - `.claude/plans/frontend-capability-gap-matrix.json`
  - `.claude/plans/route-family-target-state.json`
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
- applications CRUD exists in backend but the main tracker surface is still effectively mock-backed

Required outcome:
- the tracker becomes the real owner of application list, detail, edit, and status actions

Next implementation actions:
- replace mock-backed data flow with real backend reads and writes
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
4. choose one action:
   - keep the current route and upgrade it
   - merge the route with the screen-led reference
   - replace the route with a stronger screen-led implementation
   - retire the screen or route if it should not survive
5. verify the touched route still uses semantic design tokens and does not introduce new hardcoded style values before closing the work item

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
- update inventory and reporting scripts so they show:
  - live routed owner
  - paired screen reference
  - backend dependency
  - mock-backed status
  - retirement candidate status

Acceptance for Phase 4:
- cleanup happens after replacement, not before
- no useful product surface is deleted before a real owner exists

## Route-Level Priority Table

### Applications
- Current problem: backend exists, frontend still acts like a mock surface
- Owner route: `/tracker`
- Backend dependency: applications CRUD endpoints
- Next action: replace mock data path and add detail, edit, and status actions

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
