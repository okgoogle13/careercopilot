# Claude Code Prompt: Prototype Salvage Pass (Expanded)

## Objective

Execute the expanded prototype salvage pass across 5 strategies and ~37 tracked
candidates. Your job is not to promote raw prototype files. Your job is to port
the useful behavior, logic, types, and interaction patterns into the canonical
CareerCopilot runtime, update the salvage tracker with terminal outcomes, and
keep the cleanup/dissolution plan honest.

This is distinct from cleanup (route/runtime resync) and dissolution (quarantine
purge). Salvage extracts value. Cleanup fixes drift. Dissolution removes the
migration workspace.

## Mandatory Inputs

Read and obey these first:

- `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`
- `frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/PROTOTYPE_AUDIT_LOG.md`
- `frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/REMEDIATION_REPORT.md`
- `docs/project/active/frontend-source-of-truth-migration/control/FRONTEND-CLEANUP-REPORT.md`
- `.claude/skills/route-migration/SKILL.md`
- `docs/design/01_CANON.md`
- `docs/design/02_SYSTEM.md`
- `docs/design/03_COMPONENTS.md`
- `frontend/src/App.tsx`
- `frontend/src/config/route-registry.ts`
- `docs/manifests/routes.json`
- `tools/scripts/scan-routes.ts`
- `tools/ci/check-route-integrity.ts`
- `tools/ci/check-screen-pairs.ts`

Prototype source (read-only reference — never import directly):

- `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0/`

Use these references only as needed:

