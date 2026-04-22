# Final Frontend Cleanup Refinement Plan

> **Primary executor:** Claude Code
> **Primary worker:** Gemini via Antigravity
> **Required workflow:** `project-manager` -> `writing-plans` -> `subagent-driven-development` -> verification -> closeout review
> **Reasoning requirement:** use the Sequential Thinking MCP server before Batch 0, Batch B, Batch C dispositions, and Batch G closeout.

## Purpose

This is the master execution plan for the frontend cleanup program.

It consolidates:

- [`frontend-snapshot-methodology.md`](/Users/okgoogle13/Projects/careercopilot/docs/project/active/frontend-snapshot-methodology.md)
- [`2026-03-18-frontend-cleanup-closeout.md`](/Users/okgoogle13/Projects/careercopilot/docs/project/2026-03-18-frontend-cleanup-closeout.md)
- [`frontend-cleanup-agent-assignment-sheet.md`](/Users/okgoogle13/Projects/careercopilot/docs/project/active/frontend-cleanup-agent-assignment-sheet.md)

This file supersedes the older “optimization plan” framing. The work now needs an execution plan, not another planning note.

## Goal

Finish the frontend cleanup with a manifests-first closeout that is truthful about the current repo, explicit about route authority, safe about prototype retirement, and executable by Claude Code with Gemini doing the bulk analysis and mechanical work.

## Companion Docs

Read these together:

- [`frontend-cleanup-agent-assignment-sheet.md`](/Users/okgoogle13/Projects/careercopilot/docs/project/active/frontend-cleanup-agent-assignment-sheet.md)
- [`frontend-snapshot-methodology.md`](/Users/okgoogle13/Projects/careercopilot/docs/project/active/frontend-snapshot-methodology.md)
- [`2026-03-18-frontend-cleanup-closeout.md`](/Users/okgoogle13/Projects/careercopilot/docs/project/2026-03-18-frontend-cleanup-closeout.md)
- [`.claude/agents/frontend-cleanup-manager.md`](/Users/okgoogle13/Projects/careercopilot/.claude/agents/frontend-cleanup-manager.md)
- [`.claude/agents/prototype-harvest-manager.md`](/Users/okgoogle13/Projects/careercopilot/.claude/agents/prototype-harvest-manager.md)

## Authority Order

When sources disagree, resolve truth in this order:

1. [`frontend/src/App.tsx`](/Users/okgoogle13/Projects/careercopilot/frontend/src/App.tsx)
2. [`frontend/src/config/route-registry.ts`](/Users/okgoogle13/Projects/careercopilot/frontend/src/config/route-registry.ts)
3. `frontend/src/screens/**` plus [`docs/manifests/screens.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/screens.json)
4. [`docs/manifests/frontend-api-usage.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/frontend-api-usage.json) and [`docs/manifests/backend-endpoints.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/backend-endpoints.json)
5. [`frontend/component-inventory.json`](/Users/okgoogle13/Projects/careercopilot/frontend/component-inventory.json)
6. [`docs/manifests/routes.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/routes.json)
7. [`docs/manifests/orphans.json`](/Users/okgoogle13/Projects/careercopilot/docs/manifests/orphans.json)
8. [`docs/design/layered-component-blueprint.json`](/Users/okgoogle13/Projects/careercopilot/docs/design/layered-component-blueprint.json)

Prototype references are conditional only. They never override live runtime truth.

## Historical Governance Note

Treat any older “terminal governance closure” note as archived context, not active truth.

Only these facts are currently safe to carry forward:

- `docs/manifests/routes.json` currently reports 35 routes
- the old control-tree workflow is retired as an active authority source

Do not carry forward these claims without fresh proof:

- “100% terminal” migration state
- “100% resolved” prototype cleanup
- “0 unresolved governance drift”

Current repo evidence still shows:

- a live `/auth` warning in `check-route-integrity.ts`
- stale `docs/manifests/prototype-features-cleanup-map.*` artifacts
- many references to the retired `frontend-source-of-truth-migration/control/*` tree in docs and skills

## Orchestration Model

### Claude Code owns

- batch sequencing
- final plan framing
- important route and shell decisions
- blueprint or design orchestration work
- executive design critique
- final closeout disposition

### Gemini via Antigravity owns

- bulk scanning
- manifest refresh
- component inventory and layered blueprint refresh
- `ts-morph` analysis
- repetitive cleanup passes
- route-by-route evidence gathering
- helper script adaptation after Claude approves the target behavior

### Agent routing

