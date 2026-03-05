"""Expanded tests for manifest integration covering versioning, validation errors, and backfill edge cases."""

import json
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi import HTTPException

from app.api.endpoints.manifest_integration import (
    add_assets_to_manifest,
    backfill_asset_metadata,
    export_manifest,
    generate_deployment_plan,
    import_manifest,
    recalculate_manifest_summary,
    run_integration_test,
    validate_manifest,
)
from app.schemas.manifest_integration import (
    BackfillAssetRequest,
    ManifestAssetEntry,
    ManifestUpdateRequest,
)


@pytest.fixture
def mock_manifest():
    return {
        "project": "kerala-rage kr-solidarity",
        "version": "3.0.0",
        "last_updated": "2026-03-06T00:00:00Z",
        "strategy": "Political/Cultural Design System",
        "assets": [
            {
                "id": "existing-1",
                "name": "Existing One",
                "category": "portrait",
                "file_path": "/assets/existing-1.webp",
                "priority": "HIGH",
                "status": "ready",
            }
        ],
        "asset_summary": {
            "total_assets": 1,
            "by_category": {"portrait": 1},
            "by_priority": {"HIGH": 1},
        },
    }


class TestManifestIntegrationExpanded:
    @pytest.mark.asyncio
    async def test_add_assets_version_bumps(self, mock_manifest):
        """Cover all version bump branches."""
        with patch(
            "app.api.endpoints.manifest_integration.load_manifest", return_value=mock_manifest
        ):
            with patch("app.api.endpoints.manifest_integration.save_manifest", return_value=True):
                # Major bump
                req = ManifestUpdateRequest(
                    assets_to_add=[], updated_by="dev", version_bump="major"
                )
                res = await add_assets_to_manifest(req)
                assert res["new_version"] == "4.0.0"

                # Minor bump
                mock_manifest["version"] = "3.0.0"
                req = ManifestUpdateRequest(
                    assets_to_add=[], updated_by="dev", version_bump="minor"
                )
                res = await add_assets_to_manifest(req)
                assert res["new_version"] == "3.1.0"

                # Patch bump (handled by default in code, but let's be explicit if possible)
                mock_manifest["version"] = "3.0.0"
                req = ManifestUpdateRequest(
                    assets_to_add=[], updated_by="dev", version_bump="patch"
                )
                res = await add_assets_to_manifest(req)
                assert res["new_version"] == "3.0.1"

    @pytest.mark.asyncio
    async def test_add_assets_save_failure(self, mock_manifest):
        """Cover manifest save failure."""
        with patch(
            "app.api.endpoints.manifest_integration.load_manifest", return_value=mock_manifest
        ):
            with patch("app.api.endpoints.manifest_integration.save_manifest", return_value=False):
                req = ManifestUpdateRequest(
                    assets_to_add=[], updated_by="dev", version_bump="patch"
                )
                with pytest.raises(HTTPException) as exc:
                    await add_assets_to_manifest(req)
                assert exc.value.status_code == 500

    @pytest.mark.asyncio
    async def test_validate_manifest_with_errors(self, mock_manifest):
        """Cover validation error branches (duplicates, missing fields, etc.)."""
        # Duplicate IDs
        mock_manifest["assets"].append(mock_manifest["assets"][0])
        with patch(
            "app.api.endpoints.manifest_integration.load_manifest", return_value=mock_manifest
        ):
            res = await validate_manifest()
            assert res.valid is False
            assert "Duplicate asset IDs detected" in res.errors

        # Missing fields
        mock_manifest["assets"] = [{"id": "bad-asset"}]  # missing name, category, etc.
        with patch(
            "app.api.endpoints.manifest_integration.load_manifest", return_value=mock_manifest
        ):
            res = await validate_manifest()
            assert res.valid is False
            assert any("missing" in e for e in res.errors)

        # Invalid category/priority (Warnings)
        mock_manifest["assets"] = [
            {
                "id": "valid-id",
                "name": "N",
                "category": "weird",
                "file_path": "P",
                "priority": "NONE",
                "status": "S",
            }
        ]
        with patch(
            "app.api.endpoints.manifest_integration.load_manifest", return_value=mock_manifest
        ):
            res = await validate_manifest()
            assert res.valid is True  # Warnings don't invalidate
            assert any("Invalid categories" in w for w in res.warnings)
            assert any("Invalid priorities" in w for w in res.warnings)

    @pytest.mark.asyncio
    async def test_backfill_asset_not_found(self, mock_manifest):
        """Cover asset not found in backfill."""
        with patch(
            "app.api.endpoints.manifest_integration.load_manifest", return_value=mock_manifest
        ):
            req = BackfillAssetRequest(
                asset_id="non-existent",
                category="symbol",
                priority="HIGH",
                political_significance="S",
                intended_context="C",
                style="S",
                backfilled_by="B",
            )
            with pytest.raises(HTTPException) as exc:
                await backfill_asset_metadata(req)
            assert exc.value.status_code == 404

    @pytest.mark.asyncio
    async def test_run_integration_test_varied_outcomes(self, mock_manifest):
        """Cover integration test failure paths."""
        # Asset not found
        with patch(
            "app.api.endpoints.manifest_integration.load_manifest", return_value=mock_manifest
        ):
            res = await run_integration_test("non-existent")
            assert res.passed is False
            assert "Asset not found" in res.error_message

        # Missing specs/integrity (Trigger False passed)
        mock_manifest["assets"][0]["specs"] = {}  # missing aspect_ratio
        with patch(
            "app.api.endpoints.manifest_integration.load_manifest", return_value=mock_manifest
        ):
            res = await run_integration_test("existing-1")
            assert res.passed is False

        # Exception during test
        with patch(
            "app.api.endpoints.manifest_integration.load_manifest",
            side_effect=RuntimeError("Crash"),
        ):
            res = await run_integration_test("any")
            assert res.passed is False
            assert "Crash" in res.error_message

    @pytest.mark.asyncio
    async def test_import_manifest_all_failures(self):
        """Cover import failure branches."""
        mock_file = MagicMock()
        mock_file.filename = "test.json"

        # Non-dict JSON
        mock_file.read = AsyncMock(return_value=b'["not", "a", "dict"]')
        with pytest.raises(HTTPException) as exc:
            await import_manifest(mock_file)
        assert exc.value.status_code == 400
        assert "Manifest must be a JSON object" in exc.value.detail

        # Missing assets key
        mock_file.read = AsyncMock(return_value=b'{"version": "1.0.0"}')
        with pytest.raises(HTTPException) as exc:
            await import_manifest(mock_file)
        assert exc.value.status_code == 400
        assert "Manifest must contain 'assets' array" in exc.value.detail

        # Save failure
        mock_file.read = AsyncMock(return_value=b'{"assets": []}')
        with patch("app.api.endpoints.manifest_integration.save_manifest", return_value=False):
            with pytest.raises(HTTPException) as exc:
                await import_manifest(mock_file)
            assert exc.value.status_code == 400
            assert "Failed to save" in exc.value.detail
