"""
kr-solidarity v3.0.0 Manifest Integration Schemas
Pydantic models for manifest update and asset integration.
"""

from datetime import datetime

from pydantic import BaseModel, Field


class AssetSpecification(BaseModel):
    """Asset specification details."""

    aspect_ratio: str = Field(..., description="e.g., 1:1, 3:4, 16:9")
    style: str = Field(..., description="screenprint, wheat-paste, etching, etc.")
    halo: str | None = Field(None, description="Optional halo/frame color")
    framing: str | None = Field(None, description="Optional framing details")
    text_content: str | None = Field(None, description="Text visible in asset")
    subject: str | None = Field(None, description="Subject matter")
    color_palette: dict[str, str] | None = Field(None, description="Hex color codes")
    symbols: list[str] | None = Field(None, description="Cultural/political symbols")


class ManifestAssetEntry(BaseModel):
    """Single asset entry for manifest.json."""

    id: str = Field(..., description="KR-SOLID-XXX")
    name: str = Field(..., description="Asset display name")
    category: str = Field(
        ..., description="devotional, portrait, symbol, street, abstract, texture"
    )
    file_path: str = Field(..., description="Canonical asset path")
    priority: str = Field(..., description="CRITICAL, HIGH, MEDIUM")
    status: str = Field(..., description="ready, needs-review, approved, conditional")
    intended_context: str = Field(..., description="How asset will be used")
    specs: AssetSpecification = Field(..., description="Asset specifications")
    reviewed_by: str | None = Field(None, description="Reviewer email")
    review_decision: str | None = Field(
        None, description="approved, conditional-approval, needs-revision, rejected"
    )
    review_feedback: str | None = Field(None, description="Reviewer feedback")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ManifestUpdateRequest(BaseModel):
    """Request to update manifest with new assets."""

    assets_to_add: list[ManifestAssetEntry] = Field(..., description="New assets")
    assets_to_update: list[ManifestAssetEntry] | None = Field(None, description="Assets to refresh")
    updated_by: str = Field(..., description="Update initiator")
    version_bump: str = Field("minor", description="major, minor, patch")
    notes: str | None = Field(None, description="Release notes")


class ManifestValidationResult(BaseModel):
    """Validation result for manifest integrity."""

    valid: bool
    total_assets: int
    by_category: dict[str, int]
    by_priority: dict[str, int]
    by_status: dict[str, int]
    errors: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    checks_passed: dict[str, bool] = Field(default_factory=dict)


class AssetIntegrationTestResult(BaseModel):
    """Test result for asset component integration."""

    asset_id: str
    test_name: str
    passed: bool
    error_message: str | None = None
    execution_time_ms: float


class ManifestDeploymentPlan(BaseModel):
    """Deployment plan before going live."""

    manifest_version: str
    total_new_assets: int
    total_updated_assets: int
    deployment_timestamp: datetime
    tests_required: list[str]
    rollback_plan: str
    go_live_checklist: list[str]
    estimated_deployment_time_minutes: float


class BackfillAssetRequest(BaseModel):
    """Request to backfill existing asset with metadata."""

    asset_id: str = Field(..., description="KR-SOLID-XXX")
    category: str = Field(..., description="asset category")
    political_significance: str = Field(..., description="political significance")
    style: str = Field(..., description="artistic style")
    intended_context: str = Field(..., description="intended use")
    priority: str = Field(..., description="CRITICAL, HIGH, MEDIUM")
    backfilled_by: str = Field(..., description="Who backfilled")


class BackfillResult(BaseModel):
    """Result of backfill operation."""

    success: bool
    asset_id: str
    message: str
    metadata_created: bool
    manifest_updated: bool
    validation_status: str
