# KR Solidarity Prototype Harvest: Component Inventory

**Inventory Version**: `1.0.0`
**Design System Compatibility**: `KR Solidarity v6.1`
**Status**: `HARVEST-READY`
**Last Sweep**: 2026-03-26
**Authority Inputs**: `control/COMET-MANIFEST.md`, `control/archive/route-matrix.json`, `docs/manifests/prototype-features-cleanup-map.json`
**Inventory Scope**: support-reference harvest planning only; this catalog does not override runtime truth, design truth, capability truth, or route contracts

## Unified Harvest Metadata Matrix

This table summarizes route ownership, dominant archetypes, and current route-matrix implementation status for harvest planning.

| Route Path | Dominant Archetypes | Component Tier | Route-Matrix Status |
| :--- | :--- | :--- | :--- |
| `/` | `Substrate`, `Strike` | Core UI | `complete` |
| `/career/ingest` | `Scaffold`, `Strike`, `Placard` | Interaction Layer | `complete` |
| `/analysis` | `Placard`, `Strike`, `Scaffold` | Data Visualization | `complete` |
| `/opportunities` | `Scaffold`, `March`, `Placard` | Selection / Flow | `complete` |
| `/tracker` | `Scaffold`, `Placard` | Dashboard / Status | `complete_deferred_verification` |
| `/documents` | `Scaffold`, `Placard`, `Strike` | CRUD / Artifacts | `complete` |
| `/apply/quick` | `Strike`, `Megaphone`, `Scaffold` | Modal / Intent | `complete` |
| `/profile` | `Scaffold`, `Strike` | User / Settings | `complete` |
| `/job-queue` | `Scaffold`, `Placard` | Background Task | `complete` |
| `/cover-letter-generator` | `Scaffold`, `Placard`, `Strike` | Generation Flow | `complete` |
| `/ksc-generator` | `Scaffold`, `Placard`, `Strike` | Generation Flow | `complete` |

---

## `/profile` — Voice Profile & Career Data

| Field | Value |
| --- | --- |
| **Canonical Owner** | `/profile` |
| **Contract** | `build-contract-profile.xml` |
| **Prototype Source** | `src/pages/ProfileView.tsx` |
| **Dominant Archetypes** | `Scaffold`, `Strike` |
| **Reusable Patterns** | Tabbed career data editor (Personal Info, Experience, Education, Skills, Achievements), section-level save affordances, structured achievement entry |
| **Blocked Assumptions** | Firebase/Firestore data layer, `activeTab` shell navigation |
| **Harvest Notes** | Strip Firebase read/write hooks. Replace with TanStack Query + FastAPI endpoints. Voice profile CTA must point to `/profile`, not Settings. |

---

## `/analysis` — Match Analysis Dashboard

| Field | Value |
| --- | --- |
| **Canonical Owner** | `/analysis` |
| **Contract** | `build-contract-analysis.xml` |
| **Prototype Source** | `src/pages/ImageStudioPage.tsx`, `src/components/feature/AiOutputsTabs.tsx` |
| **Dominant Archetypes** | `Placard`, `Strike`, `Scaffold` |
| **Reusable Patterns** | Fit score display, skill gap grid (Strong/Partial/Missing), KSC response panel, AI outputs tab layout, "Teach the AI your voice" onboarding nudge |
| **Blocked Assumptions** | Settings-based voice profile CTA (fixed), Firebase auth session, `activeTab` shell routing |
| **Harvest Notes** | `AiOutputsTabs.tsx` contains the tab switching logic for KSC/resume/cover letter outputs — high-value interior pattern. Voice CTA now correctly points to `/profile`. |

---

## `/apply/quick` — Quick-Apply Workspace

| Field | Value |
| --- | --- |
| **Canonical Owner** | `/apply/quick` |
| **Contract** | `build-contract-apply-quick.xml` |
| **Prototype Source** | `src/pages/ApplyQuickWorkspaceReference.tsx`, `src/pages/QuickApply.tsx`, `src/components/feature/JobInputPanel.tsx`, `src/components/feature/SaveApplicationBar.tsx` |
| **Dominant Archetypes** | `Strike`, `Megaphone`, `Scaffold` |
| **Reusable Patterns** | Job description input panel, job parsing trigger flow, match analysis progress state, save-application affordance, workspace split-pane layout |
| **Blocked Assumptions** | `react-router-dom` navigation, Firebase job storage, Chrome Extension job-clip entry point |
| **Harvest Notes** | `JobInputPanel.tsx` and `SaveApplicationBar.tsx` are clean interior components. Strip routing and Firebase assumptions. Extension entry point is quarantined (not a harvest target). |

---

## `/tracker` — Application Tracker

