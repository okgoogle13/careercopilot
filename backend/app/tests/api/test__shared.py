"""
Tests for shared helpers and utilities in the backend API.
"""

from typing import Any, Awaitable, Callable
from unittest.mock import AsyncMock, patch

import pytest
from fastapi import HTTPException, UploadFile
from fastapi.testclient import TestClient

from app.api.endpoints import _shared
from app.core.genkit_init import is_genkit_enabled
from app.utils.pdf_parser import extract_text_from_upload  # Import for mocking


# Mock User class for testing authentication-related functions
class User:
    def __init__(self, id: str, email: str):
        self.id = id
        self.email = email


@pytest.fixture
def mock_current_user(monkeypatch):
    """Mock authenticated user."""

    def mock_get_current_user():
        return User(id="test", email="test@example.com")

    from app.core import dependencies

    monkeypatch.setattr(dependencies, "get_current_user", mock_get_current_user)


class TestExtractTextFromUpload:
    @pytest.fixture
    async def mock_extract_text_from_upload(self):
        with patch("app.api.endpoints._shared.extract_text_from_upload") as mock:
            yield mock

    @pytest.mark.asyncio
    async def test_extract_text_from_upload_success(self, mock_extract_text_from_upload):
        mock_extract_text_from_upload.return_value = "test text"

        result = await _shared.extract_text_from_upload(
            UploadFile(filename="test.pdf", file=b"test")
        )
        assert result == "test text"

    @pytest.mark.asyncio
    async def test_extract_text_from_upload_no_text(self, mock_extract_text_from_upload):
        mock_extract_text_from_upload.return_value = None

        result = await _shared.extract_text_from_upload(
            UploadFile(filename="test.pdf", file=b"test")
        )
        assert result is None


class TestRunGenkitEndpoint:
    @pytest.fixture
    def mock_is_genkit_enabled(self, monkeypatch):
        with patch("app.api.endpoints._shared.is_genkit_enabled") as mock:
            yield mock

    @pytest.mark.asyncio
    async def test_run_genkit_endpoint_enabled_success(self, mock_is_genkit_enabled):
        mock_is_genkit_enabled.return_value = True

        async def mock_operation():
            return "success"

        result = await _shared.run_genkit_endpoint(mock_operation, "Test operation")
        assert result == "success"

    @pytest.mark.asyncio
    async def test_run_genkit_endpoint_disabled(self, mock_is_genkit_enabled):
        mock_is_genkit_enabled.return_value = False

        async def mock_operation():
            return "success"

        with pytest.raises(HTTPException) as exc_info:
            await _shared.run_genkit_endpoint(mock_operation, "Test operation")
        assert exc_info.value.status_code == 503
        assert "Genkit flows are disabled." in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_run_genkit_endpoint_operation_raises_http_exception(
        self, mock_is_genkit_enabled
    ):
        mock_is_genkit_enabled.return_value = True

        async def mock_operation():
            raise HTTPException(status_code=400, detail="Bad request")

        with pytest.raises(HTTPException) as exc_info:
            await _shared.run_genkit_endpoint(mock_operation, "Test operation")
        assert exc_info.value.status_code == 400

    @pytest.mark.asyncio
    async def test_run_genkit_endpoint_operation_raises_exception(self, mock_is_genkit_enabled):
        mock_is_genkit_enabled.return_value = True

        async def mock_operation():
            raise ValueError("Test error")

        with pytest.raises(HTTPException) as exc_info:
            await _shared.run_genkit_endpoint(mock_operation, "Test operation")
        assert exc_info.value.status_code == 500
        assert "Test operation: Test error" in exc_info.value.detail


