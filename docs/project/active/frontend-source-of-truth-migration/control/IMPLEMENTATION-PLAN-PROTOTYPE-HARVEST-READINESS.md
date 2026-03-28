# Implementation Plan: Prototype Harvest Readiness Review

## 0. Context & Strategy

We are reviewing the cloned AI Studio prototype at `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0` as a harvest source for the canonical CareerCopilot repo. This review follows the current migration authorities, not the prototype's own historical assumptions.

- **Status**: Harvest-prepared support/reference source (2026-03-25)
- **Owner**: prototype-harvest-manager review
- **Source Prototype Commit**: `f31bca0`
- **Primary Authorities**:
  - `docs/project/active/frontend-source-of-truth-migration/control/COMET-MANIFEST.md`
  - `docs/project/active/frontend-source-of-truth-migration/control/AI-STUDIO-PROMPT-PACK.md`
  - `docs/project/active/frontend-source-of-truth-migration/prototype-integration.md`
  - `docs/project/active/frontend-source-of-truth-migration/contracts/*.xml`
- **Follow-On Artifacts**:
  - `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-BLOCKER-SPRINT.md`
  - `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-BLOCKER-IMPLEMENTATION-PLAN.md`
  - `docs/project/active/frontend-source-of-truth-migration/control/CLAUDE-CODE-PROTOTYPE-HARVEST-EXECUTION-PROMPT.md`
- **Folder Verdict**: Harvest-prepared support/reference source — blockers resolved 2026-03-25
- **Promotion Rule**: Harvest only interior interaction patterns that map cleanly to current contract owners. Do not promote the prototype shell, router model, extension scaffolding, or Firebase-era product assumptions.

---

## Phase 1: Intake & Authority Lock

### Task 1: Route Truth Reconciliation

- **Goal**: Lock the prototype review to current planning and contract truth before any harvest work begins.
- **Files**:
  - `docs/project/active/frontend-source-of-truth-migration/control/COMET-MANIFEST.md`
  - `docs/project/active/frontend-source-of-truth-migration/control/AI-STUDIO-PROMPT-PACK.md`
  - `docs/project/active/frontend-source-of-truth-migration/prototype-integration.md`
  - `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-dashboard.xml`
  - `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-opportunities.xml`
  - `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-analysis.xml`
  - `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-tracker.xml`
  - `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-documents.xml`
  - `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-profile.xml`
  - `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-settings.xml`
- **Actions**:
  - [x] Confirm locked nav mapping remains:
    - `Dashboard` -> `/dashboard`
    - `Jobs` -> `/opportunities`
    - `ATS Check` -> `/analysis`
    - `Applications` -> `/tracker`
    - `Submitted Docs` -> `/documents`
    - `Profile` -> `/profile`
    - `Settings` -> utility-only `/settings`
  - [x] Confirm `/profile` remains the canonical owner of voice profile management.
  - [x] Confirm prototype-side `Submitted Docs` composites do not override `/documents`, `/ksc-generator`, or `/cover-letter-generator`.
- **Definition of Done (DoD)**: All harvest decisions are constrained by the active contracts and manifest, not by prototype tab names or legacy README claims.

### Task 2: Shell And Platform Classification

- **Goal**: Separate prototype shell mechanics from harvest-worthy interior flows.
- **Files**:
  - `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/App.tsx`
  - `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/components/layout/AppShell.tsx`
  - `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/components/layout/AppNavDrawer.tsx`
  - `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/components/layout/WorkspaceLayout.tsx`
- **Actions**:
  - [x] Classify the top-level shell as support-only.
  - [x] Classify `activeTab` navigation as prototype-only and not a harvest target.
  - [x] Exclude shell promotion, URL routing decisions, and nav architecture from harvest scope.
- **Definition of Done (DoD)**: The prototype shell is explicitly treated as a router shim and not as canonical runtime truth.

---

## Phase 2: Surface Classification

### Task 3: Harvest-After-Prep Candidates

