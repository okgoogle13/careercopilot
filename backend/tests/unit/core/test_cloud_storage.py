"""Unit tests for CloudStorageClient."""
import pytest
from unittest.mock import MagicMock, patch, PropertyMock
from google.cloud.storage import Bucket, Blob, Client
from google.cloud.exceptions import NotFound

from app.core.cloud_storage import CloudStorageClient

# Test data
TEST_BUCKET = "test-bucket"
TEST_BLOB_NAME = "test/file.txt"
TEST_CONTENT = b"test content"
TEST_CONTENT_TYPE = "text/plain"
TEST_METADATA = {"key1": "value1", "key2": "value2"}
TEST_SIGNED_URL = "https://storage.googleapis.com/test-bucket/test-file?signature=test"


@pytest.fixture
def mock_storage_client():
    """Fixture that mocks the GCS client and bucket."""
    with patch("google.cloud.storage.Client") as mock_client, \
         patch("app.core.cloud_storage.CloudStorageClient._ensure_bucket_region"):
        # Setup mock client
        mock_client_instance = MagicMock(spec=Client)
        mock_client.return_value = mock_client_instance
        
        # Setup mock bucket
        mock_bucket = MagicMock(spec=Bucket)
        mock_client_instance.bucket.return_value = mock_bucket
        
        # Setup mock blob
        mock_blob = MagicMock(spec=Blob)
        mock_bucket.blob.return_value = mock_blob
        
        # Configure the mock blob
        mock_blob.download_as_bytes.return_value = TEST_CONTENT
        mock_blob.content_type = TEST_CONTENT_TYPE
        mock_blob.metadata = {}
        mock_blob.size = len(TEST_CONTENT)
        mock_blob.md5_hash = "testhash"
        mock_blob.cache_control = None
        mock_blob.content_encoding = None
        mock_blob.storage_class = "STANDARD"
        
        # Configure signed URL generation
        mock_blob.generate_signed_url.return_value = TEST_SIGNED_URL
        
        # Mock the location property to pass region check
        type(mock_bucket).location = PropertyMock(return_value="us-central1")
        
        yield mock_client_instance, mock_bucket, mock_blob


def test_initialization():
    """Test that CloudStorageClient initializes with the correct bucket."""
    with patch("google.cloud.storage.Client") as mock_client, \
         patch("app.core.cloud_storage.CloudStorageClient._ensure_bucket_region") as mock_ensure_region:
        
        # Test with default bucket
        client = CloudStorageClient()
        assert client.bucket_name == "careercopilot-468811.firebasestorage.app"
        mock_client.return_value.bucket.assert_called_with("careercopilot-468811.firebasestorage.app")
        assert mock_ensure_region.call_count == 1
        
        # Reset mocks for the next test
        mock_client.reset_mock()
        mock_ensure_region.reset_mock()
        
        # Test with custom bucket
        custom_bucket = "custom-bucket"
        client = CloudStorageClient(bucket_name=custom_bucket)
        assert client.bucket_name == custom_bucket
        mock_client.return_value.bucket.assert_called_with(custom_bucket)
        assert mock_ensure_region.call_count == 1


def test_upload_file(mock_storage_client):
    """Test uploading a file to GCS."""
    _, mock_bucket, mock_blob = mock_storage_client
    
    client = CloudStorageClient(bucket_name=TEST_BUCKET)
    result = client.upload_file(
        file_content=TEST_CONTENT,
        destination_blob_name=TEST_BLOB_NAME,
        content_type=TEST_CONTENT_TYPE,
        metadata=TEST_METADATA
    )
    
    # Verify the blob was created with the correct name
    mock_bucket.blob.assert_called_once_with(TEST_BLOB_NAME)
    
    # Verify metadata was set
    assert mock_blob.metadata == TEST_METADATA
    
    # Verify content was uploaded
    mock_blob.upload_from_string.assert_called_once()
    
    # Verify the return value
    assert result == f"gs://{TEST_BUCKET}/{TEST_BLOB_NAME}"


def test_download_file(mock_storage_client):
    """Test downloading a file from GCS."""
    _, _, mock_blob = mock_storage_client
    
    client = CloudStorageClient(bucket_name=TEST_BUCKET)
    content, metadata = client.download_file(TEST_BLOB_NAME)
    
    # Verify the blob was accessed
    mock_blob.download_as_bytes.assert_called_once()
    
    # Verify the return values
    assert content == TEST_CONTENT
    assert metadata["content_type"] == TEST_CONTENT_TYPE
    assert metadata["size"] == len(TEST_CONTENT)


def test_delete_file_success(mock_storage_client):
    """Test deleting an existing file from GCS."""
    _, _, mock_blob = mock_storage_client
    
    client = CloudStorageClient(bucket_name=TEST_BUCKET)
    result = client.delete_file(TEST_BLOB_NAME)
    
    # Verify the delete was called
    mock_blob.delete.assert_called_once()
    assert result is True


def test_delete_file_not_found(mock_storage_client):
    """Test deleting a non-existent file from GCS."""
    _, _, mock_blob = mock_storage_client
    mock_blob.delete.side_effect = NotFound("Not found")
    
    client = CloudStorageClient(bucket_name=TEST_BUCKET)
    result = client.delete_file("nonexistent.txt")
    
    # Verify the delete was attempted but returned False (not found)
    assert result is False


def test_generate_signed_url(mock_storage_client):
    """Test generating a signed URL for a blob."""
    _, _, mock_blob = mock_storage_client
    
    client = CloudStorageClient(bucket_name=TEST_BUCKET)
    url = client.generate_signed_url(
        blob_name=TEST_BLOB_NAME,
        expiration_hours=24,
        method="GET",
        content_type=TEST_CONTENT_TYPE
    )
    
    # Verify the signed URL was generated
    mock_blob.generate_signed_url.assert_called_once()
    
    # Verify the return value
    assert url == TEST_SIGNED_URL


@patch("app.core.cloud_storage.CloudStorageClient._ensure_bucket_region")
def test_get_public_url(mock_ensure_region):
    """Test generating a public URL for a blob."""
    with patch("google.cloud.storage.Client"):
        client = CloudStorageClient(bucket_name=TEST_BUCKET)
        url = client.get_public_url(TEST_BLOB_NAME)
        
        # Verify the URL is correctly formatted
        assert url == f"https://storage.googleapis.com/{TEST_BUCKET}/{TEST_BLOB_NAME}"
