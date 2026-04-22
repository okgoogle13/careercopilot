# Sprint Brief

## Sprint Window

- **Sprint:** Sprint 4
- **Dates:** 2026-04-29 → TBD
- **Status:** Staged — awaiting Sprint 3 PR (#134) merge to develop
- **Status view:** `dashboard.html` is the UI over `TASKS.md`; no separate dashboard tracker is maintained

## Objective

Wire durable state for analysis pipeline (ingestion → ATS → export) via Zustand, retire client-side jsPDF, integrate server-side templating, and verify end-to-end persistence. Stage 1 gate task for the templating-refactor sprint.

## Current State

- Sprint 3 closed 2026-04-28: 12 tasks completed end-to-end. PR #134 awaiting merge.
  - **Phase 1 (Tasks 1-3)**: Doc consolidation + sync infrastructure — 1,308 files audited, 150 consolidated, CI sync job created
  - **Phase 2 (Tasks 4-6)**: Abstraction layer + Notion + Linear implementations — DocumentStore/IssueTracker interfaces, 32 test suites, 105+ assertions
  - **Phase 3 (Tasks 7-12)**: Perplexity integration + self-hosted migration path — hallucination guard, decorator pattern, sync automation, PostgreSQL migration guide, execution prompts, team onboarding
- Sprint 4 staged: 6 tasks focused on pipeline state wiring and templating integration.

## Sprint 4 Scope

**Primary Goal:** Wire durable state for analysis pipeline (ingestion → ATS → export) so ATS scores persist across page refresh, retire client-side jsPDF, and integrate themed document rendering.

**Key Deliverables:**
1. analysisPipelineStore Zustand slice (keyed by assetId)
2. Refactored AnalysisPage (read/write store instead of useState)
3. Server-rendered exports (retire jsPDF client path)
4. ATS Signal Breakdown panel (expose 4 sub-signals)
5. E2E test (upload → score → export → reload → score-persists)
6. Themed document rendering integration

**Unblocks:** Templating-refactor sprint (depends on durable pipeline state and server-side export wiring).

## Active Board Contract

`TASKS.md` is the only active board. Sprint 4 tasks are ordered: state → refactor → export → signals → tests → templating.

## Acceptance Gate For Sprint Close

- analysisPipelineStore wired and tested
- AnalysisPage refactored to use store (useState removed)
- Server export endpoints verified (jsPDF client path retired)
- E2E test passing (score persists across reload)
- ATS Signal Breakdown panel rendering with 4 sub-signals
- No regressions in analysis flow, export, or related features
