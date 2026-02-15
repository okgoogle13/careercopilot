# Phase 3+ MCP Task Router Delegation Guide

**Status**: Ready for delegation
**Created**: 2026-02-15
**Queue Location**: `/tmp/kerala-rage-task-queue.json`

---

## Overview

Phase 2 Context Management is complete. Per your explicit request to **"delegate as much via sidekick server as possible"**, Phase 3+ tasks are now managed via MCP Task Router for multi-agent orchestration.

---

## Current Queue Status

```
Total tasks: 4
✅ Completed: 3
⏳ Pending: 1

Task History:
1. ✅ mockup-workflow-optimization-execution (Sprint 1)
2. ✅ sprint-2-mcp-orchestration-phase1 (Phase 1: Basic Skill Execution)
3. ✅ sprint-2-context-management (Phase 2: Context Management)
4. ⏳ sprint-2-workflow-orchestration-phase3 (Phase 3: PENDING)
```

---

## Phase 3 Task Details

**Task ID**: `sprint-2-workflow-orchestration-phase3`
**Assigned to**: `mcp-task-router`
**Status**: `pending`
**Priority**: `critical`

### Deliverables
1. Implement `run_workflow_stage` MCP tool for automated pipelines
2. Add multi-stage workflow sequencing (wireframe → evaluate → code → test)
3. Implement conditional branching based on validation scores
4. Add workflow status tracking and progress reporting
5. Create workflow definition schema (YAML or JSON)
6. Write integration tests for 3+ stage workflows
7. Document workflow orchestration patterns

### Acceptance Criteria
1. ✅ Can execute multi-stage workflows automatically
2. ✅ Conditional branching works (if score < 320, retry with feedback)
3. ✅ Workflow status tracked and queryable
4. ✅ Integration test with 3-skill workflow passes
5. ✅ Documentation complete with workflow examples

### Context from Phase 2
- `context_manager_available`: ✅ True
- `execute_skill_supports_context`: ✅ True
- `previous_outputs_accessible`: ✅ True
- `storage_location`: `~/.careercopilot/context/`

---

## How to Execute Phase 3 via MCP Task Router

### Option 1: Claude Desktop with MCP Server

**1. Configure Claude Desktop**

Add to `~/.config/claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "task-router": {
      "command": "/Users/okgoogle13/Desktop/careercopilot/backend/venv/bin/python3",
      "args": ["/Users/okgoogle13/Desktop/careercopilot/servers/task_router_mcp.py"],
      "env": {
        "QUEUE_FILE": "/tmp/kerala-rage-task-queue.json"
      }
    },
    "skill-orchestrator": {
      "command": "/Users/okgoogle13/Desktop/careercopilot/backend/venv/bin/python3",
      "args": ["/Users/okgoogle13/Desktop/careercopilot/servers/skill_orchestrator_mcp.py"],
      "env": {
        "CLAUDE_SKILLS_PATH": "/Users/okgoogle13/Desktop/careercopilot/.claude/skills",
        "CONTEXT_STORAGE_PATH": "/Users/okgoogle13/.careercopilot/context"
      }
    }
  }
}
```

**2. Restart Claude Desktop**

```bash
# Quit Claude Desktop completely
# Restart Claude Desktop
# Verify MCP servers are loaded (check status indicator)
```

**3. Delegate Task Execution**

In Claude Desktop chat:

```
Please execute the pending task "sprint-2-workflow-orchestration-phase3"
from the MCP Task Router queue.

Use the following MCP tools:
1. list_tasks(status="pending") - View pending tasks
2. claim_task(task_id="sprint-2-workflow-orchestration-phase3", agent="claude-desktop") - Claim the task
3. [Execute Phase 3 implementation work]
4. complete_task(task_id="sprint-2-workflow-orchestration-phase3", outputs={...}) - Mark complete
```

Claude Desktop will:
- Connect to `task-router` MCP server
- List pending tasks
- Claim Phase 3 task
- Execute implementation (using `skill-orchestrator` MCP server)
- Report completion with outputs

---

### Option 2: Python Script with MCP Tools

**Direct execution using task_router_mcp.py**:

