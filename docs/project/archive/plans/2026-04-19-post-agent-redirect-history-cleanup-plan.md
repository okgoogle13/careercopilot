# Post-Agent Redirect-History Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the remaining post-agent Figma coordination debt by recording completed agent outputs, retiring redirect-history and utility/internal clutter in the active Figma file, and updating repo coordination docs so the active sync context contains only canonical product routes plus explicitly labeled support/internal surfaces.

**Architecture:** Treat the 2026-04-18 delegation plan as historical execution context, not the next operational plan. The remaining work is now a narrow three-lane sequence: capture completion evidence, perform a bounded Figma retirement/labeling pass in the active file, then update repo source-of-truth docs to match that Figma state. Keep runtime code out of scope unless a coordination artifact is provably wrong about an already-exposed route.

**Tech Stack:** Markdown planning docs, JSON coordination artifacts, active Figma file `eoNJnwvDZ64OUgSthE20WW`, `python3 -m json.tool`, `node frontend/scripts/validate-governance-artifacts.mjs`, `rg`, `git`.

---

### Task 1: Freeze the Completed Agent Execution as Repo Evidence

**Files:**
- Create: `docs/project/active/handovers/2026-04-19-agent-execution-summary.md`
- Modify: `TASKS.md`
- Modify: `docs/project/active/plans/2026-04-18-agent-delegation-execution-plan.md`
- Inspect: `docs/project/active/handovers/2026-04-18-agent-invocation-index.md`
- Inspect: `docs/project/active/handovers/2026-04-18-gemini-inventory-packet.md`
- Inspect: `docs/project/active/handovers/2026-04-18-claude-semantic-review-packet.md`

- [ ] **Step 1: Re-read the current task board and the old delegation plan**

Run:

```bash
sed -n '1,120p' TASKS.md
sed -n '1,140p' docs/project/active/plans/2026-04-18-agent-delegation-execution-plan.md
sed -n '1,120p' docs/project/active/handovers/2026-04-18-agent-invocation-index.md
```

Expected:
- `TASKS.md` shows the drift-cleanup execution as complete
- the 2026-04-18 delegation plan still reads as an active execution plan, not a closed historical record

**Gate:** If the invocation index shows any workstream (A, B, C, or D) still open or unconfirmed, do NOT proceed to Step 2. Surface the gap in a comment and stop.

- [ ] **Step 2: Write the completion summary handover**

Create `docs/project/active/handovers/2026-04-19-agent-execution-summary.md` with this exact structure:

```md
# Agent Execution Summary

**Date:** 2026-04-19
**Active Figma file:** `eoNJnwvDZ64OUgSthE20WW`
**Source plan:** `docs/project/active/plans/2026-04-18-agent-delegation-execution-plan.md`

## Completed
- Gemini inventory memo: completed
- Claude Code semantic review: completed
- Claude Code Workstreams A, B, D: completed
- Codex Workstream C and residual drift cleanup: completed

## Outcome
- Design drift reduced to zero
- Remaining work moved to Figma redirect-history cleanup and coordination-doc cleanup only

## Notes
- If the returned Gemini or Claude memos live outside the repo, this file is the in-repo evidence stub until those artifacts are copied into `docs/project/active/handovers/`.
```

- [ ] **Step 3: Mark the old delegation plan as historical**

Add a short note near the top of `docs/project/active/plans/2026-04-18-agent-delegation-execution-plan.md`:

```md
> **Status:** Historical execution plan. Agent workstreams are complete; use `2026-04-19-post-agent-redirect-history-cleanup-plan.md` for the current next-step sequence.
```

Expected:
- nobody will pick up the 2026-04-18 plan as if A/B/C/D are still pending

- [ ] **Step 4: Tighten TASKS.md wording so it matches the completed-agent state**

Update the relevant active/done items so they clearly distinguish:
- completed agent execution
- remaining Figma redirect-history cleanup
- remaining doc/source-of-truth cleanup

Use wording like:

```md
- [ ] **Execute redirect-history Figma cleanup** — active file only; archive, annotate, or rename `[redirect-history]` frames so they do not stay mixed with canonical pages
- [ ] **Remove deprecated redirects from repo sync context** — update figma-sync-order.json and active planning docs after the Figma cleanup lands
```

- [ ] **Step 5: Validate the evidence-only documentation pass**

Run:

```bash
node frontend/scripts/validate-governance-artifacts.mjs
```

Expected:
- governance artifacts still pass after the handover/task wording changes

- [ ] **Step 6: Commit the evidence freeze**

