"""
Ingestion API Request/Response Schemas

Pydantic models for API request and response validation for the Smart Ingestion feature.
These models define the data contracts between the FastAPI backend and React frontend.
"""

from typing import Literal

from pydantic import BaseModel, Field

from .asset_library_schema import ContextTags


class SuggestedTags(BaseModel):
    """AI-suggested contextual tags from the Context Tagger flow."""

    roleType: str = Field(
        ...,
        description="AI-suggested primary role type (e.g., 'Social Worker', 'Software Engineer')",
    )
    subsectors: list[str] = Field(
        default_factory=list,
        description="AI-suggested industry subsectors (e.g., ['Healthcare', 'Community Services'])",
    )
    confidence: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
        description="Confidence score for the suggestions (0.0 to 1.0)",
    )


# ============================================================================
# POST /upload-and-tag Endpoint Schemas
# ============================================================================


class UploadAndTagResponse(BaseModel):
    """
    Response from the upload-and-tag endpoint.

    Returns AI-suggested tags and a file identifier for the confirmation step.
    """

    suggestedTags: SuggestedTags = Field(
        ...,
        description="AI-generated suggested tags from the Context Tagger flow",
    )
    fileId: str = Field(
        ...,
        description="Unique identifier for the uploaded file (GCS URI or path) to use in the extract-and-save step",
    )
    fileName: str = Field(
        ...,
        description="Original filename of the uploaded document",
    )
    fileType: str = Field(
        ...,
        description="MIME type of the uploaded document",
    )
    fileSizeBytes: int = Field(
        ...,
        description="Size of the uploaded file in bytes",
    )

    class Config:
        """Pydantic model configuration."""

        json_schema_extra = {
            "example": {
                "suggestedTags": {
                    "roleType": "Social Worker",
                    "subsectors": ["Healthcare", "Community Services", "Mental Health"],
                    "confidence": 0.92,
                },
                "fileId": "temp_ingestions/firebase_uid_abc123/1642261800_resume.pdf",
                "fileName": "resume.pdf",
                "fileType": "application/pdf",
                "fileSizeBytes": 245678,
            }
        }


# ============================================================================
# POST /extract-and-save Endpoint Schemas
# ============================================================================


class ExtractAndSaveRequest(BaseModel):
    """
    Request to extract structured data and save to asset library.

    Sent after the user confirms or edits the suggested tags in the frontend.
    """

    fileId: str = Field(
        ...,
        description="The file identifier returned from upload-and-tag endpoint (GCS path)",
    )
    confirmedTags: ContextTags = Field(
        ...,
        description="User-confirmed or edited tags (roleType and subsectors)",
    )
    documentType: Literal["resume", "ksc", "voice"] = Field(
        ...,
        description="Type of document selected by the user: 'resume', 'ksc' (Key Selection Criteria), or 'voice' (writing sample)",
    )

    class Config:
        """Pydantic model configuration."""

        json_schema_extra = {
            "example": {
                "fileId": "temp_ingestions/firebase_uid_abc123/1642261800_resume.pdf",
                "confirmedTags": {
                    "roleType": "Social Worker",
                    "subsectors": ["Healthcare", "Community Services"],
                },
                "documentType": "resume",
            }
        }


class ExtractAndSaveResponse(BaseModel):
    """
    Response from the extract-and-save endpoint.

    Returns success status and the Firestore document ID of the created asset.
    """

    status: Literal["success", "error"] = Field(
        ...,
        description="Status of the extraction and save operation",
    )
    assetId: str = Field(
        ...,
        description="The Firestore document ID of the newly created asset in users/{user_id}/assetLibrary/{assetId}",
    )
    message: str = Field(
        ...,
        description="Human-readable message describing the result",
    )

    class Config:
        """Pydantic model configuration."""

        json_schema_extra = {
            "example": {
                "status": "success",
                "assetId": "dG9YeXZhbGlkYXRpb25fc3VjY2Vzcw",
                "message": "Resume successfully extracted and saved to your asset library",
            }
        }


# ============================================================================
# Error Response Schema (for consistency)
# ============================================================================


class IngestionErrorResponse(BaseModel):
    """Standard error response for ingestion endpoints."""

    status: Literal["error"] = "error"
    error: str = Field(..., description="Error type or code")
    message: str = Field(..., description="Human-readable error message")
    details: dict = Field(
        default_factory=dict,
        description="Additional error details for debugging",
    )

    class Config:
        """Pydantic model configuration."""

        json_schema_extra = {
            "example": {
                "status": "error",
                "error": "AI_SERVICE_ERROR",
                "message": "The AI extraction service is temporarily unavailable. Please try again in a few minutes.",
                "details": {
                    "operation": "context_tagger",
                    "retry_after": 60,
                },
            }
        }
