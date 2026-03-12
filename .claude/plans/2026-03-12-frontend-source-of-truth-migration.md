# Frontend Source-of-Truth and Capability Reconciliation Migration Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconcile CareerCopilot’s frontend around explicit design truth, runtime truth, and capability truth, then execute migration work on a dedicated feature branch cloned from the current branch.

**Architecture:** Treat `frontend/src/App.tsx` as runtime truth, `frontend/src/screens/**/*.wireframe.xml` plus paired `*.tsx` as design truth, and mounted backend endpoints as capability truth. Drive execution from governance artifacts first, then route-family decisions, then targeted migration work.

**Tech Stack:** React 18, TypeScript, Vite, FastAPI, JSON governance artifacts, markdown planning docs, existing Codex/Claude custom skills.

---

## Summary

This migration is not just a wireframe reconciliation. It must resolve:
- design/runtime drift
- mock-backed live routes
- unrouted screen candidates
- live `/kr/*` prototype drift
- duplicate ingestion contracts
- missing frontend ownership for backend-backed capabilities such as voice, smart ingestion, application CRUD, and document redlining

Execution must happen on a dedicated feature branch created from the current branch state, not directly on this working branch.

## Workstream Orchestration

Use these workstreams and default delegates during execution:

- **Workstream 1: Branch and failed-migration cleanup**
  - Primary: Codex CLI
  - Secondary: Claude Code
- **Workstream 2: Governance baseline**
  - Primary: Claude Code
  - Secondary: Codex CLI
- **Workstream 3: Contract and capability ownership**
  - Primary: Codex CLI
  - Secondary: Claude Code
- **Workstream 4: Route-family probes and decisions**
  - Primary: Claude Code
  - Secondary: Gemini for analysis sidecar
- **Workstream 5: Inventory and progress tracking modernization**
  - Primary: Codex CLI
  - Secondary: GitHub Copilot
- **Workstream 6: Route-family reconciliation**
  - Split by family:
    - dashboard/account/documents: Claude Code
    - ingestion/applications/analysis: Codex CLI
    - low-risk bounded edits: GitHub Copilot
- **Workstream 7: Folder cleanup and dead-code reduction**
  - Primary: Codex CLI
  - Secondary: Claude Code
- **Workstream 8: Visual compliance audit**
  - Primary: Gemini
  - Secondary synthesis: Claude Code

Use `project-manager` for top-level orchestration, `sprint-coordinator` for milestone tracking, `task-delegator` for parallel execution design, and `task-router-mcp` for queue-based handoffs.

---

## Branch Strategy

### Task 1: Create Migration Feature Branch From Current Branch

**Files:**
- No repo file changes in this task
- Output: new git branch for implementation

- [ ] **Step 1: Inspect current branch and worktree state**

Run:
```bash
git branch --show-current
git status --short
```

Expected:
- current branch name is identified
- dirty state is understood before cloning work

- [ ] **Step 2: Create a new feature branch from the current branch tip**

Run:
```bash
git checkout -b feat/frontend-source-of-truth-migration
```

Expected:
- new branch created from current branch HEAD
- no rebasing or history rewriting

- [ ] **Step 3: Verify branch**

Run:
```bash
git branch --show-current
```

Expected:
- `feat/frontend-source-of-truth-migration`

- [ ] **Step 4: Commit only migration-related work on this branch**

Commit style:
```bash
git commit -m "feat(governance): add route family migration baseline"
```

---

## Governance and Decision Artifacts

### Task 2: Establish Canonical Governance Files

**Files:**
- Create: `.claude/route-family-map.json`
- Verify/extend: `.claude/plans/frontend-capability-gap-matrix.json`
- Verify/extend: `.claude/plans/route-family-target-state.json`
- Verify/extend: `.claude/plans/wireframe-source-of-truth-gap.md`
- Verify/extend: `docs/superpowers/specs/2026-03-12-production-readiness-corrective-workflow-design.md`
- Record delegation ownership in `.claude/route-family-map.json`

- [ ] **Step 1: Write failing tests for governance completeness**

```python
import json
from pathlib import Path

def test_route_family_map_has_all_families():
    data = json.loads(Path(".claude/route-family-map.json").read_text())
    expected = {
        "landing",
        "auth-onboarding",
        "dashboard",
        "analysis",
        "documents",
        "applications",
        "jobs",
        "generation",
        "account",
        "ingestion",
        "internal-tools",
        "landing-prototype",
        "fallback",
    }
    assert expected.issubset({item["family"] for item in data["families"]})
```