```python
#!/usr/bin/env python3
"""Execute Phase 3 task via MCP Task Router"""

import sys
sys.path.insert(0, '/Users/okgoogle13/Desktop/careercopilot')

from servers.task_router_mcp import list_tasks, claim_task, complete_task

# 1. View pending tasks
pending = list_tasks(status="pending")
print(f"Pending tasks: {pending}")

# 2. Claim Phase 3 task
claim_result = claim_task(
    task_id="sprint-2-workflow-orchestration-phase3",
    agent="python-executor"
)
print(f"Claimed: {claim_result}")

# 3. Execute Phase 3 implementation
# [Implementation work happens here]
# - Create run_workflow_stage MCP tool
# - Add workflow sequencing logic
# - Implement conditional branching
# - Write tests

# 4. Complete task
complete_result = complete_task(
    task_id="sprint-2-workflow-orchestration-phase3",
    outputs={
        "phase_3_status": "completed",
        "deliverables": [
            "run_workflow_stage MCP tool implemented",
            "Multi-stage sequencing working",
            "Conditional branching tested",
            "Integration tests passing"
        ]
    }
)
print(f"Completed: {complete_result}")
```

---

### Option 3: Manual Task Queue Management

**View queue**:
```bash
cat /tmp/kerala-rage-task-queue.json | python3 -m json.tool
```

**Claim task**:
```python
import json
from datetime import datetime

with open('/tmp/kerala-rage-task-queue.json', 'r') as f:
    tasks = json.load(f)

# Find Phase 3 task
task = next(t for t in tasks if t['task_id'] == 'sprint-2-workflow-orchestration-phase3')

# Claim it
task['status'] = 'in_progress'
task['claimed_by'] = 'manual-executor'
task['claimed_at'] = datetime.now().isoformat()
task['history'].append({
    "event": "claimed",
    "agent": "manual-executor",
    "timestamp": datetime.now().isoformat()
})

with open('/tmp/kerala-rage-task-queue.json', 'w') as f:
    json.dump(tasks, f, indent=2)
```

---

## Phase 3 Implementation Checklist

### 1. Create `run_workflow_stage` MCP Tool

**File**: `servers/skill_orchestrator_mcp.py`

```python
@mcp.tool()
async def run_workflow_stage(
    workflow_name: str,
    stages: List[Dict[str, Any]],
    shared_context: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Execute multi-stage workflow automatically.

    Args:
        workflow_name: Name of the workflow (e.g., "wireframe-to-code")
        stages: List of stage definitions with skill_name, arguments, validation
        shared_context: Workflow-wide parameters

    Returns:
        Workflow execution result with all stage outputs

    Example:
        stages = [
            {
                "skill_name": "wireframe-annotator",
                "arguments": {"brief_path": "/tmp/brief.md"},
                "validation": {"min_score": 320}
            },
            {
                "skill_name": "m3-expressive-ui-evaluator",
                "arguments": {},  # Gets previous outputs via context
                "validation": {"min_score": 320}
            },
            {
                "skill_name": "component-builder",
                "arguments": {"component_name": "DashboardCard"}
            }
        ]
    """
    # Start workflow
    conv_id = await context_manager.start_workflow(workflow_name, shared_context)

    results = []
    for stage in stages:
        # Execute stage
        result = execute_skill(
            skill_name=stage["skill_name"],
            arguments=stage.get("arguments", {}),
            validation=stage.get("validation"),
            context={"conversation_id": conv_id}
        )

        # Check validation
        if result["status"] == "validation_failed":
            # Conditional branching: retry with feedback
            if stage.get("max_retries", 0) > 0:
                # Retry logic here
                pass
            else:
                # Workflow failed
                return {
                    "status": "failed",
                    "failed_stage": stage["skill_name"],
                    "reason": result["validation"]
                }

        results.append(result)

    # Cleanup
    await context_manager.delete_workflow(conv_id)

    return {
        "status": "success",
        "workflow_name": workflow_name,
        "stages_completed": len(results),
        "results": results
    }
```

### 2. Workflow Definition Schema

**File**: `servers/schemas/workflow_schema.yaml`

