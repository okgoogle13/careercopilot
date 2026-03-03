from datetime import datetime
from typing import Any
from pydantic import ValidationError
from app.models.application_schemas import ApplicationResponse

data = {
    "id": "test-id",
    "user_id": "user-123",
    "job_title": "Engineer",
    "company_name": "Google",
    "job_description": "Building AI" * 10,
    "status": "draft",
    "source": "manual",
    "created_at": datetime.now(),
    "updated_at": datetime.now()
}

try:
    resp = ApplicationResponse(**data)
    print("Success!")
    print(resp.model_dump(by_alias=True))
except ValidationError as e:
    print(f"Failed: {e}")
