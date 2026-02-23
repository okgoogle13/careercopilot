#!/usr/bin/env python3

"""
kr-solidarity v3.0.0 Workflow Orchestrator
Main entry point for complete asset analysis → validation → scoring → packaging pipeline.

Supports single files and batch processing (directories, ZIP files).

Usage (Single File):
    python orchestrate_kr_solidarity_workflow.py /path/to/image.png

Usage (Directory):
    python orchestrate_kr_solidarity_workflow.py /path/to/assets/

Usage (ZIP):
    python orchestrate_kr_solidarity_workflow.py /path/to/assets.zip

Output:
    ./asset-packages/{asset_id}/
        ├── metadata.json
        ├── manifest-entry.json
        ├── context.md
        └── usage.md

    ./workflow-report.json (summary of all processed assets)
"""

import json
import sys
import zipfile
from dataclasses import dataclass, asdict
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional, Tuple, Any
from concurrent.futures import ThreadPoolExecutor, as_completed

from analyze_political_asset import analyze_political_asset, PoliticalAssetAnalysis
from validate_kr_solidarity_governance import validate_governance, GovernanceValidation
from score_cultural_significance import score_asset, CulturalSignificanceScore
from package_kr_solidarity_asset import package_asset, export_package, AssetPackage, resize_image
from asset_curator import AssetCurator


# ============================================================================
# CONSTANTS
# ============================================================================

SUPPORTED_IMAGE_FORMATS = {".png", ".jpg", ".jpeg", ".gif", ".webp"}
MAX_WORKERS = 4
OUTPUT_DIR = "./asset-packages"
REPORT_FILE = "./workflow-report.json"


# ============================================================================
# DATA CLASSES
# ============================================================================

@dataclass
class AssetProcessingResult:
    """Result of processing a single asset through complete pipeline."""
    success: bool
    image_path: str
    asset_id: Optional[str]
    stage_completed: str           # analyze, validate, score, package, export
    overall_score: Optional[float]
    approval_status: Optional[str]
    error: Optional[str]
    warnings: List[str]
    processing_time: float         # seconds


@dataclass
class WorkflowReport:
    """Summary report of entire batch processing workflow."""
    workflow_id: str
    started_at: str
    completed_at: str
    total_assets: int
    successful: int
    failed: int
    results: List[Dict]            # Full details per asset
    summary_stats: Dict
    errors: List[Dict]


# ============================================================================
# PROCESSOR
# ============================================================================

