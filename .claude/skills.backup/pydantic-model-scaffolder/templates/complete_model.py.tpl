# backend/app/models/{{MODEL_NAME_SNAKE}}_schemas.py

from datetime import datetime
from enum import Enum
from typing import List, Optional, Dict, Any

from pydantic import BaseModel, Field, field_validator, EmailStr


{{ENUM_DEFINITIONS}}


class {{MODEL_NAME}}Request(BaseModel):
    """
    Request model for {{MODEL_PURPOSE}}.

    Used for incoming API requests with strict validation.
    """

    {{REQUEST_FIELDS}}

    {{REQUEST_VALIDATORS}}

    class Config:
        json_schema_extra = {
            "example": {
                {{REQUEST_EXAMPLE}}
            }
        }


class {{MODEL_NAME}}Response(BaseModel):
    """
    Response model for {{MODEL_PURPOSE}}.

    Used for API responses with consistent structure.
    """

    {{RESPONSE_FIELDS}}

    class Config:
        json_schema_extra = {
            "example": {
                {{RESPONSE_EXAMPLE}}
            }
        }


class {{MODEL_NAME}}DB(BaseModel):
    """
    Database model for {{MODEL_PURPOSE}}.

    Used for Firestore operations with timestamps and metadata.
    """

    {{DB_FIELDS}}

    # Metadata fields
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None
    updated_by: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert model to dictionary for Firestore."""
        data = self.model_dump()
        # Convert datetime to ISO format for Firestore
        if self.created_at:
            data['created_at'] = self.created_at.isoformat()
        if self.updated_at:
            data['updated_at'] = self.updated_at.isoformat()
        return data

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "{{MODEL_NAME}}DB":
        """Create model from Firestore dictionary."""
        # Convert ISO strings back to datetime
        if 'created_at' in data and isinstance(data['created_at'], str):
            data['created_at'] = datetime.fromisoformat(data['created_at'])
        if 'updated_at' in data and isinstance(data['updated_at'], str):
            data['updated_at'] = datetime.fromisoformat(data['updated_at'])
        return cls(**data)

    class Config:
        json_schema_extra = {
            "example": {
                {{DB_EXAMPLE}}
                "created_at": "2025-01-06T12:00:00",
                "updated_at": "2025-01-06T12:00:00",
                "created_by": "user-123",
                "updated_by": "user-123"
            }
        }


# List response model for pagination
class {{MODEL_NAME}}ListResponse(BaseModel):
    """Response model for listing multiple {{MODEL_NAME}} items."""

    items: List[{{MODEL_NAME}}Response] = Field(default_factory=list)
    total: int = Field(ge=0, description="Total number of items")
    page: int = Field(default=1, ge=1, description="Current page number")
    page_size: int = Field(default=50, ge=1, le=100, description="Items per page")
    has_more: bool = Field(default=False, description="Whether more items exist")

    class Config:
        json_schema_extra = {
            "example": {
                "items": [],
                "total": 0,
                "page": 1,
                "page_size": 50,
                "has_more": False
            }
        }
