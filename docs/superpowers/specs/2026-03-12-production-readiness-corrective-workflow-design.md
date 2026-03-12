# Production-Readiness Corrective Workflow: Frontend Source-of-Truth and Capability Reconciliation Sprint

**Date**: 2026-03-12
**Author**: Claude Opus 4.6 + Codex synthesis
**Status**: DRAFT → REVIEW
**Executor**: Codex
**Reviewers**: Claude/engineer

---

## 1. Problem Statement

The CareerCopilot frontend problem is not only a wireframe-source problem.

The repo currently has drift across four artifact layers:

1. canonical design intent in `.claude/wireframes/*.xml`
2. operational design/reference implementations in `frontend/src/screens/**/*.wireframe.xml` plus paired `*.tsx`
3. live runtime implementations in `frontend/src/features/**` and `frontend/src/pages/**`
4. backend capability truth in mounted API endpoints and workflow contracts

The migration pipeline over-trusts thin `migration-kit-v3` JSON wireframes as authoritative spec, producing false-pass audits. At the same time, the live frontend contains mock-backed production routes, unrouted screen candidates, still-live `/kr/*` prototypes, and product-relevant backend capabilities with no current frontend owner.

**Evidence**
- 27 live routes across 13 route families currently define the reachable app
- 17 likely page/screen surfaces are present in the frontend inventory, but only 10 are currently routed
- 7 likely page/screen candidates are unrouted
- 5 `/kr/*` prototype routes are still live
- same-day contradictory audit results (2026-03-11): FAIL with 20 violations → PASS with 0 violations
- dashboard probe: runtime implementation is far more complex than design reference
- only 6 of 18 previously scoped routes had migration-kit JSON coverage
- batch duplicates in `phase3-batch2` and `phase3-batch3` create source confusion
- some mounted backend capabilities have no current live frontend owner
- some live frontend routes remain mock-backed despite real backend support
- ingestion behavior is split across overlapping backend contracts
- voice profiling is a real retained capability without explicit runtime ownership

---

## 2. Goal

Reconcile the production frontend using a correct source-of-truth workflow that includes design truth, runtime truth, and capability truth, achieving:

- **Token compliance ≥95%** on in-scope production routes
- **Zero critical copy/design violations**
- **Design/runtime/capability layers explicitly declared**
- **Governance artifacts established**
- **Migration audit pipeline rewired** to canonical XML wireframes
- **Mock-backed and unwired product surfaces explicitly classified**
- **Target-state ownership decisions made** for ingestion, voice, applications, documents, and audit gaps

---

## 3. Scope

### In-Scope Production Routes

Primary runtime families:
- `/login`, `/register`
- `/dashboard`
- `/profile`, `/onboarding`, `/welcome`, `/settings`
- `/analysis`, `/career/ingest`, `/opportunities`
- `/documents`, `/tracker`, `/ksc-generator`, `/cover-letter-generator`, `/job-queue`
- `/apply/quick`, `/asset-library`, `/test-tokens`

### In-Scope Analysis Additions

- backend capability mapping where it affects target-state frontend planning
- mock-backed live route detection
- unwired but product-relevant backend endpoint identification
- ingestion contract consolidation planning
- voice capability ownership planning

### Out-of-Scope

- backend implementation changes
- `/design-sidekick`, `/style-guide`
- broad performance optimization
- speculative feature implementation beyond target-state definition

### Deprioritized / Quarantine Candidates

- `/kr/*` routes as live product surfaces
- internal admin/design-system capability families such as `asset-review/*` and `manifest-integration/*`

---

## 4. Current State Summary

### 4.1 Frontend Architecture Facts

- live routes: 27
- route families: 13
- likely surfaces: 17
- routed likely surfaces: 10
- unrouted likely surfaces: 7
- live prototype `/kr/*` routes: 5

Bucket distribution:
- `screens`: 11 files, 22 exported components, 22 likely page/screen surfaces
- `features`: 52 files, 74 exported components
- `pages`: 6 files, 10 exported components, 10 likely page/screen surfaces
- `components`: 89 files, 110 exported components

### 4.2 High-Signal Structural Smells

- duplicate route layers
- live prototypes in `/kr/*`
- unrouted screen candidates
- mock-backed live routes
- god components
- backend/frontend contract drift

### 4.3 High-Signal Capability Gaps

Product-relevant backend capabilities with missing or partial frontend ownership:
- applications CRUD is real, but `/tracker` is still mock-backed
- documents redline endpoint exists, but no live review workspace owns it
- smart ingestion endpoints exist, but no live routed multi-step intake flow owns them
- voice-profile is real and should be retained, but has no current live frontend owner
- resume-audit evaluate exists, but audit history is missing/incomplete

Contract-level conflicts:
- ingestion is split across:
  - `/api/v1/ingest`
  - `/api/career/ingest`
  - `/api/ingest/artifacts/upload`
- at least one ingestion endpoint exists on disk but is not mounted