- default reviewer for cleanup work:
  [`frontend-cleanup-manager.md`](/Users/okgoogle13/Projects/careercopilot/.claude/agents/frontend-cleanup-manager.md)
- prototype-derived lane only:
  [`prototype-harvest-manager.md`](/Users/okgoogle13/Projects/careercopilot/.claude/agents/prototype-harvest-manager.md)

## Sequential Thinking Checkpoints

Claude Code must use Sequential Thinking MCP explicitly at these points:

1. **Batch 0**
   - confirm scope, dependencies, and the decision lock
   - decide whether this closeout stabilizes pages-first runtime or attempts full features-first completion
2. **Batch B**
   - classify route families as canonical, redirect-only, support-only, or deprecated
   - resolve any disagreement between `App.tsx` and `route-registry.ts`
3. **Batch C**
   - approve final decision states for each route-level gap-fill output
   - reject any planner output that tries to become a truth source
4. **Batch G**
   - decide whether the repo has achieved terminal closeout or only another refreshed snapshot

## Skills

### Required core skills

- `/Users/okgoogle13/.codex/skills/project-manager/SKILL.md`
- `/Users/okgoogle13/.codex/superpowers/skills/writing-plans/SKILL.md`
- `/Users/okgoogle13/.codex/skills/subagent-driven-development/SKILL.md`
- `/Users/okgoogle13/.codex/superpowers/skills/executing-plans/SKILL.md` as fallback only

### Claude-side optional support skills

- `blueprint` if available in Claude Code
- `design-orchestration` if available in Claude Code
- [`frontend-backend-mapper`](/Users/okgoogle13/Projects/careercopilot/.claude/skills/frontend-backend-mapper/SKILL.md)
- [`migration-audit`](/Users/okgoogle13/Projects/careercopilot/.claude/skills/migration-audit/SKILL.md)
- [`building-components`](/Users/okgoogle13/Projects/careercopilot/.claude/skills/building-components/SKILL.md) when route cleanup touches shared component APIs
- [`react-router-framework-mode`](/Users/okgoogle13/Projects/careercopilot/.claude/skills/react-router-framework-mode/SKILL.md) when route modernization or form/routing cleanup genuinely needs it

### Gemini / Antigravity MCP stack

- `flash-sidekick`
  - `batch_file_analysis`
  - `quick_summarize`
  - `analyze_code_quality`
  - `consult_pro`
- `design-system-sidekick`
  - use only for visual or token compliance checks where visual proof matters

## Scripts And Infrastructure

### Manifest and evidence scripts

- `tools/scripts/scan-routes.ts`
- `tools/scripts/scan-screens.ts`
- `tools/scripts/scan-api-usage.ts`
- `tools/scripts/scan-endpoints.py`
- `tools/scripts/detect-orphans.ts`

### Inventory and blueprint scripts

- `frontend/scripts/component-inventory.ts`
- `frontend/scripts/analyze-react-components.ts`
- `frontend/scripts/inventory-postprocess.ts`
- `frontend/scripts/generate-layered-blueprint.ts`

### `ts-morph` lane

Use `ts-morph` when work involves:

- ownership ambiguity
- symbol references
- dead-code claims
- safe retirement or quarantine
- duplicate primitive ownership

Primary entrypoints:

- `frontend/scripts/component-inventory.ts`
- `frontend/scripts/analyze-react-components.ts`
- `frontend/scripts/execute-deprecations.ts`
- `frontend/scripts/safe-migrate-component.ts`
- `scripts/refactor.ts`
- `tools/scripts/refactor.ts`

Rule:

- Gemini may run `ts-morph` and prepare recommendations.
- Claude Code must approve any deletion, quarantine, or ownership change that depends on `ts-morph` evidence.
- If `ts-morph` is ambiguous, fall back to `rg` plus runtime proof and mark the result lower-confidence.

### Verification scripts

- `tools/ci/check-route-integrity.ts`
- `tools/ci/check-screen-pairs.ts`
- `cd frontend && yarn type-check`

### Planning helper to adapt

- `scripts/derive-gap-fill-plan.py`

This script is still wired to retired control-tree inputs. Gemini can adapt it only after Claude approves the manifests-based target behavior.

## Batch Plan

### Batch 0: Frame The Work

**Lead:** Claude Code
**Support:** none
**Required reasoning:** Sequential Thinking MCP

**Steps**
1. Restate the objective and current blockers.
2. Confirm the authority stack.
3. Decide whether the branch goal is:
   - stabilize pages-first runtime and document features-first as future state
   - or finish features-first runtime now
4. Name owners for the active batch, spec review, and code-quality review.
5. Write the active execution plan with `writing-plans`.

