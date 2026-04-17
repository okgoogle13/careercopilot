# Phased Gate Plan: Figma-to-Code Sync

## Purpose

This plan defines the lowest-rework sequence for syncing Figma page designs into the CareerCopilot frontend using Claude Code with Sonnet 4.6 (thinking), while preserving richer repo behavior and keeping manifest truth coherent.

It consolidates the strongest current guidance from:

- `docs/project/active/frontend-snapshot-methodology.md`
- `docs/project/active/frontend-cleanup-agent-assignment-sheet.md`
- `docs/project/active/refinement_plan.md`
- `docs/project/active/claude-kickoff-prompt.md`
- `docs/project/active/Phase-0-Analysis-Summary.md`
- `docs/project/active/PR126-high-fidelity-methodology.md`
- `docs/project/active/PR126-frontend-consolidation.md`

The plan assumes:

- design orchestration is mandatory before implementation
- sequential thinking MCP is used when ownership, dependencies, or rewrite risk are ambiguous
- sprint coordination is used to turn approved route/page scope into milestones and readiness gates
- writing plans is used only after design and route targeting are approved, to produce executable implementation steps
- flash-sidekick is used to reduce token waste during repo analysis
- Figma is the source of visual intent, not behavioral authority

## Consolidation Priorities

This plan intentionally preserves the strongest content from the active docs and rejects the unsafe parts.

Preserved:

- snapshot-first governance and manifests-based evidence refresh
- runtime/design/capability authority ordering
- explicit batch ownership and stop conditions
- route-level gap-fill planning before claiming closeout
- KR compliance gates and token-drift awareness

Rejected or weakened:

- any optimistic assumption that runtime is already features-first
- blanket deletion steps such as deleting `frontend/src/pages/` wholesale
- any instruction that treats derived manifests as stronger than runtime truth
- any planner output becoming a truth source

## Execution Profile

- Primary model: `Claude Sonnet 4.6 (thinking)`
- Entry skills:
  - `design-orchestration`
  - `brainstorming`
- Analysis MCP:
  - `sequential-thinking`
  - `flash-sidekick`
- Design MCP:
  - `figma-mcp`
  - `design-system-sidekick`
  - `vision-scorer-mcp`
- External research:
  - `web_research_synthesis` when available for workflow sanity checks
  - fallback to repo governance docs when unavailable

## Skill Responsibilities

These skills have different jobs and should not be collapsed into one stage.

### `sequential-thinking`

Use for analysis under uncertainty.

Use it when:

- route ownership is ambiguous
- redirect compatibility paths affect target selection
- manifest drift is hard to classify
- a rewrite appears necessary
- a shared primitive change may cascade across several pages

Produces:

- dependency map
- blocker analysis
- decision points
- recommended next action

### `sprint-coordinator`

Use for batch framing and release cadence, not implementation detail.

Use it when:

- a multi-page Figma sync batch needs milestones
- you need named owners, acceptance criteria, or readiness scoring
- you need to decide which pages can run in parallel and which are blocked

Produces:

- sprint frame
- milestone map
- dependency map
- readiness signals
- blockers and next checkpoints

### `writing-plans`

Use only after the design and route targeting are approved.

Use it when:

- the page or batch scope is understood
- the route owner and visual target are settled
- shared primitive dependencies are known
- implementation should be handed to another engineer or agent without design ambiguity

Produces:

- small ordered tasks
- exact file targets
- verification commands
- acceptance signals

### Handoff Rule

The required sequence is:

1. `design-orchestration`
2. `brainstorming`
3. `sequential-thinking` if ambiguity remains
4. `sprint-coordinator` for batch framing
5. `writing-plans` for executable implementation steps
6. implementation
7. validation and closeout

Do not use `writing-plans` to resolve uncertainty. Resolve uncertainty first with `brainstorming` and `sequential-thinking`.

## Orchestration Model

### Claude Code owns

- authority resolution
- route and shell decisions
- batch sequencing
- final plan framing
- final closeout disposition

### Gemini / Antigravity owns

- bulk scanning
- manifest refresh
- component inventory and layered blueprint refresh
- repetitive cleanup passes
- helper-script adaptation after target behavior is approved

### Review order per batch

