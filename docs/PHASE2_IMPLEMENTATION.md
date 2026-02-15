# Phase 2: Context Management Implementation Guide

**Status**: ✅ Complete
**Sprint**: 2 (Pipeline Automation)
**Phase**: 2 (Context Management)
**Deliverable**: Skills can access outputs from previous steps

---

## Overview

Phase 2 enables **multi-step workflow orchestration** by allowing skills to access outputs from previous execution stages. This eliminates manual parameter passing and enables automated pipelines like:

```
wireframe-annotator → m3-expressive-ui-evaluator → component-builder → deployment
```

Each skill automatically receives outputs from all previous stages via the context management system.

---

## Architecture

### Components

1. **ContextStorage** (`servers/storage/context_storage.py`)
   - File-based JSON persistence
   - Location: `~/.careercopilot/context/` (or `CONTEXT_STORAGE_PATH` env var)
   - Atomic writes prevent corruption
   - 24-hour TTL with automatic cleanup

2. **ContextManager** (`servers/context_manager.py`)
   - High-level workflow API
   - Wraps ContextStorage
   - Manages conversation lifecycle

3. **Skill Orchestrator MCP** (`servers/skill_orchestrator_mcp.py`)
   - Modified `execute_skill` tool with `context` parameter
   - Auto-retrieves previous outputs before execution
   - Auto-saves outputs after execution
   - Backward compatible (context optional)

### Context Schema

```python
{
    "conversation_id": str,          # UUID v4
    "workflow_name": str,            # e.g., "wireframe-to-code"
    "stages_completed": [str],       # e.g., ["wireframe-annotator"]
    "shared_context": {              # Workflow-wide parameters
        "project_name": str,
        "design_tokens_path": str
    },
    "stage_outputs": {               # Per-stage results
        "wireframe-annotator": {
            "file_path": "/tmp/wireframe.md",
            "score": 340
        }
    },
    "created_at": str,               # ISO 8601 timestamp
    "updated_at": str
}
```

---

## Usage Guide

### 1. Start a Workflow

```python
from servers.context_manager import ContextManager

manager = ContextManager()

# Initialize workflow with shared context
conversation_id = await manager.start_workflow(
    workflow_name="wireframe-to-code",
    shared_context={
        "project_name": "CareerCopilot",
        "design_tokens_path": "/frontend/src/design/tokens/tokens.json"
    }
)

print(f"Started workflow: {conversation_id}")
# Output: Started workflow: 123e4567-e89b-12d3-a456-426614174000
```

### 2. Execute Skills with Context

```python
from servers.skill_orchestrator_mcp import execute_skill

# Stage 1: Generate wireframe
result1 = execute_skill(
    skill_name="wireframe-annotator",
    arguments={"brief_path": "/tmp/design-brief.md"},
    context={"conversation_id": conversation_id}
)

print(result1)
# {
#     "status": "success",
#     "skill": "wireframe-annotator",
#     "output": {
#         "file_path": "/tmp/wireframe-annotator-output.md",
#         "score": 340
#     },
#     "context": {
#         "conversation_id": "123e4567-e89b-12d3-a456-426614174000",
#         "previous_stages_count": 0
#     }
# }

# Stage 2: Evaluate wireframe (receives Stage 1's outputs automatically)
result2 = execute_skill(
    skill_name="m3-expressive-ui-evaluator",
    arguments={},  # No explicit file_path needed - context provides it
    context={"conversation_id": conversation_id}
)

print(result2)
# {
#     "status": "success",
#     "skill": "m3-expressive-ui-evaluator",
#     "output": {
#         "score": 350,
#         "compliance_percentage": 95
#     },
#     "context": {
#         "conversation_id": "123e4567-e89b-12d3-a456-426614174000",
#         "previous_stages_count": 1  # Received Stage 1's outputs
#     }
# }
```

### 3. Access Previous Outputs

```python
# Retrieve all outputs from previous stages
previous_outputs = await manager.get_previous_outputs(conversation_id)

print(previous_outputs)
# {
#     "wireframe-annotator": {
#         "file_path": "/tmp/wireframe-annotator-output.md",
#         "score": 340
#     },
#     "m3-expressive-ui-evaluator": {
#         "score": 350,
#         "compliance_percentage": 95
#     }
# }
```

### 4. Check Workflow Status

```python
status = await manager.get_workflow_status(conversation_id)

print(status)
# {
#     "conversation_id": "123e4567-e89b-12d3-a456-426614174000",
#     "workflow_name": "wireframe-to-code",
#     "stages_completed": ["wireframe-annotator", "m3-expressive-ui-evaluator"],
#     "created_at": "2026-02-15T14:00:00",
#     "updated_at": "2026-02-15T14:05:00"
# }
```

### 5. Cleanup

```python
# Delete workflow context after completion
await manager.delete_workflow(conversation_id)

# Or cleanup all workflows older than 24 hours
deleted_count = await manager.cleanup_expired_workflows(ttl_hours=24)
print(f"Cleaned up {deleted_count} expired workflows")
```

---

## Workflow Examples

### Example 1: 2-Skill Pipeline

