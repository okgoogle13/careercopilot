"""
Database models for CareerCopilot production system.
Supports both PostgreSQL (production) and SQLite (development).
"""

import uuid
from datetime import datetime, timezone
from typing import (
    Any,
    Optional,
    TypeVar,
)

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship,
)

# Type variable for generic types
T = TypeVar("T", bound="Base")


class BaseMixin:
    """Base mixin class that provides common functionality for all models."""

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


class Base(DeclarativeBase, BaseMixin):
    """Base class for all database models"""

    # Type hints for SQLAlchemy
    __abstract__ = True
    __mapper_args__ = {"eager_defaults": True}

    def to_dict(self) -> dict[str, Any]:
        """Convert model instance to dictionary"""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}  # type: ignore

    @classmethod
    def from_dict(cls: type[T], data: dict[str, Any]) -> T:
        """Create model instance from dictionary"""
        return cls(**{k: v for k, v in data.items() if k in cls.__table__.columns})  # type: ignore


class User(Base):
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
    career_transition_from: Mapped[str | None] = mapped_column(
        String(100), nullable=True, comment="User's current or previous career field"
    )
    career_transition_to: Mapped[str | None] = mapped_column(
        String(100), nullable=True, comment="User's target career field"
    )
    location: Mapped[str | None] = mapped_column(
        String(100), nullable=True, comment="User's preferred job location"
    )
    target_roles: Mapped[list[str]] = mapped_column(
        JSON, default=list, nullable=False, comment="List of target job roles"
    )
    salary_range: Mapped[dict[str, int]] = mapped_column(
        JSON, default=dict, nullable=False, comment="Expected salary range (min, max)"
    )
    user_metadata: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        name="metadata",
        default=dict,
        nullable=False,
        comment="Additional user metadata (e.g., career_profile, career_database)",
    )

    # Relationships
    jobs: Mapped[list["Job"]] = relationship(
        "Job", back_populates="user", cascade="all, delete-orphan"
    )
    applications: Mapped[list["Application"]] = relationship(
        "Application", back_populates="user", cascade="all, delete-orphan"
    )
    ai_interactions: Mapped[list["AIInteraction"]] = relationship(
        "AIInteraction", back_populates="user", cascade="all, delete-orphan"
    )
    agent_sessions: Mapped[list["AgentSession"]] = relationship(
        "AgentSession", back_populates="user", cascade="all, delete-orphan"
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


class Job(Base):
    """Job listings discovered and analyzed by the system.

    This model represents job postings that users have saved or the system has discovered.
    It includes detailed information about the job, company, requirements, and metadata.
    """

    __tablename__ = "jobs"

    # Required fields with type hints and comments
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Reference to the user who owns this job",
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False, comment="Job title")
    company: Mapped[str] = mapped_column(String(255), nullable=False, comment="Company name")
    location: Mapped[str | None] = mapped_column(
        String(255), nullable=True, comment="Job location (can be remote)"
    )

    # Job details
    description: Mapped[str | None] = mapped_column(
        Text, nullable=True, comment="Job description in HTML or plain text"
    )

    # Requirements and qualifications
    requirements: Mapped[list[str]] = mapped_column(
        JSON, default=list, nullable=False, comment="List of required qualifications"
    )
    preferred_qualifications: Mapped[list[str]] = mapped_column(
        JSON, default=list, nullable=False, comment="List of preferred qualifications"
    )
    skill_requirements: Mapped[list[str]] = mapped_column(
        JSON, default=list, nullable=False, comment="List of required skills"
    )

    # Salary information
    salary_range: Mapped[dict[str, int]] = mapped_column(
        JSON, default=dict, nullable=False, comment="Salary range with min/max values"
    )
    salary_min: Mapped[int | None] = mapped_column(
        Integer, nullable=True, comment="Minimum salary (extracted)"
    )
    salary_max: Mapped[int | None] = mapped_column(
        Integer, nullable=True, comment="Maximum salary (extracted)"
    )
    salary_text: Mapped[str | None] = mapped_column(
        String(100), nullable=True, comment="Raw salary text as it appears in the posting"
    )

    # Job type and details
    job_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        comment="Type of employment (Full-time, Part-time, Contract, etc.)",
    )
    experience_level: Mapped[str | None] = mapped_column(
        String(100), nullable=True, comment="Required experience level (Entry, Mid, Senior, etc.)"
    )
    remote_ok: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False, comment="Whether remote work is allowed"
    )

    # Application details
    application_url: Mapped[str | None] = mapped_column(
        String(500), nullable=True, comment="URL to apply for the job"
    )
    application_deadline: Mapped[datetime | None] = mapped_column(
        DateTime, nullable=True, comment="Application deadline (if any)"
    )

    # Status and metadata
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False, comment="Whether this job is still active"
    )
    source: Mapped[str | None] = mapped_column(
        String(100), nullable=True, comment="Source of the job listing (e.g., 'linkedin', 'indeed')"
    )
    source_id: Mapped[str | None] = mapped_column(
        String(255), nullable=True, index=True, comment="Original ID from the source"
    )
    url: Mapped[str | None] = mapped_column(
        String(500), nullable=True, comment="URL to the original job posting"
    )

    # Timestamps
    posted_date: Mapped[datetime | None] = mapped_column(
        DateTime, nullable=True, comment="When the job was posted"
    )
    discovered_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False, comment="When the job was discovered"
    )
    last_analyzed: Mapped[datetime | None] = mapped_column(
        DateTime, nullable=True, comment="When the job was last analyzed"
    )
    last_updated: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
        comment="When the record was last updated",
    )

    # Additional data
    job_metadata: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        name="metadata",  # Keep the column name as 'metadata' in the database
        default=dict,
        nullable=False,
        comment="Additional metadata in JSON format",
    )
    match_score: Mapped[float | None] = mapped_column(
        Float, nullable=True, comment="Relevance score (0-1) for the user"
    )
    analysis_summary: Mapped[str | None] = mapped_column(
        Text, nullable=True, comment="AI-generated analysis of the job"
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="jobs",
        lazy="selectin",  # Use selectin loading for better performance
    )
    applications: Mapped[list["Application"]] = relationship(
        "Application", back_populates="job", cascade="all, delete-orphan", lazy="selectin"
    )

    def __repr__(self) -> str:
        """Return a string representation of the job.

        Returns:
            str: A string in the format '<Job [title] at [company]>'
        """
        return f"<Job {self.title} at {self.company}>"


