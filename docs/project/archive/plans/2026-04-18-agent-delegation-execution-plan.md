# Remaining Work Delegation and Execution Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Status:** Historical execution plan. Agent workstreams are complete; use `2026-04-19-post-agent-redirect-history-cleanup-plan.md` for the current next-step sequence.

**Goal:** Finish the remaining token, donor-reference, and runtime cleanup work by dividing it into bounded batches and assigning each batch to the best-fit agent while keeping runtime truth and KR token governance intact.

**Architecture:** Use `Codex` as the controller, integrator, and verifier in this workspace. Execute each batch with `subagent-driven-development`, and when a batch contains multiple independent, non-overlapping workstreams, use `dispatching-parallel-agents` to split them by file set and problem domain. `Claude Code` handles ambiguity, authority reconciliation, and bounded file-owned implementation for the mechanical cleanup workstreams. `Gemini` handles large-context comparison and inventory synthesis.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind, FastAPI, KR Solidarity token pipeline, Husky, GitHub Actions, `scripts/design-validation/check-design-drift.py`, `frontend/scripts/validate-governance-artifacts.mjs`, active planning docs under `docs/project/active/`.

## Current Staging Status

Prepared on 2026-04-18:
- `docs/project/active/handovers/2026-04-18-token-translation-table.md`
- `docs/project/active/handovers/2026-04-18-gemini-inventory-packet.md`
- `docs/project/active/handovers/2026-04-18-claude-semantic-review-packet.md`
- `docs/project/active/handovers/2026-04-18-claude-code-workstream-a-packet.md`
- `docs/project/active/handovers/2026-04-18-claude-code-workstream-b-packet.md`
- `docs/project/active/handovers/2026-04-18-claude-code-workstream-d-packet.md`
- `docs/project/active/handovers/2026-04-18-codex-workstream-c-packet.md`
- `docs/project/active/handovers/2026-04-18-agent-invocation-index.md`

Interpretation:
- Batch 1 and Batch 2 are now staged for dispatch.
- Remaining work is agent execution, reintegration, and verification rather than more planning setup.
- Gemini inventory is user-reported complete; treat the inventory lane as done operationally, but add the returned structured memo to `docs/project/active/handovers/` if repo-verifiable evidence is required later.
- Claude Code semantic review is still pending; the repo currently contains the packet only, not a returned review memo or completion artifact.

## Clear Assignment Matrix

| Work item | Assigned agent | Why this agent owns it | Writable scope | Output |
| --- | --- | --- | --- | --- |
| Token/drift inventory | `Gemini` | Best fit for large-context comparison and clustering | None; review/inventory only | Structured inventory memo |
| Mapping approval and ambiguity review | `Claude Code` | Best fit for authority-sensitive semantic judgment | None; review only | Approved mapping corrections and ambiguities |
| Workstream A | `Claude Code` | Deterministic multi-file hex cleanup with frozen mappings | `frontend/src/config/resume-constants.ts`, `frontend/src/features/landing/LandingPage.tsx`, `frontend/src/features/landing/LandingPage.module.css` | Bounded patch summary |
| Workstream B | `Claude Code` | Deterministic single-file cleanup inside known chart constraints | `frontend/src/features/analysis/Analysis.tsx` | Bounded patch summary |
| Workstream C | `Codex` | Runtime-sensitive screen cleanup with screen-pairing context | `frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx` | Local implementation + verification |
| Workstream D | `Claude Code` | Small bounded banned-token cleanup in shared shell files | `frontend/src/layouts/shared/Footer.tsx`, `frontend/src/layouts/shared/Sidebar.tsx` | Bounded patch summary |
| Reintegration and validation | `Codex` | Final repo authority for acceptance, validation, and task updates | Any integrated files after review | Landed repo changes + verification |

Non-assignments:
- `Gemini` does not edit code in this stage.
- `Claude Code` does not edit code in this stage.
- `Claude Code` does not own `OpportunitiesDiscovery.tsx`.
- `Codex` remains the only reintegration authority.

---

## Agent Operating Model

Each batch must name:
- **Owner:** primary agent responsible for the batch outcome
- **Execution venue:** where the work is actually performed
- **Input packet:** the exact files, prompts, and acceptance criteria handed to that agent
- **Expected output:** what must come back for integration
- **Reintegration step:** how `Codex` validates and lands the result

