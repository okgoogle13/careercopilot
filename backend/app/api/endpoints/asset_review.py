"""
kr-solidarity v3.0.0 Asset Review Endpoints
Human review workflow for governance overrides and bulk decisions.
"""

from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.schemas.asset_review import (
    AssetReviewResponse,
    AssetReviewSubmission,
    BulkAssetReviewSubmission,
    GovernanceOverride,
    ReviewDashboardAsset,
    ReviewDashboardStats,
)

router = APIRouter(prefix="/api/asset-review", tags=["asset-review"])

# In-memory storage (replace with database in production)
REVIEWS_STORAGE = {}  # {asset_id: review_data}
OVERRIDES_STORAGE = {}  # {override_id: override_data}


# ============================================================================
# ENDPOINTS
# ============================================================================

@router.post("/submit", response_model=AssetReviewResponse)
async def submit_asset_review(review: AssetReviewSubmission):
    """
    Submit review for a single asset.

    - **asset_id**: KR-SOLID-XXX identifier
    - **overall_decision**: approved, conditional-approval, needs-revision, rejected
    - **cultural_feedback**: Reviewer's cultural appropriateness assessment
    - **overrides**: List of governance flag overrides with justifications
    - **reviewed_by**: Reviewer identity
    - **confidence**: Reviewer confidence score (0.0-1.0)
    """
    print("\n📝 Asset Review Submission")
    print(f"  Asset: {review.asset_id}")
    print(f"  Decision: {review.overall_decision}")
    print(f"  Reviewer: {review.reviewed_by}")
    print(f"  Confidence: {review.confidence:.2f}")

    if len(review.overrides) > 0:
        print(f"  Overrides: {len(review.overrides)}")
        for override in review.overrides:
            print(f"    - {override.violation_id}: {override.decision}")

    # Store review
    REVIEWS_STORAGE[review.asset_id] = {
        "asset_id": review.asset_id,
        "decision": review.overall_decision,
        "cultural_feedback": review.cultural_feedback,
        "aesthetic_notes": review.aesthetic_notes,
        "reviewed_by": review.reviewed_by,
        "review_timestamp": review.review_timestamp.isoformat(),
        "confidence": review.confidence,
        "overrides": [o.dict() for o in review.overrides]
    }

    # Store overrides
    for override in review.overrides:
        override_id = f"{review.asset_id}_{override.violation_id}"
        OVERRIDES_STORAGE[override_id] = override.dict()

    print("  ✅ Review saved")

    return AssetReviewResponse(
        success=True,
        asset_id=review.asset_id,
        decision=review.overall_decision,
        message=f"Review submitted for {review.asset_id}",
        saved_at=datetime.utcnow()
    )


@router.post("/bulk-submit")
async def submit_bulk_review(bulk_review: BulkAssetReviewSubmission):
    """
    Submit bulk decision for multiple assets.

    Applies same decision to multiple assets with single justification.

    - **asset_ids**: List of KR-SOLID-XXX identifiers
    - **bulk_decision**: approved, conditional-approval, rejected
    - **reason**: Justification for bulk decision
    - **reviewed_by**: Reviewer identity
    """
    print("\n📝 Bulk Asset Review")
    print(f"  Assets: {len(bulk_review.asset_ids)}")
    print(f"  Decision: {bulk_review.bulk_decision}")
    print(f"  Reviewer: {bulk_review.reviewed_by}")

    results = []
    for asset_id in bulk_review.asset_ids:
        REVIEWS_STORAGE[asset_id] = {
            "asset_id": asset_id,
            "decision": bulk_review.bulk_decision,
            "bulk_reason": bulk_review.reason,
            "reviewed_by": bulk_review.reviewed_by,
            "review_timestamp": bulk_review.review_timestamp.isoformat(),
            "is_bulk": True
        }
        results.append({
            "asset_id": asset_id,
            "status": "reviewed"
        })

    print(f"  ✅ Bulk review saved for {len(bulk_review.asset_ids)} assets")

    return {
        "success": True,
        "assets_reviewed": len(bulk_review.asset_ids),
        "decision": bulk_review.bulk_decision,
        "results": results
    }


