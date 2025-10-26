"""
Database models for CareerCopilot production system.
Supports both PostgreSQL (production) and SQLite (development).
"""

import json
import uuid
from datetime import datetime, timedelta, timezone
from enum import Enum as PyEnum
from typing import (
    TYPE_CHECKING,
    Any,
    Dict,
    Generic,
    List,
    Optional,
    Sequence,
    Set,
    Tuple,
    Type,
    TypeVar,
    Union,
    cast,
    overload,
)

from sqlalchemy import JSON
from sqlalchemy import JSON as SQLJSON
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
)
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import (
    Float,
    ForeignKey,
    Index,
    Integer,
    MetaData,
    String,
    Text,
    TypeDecorator,
    and_,
    create_engine,
    delete,
    event,
    func,
    not_,
    or_,
    select,
    text,
    update,
)
from sqlalchemy.engine import Engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import (
    DeclarativeBase,
)
from sqlalchemy.orm import Mapped as Mapped
from sqlalchemy.orm import (
    MappedAsDataclass,
)
from sqlalchemy.orm import Session as OrmSession
from sqlalchemy.orm import (
    declared_attr,
)
from sqlalchemy.orm import mapped_column as mapped_column
from sqlalchemy.orm import relationship as relationship
from sqlalchemy.orm.query import Query
from sqlalchemy.orm.session import Session as SQLAlchemySession
from sqlalchemy.types import TypeDecorator as TypeDecorator
from sqlalchemy.types import TypeEngine

# Type variables for generic type hints
T = TypeVar("T", bound="Base")
T_co = TypeVar("T_co", covariant=True)
ModelType = TypeVar("ModelType", bound="Base")
CreateSchemaType = TypeVar("CreateSchemaType")
UpdateSchemaType = TypeVar("UpdateSchemaType")

if TYPE_CHECKING:
    from sqlalchemy.engine.interfaces import _CoreAnyExecuteParams
    from sqlalchemy.sql.elements import ColumnElement
    from sqlalchemy.sql.expression import Executable


class BaseMixin:
    """
    Base mixin class that provides common functionality for all models.
    """

    # Column definitions with type hints
    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # No need to define metadata here as it's provided by SQLAlchemy's DeclarativeBase


class Base(DeclarativeBase):
    """Base class for all database models"""

    # Type hints for SQLAlchemy
    __abstract__ = True
    __mapper_args__ = {"eager_defaults": True}

    # Declare __tablename__ as a class variable that can be overridden by subclasses
    if TYPE_CHECKING:
        __tablename__: str
    else:

        @declared_attr.directive
        def __tablename__(cls) -> str:
            """
            Generate __tablename__ automatically.
            Convert CamelCase class name to snake_case table name.
            """
            name = cls.__name__
            return "".join(["_" + c.lower() if c.isupper() else c for c in name]).lstrip("_")

    def to_dict(self) -> Dict[str, Any]:
        """Convert model instance to dictionary"""
        result: Dict[str, Any] = {}
        for column in self.__table__.columns:
            result[column.name] = getattr(self, column.name)
        return result

    @classmethod
    def from_dict(cls: Type[T], data: Dict[str, Any]) -> T:
        """Create model instance from dictionary"""
        valid_keys = {column.name for column in cls.__table__.columns}
        filtered_data = {k: v for k, v in data.items() if k in valid_keys}
        return cls(**filtered_data)