```yaml
workflow:
  name: wireframe-to-code
  description: Complete design-to-code pipeline

  shared_context:
    project_name: CareerCopilot
    design_tokens_path: /frontend/src/design/tokens/tokens.json

  stages:
    - name: wireframe-generation
      skill: wireframe-annotator
      arguments:
        brief_path: /tmp/design-brief.md
      validation:
        min_score: 320
        max_retries: 2

    - name: design-evaluation
      skill: m3-expressive-ui-evaluator
      arguments: {}  # Previous outputs injected via context
      validation:
        min_score: 320
        max_retries: 1

    - name: component-generation
      skill: component-builder
      arguments:
        component_name: DashboardCard
      conditional:
        - if: previous_stage.score >= 350
          then: use_advanced_templates
```

### 3. Integration Test

**File**: `servers/tests/integration/test_3skill_workflow.py`

```python
async def test_3skill_workflow_orchestration():
    """Test automated 3-stage workflow execution."""

    stages = [
        {
            "skill_name": "wireframe-annotator",
            "arguments": {"brief_path": "/tmp/brief.md"},
            "validation": {"min_score": 320}
        },
        {
            "skill_name": "m3-expressive-ui-evaluator",
            "arguments": {},
            "validation": {"min_score": 320}
        },
        {
            "skill_name": "component-builder",
            "arguments": {"component_name": "TestCard"}
        }
    ]

    result = await run_workflow_stage(
        workflow_name="test-3stage-pipeline",
        stages=stages
    )

    assert result["status"] == "success"
    assert result["stages_completed"] == 3
    assert len(result["results"]) == 3
```

---

## Expected Timeline

**Phase 3 Implementation**: 4-6 hours
- Tool implementation: 2 hours
- Workflow schema: 1 hour
- Testing: 2 hours
- Documentation: 1 hour

**Total Sprint 2 Time** (Phases 1-3): 13-16 hours
- Phase 1: 3 hours ✅
- Phase 2: 4 hours ✅
- Phase 3: 6 hours (delegated)

---

## Monitoring Progress

**Check task status**:
```python
from servers.task_router_mcp import list_tasks

# View all tasks
all_tasks = list_tasks()

# View Phase 3 specifically
phase3_tasks = list_tasks(status="in_progress")
```

**View task history**:
```bash
cat /tmp/kerala-rage-task-queue.json | \
  python3 -c "import sys, json; tasks=json.load(sys.stdin); \
  task=[t for t in tasks if t['task_id']=='sprint-2-workflow-orchestration-phase3'][0]; \
  print('\n'.join([f\"{h['event']}: {h['timestamp']}\" for h in task['history']]))"
```

---

## Success Criteria

Phase 3 is complete when:

1. ✅ `run_workflow_stage` MCP tool implemented and functional
2. ✅ Can execute 3+ stage workflows automatically
3. ✅ Conditional branching tested (retry on validation failure)
4. ✅ Integration test passes with real skills
5. ✅ Documentation complete with workflow examples
6. ✅ Task marked as `completed` in queue with outputs

---

## Next Steps (Phase 4)

After Phase 3 completion, the MCP Task Router will auto-create Phase 4 task:

**Phase 4: Validation & Retry Logic**
- Automatic retry with feedback generation
- Max retry limits per stage
- Feedback loop integration
- Enhanced error reporting

---

## References

- **Architecture Spec**: [docs/architecture/mcp-skill-orchestration-server.md](../architecture/mcp-skill-orchestration-server.md)
- **Phase 2 Implementation**: [PHASE2_IMPLEMENTATION.md](PHASE2_IMPLEMENTATION.md)
- **MCP Server Config**: [mcp-server-configuration.md](mcp-server-configuration.md)
- **Task Router Source**: [servers/task_router_mcp.py](../servers/task_router_mcp.py)
- **Skill Orchestrator Source**: [servers/skill_orchestrator_mcp.py](../servers/skill_orchestrator_mcp.py)

---

**Status**: ✅ Ready for Phase 3 delegation via MCP Task Router
**Last Updated**: 2026-02-15
**Maintainer**: Kerala Rage Design System Team
