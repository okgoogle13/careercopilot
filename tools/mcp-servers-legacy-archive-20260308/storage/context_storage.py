"""File-based JSON storage for workflow execution context.

This module provides persistent storage for workflow context data with:
- JSON file persistence with configurable location
- UUID validation to prevent directory traversal attacks
- Atomic writes using temp file + rename for data integrity
- 24-hour TTL cleanup for automatic context expiration
- Pydantic schema validation for type safety
"""

import os
import json
import logging
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Optional

from pydantic import BaseModel, Field, field_validator


logger = logging.getLogger(__name__)


class WorkflowContext(BaseModel):
    """Schema for workflow execution context.

    Attributes:
        conversation_id: UUID v4 identifier for the workflow conversation
        workflow_name: Name of the workflow (e.g., "wireframe-to-code")
        stages_completed: List of stage names that have finished execution
        shared_context: Workflow-wide data shared across all stages
        stage_outputs: Per-stage execution results keyed by stage name
        created_at: ISO 8601 timestamp when context was created
        updated_at: ISO 8601 timestamp of last update
    """

    conversation_id: str = Field(..., description="UUID v4 identifier")
    workflow_name: str
    stages_completed: list[str] = Field(default_factory=list)
    shared_context: Dict = Field(default_factory=dict)
    stage_outputs: Dict[str, Dict] = Field(default_factory=dict)
    created_at: datetime
    updated_at: datetime

    @field_validator('conversation_id')
    @classmethod
    def validate_uuid(cls, v: str) -> str:
        """Validate that conversation_id is a valid UUID v4."""
        try:
            uuid.UUID(v, version=4)
        except (ValueError, AttributeError):
            raise ValueError(f"Invalid UUID v4: {v}")
        return v

    model_config = {
        "json_encoders": {
            datetime: lambda v: v.isoformat()
        }
    }


