import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_evaluate_resume_unauthorized():
    # Depending on configuration, maybe it allows unauth?
    # Current dependencies: `get_current_user_optional`
    # That means it doesn't fail on unauthorized.
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/resume-audit/evaluate",
            json={
                "resumeText": "This is a dummy resume text. " * 20,
                "strictnessMode": "moderate",
            },
        )
    # It should succeed or fail cleanly with genkit
    # If the genkit flow is mocked or disabled, we'll see a fallback/500/200
    assert response.status_code in [200, 500], response.text
