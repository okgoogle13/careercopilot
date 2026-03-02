#!/usr/bin/env python3
"""
Integration Test: 2-Skill Workflow with Context Management

Tests the Phase 2 deliverable: "Skills can access outputs from previous steps"

Workflow:
1. Stage 1: wireframe-annotator generates wireframe.md with score 340
2. Stage 2: m3-expressive-ui-evaluator receives Stage 1's file_path via context
3. Verify Stage 2 can access Stage 1's outputs through context management

This test validates the full context management pipeline:
- ContextStorage saves/loads context from filesystem
- ContextManager provides high-level workflow API
- execute_skill tool retrieves previous outputs and injects into arguments
"""

import pytest
import asyncio
import uuid
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, Any

# Add project root to Python path
project_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(project_root))

# Import components under test
from servers.context_manager import ContextManager
from servers.storage import ContextStorage
from servers.skill_orchestrator_mcp import execute_skill, registry


@pytest.fixture
async def workflow_context():
    """
    Create a test workflow context with conversation_id.

    Returns:
        Dict with conversation_id and cleanup function
    """
    manager = ContextManager()

    # Start a new workflow
    conv_id = await manager.start_workflow(
        workflow_name="wireframe-to-code",
        shared_context={
            "project_name": "CareerCopilot",
            "design_tokens_path": "/frontend/src/design/tokens/tokens.json"
        }
    )

    yield {
        "conversation_id": conv_id,
        "manager": manager
    }

    # Cleanup: Delete workflow context after test
    await manager.delete_workflow(conv_id)


@pytest.mark.asyncio
async def test_2skill_workflow_with_context(workflow_context):
    """
    Test that Stage 2 can access Stage 1's outputs via context.

    This is the PRIMARY acceptance test for Phase 2 deliverable.
    """
    conv_id = workflow_context["conversation_id"]
    manager = workflow_context["manager"]

    # Stage 1: Execute wireframe-annotator
    result1 = execute_skill(
        skill_name="wireframe-annotator",
        arguments={"brief_path": "/tmp/design-brief.md"},
        context={"conversation_id": conv_id}
    )

    # Verify Stage 1 succeeded
    assert result1["status"] == "success", f"Stage 1 failed: {result1}"
    assert result1["skill"] == "wireframe-annotator"
    assert "output" in result1
    assert "file_path" in result1["output"]
    assert result1["output"]["score"] == 340

    # Verify Stage 1 saved to context
    stage1_file_path = result1["output"]["file_path"]
    previous_outputs = await manager.get_previous_outputs(conv_id)
    assert "wireframe-annotator" in previous_outputs
    assert previous_outputs["wireframe-annotator"]["file_path"] == stage1_file_path

    # Stage 2: Execute m3-expressive-ui-evaluator (should receive Stage 1's outputs)
    result2 = execute_skill(
        skill_name="m3-expressive-ui-evaluator",
        arguments={},  # No explicit file_path needed - context provides it
        context={"conversation_id": conv_id}
    )

    # Verify Stage 2 succeeded
    assert result2["status"] == "success", f"Stage 2 failed: {result2}"
    assert result2["skill"] == "m3-expressive-ui-evaluator"

    # CRITICAL ASSERTION: Verify Stage 2 received Stage 1's outputs via context
    # The execute_skill tool should inject previous_outputs into arguments
    # This proves Phase 2 deliverable: "Skills can access outputs from previous steps"
    assert "context" in result2, "Context metadata missing from Stage 2 response"
    assert result2["context"]["conversation_id"] == conv_id
    assert result2["context"]["previous_stages_count"] == 1, "Stage 2 should see 1 previous stage"

    # Verify workflow status
    status = await manager.get_workflow_status(conv_id)
    assert status is not None
    assert status["workflow_name"] == "wireframe-to-code"
    assert len(status["stages_completed"]) == 2
    assert "wireframe-annotator" in status["stages_completed"]
    assert "m3-expressive-ui-evaluator" in status["stages_completed"]


@pytest.mark.asyncio
async def test_workflow_without_context_still_works():
    """
    Test backward compatibility: execute_skill without context parameter.

    Ensures Phase 1 functionality still works (no regression).
    """
    result = execute_skill(
        skill_name="wireframe-annotator",
        arguments={"brief_path": "/tmp/design-brief.md"}
        # No context parameter - should work fine (backward compatible)
    )

    assert result["status"] == "success"
    assert result["skill"] == "wireframe-annotator"
    assert "output" in result

    # Context metadata should be absent (since no context provided)
    assert "context" not in result


