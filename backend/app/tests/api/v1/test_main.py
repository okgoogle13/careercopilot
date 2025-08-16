import pytest
from httpx import AsyncClient

async def test_health_check(test_client: AsyncClient):
    response = await test_client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
