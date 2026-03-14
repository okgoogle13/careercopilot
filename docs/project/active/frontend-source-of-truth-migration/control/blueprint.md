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

## Architecture & Authority Layers

| Layer | Authority | Canonical location |
|---|---|---|
| **Runtime truth** | What users can reach today | `frontend/src/App.tsx` |
| **Design truth** | What each screen should look like | `frontend/src/screens/**/*.wireframe.xml` + paired `*.tsx` |
| **Capability truth** | What the backend can actually do | Mounted FastAPI endpoints (`backend/app/api/endpoints/`) |
| **Support artifacts** | Implementation references only | Governance JSON, migration-kit JSON, route-matrix JSON |

**Inviolable rule:** Support artifacts must never override runtime, design, or capability truth.

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

### Acceptance

- Inventory preflight results are recorded for the route before implementation starts.
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

- [ ] **3b.1** Audit current frontend ingestion paths. Identify all active calls not using `/api/v1/ingest`. Mark them for retirement.
- [ ] **3b.2** Build: upload step (file select, drag-drop), extraction/preview step, tag/confirm step, save step.
- [ ] **3b.3** Wire all steps to `/api/v1/ingest` only. Remove or quarantine any non-canonical ingestion calls from active frontend code.
- [ ] **3b.4** Handle error states: upload failure, extraction failure, save failure. Show recovery paths.
- [ ] **3b.5** Write tests covering: successful flow, upload failure, extraction preview, tag-and-save.
- [ ] **3b.6** Run `token-enforcement` and `kerala-rage-brand-enforcer`. 0 violations.

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

## Step 4 — Repair Wireframe-to-Component Workflow

**One-PR size.** Branch: `fix/wireframe-workflow`
**Agent tier:** Gemini Pro (design reasoning) + Flash (bulk validation)
**Depends on:** Step 1 APPROVED
**Parallel-safe:** No with Step 1; parallel-safe with Steps 3a–3d

### Context Brief

The wireframe workflow defined in the migration plan has 9 steps. The previous pass failed because it asserted completion from summaries rather than canonical files. This step installs the correct deterministic workflow so every future route migration goes through validated gates.

Key files:
- `docs/project/active/frontend-source-of-truth-migration/contracts/wireframe-build-contract-prompt.md`
- `scripts/validate-wireframe-workflow.py`
- `scripts/derive-gap-fill-plan.py`
- `frontend/src/screens/**/*.wireframe.xml`

Priority surfaces (in order): landing → dashboard → analysis → applications → documents → ingestion → profile → jobs.

### Tasks

- [ ] **4.1** For each priority surface: run `wireframe-annotator` to refresh intent. Do NOT generate specs yet.
- [ ] **4.2** Run `scripts/validate-wireframe-workflow.py` on each wireframe. Classify failures.
- [ ] **4.3** Fix schema / route-coverage / component-planning failures for each wireframe. Do not mark any surface complete until the validator passes.
- [ ] **4.4** Use `derive-gap-fill-plan.py` to classify each component as: `reuse_as_is` / `keep_behavior_rewrite_styling` / `keep_behavior_extend_tokens` / `reference_only` / `build_new` / `blocked`.
- [ ] **4.5** Resolve `/kr/*` routes: for each, decide `backport` or `retire`. Backport any useful patterns. Remove `/kr/*` registrations from `App.tsx` router.
- [ ] **4.6** Run `component-spec-generator` only for surfaces that have passed wireframe validation and have an approved build contract or explicit decision record.
- [ ] **4.7** Run `token-enforcement` on any new or modified component output from spec generation.

### Acceptance

- Each priority wireframe passes `validate-wireframe-workflow.py` with 0 critical failures
- Gap-fill plan exists for each priority surface (saved to `docs/project/active/`)
- `/kr/*` routes removed from `App.tsx` routing
- Component specs generated only from validated wireframes
- Token enforcement: 0 violations on new specs

### Skills

`wireframe-annotator`, `component-spec-generator`, `token-enforcement`, `manifest-reconciler`, `verification-before-completion`

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
| 3b — Smart ingestion | `feat/ingest-upload-to-save` | ⬜ Waiting on Step 2 | — | — |
| 3c — Voice profile | `feat/profile-voice-capture` | ⬜ Waiting on Step 2 | — | — |
| 3d — Documents redline | `feat/documents-redline-workspace` | ⬜ Waiting on Step 2 | — | — |
| 4 — Wireframe workflow | `fix/wireframe-workflow` | ⬜ Waiting on Step 3 execution progress | — | — |
| 5 — Route cleanup | `chore/route-cleanup` | ⬜ Waiting on Steps 3+4 | — | — |

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

---

*Generated by `blueprint` skill · adversarial review: pending · registered: 2026-03-14*