@router.get("/pending")
async def get_pending_reviews(
    status: str | None = None,
    category: str | None = None,
    limit: int = 50
) -> list[ReviewDashboardAsset]:
    """
    Get list of assets pending review.

    Query parameters:
    - **status**: Filter by approval status (auto-approved, human-review, needs-review, rejected)
    - **category**: Filter by asset category (devotional, portrait, symbol, street, abstract, texture)
    - **limit**: Maximum number of results (default 50)
    """
    print("\n📋 Fetching pending reviews")
    print(f"  Status filter: {status}")
    print(f"  Category filter: {category}")
    print(f"  Limit: {limit}")

    # Mock data - in production, fetch from database/asset packages
    pending_assets = [
        ReviewDashboardAsset(
            asset_id="KR-SOLID-013",
            name="Street Protest Art",
            category="street",
            score=78.5,
            approval_status="needs-review",
            violations=[],
            warnings=["Street art: should specify in-situ context"],
            governance_passed=True,
            requires_review=True,
            political_significance="activist",
            text_content="NO PRIDE IN GENOCIDE",
            color_palette={"primary": "#D4A84B", "secondary": "#C45C4B"},
            sample_image_url="/assets/kr-solidarity/street/kr-solidarity__street__protest__v1.png"
        ),
        ReviewDashboardAsset(
            asset_id="KR-SOLID-014",
            name="First Nations Solidarity",
            category="street",
            score=82.0,
            approval_status="conditional-approval",
            violations=[],
            warnings=["First Nations imagery: text not in approved list"],
            governance_passed=True,
            requires_review=True,
            political_significance="solidarity",
            text_content="ALWAYS WAS ALWAYS WILL BE",
            color_palette={"primary": "#1A1714", "secondary": "#D4A84B"},
            sample_image_url="/assets/kr-solidarity/street/kr-solidarity__street__solidarity__v1.png"
        ),
        ReviewDashboardAsset(
            asset_id="KR-SOLID-015",
            name="Resistance Portrait",
            category="portrait",
            score=88.0,
            approval_status="human-review",
            violations=[],
            warnings=[],
            governance_passed=True,
            requires_review=True,
            political_significance="resistance-history",
            text_content=None,
            color_palette={"primary": "#B8733D", "secondary": "#D4A84B"},
            sample_image_url="/assets/kr-solidarity/portrait/kr-solidarity__portrait__resistance__v1.png"
        )
    ]

    # Apply filters
    if status:
        pending_assets = [a for a in pending_assets if a.approval_status == status]
    if category:
        pending_assets = [a for a in pending_assets if a.category == category]

    # Apply limit
    pending_assets = pending_assets[:limit]

    print(f"  Found {len(pending_assets)} assets pending review")

    return pending_assets


@router.get("/dashboard/stats")
async def get_dashboard_stats() -> ReviewDashboardStats:
    """
    Get dashboard statistics.

    Returns counts of pending, approved, rejected, and conditional assets.
    """
    print("\n📊 Fetching dashboard statistics")

    # Mock data - in production, query from database
    stats = ReviewDashboardStats(
        total_assets_pending=3,
        assets_approved=9,
        assets_rejected=0,
        assets_conditional=2,
        average_review_time=4.5,
        reviewers_active=["alice@example.com", "bob@example.com"],
        pending_overrides=1
    )

    print(f"  Pending: {stats.total_assets_pending}")
    print(f"  Approved: {stats.assets_approved}")
    print(f"  Rejected: {stats.assets_rejected}")
    print(f"  Conditional: {stats.assets_conditional}")

    return stats


