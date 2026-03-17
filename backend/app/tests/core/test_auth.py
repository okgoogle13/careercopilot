from datetime import datetime
from unittest.mock import MagicMock, patch

import pytest
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials

from app.core.auth import (
    RateLimiter,
    auth_manager,
    create_user_token,
    get_current_user,
    get_current_user_optional,
)


# Use MagicMock for User instead of importing from app.models.user to avoid SQLAlchemy mapper issues
@pytest.fixture
def mock_user_class():
    class MockUser:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)

        def __eq__(self, other):
            return hasattr(other, "id") and self.id == other.id

    return MockUser


@pytest.fixture
def mock_db_session():
    return MagicMock()


@pytest.fixture
def valid_credentials():
    return HTTPAuthorizationCredentials(scheme="Bearer", credentials="valid_token")


@pytest.fixture
def invalid_credentials():
    return HTTPAuthorizationCredentials(scheme="Bearer", credentials="invalid_token")


class TestAuthManager:
    @patch("app.core.auth.verify_id_token")
    def test_verify_token(self, mock_verify):
        mock_verify.return_value = {"uid": "user123"}
        result = auth_manager.verify_token("some_token")
        assert result == {"uid": "user123"}
        mock_verify.assert_called_once_with("some_token")


class TestGetCurrentUser:
    @patch("app.core.auth.User")
    @patch.object(auth_manager, "verify_token")
    @pytest.mark.asyncio
    async def test_successful_auth_existing_user(
        self, mock_verify, mock_user_cls, mock_db_session, valid_credentials, mock_user_class
    ):
        mock_verify.return_value = {"uid": "user123", "email": "test@example.com"}
        mock_user = mock_user_class(id="user123", email="test@example.com", name="Test User")

        # Setup mock db query chain
        mock_query = MagicMock()
        mock_filter = MagicMock()
        mock_db_session.query.return_value = mock_query
        mock_query.filter.return_value = mock_filter
        mock_filter.first.return_value = mock_user

        user = await get_current_user(credentials=valid_credentials, db=mock_db_session)
        assert user == mock_user
        mock_db_session.query.assert_called_once()

    @patch("app.core.auth.User")
    @patch.object(auth_manager, "verify_token")
    @pytest.mark.asyncio
    async def test_successful_auth_new_user_provisioning(
        self, mock_verify, mock_user_cls, mock_db_session, valid_credentials, mock_user_class
    ):
        mock_verify.return_value = {
            "sub": "newuser456",
            "email": "new@example.com",
            "name": "New User",
        }

        # User doesn't exist initially
        mock_query = MagicMock()
        mock_filter = MagicMock()
        mock_db_session.query.return_value = mock_query
        mock_query.filter.return_value = mock_filter
        mock_filter.first.return_value = None

        mock_user_cls.return_value = mock_user_class(
            id="newuser456", email="new@example.com", name="New User"
        )

        user = await get_current_user(credentials=valid_credentials, db=mock_db_session)

        assert user.id == "newuser456"
        assert user.email == "new@example.com"
        assert user.name == "New User"
        mock_db_session.add.assert_called_once()
        mock_db_session.commit.assert_called_once()

    @patch.object(auth_manager, "verify_token")
    @pytest.mark.asyncio
    async def test_auth_fails_invalid_token(
        self, mock_verify, mock_db_session, invalid_credentials
    ):
        mock_verify.return_value = None
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(credentials=invalid_credentials, db=mock_db_session)
        assert exc_info.value.status_code == 401
        assert "Not authenticated" in exc_info.value.detail

    @patch.object(auth_manager, "verify_token")
    @pytest.mark.asyncio
    async def test_auth_fails_missing_user_id(
        self, mock_verify, mock_db_session, valid_credentials
    ):
        mock_verify.return_value = {"email": "no_id@example.com"}
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(credentials=valid_credentials, db=mock_db_session)
        assert exc_info.value.status_code == 401

    @patch.object(auth_manager, "verify_token")
    @pytest.mark.asyncio
    async def test_auth_provisioning_missing_email(
        self, mock_verify, mock_db_session, valid_credentials
    ):
        mock_verify.return_value = {"uid": "user_no_email"}

        mock_query = MagicMock()
        mock_filter = MagicMock()
        mock_db_session.query.return_value = mock_query
        mock_query.filter.return_value = mock_filter
        mock_filter.first.return_value = None

        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(credentials=valid_credentials, db=mock_db_session)
        assert exc_info.value.status_code == 401

    @patch("app.core.auth.User")
    @patch.object(auth_manager, "verify_token")
    @pytest.mark.asyncio
    async def test_auth_provisioning_db_error_recovery(
        self, mock_verify, mock_user_cls, mock_db_session, valid_credentials, mock_user_class
    ):
        mock_verify.return_value = {"uid": "raceuser", "email": "race@example.com"}

        # 1st query returns None (doesn't exist)
        # 2nd query (in except block) returns user
        mock_query = MagicMock()
        mock_filter = MagicMock()
        mock_db_session.query.return_value = mock_query
        mock_query.filter.return_value = mock_filter

        mock_user = mock_user_class(id="raceuser", email="race@example.com")
        mock_filter.first.side_effect = [None, mock_user]

        mock_db_session.commit.side_effect = Exception("DB Error")

        user = await get_current_user(credentials=valid_credentials, db=mock_db_session)
        assert user == mock_user
        mock_db_session.rollback.assert_called_once()

    @patch("app.core.auth.User")
    @patch.object(auth_manager, "verify_token")
    @pytest.mark.asyncio
    async def test_auth_provisioning_db_error_fail(
        self, mock_verify, mock_user_cls, mock_db_session, valid_credentials, mock_user_class
    ):
        mock_verify.return_value = {"uid": "raceuser", "email": "race@example.com"}

        mock_query = MagicMock()
        mock_filter = MagicMock()
        mock_db_session.query.return_value = mock_query
        mock_query.filter.return_value = mock_filter

        mock_filter.first.side_effect = [None, None]
        mock_db_session.commit.side_effect = Exception("DB Error")

        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(credentials=valid_credentials, db=mock_db_session)
        assert exc_info.value.status_code == 401


