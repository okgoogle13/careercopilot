from unittest.mock import MagicMock, patch

import pytest
from sqlalchemy.orm import Session

from app.services.user_profile_service import UserProfileService


@pytest.fixture
def mock_db_session():
    return MagicMock(spec=Session)


@pytest.fixture
def service():
    return UserProfileService()


@pytest.fixture
def mock_user_class():
    # Patch User in the service module specifically
    with patch("app.services.user_profile_service.User") as mock:
        yield mock


@pytest.mark.asyncio
async def test_create_user_profile_success(service, mock_db_session, mock_user_class):
    # Setup
    user_id = "test-uid"
    email = "test@example.com"
    name = "Test User"

    mock_user = MagicMock()
    mock_user.to_dict.return_value = {"id": user_id, "email": email, "name": name}
    mock_user_class.return_value = mock_user

    # Execute
    result = await service.create_user_profile(mock_db_session, user_id, email, name)

    # Assert
    assert result["id"] == user_id
    assert mock_db_session.add.called
    assert mock_db_session.commit.called
    assert mock_db_session.refresh.called


@pytest.mark.asyncio
async def test_create_user_profile_failure(service, mock_db_session, mock_user_class):
    # Setup
    mock_db_session.commit.side_effect = Exception("DB Error")

    # Execute & Assert
    with pytest.raises(Exception):
        await service.create_user_profile(mock_db_session, "uid", "email", "name")

    assert mock_db_session.rollback.called


@pytest.mark.asyncio
async def test_get_user_profile_success(service, mock_db_session, mock_user_class):
    # Setup
    user_id = "test-uid"
    mock_user = MagicMock()
    mock_user.to_dict.return_value = {"id": user_id}
    mock_db_session.query.return_value.filter.return_value.first.return_value = mock_user

    # Execute
    result = await service.get_user_profile(mock_db_session, user_id)

    # Assert
    assert result["id"] == user_id
    mock_db_session.query.assert_called_once()


@pytest.mark.asyncio
async def test_get_user_profile_not_found(service, mock_db_session, mock_user_class):
    # Setup
    mock_db_session.query.return_value.filter.return_value.first.return_value = None

    # Execute
    result = await service.get_user_profile(mock_db_session, "nonexistent")

    # Assert
    assert result is None


@pytest.mark.asyncio
async def test_update_user_profile_success(service, mock_db_session, mock_user_class):
    # Setup
    user_id = "test-uid"
    mock_user = MagicMock()
    mock_user.user_metadata = {}
    mock_user.to_dict.return_value = {"id": user_id, "name": "Updated Name"}
    mock_db_session.query.return_value.filter.return_value.first.return_value = mock_user

    # hasattr(user, 'name') should be true
    mock_user.name = "Old Name"

    def mock_hasattr(obj, name):
        return name == "name"

    with patch("app.services.user_profile_service.hasattr", side_effect=mock_hasattr):
        # Execute
        result = await service.update_user_profile(
            mock_db_session, user_id, {"name": "Updated Name"}
        )

        # Assert
        assert result["name"] == "Updated Name"
        assert mock_user.name == "Updated Name"
        assert mock_db_session.commit.called


@pytest.mark.asyncio
async def test_update_user_profile_metadata(service, mock_db_session, mock_user_class):
    # Setup
    user_id = "test-uid"
    mock_user = MagicMock()
    mock_user.user_metadata = None  # Test initialization of metadata
    mock_user.to_dict.return_value = {"id": user_id}
    mock_db_session.query.return_value.filter.return_value.first.return_value = mock_user

    # hasattr returns false for unknown field
    with patch("app.services.user_profile_service.hasattr", return_value=False):
        # Execute
        await service.update_user_profile(mock_db_session, user_id, {"new_field": "value"})

        # Assert
        assert mock_user.user_metadata["new_field"] == "value"
        assert mock_db_session.commit.called


@pytest.mark.asyncio
async def test_delete_user_profile_success(service, mock_db_session, mock_user_class):
    # Setup
    user_id = "test-uid"
    mock_user = MagicMock()
    mock_db_session.query.return_value.filter.return_value.first.return_value = mock_user

    # Execute
    result = await service.delete_user_profile(mock_db_session, user_id)

    # Assert
    assert result is True
    assert mock_db_session.delete.called
    assert mock_db_session.commit.called


@pytest.mark.asyncio
async def test_delete_user_profile_not_found(service, mock_db_session, mock_user_class):
    # Setup
    mock_db_session.query.return_value.filter.return_value.first.return_value = None

    # Execute
    result = await service.delete_user_profile(mock_db_session, "nonexistent")

    # Assert
    assert result is False
    assert not mock_db_session.delete.called
