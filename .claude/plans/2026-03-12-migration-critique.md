# Frontend Source-of-Truth Migration — Current-State Critique

> **Role:** Kerala Rage Engineer
> **Branch:** `feat/frontend-source-of-truth-migration`
> **Reference Commit:** 48ba8014 (post-Gemini fixes) — **NOT FOUND IN GIT HISTORY**
> **Date:** 2026-03-12
> **Artifacts Analysed:**
> - `.claude/plans/frontend-capability-gap-matrix.json`
> - `.claude/plans/route-family-target-state.json`
> - `.claude/plans/2026-03-12-frontend-source-of-truth-migration.md`
> - `AGENTS.md`
> - `frontend/src/App.tsx`
> - `.claude/route-family-map.json`
> - `frontend/scripts/validate-governance-artifacts.mjs`
> - `tests/plans/test_route_family_map.py`
> - `tests/plans/test_layer_authority_docs.py`

---

## CRITICAL FINDING: Phantom Commit

Commit `48ba8014` does not exist in git history. The shallow clone contains 30+ commits and none match. The "CONFIRMED CHANGES" listed against this commit cannot be verified against an actual diff. This is either:

1. A commit that was squashed, force-pushed, or exists on a different branch
2. A hallucinated reference from a previous AI session

**Impact:** Every claim below about "confirmed changes" must be independently verified against actual file state, not commit attribution.

---

## 1. COMPLETENESS — Score: 5/10

**Did commit 48ba8014 fully resolve the backend gates and unrouted issues?**

- **Backend gates (workflow/resume-audit):** ✅ VERIFIED. `resume_audit.py` is mounted at `/api/resume-audit` via `api_router`. `workflows.py` is mounted at `/api/workflows`. Both routers confirmed in `backend/app/api/router.py`. However, `workflows.py` returns 503/501 for key operations — this is a placeholder gate, not a functional one.
- **Voice locked to /profile:** ✅ PARTIALLY. `route-family-map.json` sets `account` canonical_owner to `/profile`. `route-family-target-state.json` cross_family_decisions declares `preferred_runtime_owner: "/profile"`. However, no actual UI for voice profile exists at `/profile` in `App.tsx` — `ProfileView.tsx` has no voice capture component.
- **ResumeAuditPage/IngestionFlow promoted:** ❌ NOT PROMOTED. Neither `ResumeAuditPage` nor `IngestionFlow` appears in `App.tsx` route definitions. `ResumeAuditPage` is listed as a design reference in `route-family-map.json` but has no `<Route>` entry. `IngestionFlow` (from `screens/04_ingestion/`) is likewise unrouted. Only `IngestionPage` (from `pages/`) is routed at `/career/ingest`.
- **genkit_job_analysis introduced:** ❌ NO SPECIFIC FLOW. No file named `genkit_job_analysis.py` exists. Related flows exist: `job_listing_extractor.py`, `job_analyzer.py`, `unified_job_analyzer.py`, `advanced_job_matching.py`. The function `advanced_job_analysis_flow` exists in `job_listing_extractor.py`. The claim is imprecise at best.
- **Duplicate validation script removed:** ✅ VERIFIED. No `validate-duplicate*` or `duplicate_validation*` scripts found in `scripts/`.

**Remaining capability gaps:**
- `resume_audit` frontend expects `GET /resume-audit/history` but backend does not expose it
- `workflow_orchestration` endpoints return 503/501 — frontend has no functional workflow integration
- `documents_redline` backend (`POST /api/documents/process/redline`) has zero frontend UI owner
- `applications_crud` backend is fully mounted but `/tracker` remains mock-backed
- `voice_profile_capture` backend exists (`POST /api/auth/voice-profile`) but has no frontend surface
- `artifact_upload_contract` (`POST /api/ingest/artifacts/upload`) exists on disk but is NOT mounted

