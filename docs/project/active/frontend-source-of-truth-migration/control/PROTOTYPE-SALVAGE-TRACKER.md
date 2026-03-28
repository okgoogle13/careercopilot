# Prototype Salvage Tracker

**Status:** Active — Expanded Scope (2026-03-28)
**Owner:** `prototype-harvest-manager` → `frontend-cleanup-manager` (terminal closeout)

---

## Harvest Plan vs Salvage Plan — Critical Distinction

These are two separate activities. Confusing them causes scope creep and wasted work.

| | Harvest Plan | Salvage Plan |
| --- | --- | --- |
| **What it is** | Classification: deciding which prototype files contain reusable value | Extraction: actually porting that value into canonical runtime |
| **Output** | `[HARVEST]`, `[REQUIRES REVIEW]`, `[IGNORE]` labels | `PORTED`, `ALREADY_CANONICAL`, `DISCARDED` outcomes |
| **Where it lives** | `frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/PROTOTYPE_AUDIT_LOG.md` | **This file** |
| **Status** | ✅ Complete (Phase 1 harvest done; expanded scope defined below) | 🔄 In progress |
| **Authority** | Prototype audit log | Canonical runtime (`App.tsx`, `route-registry.ts`) |

**The harvest plan is an input to the salvage plan, not a substitute for it.**
A file tagged `[HARVEST]` in the audit log has not been ported — it means it *should* be ported.
This tracker records whether it actually was.

---

## Why the Salvage Scope Was Expanded

The original harvest audit tagged only 4 files as `[HARVEST]`. A full re-audit of
the prototype_v2.0 source tree (86 files) revealed that the original audit was too
conservative: it classified entire files as `[REQUIRES REVIEW]` when the blocking
seam (Firebase, Chrome extension, shell coupling) was isolable and the *core logic*
was clean and portable.

**The real gap:** The canonical frontend has working route surfaces but is missing
the sophisticated *interaction layer* the prototype built — client-side ATS scoring,
document export pipelines, resume templates, rich AI output visualization, and a
unified career data model. These are product-differentiating capabilities, not cosmetic.

Expanded scope: **~37 files → 10+ routes enriched**, vs the original 4-file pass.

---

## Operating Rules

- `[HARVEST]` in the audit log means "this is worth porting." It does **not** mean it has been ported.
- Raw prototype files must **never** be imported directly into canonical runtime.
- Transfer mode must be one of: `transcribe logic only`, `behavior reference`, or `merge`.
- Rows resolve to one of three terminal states: `PORTED`, `ALREADY_CANONICAL`, or `DISCARDED`. `PENDING` and `BLOCKED` are open states — they signal that work is unresolved, not complete.
- Salvage and cleanup are separate. `frontend-cleanup-manager` owns route/runtime resync. This tracker owns value extraction only.

### Status Semantics

Only `PORTED`, `ALREADY_CANONICAL`, and `DISCARDED` are terminal. `PENDING` and `BLOCKED` are open states — the salvage pass is not complete while any row holds either. Apply consistently — do not infer status from context.

| Status | Meaning |
| --- | --- |
| `PORTED` | Behavior is live in the **exact** canonical route owner named in this row. Mounted in runtime, not just present in a new file. Route-local runtime integration evidence is on record in the Verification field. |
| `ALREADY_CANONICAL` | The canonical app already has this behavior under a non-prototype implementation. No porting needed. |
| `DISCARDED` | The runtime gap is not real, or the prototype seam is obsolete or superseded by an existing canonical implementation. Nothing to port. |
| `BLOCKED` | A governance or authority decision is required before salvage can proceed. The row is **non-terminal** — it remains open until the decision is documented and the blocker is cleared. |
| `PENDING` | A real route-local gap remains and the row is eligible for a future batch (subject to universal preflight). |

**`BLOCKED` vs `PENDING`:** Use `BLOCKED` when the blocker is a governance or authority conflict (competing scoring models, competing route owners, backend-vs-client ambiguity). Use `PENDING` when the work is unblocked in principle but not yet started or completed.

### Partial-Progress Wording — Do Not Create False Closure

If shared infrastructure exists but the route-local gap is still open, the row **stays `PENDING`**. The Blocker/Evidence field must explicitly state:

