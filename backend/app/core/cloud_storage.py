
<<<<<<< HEAD
import os
import logging
from typing import Optional, Dict, Any, Tuple
from datetime import datetime
=======
import logging
import os
from typing import Any

>>>>>>> restoration-KR-Rage-Figma-v2.0
from app.core.supabase import get_supabase_storage

logger = logging.getLogger(__name__)

class CloudStorageClient:
    """Supabase Storage implementation of the Cloud Storage client.
    Replaces Google Cloud Storage implementation.
    """
<<<<<<< HEAD
    
    def __init__(self, bucket_name: Optional[str] = None):
=======

    def __init__(self, bucket_name: str | None = None):
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """Initialize with Supabase bucket name.
        
        Args:
            bucket_name: Optional override for bucket name. Defaults to SUPABASE_STORAGE_BUCKET.
        """
        self.bucket_name = bucket_name or os.getenv("SUPABASE_STORAGE_BUCKET", "user_assets")
        self.storage = get_supabase_storage()
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
    def upload_file(
        self,
        file_content: bytes,
        destination_blob_name: str,
        content_type: str,
<<<<<<< HEAD
        metadata: Optional[Dict[str, str]] = None,
        cache_control: str = 'public, max-age=3600'
=======
        metadata: dict[str, str] | None = None,
        cache_control: str = "public, max-age=3600"
>>>>>>> restoration-KR-Rage-Figma-v2.0
    ) -> str:
        """Uploads a file to Supabase bucket and returns its URI.
        
        Args:
            file_content: The file content to upload
            destination_blob_name: The path/name of the blob in the bucket
            content_type: The MIME type of the file
            metadata: Optional metadata to attach (Supabase metadata handled via options)
            cache_control: Cache-Control header value
            
        Returns:
            The internal storage:// URI of the uploaded file
        """
<<<<<<< HEAD
        destination_blob_name = destination_blob_name.strip('/')
        
=======
        destination_blob_name = destination_blob_name.strip("/")

>>>>>>> restoration-KR-Rage-Figma-v2.0
        # Supabase options
        file_options = {
            "content-type": content_type,
            "cache-control": cache_control,
        }
<<<<<<< HEAD
        
        # Metadata in Supabase is typically handled via a separate DB table if extensive, 
        # but ‘upsert’ flag can be passed in options.
        
=======

        # Metadata in Supabase is typically handled via a separate DB table if extensive,
        # but ‘upsert’ flag can be passed in options.

>>>>>>> restoration-KR-Rage-Figma-v2.0
        self.storage.from_(self.bucket_name).upload(
            path=destination_blob_name,
            file=file_content,
            file_options=file_options
        )
<<<<<<< HEAD
        
        logger.info(f"File uploaded to Supabase Storage: {self.bucket_name}/{destination_blob_name}")
        return f"storage://{self.bucket_name}/{destination_blob_name}"

    def download_file(self, source_blob_name: str) -> Tuple[bytes, Dict[str, Any]]:
        """Downloads a blob from the Supabase bucket.
        """
        source_blob_name = source_blob_name.strip('/')
        res = self.storage.from_(self.bucket_name).download(source_blob_name)
        
        # Supabase download returns bytes. Metadata is NOT returned with download.
        # Minimal metadata dictionary for compatibility
        return res, {
            'content_type': 'application/octet-stream', # Supabase storage-js doesn't return this in simple download
            'size': len(res)
=======

        logger.info(f"File uploaded to Supabase Storage: {self.bucket_name}/{destination_blob_name}")
        return f"storage://{self.bucket_name}/{destination_blob_name}"

    def download_file(self, source_blob_name: str) -> tuple[bytes, dict[str, Any]]:
        """Downloads a blob from the Supabase bucket.
        """
        source_blob_name = source_blob_name.strip("/")
        res = self.storage.from_(self.bucket_name).download(source_blob_name)

        # Supabase download returns bytes. Metadata is NOT returned with download.
        # Minimal metadata dictionary for compatibility
        return res, {
            "content_type": "application/octet-stream", # Supabase storage-js doesn't return this in simple download
            "size": len(res)
>>>>>>> restoration-KR-Rage-Figma-v2.0
        }

    def delete_file(self, blob_name: str) -> bool:
        """Deletes a blob from the Supabase bucket.
        """
<<<<<<< HEAD
        blob_name = blob_name.strip('/')
=======
        blob_name = blob_name.strip("/")
>>>>>>> restoration-KR-Rage-Figma-v2.0
        try:
            self.storage.from_(self.bucket_name).remove([blob_name])
            return True
        except Exception:
            return False
<<<<<<< HEAD
            
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
    def generate_signed_url(
        self,
        blob_name: str,
        expiration_hours: float = 1.0,
<<<<<<< HEAD
        method: str = 'GET',
        content_type: Optional[str] = None
    ) -> str:
        """Generate a signed URL for a Supabase blob.
        """
        blob_name = blob_name.strip('/')
        expires_in_seconds = int(expiration_hours * 3600)
        
=======
        method: str = "GET",
        content_type: str | None = None
    ) -> str:
        """Generate a signed URL for a Supabase blob.
        """
        blob_name = blob_name.strip("/")
        expires_in_seconds = int(expiration_hours * 3600)

>>>>>>> restoration-KR-Rage-Figma-v2.0
        res = self.storage.from_(self.bucket_name).create_signed_url(
            path=blob_name,
            expires_in=expires_in_seconds
        )
        # res looks like {'signedURL': '...'} or {'signedUrl': '...'}
<<<<<<< HEAD
        return res.get('signedURL') or res.get('signedUrl', "")
        
    def get_public_url(self, blob_name: str) -> str:
        """Get the public URL for a blob.
        """
        blob_name = blob_name.strip('/')
=======
        return res.get("signedURL") or res.get("signedUrl", "")

    def get_public_url(self, blob_name: str) -> str:
        """Get the public URL for a blob.
        """
        blob_name = blob_name.strip("/")
>>>>>>> restoration-KR-Rage-Figma-v2.0
        return self.storage.from_(self.bucket_name).get_public_url(blob_name)

cloud_storage_client = CloudStorageClient()