**Strategic Recommendation:** Gate the migration on a verified commit. Run `git log --all --oneline | grep 48ba80` to confirm. If the commit does not exist, re-baseline all "confirmed changes" against HEAD state and document the actual delta.

---

## 2. SEQUENCING — Score: 6/10

**Are there hidden dependencies or workstream conflicts?**

- **Hidden dependency:** Task 4 (resolve ingestion contract) and Task 10 (ingestion family expand) are tightly coupled. The migration plan separates them into different phases but `route-family-target-state.json` still shows `canonical_ingestion_contract.status: "unresolved"` while `route-family-map.json` already resolved it to `/api/v1/ingest`. This split creates a state where one artifact says "done" and the other says "pending".
- **Workstream conflict:** Workstream 6 splits route-family reconciliation across three agents (Claude Code, Codex CLI, GitHub Copilot). The ingestion family touches all three artifacts plus backend router configuration. No single agent owns the full ingestion stack, creating a merge conflict risk.
- **Phase gating gap:** The plan requires 85/100 scoring per family before cleanup (Task 7B Step 3), but no automated scoring mechanism exists. The scoring rubric is defined (30% governance, 25% capability, 25% reconciliation, 20% compliance) but has no implementation.
- **Missing sequencing:** The plan does not sequence the retirement of 5 `/kr/*` prototype routes. These are live in `App.tsx` but only `/kr/landing` is tracked by the `landing-prototype` family. The other 4 (`/kr/auth`, `/kr/onboarding`, `/kr/analysis`, `/kr/dashboard`) are listed in `cross_family_decisions.prototype_routes.affected_routes` but have no family ownership for retirement execution.

**Corrected sequence:**
1. Verify/rebase commit reference → establish trusted baseline
2. Sync ingestion contract status across ALL governance artifacts
3. Add all 5 `/kr/*` routes to the `landing-prototype` family (or create a dedicated `prototype` family)
4. Complete route promotions (ResumeAuditPage, IngestionFlow) before capability expansion
5. Build automated scoring gate before entering cleanup phase

**Strategic Recommendation:** Create a `migration-sequence-validation.mjs` script that enforces artifact sync and prerequisite completion before each phase can begin.

---

## 3. AGENTIC EXECUTABILITY — Score: 4/10

**Are the markdown plan steps precise enough for Codex CLI autonomous execution?**

- **Task 2 is already complete but marked as `[ ]`:** `.claude/route-family-map.json` already exists with all 13 families, decisions, and capability-led additions. `tests/plans/test_route_family_map.py` already has 4 passing tests. An agent following the plan literally would try to create files that already exist and would either fail or overwrite them.
- **Task 3 is already complete but marked as `[ ]`:** AGENTS.md already contains "design truth", "runtime truth", and "capability truth" in the Layer Authority section. `tests/plans/test_layer_authority_docs.py` passes. The plan says "FAIL until section exists" but it will PASS immediately.
- **Task 5 test will PASS immediately:** `route-family-target-state.json` already has `voice_ownership.preferred_runtime_owner: "/profile"`. The plan says "FAIL until explicit owner is set" — it won't fail.
- **Task 4 needs state reconciliation:** The route-family-map already resolved ingestion to `/api/v1/ingest`, but route-family-target-state still says `status: "unresolved"`. An agent executing Task 4 would update route-family-map (already done) but might miss route-family-target-state.

**Where the agent WILL fail or stall:**
1. **Step references non-existent test infrastructure:** Plan references `pytest tests/plans/test_route_family_map.py` but pytest is not installed in the project's dev dependencies. Agent must install it first.
2. **`route-family-map.json` already has `canonical_backend_contracts` as a nested object at root level AND as an array on the ingestion family.** Test expects array on family. These are different structures and an agent might create a duplicate or conflicting entry.
3. **Task 7C references `frontend/scripts/component-inventory.ts`** but the script's current state does not have governance-derived fields (`routeFamily`, `layerTruth`, etc.). An agent would need to understand the existing script's full structure before adding fields — the plan gives no context about current schema.
4. **4 of 5 suggested scripts do not exist:** `generate-route-family-map.mjs`, `detect-mock-backed-routes.mjs`, `find-unowned-capabilities.mjs` are listed as "suggested" but not scheduled in any task. Only `validate-governance-artifacts.mjs` exists.

