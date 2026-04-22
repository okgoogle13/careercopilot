# Agent System Reference

This document records the active agent surface after harvest sanitization.

## Active Harvest Agents

### `prototype-harvest-manager`

- **Purpose:** orchestrate prototype review, support-only classification, owner mapping, and route-owned port sequencing
- **Primary inputs:** `control/workflow.md`, `control/route-matrix.md`, `control/COMET-MANIFEST.md`, `control/harvest-spec.md`
- **Delegates to:** `blueprint`, `subagent-driven-development`, `frontend-cleanup-manager`

### `frontend-cleanup-manager`

- **Purpose:** findings-first review for shell drift, support-only boundary violations, cleanup readiness, and final harvest checks
- **Primary inputs:** runtime truth, route matrix, prototype integration guidance, current prototype state
- **Uses downstream gates:** `token-enforcement`, `migration-audit`, `route-migration` when the workflow requires them

## Secondary Agents

- `test-automation-specialist` for test generation
- `test-runner` for verification execution
- `code-reviewer` for general review support outside the harvest authority loop

## Removed From Active Discovery

The following agents were removed because they advertised stale migration or scaffolding workflows:

- `design-project-manager`
- `m3-migration-architect`
- `frontend-specialist`
- `fullstack-integration-specialist`
- `mcp-orchestrator`

## Default Harvest Flow

```text
review / plan request
  -> prototype-harvest-manager
     -> blueprint (if planning needed)
     -> subagent-driven-development (if execution is approved)
     -> frontend-cleanup-manager (for review and closure)
```
