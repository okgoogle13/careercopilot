from unittest.mock import MagicMock, patch

# A pydantic model mock to simulate the output of the genkit flow
class MockVoiceProfile(MagicMock):
    def dict(self):
        return {"tone": "professional", "style": "concise"}

def test_generate_and_save_voice_profile(client, mock_db):
    """Test the generate_and_save_voice_profile endpoint."""
    with patch("app.api.v1.profile.generate_voice_profile") as mock_flow:
        mock_flow.return_value = {"tone": "professional", "style": "concise"}
        # Attach mock_db to app for test compatibility
        client.app.mock_db = mock_db

        response = client.post("/api/v1/profile/generate-voice-profile")

        assert response.status_code == 200
        assert response.json() == {"tone": "professional", "style": "concise"}
        mock_flow.assert_called_once_with("test_user_id")

        # Assert that the database was called to save the profile
        mock_db.collection.assert_called_with("users")
        mock_db.collection.return_value.document.assert_called_with("test_user_id")
        mock_db.collection.return_value.document.return_value.set.assert_called_with(
            {"voice_profile": {"tone": "professional", "style": "concise"}}, merge=True
        )