class ContextStorage:
    """File-based JSON storage for workflow context persistence.

    Provides CRUD operations with security features:
    - Path safety: Validates UUIDs to prevent directory traversal
    - Atomic writes: Uses temp file + rename for corruption prevention
    - TTL cleanup: Automatic removal of expired contexts

    Storage location:
        Default: ~/.careercopilot/context/
        Override: Set CONTEXT_STORAGE_PATH environment variable
    """

    def __init__(self, storage_path: Optional[str] = None):
        """Initialize storage with configurable path.

        Args:
            storage_path: Optional custom storage directory.
                         Falls back to CONTEXT_STORAGE_PATH env var,
                         then default ~/.careercopilot/context/
        """
        if storage_path:
            self.storage_dir = Path(storage_path).expanduser()
        else:
            default_path = os.getenv(
                "CONTEXT_STORAGE_PATH",
                "~/.careercopilot/context"
            )
            self.storage_dir = Path(default_path).expanduser()

        # Create storage directory if it doesn't exist
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        logger.info(f"Context storage initialized at {self.storage_dir}")

    def _validate_conversation_id(self, conversation_id: str) -> bool:
        """Validate conversation_id is a valid UUID to prevent path traversal.

        Args:
            conversation_id: The conversation ID to validate

        Returns:
            True if valid UUID, False otherwise
        """
        try:
            uuid.UUID(conversation_id, version=4)
            return True
        except (ValueError, AttributeError):
            logger.warning(
                f"Invalid conversation_id rejected: {conversation_id}"
            )
            return False

    def _get_file_path(self, conversation_id: str) -> Optional[Path]:
        """Get validated file path for a conversation ID.

        Args:
            conversation_id: The conversation ID

        Returns:
            Path object if valid, None if invalid or unsafe
        """
        if not self._validate_conversation_id(conversation_id):
            return None

        file_path = self.storage_dir / f"{conversation_id}.json"

        # Security check: Ensure resolved path is within storage directory
        try:
            resolved_path = file_path.resolve()
            if not str(resolved_path).startswith(str(self.storage_dir.resolve())):
                logger.error(
                    f"Path traversal attempt detected: {conversation_id}"
                )
                return None
        except (OSError, RuntimeError) as e:
            logger.error(f"Path resolution error for {conversation_id}: {e}")
            return None

        return file_path

    async def save(self, conversation_id: str, context: dict) -> bool:
        """Save context for a conversation with atomic write.

        Uses temp file + rename pattern for atomic writes to prevent
        corruption from concurrent access or interrupted writes.

        Args:
            conversation_id: UUID v4 identifier
            context: Context dictionary matching WorkflowContext schema

        Returns:
            True on successful save, False on failure
        """
        file_path = self._get_file_path(conversation_id)
        if not file_path:
            return False

        try:
            # Validate schema
            context_obj = WorkflowContext(**context)

            # Update timestamp
            context_obj.updated_at = datetime.now()

            # Atomic write: temp file + rename
            temp_path = self.storage_dir / f"{conversation_id}.tmp"

            with open(temp_path, 'w') as f:
                json.dump(
                    context_obj.model_dump(),
                    f,
                    indent=2,
                    default=str  # Handle datetime serialization
                )

            # Atomic rename (POSIX guarantee)
            os.rename(temp_path, file_path)

            logger.debug(f"Context saved for conversation {conversation_id}")
            return True

        except Exception as e:
            logger.error(
                f"Failed to save context for {conversation_id}: {e}"
            )
            # Clean up temp file if it exists
            temp_path = self.storage_dir / f"{conversation_id}.tmp"
            if temp_path.exists():
                temp_path.unlink()
            return False

    async def get(self, conversation_id: str) -> Optional[dict]:
        """Retrieve context for a conversation.

        Args:
            conversation_id: UUID v4 identifier

        Returns:
            Context dictionary if found and valid, None otherwise
        """
        file_path = self._get_file_path(conversation_id)
        if not file_path or not file_path.exists():
            return None

        try:
            with open(file_path, 'r') as f:
                data = json.load(f)

            # Validate schema
            context_obj = WorkflowContext(**data)

            # Check if context is expired (24h TTL)
            created_at = context_obj.created_at
            age = datetime.now() - created_at
            if age > timedelta(hours=24):
                logger.warning(
                    f"Context {conversation_id} is expired "
                    f"(age: {age.total_seconds() / 3600:.1f}h)"
                )
                return None

            return context_obj.model_dump()

        except Exception as e:
            logger.error(
                f"Failed to read context for {conversation_id}: {e}"
            )
            return None

    async def delete(self, conversation_id: str) -> bool:
        """Delete a context file.

        Args:
            conversation_id: UUID v4 identifier

        Returns:
            True if deleted, False if not found or error
        """
        file_path = self._get_file_path(conversation_id)
        if not file_path:
            return False

        try:
            if file_path.exists():
                file_path.unlink()
                logger.debug(f"Context deleted for conversation {conversation_id}")
                return True
            else:
                logger.debug(
                    f"Context not found for deletion: {conversation_id}"
                )
                return False

        except Exception as e:
            logger.error(
                f"Failed to delete context for {conversation_id}: {e}"
            )
            return False

    async def cleanup_expired(self, ttl_hours: int = 24) -> int:
        """Remove contexts older than TTL.

        Args:
            ttl_hours: Time-to-live in hours (default: 24)

        Returns:
            Count of deleted contexts
        """
        deleted_count = 0
        cutoff = datetime.now() - timedelta(hours=ttl_hours)

        try:
            for file_path in self.storage_dir.glob("*.json"):
                try:
                    with open(file_path, 'r') as f:
                        data = json.load(f)

                    context_obj = WorkflowContext(**data)

                    if context_obj.created_at < cutoff:
                        file_path.unlink()
                        deleted_count += 1
                        logger.debug(
                            f"Deleted expired context: {file_path.stem}"
                        )

                except Exception as e:
                    logger.warning(
                        f"Error processing file {file_path.name} "
                        f"during cleanup: {e}"
                    )
                    continue

            if deleted_count > 0:
                logger.info(
                    f"Cleanup completed: {deleted_count} expired contexts removed"
                )

            return deleted_count

        except Exception as e:
            logger.error(f"Cleanup operation failed: {e}")
            return deleted_count