**Exit criteria**
- active batch is explicit
- dependencies are explicit
- no unresolved ambiguity about current target state

### Batch A: Refresh Evidence

**Lead:** Gemini / Antigravity
**Reviewer:** `frontend-cleanup-manager`

**Steps**
1. Run the manifest refresh pipeline.
2. Run the component inventory and layered blueprint pipeline.
3. Record counts for routes, screens, orphaned features, orphaned pages, and inventory totals.
4. Surface drift summary to Claude Code.

**Commands**
```bash
yarn install
npx tsx tools/scripts/scan-routes.ts
npx tsx tools/scripts/scan-screens.ts
npx tsx tools/scripts/scan-api-usage.ts
python3 tools/scripts/scan-endpoints.py
npx tsx tools/scripts/detect-orphans.ts

cd frontend
npx tsx scripts/component-inventory.ts
npx tsx scripts/inventory-postprocess.ts
npx tsx scripts/component-inventory.ts --raw
npx tsx scripts/generate-layered-blueprint.ts
cd ..
```

**Exit criteria**
- `docs/manifests/*` refreshed
- `frontend/component-inventory.json` refreshed
- `docs/design/layered-component-blueprint.json` refreshed
- Claude approves the evidence baseline
- any inherited “terminal governance closure” claim is either re-proven or discarded

### Batch B: Reconcile Route Authority

**Lead:** Claude Code
**Support:** Gemini for drift reports and `ts-morph` evidence
**Reviewer:** `frontend-cleanup-manager`
**Required reasoning:** Sequential Thinking MCP

**Steps**
1. Enumerate all reachable paths from `App.tsx`.
2. Compare them with `route-registry.ts`.
3. Classify each path as:
   - canonical
   - redirect-only
   - support-only
   - deprecated
4. Decide whether runtime remains pages-first for this closeout.
5. Update route authority code and derived validation logic only as needed.

**Important files**
- `frontend/src/App.tsx`
- `frontend/src/config/route-registry.ts`
- `tools/scripts/scan-routes.ts`
- `tools/ci/check-route-integrity.ts`

**Exit criteria**
- route story is coherent
- `routes.json` can be regenerated from an approved truth model
- no optimistic features-first language remains if runtime is still pages-first

### Batch C: Adapt And Run Route-Level Gap-Fill Planning

**Lead:** Gemini / Antigravity
**Decision owner:** Claude Code
**Reviewer:** `frontend-cleanup-manager`
**Required reasoning:** Sequential Thinking MCP for final route dispositions

**Steps**
1. Adapt `scripts/derive-gap-fill-plan.py` to current manifests-based inputs.
2. Preserve outputs for:
   - selected runtime base
   - reuse mode
   - token drift
   - blocking gaps
   - source-of-truth chain
3. Run the adapted planner for the highest-drift routes:
   - `/auth`
   - `/dashboard-overview`
   - `/kanban`
   - `/ingestion`
   - `/feed`
   - `/studio`
   - `/editor`
   - any route family flagged by `orphans.json` or runtime-vs-registry drift
4. Emit per-route JSON outputs under `tmp/migration/`.
5. Claude approves final decision states:
   - `terminal`
   - `redirect_only`
   - `needs_runtime_cleanup`
   - `needs_manifest_cleanup`
   - `blocked`

**Exit criteria**
- route-level drift has explicit dispositions
- planner is support logic, not a truth source

### Batch D: Resolve Holdouts And Shell Drift

**Lead:** Claude Code
**Support:** Gemini for test prep and low-risk edits
**Reviewer:** `frontend-cleanup-manager`

**Targets**
- `/welcome`
- `/documents`
- `/asset-library`

**Steps**
1. Decide whether each holdout is canonical, redirect-only, support-only, or blocked.
2. If a holdout is promoted, write targeted tests first.
3. If a holdout stays support-only, ensure the manifests and docs say so explicitly.
4. Keep shell ownership explicit and avoid accidental promotion of support surfaces.

**Exit criteria**
- shell/layout story is explicit
- holdouts are no longer ambiguous

### Batch E: Remove Stale Prototype And Reference Evidence

**Lead:** Gemini / Antigravity
**Reviewers**
- `frontend-cleanup-manager`
- `prototype-harvest-manager` only when the surface is genuinely prototype-derived

**Steps**
1. Check stale prototype cleanup manifests and route mappings.
2. If a stale surface is claimed unused or retired, require `ts-morph` plus runtime proof.
3. Retire or regenerate selectively:
   - `docs/manifests/prototype-features-cleanup-map.json`
   - `docs/manifests/prototype-features-cleanup-map.csv`
