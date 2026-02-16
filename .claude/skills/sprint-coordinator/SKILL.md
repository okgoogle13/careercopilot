---
name: sprint-coordinator
description: Sprint-level orchestration skill for final deployment push. Generates sprint plans, daily standups, deployment readiness dashboards, and MCP task delegation payloads using existing infrastructure skills.
metadata:
  legacy_frontmatter:
    version: 1.0.0
    category: project-management
    tags: [sprint, orchestration, deployment, mcp]
    dependencies:
      - codebase-orchestrator
      - task-router-mcp
      - compliance-dashboard
      - project-health-checker
      - deployment-manager
      - audit-agent
---

# Sprint Coordinator Skill

## Purpose

Use `sprint-coordinator` to orchestrate final-sprint execution across multiple skills and MCP workflows.

This skill fills sprint-level gaps by providing:
- Structured sprint planning (goals, milestones, tasks, dependencies)
- Daily standup automation (progress, blockers, velocity)
- Unified deployment readiness scoring with go/no-go recommendation
- MCP batch delegation via task-router compatible task payloads
- Risk and blocker tracking with escalation rules

## Scope

This skill is an orchestration layer. It does not replace specialist skills.

- `codebase-orchestrator`: infra + readiness scanning
- `project-health-checker`: build/test/lint quick diagnostics
- `compliance-dashboard`: design compliance metrics
- `audit-agent`: security/code quality risk findings
- `deployment-manager`: deploy workflow execution
- `task-router-mcp`: queue-based delegation and lifecycle tracking

## When To Use

Use this skill for:
1. Sprint kickoff planning
2. Daily standup automation
3. Deployment go/no-go checkpoints
4. Parallel task delegation to agents
5. Risk and blocker management during release windows

Avoid this skill for:
- Single-file bugfixes (use specialist coding tasks)
- One-off lint/test checks (use `project-health-checker`)
- Isolated security scans (use `audit-agent`)

## Inputs

### `plan`
Required:
- `sprint_name`
- `duration_days`
- `goals[]`

Optional:
- `constraints`
- `available_agents[]`
- `target_environment`
- `phase`

### `standup`
Required:
- `sprint_name`
- `day`

Optional:
- `date`
- `queue_file` (default `/tmp/kerala-rage-task-queue.json`)

### `deployment-readiness`
Required:
- `target_date`
- `environment`

Optional:
- `threshold_overrides`
- `weights`

### `delegate`
Required:
- `workflow_name`
- `tasks[]`

Optional:
- `queue_file`
- `retry_policy`

## Output Contracts

### Plan Output
- Sprint plan YAML compliant with `servers/schemas/sprint_plan_schema.yaml`
- Contains goals, milestones, tasks, risks, blockers, baseline metrics

### Standup Output
- Markdown document with:
  - completed/in progress/pending tasks
  - blockers and escalation state
  - health metrics snapshot
  - velocity and ETA
  - next actions

### Deployment Readiness Output
- Markdown dashboard with:
  - overall readiness score (0-100)
  - recommendation: `GO`, `NO_GO`, or `GO_WITH_CONDITIONS`
  - weighted breakdown by criterion
  - blockers and required actions

### Delegation Output
- Task payloads aligned with task-router schema:
  - `task_id`
  - `assigned_to`
  - `priority`
  - `inputs`
  - `next_task` / `next_assigned_to` when sequencing required

## Readiness Scoring Model

Default weighted model (100 total):
- Test coverage >= 90%: 20
- Build status passing: 15
- Lint critical = 0: 10
- WCAG AA = 100%: 20
- Token compliance = 100%: 10
- Security critical/high = 0: 15
- Performance budget met: 10

### Recommendation Thresholds
- `GO`: >= 95 and no critical blockers
- `GO_WITH_CONDITIONS`: 85-94 and only medium/low blockers
- `NO_GO`: < 85 or any critical blocker

## Process

### 1) Sprint Planning

1. Collect sprint goals and constraints.
2. Query baseline from infra skills:
   - `codebase-orchestrator`
   - `project-health-checker`
   - `compliance-dashboard`
3. Break goals into milestones.
4. Break milestones into tasks with dependencies.
5. Assign owners/skills and effort.
6. Add risks/blockers and escalation clocks.
7. Emit schema-valid sprint plan YAML.

### 2) Daily Standup

1. Read task-router queue.
2. Aggregate completed/in-progress/pending/failed.
3. Pull latest health metrics from checker/compliance outputs.
4. Calculate velocity and projected completion.
5. Emit markdown standup.

### 3) Deployment Readiness

1. Query all signal providers.
2. Map each signal to weighted score.
3. Determine recommendation.
4. Emit blockers and pre-deploy actions.

### 4) Delegation