def process_single_asset(
    image_path: str,
    asset_name: Optional[str] = None,
    verbose: bool = True,
    relocate: bool = False,
    asset_id: Optional[str] = None,
    catalog_data: Optional[Dict[str, Any]] = None
) -> Tuple[AssetProcessingResult, Optional[AssetPackage]]:
    """
    Process single image through complete pipeline.
    Returns (result, package) tuple.
    """
    start_time = datetime.now()
    warnings = []

    try:
        # ====================================================================
        # PHASE 1A: ANALYZE
        # ====================================================================
        if verbose:
            print(f"\n{'='*80}")
            print(f"📸 Processing: {Path(image_path).name}")
            print(f"{'='*80}")

        try:
            if catalog_data:
                # Import analysis from catalog
                analysis = PoliticalAssetAnalysis(
                    category=catalog_data.get("category", "abstract"),
                    political_significance="solidarity",
                    text_content=None,
                    detected_symbols=[],
                    visual_anchor_details={"halo": None, "framing": None, "subject": "catalog-imported"},
                    style="mixed",
                    color_palette={"primary": "#1A1714", "secondary": "#D4A84B"},
                    intended_context="Catalog imported",
                    historical_reference=None,
                    confidence=0.95,
                    analysis_notes="Imported from Sidekick Catalog"
                )
                # Use suggested name from catalog if available
                if catalog_data.get("suggested_name"):
                    asset_name = catalog_data.get("suggested_name").replace(".png", "")
            else:
                analysis = analyze_political_asset(image_path)
        except Exception as e:
            return (
                AssetProcessingResult(
                    success=False,
                    image_path=image_path,
                    asset_id=None,
                    stage_completed="analyze",
                    overall_score=None,
                    approval_status=None,
                    error=f"Analysis failed: {str(e)}",
                    warnings=warnings,
                    processing_time=(datetime.now() - start_time).total_seconds()
                ),
                None
            )

        # ====================================================================
        # PHASE 1B: VALIDATE GOVERNANCE
        # ====================================================================
        try:
            validation = validate_governance(analysis)
        except Exception as e:
            return (
                AssetProcessingResult(
                    success=False,
                    image_path=image_path,
                    asset_id=None,
                    stage_completed="validate",
                    overall_score=None,
                    approval_status=None,
                    error=f"Governance validation failed: {str(e)}",
                    warnings=warnings,
                    processing_time=(datetime.now() - start_time).total_seconds()
                ),
                None
            )

        # ====================================================================
        # PHASE 2: SCORE
        # ====================================================================
        try:
            score = score_asset(analysis, validation)
        except Exception as e:
            return (
                AssetProcessingResult(
                    success=False,
                    image_path=image_path,
                    asset_id=None,
                    stage_completed="score",
                    overall_score=None,
                    approval_status=None,
                    error=f"Scoring failed: {str(e)}",
                    warnings=warnings,
                    processing_time=(datetime.now() - start_time).total_seconds()
                ),
                None
            )

        # ====================================================================
        # PHASE 3: PACKAGE
        # ====================================================================
        try:
            package = package_asset(
                analysis,
                validation,
                score,
                image_path,
                asset_name,
                asset_id,
                target_width=catalog_data.get("target_width") if catalog_data else None,
                target_height=catalog_data.get("target_height") if catalog_data else None
            )
        except Exception as e:
            return (
                AssetProcessingResult(
                    success=False,
                    image_path=image_path,
                    asset_id=None,
                    stage_completed="package",
                    overall_score=score.overall_score if 'score' in locals() else None,
                    approval_status=score.approval_status if 'score' in locals() else None,
                    error=f"Packaging failed: {str(e)}",
                    warnings=warnings,
                    processing_time=(datetime.now() - start_time).total_seconds()
                ),
                None
            )

        # ====================================================================
        # PHASE 3B: EXPORT
        # ====================================================================
        try:
            if verbose:
                print(f"\nExporting package...")
            exported_files = export_package(package, OUTPUT_DIR)
            if verbose:
                print(f"✅ Package exported to: {OUTPUT_DIR}/{package.asset_id}/")
        except Exception as e:
            warnings.append(f"Export warning: {str(e)}")
            if verbose:
                print(f"⚠️  Export warning: {str(e)}")

        # ====================================================================
        # PHASE 3C: AUTO-TRIAGE & RELOCATE
        # ====================================================================
        try:
            if relocate:
                import shutil
                import os
                
                # Determine triage destination based on approval status
                if score.approval_status in ['approved', 'conditional-approval']:
                    # SUCCESS: Move to production location
                    rel_path = package.file_path.lstrip("/")
                    target_path = Path("frontend/public") / rel_path
                    target_path.parent.mkdir(parents=True, exist_ok=True)
                    
                    # Use resize_image if dimensions are specified, otherwise copy
                    if package.target_width or package.target_height:
                        if verbose:
                            print(f"  📏 Resizing to {package.target_width or '?'}x{package.target_height or '?'}")
                        resize_image(image_path, str(target_path), package.target_width, package.target_height)
                    else:
                        shutil.copy2(image_path, target_path)
                    
                    # Delete from TBC
                    if 'TBC' in image_path:
                        os.remove(image_path)
                        if verbose:
                            print(f"  🗑️  Deleted from TBC: {Path(image_path).name}")
                    
                    if verbose:
                        print(f"✅ Asset relocated to: {target_path}")
                
                else:
                    # NEEDS REVIEW: Move to uncategorised folder
                    uncategorised_dir = Path("frontend/TBC/uncategorised")
                    uncategorised_dir.mkdir(parents=True, exist_ok=True)
                    
                    # Use the packaged canonical name
                    canonical_filename = Path(package.file_path).name
                    target_path = uncategorised_dir / canonical_filename
                    
                    shutil.move(image_path, target_path)
                    
                    if verbose:
                        print(f"  ⚠️  Moved to uncategorised (needs review): {target_path}")
                        print(f"     Reason: {score.approval_status}")
        
        except Exception as e:
            warnings.append(f"Triage warning: {str(e)}")
            if verbose:
                print(f"⚠️  Triage warning: {str(e)}")

        # ====================================================================
        # SUCCESS
        # ====================================================================
        processing_time = (datetime.now() - start_time).total_seconds()

        result = AssetProcessingResult(
            success=True,
            image_path=image_path,
            asset_id=package.asset_id,
            stage_completed="export",
            overall_score=score.overall_score,
            approval_status=score.approval_status,
            error=None,
            warnings=warnings,
            processing_time=processing_time
        )

        if verbose:
            print(f"\n✅ SUCCESS: {package.asset_id}")
            print(f"   Score: {score.overall_score:.1f}/100")
            print(f"   Status: {score.approval_status}")
            print(f"   Time: {processing_time:.1f}s")

        return result, package

    except Exception as e:
        processing_time = (datetime.now() - start_time).total_seconds()
        return (
            AssetProcessingResult(
                success=False,
                image_path=image_path,
                asset_id=None,
                stage_completed="unknown",
                overall_score=None,
                approval_status=None,
                error=f"Unexpected error: {str(e)}",
                warnings=warnings,
                processing_time=processing_time
            ),
            None
        )


