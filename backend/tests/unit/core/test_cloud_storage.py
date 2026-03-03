"""Unit tests for CloudStorageClient."""
import pytest
from unittest.mock import MagicMock, patch
from datetime import timedelta

from app.core.cloud_storage import CloudStorageClient

# Test data
TEST_BUCKET = "test-bucket"
TEST_BLOB_NAME = "test/file.txt"
TEST_CONTENT = b"test content"
TEST_CONTENT_TYPE = "text/plain"
TEST_METADATA = {"key1": "value1", "key2": "value2"}
TEST_SIGNED_URL = "https://storage.googleapis.com/test-bucket/test-file?signature=test"


@pytest.fixture
def mock_firebase_storage():
    """Fixture that mocks the Firebase storage bucket."""
    with patch("app.core.cloud_storage.get_storage") as mock_get_storage:
        mock_bucket = MagicMock()
        mock_get_storage.return_value = mock_bucket
        
        mock_blob = MagicMock()
        mock_bucket.blob.return_value = mock_blob
        mock_bucket.name = TEST_BUCKET
        
        # Configure mock blob
        mock_blob.download_as_bytes.return_value = TEST_CONTENT
        mock_blob.content_type = TEST_CONTENT_TYPE
        mock_blob.metadata = TEST_METADATA
        mock_blob.size = len(TEST_CONTENT)
        mock_blob.public_url = f"https://storage.googleapis.com/{TEST_BUCKET}/{TEST_BLOB_NAME}"
        mock_blob.generate_signed_url.return_value = TEST_SIGNED_URL
        
        yield mock_bucket, mock_blob


def test_initialization(mock_firebase_storage):
    """Test that CloudStorageClient initializes with the correct bucket."""
    client = CloudStorageClient()
    assert client.bucket is not None


def test_upload_file(mock_firebase_storage):
    """Test uploading a file to Firebase Storage."""
    mock_bucket, mock_blob = mock_firebase_storage
    
    client = CloudStorageClient()
    result = client.upload_file(
        file_content=TEST_CONTENT,
        destination_blob_name=TEST_BLOB_NAME,
        content_type=TEST_CONTENT_TYPE,
        metadata=TEST_METADATA
    )
    
    # Verify the blob was created with the correct name
    mock_bucket.blob.assert_called_with(TEST_BLOB_NAME)
    
    # Verify metadata was set
    assert mock_blob.metadata == TEST_METADATA
    
    # Verify content was uploaded
    mock_blob.upload_from_string.assert_called_once_with(
        TEST_CONTENT,
        content_type=TEST_CONTENT_TYPE
    )
    
    # Verify the return value (storage:// URI)
    assert result == f"storage://{TEST_BUCKET}/{TEST_BLOB_NAME}"


def test_download_file(mock_firebase_storage):
    """Test downloading a file from Firebase Storage."""
    _, mock_blob = mock_firebase_storage
    
    client = CloudStorageClient()
    content, metadata = client.download_file(TEST_BLOB_NAME)
    
    # Verify the blob was accessed
    mock_blob.download_as_bytes.assert_called_once()
    
    # Verify the return values
    assert content == TEST_CONTENT
    assert metadata["content_type"] == TEST_CONTENT_TYPE
    assert metadata["size"] == len(TEST_CONTENT)


def test_delete_file_success(mock_firebase_storage):
    """Test deleting an existing file from Firebase Storage."""
    _, mock_blob = mock_firebase_storage
    
    client = CloudStorageClient()
    result = client.delete_file(TEST_BLOB_NAME)
    
    # Verify the delete was called
    mock_blob.delete.assert_called_once()
    assert result is True


def test_delete_file_failure(mock_firebase_storage):
    """Test failure when deleting a file."""
    _, mock_blob = mock_firebase_storage
    mock_blob.delete.side_effect = Exception("Delete failed")
    
    client = CloudStorageClient()
    result = client.delete_file(TEST_BLOB_NAME)
    
    assert result is False


def test_generate_signed_url(mock_firebase_storage):
    """Test generating a signed URL for a blob."""
    _, mock_blob = mock_firebase_storage
    
    client = CloudStorageClient()
    url = client.generate_signed_url(
        blob_name=TEST_BLOB_NAME,
        expiration_hours=1.0,
        method="GET",
        content_type=TEST_CONTENT_TYPE
    )
    
    # Verify the signed URL was generated
    mock_blob.generate_signed_url.assert_called_once()
    
    # Verify the return value
    assert url == TEST_SIGNED_URL


def test_get_public_url(mock_firebase_storage):
    """Test getting a public URL for a blob."""
    client = CloudStorageClient()
    url = client.get_public_url(TEST_BLOB_NAME)
    
    assert url == f"https://storage.googleapis.com/{TEST_BUCKET}/{TEST_BLOB_NAME}"