> infrastructure complete — route integration pending

**Model pattern — D1 (`hooks/useDocumentExport.ts`):**

- `useDocumentExport.ts` + `services/docxExport.ts` exist and pass type-check: real progress
- but `/documents` workbench still lacks a structured content seam to feed DOCX export
- therefore D1 stays `PENDING` — infrastructure progress alone is not row completion

A row closes `PORTED` only when the hook or service is mounted in the route-local canonical owner named in the tracker row. File creation, generator-route interim usage, or off-route integration do not satisfy this requirement.

---

## Execution Order

```text
Phase 1 (parallel):  S1 — Behavior Seam Extraction (hooks/services, 11 files)
                      S3 — Type System Consolidation (3 files)
Phase 2:             S5 — Genkit Flow + Analysis UX Harvest (11 files)
Phase 3:             S2 — Template & Renderer Harvest (6 files)
Phase 4:             S4 — Route-Owned Page Upgrade (6 files)
```

S1 and S3 first because S2, S4, and S5 depend on having correct type contracts and
hook scaffolding in place before UI behavior rewrites begin.

---

## S1 — Behavior Seam Extraction

### Why S1 exists

The canonical app has feature surfaces (routes, components, API calls) but is missing
the *interaction hooks* that make those features work fluidly. Specifically:

- **No client-side ATS scoring** — users cannot see a score update in real time while editing; they wait for a backend round-trip
- **No auto-save** — any unsaved work is lost on navigation or refresh
- **No client document export** — no way to download a tailored resume as PDF or DOCX without a backend round-trip
- **No resume tailoring hook** — the tailoring workflow lacks a state machine to track progress
- **No match analysis state** — match results are fetched but not held in a shareable hook

The prototype solved all of these with well-structured hooks and a standalone `ATSScorer`
service class using NLP keyword extraction. These are the highest-value items in the
entire prototype because they underpin every major user workflow.

**Transfer mode for all S1 items:** Transcribe logic only. Strip Firebase Auth and
Chrome extension imports. Rewire external data calls to TanStack Query + canonical API
services. The *logic* is clean; only the *data layer* is wrong.

