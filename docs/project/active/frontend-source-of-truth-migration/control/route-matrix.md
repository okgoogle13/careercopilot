# Target-State Route Matrix

**Date:** 2026-03-17
**Status:** Canonical living route-level target-state matrix
**Canonical companion artifacts:**
- `docs/project/active/frontend-source-of-truth-migration/control/blueprint.md`
- `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`

## Purpose

This matrix fills the current planning gap between family-level migration decisions and route-level implementation work.

For each live route, it shows:
- whether the route stays, merges, expands, or retires
- current implementation progress for that route
- which runtime page or feature is canonical
- which screen reference should drive target-state work
- whether that route has route-specific wireframe coverage, shared family coverage, no required wireframe, or a missing wireframe
- which backend capabilities belong to that route
- what this means for the target component library

## Decision Rules

- Prefer existing routes over inventing new top-level routes.
- Treat `/kr/*` routes as prototype-only and retire them from product truth.
- Treat `/design-sidekick`, `/style-guide`, and `/test-tokens` as non-product routes.
- Assign each retained backend-backed capability to one clear route owner.

## Product Routes

| Current Route | Target Route | Family | Status | Implementation Status | Canonical Runtime Surface | Design Reference | XML Wireframe | Wireframe Coverage | Backend Capabilities | Component Library Action | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | `/` | `landing` | `merge` | `complete` | `LandingPage` | `frontend/src/screens/01_landing/HeroLanding.tsx` | `frontend/src/screens/01_landing/01_landing.wireframe.xml` | `route_specific_wireframe` | none | `merge` | Keep the route and backport landing reference patterns into the canonical runtime surface. |
| `/login` | `/login` | `auth-onboarding` | `merge` | `planned` | `Login` | `frontend/src/screens/02_auth/AuthModal.tsx` | `frontend/src/screens/02_auth/02_login.wireframe.xml` | `route_specific_wireframe` | none | `merge` | Keep the route and absorb auth UI patterns from the screen reference, not from `/kr/auth`. |
| `/register` | `/register` | `auth-onboarding` | `merge` | `planned` | `Register` | `frontend/src/screens/02_auth/AuthModal.tsx` | `frontend/src/screens/02_auth/02_register.wireframe.xml` | `route_specific_wireframe` | none | `merge` | Keep the route and align with canonical auth entry patterns. |
| `/onboarding` | `/onboarding` | `auth-onboarding` | `merge` | `complete` | `OnboardingRoute` | `frontend/src/screens/03_onboarding/OnboardFlow.tsx` | `frontend/src/screens/03_onboarding/03_onboarding.wireframe.xml` | `route_specific_wireframe` | `voice_profile_capture` | `merge` | Keep the route-owned welcome gate and pair the onboarding flow to the 03_onboarding shell without promoting `/kr/onboarding`. |
| `/welcome` | `/welcome` | `auth-onboarding` | `merge` | `planned` | `WelcomeScreen` | `frontend/src/screens/03_onboarding/OnboardFlow.tsx` | `frontend/src/screens/03_onboarding/03_welcome.wireframe.xml` | `route_specific_wireframe` | none | `merge` | Keep as part of onboarding progression; align with onboarding flow references. |
| `/dashboard` | `/dashboard` | `dashboard` | `merge` | `complete` | `Dashboard` | `frontend/src/screens/11_dashboard/DashboardOverview.tsx` | `frontend/src/screens/11_dashboard/11_dashboard.wireframe.xml` | `route_specific_wireframe` | `applications_crud`, `smart_ingestion_asset_pipeline` | `merge` | Dashboard stays canonical; merge visual structure only, not a competing route concept. |
| `/analysis` | `/analysis` | `analysis` | `expand` | `complete` | `AnalysisPage` | `frontend/src/screens/05_analysis/AnalysisWorkbench.tsx` | `frontend/src/screens/05_analysis/05_analysis.wireframe.xml` | `route_specific_wireframe` | `resume_audit` | `extend` | Keep route and expand it into the canonical analysis surface. |
| `/asset-library` | `/asset-library` | `analysis` | `expand` | `planned` | `AssetLibrary` | `frontend/src/screens/05_analysis/AnalysisWorkbench.tsx` | `frontend/src/screens/05_analysis/05_asset_library.wireframe.xml` | `route_specific_wireframe` | `smart_ingestion_asset_pipeline` | `extend` | Keep route but clarify it as an analysis-family support surface, not a parallel product tree. |
| `/documents` | `/documents` | `documents` | `expand` | `complete` | `Documents` | `frontend/src/screens/08_workbench/DocumentWorkbench.tsx` | `frontend/src/screens/08_workbench/08_workbench.wireframe.xml` | `route_specific_wireframe` | `documents_redline` | `extend` | This route becomes the owner of redline and review workspace behavior. |
| `/tracker` | `/tracker` | `applications` | `expand` | `planned` | `ApplicationTracker` | `frontend/src/screens/07_kanban/KanbanTracker.tsx` | `frontend/src/screens/07_kanban/07_kanban.wireframe.xml` | `route_specific_wireframe` | `applications_crud` | `extend` | This is the canonical owner of application CRUD, status, and detail flows; runtime truth is aligned and the remaining blocker is local Firebase/Firestore readiness, not route implementation. |
| `/apply/quick` | `/apply/quick` | `applications` | `expand` | `complete` | `ApplyQuick` | `frontend/src/screens/09_finalization/ApplicationFinalization.tsx` | `frontend/src/screens/09_finalization/09_finalization.wireframe.xml` | `route_specific_wireframe` | `applications_crud`, `genkit_job_analysis`, `workflow_orchestration` | `merge` | Keep route as a supporting application flow; do not split it into a new family. |
| `/opportunities` | `/opportunities` | `jobs` | `expand` | `complete` | `Opportunities` | `frontend/src/screens/06_lookout/LookoutDiscovery.tsx` | `frontend/src/screens/06_lookout/06_opportunities.wireframe.xml` | `route_specific_wireframe` | `job_listings_workbench`, `genkit_job_analysis` | `merge` | Keep route and merge stronger lookout/workbench patterns into it. Post-closeout cleanup is limited to tracker-blocked evidence and shell follow-through, not route ownership drift. |
| `/job-queue` | `/job-queue` | `jobs` | `expand` | `complete` | `JobQueue` | `frontend/src/screens/06_lookout/LookoutDiscovery.tsx` | `frontend/src/screens/06_lookout/06_job_queue.wireframe.xml` | `route_specific_wireframe` | `job_listings_workbench` | `merge` | Keep route as a queue/worklist surface inside the jobs family; pair it to the 06_lookout shell while queue actions stay route-owned. |
| `/ksc-generator` | `/ksc-generator` | `generation` | `keep` | `complete` | `KSCGenerator` | `frontend/src/screens/12_generation/GenerationWorkbench.tsx` | `frontend/src/screens/12_generation/12_ksc_generator.wireframe.xml` | `route_specific_wireframe` | none | `merge` | Keep as a dedicated generator route; pair it to the 12_generation shell while generator logic stays route-owned. |
| `/cover-letter-generator` | `/cover-letter-generator` | `generation` | `keep` | `complete` | `CoverLetterGenerator` | `frontend/src/screens/12_generation/GenerationWorkbench.tsx` | `frontend/src/screens/12_generation/12_cover_letter_generator.wireframe.xml` | `route_specific_wireframe` | none | `merge` | Keep as a dedicated generator route; pair it to the 12_generation shell while cover-letter flow stays route-owned. |
| `/profile` | `/profile` | `account` | `expand` | `complete` | `ProfileView` | `frontend/src/screens/10_settings/SettingsControl.tsx` | `frontend/src/screens/10_settings/10_profile.wireframe.xml` | `route_specific_wireframe` | `voice_profile_capture` | `extend` | This is the canonical owner of voice-profile management. |
| `/settings` | `/settings` | `account` | `expand` | `complete` | `Settings` | `frontend/src/screens/10_settings/SettingsControl.tsx` | `frontend/src/screens/10_settings/10_settings.wireframe.xml` | `route_specific_wireframe` | none | `extend` | Keep as a secondary account surface; pair it to the 10_settings shell while voice ownership stays on `/profile`. |
| `/career/ingest` | `/career/ingest` | `ingestion` | `expand` | `complete` | `SmartIngestion` | `frontend/src/screens/04_ingestion/IngestionFlow.tsx` | `frontend/src/screens/04_ingestion/04_ingestion.wireframe.xml` | `route_specific_wireframe` | `smart_ingestion_asset_pipeline`, `artifact_upload_contract`, `duplicate_ingestion_contracts` | `extend` | This is the canonical owner of the ingestion flow and `/api/v1/ingest` contract. |
| `*` | `*` | `fallback` | `keep` | `planned` | `NotFound` | none | none | `internal_no_wireframe_required` | none | `reuse` | Supporting runtime infrastructure only. |

