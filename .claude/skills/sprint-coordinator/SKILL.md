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
4. Pull evidence from specialist skills instead of inventing status. Use `project-health-checker`, `codebase-orchestrator`, `compliance-dashboard`, `audit-agent`, `deployment-manager`, and `task-router-mcp` as the source of truth for health and execution state.
5. Record blockers with severity, owner, impact radius, mitigation, and an escalation clock.
6. Recompute velocity and ETA from completed and in-progress work whenever generating standups or readiness reports.
7. Emit a single sprint artifact for the current need: plan, standup, readiness dashboard, or delegation payload.

## Produce These Outputs

- For sprint planning, produce a structured plan with milestones, tasks, dependencies, risks, blockers, and baseline metrics.
- For daily standups, summarize completed, in-progress, blocked, and next tasks, then include current velocity and the most urgent blocker.
- For release readiness, score each signal, state `GO`, `GO_WITH_CONDITIONS`, or `NO_GO`, and list the blocking actions.
- For delegation, emit task-router style payloads with `task_id`, `assigned_to`, `priority`, `inputs`, and optional sequencing fields.

## Use The Existing Scoring Rules

- Score readiness against concrete signals only.
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

## Use The Bundled Examples

- Read `examples/sprint-plan-example.yaml` before drafting a new sprint plan if you need the expected field layout.
- Read `examples/daily-standup-example.md` before generating a standup if you need the reporting shape.
- Read `examples/deployment-dashboard-example.md` before generating a readiness dashboard if you need the decision format.

## Enforce These Rules

- Keep sprint plans executable: every task must have acceptance criteria, effort, owner, and dependency data.
- Do not treat narrative updates as status if queue or health evidence exists.
- Do not infer deployment safety without explicit scoring and blocker review.
- Escalate blockers on a clock: critical after 1 day, high after 2 days, medium after 3 days, low after 5 days.
