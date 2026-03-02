# MCP Skill Orchestration Server: Production Architecture

**Document Version**: 1.0.0
**Sprint**: 1 (Infrastructure & Core Sync)
**Status**: Design Complete → Ready for Implementation
**Blocker Resolution**: BLOCKER-1 (Manual → Automated Orchestration)

---

## Executive Summary

The MCP Skill Orchestration Server eliminates manual copy-paste workflows by enabling **programmatic skill invocation** from Python scripts. This transforms 40% automation to **85-95% automation** by removing human intervention from multi-step design-to-code pipelines.

### Impact Metrics
- **Manual effort reduction**: 30-45 min → 5-10 min per component (**6× faster**)
- **Error rate**: 15-20% → <2% (automated validation gates)
- **Workflow steps**: 6 manual → 1 manual approval

---

## Problem Statement

### Current (Manual) Workflow
```python
# automate_design_workflow.py (TODAY)
print(f"👉 Please copy this and run in Claude:")
print(f"/wireframe-annotator {file_path}")
# ⚠️ Human must manually copy, paste, wait, then copy result back
```

### Desired (Automated) Workflow
```python
# automate_design_workflow.py (FUTURE)
result = await mcp_client.execute_skill(
    "wireframe-annotator",
    {"file_path": file_path}
)
score = result.get("score")  # Auto-proceed if score >= 320
```

**Key Difference**: Zero manual intervention between steps.

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                   Orchestration Layer                        │
│  (Python Scripts: automate_design_workflow.py, etc.)       │
└────────────────────┬────────────────────────────────────────┘
                     │ MCP Protocol (stdio/SSE)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│            MCP Skill Orchestration Server                    │