- **Goal**: Identify interior surfaces that are worth harvesting after contract-safe prep.
- **Files**:
  - `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/pages/ProfileView.tsx`
  - `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/pages/ApplyQuickWorkspaceReference.tsx`
  - `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/pages/ImageStudioPage.tsx`
  - `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/pages/JobsWorklist.tsx`
  - `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/pages/PastApplicationsReference.tsx`
  - `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/components/feature/KanbanTracker.tsx`
  - `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/pages/LibraryReferencePage.tsx`
- **Actions**:
  - [x] Classify `/profile` reference patterns from `ProfileView.tsx` as reusable for voice-profile and ingestion interactions only.
  - [x] Classify `ApplyQuickWorkspaceReference.tsx` and related feature panels as reusable for quick-apply and analysis workbench interaction patterns only.
  - [x] Classify `ImageStudioPage.tsx` as a reusable analysis-pattern surface, but not as a route-owner definition.
  - [x] Classify jobs and applications pages as reference scaffolds for `/opportunities` and `/tracker`.
  - [x] Classify `LibraryReferencePage.tsx` as support-reference only for `/documents`.
- **Definition of Done (DoD)**: Harvest-worthy surfaces are identified as pattern sources with explicit canonical owners.

### Task 4: Support-Only And Blocked Surfaces

- **Goal**: Record what must not be promoted into the canonical repo.
- **Files**:
  - `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/README.md`
  - `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/guidelines.md`
  - `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/manifest.json`
  - `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/src/hooks/useChromeExtension.ts`
  - `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/package.json`
- **Actions**:
  - [x] Mark prototype shell/layout/navigation files as support-only.
  - [x] Mark Chrome extension scaffolding as blocked from harvest.
  - [x] Mark Firebase/Firestore and old routing assumptions as non-authoritative.
  - [x] Record React 19 package assumptions as porting risk, not direct harvest input.
- **Definition of Done (DoD)**: Non-promotable prototype layers are explicitly quarantined from harvest scope.

---

## Phase 3: Pre-Harvest Remediation

### Task 5: Blocker And Drift Register

- **Goal**: Record the reasons the folder is not harvest-ready yet.
- **Actions**:
  - [x] Record architecture drift:
    - prototype README still describes `react-router-dom`
    - prototype still carries Firebase/Firestore and extension-era assumptions
    - top-level prototype routes do not equal canonical route owners
  - [x] Record ownership drift:
    - interior prototype patterns are useful, but route ownership already belongs to contract-backed canonical routes
    - stale references to voice/settings crossover must not be promoted
  - [x] Record environment/package drift:
    - React 19 in the prototype versus canonical React 18 compatibility requirements
    - case-colliding `GUIDELINES.md` / `guidelines.md` warning in the cloned source
- **Definition of Done (DoD)**: Review explains why the folder cannot be treated as directly harvestable as a whole.

### Task 6: Harvest Prep Requirements

- **Goal**: Define what must be true before harvest can begin.
- **Actions**:
  - [x] Treat the prototype as a pattern catalog, not as a drop-in implementation.
  - [x] Strip shell, router, extension, and Firebase assumptions from any harvested notes.
  - [x] Extract route-local interaction patterns only, mapped to current contract owners.
  - [x] Verify each harvested surface against the matching build contract before canonical porting.
  - [x] Keep `/profile` as the only voice-profile owner and `/settings` as secondary-only.
  - [x] Keep `/documents` as the canonical document hub and do not collapse generator ownership into prototype tabs.
- **Definition of Done (DoD)**: The harvest input set is reduced to route-safe interior patterns with owner mapping and contract references.

---

## Phase 4: Readiness Decision & Harvest Order

### Task 7: Folder-Level Readiness Decision

- **Goal**: Make an explicit harvest readiness call.
- **Decision**:
  - **Complete folder safe to copy wholesale?** No
  - **Harvest-prepared support/reference source now?** Yes
  - **Route-owned port tasks may proceed now?** Yes
- **Definition of Done (DoD)**: Folder status is unambiguous for future planners and harvest work.

### Task 8: Recommended Harvest Sequence

