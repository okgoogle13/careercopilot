# Remaining Salvage Sprint Plan

**Date:** 2026-03-28
**Sprint Window:** 2026-03-28 to 2026-04-10
**Objective:** Complete the remaining prototype salvage program without reopening harvest, without introducing duplicate runtime owners, and without advancing blocked authority-conflict rows until governance decides them.

---

## Sprint Frame

- **Execution owner:** Claude Code
- **Batch reviewer:** Codex CLI
- **Governance owner:** human reviewer
- **Execution method:** `subagent-driven-development`
- **Planning / tracking method:** `sprint-coordinator`

### Operating rules

- Harvest stays frozen unless a true authority conflict requires escalation.
- Every implementation task packet is one row, or two rows max if they share route, seam family, and owner.
- Every task packet follows:
  1. implementer subagent
  2. spec reviewer subagent
  3. code-quality reviewer subagent
  4. Codex batch review
- No next batch begins before Codex approval.

### Gating Rules

These rules enforce finish-line discipline. They apply to every batch without exception.

- **No batch begins without preflight proof.** Before any implementation, the executor must confirm all five universal preflight items (see `CLAUDE_PROTOTYPE_SALVAGE_PROMPT.md` §Mandatory Universal Preflight Gate): row is still `PENDING`, canonical owner confirmed from runtime truth, gap is real in that owner, behavior not already present under a different implementation, and no governance conflict.
- **No row closes without route-local runtime integration.** A row is `PORTED` only when the behavior is mounted in the exact canonical route owner named in the tracker — not just present in a new file, and not integrated into a different route.
- **Infrastructure progress does not equal completion.** Creating a hook, service, or utility counts as real progress but does not close the row. The row closes when that infrastructure is integrated into the route-local canonical owner. Record partial progress as: `infrastructure complete — route integration pending` in the Blocker field; row stays `PENDING`.
- **Governance conflicts are escalated, not implemented.** Any row that touches competing scoring models, competing route owners, backend-vs-client authority ambiguity, or duplicate domain models must emit a Harvest Conflict Brief and stop. Do not implement around governance conflicts. Do not treat a governance conflict as a regular blocker that can be worked past with a seam strip.
- **Codex review is mandatory after every batch.** No next batch begins before the prior batch has Codex approval. This rule has no exceptions.

---

## Current Status

### Completed

- `src/hooks/useAiOutputs.ts` → `frontend/src/features/analysis/hooks/useAiOutputs.ts`
- `src/components/feature/AiOutputsTabs.tsx` → `frontend/src/features/analysis/components/AiOutputsTabs.tsx`

### Blocked by governance

### Already canonical / discarded

- Use existing tracker states as authority; do not schedule these rows

### Open backlog reality

- **27 open rows / batches on paper** — treat this as backlog size, not runnable queue size
- **3 governance-gated rows** — client-Genkit ownership rows (`src/genkit/jobParser.ts`, `src/genkit/matchAnalysis.ts`, `components/CoverLetterSpecificMetrics.tsx`)
- **1 infrastructure-pending row** — `D1` (`hooks/useDocumentExport.ts`) has real progress but stays open until `/documents` gains a structured workbench/content seam
- **1 immediately safe next batch** — `O1` `src/hooks/useJobInput.ts`
- **All other open rows are deferred, not active.** They remain in backlog but should not be treated as "next up" until the queue is reclassified after `O1`

### Executor recommendation

- **Stay with Claude Code as executor and Codex CLI as reviewer.**
- **Gemini / Antigravity handover is not necessary now.** The bottleneck is governance correctness and queue classification, not implementation throughput.
- If Gemini is introduced later, use it only as a bounded executor for one approved batch at a time. Do not use it as planner, queue manager, or final reviewer.

---

## Readiness Score

- **Execution lane health:** Green
- **Governance clarity:** Amber
- **Backlog quality:** Amber
- **Overall readiness:** 7/10 (Amber)

