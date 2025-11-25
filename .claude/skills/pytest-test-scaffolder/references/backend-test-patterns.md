# Backend Test Patterns & Mocking

## Firestore Mocking Patterns

### Basic Firestore Mock
```python
from unittest.mock import MagicMock, AsyncMock
import pytest

@pytest.fixture
def mock_firestore(monkeypatch):
    """Mock Firestore client for testing."""
    mock_db = MagicMock()
    monkeypatch.setattr("app.core.firestore_client", mock_db)
    return mock_db

def test_user_service_with_firestore(mock_firestore):
    # Setup: Configure mock return values
    mock_doc = MagicMock()
    mock_doc.exists = True
    mock_doc.to_dict.return_value = {"id": "user-123", "name": "Test User"}

    mock_firestore.collection.return_value.document.return_value.get.return_value = mock_doc

    # Execute: Call service method
    from app.services.user_service import UserService
    user = UserService.get_user("user-123")

    # Assert: Verify result
    assert user["name"] == "Test User"
    mock_firestore.collection.assert_called_with("users")
```

### Firestore Write Operations
```python
def test_create_user_firestore_write(mock_firestore):
    """Test Firestore document creation."""
    from app.services.user_service import UserService

    user_data = {"name": "New User", "email": "user@example.com"}
    UserService.create_user(user_data)

    # Verify write was called
    mock_firestore.collection.return_value.document.return_value.set.assert_called_once()
```

### Firestore Query Operations
```python
def test_list_users_firestore_query(mock_firestore):
    """Test Firestore query execution."""
    # Setup: Mock query results
    mock_docs = [
        MagicMock(to_dict=lambda: {"id": "user-1", "name": "Alice"}),
        MagicMock(to_dict=lambda: {"id": "user-2", "name": "Bob"}),
    ]
    mock_firestore.collection.return_value.stream.return_value = mock_docs

    from app.services.user_service import UserService
    users = list(UserService.list_users())

    assert len(users) == 2
    assert users[0]["name"] == "Alice"
```

### Firestore Transaction Mock
```python
@pytest.fixture
def mock_firestore_transaction(monkeypatch):
    """Mock Firestore transaction."""
    mock_txn = MagicMock()
    mock_db = MagicMock()
    mock_db.transaction.return_value.__enter__ = MagicMock(return_value=mock_txn)
    mock_db.transaction.return_value.__exit__ = MagicMock(return_value=None)

    monkeypatch.setattr("app.core.firestore_client", mock_db)
    return mock_txn

def test_transfer_points_transaction(mock_firestore_transaction):
    """Test transactional operation."""
    from app.services.points_service import PointsService

    PointsService.transfer_points("user-1", "user-2", 100)

    # Verify both updates were called within transaction
    assert mock_firestore_transaction.update.call_count == 2
```

## Firebase Authentication Mocking

### Auth Token Mock
```python
@pytest.fixture
def mock_firebase_auth(monkeypatch):
    """Mock Firebase auth verification."""
    from firebase_admin import auth

    mock_auth = MagicMock()
    mock_auth.verify_id_token.return_value = {
        "uid": "test-user-123",
        "email": "test@example.com"
    }
    monkeypatch.setattr("app.core.firebase_auth", mock_auth)
    return mock_auth

def test_endpoint_with_auth(client, mock_firebase_auth):
    """Test endpoint with authentication."""
    headers = {"Authorization": "Bearer test-token"}
    response = client.get("/api/profile", headers=headers)

    assert response.status_code == 200
    mock_firebase_auth.verify_id_token.assert_called_once()
```

### Auth Error Handling
```python
def test_endpoint_invalid_token(client, mock_firebase_auth):
    """Test invalid token rejection."""
    from firebase_admin.auth import InvalidIdTokenError

    mock_firebase_auth.verify_id_token.side_effect = InvalidIdTokenError("Invalid token")

    headers = {"Authorization": "Bearer invalid-token"}
    response = client.get("/api/profile", headers=headers)

    assert response.status_code == 401
```

## Genkit Flow Mocking

