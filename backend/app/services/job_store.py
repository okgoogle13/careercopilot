
import logging
from datetime import datetime
<<<<<<< HEAD
from typing import Dict, List, Optional
from fastapi import Depends
from sqlalchemy.orm import Session
from app.models.database import Job
from app.core.database import get_db
=======

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.database import Job
>>>>>>> restoration-KR-Rage-Figma-v2.0

logger = logging.getLogger(__name__)

class SQLAlchemyJobStore:
    """
    Job storage service using SQLAlchemy (PostgreSQL/Supabase).
    Replaces FirestoreJobStore.
    """
<<<<<<< HEAD
    
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
    def __init__(self, db: Session):
        """
        Initialize the job store with a DB session.
        """
        self.db = db
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
    async def add_job(self, job_data: dict) -> str:
        """
        Add a new job to storage.
        """
        # Ensure user_id is present
<<<<<<< HEAD
        if 'user_id' not in job_data:
            raise ValueError("user_id is required to add a job")
            
        # Add timestamp if not present
        if 'date_clipped' not in job_data:
            job_data['date_clipped'] = datetime.utcnow().isoformat()
        
        # Map fields to Job model
        # Note: Firestore used camelCase/snake_case mix, SQLAlchemy model uses snake_case
        job = Job(
            user_id=job_data.get('user_id'),
            title=job_data.get('title', 'Unknown Title'),
            company=job_data.get('company', 'Unknown Company'),
            location=job_data.get('location'),
            description=job_data.get('description'),
            requirements=job_data.get('requirements', []),
            preferred_qualifications=job_data.get('preferred_qualifications', []),
            skill_requirements=job_data.get('skill_requirements', []),
            salary_min=job_data.get('salary_min'),
            salary_max=job_data.get('salary_max'),
            salary_text=job_data.get('salary_text'),
            job_type=job_data.get('job_type'),
            experience_level=job_data.get('experience_level'),
            remote_ok=job_data.get('remote_ok', False),
            application_url=job_data.get('application_url'),
            source=job_data.get('source'),
            source_id=job_data.get('source_id'),
            url=job_data.get('url'),
            posted_date=datetime.fromisoformat(job_data['posted_date']) if job_data.get('posted_date') else None,
            job_metadata=job_data.get('metadata', {}),
            match_score=job_data.get('match_score'),
            analysis_summary=job_data.get('analysis_summary')
        )
        
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        
        logger.info(f"[JobStore] Added job {job.id} to PostgreSQL")
        return str(job.id)
    
    async def get_all_jobs(self, user_id: Optional[str] = None, limit: int = 100) -> List[dict]:
=======
        if "user_id" not in job_data:
            raise ValueError("user_id is required to add a job")

        # Add timestamp if not present
        if "date_clipped" not in job_data:
            job_data["date_clipped"] = datetime.utcnow().isoformat()

        # Map fields to Job model
        # Note: Firestore used camelCase/snake_case mix, SQLAlchemy model uses snake_case
        job = Job(
            user_id=job_data.get("user_id"),
            title=job_data.get("title", "Unknown Title"),
            company=job_data.get("company", "Unknown Company"),
            location=job_data.get("location"),
            description=job_data.get("description"),
            requirements=job_data.get("requirements", []),
            preferred_qualifications=job_data.get("preferred_qualifications", []),
            skill_requirements=job_data.get("skill_requirements", []),
            salary_min=job_data.get("salary_min"),
            salary_max=job_data.get("salary_max"),
            salary_text=job_data.get("salary_text"),
            job_type=job_data.get("job_type"),
            experience_level=job_data.get("experience_level"),
            remote_ok=job_data.get("remote_ok", False),
            application_url=job_data.get("application_url"),
            source=job_data.get("source"),
            source_id=job_data.get("source_id"),
            url=job_data.get("url"),
            posted_date=datetime.fromisoformat(job_data["posted_date"]) if job_data.get("posted_date") else None,
            job_metadata=job_data.get("metadata", {}),
            match_score=job_data.get("match_score"),
            analysis_summary=job_data.get("analysis_summary")
        )

        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)

        logger.info(f"[JobStore] Added job {job.id} to PostgreSQL")
        return str(job.id)

    async def get_all_jobs(self, user_id: str | None = None, limit: int = 100) -> list[dict]:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """
        Retrieve all jobs.
        """
        query = self.db.query(Job)
        if user_id:
            query = query.filter(Job.user_id == user_id)
<<<<<<< HEAD
            
        query = query.order_by(Job.created_at.desc()).limit(limit)
        jobs = query.all()
        
        return [job.to_dict() for job in jobs]
    
    async def get_job(self, job_id: str) -> Optional[dict]:
=======

        query = query.order_by(Job.created_at.desc()).limit(limit)
        jobs = query.all()

        return [job.to_dict() for job in jobs]

    async def get_job(self, job_id: str) -> dict | None:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """
        Retrieve a specific job by ID.
        """
        job = self.db.query(Job).filter(Job.id == job_id).first()
        return job.to_dict() if job else None
<<<<<<< HEAD
    
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
    async def update_job(self, job_id: str, updates: dict) -> bool:
        """
        Update a job with new data.
        """
        job = self.db.query(Job).filter(Job.id == job_id).first()
        if not job:
            return False
<<<<<<< HEAD
            
        for key, value in updates.items():
            if hasattr(job, key):
                setattr(job, key, value)
            elif key == 'metadata':
                job.job_metadata = value
                
        self.db.commit()
        return True
    
=======

        for key, value in updates.items():
            if hasattr(job, key):
                setattr(job, key, value)
            elif key == "metadata":
                job.job_metadata = value

        self.db.commit()
        return True

>>>>>>> restoration-KR-Rage-Figma-v2.0
    async def delete_job(self, job_id: str) -> bool:
        """
        Delete a job from storage.
        """
        job = self.db.query(Job).filter(Job.id == job_id).first()
        if not job:
            return False
<<<<<<< HEAD
            
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        self.db.delete(job)
        self.db.commit()
        return True

# Helper for dependency injection
def get_job_store(db: Session = Depends(get_db)) -> SQLAlchemyJobStore:
    return SQLAlchemyJobStore(db)

# Note: The singleton pattern with global _job_store is harder with DB sessions.
# Recommended to use get_job_store as a FastAPI dependency.
