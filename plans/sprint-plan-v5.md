# CareerCopilot — Final Sprint: Remediation + Figma Sync
## Execution Plan v5
**Status:** Ready for execution. Do not modify without engineering lead sign-off.
**Changelog:** v4 → v5. Fixes applied: FIX-01 through FIX-16.

---

## Part 1 — Change History

See [docs/archive/sprint-plan-v3-v4-delta.md](../docs/archive/sprint-plan-v3-v4-delta.md) for v3→v4 change history.

---

## Part 2 — Plan JSON v5

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "name": "CareerCopilot_Remediation_and_Figma_Sync_v5",
  "description": "Deterministic execution graph: structural remediation then Figma-to-code design sync. Claude Code orchestrates. Real KR Solidarity skills wired per registry v6.1. All FIX-01–FIX-16 applied.",

  "execution_profile": {
    "orchestrator": "Claude Code",
    "analysis_delegate": "flash-sidekick",
    "design_delegate": "figma-mcp + phase4-pipeline-orchestrator",
    "token_delegate": "token-orchestrator",
    "harvest_delegate": "frontend-cleanup-manager",
    "reasoning_wrapper": "sequential-thinking",
    "blueprint_delegate": "blueprint skill",
    "execution_delegate": "subagent-driven-development",
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
        "route_to": "Claude Code (orchestrator)"
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
      "executor": "Claude Code",
      "assistants": [],
      "token_profile": "light",
      "tasks": [
        "Ping flash-sidekick: list_tools health check",
        "Ping token-orchestrator skill: verify .claude/skills/token-orchestrator exists and is readable",
        "Ping phase4-pipeline-orchestrator skill: verify .claude/skills/phase4-pipeline-orchestrator exists",
        "Ping careercopilot-design-critique skill: verify .claude/skills/careercopilot-design-critique exists",
        "Confirm figma-mcp credentials present: assert FIGMA_ACCESS_TOKEN env var set AND curl -s -o /dev/null -w '%{http_code}' -H 'X-Figma-Token: ${FIGMA_ACCESS_TOKEN}' https://api.figma.com/v1/me returns 200. On failure: STOP — 'FIGMA_CRED_FAIL: token missing or invalid'",
        "Confirm sequential-thinking MCP (.claude/skills/sequential-thinking) available",
        "Confirm frontend-cleanup-manager agent (.claude/agents/frontend-cleanup-manager.md) exists",
        "Confirm migration-audit skill (.claude/skills/migration-audit) exists",
        "Confirm vision-scorer-mcp skill (.claude/skills/vision-scorer-mcp) exists",
        "Confirm blueprint skill (.claude/skills/blueprint) exists",
        "Confirm subagent-driven-development skill (.claude/skills/subagent-driven-development) exists"
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
      "scripts": [
        {
          "name": "skill_preflight.sh",
          "path": "scripts/sprint/skill_preflight.sh"
        }
      ],
      "gate_checks": [
        "script_existence_check passes (0 MISSING_SCRIPT entries)",
        "skill_preflight.sh returns 0 NOT FOUND entries",
        "flash-sidekick responds to list_tools",
        "FIGMA_ACCESS_TOKEN curl check returns HTTP 200",
        "yarn test --passWithNoTests passes"
      ],
      "on_stop_condition": "Halt. Log which skill/MCP/script failed. Do not proceed to P01.",
      "required_outputs": ["mcp_preflight_result"],
      "dependencies": []
    },

    {
      "phase_id": "P01",
      "display_name": "00 — Dashboard Initialisation",
      "goal": "Create central compliance and status tracker.",
      "executor": "Claude Code",
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
        "yarn test --passWithNoTests passes"
      ],
      "required_outputs": ["docs/project/active/ORCHESTRATION_DASHBOARD.md"],
      "dependencies": ["P00"]
    },

    {
      "phase_id": "P02",
      "display_name": "T0 — Token Source Preflight (Conditional)",
      "condition_rule": {
        "description": "Run P02 only if ANY of the following bash conditions returns true. Otherwise record 'T0: skipped — deterministic check passed' in dashboard and proceed to P03.",
        "check_commands": [
          {
            "id": "C1",
            "description": "routes.json older than 7 days",
            "command": "find docs/manifests/routes.json -mtime +7",
            "run_condition": "If this command outputs the file path, C1 is TRUE → run P02"
          },
          {
            "id": "C2",
            "description": "route-registry.ts modified since last manifest refresh",
            "command": "git log --since=\"$(stat -f %Sm -t '%Y-%m-%d' docs/manifests/routes.json 2>/dev/null || date -r docs/manifests/routes.json '+%Y-%m-%d')\" -- frontend/src/config/route-registry.ts",
            "run_condition": "If this command outputs non-empty content, C2 is TRUE → run P02"
          },
          {
            "id": "C3",
            "description": "dashboard contains unresolved token state",
            "command": "grep -q 'token source unresolved' docs/project/active/ORCHESTRATION_DASHBOARD.md 2>/dev/null",
            "run_condition": "If exit code is 0, C3 is TRUE → run P02"
          }
        ],
        "decision": "Run the three commands above. If ALL return false/empty/non-zero: SKIP this phase. If ANY returns true: RUN this phase."
      },
      "goal": "Confirm docs/design/02_SYSTEM.md token definitions are current. Determine sync_now_or_defer.",
      "executor": "token-orchestrator",
      "assistants": ["Claude Code (decision gate)"],
      "token_profile": "medium",
      "skill_chain": [
        "token-orchestrator: audit docs/design/02_SYSTEM.md against current token files",
        "token-orchestrator: check DTCG compliance of existing token exports",
        "Claude Code: write token_preflight_state + sync_now_or_defer to docs/project/active/token-preflight.json"
      ],
      "gate_checks": [
        "docs/project/active/token-preflight.json exists",
        "sync_now_or_defer field is 'sync_now' or 'defer' with explicit reason",
        "yarn test --passWithNoTests passes"
      ],
      "on_stop_condition": "Token truth unresolved: HALT. Log blocker. Do not proceed.",
      "required_outputs": ["docs/project/active/token-preflight.json"],
      "skip_signal": {
        "field": "status",
        "value": "skipped",
        "reason_required": true,
        "dashboard_note": "T0: skipped — deterministic check passed (C1=false, C2=false, C3=false)"
      },
      "dependencies": ["P01"]
    },

    {
      "phase_id": "P03",
      "display_name": "0 — Snapshot Batch A — Manifest Refresh",
      "goal": "Regenerate runtime, design, capability, and drift evidence. All reads delegated to flash-sidekick.",
      "executor": "flash-sidekick",
      "assistants": ["Claude Code (write outputs)"],
      "token_profile": "heavy",
      "parallel_group": "manifest_refresh",
      "parallel_note": "P03 and P04 are independent data-gathering tasks with no shared write surface. Run in parallel using the bash pattern below.",
      "parallel_dispatch": "See P04 — both phases run concurrently:\n(bash scripts/sprint/generate_manifests.sh > /tmp/phase_p03_out.txt 2>&1) &\nPID1=$!\n(bash scripts/sprint/generate_component_inventory.sh > /tmp/phase_p04_out.txt 2>&1) &\nPID2=$!\nwait $PID1 && wait $PID2\n# Then read /tmp/phase_p03_out.txt and /tmp/phase_p04_out.txt for results",
      "skill_chain": [
        "Claude Code: run scripts/sprint/generate_manifests.sh to produce raw file lists",
        "flash-sidekick:batch_file_analysis — inputs: [src/App.tsx, route-registry.ts, src/screens/**, pages/**, docs/design/*.md]",
        "flash-sidekick:generate_idf — target: route drift between App.tsx and route-registry.ts",
        "Claude Code: write validated outputs to docs/manifests/"
      ],
      "scripts": [
        {
          "name": "generate_manifests.sh",
          "path": "scripts/sprint/generate_manifests.sh"
        }
      ],
      "gate_checks": [
        "docs/manifests/routes.json valid JSON",
        "docs/manifests/orphans.json exists",
        "docs/manifests/frontend-api-usage.json exists",
        "docs/manifests/screens.json exists",
        "scripts/kr/validate-manifest.mjs exits 0 (0 errors)",
        "yarn test --passWithNoTests passes"
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
      "assistants": ["token-orchestrator (token ownership per component)", "Claude Code (write outputs)"],
      "token_profile": "heavy",
      "parallel_group": "manifest_refresh",
      "parallel_note": "Runs concurrently with P03. See P03 parallel_dispatch for bash pattern.",
      "skill_chain": [
        "Claude Code: run scripts/sprint/generate_component_inventory.sh",
        "flash-sidekick:batch_file_analysis — inputs: [src/components/**, packages/ui/**, src/features/**]",
        "token-orchestrator: validate token ownership per component against docs/design/03_COMPONENTS.md",
        "flash-sidekick:generate_idf — target: duplicate primitives between components/ui and packages/ui",
        "Claude Code: write frontend/component-inventory.json and docs/design/layered-component-blueprint.json"
      ],
      "scripts": [
        {
          "name": "generate_component_inventory.sh",
          "path": "scripts/sprint/generate_component_inventory.sh"
        }
      ],
      "gate_checks": [
        "frontend/component-inventory.json exists",
        "docs/design/layered-component-blueprint.json exists",
        "yarn test --passWithNoTests passes"
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
      "executor": "Claude Code",
      "assistants": ["sequential-thinking (wrap gap analysis)", "flash-sidekick (targeted re-reads on ambiguous routes)"],
      "token_profile": "medium",
      "skill_chain": [
        "sequential-thinking: analyse routes.json vs route-registry.ts for authority conflicts",
        "Claude Code: produce canonical_route_owner_table from routes.json + docs/manifests/screens.json pairing",
        "flash-sidekick:batch_file_analysis — re-read any route files with ambiguous ownership",
        "Claude Code: write gap_fill_candidates and manifest_drift_summary"
      ],
      "gate_checks": [
        "docs/project/active/canonical-routes.json exists",
        "Every route has an owner assigned to features/*",
        "manifest-drift-summary.md written",
        "yarn test --passWithNoTests passes"
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
      "executor": "Claude Code",
      "assistants": [
        "frontend-cleanup-manager agent (harvest readiness + drift review)",
        "sequential-thinking (halt-or-proceed decision)",
        "flash-sidekick (post-remount import verification)"
      ],
      "token_profile": "medium",
      "skill_chain": [
        "frontend-cleanup-manager: review App.tsx drift and prototype shell surface against canonical-routes.json",
        "sequential-thinking: evaluate if App.tsx and route-registry.ts will be consistent after remount",
        "Claude Code: apply re-mappings to App.tsx from canonical-routes.json",
        "Claude Code: run scripts/sprint/quarantine_dead_routes.sh --dry-run, review orphans.json, then --execute",
        "flash-sidekick:batch_file_analysis — verify App.tsx post-remount, confirm no broken imports"
      ],
      "scripts": [
        {
          "name": "quarantine_dead_routes.sh",
          "path": "scripts/sprint/quarantine_dead_routes.sh"
        }
      ],
      "rollback_procedure": {
        "description": "If quarantine misclassification is detected after --execute, run the following exact commands:",
        "commands": [
          "git restore -- <original_path>",
          "Remove the corresponding entry from docs/manifests/orphans.json (edit the file, delete the object)",
          "Re-run P03 manifest refresh: bash scripts/sprint/generate_manifests.sh",
          "Verify: node scripts/detect-orphans.js | diff - docs/manifests/orphans.json"
        ],
        "note": "Do not proceed to P07 until orphans.json reflects post-rollback state."
      },
      "on_stop_condition": "If App.tsx and route-registry.ts remain in conflict: HALT. Do not proceed to P07.",
      "gate_checks": [
        "App.tsx has no imports from _quarantine/",
        "route-registry.ts canonical owners all resolve to features/*",
        "tsc --noEmit passes (no broken imports introduced)",
        "frontend-cleanup-manager: harvest readiness PASS",
        "yarn test --passWithNoTests passes"
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
        "Claude Code (writes + minimal diffs)"
      ],
      "token_profile": "heavy",
      "skill_chain": [
        "Claude Code: run scripts/sprint/sweep_literal_colors.sh → pipe output to flash-sidekick",
        "flash-sidekick:batch_file_analysis — scan all TSX for literal Tailwind palette classes",
        "token-orchestrator: map literal classes to KR semantic token equivalents (--sys-color-*, --sys-type-*)",
        "flash-sidekick:generate_idf — diff components/ui vs packages/ui for duplicate primitives",
        "kerala-rage-brand-enforcer: /brand-check frontend/src --min-score 95",
        "Claude Code: apply replacements (minimal diff), remove placeholder/demo data"
      ],
      "scripts": [
        {
          "name": "sweep_literal_colors.sh",
          "path": "scripts/sprint/sweep_literal_colors.sh"
        }
      ],
      "gate_checks": [
        "scripts/sprint/sweep_literal_colors.sh returns 0 unresolved literal palette classes",
        "No duplicate component names between components/ui and packages/ui",
        "No placeholder emails or demo usernames in live feature components",
        "kerala-rage-brand-enforcer score >= 95",
        "tsc --noEmit passes",
        "yarn test --passWithNoTests passes"
      ],
      "required_outputs": ["duplicate_primitives_resolved", "literal_colors_purged"],
      "dependencies": ["P06"]
    },

    {
      "phase_id": "P08",
      "display_name": "1.25 — Scope and Order",
      "goal": "Determine lowest-rework execution order for page-by-page Figma sync. Use blueprint skill.",
      "executor": "Claude Code",
      "assistants": [
        "blueprint skill (turn objective into step-by-step construction plan)",
        "sequential-thinking (dependency graph reasoning)"
      ],
      "token_profile": "light",
      "skill_chain": [
        "blueprint: turn Figma sync objective into ordered construction plan with shared dependencies surfaced first",
        "sequential-thinking: validate dependency graph — shared layout before page-specific",
        "Claude Code: write docs/project/active/figma-sync-order.json"
      ],
      "page_count_assertion": "After writing figma-sync-order.json, assert: len(pages) > 0. If pages array is empty: HALT — 'PAGE_COUNT_ZERO: no pages to process'. Log to dashboard before P12 loop starts.",
      "gate_checks": [
        "docs/project/active/figma-sync-order.json exists",
        "Shared layout components appear before page-specific components",
        "Each page entry has a figma_node_id field or MISSING flag",
        "len(pages) > 0 (page count assertion passes)",
        "yarn test --passWithNoTests passes"
      ],
      "required_outputs": ["docs/project/active/figma-sync-order.json"],
      "dependencies": ["P07"]
    },

    {
      "phase_id": "P09",
      "display_name": "1.5 — Sprint Coordination",
      "goal": "Turn approved scope into milestones, readiness gates, and blockers. Use sprint-coordinator skill.",
      "executor": "sprint-coordinator skill",
      "assistants": ["Claude Code (write outputs)"],
      "token_profile": "light",
      "skill_chain": [
        "sprint-coordinator: parallelise figma-sync-order.json entries into sprint batches",
        "sprint-coordinator: capture evidence requirements per batch",
        "sprint-coordinator: flag blocked_routes (backend dependencies, missing figma_node_id)",
        "Claude Code: write docs/project/active/sprint-frame.md"
      ],
      "gate_checks": [
        "docs/project/active/sprint-frame.md exists",
        "blocked_routes named with explicit blocker reason",
        "Each milestone has a readiness gate condition",
        "yarn test --passWithNoTests passes"
      ],
      "required_outputs": ["docs/project/active/sprint-frame.md"],
      "dependencies": ["P08"]
    },

    {
      "phase_id": "P10",
      "display_name": "2 — Shared Baseline",
      "goal": "Identify shared primitives and wrappers requiring sync before page-level Figma work.",
      "executor": "flash-sidekick",
      "assistants": ["token-orchestrator (token gaps in shared components)", "Claude Code (write outputs)"],
      "token_profile": "heavy",
      "skill_chain": [
        "flash-sidekick:batch_file_analysis — read shared layout components, wrappers, global providers",
        "token-orchestrator: identify token gaps in shared components against docs/design/02_SYSTEM.md + 03_COMPONENTS.md",
        "Claude Code: write docs/project/active/primitive-sync-targets.json and shared-wrapper-targets.json"
      ],
      "gate_checks": [
        "docs/project/active/primitive-sync-targets.json exists",
        "Each target has a named Figma equivalent or explicit NONE flag",
        "yarn test --passWithNoTests passes"
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
      "condition": "Run only if P10 identified shared work (primitive-sync-targets.json is non-empty). Skip if empty.",
      "goal": "Execute shared primitive syncs to reduce page-level rework.",
      "executor": "Claude Code",
      "assistants": ["executing-plans skill (plan execution with review gates)", "token-orchestrator (post-change validation)"],
      "token_profile": "medium",
      "skill_chain": [
        "executing-plans: apply changes to shared primitives per primitive-sync-targets.json (minimal diff, explicit review gate)",
        "token-orchestrator: validate KR token compliance after each primitive update",
        "Claude Code: run tsc --noEmit to confirm no broken contracts"
      ],
      "condition_skip": {
        "trigger": "primitive-sync-targets.json is empty OR user explicitly skips this phase",
        "action": "Write status='skipped' + reason to ORCHESTRATION_DASHBOARD.md. Downstream phase P12 will check this skip_signal before evaluating optional_predecessors.",
        "dashboard_format": "| P11 | 3 — Shared Implementation | — | ⏭ SKIPPED | — | [date] | Reason: [empty targets OR explicit skip] |"
      },
      "skip_signal": {
        "field": "status",
        "value": "skipped",
        "reason_required": true
      },
      "gate_checks": [
        "tsc --noEmit passes",
        "token-orchestrator: 0 DTCG violations on modified files",
        "executing-plans: execution + spec review + code-quality review all signed off",
        "yarn test --passWithNoTests passes"
      ],
      "required_outputs": ["shared_targets_updated"],
      "dependencies": ["P10"]
    },

    {
      "phase_id": "P12",
      "display_name": "3.5 — Implementation Blueprinting",
      "goal": "Convert approved page scope into executable per-page implementation plans. Use blueprint + writing-plans skills.",
      "executor": "blueprint skill → writing-plans skill",
      "assistants": ["sequential-thinking (per-page change strategy reasoning)", "Claude Code (write outputs)"],
      "token_profile": "medium",
      "optional_predecessor_rule": {
        "description": "Check P11 skip_signal before starting. IF P11 status == 'skipped': proceed directly. IF P11 status == 'complete': ingest shared_targets_updated outputs first before blueprinting.",
        "command": "grep -E 'P11.*SKIPPED|P11.*DONE' docs/project/active/ORCHESTRATION_DASHBOARD.md"
      },
      "skill_chain": [
        "blueprint: for each page in figma-sync-order.json, produce a decision-complete per-page plan (canonical owner map, task sequence, blockers, non-goals)",
        "sequential-thinking: for each page, reason: current state → target state → minimal diff path",
        "writing-plans: turn each approved spec into detailed executable implementation plan before coding starts",
        "Claude Code: write docs/project/active/implementation-plan.json with task_checklist and verification_commands per page"
      ],
      "parallel_blueprinting": {
        "description": "Phase 3.5 per-page blueprint plans are independent. Dispatch one sub-agent per page using run_in_background: true. Collect all plan outputs before P13 loop begins.",
        "pattern": "For each page in figma-sync-order.json: dispatch Agent(subagent_type='Plan', run_in_background=True, prompt=<page blueprint prompt using blueprint SKILL.md template>). Wait for all to return before writing implementation-plan.json."
      },
      "gate_checks": [
        "docs/project/active/implementation-plan.json exists",
        "Every page entry has: current_owner, figma_node_id, task_checklist[], verification_commands[], preserved_behavior_risks[]",
        "len(pages in implementation-plan.json) == len(pages in figma-sync-order.json)",
        "yarn test --passWithNoTests passes"
      ],
      "required_outputs": ["docs/project/active/implementation-plan.json"],
      "dependencies": ["P10"],
      "optional_predecessors": ["P11"]
    },

    {
      "phase_id": "P13",
      "display_name": "4 — Per-Page Plan — Figma Extraction (LOOP)",
      "goal": "For a single page: run the deterministic phase4a→4b→4c pipeline. Contract-gated outputs only.",
      "executor": "phase4-pipeline-orchestrator skill",
      "assistants": ["token-orchestrator (Figma token → KR semantic mapping)", "Claude Code (gate evaluation + writes)"],
      "token_profile": "medium",
      "note": "LOOP: Execute once per page in figma-sync-order.json. P13[page_n] must complete before P14[page_n] starts. P13[page_n+1] does NOT wait for P14[page_n].",
      "subagent_dispatch": {
        "description": "Each page iteration MUST be dispatched as a fresh subagent via subagent-driven-development. Controller must NOT carry per-page implementation context between iterations.",
        "task_type": "canonical_port",
        "required_context_per_dispatch": [
          "full task text from implementation-plan.json[page_n]",
          "canonical route owner",
          "authority refs: frontend/src/App.tsx, frontend/src/config/route-registry.ts",
          "explicit non-goals",
          "verification commands from implementation-plan.json[page_n]",
          "blueprint output for this page"
        ],
        "blueprint_prerequisite": "blueprint skill output for this page MUST exist in implementation-plan.json before subagent dispatch. Do not dispatch if blueprint output is missing."
      },
      "skill_chain": [
        "phase4-pipeline-orchestrator: run phase4a — figma-mcp node extraction for target figma_node_id",
        "phase4-pipeline-orchestrator: run phase4b — design token extraction + contract validation",
        "phase4-pipeline-orchestrator: run phase4c — failure code handling, output contract finalisation",
        "token-orchestrator: map extracted Figma tokens → KR semantic tokens (--sys-color-*, --sys-type-*)",
        "Claude Code: evaluate replacement_gate, document preserved_behavior_risks"
      ],
      "gate_checks": [
        "phase4-pipeline-orchestrator: all three sub-phases (4a, 4b, 4c) completed with no failure codes",
        "figma_node_id is valid and resolved",
        "All Figma tokens have KR semantic mapping OR explicit UNMAPPED flag",
        "preserved_behavior_risks documented in implementation-plan.json",
        "yarn test --passWithNoTests passes"
      ],
      "required_outputs": ["route_owner", "visual_target", "mcp_plan", "preserved_behavior_risks"],
      "loop_dependency": "P13[page_n].status == complete before P14[page_n] starts. P13[page_n+1] does NOT wait for P13[page_n] — it waits only for P12.",
      "dependencies": ["P12"]
    },

    {
      "phase_id": "P14",
      "display_name": "5 — Per-Page Implementation — Figma Sync (LOOP)",
      "goal": "Implement Figma design sync. Strictly minimal diffs. KR tokens only. No literal values.",
      "executor": "executing-plans skill",
      "assistants": [
        "token-orchestrator (post-implementation token audit)",
        "m3-expressive-ui-evaluator (M3 Expressive quality audit)",
        "vision-scorer-mcp (visual compliance score >= 90 gate)",
        "careercopilot-design-critique (design compliance score >= 90 gate)",
        "Claude Code (writes + verification)"
      ],
      "token_profile": "medium",
      "note": "LOOP: Loops with P13. THREE review sign-offs + design-critique gate required before DONE.",
      "subagent_dispatch": {
        "description": "Each page iteration MUST be dispatched as a fresh subagent via subagent-driven-development. Controller must NOT carry per-page implementation context between iterations.",
        "task_type": "canonical_port",
        "required_context_per_dispatch": [
          "mcp_plan output from P13[page_n]",
          "task_checklist from implementation-plan.json[page_n]",
          "preserved_behavior_risks from P13[page_n]",
          "canonical route owner",
          "authority refs: frontend/src/App.tsx, frontend/src/config/route-registry.ts",
          "explicit non-goals"
        ]
      },
      "skill_chain": [
        "executing-plans: apply visual changes per mcp_plan (minimal diff, explicit review + blocker escalation)",
        "executing-plans: run verification_commands from implementation-plan.json",
        "token-orchestrator: audit changed files for KR token compliance",
        "m3-expressive-ui-evaluator: audit typography, contrast, motion, component archetypes",
        "vision-scorer-mcp: score visual compliance — MUST return >= 90 to pass gate",
        "careercopilot-design-critique: score design compliance — MUST return >= 90 to pass gate",
        "Claude Code: run tsc --noEmit, confirm preserved_behavior intact"
      ],
      "review_protocol": [
        "1. Execution complete (executing-plans sign-off)",
        "2. Spec review: output matches mcp_plan from P13 (Claude Code sign-off)",
        "3. Code-quality review: tsc pass + token audit + vision score >= 90 (token-orchestrator + vision-scorer-mcp sign-off)",
        "3b. Design critique: run careercopilot-design-critique on implemented route. Assert score >= 90/100. IF score < 90: BLOCKED — record violations in ORCHESTRATION_DASHBOARD.md, return to implementation. This step is a hard gate. Cannot be waived."
      ],
      "gate_checks": [
        "tsc --noEmit passes",
        "scripts/sprint/sweep_literal_colors.sh returns 0 new literal palette classes",
        "token-orchestrator: 0 DTCG violations on changed files",
        "m3-expressive-ui-evaluator: PASS on typography, contrast, motion dimensions",
        "vision-scorer-mcp: score >= 90",
        "careercopilot-design-critique: score >= 90",
        "Preserved behaviors (state, accessibility, analytics) confirmed by code review",
        "yarn test --passWithNoTests passes"
      ],
      "required_outputs": ["visual_changes", "preserved_behavior", "validation_results"],
      "loop_dependency": "P14[page_n] requires P13[page_n].status == complete. P14[page_n+1] does NOT wait for P14[page_n]."
    },

    {
      "phase_id": "P15",
      "display_name": "6 — Snapshot Batch D — Verification and Closeout",
      "goal": "Full integrity verification. Late-stage canonical gates. Compliance dashboard. Final dashboard.",
      "executor": "flash-sidekick",
      "assistants": [
        "migration-audit (late-stage canonical gate — one complete audit per modified route)",
        "token-orchestrator (full token audit across features/*)",
        "vision-scorer-mcp (final global score)",
        "compliance-dashboard (aggregate audit outputs for checkpoint report)",
        "Claude Code (final writes)"
      ],
      "token_profile": "heavy",
      "note": "Registry late-stage canonical gates: token-enforcement, migration-audit, route-migration. All three must run.",
      "skill_chain": [
        "Claude Code: re-run scripts/sprint/generate_manifests.sh and scripts/sprint/generate_component_inventory.sh",
        "flash-sidekick:batch_file_analysis — full scan of all modified files against routes.json",
        "flash-sidekick:generate_idf — confirm no new orphans introduced vs P03 baseline",
        "migration-audit: run /migration-audit for each modified route [--audit-mode full]",
        "token-orchestrator: full DTCG + KR compliance audit across frontend/src/features/",
        "vision-scorer-mcp: global visual compliance score — MUST be >= 90",
        "compliance-dashboard: aggregate all audit outputs into checkpoint report",
        "Claude Code: write final dashboard rows, set overall status to COMPLETE or BLOCKED"
      ],
      "scripts": [
        {
          "name": "final_verification.sh",
          "path": "scripts/sprint/final_verification.sh"
        }
      ],
      "gate_checks": [
        "tsc --noEmit passes",
        "scripts/sprint/sweep_literal_colors.sh: 0 unresolved instances",
        "orphans-final.json: no new orphans vs P03 baseline",
        "scripts/kr/validate-manifest.mjs: 0 errors",
        "migration-audit: all modified routes PASS [--audit-mode full]",
        "token-orchestrator: 0 violations across features/*",
        "vision-scorer-mcp: global score >= 90",
        "ORCHESTRATION_DASHBOARD.md: row exists for every phase including all P13/P14 loop iterations",
        "yarn test --passWithNoTests passes"
      ],
      "required_outputs": [
        "docs/project/active/compliance-report.md",
        "docs/manifests/orphans-final.json",
        "final_blockers"
      ],
      "dependencies_rule": "P15 starts only after ALL P14 loop iterations have status == '✅ DONE' in ORCHESTRATION_DASHBOARD.md. Verify: grep -c 'P14.*DONE' docs/project/active/ORCHESTRATION_DASHBOARD.md should equal len(pages in figma-sync-order.json)."
    }
  ],

  "agent_instructions": "You are orchestrating this plan as Lead Architecture Conductor. Claude Code is the primary executor and decision-maker. Delegate per the routing_table — every route maps to a named skill from the KR Solidarity Skills Registry v6.1. Use scripts/sprint/ scripts before improvising bash. Execute phases sequentially per the dependency graph. Use subagent-driven-development for all P13/P14 page iterations — each page gets a fresh subagent. NEVER advance to the next phase until gate_checks pass and ORCHESTRATION_DASHBOARD.md has been updated. The execution JSON is in Part 2 of this document. Parse it inline. Do not load an external file."
}
```

---

## Part 3 — Claude Code Execution Prompt v5

```
════════════════════════════════════════════
RESUME CHECK — Run before any phase
════════════════════════════════════════════
1. Run: grep -E "^\|" docs/project/active/ORCHESTRATION_DASHBOARD.md | tail -r
2. Read the Status column from bottom to top.
3. Resume at the first Phase ID whose Status column is not EXACTLY "✅ DONE".
4. Do not re-run phases already marked "✅ DONE" unless explicitly instructed.
If ORCHESTRATION_DASHBOARD.md does not exist: begin from Phase P00.

════════════════════════════════════════════
EXECUTION AUTHORIZATION
════════════════════════════════════════════
The plan in Part 2 of this document has been reviewed and approved by the engineering lead.
The execution JSON is in Part 2 of this document. Parse it inline. Do not load an external file.
Do not re-plan or strategise. Resume from the phase identified by the RESUME CHECK above.

════════════════════════════════════════════
YOUR ROLE: LEAD ARCHITECTURE CONDUCTOR
════════════════════════════════════════════
You are Claude Code acting as orchestrator. You coordinate the KR Solidarity skills stack,
validate gates, write files, and make architectural decisions.
You do NOT do heavy analysis yourself — you delegate per the routing table in Part 2.

════════════════════════════════════════════
BINDING ROUTING TABLE (consult before EVERY invocation)
════════════════════════════════════════════
Full routing table is in Part 2 → routing_table. Summary:

  Analyse >= 5 files                     → flash-sidekick:batch_file_analysis
  Structural diff / IDF                  → flash-sidekick:generate_idf
  Token validation / DTCG compliance     → token-orchestrator skill
  M3 Expressive UI audit                 → m3-expressive-ui-evaluator skill
  Brand compliance check                 → kerala-rage-brand-enforcer  /brand-check [--min-score 95]
  Visual compliance scoring              → vision-scorer-mcp  [GATE: score >= 90]
  Design compliance (route promotion)    → careercopilot-design-critique  [GATE: score >= 90]
  Figma node extraction                  → phase4-pipeline-orchestrator skill  [P13/P14 ONLY]
  Per-page construction planning         → blueprint skill  [BEFORE subagent dispatch]
  Per-page implementation dispatch       → subagent-driven-development  [task_type: canonical_port]
  Harvest readiness / drift review       → frontend-cleanup-manager agent
  Writing an implementation plan         → writing-plans skill
  Executing an implementation plan       → executing-plans skill
  Sprint parallelisation                 → sprint-coordinator skill
  Aggregate audit reporting              → compliance-dashboard skill
  Late-stage canonical audit             → migration-audit skill  /migration-audit [route] --audit-mode full
  File writes + phase gating             → Claude Code (you)
  Multi-step architectural reasoning     → sequential-thinking MCP (wrap decision)

If you are about to read 5+ files yourself: STOP. Route to flash-sidekick.
If you are about to validate tokens yourself: STOP. Route to token-orchestrator.
If you are about to call figma-mcp directly: STOP. Route through phase4-pipeline-orchestrator.
If you are about to start a P13/P14 page iteration: STOP. Run blueprint first. Then dispatch via subagent-driven-development.

════════════════════════════════════════════
PHASE EXECUTION PROTOCOL
════════════════════════════════════════════
1. DECLARE at phase start:
   "▶ PHASE [ID] — [NAME] | Executor: [skill/agent] | Assistants: [list]"

2. SCRIPTS FIRST: Run the scripts/sprint/ script before any ad hoc bash.

3. SKILL CHAIN: Execute each step in the skill_chain array in order.
   Log each invocation:
   "[skill:method] → [input summary] → [output summary]"

4. GATE CHECKS: Before marking any phase complete, evaluate every gate_check condition.
   "  ✓ [condition]" or "  ✗ [condition] — BLOCKED"

5. REVIEW PROTOCOL (P11, P14):
   Four sign-offs required for P14:
   a) Execution complete
   b) Spec review (output matches plan)
   c) Code-quality review (tsc + token audit + vision-scorer-mcp >= 90)
   d) Design critique: careercopilot-design-critique >= 90 [HARD GATE — cannot be waived]