class User(Base, BaseMixin):
    """User profiles with authentication and preferences"""

    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
        comment="User's email address (must be unique)",
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, comment="User's full name")
    career_transition_from: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True, comment="User's current or previous career field"
    )
    career_transition_to: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True, comment="User's target career field"
    )
    location: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True, comment="User's preferred job location"
    )
    target_roles: Mapped[List[str]] = mapped_column(
        JSON, default=list, nullable=False, comment="List of target job roles"
    )
    salary_range: Mapped[Dict[str, int]] = mapped_column(
        JSON, default=dict, nullable=False, comment="Expected salary range (min, max)"
    )

    # Relationships
    jobs: Mapped[List["Job"]] = relationship(
        "Job", back_populates="user", cascade="all, delete-orphan"
    )
    applications: Mapped[List["Application"]] = relationship(
        "Application", back_populates="user", cascade="all, delete-orphan"
    )
    ai_interactions: Mapped[List["AIInteraction"]] = relationship(
        "AIInteraction", back_populates="user", cascade="all, delete-orphan"
    )
    agent_sessions: Mapped[List["AgentSession"]] = relationship(
        "AgentSession", back_populates="user", cascade="all, delete-orphan"
    )
    cache_entries: Mapped[List["Cache"]] = relationship(
        "Cache", back_populates="user", cascade="all, delete-orphan", lazy="selectin"
    )

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


class Job(Base, BaseMixin):
    """Job listings discovered and analyzed by the system"""

    __tablename__ = "jobs"

    # Required fields
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Reference to the user who owns this job",
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False, comment="Job title")
    company: Mapped[str] = mapped_column(String(255), nullable=False, comment="Company name")
    location: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True, comment="Job location (can be remote)"
    )

    # Optional fields with descriptions
    description: Mapped[Optional[str]] = mapped_column(
        Text, nullable=True, comment="Job description in HTML or plain text"
    )
    requirements: Mapped[List[str]] = mapped_column(
        JSON, default=list, nullable=False, comment="List of required qualifications"
    )
    preferred_qualifications: Mapped[List[str]] = mapped_column(
        JSON, default=list, nullable=False, comment="List of preferred qualifications"
    )
    salary_range: Mapped[Dict[str, int]] = mapped_column(
        JSON, default=dict, nullable=False, comment="Salary range with min/max values"
    )
    job_type: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        comment="Type of employment (Full-time, Part-time, Contract, etc.)",
    )
    experience_level: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True, comment="Required experience level (Entry, Mid, Senior, etc.)"
    )
    remote_ok: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False, comment="Whether remote work is allowed"
    )
    application_url: Mapped[Optional[str]] = mapped_column(
        String(500), nullable=True, comment="URL to apply for the job"
    )
    application_deadline: Mapped[Optional[datetime]] = mapped_column(
        DateTime, nullable=True, comment="Application deadline (if any)"
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False, comment="Whether this job is still active"
    )
    source: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True, comment="Source of the job listing (e.g., 'linkedin', 'indeed')"
    )
    source_id: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True, index=True, comment="Original ID from the source"
    )
    posted_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime, nullable=True, comment="When the job was posted"
    )
    last_updated: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
        comment="When the record was last updated",
    )
    job_metadata: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        name="metadata",  # Keep the column name as 'metadata' in the database
        default=dict,
        nullable=False,
        comment="Additional metadata in JSON format",
    )
    url: Mapped[Optional[str]] = mapped_column(
        String(500), nullable=True, comment="URL to the original job posting"
    )
    salary_min: Mapped[Optional[int]] = mapped_column(
        Integer, nullable=True, comment="Minimum salary (extracted)"
    )
    salary_max: Mapped[Optional[int]] = mapped_column(
        Integer, nullable=True, comment="Maximum salary (extracted)"
    )
    salary_text: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True, comment="Raw salary text as it appears in the posting"
    )
    match_score: Mapped[Optional[float]] = mapped_column(
        Float, nullable=True, comment="Relevance score (0-1) for the user"
    )
    skill_requirements: Mapped[List[str]] = mapped_column(
        JSON, default=list, nullable=False, comment="List of required skills"
    )
    analysis_summary: Mapped[Optional[str]] = mapped_column(
        Text, nullable=True, comment="AI-generated analysis of the job"
    )
    discovered_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False, comment="When the job was discovered"
    )
    last_analyzed: Mapped[Optional[datetime]] = mapped_column(
        DateTime, nullable=True, comment="When the job was last analyzed"
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="jobs")
    applications: Mapped[List["Application"]] = relationship(
        "Application", back_populates="job", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Job {self.title} at {self.company}>"


class Application(Base, BaseMixin):
    """Job applications with generated materials and tracking"""

    __tablename__ = "applications"

    # Required fields
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Reference to the user who created this application",
    )
    job_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Reference to the job being applied to",
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default="draft",
        nullable=False,
        comment="Application status (draft, submitted, interview, etc.)",
    )

    # Application content
    cover_letter: Mapped[Optional[str]] = mapped_column(
        Text, nullable=True, comment="Generated cover letter"
    )
    email_application: Mapped[Optional[str]] = mapped_column(
        Text, nullable=True, comment="Full email application text"
    )
    follow_up_email: Mapped[Optional[str]] = mapped_column(
        Text, nullable=True, comment="Follow-up email content"
    )
    interview_thank_you: Mapped[Optional[str]] = mapped_column(
        Text, nullable=True, comment="Thank you email after interview"
    )

    # Application metadata
    applied_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime, nullable=True, comment="When the application was submitted"
    )
    last_updated: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
        comment="When the application was last updated",
    )
    email_sent: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False, comment="Whether the application email was sent"
    )
    response_received: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False, comment="Whether a response was received"
    )
    interview_scheduled: Mapped[Optional[datetime]] = mapped_column(
        DateTime, nullable=True, comment="Scheduled interview time (if any)"
    )

    # Generated content
    company_research: Mapped[Dict[str, Any]] = mapped_column(
        JSON, default=dict, nullable=False, comment="Research about the company"
    )
    talking_points: Mapped[List[str]] = mapped_column(
        JSON, default=list, nullable=False, comment="Talking points for interviews"
    )
    interview_prep: Mapped[Dict[str, Any]] = mapped_column(
        JSON, default=dict, nullable=False, comment="Interview preparation materials"
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="applications")
    job: Mapped["Job"] = relationship("Job", back_populates="applications")

    def __repr__(self) -> str:
        return f"<Application {self.id} for job {self.job_id}>"


