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

    from app.models.database import User, Base
    from app.core.database import SessionLocal, get_db
    
    # 2. Patch dependencies
    # We patch the FLOW function imported in the router.
    with patch("app.api.routes.career.ingest_career_docs", new_callable=AsyncMock) as mock_flow:
        mock_flow.return_value = mock_ai_result

        # Mock the PDF parser too, just to avoid filesystem/PDF issues
        with patch("app.api.routes.career.extract_text_from_upload", new_callable=AsyncMock) as mock_parser:
            mock_parser.return_value = "Raw resume text content..."

            # Ensure tables are created and user exists in the SQLite memory DB
            # Use a fresh session for setup
            db = SessionLocal()
            
            # Create user if not exists
            user_id = "test_user_id"
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                user = User(id=user_id, email="test@example.com", name="Test User")
                db.add(user)
                db.commit()

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
            db.refresh(user)
            assert user.user_metadata["career_profile"]["personal_info"]["full_name"] == "Jane Doe"