6. DASHBOARD: Append immediately after gate checks pass — before advancing.
   Format: | [ID] | [Name] | [Lead Skill/Agent] | ✅ DONE | [sign-off] | [date] | [artifacts] |
   For BLOCKED: | [ID] | [Name] | [Lead Skill/Agent] | 🛑 BLOCKED | — | [date] | [reason] |
   For SKIPPED: | [ID] | [Name] | — | ⏭ SKIPPED | — | [date] | [reason] |

════════════════════════════════════════════
P02 (T0) CONDITIONAL EXECUTION
════════════════════════════════════════════
Before running P02, evaluate ALL THREE conditions:
  C1: find docs/manifests/routes.json -mtime +7
  C2: git log --since="$(stat -f %Sm -t '%Y-%m-%d' docs/manifests/routes.json 2>/dev/null || date -r docs/manifests/routes.json '+%Y-%m-%d')" -- frontend/src/config/route-registry.ts
  C3: grep -q "token source unresolved" docs/project/active/ORCHESTRATION_DASHBOARD.md 2>/dev/null

If ALL return false/empty/non-zero: SKIP P02. Write to dashboard:
  | P02 | T0 — Token Source Preflight | — | ⏭ SKIPPED | — | [date] | T0: skipped — C1=false, C2=false, C3=false |