class Application(Base):
    """Tracks job applications and associated materials.

    This model represents a user's application to a specific job, including
    generated materials like cover letters and resumes, along with tracking
    the application's status and related interactions.
    """

    __tablename__ = "applications"

    # Required fields with type hints and comments
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Reference to the user who owns this application",
    )
    job_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
        comment="Reference to the job being applied to (if exists)",
    )
    job_title: Mapped[str | None] = mapped_column(
        String(255), nullable=True, comment="Job title (for manual entries)"
    )
    company_name: Mapped[str | None] = mapped_column(
        String(255), nullable=True, comment="Company name (for manual entries)"
    )
    job_description: Mapped[str | None] = mapped_column(
        Text, nullable=True, comment="Job description (for manual entries)"
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default="draft",
        nullable=False,
        index=True,
        comment="Current status (draft, submitted, in_review, rejected, etc.)",
    )

    # Application content and materials
    cover_letter: Mapped[str | None] = mapped_column(
        Text, nullable=True, comment="Generated cover letter content in HTML or plain text"
    )
    resume: Mapped[dict[str, Any] | None] = mapped_column(
        JSON, nullable=True, comment="Resume data in structured format (JSON)"
    )
    resume_text: Mapped[str | None] = mapped_column(
        Text, nullable=True, comment="Plain text version of the resume for search and analysis"
    )
    resume_file: Mapped[str | None] = mapped_column(
        String(500), nullable=True, comment="Path or URL to the resume file"
    )
    application_form: Mapped[dict[str, Any]] = mapped_column(
        JSON, default=dict, nullable=False, comment="Structured application form data"
    )
    custom_answers: Mapped[dict[str, str]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
        comment="Custom answers for application questions",
    )

    # Application metadata
    applied_date: Mapped[datetime | None] = mapped_column(
        DateTime, nullable=True, comment="When the application was submitted to the employer"
    )
    follow_up_date: Mapped[datetime | None] = mapped_column(
        DateTime, nullable=True, comment="Scheduled date for following up on this application"
    )
    source: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        comment="Source of the application (e.g., 'company_website', 'linkedin', 'indeed')",
    )
    application_url: Mapped[str | None] = mapped_column(
        String(500), nullable=True, comment="URL to track the application in the company's system"
    )
    application_id: Mapped[str | None] = mapped_column(
        String(255), nullable=True, comment="Application reference ID in the employer's system"
    )
    is_referred: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        comment="Whether the application was submitted with an employee referral",
    )
    referral_contact: Mapped[dict[str, Any] | None] = mapped_column(
        JSON, nullable=True, comment="Information about the person who referred this application"
    )
    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        comment="User notes, reminders, or additional information about this application",
    )
    application_metadata: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
        comment="Additional metadata and system information in JSON format",
    )

    # Relationships with loading strategies
    user: Mapped["User"] = relationship(
        "User",
        back_populates="applications",
        lazy="selectin",  # Optimize for frequent user data access
    )
    job: Mapped["Job"] = relationship(
        "Job",
        back_populates="applications",
        lazy="selectin",  # Optimize for frequent job data access
    )
    interactions: Mapped[list["AIInteraction"]] = relationship(
        "AIInteraction",
        back_populates="application",
        cascade="all, delete-orphan",
        lazy="selectin",  # Load interactions when application is loaded
    )

    def __repr__(self) -> str:
        """Return a string representation of the application.

        Returns:
            str: A string in the format '<Application [id] for job [job_id]>'
        """
        return f"<Application {self.id} for job {self.job_id}>"


