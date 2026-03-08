#!/usr/bin/env python3
"""
Context Manager for Multi-Step Workflow Orchestration

High-level API for managing workflow context across skill execution stages.
Wraps ContextStorage to provide workflow-specific operations.
"""

import uuid
from datetime import datetime
from typing import Dict, Any, Optional, List
import logging

from servers.storage import ContextStorage, WorkflowContext

logger = logging.getLogger(__name__)


class ContextManager:
    """High-level API for workflow context management."""

    def __init__(self, storage: Optional[ContextStorage] = None):
        """
        Initialize ContextManager.

        Args:
            storage: Optional ContextStorage instance (creates default if not provided)
        """
        self.storage = storage or ContextStorage()

    async def start_workflow(
        self,
        workflow_name: str,
        shared_context: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Initialize a new workflow with a unique conversation ID.

        Args:
            workflow_name: Name of the workflow (e.g., "wireframe-to-code")
            shared_context: Optional workflow-wide parameters

        Returns:
            conversation_id: UUID v4 string

        Example:
            >>> manager = ContextManager()
            >>> conv_id = await manager.start_workflow(
            ...     "wireframe-to-code",
            ...     {"project_name": "CareerCopilot", "design_tokens_path": "/tokens.json"}
            ... )
            >>> print(conv_id)
            '123e4567-e89b-12d3-a456-426614174000'
        """
        conversation_id = str(uuid.uuid4())
        now = datetime.now()

        context: WorkflowContext = {
            "conversation_id": conversation_id,
            "workflow_name": workflow_name,
            "stages_completed": [],
            "shared_context": shared_context or {},
            "stage_outputs": {},
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        }

        success = await self.storage.save(conversation_id, context)

        if not success:
            logger.error(f"Failed to save initial context for conversation {conversation_id}")
            raise RuntimeError(f"Failed to initialize workflow {workflow_name}")

        logger.info(f"Started workflow '{workflow_name}' with conversation_id: {conversation_id}")
        return conversation_id

    async def save_stage_output(
        self,
        conversation_id: str,
        stage_name: str,
        output: Dict[str, Any]
    ) -> bool:
        """
        Save output from a workflow stage.

        Args:
            conversation_id: UUID of the conversation
            stage_name: Name of the skill/stage (e.g., "wireframe-annotator")
            output: Stage output data

        Returns:
            True if saved successfully, False otherwise

        Example:
            >>> await manager.save_stage_output(
            ...     conv_id,
            ...     "wireframe-annotator",
            ...     {"file_path": "/tmp/wireframe.md", "score": 340}
            ... )
            True
        """
        context = await self.storage.get(conversation_id)

        if not context:
            logger.warning(f"Context not found for conversation {conversation_id}")
            return False

        # Add stage to completed list if not already present
        if stage_name not in context["stages_completed"]:
            context["stages_completed"].append(stage_name)

        # Save stage output
        context["stage_outputs"][stage_name] = output
        context["updated_at"] = datetime.now().isoformat()

        success = await self.storage.save(conversation_id, context)

        if success:
            logger.info(f"Saved output for stage '{stage_name}' in conversation {conversation_id}")
        else:
            logger.error(f"Failed to save output for stage '{stage_name}'")

        return success

    async def get_previous_outputs(self, conversation_id: str) -> Dict[str, Any]:
        """
        Retrieve all stage outputs from previous workflow steps.

        Args:
            conversation_id: UUID of the conversation

        Returns:
            Dictionary mapping stage names to their outputs.
            Returns empty dict if conversation not found or expired.

        Example:
            >>> outputs = await manager.get_previous_outputs(conv_id)
            >>> print(outputs)
            {
                "wireframe-annotator": {
                    "file_path": "/tmp/wireframe.md",
                    "score": 340
                }
            }
        """
        context = await self.storage.get(conversation_id)

        if not context:
            logger.warning(f"Context not found for conversation {conversation_id} (may be expired)")
            return {}

        return context.get("stage_outputs", {})

    async def get_shared_context(self, conversation_id: str) -> Dict[str, Any]:
        """
        Get workflow-wide shared context parameters.

        Args:
            conversation_id: UUID of the conversation

        Returns:
            Shared context dictionary. Returns empty dict if conversation not found.

        Example:
            >>> shared = await manager.get_shared_context(conv_id)
            >>> print(shared)
            {
                "project_name": "CareerCopilot",
                "design_tokens_path": "/tokens.json"
            }
        """
        context = await self.storage.get(conversation_id)

        if not context:
            logger.warning(f"Context not found for conversation {conversation_id}")
            return {}

        return context.get("shared_context", {})

    async def get_workflow_status(self, conversation_id: str) -> Optional[Dict[str, Any]]:
        """
        Get complete workflow status including stages completed and metadata.

        Args:
            conversation_id: UUID of the conversation

        Returns:
            Status dictionary with workflow metadata, or None if not found

        Example:
            >>> status = await manager.get_workflow_status(conv_id)
            >>> print(status)
            {
                "conversation_id": "123e4567-e89b-12d3-a456-426614174000",
                "workflow_name": "wireframe-to-code",
                "stages_completed": ["wireframe-annotator"],
                "created_at": "2026-02-15T14:00:00",
                "updated_at": "2026-02-15T14:05:00"
            }
        """
        context = await self.storage.get(conversation_id)

        if not context:
            return None

        return {
            "conversation_id": context["conversation_id"],
            "workflow_name": context["workflow_name"],
            "stages_completed": context["stages_completed"],
            "created_at": context["created_at"],
            "updated_at": context["updated_at"]
        }

    async def update_shared_context(
        self,
        conversation_id: str,
        updates: Dict[str, Any]
    ) -> bool:
        """
        Update shared context parameters (merge with existing).

        Args:
            conversation_id: UUID of the conversation
            updates: Dictionary of parameters to merge into shared_context

        Returns:
            True if updated successfully, False otherwise

        Example:
            >>> await manager.update_shared_context(
            ...     conv_id,
            ...     {"design_mode": "solidarity", "theme": "kerala-rage"}
            ... )
            True
        """
        context = await self.storage.get(conversation_id)

        if not context:
            logger.warning(f"Context not found for conversation {conversation_id}")
            return False

        context["shared_context"].update(updates)
        context["updated_at"] = datetime.now().isoformat()

        success = await self.storage.save(conversation_id, context)

        if success:
            logger.info(f"Updated shared context for conversation {conversation_id}")
        else:
            logger.error(f"Failed to update shared context")

        return success

    async def delete_workflow(self, conversation_id: str) -> bool:
        """
        Delete a workflow context (cleanup after completion or failure).

        Args:
            conversation_id: UUID of the conversation

        Returns:
            True if deleted, False if not found

        Example:
            >>> await manager.delete_workflow(conv_id)
            True
        """
        success = await self.storage.delete(conversation_id)

        if success:
            logger.info(f"Deleted workflow context for conversation {conversation_id}")
        else:
            logger.warning(f"Context not found for deletion: {conversation_id}")

        return success

    async def cleanup_expired_workflows(self, ttl_hours: int = 24) -> int:
        """
        Remove workflows older than TTL.

        Args:
            ttl_hours: Time-to-live in hours (default 24)

        Returns:
            Count of deleted workflows

        Example:
            >>> deleted = await manager.cleanup_expired_workflows(ttl_hours=48)
            >>> print(f"Cleaned up {deleted} expired workflows")
        """
        count = await self.storage.cleanup_expired(ttl_hours=ttl_hours)
        logger.info(f"Cleaned up {count} expired workflow contexts (TTL: {ttl_hours}h)")
        return count
