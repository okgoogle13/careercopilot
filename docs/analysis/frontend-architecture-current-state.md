# Frontend Architecture Current State

Generated from `App.tsx` and the current ts-morph snapshot. This is the phase-1 architecture cleanup baseline for route ownership, duplicate surfaces, and consolidation planning.

## Summary

- Live routes: 27
- Distinct route families: 13
- Likely pages/screens in snapshot: 17
- Routed likely pages/screens: 10
- Unrouted likely pages/screens: 7
- Prototype `/kr/*` routes: 5

## Route Families

- `account`: 2 routes — `/settings`, `/profile`
- `analysis`: 3 routes — `/kr/analysis`, `/analysis`, `/asset-library`
- `applications`: 2 routes — `/tracker`, `/apply/quick`
- `auth-onboarding`: 6 routes — `/login`, `/register`, `/kr/auth`, `/kr/onboarding`, `/onboarding`, `/welcome`
- `dashboard`: 2 routes — `/kr/dashboard`, `/dashboard`
- `documents`: 1 routes — `/documents`
- `fallback`: 1 routes — `*`
- `generation`: 2 routes — `/ksc-generator`, `/cover-letter-generator`
- `ingestion`: 1 routes — `/career/ingest`
- `internal-tools`: 3 routes — `/design-sidekick`, `/style-guide`, `/test-tokens`
- `jobs`: 2 routes — `/opportunities`, `/job-queue`
- `landing`: 1 routes — `/`
- `landing-prototype`: 1 routes — `/kr/landing`

## Bucket Distribution

- `screens`: 11 files, 22 exported components, 22 likely pages/screens
- `features`: 52 files, 74 exported components, 0 likely pages/screens
- `pages`: 6 files, 10 exported components, 10 likely pages/screens
- `components`: 89 files, 110 exported components, 0 likely pages/screens

## Route Ownership Matrix

| Route | Current Owner | Family | Layer | Bucket | Candidate Replacement |
| --- | --- | --- | --- | --- | --- |
| `/` | `LandingPage` | `landing` | `runtime` | `features` | — |
| `/login` | `Login` | `auth-onboarding` | `runtime` | `features` | — |
| `/register` | `Register` | `auth-onboarding` | `runtime` | `features` | — |
| `/design-sidekick` | `DesignSidekick` | `internal-tools` | `internal` | `features` | — |
| `/style-guide` | `StyleGuide` | `internal-tools` | `internal` | `features` | — |
| `/kr/landing` | `HeroLanding` | `landing-prototype` | `prototype` | `components` | — |
| `/kr/auth` | `AuthModal` | `auth-onboarding` | `prototype` | `components` | — |
| `/kr/onboarding` | `OnboardFlow` | `auth-onboarding` | `prototype` | `components` | — |
| `/kr/analysis` | `AnalysisWorkbench` | `analysis` | `prototype` | `components` | — |
| `/kr/dashboard` | `DashboardOverview` | `dashboard` | `prototype` | `components` | — |
| `*` | `NotFound` | `fallback` | `runtime` | `features` | — |
| `/dashboard` | `Dashboard` | `dashboard` | `runtime` | `features` | — |
| `/onboarding` | `OnboardingRoute` | `auth-onboarding` | `runtime` | `unknown` | — |
| `/welcome` | `WelcomeScreen` | `auth-onboarding` | `runtime` | `features` | — |
| `/tracker` | `ApplicationTracker` | `applications` | `runtime` | `features` | `KanbanTracker`, `ApplicationFinalization` |
| `/documents` | `Documents` | `documents` | `runtime` | `features` | `DocumentWorkbench` |
| `/analysis` | `AnalysisPage` | `analysis` | `runtime` | `pages` | — |
| `/opportunities` | `Opportunities` | `jobs` | `runtime` | `features` | `LookoutDiscovery` |
| `/ksc-generator` | `KSCGenerator` | `generation` | `runtime` | `features` | — |
| `/cover-letter-generator` | `CoverLetterGenerator` | `generation` | `runtime` | `features` | — |
| `/settings` | `Settings` | `account` | `runtime` | `features` | `SettingsControl` |
| `/profile` | `ProfileView` | `account` | `runtime` | `features` | — |
| `/asset-library` | `AssetLibrary` | `analysis` | `runtime` | `features` | — |
| `/career/ingest` | `IngestionPage` | `ingestion` | `runtime` | `pages` | `IngestionFlow` |
| `/job-queue` | `JobQueue` | `jobs` | `runtime` | `pages` | `LookoutDiscovery` |
| `/apply/quick` | `ApplyQuick` | `applications` | `runtime` | `pages` | `KanbanTracker`, `ApplicationFinalization` |
| `/test-tokens` | `TokenTest` | `internal-tools` | `internal` | `components` | — |