Default roles:
- **Codex**
  - Owner for runtime code, CI, verification, and integration
  - Execution venue: this workspace
  - Expected output: committed or ready-to-apply repo changes plus local verification output
- **Claude Code**
  - Owner for authority-sensitive review, architecture judgment, and Figma/runtime/canon reconciliation
  - Execution venue: external Claude Code session
  - Expected output: review memo, approved mapping corrections, or go/no-go decision with concrete file guidance
- **Gemini**
  - Owner for inventory, clustering, classification, and large-context comparison
  - Execution venue: external Gemini session
  - Expected output: structured analysis artifact with no direct code edits assumed
- **Claude Code**
  - Owner for authority-sensitive review, architecture judgment, Figma/runtime/canon reconciliation, and deterministic bounded transforms after mappings are frozen
  - Execution venue: external Claude Code session
  - Expected output: precise file-local edits or patch text restricted to the assigned writable set

Rules:
- `Codex` is always the reintegration authority
- external agents do not share writable ownership of the same file set in the same batch
- all external output must be validated against KR canon and current repo truth before landing

---

### Task 1: Freeze Delegation Boundaries and Authority Inputs

**Files:**
- Modify: `docs/project/active/plans/2026-04-18-agent-delegation-execution-plan.md`
- Inspect: `TASKS.md`
- Inspect: `docs/project/active/figma-sync-order.json`
- Inspect: `docs/design/01_CANON.md`
- Inspect: `docs/design/02_SYSTEM.md`

- [ ] **Step 1: Re-read the active task and authority sources**

Run:

```bash
sed -n '1,220p' TASKS.md
sed -n '1,220p' docs/design/01_CANON.md
sed -n '1,220p' docs/design/02_SYSTEM.md
python3 -m json.tool docs/project/active/figma-sync-order.json >/dev/null
```

Expected:
- `TASKS.md` still reflects the completed shell-compliance pass and the remaining drift debt
- design canon is confirmed as the source of truth for tokens, typography, and flora bans
- `figma-sync-order.json` parses cleanly

- [ ] **Step 2: Rebuild the style-guide frame in Figma and define no-overlap ownership zones**

> **Fallback (frame lock):** If the style-guide frame cannot be overwritten via plugin (locked or protected), do **not** attempt to force-overwrite. Note the current frame state, mark `style-guide frame rebuild` as `readiness: deferred`, and continue to ownership-zone definition without blocking the rest of Task 1.

Record and follow these ownership rules:
- `Codex`: live runtime files, CI hooks, validators, final integration
- `Claude`: authority conflicts, route-promotion decisions, Figma donor/runtime disagreement
- `Gemini`: inventory, comparison, classification, token-cluster analysis
- `Claude Code`: deterministic replacements in bounded file sets after mappings are frozen

Expected:
- no two agents are assigned the same writable file set in the same batch
- if frame rebuild is deferred, that status is recorded in `TASKS.md` under `Waiting On`

- [ ] **Step 3: Establish the batch ordering**

Use this fixed order:
- Batch 1: token translation and inventory
- Batch 2: mechanical cleanup
- Batch 3: runtime route cleanup
- Batch 4: final verification and handoff

Expected:
- no route cleanup starts before token translation and mechanical cleanup mappings are stable

- [ ] **Step 4: Commit the planning baseline**

```bash
git add docs/project/active/plans/2026-04-18-agent-delegation-execution-plan.md
git commit -m "docs: add delegated execution plan"
```


### Task 2: Build the Token Translation Table

**Files:**
- Create: `docs/project/active/handovers/2026-04-18-token-translation-table.md`
- Inspect: `frontend/src/design/styles/design-tokens.css`
- Inspect: `frontend/src/design/tokens/solidarity-tokens.ts`
- Inspect: `frontend/src/_reference/migration/phase3/**/*.tsx`
- Inspect: `docs/archive_legacy_reports/root_legacy/Career-Copilot-Web-App/src/**/*`

**Owner:** `Codex` coordinating `Gemini` then `Claude Code`
**Execution venue:** external Gemini session for inventory, external Claude Code session for semantic review, this workspace for consolidation
**Input packet:** KR canon docs, canonical token files, donor-reference files, archive donor export, current drift output
**Expected output:** approved translation table and explicit exceptions
**Reintegration step:** `Codex` writes the final table into `docs/project/active/handovers/2026-04-18-token-translation-table.md`