- [ ] **Step 2: Run test to confirm failure**

Run:
```bash
pytest tests/plans/test_route_family_map.py::test_route_family_map_has_all_families -v
```

Expected:
- FAIL until file is created correctly

- [ ] **Step 3: Create `route-family-map.json`**

Required per family:
- current runtime routes
- design references
- capability dependencies
- final decision: `keep | expand | merge | replace | retire`
- notes
- canonical owner

- [ ] **Step 4: Re-run tests**

Run:
```bash
pytest tests/plans/test_route_family_map.py -v
```

Expected:
- PASS

- [ ] **Step 5: Commit**

```bash
git add .claude/route-family-map.json tests/plans/test_route_family_map.py
git commit -m "feat(governance): add canonical route family map"
```

### Task 3: Declare Layer Authority in Project Docs

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Write failing doc assertion**

```python
from pathlib import Path

def test_agents_declares_layer_authority():
    text = Path("AGENTS.md").read_text()
    assert "design truth" in text
    assert "runtime truth" in text
    assert "capability truth" in text
```

- [ ] **Step 2: Run test**

Run:
```bash
pytest tests/plans/test_layer_authority_docs.py -v
```

Expected:
- FAIL until section exists

- [ ] **Step 3: Add Layer Authority section**

Must declare:
- `screens/**/*.wireframe.xml` + paired `screens/*.tsx` = design truth
- `features/**` + `pages/**` reachable from `App.tsx` = runtime truth
- mounted backend endpoints = capability truth
- migration-kit JSON = derived artifacts only

- [ ] **Step 4: Re-run test**

Run:
```bash
pytest tests/plans/test_layer_authority_docs.py -v
```

Expected:
- PASS

- [ ] **Step 5: Commit**

```bash
git add AGENTS.md tests/plans/test_layer_authority_docs.py
git commit -m "docs(governance): declare layer authority model"
```

---

## Core Migration Decisions

### Task 4: Resolve Canonical Ingestion Contract

**Files:**
- Modify: `.claude/route-family-map.json`
- Modify: `.claude/plans/frontend-capability-gap-matrix.json`

- [ ] **Step 1: Write failing test**

```python
import json
from pathlib import Path

def test_ingestion_has_single_canonical_contract():
    data = json.loads(Path(".claude/route-family-map.json").read_text())
    ingestion = next(item for item in data["families"] if item["family"] == "ingestion")
    assert len(ingestion["canonical_backend_contracts"]) == 1
```

- [ ] **Step 2: Run test**

Run:
```bash
pytest tests/plans/test_ingestion_contract.py -v
```

Expected:
- FAIL until one contract is selected

- [ ] **Step 3: Set canonical contract**

Recommended default:
- canonical: `/api/v1/ingest`
- deprecated but mounted: `/api/career/ingest`
- unmounted/quarantine: `/api/ingest/artifacts/upload`

- [ ] **Step 4: Re-run test**

Run:
```bash
pytest tests/plans/test_ingestion_contract.py -v
```

Expected:
- PASS

- [ ] **Step 5: Commit**

```bash
git add .claude/route-family-map.json .claude/plans/frontend-capability-gap-matrix.json tests/plans/test_ingestion_contract.py
git commit -m "chore(ingestion): choose canonical intake contract"
```

### Task 5: Resolve Voice Ownership

**Files:**
- Modify: `.claude/route-family-map.json`
- Modify: `.claude/plans/route-family-target-state.json`

- [ ] **Step 1: Write failing test**

```python
import json
from pathlib import Path

def test_voice_has_explicit_runtime_owner():
    data = json.loads(Path(".claude/plans/route-family-target-state.json").read_text())
    voice = next(item for item in data["cross_family_decisions"] if item["topic"] == "voice_ownership")
    assert voice["preferred_runtime_owner"] in {"/profile", "/settings", "/asset-library"}
```

- [ ] **Step 2: Run test**

Run:
```bash
pytest tests/plans/test_voice_ownership.py -v
```

Expected:
- FAIL until explicit owner is set

- [ ] **Step 3: Set owner**

Recommended default:
- canonical owner: `/profile`
- supporting integration points: `/asset-library`, ingestion flow

- [ ] **Step 4: Re-run test**

Run:
```bash
pytest tests/plans/test_voice_ownership.py -v
```

Expected:
- PASS

- [ ] **Step 5: Commit**

