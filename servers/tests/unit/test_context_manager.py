"""
Unit tests for ContextManager.

Tests workflow orchestration, stage output management, and context retrieval.
Uses MockContextManager initially, replace with real implementation at hour 6.
"""

import pytest
from servers.tests.fixtures.mock_skills import MockContextStorage, MockContextManager
import uuid
from datetime import datetime


@pytest.fixture
def storage():
    """Provide fresh storage instance."""
    return MockContextStorage()


@pytest.fixture
def context_manager(storage):
    """Provide ContextManager instance with storage."""
    return MockContextManager(storage)


@pytest.mark.asyncio
async def test_start_workflow(context_manager):
    """Test workflow initialization."""
    conv_id = await context_manager.start_workflow("test-workflow")

    # Verify valid UUID
    assert conv_id is not None
    assert uuid.UUID(conv_id)


@pytest.mark.asyncio
async def test_start_workflow_with_shared_context(context_manager, storage):
    """Test workflow initialization with shared context."""
    shared = {
        "project_name": "test-project",
        "tokens_path": "/path/to/tokens.json",
        "user_id": "user-123"
    }

    conv_id = await context_manager.start_workflow(
        "design-workflow",
        shared_context=shared
    )

    # Verify shared context was saved
    context = await storage.get(conv_id)
    assert context["shared_context"]["project_name"] == "test-project"
    assert context["shared_context"]["tokens_path"] == "/path/to/tokens.json"


@pytest.mark.asyncio
async def test_save_stage_output(context_manager, storage):
    """Test saving stage output."""
    conv_id = await context_manager.start_workflow("test-workflow")

    result = await context_manager.save_stage_output(
        conv_id,
        "wireframe-annotator",
        {"file_path": "/tmp/wireframe.md", "score": 340}
    )

    assert result is True

    # Verify it was saved
    context = await storage.get(conv_id)
    assert "wireframe-annotator" in context["stage_outputs"]
    assert context["stage_outputs"]["wireframe-annotator"]["score"] == 340


@pytest.mark.asyncio
async def test_save_stage_output_invalid_conversation(context_manager):
    """Test saving to non-existent conversation returns False."""
    result = await context_manager.save_stage_output(
        "nonexistent-id",
        "wireframe-annotator",
        {"data": "test"}
    )

    assert result is False


@pytest.mark.asyncio
async def test_save_multiple_stage_outputs(context_manager, storage):
    """Test saving outputs from multiple stages."""
    conv_id = await context_manager.start_workflow("test-workflow")

    # Save stage 1
    await context_manager.save_stage_output(
        conv_id,
        "stage1",
        {"result": "success", "score": 340}
    )

    # Save stage 2
    await context_manager.save_stage_output(
        conv_id,
        "stage2",
        {"result": "done", "score": 350}
    )

    # Verify both saved
    context = await storage.get(conv_id)
    assert len(context["stage_outputs"]) == 2
    assert "stage1" in context["stage_outputs"]
    assert "stage2" in context["stage_outputs"]


@pytest.mark.asyncio
async def test_get_previous_outputs(context_manager):
    """Test retrieving previous outputs."""
    conv_id = await context_manager.start_workflow("test-workflow")

    # Save multiple stage outputs
    await context_manager.save_stage_output(
        conv_id,
        "stage1",
        {"result": "success"}
    )
    await context_manager.save_stage_output(
        conv_id,
        "stage2",
        {"result": "done"}
    )

    # Get all previous outputs
    outputs = await context_manager.get_previous_outputs(conv_id)

    assert "stage1" in outputs
    assert "stage2" in outputs
    assert outputs["stage1"]["result"] == "success"
    assert outputs["stage2"]["result"] == "done"


@pytest.mark.asyncio
async def test_get_previous_outputs_empty(context_manager):
    """Test getting previous outputs when none exist."""
    conv_id = await context_manager.start_workflow("test-workflow")

    outputs = await context_manager.get_previous_outputs(conv_id)

    assert outputs == {}


@pytest.mark.asyncio
async def test_get_previous_outputs_invalid_conversation(context_manager):
    """Test getting outputs from non-existent conversation returns empty dict."""
    outputs = await context_manager.get_previous_outputs("nonexistent-id")

    assert outputs == {}


@pytest.mark.asyncio
async def test_get_shared_context(context_manager):
    """Test retrieving shared context."""
    shared = {
        "project_name": "test",
        "tokens_path": "/path"
    }

    conv_id = await context_manager.start_workflow(
        "test-workflow",
        shared_context=shared
    )

    retrieved = await context_manager.get_shared_context(conv_id)

    assert retrieved["project_name"] == "test"
    assert retrieved["tokens_path"] == "/path"


@pytest.mark.asyncio
async def test_get_shared_context_empty(context_manager):
    """Test getting shared context when none provided."""
    conv_id = await context_manager.start_workflow("test-workflow")

    retrieved = await context_manager.get_shared_context(conv_id)

    assert retrieved == {}


