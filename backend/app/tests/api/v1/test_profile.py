import pytest
from httpx import AsyncClient
from unittest.mock import patch, MagicMock

# A pydantic model mock to simulate the output of the genkit flow
class MockVoiceProfile(MagicMock):
    def dict(self):
        return {"tone": "professional", "style": "concise"}

@pytest.mark.asyncio
async def test_generate_and_save_voice_profile(client: AsyncClient, mock_db: MagicMock):
    """Test the generate_and_save_voice_profile endpoint."""
    # Mock the Genkit flow's run method
    with patch.object(generateVoiceProfile, "run") as mock_run:
        # Configure the mock to return a future-like object with a result
        mock_run.return_value = MockVoiceProfile()

        # Make the request to the endpoint
        response = await client.post("/api/v1/profile/generate-voice-profile")

        # Assert the response
        assert response.status_code == 200
        assert response.json() == {"tone": "professional", "style": "concise"}

        # Assert that the Genkit flow was called with the correct UID
        mock_run.assert_called_once_with("test_user_id")

        # Assert that the database was called to save the profile
        mock_db.collection.assert_called_with("users")
        mock_db.collection.return_value.document.assert_called_with("test_user_id")
        mock_db.collection.return_value.document.return_value.set.assert_called_with(
            {"voice_profile": {"tone": "professional", "style": "concise"}},
            merge=True
        )