```bash
git add .claude/route-family-map.json .claude/plans/route-family-target-state.json tests/plans/test_voice_ownership.py
git commit -m "chore(profile): assign canonical voice ownership"
```

---

## Route Family Migration Work

### Task 6: Finalize Route Family Decisions

**Files:**
- Modify: `.claude/route-family-map.json`

- [ ] **Step 1: Write failing completeness test**

```python
import json
from pathlib import Path

def test_each_route_family_has_final_decision():
    data = json.loads(Path(".claude/route-family-map.json").read_text())
    allowed = {"keep", "expand", "merge", "replace", "retire"}
    for family in data["families"]:
        assert family["decision"] in allowed
```

- [ ] **Step 2: Run test**

Run:
```bash
pytest tests/plans/test_route_family_decisions.py -v
```

Expected:
- FAIL until all are set

- [ ] **Step 3: Populate decisions**

Default decisions:
- `landing`: `merge`
- `auth-onboarding`: `merge`
- `dashboard`: `merge`
- `analysis`: `expand`
- `documents`: `expand`
- `applications`: `expand`
- `jobs`: `expand`
- `generation`: `keep`
- `account`: `expand`
- `ingestion`: `expand`
- `internal-tools`: `retire`
- `landing-prototype`: `retire`
- `fallback`: `keep`

- [ ] **Step 4: Re-run test**

Run:
```bash
pytest tests/plans/test_route_family_decisions.py -v
```

Expected:
- PASS

- [ ] **Step 5: Commit**

```bash
git add .claude/route-family-map.json tests/plans/test_route_family_decisions.py
git commit -m "chore(routes): finalize route family decisions"
```

### Task 7: Declare Capability-Led Additions

**Files:**
- Modify: `.claude/route-family-map.json`

- [ ] **Step 1: Write failing test**

```python
import json
from pathlib import Path

def test_capability_led_additions_declared():
    data = json.loads(Path(".claude/route-family-map.json").read_text())
    expected = {
        "application_detail_management",
        "smart_ingestion_flow",
        "voice_profile_management",
        "document_redline_workspace",
        "resume_audit_history"
    }
    assert expected.issubset(set(data["capability_led_additions"]))
```

- [ ] **Step 2: Run test**

Run:
```bash
pytest tests/plans/test_capability_led_additions.py -v
```

Expected:
- FAIL until present

- [ ] **Step 3: Add explicit additions**

Each entry should include:
- owner family
- owner route
- status
- dependency
- defer state if backend incomplete

- [ ] **Step 4: Re-run test**

Run:
```bash
pytest tests/plans/test_capability_led_additions.py -v
```

Expected:
- PASS

- [ ] **Step 5: Commit**

```bash
git add .claude/route-family-map.json tests/plans/test_capability_led_additions.py
git commit -m "feat(governance): declare capability-led additions"
```

### Task 7A: Clean Up Failed Migration Residue

**Files:**
- Create: `.claude/plans/failed-migration-cleanup-ledger.md`
- Modify: `.claude/route-family-map.json`

- [ ] **Step 1: Capture current dirty worktree inventory**

Run:
```bash
git status --short
```

Expected:
- full list of pre-existing modified, deleted, and untracked files

- [ ] **Step 2: Classify each dirty path**

Categories:
- `migration_relevant`
- `unrelated_user_work`
- `obsolete_failed_migration_residue`

- [ ] **Step 3: Create cleanup ledger**

Required fields per path:
- file path
- category
- keep/quarantine/remove/defer
- rationale

- [ ] **Step 4: Update route-family-map with cleanup metadata**

Add:
- `migration_branch_strategy`
- `cleanup_categories`

- [ ] **Step 5: Commit**

```bash
git add .claude/plans/failed-migration-cleanup-ledger.md .claude/route-family-map.json
git commit -m "chore(cleanup): classify failed migration residue"
```

---

## Recommended Custom Skills Infrastructure

### What Works Now

Use these existing skills as-is:
- `writing-plans`
  Use for high-signal implementation planning and chunked execution docs.
- `frontend-backend-mapper`
  Useful for rechecking endpoint ownership after route changes.
- `token-enforcement`
  Use as the fast gate for token compliance during route reconciliation.
- `migration-audit`
  Useful once pointed at canonical XML-based design references.
- `api-contract-validator`
  Useful after any frontend service cleanup tied to retained backend capabilities.
- `verification-before-completion`
  Use before claiming route-family reconciliation is complete.
- `requesting-code-review`
  Use at the end of each major phase.

### What Needs Updating To Be Fit For Purpose