> **Baseline integrity check (required before adding the drift checker):** Confirm `validate-governance-artifacts.mjs` and `validate-tokens.py` both pass cleanly before Task 2 adds the drift checker. Task 2 Step 6 assumes a clean baseline — run both validators, record their output as the baseline claim, and do not write the checkpoint claim until both are confirmed green.

- [ ] **Step 1: Dispatch the inventory analysis to Gemini**

Prompt Gemini with this exact scope:

```text
Inventory only. Do not propose code changes.

Compare these three layers:
1. canonical runtime KR tokens in frontend/src/design/styles/design-tokens.css and frontend/src/design/tokens/solidarity-tokens.ts
2. donor-reference phase3 files under frontend/src/_reference/migration/phase3
3. archive donor export under docs/archive_legacy_reports/root_legacy/Career-Copilot-Web-App/src

Return:
- all discovered --sys-* names
- all discovered archive surface/content vars
- clusters of hardcoded hex by file
- candidate semantic mappings to --kr-* by intent
- files that should be treated as generated/archive-only rather than migrated
```

Expected:
- a structured inventory that separates phase3 `--sys-*` from archive `--surface-*` and raw-hex usage

- [ ] **Step 2: Dispatch semantic ambiguity review to Claude**

Prompt Claude with this exact scope:

```text
Review-only. No code changes.

Given the KR Solidarity canon and the inventory output, approve or correct the semantic mappings for:
- phase3 --sys-* -> canonical --kr-*
- archive --surface-* / --primary-* / --on-surface* -> canonical --kr-*

Flag only cases where design intent is ambiguous or where multiple KR targets are plausible depending on use.
```

Expected:
- an approved mapping set plus a short list of ambiguous mappings requiring per-file judgment

- [ ] **Step 3: Consolidate the final mapping table in-repo**

Create `docs/project/active/handovers/2026-04-18-token-translation-table.md` with these sections:
- canonical `--sys-*` to `--kr-*`
- archive donor vars to `--kr-*`
- “do not migrate mechanically” exceptions
- generated/archive-only exclusions

Expected:
- a single approved reference for all later cleanup batches

- [ ] **Step 4: Verify the handover artifact exists and is readable**

Run:

```bash
test -f docs/project/active/handovers/2026-04-18-token-translation-table.md
sed -n '1,220p' docs/project/active/handovers/2026-04-18-token-translation-table.md
```

Expected:
- file exists
- mapping table is readable without referring back to chat history


### Task 3: Execute Mechanical Cleanup with Parallel Agents

> **Hard gate — do not start batch extraction until Task 2 Step 5 (commit) is complete** and `docs/project/active/figma-sync-order.json` contains a `code_target_node_id` for every route in the batch 2 sync list. If any route is missing its node ID, stop and record it in `Waiting On` before proceeding.

**Files:**
- Modify: `frontend/src/config/resume-constants.ts`
- Modify: `frontend/src/features/landing/LandingPage.tsx`
- Modify: `frontend/src/features/landing/LandingPage.module.css`
- Modify: `frontend/src/features/analysis/Analysis.tsx`
- Modify: `frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx`
- Modify: other bounded production files selected from drift output

**Owner:** `Codex` coordinating parallel `Claude Code` and `Codex` subagents
**Execution venue:** external Claude Code sessions for deterministic transforms, this workspace for Codex subagents and integration
**Input packet:** approved token translation table, exact writable file lists, exact constraints, current drift output narrowed to assigned files
**Expected output:** bounded patches with no extra file edits
**Reintegration step:** `Codex` performs spec-compliance review, integrates accepted patches, and reruns narrow validations

- [ ] **Step 1: Split the cleanup into non-overlapping workstreams**

Create these workstreams:
- Workstream A: hex cleanup in `resume-constants.ts` and landing files
- Workstream B: hex cleanup in `Analysis.tsx` and chart/supporting components
- Workstream C: hex and semantic cleanup in `OpportunitiesDiscovery.tsx`
- Workstream D: banned token string cleanup in disjoint files under `features/` and `layouts/`

Expected:
- each workstream has a unique writable file set

- [ ] **Step 2: Use dispatching-parallel-agents for the independent workstreams**

> **Pre-dispatch — `/onboarding` shell audit required:** `/onboarding` is currently flagged "Needs shell audit." Complete the audit and record the result in `figma-sync-order.json` under the `/onboarding` entry before Step 3 begins. Do not discover its state mid-batch.

