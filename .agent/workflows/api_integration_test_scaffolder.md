---
description: Create E2E integration tests covering Frontend -> Backend -> Genkit connections.
params:
  feature_name: "Name of the feature (snake_case), e.g., 'ksc_generation'"
  endpoint: "API endpoint being tested"
  genkit_flow: "Name of the associated Genkit flow (if any)"
---

# API Integration Test Scaffolder Workflow

This workflow scaffolds comprehensive integration tests that validate the complete data flow.

## 1. Analysis

1.  Identify the **Backend Endpoint** (URL and Method).
2.  Identify dependent services:
    - **Firestore**: Does it read/write?
    - **Genkit**: Does it invoke an AI flow?
    - **Auth**: Does it require a user?

## 2. Test Integration Scaffolding

Create the integration test file.
**Target File**: `backend/app/tests/integration/test_{{feature_name}}_integration.py`

**Key Requirements:**
- Use `pytest`.
- Use `unittest.mock` for `AsyncMock` and `patch`.
- Test the full chain, specifically mocking the *external* boundary (AI Flow/Database) but keeping the internal controller logic intact.

```python
import pytest
from unittest.mock import AsyncMock, patch
from httpx import AsyncClient
from app.main import app

class Test{{FeatureName}}Integration:

    @pytest.fixture
    def mock_genkit_flow(self):
        with patch("app.genkit_flows.{{genkit_flow}}.run") as mock:
            yield mock

    @pytest.mark.asyncio
    async def test_complete_flow_success(self, async_client, mock_genkit_flow):
        """
        Scenario: Valid request triggers backend processing + AI flow + DB update.
        """
        # 1. Setup Data
        payload = { ... }

        # 2. Mock AI Response
        mock_genkit_flow.return_value = { "result": "success" }

        # 3. Execute Request
        response = await async_client.post("{{endpoint}}", json=payload)

        # 4. Verification
        assert response.status_code == 200
        assert response.json()["status"] == "completed"

        # Verify Flow was called
        mock_genkit_flow.assert_called_once()
```

## 3. Standard Scenarios to Include

Ensure the test file includes methods for:
1.  **Happy Path**: 200 OK with valid data.
2.  **Validation Error**: 422 Unprocessable Entity (send invalid payload).
3.  **Auth Failure**: 401 Unauthorized (request without token).
4.  **Flow Failure**: 500 Internal Server Error (mock flow raising exception).

## 4. Verification

1.  Run the specific test file:
    ```bash
    pytest backend/app/tests/integration/test_{{feature_name}}_integration.py -v
    ```
