# Backend Feature to Frontend Component Gap Map

**Date:** 2026-03-13
**Status:** Proposed component gap map
**Canonical companion artifacts:**
- `docs/project/active/frontend-source-of-truth-migration/control/plan.md`
- `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.md`
- `docs/project/active/frontend-source-of-truth-migration/control/gap-map.json`

## Purpose

This artifact completes the target-state picture for backend-backed features that are missing or only partially wired in the frontend.

For each feature, it answers:
- which route owns it
- which existing page or feature module is canonical
- which existing components should be reused or extended
- which new frontend components still need to be built
- which parts are blocked or deferred

## Feature Gaps

### Applications CRUD

- Owner route: `/tracker`
- Owning page or feature: `ApplicationTracker`
- Backend status: mounted and active
- Frontend status: mock-backed
- Existing components to reuse:
  - `ApplicationTracker`
  - `KanbanTracker` as reference-only source for interaction patterns
- New components to build:
  - `KanbanColumn` (kanban stage column — drag-drop target, card container)
  - `ApplicationDetailPanel`
  - `ApplicationEditForm`
  - `ApplicationStatusActions`
  - `ApplicationArchiveAction`
- Component status:
  - canonical: `ApplicationTracker`
  - support: kanban column, detail, edit, status, and archive components
  - reference-only: `KanbanTracker`
- Notes:
  - This is the highest-priority product gap because the backend is already real and the current route is still effectively mock-backed.

### Document redline workflow

- Owner route: `/documents`
- Owning page or feature: `Documents`
- Backend status: mounted and active
- Frontend status: no live owner
- Existing components to reuse:
  - `Documents`
  - `DocumentWorkbench` as reference-only workbench source
- New components to build:
  - `DocumentRedlineUploadPanel`
  - `TrackedChangesWorkspace`
  - `RedlineActionBar`
- Component status:
  - canonical: `Documents`
  - support: redline upload, tracked changes workspace, redline action bar
  - reference-only: `DocumentWorkbench`
- Notes:
  - The route stays the same; the missing work is inside the documents feature, not in a new top-level route.

### Smart ingestion flow

- Owner route: `/career/ingest`
- Owning page or feature: `IngestionPage`
- Backend status: mounted and active
- Frontend status: partially wired
- Existing components to reuse:
  - `IngestionPage`
  - `IngestionFlow` as reference-only source
  - `AssetLibrary` as supporting downstream integration surface
- New components to build:
  - `SmartIngestionUploadStep`
  - `SmartIngestionTagConfirmStep`
  - `SmartIngestionSaveStep`
- Component status:
  - canonical: `IngestionPage`
  - support: upload, tag-confirm, and save steps
  - reference-only: `IngestionFlow`
  - downstream integration: `AssetLibrary`
- Notes:
  - This feature must converge on `/api/v1/ingest`; any components tied to duplicate ingestion contracts should not be treated as canonical.

### Voice profile management

- Owner route: `/profile`
- Owning page or feature: `ProfileView`
- Backend status: mounted and active
- Frontend status: no live owner
- Existing components to reuse:
  - `ProfileView`
  - `Settings` only as secondary integration if needed
  - `SettingsControl` as reference-only design source
- New components to build:
  - `VoiceProfileCreationPanel`
  - `VoiceSampleSubmissionForm`
  - `VoiceProfileStatusCard`
  - `VoiceProfileManagementSection`
- Component status:
  - canonical: `ProfileView`
  - support: creation panel, submission form, status card, management section
  - secondary integration: `Settings`
  - reference-only: `SettingsControl`
- Notes:
  - Voice ownership is locked to `/profile` for planning purposes.

### Resume audit

- Owner route: `/analysis`
- Owning page or feature: `AnalysisPage`
- Backend status: mounted and active for evaluation, incomplete for history
- Frontend status: partially wired
- Existing components to reuse:
  - `AnalysisPage`
  - `ResumeAuditPage`
  - `AnalysisWorkbench` as design/reference source
- New components to build:
  - `ResumeAuditEntryPoint`
  - `ResumeAuditResultsPanel`
- Deferred components:
  - `ResumeAuditHistoryList`
- Component status:
  - canonical: `AnalysisPage`
  - support: audit entry and results panel
  - deferred: history list until backend support exists
  - reference-only: `AnalysisWorkbench`
- Notes:
  - The minimum viable target state is routed evaluation support; history remains explicitly deferred.

### Job analysis

- Owner routes: `/opportunities`, `/apply/quick`
- Owning pages or features:
  - `Opportunities`
  - `ApplyQuick`
- Backend status: mounted and active
- Frontend status: partially wired
- Existing components to reuse:
  - `Opportunities`
  - `ApplyQuick`
  - `LookoutDiscovery` as reference-only source
- New components to build:
  - `JobAnalysisResultsPanel`
- Deferred or unresolved components:
  - `JobParsingWorkbench`
  - `ExtractFromTextPanel`
  - `AdvancedJobAnalysisPanel`
- Component status:
  - canonical: `Opportunities`, `ApplyQuick`
  - support: job analysis results panel
  - deferred or unresolved: parsing and advanced workbench surfaces
  - reference-only: `LookoutDiscovery`
- Notes:
  - `genkit_job_analysis` still has incomplete governance metadata, so this feature is only partially planning-complete.

### Workflow orchestration

- Owner route: `/apply/quick`
- Owning page or feature: `ApplyQuick`
- Backend status: placeholder only
- Frontend status: partially wired
- Existing components to reuse:
  - `ApplyQuick`
- New components to build later, after backend becomes real:
  - `WorkflowProgressScreen`
  - `WorkflowStatusPanel`
  - `EmailScanResultsView`
- Component status:
  - canonical: `ApplyQuick`
  - deferred: all workflow-specific UI until backend is no longer placeholder
- Notes:
  - This is not ready for implementation yet. It should stay in the plan as blocked work, not active build work.

## Target Component Library Outcome

### Canonical route-owned components

- `ApplicationTracker`
- `Documents`
- `IngestionPage`
- `ProfileView`
- `AnalysisPage`
- `Opportunities`
- `ApplyQuick`

### New canonical support components still required

- `KanbanColumn`
- `ApplicationDetailPanel`
- `ApplicationEditForm`
- `ApplicationStatusActions`
- `ApplicationArchiveAction`
- `DocumentRedlineUploadPanel`
- `TrackedChangesWorkspace`
- `RedlineActionBar`
- `SmartIngestionUploadStep`
- `SmartIngestionTagConfirmStep`
- `SmartIngestionSaveStep`
- `VoiceProfileCreationPanel`
- `VoiceSampleSubmissionForm`
- `VoiceProfileStatusCard`
- `VoiceProfileManagementSection`
- `ResumeAuditEntryPoint`
- `ResumeAuditResultsPanel`
- `JobAnalysisResultsPanel`

### Explicitly deferred components

- `ResumeAuditHistoryList`
- `JobParsingWorkbench`
- `ExtractFromTextPanel`
- `AdvancedJobAnalysisPanel`
- `WorkflowProgressScreen`
- `WorkflowStatusPanel`
- `EmailScanResultsView`

### Reference-only components after migration

- `KanbanTracker`
- `DocumentWorkbench`
- `IngestionFlow`
- `SettingsControl`
- `AnalysisWorkbench`
- `LookoutDiscovery`

## Remaining Planning Gaps

- The gap map assumes new component names using the repo’s current naming style, but these are planning names and not yet implemented symbols.
- Some features still need backend completion before UI work is valid:
  - workflow orchestration
  - resume audit history
- `genkit_job_analysis` still needs normalized governance metadata before it can be treated as fully settled.
