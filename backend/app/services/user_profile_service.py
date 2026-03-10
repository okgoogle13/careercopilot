"""
User profile service for Firestore operations.
Handles creation, reading, and updating of user profiles in Firebase.
Replaces SQLAlchemy operations.
"""

import logging
from typing import Any

from app.core.firebase import get_firestore

logger = logging.getLogger(__name__)


class UserProfileService:
    """Service for managing user profiles in Firestore."""

    def __init__(self):
        self.collection_name = "users"

    async def create_user_profile(
        self,
        db: Any,  # Kept for signature compatibility if needed, but ignored
        user_id: str,
        email: str,
        name: str,
        location: str | None = None,
        **additional_fields,
    ) -> dict[str, Any]:
        """
        Create a new user profile in the database.
        """
        try:
            firestore_db = get_firestore()
            doc_ref = firestore_db.collection(self.collection_name).document(user_id)

            user_data = {
                "id": user_id,
                "email": email,
                "name": name,
                "location": location,
                "metadata": {},
                **additional_fields,
            }

            doc_ref.set(user_data)
            logger.info(f"Created user profile for {user_id} in Firestore")
            return user_data

        except Exception as e:
            logger.error(f"Failed to create user profile for {user_id}: {e!s}")
            raise

    async def get_user_profile(self, db: Any, user_id: str) -> dict[str, Any] | None:
        """
        Retrieve a user profile from the database.
        """
        try:
            firestore_db = get_firestore()
            doc = firestore_db.collection(self.collection_name).document(user_id).get()

            if doc.exists:
                d = doc.to_dict()
                if "id" not in d:
                    d["id"] = doc.id
                return d
            return None

        except Exception as e:
            logger.error(f"Failed to retrieve user profile for {user_id}: {e!s}")
            raise

    async def update_user_profile(
        self, db: Any, user_id: str, update_data: dict[str, Any]
    ) -> dict[str, Any]:
        """
        Update a user profile in the database.
        """
        try:
            firestore_db = get_firestore()
            doc_ref = firestore_db.collection(self.collection_name).document(user_id)
            doc = doc_ref.get()

            if not doc.exists:
                raise Exception(f"User {user_id} not found")

            current_data = doc.to_dict()
            metadata = current_data.get("metadata", {})

            # Known top-level fields
            top_level = [
                "email",
                "name",
                "career_transition_from",
                "career_transition_to",
                "location",
                "target_roles",
                "salary_range",
            ]

            update_payload = {}
            for k, v in update_data.items():
                if k in top_level:
                    update_payload[k] = v
                else:
                    metadata[k] = v
                    update_payload["metadata"] = metadata

            doc_ref.update(update_payload)

            logger.info(f"Updated user profile for {user_id} in Firestore")

            # Return fresh data
            return doc_ref.get().to_dict()

        except Exception as e:
            logger.error(f"Failed to update user profile for {user_id}: {e!s}")
            raise

    async def delete_user_profile(self, db: Any, user_id: str) -> bool:
        """
        Delete a user profile from the database.
        """
        try:
            firestore_db = get_firestore()
            doc_ref = firestore_db.collection(self.collection_name).document(user_id)
            if not doc_ref.get().exists:
                return False

            doc_ref.delete()
            logger.info(f"Deleted user profile for {user_id} from Firestore")
            return True

        except Exception as e:
            logger.error(f"Failed to delete user profile for {user_id}: {e!s}")
            raise


# Global instance
user_profile_service = UserProfileService()
