"""
Mock implementations for testing context management.

These mocks allow testing the context layer without dependencies on real implementations.
Replace with real implementations at hour 6 for integration testing.
"""

from typing import Dict, Optional
from datetime import datetime, timedelta
import uuid


class MockContextStorage:
    """In-memory context storage for testing.

    Provides same interface as real ContextStorage but stores data in memory
    for fast, isolated tests.
    """

    def __init__(self):
        self._storage: Dict[str, dict] = {}
        self._timestamps: Dict[str, datetime] = {}

    async def save(self, conversation_id: str, context: dict) -> bool:
        """Save context to in-memory storage."""
        # Validate UUID format
        try:
            uuid.UUID(conversation_id)
        except (ValueError, AttributeError):
            return False

        self._storage[conversation_id] = context.copy()
        self._timestamps[conversation_id] = datetime.now()
        return True

    async def get(self, conversation_id: str) -> Optional[dict]:
        """Get context from in-memory storage."""
        return self._storage.get(conversation_id)

    async def delete(self, conversation_id: str) -> bool:
        """Delete context from in-memory storage."""
        if conversation_id in self._storage:
            del self._storage[conversation_id]
            if conversation_id in self._timestamps:
                del self._timestamps[conversation_id]
            return True
        return False

    async def cleanup_expired(self, ttl_hours: int = 24) -> int:
        """Clean up contexts older than TTL.

        Returns:
            Number of contexts deleted
        """
        now = datetime.now()
        cutoff = now - timedelta(hours=ttl_hours)

        expired = [
            conv_id for conv_id, timestamp in self._timestamps.items()
            if timestamp < cutoff
        ]

        for conv_id in expired:
            await self.delete(conv_id)

        return len(expired)

    def clear(self):
        """Clear all storage (test helper)."""
        self._storage.clear()
        self._timestamps.clear()


def mock_wireframe_annotator(arguments: dict) -> dict:
    """Mock wireframe-annotator skill.

    Args:
        arguments: Skill arguments (e.g., {"brief_path": "/path/to/brief.md"})

    Returns:
        Mock wireframe output with file_path, score, notes
    """
    brief_path = arguments.get("brief_path", "/tmp/unknown.md")

    return {
        "file_path": "/tmp/mock_wireframe.md",
        "score": 340,
        "notes": f"Mock wireframe generated from {brief_path}",
        "layout": "<mock-layout>3-column grid</mock-layout>",
        "tokens": ["--sys-color-primary-50", "--sys-color-surface-dim"],
        "accessibility": "WCAG 2.2 AA compliant (mock)"
    }


def mock_m3_evaluator(arguments: dict) -> dict:
    """Mock m3-expressive-ui-evaluator skill.

    Can access previous_outputs from arguments to validate context passing.

    Args:
        arguments: Skill arguments (may include previous_outputs)

    Returns:
        Mock evaluation with score, compliance, issues
    """
    previous = arguments.get("previous_outputs", {})

    # Extract file_path from previous wireframe-annotator output
    wireframe_output = previous.get("wireframe-annotator", {})
    evaluated_file = wireframe_output.get("file_path", "unknown")

    return {
        "score": 350,
        "compliance_percentage": 95,
        "issues": [],
        "evaluated_file": evaluated_file,
        "typography_score": 90,
        "contrast_score": 95,
        "spring_physics_usage": True,
        "notes": "Mock evaluation complete"
    }


def mock_figma_to_page(arguments: dict) -> dict:
    """Mock figma-to-page skill.

    Args:
        arguments: Skill arguments (may include previous_outputs)

    Returns:
        Mock React component generation output
    """
    previous = arguments.get("previous_outputs", {})

    # Can access both wireframe and evaluation outputs
    wireframe = previous.get("wireframe-annotator", {})
    evaluation = previous.get("m3-expressive-ui-evaluator", {})

    return {
        "file_path": "/tmp/mock_component.tsx",
        "component_name": "MockComponent",
        "tokens_used": ["--sys-color-primary-50", "--sys-color-asphaltBlack"],
        "accessibility_features": ["aria-label", "keyboard-nav"],
        "design_score": evaluation.get("score", 0),
        "notes": "Mock React component generated"
    }


class MockContextManager:
    """Mock ContextManager for testing.

    Provides same interface as real ContextManager but uses MockContextStorage.
    Replace with real implementation at hour 6.
    """

    def __init__(self, storage: MockContextStorage):
        self.storage = storage

    async def start_workflow(
        self,
        workflow_name: str,
        shared_context: Optional[dict] = None
    ) -> str:
        """Start a new workflow and return conversation ID."""
        conv_id = str(uuid.uuid4())

        context = {
            "conversation_id": conv_id,
            "workflow_name": workflow_name,
            "stages_completed": [],
            "shared_context": shared_context or {},
            "stage_outputs": {},
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }

        await self.storage.save(conv_id, context)
        return conv_id

    async def save_stage_output(
        self,
        conversation_id: str,
        stage_name: str,
        output: dict
    ) -> bool:
        """Save output from a workflow stage."""
        context = await self.storage.get(conversation_id)
        if not context:
            return False

        context["stage_outputs"][stage_name] = output
        if stage_name not in context["stages_completed"]:
            context["stages_completed"].append(stage_name)
        context["updated_at"] = datetime.now().isoformat()

        await self.storage.save(conversation_id, context)
        return True

    async def get_previous_outputs(self, conversation_id: str) -> dict:
        """Get outputs from all previous stages."""
        context = await self.storage.get(conversation_id)
        return context.get("stage_outputs", {}) if context else {}

    async def get_shared_context(self, conversation_id: str) -> dict:
        """Get shared context for workflow."""
        context = await self.storage.get(conversation_id)
        return context.get("shared_context", {}) if context else {}

    async def get_stages_completed(self, conversation_id: str) -> list:
        """Get list of completed stage names."""
        context = await self.storage.get(conversation_id)
        return context.get("stages_completed", []) if context else []

    async def cleanup(self, conversation_id: str) -> bool:
        """Clean up context after workflow completion."""
        return await self.storage.delete(conversation_id)
