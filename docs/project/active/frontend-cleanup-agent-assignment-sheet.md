# Final Frontend Cleanup Agent Assignment Sheet (v6.1)
*Optimized for Claude Code (Sonnet 3.7/4.6 Thinking) & Gemini (Antigravity)*

> **Primary Executor:** Claude Code (Architecture Conductor)
> **Primary Worker:** Gemini via Antigravity (Bulk Mechanical & Analysis)
> **Required Workflow:** `project-manager` -> `writing-plans` -> `subagent-driven-development` -> verification -> closeout review
> **Reasoning Requirement:** Use the **Sequential Thinking MCP** server before Batch 0, Batch B, Batch C dispositions, and Batch G closeout.

---

## ⚡ SYSTEM PROMPT INJECTOR (Claude Code Core Directive)
*Copy this directive to perfectly synchronize your operating model:*

**Role:** You are the **Lead Architecture Conductor** for the CareerCopilot PR126 Frontend Consolidation.
**Mission:** Purge structural drift, reclaim canonical feature authority, and achieve Batch G "Terminal Closeout."
**Authority Stack (Immutable):**
1. **Runtime Truth:** `frontend/src/App.tsx` (The live arbiter).
2. **Design Truth:** `frontend/src/screens/**` + `docs/manifests/screens.json`.
3. **Capability Truth:** `backend/app/api/endpoints/`.
4. **Derived Evidence:** `orphans.json`, `routes.json`, `component-inventory.json`.
5. **Historical closure notes:** advisory only. Do not trust any older “terminal governance closure” claim unless it matches current manifests and current verification output.

**Operational Constraints:**
- **Selective Flora/Fauna Rule:** Strictly enforce `docs/design/01_CANON.md`. Absolutely NO native Australian flora (gum, wattle, eucalyptus) or endemic-fauna mascots. Elephants remain allowed as intentional cultural anchors.
- **Hardened Hierarchy:** Gemini *cannot* modify `App.tsx` or `route-registry.ts` without explicit Claude Code "Execution Directives."
- **MCP Delegation:** Use `flash-sidekick` for all files > 300 lines. Use `design-system-sidekick` for visual compliance verification prior to any batch sign-off.
- **Tokens Studio Preflight:** If `/Users/okgoogle13/Downloads/dtcg-tokens (1).zip` is available, Claude Code must run a token preflight before route cleanup begins. Do not start route cleanup against a drifting token source of truth.
- **Shape Hardening Guardrail:** Do not modify `frontend/src/components/kerala-rage/**` shape-token semantics incidentally during cleanup. Any such change requires a dedicated hardening task approved by Claude Code.

---

## 🏗️ Batch Execution Plan

### Batch T0: Tokens Studio Sync Preflight
**Lead:** Gemini | **Decision Owner:** Claude Code | **MCP:** `flash-sidekick.batch_file_analysis`
1. **Inspect Export:** Review `/Users/okgoogle13/Downloads/dtcg-tokens (1).zip` and extract a concise DTCG structure summary.
2. **Compare Source of Truth:** Diff the export against `frontend/src/design/tokens/tokens.json`.
3. **Flag Shape Drift:** Highlight any material differences in KR v6.1 shapes or token groups before cleanup begins.
4. **Regenerate If Approved:** If Claude approves the sync direction, run `python3 scripts/build-m3-tokens.py` and validate the resulting token structure.
5. **Decision:** Claude chooses one state before Batch 0 starts:
   - `stable_no_sync`
   - `sync_now`
   - `defer_cleanup_until_clarified`

### Batch 0: Framing & Decision Lock
**Lead:** Claude Code | **Reasoning:** Sequential Thinking MCP
1. **Scope confirmation:** Decide if this closeout stabilizes "Pages-First" runtime (legacy) or achieves "Features-First" terminal state (target).
2. **Blocker Mapping:** Identify if any `/auth` or `/welcome` routes are structurally blocked.
3. **Owner Assignment:** Name specific reviewers for code-quality and design-integrity.

### Batch A: High-Fidelity Snapshot Refresh
**Lead:** Gemini | **MCP:** `flash-sidekick.batch_file_analysis`
1. **Command:** Run the `frontend-checkpoint-generator` routine (documented in `frontend-snapshot-methodology.md`).
2. **Evidence Gap:** Use `flash-sidekick` to summarize "Hidden Slop" (hardcoded hex/magic pixel values) in the new manifests.
3. **Token Drift Check:** If Batch T0 chose `sync_now`, summarize token-affecting fallout separately from route fallout.
4. **Governance Baseline Check:** Treat `35 routes` as a current baseline only if the regenerated manifests still report 35 and route-integrity does not worsen.
5. **Outputs:** Refresh `docs/manifests/*`, `component-inventory.json`, and `layered-component-blueprint.json`.

### Batch B: Runtime Authority Reconciliation
**Lead:** Claude Code | **MCP:** `sequential-thinking`
1. **Target:** `frontend/src/App.tsx` vs `route-registry.ts`.
2. **Mapping:** Re-map the 14 legacy routes in `App.tsx` to their canonical `features/` owners.
3. **Finality:** Classify all routes as `canonical`, `redirect-only`, `support-only`, or `deprecated`.