| Prototype Source | Canonical Destination | Route | Transfer Mode | Status | Blocker | Verification |
| --- | --- | --- | --- | --- | --- | --- |
| `hooks/useATSScoring.ts` | `frontend/src/features/analysis/hooks/` | `/analysis` | transcribe logic | `PENDING` | — | type-check, data seam review |
| `hooks/useAutoSave.ts` | `frontend/src/hooks/` (shared) | cross-cutting | transcribe logic | `PENDING` | — | type-check |
| `hooks/useDocumentExport.ts` | `frontend/src/features/documents/hooks/useDocumentExport.ts` | `/documents` | transcribe logic | `PENDING` | infrastructure complete — route integration pending. `useDocumentExport.ts` + `services/docxExport.ts` exist (clean `ExportableDocument` type, no prototype imports, `docx` installed). Interim consumers on generator routes (`CoverLetterGenerator.tsx`, `KSCGenerator.tsx`) count as implicit progress, not D1 completion. Gap: `/documents` workbench renders mock card data with element-ID PDF only — no structured preview or content model to feed DOCX export. D1 closes only when `Documents.tsx` has a workbench surface with structured content. | type-check ✅ (infrastructure passes), runtime integration for `/documents` — deferred pending workbench content seam |
| `hooks/useTailoredResume.ts` | `frontend/src/features/documents/hooks/` | `/documents` | transcribe logic | `PENDING` | — | type-check, data seam review |
| `hooks/useStudioMatch.ts` | `frontend/src/features/analysis/hooks/` | `/analysis` | transcribe logic | `PENDING` | — | type-check, data seam review |
| `services/atsScorer.ts` | `frontend/src/features/analysis/services/` | `/analysis` | transcribe logic | `PENDING` | — | type-check, token-enforcement |
| `src/hooks/useAiOutputs.ts` | `frontend/src/features/analysis/hooks/useAiOutputs.ts` | `/analysis` | transcribe logic | `PORTED` | — | data seam review ✅ (hardcoded criteria removed; consumer supplies via props), runtime integration ✅ (mounted via `AnalysisPage.tsx` on canonical `/analysis` route), type-check ✅ (tsc --noEmit EXIT:0, 2026-03-28) |
| `src/hooks/useApplyWorkspace.ts` | `frontend/src/features/applications/hooks/` | `/apply/quick` | transcribe logic | `DISCARDED` | Runtime gap not real. `ApplyQuick.tsx` already implements job analysis via `workflowService.quickApply()` (backend-backed). The prototype hook's three capabilities — Firebase profile load, `extractJobOpportunity` via client Gemini, Firebase save — are all superseded by the backend workflow service. The Firebase Auth seam is the entire data layer; stripping it leaves nothing to transcribe. No hooks/ directory needed. Confirmed 2026-03-28. | — |
| `src/hooks/useJobInput.ts` | `frontend/src/features/jobs/hooks/` | `/opportunities` | transcribe logic | `PORTED` | — | data seam review ✅ (extension dep stubbed), runtime integration ✅ (rendered from `Opportunities.tsx` on canonical `/opportunities`), type-check ✅ (tsc --noEmit EXIT:0, 2026-03-28) |
| `src/components/feature/AiOutputsTabs.tsx` | `frontend/src/features/analysis/components/AiOutputsTabs.tsx` | `/analysis` | transcribe logic | `PORTED` | — | TSX identity ✅ (AiOutputsTabs in AiOutputsTabs.tsx), token-enforcement ✅ (Card→Placard, Badge(danger)→StatusBadge(error), Badge(success)→StatusBadge(success), motion/react→framer-motion, all tokens var(--sys-color-*)/var(--sys-shape-*)), runtime integration ✅ (rendered from `AnalysisPage.tsx` on canonical `/analysis` route), type-check ✅ (tsc --noEmit EXIT:0, 2026-03-28) |
| `src/components/feature/SaveApplicationBar.tsx` | `frontend/src/features/applications/components/` | `/apply/quick` | behavior reference | `DISCARDED` | Runtime gap not real. `JobAnalysisResultsPanel.tsx` already implements the equivalent CTA block ("Export Pack" section + "Go To Tracker" button). Prototype buttons were `onClick={() => {}}` no-ops — no wired behavior to transcribe. Confirmed 2026-03-28. | — |

---

## S2 — Template & Renderer Harvest

### Why S2 exists

The canonical `/documents` route lets users store and manage documents but has **no
client-side template system**. Users cannot:

- Preview a resume in different visual layouts
- Switch between single-column and two-column formats
- Choose a template before exporting

The prototype built a complete template system: two resume layout components, a template
picker, an export action bar, and an analysis tab layout. These are UI-heavy, so they
cannot be directly promoted — the JSX uses prototype-era primitives and lacks KR Solidarity
tokens. But the *layout patterns and interaction flows* are directly reusable as behavior
references for canonical rewrites.

**Why behavior reference and not transcribe?** Because the prototype UI components use
hardcoded styles and non-canonical primitives throughout their JSX. Transcribing would
import those violations. A behavior reference rewrite gives you the interaction model
(two-pane layout, template selector → preview update → export) without the styling debt.

| Prototype Source | Canonical Destination | Route | Transfer Mode | Status | Verification |
| --- | --- | --- | --- | --- | --- |
| `components/feature/SingleColumnResume.tsx` | `frontend/src/features/documents/components/templates/` | `/documents` | behavior reference | `PENDING` | TSX identity, token-enforcement |
| `components/feature/TwoColumnResume.tsx` | `frontend/src/features/documents/components/templates/` | `/documents` | behavior reference | `PENDING` | TSX identity, token-enforcement |
| `components/feature/TemplateSelector.tsx` | `frontend/src/features/documents/components/` | `/documents` | behavior reference | `PENDING` | TSX identity, token-enforcement |
| `components/feature/ExportActionBar.tsx` | `frontend/src/features/documents/components/` | `/documents` | behavior reference | `PENDING` | TSX identity, token-enforcement |
| `components/feature/AnalysisTabContent.tsx` | `frontend/src/features/analysis/components/` | `/analysis` | behavior reference | `PENDING` | TSX identity, token-enforcement |
| `components/feature/MatchScoreHeader.tsx` | `frontend/src/features/analysis/components/` | `/analysis` | behavior reference | `PENDING` | TSX identity, token-enforcement |

