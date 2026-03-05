"""Unit tests for the ATS score worker."""

from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.models.user_asset import UserAsset
from app.workers.ats_score_worker import process_ats_score_task


@pytest.mark.asyncio
async def test_process_ats_score_task_success():
    """Successful processing should persist ATS results and close DB session."""
    user_id = "test-user"
    document_id = "test-doc"
    resume_text = "Some resume text"
    job_description = "Some job description"

    mock_db = MagicMock()
    mock_asset = MagicMock(spec=UserAsset)
    mock_asset.extracted_data = {}
    mock_db.query.return_value.filter.return_value.first.return_value = mock_asset

    mock_result = SimpleNamespace(data={"score": 85, "recommendations": []}, success=True)

    with (
        patch("app.workers.ats_score_worker.SessionLocal", return_value=mock_db),
        patch(
            "app.workers.ats_score_worker.enhanced_ai_handler.execute_ai_operation",
            new_callable=AsyncMock,
            return_value=mock_result,
        ) as mock_execute,
    ):
        await process_ats_score_task(user_id, document_id, resume_text, job_description)

    mock_db.query.assert_called_once()
    assert mock_asset.extracted_data["ats_score_result"] == mock_result.data
    mock_db.commit.assert_called_once()
    mock_db.close.assert_called_once()

    # Ensure contextual metadata is wired into the AI operation call.
    context = mock_execute.await_args.args[1]
    assert context.operation_name == "comprehensive_ats_analysis"
    assert context.user_id == user_id
    assert context.metadata["document_id"] == document_id


@pytest.mark.asyncio
async def test_process_ats_score_task_executes_ai_operation_callback():
    """The AI operation callable should invoke the ATS scorer bridge."""
    mock_db = MagicMock()
    mock_asset = MagicMock(spec=UserAsset)
    mock_asset.extracted_data = {}
    mock_db.query.return_value.filter.return_value.first.return_value = mock_asset

    async def _execute(op, *_args, **_kwargs):
        return SimpleNamespace(data=await op())

    with (
        patch("app.workers.ats_score_worker.SessionLocal", return_value=mock_db),
        patch(
            "app.workers.ats_score_worker.ats_scorer.comprehensive_ats_analysis",
            new_callable=AsyncMock,
            return_value={"score": 91},
        ) as mock_scorer,
        patch(
            "app.workers.ats_score_worker.enhanced_ai_handler.execute_ai_operation",
            new_callable=AsyncMock,
            side_effect=_execute,
        ),
    ):
        await process_ats_score_task("user-1", "doc-1", "resume", "job")

    mock_scorer.assert_awaited_once()
    assert mock_asset.extracted_data["ats_score_result"] == {"score": 91}


@pytest.mark.asyncio
async def test_process_ats_score_task_asset_not_found():
    """If no asset exists, worker should skip commit but still close DB."""
    mock_db = MagicMock()
    mock_db.query.return_value.filter.return_value.first.return_value = None

    with (
        patch("app.workers.ats_score_worker.SessionLocal", return_value=mock_db),
        patch(
            "app.workers.ats_score_worker.enhanced_ai_handler.execute_ai_operation",
            new_callable=AsyncMock,
            return_value=SimpleNamespace(data={"score": 0}),
        ),
    ):
        await process_ats_score_task("test-user", "nonexistent-doc", "resume", "job")

    mock_db.commit.assert_not_called()
    mock_db.close.assert_called_once()


@pytest.mark.asyncio
async def test_process_ats_score_task_ai_failure_is_handled_and_db_closed():
    """AI handler exceptions should be swallowed and DB should always close."""
    mock_db = MagicMock()

    with (
        patch("app.workers.ats_score_worker.SessionLocal", return_value=mock_db),
        patch(
            "app.workers.ats_score_worker.enhanced_ai_handler.execute_ai_operation",
            new_callable=AsyncMock,
            side_effect=RuntimeError("AI failed"),
        ),
    ):
        await process_ats_score_task("user", "doc", "resume", "job")

    mock_db.commit.assert_not_called()
    mock_db.close.assert_called_once()


@pytest.mark.asyncio
async def test_process_ats_score_task_session_creation_error_is_handled():
    """SessionLocal failures should not raise to callers."""
    with patch("app.workers.ats_score_worker.SessionLocal", side_effect=Exception("DB Error")):
        await process_ats_score_task("user", "doc", "resume", "job")
