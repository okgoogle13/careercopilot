# backend/app/models/{{ENDPOINT_NAME}}_schemas.py

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


class {{REQUEST_MODEL}}(BaseModel):
    """
    Request model for {{ENDPOINT_NAME}} endpoint.

    {{REQUEST_DESCRIPTION}}
    """

    {{REQUEST_FIELDS}}

    class Config:
        json_schema_extra = {
            "example": {
                {{REQUEST_EXAMPLE}}
            }
        }

    # Add custom validators if needed
    # @field_validator('field_name')
    # @classmethod
    # def validate_field_name(cls, v):
    #     if not v:
    #         raise ValueError('field_name cannot be empty')
    #     return v


class {{RESPONSE_MODEL}}(BaseModel):
    """
    Response model for {{ENDPOINT_NAME}} endpoint.

    {{RESPONSE_DESCRIPTION}}
    """

    {{RESPONSE_FIELDS}}

    class Config:
        json_schema_extra = {
            "example": {
                {{RESPONSE_EXAMPLE}}
            }
        }


# Additional models (e.g., for list responses, updates) can be added below

class {{MODEL_NAME}}ListResponse(BaseModel):
    """Response model for listing multiple {{MODEL_NAME}} items."""

    items: List[{{RESPONSE_MODEL}}] = Field(default_factory=list)
    total: int = Field(ge=0)
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=50, ge=1, le=100)

    class Config:
        json_schema_extra = {
            "example": {
                "items": [],
                "total": 0,
                "page": 1,
                "page_size": 50
            }
        }
