import pytest
from unittest.mock import AsyncMock, patch
from app.workers.ats_score_worker import process_ats_score_task

@pytest.mark.asyncio
@patch("app.ai_operations.ats_scoring.ats_scorer")
@patch("app.core.db.db")
async def test_process_ats_score_task_runs_and_saves(mock_db, mock_ats_scorer):
    mock_result = AsyncMock()
    mock_result.data = {"score": 99}
    mock_ats_scorer.comprehensive_ats_analysis.return_value = {"score": 99}
    mock_db.collection.return_value.document.return_value.collection.return_value.document.return_value.set = AsyncMock()

    await process_ats_score_task("user1", "doc1", "resume text", "job desc")
    mock_ats_scorer.comprehensive_ats_analysis.assert_called_once()
    mock_db.collection.return_value.document.return_value.collection.return_value.document.return_value.set.assert_called()
