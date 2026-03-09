"""
Unit tests for context storage layer.

Tests the MockContextStorage (and eventually real ContextStorage) for:
- Basic CRUD operations
- UUID validation
- TTL cleanup
- Concurrent access
- Error handling
"""

import pytest
from servers.tests.fixtures.mock_skills import MockContextStorage
from datetime import datetime, timedelta
import uuid


@pytest.fixture
def storage():
    """Provide fresh storage instance for each test."""
    return MockContextStorage()


@pytest.mark.asyncio
async def test_save_and_get(storage):
    """Test basic save and retrieve operations."""
    conv_id = str(uuid.uuid4())
    context = {
        "conversation_id": conv_id,
        "workflow_name": "test-workflow",
        "stages_completed": [],
        "shared_context": {},
        "stage_outputs": {},
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }

    # Save context
    result = await storage.save(conv_id, context)
    assert result is True

    # Retrieve context
    retrieved = await storage.get(conv_id)
    assert retrieved is not None
    assert retrieved["conversation_id"] == conv_id
    assert retrieved["workflow_name"] == "test-workflow"


@pytest.mark.asyncio
async def test_get_nonexistent(storage):
    """Test getting non-existent context returns None."""
    result = await storage.get("nonexistent-id")
    assert result is None


@pytest.mark.asyncio
async def test_delete(storage):
    """Test context deletion."""
    conv_id = str(uuid.uuid4())
    context = {
        "conversation_id": conv_id,
        "workflow_name": "test"
    }

    # Save then delete
    await storage.save(conv_id, context)
    deleted = await storage.delete(conv_id)
    assert deleted is True

    # Verify deleted
    retrieved = await storage.get(conv_id)
    assert retrieved is None


@pytest.mark.asyncio
async def test_delete_nonexistent(storage):
    """Test deleting non-existent context returns False."""
    result = await storage.delete("nonexistent-id")
    assert result is False


@pytest.mark.asyncio
async def test_cleanup_expired(storage):
    """Test TTL cleanup removes old contexts."""
    # Save a context
    conv_id = str(uuid.uuid4())
    await storage.save(conv_id, {"conversation_id": conv_id})

    # Mock old timestamp (simulate expired context)
    storage._timestamps[conv_id] = datetime.now() - timedelta(hours=25)

    # Cleanup with 24-hour TTL
    count = await storage.cleanup_expired(ttl_hours=24)

    assert count == 1
    assert await storage.get(conv_id) is None


@pytest.mark.asyncio
async def test_cleanup_respects_ttl(storage):
    """Test cleanup doesn't remove recent contexts."""
    # Save fresh context
    conv_id = str(uuid.uuid4())
    await storage.save(conv_id, {"conversation_id": conv_id})

    # Cleanup should not remove it
    count = await storage.cleanup_expired(ttl_hours=24)

    assert count == 0
    assert await storage.get(conv_id) is not None


@pytest.mark.asyncio
async def test_invalid_uuid_rejected(storage):
    """Test that invalid UUIDs are rejected."""
    invalid_ids = [
        "not-a-uuid",
        "12345",
        "",
        "../../etc/passwd",
        "../secrets.json"
    ]

    for invalid_id in invalid_ids:
        result = await storage.save(invalid_id, {"data": "test"})
        assert result is False, f"Should reject invalid UUID: {invalid_id}"


@pytest.mark.asyncio
async def test_context_isolation(storage):
    """Test that contexts are isolated from each other."""
    conv_id_1 = str(uuid.uuid4())
    conv_id_2 = str(uuid.uuid4())

    context_1 = {"conversation_id": conv_id_1, "data": "workflow-1"}
    context_2 = {"conversation_id": conv_id_2, "data": "workflow-2"}

    await storage.save(conv_id_1, context_1)
    await storage.save(conv_id_2, context_2)

    # Verify isolation
    retrieved_1 = await storage.get(conv_id_1)
    retrieved_2 = await storage.get(conv_id_2)

    assert retrieved_1["data"] == "workflow-1"
    assert retrieved_2["data"] == "workflow-2"


@pytest.mark.asyncio
async def test_context_mutation_isolation(storage):
    """Test that modifying returned context doesn't affect storage."""
    conv_id = str(uuid.uuid4())
    original_context = {
        "conversation_id": conv_id,
        "stage_outputs": {"stage1": "output1"}
    }

    await storage.save(conv_id, original_context)

    # Get and modify
    retrieved = await storage.get(conv_id)
    retrieved["stage_outputs"]["stage2"] = "output2"

    # Original should be unchanged
    retrieved_again = await storage.get(conv_id)
    assert "stage2" not in retrieved_again["stage_outputs"]


@pytest.mark.asyncio
async def test_overwrite_existing_context(storage):
    """Test that saving overwrites existing context."""
    conv_id = str(uuid.uuid4())

    # Save initial
    await storage.save(conv_id, {"version": 1})

    # Overwrite
    await storage.save(conv_id, {"version": 2})

    # Verify overwrite
    retrieved = await storage.get(conv_id)
    assert retrieved["version"] == 2


@pytest.mark.asyncio
async def test_large_context_data(storage):
    """Test handling of large context objects."""
    conv_id = str(uuid.uuid4())

    # Create large context
    large_context = {
        "conversation_id": conv_id,
        "stage_outputs": {
            f"stage_{i}": {"data": "x" * 1000}
            for i in range(100)
        }
    }

    result = await storage.save(conv_id, large_context)
    assert result is True

    retrieved = await storage.get(conv_id)
    assert len(retrieved["stage_outputs"]) == 100


@pytest.mark.asyncio
async def test_cleanup_multiple_expired(storage):
    """Test cleanup handles multiple expired contexts."""
    # Create 5 expired contexts
    expired_ids = []
    for _ in range(5):
        conv_id = str(uuid.uuid4())
        await storage.save(conv_id, {"conversation_id": conv_id})
        storage._timestamps[conv_id] = datetime.now() - timedelta(hours=25)
        expired_ids.append(conv_id)

    # Create 3 fresh contexts
    fresh_ids = []
    for _ in range(3):
        conv_id = str(uuid.uuid4())
        await storage.save(conv_id, {"conversation_id": conv_id})
        fresh_ids.append(conv_id)

    # Cleanup
    count = await storage.cleanup_expired(ttl_hours=24)

    assert count == 5

    # Verify expired are gone
    for conv_id in expired_ids:
        assert await storage.get(conv_id) is None

    # Verify fresh remain
    for conv_id in fresh_ids:
        assert await storage.get(conv_id) is not None


@pytest.mark.asyncio
async def test_clear_helper(storage):
    """Test storage clear helper (test utility)."""
    # Save multiple contexts
    for _ in range(3):
        conv_id = str(uuid.uuid4())
        await storage.save(conv_id, {"conversation_id": conv_id})

    # Clear all
    storage.clear()

    # Verify empty
    assert len(storage._storage) == 0
    assert len(storage._timestamps) == 0