---

## 5. Source-of-Truth Model

### 5.1 Layer Authority

```
┌─────────────────────────────────────┐
│ .claude/wireframes/*.xml            │ ← Canonical design intent
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ frontend/src/screens/**             │ ← Design truth / reference implementations
│ *.wireframe.xml + paired *.tsx      │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ frontend/src/features/**            │ ← Runtime truth
│ frontend/src/pages/**               │ ← Ships to users
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ backend/app/api/**                  │ ← Capability truth
│ mounted endpoints + workflow state  │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ migration-kit JSON wireframes       │ ← Derived artifacts only
└─────────────────────────────────────┘
```

### 5.2 Rules

- design tokens and visual patterns flow from `screens/` to runtime code
- route ownership and user-facing behavior are determined by runtime code
- target-state planning must not ignore real backend capability support
- migration-kit JSON cannot override design truth, runtime truth, or capability truth

---

## 6. Governance Artifacts

### A. `route-family-map.json`

Tracks, per route:
- route family
- design reference
- runtime owner
- route status
- action: keep | expand | merge | replace | retire
- token verification state

### B. `frontend-capability-gap-matrix.json`

Tracks:
- mounted backend capabilities
- live route ownership
- mock-backed or unwired surfaces
- contract consolidation issues
- target-state additions
- voice ownership and ingestion decisions

Current artifact:
- `.claude/plans/frontend-capability-gap-matrix.json`

### C. Layer Authority Documentation

Declare design truth, runtime truth, capability truth, and derived artifacts explicitly in project docs so future audits cannot quietly regress to JSON-only validation.

---

## 7. Reconciliation Workflow

### 7.1 The 8-Step Workflow

```
1. IDENTIFY          → Read canonical XML wireframe
2. REVIEW DESIGN     → Read paired screens/**/*.tsx reference
3. REVIEW RUNTIME    → Read live features/** or pages/**
4. REVIEW CAPABILITY → Map backend support and missing UI ownership
5. COMPARE           → Diff design vs runtime vs capability vs migration artifacts
6. DECIDE            → keep | expand | merge | replace | retire
7. EXECUTE           → backport tokens, consolidate, deprecate, or document ownership
8. VERIFY            → token, build, copy, and capability checks
```

### 7.2 Decision Types

- **keep**: live route is the correct canonical owner
- **expand**: live route remains canonical but must absorb missing capability
- **merge**: runtime and screen-reference are close enough to unify
- **replace**: live route should be superseded by a better screen/runtime candidate
- **retire**: route or capability is not target-state product scope

### 7.3 Capability-Led Additions

These are not “new features” in the abstract; they are already implied by current backend/product reality and should be accounted for in target state:

- application detail/edit/status actions
- smart ingestion upload-tag-save flow
- voice profile creation and management
- document redline workspace
- resume audit history, if backend is completed

---

## 8. Route-Family Guidance

### Good Consolidation Candidates

- `dashboard`
  - design reference: `screens/11_dashboard/DashboardOverview.tsx`
  - runtime truth: `features/dashboard/Dashboard.tsx`

- `landing`
  - design reference: `screens/01_landing/HeroLanding.tsx`
  - runtime truth: `features/landing/LandingPage.tsx`

- `analysis`
  - design reference: `screens/05_analysis/AnalysisWorkbench.tsx`
  - runtime truth: `pages/AnalysisPage.tsx`

- `settings`
  - design reference: `screens/10_settings/SettingsControl.tsx`
  - runtime truth: `features/settings/Settings.tsx`

### Families Requiring Concept Decisions Before Consolidation

- `documents`
  - current runtime route and `DocumentWorkbench` do not yet read as the same product

- `applications`
  - runtime route is mock-backed while screen candidates imply a richer kanban/finalization model

- `jobs`
  - runtime is split between `Opportunities` and `JobQueue`, while screen candidates imply stronger lookout/workbench patterns

- `ingestion`
  - design, runtime, and backend contracts disagree on canonical ownership

- `profile/voice`
  - backend capability is real, but route ownership is unresolved

---

## 9. Voice Capability Decision

Voice should be treated as retained target-state functionality, not as cleanup collateral.

Current state:
- backend supports `/api/auth/voice-profile`
- smart ingestion also supports `documentType = voice`
- frontend schemas already recognize voice assets
- no live routed screen currently owns creation or management of voice profiles

Target-state implication:
- voice needs explicit runtime ownership
- likely owner should be one of:
  - `/profile`
  - `/settings`
  - `/asset-library` with ingestion integration

Default recommendation:
- use `/profile` as canonical runtime owner
- allow asset-library or ingestion flows to feed it

---

## 10. Implementation Plan

### Phase 0: Foundation and Capability Baseline

- create or update `route-family-map.json`
- create or update `frontend-capability-gap-matrix.json`
- document Layer Authority model
- freeze migration-kit JSON as derived/deprecated reference
- decide canonical ingestion contract

