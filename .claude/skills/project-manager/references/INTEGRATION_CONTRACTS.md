# Integration Contracts

This document specifies the communication contracts between `project-manager` and its primary dependencies.

## 1. sprint-coordinator Integration

The `project-manager` delegates specific phase execution to the `sprint-coordinator`.

### Contract: Phase Execution Request
Sent from **project-manager** to **sprint-coordinator**.

```json
{
  "action": "execute-phase",
  "phase_id": "uuid",
  "config": {
    "sprint_duration_days": 3,
    "max_parallel_tasks": 5,
    "priority_focus": "quality"
  }
}
```

### Contract: Progress Updates
Polled by **project-manager** from **sprint-coordinator**.

```json
{
  "phase_id": "uuid",
  "sprint_status": "ACTIVE",
  "velocity_burn": 4.5,
  "completed_milestones": ["M-001", "M-002"],
  "open_blockers": []
}
```

## 2. task-router-mcp Integration

The `project-manager` uses the task router to orchestrate high-level "Phase Gates" and audits.

### Contract: Gate Audit Task
```json
{
  "task_id": "GATE-042",
  "executor": "codebase-orchestrator",
  "action": "verify-gate",
  "criteria": {
    "build": "SUCCESS",
    "lint": "< 5 warnings",
    "test_coverage": "> 90%"
  }
}
```

## 3. Signal Consumption

The `project-manager` listens for the following signals to update the global dashboard:
- **Build Status**: From CI/CD pipelines.
- **Git Tags**: To identify production releases.
- **Sentry Alerts**: To trigger risk-based blockers in post-deployment phases.
