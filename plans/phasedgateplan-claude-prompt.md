# Claude Prompt: Phased Gate Plan Orchestration

Use this prompt to initialize a fresh Claude Code session against `plans/phasedgateplan.md`.

```md
Use `design-orchestration` and `brainstorming` first.

Task:
Execute the planning workflow defined in `plans/phasedgateplan.md` for the current Figma-to-code migration batch. Optimize for Claude Sonnet 4.6 thinking.

Important:
- Read and align these docs before making decisions:
  - `docs/project/active/frontend-cleanup-agent-assignment-sheet.md`
  - `docs/project/active/frontend-snapshot-methodology.md`
  - `docs/project/active/refinement_plan.md`
  - `docs/project/active/PR126-high-fidelity-methodology.md`
- If ownership, routing drift, redirect semantics, or rewrite risk are ambiguous, initialize sequential-thinking MCP immediately.
- If token source of truth is unclear, run the optional token preflight before route cleanup.
- Use `sprint-coordinator` after scope/order is approved to frame milestones, blocked routes, parallelizable routes, and readiness.
- Use `writing-plans` only after route targeting and shared dependency decisions are settled. Do not use it to resolve open design ambiguity.
- Use flash-sidekick for token-efficient repo analysis:
  - `quick_summarize`
  - `generate_idf`
  - `batch_file_analysis`
  - `consult_pro`
  - `suggest_refactoring` only when minimal diff is not practical
- Use Figma MCP only for design extraction and parity reference.
- Follow `docs/project/active/frontend-snapshot-methodology.md`.
- Treat `frontend/src/App.tsx` as runtime truth, `frontend/src/config/route-registry.ts` as route intent, `frontend/src/screens/**` plus `docs/manifests/screens.json` as design pairing truth, `frontend/component-inventory.json` as an ownership signal, and `docs/manifests/routes.json` / `docs/manifests/orphans.json` as generated drift evidence.

Run the phases in this order unless blocked:
1. Phase T0: Token Source Preflight if needed
2. Phase 0: Snapshot Batch A Manifest Refresh
3. Phase 0.5: Snapshot Batch B Component and Layered Snapshot Refresh
4. Phase 1: Snapshot Batch C Route-Level Gap-Fill Planning
5. Phase 1.25: Scope and Order
6. Phase 1.5: Sprint Coordination
7. Phase 2: Shared Baseline
8. Phase 3.5: Writing Plans
9. Phase 3: Optional Shared Implementation
10. Phase 4: Per-Page Plan
11. Phase 5: Per-Page Implementation
12. Phase 6: Snapshot Batch D Verification and Closeout Evidence

Required output for this session:
- current_phase
- inputs_used
- outputs_produced
- blockers
- next_phase
- next_prompt_to_run

Do not skip gates. Do not regenerate manifests until route-owner truth is settled.
Stop and re-plan if route authority is incompatible, token truth is unresolved, or refreshed manifests contradict the claimed repo state.
```