### Basic Genkit Mock
```python
@pytest.fixture
def mock_genkit(monkeypatch):
    """Mock Genkit AI service."""
    from unittest.mock import AsyncMock

    mock_flow = AsyncMock()
    monkeypatch.setattr("app.ai.genkit_service.generate_content", mock_flow)
    return mock_flow

@pytest.mark.asyncio
@pytest.mark.ai_services
async def test_ai_service_execution(mock_genkit):
    """Test Genkit flow execution."""
    mock_genkit.return_value = {
        "text": "Generated response",
        "usage": {"input_tokens": 10, "output_tokens": 20}
    }

    from app.ai.genkit_service import generate_content
    result = await generate_content("Write a test")

    assert "Generated response" in result["text"]
    mock_genkit.assert_called_once_with("Write a test")
```

### Genkit Error Handling
```python
@pytest.mark.asyncio
@pytest.mark.ai_services
async def test_genkit_rate_limit(mock_genkit):
    """Test Genkit rate limit handling."""
    from google.api_core.exceptions import ResourceExhausted

    mock_genkit.side_effect = ResourceExhausted("Rate limit exceeded")

    from app.ai.genkit_service import generate_content

    with pytest.raises(ResourceExhausted):
        await generate_content("test prompt")
```

## Pydantic Model Validation Testing

### Validation Error Testing
```python
from pydantic import BaseModel, Field, ValidationError
import pytest

class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(pattern=r"^[^@]+@[^@]+\.[^@]+$")
    age: int = Field(ge=0, le=150)

def test_user_model_validation_errors():
    """Test Pydantic validation."""
    with pytest.raises(ValidationError) as exc_info:
        UserCreate(name="", email="invalid", age=999)

    errors = exc_info.value.errors()
    assert len(errors) == 3
    assert any(e["loc"] == ("name",) for e in errors)
    assert any(e["loc"] == ("email",) for e in errors)
    assert any(e["loc"] == ("age",) for e in errors)

def test_user_model_valid():
    """Test valid model creation."""
    user = UserCreate(name="John", email="john@example.com", age=30)
    assert user.name == "John"
    assert user.email == "john@example.com"
```

## FastAPI TestClient Setup

### Basic Client Fixture
```python
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    """FastAPI test client."""
    return TestClient(app)

def test_endpoint_get_request(client):
    """Test GET endpoint."""
    response = client.get("/api/health")
    assert response.status_code == 200
```

### Client with Auth
```python
@pytest.fixture
def authenticated_client(client, monkeypatch):
    """Test client with auth token."""
    from app.core.security import get_current_user

    def mock_get_user():
        return {"uid": "test-user-123", "email": "test@example.com"}

    monkeypatch.setattr("app.core.security.get_current_user", mock_get_user)
    return client

def test_protected_endpoint(authenticated_client):
    """Test endpoint requiring auth."""
    response = authenticated_client.get("/api/profile")
    assert response.status_code == 200
```

## Async Function Testing

### Basic Async Test
```python
@pytest.mark.asyncio
async def test_async_database_call(monkeypatch):
    """Test async function."""
    from unittest.mock import AsyncMock

    mock_db = AsyncMock()
    mock_db.get_user.return_value = {"id": "123", "name": "Test"}
    monkeypatch.setattr("app.db.get_user", mock_db)

    from app.services.user_service import get_user_async
    result = await get_user_async("123")

    assert result["name"] == "Test"
```

## Test Markers & Organization

### Test Categories
```python
import pytest

@pytest.mark.smoke
def test_critical_endpoint(client):
    """Quick smoke test."""
    response = client.get("/api/health")
    assert response.status_code == 200

@pytest.mark.integration
@pytest.mark.asyncio
async def test_genkit_flow(mock_genkit):
    """Integration test with external service."""
    pass

@pytest.mark.security
def test_auth_required(client):
    """Security test for auth requirement."""
    response = client.get("/api/profile")
    assert response.status_code == 401
```

Run specific categories:
```bash
pytest -m smoke              # Only smoke tests
pytest -m integration        # Only integration tests
pytest -m "not performance"  # All except performance
```

## Coverage Analysis

```bash
pytest backend/app/tests/ --cov=app --cov-report=html  # Generate HTML coverage
pytest backend/app/tests/ --cov=app --cov-report=term  # Show in terminal
pytest --cov=app --cov-fail-under=85                   # Fail if < 85%
```
