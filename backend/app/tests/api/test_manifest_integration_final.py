from __future__ import annotations

import json
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest
from fastapi import HTTPException

from app.api.endpoints import manifest_integration as mi
from app.schemas.manifest_integration import (
    BackfillAssetRequest,
    ManifestAssetEntry,
    ManifestUpdateRequest,
)


def _entry(asset_id: str) -> ManifestAssetEntry:
    return ManifestAssetEntry(
        id=asset_id,
        name=f"Name {asset_id}",
        category="portrait",
        file_path=f"/assets/{asset_id}.webp",
        priority="HIGH",
        status="ready",
        intended_context="hero",
        specs={"aspect_ratio": "1:1", "style": "screenprint"},
    )


@pytest.mark.asyncio
async def test_load_manifest_default_and_save_manifest_failure(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    manifest_path = tmp_path / "missing.json"
    monkeypatch.setattr(mi, "MANIFEST_PATH", manifest_path)

    default_manifest = mi.load_manifest()
    assert default_manifest["assets"] == []

    # Force save failure
    monkeypatch.setattr(Path, "mkdir", lambda *a, **k: None)
    with patch("builtins.open", side_effect=OSError("disk full")):
        assert mi.save_manifest(default_manifest) is False


def test_save_manifest_serializes_datetime(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    manifest_path = tmp_path / "manifest.json"
    monkeypatch.setattr(mi, "MANIFEST_PATH", manifest_path)

    payload = {
        "assets": [],
        "created_at": mi.datetime.utcnow(),
    }
    assert mi.save_manifest(payload) is True
    data = json.loads(manifest_path.read_text())
    assert "created_at" in data


@pytest.mark.asyncio
async def test_add_assets_skips_duplicates_and_patch_bump(monkeypatch: pytest.MonkeyPatch) -> None:
    manifest = {
        "version": "1.0.0",
        "assets": [{"id": "a1", "category": "portrait", "priority": "HIGH", "status": "ready"}],
        "asset_summary": {
            "total_assets": 1,
            "by_category": {"portrait": 1},
            "by_priority": {"HIGH": 1},
        },
    }
    monkeypatch.setattr(mi, "load_manifest", lambda: manifest)
    monkeypatch.setattr(mi, "save_manifest", lambda _m: True)

    req = ManifestUpdateRequest(
        assets_to_add=[_entry("a1"), _entry("a2")], updated_by="u", version_bump="patch"
    )
    result = await mi.add_assets_to_manifest(req)

    assert result["assets_added"] == 1
    assert result["new_version"] == "1.0.1"


@pytest.mark.asyncio
async def test_recalculate_summary_failure_raises(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(mi, "load_manifest", lambda: {"assets": []})
    monkeypatch.setattr(mi, "save_manifest", lambda _m: False)

    with pytest.raises(HTTPException) as exc:
        await mi.recalculate_manifest_summary()
    assert exc.value.status_code == 500


@pytest.mark.asyncio
async def test_recalculate_summary_populates_category_priority_status(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    manifest = {
        "assets": [
            {"id": "a1", "category": "portrait", "priority": "HIGH", "status": "ready"},
            {"id": "a2"},  # exercise default unknown/MEDIUM/ready branches
        ]
    }
    monkeypatch.setattr(mi, "load_manifest", lambda: manifest)
    monkeypatch.setattr(mi, "save_manifest", lambda _m: True)

    result = await mi.recalculate_manifest_summary()
    assert result["success"] is True
    summary = result["summary"]
    assert summary["by_category"]["portrait"] == 1
    assert summary["by_category"]["unknown"] == 1
    assert summary["by_priority"]["HIGH"] == 1
    assert summary["by_priority"]["MEDIUM"] == 1
    assert summary["by_status"]["ready"] == 2


@pytest.mark.asyncio
async def test_backfill_success_path_and_save_failure(monkeypatch: pytest.MonkeyPatch) -> None:
    manifest = {
        "assets": [{"id": "x1", "name": "x", "file_path": "/assets/x1.webp"}],
        "asset_summary": {"total_assets": 1, "by_category": {}, "by_priority": {}},
    }
    req = BackfillAssetRequest(
        asset_id="x1",
        category="symbol",
        political_significance="p",
        style="wheat-paste",
        intended_context="card",
        priority="CRITICAL",
        backfilled_by="tester",
    )

    monkeypatch.setattr(mi, "load_manifest", lambda: manifest)
    monkeypatch.setattr(mi, "save_manifest", lambda _m: True)
    ok = await mi.backfill_asset_metadata(req)
    assert ok.success is True

    monkeypatch.setattr(mi, "save_manifest", lambda _m: False)
    with pytest.raises(HTTPException) as exc:
        await mi.backfill_asset_metadata(req)
    assert exc.value.status_code == 500


@pytest.mark.asyncio
async def test_generate_deployment_plan_and_export(monkeypatch: pytest.MonkeyPatch) -> None:
    manifest = {"version": "4.2.1", "assets": []}
    monkeypatch.setattr(mi, "load_manifest", lambda: manifest)

    req = ManifestUpdateRequest(assets_to_add=[_entry("a1")], updated_by="u", version_bump="minor")
    plan = await mi.generate_deployment_plan(req)
    assert plan.manifest_version == "4.2.1"
    assert plan.total_new_assets == 1

    exported = await mi.export_manifest()
    assert exported["success"] is True
    assert exported["manifest"]["version"] == "4.2.1"


@pytest.mark.asyncio
async def test_import_manifest_success_with_backup(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    manifest_path = tmp_path / "manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text('{"assets": []}')
    monkeypatch.setattr(mi, "MANIFEST_PATH", manifest_path)
    monkeypatch.setattr(mi, "save_manifest", lambda _m: True)

    upload = SimpleNamespace(
        filename="import.json",
        read=AsyncMock(return_value=json.dumps({"assets": [{"id": "a"}]}).encode()),
    )
    result = await mi.import_manifest(upload)
    assert result["success"] is True
    assert result["asset_count"] == 1
    assert manifest_path.with_stem(manifest_path.stem + ".backup").exists()


@pytest.mark.asyncio
async def test_run_integration_test_success_path(monkeypatch: pytest.MonkeyPatch) -> None:
    manifest = {
        "assets": [
            {
                "id": "a1",
                "name": "A1",
                "category": "portrait",
                "file_path": "/assets/a1.webp",
                "priority": "HIGH",
                "status": "ready",
                "specs": {"aspect_ratio": "1:1", "style": "x"},
            }
        ]
    }
    monkeypatch.setattr(mi, "load_manifest", lambda: manifest)

    result = await mi.run_integration_test("a1")
    assert result.passed is True
