# Blueprint: Frontend Source-of-Truth Migration (PR126)

**Date:** 2026-03-14
**Status:** Active — Phase 0 Unblocked
**Owner:** Senior agent / orchestrator
**Canonical path:** `docs/project/active/frontend-source-of-truth-migration/control/blueprint.md`

> **Cold-start contract.** Any agent or engineer picking up any step below must read only this document (and the "Context Brief" embedded in each step) to execute that step. Reading prior conversation history is not required.

---

## Objective

Wire all P0 and P1 backend capabilities into the live routed product, repair the wireframe-to-component workflow, and remove all prototype ambiguity — so that the app has one clear owner per capability, one clear design reference per routed surface, and zero `/kr/*` prototype routes remaining in product truth.

---

## Target State Snapshot

- All live routes map to a single canonical owner in the route matrix, with zero `/kr/*` prototype routes in product truth.
- Each routed surface has a canonical wireframe (`frontend/src/screens/**/*.wireframe.xml`) paired with its runtime screen file and KR Solidarity token compliance.
- Backend capabilities are mapped to routed owners; mock-backed routes are retired or explicitly deferred.
- Wireframe workflow is repaired and verifiable: validator passes, build contracts tracked, and gap-map alignment enforced before spec generation.
- Governance gates for touched routes are green: token-enforcement, migration-audit (when required), and brand compliance checks.
- Execution truth remains `control/blueprint.md` + `control/workflow.md`; analysis and protocol notes are advisory only.

---

## Architecture & Authority Layers

| Layer | Authority | Canonical location |
|---|---|---|
| **Runtime truth** | What users can reach today | `frontend/src/App.tsx` |
| **Design truth** | What each screen should look like | `frontend/src/screens/**/*.wireframe.xml` + paired `*.tsx` |
| **Capability truth** | What the backend can actually do | Mounted FastAPI endpoints (`backend/app/api/endpoints/`) |
| **Support artifacts** | Implementation references only | Governance JSON, migration-kit JSON, route-matrix JSON |

**Inviolable rule:** Support artifacts must never override runtime, design, or capability truth.

---

## Decision Log

- 2026-03-15 — Added Gemini protocol review (`/Users/okgoogle13/.gemini/antigravity/brain/30a372bc-8284-40a6-8082-71b1f8d7298d/skill_review.md.resolved`) as advisory-only logistics guidance. It does not change authority order or gate ownership; human direction remains required for migration decisions.
- 2026-03-16 — Classified `sources/consolidated-reference/**` as a support/reference input layer. It can inform interaction design, decomposition, IA, and behavior extraction, but it cannot override runtime/design/capability truth and cannot be promoted directly unless route-level gap-fill planning marks the candidate `reuse_as_is`.

---

## Blocker Semantics

- `technical_blocked`: required implementation inputs are still incomplete
- `review_blocked`: technical inputs exist, but explicit human signoff is still required before execution
- `execution_ready`: step can begin

Use these labels only to clarify execution state. They are not a separate governance workflow.

---

## Success Metrics (Exit Gate for Full Blueprint)

- [ ] 100% of live product routes classified: `keep` / `merge` / `expand` / `replace` / `retire`
- [ ] 100% of retained backend capabilities have one clear routed frontend owner
- [ ] 0 `/kr/*` prototype routes remain in product truth
- [ ] 0 high-priority mock-backed product routes remain after Step 4
- [ ] 100% of touched routes pass token-enforcement before milestone closure
- [ ] 100% of major component surfaces classified: `canonical` / `support` / `reference-only` / `deferred` / `cleanup`

---

## Dependency Graph

```
Step 1 (Planning inputs) ──────────────────────────────────────────────►
Step 2 (Route matrix + build-contract gate) ──────────────────────────►
                                                          Step 3a ──────►
                                                          Step 3b ──────►  Step 5 (Cleanup)
                                                          Step 3c ──────►
                                                          Step 3d ──────►
Step 4 (Wireframe workflow repair) ───────────────────────────────────►
```