# ============================================================================
# BATCH PROCESSOR
# ============================================================================

def find_images(source_path: str) -> List[str]:
    """Find all supported image formats in source."""
    source = Path(source_path)

    if source.is_file():
        # Single file
        if source.suffix.lower() in SUPPORTED_IMAGE_FORMATS:
            return [str(source)]
        elif source.suffix.lower() == ".zip":
            # Extract from ZIP
            images = []
            with zipfile.ZipFile(source, "r") as zf:
                for file_info in zf.filelist:
                    if Path(file_info.filename).suffix.lower() in SUPPORTED_IMAGE_FORMATS:
                        images.append(file_info.filename)
            return images
        else:
            raise ValueError(f"Unsupported file format: {source.suffix}")

    elif source.is_dir():
        # Directory - find all images
        images = []
        for ext in SUPPORTED_IMAGE_FORMATS:
            images.extend([str(p) for p in source.rglob(f"*{ext}")])
            images.extend([str(p) for p in source.rglob(f"*{ext.upper()}")])
        return list(set(images))  # Remove duplicates

    else:
        raise ValueError(f"Source not found: {source_path}")


def process_batch(
    source_path: str,
    max_workers: int = MAX_WORKERS,
    verbose: bool = True,
    relocate: bool = False,
    catalog_path: Optional[str] = None
) -> WorkflowReport:
    """
    Process multiple images through complete pipeline.

    Args:
        source_path: File, directory, or ZIP
        max_workers: Parallel processing threads
        verbose: Print progress

    Returns:
        WorkflowReport with summary statistics
    """

    workflow_id = f"workflow-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    print(f"\n{'='*80}")
    print(f"🚀 WORKFLOW ORCHESTRATOR")
    print(f"{'='*80}")
    print(f"Workflow ID: {workflow_id}")
    print(f"Source: {source_path}")

    # Find images
    try:
        images = find_images(source_path)
    except Exception as e:
        print(f"❌ Error finding images: {e}")
        return WorkflowReport(
            workflow_id=workflow_id,
            started_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            total_assets=0,
            successful=0,
            failed=1,
            results=[],
            summary_stats={},
            errors=[{"error": str(e), "stage": "discovery"}]
        )

    if not images:
        print(f"⚠️  No images found in: {source_path}")
        return WorkflowReport(
            workflow_id=workflow_id,
            started_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            total_assets=0,
            successful=0,
            failed=0,
            results=[],
            summary_stats={"no_images_found": True},
            errors=[]
        )

    print(f"Found {len(images)} images to process")
    print(f"Processing with {max_workers} workers\n")

    # Load catalog if provided
    catalog_map = {}
    if catalog_path:
        cp = Path(catalog_path)
        if cp.exists():
            try:
                with open(cp, 'r') as f:
                    data = json.load(f)
                    for item in data.get("assets", []):
                        orig = item.get("original_path")
                        if orig:
                            # Map by filename
                            catalog_map[Path(orig).name] = item
                print(f"📂 Loaded catalog with {len(catalog_map)} pre-analyzed assets")
            except Exception as e:
                print(f"⚠️  Failed to load catalog: {e}")

    workflow_start = datetime.now()
    results = []
    errors = []

    # Get starting ID from manifest
    manifest_path = Path("frontend/public/assets/kerala-rage-kr-solidarity-manifest.json")
    existing_count = 12
    if manifest_path.exists():
        try:
            with open(manifest_path, 'r') as f:
                manifest_data = json.load(f)
                existing_count = len(manifest_data.get("assets", []))
        except Exception as e:
            print(f"⚠️  Could not read manifest for count: {e}")

    # Process sequentially for ID assignment
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {
            executor.submit(
                process_single_asset, 
                img, 
                verbose=verbose, 
                relocate=relocate,
                asset_id=f"KR-SOLID-{(existing_count + i + 1):03d}",
                catalog_data=catalog_map.get(Path(img).name)
            ): img
            for i, img in enumerate(images)
        }

        completed = 0
        for future in as_completed(futures):
            completed += 1
            image_path = futures[future]

            try:
                result, package = future.result()
                results.append(result)

                if not result.success:
                    errors.append({
                        "image": image_path,
                        "error": result.error,
                        "stage": result.stage_completed
                    })

                # Progress indicator
                status_icon = "✅" if result.success else "❌"
                print(f"[{completed}/{len(images)}] {status_icon} {Path(image_path).name} "
                      f"({result.processing_time:.1f}s)")

            except Exception as e:
                print(f"[{completed}/{len(images)}] ❌ {image_path} - Exception: {e}")
                errors.append({
                    "image": image_path,
                    "error": str(e),
                    "stage": "execution"
                })

    # ========================================================================
    # GENERATE REPORT
    # ========================================================================
    workflow_end = datetime.now()
    total_time = (workflow_end - workflow_start).total_seconds()

    successful = sum(1 for r in results if r.success)
    failed = len(results) - successful

    # Calculate statistics
    successful_scores = [r.overall_score for r in results if r.success and r.overall_score]
    summary_stats = {
        "total_assets": len(images),
        "successful": successful,
        "failed": failed,
        "success_rate": f"{(successful / len(images) * 100):.1f}%" if images else "0%",
        "total_time_seconds": total_time,
        "average_time_per_asset": total_time / len(results) if results else 0,
        "average_score": f"{sum(successful_scores) / len(successful_scores):.1f}" if successful_scores else "N/A",
    }

    # Count by approval status
    approval_counts = {}
    for r in results:
        if r.success and r.approval_status:
            approval_counts[r.approval_status] = approval_counts.get(r.approval_status, 0) + 1
    summary_stats["approval_distribution"] = approval_counts

    # Convert results to dict
    results_dict = [asdict(r) for r in results]

    report = WorkflowReport(
        workflow_id=workflow_id,
        started_at=workflow_start.isoformat(),
        completed_at=workflow_end.isoformat(),
        total_assets=len(images),
        successful=successful,
        failed=failed,
        results=results_dict,
        summary_stats=summary_stats,
        errors=errors
    )

    return report