---

## S3 — Type System Consolidation

### Why S3 exists

The prototype's `types.ts` is a 400+ line unified career data model that covers every
entity in the product: `CareerDatabase`, `CareerEntry`, `StructuredAchievement`,
`VoiceProfile`, `MatchAnalysis`, `ATSScoreResult`, `JobOpportunity`, `KSCResponse`, and
more. These types are **the ground truth for what data the product handles**.

The canonical frontend has equivalent data but its types are scattered — defined inline
in service files, duplicated across feature modules, and not reconciled against the backend
schema. This causes:

- Type drift between frontend and backend
- Duplicate field names with different casing
- No single place to see what a `CareerProfile` or `MatchAnalysis` looks like

**Why this runs first (parallel with S1):** All UI behavior rewrites in S2, S4, and S5
will reference these types. Starting without a consolidated type contract forces every
subsequent step to infer types from prototype JSX — expensive and error-prone.

**Transfer mode: transcribe + merge**, not replace. The goal is a canonical
`frontend/src/types/career.ts` that reconciles prototype types with existing canonical
types, aligned to backend schema field names.

| Prototype Source | Canonical Destination | Scope | Transfer Mode | Status | Verification |
| --- | --- | --- | --- | --- | --- |
| `types.ts` (root, 400+ lines) | `frontend/src/types/career.ts` (new or merge into existing) | all routes | transcribe + merge | `PENDING` | type-check, API schema alignment |
| `constants.ts` | `frontend/src/config/resume-constants.ts` | `/documents` | transcribe | `PENDING` | type-check |
| `src/utils/skills.ts` | — | — | — | `DISCARDED` | Classified `[IGNORE]` in `PROTOTYPE_AUDIT_LOG.md` (line 85: "Utilities, Mocks, & Configs — entirely superseded"). Reviving it in salvage contradicts the audit log. No port. |

---

## S4 — Route-Owned Page Upgrade

### Why S4 exists

Six files in the `[REQUIRES REVIEW]` bucket were blocked not because they are
fundamentally non-portable but because their blocking seams were never isolated.
Each maps directly to an existing canonical route. The canonical implementations
work but are less interaction-rich than the prototype equivalents:

- **`/dashboard`** — canonical dashboard exists but lacks the metric card composition (`DashboardOverview`) and the getting-started checklist's real-time completion tracking
- **`/apply/quick`** — canonical apply route exists but `JobInputPanel` has a richer job form pattern with structured field grouping and validation states
- **`/onboarding`** — canonical onboarding exists but `GettingStartedChecklist` has a more sophisticated completion-state model (extension cues are isolable and ignorable)
- **`/tracker`** — canonical tracker exists but `PastApplicationsReference` and `ApplyQuickWorkspaceReference` have layout and state patterns worth reviewing for the merge candidates already identified in `docs/manifests/prototype-features-cleanup-map.json`
- **`/profile`** — `VoiceProfileSection` is already canonical; remaining sections of `ProfileView` have career editor patterns not yet in canonical form

**Why reclassified from REVIEW to HARVEST:** The blockers (Firebase store, Chrome CTAs,
shell coupling) are surface-level. The underlying interaction logic — form state, checklist
completion, application card layout — is independent of those deps and extractable via
seam-strip before harvest.

**Pre-flight required for S4:** Run `blueprint` if route ownership is ambiguous per
`route-matrix.json` before starting any page upgrade. Do not begin work without a
confirmed canonical owner.

