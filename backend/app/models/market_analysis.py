"""Market analysis models for job market trends."""
from datetime import datetime
from typing import Dict, List, Optional, Any

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, BaseMixin

class MarketAnalysis(Base, BaseMixin):
    """Real-time job market analysis and trends."""
    
    __tablename__ = "market_analysis"
    
    # Analysis scope
    field: Mapped[str] = mapped_column(String(100), nullable=False)  # social_work, finance, etc.
    location: Mapped[str] = mapped_column(String(100), nullable=False)
    analysis_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Market data
    total_jobs_found: Mapped[int] = mapped_column(Integer, nullable=False)
    average_salary: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    salary_range: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    
    # Skill trends
    top_skills: Mapped[List[str]] = mapped_column(JSON, default=list)
    emerging_skills: Mapped[List[str]] = mapped_column(JSON, default=list)
    skill_frequency: Mapped[Dict[str, int]] = mapped_column(JSON, default=dict)
    
    # Company insights
    top_employers: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    company_hiring_trends: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    
    # Predictions
    demand_forecast: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    competition_level: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    # Data freshness
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    source_count: Mapped[int] = mapped_column(Integer, default=0)
    
    def __repr__(self) -> str:
        return f"<MarketAnalysis {self.field} in {self.location}>"
