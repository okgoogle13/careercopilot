# Target-State Route Matrix

**Date:** 2026-03-13
**Status:** Proposed route-level target-state matrix
**Canonical companion artifacts:**
- `docs/project/active/frontend-source-of-truth-migration/2026-03-13-proposed-final-migration-plan.md`
- `docs/project/active/frontend-source-of-truth-migration/2026-03-13-target-state-route-matrix.json`

## Purpose

This matrix fills the current planning gap between family-level migration decisions and route-level implementation work.

For each live route, it shows:
- whether the route stays, merges, expands, or retires
- current implementation progress for that route
- which runtime page or feature is canonical
- which screen reference should drive target-state work
- which backend capabilities belong to that route
- what this means for the target component library

## Decision Rules

- Prefer existing routes over inventing new top-level routes.
- Treat `/kr/*` routes as prototype-only and retire them from product truth.
- Treat `/design-sidekick`, `/style-guide`, and `/test-tokens` as non-product routes.
- Assign each retained backend-backed capability to one clear route owner.

## Product Routes

| Current Route | Target Route | Family | Status | Implementation Status | Canonical Runtime Surface | Design Reference | Backend Capabilities | Component Library Action | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | `/` | `landing` | `merge` | `planned` | `LandingPage` | `frontend/src/screens/01_landing/HeroLanding.tsx` | none | `merge` | Keep the route and backport layout/token patterns from the landing screen reference. |
| `/login` | `/login` | `auth-onboarding` | `merge` | `planned` | `Login` | `frontend/src/screens/02_auth/AuthModal.tsx` | none | `merge` | Keep the route and absorb auth UI patterns from the screen reference, not from `/kr/auth`. |
| `/register` | `/register` | `auth-onboarding` | `merge` | `planned` | `Register` | `frontend/src/screens/02_auth/AuthModal.tsx` | none | `merge` | Keep the route and align with canonical auth entry patterns. |
| `/onboarding` | `/onboarding` | `auth-onboarding` | `merge` | `planned` | `OnboardingRoute` | `frontend/src/components/phase3-batch2/OnboardFlow.tsx` | `voice_profile_capture` | `merge` | Keep the route and selectively merge onboarding flow ideas without promoting `/kr/onboarding`. |
| `/welcome` | `/welcome` | `auth-onboarding` | `merge` | `planned` | `WelcomeScreen` | `frontend/src/components/phase3-batch2/OnboardFlow.tsx` | none | `merge` | Keep as part of onboarding progression; align with onboarding flow references. |
| `/dashboard` | `/dashboard` | `dashboard` | `merge` | `planned` | `Dashboard` | `frontend/src/screens/11_dashboard/DashboardOverview.tsx` | `applications_crud`, `smart_ingestion_asset_pipeline` | `merge` | Dashboard stays canonical; merge visual structure only, not a competing route concept. |
| `/analysis` | `/analysis` | `analysis` | `expand` | `planned` | `AnalysisPage` | `frontend/src/screens/05_analysis/AnalysisWorkbench.tsx` | `resume_audit` | `extend` | Keep route and expand it into the canonical analysis surface. |
| `/asset-library` | `/asset-library` | `analysis` | `expand` | `planned` | `AssetLibrary` | `frontend/src/screens/05_analysis/AnalysisWorkbench.tsx` | `smart_ingestion_asset_pipeline` | `extend` | Keep route but clarify it as an analysis-family support surface, not a parallel product tree. |
| `/documents` | `/documents` | `documents` | `expand` | `planned` | `Documents` | `frontend/src/screens/08_workbench/DocumentWorkbench.tsx` | `documents_redline` | `extend` | This route becomes the owner of redline and review workspace behavior. |
| `/tracker` | `/tracker` | `applications` | `expand` | `planned` | `ApplicationTracker` | `frontend/src/screens/07_kanban/KanbanTracker.tsx` | `applications_crud` | `extend` | This is the canonical owner of application CRUD, status, and detail flows. |
| `/apply/quick` | `/apply/quick` | `applications` | `expand` | `planned` | `ApplyQuick` | `frontend/src/screens/09_finalization/ApplicationFinalization.tsx` | `applications_crud`, `genkit_job_analysis`, `workflow_orchestration` | `merge` | Keep route as a supporting application flow; do not split it into a new family. |
| `/opportunities` | `/opportunities` | `jobs` | `expand` | `planned` | `Opportunities` | `frontend/src/screens/06_lookout/LookoutDiscovery.tsx` | `job_listings_workbench`, `genkit_job_analysis` | `merge` | Keep route and merge stronger lookout/workbench patterns into it. |
| `/job-queue` | `/job-queue` | `jobs` | `expand` | `planned` | `JobQueue` | `frontend/src/screens/06_lookout/LookoutDiscovery.tsx` | `job_listings_workbench` | `merge` | Keep route as a queue/worklist surface inside the jobs family. |
| `/ksc-generator` | `/ksc-generator` | `generation` | `keep` | `planned` | `KSCGenerator` | none | none | `reuse` | Keep as a dedicated generator route; no stronger screen-led replacement currently exists. |
| `/cover-letter-generator` | `/cover-letter-generator` | `generation` | `keep` | `planned` | `CoverLetterGenerator` | none | none | `reuse` | Keep as a dedicated generator route; improve handoff, not route structure. |
| `/profile` | `/profile` | `account` | `expand` | `planned` | `ProfileView` | `frontend/src/screens/10_settings/SettingsControl.tsx` | `voice_profile_capture` | `extend` | This is the canonical owner of voice-profile management. |
| `/settings` | `/settings` | `account` | `expand` | `planned` | `Settings` | `frontend/src/screens/10_settings/SettingsControl.tsx` | none | `extend` | Keep as a secondary account surface; do not move voice ownership here by default. |
| `/career/ingest` | `/career/ingest` | `ingestion` | `expand` | `planned` | `IngestionPage` | `frontend/src/screens/04_ingestion/IngestionFlow.tsx` | `smart_ingestion_asset_pipeline`, `artifact_upload_contract`, `duplicate_ingestion_contracts` | `extend` | This is the canonical owner of the ingestion flow and `/api/v1/ingest` contract. |
| `*` | `*` | `fallback` | `keep` | `planned` | `NotFound` | none | none | `reuse` | Supporting runtime infrastructure only. |