**Steps 3a–3d are parallel-safe.** Each targets a different route owner. They all depend on Step 2 reaching `APPROVED` gate status for the route-matrix classification.

---

## Step 1 — Fix Planning Inputs

**One-PR size.** Branch: `fix/planning-inputs`
**Agent tier:** Gemini Flash (bulk validation)
**Parallel-safe:** No (Gate for all later steps)

### Context Brief

The existing governance artifacts (route matrix, capability gap matrix, build-contract) contain integrity failures. This step makes them trustworthy enough to drive implementation.

Key files:
- `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
- `docs/project/active/frontend-source-of-truth-migration/control/gap-map.json`
- `frontend/scripts/validate-governance-artifacts.mjs`
- `tests/plans/` (pytest governance tests)

Use `frontend/scripts/validate-governance-artifacts.mjs` as an inspection aid until parity is fixed. Do not treat it as the sole readiness gate while `control/fit-for-purpose.md` still marks it `not_fit_for_purpose`.

### Tasks

- [ ] **1.1** Run `pytest tests/plans -q` and `node frontend/scripts/validate-governance-artifacts.mjs`. Record baseline failure count.
- [ ] **1.2** Fix capability gap matrix so every tracked capability has status: `live` / `partial` / `missing` / `deferred`. No empty status fields.
- [ ] **1.3** Align Python governance tests with the JS validator so both catch the same class of integrity failures.
- [ ] **1.4** Classify all reviewed skills/scripts as `approved` / `approved_with_limits` / `not_fit_for_purpose`. Record in `control/fit-for-purpose.md`.
- [ ] **1.5** Re-run the Python governance tests and the JS validator. Python tests are the required pass gate; the JS validator must either match or expose the remaining parity gap.

### Acceptance

- `pytest tests/plans -q` → 0 failures
- JS validator parity state is explicitly recorded in `control/fit-for-purpose.md`
- Capability gap matrix has no empty `status` fields
- Skills/scripts review artifact is updated with dispositions

### Skills

`verification-before-completion`, `project-health-checker`

---

## Step 2 — Resolve Build-Contract Gate (`/tracker`)

**One-PR size.** Branch: `fix/tracker-build-contract`
**Agent tier:** Gemini Pro (design reasoning)
**Parallel-safe:** No (Unblocks Step 3a and the broader Phase-3 wireframe workflow)

### Context Brief

The first route-level build contract exists at `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-tracker.xml`.

Current execution state: `execution_ready`

Technical blocker status:
1. `KanbanColumn` ownership is resolved in the contract decision log
2. `ApplicationDetailPanel`, `ApplicationEditForm`, `ApplicationStatusActions`, and `ApplicationArchiveAction` are resolved in the contract decision log and supplementary briefs

The supplementary brief is at `contracts/tracker-supplementary-component-briefs.xml`.

Human approval is now recorded. Step 3 execution may begin.

### Tasks

- [ ] **2.1** Read `contracts/build-contract-tracker.xml` and `contracts/tracker-supplementary-component-briefs.xml` in full.
- [ ] **2.2** Verify the contract decision log and supplementary briefs fully cover `KanbanColumn`, `ApplicationDetailPanel`, `ApplicationEditForm`, `ApplicationStatusActions`, and `ApplicationArchiveAction`.
- [ ] **2.3** Validate the contract against: `control/route-matrix.json` (route ownership), `control/gap-map.json` (capability alignment), `frontend/src/screens/tracker/tracker.wireframe.xml` (design truth).
- [ ] **2.4** Record explicit human approval in `control/status.md` and the contract review metadata.
- [ ] **2.5** Update build-contract gate status from `review_blocked` → `execution_ready`. Record reviewer and date.

### Acceptance

- Build contract gate: `execution_ready`
- Contract review explicitly records that technical gaps are resolved and human approval is complete
- No open technical or review blockers remain in the `/tracker` build contract

### Skills

`brainstorming` (for ownership decision), `design-orchestration` (gate), `wireframe-annotator`

---

## Step 3 — Route Preflight (Inventory Support Only)

**Purpose:** Catch route-family conflicts, shared-shell inheritance, and duplicate live-looking surfaces before any Step 3 route work begins.
**Support-only:** Inventory signals must not override the route matrix or gap map.
**Lane reference:** `docs/design/architecture-migration.png` defines the KEEP/WRAP/REWRITE/DELETE lanes used for reporting.

### Tasks

- [ ] **3.0.1** Run `frontend/scripts/component-inventory.ts` and save the latest inventory snapshot.
- [ ] **3.0.2** Review `frontend/analysis/frontend-architecture-report.json` for route-family conflicts and prototype `/kr/*` bleed-through.
- [ ] **3.0.3** Record for the route being executed: route-family conflicts, shared-shell inheritance (legacy vs route-local), duplicate live-looking surfaces, and lane label `KEEP` / `WRAP` / `REWRITE` / `DELETE` (support label only).
- [ ] **3.0.4** Audit shared primitives that sit above or around the route body before implementation starts: `Logo`, `Sidebar`, `TopNav`, `Footer`, `AuthGuard`, `KrDarkDock`, and any route-family shell chrome. Record whether each primitive is canonical runtime truth, reference-only, or duplicated drift.

### Acceptance

- Inventory preflight results are recorded for the route before implementation starts.
- Shared primitive ownership is recorded for the route before implementation starts, so Figma/support references cannot silently replace live shell chrome.
- Lane labels are used only for reporting; canonical ownership remains the route matrix.

---

## Step 3a — Wire Applications CRUD (`/tracker`) ⚡ PARALLEL

**One-PR size.** Branch: `feat/tracker-real-crud`
**Agent tier:** Gemini Flash
**Depends on:** Step 2 APPROVED
**Parallel-safe:** Yes (with Steps 3b, 3c, 3d)

### Context Brief

**Route:** `/tracker`
**Backend:** `POST/GET/PATCH/DELETE /api/applications` (real CRUD). See `backend/app/api/endpoints/`.
**Current execution state:** `in_progress`
**Problem:** The canonical route owner has now been moved onto the real applications API path, but Step 3a still needs route-local test closure and live-session verification before the milestone is complete.
**Design reference:** `frontend/src/screens/tracker/tracker.wireframe.xml`

### Tasks

- [x] **3a.1** Identify current mock data path in the canonical route owner and remove it from the primary `/tracker` runtime path.
- [x] **3a.2** Replace mock data path with real `GET /api/applications` call via the existing `api/` service layer. Use TanStack Query.
- [x] **3a.3** Wire real update/archive behavior through the canonical `applicationService` path and align backend partial-update semantics.
- [x] **3a.4** Add `ApplicationDetailPanel` (read), `ApplicationEditForm` (write), `ApplicationStatusActions` (status), `ApplicationArchiveAction` (delete) per build contract briefs.
- [x] **3a.5** Write route-local tests: mock API responses → assert list, error, detail open, and status-move refresh behavior.
- [x] **3a.6** Run `token-enforcement` skill on all new/modified components. Fix token violations before marking done.
- [ ] **3a.7** Run `kerala-rage-brand-enforcer`. Zero flora/prohibited terms allowed.

### Acceptance

- `/tracker` loads real application data from backend (no mock fallback in prod code path)
- All four new component surfaces render and persist correctly
- `yarn test` passes for tracker feature
- Token enforcement: 0 violations
- Brand enforcer: 0 violations

### Skills

`executing-plans`, `token-enforcement`, `kerala-rage-brand-enforcer`, `verification-before-completion`

---

## Step 3b — Wire Smart Ingestion (`/career/ingest`) ⚡ PARALLEL

**One-PR size.** Branch: `feat/ingest-upload-to-save`
**Agent tier:** Gemini Flash
**Depends on:** Step 2 APPROVED
**Parallel-safe:** Yes

### Context Brief

**Route:** `/career/ingest`
**Backend:** `POST /api/v1/ingest` — canonical ingestion contract. See `backend/app/api/endpoints/ingest.py`.
**Problem:** Multiple competing ingestion contracts in frontend planning. No complete upload-to-save flow exists.
**Design reference:** `frontend/src/screens/ingest/` (nearest wireframe)

### Tasks

- [x] **3b.1** Audit current frontend ingestion paths. Identify all active calls not using `/api/v1/ingest`. Mark them for retirement.
- [x] **3b.2** Build: upload step (file select, drag-drop), extraction/preview step, tag/confirm step, save step.
- [x] **3b.3** Wire all steps to `/api/v1/ingest` only. Remove or quarantine any non-canonical ingestion calls from active frontend code.
- [x] **3b.4** Handle error states: upload failure, extraction failure, save failure. Show recovery paths.
- [x] **3b.5** Write tests covering: successful flow, upload failure, extraction preview, tag-and-save.
- [x] **3b.6** Run `token-enforcement` and `kerala-rage-brand-enforcer`. 0 violations.

### Acceptance

- Upload-to-save flow is fully routed and functional under `/career/ingest`
- No non-canonical ingestion contracts in active frontend code
- `yarn test` passes for ingestion feature
- Token and brand enforcement: 0 violations

### Skills

`executing-plans`, `api-contract-validator`, `token-enforcement`, `verification-before-completion`

---

## Step 3c — Wire Voice Profile (`/profile`) ⚡ PARALLEL

**One-PR size.** Branch: `feat/profile-voice-capture`
**Agent tier:** Gemini Flash
**Depends on:** Step 2 APPROVED
**Parallel-safe:** Yes

### Context Brief

**Route:** `/profile`
**Backend:** Voice profile endpoint (see `backend/app/api/endpoints/`).
**Problem:** Capability exists but no live route owns voice profile creation and management.
**Design reference:** `frontend/src/screens/profile/` (nearest wireframe)

### Tasks

- [ ] **3c.1** Locate voice profile API endpoint in backend. Confirm schema (create, fetch, update).
- [ ] **3c.2** Add voice profile capture UI to `/profile` route: record or upload, playback preview, save.
- [ ] **3c.3** Add voice profile management view: existing profiles list, delete, re-record.
- [ ] **3c.4** Keep `/settings` out of voice profile primary flow unless route matrix explicitly marks it as secondary integration.
- [ ] **3c.5** Write tests: create profile, fetch profiles, delete profile, error states.
- [ ] **3c.6** Token-enforcement and brand-enforcer: 0 violations.

### Acceptance

- `/profile` is the single canonical owner of voice profile creation and management
- No duplicate or orphan voice profile surfaces in active routing
- Tests pass, token/brand clean

### Skills

`executing-plans`, `token-enforcement`, `verification-before-completion`

---

## Step 3d — Wire Documents Redline (`/documents`) ⚡ PARALLEL

**One-PR size.** Branch: `feat/documents-redline-workspace`
**Agent tier:** Gemini Flash
**Depends on:** Step 2 APPROVED
**Parallel-safe:** Yes

### Context Brief

**Route:** `/documents`
**Backend:** Document redline processing endpoints in `backend/app/api/endpoints/documents.py`.
**Problem:** Redline capability is real but the live documents UI has no redline workspace.
**Design reference:** `frontend/src/screens/documents/` (nearest wireframe)

### Tasks

- [ ] **3d.1** Locate redline endpoints in backend. Confirm input/output schema.
- [ ] **3d.2** Add redline entry point to the documents list view (button / action per document).
- [ ] **3d.3** Add a redline review workspace panel or page owned by `/documents` (not a new isolated route).
- [ ] **3d.4** Write tests: trigger redline, display result, error state.
- [ ] **3d.5** Token-enforcement and brand-enforcer: 0 violations.

### Acceptance

- `/documents` exposes redline entry and review workspace
- No isolated duplicate redline page outside the documents route
- Tests pass, token/brand clean

### Skills

`executing-plans`, `token-enforcement`, `verification-before-completion`

---

## Step 4 — Repair Wireframe-to-Component Workflow and Audit Figma Support Inputs

**One-PR size.** Branch: `fix/wireframe-workflow`
**Agent tier:** Gemini Pro (design reasoning) + Flash (bulk validation)
**Depends on:** Step 1 APPROVED
**Parallel-safe:** No with Step 1; parallel-safe with Steps 3a–3d

### Context Brief

The wireframe workflow defined in the migration plan now has 12 steps, including the late-stage TSX identity gate. The previous pass failed because it asserted completion from summaries rather than canonical files. This step installs the correct deterministic workflow so every future route migration goes through validated gates, and it defines the only approved entry point for evaluating Figma-derived support candidates.

Direct Figma MCP page harvest is allowed only as a structural accelerator inside this step. It may draft build-contract inputs and wireframe diffs from connected Scaffold pages, but it does not become design truth, runtime truth, capability truth, or token authority.

Key files:
- `docs/project/active/frontend-source-of-truth-migration/contracts/wireframe-build-contract-prompt.md`
- `scripts/validate-wireframe-workflow.py`
- `scripts/derive-gap-fill-plan.py`
- `frontend/src/screens/**/*.wireframe.xml`
- `docs/project/active/frontend-source-of-truth-migration/sources/consolidated-reference/**/*.tsx`

Priority surfaces (in order): landing → dashboard → analysis → applications → documents → ingestion → profile → jobs.

### Tasks

- [ ] **4.1** For each priority surface: run `wireframe-annotator` to refresh intent. Do NOT generate specs yet.
- [ ] **4.2** Run `scripts/validate-wireframe-workflow.py` on each wireframe. Classify failures.
- [ ] **4.3** Fix schema / route-coverage / component-planning failures for each wireframe. Do not mark any surface complete until the validator passes.
- [ ] **4.4** Use `derive-gap-fill-plan.py` to classify each component as: `reuse_as_is` / `keep_behavior_rewrite_styling` / `keep_behavior_extend_tokens` / `reference_only` / `build_new` / `blocked`.
- [ ] **4.4a** Index `sources/consolidated-reference/**/*.tsx` as `support_reference` candidates only. They are evidence inputs, not authority.
- [ ] **4.4b** Block direct promotion of support-reference candidates that are token-dirty, `figma:asset` bound, remote-asset bound, or non-compliant with zero-flora / no non-human mascot rules.
- [ ] **4.4c** Generate route audit packs for `landing`, `dashboard`, and `analysis` that record approved reuse mode, candidate path, exclusions, and rewrite requirements.
- [ ] **4.4d** Record exactly what may be reused from each approved support-reference candidate: behavior, IA/layout, and motion patterns only where applicable. Styling, assets, and motifs must be rewritten unless the planner explicitly marks `reuse_as_is`.
- [ ] **4.4e** Run `design-orchestration` on selected support-reference TSX candidates to map them to KR archetypes and record `generic_saas_risk` before audit-pack approval.
- [ ] **4.4f** When Figma MCP page access exists, record the direct page inventory and shared-shell notes as support-only evidence before expanding route audits beyond the current priority pack set.
- [ ] **4.4g** Allow only these Figma MCP accelerators in this step: draft build-contract inputs, draft wireframe XML or drift diffs, and scaffold-injection pilots for shell decomposition. Do not derive backend schemas or token truth from Figma outputs.
- [ ] **4.5** Resolve `/kr/*` routes: for each, decide `backport` or `retire`. Backport any useful patterns. Remove `/kr/*` registrations from `App.tsx` router.
- [ ] **4.6** Run `component-spec-generator` only for surfaces that have passed wireframe validation and have an approved build contract or explicit decision record.
- [ ] **4.7** Run `token-enforcement` on any new or modified component output from spec generation.

### Acceptance

- Each priority wireframe passes `validate-wireframe-workflow.py` with 0 critical failures
- Gap-fill plan exists for each priority surface (saved to `docs/project/active/`)
- `landing`, `dashboard`, and `analysis` each have a route-scoped support-reference audit pack
- Direct Figma MCP outputs, when used, remain support-only and are limited to approved structural accelerators
- Support-reference audit packs record archetype mapping plus `generic_saas_risk`
- `/kr/*` routes removed from `App.tsx` routing
- Component specs generated only from validated wireframes
- No raw consolidated-reference component is consumed downstream without an explicit reuse mode
- Token enforcement: 0 violations on new specs

### Skills

`wireframe-annotator`, `design-orchestration`, `component-spec-generator`, `token-enforcement`, `manifest-reconciler`, `verification-before-completion`

---

## Step 5 — Route Cleanup and Folder Canonicalisation

**One-PR size.** Branch: `chore/route-cleanup`
**Agent tier:** Gemini Flash
**Depends on:** Steps 3a–3d AND Step 4 ALL APPROVED
**Parallel-safe:** No (last gate)

### Context Brief

Cleanup happens only after replacement. Do not delete any surface before a live owner exists.

Target folder structure (after cleanup):
- `frontend/src/features/<family>/**` → route-family runtime code
- `frontend/src/pages/**` → route entrypoints / thin shells only
- `frontend/src/screens/**` → design/reference TSX + wireframe XML only
- `frontend/src/components/kerala-rage/` → KR Solidarity design system components
- Retire or clearly mark `phase3-batch*` and other reference-only duplicates

### Tasks

- [ ] **5.1** Audit `frontend/src` for surfaces that are now known duplicates (live owner confirmed in Steps 3–4).
- [ ] **5.2** Move or retire duplicate/reference-only surfaces. Update imports. Do NOT delete until tests pass.
- [ ] **5.3** Update `frontend/src/App.tsx`: confirm all retired/cleaned routes are removed and no `/kr/*` remains.
- [ ] **5.4** Update inventory scripts so each entry reports: `live_routed_owner`, `paired_screen_reference`, `backend_dependency`, `mock_backed`, `retirement_candidate`, `shared_shell_dependency`, `inherited_shell`, `shell_status`, `route_family_conflict`, `lane_label`.
- [ ] **5.5** Run full test suite: `yarn test`. Run type-check: `yarn type-check`. Run lint: `yarn lint`. All must pass.
- [ ] **5.6** Run `migration-audit` on cleaned surfaces for final compliance snapshot, but only for routes with explicit benchmark coverage.

### Acceptance

- `App.tsx` has 0 `/kr/*` routes
- 0 mock-backed high-priority product routes remain
- Folder structure matches canonical layout above
- `yarn test`, `yarn type-check`, `yarn lint` all pass
- `migration-audit` final snapshot shows 0 critical violations for routes with defined benchmarks

### Skills

`executing-plans`, `migration-audit`, `finishing-a-development-branch`, `verification-before-completion`

---

## Step 6 — Migration Cleanup: Legacy Routes & Orphaned Screens (6A Route Retirement + 6B Screen Pairing) ⚡ PARALLEL

**One-PR size per sub-step.** Branch prefix: `feat/migration-cleanup-*`
**Agent tier:** Gemini Pro (for refactoring logic) and design-system-sidekick (for visual compliance)
**Depends on:** Step 2 APPROVED; any sub-step that consumes consolidated-reference patterns also depends on a route-local Step 4 audit pack
**Parallel-safe:** Yes (Sub-steps can run in parallel)

### Context Brief

The orphan report (`docs/manifests/orphans.json`) identified 11 non-feature routes (legacy pages/components) and 6 unrouted screens (`04_ingestion`, `06_lookout`, `07_kanban`, `08_workbench`, `09_finalization`, `10_settings`). This step systematically moves them into the canonical `src/features/` architecture and pairs them with their UI screens.

- **Step 6A** covers route retirement, registry cleanup, and prototype removal.
- **Step 6B** covers screen pairing, shell finalization, and feature ownership cleanup.

Note: `04_ingestion` and `07_kanban` overlap with Steps 3a/3b, so work here should complement or finalize those connections. Support-reference candidates may inform these pairings only after the route-local Step 4 audit records an approved reuse mode.

### Tasks

- [ ] **6.1 Opportunities & Job Queue (`/opportunities`, `/job-queue`)**: Move `./pages/JobQueue` into `features/jobs/` or `features/opportunities/`. Pair `/opportunities` with `src/screens/06_lookout`.
- [ ] **6.2 Workbench & KSC (`/ksc-generator`)**: Implement canonical feature for `src/screens/08_workbench`.
- [ ] **6.3 Finalization (`/cover-letter-generator`)**: Implement canonical feature for `src/screens/09_finalization`.
- [ ] **6.4 Settings (`/settings`)**: Implement canonical feature for `src/screens/10_settings`.
- [ ] **6.5 Analysis & Apply Quick**: Move `./pages/AnalysisPage` (pair with `05_analysis`) and `./pages/ApplyQuick` to canonical `features/`.
- [ ] **6.6 Resolve UNKNOWN**: Fix `/onboarding` route (currently pointing to UNKNOWN source, likely needs pairing with `03_onboarding`).
- [ ] **6.7 Retire Prototypes**: Safely delete or consolidate `/kr/landing`, `/kr/auth`, `/kr/onboarding`, `/kr/analysis`, `/kr/dashboard`, and `/test-tokens`.
- [ ] **6.8 TSX Identity Review Gate**: For any route that adopts support-reference patterns or newly generated TSX, run `design-orchestration` → `kerala-rage-brand-enforcer` → `m3-expressive-token-orchestrator` → `kerala-rage-typography-strategy`. Save the review as `analysis/YYYY-MM-DD-tsx-identity-gate-<route>.md` using `analysis/tsx-identity-gate-template.md`. Record outcome as `identity_pass` / `identity_pass_with_rewrites` / `identity_fail_generic_saas` / `identity_fail_brand_drift`. Do not close the route on failure.
- [ ] **6.9 Gate Check**:
  // turbo
  Run `pre-ship-solidarity-gate` for all UI-touching changes to ensure Visual Compliance ≥ 90, Zero-Flora, and semantic tokens only.

### Acceptance

- 0 unrouted screens in `orphans.json`.
- 0 non-feature routes remaining (excluding `App.tsx` router wrapper).
- `yarn test` passes for all migrated features.
- Any Figma-informed pairing cites an approved Step 4 route audit pack before implementation starts.
- Any Figma-informed or generated TSX records a passing TSX identity review before route closure.
- KR Solidarity compliance gate (`pre-ship-solidarity-gate`) passes cleanly for all migrated UI surfaces.

### Skills

`blueprint`, `executing-plans`, `design-orchestration`, `token-enforcement`, `kerala-rage-brand-enforcer`, `m3-expressive-token-orchestrator`, `kerala-rage-typography-strategy`

---

## Risk Register

| # | Risk | Severity | Owner | Mitigation | Escalate after |
|---|---|---|---|---|---|
| R1 | `/kr/*` cleanup breaks a live feature | HIGH | Step 5 agent | Feature-flag removal; backport before delete | 1 day |
| R2 | Mock-backed `/tracker` rewrite regresses UI | HIGH | Step 3a agent | E2E tests before merge | 1 session |
| R3 | Build-contract blockers re-open during Step 3 | HIGH | Orchestrator | Surface to brainstorming immediately; do not improvise | 1 day |
| R4 | Token drift in new components | MED | All Step-3 agents | `token-enforcement` per PR; no merge with violations | 2 days |
| R5 | Design vs runtime conflict discovered mid-step | MED | Orchestrator | Route matrix is canonical; return to Phase 0 brainstorming | 1 day |
| R6 | Backend incomplete for resume audit (P2) | MED | Product owner | Defer to explicit backlog item; do not block Phase 2 | End of Step 3 |
| R7 | Governance artifact drift re-introduced | LOW | Step 1 agent | CI gate: validators run on every PR | 3 days |

---

## Delegation Payloads (task-router-mcp format)

```yaml
tasks:
  - task_id: "pr126-step-1"
    assigned_to: "flash-agent"
    priority: "critical"
    inputs:
      plan_step: 1
      branch: "fix/planning-inputs"
      verification_commands:
        - "pytest tests/plans -q"
        - "node frontend/scripts/validate-governance-artifacts.mjs"

  - task_id: "pr126-step-2"
    assigned_to: "pro-agent"
    priority: "critical"
    inputs:
      plan_step: 2
      branch: "fix/tracker-build-contract"
      depends_on: ["pr126-step-1"]

  - task_id: "pr126-step-3a"
    assigned_to: "flash-agent-A"
    priority: "high"
    inputs:
      plan_step: "3a"
      branch: "feat/tracker-real-crud"
      depends_on: ["pr126-step-2"]

  - task_id: "pr126-step-3b"
    assigned_to: "flash-agent-B"
    priority: "high"
    inputs:
      plan_step: "3b"
      branch: "feat/ingest-upload-to-save"
      depends_on: ["pr126-step-2"]

  - task_id: "pr126-step-3c"
    assigned_to: "flash-agent-C"
    priority: "high"
    inputs:
      plan_step: "3c"
      branch: "feat/profile-voice-capture"
      depends_on: ["pr126-step-2"]

  - task_id: "pr126-step-3d"
    assigned_to: "flash-agent-D"
    priority: "high"
    inputs:
      plan_step: "3d"
      branch: "feat/documents-redline-workspace"
      depends_on: ["pr126-step-2"]

  - task_id: "pr126-step-4"
    assigned_to: "pro-agent"
    priority: "high"
    inputs:
      plan_step: 4
      branch: "fix/wireframe-workflow"
      depends_on: ["pr126-step-1"]

  - task_id: "pr126-step-5"
    assigned_to: "flash-agent"
    priority: "normal"
    inputs:
      plan_step: 5
      branch: "chore/route-cleanup"
      depends_on: ["pr126-step-3a", "pr126-step-3b", "pr126-step-3c", "pr126-step-3d", "pr126-step-4"]
```

---

## PR Conventions

- Branch pattern: `(feat|fix|chore)/pr126-<short-description>`
- PR size: ≤400 lines per PR; split if needed
- Commits: Conventional Commits format (`feat(tracker): replace mock data path with real CRUD`)
- Reviews: 2 approvals required before merge to `develop`
- Merge strategy: squash for feature branches
- After every PR merge: re-run `validate-governance-artifacts.mjs` and `pytest tests/plans -q`

---

## Progress Tracker

| Step | Branch | Status | PRs | Blocker |
|---|---|---|---|---|
| 1 — Fix planning inputs | `fix/planning-inputs` | ✅ Execution ready | — | — |
| 2 — Tracker build contract | `fix/tracker-build-contract` | ✅ Execution ready | — | — |
| 3a — Applications CRUD | `feat/tracker-real-crud` | 🟢 Ready to start | — | — |
| 3b — Smart ingestion | `feat/ingest-upload-to-save` | ✅ COMPLETE | PR126 | — |
| 3c — Voice profile | `feat/profile-voice-capture` | ⬜ Waiting on Step 2 | — | — |
| 3d — Documents redline | `feat/documents-redline-workspace` | ⬜ Waiting on Step 2 | — | — |
| 4 — Wireframe workflow | `fix/wireframe-workflow` | ⬜ Waiting on Step 3 execution progress | — | — |
| 5 — Route cleanup | `chore/route-cleanup` | ⬜ Waiting on Steps 3+4 | — | — |
| 6 — Migration Cleanup (11 routes, 6 screens) | `feat/migration-cleanup-*` | 🟢 Ready to start | — | — |

---

## Plan Mutation Protocol

Steps may be split, inserted, or skipped **only** with an explicit audit trail:

```
MUTATION LOG
Date: [date]
Actor: [agent or human]
Step affected: [step id]
Change: [split | insert | skip]
Reason: [one sentence]
Approved by: [human name or "auto-approved at low risk"]
```

No silent mutations. No scope expansions without a mutation log entry.
MUTATION LOG
Date: 2026-03-15
Actor: AGENT (Blueprint Generator)
Step affected: 6 (New)
Change: insert
Reason: Added Step 6 specifically to migrate the 11 legacy routes and 6 orphaned screens identified by `detect-orphans.ts`.
Approved by: auto-approved at low risk (extension of existing objective)

---

*Generated by `blueprint` skill · adversarial review: delegated to `design-orchestration` · registered: 2026-03-15*