## Duplicate Surface Signals

- `AnalysisWorkbench` appears in `components/phase3-batch3/AnalysisWorkbench.tsx`, `screens/05_analysis/AnalysisWorkbench.tsx`
- `ApplicationCard` appears in `components/shared/ApplicationCard.tsx`, `features/applications/ApplicationCard.tsx`
- `ApplicationFinalization` appears in `components/phase3-batch3/ApplicationFinalization.tsx`, `screens/09_finalization/ApplicationFinalization.tsx`
- `ApplicationTracker` appears in `features/applications/ApplicationTracker.tsx`, `features/applications/components/ApplicationTracker.tsx`
- `AuthModal` appears in `components/phase3-batch2/AuthModal.tsx`, `screens/02_auth/AuthModal.tsx`
- `Dashboard` appears in `features/dashboard/Dashboard.tsx`, `pages/Dashboard.tsx`
- `DashboardOverview` appears in `components/phase3-batch3/DashboardOverview.tsx`, `screens/11_dashboard/DashboardOverview.tsx`
- `DocumentWorkbench` appears in `components/phase3-batch3/DocumentWorkbench.tsx`, `screens/08_workbench/DocumentWorkbench.tsx`
- `GlassLeafCard` appears in `features/gallery/GlassLeafCard.tsx`, `features/KrDark/GlassLeafCard.tsx`
- `HeroLanding` appears in `components/phase3-batch2/HeroLanding.tsx`, `screens/01_landing/HeroLanding.tsx`

## Unrouted Screen Candidates

- `ResumeAuditPage` in `pages/ResumeAuditPage.tsx` (pages)
- `IngestionFlow` in `screens/04_ingestion/IngestionFlow.tsx` (screens)
- `LookoutDiscovery` in `screens/06_lookout/LookoutDiscovery.tsx` (screens)
- `KanbanTracker` in `screens/07_kanban/KanbanTracker.tsx` (screens)
- `DocumentWorkbench` in `screens/08_workbench/DocumentWorkbench.tsx` (screens)
- `ApplicationFinalization` in `screens/09_finalization/ApplicationFinalization.tsx` (screens)
- `SettingsControl` in `screens/10_settings/SettingsControl.tsx` (screens)

## Routed God-Component Candidates

- `StyleGuide` (`/style-guide`) — 1021 lines, 8 imports, 59 JSX tags
- `KSCGenerator` (`/ksc-generator`) — 499 lines, 12 imports, 28 JSX tags
- `CoverLetterGenerator` (`/cover-letter-generator`) — 426 lines, 11 imports, 33 JSX tags
- `AnalysisPage` (`/analysis`) — 425 lines, 14 imports, 23 JSX tags
- `Dashboard` (`/dashboard`) — 423 lines, 11 imports, 19 JSX tags
- `JobQueue` (`/job-queue`) — 321 lines, 12 imports, 10 JSX tags
- `Register` (`/register`) — 266 lines, 9 imports, 3 JSX tags
- `ApplicationTracker` (`/tracker`) — 261 lines, 11 imports, 12 JSX tags
- `IngestionPage` (`/career/ingest`) — 250 lines, 17 imports, 14 JSX tags

## Primary Smells

- 21 component names exist in multiple files.
- 7 likely page/screen components are currently unrouted.
- 5 live routes sit under the prototype /kr namespace.
- 9 routed surfaces exceed the god-component threshold.
