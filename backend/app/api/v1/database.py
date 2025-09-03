"""
Database API endpoints for production system management.
"""

import logging
from datetime import datetime
from typing import Dict, List

from app.core.database import check_database_health, get_db, init_database
from app.models.database import AgentSession, AIInteraction, Application, Job, MarketAnalysis, User
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)
router = APIRouter()


class DatabaseHealthResponse(BaseModel):
    status: str
    database_type: str
    url: str = None
    error: str = None


class UserCreate(BaseModel):
    email: str
    name: str
    career_transition_from: str = None
    career_transition_to: str = None
    location: str = None
    target_roles: List[str] = []
    salary_range: Dict[str, int] = {}


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    career_transition_from: str = None
    career_transition_to: str = None
    location: str = None
    target_roles: List[str] = []
    salary_range: Dict[str, int] = {}
    created_at: datetime

    class Config:
        from_attributes = True


@router.get("/health", response_model=DatabaseHealthResponse)
async def database_health():
    """Check database connectivity and status"""
    return check_database_health()


@router.post("/init")
async def initialize_database():
    """Initialize database tables (development/testing only)"""
    try:
        init_database()
        return {"status": "success", "message": "Database initialized successfully"}
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database initialization failed: {str(e)}",
        )


@router.post("/users", response_model=UserResponse)
async def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists",
            )

        # Create new user
        db_user = User(**user_data.dict())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        logger.info(f"Created new user: {db_user.email}")
        return db_user

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}",
        )


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, db: Session = Depends(get_db)):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.get("/users/{user_id}/jobs")
async def get_user_jobs(user_id: str, limit: int = 50, db: Session = Depends(get_db)):
    """Get jobs for a specific user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    jobs = (
        db.query(Job)
        .filter(Job.user_id == user_id)
        .order_by(Job.discovered_at.desc())
        .limit(limit)
        .all()
    )
    return jobs


@router.get("/users/{user_id}/applications")
async def get_user_applications(user_id: str, limit: int = 50, db: Session = Depends(get_db)):
    """Get applications for a specific user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    applications = (
        db.query(Application)
        .filter(Application.user_id == user_id)
        .order_by(Application.last_updated.desc())
        .limit(limit)
        .all()
    )
    return applications


@router.get("/users/{user_id}/ai-interactions")
async def get_user_ai_interactions(user_id: str, limit: int = 100, db: Session = Depends(get_db)):
    """Get AI interactions for a specific user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    interactions = (
        db.query(AIInteraction)
        .filter(AIInteraction.user_id == user_id)
        .order_by(AIInteraction.created_at.desc())
        .limit(limit)
        .all()
    )
    return interactions


@router.get("/stats")
async def get_database_stats(db: Session = Depends(get_db)):
    """Get database statistics"""
    try:
        stats = {
            "users": db.query(User).count(),
            "jobs": db.query(Job).count(),
            "applications": db.query(Application).count(),
            "ai_interactions": db.query(AIInteraction).count(),
            "agent_sessions": db.query(AgentSession).count(),
            "market_analyses": db.query(MarketAnalysis).count(),
        }

        # Recent activity
        recent_users = db.query(User).order_by(User.created_at.desc()).limit(5).all()
        recent_applications = (
            db.query(Application).order_by(Application.last_updated.desc()).limit(5).all()
        )

        return {
            "counts": stats,
            "recent_users": [
                {"id": u.id, "email": u.email, "created_at": u.created_at} for u in recent_users
            ],
            "recent_applications": [
                {"id": a.id, "status": a.status, "last_updated": a.last_updated}
                for a in recent_applications
            ],
        }

    except Exception as e:
        logger.error(f"Failed to get database stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get database stats: {str(e)}",
        )
