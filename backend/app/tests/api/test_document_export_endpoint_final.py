from __future__ import annotations

import pytest
from fastapi import HTTPException

from app.api.endpoints import document_export as de
from app.models.document_export_schemas import (
    ApplicationPackageExportRequest,
    BatchExportRequest,
    CoverLetterExportRequest,
    DocumentExportRequest,
    ResumeExportRequest,
)


@pytest.mark.asyncio
async def test_get_current_user_id_placeholder() -> None:
    assert await de.get_current_user_id() == "user_123"


@pytest.mark.asyncio
async def test_export_endpoints_reraise_http_exception(monkeypatch: pytest.MonkeyPatch) -> None:
    async def raise_http(*_args, **_kwargs):
        raise HTTPException(status_code=418, detail="teapot")

    monkeypatch.setattr(de.document_export_service, "export_cover_letter", raise_http)
    monkeypatch.setattr(de.document_export_service, "export_resume", raise_http)
    monkeypatch.setattr(de.document_export_service, "export_ksc_response", raise_http)
    monkeypatch.setattr(de.document_export_service, "export_application_package", raise_http)

    with pytest.raises(HTTPException) as exc1:
        await de.export_cover_letter(
            CoverLetterExportRequest(job_title="Engineer", format="json", expiration_hours=2),
            content="hello",
            user_id="u1",
        )
    assert exc1.value.status_code == 418

    with pytest.raises(HTTPException) as exc2:
        await de.export_resume(
            ResumeExportRequest(job_title="Engineer", format="json", expiration_hours=2),
            content={"x": 1},
            user_id="u1",
        )
    assert exc2.value.status_code == 418

    with pytest.raises(HTTPException) as exc3:
        await de.export_ksc_response(
            DocumentExportRequest(format="json", expiration_hours=2),
            response_data={"x": 1},
            job_title="Engineer",
            user_id="u1",
        )
    assert exc3.value.status_code == 418

    with pytest.raises(HTTPException) as exc4:
        await de.export_application_package(
            ApplicationPackageExportRequest(job_id="job-1", format="json", expiration_hours=2),
            package_data={"x": 1},
            user_id="u1",
        )
    assert exc4.value.status_code == 418


@pytest.mark.asyncio
async def test_export_batch_generic_exception_maps_to_500(monkeypatch: pytest.MonkeyPatch) -> None:
    req = BatchExportRequest(document_types=["resume"], format="json", expiration_hours=2)
    monkeypatch.setattr(
        de.logger, "info", lambda *_a, **_k: (_ for _ in ()).throw(RuntimeError("boom"))
    )

    with pytest.raises(HTTPException) as exc:
        await de.export_batch(req, documents={"resume": {}}, user_id="u1")

    assert exc.value.status_code == 500
    assert "Failed to export batch" in str(exc.value.detail)
