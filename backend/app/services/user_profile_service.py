"""
User profile service for SQLAlchemy/Supabase operations.
Handles creation, reading, and updating of user profiles in PostgreSQL.
"""

import logging
from typing import Any

from sqlalchemy.orm import Session

from ..models.database import User

logger = logging.getLogger(__name__)


class UserProfileService:
    """Service for managing user profiles in PostgreSQL (Supabase)."""

    async def create_user_profile(
        self,
        db: Session,
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
            user = User(
                id=user_id,
                email=email,
                name=name,
                location=location,
                **additional_fields,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            logger.info(f"Created user profile for {user_id} in PostgreSQL")
            return user.to_dict()

        except Exception as e:
            db.rollback()
            logger.error(f"Failed to create user profile for {user_id}: {e!s}")
            raise

    async def get_user_profile(self, db: Session, user_id: str) -> dict[str, Any] | None:
        """
        Retrieve a user profile from the database.
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                return user.to_dict()
            return None

        except Exception as e:
            logger.error(f"Failed to retrieve user profile for {user_id}: {e!s}")
            raise

    async def update_user_profile(
        self, db: Session, user_id: str, update_data: dict[str, Any]
    ) -> dict[str, Any]:
        """
        Update a user profile in the database.
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise Exception(f"User {user_id} not found")

            for key, value in update_data.items():
                if hasattr(user, key):
                    setattr(user, key, value)
                elif key == "career_profile":
                    # If we have a career_profile field in Firestore, map it to our structured fields if possible
                    # or store it in a JSON field if we have one. In our current User model, we have
                    # career_transition_from, career_transition_to, target_roles, etc.
                    pass

            db.commit()
            db.refresh(user)

            logger.info(f"Updated user profile for {user_id} in PostgreSQL")
            return user.to_dict()

        except Exception as e:
            db.rollback()
            logger.error(f"Failed to update user profile for {user_id}: {e!s}")
            raise

    async def delete_user_profile(self, db: Session, user_id: str) -> bool:
        """
        Delete a user profile from the database.
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                return False

            db.delete(user)
            db.commit()

            logger.info(f"Deleted user profile for {user_id} from PostgreSQL")
            return True

        except Exception as e:
            db.rollback()
            logger.error(f"Failed to delete user profile for {user_id}: {e!s}")
            raise


# Global instance
user_profile_service = UserProfileService()