| Field | Value |
| --- | --- |
| **Canonical Owner** | `/tracker` |
| **Contract** | `build-contract-tracker.xml` |
| **Prototype Source** | `src/components/feature/KanbanTracker.tsx` |
| **Dominant Archetypes** | `Scaffold`, `Placard` |
| **Reusable Patterns** | Kanban board layout, status column model (Applied, Interview, Offer, Rejected), drag-and-drop card interactions |
| **Blocked Assumptions** | Firebase real-time sync, `activeTab` shell context |
| **Harvest Notes** | Kanban card structure and column layout are reusable. Replace Firebase listeners with TanStack Query polling or WebSocket where real-time is required. |

---

## `/opportunities` — Job Opportunities Worklist

| Field | Value |
| --- | --- |
| **Canonical Owner** | `/opportunities` |
| **Contract** | `build-contract-opportunities.xml` |
| **Prototype Source** | `src/pages/JobsWorklist.tsx` |
| **Dominant Archetypes** | `Scaffold`, `March`, `Placard` |
| **Reusable Patterns** | Job card list layout, filter/sort affordances, fit-score badges, quick-apply CTA on each card |
| **Blocked Assumptions** | Extension job-clip source data, Firebase job cache |
| **Harvest Notes** | Layout and card patterns are reusable. Data source must shift to canonical job queue API. Extension-sourced jobs are not a harvest target. |

---

## `/documents` — Document Hub

| Field | Value |
| --- | --- |
| **Canonical Owner** | `/documents` |
| **Contract** | `build-contract-documents.xml` |
| **Prototype Source** | `src/pages/PastApplicationsReference.tsx`, `src/pages/LibraryReferencePage.tsx` |
| **Dominant Archetypes** | `Scaffold`, `Placard`, `Strike` |
| **Reusable Patterns** | Application archive list, document card layout, resume/cover letter preview affordances, version history display |
| **Blocked Assumptions** | Firebase storage for generated documents, `react-router-dom` `/history` route (obsolete — canonical owner is `/documents`) |
| **Harvest Notes** | `PastApplicationsReference.tsx` maps to `/documents` archive view. `LibraryReferencePage.tsx` maps to design-system/component reference — not a production route target. |

---

## `/ksc-generator` — Specialist Generator

| Field | Value |
| --- | --- |
| **Canonical Owner** | `/ksc-generator` |
| **Contract** | `build-contract-ksc_generator.xml` |
| **Dominant Archetypes** | `Scaffold`, `Strike`, `Placard` |
| **Prototype Source** | `src/pages/KSCGenerator.tsx` |
| **Reusable Patterns** | STAR-method prompt structure, document tailoring progress, split-pane preview/edit |
| **Blocked Assumptions** | Legacy generation logic bypassing Genkit, non-Solidarity typography |
| **Harvest Notes** | Keep as a dedicated generator route. Support-reference previews inside `/documents` must not collapse route ownership. |

---

## `/cover-letter-generator` — Specialist Generator

| Field | Value |
| --- | --- |
| **Canonical Owner** | `/cover-letter-generator` |
| **Contract** | `build-contract-cover_letter_generator.xml` |
| **Dominant Archetypes** | `Scaffold`, `Strike`, `Placard` |
| **Prototype Source** | `src/features/applications/CoverLetterGenerator.tsx` |
| **Reusable Patterns** | Document tailoring progress, split-pane preview/edit, route-owned cover-letter workflow states |
| **Blocked Assumptions** | Legacy generation logic bypassing Genkit, non-Solidarity typography |
| **Harvest Notes** | Keep as a dedicated generator route. Support-reference previews inside `/documents` must not transfer canonical ownership. |

---

## `/job-queue` — Intake Queue

| Field | Value |
| --- | --- |
| **Canonical Owner** | `/job-queue` |
| **Contract** | `build-contract-job_queue.xml` |
| **Dominant Archetypes** | `Scaffold`, `March`, `Placard` |
| **Prototype Source** | `src/features/jobs/JobQueue.tsx` |
| **Reusable Patterns** | Queue-style list, status badges, bulk action affordances |
| **Blocked Assumptions** | Prototype local state only logic |
| **Harvest Notes** | Pair with the `06_lookout` shell. |

---

## Surfaces Blocked From Harvest

| Prototype Surface | Reason Blocked |
| --- | --- |
| Chrome Extension scaffolding (`manifest.json`, `server.ts`) | Extension-first architecture, not a harvest target |
| Firebase auth layer (`firebase-applet-config.json`, `firestore.rules`) | Platform-specific, replaced by FastAPI + SQLAlchemy |
| `src/pages/LandingPage.tsx` | Marketing/landing surface; harvest only as reference patterns into `/`, not as a standalone prototype route |
| `src/pages/OnboardingPathBifurcation.tsx` | Extension-first onboarding fork, not aligned with web-first canonical onboarding (`build-contract-onboarding.xml`) |
| `activeTab` shell routing model | Prototype navigation convenience only — not a canonical route model |

---

## Verification

Run to confirm all catalog route entries are present:

```bash
rg -n "/profile|/analysis|/apply/quick|/tracker|/opportunities|/documents|/job-queue|/ksc-generator|/cover-letter-generator" \
  docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-PATTERN-CATALOG.md
```

Expected: matches for all nine catalog route entries.
