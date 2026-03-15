"""
kr-solidarity v3.0.0 Asset Review Schemas
Pydantic models for human review workflow.
"""

from datetime import datetime

from pydantic import BaseModel, Field


class GovernanceOverride(BaseModel):
    """Override a specific governance violation/warning."""

    violation_id: str = Field(..., description="ID of violation/warning to override")
    decision: str = Field(..., description="accept, reject, modify")
    justification: str = Field(..., description="Why override this rule")
    reviewed_by: str = Field(..., description="Reviewer identity (email/username)")
    reviewed_at: datetime = Field(default_factory=datetime.utcnow)


class AssetReviewSubmission(BaseModel):
    """Submit review for a single asset."""

    asset_id: str = Field(..., description="KR-SOLID-XXX")
    overall_decision: str = Field(
        ..., description="approved, conditional-approval, needs-revision, rejected"
    )
    cultural_feedback: str = Field(..., description="Feedback on cultural appropriateness")
    aesthetic_notes: str | None = Field(None, description="Notes on visual quality")
    overrides: list[GovernanceOverride] = Field(
        default_factory=list, description="Governance flag overrides"
    )
    reviewed_by: str = Field(..., description="Reviewer identity")
    review_timestamp: datetime = Field(default_factory=datetime.utcnow)
    confidence: float = Field(..., ge=0.0, le=1.0, description="Reviewer confidence in decision")


class BulkAssetReviewSubmission(BaseModel):
    """Bulk submit reviews for multiple assets."""

    asset_ids: list[str] = Field(..., description="List of KR-SOLID-XXX IDs")
    bulk_decision: str = Field(..., description="approved, conditional-approval, rejected")
    reason: str = Field(..., description="Bulk decision justification")
    reviewed_by: str = Field(..., description="Reviewer identity")
    review_timestamp: datetime = Field(default_factory=datetime.utcnow)


class AssetReviewResponse(BaseModel):
    """Response from asset review submission."""

    success: bool
    asset_id: str
    decision: str
    message: str
    saved_at: datetime


class ReviewDashboardAsset(BaseModel):
    """Asset data for review dashboard."""

    asset_id: str
    name: str
    category: str
    score: float
    approval_status: str
    violations: list[str]
    warnings: list[str]
    governance_passed: bool
    requires_review: bool
    political_significance: str
    text_content: str | None
    color_palette: dict | None
    sample_image_url: str | None


class ReviewDashboardStats(BaseModel):
    """Dashboard statistics."""

    total_assets_pending: int
    assets_approved: int
    assets_rejected: int
    assets_conditional: int
    average_review_time: float
    reviewers_active: list[str]
    pending_overrides: int
