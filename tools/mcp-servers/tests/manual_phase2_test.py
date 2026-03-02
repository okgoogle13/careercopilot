#!/usr/bin/env python3
"""
Manual Phase 2 Integration Test

Run this script to verify Phase 2 deliverable:
"Skills can access outputs from previous steps"
"""

import asyncio
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from servers.context_manager import ContextManager
from servers.skill_orchestrator_mcp import execute_skill


async def test_2skill_workflow():
    """Test that Stage 2 can access Stage 1's outputs via context."""
    print("="* 80)
    print("Phase 2 Integration Test: 2-Skill Workflow with Context Management")
    print("="* 80)

    manager = ContextManager()

    # Start workflow
    print("\n[1] Starting workflow...")
    conv_id = await manager.start_workflow(
        workflow_name="wireframe-to-code",
        shared_context={
            "project_name": "CareerCopilot",
            "design_tokens_path": "/frontend/src/design/tokens/tokens.json"
        }
    )
    print(f"✓ Workflow started: {conv_id}")

    try:
        # Stage 1: Execute wireframe-annotator
        print("\n[2] Executing Stage 1: wireframe-annotator...")
        result1 = execute_skill(
            skill_name="wireframe-annotator",
            arguments={"brief_path": "/tmp/design-brief.md"},
            context={"conversation_id": conv_id}
        )

        print(f"✓ Stage 1 status: {result1['status']}")
        print(f"  - Output file: {result1['output']['file_path']}")
        print(f"  - Score: {result1['output']['score']}")

        assert result1["status"] == "success", f"Stage 1 failed: {result1}"
        assert "context" in result1, "Context metadata missing from Stage 1 response"
        print(f"  - Previous stages count: {result1['context']['previous_stages_count']}")

        # Verify Stage 1 saved to context
        previous_outputs = await manager.get_previous_outputs(conv_id)
        assert "wireframe-annotator" in previous_outputs
        print(f"✓ Stage 1 output saved to context")

        # Stage 2: Execute m3-expressive-ui-evaluator
        print("\n[3] Executing Stage 2: m3-expressive-ui-evaluator...")
        result2 = execute_skill(
            skill_name="m3-expressive-ui-evaluator",
            arguments={},  # No explicit file_path needed - context provides it
            context={"conversation_id": conv_id}
        )

        print(f"✓ Stage 2 status: {result2['status']}")
        print(f"  - Score: {result2['output'].get('score', 'N/A')}")
        print(f"  - Compliance: {result2['output'].get('compliance_percentage', 'N/A')}%")

        assert result2["status"] == "success", f"Stage 2 failed: {result2}"
        assert "context" in result2, "Context metadata missing from Stage 2 response"

        # CRITICAL ASSERTION: Verify Stage 2 received Stage 1's outputs
        print(f"  - Previous stages count: {result2['context']['previous_stages_count']}")
        assert result2["context"]["previous_stages_count"] == 1, \
            f"Stage 2 should see 1 previous stage, got {result2['context']['previous_stages_count']}"

        print(f"✓ Stage 2 received Stage 1's outputs via context")

        # Verify workflow status
        print("\n[4] Checking workflow status...")
        status = await manager.get_workflow_status(conv_id)
        print(f"  - Workflow name: {status['workflow_name']}")
        print(f"  - Stages completed: {status['stages_completed']}")
        print(f"  - Created: {status['created_at']}")
        print(f"  - Updated: {status['updated_at']}")

        assert len(status["stages_completed"]) == 2
        assert "wireframe-annotator" in status["stages_completed"]
        assert "m3-expressive-ui-evaluator" in status["stages_completed"]

        print("\n" + "="* 80)
        print("✅ PHASE 2 DELIVERABLE MET:")
        print("   Skills can access outputs from previous steps")
        print("="* 80)

        return True

    finally:
        # Cleanup
        print("\n[5] Cleaning up...")
        await manager.delete_workflow(conv_id)
        print(f"✓ Deleted workflow context")


async def test_backward_compatibility():
    """Test that execute_skill without context still works (Phase 1 compatibility)."""
    print("\n" + "="* 80)
    print("Testing Backward Compatibility (Phase 1 without context)")
    print("="* 80)

    result = execute_skill(
        skill_name="wireframe-annotator",
        arguments={"brief_path": "/tmp/design-brief.md"}
        # No context parameter - should work fine
    )

    print(f"✓ Status: {result['status']}")
    assert result["status"] == "success"
    assert "context" not in result, "Context should not be present when not provided"

    print("✅ Backward compatibility maintained")
    print("="* 80)


async def main():
    """Run all tests."""
    try:
        # Test 1: Phase 2 context management
        success = await test_2skill_workflow()

        # Test 2: Backward compatibility
        await test_backward_compatibility()

        print("\n🎉 All Phase 2 tests PASSED!\n")
        return 0

    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}\n")
        return 1
    except Exception as e:
        print(f"\n💥 ERROR: {e}\n")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
