"""
Tests for the Cloud Storage module.
"""

from datetime import timedelta
from unittest.mock import MagicMock, patch

import pytest

from app.core.cloud_storage import CloudStorageClient, cloud_storage_client


@pytest.fixture
def mock_bucket():
    """Mock Firebase bucket."""
    mock_bucket = MagicMock()
    mock_bucket.name = "test-bucket"
    mock_blob = MagicMock()
    mock_bucket.blob.return_value = mock_blob
    mock_blob.generate_signed_url.return_value = "https://example.com/signed"
    yield mock_bucket


@pytest.fixture
def cloud_storage_client_fixture(mock_bucket):
    """Fixture for CloudStorageClient with mocked Firebase Storage."""
    with patch("app.core.cloud_storage.get_storage", return_value=mock_bucket):
        client = CloudStorageClient()
        yield client


def test_cloud_storage_client_init(cloud_storage_client_fixture):
    """Test CloudStorageClient initialization."""
    assert cloud_storage_client_fixture.bucket is not None


def test_upload_file(cloud_storage_client_fixture, mock_bucket):
    """Test upload_file method."""
    file_content = b"test content"
    destination_blob_name = "test_file.txt"
    content_type = "text/plain"
    metadata = {"key": "value"}
    cache_control = "public, max-age=600"

    result = cloud_storage_client_fixture.upload_file(
        file_content, destination_blob_name, content_type, metadata, cache_control
    )

    assert result == f"storage://{mock_bucket.name}/{destination_blob_name}"
    mock_bucket.blob.assert_called_once_with(destination_blob_name)
    mock_bucket.blob.return_value.cache_control = cache_control
    mock_bucket.blob.return_value.metadata = metadata
    mock_bucket.blob.return_value.upload_from_string.assert_called_once_with(
        file_content, content_type=content_type
    )


def test_upload_file_no_bucket(cloud_storage_client_fixture):
    """Test upload_file when bucket is not initialized."""
    with patch("app.core.cloud_storage.get_storage", return_value=None):
        client = CloudStorageClient()
        with pytest.raises(RuntimeError):
            client.upload_file(b"test", "test.txt", "text/plain")


def test_download_file(cloud_storage_client_fixture, mock_bucket):
    """Test download_file method."""
    source_blob_name = "test_file.txt"
    mock_bucket.blob.return_value.download_as_bytes.return_value = b"downloaded content"
    mock_bucket.blob.return_value.content_type = "text/plain"
    mock_bucket.blob.return_value.size = 1024
    mock_bucket.blob.return_value.metadata = {"key": "value"}

    content, metadata = cloud_storage_client_fixture.download_file(source_blob_name)

    assert content == b"downloaded content"
    assert metadata["content_type"] == "text/plain"
    assert metadata["size"] == 1024
    assert metadata["metadata"] == {"key": "value"}
    mock_bucket.blob.assert_called_once_with(source_blob_name)


def test_download_file_no_bucket(cloud_storage_client_fixture):
    """Test download_file when bucket is not initialized."""
    with patch("app.core.cloud_storage.get_storage", return_value=None):
        client = CloudStorageClient()
        with pytest.raises(RuntimeError):
            client.download_file("test.txt")


def test_delete_file(cloud_storage_client_fixture, mock_bucket):
    """Test delete_file method."""
    blob_name = "test_file.txt"
    mock_bucket.blob.return_value.delete.return_value = None
    result = cloud_storage_client_fixture.delete_file(blob_name)
    assert result is True
    mock_bucket.blob.assert_called_once_with(blob_name)


def test_delete_file_failed(cloud_storage_client_fixture, mock_bucket):
    """Test delete_file method when deletion fails."""
    blob_name = "test_file.txt"
    mock_bucket.blob.return_value.delete.side_effect = Exception("Deletion failed")
    result = cloud_storage_client_fixture.delete_file(blob_name)
    assert result is False
    mock_bucket.blob.assert_called_once_with(blob_name)


def test_delete_file_no_bucket(cloud_storage_client_fixture):
    """Test delete_file when bucket is not initialized."""
    with patch("app.core.cloud_storage.get_storage", return_value=None):
        client = CloudStorageClient()
        assert client.delete_file("test.txt") is False


def test_generate_signed_url(cloud_storage_client_fixture, mock_bucket):
    """Test generate_signed_url method."""
    blob_name = "test_file.txt"
    expiration_hours = 2.0
    method = "GET"
    content_type = "text/plain"

    url = cloud_storage_client_fixture.generate_signed_url(
        blob_name, expiration_hours, method, content_type
    )

    assert url == "https://example.com/signed"
    mock_bucket.blob.assert_called_once_with(blob_name)
    mock_bucket.blob.return_value.generate_signed_url.assert_called_once_with(
        version="v4",
        expiration=timedelta(hours=expiration_hours),
        method=method,
        content_type=content_type,
    )


def test_generate_signed_url_no_bucket(cloud_storage_client_fixture):
    """Test generate_signed_url when bucket is not initialized."""
    with patch("app.core.cloud_storage.get_storage", return_value=None):
        client = CloudStorageClient()
        assert client.generate_signed_url("test.txt") == ""


def test_get_public_url(cloud_storage_client_fixture, mock_bucket):
    """Test get_public_url method."""
    blob_name = "test_file.txt"
    mock_bucket.blob.return_value.public_url = "http://example.com/test_file.txt"

    url = cloud_storage_client_fixture.get_public_url(blob_name)

    assert url == "http://example.com/test_file.txt"
    mock_bucket.blob.assert_called_once_with(blob_name)


def test_get_public_url_no_bucket(cloud_storage_client_fixture):
    """Test get_public_url when bucket is not initialized."""
    with patch("app.core.cloud_storage.get_storage", return_value=None):
        client = CloudStorageClient()
        assert client.get_public_url("test.txt") == ""