**Strategic Recommendation:** Mark completed tasks as `[x]` with commit evidence. For remaining tasks, add `PRECONDITION:` blocks listing exact current file state so agents don't re-execute completed work.

---

## 4. REGRESSION RISK — Score: 5/10

**What breaks if the live Genkit path or `/profile` voice ownership regresses?**

- **Genkit path regression:** `resume_audit.py` directly imports and calls `resumeAuditRKL` from `app.genkit_flows.resume_audit`. If the Genkit import chain breaks (missing `ENABLE_GENKIT_FLOWS=true`, API key, or model init failure), the `/api/resume-audit/evaluate` endpoint throws a 500 with no graceful degradation. The `workflows.py` endpoint already returns 503 as a permanent state — it has no Genkit dependency but also no functionality.
- **Voice profile regression:** `auth.py` imports `voiceProfileExtractorFlow` from `app.genkit_flows.smart_ingestion`. If the smart ingestion Genkit flow breaks, the `/api/auth/voice-profile` endpoint silently fails. The frontend has no voice UI anyway, so this is currently invisible — but it becomes critical once voice is built on `/profile`.
- **Route promotion regression:** If `ResumeAuditPage` or `IngestionFlow` are promoted to `App.tsx` and later removed or the import path changes, the route will render a blank or crash. No lazy loading or error boundaries protect individual route components in the current `App.tsx`.
- **No rollback strategy documented:** The migration plan defines branch strategy (create `feat/frontend-source-of-truth-migration` from current tip) but has zero rollback documentation. No git tag, no snapshot, no feature flags.

**Strict rollback strategy (must implement before proceeding):**
1. Tag current HEAD as `pre-migration-baseline` before any route changes
2. Add React error boundaries per route family in `ProtectedLayout`
3. Gate Genkit-dependent routes behind `ENABLE_GENKIT_FLOWS` env check at the component level
4. Add feature flags for promoted routes (ResumeAuditPage, IngestionFlow) so they can be disabled without a deploy
5. Document the single command to revert: `git revert --no-commit HEAD~N..HEAD && git commit -m "revert: migration rollback"`

**Strategic Recommendation:** Add a `ROLLBACK.md` to `.claude/plans/` documenting exact rollback steps for each migration phase, including which governance artifacts to restore.

---

## 5. GOVERNANCE CONSISTENCY — Score: 7/10

**Are `frontend-capability-gap-matrix.json` and `route-family-target-state.json` fully aligned post-edit?**

- **Family decisions aligned:** ✅ All 13 families have matching decisions between `route-family-map.json` and `route-family-target-state.json`: landing=merge, auth-onboarding=merge, dashboard=merge, analysis=expand, documents=expand, applications=expand, jobs=expand, generation=keep, account=expand, ingestion=expand, internal-tools=retire, landing-prototype=retire, fallback=keep.
- **Capability dependencies aligned:** ✅ Every `capability_dependencies` entry in `route-family-map.json` has a corresponding `id` in `frontend-capability-gap-matrix.json`. Cross-artifact validation script confirms this.
- **Ingestion contract status MISALIGNED:** ❌ `route-family-target-state.json` → `canonical_ingestion_contract.status: "unresolved"`. `route-family-map.json` → `canonical_backend_contracts.ingestion.canonical: "/api/v1/ingest"`. One says decided, the other says pending.
- **Prototype routes MISALIGNED:** ❌ `landing-prototype` family in `route-family-target-state.json` tracks only `/kr/landing`. The `cross_family_decisions.prototype_routes` tracks all 5 `/kr/*` routes. But `route-family-map.json` only tracks `/kr/landing` for the family. The 4 other prototype routes (`/kr/auth`, `/kr/onboarding`, `/kr/analysis`, `/kr/dashboard`) have no family ownership for retirement.

