"""
Database models for CareerCopilot production system.
Supports both PostgreSQL (production) and SQLite (development).
"""

import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional, Type, TypeVar

from sqlalchemy import JSON, Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import declarative_base, relationship

# Create a generic type variable that can be 'Base'
T = TypeVar('T', bound='Base')

# Create a base class with proper type hints
class Base:
    """Base class for all database models"""
    
    @declared_attr
    def __tablename__(cls) -> str:
        """
        Generate __tablename__ automatically.
        Convert CamelCase class name to snake_case table name.
        """
        return ''.join(['_'+c.lower() if c.isupper() else c for c in cls.__name__]).lstrip('_')

    def to_dict(self) -> Dict[str, Any]:
        """Convert model instance to dictionary"""
        return {
            column.name: getattr(self, column.name) 
            for column in self.__table__.columns
        }

    @classmethod
    def from_dict(cls: Type[T], data: Dict[str, Any]) -> T:
        """Create model instance from dictionary"""
        return cls(**{
            key: value 
            for key, value in data.items() 
            if key in cls.__table__.columns
        })

# Create declarative base with our custom Base class
Base = declarative_base(cls=Base)


class User(Base):
    """User profiles with authentication and preferences"""

    __tablename__ = "users"

    id: str = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email: str = Column(String(255), unique=True, nullable=False)
    name: str = Column(String(255), nullable=False)
    created_at: datetime = Column(DateTime, default=datetime.utcnow)
    updated_at: datetime = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Career transition context
    career_transition_from: Optional[str] = Column(String(100), nullable=True)
    career_transition_to: Optional[str] = Column(String(100), nullable=True)
    location: Optional[str] = Column(String(100), nullable=True)
    target_roles: List[str] = Column(JSON, default=list)  # List of target roles
    salary_range: Dict[str, int] = Column(JSON, default=dict)  # {"min": 60000, "max": 90000}

    # Relationships
    jobs: List['Job'] = relationship("Job", back_populates="user")
    applications: List['Application'] = relationship("Application", back_populates="user")
    ai_interactions: List['AIInteraction'] = relationship("AIInteraction", back_populates="user")
    agent_sessions: List['AgentSession'] = relationship("AgentSession", back_populates="user")


class Job(Base):
    """Job listings discovered and analyzed by the system"""

    __tablename__ = "jobs"

    id: str = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: str = Column(String, ForeignKey("users.id"), nullable=False)

    # Job details
    title: str = Column(String(255), nullable=False)
    company: str = Column(String(255), nullable=False)
    location: Optional[str] = Column(String(255), nullable=True)
    description: Optional[str] = Column(Text, nullable=True)
    requirements: List[str] = Column(JSON, default=list)
    preferred_qualifications: List[str] = Column(JSON, default=list)
    salary_range: Dict[str, int] = Column(JSON, default=dict)
    job_type: Optional[str] = Column(String(50), nullable=True)  # full-time, part-time, contract, etc.
    experience_level: Optional[str] = Column(String(50), nullable=True)  # entry, mid, senior, executive
    remote_ok: bool = Column(Boolean, default=False)
    application_url: Optional[str] = Column(String(500), nullable=True)
    application_deadline: Optional[datetime] = Column(DateTime, nullable=True)
    is_active: bool = Column(Boolean, default=True)
    source: Optional[str] = Column(String(100), nullable=True, index=True)  # Where the job was scraped from
    source_id: Optional[str] = Column(String(255), nullable=True, index=True)  # External ID from source
    posted_date: Optional[datetime] = Column(DateTime, nullable=True)
    last_updated: datetime = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    metadata: Dict[str, Any] = Column(JSON, default=dict)  # Additional metadata
    url: Optional[str] = Column(String(500), nullable=True)
    salary_min: Optional[int] = Column(Integer, nullable=True)
    salary_max: Optional[int] = Column(Integer, nullable=True)
    salary_text: Optional[str] = Column(String(255), nullable=True)

    # AI analysis
    match_score: Optional[float] = Column(Float, nullable=True)  # 0-1 compatibility score
    skill_requirements: List[str] = Column(JSON, default=list)
    analysis_summary: Optional[str] = Column(Text, nullable=True)

    # Status tracking
    discovered_at: datetime = Column(DateTime, default=datetime.utcnow)
    last_analyzed: Optional[datetime] = Column(DateTime, nullable=True)
    is_active: bool = Column(Boolean, default=True)


