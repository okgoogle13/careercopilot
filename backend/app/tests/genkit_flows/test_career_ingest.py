from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.genkit_flows.career_ingest import IngestInput, ingest_career_docs
from app.schemas.career import CareerDatabase


@pytest.fixture
def mock_ai():
    ai = MagicMock()
    return ai


@pytest.mark.asyncio
async def test_ingest_career_docs_success():
    mock_ai = AsyncMock()
    mock_response = MagicMock()
    mock_career_db = CareerDatabase(
        personal_info={"full_name": "John Doe", "email": "john@example.com"},
        career_profile_summary=["Experienced professional"],
        target_titles=["Manager"],
        entries=[],
        achievements=[],
    )
    mock_response.output = lambda: mock_career_db
    mock_ai.generate.return_value = mock_response

    with (
        patch("app.genkit_flows.career_ingest.ai", mock_ai),
        patch("app.genkit_flows.career_ingest.is_genkit_enabled", return_value=True),
    ):

        input_data = IngestInput(raw_text="My resume text")
        result = await ingest_career_docs(input_data)

        assert isinstance(result, CareerDatabase)
        mock_ai.generate.assert_called_once()


@pytest.mark.asyncio
async def test_ingest_career_docs_disabled():
    with patch("app.genkit_flows.career_ingest.is_genkit_enabled", return_value=False):
        input_data = IngestInput(raw_text="text")
        with pytest.raises(RuntimeError, match="Genkit flows are disabled"):
            await ingest_career_docs(input_data)


@pytest.mark.asyncio
async def test_ingest_career_docs_no_output():
    mock_ai = AsyncMock()
    mock_response = MagicMock()
    mock_response.output = None
    mock_ai.generate.return_value = mock_response

    with (
        patch("app.genkit_flows.career_ingest.ai", mock_ai),
        patch("app.genkit_flows.career_ingest.is_genkit_enabled", return_value=True),
    ):

        input_data = IngestInput(raw_text="text")
        with pytest.raises(RuntimeError, match="Genkit flow returned no output"):
            await ingest_career_docs(input_data)