4. Fix stale `/kr/*` or deleted prototype references in:
   - `frontend/src/screens/*/mapping.json`
   - `docs/manifests/orphans.json` if needed after rerun

**Conditional prototype references**
Use only if present or restored:

- `docs/project/active/frontend-source-of-truth-migration/prototype-integration.md`
- `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`
- `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-PATTERN-CATALOG.md`
- `frontend/QUARANTINE - HARVESTED PROTOTYPE FEATURES/PROTOTYPE_AUDIT_LOG.md`

**Exit criteria**
- no stale prototype evidence remains in the active closeout layer
- prototype-derived surfaces are clearly support-only, future-port, or retired

### Batch F: Clean Shared UI Boundaries And Decontaminate Live Surfaces

**Lead:** Gemini / Antigravity
**Decision owner:** Claude Code when semantics or design meaning changes
**Reviewer:** `frontend-cleanup-manager`

**Steps**
1. Inventory overlapping primitives in:
   - `frontend/src/components/ui/**`
   - `frontend/packages/ui/**`
2. Use `ts-morph` where barrel exports or wrapper layers obscure ownership.
3. Normalize remaining live KR alias usage and semantic type/shape-token spellings in canonical surfaces.
4. Purge literal Tailwind palette classes from live user-facing surfaces and map them to approved semantic KR tokens or component variants.
5. Remove demo identities and placeholder profile/document data from canonical user-facing flows and supporting fixtures where appropriate.
6. Add or repair shared test helpers only if failing suites are blocked by repeated provider/render boilerplate.
7. Assign one owner per primitive and update imports only after route authority is stable.

**Exit criteria**
- duplicate primitive ownership is reduced
- route cleanup is not fighting shared UI cleanup
- no critical literal palette or demo-data contamination remains in canonical surfaces

### Batch G: Verify And Close Out

**Lead:** Claude Code
**Support:** Gemini for evidence collation
**Reviewer:** `frontend-cleanup-manager`
**Required reasoning:** Sequential Thinking MCP

**Steps**
1. Rerun the full snapshot routine.
2. Rerun verification.
3. Explicitly verify `/auth`, `/login`, and `/register` mode persistence for both direct entry and landing-page entry.
4. Confirm no unresolved literal Tailwind palette classes or demo identity strings remain in canonical user-facing surfaces.
5. Separate warnings from blockers.
6. Decide whether the branch is:
   - terminal closeout
   - or another refreshed snapshot
7. Publish the final manifests-based closeout note.

**Commands**
```bash
yarn install
npx tsx tools/scripts/scan-routes.ts
npx tsx tools/scripts/scan-screens.ts
npx tsx tools/scripts/scan-api-usage.ts
python3 tools/scripts/scan-endpoints.py
npx tsx tools/scripts/detect-orphans.ts

cd frontend
npx tsx scripts/component-inventory.ts
npx tsx scripts/inventory-postprocess.ts
npx tsx scripts/component-inventory.ts --raw
npx tsx scripts/generate-layered-blueprint.ts
yarn type-check
cd ..

npx tsx tools/ci/check-route-integrity.ts
npx tsx tools/ci/check-screen-pairs.ts
rg "prototype-features|QUARANTINE" frontend/src docs/manifests
```

**Exit criteria**
- evidence refresh is current
- route authority decisions are explicit
- route-level drift has dispositions
- stale prototype evidence is gone or formally retired
- verification is green or warnings are explicitly accepted by Claude
- no historical closure note overstates the current repo state

## Review Order Per Batch

1. implementer executes the batch
2. spec review checks that the batch matched the plan
3. code-quality review checks maintainability and safety
4. Claude Code decides whether the batch is complete

Do not mark a batch done from narrative progress alone.

## Stop Conditions

Stop and re-plan if:

- `App.tsx` and `route-registry.ts` imply incompatible route authority
- Gemini proposes shell promotion, prototype promotion, or canonical route changes without Claude approval
- `derive-gap-fill-plan.py` adaptation requires new decision semantics instead of input rewiring
- `ts-morph` evidence and runtime evidence disagree on reachability
- refreshed manifests contradict the claimed state of the app

## Completion Rule

The frontend cleanup is complete only when:

- the active evidence layer is current
- route authority decisions are explicit
- route-level gap-fill outputs are complete where needed
- holdouts and prototype-derived artifacts are no longer ambiguous
- verification is green
- Claude Code signs off on closeout

Anything less is another checkpoint, not terminal closeout.