1. implementer executes the batch
2. spec review checks that the batch matched the plan
3. code-quality review checks maintainability and safety
4. Claude Code decides whether the batch is complete

## Snapshot Methodology Alignment

This plan follows the manifests-based governance model in `docs/project/active/frontend-snapshot-methodology.md`.

Implications:

- the repo is not yet in a features-first terminal state
- `App.tsx` remains the runtime mount truth
- `route-registry.ts` is route intent, not guaranteed runtime truth
- `routes.json` and `orphans.json` are generated drift evidence, not primary authority
- `component-inventory.json` and `layered-component-blueprint.json` are ownership signals, not standalone route truth
- page-level Figma sync should start only after fresh snapshot evidence exists or has been consciously accepted as stale

Do not claim feature-owned runtime closeout until `App.tsx`, `route-registry.ts`, and `docs/manifests/routes.json` all tell the same story.

## Authority Stack

Use this order whenever sources disagree:

1. `frontend/src/App.tsx`
2. `frontend/src/config/route-registry.ts`
3. `frontend/src/screens/**` plus `docs/manifests/screens.json`
4. `docs/manifests/frontend-api-usage.json` and `docs/manifests/backend-endpoints.json`
5. `frontend/component-inventory.json`
6. `docs/manifests/routes.json`, `docs/manifests/orphans.json`, and `docs/design/layered-component-blueprint.json`

Interpretation:

- `App.tsx` is the actual runtime mountpoint
- `route-registry.ts` is the intended route model, but may drift from runtime
- `screens/**` and `screens.json` are the design-pair authority for page structure and visual pairing
- API usage and backend endpoints establish whether a route family is still capability-backed
- `component-inventory.json` is useful for ownership, reuse, and testing signals
- `routes.json`, `orphans.json`, and `layered-component-blueprint.json` are derived drift evidence only
- `prototype-features-cleanup-map.json` remains exclusion and triage support, not route authority

## Corrected Routing Model

For page-level Figma sync, target:

- route truth from `App.tsx` first
- route intent from `route-registry.ts`
- route-owner wrapper from the currently mounted `frontend/src/pages/*` surface when runtime is still pages-first
- visual screen target from `frontend/src/screens/*`, resolved through `docs/manifests/screens.json` and `docs/design/screen-map.json`
- `routes.json` as confirmation of what the live router currently exposes, not as intended-state truth

Do not default to `features/*` as route owners.

Examples:

| Route | Page Owner | Visual Target | Screen ID |
| --- | --- | --- | --- |
| `/` | `frontend/src/pages/LandingPage.tsx` | `frontend/src/screens/01_landing/HeroLanding.tsx` | `01_landing` |
| `/dashboard` | `frontend/src/pages/DashboardPage.tsx` | `frontend/src/screens/11_dashboard/DashboardOverview.tsx` | `11_dashboard` |
| `/lookout` | `frontend/src/pages/LookoutPage.tsx` | `frontend/src/screens/06_lookout/LookoutDiscovery.tsx` | `06_lookout` |
| `/applications` | `frontend/src/pages/ApplicationsPage.tsx` | `frontend/src/screens/07_kanban/KanbanTracker.tsx` | `07_kanban` |
| `/analysis` | `frontend/src/pages/AnalysisPage.tsx` | `frontend/src/screens/05_analysis/AnalysisWorkbench.tsx` | `05_analysis` |
| `/docs` | `frontend/src/pages/DocsPage.tsx` | `frontend/src/screens/08_workbench/DocumentWorkbench.tsx` | `08_workbench` |
| `/apply` | `frontend/src/pages/ApplyPage.tsx` | `frontend/src/screens/09_finalization/ApplicationFinalization.tsx` | `09_finalization` |
| `/generation` | `frontend/src/pages/GenerationPage.tsx` | `frontend/src/screens/12_generation/GenerationWorkbench.tsx` | `12_generation` |
| `/settings` | `frontend/src/pages/SettingsPage.tsx` | `frontend/src/screens/10_settings/SettingsControl.tsx` | `10_settings` |

## Preservation Rules

- Never blindly replace existing repo implementation with Figma-derived output.
- Figma is authoritative for layout, spacing, typography, color, iconography, and visual hierarchy.
- The repo is authoritative for state, async flows, validation, accessibility, keyboard/focus behavior, analytics, permissions, feature flags, composition, performance, and test assumptions.
- If the repo implementation is richer than the Figma node, preserve that sophistication and adapt visuals onto it.
- Prefer minimal diffs over rewrites.

