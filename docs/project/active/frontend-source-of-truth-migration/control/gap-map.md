# Backend Feature to Frontend Component Gap Map

**Date:** 2026-03-17
**Status:** Proposed component gap map
**Canonical companion artifacts:**
- `docs/project/active/frontend-source-of-truth-migration/control/blueprint.md`
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
- Frontend status: live canonical owner
- Existing components to reuse:
  - `ApplicationTracker`
  - `KanbanColumn`
  - `ApplicationDetailPanel`
  - `ApplicationEditForm`
  - `ApplicationStatusActions`
  - `ApplicationArchiveAction`
  - `KanbanTracker` as reference-only source for interaction patterns
- New components to build:
  - none
- Component status:
  - canonical: `ApplicationTracker`
  - support: kanban column, detail, edit, status, and archive components
  - reference-only: `KanbanTracker`
- Notes:
  - The canonical route owner is live on the real applications API path; remaining work is restoring one local backend run with working Firebase auth plus Firestore access so the authenticated tracker closeout can complete.

### Document redline workflow

- Owner route: `/documents`
- Owning page or feature: `Documents`
- Backend status: mounted and active
- Frontend status: live canonical owner
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
  - The route stays the same; the redline workspace is now mounted inside the canonical documents feature and no longer represents a "backend exists, no live owner" gap.

### Smart ingestion flow

- Owner route: `/career/ingest`
- Owning page or feature: `SmartIngestion`
- Backend status: mounted and active
- Frontend status: live canonical
- Existing components to reuse:
  - `SmartIngestion`
  - `IngestionFlow` as reference-only source
  - `AssetLibrary` as supporting downstream integration surface
- New components to build:
  - `SmartIngestionUploadStep`
  - `SmartIngestionTagConfirmStep`
  - `SmartIngestionSaveStep`
- Component status:
  - canonical: `SmartIngestion`
  - support: upload, tag-confirm, and save steps
  - reference-only: `IngestionFlow`
  - downstream integration: `AssetLibrary`
- Notes:
  - This feature must converge on `/api/v1/ingest`; any components tied to duplicate ingestion contracts should not be treated as canonical.

### Voice profile management

- Owner route: `/profile`
- Owning page or feature: `ProfileView`
- Backend status: mounted and active
- Frontend status: live canonical owner
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
  - Voice ownership is locked to `/profile` and the live route already mounts the voice-profile management section; remaining work is refinement, not missing route ownership.

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
- Frontend status: live canonical
- Existing components to reuse:
  - `Opportunities`
  - `ApplyQuick`
  - `LookoutDiscovery` as reference-only source
- New components added:
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
  - `ApplyQuick` remains the canonical live owner.
  - `JobAnalysisResultsPanel` is now extracted and covered by focused tests.
  - `workflow_orchestration` stays deferred and does not block `genkit_job_analysis` closure.

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
