"""
User profile service for Firestore operations.
Handles creation, reading, and updating of user profiles in Firestore.
"""

import logging
from datetime import datetime
from typing import Any

from ..core.firebase import get_firestore

logger = logging.getLogger(__name__)


class UserProfileService:
    """Service for managing user profiles in Firestore."""

    def __init__(self):
        self.db = get_firestore()

    async def create_user_profile(
        self,
        user_id: str,
        email: str,
        name: str,
        location: str | None = None,
        **additional_fields,
    ) -> dict[str, Any]:
        """
        Create a new user profile in Firestore.

        Args:
            user_id: Unique identifier for the user
            email: User's email address
            name: User's display name
            location: User's location (optional)
            **additional_fields: Additional profile data

        Returns:
            Dict containing the created profile data

        Raises:
            Exception: If profile creation fails
        """
        if not self.db:
            raise Exception("Firestore client not initialized")

        try:
            profile_data = {
                "email": email,
                "name": name,
                "location": location,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                **additional_fields,
            }

            # Create the user document in Firestore
            user_ref = self.db.collection("users").document(user_id)
            user_ref.set(profile_data)

            logger.info(f"Created user profile for {user_id}")

            # Return the profile data with the ID
            return {"id": user_id, **profile_data}

        except Exception as e:
            logger.error(f"Failed to create user profile for {user_id}: {e!s}")
            raise

    async def get_user_profile(self, user_id: str) -> dict[str, Any] | None:
        """
        Retrieve a user profile from Firestore.

        Args:
            user_id: Unique identifier for the user

        Returns:
            Dict containing the user profile data or None if not found
        """
        if not self.db:
            raise Exception("Firestore client not initialized")

        try:
            user_ref = self.db.collection("users").document(user_id)
            doc = user_ref.get()

            if doc.exists:
                return {"id": user_id, **doc.to_dict()}
            return None

        except Exception as e:
            logger.error(f"Failed to retrieve user profile for {user_id}: {e!s}")
            raise

    async def update_user_profile(
        self, user_id: str, update_data: dict[str, Any]
    ) -> dict[str, Any]:
        """
        Update a user profile in Firestore.

        Args:
            user_id: Unique identifier for the user
            update_data: Data to update

        Returns:
            Dict containing the updated profile data
        """
        if not self.db:
            raise Exception("Firestore client not initialized")

        try:
            update_data["updated_at"] = datetime.utcnow()

            user_ref = self.db.collection("users").document(user_id)
            user_ref.set(update_data, merge=True)

            logger.info(f"Updated user profile for {user_id}")

            # Return the updated profile
            return await self.get_user_profile(user_id)

        except Exception as e:
            logger.error(f"Failed to update user profile for {user_id}: {e!s}")
            raise

    async def delete_user_profile(self, user_id: str) -> bool:
        """
        Delete a user profile from Firestore.

        Args:
            user_id: Unique identifier for the user

        Returns:
            True if deletion was successful
        """
        if not self.db:
            raise Exception("Firestore client not initialized")

        try:
            user_ref = self.db.collection("users").document(user_id)
            user_ref.delete()

            logger.info(f"Deleted user profile for {user_id}")
            return True

        except Exception as e:
            logger.error(f"Failed to delete user profile for {user_id}: {e!s}")
            raise


# Global instance
user_profile_service = UserProfileService()
