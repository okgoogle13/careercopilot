"""Basic smoke tests for ContextStorage implementation.

This script verifies the storage layer works correctly before
Agent-B starts integration work.
"""

import asyncio
import sys
import tempfile
from datetime import datetime
from pathlib import Path

# Add servers directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from storage import ContextStorage, WorkflowContext


async def test_basic_operations():
    """Test create, read, update, delete operations."""
    print("\n=== Testing Basic CRUD Operations ===")

    # Use temp directory for testing
    with tempfile.TemporaryDirectory() as tmpdir:
        storage = ContextStorage(storage_path=tmpdir)

        # Test 1: Save context
        print("\n1. Testing save()...")
        test_context = {
            "conversation_id": "123e4567-e89b-12d3-a456-426614174000",
            "workflow_name": "test-workflow",
            "stages_completed": ["stage1"],
            "shared_context": {"test_key": "test_value"},
            "stage_outputs": {
                "stage1": {"result": "success", "score": 340}
            },
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
        }

        result = await storage.save(
            test_context["conversation_id"],
            test_context
        )
        assert result is True, "Save should succeed"
        print("   ✓ Context saved successfully")

        # Test 2: Retrieve context
        print("\n2. Testing get()...")
        retrieved = await storage.get(test_context["conversation_id"])
        assert retrieved is not None, "Should retrieve saved context"
        assert retrieved["workflow_name"] == "test-workflow"
        assert retrieved["stages_completed"] == ["stage1"]
        print("   ✓ Context retrieved successfully")

        # Test 3: Update context
        print("\n3. Testing update (save again with changes)...")
        test_context["stages_completed"].append("stage2")
        test_context["stage_outputs"]["stage2"] = {"result": "success"}
        result = await storage.save(
            test_context["conversation_id"],
            test_context
        )
        assert result is True, "Update should succeed"

        updated = await storage.get(test_context["conversation_id"])
        assert len(updated["stages_completed"]) == 2
        print("   ✓ Context updated successfully")

        # Test 4: Delete context
        print("\n4. Testing delete()...")
        result = await storage.delete(test_context["conversation_id"])
        assert result is True, "Delete should succeed"

        deleted = await storage.get(test_context["conversation_id"])
        assert deleted is None, "Deleted context should not be retrievable"
        print("   ✓ Context deleted successfully")


async def test_uuid_validation():
    """Test that invalid UUIDs are rejected."""
    print("\n=== Testing UUID Validation (Security) ===")

    with tempfile.TemporaryDirectory() as tmpdir:
        storage = ContextStorage(storage_path=tmpdir)

        # Test path traversal attempts
        print("\n1. Testing path traversal prevention...")
        malicious_ids = [
            "../../etc/passwd",
            "../sensitive.json",
            "not-a-uuid",
            "12345",
        ]

        for bad_id in malicious_ids:
            context = {
                "conversation_id": bad_id,
                "workflow_name": "evil",
                "stages_completed": [],
                "shared_context": {},
                "stage_outputs": {},
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }
            result = await storage.save(bad_id, context)
            assert result is False, f"Should reject invalid UUID: {bad_id}"
            print(f"   ✓ Rejected: {bad_id}")


async def test_pydantic_validation():
    """Test that Pydantic schema validation works."""
    print("\n=== Testing Pydantic Schema Validation ===")

    with tempfile.TemporaryDirectory() as tmpdir:
        storage = ContextStorage(storage_path=tmpdir)

        # Test 1: Valid schema
        print("\n1. Testing valid schema...")
        valid_context = {
            "conversation_id": "234e5678-e89b-12d3-a456-426614174001",
            "workflow_name": "test",
            "stages_completed": [],
            "shared_context": {},
            "stage_outputs": {},
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
        }
        result = await storage.save(
            valid_context["conversation_id"],
            valid_context
        )
        assert result is True, "Valid schema should save"
        print("   ✓ Valid schema accepted")

        # Test 2: Missing required fields
        print("\n2. Testing missing required fields...")
        invalid_context = {
            "conversation_id": "345e6789-e89b-12d3-a456-426614174002",
            "workflow_name": "test",
            # Missing created_at and updated_at
        }
        result = await storage.save(
            invalid_context["conversation_id"],
            invalid_context
        )
        assert result is False, "Invalid schema should be rejected"
        print("   ✓ Invalid schema rejected")


async def test_cleanup():
    """Test TTL cleanup functionality."""
    print("\n=== Testing TTL Cleanup ===")

    with tempfile.TemporaryDirectory() as tmpdir:
        storage = ContextStorage(storage_path=tmpdir)

        # Create a context with old timestamp
        print("\n1. Creating context with old timestamp...")
        old_context = {
            "conversation_id": "456e7890-e89b-12d3-a456-426614174003",
            "workflow_name": "old-workflow",
            "stages_completed": [],
            "shared_context": {},
            "stage_outputs": {},
            "created_at": datetime(2026, 2, 14, 10, 0, 0),  # Yesterday
            "updated_at": datetime(2026, 2, 14, 10, 0, 0),
        }
        await storage.save(old_context["conversation_id"], old_context)
        print("   ✓ Old context created")

        # Run cleanup with 1-hour TTL (should delete the old context)
        print("\n2. Running cleanup with 1-hour TTL...")
        deleted_count = await storage.cleanup_expired(ttl_hours=1)
        assert deleted_count == 1, "Should delete 1 expired context"
        print(f"   ✓ Cleanup removed {deleted_count} expired contexts")

        # Verify context was deleted
        print("\n3. Verifying context was deleted...")
        retrieved = await storage.get(old_context["conversation_id"])
        assert retrieved is None, "Old context should be deleted"
        print("   ✓ Expired context no longer retrievable")


async def main():
    """Run all tests."""
    print("=" * 60)
    print("Context Storage - Smoke Tests")
    print("=" * 60)

    try:
        await test_basic_operations()
        await test_uuid_validation()
        await test_pydantic_validation()
        await test_cleanup()

        print("\n" + "=" * 60)
        print("✅ ALL TESTS PASSED")
        print("=" * 60)
        print("\nStorage layer is ready for Agent-B integration!")

    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
