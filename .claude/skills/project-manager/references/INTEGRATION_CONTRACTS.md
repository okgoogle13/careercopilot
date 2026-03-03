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

## 4. Phase Completion Handoff

When `project-manager` reaches `PHASE_COMPLETE` state, it emits a completion event with next-step recommendations.

### Contract: Phase Completion Event

Broadcast from **project-manager** to stakeholders and downstream systems.

```json
{
  "event": "phase_complete",
  "phase_id": "phase-2",
  "phase_name": "Component Migration Remediation",
  "completion_date": "2026-02-22T18:45:00Z",
  "metrics": {
    "duration_days": 7,
    "tasks_completed": 12,
    "compliance_achieved": 99,
    "velocity": 1.7
  },
  "next_recommendations": [
    "Conduct sprint retrospective",
    "Monitor production deployment",
    "Plan next sprint"
  ],
  "next_phase": {
    "phase_id": "phase-3",
    "phase_name": "StatusBadge Migration",
    "kickoff_suggested": "2026-02-26",
    "preparation_items": [
      "Review Phase 2 lessons learned",
      "Verify no UI regressions from token migrations",
      "Prepare component-transformer for remaining legacy tokens"
    ]
  }
}
```

### Workflow Actions

1. **Notify Stakeholders**: Publish completion summary to designated communication channels (Slack, email, etc.)
2. **Trigger Next Phase**: If applicable, initiate phase kickoff preparation workflow
3. **Archive Artifacts**: Tag release in Git, close completed tasks in task-router queue, update project documentation