class AIInteraction(Base, BaseMixin):
    """Tracks all AI interactions for monitoring and improvement"""

    __tablename__ = "ai_interactions"

    user_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True
    )
    operation_type: Mapped[str] = mapped_column(
        String(100), nullable=False, comment="Type of AI operation (e.g., 'generate_cover_letter')"
    )
    prompt: Mapped[str] = mapped_column(
        Text, nullable=False, comment="The input prompt sent to the AI"
    )
    response: Mapped[str] = mapped_column(Text, nullable=False, comment="The AI's response")
    model_used: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True, comment="Which AI model was used"
    )
    tokens_used: Mapped[Optional[int]] = mapped_column(
        Integer, nullable=True, comment="Number of tokens used in the interaction"
    )
    response_time_ms: Mapped[Optional[int]] = mapped_column(
        Integer, nullable=True, comment="Response time in milliseconds"
    )
    cache_hit: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False, comment="Whether the response was served from cache"
    )
    success: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False, comment="Whether the operation was successful"
    )
    error_message: Mapped[Optional[str]] = mapped_column(
        Text, nullable=True, comment="Error message if the operation failed"
    )
    user_feedback: Mapped[Optional[int]] = mapped_column(
        Integer, nullable=True, comment="User rating or feedback (1-5)"
    )

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", back_populates="ai_interactions")

    # Indexes
    __table_args__ = (
        Index("ix_ai_interactions_user_id", "user_id"),
        Index("ix_ai_interactions_created_at", "created_at"),
        Index("ix_ai_interactions_operation_type", "operation_type"),
        Index("ix_ai_interactions_success", "success"),
    )