> **Locked assumption — AppShell lookup:** Scripts use `.find(c => c.name === 'AppShell')` to locate the shell as a direct named child of `PageCanvas` in the three legacy routes (Tasks 3–5). If the node carries a variant name (e.g. `AppShell / Default`) or is nested differently, the flatten will silently return `'AppShell not found'` without blocking the commit. Verify the exact node name and nesting depth before dispatching extraction scripts; update the find predicate if it does not match the literal string `'AppShell'`.

> **Locked assumption — `/analysis` SideSheet siblings:** After `PageCanvas` removal, SideSheet siblings in `/analysis` are treated as "leave as-is (content, not shell)." This must be an explicit policy decision recorded in `figma-sync-order.json` or `TASKS.md` before dispatch — it cannot be an ad-hoc judgment call made mid-step.

Dispatch:
- `Claude Code` for Workstream A
- `Claude Code` for Workstream B
- `Codex` subagent for Workstream C because it is larger and more runtime-sensitive
- `Claude Code` or `Codex` subagent for Workstream D depending on file count and ambiguity

Each implementation prompt must include:
- exact writable files
- the approved token translation table
- "do not edit unrelated files"
- "replace hardcoded hex and banned legacy token strings only"
- "preserve behavior and layout"

Expected:
- multiple bounded cleanup changes are produced concurrently without file conflicts
- `/onboarding` shell audit is recorded before any extraction begins
- AppShell node name and nesting are confirmed before extraction scripts run
- `/analysis` SideSheet sibling policy is recorded before dispatching

- [ ] **Step 2a: Prepare the external Claude Code packet template**

For each Claude Code-owned workstream, create a packet with:
- goal statement
- exact writable files
- approved token mappings for the file set
- forbidden actions:
  - do not edit unrelated files
  - do not rename exports
  - do not alter route exposure
  - do not introduce new raw hex, `--sys-*`, or archive surface vars
- required return format:
  - list of changed files
  - short rationale per file
  - any unresolved ambiguities

Expected:
- Claude Code receives a deterministic, bounded transform task rather than open-ended cleanup

- [ ] **Step 3: Review each returned patch for spec compliance first**

For each workstream:
- verify all replacements use approved `--kr-*` tokens
- verify no new `--sys-*`, `--surface-*`, or raw hex values were introduced
- reject any patch that rewrites beyond its assigned file set

Expected:
- only mapping-compliant changes move forward to integration

- [ ] **Step 4: Sync the public/auth batch routes — with explicit skip gate for empty frames**

For each route in the sync batch:
1. Confirm `code_target_node_id` is present in `figma-sync-order.json` — if missing, stop and record in `Waiting On`.
2. **`/dashboard` (node `1:1277 MainBoard`):** Check whether the frame has content.
   - If `1:1277 MainBoard` is still empty: **skip `/dashboard` entirely.** Do not attempt to sync, extract, or generate a component from an empty frame. Move `/dashboard` to `Waiting On — design decision required` and continue the batch with the remaining routes.
   - If `1:1277 MainBoard` has content: proceed with sync as normal.
3. Proceed with sync for all other routes that have confirmed `code_target_node_id` values and non-empty frames.

Then run:

```bash
python3 scripts/design-validation/check-design-drift.py
(cd frontend && yarn type-check)
node frontend/scripts/validate-governance-artifacts.mjs
```

Expected:
- drift violations decrease
- type-check remains green
- governance artifact validation remains green
- `/dashboard` is either synced (frame had content) or explicitly in `Waiting On` (frame was empty) — an empty frame is never silently committed

- [ ] **Step 5: Commit the mechanical cleanup batch**

```bash
git add frontend/src/config/resume-constants.ts \
  frontend/src/features/landing/LandingPage.tsx \
  frontend/src/features/landing/LandingPage.module.css \
  frontend/src/features/analysis/Analysis.tsx \
  frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx
git commit -m "refactor: replace donor-era token residue with kr semantics"
```


### Task 4: Execute Runtime Cleanup with Subagent-Driven Development

**Files:**
- Modify: live runtime files under `frontend/src/features/**`
- Modify: live runtime files under `frontend/src/screens/**`
- Modify: `TASKS.md`
- Inspect: `frontend/src/App.tsx`
- Inspect: `frontend/src/config/route-registry.ts`