## Non-Product Routes

| Current Route | Target Route | Family | Status | Implementation Status | Canonical Runtime Surface | Design Reference | XML Wireframe | Wireframe Coverage | Backend Capabilities | Component Library Action | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/design-sidekick` | none | `internal-tools` | `retire` | `retired` | `DesignSidekick` | none | none | `internal_no_wireframe_required` | none | `retire` | Keep available only as internal tooling if needed; exclude from product target state. |
| `/style-guide` | none | `internal-tools` | `retire` | `retired` | `StyleGuide` | none | none | `internal_no_wireframe_required` | none | `retire` | Treat as internal reference only, not a production route. |
| `/test-tokens` | none | `internal-tools` | `retire` | `retired` | `TokenTest` | none | none | `internal_no_wireframe_required` | none | `retire` | Debug surface only; not part of target product route map. |

## Prototype Routes To Retire

| Current Route | Target Route | Family | Status | Implementation Status | Canonical Runtime Surface | Design Reference | XML Wireframe | Wireframe Coverage | Backend Capabilities | Component Library Action | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/kr/landing` | none | `landing-prototype` | `retire` | `retired` | `HeroLanding` | `frontend/src/screens/01_landing/HeroLanding.tsx` | `frontend/src/screens/01_landing/01_landing.wireframe.xml` | `shared_family_wireframe` | none | `retire` | Keep only as reference material until useful patterns are merged into `/`. |
| `/kr/auth` | none | `landing-prototype` | `retire` | `retired` | `AuthModal` | `frontend/src/screens/02_auth/AuthModal.tsx` | `frontend/src/screens/02_auth/02_auth.wireframe.xml` | `shared_family_wireframe` | none | `retire` | Do not treat as product auth ownership. |
| `/kr/onboarding` | none | `landing-prototype` | `retire` | `retired` | `OnboardFlow` | `frontend/src/screens/03_onboarding/OnboardFlow.tsx` | `frontend/src/screens/03_onboarding/03_onboarding.wireframe.xml` | `shared_family_wireframe` | none | `retire` | Keep only as reference for onboarding improvements. |
| `/kr/analysis` | none | `landing-prototype` | `retire` | `retired` | `AnalysisWorkbench` | `frontend/src/screens/05_analysis/AnalysisWorkbench.tsx` | `frontend/src/screens/05_analysis/05_analysis.wireframe.xml` | `shared_family_wireframe` | none | `retire` | Merge any useful ideas into `/analysis` instead of promoting this route. |
| `/kr/dashboard` | none | `landing-prototype` | `retire` | `retired` | `DashboardOverview` | `frontend/src/screens/11_dashboard/DashboardOverview.tsx` | `frontend/src/screens/11_dashboard/11_dashboard.wireframe.xml` | `shared_family_wireframe` | none | `retire` | Merge reference patterns into `/dashboard`; retire the route. |

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
- `SmartIngestion`
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

## Wireframe Coverage Gaps

### Product routes with no XML wireframe yet

- None currently.

### Routes that intentionally do not require XML wireframes

- `*`
- `/design-sidekick`
- `/style-guide`
- `/test-tokens`



## Matrix Gaps Still Blocking Full Implementation

- `workflow_orchestration` backend endpoints now exist, but `/apply/quick` is still not wired to the new workflow status flow and workflow tests still target the old disabled contract
- `resume_audit` history backend support exists, but the canonical analysis runtime still does not render persisted history
- `/analysis` and `/asset-library` ownership boundaries still need implementation cleanup even though the target routes are now locked
- active career-ingestion callers now converge on `/api/v1/ingest`; `/api/ingest/artifacts/upload` and `/api/ingestion/*` remain specialized endpoint families

Resolved note:
- `genkit_job_analysis` is complete in the capability map; do not reopen it as a migration blocker
