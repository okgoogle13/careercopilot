# Prototype Harvest Pattern Catalog

> **Status**: Harvest-prepared as of 2026-03-25
> **Source**: `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0` at commit `f31bca0`
> **Authority**: `COMET-MANIFEST.md`, `contracts/build-contract-*.xml`
>
> Each entry maps a prototype surface to its canonical route owner.
> Use this catalog to identify reusable interior patterns before porting.
> Blocked assumptions must be stripped before any canonical port begins.

---

## `/profile` — Voice Profile & Career Data

| Field | Value |
| --- | --- |
| **Canonical Owner** | `/profile` |
| **Contract** | `build-contract-profile.xml` |
| **Prototype Source** | `src/pages/ProfileView.tsx` |
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
| **Reusable Patterns** | Application archive list, document card layout, resume/cover letter preview affordances, version history display |
| **Blocked Assumptions** | Firebase storage for generated documents, `react-router-dom` `/history` route (obsolete — canonical owner is `/documents`) |
| **Harvest Notes** | `PastApplicationsReference.tsx` maps to `/documents` archive view. `LibraryReferencePage.tsx` maps to design-system/component reference — not a production route target. |

---

## Surfaces Blocked From Harvest

| Prototype Surface | Reason Blocked |
| --- | --- |
| Chrome Extension scaffolding (`manifest.json`, `server.ts`) | Extension-first architecture, not a harvest target |
| Firebase auth layer (`firebase-applet-config.json`, `firestore.rules`) | Platform-specific, replaced by FastAPI + SQLAlchemy |
| `src/pages/LandingPage.tsx` | Marketing/landing surface, no canonical owner in current migration scope |
| `src/pages/OnboardingPathBifurcation.tsx` | Extension-first onboarding fork, not aligned with web-first canonical onboarding (`build-contract-onboarding.xml`) |
| `activeTab` shell routing model | Prototype navigation convenience only — not a canonical route model |

---

## Verification

Run to confirm all route families are present in this catalog:

```bash
rg -n "/profile|/analysis|/apply/quick|/tracker|/opportunities|/documents" \
  docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-PATTERN-CATALOG.md
```

Expected: matches for all six route families.
