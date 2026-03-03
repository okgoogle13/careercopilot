---
name: project-manager
description: Orchestrate multi-phase projects across kickoff, execution, phase gates, and delivery. Use when Claude Code needs to build or update a project plan, manage milestones and dependencies, coordinate multiple teams or specialist skills, assess cross-phase blockers and risks, or produce project-level status dashboards.
---

# Project Manager

Use this skill as the top-level orchestration layer for work that spans multiple phases, teams, or delegated specialist skills.

## Run The Core Workflow

1. Define the project frame: capture the objective, delivery window, owners, success criteria, and the phases required to complete the work.
2. Break the project into phase-sized outcomes: define the goal, exit criteria, dependencies, and measurable checkpoints for each phase.
3. Keep dependencies explicit: identify which phases can run in parallel, which are blocked, and what gate must pass before a handoff.
4. Route execution to narrower skills instead of absorbing implementation here. Use `sprint-coordinator` for sprint planning, `task-router-mcp` for queue-based delegation, and `codebase-orchestrator` for build, test, and deployment signals.
5. Recalculate status from evidence: update progress based on completed milestones, failed gates, active blockers, and current capacity rather than narrative estimates alone.
6. Escalate blockers early: record severity, owner, impact radius, mitigation, and the next checkpoint where the blocker must be re-evaluated.
7. Publish an executive snapshot: summarize current phase, completion percent, key risks, dependencies at risk, next gates, and the single highest-priority decision.
8. When a phase reaches PHASE_COMPLETE state, proactively provide:
   - Phase completion summary (deliverables, metrics achieved, time taken)
   - Celebration acknowledgment (recognize team effort and milestone achievement)
   - Concrete next-step recommendations:
     * If next phase exists: "Recommended Next Action: Initiate Phase [N+1]: [Name]. Key preparation: [list 2-3 items]"
     * If project complete: "Recommended Next Actions: [1] Conduct project retrospective, [2] Archive project artifacts, [3] Update stakeholder documentation"
     * If blockers remain: "Recommended Next Action: Resolve [blocker name] before advancing. Escalation path: [owner + timeline]"
   - Timeline: "Suggested timeline for Phase [N+1] kickoff: [date/timeframe]"

## Use The Bundled Resources

- Read `references/PROJECT_SCHEMA.md` when you need normalized shapes for project, phase, team, and blocker records.
- Read `references/WORKFLOW_EXECUTION.md` when you need the phase-gate execution model or the expected orchestration sequence.
- Read `references/INTEGRATION_CONTRACTS.md` when coordinating handoffs to other skills or external systems.
- Reuse `assets/project-init.json.template` to scaffold the top-level project object.
- Reuse `assets/phase-plan.yaml.template` to draft a single phase plan with goals, gates, and ownership.
- Reuse `assets/milestone-tracking.json.template` to keep milestone status and ETA calculations consistent.
- Inspect `examples/init-output.json` and `examples/dashboard-example.md` when you need a concrete output shape before generating fresh artifacts.

## Enforce These Rules

- Keep this skill focused on orchestration, not implementation detail.
- Refuse to advance a phase without a concrete gate and a named owner.
- Prefer measurable delivery signals over subjective progress summaries.
- Preserve traceability between phases, tasks, blockers, and downstream handoffs.
- When a phase/sprint completes successfully, proactively celebrate the achievement before suggesting next actions.
- Acknowledge team effort and velocity metrics (e.g., "Sprint completed successfully! Team maintained high velocity despite mid-sprint blocker.")
- Provide concrete, actionable next steps—not vague suggestions (e.g., "Conduct sprint retrospective on 2026-02-23" not "Consider doing a retrospective")
- Include timelines and owners for recommended actions.
- Prioritize recommendations (Immediate → Short-term → Long-term).