### Phase 1: Alpha

Routes:
- `/dashboard`
- `/login`
- `/register`

Actions:
- reconcile design/runtime
- backport token compliance
- mark duplicate batch components as deprecated or removable

### Phase 2: Beta

Routes:
- `/profile`
- `/onboarding`
- `/welcome`
- `/settings`

Actions:
- resolve profile wireframe mismatch
- assign voice ownership
- backport tokens and layout patterns

### Phase 3: Gamma

Routes:
- `/analysis`
- `/career/ingest`
- `/opportunities`

Actions:
- resolve ingestion contract ownership
- define relationship between analysis, asset-library, and smart ingestion
- reconcile job and analysis flows against real capability support

### Phase 4: Delta

Routes:
- `/documents`
- `/tracker`
- `/ksc-generator`
- `/cover-letter-generator`
- `/job-queue`

Actions:
- decide whether documents/workbench are one concept or two
- expand `/tracker` or define applications detail model
- resolve generator mapping
- decide job-queue conceptual ownership

### Phase 5: Epsilon

Routes:
- `/apply/quick`
- `/asset-library`
- `/test-tokens`

Actions:
- finalize utility route status
- decide whether asset-library owns smart ingestion and/or voice adjunct flows
- finish route family classification

---

## 11. Verification Strategy

### Per-Route Verification

```bash
1. cd frontend && yarn build
2. token-enforcement skill
3. migration-audit skill against canonical XML
4. copy/design checks
5. capability ownership check against frontend-capability-gap-matrix.json
```

### Phase Gate Verification

- `route-family-map.json` updated accurately
- `frontend-capability-gap-matrix.json` updated accurately
- escalations documented
- route family actions chosen explicitly

### Completion Verification

- all in-scope production routes have explicit status: `keep`, `expand`, `merge`, `replace`, or `retire`
- all product-relevant mounted backend capabilities have explicit status: `owned`, `deferred`, or `retired`
- token compliance passes for surviving routes
- build passes
- migration audits use canonical XML sources

---

## 12. Risk Register

| Risk | Severity | Mitigation |
|------|----------|------------|
| Profile wireframe mismatch | HIGH | Phase 2 gate: choose dedicated profile mapping or settings-derived mapping |
| Voice ownership unresolved | HIGH | Phase 2 gate: assign `/profile`, `/settings`, or `/asset-library` |
| Ingestion contract split | HIGH | Phase 0/3 gate: choose canonical intake contract and quarantine the others |
| Mock-backed production routes hide missing UI work | HIGH | capability matrix review before accepting token backport as sufficient |
| Generator wireframe ambiguity | MEDIUM | Phase 4 gate: specialized wireframes or documented generic mapping |
| Job-queue conceptual mismatch | MEDIUM | Phase 4 gate: choose lookout, kanban, or separate concept |
| Parallel-track merge conflicts | LOW | separate file ownership per track |
| Build failures during backports | MEDIUM | verify after each route family batch |

---

## 13. Success Metrics

### Primary

- route-family-map is complete and accurate
- capability-gap matrix is complete and accurate
- migration audit is rewired to canonical XML
- all target-state route ownership decisions are explicit
- voice and ingestion ownership decisions are explicit

### Secondary

- duplicate batch surfaces are deprecated or removed
- migration-kit JSON is marked derived/deprecated
- full frontend build passes
- no route family remains in ambiguous ownership without an explicit defer decision

---

## 14. Open Questions and Escalations

1. **Profile mapping**: Should `/profile` map to existing settings design reference or require a dedicated profile wireframe?
   - Recommendation: use settings-derived mapping temporarily, but keep runtime ownership separate.

2. **Voice ownership**: Should voice profile creation live in `/profile`, `/settings`, or `/asset-library`?
   - Recommendation: `/profile` as canonical owner.

3. **Ingestion contract**: Which single backend intake path becomes canonical?
   - Recommendation: pick one public ingestion contract and quarantine the others.

4. **Applications detail surface**: Should CRUD detail/edit live inside `/tracker`, or does applications need a separate detail surface?
   - Recommendation: expand `/tracker` first.

5. **Documents workbench**: Is `DocumentWorkbench` the future of `/documents`, or a separate concept?
   - Recommendation: do not merge until concept alignment is confirmed.

6. **Resume audit history**: Should target state include history now, or defer until backend exposes it?
   - Recommendation: keep evaluation flow; defer history until backend contract exists.

---

## 15. Recommended Next Step

Do not treat this as an 18-route token-backport sprint only.

Treat it as a **source-of-truth and capability reconciliation sprint**:
- runtime routes remain the baseline product surface
- screen pipeline remains the design reference
- backend capability matrix determines what the target product must still expose

This preserves working runtime behavior, avoids design-only overfitting, and prevents missing product capabilities such as voice, smart ingestion, applications detail, and document redlining from being accidentally erased during cleanup.