### Batch C: Route-Level Gap-Fill Planning
**Lead:** Gemini | **MCP:** `flash-sidekick.quick_summarize`
1. **Script Adaptation:** Adapt `scripts/derive-gap-fill-plan.py` to current manifests.
2. **Route Dispositions:** Apply targeted reconciliation to `/auth`, `/kanban`, `/studio`, and `/editor`.
3. **Gatekeeper:** Claude must approve each route's final state (`terminal`, `needs_cleanup`, or `blocked`).

### Batch D: Shell & Holdout Resolution
**Lead:** Claude Code | **MCP:** `design-system-sidekick.validate_asset_compliance`
1. **Target:** `/welcome`, `/documents`, `/asset-library`.
2. **Verification:** Ensure these high-visibility "Holdouts" meet the **Solidarity 0.9 Compliance Score**.
3. **Design Critique:** Manually verify shell promotion does not include legacy prototype artifacts.

### Batch E: Stale Prototype Quarantine
**Lead:** Gemini | **MCP:** `ts-morph` (via `analyze-react-components.ts`)
1. **Audit:** Inspect `frontend/src/pages/` and related reference surfaces with `ts-morph` plus runtime proof.
2. **Retire Selectively:** Quarantine or delete only pages and reference surfaces that are proven unreachable or deprecated.
3. **Reference Cleanup:** Fix all `/kr/*` or deleted references in `mapping.json`.
4. **Evidence:** No deletion or quarantine without `ts-morph` and route/runtime confirmation.

### Batch F: Shared UI Boundary Cleanup & Decontamination
**Lead:** Gemini | **MCP:** `flash-sidekick.batch_file_analysis`
1. **Inventory:** Consolidate duplicate primitives between `components/ui` and `packages/ui`.
2. **Hardening:** Normalize remaining live KR alias usage and semantic type/shape-token spellings in canonical surfaces.
3. **Color Purge:** Sweep live frontend surfaces for literal Tailwind palette classes and map them to approved semantic KR tokens or component variants.
4. **Mock Purge:** Remove demo identities and placeholder profile/document data from canonical user-facing flows.
5. **Test Utility Follow-through:** Add or repair shared test helpers only if failing suites are blocked by repeated provider/render boilerplate.
6. **Dependency Check:** Ensure no circular dependencies between primitives and features.

### Batch G: Verification & terminal Closeout
**Lead:** Claude Code | **Reasoning:** Sequential Thinking MCP
1. **Final Gatekeepers:**
   - [ ] `design-system-sidekick` Score > 0.9 across all canonical views.
   - [ ] `yarn type-check` passes with 0 errors.
   - [ ] `check-route-integrity.ts` shows 0 structural errors.
   - [ ] `/auth`, `/login`, and `/register` preserve the correct mode when entered directly and from the landing flow.
   - [ ] No unresolved literal Tailwind palette classes or demo identity strings remain in canonical user-facing surfaces.
   - [ ] No stale “100% terminal” governance claim survives if current evidence still shows warnings or stale prototype cleanup manifests.
2. **Dissolution:** Sync final reports to `frontend/docs/reports/PR126/` and purge `docs/project/active/` context.
3. **Sign-off:** Claude Code issues the "Terminal Closeout" manifesto.

---

## 🛠️ MCP Tool Strategic Guide

### Token Source Inputs

- `frontend/src/design/tokens/tokens.json`
- `scripts/build-m3-tokens.py`
- `frontend/package.json`
- `/Users/okgoogle13/Downloads/dtcg-tokens (1).zip`

Treat the downloaded zip as an external input, not repo authority, until Claude Code approves the sync direction in Batch T0.

| Task Category | Recommended MCP Tool | Trigger/Condition |
| :--- | :--- | :--- |
| **Bulk Code Scanning** | `flash-sidekick.batch_file_analysis` | Analyzing more than 3 related components. |
| **Complex Logic Audit** | `flash-sidekick.consult_pro` | Refactoring intricate state-management or auth flows. |
| **Visual Compliance** | `design-system-sidekick.validate_asset_compliance` | Before closing Batch D or Batch G. |
| **Architecture Search** | `flash-sidekick.generate_idf` | Finding all un-mapped symbols in a feature. |
| **Decision Logic** | `sequential-thinking` | Before any irreversible `rm -rf` or Route Authority change. |
| **Token Export Audit** | `flash-sidekick.batch_file_analysis` | Comparing a Tokens Studio export to `tokens.json` or summarizing DTCG drift. |
| **Literal Color Sweep** | `flash-sidekick.batch_file_analysis` | Searching live surfaces for Tailwind palette classes or placeholder/demo strings. |

### Stronger MCP Routing Cues

- Route to `flash-sidekick` by default when more than 3 files need comparison, a file exceeds roughly 300 lines, or the task is token/schema analysis rather than design judgment.
- Route to `design-system-sidekick` when token-affecting changes could introduce visible KR drift or when Claude needs visual confirmation before sign-off.
- Keep route authority changes, shell promotion, and final cleanup disposition in Claude Code even if Gemini gathered the evidence.

---

## 🚦 Stop Conditions
Claude Code must STOP and re-plan if:
- Batch T0 leaves the token source of truth unresolved.
- `App.tsx` and `route-registry.ts` disagree on canonical ownership.
- Gemini proposes shell promotion based on a prototype reference without design-system-sidekick validation.
- `yarn type-check` failure persists across more than two execution cycles.
- Evidence refresh manifests contradict the claimed state of the application.