These need targeted improvement before they can be trusted as primary migration tooling:
- `migration-audit`
  Must explicitly consume canonical XML wireframes and screen references, not reduced migration-kit JSON.
- `route-migration`
  Should understand the new truth model: design truth, runtime truth, capability truth, not only design/runtime.
- `frontend-backend-mapper`
  Should output route-family ownership and missing UI surface classification, not only endpoint matching.
- `project-health-checker`
  Should include governance artifact validation for:
  - `.claude/route-family-map.json`
  - `.claude/plans/frontend-capability-gap-matrix.json`
  - `.claude/plans/route-family-target-state.json`

### Agent and Skill Chaining

- **Top-level orchestration**
  - `project-manager` → milestone, ownership, gate tracking
  - `sprint-coordinator` → sprint framing, readiness scoring, daily status
- **Parallel execution**
  - `task-delegator` → split work by independent workstream
  - `task-router-mcp` → queue tasks and explicit handoffs
- **Route and capability audit chain**
  - `frontend-backend-mapper` → `api-contract-validator` → `token-enforcement`
- **Completion chain**
  - `verification-before-completion` → `requesting-code-review`
- **Visual compliance chain**
  - `manifest-reconciler` → `kerala-rage-brand-enforcer` → `hifi-blueprint-linter`

### References, Audits, Rubrics, and Scoring

Use these reference artifacts during execution:
- `.claude/plans/frontend-capability-gap-matrix.json`
- `.claude/plans/route-family-target-state.json`
- `.claude/route-family-map.json`
- `docs/superpowers/specs/2026-03-12-production-readiness-corrective-workflow-design.md`
- `.claude/plans/vast-gliding-snowflake.md`
- `.claude/plans/visual-compliance-audit-gemini-strategy.md`

Use these audit lanes:
- governance completeness audit
- capability ownership audit
- token enforcement audit
- XML design-reference migration audit
- visual compliance audit

Scoring model per route family:
- 30% governance completeness
- 25% capability ownership completeness
- 25% runtime/design reconciliation quality
- 20% compliance readiness

Route families must score at least 85/100 before entering folder cleanup and dead-code reduction.

### Suggested New Scripts

Add these lightweight scripts:
- `frontend/scripts/generate-route-family-map.mjs`
  Generate/update `.claude/route-family-map.json` from `App.tsx` + current architecture report.
- `frontend/scripts/validate-governance-artifacts.mjs`
  Validate schema/completeness across the three JSON governance artifacts.
- `frontend/scripts/detect-mock-backed-routes.mjs`
  Flag routed surfaces still relying on hardcoded mock data.
- `frontend/scripts/find-unowned-capabilities.mjs`
  Read backend endpoint inventory plus route-family map and list product-relevant capabilities without runtime ownership.

### Suggested New Skills

Add focused skills only where current ones are too generic:
- `route-family-governor`
  Maintain and validate route-family-map plus family decisions.
- `capability-gap-triager`
  Turn backend/frontend mismatches into owned/deferred/retired product decisions.
- `source-of-truth-auditor`
  Compare XML design refs, runtime routes, and capability ownership for a given route family.
- `mock-surface-detector`
  Audit live routes for placeholder data, unreachable empty states, and cosmetic workflow links.

### Current-State Skills That Already Work

- `writing-plans`
- `project-manager`
- `sprint-coordinator`
- `task-delegator`
- `task-router-mcp`
- `frontend-backend-mapper`
- `token-enforcement`
- `api-contract-validator`
- `verification-before-completion`

### Visual Compliance Skills To Use Later

- `manifest-reconciler`
- `kerala-rage-brand-enforcer`
- `hifi-blueprint-linter`
- screenshot or vision audit workflows from `.claude/plans/visual-compliance-audit-gemini-strategy.md`

---

## Frontend Folder Cleanup and Dead-Code Reduction

This is an explicit downstream phase, not an implicit side effect.

### Task 7B: Structural Cleanup Planning

**Files:**
- Modify: `.claude/route-family-map.json`
- Consume: updated `frontend/component-inventory.json`

- [ ] **Step 1: Label every candidate as one of**

- canonical
- reference
- prototype
- deprecated_candidate
- deadcode_candidate
- internal_or_dev_only

- [ ] **Step 2: Build cleanup list from inventory**

Required target areas:
- `phase3-batch2`
- `phase3-batch3`
- unrouted screen candidates not promoted
- duplicate route concepts across `screens/`, `features/`, `pages/`, `components/`