```bash
git add \
  TASKS.md \
  docs/project/active/handovers/2026-04-19-agent-execution-summary.md \
  docs/project/active/plans/2026-04-18-agent-delegation-execution-plan.md
git commit -m "docs: freeze completed agent execution state"
```


### Task 2: Execute the Active-Figma Redirect-History and Utility/Internal Cleanup

**Files:**
- Modify: `docs/project/active/figma-agent-tasks.md`
- Modify: `docs/project/active/figma-sync-order.json`
- Inspect: `frontend/src/App.tsx`
- Inspect: `frontend/src/config/route-registry.ts`

- [ ] **Step 1: Reconfirm the active-route vs redirect-history contract before touching Figma**

Run:

```bash
sed -n '1,220p' docs/project/active/figma-agent-tasks.md
python3 -m json.tool docs/project/active/figma-sync-order.json | sed -n '300,560p'
sed -n '1,220p' frontend/src/App.tsx
sed -n '1,220p' frontend/src/config/route-registry.ts
```

Expected:
- canonical routes and redirect-history routes are already separated in docs
- redirect-history entries in `figma-sync-order.json` already use `figma_node_id: "NOT_REQUIRED"`
- runtime code still owns exposure truth

- [ ] **Step 1b: Pre-check which redirect-history pages were already addressed by prior workstreams**

Read `figma-agent-tasks.md` A-3 for any routes already marked DONE or labeled. Build a skip-list before touching Figma — do not re-archive or re-rename pages already handled.

- [ ] **Step 2: Apply the bounded redirect-history cleanup in the active Figma file**

**Execution method: use `use_figma` MCP tool (agent-executed, not manual Figma edits).** For each redirect-history page listed in `figma-agent-tasks.md` A-3 that is NOT already on the skip-list from Step 1b:
- archive it, or
- collapse it into an annotation attached to the canonical page, or
- rename it explicitly with a `[redirect-history]` prefix

Use this exact redirect-history list:
- `/login`
- `/register`
- `/welcome`
- `/dashboard-overview`
- `/job-queue`
- `/lookout`
- `/feed`
- `/tracker`
- `/kanban`
- `/docs`
- `/editor`
- `/apply/quick`
- `/ksc-generator`
- `/cover-letter-generator`
- `/studio`
- `/identity`
- `/dossier`
- `/career/ingest`
- `/ingestion`

Expected:
- no redirect-history page remains visually mixed into the canonical product-route lane without an explicit historical label

- [ ] **Step 3: Apply the bounded utility/internal cleanup in the active Figma file**

**Execution method: `use_figma` MCP tool (agent-executed).** For these surfaces:
- `/asset-library`
- `/design-sidekick`
- `/style-guide`
- `/animation-test`
- `/test-tokens`

Do one of:
- label explicitly as `support /...` or `internal /...`
- archive/remove if no longer needed in the active file

Expected:
- utility/internal surfaces are no longer visually ambiguous with product routes

- [ ] **Step 4: Record the outcome back into `figma-agent-tasks.md`**

Update A-3 and A-4 from open/high-priority wording to a result-oriented state using exact language like:

```md
### A-3 · DONE — Redirect-history pages separated from canonical pages in Figma
```

and

```md
### A-4 · DONE — Utility and internal pages separated from product route tabs
```

Then add one bullet under each section stating what actually happened:
- archived
- renamed `[redirect-history]`
- annotated on canonical frame
- retained as `support /...` or `internal /...`

- [ ] **Step 5: Record the same result in `figma-sync-order.json` without inventing new sync blockers**

For redirect-history and utility/internal sections, keep the current non-blocking semantics:
- do not convert `NOT_REQUIRED` into fake node IDs
- do not move redirect-history entries into the canonical product batch
- only update notes/status text to match what happened in Figma

Use note text like:

```json
"notes": "Archived or explicitly labeled as redirect-history in the active file; not part of the canonical sync queue."
```

Expected:
- the JSON still encodes redirect-history as non-blocking, but the notes now reflect the actual cleanup state

- [ ] **Step 6: Validate the JSON after the Figma-state writeback**

Run:

```bash
python3 -m json.tool docs/project/active/figma-sync-order.json >/dev/null
python3 -m json.tool docs/design/screen-map.json >/dev/null
python3 -m json.tool docs/manifests/screens.json >/dev/null
```

Expected:
- all JSON remains valid

- [ ] **Step 7: Commit the Figma coordination cleanup**