1. Convert sprint tasks to task-router payloads.
2. Preserve dependencies and priority.
3. Route tasks to specialist agents.
4. Save status snapshot for next standup.

## MCP Delegation Pattern

Use this normalized payload shape:

```json
{
  "task_id": "T4",
  "assigned_to": "ux-accessibility-lead",
  "priority": "critical",
  "inputs": {
    "description": "Run full WCAG 2.2 AA audit",
    "acceptance_criteria": ["Zero critical accessibility violations"],
    "dependencies": ["T2"],
    "effort_hours": 2
  },
  "next_task": "T5",
  "next_assigned_to": "devops-specialist"
}
```

## Risk / Blocker Management

### Escalation Defaults
- Critical blocker: escalate after 1 day
- High blocker: escalate after 2 days
- Medium blocker: escalate after 3 days
- Low blocker: escalate after 5 days

### Mitigation Guidance
Always include:
- immediate workaround
- owner
- impact radius
- fallback plan

## Anti-Patterns

Do not:
- Manually track sprint state in ad-hoc notes when queue + schema are available
- Run isolated readiness checks and infer deployment safety without weighted scoring
- Serialize parallel tasks into sequential execution without dependency need
- Ignore blocker escalation clocks
- Emit sprint plans without acceptance criteria and dependencies

## Required Artifacts

This skill expects these files to exist:
- `servers/schemas/sprint_plan_schema.yaml`
- `.claude/skills/sprint-coordinator/examples/sprint-plan-example.yaml`
- `.claude/skills/sprint-coordinator/examples/daily-standup-example.md`
- `.claude/skills/sprint-coordinator/examples/deployment-dashboard-example.md`
- `docs/guides/sprint-coordinator-guide.md`

## Command Recipes

### Generate Plan

```bash
/sprint-coordinator plan
```

Arguments:
```json
{
  "sprint_name": "Phase 5 Final Deployment Push",
  "duration_days": 7,
  "phase": "phase-5",
  "goals": [
    "Complete dashboard implementation",
    "Hit 90%+ coverage",
    "Pass WCAG AA",
    "Deploy to production"
  ],
  "target_environment": "production"
}
```

### Generate Standup

```bash
/sprint-coordinator standup
```

Arguments:
```json
{
  "sprint_name": "Phase 5 Final Deployment Push",
  "day": 3,
  "queue_file": "/tmp/kerala-rage-task-queue.json"
}
```

### Generate Deployment Dashboard

```bash
/sprint-coordinator deployment-readiness
```

Arguments:
```json
{
  "target_date": "2026-02-22",
  "environment": "production"
}
```

### Delegate Batch Tasks

```bash
/sprint-coordinator delegate
```

Arguments:
```json
{
  "workflow_name": "phase5-final-deployment-push",
  "tasks": ["T2", "T4", "T5"]
}
```

## Data Mapping

### Health Source Mapping

| Readiness Signal | Source Skill | Normalized Field |
|---|---|---|
| Coverage | project-health-checker | metrics_baseline.test_coverage |
| Build | project-health-checker | metrics_baseline.build_status |
| Lint | project-health-checker | metrics_baseline.lint_issues |
| WCAG | compliance-dashboard | metrics_baseline.wcag_aa_compliance |
| Token | compliance-dashboard | metrics_baseline.token_compliance |
| Security | audit-agent | metrics_baseline.security_high_critical |
| Perf | project-health-checker / codebase-orchestrator | metrics_baseline.lighthouse_score |

## Validation Checklist

Before marking a sprint plan ready:
- [ ] Schema-valid YAML
- [ ] Every task has acceptance criteria
- [ ] Dependency graph has no cycles
- [ ] Effort estimates are non-zero
- [ ] Risks and blockers include owner and mitigation
- [ ] Readiness model includes all required criteria

Before marking deployment `GO`:
- [ ] No critical blockers
- [ ] Security critical/high = 0
- [ ] Build passing
- [ ] Coverage threshold met
- [ ] WCAG threshold met

## Troubleshooting

### Queue file missing
- Verify `/tmp/kerala-rage-task-queue.json` exists
- Fallback to last known standup snapshot

### Incomplete health signals
- Mark unknown signals as `warn`
- Reduce confidence from `high` to `medium`

### Conflicting metrics across tools
- Prefer latest timestamped source
- Record mismatch in blockers section

### Task assignment deadlock
- Rebalance owners for blocked dependency chains
- Split oversized tasks into <= 8h chunks

## Example References

Use included examples:
- `examples/sprint-plan-example.yaml`
- `examples/daily-standup-example.md`
- `examples/deployment-dashboard-example.md`

## Change Log

### v1.0.0
- Initial sprint coordinator release
- Added planning, standup, deployment readiness, and delegation contracts
- Added schema + examples + guide integration
