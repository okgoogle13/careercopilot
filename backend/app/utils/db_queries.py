"""
Database Query Utilities

Reusable database query patterns to eliminate duplication across endpoints.
Provides common patterns for user authorization, resource fetching, and pagination.
"""

import logging
from typing import Any, Generic, TypeVar

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.error_handlers import ErrorHandler
from app.models.user import User

logger = logging.getLogger(__name__)

T = TypeVar("T")


class DatabaseQueries:
    """Reusable database query patterns."""

    @staticmethod
    def get_user_resource(
        db: Session,
        model_class: type[T],
        resource_id: Any,
        user: User,
        id_field_name: str = "id",
        user_field_name: str = "user_id"
    ) -> T:
        """
        Fetch a resource that belongs to a specific user with authorization check.
        
        This replaces the common pattern:
            resource = db.query(Model).filter(
                Model.id == resource_id,
                Model.user_id == user.id
            ).first()
            if not resource:
                raise HTTPException(404, "Not found")
        
        Args:
            db: Database session
            model_class: The SQLAlchemy model class
            resource_id: ID of the resource to fetch
            user: Current user
            id_field_name: Name of the ID field (default: "id")
            user_field_name: Name of the user_id field (default: "user_id")
            
        Returns:
            The resource instance
            
        Raises:
            HTTPException: 404 if resource not found or user not authorized
            
        Example:
            application = DatabaseQueries.get_user_resource(
                db, Application, app_id, current_user
            )
        """
        id_field = getattr(model_class, id_field_name)
        user_field = getattr(model_class, user_field_name)
        
        resource = db.query(model_class).filter(
            id_field == resource_id,
            user_field == user.id
        ).first()
        
        if not resource:
            resource_name = model_class.__name__
            logger.info(
                f"{resource_name} not found or unauthorized: "
                f"resource_id={resource_id}, user_id={user.id}"
            )
            raise ErrorHandler.handle_not_found(resource_name, resource_id)
        
        return resource

    @staticmethod
    def get_user_resources_paginated(
        db: Session,
        model_class: type[T],
        user: User,
        page: int = 1,
        per_page: int = 20,
        order_by: Any = None,
        user_field_name: str = "user_id"
    ) -> tuple[list[T], int]:
        """
        Fetch paginated resources for a specific user.
        
        Args:
            db: Database session
            model_class: The SQLAlchemy model class
            user: Current user
            page: Page number (1-indexed)
            per_page: Items per page
            order_by: Optional order by clause (e.g., Model.created_at.desc())
            user_field_name: Name of the user_id field (default: "user_id")
            
        Returns:
            Tuple of (items list, total count)
            
        Example:
            applications, total = DatabaseQueries.get_user_resources_paginated(
                db, Application, current_user, page=1, per_page=20,
                order_by=Application.created_at.desc()
            )
        """
        user_field = getattr(model_class, user_field_name)
        
        query = db.query(model_class).filter(user_field == user.id)
        
        # Get total count
        total = query.count()
        
        # Apply ordering
        if order_by is not None:
            query = query.order_by(order_by)
        
        # Apply pagination
        offset = (page - 1) * per_page
        items = query.offset(offset).limit(per_page).all()
        
        return items, total

    @staticmethod
    def resource_exists(
        db: Session,
        model_class: type[T],
        **filters
    ) -> bool:
        """
        Check if a resource exists with the given filters.
        
        Args:
            db: Database session
            model_class: The SQLAlchemy model class
            **filters: Field name and value pairs for filtering
            
        Returns:
            True if resource exists, False otherwise
            
        Example:
            exists = DatabaseQueries.resource_exists(
                db, User, email="user@example.com"
            )
        """
        query = db.query(model_class)
        for field_name, value in filters.items():
            field = getattr(model_class, field_name)
            query = query.filter(field == value)
        
        return db.query(query.exists()).scalar()

    @staticmethod
    def bulk_delete(
        db: Session,
        model_class: type[T],
        user: User,
        resource_ids: list[Any],
        user_field_name: str = "user_id",
        id_field_name: str = "id"
    ) -> int:
        """
        Bulk delete resources that belong to a user.
        
        Uses a single DELETE query instead of iterating for better performance.
        
        Args:
            db: Database session
            model_class: The SQLAlchemy model class
            user: Current user
            resource_ids: List of resource IDs to delete
            user_field_name: Name of the user_id field (default: "user_id")
            id_field_name: Name of the ID field (default: "id")
            
        Returns:
            Number of resources deleted
            
        Example:
            deleted_count = DatabaseQueries.bulk_delete(
                db, Document, current_user, [1, 2, 3]
            )
        """
        if not resource_ids:
            return 0
        
        id_field = getattr(model_class, id_field_name)
        user_field = getattr(model_class, user_field_name)
        
        count = db.query(model_class).filter(
            id_field.in_(resource_ids),
            user_field == user.id
        ).delete(synchronize_session=False)
        
        db.commit()
        
        logger.info(
            f"Bulk deleted {count} {model_class.__name__} resources "
            f"for user {user.id}"
        )
        
        return count

    @staticmethod
    def count_user_resources(
        db: Session,
        model_class: type[T],
        user: User,
        user_field_name: str = "user_id",
        **filters
    ) -> int:
        """
        Count resources belonging to a user with optional filters.
        
        Args:
            db: Database session
            model_class: The SQLAlchemy model class
            user: Current user
            user_field_name: Name of the user_id field (default: "user_id")
            **filters: Additional field name and value pairs for filtering
            
        Returns:
            Count of matching resources
            
        Example:
            active_count = DatabaseQueries.count_user_resources(
                db, Application, current_user, status="active"
            )
        """
        user_field = getattr(model_class, user_field_name)
        query = db.query(model_class).filter(user_field == user.id)
        
        for field_name, value in filters.items():
            field = getattr(model_class, field_name)
            query = query.filter(field == value)
        
        return query.count()