| Prototype Source | Canonical Destination | Route | Transfer Mode | Status | Blocker / Seam to Strip | Verification |
| --- | --- | --- | --- | --- | --- | --- |
| `src/components/feature/DashboardOverview.tsx` | `frontend/src/features/dashboard/` | `/dashboard` | behavior reference | `PENDING` | Strip prototype Zustand store → use canonical Zustand | TSX identity, token-enforcement |
| `src/components/feature/JobInputPanel.tsx` | `frontend/src/features/applications/` | `/apply/quick` | behavior reference | `PENDING` | Strip Chrome CTA + hardcoded texture URL → canonical assets | TSX identity, token-enforcement |
| `src/components/feature/GettingStartedChecklist.tsx` | `frontend/src/features/onboarding/` | `/onboarding` | behavior reference | `PENDING` | Strip "Install Extension" cue → pure checklist logic | TSX identity, token-enforcement |
| `src/pages/ApplyQuickWorkspaceReference.tsx` | `frontend/src/features/applications/` | `/apply/quick` | merge candidate | `PENDING` | Layout/store/shell seams — see docs/manifests/prototype-features-cleanup-map.json | TSX identity, token-enforcement |
| `src/pages/PastApplicationsReference.tsx` | `frontend/src/features/applications/ApplicationTracker.tsx` | `/tracker` | merge candidate | `PENDING` | Layout-shell seams. **Route authority:** `route-matrix.json` and `docs/manifests/prototype-features-cleanup-map.json` both assign `/tracker` (target: `ApplicationTracker`). PATTERN-CATALOG.md entry for `/documents` is stale on this file — `/tracker` is authoritative. | TSX identity, token-enforcement |
| `src/pages/ProfileView.tsx` | `frontend/src/features/profile/` | `/profile` | partial harvest | `PENDING` | VoiceProfile already extracted; harvest remaining career editor sections only | TSX identity, token-enforcement |

---

## S5 — Genkit Flow + Analysis UX Harvest

### Why S5 exists

This is the highest product-differentiation value in the entire prototype. The
canonical `/analysis` route exists but its interaction layer is thinner than the
prototype's. Post-reconciliation, the S5 scope has been clarified: **four components
are already canonical and need no work**; the remaining six items are the actual
pending gaps.

**Already canonical (no S5 work needed):**

- `ATSScoreCard`, `AuditDisplay` — both confirmed at `frontend/src/features/analysis/components/`
- `AuditDial` — confirmed at `frontend/src/features/analysis/AuditDial.tsx`
- `MetricCard` — confirmed at both `frontend/src/features/analysis/MetricCard.tsx` and `frontend/src/components/shared/MetricCard.tsx`

**Remaining canonical gaps in S5:**

- **Suggestions panel** — no AI-generated improvement suggestions surfaced in the UI
- **Match panel** — no side-by-side match analysis view (`StudioMatchPanel`)
- **Cover letter scoring metrics** — no granular score breakdown for generated letters
- **Tailored resume preview** — no live preview of resume with tailoring applied
- **Client Genkit orchestration** — `jobParser.ts` and `matchAnalysis.ts` need backend alignment decision before porting

The prototype also has two Genkit flows (`jobParser.ts`, `matchAnalysis.ts`) that encode
client-side AI orchestration patterns. These may conflict with backend Genkit flows —
**the key decision is whether to port them as client-orchestrated or discard them in
favor of calling the backend endpoints**. This must be resolved before S5 begins.

**Pre-flight required for S5 (Genkit):** Confirm with backend service layer which
flows are client-orchestrated vs backend-only before porting. Do not duplicate backend
flows on the client.

**Why S5 runs after S1/S3:** The AI output components reference `MatchAnalysis`,
`ATSScoreResult`, and other types from S3. The hooks they consume come from S1.
Running S5 before those foundations are in place forces type-guessing.

