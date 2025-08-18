import sys
import os
import pytest
from httpx import AsyncClient
from unittest.mock import MagicMock

# Ensure the repository root is first on sys.path so our local test shims (e.g., genkit)
# are imported instead of any globally installed packages during pytest runs.
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from app.main import app

@pytest.fixture
def mock_db():
    """Fixture to mock the Firestore database client."""
    return MagicMock()


@pytest.fixture(autouse=True)
def override_dependencies(mock_db):
        """Automatically override external dependencies for tests.

        - Ensure endpoints using `get_current_user` receive a stable test UID.
        - Replace the real Firestore `db` client with the MagicMock fixture so
            route handlers write to the mock during tests.
        """
        from app.core.dependencies import get_current_user
        import app.core.db as core_db

        # Provide a deterministic UID for dependency calls
        app.dependency_overrides[get_current_user] = lambda: "test_user_id"

        # Swap out the db client used by routes
        core_db.db = mock_db

        # Some modules import `db` at module import time (e.g. `from app.core.db import db`).
        # Update any already-imported app.* modules that have a `db` attribute so
        # route handlers use the MagicMock during tests.
        import sys

        for mod in list(sys.modules.values()):
            try:
                name = getattr(mod, "__name__", "")
                if name.startswith("app.") and hasattr(mod, "db"):
                    setattr(mod, "db", mock_db)
            except Exception:
                # Be resilient to odd module objects in sys.modules
                continue

        yield

        # Restore clean state after each test
        app.dependency_overrides.clear()

@pytest.fixture
async def client():
    """Async test client for the app with compatibility across httpx versions.

    Tries to instantiate AsyncClient with `app=` (newer httpx). If that raises
    TypeError, falls back to using an ASGITransport.
    """
    from httpx import AsyncClient

    try:
        async with AsyncClient(app=app, base_url="http://test") as ac:
            yield ac
    except TypeError:
        # Older/newer httpx may require ASGITransport explicitly
        try:
            from httpx.asgi import ASGITransport
        except Exception:
            from httpx._transports.asgi import ASGITransport

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            yield ac



@pytest.fixture
async def test_client(client):
    """Alias for older tests expecting `test_client` fixture name."""
    yield client