- [ ] **Step 3: Gate cleanup on route-family stability**

Do not delete or flatten until:
- every family decision is locked
- canonical owners are declared
- capability-led additions are mapped

- [ ] **Step 4: Commit structural cleanup plan updates**

```bash
git add .claude/route-family-map.json frontend/component-inventory.json
git commit -m "chore(frontend): plan dead-code and folder cleanup"
```

---

## Component Inventory and Migration Progress Tracking

The inventory script must track migration progress against the governance JSONs, not just component health.

### Task 7C: Update Component Inventory Script

**Files:**
- Modify: `frontend/scripts/component-inventory.ts`
- Optional new scripts:
  - `frontend/scripts/generate-route-family-map.mjs`
  - `frontend/scripts/validate-governance-artifacts.mjs`
  - `frontend/scripts/detect-mock-backed-routes.mjs`
  - `frontend/scripts/find-unowned-capabilities.mjs`

- [ ] **Step 1: Extend component schema**

Add fields:
- `routeFamily`
- `layerTruth`
- `canonicalStatus`
- `targetStateDecision`
- `mockBacked`
- `capabilityDependencies`
- `migrationPhase`
- `deadCodeCandidate`
- `prototypeStatus`

- [ ] **Step 2: Load governance artifacts**

Read:
- `.claude/route-family-map.json`
- `.claude/plans/frontend-capability-gap-matrix.json`
- `.claude/plans/route-family-target-state.json`

- [ ] **Step 3: Emit governance summary**

Required rollups:
- route families by decision
- mock-backed live surfaces
- unresolved capability gaps
- dead-code candidates
- prototype candidates

- [ ] **Step 4: Run inventory and verify output**

Run:
```bash
cd frontend && npx ts-node scripts/component-inventory.ts --output component-inventory.json
```

Expected:
- JSON includes governance-derived fields
- migration progress is visible in output

- [ ] **Step 5: Commit**

```bash
git add frontend/scripts/component-inventory.ts frontend/component-inventory.json
git commit -m "feat(inventory): track migration progress against governance artifacts"
```

---

## Plan Document

### Task 8: Save Migration Execution Plan

**Files:**
- Create: `.claude/plans/2026-03-12-frontend-source-of-truth-migration.md`

- [ ] **Step 1: Write failing test**

```python
from pathlib import Path

def test_migration_plan_doc_exists():
    path = Path(".claude/plans/2026-03-12-frontend-source-of-truth-migration.md")
    assert path.exists()
```

- [ ] **Step 2: Run test**

Run:
```bash
pytest tests/plans/test_migration_plan_doc.py -v
```

Expected:
- FAIL until document exists

- [ ] **Step 3: Write the execution plan document**

Include:
- branch strategy
- governance artifacts
- route-family decisions
- skills infrastructure section
- capability-led additions
- verification commands
- commit boundaries

- [ ] **Step 4: Re-run test**

Run:
```bash
pytest tests/plans/test_migration_plan_doc.py -v
```

Expected:
- PASS

- [ ] **Step 5: Commit**

```bash
git add .claude/plans/2026-03-12-frontend-source-of-truth-migration.md tests/plans/test_migration_plan_doc.py
git commit -m "docs(plan): add frontend source-of-truth migration execution plan"
```

---

## Test Plan

Run after each chunk:
- `pytest tests/plans -v`
- `python3 - <<'PY'` with `json.loads(...)` for each governance artifact
- `cd frontend && yarn build`

Final acceptance checks:
- `.claude/route-family-map.json` exists and covers all route families
- `.claude/plans/frontend-capability-gap-matrix.json` is still valid
- `.claude/plans/route-family-target-state.json` is still valid
- `.claude/plans/2026-03-12-frontend-source-of-truth-migration.md` exists
- branch strategy is documented and uses a dedicated `feat/*` branch from current branch
- one canonical ingestion contract is explicit
- one canonical voice owner is explicit
- capability-led additions are explicit
- skills infrastructure section is included and actionable

---

## Assumptions

- Runtime truth is the live route graph in `frontend/src/App.tsx`.
- Design truth is `screens/**/*.wireframe.xml` plus paired `screens/**/*.tsx`.
- Capability truth must shape target-state planning whenever backend support already exists.
- Voice is retained and defaults to `/profile`.
- The canonical ingestion contract defaults to `/api/v1/ingest`.
- `/kr/*` routes are prototype/reference, not target-state product truth.
- Execution should happen on a dedicated feature branch created from the current branch head.
