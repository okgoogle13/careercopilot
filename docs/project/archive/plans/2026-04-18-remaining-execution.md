# Remaining Execution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the remaining active work in `TASKS.md` by finishing the `/style-guide` Figma reference frame, adding automated token/design drift checks, and executing route-by-route code sync from the canonical Figma nodes already recorded in `figma-sync-order.json`.

**Architecture:** Treat this as three lanes with hard sequencing. Lane 1 is Figma-only and unblocks design-system verification. Lane 2 adds local/CI guardrails so extraction work cannot silently reintroduce banned tokens or legacy styles. Lane 3 performs code sync in route batches against the canonical node IDs already confirmed in the active Figma file. `TASKS.md` remains the active board; `figma-sync-order.json` remains the route extraction contract.

**Tech Stack:** Figma active file `eoNJnwvDZ64OUgSthE20WW`, React 18, TypeScript, Vite, Tailwind, ESLint flat config, Husky, GitHub Actions, KR Solidarity token pipeline.

---

### Task 1: Complete `/style-guide` Figma Reference Frame

**Files:**
- Modify: `TASKS.md`
- Modify: `docs/project/active/figma-sync-order.json`
- Inspect: `docs/project/active/figma-agent-tasks.md`
- Inspect: `frontend/src/features/style-guide/StyleGuide.tsx`

- [ ] **Step 1: Re-read the current blocker definition**

Run:

```bash
rg -n "utility-style-guide|/style-guide|style-guide frame" \
  docs/project/active/figma-sync-order.json \
  docs/project/active/figma-agent-tasks.md \
  TASKS.md
```

Expected:
- `figma-sync-order.json` shows `/style-guide` as `internal_reference`, `readiness: incomplete`
- `TASKS.md` still lists `Complete /style-guide Figma reference frame` as active

- [ ] **Step 2: Rebuild the style-guide frame in the active Figma file**

In Figma file `eoNJnwvDZ64OUgSthE20WW`, create or replace the style-guide surface with a 1440×900 desktop reference frame that includes:
- shell primitives: `PageBackground`, `AppShell`, `Sidebar`, `MainContent`, `PageChromeHeader`
- explicit note that `PageCanvas` is legacy-only
- archetype examples: `Strike`, `Placard`, `Scaffold`, `March`, `Megaphone`
- governance notes: semantic `--kr-*`, no hardcoded hex, no banned fonts, no flora

Expected:
- `/style-guide` is no longer mobile-only reference debris
- the frame can be used as the design-system verification anchor before broad extraction

- [ ] **Step 3: Update sync metadata after the Figma change**

Update the `utility-style-guide` item in `docs/project/active/figma-sync-order.json`:
- replace the stale notes describing a 441px/mobile-only frame
- record the new frame dimensions and readiness
- keep `surface_class: internal_reference`

Also update `TASKS.md`:
- mark `Complete /style-guide` done
- if any residual follow-up remains, move it to `Waiting On` or `Someday` instead of leaving the main blocker open

- [ ] **Step 4: Validate metadata shape**

Run:

```bash
python3 -m json.tool docs/project/active/figma-sync-order.json >/dev/null
```

Expected: no JSON parse errors.


### Task 2: Add Token/Design Drift Guardrails to Pre-Commit and CI

**Files:**
- Create: `scripts/design-validation/check-design-drift.py`
- Modify: `.husky/pre-commit`
- Modify: `frontend/eslint.config.mjs`
- Modify: `.github/workflows/ci.yml`
- Modify: `frontend/package.json`

- [ ] **Step 1: Create a single repo-owned design drift checker**

Create `scripts/design-validation/check-design-drift.py` that scans `frontend/src/` for:
- hardcoded hex colors in production TS/TSX/CSS modules
- banned legacy class/token patterns:
  - `text-parchment`
  - `surface-KrDark-`
  - `outline-variant`
- flora/fauna residue terms in production UI files:
  - `wattle`
  - `eucalyptus`
  - `gum leaf`
  - `fern`
  - `kookaburra`

The script should:
- print file:line matches
- exit non-zero on violations
- ignore `_reference/`, tests, stories, generated token CSS, and archived docs

- [ ] **Step 2: Add a frontend script entry**

Add this script to `frontend/package.json`:

```json
"design:drift-check": "python3 ../scripts/design-validation/check-design-drift.py"
```

Expected: the drift checker can run from the frontend workspace and CI.

- [ ] **Step 3: Extend the root Husky hook instead of creating another shadow hook**

Modify `.husky/pre-commit` so it keeps the token rebuild/validation logic and, when frontend files are staged, also runs:

```bash
cd frontend && yarn design:drift-check && cd ..
```

Do not create another root hook file. Do not move task tracking into the hook.

- [ ] **Step 4: Add targeted ESLint guardrails for the known bad patterns**

In `frontend/eslint.config.mjs`, add a narrow `no-restricted-syntax` / `no-restricted-properties` / `no-restricted-imports` style rule block (whichever is simplest in flat config) that flags string literals containing:
- `text-parchment`
- `surface-KrDark-`
- `outline-variant`