```python
async def run_wireframe_to_evaluation_workflow():
    """Simple 2-stage workflow: Generate wireframe → Evaluate compliance"""
    manager = ContextManager()

    # Start workflow
    conv_id = await manager.start_workflow(
        "wireframe-to-evaluation",
        {"project_name": "CareerCopilot"}
    )

    try:
        # Stage 1: Generate wireframe
        result1 = execute_skill(
            skill_name="wireframe-annotator",
            arguments={"brief_path": "/tmp/design-brief.md"},
            context={"conversation_id": conv_id}
        )

        if result1["status"] != "success":
            raise RuntimeError(f"Stage 1 failed: {result1}")

        # Stage 2: Evaluate wireframe
        result2 = execute_skill(
            skill_name="m3-expressive-ui-evaluator",
            arguments={},  # Receives Stage 1's file_path via context
            context={"conversation_id": conv_id}
        )

        if result2["status"] != "success":
            raise RuntimeError(f"Stage 2 failed: {result2}")

        print(f"Workflow complete. Final score: {result2['output']['score']}")

    finally:
        # Cleanup
        await manager.delete_workflow(conv_id)
```

### Example 2: 3-Skill Pipeline with Validation

```python
async def run_full_design_to_code_workflow():
    """Complete workflow: Wireframe → Evaluate → Build Component"""
    manager = ContextManager()

    conv_id = await manager.start_workflow(
        "design-to-code-full",
        {
            "project_name": "CareerCopilot",
            "design_tokens_path": "/frontend/src/design/tokens/tokens.json"
        }
    )

    try:
        # Stage 1: Generate wireframe
        result1 = execute_skill(
            skill_name="wireframe-annotator",
            arguments={"brief_path": "/tmp/design-brief.md"},
            validation={"min_score": 320},  # Require score ≥ 320
            context={"conversation_id": conv_id}
        )

        if result1["status"] == "validation_failed":
            print(f"Stage 1 validation failed: {result1['validation']}")
            return

        # Stage 2: Evaluate wireframe
        result2 = execute_skill(
            skill_name="m3-expressive-ui-evaluator",
            arguments={},
            validation={"min_score": 320},
            context={"conversation_id": conv_id}
        )

        if result2["status"] == "validation_failed":
            print(f"Stage 2 validation failed: {result2['validation']}")
            return

        # Stage 3: Build component (receives all previous outputs)
        result3 = execute_skill(
            skill_name="component-builder",
            arguments={"component_name": "DashboardCard"},
            context={"conversation_id": conv_id}
        )

        if result3["status"] != "success":
            raise RuntimeError(f"Stage 3 failed: {result3}")

        print("✅ Full workflow complete!")
        print(f"Generated component at: {result3['output']['file_path']}")

    finally:
        await manager.delete_workflow(conv_id)
```

### Example 3: Conditional Branching

```python
async def run_conditional_workflow():
    """Workflow with conditional retry logic based on validation scores"""
    manager = ContextManager()

    conv_id = await manager.start_workflow("conditional-retry")

    try:
        max_retries = 3
        retry_count = 0

        while retry_count < max_retries:
            result = execute_skill(
                skill_name="wireframe-annotator",
                arguments={"brief_path": "/tmp/design-brief.md"},
                validation={"min_score": 360},
                context={"conversation_id": conv_id}
            )

            if result["status"] == "success":
                print("✅ Validation passed!")
                break

            if result["status"] == "validation_failed":
                score = result["validation"]["score"]
                gap = result["validation"]["gap"]

                print(f"❌ Retry {retry_count + 1}/{max_retries}: Score {score} (gap: {gap})")
                retry_count += 1

        if retry_count >= max_retries:
            print("⚠️ Max retries exceeded. Workflow failed.")

    finally:
        await manager.delete_workflow(conv_id)
```

---

## Backward Compatibility

Phase 2 maintains **100% backward compatibility** with Phase 1:

```python
# Phase 1 usage (no context) - STILL WORKS
result = execute_skill(
    skill_name="wireframe-annotator",
    arguments={"brief_path": "/tmp/brief.md"}
)

# Phase 2 usage (with context) - NEW FEATURE
result = execute_skill(
    skill_name="wireframe-annotator",
    arguments={"brief_path": "/tmp/brief.md"},
    context={"conversation_id": conv_id}
)
```

If `context` parameter is omitted, the skill executes normally without context management.

---

## Configuration

### Environment Variables

```bash
# Context storage location (default: ~/.careercopilot/context/)
export CONTEXT_STORAGE_PATH="/custom/path/to/context"

# TTL for context cleanup in hours (default: 24)
export CONTEXT_TTL_HOURS=48

# Enable debug logging
export LOG_LEVEL=DEBUG
```

### Claude Desktop MCP Configuration

Update `~/.config/claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "skill-orchestrator": {
      "command": "/path/to/venv/bin/python3",
      "args": ["/path/to/servers/skill_orchestrator_mcp.py"],
      "env": {
        "CLAUDE_SKILLS_PATH": "/path/to/.claude/skills",
        "CONTEXT_STORAGE_PATH": "/path/to/context",
        "LOG_LEVEL": "INFO"
      }
    }
  }
}
```

