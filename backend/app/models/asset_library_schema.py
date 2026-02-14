"""
Asset Library Schema

Pydantic models for storing extracted career documents in Firestore.
Documents are stored at: users/{user_id}/assetLibrary/{asset_id}

This schema provides the structure for the Smart Ingestion feature's asset storage,
including extracted data, contextual tags, and metadata.
"""

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


class ContextTags(BaseModel):
    """Contextual tags for categorizing and organizing career assets."""

    roleType: str = Field(
        ...,
        description="The primary role type this asset is relevant for (e.g., 'Social Worker', 'Software Engineer', 'Project Manager')",
    )
    subsectors: list[str] = Field(
        default_factory=list,
        description="Industry subsectors or specializations (e.g., 'Healthcare', 'Community Services', 'Mental Health')",
    )


class AssetMetadata(BaseModel):
    """Metadata about the uploaded asset document."""

    fileName: str = Field(..., description="Original filename of the uploaded document")
    fileType: str = Field(
        ...,
        description="MIME type of the document (e.g., 'application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')",
    )
    uploadDate: datetime = Field(
        default_factory=datetime.now,
        description="ISO 8601 timestamp when the document was uploaded",
    )
    storageUri: str = Field(
        ...,
        description="Google Cloud Storage URI where the document is stored (e.g., 'gs://bucket-name/user_assets/user_id/filename.pdf')",
    )
    fileSizeBytes: int | None = Field(None, description="Size of the uploaded file in bytes")


class VoiceProfile(BaseModel):
    """
    Voice profile data extracted from writing samples.

    Captures the writing style, tone, and vocabulary characteristics
    for personalizing generated content.
    """

    tone: str = Field(
        ...,
        description="Overall tone of the writing (e.g., 'Professional', 'Conversational', 'Academic', 'Persuasive')",
    )
    style: str = Field(
        ...,
        description="Writing style characteristics (e.g., 'Concise and direct', 'Descriptive and detailed', 'Narrative-driven')",
    )
    vocabularyLevel: str = Field(
        ...,
        description="Vocabulary sophistication level (e.g., 'Simple', 'Moderate', 'Advanced', 'Technical')",
    )
    sentenceComplexity: str | None = Field(
        None,
        description="Average sentence complexity (e.g., 'Simple sentences', 'Compound sentences', 'Complex structures')",
    )
    preferredPhrasing: list[str] = Field(
        default_factory=list,
        description="Common phrases or expressions the user frequently uses",
    )


class AssetDocument(BaseModel):
    """
    Complete asset document stored in Firestore at users/{user_id}/assetLibrary/{asset_id}.

    This model represents the unified structure for all types of ingested career documents:
    - Resumes (MasterCareerProfile)
    - Key Selection Criteria documents
    - Voice/writing samples (VoiceProfile)
    """

    documentType: Literal["resume", "ksc", "voice"] = Field(
        ...,
        description="Type of document: 'resume' for full resumes, 'ksc' for Key Selection Criteria responses, 'voice' for writing samples",
    )
    extractedData: dict[str, Any] = Field(
        ...,
        description="The main extracted data object. For 'resume' and 'ksc' types, this is a MasterCareerProfile. For 'voice' type, this is a VoiceProfile",
    )
    tags: ContextTags = Field(
        ...,
        description="User-confirmed contextual tags for categorizing this asset (roleType, subsectors)",
    )
    metadata: AssetMetadata = Field(
        ...,
        description="Metadata about the uploaded document (filename, storage location, upload date)",
    )
    schemaVersion: str = Field(
        default="v4",
        description="Version of the extraction schema used. Critical for future data migrations",
    )
    createdAt: datetime = Field(
        default_factory=datetime.now,
        description="ISO 8601 timestamp when this asset was created in Firestore",
    )
    updatedAt: datetime = Field(
        default_factory=datetime.now,
        description="ISO 8601 timestamp when this asset was last updated",
    )
    userId: str = Field(
        ...,
        description="Firebase UID of the user who owns this asset",
    )

    class Config:
        """Pydantic model configuration."""

        json_schema_extra = {
            "example": {
                "documentType": "resume",
                "extractedData": {
                    "personalInfo": {
                        "name": "Jane Smith",
                        "email": "jane.smith@example.com",
                        "summary": "Experienced social worker with 5+ years in community services.",
                    },
                    "workExperience": [],
                    "education": [],
                    "skills": {
                        "technical": ["Case Management"],
                        "tools": ["Salesforce"],
                        "soft": ["Empathy"],
                        "methodologies": ["STAR methodology"],
                    },
                    "certifications": [],
                    "keySelectionCriteriaExamples": [],
                },
                "tags": {
                    "roleType": "Social Worker",
                    "subsectors": ["Healthcare", "Community Services"],
                },
                "metadata": {
                    "fileName": "jane_smith_resume.pdf",
                    "fileType": "application/pdf",
                    "uploadDate": "2025-01-15T10:30:00Z",
                    "storageUri": "gs://careercopilot-assets/user_assets/abc123/jane_smith_resume.pdf",
                    "fileSizeBytes": 245678,
                },
                "schemaVersion": "v4",
                "createdAt": "2025-01-15T10:35:00Z",
                "updatedAt": "2025-01-15T10:35:00Z",
                "userId": "firebase_uid_abc123",
            }
        }


class ResumeAsset(AssetDocument):
    """
    Convenience model for resume-type assets with typed extractedData.

    This provides better type hints when working specifically with resume assets.
    """

    documentType: Literal["resume"] = "resume"
    # Override extractedData to be typed as MasterCareerProfile
    # Note: In actual usage, you'll need to validate and parse this


class KSCAsset(AssetDocument):
    """
    Convenience model for KSC-type assets.

    KSC assets use a subset of MasterCareerProfile focused on keySelectionCriteriaExamples.
    """

    documentType: Literal["ksc"] = "ksc"


class VoiceAsset(AssetDocument):
    """
    Convenience model for voice profile assets with typed extractedData.

    This provides better type hints when working specifically with voice profile assets.
    """

    documentType: Literal["voice"] = "voice"
    # Override extractedData to be typed as VoiceProfile
