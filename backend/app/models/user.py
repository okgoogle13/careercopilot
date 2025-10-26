"""User models for authentication and profiles."""
from datetime import datetime
from typing import List, Optional, Dict, Any, TYPE_CHECKING

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, BaseMixin

if TYPE_CHECKING:
    from .job import Job
    from .application import Application
    from .ai_interaction import AIInteraction
    from .agent_session import AgentSession
    from .cache import Cache

class User(Base, BaseMixin):
    """User profiles with authentication and preferences."""
    
    __tablename__ = "users"
    
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    career_transition_from: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    career_transition_to: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    target_roles: Mapped[List[str]] = mapped_column(JSON, default=list)
    salary_range: Mapped[Dict[str, int]] = mapped_column(JSON, default=dict)
    
    # Relationships
    jobs: Mapped[List["Job"]] = relationship("Job", back_populates="user")
    applications: Mapped[List["Application"]] = relationship("Application", back_populates="user")
    ai_interactions: Mapped[List["AIInteraction"]] = relationship("AIInteraction", back_populates="user")
    agent_sessions: Mapped[List["AgentSession"]] = relationship("AgentSession", back_populates="user")
    cache_entries: Mapped[List["Cache"]] = relationship("Cache", back_populates="user")
    
    def __repr__(self) -> str:
        return f"<User {self.email}>"
    
    @property
    def is_active(self) -> bool:
        """Check if the user is active."""
        return True
    
    @property
    def is_authenticated(self) -> bool:
        """Check if the user is authenticated."""
        return True
    
    def get_id(self) -> str:
        """Get the user ID as a string."""
        return str(self.id)
