"""Base models and mixins for SQLAlchemy."""

import json
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional, Type, TypeVar, cast

from sqlalchemy import Column, DateTime, String, func
from sqlalchemy.orm import Mapped, declarative_base, mapped_column
from sqlalchemy.types import TypeDecorator, TypeEngine

T = TypeVar("T", bound="Base")


class JSONEncodedDict(TypeDecorator[Dict[str, Any]]):
    """Represents an immutable structure as a json-encoded string."""

    impl = String
    cache_ok = True

    def process_bind_param(self, value: Optional[Dict[str, Any]], dialect: Any) -> Optional[str]:
        if value is not None:
            return json.dumps(value)
        return None

    def process_result_value(self, value: Optional[str], dialect: Any) -> Optional[Dict[str, Any]]:
        if value is not None:
            return json.loads(value)
        return None


class BaseMixin:
    """Base mixin class that provides common functionality for all models."""

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    def to_dict(self) -> Dict[str, Any]:
        """Convert model instance to dictionary."""
        result: Dict[str, Any] = {}
        for column in self.__table__.columns:  # type: ignore[attr-defined]
            result[column.name] = getattr(self, column.name)
        return result

    @classmethod
    def from_dict(cls: Type[T], data: Dict[str, Any]) -> T:
        """Create model instance from dictionary."""
        return cls(**data)


# Create declarative base with our custom Base class
Base = declarative_base()
