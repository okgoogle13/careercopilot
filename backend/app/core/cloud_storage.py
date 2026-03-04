import logging
import os
from datetime import timedelta
from typing import Any

from app.core.firebase import get_storage

logger = logging.getLogger(__name__)


class CloudStorageClient:
    """Firebase Storage implementation of the Cloud Storage client.
    Replaces Supabase Storage implementation.
    """

    def __init__(self, bucket_name: str | None = None):
        """Initialize with Firebase bucket.

        Args:
            bucket_name: Optional override for bucket name.
        """
        self._bucket_name = bucket_name
        self._bucket = None
        self._bucket_resolved = False

    @property
    def bucket(self):
        """Resolve the storage bucket lazily to avoid import-time Firebase init."""
        if not self._bucket_resolved:
            self._bucket = get_storage()
            self._bucket_resolved = True
        return self._bucket

    def upload_file(
        self,
        file_content: bytes,
        destination_blob_name: str,
        content_type: str,
        metadata: dict[str, str] | None = None,
        cache_control: str = "public, max-age=3600",
    ) -> str:
        """Uploads a file to Firebase bucket and returns its URI.

        Args:
            file_content: The file content to upload
            destination_blob_name: The path/name of the blob in the bucket
            content_type: The MIME type of the file
            metadata: Optional metadata to attach
            cache_control: Cache-Control header value

        Returns:
            The internal storage:// URI of the uploaded file
        """
        if not self.bucket:
            raise RuntimeError("Storage bucket not available")

        destination_blob_name = destination_blob_name.strip("/")
        blob = self.bucket.blob(destination_blob_name)

        # Set blob properties
        blob.cache_control = cache_control
        if metadata:
            blob.metadata = metadata

        blob.upload_from_string(file_content, content_type=content_type)

        logger.info(
            f"File uploaded to Firebase Storage: {self.bucket.name}/{destination_blob_name}"
        )
        return f"storage://{self.bucket.name}/{destination_blob_name}"

    def download_file(self, source_blob_name: str) -> tuple[bytes, dict[str, Any]]:
        """Downloads a blob from the Firebase bucket."""
        if not self.bucket:
            raise RuntimeError("Storage bucket not available")

        source_blob_name = source_blob_name.strip("/")
        blob = self.bucket.blob(source_blob_name)

        content = blob.download_as_bytes()

        # Get metadata
        blob.reload()
        metadata = {
            "content_type": blob.content_type or "application/octet-stream",
            "size": blob.size,
            "metadata": blob.metadata or {},
        }

        return content, metadata

    def delete_file(self, blob_name: str) -> bool:
        """Deletes a blob from the Firebase bucket."""
        if not self.bucket:
            return False

        blob_name = blob_name.strip("/")
        blob = self.bucket.blob(blob_name)
        try:
            blob.delete()
            return True
        except Exception as e:
            logger.error(f"Failed to delete file from Firebase: {e}")
            return False

    def generate_signed_url(
        self,
        blob_name: str,
        expiration_hours: float = 1.0,
        method: str = "GET",
        content_type: str | None = None,
    ) -> str:
        """Generate a signed URL for a Firebase blob."""
        if not self.bucket:
            return ""

        blob_name = blob_name.strip("/")
        blob = self.bucket.blob(blob_name)

        url = blob.generate_signed_url(
            version="v4",
            expiration=timedelta(hours=expiration_hours),
            method=method,
            content_type=content_type,
        )
        return url

    def get_public_url(self, blob_name: str) -> str:
        """Get the public URL for a blob."""
        if not self.bucket:
            return ""

        blob_name = blob_name.strip("/")
        blob = self.bucket.blob(blob_name)
        return blob.public_url


cloud_storage_client = CloudStorageClient()