# ============================================================================
# REPORTING
# ============================================================================

def save_report(report: WorkflowReport, output_file: str = REPORT_FILE):
    """Save workflow report to JSON file."""
    with open(output_file, "w") as f:
        json.dump(asdict(report), f, indent=2)
    print(f"\n📋 Report saved: {output_file}")


def print_report_summary(report: WorkflowReport):
    """Print human-readable report summary."""
    print(f"\n{'='*80}")
    print(f"WORKFLOW REPORT: {report.workflow_id}")
    print(f"{'='*80}")
    print(f"\n📊 SUMMARY")
    print(f"  Total Assets: {report.total_assets}")
    print(f"  ✅ Successful: {report.successful}")
    print(f"  ❌ Failed: {report.failed}")
    print(f"  Success Rate: {report.summary_stats.get('success_rate', 'N/A')}")
    print(f"  Total Time: {report.summary_stats.get('total_time_seconds', 0):.1f}s")
    print(f"  Avg Time/Asset: {report.summary_stats.get('average_time_per_asset', 0):.1f}s")

    if report.summary_stats.get('average_score') != 'N/A':
        print(f"  Average Score: {report.summary_stats.get('average_score')}/100")

    if report.summary_stats.get('approval_distribution'):
        print(f"\n📈 APPROVAL DISTRIBUTION")
        for status, count in report.summary_stats['approval_distribution'].items():
            print(f"  {status}: {count}")

    if report.errors:
        print(f"\n⚠️  ERRORS ({len(report.errors)})")
        for err in report.errors[:5]:  # Show first 5
            print(f"  - {err.get('image', 'unknown')}: {err.get('error', 'unknown error')}")
        if len(report.errors) > 5:
            print(f"  ... and {len(report.errors) - 5} more")

    print(f"\n{'='*80}")