Keep the rule scoped to production source files; do not fail tests/stories/reference files.

- [ ] **Step 5: Extend the existing CI workflow rather than creating a new workflow**

In `.github/workflows/ci.yml`, extend the existing `frontend-brand-compliance` job to run:

```bash
python3 scripts/design-validation/check-design-drift.py
node frontend/scripts/validate-governance-artifacts.mjs
```

Expected:
- design drift is checked in the same CI job that already validates tokens
- no duplicate “design compliance” workflow is introduced

- [ ] **Step 6: Verify the guardrails locally**

Run:

```bash
cd frontend && yarn design:drift-check
cd frontend && yarn lint
python3 scripts/design-validation/validate-tokens.py
node frontend/scripts/validate-governance-artifacts.mjs
```

Expected:
- drift check passes
- ESLint still passes
- token/governance validations remain green


### Checkpoint: Run Guardrails Before Any Route Batch

After Task 2 lands and before starting Task 3, run all four guardrails once to establish a clean baseline:

- [ ] **Run guardrails once to confirm baseline is clean**

```bash
cd frontend && yarn design:drift-check
cd frontend && yarn lint
python3 scripts/design-validation/validate-tokens.py
node frontend/scripts/validate-governance-artifacts.mjs
```

Expected: all pass with zero violations. Do not start batch extraction until this checkpoint is green.

---

### Task 3: Execute Broad Code Extraction and Sync in Route Batches

**Files:**
- Inspect/modify per route:
  - `frontend/src/screens/*/mapping.json`
  - `frontend/src/screens/*/*.wireframe.xml`
  - paired `frontend/src/screens/*/*.tsx`
  - canonical owners under `frontend/src/features/**`
- Inspect/modify coordination docs:
  - `docs/project/active/figma-sync-order.json`
  - `TASKS.md`

- [ ] **Step 1: Start with the canonical route contract, not donor or archive surfaces**

Use `docs/project/active/figma-sync-order.json` batch 2 as the source for:
- `figma_node_id`
- `code_target_node_id`
- canonical owner
- route batching

Do not sync from:
- deprecated Gallery/Nocturnal assets
- redirect-history routes
- `_reference/` donor files except as comparison material

- [ ] **Step 2: Sync public/auth batch first**

Batch:
- `/`
- `/auth`
- `/onboarding`

For each route:
- compare canonical owner TSX against its `code_target_node_id`
- update the runtime component to match current Figma content hierarchy and shell policy
- keep `mapping.json`, wireframe, and component aligned

Run after this batch:

```bash
cd frontend && yarn type-check
```

- [ ] **Step 3: Sync workflow batch second**

Batch:
- `/apply`
- `/generation`
- `/settings`

Rules:
- preserve the confirmed shared shell anchors (`AppShell`, `Sidebar`, `MainContent`, `PageChromeHeader`)
- avoid route-registry/App.tsx changes unless exposure is actually wrong

Run after this batch:

```bash
cd frontend && yarn type-check
node frontend/scripts/validate-governance-artifacts.mjs
```

- [ ] **Step 4: Sync desktop canonical batch third**

Batch:
- `/dashboard`
- `/opportunities`
- `/applications`
- `/analysis`
- `/documents`
- `/profile`

Rules:
- use the new desktop canonical frames already recorded in `figma-sync-order.json`
- do not sync from legacy mobile archive frames
- preserve route-family ownership already recorded in `TASKS.md`

- [ ] **Step 5: Update the task board and sync contract as each route family lands**

After each route-family batch:
- update `TASKS.md`
- if route-specific notes changed materially, update `docs/project/active/figma-sync-order.json`

Do not create a second progress tracker.

- [ ] **Step 6: Run final verification for the broad sync batch**

Run:

```bash
cd frontend && yarn type-check
cd frontend && yarn lint
python3 scripts/design-validation/validate-tokens.py
node frontend/scripts/validate-governance-artifacts.mjs
```

Expected:
- route code compiles
- lint passes
- token/governance checks stay green


### Task 4: Handle Redirect-History Cleanup Only After Canonical Work Is Stable

**Files:**
- Modify: `TASKS.md`
- Modify: `docs/project/active/figma-sync-order.json`

- [ ] **Step 1: Re-open the waiting item only after canonical route sync is stable**

The waiting item is:
- `Collapse redirect-history pages`

Do not start this while canonical route sync is still moving.

- [ ] **Step 2: Convert the waiting item into a finite cleanup pass**

When ready, use the redirect-history items already recorded in `figma-sync-order.json` batch 3 and close them by one of:
- archive
- annotate canonical page
- rename `[redirect-history]`
- remove from blocking sync context

- [ ] **Step 3: Close the task board cleanly**

When all active work is complete:
- move the redirect-history task to `Done`
- leave no duplicate dashboard or shadow plan in `docs/project/active/`
