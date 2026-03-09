"""Storage layer for workflow context persistence.

This module provides file-based JSON storage for workflow execution context,
enabling multi-step workflows to share data between stages.

Example:
    >>> from servers.storage import ContextStorage, WorkflowContext
    >>> storage = ContextStorage()
    >>> context = {
    ...     "conversation_id": "123e4567-e89b-12d3-a456-426614174000",
    ...     "workflow_name": "wireframe-to-code",
    ...     "stages_completed": [],
    ...     "shared_context": {},
    ...     "stage_outputs": {},
    ...     "created_at": datetime.now(),
    ...     "updated_at": datetime.now()
    ... }
    >>> await storage.save(context["conversation_id"], context)
"""

from .context_storage import ContextStorage, WorkflowContext

__all__ = ["ContextStorage", "WorkflowContext"]