Then proceed to P03.

════════════════════════════════════════════
P03 + P04 PARALLEL MANIFEST REFRESH
════════════════════════════════════════════
P03 and P04 are independent. Run them in parallel:

  (bash scripts/sprint/generate_manifests.sh > /tmp/phase_p03_out.txt 2>&1) &
  PID1=$!
  (bash scripts/sprint/generate_component_inventory.sh > /tmp/phase_p04_out.txt 2>&1) &
  PID2=$!
  wait $PID1 && wait $PID2
  # Then read /tmp/phase_p03_out.txt and /tmp/phase_p04_out.txt for results

Gate-check both P03 and P04 before proceeding to P05.

════════════════════════════════════════════
P13/P14 LOOP EXECUTION
════════════════════════════════════════════
Phases P13 and P14 loop once per page in docs/project/active/figma-sync-order.json.

BEFORE LOOP STARTS: Assert page count > 0.
  python3 -c "import json; d=json.load(open('docs/project/active/figma-sync-order.json')); assert len(d.get('pages',d if isinstance(d,list) else [])) > 0, 'PAGE_COUNT_ZERO'"

FOR EACH PAGE [page_n]:
  1. Verify blueprint output exists in implementation-plan.json for this page.
     If missing: run blueprint skill for this page first. Do not skip.
  2. Dispatch P13[page_n] via subagent-driven-development (task_type: canonical_port).
     Fresh subagent. Do NOT carry prior page context.
  3. After P13[page_n] completes: dispatch P14[page_n] via subagent-driven-development.
  4. P14[page_n] requires design-critique score >= 90 (step 3b) — hard gate.
  5. Dashboard row: include page name in Notes column.
  6. P13[page_n+1] may start after P12 completes — does NOT wait for P14[page_n].

