import json
import os
from unittest.mock import AsyncMock, patch

import pytest

from app.schemas.career import CareerDatabase


@pytest.mark.asyncio
async def test_career_ingest_flow(client, mock_db):
    """
    Integration test for Career Ingest Flow.
    Uses 'Hollow Brain' strategy: Mocks the AI generation (Genkit) 
    but validates the entire HTTP -> Controller -> Service -> DB pipeline.
    """

    # 1. Load Golden Data (The "Hollow Brain" content)
    data_path = os.path.join(os.path.dirname(__file__), "../data/golden_career_profile.json")
    with open(data_path) as f:
        golden_data = json.load(f)

    # Create clean Pydantic model to return (emulating Genkit success)
    mock_ai_result = CareerDatabase(**golden_data)

    # 2. Patch dependencies
    # We patch the FLOW function imported in the router.
    # Note: If the router does `from ... import ingest_career_docs`, we must patch `app.api.routes.career.ingest_career_docs`.
    with patch("app.api.routes.career.ingest_career_docs", new_callable=AsyncMock) as mock_flow:
        mock_flow.return_value = mock_ai_result

        # Mock the PDF parser too, just to avoid filesystem/PDF issues
        with patch("app.api.routes.career.extract_text_from_upload", new_callable=AsyncMock) as mock_parser:
            mock_parser.return_value = "Raw resume text content..."

            # 3. Simulate Request
            # Upload a dummy PDF
            files = {"files": ("resume.pdf", b"%PDF-1.4 mock content", "application/pdf")}

            # The client fixture mocks Auth to return user "test_user_id"
            response = client.post("/api/career/ingest", files=files)

            # 4. Assertions
            assert response.status_code == 200, f"Response: {response.text}"

            data = response.json()

            # Validation: AI Output passed through
            assert data["personal_info"]["full_name"] == "Jane Doe"
            assert data["entries"][0]["organization"] == "Tech Corp"
            assert data["achievements"][0]["metric"] == "50%"

            # Validation: Persistence
            # Check if Firestore write was attempted
            # The UserProfileService calls db.collection(...).document(...).set(...)
            # mock_db is a MagicMock
            assert mock_db.collection.called
            mock_db.collection.assert_called_with("users")
