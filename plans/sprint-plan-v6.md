# CareerCopilot — Final Sprint: Remediation + Figma Sync
## Execution Plan v6 (Orchestrator-Lead Transition)
**Status:** Ready for execution. Conducted by the **orchestrator** per engineering lead directive.
**Changelog:** v5 → v6. Transitioned Lead Architecture Conductor from Claude Code to **orchestrator**. Applied FIX-17 (Self-Audit Protocol).

---

## Part 1 — Change History

See [docs/archive/sprint-plan-v3-v4-delta.md](../docs/archive/sprint-plan-v3-v4-delta.md) for v3→v4 change history.
v6: Transitioned to Gemini orchestration + integration of `verification-before-completion` self-audit protocol.

---

## Part 2 — Plan JSON v6

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "name": "CareerCopilot_Remediation_and_Figma_Sync_v6",
  "description": "Deterministic execution graph: structural remediation then Figma-to-code design sync. Orchestrator-driven. Real KR Solidarity skills wired per registry v6.1. All FIX-01–FIX-17 applied.",

  "execution_profile": {
    "orchestrator": "orchestrator (currently Gemini)",
    "analysis_delegate": "flash-sidekick",
    "design_delegate": "figma-mcp + phase4-pipeline-orchestrator",
    "token_delegate": "token-orchestrator",
    "harvest_delegate": "frontend-cleanup-manager",
    "reasoning_wrapper": "sequential-thinking",
    "blueprint_delegate": "blueprint skill",
    "execution_delegate": "subagent-driven-development",
    "audit_protocol": "verification-before-completion",
    "operating_mode": "Execution Mode. Plan pre-approved. The execution JSON is in Part 2 of this document. Parse it inline. Do not load an external file. No re-planning unless stop_condition triggered."
  },

  "routing_table": {
    "description": "Binding. Consult before every tool/skill invocation.",
    "rules": [
      {
        "condition": "Reading or analysing >= 5 files",
        "route_to": "flash-sidekick:batch_file_analysis",
        "note": "Context delegation per registry Design Doc Validation Workflow step 2"
      },
      {
        "condition": "Generating structural diff or IDF report",
        "route_to": "flash-sidekick:generate_idf"
      },
      {
        "condition": "Validating design tokens, DTCG compliance, KR palette rules",
        "route_to": "token-orchestrator skill",
        "note": "NOT design-system-sidekick. Registry: token-orchestrator is canonical for DTCG + KR Solidarity validation"
      },
      {
        "condition": "UI audit: typography, contrast, motion, M3 Expressive quality",
        "route_to": "m3-expressive-ui-evaluator skill"
      },
      {
        "condition": "Brand compliance: KR Solidarity v6.0.0 brand check",
        "route_to": "kerala-rage-brand-enforcer  /brand-check frontend/src [--min-score 95]"
      },
      {
        "condition": "Visual compliance scoring post-implementation",
        "route_to": "vision-scorer-mcp  GATE: score >= 90 required"
      },
      {
        "condition": "Design compliance scoring for route promotion gate",
        "route_to": "careercopilot-design-critique  GATE: score >= 90 required"
      },
      {
        "condition": "Figma node extraction, design token export from Figma",
        "route_to": "figma-mcp via phase4-pipeline-orchestrator",
        "phase_gate": "Phase P13 and P14 ONLY. Do not invoke directly."
      },
      {
        "condition": "Harvest readiness review, shell drift, cleanup decisions",
        "route_to": "frontend-cleanup-manager agent"
      },
      {
        "condition": "Writing an implementation plan from approved spec",
        "route_to": "writing-plans skill"
      },
      {
        "condition": "Executing an implementation plan with review gates",
        "route_to": "executing-plans skill"
      },
      {
        "condition": "Per-page harvest execution (bounded, fresh context per page)",
        "route_to": "subagent-driven-development skill",
        "note": "Requires blueprint output as prerequisite. task_type: canonical_port"
      },
      {
        "condition": "Creating decision-complete construction plan before subagent dispatch",
        "route_to": "blueprint skill",
        "note": "Mandatory predecessor to subagent-driven-development for all P13/P14 page iterations"
      },
      {
        "condition": "Sprint parallelisation, evidence capture, remediation batches",
        "route_to": "sprint-coordinator skill"
      },
      {
        "condition": "Aggregate audit outputs for checkpoint reporting",
        "route_to": "compliance-dashboard skill"
      },
      {
        "condition": "File writes, phase gating, architectural decisions",
        "route_to": "orchestrator"
      },
      {
        "condition": "Multi-step architectural reasoning",
        "route_to": "sequential-thinking MCP (wrap decision)"
      }
    ]
  },

  "authority_stack": [
    "1. frontend/src/App.tsx — Runtime truth",
    "2. frontend/src/config/route-registry.ts — Route intent",
    "3. frontend/src/screens/** + docs/manifests/screens.json — Design pairing truth",
    "4. docs/manifests/frontend-api-usage.json + backend-endpoints.json — Capability truth",
    "5. frontend/component-inventory.json — Ownership signals",
    "6. docs/manifests/routes.json + orphans.json — Derived drift evidence",
    "7. docs/design/{01..05}_*.md — KR Solidarity design truth (DTCG + M3 Expressive + Zero-Flora)"
  ],

  "core_rules": {
    "continuous_dashboarding": "Append status row to docs/project/active/ORCHESTRATION_DASHBOARD.md at end of EVERY phase before advancing.",
    "self_audit_verification": "Execute the verification-before-completion checklist at the end of every completed batch/task (P13/P14 iterations and all global phases).",
    "replacement_gate": "Never blindly replace. Preserve: state, accessibility, async flows, analytics. Prefer minimal diffs.",
    "routing_model": "Target canonical frontend/src/features/* after P06. Use legacy pages/* as read-only discovery map only.",
    "script_first": "Use scripts/sprint/ blocks before improvising bash. Scripts are source-of-truth for repeatable operations.",
    "zero_flora_lockdown": "Strict Zero-Flora rules apply to all generation and audit phases. Registry: Strict Zero-Flora Lockdown applied across all generation and audit skills.",
    "token_compliance": "No literal Tailwind palette classes. All tokens via KR Solidarity semantic variables (--sys-color-*, --sys-type-*).",
    "stop_conditions": [
      "App.tsx and route-registry.ts imply incompatible route authority",
      "Token preflight leaves token truth unresolved",
      "ts-morph evidence and runtime evidence disagree on reachability",
      "Refreshed manifests contradict claimed app state",
      "flash-sidekick or token-orchestrator unavailable at phase start",
      "vision-scorer-mcp returns score < 90 and no remediation path identified",
      "careercopilot-design-critique returns score < 90 and no remediation path identified"
    ]
  },

  "phases": [
    {
      "phase_id": "P00",
      "display_name": "PRE — MCP + Skill + Script Preflight",
      "goal": "Verify all required MCPs, skills, and sprint scripts are reachable. Fast-fail here, not mid-execution.",
      "executor": "orchestrator",
      "assistants": [],
      "token_profile": "light",
      "tasks": [
        "Ping flash-sidekick: list_tools health check",
        "Ping token-orchestrator skill: verify .claude/skills/token-orchestrator exists and is readable",
        "Ping phase4-pipeline-orchestrator skill: verify .claude/skills/phase4-pipeline-orchestrator exists",
        "Ping careercopilot-design-critique skill: verify .claude/skills/careercopilot-design-critique exists",
        "Confirm figma-mcp credentials present: assert FIGMA_ACCESS_TOKEN env var set AND curl -s -o /dev/null -w '%{http_code}' -H 'X-Figma-Token: ${FIGMA_ACCESS_TOKEN}' https://api.figma.com/v1/me returns 200. On failure: STOP — 'FIGMA_CRED_FAIL: token missing or invalid'",
        "Confirm sequential-thinking MCP available",
        "Confirm frontend-cleanup-manager agent exists",
        "Confirm migration-audit skill exists",
        "Confirm vision-scorer-mcp skill exists",
        "Confirm blueprint skill exists",
        "Confirm subagent-driven-development skill exists"
      ],
      "script_existence_check": {
        "description": "Assert all Phase P03 scripts exist before advancing. On any failure: STOP — 'MISSING_SCRIPT: <path>'. Do not advance to P01.",
        "assert_paths": [
          "scripts/extract-routes.js",
          "scripts/detect-orphans.js",
          "scripts/extract-api-usage.js",
          "scripts/kr/generate-manifest.mjs",
          "scripts/sprint/skill_preflight.sh",
          "scripts/sprint/init_dashboard.sh",
          "scripts/sprint/generate_manifests.sh",
          "scripts/sprint/generate_component_inventory.sh",
          "scripts/sprint/quarantine_dead_routes.sh",
          "scripts/sprint/sweep_literal_colors.sh",
          "scripts/sprint/final_verification.sh"
        ],
        "command": "for f in scripts/extract-routes.js scripts/detect-orphans.js scripts/extract-api-usage.js scripts/kr/generate-manifest.mjs scripts/sprint/skill_preflight.sh scripts/sprint/init_dashboard.sh scripts/sprint/generate_manifests.sh scripts/sprint/generate_component_inventory.sh scripts/sprint/quarantine_dead_routes.sh scripts/sprint/sweep_literal_colors.sh scripts/sprint/final_verification.sh; do test -f \"$f\" || { echo \"MISSING_SCRIPT: $f\"; exit 1; }; done && echo 'All scripts present'"
      },
      "gate_checks": [
        "script_existence_check passes (0 MISSING_SCRIPT entries)",
        "skill_preflight.sh returns 0 NOT FOUND entries",
        "flash-sidekick responds to list_tools",
        "FIGMA_ACCESS_TOKEN curl check returns HTTP 200",
        "yarn test --passWithNoTests passes",
        "Self-audit checklist completed with evidence"
      ],
      "on_stop_condition": "Halt. Log which skill/MCP/script failed. Do not proceed to P01.",
      "required_outputs": ["mcp_preflight_result"],
      "dependencies": []
    },

    {
      "phase_id": "P01",
      "display_name": "00 — Dashboard Initialisation",
      "goal": "Create central compliance and status tracker.",
      "executor": "orchestrator",
      "assistants": [],
      "token_profile": "light",
      "scripts": [
        {
          "name": "init_dashboard.sh",
          "path": "scripts/sprint/init_dashboard.sh"
        }
      ],
      "gate_checks": [
        "docs/project/active/ORCHESTRATION_DASHBOARD.md exists",
        "File contains exact header row",
        "yarn test --passWithNoTests passes",
        "Self-audit checklist completed with evidence"
      ],
      "required_outputs": ["docs/project/active/ORCHESTRATION_DASHBOARD.md"],
      "dependencies": ["P00"]
    },

    {
      "phase_id": "P02",
      "display_name": "T0 — Token Source Preflight (Conditional)",
      "goal": "Confirm docs/design/02_SYSTEM.md token definitions are current. Determine sync_now_or_defer.",
      "executor": "token-orchestrator",
      "assistants": ["orchestrator (decision gate)"],
      "token_profile": "medium",
      "skill_chain": [
        "token-orchestrator: audit docs/design/02_SYSTEM.md against current token files",
        "token-orchestrator: check DTCG compliance of existing token exports",
        "orchestrator: write token_preflight_state + sync_now_or_defer to docs/project/active/token-preflight.json"
      ],
      "gate_checks": [
        "docs/project/active/token-preflight.json exists",
        "sync_now_or_defer field is 'sync_now' or 'defer' with explicit reason",
        "yarn test --passWithNoTests passes",
        "Self-audit checklist completed with evidence"
      ],
      "on_stop_condition": "Token truth unresolved: HALT. Log blocker. Do not proceed.",
      "required_outputs": ["docs/project/active/token-preflight.json"],
      "dependencies": ["P01"]
    },

    {
      "phase_id": "P03",
      "display_name": "0 — Snapshot Batch A — Manifest Refresh",
      "goal": "Regenerate runtime, design, capability, and drift evidence. All reads delegated to flash-sidekick.",
      "executor": "flash-sidekick",
      "assistants": ["orchestrator (write outputs)"],
      "token_profile": "heavy",
      "parallel_group": "manifest_refresh",
      "skill_chain": [
        "orchestrator: run scripts/sprint/generate_manifests.sh to produce raw file lists",
        "flash-sidekick:batch_file_analysis — inputs: [src/App.tsx, route-registry.ts, src/screens/**, pages/**, docs/design/*.md]",
        "flash-sidekick:generate_idf — target: route drift between App.tsx and route-registry.ts",
        "orchestrator: write validated outputs to docs/manifests/"
      ],
      "gate_checks": [
        "docs/manifests/routes.json valid JSON",
        "docs/manifests/orphans.json exists",
        "docs/manifests/frontend-api-usage.json exists",
        "docs/manifests/screens.json exists",
        "scripts/kr/validate-manifest.mjs exits 0 (0 errors)",
        "yarn test --passWithNoTests passes",
        "Self-audit checklist completed with evidence"
      ],
      "required_outputs": [
        "docs/manifests/routes.json",
        "docs/manifests/screens.json",
        "docs/manifests/frontend-api-usage.json",
        "docs/manifests/orphans.json"
      ],
      "dependencies": ["P01"],
      "optional_predecessors": ["P02"]
    },

    {
      "phase_id": "P04",
      "display_name": "0.5 — Snapshot Batch B — Component Refresh",
      "goal": "Refresh component-level ownership, reuse, and migration evidence.",
      "executor": "flash-sidekick",
      "assistants": ["token-orchestrator (token ownership per component)", "orchestrator (write outputs)"],
      "token_profile": "heavy",
      "parallel_group": "manifest_refresh",
      "skill_chain": [
        "orchestrator: run scripts/sprint/generate_component_inventory.sh",
        "flash-sidekick:batch_file_analysis — inputs: [src/components/**, packages/ui/**, src/features/**]",
        "token-orchestrator: validate token ownership per component against docs/design/03_COMPONENTS.md",
        "flash-sidekick:generate_idf — target: duplicate primitives between components/ui and packages/ui",
        "orchestrator: write frontend/component-inventory.json and docs/design/layered-component-blueprint.json"
      ],
      "gate_checks": [
        "frontend/component-inventory.json exists",
        "docs/design/layered-component-blueprint.json exists",
        "yarn test --passWithNoTests passes",
        "Self-audit checklist completed with evidence"
      ],
      "required_outputs": [
        "frontend/component-inventory.json",
        "docs/design/layered-component-blueprint.json"
      ],
      "dependencies": ["P01"],
      "optional_predecessors": ["P02"]
    },

    {
      "phase_id": "P05",
      "display_name": "1 — Snapshot Batch C — Route-Level Gap-Fill Planning",
      "goal": "Identify ambiguous route families. Use sequential-thinking to reason about reconciliation order.",
      "executor": "orchestrator",
      "assistants": ["sequential-thinking (wrap gap analysis)", "flash-sidekick (targeted re-reads on ambiguous routes)"],
      "token_profile": "medium",
      "skill_chain": [
        "sequential-thinking: analyse routes.json vs route-registry.ts for authority conflicts",
        "orchestrator: produce canonical_route_owner_table from routes.json + docs/manifests/screens.json pairing",
        "flash-sidekick:batch_file_analysis — re-read any route files with ambiguous ownership",
        "orchestrator: write gap_fill_candidates and manifest_drift_summary"
      ],
      "gate_checks": [
        "docs/project/active/canonical-routes.json exists",
        "Every route has an owner assigned to features/*",
        "manifest-drift-summary.md written",
        "yarn test --passWithNoTests passes",
        "Self-audit checklist completed with evidence"
      ],
      "required_outputs": [
        "docs/project/active/canonical-routes.json",
        "docs/project/active/gap-fill-candidates.json",
        "docs/project/active/manifest-drift-summary.md"
      ],
      "dependencies": ["P03", "P04"]
    },

    {
      "phase_id": "P06",
      "display_name": "1.1 — Route Authority Execution — Prototype Quarantine (The Purge)",
      "goal": "Remount live router to canonical feature ownership. Eliminate dead prototype noise.",
      "executor": "orchestrator",
      "assistants": [
        "frontend-cleanup-manager agent (harvest readiness + drift review)",
        "sequential-thinking (halt-or-proceed decision)",
        "flash-sidekick (post-remount import verification)"
      ],
      "token_profile": "medium",
      "skill_chain": [
        "frontend-cleanup-manager: review App.tsx drift and prototype shell surface against canonical-routes.json",
        "sequential-thinking: evaluate if App.tsx and route-registry.ts will be consistent after remount",
        "orchestrator: apply re-mappings to App.tsx from canonical-routes.json",
        "orchestrator: run scripts/sprint/quarantine_dead_routes.sh --dry-run, review orphans.json, then --execute",
        "flash-sidekick:batch_file_analysis — verify App.tsx post-remount, confirm no broken imports"
      ],
      "gate_checks": [
        "App.tsx has no imports from _quarantine/",
        "route-registry.ts canonical owners all resolve to features/*",
        "tsc --noEmit passes (no broken imports introduced)",
        "frontend-cleanup-manager: harvest readiness PASS",
        "yarn test --passWithNoTests passes",
        "Self-audit checklist completed with evidence"
      ],
      "required_outputs": ["app_tsx_remounted", "dead_prototypes_quarantined"],
      "dependencies": ["P05"]
    },

    {
      "phase_id": "P07",
      "display_name": "1.2 — Shared UI Decontamination",
      "goal": "Consolidate duplicate primitives, purge literal Tailwind classes, remove placeholder data, enforce KR brand baseline.",
      "executor": "token-orchestrator",
      "assistants": [
        "flash-sidekick (bulk class sweep + duplicate IDF)",
        "kerala-rage-brand-enforcer /brand-check frontend/src [--min-score 95]",
        "orchestrator (writes + minimal diffs)"
      ],
      "token_profile": "heavy",
      "skill_chain": [
        "orchestrator: run scripts/sprint/sweep_literal_colors.sh → pipe output to flash-sidekick",
        "flash-sidekick:batch_file_analysis — scan all TSX for literal Tailwind palette classes",
        "token-orchestrator: map literal classes to KR semantic token equivalents (--sys-color-*, --sys-type-*)",
        "flash-sidekick:generate_idf — diff components/ui vs packages/ui for duplicate primitives",
        "kerala-rage-brand-enforcer: /brand-check frontend/src --min-score 95",
        "orchestrator: apply replacements (minimal diff), remove placeholder/demo data"
      ],
      "gate_checks": [
        "scripts/sprint/sweep_literal_colors.sh returns 0 unresolved literal palette classes",
        "No duplicate component names between components/ui and packages/ui",
        "No placeholder emails or demo usernames in live feature components",
        "kerala-rage-brand-enforcer score >= 95",
        "tsc --noEmit passes",
        "yarn test --passWithNoTests passes",
        "Self-audit checklist completed with evidence"
      ],
      "required_outputs": ["duplicate_primitives_resolved", "literal_colors_purged"],
      "dependencies": ["P06"]
    },

    {
      "phase_id": "P08",
      "display_name": "1.25 — Scope and Order",
      "goal": "Determine lowest-rework execution order for page-by-page Figma sync. Use blueprint skill.",
      "executor": "orchestrator",
      "assistants": [
        "blueprint skill (turn objective into step-by-step construction plan)",
        "sequential-thinking (dependency graph reasoning)"
      ],
      "token_profile": "light",
      "skill_chain": [
        "blueprint: turn Figma sync objective into ordered construction plan with shared dependencies surfaced first",
        "sequential-thinking: validate dependency graph — shared layout before page-specific",
        "orchestrator: write docs/project/active/figma-sync-order.json"
      ],
      "gate_checks": [
        "docs/project/active/figma-sync-order.json exists",
        "Shared layout components appear before page-specific components",
        "Each page entry has a figma_node_id field or MISSING flag",
        "len(pages) > 0 (page count assertion passes)",
        "yarn test --passWithNoTests passes",
        "Self-audit checklist completed with evidence"
      ],
      "required_outputs": ["docs/project/active/figma-sync-order.json"],
      "dependencies": ["P07"]
    },

    {
      "phase_id": "P09",
      "display_name": "1.5 — Sprint Coordination",
      "goal": "Turn approved scope into milestones, readiness gates, and blockers. Use sprint-coordinator skill.",
      "executor": "sprint-coordinator skill",
      "assistants": ["orchestrator (write outputs)"],
      "token_profile": "light",
      "skill_chain": [
        "sprint-coordinator: parallelise figma-sync-order.json entries into sprint batches",
        "sprint-coordinator: capture evidence requirements per batch",
        "sprint-coordinator: flag blocked_routes (backend dependencies, missing figma_node_id)",
        "orchestrator: write docs/project/active/sprint-frame.md"
      ],
      "gate_checks": [
        "docs/project/active/sprint-frame.md exists",
        "blocked_routes named with explicit blocker reason",
        "Each milestone has a readiness gate condition",
        "yarn test --passWithNoTests passes",
        "Self-audit checklist completed with evidence"
      ],
      "required_outputs": ["docs/project/active/sprint-frame.md"],
      "dependencies": ["P08"]
    },

    {
      "phase_id": "P10",
      "display_name": "2 — Shared Baseline",
      "goal": "Identify shared primitives and wrappers requiring sync before page-level Figma work.",
      "executor": "flash-sidekick",
      "assistants": ["token-orchestrator (token gaps in shared components)", "orchestrator (write outputs)"],
      "token_profile": "heavy",
      "skill_chain": [
        "flash-sidekick:batch_file_analysis — read shared layout components, wrappers, global providers",
        "token-orchestrator: identify token gaps in shared components against docs/design/02_SYSTEM.md + 03_COMPONENTS.md",
        "orchestrator: write docs/project/active/primitive-sync-targets.json and shared-wrapper-targets.json"
      ],
      "gate_checks": [
        "docs/project/active/primitive-sync-targets.json exists",
        "Each target has a named Figma equivalent or explicit NONE flag",
        "yarn test --passWithNoTests passes",
        "Self-audit checklist completed with evidence"
      ],
      "required_outputs": [
        "docs/project/active/primitive-sync-targets.json",
        "docs/project/active/shared-wrapper-targets.json"
      ],
      "dependencies": ["P09"]
    },

    {
      "phase_id": "P11",
      "display_name": "3 — Optional — Shared Implementation",
      "goal": "Execute shared primitive syncs to reduce page-level rework.",
      "executor": "orchestrator",
      "assistants": ["executing-plans skill (plan execution with review gates)", "token-orchestrator (post-change validation)"],
      "token_profile": "medium",
      "skill_chain": [
        "executing-plans: apply changes to shared primitives per primitive-sync-targets.json (minimal diff, explicit review gate)",
        "token-orchestrator: validate KR token compliance after each primitive update",
        "orchestrator: run tsc --noEmit to confirm no broken contracts"
      ],
      "gate_checks": [
        "tsc --noEmit passes",
        "token-orchestrator: 0 DTCG violations on modified files",
        "yarn test --passWithNoTests passes",
        "Self-audit checklist completed with evidence"
      ],
      "required_outputs": ["shared_targets_updated"],
      "dependencies": ["P10"]
    },

    {
      "phase_id": "P12",
      "display_name": "3.5 — Implementation Blueprinting",
      "goal": "Convert approved page scope into executable per-page implementation plans. Use blueprint + writing-plans skills.",
      "executor": "blueprint skill → writing-plans skill",
      "assistants": ["sequential-thinking (per-page change strategy reasoning)", "orchestrator (write outputs)"],
      "token_profile": "medium",
      "skill_chain": [
        "blueprint: for each page in figma-sync-order.json, produce a decision-complete per-page plan",
        "sequential-thinking: for each page, reason: current state → target state → minimal diff path",
        "writing-plans: turn each approved spec into detailed executable implementation plan",
        "orchestrator: write docs/project/active/implementation-plan.json"
      ],
      "gate_checks": [
        "docs/project/active/implementation-plan.json exists",
        "Every page entry has task_checklist and verification_commands",
        "yarn test --passWithNoTests passes",
        "Self-audit checklist completed with evidence"
      ],
      "required_outputs": ["docs/project/active/implementation-plan.json"],
      "dependencies": ["P10"],
      "optional_predecessors": ["P11"]
    },

    {
      "phase_id": "P13",
      "display_name": "4 — Per-Page Plan — Figma Extraction (LOOP)",
      "goal": "For a single page: run the deterministic phase4a→4b→4c pipeline.",
      "executor": "phase4-pipeline-orchestrator skill",
      "assistants": ["token-orchestrator (Figma token → KR semantic mapping)", "orchestrator (gate evaluation + writes)"],
      "token_profile": "medium",
      "skill_chain": [
        "phase4-pipeline-orchestrator: run phase4a — figma-mcp node extraction",
        "phase4-pipeline-orchestrator: run phase4b — design token extraction",
        "phase4-pipeline-orchestrator: run phase4c — output contract finalisation",
        "token-orchestrator: map extracted Figma tokens → KR semantic tokens",
        "orchestrator: evaluate replacement_gate, document preserved_behavior_risks"
      ],
      "gate_checks": [
        "phase4-pipeline-orchestrator: 4a, 4b, 4c completed with no failure codes",
        "All Figma tokens have KR semantic mapping OR explicit UNMAPPED flag",
        "yarn test --passWithNoTests passes",
        "Self-audit checklist completed with evidence"
      ],
      "required_outputs": ["route_owner", "visual_target", "mcp_plan", "preserved_behavior_risks"],
      "dependencies": ["P12"]
    },

    {
      "phase_id": "P14",
      "display_name": "5 — Per-Page Implementation — Figma Sync (LOOP)",
      "goal": "Implement Figma design sync. Strictly minimal diffs. KR tokens only.",
      "executor": "executing-plans skill",
      "assistants": [
        "token-orchestrator (post-implementation token audit)",
        "m3-expressive-ui-evaluator (M3 Expressive quality audit)",
        "vision-scorer-mcp (visual compliance score >= 90 gate)",
        "careercopilot-design-critique (design compliance score >= 90 gate)",
        "orchestrator (writes + verification)"
      ],
      "token_profile": "medium",
      "skill_chain": [
        "executing-plans: apply visual changes per mcp_plan",
        "executing-plans: run verification_commands from implementation-plan.json",
        "token-orchestrator: audit changed files for KR token compliance",
        "m3-expressive-ui-evaluator: audit typography, contrast, motion",
        "vision-scorer-mcp: score visual compliance — MUST be >= 90",
        "careercopilot-design-critique: score design compliance — MUST be >= 90",
        "orchestrator: run tsc --noEmit, confirm preserved_behavior intact"
      ],
      "gate_checks": [
        "tsc --noEmit passes",
        "token-orchestrator: 0 DTCG violations",
        "vision-scorer-mcp: score >= 90",
        "careercopilot-design-critique: score >= 90",
        "yarn test --passWithNoTests passes",
        "Self-audit checklist completed with evidence"
      ],
      "required_outputs": ["visual_changes", "preserved_behavior", "validation_results"]
    },

    {
      "phase_id": "P15",
      "display_name": "6 — Snapshot Batch D — Verification and Closeout",
      "goal": "Full integrity verification. Late-stage canonical gates. Compliance dashboard.",
      "executor": "flash-sidekick",
      "assistants": [
        "migration-audit (full audit per modified route)",
        "token-orchestrator (full token audit across features/*)",
        "vision-scorer-mcp (final global score)",
        "compliance-dashboard (aggregate audit outputs)",
        "orchestrator (final writes)"
      ],
      "token_profile": "heavy",
      "skill_chain": [
        "orchestrator: re-run scripts/sprint/generate_manifests.sh and scripts/sprint/generate_component_inventory.sh",
        "flash-sidekick:batch_file_analysis — full scan of modified files",
        "migration-audit: run /migration-audit for each modified route",
        "token-orchestrator: full DTCG + KR compliance audit",
        "vision-scorer-mcp: global visual compliance score >= 90",
        "compliance-dashboard: aggregate all audit outputs",
        "orchestrator: write final dashboard rows"
      ],
      "gate_checks": [
        "tsc --noEmit passes",
        "migration-audit: all modified routes PASS",
        "token-orchestrator: 0 violations across features/*",
        "vision-scorer-mcp: global score >= 90",
        "ORCHESTRATION_DASHBOARD.md: all phases DONE",
        "yarn test --passWithNoTests passes",
        "Self-audit checklist completed with evidence"
      ],
      "required_outputs": [
        "docs/project/active/compliance-report.md",
        "docs/manifests/orphans-final.json"
      ]
    }
  ],

  "agent_instructions": "You are orchestrating this plan as Lead Architecture Conductor. The **orchestrator** (currently you) is the primary executor and decision-maker. Delegate per the routing_table. Use scripts/sprint/ scripts before improvising bash. Execute phases sequentially. Every batch/phase completion MANDATES a self-audit using the verification-before-completion checklist. EVIDENCE before CLAIMS. Update ORCHESTRATION_DASHBOARD.md after every phase. Do not skip gate checks."
}
```

---

## Part 3 — Orchestrator Execution Prompt v6

════════════════════════════════════════════
RESUME CHECK — Run before any phase
════════════════════════════════════════════
1. Run: grep -E "^\|" docs/project/active/ORCHESTRATION_DASHBOARD.md | tail -r
2. Read the Status column from bottom to top.
3. Resume at the first Phase ID whose Status column is not EXACTLY "✅ DONE".
If dashboard missing: begin from Phase P00.

════════════════════════════════════════════
YOUR ROLE: LEAD ARCHITECTURE CONDUCTOR
════════════════════════════════════════════
You are the **orchestrator** acting as conductor. You coordinate the KR Solidarity skills stack,
validate gates, write files, and make architectural decisions.

════════════════════════════════════════════
SELF-AUDIT PROTOCOL (Condition: BEFORE completion)
════════════════════════════════════════════
Apply the following checklist BEFORE claiming ANY phase or batch iteration is complete.

> [!IMPORTANT]
> The Iron Law: NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.

1. **IDENTIFY**: What command proves this claim?
2. **RUN**: Execute the FULL command (fresh, complete).
3. **READ**: Full output, check exit code, count failures.
4. **VERIFY**: Does output confirm the claim?
5. **EVIDENCE**: State claim WITH evidence in your final turn message.

════════════════════════════════════════════
PHASE EXECUTION PROTOCOL
════════════════════════════════════════════
1. DECLARE phase start.
2. SCRIPTS FIRST: Use scripts/sprint/ scripts.
3. SKILL CHAIN: Execute in order, log invocations.
4. GATE CHECKS: Evaluate every condition.
5. SELF-AUDIT: Run the verification-before-completion checklist.
6. DASHBOARD: Update docs/project/active/ORCHESTRATION_DASHBOARD.md.

---

## Part 4 — Skill Chain Summary (Quick Reference)

| Phase ID | Display Name | Primary Executor | Lead Sign-off Gate |
|---|---|---|---|
| P00 | PRE — Preflight | orchestrator | script_existence_check + self-audit |
| P01 | 00 — Dashboard Init | orchestrator | dashboard exists + self-audit |
| P02 | T0 — Token Preflight | `token-orchestrator` | sync_now_or_defer decision |
| P03 | 0 — Manifest Refresh | `flash-sidekick` | manifest validation |
| P04 | 0.5 — Component Refresh | `flash-sidekick` | inventory validation |
| P05 | 1 — Route Gap-Fill Planning | orchestrator | canonical-routes.json |
| P06 | 1.1 — Prototype Quarantine | orchestrator | quarantine execution |
| P07 | 1.2 — Shared UI Decontam | `token-orchestrator` | brand-enforcer >= 95 |
| P08 | 1.25 — Scope and Order | orchestrator | sync-order.json |
| P09 | 1.5 — Sprint Coordination | `sprint-coordinator` | sprint-frame.md |
| P10 | 2 — Shared Baseline | `flash-sidekick` | target identification |
| P11 | 3 — Shared Implementation | orchestrator | shared target sync |
| P12 | 3.5 — Blueprinting | `blueprint` → `writing-plans` | implementation-plan.json |
| P13 | 4 — Figma Extraction (LOOP) | `phase4-pipeline-orchestrator`| mcp_plan output |
| P14 | 5 — Figma Sync (LOOP) | `executing-plans` | design-critique >= 90 |
| P15 | 6 — Closeout | `flash-sidekick` | global compliance >= 90 |

---

## v6 Publish Gate

- [x] FIX-17: Transitioned orchestrator role to generic 'orchestrator' identifier
- [x] FIX-17: Integrated `verification-before-completion` self-audit protocol into all phases
- [x] FIX-17: Updated Part 3 and Part 4 for orchestrator-lead orchestration