@router.post("/override/{asset_id}/{violation_id}")
async def submit_governance_override(
    asset_id: str,
    violation_id: str,
    override: GovernanceOverride
):
    """
    Override a specific governance violation/warning.

    - **asset_id**: KR-SOLID-XXX
    - **violation_id**: The specific violation/warning to override
    - **override**: GovernanceOverride with justification
    """
    print("\n⚖️  Governance Override")
    print(f"  Asset: {asset_id}")
    print(f"  Violation: {violation_id}")
    print(f"  Decision: {override.decision}")
    print(f"  Justification: {override.justification[:50]}...")

    override_id = f"{asset_id}_{violation_id}"
    OVERRIDES_STORAGE[override_id] = {
        "asset_id": asset_id,
        "violation_id": violation_id,
        **override.dict()
    }

    print("  ✅ Override stored")

    return {
        "success": True,
        "override_id": override_id,
        "asset_id": asset_id,
        "violation_id": violation_id,
        "decision": override.decision
    }


@router.get("/asset/{asset_id}/review-history")
async def get_asset_review_history(asset_id: str):
    """
    Get review history for a specific asset.

    Returns all reviews and overrides submitted for this asset.
    """
    print("\n📜 Asset Review History")
    print(f"  Asset: {asset_id}")

    review = REVIEWS_STORAGE.get(asset_id)
    overrides = [
        v for k, v in OVERRIDES_STORAGE.items()
        if k.startswith(asset_id)
    ]

    if not review:
        raise HTTPException(status_code=404, detail=f"No reviews found for {asset_id}")

    print("  Review found")
    print(f"  Overrides: {len(overrides)}")

    return {
        "asset_id": asset_id,
        "review": review,
        "overrides": overrides
    }


@router.post("/export-reviews")
async def export_reviews(
    format: str = "json",
    include_rejected: bool = False
):
    """
    Export all reviews in specified format.

    - **format**: json, csv
    - **include_rejected**: Include rejected assets in export
    """
    print("\n📤 Exporting Reviews")
    print(f"  Format: {format}")
    print(f"  Include rejected: {include_rejected}")

    # Filter reviews
    reviews_to_export = REVIEWS_STORAGE.copy()
    if not include_rejected:
        reviews_to_export = {
            k: v for k, v in reviews_to_export.items()
            if v.get("decision") != "rejected"
        }

    if format == "json":
        export_data = {
            "exported_at": datetime.utcnow().isoformat(),
            "total_reviews": len(reviews_to_export),
            "reviews": reviews_to_export,
            "overrides": OVERRIDES_STORAGE
        }
        print(f"  ✅ Exported {len(reviews_to_export)} reviews (JSON)")
        return export_data

    elif format == "csv":
        import csv
        from io import StringIO

        output = StringIO()
        writer = csv.DictWriter(
            output,
            fieldnames=["asset_id", "decision", "reviewed_by", "confidence", "timestamp"]
        )
        writer.writeheader()

        for asset_id, review in reviews_to_export.items():
            writer.writerow({
                "asset_id": asset_id,
                "decision": review.get("decision"),
                "reviewed_by": review.get("reviewed_by"),
                "confidence": review.get("confidence"),
                "timestamp": review.get("review_timestamp")
            })

        print(f"  ✅ Exported {len(reviews_to_export)} reviews (CSV)")
        return {"csv": output.getvalue()}

    else:
        raise HTTPException(status_code=400, detail=f"Unsupported format: {format}")


@router.delete("/clear-reviews")
async def clear_all_reviews(confirm: bool = False):
    """
    Clear all reviews (WARNING: destructive).

    - **confirm**: Must be True to proceed
    """
    if not confirm:
        raise HTTPException(status_code=400, detail="Must confirm deletion with confirm=true")

    global REVIEWS_STORAGE, OVERRIDES_STORAGE
    count_reviews = len(REVIEWS_STORAGE)
    count_overrides = len(OVERRIDES_STORAGE)

    REVIEWS_STORAGE.clear()
    OVERRIDES_STORAGE.clear()

    print("\n🗑️  Cleared all reviews")
    print(f"  Reviews deleted: {count_reviews}")
    print(f"  Overrides deleted: {count_overrides}")

    return {
        "success": True,
        "reviews_deleted": count_reviews,
        "overrides_deleted": count_overrides
    }