**Strategic Recommendation:** Sync the ingestion contract status to "resolved" in `route-family-target-state.json` and expand the `landing-prototype` family's `current_runtime_routes` (in target-state) and `runtime_routes` (in route-family-map) to include all 5 `/kr/*` routes.

---

## 6. KERALA RAGE RISK — Score: 6/10

**Token limit violations, workstream ownership breaches, or inefficient resource usage.**

- **Token cost of governance overhead:** Three JSON governance artifacts (route-family-map.json: 313 lines, capability-gap-matrix.json: 345 lines, route-family-target-state.json: 588 lines) total ~1,246 lines / ~50KB. Every agent session that must read all three consumes ~15K context tokens before doing any work. The migration plan mandates reading all three for most tasks.
- **Workstream ownership breach risk:** Workstream 6 splits reconciliation across Claude Code, Codex CLI, and GitHub Copilot with family-level assignments. But the ingestion family touches backend router config, frontend App.tsx, three governance artifacts, and the component inventory — no single agent has full ownership. The plan also delegates "low-risk bounded edits" to GitHub Copilot without defining what constitutes "low-risk."
- **MCP delegation underuse:** The plan references `task-router-mcp` for queue-based handoffs but the actual validate-governance-artifacts.mjs script is a standalone Node.js script, not an MCP tool. The flash-sidekick delegation model from AGENTS.md is not referenced in the migration plan at all.
- **Duplicate governance reads:** The migration plan's Task 7C requires `component-inventory.ts` to load all three governance JSONs. The validation script also loads all three. The pytest tests also load them. No caching or shared loading mechanism exists.

**Strategic Recommendation:** Create a lightweight `governance-loader.mjs` utility that reads, validates, and caches all three artifacts in a single call, then expose it as both a CLI tool and importable module. Reduce per-task token overhead by referencing summary views instead of full artifacts.

---

## 7. INFRASTRUCTURE VIABILITY — Score: 4/10

**Is the current infrastructure sufficient, or is it the root cause of existing issues?**

- **Skills chaining is theoretical, not executable:** The plan defines 5 skill chains (orchestration, parallel execution, audit, completion, visual compliance) but none have automated triggers. The chain `frontend-backend-mapper → api-contract-validator → token-enforcement` requires manual invocation of each skill in sequence. No pipeline runner exists.
- **4 of 5 suggested scripts don't exist:** Only `validate-governance-artifacts.mjs` exists. `generate-route-family-map.mjs`, `detect-mock-backed-routes.mjs`, `find-unowned-capabilities.mjs` are listed but not created. The existing `validate-governance-artifacts.mjs` works but only validates structural completeness, not semantic correctness (e.g., it doesn't detect the ingestion contract status mismatch).
- **Test infrastructure is minimal:** Only 5 governance tests exist across 2 files. Zero tests for: route promotion verification, mock-backed route detection, prototype route isolation, backend contract mounting, or cross-artifact semantic consistency.
- **Component inventory gap:** `frontend/scripts/component-inventory.ts` exists but lacks governance-derived fields. The plan's Task 7C defines 9 new fields to add but provides no migration path for existing inventory consumers.
- **Root cause assessment:** The infrastructure is NOT the root cause of the migration issues. The root cause is that the migration plan was written as a comprehensive future-state document but significant portions were already executed (Tasks 2, 3, 5) without updating the plan's checkboxes. This creates a state where the plan and reality diverge, causing agents to re-execute completed work or skip necessary reconciliation. The infrastructure is a secondary concern — fix the plan-reality gap first.

