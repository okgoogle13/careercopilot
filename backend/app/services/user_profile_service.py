<<<<<<< HEAD

"""
User profile service for SQLAlchemy operations.
=======
"""
User profile service for SQLAlchemy/Supabase operations.
>>>>>>> restoration-KR-Rage-Figma-v2.0
Handles creation, reading, and updating of user profiles in PostgreSQL.
"""

import logging
<<<<<<< HEAD
from typing import Any, Dict, Optional
from sqlalchemy.orm import Session
=======
from typing import Any

from sqlalchemy.orm import Session

>>>>>>> restoration-KR-Rage-Figma-v2.0
from ..models.database import User

logger = logging.getLogger(__name__)

<<<<<<< HEAD
class UserProfileService:
    """Service for managing user profiles in PostgreSQL."""

    def __init__(self, db: Session):
        self.db = db

    async def create_user_profile(
        self,
        user_id: str,
        email: str,
        name: str,
        location: Optional[str] = None,
        **additional_fields,
    ) -> Dict[str, Any]:
        """
        Create a new user profile in PostgreSQL.
=======

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
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """
        try:
            user = User(
                id=user_id,
                email=email,
                name=name,
                location=location,
<<<<<<< HEAD
                **additional_fields
            )
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)

            logger.info(f"Created user profile for {user_id}")
            return user.to_dict()

        except Exception as e:
            logger.error(f"Failed to create user profile for {user_id}: {str(e)}")
            self.db.rollback()
            raise

    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve a user profile from PostgreSQL.
        """
        try:
            user = self.db.query(User).filter(User.id == user_id).first()
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
            if user:
                return user.to_dict()
            return None

        except Exception as e:
<<<<<<< HEAD
            logger.error(f"Failed to retrieve user profile for {user_id}: {str(e)}")
            raise

    async def update_user_profile(
        self, user_id: str, update_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Update a user profile in PostgreSQL.
        """
        try:
            user = self.db.query(User).filter(User.id == user_id).first()
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
            if not user:
                raise Exception(f"User {user_id} not found")

            for key, value in update_data.items():
                if hasattr(user, key):
                    setattr(user, key, value)
<<<<<<< HEAD

            self.db.commit()
            self.db.refresh(user)

            logger.info(f"Updated user profile for {user_id}")
            return user.to_dict()

        except Exception as e:
            logger.error(f"Failed to update user profile for {user_id}: {str(e)}")
            self.db.rollback()
            raise

    async def delete_user_profile(self, user_id: str) -> bool:
        """
        Delete a user profile from PostgreSQL.
        """
        try:
            user = self.db.query(User).filter(User.id == user_id).first()
            if user:
                self.db.delete(user)
                self.db.commit()
                logger.info(f"Deleted user profile for {user_id}")
                return True
            return False

        except Exception as e:
            logger.error(f"Failed to delete user profile for {user_id}: {str(e)}")
            self.db.rollback()
            raise
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
