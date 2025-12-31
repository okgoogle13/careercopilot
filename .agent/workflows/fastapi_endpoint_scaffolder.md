---
description: Scaffold a new FastAPI endpoint with Pydantic schemas and tests.
params:
  endpoint_name: "Name of the endpoint (snake_case), e.g., 'notifications'"
  method: "HTTP method (GET, POST, PUT, DELETE)"
  path: "URL path, e.g., '/notifications'"
  description: "Brief description of the endpoint's purpose"
---

# FastAPI Endpoint Scaffolder Workflow

This workflow creates a new type-safe FastAPI endpoint using the project's standard architecture.

## 1. Schema Definition (Models)

Create the Pydantic models first.
**Target File**: `backend/app/models/{{endpoint_name}}_schemas.py`

1.  Define `{{PascalCase}}Request` (if applicable).
2.  Define `{{PascalCase}}Response`.
3.  Use `pydantic.BaseModel`.
4.  Include `Config` class with `populate_by_name = True` if utilizing aliases.

```python
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class {{PascalCase}}Request(BaseModel):
    # fields...
    pass

class {{PascalCase}}Response(BaseModel):
    id: str
    created_at: datetime
    # fields...
```

## 2. Endpoint Implementation

Create the route handler.
**Target File**: `backend/app/api/endpoints/{{endpoint_name}}.py`

1.  Import `APIRouter`, `Depends`, `HTTPException` from `fastapi`.
2.  Import Schemas from `app.models.{{endpoint_name}}_schemas`.
3.  Define the router: `router = APIRouter()`.
4.  Implement the handler function with correct return type annotations.

```python
from fastapi import APIRouter, Depends, HTTPException
from app.models.{{endpoint_name}}_schemas import {{PascalCase}}Request, {{PascalCase}}Response
# import auth dependencies if needed

router = APIRouter()

@router.{{method}}("{{path}}", response_model={{PascalCase}}Response)
async def {{verb}}_{{endpoint_name}}(
    request: {{PascalCase}}Request,
    # current_user = Depends(get_current_user)
):
    """
    {{description}}
    """
    # Implementation
    pass
```

## 3. Router Registration

**Target File**: `backend/app/api/router.py`

1.  Read `router.py`.
2.  Import the new endpoint module: `from app.api.endpoints import {{endpoint_name}}`.
3.  Add it to the `api_router` inclusions.

## 4. Model Export

**Target File**: `backend/app/models/__init__.py`

1.  Export the new schemas so they are accessible via `app.models`.

## 5. Unit Test Scaffolding

**Target File**: `backend/app/tests/api/test_{{endpoint_name}}.py`

1.  Use `pytest`.
2.  Import `AsyncClient`.
3.  Write a "Happy Path" test case.

```python
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_{{verb}}_{{endpoint_name}}_success(async_client: AsyncClient):
    payload = {...}
    response = await async_client.{{method}}("{{path}}", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
```
