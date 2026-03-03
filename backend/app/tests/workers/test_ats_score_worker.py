"""Unit tests for the ATS score worker."""
import pytest
from unittest.mock import MagicMock, patch, AsyncMock
from app.workers.ats_score_worker import process_ats_score_task
from app.models.user_asset import UserAsset

@pytest.mark.asyncio
async def test_process_ats_score_task_success():
    """Test successful processing of an ATS score task."""
    user_id = "test-user"
    document_id = "test-doc"
    resume_text = "Some resume text"
    job_description = "Some job description"
    
    # Mock database session
    mock_db = MagicMock()
    # Mock asset found in DB
    mock_asset = MagicMock(spec=UserAsset)
    mock_asset.extracted_data = {}
    mock_db.query.return_value.filter.return_value.first.return_value = mock_asset
    
    # Mock the enhanced AI handler result
    mock_result = MagicMock()
    mock_result.data = {"score": 85, "recommendations": []}
    mock_result.success = True
    
    with patch("app.workers.ats_score_worker.SessionLocal", return_value=mock_db), \
         patch("app.workers.ats_score_worker.enhanced_ai_handler.execute_ai_operation", new_callable=AsyncMock, return_value=mock_result), \
         patch("app.workers.ats_score_worker.ats_scorer.comprehensive_ats_analysis", new_callable=AsyncMock) as mock_scorer:
        
        await process_ats_score_task(user_id, document_id, resume_text, job_description)
        
        # Verify db interaction
        mock_db.query.assert_called_once()
        assert mock_asset.extracted_data["ats_score_result"] == mock_result.data
        mock_db.commit.assert_called_once()
        mock_db.close.assert_called_once()

@pytest.mark.asyncio
async def test_process_ats_score_task_asset_not_found():
    """Test behavior when asset is not found in database."""
    user_id = "test-user"
    document_id = "nonexistent-doc"
    
    mock_db = MagicMock()
    # No asset found
    mock_db.query.return_value.filter.return_value.first.return_value = None
    
    with patch("app.workers.ats_score_worker.SessionLocal", return_value=mock_db), \
         patch("app.workers.ats_score_worker.enhanced_ai_handler.execute_ai_operation", new_callable=AsyncMock) as mock_execute:
        
        mock_execute.return_value = MagicMock(data={"score": 0}, success=True)
        
        await process_ats_score_task(user_id, document_id, "resume", "job")
        
        # Should not call commit if asset not found
        mock_db.commit.assert_not_called()
        mock_db.close.assert_called_once()

@pytest.mark.asyncio
async def test_process_ats_score_task_error_handling():
    """Test error handling in the background worker task."""
    user_id = "test-user"
    document_id = "test-doc"
    
    with patch("app.workers.ats_score_worker.SessionLocal", side_effect=Exception("DB Error")):
        # This should log an error but not raise
        await process_ats_score_task(user_id, document_id, "resume", "job")