Restart Claude Desktop after modifying config.

---

## Testing

### Run Integration Tests

```bash
cd /Users/okgoogle13/Desktop/careercopilot

# Activate virtual environment
source backend/venv/bin/activate

# Run Phase 2 integration tests
pytest servers/tests/integration/test_2skill_workflow.py -v

# Expected output:
# test_2skill_workflow_with_context PASSED
# test_workflow_without_context_still_works PASSED
# test_context_persistence_across_operations PASSED
# test_missing_context_returns_empty_previous_outputs PASSED
# test_shared_context_accessible_throughout_workflow PASSED
# test_validation_with_context PASSED
# test_context_cleanup PASSED
```

### Manual Testing

```bash
# Start MCP server
cd servers
python3 skill_orchestrator_mcp.py

# In another terminal, test 2-skill workflow
python3 -c "
import asyncio
from servers.context_manager import ContextManager
from servers.skill_orchestrator_mcp import execute_skill

async def test():
    manager = ContextManager()
    conv_id = await manager.start_workflow('manual-test')

    # Stage 1
    result1 = execute_skill(
        skill_name='wireframe-annotator',
        arguments={'brief_path': '/tmp/test.md'},
        context={'conversation_id': conv_id}
    )
    print(f'Stage 1: {result1}')

    # Stage 2
    result2 = execute_skill(
        skill_name='m3-expressive-ui-evaluator',
        arguments={},
        context={'conversation_id': conv_id}
    )
    print(f'Stage 2: {result2}')

    # Cleanup
    await manager.delete_workflow(conv_id)

asyncio.run(test())
"
```

---

## Troubleshooting

### Issue: "Context not found" Warning

**Symptom**: Log shows `Context not found for conversation {uuid}`

**Cause**: Conversation ID doesn't exist or context expired (>24 hours old)

**Solution**:
- Verify conversation_id is correct
- Check context storage path: `ls ~/.careercopilot/context/`
- Increase TTL: `export CONTEXT_TTL_HOURS=48`

### Issue: Previous Outputs Not Injected

**Symptom**: Stage 2 doesn't receive Stage 1's outputs

**Cause**: `context` parameter missing from `execute_skill` call

**Solution**:
```python
# ❌ Wrong - missing context
result = execute_skill(skill_name="stage2", arguments={})

# ✅ Correct - include context
result = execute_skill(
    skill_name="stage2",
    arguments={},
    context={"conversation_id": conv_id}
)
```

### Issue: "Failed to save output to context"

**Symptom**: Warning in logs after skill execution

**Cause**: Context storage path doesn't exist or insufficient permissions

**Solution**:
```bash
# Create storage directory
mkdir -p ~/.careercopilot/context

# Fix permissions
chmod 755 ~/.careercopilot/context
```

### Issue: Async Function Errors

**Symptom**: `RuntimeError: no running event loop`

**Cause**: Calling async functions from sync context incorrectly

**Solution**:
```python
# ❌ Wrong - can't await in sync function
def sync_function():
    result = await manager.get_previous_outputs(conv_id)

# ✅ Correct - use asyncio.run()
def sync_function():
    import asyncio
    result = asyncio.run(manager.get_previous_outputs(conv_id))

# ✅ Or make function async
async def async_function():
    result = await manager.get_previous_outputs(conv_id)
```

---

## Performance Considerations

- **Context Storage**: File-based JSON (fast for small contexts, <1MB)
- **Atomic Writes**: Temp file + `shutil.move()` prevents corruption
- **TTL Cleanup**: Run `cleanup_expired_workflows()` daily via cron
- **Memory**: Minimal overhead (~10KB per active conversation)

---

## Next Steps (Phase 3+)

**Phase 3: Workflow Orchestration** (Sprint 2 Week 3)
- Implement `run_workflow_stage` MCP tool for automated pipelines
- Multi-stage pipeline automation with auto-sequencing
- Conditional branching (if score < 320, retry with feedback)

**Phase 4: Validation & Retry** (Sprint 2 Week 4)
- Automatic retry logic with validation gates
- Feedback generation for failed stages
- Max retry limits per stage

**Phase 5: Delegation via MCP Task Router** (Sprint 3)
- Delegate Phase 3+ tasks to MCP Task Router
- Queue-based multi-agent orchestration
- Auto-claim and execute tasks from `/tmp/northcote-task-queue.json`

---

## References

- **Context Schema**: `.claude/plans/precious-spinning-lynx.md` (lines 274-297)
- **Agent-B Deliverables**: `.claude/plans/precious-spinning-lynx.md` (lines 166-230)
- **MCP Task Router**: `docs/architecture/mcp-skill-orchestration-server.md`
- **ContextStorage**: `servers/storage/context_storage.py`
- **ContextManager**: `servers/context_manager.py`
- **Integration Tests**: `servers/tests/integration/test_2skill_workflow.py`

---

**Version**: 1.0.0
**Last Updated**: 2026-02-15
**Maintainer**: Kerala Rage Design System Team