@pytest.mark.asyncio
async def test_context_persistence_across_operations(workflow_context):
    """
    Test that context persists across multiple save/load operations.
    """
    conv_id = workflow_context["conversation_id"]
    manager = workflow_context["manager"]

    # Execute 3 skills sequentially
    skills = ["wireframe-annotator", "m3-expressive-ui-evaluator", "component-builder"]

    for skill_name in skills:
        result = execute_skill(
            skill_name=skill_name,
            arguments={"test_arg": f"value_for_{skill_name}"},
            context={"conversation_id": conv_id}
        )

        assert result["status"] == "success"

    # Verify all 3 stages are in context
    previous_outputs = await manager.get_previous_outputs(conv_id)
    assert len(previous_outputs) == 3

    for skill_name in skills:
        assert skill_name in previous_outputs, f"Missing output for {skill_name}"

    # Verify workflow status shows all completed stages
    status = await manager.get_workflow_status(conv_id)
    assert len(status["stages_completed"]) == 3
    assert status["stages_completed"] == skills


@pytest.mark.asyncio
async def test_missing_context_returns_empty_previous_outputs(workflow_context):
    """
    Test graceful degradation when conversation_id doesn't exist.
    """
    manager = workflow_context["manager"]

    # Use non-existent conversation_id
    fake_conv_id = str(uuid.uuid4())

    # Should return empty dict (graceful degradation)
    previous_outputs = await manager.get_previous_outputs(fake_conv_id)
    assert previous_outputs == {}


@pytest.mark.asyncio
async def test_shared_context_accessible_throughout_workflow(workflow_context):
    """
    Test that shared context parameters are accessible to all stages.
    """
    conv_id = workflow_context["conversation_id"]
    manager = workflow_context["manager"]

    # Verify shared context was set during workflow initialization
    shared = await manager.get_shared_context(conv_id)
    assert shared["project_name"] == "CareerCopilot"
    assert shared["design_tokens_path"] == "/frontend/src/design/tokens/tokens.json"

    # Execute a skill
    execute_skill(
        skill_name="wireframe-annotator",
        arguments={"brief_path": "/tmp/brief.md"},
        context={"conversation_id": conv_id}
    )

    # Shared context should still be accessible (unchanged)
    shared_after = await manager.get_shared_context(conv_id)
    assert shared_after == shared


@pytest.mark.asyncio
async def test_validation_with_context():
    """
    Test that validation rules work correctly with context management.
    """
    manager = ContextManager()

    # Start workflow
    conv_id = await manager.start_workflow("test-validation-workflow")

    try:
        # Execute skill with validation that will fail (score 340 < min 360)
        result = execute_skill(
            skill_name="wireframe-annotator",
            arguments={"brief_path": "/tmp/brief.md"},
            validation={"min_score": 360, "max_retries": 2},
            context={"conversation_id": conv_id}
        )

        # Should fail validation but still save to context
        assert result["status"] == "validation_failed"
        assert result["validation"]["score"] == 340
        assert result["validation"]["min_score"] == 360
        assert result["validation"]["gap"] == 20
        assert result["validation"]["retries_available"] is True

        # Context should still be saved (validation failure doesn't prevent context save)
        previous_outputs = await manager.get_previous_outputs(conv_id)
        assert "wireframe-annotator" in previous_outputs

    finally:
        await manager.delete_workflow(conv_id)


@pytest.mark.asyncio
async def test_context_cleanup():
    """
    Test that expired workflows can be cleaned up.
    """
    manager = ContextManager()

    # Create 2 workflows
    conv_id1 = await manager.start_workflow("workflow-1")
    conv_id2 = await manager.start_workflow("workflow-2")

    # Execute a skill in workflow 1
    execute_skill(
        skill_name="wireframe-annotator",
        arguments={"brief_path": "/tmp/brief.md"},
        context={"conversation_id": conv_id1}
    )

    # Manually delete workflow 1 (simulating cleanup)
    deleted = await manager.delete_workflow(conv_id1)
    assert deleted is True

    # Workflow 1 should be gone
    status1 = await manager.get_workflow_status(conv_id1)
    assert status1 is None

    # Workflow 2 should still exist
    status2 = await manager.get_workflow_status(conv_id2)
    assert status2 is not None
    assert status2["workflow_name"] == "workflow-2"

    # Cleanup workflow 2
    await manager.delete_workflow(conv_id2)


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--asyncio-mode=auto"])
