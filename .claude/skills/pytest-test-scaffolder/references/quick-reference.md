# Pytest Test Scaffolder - Quick Reference

**When to use:** Creating unit tests for FastAPI endpoints, Python services, utility functions, or async code in the backend.

## Quick Test Generation

### Endpoint Test (FastAPI)

```python
def test_get_profile(client, mock_firestore):
    response = client.get("/api/profile")
    assert response.status_code == 200
    assert response.json()["id"]
```

### Service Test

```python
def test_create_user_service(mock_firestore):
    result = UserService.create({"name": "Test"})
    assert result["id"]
    mock_firestore.collection.assert_called_with("users")
```

### Async Test

```python
@pytest.mark.asyncio
async def test_async_function(mock_genkit):
    result = await async_function("param")
    assert result
```

## Common Fixtures

| Fixture              | Purpose                                 |
| -------------------- | --------------------------------------- |
| `client`             | FastAPI TestClient for endpoint testing |
| `mock_firestore`     | Firestore database mock                 |
| `mock_firebase_auth` | Firebase auth mock                      |
| `mock_genkit`        | Genkit AI service mock                  |
| `monkeypatch`        | pytest built-in for patching            |

## Run Tests

```bash
# All backend tests
pytest backend/app/tests/ -v

# Single test file
pytest backend/app/tests/test_profiles.py -v

# Single test function
pytest backend/app/tests/test_profiles.py::test_get_profile -v

# With coverage
pytest backend/app/tests/ --cov=app --cov-report=html

# Specific marker
pytest -m integration     # Only integration tests
pytest -m "not ai_services"  # Exclude AI service tests
```

## Test Response Codes

| Code | Meaning          | Test Pattern                         |
| ---- | ---------------- | ------------------------------------ |
| 200  | Success          | `assert response.status_code == 200` |
| 422  | Validation error | `assert response.status_code == 422` |
| 401  | Unauthorized     | `assert response.status_code == 401` |
| 404  | Not found        | `assert response.status_code == 404` |
| 500  | Server error     | `with pytest.raises(Exception)`      |

## Markers

```python
@pytest.mark.smoke           # Quick smoke tests
@pytest.mark.integration     # Integration tests
@pytest.mark.asyncio         # Async tests
@pytest.mark.ai_services     # Tests involving Genkit
@pytest.mark.database        # Database/Firestore tests
@pytest.mark.security        # Auth/permission tests
@pytest.mark.performance     # Performance benchmarks
```

## Key Commands

- `pytest --collect-only` - List all tests without running
- `pytest -k "profile"` - Run tests matching pattern
- `pytest --maxfail=3` - Stop after 3 failures
- `pytest -n auto` - Parallel execution (pytest-xdist)

## Template Locations

- Endpoint test: `.claude/skills/pytest-test-scaffolder/templates/endpoint.test.py.tpl`
- Service test: `.claude/skills/pytest-test-scaffolder/templates/service.test.py.tpl`
- Async test: `.claude/skills/pytest-test-scaffolder/templates/async.test.py.tpl`
- Fixtures: `.claude/skills/pytest-test-scaffolder/templates/conftest.py.tpl`

See `backend-test-patterns.md` for detailed examples.