```bash
git add docs/project/active/figma-agent-tasks.md docs/project/active/figma-sync-order.json
git commit -m "docs: retire redirect-history and utility clutter from active figma sync"
```


### Task 3: Remove Deprecated Redirects from Active Repo Sync Context

**Files:**
- Modify: `docs/design/screen-map.json`
- Modify: `docs/manifests/screens.json`
- Modify: `TASKS.md`
- Inspect: `frontend/src/screens/**/mapping.json`
- Inspect: `docs/project/active/figma-sync-order.json`

- [ ] **Step 1: Re-read the paired-screen and manifest context**

Run:

```bash
sed -n '1,220p' docs/design/screen-map.json
sed -n '1,260p' docs/manifests/screens.json
python3 -m json.tool docs/project/active/figma-sync-order.json | sed -n '300,560p'
rg -n "\"route\"|\"notes\"" frontend/src/screens/*/mapping.json
```

Expected:
- paired screens still encode alias routes and redirect-history status for reference
- active sync JSON remains the operational source for what blocks sync

- [ ] **Step 2: Normalize active-doc language so redirects stay informative but non-blocking**

In `docs/design/screen-map.json` and `docs/manifests/screens.json`:
- keep alias routes where they explain runtime history
- keep `04_ingestion` as `redirect_history`
- remove any wording that could imply redirect-history routes are canonical sync targets
- preserve canonical route ownership under the current runtime paths only

Use note text like:

```json
"notes": "Runtime canonical route is /opportunities. Alias routes remain historical/reference only and are excluded from the active sync queue."
```

Expected:
- the docs still preserve route history, but nobody could mistake those aliases for current Figma sync targets

- [ ] **Step 3: Update TASKS.md waiting items after the Figma/doc cleanup**

If Task 2 is complete, tighten the waiting items to the true residual debt only.

Expected wording:
- remove stale waiting text that assumes redirect-history pages are still mixed into the active file
- keep only any genuine follow-up items that still need design decisions

- [ ] **Step 4: Run the documentation verification pass**

Run:

```bash
python3 -m json.tool docs/design/screen-map.json >/dev/null
python3 -m json.tool docs/manifests/screens.json >/dev/null
node frontend/scripts/validate-governance-artifacts.mjs
```

Expected:
- both manifests parse
- governance artifact validation remains green

- [ ] **Step 5: Commit the repo sync-context cleanup**

```bash
git add \
  TASKS.md \
  docs/design/screen-map.json \
  docs/manifests/screens.json
git commit -m "docs: remove deprecated redirects from active sync context"
```


### Task 4: Final Review and Handoff

**Files:**
- Modify: `TASKS.md`
- Create: `docs/project/active/handovers/2026-04-19-post-agent-redirect-history-cleanup-summary.md`
- Inspect: `docs/project/active/figma-agent-tasks.md`
- Inspect: `docs/project/active/figma-sync-order.json`
- Inspect: `docs/design/screen-map.json`
- Inspect: `docs/manifests/screens.json`

- [ ] **Step 1: Create the final cleanup summary**

Create `docs/project/active/handovers/2026-04-19-post-agent-redirect-history-cleanup-summary.md` with these sections:

```md
# Post-Agent Redirect-History Cleanup Summary

## Completed
- agent execution frozen as historical evidence
- redirect-history pages separated from canonical pages in active Figma
- utility/internal pages separated from product-route tabs
- active repo sync context updated to keep aliases informative but non-blocking

## Still Open
- None expected. If any redirect-history page could not be archived/labeled (e.g. Figma node missing), list it here with the reason. Otherwise write: "None — cleanup is terminal."

## Verification
- list the exact commands run and whether they passed
```

- [ ] **Step 2: Run the final narrow verification set**

Run:

```bash
python3 -m json.tool docs/project/active/figma-sync-order.json >/dev/null
python3 -m json.tool docs/design/screen-map.json >/dev/null
python3 -m json.tool docs/manifests/screens.json >/dev/null
node frontend/scripts/validate-governance-artifacts.mjs
```

Expected:
- all coordination JSON parses cleanly
- governance artifacts still pass

- [ ] **Step 3: Close or narrow the remaining task board items**

Update `TASKS.md` so that:
- completed redirect-history cleanup is moved out of `Waiting On`
- only real remaining design/runtime debt stays active

- [ ] **Step 4: Commit the final cleanup handoff**

```bash
git add \
  TASKS.md \
  docs/project/active/handovers/2026-04-19-post-agent-redirect-history-cleanup-summary.md
git commit -m "docs: record post-agent redirect cleanup completion"
```