Replacement Gate:

1. What does the current implementation do that Figma does not show?
2. Which parts of the change are visual only?
3. Which parts are behavioral or infrastructural and must be preserved?
4. Can this be completed as a minimal diff instead of a rewrite?

If non-visual behavior would be lost, do not replace wholesale.

## Cleanup Timing

Cleanup belongs in three places:

### 1. Pre-Batch Cleanup

Do once before repeated page sync starts. This corresponds to snapshot Batch A and the ownership triage needed before page work.

Scope:

- route ownership drift
- stale manifest interpretation
- obviously wrong page wrappers
- duplicate or misleading target-selection rules

Files:

- `frontend/src/App.tsx`
- `frontend/src/config/route-registry.ts`
- `docs/manifests/frontend-api-usage.json`
- `docs/manifests/backend-endpoints.json`
- `docs/manifests/routes.json`
- `docs/manifests/orphans.json`

### 2. Shared Cleanup

Do after scope/order planning, before dependent pages.

Scope:

- shared primitives
- repeated wrappers and shells
- existing `*.figma.tsx` mapping files
- common token and layout patterns

Files:

- `frontend/src/components/ui/Strike.figma.tsx`
- `frontend/src/components/ui/Placard.figma.tsx`
- `frontend/component-inventory.json`
- shared primitives in `docs/design/layered-component-blueprint.json`

### 3. Per-Page Local Cleanup

Do during page implementation only when needed for that page.

Scope:

- dead local styles
- wrong token usage
- small structural cleanup needed to preserve behavior
- local wrapper/screen mismatch

Files:

- one `pages/*` route owner
- one paired `screens/*` visual target

### 4. Batch Cleanup

Do after every 2-3 pages or at the end of a route family.

Scope:

- reconcile repeated fixes
- remove temporary compatibility code
- refresh manifests only if route truth changed or snapshot evidence is stale
- re-check orphan and drift reports

Do not regenerate manifests on every page task.

### 5. Prototype Cleanup

Keep separate unless a route is explicitly being promoted from prototype.

## Integrity And Compliance Layer

In addition to runtime, design, and capability truth, keep an explicit integrity layer:

- hidden slop detection for hardcoded hex, magic spacing, and literal palette classes
- token drift checks before route cleanup if the token source of truth is in question
- duplicate primitive ownership checks
- demo identity and placeholder content sweeps on canonical user-facing surfaces
- visual compliance sign-off for modified high-visibility surfaces

Preferred proof tools:

- `flash-sidekick.batch_file_analysis` for hidden slop, palette, and demo-data sweeps
- `flash-sidekick.generate_idf` for ownership or symbol ambiguity
- `design-system-sidekick.validate_asset_compliance` when visual proof matters

Target sign-off threshold for modified canonical views:

- `design-system-sidekick` compliance score `> 0.9`

## Token-Efficient MCP Routing

Use flash-sidekick for repo-side analysis. Keep Figma MCP focused on design extraction.

| Situation | Preferred tool | Why |
| --- | --- | --- |
| Token export or hidden-slop audit across many files | `batch_file_analysis` | Best for large token and style sweeps |
| One large file needs orientation | `quick_summarize` | Fast summary without loading whole file |
| One large component needs structure and symbol extraction | `generate_idf` | Better anatomy before editing |
| 3 or more files need comparison | `batch_file_analysis` | Cheaper and more consistent than repeated reads |
| Repo implementation is richer than Figma | `consult_pro` | Better adaptation reasoning before edits |
| Minimal diff is not practical | `suggest_refactoring` | Finds safer refactor seams |
| Small obvious local change | local read/edit | Avoid delegation overhead |

Use sequential-thinking MCP when:

- route ownership is ambiguous
- redirect compatibility paths affect target selection
- a rewrite appears necessary
- a shared primitive change may cascade across several pages
- manifest drift is hard to classify

## Phased Workflow

### Phase T0: Token Source Preflight

Run only if token source of truth is uncertain or a fresh external token export is being considered.

Goal:

- determine whether route cleanup should proceed against the current repo tokens or pause for token clarification