- **Goal**: Define the safest order for canonical porting after prep.
- **Recommended Order**:
  1. `/profile`
     - Source: `src/pages/ProfileView.tsx`
     - Harvest only: voice-profile and document-ingestion interaction patterns
     - Contract anchor: `contracts/build-contract-profile.xml`
  2. `/analysis` and `/apply/quick` support patterns
     - Source: `src/pages/ApplyQuickWorkspaceReference.tsx`, `src/pages/ImageStudioPage.tsx`
     - Harvest only: interior workbench layout, scan/score/feedback interactions
     - Contract anchors: `contracts/build-contract-analysis.xml`, `contracts/build-contract-apply-quick.xml`
  3. `/tracker`
     - Source: `src/pages/PastApplicationsReference.tsx`, `src/components/feature/KanbanTracker.tsx`
     - Harvest only: board/detail interaction patterns
     - Contract anchor: `contracts/build-contract-tracker.xml`
  4. `/opportunities`
     - Source: `src/pages/JobsWorklist.tsx`
     - Harvest only: jobs list and empty-state patterns
     - Contract anchor: `contracts/build-contract-opportunities.xml`
  5. `/documents`
     - Source: `src/pages/LibraryReferencePage.tsx`
     - Harvest only: support-reference layout ideas
     - Contract anchor: `contracts/build-contract-documents.xml`
- **Definition of Done (DoD)**: Harvest starts with route-local interior patterns and never with the prototype shell.

---

## Final Review Summary

## Blocker Remediation Status (2026-03-25)

All five blocker conditions have been resolved:

| Blocker | Status | Evidence |
| --- | --- | --- |
| Stale README architecture claims | ✅ Resolved | README rewritten as support/reference-only; `react-router-dom`, Firebase, History API routing claims removed |
| Stale guidelines route claims | ✅ Resolved | Route section replaced with contract-backed mapping table; `/job-match`, `/analysis/:jobId`, `/resume-builder/:jobId`, `/cover-letter/:jobId` removed |
| Voice ownership drift (Settings) | ✅ Resolved | `ImageStudioPage.tsx` CTA updated to point to `/profile` |
| Extension-first onboarding cues | ✅ Resolved | `GettingStartedChecklist.tsx` `Install Extension` item replaced with `Add First Job Target` |
| Missing route-mapped pattern catalog | ✅ Resolved | `PROTOTYPE-HARVEST-PATTERN-CATALOG.md` created with all 6 route families |

**Readiness score updated from 35 → 95/100.**

Remaining 5 points: `OnboardingPathBifurcation.tsx` and `LandingPage.tsx` remain as explicitly-blocked surfaces with no catalog entry. This is intentional and documented.

---

## Updated Folder Verdict

- The cloned prototype folder is **harvest-prepared as a support/reference source**.
- It is **useful and valuable** for route-local interaction patterns.
- The correct operating mode is:
  - use `PROTOTYPE-HARVEST-PATTERN-CATALOG.md` as the entry point for harvest workers
  - review interior patterns against contract-backed canonical owners
  - discard shell/router/platform assumptions (documented in the catalog)
  - proceed with route-owned port tasks per the harvest spec

## Recommended Next Actions

### Immediate

- Route-owned port tasks may now proceed.
- Use `PROTOTYPE-HARVEST-PATTERN-CATALOG.md` as the entry point for harvest work. Each route family includes source files, reusable patterns, blocked assumptions, and a contract reference.

### Short-Term

- Resolve `B5` (`/tracker` env verification) and `B8` (`/profile` env verification).
- These remain the only high-severity blockers preventing 100% migration closeout.
- Required environment remains:
  - `FIREBASE_PROJECT_ID=careercopilot-468811`
  - local Firebase/auth readiness sufficient to verify `/tracker` and `/profile` against live environment behavior

### Long-Term

- Once `B5` and `B8` close, the migration reaches 100%.
- Final closeout gate remains:
  - `scan-routes.ts`
  - `scan-screens.ts`
  - `detect-orphans.ts`
- All canonical routes must be verified green in environment before the program is marked fully complete.