## Non-Product Routes

| Current Route | Target Route | Family | Status | Implementation Status | Canonical Runtime Surface | Design Reference | Backend Capabilities | Component Library Action | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/design-sidekick` | none | `internal-tools` | `retire` | `planned` | `DesignSidekick` | none | none | `retire` | Keep available only as internal tooling if needed; exclude from product target state. |
| `/style-guide` | none | `internal-tools` | `retire` | `planned` | `StyleGuide` | none | none | `retire` | Treat as internal reference only, not a production route. |
| `/test-tokens` | none | `internal-tools` | `retire` | `planned` | `TokenTest` | none | none | `retire` | Debug surface only; not part of target product route map. |

## Prototype Routes To Retire

| Current Route | Target Route | Family | Status | Implementation Status | Canonical Runtime Surface | Design Reference | Backend Capabilities | Component Library Action | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/kr/landing` | none | `landing-prototype` | `retire` | `planned` | `HeroLanding` | `frontend/src/screens/01_landing/HeroLanding.tsx` | none | `retire` | Keep only as reference material until useful patterns are merged into `/`. |
| `/kr/auth` | none | `landing-prototype` | `retire` | `planned` | `AuthModal` | `frontend/src/screens/02_auth/AuthModal.tsx` | none | `retire` | Do not treat as product auth ownership. |
| `/kr/onboarding` | none | `landing-prototype` | `retire` | `planned` | `OnboardFlow` | `frontend/src/components/phase3-batch2/OnboardFlow.tsx` | none | `retire` | Keep only as reference for onboarding improvements. |
| `/kr/analysis` | none | `landing-prototype` | `retire` | `planned` | `AnalysisWorkbench` | `frontend/src/screens/05_analysis/AnalysisWorkbench.tsx` | none | `retire` | Merge any useful ideas into `/analysis` instead of promoting this route. |
| `/kr/dashboard` | none | `landing-prototype` | `retire` | `planned` | `DashboardOverview` | `frontend/src/screens/11_dashboard/DashboardOverview.tsx` | none | `retire` | Merge reference patterns into `/dashboard`; retire the route. |

## Target Component Library Summary

### Canonical route-owned surfaces

- `LandingPage`
- `Login`, `Register`, `OnboardingRoute`, `WelcomeScreen`
- `Dashboard`
- `AnalysisPage`, `AssetLibrary`
- `Documents`
- `ApplicationTracker`, `ApplyQuick`
- `Opportunities`, `JobQueue`
- `KSCGenerator`, `CoverLetterGenerator`
- `ProfileView`, `Settings`
- `IngestionPage`
- `NotFound`

### Reference-only surfaces after migration

- `HeroLanding`
- `AuthModal`
- `DashboardOverview`
- `AnalysisWorkbench`
- `KanbanTracker`
- `ApplicationFinalization`
- `DocumentWorkbench`
- `IngestionFlow`
- `SettingsControl`
- `LookoutDiscovery`
- `OnboardFlow`

### High-priority capability ownership decisions now made explicit

- applications CRUD → `/tracker`
- smart ingestion flow → `/career/ingest`
- voice profile management → `/profile`
- document redline workspace → `/documents`
- resume audit → `/analysis` as default owner unless a stronger dedicated route is later promoted

## Matrix Gaps Still Blocking Full Implementation

- `genkit_job_analysis` still lacks a normalized `resolution_status` entry in the capability matrix
- workflow orchestration remains backend-placeholder work, so `/apply/quick` can only partially own that flow
- resume audit history remains deferred until backend support is complete
- analysis and asset-library ownership boundaries still need implementation cleanup even though the target routes are now locked
- ingestion clients are still fragmented across `/api/v1/ingest`, `/api/career/ingest`, `/api/ingest/artifacts/upload`, and `/api/ingestion/*`