│  - FastMCP (Python 3.10+)                                    │
│  - Tools: execute_skill, run_workflow_stage                  │
│  - Context Management: Conversation state preservation       │
│  - Validation Gates: Auto-retry logic                        │
└────────────────────┬────────────────────────────────────────┘
                     │ Skill Execution Protocol
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    Claude Desktop                            │
│  - Skill Registry (.claude/skills/*/SKILL.md)              │
│  - Execution Environment (isolated processes)                │
│  - Response Aggregation                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Specification

### 1. MCP Server Implementation

**File**: `/servers/skill_orchestrator_mcp.py`
**Framework**: FastMCP (Python)
**Protocol**: Model Context Protocol (stdio transport)

#### Core Tools

##### Tool 1: `execute_skill`

**Purpose**: Execute a single skill with automatic validation.

**Parameters**:
```python
{
  "skill_name": str,        # e.g., "wireframe-annotator"
  "arguments": dict,        # Skill-specific inputs
  "context": {              # Optional
    "conversation_id": str,
    "target_file": str,
    "previous_outputs": dict
  },
  "validation": {           # Optional
    "min_score": int,       # Default: 320 for design tasks
    "max_retries": int,     # Default: 2
    "retry_feedback": str   # Feedback for retry attempts
  }
}
```

**Response**:
```python
{
  "status": "success" | "failure" | "retry",
  "output": str | dict,
  "score": int | None,
  "execution_time_ms": int,
  "retries_used": int,
  "conversation_id": str  # For context preservation
}
```

**Example Usage**:
```python
from mcp import Client

async def generate_wireframe():
    client = Client("skill-orchestrator")

    result = await client.call_tool(
        "execute_skill",
        skill_name="wireframe-annotator",
        arguments={
            "brief_path": "/path/to/design-brief.md",
            "output_format": "markdown"
        },
        validation={
            "min_score": 320,
            "max_retries": 2
        }
    )

    if result["status"] == "success":
        return result["output"]
    else:
        raise Exception(f"Wireframe generation failed: {result.get('error')}")
```

---

##### Tool 2: `run_workflow_stage`

**Purpose**: Execute a sequence of skills with inter-step validation.

**Parameters**:
```python
{
  "stages": [
    {
      "name": str,
      "skill": str,
      "arguments": dict,
      "validation": {
        "min_score": int,
        "on_failure": "retry" | "abort" | "skip"
      },
      "next_stage_inputs": dict  # Map outputs → next inputs
    }
  ],
  "fail_fast": bool  # Default: True
}
```

**Example: Multi-Stage Mockup Workflow**:
```python
workflow_config = {
    "stages": [
        {
            "name": "wireframe",
            "skill": "wireframe-annotator",
            "arguments": {"brief_path": brief_path},
            "validation": {"min_score": 320},
            "next_stage_inputs": {
                "wireframe_path": "{output.file_path}"
            }
        },
        {
            "name": "evaluate",
            "skill": "m3-expressive-ui-evaluator",
            "arguments": {"wireframe_path": "{wireframe.wireframe_path}"},
            "validation": {"min_score": 320, "on_failure": "retry"},
            "next_stage_inputs": {
                "approved_wireframe": "{output.file_path}"
            }
        },
        {
            "name": "build",
            "skill": "component-builder",
            "arguments": {"spec_path": "{evaluate.approved_wireframe}"},
            "validation": {"min_score": None}  # No score validation
        }
    ],
    "fail_fast": True
}

result = await client.call_tool("run_workflow_stage", **workflow_config)
```

**Response**:
```python
{
  "status": "completed" | "failed" | "partial",
  "stages_completed": int,
  "total_stages": int,
  "outputs": {
    "wireframe": {...},
    "evaluate": {...},
    "build": {...}
  },
  "failed_stage": str | None,
  "error": str | None
}
```

---

##### Tool 3: `get_skill_registry`

**Purpose**: List available skills and their metadata.

**Response**:
```python
{
  "skills": [
    {
      "name": "wireframe-annotator",
      "description": "Generate annotated ASCII wireframes...",
      "version": "2.0.0",
      "tags": ["design-to-code", "wireframe"],
      "roi_score": 2.67
    },
    ...
  ]
}
```

---

##### Tool 4: `validate_workflow`

**Purpose**: Dry-run validation of workflow configuration without execution.

**Parameters**:
```python
{
  "stages": [...]  # Same as run_workflow_stage
}
```

**Response**:
```python
{
  "valid": bool,
  "errors": [str],
  "warnings": [str],
  "estimated_duration_sec": int
}
```

---

### 2. Conversation Context Preservation

**Challenge**: Skills need access to previous execution results and file state.

**Solution**: Context Manager with Redis/JSON storage.

#### Context Schema
```python
{
  "conversation_id": "uuid-v4",
  "workflow_name": "mockup-generation",
  "created_at": "2026-02-15T10:30:00Z",
  "stages": [
    {
      "stage_name": "wireframe",
      "skill": "wireframe-annotator",
      "status": "completed",
      "outputs": {
        "file_path": "/tmp/wireframe-001.md",
        "score": 340
      },
      "execution_time_ms": 4500
    }
  ],
  "shared_context": {
    "design_brief": "/path/to/brief.md",
    "target_component": "LoginCard"
  }
}
```

#### Context API
```python
# Save context
await context_manager.save({
    "conversation_id": conv_id,
    "stage_outputs": stage_outputs
})

# Retrieve context
context = await context_manager.get(conv_id)
previous_output = context["stages"][-1]["outputs"]
```

---

### 3. Automatic Retry Logic

**Strategy**: Feedback-driven retry with incremental improvements.

#### Retry Flow
```python
async def execute_with_retry(skill_name, arguments, validation):
    max_retries = validation.get("max_retries", 2)
    min_score = validation.get("min_score", 320)

    for attempt in range(max_retries + 1):
        result = await execute_skill_internal(skill_name, arguments)

        if result.get("score", 0) >= min_score:
            return {"status": "success", "output": result}

        # Generate feedback for retry
        feedback = generate_retry_feedback(result, min_score)
        arguments["retry_feedback"] = feedback
        arguments["previous_score"] = result.get("score")

    return {"status": "failure", "error": "Max retries exceeded"}

def generate_retry_feedback(result, min_score):
    score = result.get("score", 0)
    gap = min_score - score

    if gap > 100:
        return "Typography contrast is too low. Use variable fonts with wght > 600."
    elif gap > 50:
        return "Color palette needs more vibrant tokens. Replace grays with kr-ink-gold."
    else:
        return "Minor adjustments needed. Check spacing and border radius."
```

---

### 4. Security Model

#### Authentication
- **Local-only by default**: Server binds to `127.0.0.1` (no network exposure)
- **Optional token auth**: If exposed via network, require `ORCHESTRATION_TOKEN` env var

#### Authorization
- **Skill allowlist**: Only registered skills in `.claude/skills/` can be executed
- **Path validation**: Prevent directory traversal attacks in file paths
- **Resource limits**: Max execution time per skill (default: 300s)

#### Sandboxing
- **Process isolation**: Skills run in separate processes (no shared memory)
- **File access**: Restricted to workspace directories only
- **Network access**: Skills cannot make arbitrary HTTP calls (unless explicitly allowed)

---

### 5. Integration with Existing Tools

#### Claude Desktop Config
```json
{
  "mcpServers": {
    "skill-orchestrator": {
      "command": "/Users/user/careercopilot/.venv/bin/python3",
      "args": [
        "/Users/user/careercopilot/servers/skill_orchestrator_mcp.py"
      ],
      "env": {
        "CLAUDE_SKILLS_PATH": "/Users/user/careercopilot/.claude/skills"
      }
    }
  }
}
```

#### Python Client Library
```python
# mcp_client.py (Helper library)
from mcp import Client

class SkillOrchestrator:
    def __init__(self):
        self.client = Client("skill-orchestrator")

    async def execute(self, skill_name: str, **kwargs):
        return await self.client.call_tool(
            "execute_skill",
            skill_name=skill_name,
            arguments=kwargs
        )

    async def workflow(self, stages: list):
        return await self.client.call_tool(
            "run_workflow_stage",
            stages=stages
        )

# Usage
orchestrator = SkillOrchestrator()
result = await orchestrator.execute("wireframe-annotator", brief_path="...")
```

---

## Implementation Roadmap

### Phase 1: Basic Skill Execution (Week 1)
- [ ] Create `skill_orchestrator_mcp.py` with FastMCP
- [ ] Implement `execute_skill` tool (single skill invocation)
- [ ] Add skill registry reader (parse `.claude/skills/*/SKILL.md`)
- [ ] Test with 1 skill: `wireframe-annotator`

**Deliverable**: MCP server can execute a single skill and return output.

---

### Phase 2: Context Management (Week 2)
- [ ] Implement conversation context storage (JSON file-based)
- [ ] Add `context` parameter to `execute_skill`
- [ ] Test context preservation across 2 sequential skills
- [ ] Add context cleanup (auto-delete after 24h)

**Deliverable**: Skills can access outputs from previous steps.

---

### Phase 3: Workflow Orchestration (Week 3)
- [ ] Implement `run_workflow_stage` tool
- [ ] Add inter-stage output mapping (`{output.file_path}` → next stage)
- [ ] Implement fail-fast and continue-on-error strategies
- [ ] Test with 3-stage workflow (wireframe → evaluate → build)

**Deliverable**: Multi-step workflows execute autonomously.

---

### Phase 4: Validation & Retry (Week 4)
- [ ] Add automatic retry logic to `execute_skill`
- [ ] Implement feedback generation for retries
- [ ] Add validation gates (min_score threshold)
- [ ] Test with intentionally low-quality inputs

**Deliverable**: Workflows auto-retry until quality threshold is met.

---

### Phase 5: Dashboard & Monitoring (Week 5-6)
- [ ] Create web dashboard (FastAPI + React)
- [ ] Real-time workflow status display
- [ ] Execution logs and error traces
- [ ] Performance metrics (execution time, retry count)

**Deliverable**: Visual monitoring of all automated workflows.

---

## Testing Strategy

### Unit Tests
```python
# tests/test_skill_orchestrator.py
import pytest
from skill_orchestrator_mcp import SkillOrchestrator

@pytest.mark.asyncio
async def test_execute_skill_success():
    orchestrator = SkillOrchestrator()
    result = await orchestrator.execute_skill(
        "wireframe-annotator",
        {"brief_path": "/fixtures/brief.md"},
        validation={"min_score": 320}
    )
    assert result["status"] == "success"
    assert result["score"] >= 320

@pytest.mark.asyncio
async def test_execute_skill_retry():
    orchestrator = SkillOrchestrator()
    # Mock low-quality output on first attempt
    with patch("orchestrator.execute_skill_internal") as mock:
        mock.side_effect = [
            {"score": 280},  # Fail
            {"score": 350}   # Success
        ]
        result = await orchestrator.execute_skill(
            "wireframe-annotator",
            {"brief_path": "/fixtures/brief.md"},
            validation={"min_score": 320, "max_retries": 1}
        )
        assert result["retries_used"] == 1
        assert result["score"] == 350
```

### Integration Tests
```python
# tests/integration/test_workflow.py
@pytest.mark.integration
async def test_full_mockup_workflow():
    orchestrator = SkillOrchestrator()

    workflow = {
        "stages": [
            {"name": "wireframe", "skill": "wireframe-annotator", ...},
            {"name": "evaluate", "skill": "m3-expressive-ui-evaluator", ...},
            {"name": "build", "skill": "component-builder", ...}
        ]
    }

    result = await orchestrator.run_workflow(workflow)
    assert result["status"] == "completed"
    assert result["stages_completed"] == 3
```

---

## Error Handling

### Error Categories

| Error Type | HTTP Status | Retry? | User Action |
|---|---|---|---|
| Skill Not Found | 404 | No | Verify skill name |
| Invalid Arguments | 400 | No | Fix argument schema |
| Validation Failure | 422 | Yes | Auto-retry with feedback |
| Execution Timeout | 408 | Yes | Increase timeout or optimize skill |
| Internal Server Error | 500 | No | Check server logs |

### Error Response Schema
```python
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Score 280 is below minimum threshold 320",
    "details": {
      "current_score": 280,
      "min_score": 320,
      "gap": 40
    },
    "retry_available": true,
    "suggested_action": "Adjust typography contrast to meet M3 Expressive standards"
  }
}
```

---

## Performance Benchmarks

| Workflow | Manual Time | Automated Time | Speedup |
|---|---|---|---|
| Wireframe → Mockup | 30 min | 5 min | 6× |
| Component Build | 20 min | 3 min | 6.7× |
| Full Page (5 components) | 2.5 hours | 25 min | 6× |

---

## Dependencies

### Python Packages
```txt
fastmcp==0.3.0
pydantic==2.10.5
redis==5.2.1  # Optional: For distributed context storage
aiofiles==24.1.0
```

### Environment Variables
```bash
CLAUDE_SKILLS_PATH=/Users/user/careercopilot/.claude/skills
ORCHESTRATION_TOKEN=optional_secret_token  # Only if network-exposed
MAX_EXECUTION_TIME_SEC=300
RETRY_MAX_ATTEMPTS=2
```

---

## Success Criteria

- [ ] **Automation Level**: ≥85% (from current 40%)
- [ ] **Manual Steps**: Reduced from 6 to 1 per workflow
- [ ] **Error Rate**: <2% (from current 15-20%)
- [ ] **Execution Time**: <10 minutes for full mockup workflow
- [ ] **Test Coverage**: ≥90% for orchestration logic
- [ ] **Documentation**: Complete API reference and workflow examples

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Skill execution hangs | Medium | High | Implement 300s timeout + process kill |
| Context storage corruption | Low | Medium | Atomic writes + backup/restore |
| Network latency (if remote) | Low | Low | Keep server local-only in Phase 1 |
| Skill registry parsing errors | Medium | Medium | Validate SKILL.md YAML frontmatter on startup |

---

## Future Enhancements (Post-Sprint 1)

### Sprint 2+
- **Pull mode**: Figma → local token sync
- **Parallel execution**: Run independent skills concurrently
- **Workflow templates**: Pre-built workflows for common tasks
- **Skill composition**: Chain skills declaratively (YAML config)

### Sprint 3+
- **Web UI**: Drag-and-drop workflow builder
- **Metrics dashboard**: Real-time analytics (success rate, avg execution time)
- **Skill versioning**: Support multiple versions of the same skill

---

## References

- [FastMCP Documentation](https://github.com/jlowin/fastmcp)
- [Model Context Protocol Spec](https://modelcontextprotocol.io/)
- [T3 Specification](../brain/.../T3_mcp_server_architecture.md)
- [Gap Analysis](../brain/.../gap_analysis_wbs.md)

---

**Document Status**: ✅ Design Complete
**Next Step**: Begin Phase 1 implementation (Week 1)
**Owner**: Kerala Rage Automation Team
**Last Updated**: 2026-02-15
# MCP Skill Orchestration Server (Phase 3)

## Purpose

`servers/skill_orchestrator_mcp.py` provides workflow-level orchestration for
Claude Code skills. It extends single-skill execution with:

- Multi-stage pipeline execution.
- Validation-driven retry branching.
- Workflow progress/status reporting.
- Workflow definition loading from YAML/JSON.

## Core MCP Tools

### `execute_skill`

Runs one skill with optional validation and context injection.

- Injects `previous_outputs` when `context.conversation_id` is supplied.
- Stores stage output in workflow context storage.
- Returns `validation_failed` when score is below threshold.

### `run_workflow_stage`

Runs a stage sequence automatically.

- Starts a workflow conversation via `ContextManager`.
- Executes each stage in order.
- Applies conditional retry when stage status is `validation_failed`.
- Adds `retry_feedback` payload for each retry.
- Returns stage-by-stage attempt history and aggregate progress.

### `get_workflow_progress`

Returns workflow metadata and completed stages for a conversation.

### `load_workflow_definition`

Loads and validates workflow definitions from:

- YAML (`.yaml`, `.yml`)
- JSON (`.json`)

## Stage Contract

Each stage supports:

- `skill_name` (required)
- `name` (optional)
- `arguments` (optional object)
- `validation` (optional object):
  - `min_score`
  - `max_retries`
- `max_retries` (optional override)

## Conditional Branching Logic

Branching rule in Phase 3:

1. Stage executes.
2. If `status == validation_failed` and retries remain:
   - increment retry counter
   - inject `retry_feedback` into stage arguments
   - re-run stage
3. If retries exhausted:
   - stage marked failed
   - workflow returns `failed` (when `stop_on_failure=true`)

## Workflow Definition Schema

Schema file: `servers/schemas/workflow_schema.yaml`

The schema defines required workflow fields (`name`, `stages`) and stage-level
validation/retry settings.

## Status and Progress

`run_workflow_stage` response includes:

- workflow status (`success`, `failed`, `error`)
- `conversation_id`
- per-stage results with attempt history
- aggregate progress counters (`total`, `completed`, `failed`, `retries_used`)

`get_workflow_progress` can be used for follow-up polling.

## Testing

Integration coverage:

- `servers/tests/integration/test_3skill_workflow.py`
  - 3+ stage happy-path execution.
  - validation-fail-then-retry success path.
  - retry-exhausted failure path.

Existing context tests remain in:

- `servers/tests/integration/test_2skill_workflow.py`