class AIInteraction(Base):
    """Tracks all AI interactions for monitoring and improvement.

    This model logs interactions with AI models, including inputs, outputs,
    performance metrics, and any errors that occurred during processing.
    """

    __tablename__ = "ai_interactions"

    # Required fields
    operation_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="Type of AI operation (e.g., 'generate_cover_letter', 'analyze_resume')",
    )
    prompt: Mapped[str] = mapped_column(
        Text, nullable=False, comment="The input prompt or query sent to the AI model"
    )
    response: Mapped[str] = mapped_column(
        Text, nullable=False, comment="The raw response content from the AI model"
    )

    # Optional user reference
    user_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
        comment="Reference to the user who initiated the interaction",
    )

    application_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("applications.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
        comment="Reference to the application associated with this interaction",
    )

    application: Mapped[Optional["Application"]] = relationship(
        "Application", back_populates="interactions", lazy="selectin"
    )

    # Model and performance metrics
    model_used: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        comment="Identifier of the AI model used (e.g., 'gemini-3.0-flash', 'gemini-2.5-pro')",
    )
    tokens_used: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
        comment="Total number of tokens used in the interaction (input + output)",
    )
    response_time_ms: Mapped[int | None] = mapped_column(
        Integer, nullable=True, comment="Time taken to receive the response in milliseconds"
    )

    # Status and caching
    cache_hit: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False, comment="Whether the response was served from cache"
    )
    success: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        comment="Whether the operation completed successfully",
    )
    error_message: Mapped[str | None] = mapped_column(
        Text, nullable=True, comment="Error message if the interaction failed"
    )

    # User feedback
    user_feedback: Mapped[int | None] = mapped_column(
        Integer, nullable=True, comment="User rating or feedback score (1-5)"
    )

    # Relationships with loading strategies
    user: Mapped[Optional["User"]] = relationship(
        "User", back_populates="ai_interactions", lazy="selectin"
    )

    # Table configuration
    __table_args__ = (
        # Indexes for common query patterns
        Index("ix_ai_interactions_created_at", "created_at"),
        Index("ix_ai_interactions_operation_type", "operation_type"),
        Index("ix_ai_interactions_success", "success"),
        # Composite index for common filtering combinations
        Index("ix_ai_interactions_user_operation", "user_id", "operation_type"),
    )

    def __repr__(self) -> str:
        """Return a string representation of the AI interaction.

        Returns:
            str: A string in the format '<AIInteraction [id] ([operation_type])>'
        """
        return f"<AIInteraction {self.id} ({self.operation_type})>"