class TestRunEndpointOperation:
    @pytest.fixture
    def mock_logger(self):
        class MockLogger:
            def __init__(self):
                self.messages = []

            def error(self, message, *args, exc_info=None):
                self.messages.append((message, args, exc_info))

        return MockLogger()

    @pytest.mark.asyncio
    async def test_run_endpoint_operation_success(self):
        async def mock_operation():
            return "success"

        result = await _shared.run_endpoint_operation(mock_operation, "Test operation")
        assert result == "success"

    @pytest.mark.asyncio
    async def test_run_endpoint_operation_http_exception(self):
        async def mock_operation():
            raise HTTPException(status_code=400, detail="Bad request")

        with pytest.raises(HTTPException) as exc_info:
            await _shared.run_endpoint_operation(mock_operation, "Test operation")
        assert exc_info.value.status_code == 400

    @pytest.mark.asyncio
    async def test_run_endpoint_operation_bad_request_exception(self, mock_logger):
        async def mock_operation():
            raise ValueError("Test error")

        with pytest.raises(HTTPException) as exc_info:
            await _shared.run_endpoint_operation(
                mock_operation, "Test operation", bad_request_exceptions=(ValueError,)
            )
        assert exc_info.value.status_code == 400
        assert "Test error" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_run_endpoint_operation_general_exception(self, mock_logger):
        async def mock_operation():
            raise ValueError("Test error")

        with pytest.raises(HTTPException) as exc_info:
            await _shared.run_endpoint_operation(
                mock_operation, "Test operation", bad_request_exceptions=()
            )
        assert exc_info.value.status_code == 500
        assert "Test operation: Test error" in exc_info.value.detail
        assert len(mock_logger.messages) == 1
        assert "Test operation: Test error" in mock_logger.messages[0][0]


class TestCollectUploadedText:
    @pytest.fixture
    async def mock_extract_text_from_upload(self):
        with patch("app.api.endpoints._shared.extract_text_from_upload") as mock:
            yield mock

    @pytest.fixture
    def mock_logger(self):
        class MockLogger:
            def __init__(self):
                self.messages = []

            def info(self, message, *args):
                self.messages.append((message, args))

            def warning(self, message, *args):
                self.messages.append((message, args))

        return MockLogger()

    @pytest.mark.asyncio
    async def test_collect_uploaded_text_success(self, mock_extract_text_from_upload, mock_logger):
        mock_extract_text_from_upload.return_value = "test text"
        file1 = UploadFile(filename="file1.pdf", file=b"test")
        file2 = UploadFile(filename="file2.pdf", file=b"test")
        files = [file1, file2]

        result = await _shared.collect_uploaded_text(files, logger=mock_logger)
        assert "--- SOURCE: file1.pdf ---\n" in result
        assert "--- SOURCE: file2.pdf ---\n" in result
        assert "test text" in result
        assert len(mock_logger.messages) == 2
        assert "Processing file: file1.pdf" in mock_logger.messages[0][0]
        assert "Processing file: file2.pdf" in mock_logger.messages[1][0]

    @pytest.mark.asyncio
    async def test_collect_uploaded_text_no_text(self, mock_extract_text_from_upload, mock_logger):
        mock_extract_text_from_upload.return_value = None
        file1 = UploadFile(filename="file1.pdf", file=b"test")
        file2 = UploadFile(filename="file2.pdf", file=b"test")
        files = [file1, file2]

        with pytest.raises(HTTPException) as exc_info:
            await _shared.collect_uploaded_text(files, logger=mock_logger)
        assert exc_info.value.status_code == 400
        assert "No readable text found." in exc_info.value.detail
        assert len(mock_logger.messages) == 2
        assert "Processing file: file1.pdf" in mock_logger.messages[0][0]
        assert "No text extracted from file1.pdf" in mock_logger.messages[1][0]

    @pytest.mark.asyncio
    async def test_collect_uploaded_text_no_files(self):

        with pytest.raises(HTTPException) as exc_info:
            await _shared.collect_uploaded_text([])
        assert exc_info.value.status_code == 400
        assert "No readable text found." in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_collect_uploaded_text_no_source_headers(self, mock_extract_text_from_upload):
        mock_extract_text_from_upload.return_value = "test text"
        file1 = UploadFile(filename="file1.pdf", file=b"test")
        files = [file1]

        result = await _shared.collect_uploaded_text(files, include_source_headers=False)
        assert "--- SOURCE: file1.pdf ---" not in result
        assert "test text" in result