Inputs:

- `frontend/src/design/tokens/tokens.json`
- `scripts/build-m3-tokens.py`
- optional external export such as `/Users/okgoogle13/Downloads/dtcg-tokens (1).zip`

Outputs:

- `token_preflight_state`
- `token_drift_summary`
- `sync_now_or_defer`

Allowed dispositions:

- `stable_no_sync`
- `sync_now`
- `defer_cleanup_until_clarified`

Rules:

- treat any downloaded token zip as external input, not repo authority
- do not start route cleanup against a drifting token source of truth

### Phase 0: Snapshot Batch A Manifest Refresh

Goal:

- regenerate the runtime, design, capability, and drift evidence layer before any Figma sync work

Outputs:

- `docs/manifests/routes.json`
- `docs/manifests/screens.json`
- `docs/manifests/frontend-api-usage.json`
- `docs/manifests/backend-endpoints.json`
- `docs/manifests/orphans.json`
- `snapshot_refresh_notes`

Rules:

- this is the preferred starting point when manifests may be stale
- do not treat the refreshed manifests as primary truth if they still disagree with runtime or route intent

### Phase 0.5: Snapshot Batch B Component and Layered Snapshot Refresh

Goal:

- refresh component-level ownership, reuse, and migration evidence before planning page work

Outputs:

- `frontend/component-inventory.json`
- `frontend/reports/summary.json`
- `frontend/reports/migration-breakdown.json`
- `docs/design/layered-component-blueprint.json`
- `component_snapshot_notes`

### Phase 1: Snapshot Batch C Route-Level Gap-Fill Planning

Goal:

- identify ambiguous or drifted route families and decide what is safe to sync now versus what needs targeted reconciliation

Outputs:

- `canonical_route_owner_table`
- `redirect_only_paths`
- `support_only_routes`
- `manifest_drift_summary`
- `gap_fill_candidates`
- `blocking_issues`
- `next_action`

Rules:

- use `scripts/derive-gap-fill-plan.py` as a route-level planner only
- do not treat `derive-gap-fill-plan.py` as a truth source until it is adapted to the manifests-based authority set

Recommended target set:

- routes flagged by `orphans.json`
- routes whose runtime mount and registry intent disagree
- redirect-heavy compatibility paths such as `/auth`, `/dashboard-overview`, `/kanban`, `/ingestion`, `/feed`, `/studio`, and `/editor`
- any route family with token-dirty or ownership-ambiguous runtime owners

### Phase 1.25: Scope and Order

Goal:

- choose the lowest-rework page order
- identify shared dependencies first
- avoid implementing a page before its shared primitives or wrappers are stable

Outputs:

- `recommended_page_order`
- `shared_dependencies_first`
- `per_page_dependency_map`
- `pages_safe_to_start_now`
- `pages_blocked_on_shared_work`

### Phase 1.5: Sprint Coordination

Goal:

- turn approved scope and ordering into milestones, readiness gates, and explicit blockers

Use:

- `sprint-coordinator`

Outputs:

- `sprint_frame`
- `milestone_map`
- `batch_owners`
- `parallelizable_routes`
- `blocked_routes`
- `readiness_score`

### Phase 2: Shared Baseline

Goal:

- stabilize shared primitives, wrappers, and existing Figma mapping files before page sync

Focus:

- `Strike`
- `Placard`
- `Scaffold`
- repeated headers or shells
- existing `*.figma.tsx` files

Outputs:

- `primitive_sync_targets`
- `shared_wrapper_targets`
- `update_existing_mappings`
- `do_not_create_duplicates`

### Phase 3: Optional Shared Implementation

Do only if Phase 2 identified shared work that will reduce rework.

Outputs:

- `shared_targets_updated`
- `pages_impacted`
- `validation_needed`
- `files_changed`

### Phase 3.5: Writing Plans

Goal:

- convert approved batch or page scope into executable implementation plans before touching code

Use:

- `writing-plans`

Requirements:

- design and route targeting already approved
- shared dependencies already identified
- no unresolved route-owner ambiguity

Outputs:

- `implementation_plan`
- `task_checklist`
- `verification_commands`
- `acceptance_signals`

### Phase 4: Per-Page Plan

For one route at a time:

- resolve route owner from `frontend/src/App.tsx` and `frontend/src/config/route-registry.ts`
- confirm current live path and wrapper behavior against `docs/manifests/routes.json`
- resolve page owner from `frontend/src/pages/*`
- resolve visual target from `docs/manifests/screens.json` and `docs/design/screen-map.json`
- use Figma MCP `get_design_context` first
- use `get_metadata` once if matching wireframe exists
- use `get_screenshot` once for implementation parity
- use `get_variable_defs` for styles/tokens
- inspect current repo implementation
- apply Replacement Gate

Outputs:

- `route_owner`
- `page_owner`
- `visual_target`
- `preserved_behavior_risks`
- `files_likely_to_change`
- `mcp_plan`
- `validation_plan`

### Phase 5: Per-Page Implementation

Implement one page only.

Hard constraints:

- do not change route ownership
- do not simplify richer repo behavior
- do not bypass page owner -> visual target structure
- do not invent placeholder assets if Figma already provides them
- keep changes minimal and route-local

Outputs:

- `preserved_behavior`
- `visual_changes`
- `deviations_from_figma`
- `files_changed`
- `validation_results`
- `follow_up_needed`

### Phase 6: Snapshot Batch D Verification and Closeout Evidence

After every 2-3 pages or after a route family:

- run route and screen verification scripts
- run hidden-slop and literal palette checks where the batch touched live surfaces
- verify route owner and visual target consistency
- verify no page regressed richer repo behavior
- verify parity outputs are complete
- verify modified canonical views still meet the KR compliance target
- decide whether manifest regeneration is justified
- rerun Batches A and B if route ownership or runtime surfaces changed
- regenerate manifests only if route truth is settled

Outputs:

- `batch_status`
- `pages_validated`
- `unresolved_drift`
- `regenerate_manifests`
- `manifest_refresh_results`
- `final_blockers`
- `next_action`

## Iterative Prompt Set

### Prompt 1: Manifest Reconciliation

```md
Use `design-orchestration` and `brainstorming` first.

Run the active-doc kickoff sequence for the CareerCopilot frontend. Optimize for Claude Sonnet 4.6 thinking. If routing ownership or manifest drift is ambiguous, initialize sequential-thinking MCP immediately.

Read and align:
- docs/project/active/frontend-cleanup-agent-assignment-sheet.md
- docs/project/active/frontend-snapshot-methodology.md
- docs/project/active/refinement_plan.md
- docs/project/active/PR126-high-fidelity-methodology.md

If token source of truth is unclear, run a token preflight first and emit:
- token_preflight_state
- token_drift_summary
- sync_now_or_defer

Authority order:
1. frontend/src/App.tsx
2. frontend/src/config/route-registry.ts
3. frontend/src/screens/** plus docs/manifests/screens.json
4. docs/manifests/frontend-api-usage.json and docs/manifests/backend-endpoints.json
5. frontend/component-inventory.json
6. docs/manifests/routes.json, docs/manifests/orphans.json, and docs/design/layered-component-blueprint.json

Use flash-sidekick:
- quick_summarize
- generate_idf
- batch_file_analysis
- consult_pro

Refresh or inspect:
- routes.json
- screens.json
- frontend-api-usage.json
- backend-endpoints.json
- orphans.json
- component-inventory.json
- layered-component-blueprint.json

Do not edit product code yet.

Output only:
- token_preflight_state
- canonical_route_owner_table
- redirect_only_paths
- support_only_routes
- manifest_drift_summary
- gap_fill_candidates
- blocking_issues
- next_action
```

### Prompt 2: Scope and Order

```md
Use the `canonical_route_owner_table` and `gap_fill_candidates` from the prior step.

Optimize for Sonnet 4.6 thinking. Initialize sequential-thinking MCP to determine the lowest-rework execution order for page-by-page Figma sync.

Output only:
- recommended_page_order
- shared_dependencies_first
- per_page_dependency_map
- pages_safe_to_start_now
- pages_blocked_on_shared_work
- rationale
```

### Prompt 3: Shared Baseline

```md
Use `design-orchestration` and `brainstorming` for a design-only pass.

Optimize for Sonnet 4.6 thinking. Before page implementation, identify which shared primitives and wrappers must be stabilized first to minimize rework.

Inputs:
- docs/design/layered-component-blueprint.json
- docs/manifests/screens.json
- existing *.figma.tsx mappings
- recommended_page_order

Output only:
- primitive_sync_targets
- shared_wrapper_targets
- update_existing_mappings
- do_not_create_duplicates
- recommended_first_edits
```

