
"""
User profile service for SQLAlchemy operations.
Handles creation, reading, and updating of user profiles in PostgreSQL.
"""

import logging
from typing import Any, Dict, Optional
from sqlalchemy.orm import Session
from ..models.database import User

logger = logging.getLogger(__name__)

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
        """
        try:
            user = User(
                id=user_id,
                email=email,
                name=name,
                location=location,
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
            if user:
                return user.to_dict()
            return None

        except Exception as e:
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
            if not user:
                raise Exception(f"User {user_id} not found")

            for key, value in update_data.items():
                if hasattr(user, key):
                    setattr(user, key, value)

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
