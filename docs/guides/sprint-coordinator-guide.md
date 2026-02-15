# Sprint Coordinator Guide

## Overview

`Sprint Coordinator` is the orchestration layer for the final deployment sprint.

Use it when you need to:
- draft and maintain sprint plans
- aggregate daily status across agents and MCP tasks
- make objective deployment go/no-go decisions
- run controlled parallel execution with dependency tracking

It coordinates these existing capabilities:
- codebase-orchestrator
- project-health-checker
- compliance-dashboard
- task-router-mcp
- deployment-manager
- audit-agent

## Quick Start

### 1) Generate a sprint plan

Prompt:

```text
Use sprint-coordinator to create a 7-day Phase 5 final deployment sprint plan for production.
```

Expected outputs:
- schema-valid YAML plan
- goals, milestones, tasks, risks, blockers
- readiness baseline snapshot

### 2) Generate daily standup

Prompt:

```text
Use sprint-coordinator to generate Day 3 standup for Phase 5 based on /tmp/kerala-rage-task-queue.json.
```

Expected outputs:
- completed/in-progress/pending summary
- blocker section with escalation state
- velocity + ETA

### 3) Generate deployment readiness dashboard

Prompt:

```text
Use sprint-coordinator to assess production deployment readiness for 2026-02-22.
```

Expected outputs:
- readiness score (0-100)
- recommendation (GO / GO_WITH_CONDITIONS / NO_GO)
- criterion-level breakdown
- pre-deploy checklist

### 4) Delegate tasks to MCP queue

Prompt:

```text
Use sprint-coordinator to delegate T2, T4, T5 using task-router-mcp with dependency order preserved.
```

Expected outputs:
- task payloads with priority + dependencies
- queue creation/update confirmation

## Workflow Patterns

## Pattern A: Sprint Kickoff

1. Pull baselines from:
- `project-health-checker`
- `compliance-dashboard`
- `codebase-orchestrator`

2. Define goals and acceptance outcomes.

3. Break goals into milestones.

4. Break milestones into tasks with:
- effort
- owner
- dependencies
- acceptance criteria
- retry strategy where applicable

5. Validate schema.

6. Publish plan and delegate first-wave tasks.

## Pattern B: Daily Control Loop

1. Query queue status.
2. Pull latest quality/compliance signals.
3. Update blocker ledger.
4. Recompute ETA from velocity.
5. Issue standup report.
6. Delegate/reshuffle if drift is detected.

## Pattern C: Pre-Deployment Decision Gate

1. Calculate weighted readiness score.
2. Check hard gates:
- security critical/high = 0
- build passing
- coverage threshold
- accessibility threshold
3. Produce recommendation.
4. Emit required actions and owner assignments.

## Readiness Model Reference

Default weights:
- test coverage: 20
- build status: 15
- lint: 10
- WCAG: 20
- token compliance: 10
- security: 15
- performance: 10

Thresholds:
- GO: >=95 + no critical blockers
- GO_WITH_CONDITIONS: 85-94
- NO_GO: <85 or critical blockers

## Task Design Rules

Use these rules when creating sprint tasks:
1. Keep tasks <= 8 hours when possible.
2. Each task must have measurable acceptance criteria.
3. Dependencies should be explicit and minimal.
4. Assign one primary owner.
5. Include fallback behavior for blocked tasks.

## Risk and Blocker Policy

### Risk Policy
Each risk must include:
- severity
- owner
- trigger
- mitigation
- contingency

### Blocker Escalation
- Critical: escalate after 1 day
- High: escalate after 2 days
- Medium: escalate after 3 days
- Low: escalate after 5 days

## Integration Notes

### task-router-mcp
Use queue-compatible payloads. Preserve dependencies and priority.

### project-health-checker
Use for fast baseline checks (build/test/lint).

### compliance-dashboard
Use for WCAG/token compliance dimensions.

### codebase-orchestrator
Use for broader infrastructure readiness and migration context.

### audit-agent
Use for security and code risk validation before deployment decisions.

### deployment-manager
Use once recommendation reaches GO or GO_WITH_CONDITIONS and blockers are bounded.

## Example Artifacts

Reference examples:
- `.claude/skills/sprint-coordinator/examples/sprint-plan-example.yaml`
- `.claude/skills/sprint-coordinator/examples/daily-standup-example.md`
- `.claude/skills/sprint-coordinator/examples/deployment-dashboard-example.md`

## Validation Steps

Run these checks after generating or editing sprint artifacts:

```bash
python3 - <<'PY'
import yaml
from pathlib import Path

files = [
    Path('.claude/skills/sprint-coordinator/examples/sprint-plan-example.yaml'),
    Path('servers/schemas/sprint_plan_schema.yaml'),
]

for f in files:
    yaml.safe_load(f.read_text())
    print('OK', f)
PY
```

Queue sanity check:

```bash
python3 - <<'PY'
import json
from pathlib import Path
q = Path('/tmp/kerala-rage-task-queue.json')
if q.exists():
    data = json.loads(q.read_text())
    print('queue tasks', len(data) if isinstance(data, list) else data.get('total_tasks'))
else:
    print('queue missing')
PY
```

## Common Failure Modes

1. Missing queue file
- fallback to previous standup snapshot
- mark confidence as medium

2. Conflicting metrics across tools
- choose most recent timestamp
- record conflict in blockers

3. Overloaded dependency chain
- split large tasks
- move non-critical work post-deploy

4. False GO due incomplete signals
- treat unknown critical signals as warnings
- downgrade confidence

## Suggested Prompt Library

### Kickoff prompt

```text
Create a Phase 5 final deployment sprint plan for 7 days with explicit milestones,
critical path dependencies, and MCP delegation-ready tasks.
```

### Standup prompt

```text
Generate Day 4 standup for Phase 5 from task queue and latest health/compliance data.
Include blockers, velocity, ETA, and next 24h actions.
```

### Readiness prompt

```text
Assess production deployment readiness for 2026-02-22 using weighted criteria.
Return GO/GO_WITH_CONDITIONS/NO_GO plus blocking issues and concrete owner actions.
```

### Delegation prompt

```text
Create task-router payloads for all pending critical tasks while preserving dependencies
and assigning to appropriate specialist owners.
```

## Operational Checklist

Daily operator checklist:
- [ ] Update queue/task status snapshot
- [ ] Pull fresh health metrics
- [ ] Pull compliance metrics
- [ ] Review blocker escalation timers
- [ ] Recompute velocity and ETA
- [ ] Publish standup

Pre-deployment checklist:
- [ ] Run deployment readiness assessment
- [ ] Resolve critical blockers
- [ ] Confirm rollback plan
- [ ] Confirm smoke test plan
- [ ] Schedule final go/no-go review

## Governance

- Keep planning artifacts schema-valid and versioned.
- Do not hide blockers in summary metrics.
- Preserve auditability in queue updates.
- Prefer deterministic scoring over subjective status labels.

## Version

- Guide version: 1.0.0
- Skill version: 1.0.0
- Last updated: 2026-02-15