### Prompt 3A: Sprint Coordination

```md
Use `sprint-coordinator`.

Optimize for Sonnet 4.6 thinking. Convert the approved route order and shared dependency work into a sprint-style execution frame for the current Figma sync batch.

Inputs:
- recommended_page_order
- shared_dependencies_first
- per_page_dependency_map
- blocking_issues

Required output:
- sprint_frame
- milestone_map
- batch_owners
- parallelizable_routes
- blocked_routes
- readiness_score
- next_checkpoint
```

### Prompt 3B: Writing Plans

```md
Use `writing-plans`.

Optimize for Sonnet 4.6 thinking. Convert the approved shared baseline and page scope into an executable implementation plan. Do not resolve open design questions here; assume those were already resolved by brainstorming and sequential-thinking.

Inputs:
- sprint_frame
- milestone_map
- primitive_sync_targets
- shared_wrapper_targets
- recommended_page_order

Requirements:
- write small ordered tasks
- use exact file paths
- include verification commands
- include acceptance signals
- do not write code

Output only:
- implementation_plan
- task_checklist
- verification_commands
- acceptance_signals
```

### Prompt 4: Per-Page Plan

```md
Use the `figma-mcp-design-sync` skill.

Create a validated plan for one page only. Optimize for Sonnet 4.6 thinking. If ownership, behavior preservation, or file targeting is ambiguous, initialize sequential-thinking MCP.

Inputs:
- Figma URL: {{FIGMA_URL}}
- Route: {{ROUTE}}
- Screen ID: {{SCREEN_ID}}
- Notes: {{NOTES}}

Required workflow:
- resolve route owner from frontend/src/App.tsx and frontend/src/config/route-registry.ts
- confirm live runtime evidence against docs/manifests/routes.json
- resolve page owner from frontend/src/pages/*
- resolve visual target from docs/manifests/screens.json and docs/design/screen-map.json
- use Figma MCP get_design_context first
- use get_metadata once if a matching wireframe exists
- use get_screenshot once for implementation parity
- use get_variable_defs for styles/tokens
- inspect current repo implementation
- apply the Replacement Gate
- preserve richer repo behavior
- prefer minimal diffs over rewrites
- use flash-sidekick as needed

Do not implement yet.

Output only:
- route_owner
- page_owner
- visual_target
- preserved_behavior_risks
- files_likely_to_change
- mcp_plan
- validation_plan
- approval_request
```

### Prompt 5: Per-Page Implementation

```md
Use the approved per-page plan from the prior step.

Implement only this page. Optimize for Sonnet 4.6 thinking. If a rewrite appears necessary, pause and use sequential-thinking MCP before proceeding.

Hard constraints:
- do not change route ownership
- do not simplify richer repo behavior
- do not bypass the page owner -> visual target structure
- do not introduce hardcoded hex values or one-off spacing/typography
- do not invent placeholder assets if Figma provides the real asset
- keep changes minimal and route-local

Required output:
- preserved_behavior
- visual_changes
- deviations_from_figma
- files_changed
- validation_results
- follow_up_needed
```

### Prompt 6: Batch Validation and Closeout

```md
Run a batch validation pass for all completed pages. Optimize for Sonnet 4.6 thinking. If results are inconsistent or drift is hard to classify, initialize sequential-thinking MCP.

Tasks:
- run route-integrity and screen-pair verification
- run hidden-slop, literal palette, and demo-data sweeps for touched canonical surfaces
- verify route owner and visual target consistency
- verify no page regressed richer repo behavior
- verify parity outputs are complete
- verify modified high-visibility views still score > 0.9 in design-system-sidekick where visual proof is required
- decide whether manifest regeneration is now justified
- if and only if route-owner truth is settled, identify and run the manifest refresh scripts
- if route ownership changed, rerun snapshot Batches A and B
- re-check routes.json and orphans.json after regeneration

Output only:
- batch_status
- pages_validated
- unresolved_drift
- regenerate_manifests
- manifest_refresh_results
- final_blockers
- next_action
```

