"""Cache models for storing temporary data."""
from datetime import datetime
from typing import Any, Dict, Optional

from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, BaseMixin

class Cache(Base, BaseMixin):
    """Database-backed cache for expensive operations."""
    
    __tablename__ = "cache"
    
    key: Mapped[str] = mapped_column(String(255), primary_key=True)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    operation_type: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    hit_count: Mapped[int] = mapped_column(Integer, default=0)
    size_bytes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    user_id: Mapped[Optional[str]] = mapped_column(
        String(36), 
        ForeignKey("users.id"), 
        nullable=True
    )
    
    def __repr__(self) -> str:
        return f"<Cache {self.key} ({self.operation_type})>"