**Is it fixable or does it need a rebuild?**

**Fixable, with targeted interventions:**
1. Update the migration plan to mark completed tasks as `[x]`
2. Add the ingestion contract status sync to `route-family-target-state.json`
3. Expand prototype route tracking to cover all 5 `/kr/*` routes
4. Enhance `validate-governance-artifacts.mjs` to check semantic consistency (not just structural)
5. Create the 3 missing suggested scripts as lightweight linters, not full tools
6. Add 10-15 additional governance tests covering the gaps identified above

**A rebuild is NOT advisable** because:
- The governance artifact structure is sound and well-typed
- The cross-artifact validation pattern is correct
- The route-family-map correctly mirrors decisions from the target-state
- All 5 existing tests pass cleanly

---

## EXECUTION FAILURE POINTS IN AUTOMATED DESIGN WORKFLOWS

### Failure Point 1: Skills Chaining Has No Runtime
The migration plan defines 5 skill chains but provides no mechanism to execute them. Each skill must be manually invoked. There is no `pipeline-runner` or `workflow-engine` skill that reads a chain definition and executes steps in order. An agent will read the chain documentation, attempt to invoke skills, and stall when it realizes it must manually orchestrate each step.

**Mitigation:** Collapse skill chains into single-responsibility scripts. Replace `frontend-backend-mapper → api-contract-validator → token-enforcement` with a single `audit-route-family.mjs --family ingestion` script that runs all three checks internally.

### Failure Point 2: Scoring Gate Has No Implementation
Route families must score 85/100 before cleanup, but no scoring tool exists. The rubric (30/25/25/20 weights) is documented but not computable. An agent cannot gate itself on an unimplemented metric.

**Mitigation:** Add a `score-route-family.mjs` script that reads governance artifacts and computes the 4-dimension score per family. Output JSON with per-family scores and a pass/fail gate.

### Failure Point 3: Plan–Reality Drift Causes Re-Execution
Tasks 2, 3, and 5 are complete but unchecked. An autonomous agent following the plan will:
1. Attempt to create files that already exist
2. Run tests expecting FAIL but get PASS
3. Either skip the task (correct) or overwrite existing work (destructive)

**Mitigation:** Add a `plan-status-sync.py` script that reads governance artifacts and test results, then updates the migration plan's checkbox state automatically.

### Failure Point 4: Multi-Agent Merge Conflicts
Workstream 6 assigns different families to different agents operating on the same files (`.claude/route-family-map.json`, `App.tsx`). Without file-level locking or sequential execution guarantees, parallel agents WILL produce conflicting edits.

**Mitigation:** Assign file-level ownership: only one agent may edit `App.tsx` per phase. Use the `route-family-map.json` file's `phase` field to enforce sequential family processing.

---

## ALTERNATIVE TECHNICAL SOLUTIONS

### Alternative 1: Single-Artifact Governance Model
**Instead of:** 3 separate JSON governance artifacts (route-family-map, capability-gap-matrix, route-family-target-state)
**Use:** A single `migration-state.json` with sections for families, capabilities, and decisions. Eliminate cross-artifact sync issues entirely. The current 50KB across 3 files could be reduced to ~35KB in one file with zero redundancy.
**Trade-off:** Loses separation of concerns. Harder to diff individual aspects. But eliminates the entire class of "artifact X says resolved, artifact Y says unresolved" bugs.

### Alternative 2: Route-Level Feature Flags
**Instead of:** Promoting unrouted screens by editing App.tsx
**Use:** A `routeFlags.ts` configuration file that maps routes to feature flags. `App.tsx` reads this config and conditionally renders routes. Promotion becomes a config change, not a code change. Rollback becomes a one-line flag flip.
**Trade-off:** Adds runtime complexity. But eliminates the rollback risk entirely and allows gradual promotion.