## Machine-Readable Queue

```json
{
  "workflow": "figma_sync_low_rework_v1",
  "agent": "claude-sonnet-4.6-thinking",
  "skills": ["design-orchestration", "brainstorming", "sprint-coordinator", "writing-plans"],
  "mcp": ["sequential-thinking", "flash-sidekick", "figma-mcp", "design-system-sidekick", "vision-scorer-mcp"],
  "tasks": [
    {"id": "00_token_preflight", "optional": true},
    {"id": "01_snapshot_batch_a_manifest_refresh", "depends_on": ["00_token_preflight"]},
    {"id": "02_snapshot_batch_b_component_refresh", "depends_on": ["01_snapshot_batch_a_manifest_refresh"]},
    {"id": "03_snapshot_batch_c_gap_fill_planning", "depends_on": ["02_snapshot_batch_b_component_refresh"]},
    {"id": "04_scope_order", "depends_on": ["03_snapshot_batch_c_gap_fill_planning"]},
    {"id": "05_shared_baseline", "depends_on": ["04_scope_order"]},
    {"id": "05a_sprint_coordination", "depends_on": ["04_scope_order", "05_shared_baseline"]},
    {"id": "05b_writing_plans", "depends_on": ["05a_sprint_coordination"]},
    {"id": "06_shared_impl", "depends_on": ["05b_writing_plans"], "optional": true},
    {"id_template": "07_page_plan_{ROUTE}", "depends_on": ["05a_sprint_coordination", "05b_writing_plans"], "repeat_for_each_route": true},
    {"id_template": "08_page_impl_{ROUTE}", "depends_on_template": ["07_page_plan_{ROUTE}"], "repeat_for_each_route": true},
    {"id": "09_snapshot_batch_d_closeout", "depends_on": ["08_page_impl_{ROUTE}"], "run_after_batch": true}
  ]
}
```

## Claude Code Session Checklist

### Session 1

- run Phase T0 only if token truth is unclear
- run Phase 0 / Prompt 1
- refresh or verify snapshot artifacts
- save `canonical_route_owner_table`
- stop if `blocking_issues` is non-empty

### Session 2

- run Phase 1 / route-level gap-fill triage
- then run Phase 1.25 / Prompt 2
- save `recommended_page_order`
- decide whether shared work must go first

### Session 3

- run Phase 2 / Prompt 3
- save shared targets

### Session 3A

- run Phase 1.5 / Prompt 3A
- save `sprint_frame`, `milestone_map`, and `readiness_score`

### Session 3B

- run Phase 3.5 / Prompt 3B
- save `implementation_plan`, `task_checklist`, and `verification_commands`

### Session 4

- run Phase 3 only if needed
- record `pages_impacted`

### Per-Page Sessions

For each route in `recommended_page_order`:

1. run Prompt 4
2. verify page owner and visual target
3. run Prompt 5 only after plan looks correct
4. if rewrite risk appears, stop and re-run with sequential-thinking emphasis

### Batch Session

After every 2-3 pages:

- run Prompt 6
- if route ownership changed, rerun snapshot Batches A and B
- regenerate manifests only if route truth is settled and output says to do so

## Stop Conditions

Stop and re-plan if:

- `App.tsx` and `route-registry.ts` imply incompatible route authority
- token preflight leaves the token source of truth unresolved
- `derive-gap-fill-plan.py` adaptation requires new decision semantics instead of input rewiring
- `ts-morph` evidence and runtime evidence disagree on reachability
- a modified high-visibility canonical surface cannot reach the KR compliance threshold without broader design review
- refreshed manifests contradict the claimed state of the app

## Success Gates

Do not mark the sync batch complete until:

- `App.tsx`, `route-registry.ts`, and `routes.json` agree on canonical routes versus redirect-only compatibility paths
- `frontend-api-usage.json` and `backend-endpoints.json` still support the route families being synced
- `component-inventory.json` is fresh enough to reflect the current ownership model
- page-owner layer is explicit
- `screens.json` and `screen-map.json` remain coherent
- `orphans.json` is not being misread as dead-code truth
- no critical literal Tailwind palette or demo identity contamination remains in canonical user-facing surfaces
- holdouts and prototype-derived artifacts are no longer ambiguous
- any manifest regeneration has been justified and verified