class Application(Base):
    """Job applications with generated materials and tracking"""

    __tablename__ = "applications"

    id: str = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: str = Column(String, ForeignKey("users.id"), nullable=False)
    job_id: str = Column(String, ForeignKey("jobs.id"), nullable=False)

    # Application status
    status = Column(
        String(50), default="prepared"
    )  # prepared, submitted, responded, interview, rejected, accepted
    applied_at = Column(DateTime, nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Generated materials
    cover_letter = Column(Text, nullable=True)
    email_application = Column(Text, nullable=True)
    follow_up_email = Column(Text, nullable=True)
    interview_thank_you = Column(Text, nullable=True)

    # Company research
    company_research = Column(JSON, default=dict)
    talking_points = Column(JSON, default=list)
    interview_prep = Column(JSON, default=dict)

    # Tracking
    email_sent = Column(Boolean, default=False)
    response_received = Column(Boolean, default=False)
    interview_scheduled = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")


class AIInteraction(Base):
    """Tracks all AI interactions for monitoring and improvement"""

    __tablename__ = "ai_interactions"

    id: str = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = Column(String, ForeignKey("users.id"), nullable=True)

    # Interaction details
    operation_type = Column(String(100), nullable=False)  # salary_intelligence, skills_trends, etc.
    prompt = Column(Text, nullable=False)
    response = Column(Text, nullable=False)

    # Metadata
    model_used = Column(String(100), nullable=True)
    tokens_used = Column(Integer, nullable=True)
    response_time_ms = Column(Integer, nullable=True)
    cache_hit = Column(Boolean, default=False)

    # Quality tracking
    success = Column(Boolean, default=True)
    error_message = Column(Text, nullable=True)
    user_feedback = Column(Integer, nullable=True)  # 1-5 rating

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="ai_interactions")


class AgentSession(Base):
    """Multi-agent orchestration sessions for advanced intelligence"""

    __tablename__ = "agent_sessions"

    id: str = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: str = Column(String, ForeignKey("users.id"), nullable=False)

    # Session details
    session_type = Column(
        String(100), nullable=False
    )  # daily_discovery, application_prep, market_analysis
    status = Column(String(50), default="active")  # active, completed, failed

    # Agent coordination
    active_agents = Column(JSON, default=list)  # List of agent names currently running
    completed_agents = Column(JSON, default=list)  # List of completed agents
    agent_results = Column(JSON, default=dict)  # Results from each agent

    # Session data
    input_data = Column(JSON, default=dict)
    final_result = Column(JSON, default=dict)

    # Performance tracking
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    total_duration_ms = Column(Integer, nullable=True)

    # Relationships
    user = relationship("User", back_populates="agent_sessions")


class MarketAnalysis(Base):
    """Real-time job market analysis and trends"""

    __tablename__ = "market_analysis"

    id: str = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    # Analysis scope
    field = Column(String(100), nullable=False)  # social_work, finance, etc.
    location = Column(String(100), nullable=False)
    analysis_date = Column(DateTime, default=datetime.utcnow)

    # Market data
    total_jobs_found = Column(Integer, nullable=False)
    average_salary = Column(Integer, nullable=True)
    salary_range = Column(JSON, default=dict)  # {"min": X, "max": Y, "median": Z}

    # Skill trends
    top_skills = Column(JSON, default=list)  # Most in-demand skills
    emerging_skills = Column(JSON, default=list)  # Trending skills
    skill_frequency = Column(JSON, default=dict)  # Skill -> count mapping

    # Company insights
    top_employers = Column(JSON, default=list)
    company_hiring_trends = Column(JSON, default=dict)

    # Predictions
    demand_forecast = Column(JSON, default=dict)  # Short-term hiring predictions
    competition_level = Column(String(50), nullable=True)  # low, medium, high

    # Data freshness
    expires_at = Column(DateTime, nullable=False)
    source_count = Column(Integer, default=0)  # Number of job sources analyzed


class Cache(Base):
    """Database-backed cache for expensive operations"""

    __tablename__ = "cache"

    key: str = Column(String(255), primary_key=True)
    value: str = Column(Text, nullable=False)  # JSON serialized data
    operation_type: str = Column(String(100), nullable=False)

    # TTL management
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    hit_count = Column(Integer, default=0)

    # Metadata
    size_bytes = Column(Integer, nullable=True)
    user_id = Column(String, nullable=True)