- `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
- `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-PATTERN-CATALOG.md`
- `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-BLOCKER-IMPLEMENTATION-PLAN.md`
- `docs/project/active/frontend-source-of-truth-migration/control/pm/dashboard.md`
- `docs/project/active/frontend-source-of-truth-migration/control/status.md`

## Authority Order

Use this order of truth. Never invert it.

1. `frontend/src/App.tsx` for live route reachability and layout ownership
2. `frontend/src/config/route-registry.ts` for route metadata and intended mode coverage
3. the current canonical runtime destination file under `frontend/src/**`
4. `PROTOTYPE-SALVAGE-TRACKER.md` for salvage scope and terminal outcome requirements
5. `PROTOTYPE_AUDIT_LOG.md` for why a candidate was considered reusable
6. quarantine / prototype source files last

Prototype files are support-reference only. They are not canonical runtime truth.

## Strategy Execution Order

Execute in this priority sequence. S1 and S3 can run in parallel. S5, S2, S4
depend on S1/S3 outputs.

```
Phase 1 (parallel):  S1 — Behavior Seam Extraction (hooks + services, 11 files)
                      S3 — Type System Consolidation (3 files)
Phase 2:             S5 — Genkit Flow + Analysis UX Harvest (11 files)
Phase 3:             S2 — Template & Renderer Harvest (6 files)
Phase 4:             S4 — Route-Owned Page Upgrade (6 files)
```

### Mandatory Universal Preflight Gate

**Every batch — regardless of strategy — must prove all five of the following before any code changes. If any item fails, the batch stops without implementation.**

1. **Row is still `PENDING`** — confirm the tracker row has not already been resolved to a terminal state.
2. **Canonical route owner is confirmed** — identify the canonical destination file from `App.tsx` and `route-registry.ts` (runtime truth), not from the tracker alone.
3. **Runtime gap is real in that exact owner** — read the canonical destination file and confirm the behavior is absent there specifically, not just absent from the tracker row's destination path.
4. **Behavior is not already present under a different implementation** — confirm the behavior does not already exist in canonical runtime under any other route, component, hook, or service.
5. **No governance conflict** — confirm the row does not involve competing scoring models, competing route owners, backend-vs-client authority conflicts, or duplicate API/domain models requiring a product or architecture decision. If any of these apply, emit a **Harvest Conflict Brief** (see §Governance-Conflict Gate below) and stop without implementing.

**If preflight fails on any item: stop the batch, record the failure reason in the tracker row's Blocker field, and escalate to the governance owner. Do not proceed to implementation.**

### Per-strategy pre-flight notes

- **S1/S3:** Universal preflight still applies. Confirm row is `PENDING` and the destination gap is real before writing any logic.
- **S2/S5:** Read the canonical destination feature file first. Confirm the
  behavior gap exists before porting.
- **S4:** Run `blueprint` if any route ownership is ambiguous per
  `route-matrix.json`. Do not proceed on a page upgrade without confirmed owner.
- **S5 (Genkit):** Confirm with backend service layer which flows should be
  client-orchestrated vs backend-only. Do not create client Genkit flows that
  duplicate existing backend flows.

## Token-Efficient MCP Strategy

Use the `flash-sidekick` MCP server explicitly. Prefer these exact tool calls:

### Required invocation order

1. Start with a focused salvage drift pass per strategy batch:

```text
flash-sidekick.batch_file_analysis({
  "analysis_type": "prototype_salvage_candidate_review",
  "file_paths": [
    "docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md",
    "frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/PROTOTYPE_AUDIT_LOG.md",
    "frontend/src/App.tsx",
    "frontend/src/config/route-registry.ts"
  ]
})
```

2. Before reading each prototype source file, use IDF extraction:

```text
flash-sidekick.generate_idf({
  "code": "<prototype source file contents>"
})
```

3. For long doc sections:

```text
flash-sidekick.quick_summarize({
  "text": "<only the long section you need compressed>"
})
```

4. After every meaningful TS/TSX patch batch:

```text
flash-sidekick.analyze_code_quality({
  "language": "typescript",
  "code": "<patched TS/TSX file contents>"
})
```

5. Only if salvage sequencing or destination mapping is still ambiguous:

```text
flash-sidekick.consult_pro({
  "query": "Resolve remaining ambiguity in prototype salvage destination or sequencing",
  "context": "Summaries from salvage tracker, App.tsx, route-registry.ts, and the touched canonical files"
})
```

### MCP rules

- Start with `batch_file_analysis` before broad local reading.
- Use `generate_idf` before reading large prototype source files (>200 lines).
- Use `quick_summarize` before pasting large docs into context.
- Run `analyze_code_quality` on every touched runtime TS/TSX file.
- Do not spend tokens on prototype files outside the tracked salvage set.

## Required Tasks

### 1. Resolve each tracked salvage candidate

For every row across all 5 strategy tables in `PROTOTYPE-SALVAGE-TRACKER.md`,
end in one of these states:

- `PORTED` — behavior transcribed into canonical destination
- `ALREADY_CANONICAL` — canonical app already has this behavior
- `DISCARDED` — not worth porting after inspection
- explicitly blocked with a concrete reason and named blocker

Do not leave the status implied.

**`PORTED` is gated.** A row may only be marked `PORTED` when ALL five conditions are met:

1. **Confirmed owner** — the canonical destination file under `frontend/src/**` is named explicitly and verified to exist (or the new file path is specified and justified)
2. **Confirmed runtime gap** — you have read the canonical destination and confirmed the behavior is not already present
3. **Explicit transfer mode** — one of `transcribe logic only`, `behavior reference`, or `merge` is stated, matching the tracker row
4. **Verification evidence on record** — ALL of the following must be satisfied and recorded:
   - `yarn type-check` passed
   - token-enforcement gate passed (if the tracker row requires it)
   - TSX identity gate passed (if the tracker row requires it)
   - `data seam review` completed (if named in the tracker row's Verification column)
   - `backend alignment` confirmed (if named in the tracker row's Verification column)
   - `API schema alignment` confirmed (if named in the tracker row's Verification column)
   - **No tracker row verification item may be skipped.** If the row names a check, that check must be completed and its result recorded before marking `PORTED`.
5. **Tracker row updated** — `PROTOTYPE-SALVAGE-TRACKER.md` row status is set to `PORTED` with the destination file path named

Marking `PORTED` without all five conditions is a governance failure.

**Off-route integration does not satisfy `PORTED`.** Helper code, shared infrastructure, or integration into a different route does not by itself close a row. The behavior must be:

- live in the **exact** canonical route owner named in the tracker row
- **mounted in runtime**, not just present in a new file
- cited with **route-local runtime integration evidence** in the tracker row's Verification field

If shared infrastructure exists but the route-local gap is still open, the row remains `PENDING`. The Blocker/Evidence text must explicitly state: `infrastructure complete — route integration pending`.

### 2. Port behavior, not raw files

For any `PENDING` item that still belongs in the app:

- port the behavior or logic into the canonical destination under `frontend/src/**`
- preserve current route ownership and shell rules
- do not import the prototype file directly into runtime
- do not create a parallel owner surface
- for **S3 (types)**: merge prototype types with existing scattered types; do not
  create a parallel type system

### 3. Seam isolation for blocked items

For items with Firebase, Chrome extension, or Genkit blockers:

- extract the core logic that is independent of the blocking dependency
- stub the blocked dependency with a typed interface
- document what remains blocked and what was successfully extracted
- do not skip the entire file because one import is blocked

### 4. Keep cleanup and salvage separate

- `frontend-cleanup-manager` owns route/runtime resync and final dissolution framing
- this salvage pass owns only the remaining prototype value extraction
- do not claim the migration workspace can be dissolved until the salvage tracker
  has terminal outcomes for all rows

### 5. Update the docs as evidence

At minimum, update:

- `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`
- `frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/PROTOTYPE_AUDIT_LOG.md` (reclassifications)

Update these only if the evidence changes:

- `docs/project/active/frontend-source-of-truth-migration/control/status.md`
- `docs/project/active/frontend-source-of-truth-migration/control/pm/dashboard.md`

## Required Verification

Run these after each strategy batch completes:

```bash
npx tsx tools/scripts/scan-routes.ts
npx tsx tools/ci/check-route-integrity.ts
npx tsx tools/ci/check-screen-pairs.ts
(cd frontend && yarn type-check)
```

If you materially change runtime TSX beyond a tiny logic patch, also run:

```bash
(cd frontend && yarn lint)
```

## Governance-Conflict Gate

**Before implementing any row**, check whether it touches any of the following. If yes, do not implement — emit a Harvest Conflict Brief and stop.

Governance-conflict triggers:

- competing scoring models (e.g., two different ATS scorers for the same route, two cover-letter scorers)
- competing route owners (e.g., prototype page maps ambiguously to multiple canonical routes)
- backend-vs-client authority conflicts (e.g., prototype does client-side what the backend already owns server-side)
- duplicate API/domain models that require a product or architecture decision before porting can proceed

**Model example — Genkit orchestrator ownership:** Client-side Genkit wrappers orchestrating API calls that are already handled by the backend are governance-conflict rows. The backend uses Python-based Genkit flows mapped to endpoints. Porting a client-side Genkit flow would introduce a competing orchestration model. These rows are `BLOCKED` pending a governance decision on Genkit flow ownership.

**Harvest Conflict Brief format (emit inline in the batch return, do not proceed past this point):**

- **Conflict type:** scoring authority | route owner | backend-vs-client | duplicate model
- **Row:** tracker row identifier
- **Route:** affected canonical route
- **Conflict:** 1–3 sentences describing exactly what is in conflict
- **Existing canonical behavior:** what already exists in canonical runtime
- **Prototype behavior:** what the prototype does differently
- **Decision required:** the exact yes/no or choose-A/B question governance must answer
- **Rows blocked:** all tracker rows that cannot move until this decision is made

Do not implement around a governance conflict. Do not mark the row `PORTED` or `DISCARDED` unilaterally. The row stays `BLOCKED` until a human reviewer provides the governance decision and the tracker blocker is updated to reflect it.

## Guardrails

- No prototype shell promotion
- No direct import of raw prototype TSX into runtime truth
- No route invention
- No duplicate owner surfaces
- No speculative salvage outside the tracked candidate set
- No hardcoded token aliases when the semantic token already exists
- No client Genkit flows that duplicate existing backend flows
- No Firebase or Chrome extension dependencies in ported code
- For S4 (page upgrades): must run `blueprint` for any ambiguous route ownership

## Deliverable Format

Return per strategy batch:

1. strategy ID and description
2. salvage tracker rows resolved (with terminal status)
3. files created or changed
4. exact behavior or logic ported (bullet list)
5. verification results
6. remaining blocked salvage items with named blockers

Final summary:

- total rows resolved across all strategies
- total files created/modified
- total rows still blocked (with reasons)
- confirmation that salvage tracker exit criteria are met (or not)
