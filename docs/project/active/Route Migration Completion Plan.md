Route Migration Completion Plan

> [!IMPORTANT]
> For agentic workers: REQUIRED: Use [subagent-driven-development](file:///.claude/skills/subagent-driven-development) or [executing-plans](file:///.claude/skills/executing-plans) to implement this plan.
>
> **Authority Guard**: Implementation must prioritize **Runtime Truth** (`App.tsx`) > **Design Truth** (`wireframe.xml`) > **Capability Truth** (Endpoints) before modifying any support artifacts.
>
> During any React implementation, Vercel skills act as required code reviewers: `vercel-composition-patterns` → `vercel-react-best-practices` → `web-design-guidelines`.

Goal: Capture the remaining migration work (status artifacts, route/component gaps, /tracker environment, and Figma-informed routes) so Claude/Gemini can execute a clean handoff.

Architecture: Use the tri-layer truth (design/runtime/capability) plus shared-shell/identity-gate tooling to validate routes, then update PM/docs to reflect the new truth.

Tech Stack: Node (Vite) scripts for inventory and integrity, Python governance scripts (scripts/derive-gap-fill-plan.py, scripts/validate-wireframe-workflow.py), React/TypeScript front end, and document-driven migration control artifacts.

---

### Task 1: PM/Status Artifact Refresh (Authority-First)

**Files:**
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/status.md`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/pm/dashboard.md`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/pm/milestone-tracking.json`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/pm/phase-plan.yaml`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/pm/project-init.json`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json` & `.md`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/claude-handoff.md`

- [ ] **Step 1: Record Current State (Verified via Runtime)**
    - Run `tools/scripts/scan-routes.ts` and `check-route-integrity.ts`.
    - Summarize outstanding routes (/tracker, /opportunities gap) plus the Figma/MCP artifacts already in place.
    - Note CI status (12/12 contracts valid) and the Firebase/Firestore blockers.
- [ ] **Step 2: Update Completion States**
    - Mark Step 6B/Phase 4 “gateway pending artifacts” until remaining identity gates and /opportunities deferral closure are confirmed.
    - **Blocker Escalation**: Clearly define Step 3a as "Blocked by Firestore connectivity" and link to diagnostic evidence.
- [ ] **Step 3: Reflect Plan on Dashboard/Milestones**
    - `dashboard.md`: Add nested tasks (TSX Identity Gate, /opportunities reconciliation, /tracker environment rerun).
    - `milestone-tracking.json`: Set M11+ to "IN_PROGRESS"; record expected owner (Claude/Gemini).
- [ ] **Step 4: Route Matrix / Gap Map**
    - Ensure `/opportunities` shows `implementation_status=complete` with capability deferral noted.
    - Document the tri-layer truth for each remaining route.
- [ ] **Step 5: Handoff Refinement**
    - Extend `control/claude-handoff.md` with new tasks and confirm required MCP inputs per route.

---

### Task 2: Component Inventory & Tri-Layer Truth Scripts

**Files/Outputs:**
- Run: `tools/scripts/scan-routes.ts` (Inventory + Tri-layer summary)
- Run: `scripts/derive-gap-fill-plan.py` (Support-reference classification)
- Run: `scripts/validate-wireframe-workflow.py` (Wireframe alignment)

- [ ] **Step 1: Route/Component Inventory Runs**
    - Execute `node --import tsx tools/scripts/scan-routes.ts` to refresh the inventory.
- [ ] **Step 2: Tri-Layer Truth Validation**
    - Rerun `scripts/derive-gap-fill-plan.py` for remaining routes.
    - Capture flags for `support_reference` candidates requiring rewrites.
- [ ] **Step 3: Wireframe Validator**
    - Run `python scripts/validate-wireframe-workflow.py --route opportunities`.
- [ ] **Step 4: Document Findings**
    - Update `control/gap-map.json/.md` with results.

- **Skill Handoff Note**:
    - Task 2 only identifies which routes/components need work (from `scan-routes.ts`, `derive-gap-fill-plan.py`, `validate-wireframe-workflow.py`).
    - Vercel skills are **not** invoked in Task 2; they will be used later on the components/routes flagged here.

---

### Task 3: Remaining Route & Component Workplan (Identity & Visual Gate)

**Files:**
- Create: `docs/project/active/frontend-source-of-truth-migration/analysis/remaining-route-plan.md`

- [ ] **Step 1: Route List and Gaps**
    - Enumerated remaining routes (Phase 3a /tracker, /opportunities) mapped to action items.
- [ ] **Step 2: Shared Primitive & Visual Gate**
    - Audit `Logo`, `Sidebar`, `AuthGuard`, `KrDarkDock`, `Footer`.
    - **Visual Check**: Run `vision-scorer-mcp` or a visual audit (score >= 90) specifically for `Logo` and `Sidebar` to confirm Zero-Flora compliance.
    - When working on `Logo`, `Sidebar`, `AuthGuard`, `KrDarkDock`, `Footer`, and route shells, use `vercel-composition-patterns` to: detect boolean/config prop bloat, propose a more composable API, and rewrite the component plus 1–2 usages while preserving behaviour.
    - After `check-screen-pairs.ts`, `vision-scorer-mcp`, and token-enforcement pass for a route, use `web-design-guidelines` on those components/pages to: audit accessibility and UX, suggest minimal fixes, and apply them with small, backward-compatible diffs.
- [ ] **Step 3: Identity Gate Evidence**
    - For each route, require the Late-Stage TSX Identity Gate.
    - **Mandatory Artifact**: Record outcomes in `docs/project/active/frontend-source-of-truth-migration/analysis/tsx-identity-gate-template.md` (or route-specific instances).
- [ ] **Step 3c: Global Layout Authority & Shell Promotion (CRITICAL)**
    - **Problem**: Dev server persists legacy `Sidebar` and `Logo` via `ProtectedLayout`.
    - **Action**: In `App.tsx`, replace `ProtectedLayout` with `MigratedRouteLayout` for all routes where design parity is confirmed.
    - **Audit**: Ensure `KrDarkDock` is the authoritative navigation component.
    - When promoting `MigratedRouteLayout`, updating route wrappers, or Identity Gates in `App.tsx`, use `vercel-react-best-practices` to: remove React anti-patterns, confirm structure matches `check-route-integrity.ts`, and output drop-in replacements.
- [ ] **Step 4: Blocker Diagnostic Packet**
    - **Failure-Mode Evidence**: Document the specific Firebase/Firestore error logs, environment vars, and `AuthContext.tsx` failure points for `/tracker`. This packet must ensure the next agent has actionable diagnostics.
- [ ] **Step 5: Delegation Instructions**
    - Specify required MCP inputs, tests to rerun, and output artifacts per route.

---

### Task 4: Sprint & Project Orchestration Summary

- [ ] **Step 1: Project-Manager Narrative**
    - Capture delivery window, owners, risks (Firebase, shared-shell drift), and dependencies.
- [ ] **Step 2: Sprint-Coordinator Metrics**
    - Readiness scoring (33% per milestone).
- [ ] **Step 3: Daily Status Guidance**

---

### Task 5: Execution Strategy & Efficiency Guardrails

To execute this plan via Claude Code, use the following skill integration and **Token Efficiency Guardrails**:

1. **`design-orchestration` (Workflow Governor)**: Use to route work through brainstorming and blueprinting phases. It enforces the KR Solidarity compliance gates and ensures no implementation starts without a validated design.
2. **`blueprint` (Construction Plan)**: Invoke `/blueprint` for the remaining routes. This will generate the `blueprint.md` artifacts required for "cold-start" execution by subsequent agents.
3. **Efficiency Guardrails (MANDATORY)**:
   - **Anchored Execution**: Use `blueprint.md` **Task IDs** (e.g., `Step 3a.2`) as the only context anchors. Load ONLY files required for the current Task ID.
   - **Build Contract Centricity**: Use the XML Build Contracts as the *primary* implementation reference. Avoid loading multiple legacy components for "inspiration."
   - **Script-Driven Inventory**: Never use `ls -R` or `grep` to find orphan routes. Run `scan-routes.ts` or `detect-orphans.ts` and read only the JSON output.
4. **`project-manager` / `sprint-coordinator`**: Use these for tracking milestone completion and reporting progress to the user.

For any React/UI implementation, first follow `blueprint` and script outputs, then use `vercel-composition-patterns` to shape component APIs, then `vercel-react-best-practices` to write/refactor code, and finally `web-design-guidelines` after visual/CI checks to tighten accessibility/UX.

---

### Tests & Verification (Fail-Fast Order)

Each action item must be verified in this sequence:
1. `node --import tsx tools/ci/check-route-integrity.ts` (Verify Pathing/Runtime)
2. `node --import tsx tools/ci/check-screen-pairs.ts` (Verify Design Parity)
3. `bash .claude/skills/token-enforcement/scripts/run-token-enforcement.sh <route>` (Verify Aesthetic/Tokens)
4. `pytest tests/plans -q` (Verify Governance Plan)
5. `node frontend/scripts/validate-governance-artifacts.mjs` (Verify PM Artifact Integrity)

**Validation of /tracker environment**:
- `GET /api/applications/` success call.
- Firebase token verification proof.
- Populated Kanban board screenshot (score >= 90).

---

### Assumptions

- /tracker remains blocked until Gemini fixes Firebase/Firestore; this sprint focuses on documentation of evidence.
- No new features beyond artifact updates are required.
- Standard layout synchronization.