class AgentSession(Base, BaseMixin):
    """Multi-agent orchestration sessions for advanced intelligence"""

    __tablename__ = "agent_sessions"

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    session_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="Type of agent session (e.g., 'job_search', 'resume_analysis')",
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default="active",
        nullable=False,
        comment="Current status of the session (active, completed, failed)",
    )
    active_agents: Mapped[List[str]] = mapped_column(
        SQLJSON, default=list, nullable=False, comment="List of currently active agent names"
    )
    completed_agents: Mapped[List[str]] = mapped_column(
        SQLJSON, default=list, nullable=False, comment="List of completed agent names"
    )
    agent_results: Mapped[Dict[str, Any]] = mapped_column(
        SQLJSON, default=dict, nullable=False, comment="Results from each agent in the session"
    )
    input_data: Mapped[Dict[str, Any]] = mapped_column(
        SQLJSON, default=dict, nullable=False, comment="Input data for the session"
    )
    final_result: Mapped[Dict[str, Any]] = mapped_column(
        SQLJSON, default=dict, nullable=False, comment="Final result of the session"
    )
    started_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False, comment="When the session was started"
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime, nullable=True, comment="When the session was completed"
    )
    total_duration_ms: Mapped[Optional[int]] = mapped_column(
        Integer, nullable=True, comment="Total duration of the session in milliseconds"
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="agent_sessions")


class MarketAnalysis(Base, BaseMixin):
    """Real-time job market analysis and trends"""

    __tablename__ = "market_analysis"

    # Analysis scope
    field: Mapped[str] = mapped_column(
        String(100), nullable=False, comment="Industry field (e.g., social_work, finance, etc.)"
    )
    location: Mapped[str] = mapped_column(
        String(100), nullable=False, comment="Geographic location for this analysis"
    )
    analysis_date: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    # Market data
    total_jobs_found: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    average_salary: Mapped[Optional[int]] = mapped_column(
        Integer, nullable=True, comment="Average salary in USD"
    )
    salary_range: Mapped[Dict[str, Any]] = mapped_column(SQLJSON, default=dict, nullable=False)

    # Skill trends
    top_skills: Mapped[List[str]] = mapped_column(SQLJSON, default=list, nullable=False)
    emerging_skills: Mapped[List[str]] = mapped_column(SQLJSON, default=list, nullable=False)
    skill_frequency: Mapped[Dict[str, int]] = mapped_column(SQLJSON, default=dict, nullable=False)

    # Company insights
    top_employers: Mapped[List[Dict[str, Any]]] = mapped_column(
        SQLJSON, default=list, nullable=False
    )
    company_hiring_trends: Mapped[Dict[str, Any]] = mapped_column(
        SQLJSON, default=dict, nullable=False
    )

    # Predictions
    demand_forecast: Mapped[Dict[str, Any]] = mapped_column(SQLJSON, default=dict, nullable=False)
    competition_level: Mapped[Optional[str]] = mapped_column(
        String(50), nullable=True, comment="Level of competition (low, medium, high)"
    )

    # Data freshness
    expires_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, comment="When this analysis should be considered stale"
    )
    source_count: Mapped[int] = mapped_column(
        Integer, default=0, nullable=False, comment="Number of data sources used for this analysis"
    )

    def __repr__(self) -> str:
        return f"<MarketAnalysis {self.field} in {self.location}>"


class Cache(Base, BaseMixin):
    """Database-backed cache for expensive operations"""

    __tablename__ = "cache"

    key: Mapped[str] = mapped_column(String(255), primary_key=True, index=True)
    value: Mapped[str] = mapped_column(Text, nullable=False, comment="JSON serialized data")
    operation_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    hit_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    size_bytes: Mapped[Optional[int]] = mapped_column(
        Integer, nullable=True, comment="Size of the cached value in bytes"
    )
    user_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True
    )

    # Relationship
    user: Mapped[Optional["User"]] = relationship("User", back_populates="cache_entries")