DO NOT PROCEED TO P15 until ALL pages have ✅ DONE rows for both P13 and P14.
Verify: grep -c "P14.*DONE" docs/project/active/ORCHESTRATION_DASHBOARD.md

════════════════════════════════════════════
STOP CONDITIONS
════════════════════════════════════════════
If ANY of these occur, STOP, write BLOCKED row to dashboard:
"🛑 STOP CONDITION: [reason]. Awaiting instruction."

  - App.tsx and route-registry.ts have incompatible route authority
  - Token preflight unresolved after Phase P02
  - ts-morph and runtime evidence disagree on reachability
  - Refreshed manifests contradict claimed app state
  - flash-sidekick or token-orchestrator unreachable at phase start
  - vision-scorer-mcp returns < 90 with no remediation path
  - careercopilot-design-critique returns < 90 with no remediation path
  - MISSING_SCRIPT at P00 preflight
  - FIGMA_CRED_FAIL at P00 preflight
  - PAGE_COUNT_ZERO before P13 loop

════════════════════════════════════════════
KR SOLIDARITY RULES (non-negotiable)
════════════════════════════════════════════
  - Zero-Flora Lockdown: applies to all generation and audit phases
  - No literal Tailwind palette classes anywhere in features/*
  - All tokens via --sys-color-*, --sys-type-* semantic variables
  - Design truth: docs/design/{01..05}_*.md

════════════════════════════════════════════
BEGIN
════════════════════════════════════════════
Run RESUME CHECK first.
If starting fresh: Execute Phase P00 now.
  Run P00 script_existence_check command.
  Run scripts/sprint/skill_preflight.sh.
  Declare which skills/scripts were found vs missing.
  Check Figma credentials.
  Update dashboard. Then proceed to P01.
```

---

## Part 4 — Skill Chain Summary (Quick Reference)

| Phase ID | Display Name | Primary Executor | Key Skills Chained |
|---|---|---|---|
| P00 | PRE — MCP + Skill + Script Preflight | Claude Code | `script_existence_check` → `scripts/sprint/skill_preflight.sh` → Figma cred check |
| P01 | 00 — Dashboard Init | Claude Code | `scripts/sprint/init_dashboard.sh` |
| P02 | T0 — Token Preflight (Conditional) | `token-orchestrator` | C1/C2/C3 bash check → DTCG audit → decision gate |
| P03 | 0 — Manifest Refresh | `flash-sidekick` | `batch_file_analysis` → `generate_idf` → `scripts/sprint/generate_manifests.sh` ‖ parallel with P04 |
| P04 | 0.5 — Component Refresh | `flash-sidekick` | `batch_file_analysis` → `token-orchestrator` ownership ‖ parallel with P03 |
| P05 | 1 — Route Gap-Fill Planning | Claude Code | `sequential-thinking` wrap → `flash-sidekick` re-reads |
| P06 | 1.1 — Prototype Quarantine | Claude Code | `frontend-cleanup-manager` → `sequential-thinking` → `scripts/sprint/quarantine_dead_routes.sh` → `flash-sidekick` verify + rollback procedure |
| P07 | 1.2 — Shared UI Decontamination | `token-orchestrator` | `scripts/sprint/sweep_literal_colors.sh` → `flash-sidekick` → `token-orchestrator` → `kerala-rage-brand-enforcer` |
| P08 | 1.25 — Scope and Order | Claude Code | `blueprint` skill → `sequential-thinking` → page_count_assertion |
| P09 | 1.5 — Sprint Coordination | `sprint-coordinator` | parallelise + evidence capture |
| P10 | 2 — Shared Baseline | `flash-sidekick` | `batch_file_analysis` → `token-orchestrator` gaps |
| P11 | 3 — Optional Shared Implementation | `executing-plans` | plan execution → `token-orchestrator` validation + condition_skip |
| P12 | 3.5 — Implementation Blueprinting | `blueprint` → `writing-plans` | `blueprint` per page → `sequential-thinking` → `writing-plans` plan output; background Agent dispatch per page |
| P13 | 4 — Per-Page Figma Extraction (LOOP) | `phase4-pipeline-orchestrator` | 4a→4b→4c → `token-orchestrator` mapping; fresh subagent per page via `subagent-driven-development` |
| P14 | 5 — Per-Page Implementation (LOOP) | `executing-plans` | execute → `token-orchestrator` → `m3-expressive-ui-evaluator` → `vision-scorer-mcp` >= 90 → `careercopilot-design-critique` >= 90; fresh subagent per page via `subagent-driven-development` |
| P15 | 6 — Verification + Closeout | `flash-sidekick` | `scripts/sprint/final_verification.sh` → `migration-audit` → `token-orchestrator` → `vision-scorer-mcp` → `compliance-dashboard` |

---

## v5 Publish Gate — All must be ✅ before using this plan

- [x] FIX-01: P12 dependencies: ["P10"], optional_predecessors: ["P11"]
- [x] FIX-02: P00 script_existence_check with exact `test -f` commands for all 4 Phase 0 scripts
- [x] FIX-03: Part 3 and Part 2 reference inline JSON only — no `phasedgateplan-orchestrator.json`
- [x] FIX-04: P02 condition uses exact bash C1/C2/C3 commands (mtime, git log, grep)
- [x] FIX-05: P14 has loop_dependency only — no global dependency on P13
- [x] FIX-06: P13/P14 wrapped with blueprint → subagent-driven-development (task_type: canonical_port)
- [x] FIX-07: P14 review_protocol step 3b: careercopilot-design-critique >= 90, hard gate
- [x] FIX-08: P06 rollback_procedure with exact `git restore -- <path>` command
- [x] FIX-09: RESUME CHECK at top of Part 3 with exact grep + tail -r command
- [x] FIX-10: `yarn test --passWithNoTests passes` in every phase gate_checks
- [x] FIX-11: P03+P04 parallel_group "manifest_refresh" with `&`/`wait` bash pattern in Part 3; P12 uses Agent run_in_background per page
- [x] FIX-12: Part 1 replaced with single archive reference
- [x] FIX-13: Part 3 contains no routing table restatement — points to Part 2
- [x] FIX-14: All phase IDs are P-series integers (P00–P15), display_name added, all dependencies use new IDs
- [x] FIX-15: All inline scripts replaced with scripts/sprint/<name> path references
- [x] FIX-16: P11 has condition_skip + skip_signal fields
- [x] BONUS: P02 T0 skip_signal added (same pattern as P11)
- [x] BONUS: Figma credential check (curl) added to P00
- [x] BONUS: Page count assertion added to P08 and P13 loop header in Part 3
- [x] BONUS: careercopilot-design-critique added to routing_table and stop_conditions
