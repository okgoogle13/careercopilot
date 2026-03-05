"""Comprehensive endpoint-level tests for applications API module."""

from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest
from fastapi import HTTPException

from app.api.endpoints import applications as module
from app.models.application_schemas import ApplicationCreate


def _valid_payload() -> ApplicationCreate:
    return ApplicationCreate(
        jobTitle="Case Manager",
        companyName="Community Org",
        jobDescription="A" * 60,
    )


def _app_obj(**overrides):
    now = datetime.now(timezone.utc)
    base = {
        "id": "app-1",
        "user_id": "user-1",
        "job_id": None,
        "job_title": "Case Manager",
        "company_name": "Community Org",
        "job_description": "A" * 60,
        "source": "manual",
        "status": "draft",
        "applied_date": None,
        "deadline": None,
        "contacts": [],
        "interviews": [],
        "documents": None,
        "notes": None,
        "rating": None,
        "salary": None,
        "integrations": None,
        "application_metadata": {},
        "created_at": now,
        "updated_at": now,
    }
    base.update(overrides)
    return SimpleNamespace(**base)


@pytest.mark.asyncio
async def test_create_application_sets_defaults_and_persists():
    db = MagicMock()
    payload = _valid_payload()

    result = await module.create_application(
        payload, current_user=SimpleNamespace(id="user-1"), db=db
    )

    assert result.user_id == "user-1"
    assert result.status == "draft"
    assert result.source == "manual"
    assert result.job_title == "Case Manager"
    db.add.assert_called_once()
    db.commit.assert_called_once()
    db.refresh.assert_called_once()


@pytest.mark.asyncio
async def test_get_application_returns_record_when_found():
    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = _app_obj()

    result = await module.get_application("app-1", current_user=SimpleNamespace(id="user-1"), db=db)

    assert result.id == "app-1"


@pytest.mark.asyncio
async def test_get_application_raises_404_when_missing():
    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc_info:
        await module.get_application("missing", current_user=SimpleNamespace(id="user-1"), db=db)

    assert exc_info.value.status_code == 404


@pytest.mark.asyncio
async def test_get_all_applications_applies_pagination():
    db = MagicMock()
    query = db.query.return_value.filter.return_value
    query.offset.return_value.limit.return_value.all.return_value = [
        _app_obj(id="app-1"),
        _app_obj(id="app-2"),
    ]

    result = await module.get_all_applications(
        current_user=SimpleNamespace(id="user-1"),
        db=db,
        skip=5,
        limit=10,
    )

    assert len(result) == 2
    query.offset.assert_called_once_with(5)
    query.offset.return_value.limit.assert_called_once_with(10)


@pytest.mark.asyncio
async def test_update_application_updates_existing_fields_only():
    db = MagicMock()
    existing = _app_obj(job_title="Old", company_name="Old Co")
    db.query.return_value.filter.return_value.first.return_value = existing

    payload = ApplicationCreate(
        jobTitle="New Title",
        companyName="New Co",
        jobDescription="B" * 60,
    )

    result = await module.update_application(
        "app-1",
        payload,
        current_user=SimpleNamespace(id="user-1"),
        db=db,
    )

    assert result.job_title == "New Title"
    assert result.company_name == "New Co"
    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(existing)


@pytest.mark.asyncio
async def test_update_application_raises_404_when_missing():
    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc_info:
        await module.update_application(
            "missing",
            _valid_payload(),
            current_user=SimpleNamespace(id="user-1"),
            db=db,
        )

    assert exc_info.value.status_code == 404


@pytest.mark.asyncio
async def test_delete_application_deletes_record_when_found():
    db = MagicMock()
    app = _app_obj()
    db.query.return_value.filter.return_value.first.return_value = app

    result = await module.delete_application(
        "app-1", current_user=SimpleNamespace(id="user-1"), db=db
    )

    assert result is None
    db.delete.assert_called_once_with(app)
    db.commit.assert_called_once()


@pytest.mark.asyncio
async def test_delete_application_raises_404_when_missing():
    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc_info:
        await module.delete_application("missing", current_user=SimpleNamespace(id="user-1"), db=db)

    assert exc_info.value.status_code == 404
