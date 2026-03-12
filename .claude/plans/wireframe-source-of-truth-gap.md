# Wireframe Source-Of-Truth Gap

## Updated Framing

The problem is broader than wireframes. The frontend currently has drift across three separate truth systems:

1. `frontend/src/screens/**/*.wireframe.xml` plus paired `frontend/src/screens/**/*.tsx`
2. live runtime routes in `frontend/src/features/**` and `frontend/src/pages/**`
3. backend API capabilities, some of which are real, some placeholder, and some unmounted

The migration-kit JSON wireframes are a fourth, reduced derivative layer and should not be treated as primary authority.

The key architectural mistake would be treating any single layer as universal truth. The repo currently requires explicit distinction between:
- design truth
- runtime truth
- capability truth

## Current Frontend State

From the current route extraction and ts-morph-derived architecture report:

- live routes: 27
- distinct route families: 13
- likely pages/screens identified: 17
- likely pages/screens currently routed: 10
- likely pages/screens currently unrouted: 7
- live prototype `/kr/*` routes: 5

Current bucket distribution:

- `screens`: 11 files, 22 exported components, 22 likely page/screen surfaces
- `features`: 52 files, 74 exported components
- `pages`: 6 files, 10 exported components, 10 likely page/screen surfaces
- `components`: 89 files, 110 exported components

This means the frontend is not one coherent tree. It is a layered estate with:

- live route implementations
- design/reference screens
- prototype `/kr/*` routes
- duplicate and unrouted surfaces

## What The Ts-Morph And Route Review Confirm

### Runtime truth

The currently reachable product is defined by `frontend/src/App.tsx` and is organized into these live families:

- landing
- auth-onboarding
- dashboard
- analysis
- documents
- applications
- jobs
- generation
- account
- ingestion

These families are the current runtime baseline because users can actually reach them.

### Design truth

The strongest design lineage still appears to be:

- `frontend/src/screens/**/*.wireframe.xml`
- paired `frontend/src/screens/**/*.tsx`
- related mapped screen assets and screen-map references

This layer is the best design/reference source, but it is not the current runtime source.

### Prototype drift

There are still 5 live `/kr/*` routes:

- `/kr/landing`
- `/kr/auth`
- `/kr/onboarding`
- `/kr/analysis`
- `/kr/dashboard`

These routes materially increase ambiguity because they make prototype or reference surfaces reachable alongside the runtime app.

### Unrouted candidate surfaces

The current review identified these high-signal unrouted candidates:

- `ResumeAuditPage`
- `IngestionFlow`
- `LookoutDiscovery`
- `KanbanTracker`
- `DocumentWorkbench`
- `ApplicationFinalization`
- `SettingsControl`

These are important because they represent target-state pressure without being integrated into the live route model.

## Backend Capability Truth

The backend does not just support the current routed UI. It also exposes capabilities that are either:

- unwired in the current frontend
- only represented by mock UI
- split across duplicate contracts
- present in code but not mounted

The machine-readable gap matrix now lives at:

- `.claude/plans/frontend-capability-gap-matrix.json`

High-signal capability findings:

### Strong missing product surfaces

- `applications` CRUD is real in backend, but `/tracker` is still mock-backed
- `documents/process/redline` exists, but no live review/redline UI owns it
- `smart-ingestion` exists, but no live routed multi-step intake flow consumes it
- `voice-profile` is real and should be retained, but has no current live frontend owner
- `resume-audit/evaluate` exists, but history support is incomplete

### Contract consolidation problems

- ingestion is currently split across:
  - `/api/v1/ingest`
  - `/api/career/ingest`
  - `/api/ingest/artifacts/upload`
- one of those endpoints exists on disk but is not mounted in the live API

### Lower-value or non-product capability surfaces

- `asset-review/*`
- `manifest-integration/*`

These look more like internal admin or design-system tooling than target end-user screens.

## Updated Interpretation

The repo is not suffering from a single “wrong wireframe source.” It is suffering from coordinated drift between:

