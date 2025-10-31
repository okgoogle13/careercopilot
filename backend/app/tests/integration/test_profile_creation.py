"""
Integration tests for user profile creation using Firestore Emulator.

This test module validates the user profile creation logic by:
1. Setting up the Firestore Emulator connection
2. Testing profile creation through the service
3. Verifying data directly from the emulator
4. Cleaning up test data after completion
"""

import os
from datetime import datetime

import firebase_admin
import pytest
from firebase_admin import credentials, firestore

from app.services.user_profile_service import UserProfileService


@pytest.mark.skip(reason="Firestore emulator not available in CI - requires local setup")
class TestProfileCreation:
    """Test class for user profile creation integration tests."""

    @pytest.fixture(scope="class", autouse=True)
    def setup_firestore_emulator(self):
        """
        Set up Firestore Emulator for testing.

        This fixture configures the Firebase Admin SDK to connect to the local
        Firestore Emulator instead of the production Firestore instance.
        """
        # Set the Firestore emulator host environment variable
        os.environ["FIRESTORE_EMULATOR_HOST"] = "localhost:8080"
        os.environ["GCLOUD_PROJECT"] = "careercopilot-test"

        # Initialize Firebase Admin SDK with emulator configuration
        app = None
        try:
            # Try to get existing app - check if any app exists first
            apps = firebase_admin._apps
            if "test-app" in apps:
                app = firebase_admin.get_app("test-app")
        except (ValueError, KeyError):
            pass

        if app is None:
            # Initialize new app if it doesn't exist
            cred = credentials.Certificate(
                {
                    "type": "service_account",
                    "project_id": "careercopilot-test",
                    "private_key_id": "test-key-id",
                    "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB\\ntest_key_data\\n-----END PRIVATE KEY-----\\n",
                    "client_email": "test@careercopilot-test.iam.gserviceaccount.com",
                    "client_id": "test-client-id",
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                }
            )
            app = firebase_admin.initialize_app(
                credential=cred,
                options={"projectId": "careercopilot-test"},
                name="test-app",
            )

        # Store the app for cleanup
        self.app = app

        yield

        # Cleanup: Delete the Firebase app after tests
        try:
            firebase_admin.delete_app(self.app)
        except Exception:
            pass  # App might already be deleted

        # Clean up environment variables
        if "FIRESTORE_EMULATOR_HOST" in os.environ:
            del os.environ["FIRESTORE_EMULATOR_HOST"]
        if "GCLOUD_PROJECT" in os.environ:
            del os.environ["GCLOUD_PROJECT"]

    @pytest.fixture
    def firestore_client(self):
        """Get the Firestore client for direct database access."""
        return firestore.client(app=self.app)

    @pytest.fixture
    def profile_service(self):
        """Create a UserProfileService instance for testing."""
        return UserProfileService()

    @pytest.fixture(autouse=True)
    def cleanup_test_data(self, firestore_client):
        """
        Clean up test data after each test.

        This fixture ensures that each test starts with a clean state
        by removing all test users from the emulator.
        """
        yield  # Run the test first

        # Cleanup: Delete all test users after the test
        try:
            users_ref = firestore_client.collection("users")
            docs = users_ref.stream()

            for doc in docs:
                doc.reference.delete()
        except Exception as e:
            print(f"Warning: Failed to cleanup test data: {e}")

    @pytest.mark.asyncio
    async def test_create_user_profile_basic(self, profile_service, firestore_client):
        """
        Test basic user profile creation.

        This test verifies that:
        1. A user profile can be created successfully
        2. The profile data is correctly stored in Firestore
        3. The returned data matches the input data
        """
        # Arrange
        user_id = "test-user-123"
        email = "test@example.com"
        name = "Test User"
        location = "Sydney, Australia"

        # Act
        result = await profile_service.create_user_profile(
            user_id=user_id, email=email, name=name, location=location
        )

        # Assert - Check returned data
        assert result["id"] == user_id
        assert result["email"] == email
        assert result["name"] == name
        assert result["location"] == location
        assert "created_at" in result
        assert "updated_at" in result
        assert isinstance(result["created_at"], datetime)
        assert isinstance(result["updated_at"], datetime)

        # Verify data directly in Firestore
        user_ref = firestore_client.collection("users").document(user_id)
        doc = user_ref.get()

        assert doc.exists, "User document should exist in Firestore"

        firestore_data = doc.to_dict()
        assert firestore_data["email"] == email
        assert firestore_data["name"] == name
        assert firestore_data["location"] == location
        assert "created_at" in firestore_data
        assert "updated_at" in firestore_data

    @pytest.mark.asyncio
    async def test_create_user_profile_with_additional_fields(
        self, profile_service, firestore_client
    ):
        """
        Test user profile creation with additional custom fields.

        This test verifies that additional fields can be stored
        along with the basic profile information.
        """
        # Arrange
        user_id = "test-user-456"
        email = "advanced@example.com"
        name = "Advanced User"
        additional_fields = {
            "phone": "+61 400 123 456",
            "skills": ["Python", "React", "AWS"],
            "experience_years": 5,
            "linkedin_url": "https://linkedin.com/in/advanceduser",
        }

        # Act
        result = await profile_service.create_user_profile(
            user_id=user_id, email=email, name=name, **additional_fields
        )

        # Assert
        assert result["id"] == user_id
        assert result["email"] == email
        assert result["name"] == name
        assert result["phone"] == additional_fields["phone"]
        assert result["skills"] == additional_fields["skills"]
        assert result["experience_years"] == additional_fields["experience_years"]
        assert result["linkedin_url"] == additional_fields["linkedin_url"]

        # Verify directly in Firestore
        user_ref = firestore_client.collection("users").document(user_id)
        doc = user_ref.get()

        assert doc.exists
        firestore_data = doc.to_dict()

        for key, value in additional_fields.items():
            assert firestore_data[key] == value

    @pytest.mark.asyncio
    async def test_create_user_profile_minimal_data(self, profile_service, firestore_client):
        """
        Test user profile creation with minimal required data.

        This test ensures that profiles can be created with just
        the essential fields (user_id, email, name).
        """
        # Arrange
        user_id = "test-user-minimal"
        email = "minimal@example.com"
        name = "Minimal User"

        # Act
        result = await profile_service.create_user_profile(user_id=user_id, email=email, name=name)

        # Assert
        assert result["id"] == user_id
        assert result["email"] == email
        assert result["name"] == name
        assert result["location"] is None  # Should be None when not provided
        assert "created_at" in result
        assert "updated_at" in result

        # Verify in Firestore
        user_ref = firestore_client.collection("users").document(user_id)
        doc = user_ref.get()

        assert doc.exists
        firestore_data = doc.to_dict()
        assert firestore_data["email"] == email
        assert firestore_data["name"] == name
        assert firestore_data["location"] is None

    @pytest.mark.asyncio
    async def test_profile_creation_failure_scenarios(self, profile_service):
        """
        Test error handling during profile creation.

        This test verifies that appropriate errors are raised
        when profile creation fails.
        """
        # Test with empty user_id
        with pytest.raises(ValueError, match="user_id"):
            await profile_service.create_user_profile(
                user_id="", email="test@example.com", name="Test User"
            )

        # Test with None user_id
        with pytest.raises(TypeError, match="user_id"):
            await profile_service.create_user_profile(
                user_id=None, email="test@example.com", name="Test User"
            )

    @pytest.mark.asyncio
    async def test_get_user_profile_after_creation(self, profile_service, firestore_client):
        """
        Test retrieving a user profile after creation.

        This test verifies the complete workflow of creating
        and then retrieving a user profile.
        """
        # Arrange
        user_id = "test-user-retrieve"
        email = "retrieve@example.com"
        name = "Retrieve User"
        location = "Melbourne, Australia"

        # Act - Create profile
        created_profile = await profile_service.create_user_profile(
            user_id=user_id, email=email, name=name, location=location
        )

        # Act - Retrieve profile
        retrieved_profile = await profile_service.get_user_profile(user_id)

        # Assert
        assert retrieved_profile is not None
        assert retrieved_profile["id"] == created_profile["id"]
        assert retrieved_profile["email"] == created_profile["email"]
        assert retrieved_profile["name"] == created_profile["name"]
        assert retrieved_profile["location"] == created_profile["location"]

        # Verify timestamps are preserved
        assert retrieved_profile["created_at"] == created_profile["created_at"]
        assert retrieved_profile["updated_at"] == created_profile["updated_at"]

    @pytest.mark.asyncio
    async def test_multiple_users_creation(self, profile_service, firestore_client):
        """
        Test creating multiple user profiles to ensure data isolation.

        This test verifies that multiple users can be created
        without interfering with each other.
        """
        # Arrange
        users_data = [
            {"user_id": "user1", "email": "user1@example.com", "name": "User One"},
            {"user_id": "user2", "email": "user2@example.com", "name": "User Two"},
            {"user_id": "user3", "email": "user3@example.com", "name": "User Three"},
        ]

        created_profiles = []

        # Act - Create multiple users
        for user_data in users_data:
            profile = await profile_service.create_user_profile(**user_data)
            created_profiles.append(profile)

        # Assert - Verify each user exists independently
        for i, user_data in enumerate(users_data):
            user_ref = firestore_client.collection("users").document(user_data["user_id"])
            doc = user_ref.get()

            assert doc.exists, f"User {user_data['user_id']} should exist"

            firestore_data = doc.to_dict()
            assert firestore_data["email"] == user_data["email"]
            assert firestore_data["name"] == user_data["name"]

            # Verify created profile matches
            created_profile = created_profiles[i]
            assert created_profile["email"] == user_data["email"]
            assert created_profile["name"] == user_data["name"]

    @pytest.mark.asyncio
    async def test_profile_creation_timestamps(self, profile_service, firestore_client):
        """
        Test that timestamps are correctly set during profile creation.

        This test ensures that created_at and updated_at timestamps
        are properly set and have reasonable values.
        """
        # Arrange
        user_id = "test-user-timestamps"
        email = "timestamp@example.com"
        name = "Timestamp User"

        # Record time before creation
        before_creation = datetime.utcnow()

        # Act
        result = await profile_service.create_user_profile(user_id=user_id, email=email, name=name)

        # Record time after creation
        after_creation = datetime.utcnow()

        # Assert - Check timestamp validity
        created_at = result["created_at"]
        updated_at = result["updated_at"]

        assert isinstance(created_at, datetime)
        assert isinstance(updated_at, datetime)
        assert before_creation <= created_at <= after_creation
        assert before_creation <= updated_at <= after_creation
        assert created_at == updated_at  # Should be same for new profile

        # Verify timestamps in Firestore
        user_ref = firestore_client.collection("users").document(user_id)
        doc = user_ref.get()
        firestore_data = doc.to_dict()

        # Timestamps should match between service and Firestore
        assert firestore_data["created_at"] == created_at
        assert firestore_data["updated_at"] == updated_at