**Owner:** `Codex`, with `Claude Code` as external reviewer for ambiguous authority conflicts
**Execution venue:** this workspace for implementation, external Claude Code session for review-only interventions
**Input packet:** approved token translation table, runtime file list, current drift output, route and design authority docs
**Expected output:** runtime-safe patches and review memos for any ambiguous cases
**Reintegration step:** `Codex` lands accepted changes, updates `TASKS.md`, and reruns validation after each task

- [ ] **Step 1: Identify runtime files that still carry donor residue after mechanical cleanup**

Run:

```bash
python3 scripts/design-validation/check-design-drift.py | sed -n '1,240p'
```

Expected:
- remaining violations are isolated to runtime files that need deliberate implementation work, not bulk mechanical replacement

- [ ] **Step 2: Execute one runtime task at a time with subagent-driven-development**

For each selected runtime task:
- dispatch a fresh implementer subagent with exact task text and file set
- require the implementer to preserve runtime behavior and route exposure
- require the implementer to use the approved translation table and repo authority order
- require self-review and targeted verification before handoff

Expected:
- runtime-sensitive cleanup is handled one bounded task at a time with isolated context

- [ ] **Step 3: Run two-stage review after each runtime task**

First review:
- spec compliance against the KR token and authority rules

Second review:
- code quality, regression risk, and test sufficiency

Expected:
- no task is marked complete until both review stages are green

- [ ] **Step 3a: Escalate authority conflicts to Claude Code instead of guessing**

If a runtime task hits one of these conditions:
- donor/reference/runtime disagree on intended behavior
- Figma donor intent conflicts with KR canon or current route exposure
- a mapping is semantically ambiguous in live UX

Create a Claude Code review packet containing:
- the exact conflicting files
- the relevant snippets from canon and active planning docs
- the concrete decision needed
- “review only, no implementation”

Expected:
- authority-sensitive decisions are made explicitly, not inferred during implementation

- [ ] **Step 4: Update TASKS.md after each completed runtime task**

When a runtime task lands:
- mark the relevant debt item completed or narrowed
- move any unresolved ambiguity into `Waiting On` or `Someday`
- do not create a second progress tracker

For redirect-history cleanup, track as **two separate line items** with distinct owners and unblock conditions:
1. **Figma cleanup** — archive or rename deprecated redirect nodes inside Figma. Owner: design. Unblocked by: design decision on which nodes are retired.
2. **Doc cleanup** — remove deprecated redirects from blocking sync context in planning docs and `figma-sync-order.json`. Owner: `Codex`. Unblocked by: Figma cleanup completing or an explicit "skip" decision recorded in `TASKS.md`.

Do not combine these into a single task entry; they have different owners and different unblock conditions.

Expected:
- `TASKS.md` remains the sole active board
- redirect-history Figma cleanup and doc cleanup are tracked as distinct items with distinct owners


### Task 5: Final Verification and Handoff

**Files:**
- Modify: `TASKS.md`
- Create: `docs/project/active/handovers/2026-04-18-delegated-execution-handover.md`

**Owner:** `Codex`
**Execution venue:** this workspace, with optional final external Claude Code review
**Input packet:** all integrated batch outputs, final validation results, updated task board state
**Expected output:** final verification record and handover artifact
**Reintegration step:** none; this is the closing batch

- [ ] **Step 1: Run final verification for the full cleanup slice**

Run:

```bash
python3 scripts/design-validation/check-design-drift.py
(cd frontend && yarn type-check)
(cd frontend && yarn lint)
python3 scripts/design-validation/validate-tokens.py
node frontend/scripts/validate-governance-artifacts.mjs
```

Expected:
- exact remaining drift count is known
- type-check passes
- lint passes or the failures are explicitly recorded
- token validation passes
- governance validation passes

- [ ] **Step 2: Write the execution handover**

Create `docs/project/active/handovers/2026-04-18-delegated-execution-handover.md` with:
- completed batches
- agent assignments used
- execution venue used for each batch
- files touched by batch
- remaining violations by category
- recommended next batch

Expected:
- next operator can continue without replaying prior chat context

- [ ] **Step 3: Update TASKS.md to reflect the end state of this execution slice**

Record:
- what was fully completed
- what remains active
- what is blocked on design/authority decisions

Expected:
- task board matches repo state at handoff time

- [ ] **Step 4: Commit the handover state**

```bash
git add TASKS.md \
  docs/project/active/handovers/2026-04-18-token-translation-table.md \
  docs/project/active/handovers/2026-04-18-delegated-execution-handover.md
git commit -m "docs: record delegated cleanup handover"
```
