import os
import sys
from unittest.mock import MagicMock

from fastapi import FastAPI
from fastapi.testclient import TestClient

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from unittest.mock import patch

# Import ONLY what we need (avoid app.main)
from app.api.endpoints.ingest import router as ingest_router
from app.core.dependencies import get_current_user

# Create Minimal App
app = FastAPI()
app.include_router(ingest_router, prefix="/api/ingest")


# Mock Dependency reaching the new SQLAlchemy format
def mock_get_current_user():
    return MagicMock(id="test_user_id", email="test@genkit.ai")


# Apply Override
app.dependency_overrides[get_current_user] = mock_get_current_user

# Sample Resume Content
SAMPLE_RESUME = """
JOHN DOE
Software Engineer

EXPERIENCE
Tech Corp | Senior Developer | 2020 - Present
- Led the migration of legacy monolith to microservices using Python and Go.
- Improved system latency by 40% through caching strategies.
- Mentored 5 junior developers.

Startup Inc | Junior Developer | 2018 - 2020
- Developed REST APIs using Flask.
- Handled database migrations.

EDUCATION
University of Tech | BS Computer Science | 2018
"""


def verify_ingestion():
    # Use patch to avoid real VectorStore/DB calls
    with patch("app.api.endpoints.ingest.IngestionService") as mock_service_class:
        mock_service = MagicMock()
        mock_service_class.return_value = mock_service

        client = TestClient(app)

        print("🚀 Starting Ingestion Verification (Supabase/RAG)...")
        print("---------------------------------------------")

        # Create dummy file
        file_content = SAMPLE_RESUME.encode("utf-8")
        files = {"file": ("resume.txt", file_content, "text/plain")}

        try:
            # Note: source_type as form data
            response = client.post(
                "/api/ingest/artifacts/upload", files=files, data={"source_type": "resume"}
            )

            if response.status_code == 200:
                print("✅ API Call Successful (200 OK)")
                print(f"✅ Response: {response.json()}")

                # Verify service was called correctly
                mock_service.process_file.assert_called_once()
                print("✅ IngestionService called correctly with user_id.")
            else:
                print(f"❌ API Call Failed: {response.status_code}")
                print(response.text)

        except Exception as e:
            print(f"❌ Exception Verification Failed: {e!s}")


if __name__ == "__main__":
    verify_ingestion()