class TestGetCurrentUserOptional:
    @patch("app.core.auth.get_current_user")
    @pytest.mark.asyncio
    async def test_optional_auth_success(
        self, mock_get_current_user, mock_db_session, valid_credentials, mock_user_class
    ):
        mock_user = mock_user_class(id="user123")
        mock_get_current_user.return_value = mock_user

        user = await get_current_user_optional(db=mock_db_session, credentials=valid_credentials)
        assert user == mock_user

    @pytest.mark.asyncio
    async def test_optional_auth_no_credentials(self, mock_db_session):
        user = await get_current_user_optional(db=mock_db_session, credentials=None)
        assert user is None

    @patch("app.core.auth.get_current_user")
    @pytest.mark.asyncio
    async def test_optional_auth_invalid_credentials(
        self, mock_get_current_user, mock_db_session, invalid_credentials
    ):
        mock_get_current_user.side_effect = HTTPException(status_code=401)

        user = await get_current_user_optional(db=mock_db_session, credentials=invalid_credentials)
        assert user is None


class TestCreateUserToken:
    def test_create_user_token_raises_not_implemented(self, mock_user_class):
        with pytest.raises(NotImplementedError):
            create_user_token(mock_user_class(id="test"))


class TestRateLimiter:
    def test_check_rate_limit(self):
        limiter = RateLimiter()
        user_id = "testuser"

        # Test under limit
        assert limiter.check_rate_limit(user_id, limit=2, window=60) is True

        # Test at limit
        assert limiter.check_rate_limit(user_id, limit=2, window=60) is True

        # Test over limit
        assert limiter.check_rate_limit(user_id, limit=2, window=60) is False

    @patch("app.core.auth.datetime")
    def test_check_rate_limit_window_expiration(self, mock_datetime):
        limiter = RateLimiter()
        user_id = "testuser"

        # Initial request
        mock_datetime.utcnow.return_value = datetime(2023, 1, 1, 12, 0, 0)
        assert limiter.check_rate_limit(user_id, limit=1, window=60) is True

        # Second request over limit but in same window
        assert limiter.check_rate_limit(user_id, limit=1, window=60) is False

        # Third request after window expires
        mock_datetime.utcnow.return_value = datetime(2023, 1, 1, 12, 1, 1)
        assert limiter.check_rate_limit(user_id, limit=1, window=60) is True