### Score rule

- `+2` each batch completed and Codex-approved
- `+1` each blocker resolved by governance
- `0` blocked batch stopped correctly
- `-2` any widened-scope or rollback batch

Interpretation:

- `8+` Green
- `5-7` Amber
- `<5` Red

### Current queue interpretation

- **Backlog size:** 27 open rows
- **Runnable now:** 3 (`O1`, ATS scoring)
- **Governance-gated:** 3
- **Infrastructure-pending:** 1 (`D1`)
- **Resolved:** 10 (`PORTED` + `DISCARDED` + `ALREADY_CANONICAL`)

---

## Milestones

### Near-Term Execution Order (supersedes milestone order when gates conflict)

Use this order for actual execution:

1. `O1` `src/hooks/useJobInput.ts`
2. reclassify `hooks/useAutoSave.ts` as runnable, discard, or defer based on fresh preflight
3. reassess `T1` / `T2` earlier than originally planned if the queue still lacks clean seam batches
4. keep `/documents` logic and template rows deferred until the `/documents` workbench/content seam exists
5. keep ATS and client-Genkit rows blocked until governance decisions are documented

Do not interpret the milestone list below as a literal FIFO queue. It is a backlog structure; gating rules and current route truth determine what is actually runnable next.

### M0 — Governance Hygiene

**Goal:** Cleanly lock the ATS scoring blockers before more salvage coding.

**Batches:**

- `G0.1` tracker wording cleanup for blocked ATS rows

**Acceptance criteria:**

- ATS rows remain non-terminal
- tracker wording is factually accurate
- no code changes outside control docs

**Dependency:** none

---

### M1 — `/apply/quick` Interior Seams

**Goal:** Harvest the cleanest remaining interaction seams on `/apply/quick`.

**Batches:**

- `A1` `src/hooks/useApplyWorkspace.ts`
- `A2` `src/components/feature/SaveApplicationBar.tsx`

**Acceptance criteria:**

- mounted only into canonical `/apply/quick`
- Firebase and routing assumptions removed
- no shell drift
- tracker evidence updated

**Dependency:** `G0.1`

---

### M2 — `/documents` Logic Seams

**Goal:** Unlock document workflow logic before template/UI work.

**Batches:**

- `D1` `hooks/useDocumentExport.ts`
- `D2` `hooks/useTailoredResume.ts`
- `D3` `constants.ts` → `frontend/src/config/resume-constants.ts`

**Acceptance criteria:**

- hooks use canonical services only
- no direct prototype imports
- canonical owner remains `/documents`

**Current reality:** `D1` is not finishable yet. `useDocumentExport.ts` infrastructure exists, but `/documents` still lacks the structured workbench/content seam needed to close the route-local gap. Do not advance `D2` or `D3` as if `/documents` were an active clean lane.

**Dependency:** at least one approved batch from M1

---

### M3 — `/opportunities` Logic Seam

**Goal:** Harvest job-input logic without dragging in extension ownership.

**Batches:**

- `O1` `src/hooks/useJobInput.ts`

**Acceptance criteria:**

- Chrome extension dependency removed or stubbed
- canonical owner remains `/opportunities`

**Dependency:** none beyond standard preflight

**Active next batch:** `O1` is the current recommended executor target. It is the cleanest remaining route-local seam after governance repair.

---

### M4 — Type Substrate

**Goal:** Create the minimum shared contract layer needed for later UI and flow work.

**Batches:**

- `T1` `types.ts` → `frontend/src/types/career.ts`
- `T2` backend/schema alignment pass

**Acceptance criteria:**

- reconciled with existing canonical types
- API schema alignment evidence recorded
- no broad type replacement without review

**Dependency:** at least 3 approved seam batches from M1-M3

**Reassessment note:** if the safe seam queue remains thin after `O1`, pull `T1` / `T2` forward instead of forcing `/documents` or governance-gated rows.

