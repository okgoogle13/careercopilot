"""
Integration tests for the KSC Generation API endpoint.

These tests align with the current Genkit API contract:
POST /api/genkit/ksc/generate
"""

from typing import Any

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


class TestKscGenerationIntegration:
    @pytest.fixture
    def valid_payload(self) -> dict[str, Any]:
        return {
            "user_profile_data": {
                "name": "Test User",
                "experience": ["Led cross-functional delivery teams"],
                "skills": ["leadership", "stakeholder management"],
            },
            "ksc_statement": "Demonstrated ability to lead teams and deliver outcomes.",
        }

    @pytest.mark.asyncio
    async def test_ksc_generate_endpoint_success(self, valid_payload: dict[str, Any]):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post("/api/genkit/ksc/generate", json=valid_payload)

        assert response.status_code in (200, 503), response.text
        data = response.json()
        if response.status_code == 200:
            assert isinstance(data, dict)
            for key in ("situation", "task", "action", "result"):
                assert key in data
                assert isinstance(data[key], str)
                assert data[key].strip()
        else:
            assert data.get("detail") == "Genkit flows are disabled."

    @pytest.mark.asyncio
    async def test_ksc_generate_rejects_missing_required_fields(self):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post("/api/genkit/ksc/generate", json={})

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_ksc_generate_rejects_invalid_json(self):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/api/genkit/ksc/generate",
                content="invalid json",
                headers={"content-type": "application/json"},
            )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_ksc_generate_handles_minimal_valid_payload(self):
        payload = {"user_profile_data": {"name": "A"}, "ksc_statement": "Communication skills."}
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post("/api/genkit/ksc/generate", json=payload)

        assert response.status_code in (200, 503), response.text
        if response.status_code == 200:
            data = response.json()
            assert isinstance(data.get("result"), str)