- screen-pipeline design artifacts
- live routed product implementation
- backend capability coverage

That means route planning and migration decisions cannot be made from wireframes alone.

The correct decision model is:

- `screens/*.wireframe.xml` + paired `screens/*.tsx` = design truth
- `features/**` + `pages/**` reached by `App.tsx` = runtime truth
- mounted backend endpoints with validated product relevance = capability truth

The migration-kit JSON wireframes remain derivative and should not be primary authority.

## Updated Route-Family Guidance

### Good consolidation candidates

- `dashboard`
  - design reference: `frontend/src/screens/11_dashboard/DashboardOverview.tsx`
  - runtime truth: `frontend/src/features/dashboard/Dashboard.tsx`

- `landing`
  - design reference: `frontend/src/screens/01_landing/HeroLanding.tsx`
  - runtime truth: `frontend/src/features/landing/LandingPage.tsx`

- `analysis`
  - design reference: `frontend/src/screens/05_analysis/AnalysisWorkbench.tsx`
  - runtime truth: `frontend/src/pages/AnalysisPage.tsx`

- `settings`
  - design reference: `frontend/src/screens/10_settings/SettingsControl.tsx`
  - runtime truth: `frontend/src/features/settings/Settings.tsx`

### Families that require concept decisions before consolidation

- `documents`
  - current runtime route and `DocumentWorkbench` do not yet read as the same product

- `applications`
  - current runtime route is mock-backed while screen candidates imply a richer kanban/finalization model

- `jobs`
  - current runtime is split between `Opportunities` and `JobQueue`, while screen candidates imply a stronger lookout/workbench pattern

- `ingestion`
  - design/runtime/backend all disagree on the canonical contract and surface area

- `profile/voice`
  - the backend capability is real, but the route ownership is unresolved

## Voice Capability Decision

Voice should be treated as retained target-state functionality, not as a cleanup casualty.

Current state:

- backend supports voice profile creation through `/api/auth/voice-profile`
- smart ingestion also supports `documentType = voice`
- frontend schemas already recognize voice assets
- no live routed screen currently owns creation or management of voice profiles

Implication:

- target state should explicitly include voice profile creation and management
- likely ownership is either:
  - `/profile`
  - `/settings`
  - or a unified asset/ingestion flow under `/asset-library`

This must be decided intentionally rather than left as latent backend capability.

## Recommendation

### Recommended default: Selective Salvage plus Capability Audit

Keep using the runtime app as the baseline product truth, use the screen pipeline as the design reference, and use the backend capability matrix to decide which missing surfaces belong in target state.

Why:

- it preserves the live route graph as the baseline users actually experience
- it avoids promoting unrouted screen candidates automatically
- it prevents false confidence from backend endpoints that do not yet have product ownership
- it lets voice, smart ingestion, and applications be treated as explicit target-state decisions instead of accidental leftovers

## Immediate Next Steps

1. Freeze new migration-kit route expansion.
2. Treat `App.tsx` route families as the runtime baseline.
3. For each family, compare:
   - runtime route
   - screen-pipeline reference
   - backend capability support
4. Classify each family as:
   - keep
   - expand
   - merge
   - replace
   - retire
5. Resolve the ingestion contract split before any further ingestion migration.
6. Assign explicit route ownership for voice profile functionality.
7. Use the machine-readable gap matrix to drive the next target-state route and component map.

## Decision Guide

Choose **runtime-first consolidation** when:

- the route is live
- the feature already works end-to-end
- the screen layer is mainly a design reference

Choose **screen-led replacement** when:

- the live route is thin, mock-backed, or conceptually incomplete
- the screen candidate clearly represents the same product concept better

Choose **capability-led addition** when:

- the backend capability is real and product-relevant
- the live frontend has no owner
- the feature belongs in target state

Current examples of capability-led additions:

- applications detail/edit flows
- smart ingestion flow
- voice profile creation and management
- document redline workspace
- resume audit history
- you are prepared for a broader stabilization effort