@pytest.mark.asyncio
async def test_get_shared_context_invalid_conversation(context_manager):
    """Test getting shared context from non-existent conversation."""
    retrieved = await context_manager.get_shared_context("nonexistent-id")

    assert retrieved == {}


@pytest.mark.asyncio
async def test_stages_completed_tracking(context_manager):
    """Test that completed stages are tracked in order."""
    conv_id = await context_manager.start_workflow("test-workflow")

    # Execute stages
    await context_manager.save_stage_output(conv_id, "stage1", {"data": "1"})
    await context_manager.save_stage_output(conv_id, "stage2", {"data": "2"})
    await context_manager.save_stage_output(conv_id, "stage3", {"data": "3"})

    # Get completed stages
    completed = await context_manager.get_stages_completed(conv_id)

    assert completed == ["stage1", "stage2", "stage3"]


@pytest.mark.asyncio
async def test_stages_completed_no_duplicates(context_manager):
    """Test that re-saving a stage doesn't duplicate in completed list."""
    conv_id = await context_manager.start_workflow("test-workflow")

    # Save stage1 twice (e.g., retry scenario)
    await context_manager.save_stage_output(conv_id, "stage1", {"version": 1})
    await context_manager.save_stage_output(conv_id, "stage1", {"version": 2})

    completed = await context_manager.get_stages_completed(conv_id)

    # Should only appear once
    assert completed.count("stage1") == 1


@pytest.mark.asyncio
async def test_cleanup_workflow(context_manager, storage):
    """Test cleaning up workflow context."""
    conv_id = await context_manager.start_workflow("test-workflow")

    # Save some data
    await context_manager.save_stage_output(conv_id, "stage1", {"data": "test"})

    # Cleanup
    result = await context_manager.cleanup(conv_id)
    assert result is True

    # Verify deleted
    context = await storage.get(conv_id)
    assert context is None


@pytest.mark.asyncio
async def test_cleanup_nonexistent_workflow(context_manager):
    """Test cleaning up non-existent workflow returns False."""
    result = await context_manager.cleanup("nonexistent-id")
    assert result is False


@pytest.mark.asyncio
async def test_workflow_timestamps(context_manager, storage):
    """Test that created_at and updated_at are set correctly."""
    conv_id = await context_manager.start_workflow("test-workflow")

    context = await storage.get(conv_id)

    # Verify timestamps exist and are valid ISO format
    assert "created_at" in context
    assert "updated_at" in context
    datetime.fromisoformat(context["created_at"])
    datetime.fromisoformat(context["updated_at"])


@pytest.mark.asyncio
async def test_workflow_updated_on_stage_save(context_manager, storage):
    """Test that updated_at changes when saving stage output."""
    conv_id = await context_manager.start_workflow("test-workflow")

    # Get initial timestamp
    context_before = await storage.get(conv_id)
    updated_before = context_before["updated_at"]

    # Small delay to ensure timestamp differs
    import asyncio
    await asyncio.sleep(0.01)

    # Save stage output
    await context_manager.save_stage_output(conv_id, "stage1", {"data": "test"})

    # Verify updated_at changed
    context_after = await storage.get(conv_id)
    updated_after = context_after["updated_at"]

    assert updated_after != updated_before


@pytest.mark.asyncio
async def test_concurrent_stage_saves(context_manager, storage):
    """Test that concurrent stage saves don't corrupt data."""
    conv_id = await context_manager.start_workflow("test-workflow")

    # Simulate concurrent saves
    import asyncio
    await asyncio.gather(
        context_manager.save_stage_output(conv_id, "stage1", {"data": "1"}),
        context_manager.save_stage_output(conv_id, "stage2", {"data": "2"}),
        context_manager.save_stage_output(conv_id, "stage3", {"data": "3"})
    )

    # Verify all saved correctly
    outputs = await context_manager.get_previous_outputs(conv_id)

    assert len(outputs) == 3
    assert outputs["stage1"]["data"] == "1"
    assert outputs["stage2"]["data"] == "2"
    assert outputs["stage3"]["data"] == "3"


@pytest.mark.asyncio
async def test_large_stage_output(context_manager):
    """Test handling of large stage outputs."""
    conv_id = await context_manager.start_workflow("test-workflow")

    # Create large output
    large_output = {
        "file_path": "/tmp/large.md",
        "content": "x" * 100000,  # 100KB
        "metadata": {f"key_{i}": f"value_{i}" for i in range(1000)}
    }

    result = await context_manager.save_stage_output(
        conv_id,
        "large-stage",
        large_output
    )

    assert result is True

    # Verify retrieval
    outputs = await context_manager.get_previous_outputs(conv_id)
    assert outputs["large-stage"]["file_path"] == "/tmp/large.md"
