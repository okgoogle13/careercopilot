"""Base models and mixins for SQLAlchemy."""

from __future__ import annotations

import json
import uuid
from datetime import datetime
from typing import Any, TypeVar

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    declared_attr,
    mapped_column,
)
from sqlalchemy.types import TypeDecorator

# Type variable for generic types
T = TypeVar("T", bound="Base")


class JSONEncodedDict(TypeDecorator[dict[str, Any]]):
    """Represents an immutable structure as a json-encoded string."""

    impl = String
    cache_ok = True

    def process_bind_param(self, value: dict[str, Any] | None, dialect: Any) -> str | None:
        if value is not None:
            return json.dumps(value)
        return None

    def process_result_value(self, value: str | None, dialect: Any) -> dict[str, Any] | None:
        if value is not None:
            return json.loads(value)
        return None

    def coerce_compared_value(self, op: Any, value: Any) -> Any:
        return self


class BaseMixin:
    """Base mixin class that provides common functionality for all models."""

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def to_dict(self) -> dict[str, Any]:
        """Convert model instance to dictionary."""
        result: dict[str, Any] = {}
        for column in self.__table__.columns:  # type: ignore[attr-defined]
            value = getattr(self, column.name)
            if isinstance(value, datetime):
                value = value.isoformat()
            result[column.name] = value
        return result

    @classmethod
    def from_dict(cls: type[T], data: dict[str, Any]) -> T:
        """Create model instance from dictionary."""
        return cls(**data)

    def update_from_dict(self, data: dict[str, Any]) -> None:
        """Update model instance from dictionary."""
        protected_fields = {"id", "created_at", "updated_at"}
        for key, value in data.items():
            if hasattr(self, key) and key not in protected_fields:
                setattr(self, key, value)


class Base(DeclarativeBase, BaseMixin):
    """Base class for all SQLAlchemy models."""

    __abstract__ = True
    __mapper_args__ = {"eager_defaults": True}

    @declared_attr  # type: ignore
    def __tablename__(cls) -> str:
        """Generate __tablename__ automatically.

        Convert CamelCase class name to snake_case table name.
        """
        name = ""
        for i, c in enumerate(cls.__name__):
            if i > 0 and c.isupper() and name[-1].islower():
                name += "_" + c.lower()
            else:
                name += c.lower()
        return name
