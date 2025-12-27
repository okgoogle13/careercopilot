import os
from google.cloud import storage
from google.cloud.storage import Bucket, Client
from typing import Optional, Dict, Any, Tuple

class CloudStorageClient:
    def __init__(self, bucket_name: Optional[str] = None):
        """Initialize with explicit bucket name or fall back to production bucket.
        
        Args:
            bucket_name: Optional override for bucket name. Defaults to production bucket.
        """
        self.bucket_name = bucket_name or "careercopilot-468811.firebasestorage.app"
        
        # Check if running in test environment
        if os.getenv("ENV") == "test" or os.getenv("ENVIRONMENT") == "test":
            from unittest.mock import MagicMock
            self.client = MagicMock()
            self.bucket = MagicMock()
            return

        # Initialize client with explicit region
        self.client: Client = storage.Client()
        # Get bucket with explicit location check
        self.bucket: Bucket = self.client.bucket(self.bucket_name)
        self._ensure_bucket_region()
        
    def _ensure_bucket_region(self):
        """Ensure the bucket is in us-central1 region."""
        try:
            # Force a refresh of bucket metadata
            self.bucket.reload()
            location = self.bucket.location.lower()
            if location != 'us-central1':
                raise ValueError(
                    f"Bucket {self.bucket_name} is in {location} but must be in us-central1. "
                    "Please recreate the bucket in us-central1."
                )
        except Exception as e:
            if "Not Found" in str(e):
                raise ValueError(f"Bucket {self.bucket_name} does not exist or is not accessible.") from e
            raise

    def upload_file(
        self,
        file_content: bytes,
        destination_blob_name: str,
        content_type: str,
        metadata: Optional[Dict[str, str]] = None,
        cache_control: str = 'public, max-age=3600'
    ) -> str:
        """Uploads a file to the bucket and returns its URI.
        
        Args:
            file_content: The file content to upload
            destination_blob_name: The path/name of the blob in the bucket
            content_type: The MIME type of the file
            metadata: Optional metadata to attach to the blob
            cache_control: Cache-Control header value (default: 1 hour public cache)
            
        Returns:
            The full gs:// URI of the uploaded file
        """
        # Normalize blob name (remove leading/trailing slashes)
        destination_blob_name = destination_blob_name.strip('/')
        blob = self.bucket.blob(destination_blob_name)
        
        # Set metadata if provided
        if metadata:
            blob.metadata = metadata
            
        # Set cache control for web delivery
        blob.cache_control = cache_control
        
        # Upload with content type and metadata
        blob.upload_from_string(
            file_content,
            content_type=content_type,
            predefined_acl='projectPrivate'  # Default to project private
        )
        
        return f"gs://{self.bucket_name}/{destination_blob_name}"

    def download_file(self, source_blob_name: str) -> Tuple[bytes, Dict[str, Any]]:
        """Downloads a blob from the bucket.
        
        Args:
            source_blob_name: The path/name of the blob to download
            
        Returns:
            A tuple of (file_content, metadata_dict)
        """
        # Normalize blob name
        source_blob_name = source_blob_name.strip('/')
        blob = self.bucket.blob(source_blob_name)
        
        # Download content
        content = blob.download_as_bytes()
        
        # Return content and metadata
        return content, {
            'content_type': blob.content_type,
            'metadata': blob.metadata or {},
            'size': blob.size,
            'updated': blob.updated,
            'md5_hash': blob.md5_hash,
            'cache_control': blob.cache_control,
            'content_encoding': blob.content_encoding,
            'storage_class': blob.storage_class
        }

    def delete_file(self, blob_name: str) -> bool:
        """Deletes a blob from the bucket.
        
        Args:
            blob_name: The path/name of the blob to delete
            
        Returns:
            bool: True if deleted, False if not found
            
        Raises:
            google.cloud.exceptions.GoogleCloudError: For other errors
        """
        from google.cloud.exceptions import NotFound
        
        # Normalize blob name
        blob_name = blob_name.strip('/')
        blob = self.bucket.blob(blob_name)
        
        try:
            blob.delete()
            return True
        except NotFound:
            return False
            
    def generate_signed_url(
        self,
        blob_name: str,
        expiration_hours: float = 1.0,
        method: str = 'GET',
        content_type: Optional[str] = None
    ) -> str:
        """Generate a signed URL for a blob.
        
        Args:
            blob_name: The path/name of the blob
            expiration_hours: Number of hours until the URL expires
            method: HTTP method allowed (GET, PUT, DELETE, etc.)
            content_type: Optional content type required for upload URLs
            
        Returns:
            A signed URL string
        """
        from datetime import timedelta
        
        # Normalize blob name
        blob_name = blob_name.strip('/')
        blob = self.bucket.blob(blob_name)
        
        # Generate signed URL
        url = blob.generate_signed_url(
            expiration=timedelta(hours=expiration_hours),
            method=method.upper(),
            version='v4',
            content_type=content_type
        )
        return url
        
    def get_public_url(self, blob_name: str) -> str:
        """Get the public URL for a blob (if public access is enabled).
        
        Args:
            blob_name: The path/name of the blob
                
        Returns:
            The public URL for the blob
        """
        blob_name = blob_name.strip('/')
        return f"https://storage.googleapis.com/{self.bucket_name}/{blob_name}"



cloud_storage_client = CloudStorageClient()