### Alternative 3: Automated Governance CI Gate
**Instead of:** Manual validation script runs and pytest
**Use:** A GitHub Actions workflow that runs `validate-governance-artifacts.mjs` and `pytest tests/plans/` on every push to the migration branch. Block merges when governance is inconsistent. This replaces manual agent discipline with automated enforcement.
**Trade-off:** Requires CI infrastructure setup. But eliminates the class of "governance drift" bugs permanently.

### Alternative 4: Incremental Promotion Pipeline
**Instead of:** Batch route-family reconciliation across 8 workstreams
**Use:** A simple queue: promote one route family at a time through a standardized 4-step pipeline (governance check → route wiring → test → visual audit). Each family gets its own PR. No parallel agent conflicts. Slower but dramatically safer.
**Trade-off:** 13 PRs instead of 1. Slower. But each PR is reviewable, revertible, and isolated.

---

## RISK MITIGATIONS (Prioritized)

| # | Risk | Severity | Mitigation | Owner |
|---|------|----------|------------|-------|
| 1 | Phantom commit reference — no verifiable baseline | CRITICAL | Tag current HEAD, rebase all claims against actual state | Human |
| 2 | Ingestion contract status mismatch across artifacts | HIGH | Sync `route-family-target-state.json` to resolved | Agent |
| 3 | ResumeAuditPage/IngestionFlow not actually routed | HIGH | Either route them in App.tsx or correct the "promoted" claim | Agent |
| 4 | 5 `/kr/*` routes only partially tracked for retirement | MEDIUM | Expand landing-prototype family to all 5 routes | Agent |
| 5 | Plan–reality drift (Tasks 2,3,5 done but unchecked) | MEDIUM | Update checkboxes and add precondition blocks | Agent |
| 6 | No rollback strategy documented | MEDIUM | Create ROLLBACK.md with per-phase revert steps | Agent |
| 7 | No scoring gate implementation | LOW | Create score-route-family.mjs script | Agent |
| 8 | Multi-agent merge conflict risk | LOW | Enforce file-level ownership per phase | Human |

---

## VERDICT

🟡 **CONDITIONS** — Migration may proceed ONLY after resolving these blocking issues in priority order:

1. **BLOCKER:** Verify or abandon commit `48ba8014` reference. All "confirmed changes" must be validated against actual HEAD state. If the commit doesn't exist, document what was actually changed and when.
2. **BLOCKER:** Sync ingestion contract status to "resolved" in `route-family-target-state.json` to eliminate cross-artifact contradiction.
3. **BLOCKER:** Either promote ResumeAuditPage/IngestionFlow to `App.tsx` routes OR retract the "promoted" claim from the confirmed changes list. The current state is neither.
4. **HIGH:** Expand prototype route tracking to all 5 `/kr/*` routes across both governance artifacts.
5. **HIGH:** Update migration plan checkboxes to reflect actual completion state (Tasks 2, 3, 5 are done).
6. **MEDIUM:** Add rollback documentation before any route changes to `App.tsx`.
7. **MEDIUM:** Enhance governance validation to detect semantic mismatches (not just structural).

**Dimension Summary:**

| Dimension | Score | Status |
|-----------|-------|--------|
| 1. Completeness | 5/10 | Significant gaps in route promotion and backend functionality |
| 2. Sequencing | 6/10 | Hidden dependencies and prototype route tracking gaps |
| 3. Agentic Executability | 4/10 | Plan-reality drift makes autonomous execution unreliable |
| 4. Regression Risk | 5/10 | No rollback strategy, no error boundaries, no feature flags |
| 5. Governance Consistency | 7/10 | Family decisions aligned; ingestion/prototype status misaligned |
| 6. Kerala Rage Risk | 6/10 | Token overhead acceptable but workstream ownership unclear |
| 7. Infrastructure Viability | 4/10 | Fixable — not a rebuild, but needs 6 targeted interventions |

**Aggregate: 37/70 (53%) — Below migration-ready threshold.**
