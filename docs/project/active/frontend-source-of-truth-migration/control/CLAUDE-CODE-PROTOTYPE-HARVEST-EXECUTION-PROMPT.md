# Claude Code Prompt: Prototype Harvest Blocker Remediation (Sonnet-Optimized)

Use this prompt in Claude Code (Sonnet 3.5/3.6 with Thinking enabled, Effort High) to execute the final harvest and cleanup of the `prototype_v2.0` codebase.

## Recommended Skill Stack

1. **$subagent-driven-development**: Execute the plan with fresh subagents for each component area.
2. **$migration-audit**: Validate outputs against `AGENTS.md` and KR Solidarity v6.1 Canon.
3. **$design-system-sidekick**: If available, use for visual token extraction and compliance.
4. **$verification-before-completion**: Force command-line evidence for every blocker closure.

---

## Execution Prompt

```text
Objective: Execute the Prototype Harvest & Blocker Remediation for Project Career Copilot.

Strategic Context:
We are harvesting high-fidelity interaction patterns from `prototype_v2.0` (reference-only) into the canonical `careercopilot` repo. This is not a direct port; it is a selective harvest of sophisticated logic, SVG-based visuals, and AI-driven state management.

Authorities:
- docs/project/active/frontend-source-of-truth-migration/control/AI-STUDIO-PROMPT-PLAN-MIG-202-B14-19.md (Tactical Guide)
- docs/project/active/frontend-source-of-truth-migration/control/CLAUDE-CODE-PROTOTYPE-HARVEST-EXECUTION-PROMPT.md (This prompt)
- AGENTS.md (Canonical Project Governance)
- docs/design/01_CANON.md (Solidarity Non-Negotiables)

Phase 1: Deep Thinking & Mapping
Before editing, use <thinking> to:
1. Map the 'Voice Profile' dependency chain. Ensure ALL references are routed to /profile.
2. Identify dependencies in sophisticated components (LibraryReferencePage, ImageStudioPage) that rely on Firebase-era user stores and plan their refactor to the main repo's AuthContext.
3. Audit all harvested assets for 'Zero-Flora' violations (grep for: leaf, gum, wattle, flower).

Phase 2: Execution (High-Fidelity Harvest)
Harvest the following sophisticated patterns:
- MIG-202: Move VoiceProfileManagementSection from prototype SettingsView to canonical /profile.
- B14: Port KanbanTracker.tsx with absolute state management logic.
- B17 (AisMatchVisuals): Harvest Circular Progress Match indicator and Keyword Cloud from OptimisePage.tsx.
- B19 (DashboardVisuals): Harvest SVG Sparklines and CSS Bar Charts from DashboardOverview.tsx.
- AI Interaction: Port the 'Steps' and 'Tabbed Generation' pattern from LibraryReferencePage.tsx.

Phase 3: Solidarity v6.1 Compliance
1. STRICT ZERO-FLORA: Ensure no botanical motifs exist in harvested code.
2. ARCHETYPE GEOMETRY:
   - Ban 'border-radius: 50%'.
   - Mandatory use: --sys-shape-scaffoldSlab01, --sys-shape-stone01, etc.
3. SEMANTIC TOKENS: No hex values. Use --sys-color-* tokens only.

Phase 4: Route Ownership Lock
- /profile owns Voice Identity.
- /settings is restricted to account metadata.
- /documents is the universal artifact hub.

Verification:
- Run 'cd frontend && yarn type-check' after every file promotion.
- Provide a screenshot or log of the prompt results if using design-system-sidekick.
- Update the readiness score in docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-HARVEST-BLOCKER-SPRINT.md.

End State: Prototype docs are quarantine-aligned, route ownership is reconciled, and high-fidelity visuals are promoted to canonical features.
```