| Prototype Source | Canonical Destination | Route | Transfer Mode | Status | Blocker | Verification |
| --- | --- | --- | --- | --- | --- | --- |
| `src/genkit/jobParser.ts` | `frontend/src/features/jobs/services/` | `/opportunities` | transcribe logic | `PENDING` | Must align with backend Genkit wiring — confirm client vs backend ownership first | data seam, backend alignment |
| `src/genkit/matchAnalysis.ts` | `frontend/src/features/analysis/services/` | `/analysis` | transcribe logic | `PENDING` | Must align with backend Genkit wiring — confirm client vs backend ownership first | data seam, backend alignment |
| `components/ATSScoreCard.tsx` | `frontend/src/features/analysis/components/ATSScoreCard.tsx` | `/analysis` | behavior reference | `ALREADY_CANONICAL` | Exists at canonical path with KR Solidarity tokens applied. | — |
| `components/AuditDisplay.tsx` | `frontend/src/features/analysis/components/AuditDisplay.tsx` | `/analysis` | behavior reference | `ALREADY_CANONICAL` | Exists at canonical path. | — |
| `components/CoverLetterSpecificMetrics.tsx` | `frontend/src/features/documents/components/` | `/cover-letter-generator` | behavior reference | `PENDING` | — | TSX identity, token-enforcement |
| `components/StudioMatchPanel.tsx` | `frontend/src/features/analysis/components/` | `/analysis` | behavior reference | `PENDING` | — | TSX identity, token-enforcement |
| `components/SuggestionsPanel.tsx` | `frontend/src/features/analysis/components/` | `/analysis` | behavior reference | `PENDING` | — | TSX identity, token-enforcement |
| `components/TailoredResumeView.tsx` | `frontend/src/features/documents/components/` | `/documents` | behavior reference | `PENDING` | — | TSX identity, token-enforcement |
| `src/components/ui/AuditDial.tsx` | `frontend/src/features/analysis/AuditDial.tsx` | `/analysis` | behavior reference | `ALREADY_CANONICAL` | Exists at `frontend/src/features/analysis/AuditDial.tsx`. | — |
| `src/components/ui/MetricCard.tsx` | `frontend/src/features/analysis/MetricCard.tsx` + `frontend/src/components/shared/MetricCard.tsx` | cross-cutting | behavior reference | `ALREADY_CANONICAL` | Exists in both analysis feature and shared components. | — |
| `src/components/feature/KanbanTracker.tsx` | `frontend/src/features/applications/` | `/tracker` | behavior reference | `ALREADY_CANONICAL` | — | Verify no residual behavior gap before closing |

---

## Already-Canonical — No Salvage Work Needed

These were reviewed and confirmed to already exist in canonical form. Recorded here
to prevent duplicate work.

| Source / Pattern | Why It Was Considered | Canonical Outcome | Status |
| --- | --- | --- | --- |
| `SettingsView.tsx` | Settings UI patterns | Canonical profile/settings ownership already stable | `ALREADY_CANONICAL` |
| `PageHeader.tsx` | Header behavior | Canonical `PageHeader` in `shared/` already owns this | `ALREADY_CANONICAL` |
| `LibraryReferencePage.tsx` | Document library layout | `/documents` is canonical owner with full implementation | `ALREADY_CANONICAL` |
| `ImageStudioPage.tsx` | Voice CTA + analysis patterns | CTA corrected to point to `/profile`; analysis patterns reviewed | `ALREADY_CANONICAL` |
| `M3ExpressiveComponents.tsx` | Material 3 component patterns | KR Solidarity v6.1 components supersede M3 primitives | `ALREADY_CANONICAL` |

---

## Exit Criteria

The salvage pass is complete only when:

- every row across all 5 strategy tables has a terminal status
- every `PORTED` row names the exact destination file
- verification evidence exists for every `PORTED` row (type-check + token-enforcement results)
- `PROTOTYPE_AUDIT_LOG.md` is updated with all reclassifications from `[REQUIRES REVIEW]` → `[HARVEST]`
- no migration workspace dissolution step claims complete while any row is still `PENDING`
- every `PORTED` row's verification evidence explicitly cites route-local runtime integration (not just file creation or shared infrastructure)

---

## Summary

| Metric | Count |
| --- | --- |
| Total salvage candidates | 37 |
| S1 — Hooks & Services | 11 |
| S2 — Templates & Renderers | 6 |
| S3 — Type System | 3 |
| S4 — Page Upgrades | 6 |
| S5 — AI/Genkit UX | 11 |
| Already canonical (no work needed) | 9 |
| Discarded (audit log [IGNORE] or confirmed redundant) | 1 |
| Canonical routes enriched | 10+ |

Original audit (4 files) missed **~33 additional harvestable candidates** because it
classified entire files as blocked when only a surface-level seam was blocking — not
the underlying logic. Post-reconciliation: 4 S5 rows moved to `ALREADY_CANONICAL`,
1 S3 row moved to `DISCARDED` (audit log conflict resolved).
