# AI Studio Prototype Staging & Harvest Plan

## Prototype-First Lens (Revision 3.0)

> **Current gate:** Run the prototype stabilization prompt in `AI_STUDIO_CLOSE_OUT_PROMPTS.md` first. Do not begin physical harvest until the stabilization gate passes.

**Prototype source:** `/Users/okgoogle13/Projects/prototype_v2.0`
**Deprecated local checkout:** `/Users/okgoogle13/Downloads/careercopilot-aistud` (deleted; invalid)

**Date:** 2026-03-20
**Analysis ref:** `STRUCTURE_MAP.prototype.md`
**Core Strategy:** Keep the AI Studio prototype useful as a staging environment while preventing it from redefining canonical routing, shell ownership, or route-family truth in the main repository.

---

## 1. Phase Status: PASS

- **Current Phase**: `Physical Component Harvest (Track B)` (IN PROGRESS)
- **Stabilization Gate**: `PASS` (2026-03-20)
- **Readiness Score**: `75/100` (Doc drift detected; reconciliation in progress)

### Gate Audit Results (Confirmed via Batch Audit)
- ✅ **Renames Verified**: `ApplyQuickWorkspaceReference`, `ProfileView`, `PastApplicationsReference`, `LibraryReferencePage`, `StudioMatchPanel`
- ✅ **Imports Sanitized**: `tsc --noEmit` and `npm run build` passed in AI Studio session.
- ✅ **Routing Neutralized**: Explicit warnings in `App.tsx` and `SidebarNav.tsx` regarding canonical authority.
- ✅ **Mapping Created**: `docs/prototype-to-canonical-mapping.md` exists and verified.
- ⚠️ **Cleanup Restricted**: Generic files (`Button.tsx`, `Layout.tsx`, etc.) retained in "Reviewed But Not Deleted" bucket for safety.

---

## 2. Next Execution: Physical Harvest Planning (Track B)

### Current Harvest Queue (Track B)

| Component / Logic      | Prototype Source | Staging Target (Reference) | Status      |
| ---------------------- | ---------------- | -------------------------- | ----------- |
| `ATSScoreCard.tsx`     | `Analysis.tsx`   | `comp/analysis/`           | ✅ HARVESTED |
| `AuditDisplay.tsx`     | `Analysis.tsx`   | `comp/analysis/`           | ✅ HARVESTED |
| `TrendChart.tsx`       | `Analysis.tsx`   | `comp/analysis/`           | ⏳ QUEUED    |
| `PipelineChart.tsx`    | `Analysis.tsx`   | `comp/analysis/`           | ⏳ QUEUED    |
| `Deep STAR` Ingestion  | `Ingestion.tsx`  | `backend/services/`        | ✅ HARVESTED |
| `ValidationDashboard`  | `Validation.tsx` | `comp/validation/`         | ⏳ QUEUED    |
| (MISSING FROM STAGING) |                  |                            |              |
Ingestion Service Logic (Track A2)
- Port "DEEP STAR" extraction logic into `backend/app/services/ingestion_flow.py`.

### Phase 3: Physical Harvest & Decomposition (COMPLETED)
Decomposed `ValidationDashboard.tsx` into modular sub-components within the `analysis` feature. Resolved all type-check and prop-alignment issues.

#### Changes Made
- Created `ValidationStats.tsx`, `AuditLogList.tsx`, and `SourceVerificationGrid.tsx`.
- Relocated and refactored `ValidationDashboard.tsx` and its test file.
- Updated imports in `SmartIngestion.tsx` to maintain application integrity.
- Verified all changes via `yarn type-check`.
- Synchronized PM artifacts (`status.md`, `CLAUDE_HANDOVER.md`, `AI_STUDIO_HARVEST_PLAN.updated.md`).

---


Prototype work must obey these rules:

- Prototype is `support_reference` only.
- Canonical runtime routing authority remains `frontend/src/App.tsx` in the main repo.
- Canonical route ownership remains `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.md`.
- Do not promote prototype tabs, labels, or shell behavior into product truth.
- Do not recommence physical harvest until the stabilization gate passes.

---

## 3 · Completed Work

- Harvest planning docs were migrated into `docs/project/active/ai-studio-prototype-harvest/`.
- `STRUCTURE_MAP.prototype.md` documents the prototype structure and its support-only role.
- `AI_STUDIO_CLOSE_OUT_PROMPTS.md` now contains the corrected prototype-only stabilization prompt.
- `CLAUDE_HANDOVER.md` now instructs Claude to invoke `project-manager` and hold at the stabilization gate.
- Review of the broken Gemini plan is complete; its route and shell assumptions are rejected.

---

## 4 · Active Next Step

Run the stabilization prompt in `AI_STUDIO_CLOSE_OUT_PROMPTS.md` against the prototype only.

Source path for that work:
- `/Users/okgoogle13/Projects/prototype_v2.0`

Expected deliverables from AI Studio:
- required file renames completed
- imports/exports updated
- top-level prototype comments stating canonical routing belongs to the main repo
- no canonical route claims introduced
- `docs/prototype-to-canonical-mapping.md` created inside the prototype
- final file tree and deletion audit reported

Do not harvest any component into the main repository until those deliverables are verified.

---

## 5 · Phase Sequence

### Phase A: Prototype Stabilization

**Owner:** Gemini / AI Studio
**Status:** `active`
**Goal:** Remove route ambiguity and align support-reference naming to target-state ownership.

**Acceptance criteria:**
- all stabilization exit criteria satisfied
- explicit proof that deleted files had zero remaining imports
- no main-repo runtime route changes proposed or made

### Phase B: Physical Harvest Planning

**Owner:** Claude via `project-manager`
**Status:** `blocked on Phase A`

**Goal:** Reopen harvest planning only after the stabilized prototype output is verified.

**Phase B can start only when Phase A is `PASS`.**

### Phase B: Physical Harvest & Decomposition
  - Status: COMPLETE
  - Readiness Score: 94%
  - Remaining: Phase 4 (Integration)
### Phase C: Physical Harvest Execution

**Owner:** implementation agents
**Status:** `not started`

**Goal:** Move approved support-reference patterns into canonical repo surfaces according to the migration authority stack.

---

## 6 · Explicit Non-Goals

- Do not convert the prototype to `react-router-dom`.
- Do not invent `/workspace`, `/past`, `/library`, or `/studio` as canonical product routes.
- Do not treat prototype shell/navigation patterns as runtime authority.
- Do not begin component-by-component harvesting from AI Studio output until stabilization is verified.

---

## 7 · Active File List

| Role | Final Path |
| --- | --- |
| Strategy and phase tracking | `AI_STUDIO_HARVEST_PLAN.updated.md` |
| Prototype stabilization prompt | `AI_STUDIO_CLOSE_OUT_PROMPTS.md` |
| Claude restart handover | `CLAUDE_HANDOVER.md` |
| Prototype structure map | `STRUCTURE_MAP.prototype.md` |
| Prototype source path | `/Users/okgoogle13/Projects/prototype_v2.0` |

---

## 8 · Immediate Operator Instruction

Run the corrected AI Studio prompt first. Then review the output against the stabilization gate. Only after a verified `PASS` should Claude recommence harvest planning through the `project-manager` skill.
