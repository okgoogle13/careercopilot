"""
Integration tests for user profile creation using SQLAlchemy and PostgreSQL.
"""

import pytest

from app.core.database import SessionLocal, db_config
from app.models.database import User
from app.services.user_profile_service import UserProfileService


@pytest.mark.asyncio
class TestProfileCreation:
    """Test class for user profile creation integration tests."""

    @pytest.fixture(scope="class", autouse=True)
    def setup_database(self):
        """Create database tables for testing."""
        db_config.create_tables()
        yield
        # Optional: db_config.drop_tables() if we want clean slate

    @pytest.fixture
    def db_session(self):
        """Get the database session for direct access."""
        session = SessionLocal()
        try:
            yield session
        finally:
            session.close()

    @pytest.fixture
    def profile_service(self):
        """Create a UserProfileService instance for testing."""
        return UserProfileService()

    @pytest.fixture(autouse=True)
    def cleanup_test_data(self, db_session):
        """Clean up test data after each test."""
        yield
        try:
            db_session.query(User).filter(User.id.like("test-user%")).delete(
                synchronize_session=False
            )
            db_session.commit()
        except Exception as e:
            print(f"Warning: Failed to cleanup test data: {e}")
            db_session.rollback()

    async def test_create_user_profile_basic(self, profile_service, db_session):
        """Test basic user profile creation."""
        user_id = "test-user-123"
        email = f"{user_id}@example.com"
        name = "Test User"
        location = "Sydney, Australia"

        result = await profile_service.create_user_profile(
            db=db_session, user_id=user_id, email=email, name=name, location=location
        )

        assert result["id"] == user_id
        assert result["email"] == email
        assert result["name"] == name
        assert result["location"] == location
        assert "created_at" in result

        # Verify in DB
        db_user = db_session.query(User).filter(User.id == user_id).first()
        assert db_user is not None
        assert db_user.email == email
        assert db_user.name == name

    async def test_get_user_profile_after_creation(self, profile_service, db_session):
        """Test retrieving a user profile after creation."""
        user_id = "test-user-retrieve"
        email = "retrieve@example.com"
        name = "Retrieve User"

        await profile_service.create_user_profile(
            db=db_session, user_id=user_id, email=email, name=name
        )
        retrieved_profile = await profile_service.get_user_profile(db=db_session, user_id=user_id)

        assert retrieved_profile is not None
        assert retrieved_profile["id"] == user_id
        assert retrieved_profile["email"] == email