class AgentSession(Base):
    """Multi-agent orchestration sessions for advanced intelligence.

    This model represents a session where multiple AI agents work together to
    accomplish complex tasks like job searching, resume analysis, or career planning.
    """

    __tablename__ = "agent_sessions"

    # Required fields
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Reference to the user who owns this session",
    )
    session_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment=(
            "Type of agent session (e.g., 'job_search', 'resume_analysis', "
            "'career_planning', 'interview_prep')"
        ),
    )

    # Session state
    status: Mapped[str] = mapped_column(
        String(50),
        default="active",
        nullable=False,
        comment=(
            "Current status of the session: 'active', 'paused', 'completed', "
            "'failed', or 'canceled'"
        ),
    )

    # Agent tracking
    active_agents: Mapped[list[str]] = mapped_column(
        JSON, default=list, nullable=False, comment="List of currently active agent names"
    )
    completed_agents: Mapped[list[str]] = mapped_column(
        JSON, default=list, nullable=False, comment="List of completed agent names"
    )
    agent_results: Mapped[dict[str, Any]] = mapped_column(
        JSON, default=dict, nullable=False, comment="Results from each agent in the session"
    )

    # Session data
    input_data: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
        comment="Input data and configuration for the session",
    )
    final_result: Mapped[dict[str, Any]] = mapped_column(
        JSON, default=dict, nullable=False, comment="Final result and output of the session"
    )

    # Timestamps and metrics
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        comment="When the session was started",
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        comment="When the session was completed or terminated",
    )
    total_duration_ms: Mapped[int | None] = mapped_column(
        Integer, nullable=True, comment="Total duration of the session in milliseconds"
    )

    # Error tracking
    error_message: Mapped[str | None] = mapped_column(
        Text, nullable=True, comment="Error message if the session failed"
    )
    error_details: Mapped[dict[str, Any] | None] = mapped_column(
        JSON,
        default=dict,
        nullable=True,
        comment="Detailed error information if the session failed",
    )

    # Relationships with loading strategies
    user: Mapped["User"] = relationship("User", back_populates="agent_sessions", lazy="selectin")

    # Table configuration
    __table_args__ = (
        # Indexes for common query patterns
        Index("ix_agent_sessions_status", "status"),
        Index("ix_agent_sessions_type_status", "session_type", "status"),
        Index("ix_agent_sessions_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        """Return a string representation of the agent session.

        Returns:
            str: A string in the format '<AgentSession [id] ([session_type] - [status])>'
        """
        return f"<AgentSession {self.id} ({self.session_type} - {self.status})>"

    def is_active(self) -> bool:
        """Check if the session is currently active.

        Returns:
            bool: True if the session is active, False otherwise
        """
        return self.status == "active"

    def mark_completed(self, result: dict[str, Any] | None = None) -> None:
        """Mark the session as completed with optional result.

        Args:
            result: Optional final result to store
        """
        self.status = "completed"
        self.completed_at = datetime.now(timezone.utc)
        if result is not None:
            self.final_result = result

    def mark_failed(self, error: str, details: dict[str, Any] | None = None) -> None:
        """Mark the session as failed with an error message.

        Args:
            error: Error message
            details: Optional additional error details
        """
        self.status = "failed"
        self.error_message = error
        if details is not None:
            self.error_details = details
        self.completed_at = datetime.now(timezone.utc)


class MarketAnalysis(Base):
    """Real-time job market analysis and trends"""

    __tablename__ = "market_analysis"

    # Analysis scope
    field: Mapped[str] = mapped_column(
        String(100), nullable=False, comment="Industry field (e.g., social_work, finance, etc.)"
    )
    location: Mapped[str] = mapped_column(
        String(100), nullable=False, comment="[DEPRECATED_STYLE] location for this analysis"
    )
    analysis_date: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    # Market data
    total_jobs_found: Mapped[int] = mapped_column(
        Integer, nullable=False, default=0, comment="Total number of jobs found in the analysis"
    )
    average_salary: Mapped[int | None] = mapped_column(
        Integer, nullable=True, comment="Average salary in USD for the analyzed field and location"
    )
    salary_range: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
        comment="Salary range distribution (min, max, percentiles)",
    )

    # Skill trends
    top_skills: Mapped[list[str]] = mapped_column(
        JSON, default=list, nullable=False, comment="List of most in-demand skills"
    )
    emerging_skills: Mapped[list[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
        comment="List of emerging skills with growing demand",
    )
    skill_frequency: Mapped[dict[str, int]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
        comment="Frequency count of skills across job postings",
    )

    # Company insights
    top_employers: Mapped[list[dict[str, Any]]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
        comment="List of top employers in the field with job counts",
    )
    company_hiring_trends: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
        comment="Hiring trends by company size and industry",
    )

    # Predictions
    demand_forecast: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
        comment="Future demand forecast for the field and location",
    )
    competition_level: Mapped[str | None] = mapped_column(
        String(50), nullable=True, comment="Level of competition (low, medium, high)"
    )

    # Data freshness
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, comment="When this analysis should be considered stale"
    )
    source_count: Mapped[int] = mapped_column(
        Integer, default=0, nullable=False, comment="Number of data sources used for this analysis"
    )

    def __repr__(self) -> str:
        return f"<MarketAnalysis {self.field} in {self.location}>"


class Cache(Base):
    """Database-backed cache for expensive operations.

    This model stores cached results of expensive operations to improve performance.
    Each cache entry has an associated TTL and tracks usage statistics.
    """

    __tablename__ = "cache"
    __table_args__ = (
        Index("idx_cache_operation_user", "operation_type", "user_id"),
    )

    key: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True, comment="Unique cache key for lookup"
    )
    value: Mapped[str] = mapped_column(
        Text, nullable=False, comment="JSON serialized data of the cached result"
    )
    operation_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
        comment="Type of operation being cached (e.g., 'job_search', 'resume_analysis')",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        comment="When this cache entry was created",
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
        comment="When this cache entry should expire and be considered stale",
    )
    hit_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
        comment="Number of times this cache entry has been accessed",
    )
    size_bytes: Mapped[int | None] = mapped_column(
        Integer, nullable=True, comment="Size of the cached value in bytes, used for cache eviction"
    )
    user_id: Mapped[str | None] = mapped_column(
        String(36),
        nullable=True,
        index=True,
        comment="User ID associated with this cache entry",
    )

    # Relationship
