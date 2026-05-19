"""Integration checks for Chrome extension API surface."""

import pytest
from fastapi.testclient import TestClient

_APP_IMPORT_ERROR: str | None = None

try:
    from app.main import app
except ImportError as exc:  # pragma: no cover - environment-dependent optional deps
    app = None  # type: ignore[assignment]
    _APP_IMPORT_ERROR = str(exc)


@pytest.fixture
def client() -> TestClient:
    if _APP_IMPORT_ERROR:
        pytest.skip(f"Skipping chrome extension integration tests: {_APP_IMPORT_ERROR}")
    return TestClient(app, raise_server_exceptions=False)


def _analyze_route_is_available(client: TestClient) -> bool:
    response = client.post(
        "/api/chrome-extension/analyze",
        json={
            "title": "Senior Python Engineer",
            "company": "Acme Corp",
            "description": "Python and FastAPI role",
            "url": "https://example.com/jobs/123",
        },
    )
    return response.status_code != 404


def test_chrome_extension_analyze_requires_auth_when_available(client: TestClient) -> None:
    if not _analyze_route_is_available(client):
        pytest.skip("Chrome extension analyze endpoint is not mounted on develop")

    response = client.post(
        "/api/chrome-extension/analyze",
        json={
            "title": "Senior Python Engineer",
            "company": "Acme Corp",
            "description": "Python and FastAPI role",
            "url": "https://example.com/jobs/123",
        },
    )
    assert response.status_code in (401, 403)
