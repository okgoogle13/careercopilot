"""User models for authentication and profiles."""

<<<<<<< HEAD
from datetime import datetime
from typing import TYPE_CHECKING, Any, Dict, List, Optional

from sqlalchemy import JSON, ForeignKey, String
=======
from typing import TYPE_CHECKING

from sqlalchemy import JSON, String
>>>>>>> restoration-KR-Rage-Figma-v2.0
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, BaseMixin

if TYPE_CHECKING:
    from .agent_session import AgentSession
    from .ai_interaction import AIInteraction
    from .application import Application
    from .cache import Cache
    from .job import Job


class User(Base, BaseMixin):
    """User profiles with authentication and preferences."""

    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
<<<<<<< HEAD
    career_transition_from: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    career_transition_to: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    target_roles: Mapped[List[str]] = mapped_column(JSON, default=list)
    salary_range: Mapped[Dict[str, int]] = mapped_column(JSON, default=dict)

    # Relationships
    jobs: Mapped[List["Job"]] = relationship("Job", back_populates="user")
    applications: Mapped[List["Application"]] = relationship("Application", back_populates="user")
    ai_interactions: Mapped[List["AIInteraction"]] = relationship(
        "AIInteraction", back_populates="user"
    )
    agent_sessions: Mapped[List["AgentSession"]] = relationship(
        "AgentSession", back_populates="user"
    )
    cache_entries: Mapped[List["Cache"]] = relationship("Cache", back_populates="user")
=======
    career_transition_from: Mapped[str | None] = mapped_column(String(100), nullable=True)
    career_transition_to: Mapped[str | None] = mapped_column(String(100), nullable=True)
    location: Mapped[str | None] = mapped_column(String(100), nullable=True)
    target_roles: Mapped[list[str]] = mapped_column(JSON, default=list)
    salary_range: Mapped[dict[str, int]] = mapped_column(JSON, default=dict)

    # Relationships
    jobs: Mapped[list["Job"]] = relationship("Job", back_populates="user")
    applications: Mapped[list["Application"]] = relationship("Application", back_populates="user")
    ai_interactions: Mapped[list["AIInteraction"]] = relationship(
        "AIInteraction", back_populates="user"
    )
    agent_sessions: Mapped[list["AgentSession"]] = relationship(
        "AgentSession", back_populates="user"
    )
    cache_entries: Mapped[list["Cache"]] = relationship("Cache", back_populates="user")
>>>>>>> restoration-KR-Rage-Figma-v2.0

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