# ============================================================================
# CLI ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Single file: python orchestrate_kr_solidarity_workflow.py /path/to/image.png")
        print("  Directory:   python orchestrate_kr_solidarity_workflow.py /path/to/assets/")
        print("  ZIP file:    python orchestrate_kr_solidarity_workflow.py /path/to/assets.zip")
        print("  Options:")
        print("    --relocate: Copy assets to frontend/public/assets/ (production layout)")
        print("    --curate:   Run curation (duplicates/gap analysis) before processing")
        print("    --catalog <path>: Use pre-analyzed metadata from sidekick catalog")
        sys.exit(1)

    source_path = sys.argv[1]
    relocate = "--relocate" in sys.argv
    curate = "--curate" in sys.argv
    catalog_path = None
    if "--catalog" in sys.argv:
        idx = sys.argv.index("--catalog")
        if idx + 1 < len(sys.argv):
            catalog_path = sys.argv[idx + 1]

    # Handle Curation Logic (Legacy Integration)
    if curate:
        manifest_path = "frontend/public/assets/kerala-rage-kr-solidarity-manifest.json"
        print(f"\n🔍 RUNNING ASSET CURATION (Triaging {source_path})...")
        curator = AssetCurator(manifest_path)
        curation_report = curator.curate_batch(source_path)
        
        # Print Triage Summary
        print(f"\n📊 CURATION SUMMARY")
        for status, items in curation_report.items():
            if items:
                print(f"  {status}: {len(items)} assets identified")
        
        # If no new candidates or matches, we might want to stop early
        if not curation_report["MANIFEST_MATCH"] and not curation_report["NEW_CANDIDATE"]:
            print("\n✅ Curation complete: No new assets to process. (Only duplicates/discard found)")
            sys.exit(0)
        
        print(f"\n🚀 Proceeding with analysis pipeline for identified candidates...")

    # Run workflow
    report = process_batch(source_path, max_workers=MAX_WORKERS, verbose=True, relocate=relocate, catalog_path=catalog_path)

    # Print and save results
    print_report_summary(report)
    save_report(report)

    # Exit with appropriate code
    sys.exit(0 if report.failed == 0 else 1)
