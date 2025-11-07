import os
from google.cloud import storage

class CloudStorageClient:
    def __init__(self):
        self.bucket_name = os.getenv("GCS_BUCKET_NAME")
        if not self.bucket_name:
            raise ValueError("GCS_BUCKET_NAME environment variable not set.")
        self.client = storage.Client()
        self.bucket = self.client.bucket(self.bucket_name)

    def upload_file(self, file_content: bytes, destination_blob_name: str, content_type: str) -> str:
        """Uploads a file to the bucket and returns its URI."""
        blob = self.bucket.blob(destination_blob_name)
        blob.upload_from_string(file_content, content_type=content_type)
        return f"gs://{self.bucket_name}/{destination_blob_name}"

    def download_file(self, source_blob_name: str) -> bytes:
        """Downloads a blob from the bucket."""
        blob = self.bucket.blob(source_blob_name)
        return blob.download_as_bytes()

    def delete_file(self, blob_name: str):
        """Deletes a blob from the bucket."""
        blob = self.bucket.blob(blob_name)
        blob.delete()

cloud_storage_client = CloudStorageClient()