---

### M5 — `/analysis` Non-Genkit UI & Scoring

**Goal:** Continue `/analysis` salvage without re-entering Genkit authority conflicts.

**Batches:**

- `AN0.1` `services/atsScorer.ts`
- `AN0.2` `hooks/useATSScoring.ts`
- `AN1` `hooks/useStudioMatch.ts`
- `AN2` `components/SuggestionsPanel.tsx`
- `AN3` `components/StudioMatchPanel.tsx`
- `AN4` `components/feature/AnalysisTabContent.tsx`
- `AN5` `components/feature/MatchScoreHeader.tsx`

**Acceptance criteria:**

- no client Genkit orchestration introduced
- no duplicate route owner introduced

**Dependency:** `M4` preferred

---

### M6 — `/documents` Templates And Preview

**Goal:** Complete document rendering and preview behavior.

**Batches:**

- `DOC1` `components/feature/TemplateSelector.tsx`
- `DOC2` `components/feature/ExportActionBar.tsx`
- `DOC3` `components/feature/SingleColumnResume.tsx`
- `DOC4` `components/feature/TwoColumnResume.tsx`
- `DOC5` `components/TailoredResumeView.tsx`

**Acceptance criteria:**

- behavior-reference rewrites only
- KR Solidarity token enforcement passes
- no prototype-era primitives survive

**Dependency:** `M2` + `M4`

---

### M7 — Route-Owned Page Upgrades

**Goal:** Upgrade page-level behaviors one route at a time.

**Batches:**

- `P1` `GettingStartedChecklist.tsx` → `/onboarding`
- `P2` `DashboardOverview.tsx` → `/dashboard`
- `P3` `JobInputPanel.tsx` → `/apply/quick`
- `P4` `ApplyQuickWorkspaceReference.tsx` → `/apply/quick`
- `P5` `PastApplicationsReference.tsx` → `/tracker`
- `P6` `ProfileView.tsx` partial harvest → `/profile`

**Acceptance criteria:**

- one row per batch
- owner confirmed before coding
- no shell drift
- no route reassignment

**Dependency:** `M1-M6` largely stable

---

### M8 — Governance-Gated Work

**Goal:** Handle authority-dependent rows only after explicit decisions.

**Governance decisions required:**

- `GD2` Genkit ownership for client flows

**Rows gated by those decisions:**

- `src/genkit/jobParser.ts`
- `src/genkit/matchAnalysis.ts`
- `components/CoverLetterSpecificMetrics.tsx`

**Acceptance criteria:**

- governance decision documented first
- tracker blocker removed only after that decision
- rows may become `DISCARDED` rather than `PORTED` if backend remains authoritative

---

## Exact Next Batch Order

1. `G0.1`
2. `A1`
3. `A2`
4. `D1`
5. `D2`
6. `O1`
7. `T1`
8. `T2`
9. `AN1`
10. `AN2`
11. `AN3`
12. `DOC1`
13. `DOC2`
14. `DOC5`
15. `P1`
16. `P2`
17. `P3`
18. `P4`
19. `P5`
20. `P6`
21. `M8` rows only after governance decisions

This sequence supersedes the older optimistic phase order by moving Genkit authority-dependent work to the end.

---

## Daily Cadence

### Start of day

- confirm active batch
- confirm prior batch has Codex approval
- confirm tracker row is still `PENDING`

### During day

- run one implementation task packet at a time
- implementer → spec review → code-quality review
- then Codex batch review

### End-of-day artifact

- batches completed
- batches blocked
- current blocker owner
- next batch queued
- readiness score update

---

## Success Condition

The sprint is healthy when:

- harvest remains frozen except for explicit conflict escalation
- each batch is bounded and review-gated
- tracker rows move only with evidence
- no duplicate owner surfaces are introduced
- Codex review happens before the next batch begins
