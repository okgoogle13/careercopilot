---
name: sprint-coordinator
description: Coordinate sprint execution across planning, standups, release readiness, and delegated task batches. Use when Codex or Claude Code needs to turn goals into sprint milestones and tasks, summarize daily sprint status, compute a go or no-go release view from existing health signals, or prepare task-router style delegation payloads for parallel execution.
---

# Sprint Coordinator

Use this skill to manage sprint-sized delivery work. Keep it focused on execution cadence, not project-wide portfolio planning.

## Run The Core Workflow

1. Normalize the sprint scope: capture the sprint name, duration, goals, constraints, target environment, and the owners or agents available to execute the work.
2. Break goals into milestones, then into tasks with explicit acceptance criteria, effort, priority, and dependencies.
3. Preserve parallelism: keep tasks concurrent unless a real dependency forces sequencing.
4. Pull evidence from specialist skills instead of inventing status. Use `project-health-checker`, `codebase-orchestrator`, `compliance-dashboard`, `audit-agent`, `deployment-manager`, and `task-router-mcp` as the source of truth for health and execution state. For mapping out complex dependency chains or unblocking stubborn sprint issues, utilize the `sequential-thinking` MCP server.
5. When coordinating migration-kit quality work, treat `migration-audit` as the canonical worker per target and split its evidence-acquisition and sub-audit stages into parallel child tasks where dependencies allow it.
6. Record blockers with severity, owner, impact radius, mitigation, and an escalation clock.
7. Recompute velocity and ETA from completed and in-progress work whenever generating standups or readiness reports.
8. Emit a single sprint artifact for the current need: plan, standup, readiness dashboard, or delegation payload.
9. When a sprint reaches 100% task completion or deployment readiness is scored, proactively provide:
   - Sprint completion summary (tasks completed, velocity achieved, blockers resolved)
   - Celebration acknowledgment (recognize sprint success and team velocity)
   - Concrete next-step recommendations:
     * If deployment pending: "Recommended Next Action: Execute deployment to [environment]. Pre-deployment checklist: [list 3-5 items]"
     * If sprint complete: "Recommended Next Actions: [1] Conduct sprint retrospective, [2] Plan next sprint, [3] Archive sprint artifacts"
     * If blockers remain: "Recommended Next Action: Resolve [blocker name] before closing sprint. Owner: [name], ETA: [timeline]"
   - Timeline: "Suggested next sprint kickoff: [date/timeframe based on team velocity]"

## Produce These Outputs

- For sprint planning, produce a structured plan with milestones, tasks, dependencies, risks, blockers, and baseline metrics.
- For daily standups, summarize completed, in-progress, blocked, and next tasks, then include current velocity and the most urgent blocker.
- For release readiness, score each signal, state `GO`, `GO_WITH_CONDITIONS`, or `NO_GO`, and list the blocking actions.
- For delegation, emit task-router style payloads with `task_id`, `assigned_to`, `priority`, `inputs`, and optional sequencing fields.
- For migration audit batches, emit one parent task per target and child tasks for screenshot capture, code/token audit, asset validation, visual scoring, copy review, and final aggregation.

## Use The Existing Scoring Rules

- Score readiness against concrete signals only.
- When used with `migration-audit`, use the audit report as the target-level readiness source of truth.
- Use this weighted default unless the user provides overrides:
  - Test coverage >= 90: 20
  - Build passing: 15
  - Zero critical lint failures: 10
  - WCAG AA compliance: 20
  - Token compliance: 10
  - Zero critical or high security findings: 15
  - Performance budget met: 10
- Apply these thresholds:
  - `GO` at 95 or above with no critical blockers
  - `GO_WITH_CONDITIONS` at 85 to 94 with only medium or low blockers
- `NO_GO` below 85 or with any critical blocker

## Tandem Workflow With Migration Audit

Use this workflow when auditing `careercopilot-migration-kit-v3` in parallel.

### Parent Task Per Target

Create one parent task for each route or screen target such as:
- `/login`
- `/register`
- `auth-benchmark-v1`

### Parallel Child Tasks

Run these as child tasks when dependencies allow:
- route and screen resolution
- screenshot acquisition via Playwright
- migration/code audit
- token enforcement
- asset placement
- manifest reconciliation
- UX copy review

These depend on screenshots for full-confidence output:
- component visual audit
- page-level M3 visual audit
- anti-slop review

These depend on the rest:
- final target aggregation
- sprint readiness scoring
- remediation packet generation

### Preferred Execution Backends

1. `task-router-mcp` for queue-style parallel execution
2. `task-delegator` for lighter batched concurrency
3. direct/manual execution with the same dependency graph when the queue backend is not available

### Target-Level Readiness Rules

- `PASS` only if the orchestrator score is `>= 90` and there are no critical violations
- `NEEDS_REFINEMENT` if score is `75-89` or any high-severity issues exist
- `FAIL` if score is `< 75` or any critical issue exists

### Sprint-Level Readiness Rules

- `GO` only if all in-scope targets are `PASS`
- `GO_WITH_CONDITIONS` only if no target is `FAIL` and the remaining issues are explicitly accepted
- `NO_GO` if any target is `FAIL`, any benchmark validation fails, or required screenshot evidence is missing

## Use The Bundled Examples

- Read `examples/sprint-plan-example.yaml` before drafting a new sprint plan if you need the expected field layout.
- Read `examples/daily-standup-example.md` before generating a standup if you need the reporting shape.
- Read `examples/deployment-dashboard-example.md` before generating a readiness dashboard if you need the decision format.

## Enforce These Rules

- Keep sprint plans executable: every task must have acceptance criteria, effort, owner, and dependency data.
- Do not treat narrative updates as status if queue or health evidence exists.
- Do not infer deployment safety without explicit scoring and blocker review.
- Escalate blockers on a clock: critical after 1 day, high after 2 days, medium after 3 days, low after 5 days.
- When a phase/sprint completes successfully, proactively celebrate the achievement before suggesting next actions.
- Acknowledge team effort and velocity metrics (e.g., "Sprint completed successfully! Team maintained high velocity despite mid-sprint blocker.")
- Provide concrete, actionable next steps—not vague suggestions (e.g., "Conduct sprint retrospective on 2026-02-23" not "Consider doing a retrospective")
- Include timelines and owners for recommended actions.
- Prioritize recommendations (Immediate → Short-term → Long-term).
- When using tandem migration audits, never collapse the parent/child task graph into a narrative-only update; preserve explicit dependencies and owners.
