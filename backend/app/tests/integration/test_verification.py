"""
Integration test for verifying the system refactoring (UserAsset, Application, Health).
"""

<<<<<<< HEAD
import pytest
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.services.user_profile_service import UserProfileService
from app.models.database import User, Application, Job
from app.models.user_asset import UserAsset
from app.core.database import SessionLocal, db_config
from app.core.monitoring_middleware import HealthCheckMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
=======

import pytest

from app.core.database import SessionLocal, db_config
from app.core.monitoring_middleware import HealthCheckMiddleware
from app.models.database import Application, Job, User
from app.models.user_asset import UserAsset

>>>>>>> restoration-KR-Rage-Figma-v2.0

@pytest.mark.asyncio
class TestSystemVerification:

    @pytest.fixture(scope="class", autouse=True)
    def setup_database(self):
        """Create database tables for testing."""
        db_config.create_tables()
        yield
        # db_config.drop_tables()

    @pytest.fixture
    def db_session(self):
        """Get the database session for direct access."""
        session = SessionLocal()
        try:
            yield session
        finally:
            session.close()

    async def test_full_flow_verification(self, db_session):
        """
        Verify the core data models and relationships refactored from Firestore.
        1. Create User
        2. Create UserAsset (Ingestion)
        3. Create Job and Application (Email Scanner/Chrome Ext)
        """
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        # 1. Create User
        user_id = "verify-user-001"
        user = User(
            id=user_id,
            email="verify@example.com",
            name="Verify User"
        )
        db_session.add(user)
        db_session.commit()

        # 2. Create UserAsset
        asset = UserAsset(
            user_id=user_id,
            document_type="resume",
            extracted_data={"skills": ["Python", "SQL"]},
            role_type="Software Engineer",
            subsectors=["Tech"],
            file_name="resume.pdf",
            file_type="application/pdf",
            storage_uri="storage://bucket/resume.pdf",
            file_size_bytes=1024
        )
        db_session.add(asset)
        db_session.commit()
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        saved_asset = db_session.query(UserAsset).filter(UserAsset.user_id == user_id).first()
        assert saved_asset is not None
        assert saved_asset.extracted_data["skills"] == ["Python", "SQL"]
        assert saved_asset.storage_uri == "storage://bucket/resume.pdf"

        # 3. Create Job and Application
        import uuid
        job_id = str(uuid.uuid4())
        job = Job(
            id=job_id,
            user_id=user_id,
            title="Senior Dev",
            company="Tech Corp",
            description="Great job",
            source="linkedin"
        )
        db_session.add(job)
        db_session.commit()
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        app = Application(
            user_id=user_id,
            job_id=job.id,
            status="applied",
            job_title="Senior Dev", # Manual override/snapshot
            company_name="Tech Corp"
        )
        db_session.add(app)
        db_session.commit()
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        saved_app = db_session.query(Application).filter(Application.user_id == user_id).first()
        assert saved_app is not None
        assert saved_app.job_id == job.id
        assert saved_app.job_title == "Senior Dev"
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        print("✅ Core Data Models Verified")

    async def test_health_check_logic(self):
        """Verify the health check middleware logic (DB check)."""
        middleware = HealthCheckMiddleware(app=None) # Mock app
<<<<<<< HEAD
        
        # Test DB check
        db_status = await middleware._check_database()
        assert db_status["healthy"] is True
        assert db_status["service"] == "postgresql" # It returns 'postgresql' even if using sqlite in test config? 
        # Actually logic is: return {"healthy": True, "service": "postgresql"}
        
=======

        # Test DB check
        db_status = await middleware._check_database()
        assert db_status["healthy"] is True
        assert db_status["service"] == "postgresql" # It returns 'postgresql' even if using sqlite in test config?
        # Actually logic is: return {"healthy": True, "service": "postgresql"}

>>>>>>> restoration-KR-Rage-Figma-v2.0
        print("✅ Health Check Logic Verified")
