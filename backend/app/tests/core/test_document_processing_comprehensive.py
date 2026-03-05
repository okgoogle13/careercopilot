"""
Tests for document_processing.py
"""

from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient
from pydantic import BaseModel

from app.core.ai_client import AIRequest, get_ai_client
from app.core.ai_error_handling import AIError, AIErrorType
from app.core.config import settings
from app.core.document_processing import (
    DocumentProcessingError,
    DocumentProcessor,
    PromptTemplate,
    _make_ai_request,
    _parse_ai_response,
    process_document,
)


# Mock Pydantic model for testing
class MockResponse(BaseModel):
    result: str


class TestPromptTemplate:
    def test_format_prompt_success(self):
        template = PromptTemplate(
            template="Summarize the following content: {content}",
            required_variables=["content"],
        )
        formatted_prompt = template.format(content="Test content")
        assert (
            formatted_prompt
            == "Summarize the following content: Test content\n\nPlease respond with valid JSON only."
        )

    def test_format_prompt_missing_variables(self):
        template = PromptTemplate(
            template="Summarize the following content: {content}",
            required_variables=["content"],
        )
        with pytest.raises(ValueError) as excinfo:
            template.format()
        assert "Missing required template variables" in str(excinfo.value)

    def test_format_prompt_with_instructions(self):
        template = PromptTemplate(
            template="Summarize the following content: {content}",
            required_variables=["content"],
            instructions="First, identify the key points.",
        )
        formatted_prompt = template.format(content="Test content")
        assert "First, identify the key points." in formatted_prompt
        assert "Summarize the following content: Test content" in formatted_prompt

    def test_format_prompt_with_expected_format(self):
        template = PromptTemplate(
            template="Extract information: {content}",
            required_variables=["content"],
            expected_format="text",
        )
        formatted_prompt = template.format(content="Test content")
        assert "Please respond with valid JSON only." not in formatted_prompt


class TestDocumentProcessor:
    def test_get_prompt_template_abstract_method(self):
        class ConcreteProcessor(DocumentProcessor):
            def get_prompt_template(self):
                return PromptTemplate(template="Test template", required_variables=[])

            def parse_response(self, response: str) -> BaseModel:
                return MockResponse(result=response)

        processor = ConcreteProcessor()
        assert processor.get_prompt_template() is not None

    def test_parse_response_abstract_method(self):
        class ConcreteProcessor(DocumentProcessor):
            def get_prompt_template(self):
                return PromptTemplate(template="Test template", required_variables=[])

            def parse_response(self, response: str) -> BaseModel:
                return MockResponse(result=response)

        processor = ConcreteProcessor()
        assert isinstance(processor.parse_response("test"), MockResponse)


class TestProcessDocument:
    @pytest.fixture
    async def mock_ai_client(self):
        mock_client = AsyncMock()
        with patch("app.core.document_processing.get_ai_client", return_value=mock_client):
            yield mock_client

    @pytest.fixture
    async def mock_ai_request(self):
        mock_request = AsyncMock()
        return mock_request

    @pytest.fixture
    async def mock_ai_response(self):
        mock_response = AsyncMock()
        mock_response.content = '{"result": "test_result"}'
        return mock_response

    def test_process_document_success(self, mock_ai_client, mock_ai_request, mock_ai_response):
        mock_ai_client.generate_text.return_value = mock_ai_response
        prompt_template = PromptTemplate(
            template="Summarize: {content}", required_variables=["content"]
        )

        async def run_test():
            result = await process_document(
                file_content="Test content",
                prompt_template=prompt_template,
                response_model=MockResponse,
            )
            assert isinstance(result, MockResponse)
            assert result.result == "test_result"

        pytest.runloop.run_until_complete(run_test())

    async def test_process_document_empty_content(self):
        prompt_template = PromptTemplate(
            template="Summarize: {content}", required_variables=["content"]
        )
        with pytest.raises(DocumentProcessingError) as excinfo:
            await process_document(
                file_content="", prompt_template=prompt_template, response_model=MockResponse
            )
        assert "File content must be a non-empty string" in str(excinfo.value)

    async def test_process_document_short_content(self):
        prompt_template = PromptTemplate(
            template="Summarize: {content}", required_variables=["content"]
        )
        with pytest.raises(DocumentProcessingError) as excinfo:
            await process_document(
                file_content="a", prompt_template=prompt_template, response_model=MockResponse
            )
        assert "File content is too short for meaningful processing" in str(excinfo.value)

    async def test_process_document_ai_error(self, mock_ai_client):
        mock_ai_client.generate_text.side_effect = AIError(error_type=AIErrorType.RATE_LIMIT)
        prompt_template = PromptTemplate(
            template="Summarize: {content}", required_variables=["content"]
        )
        with pytest.raises(AIError) as excinfo:
            await process_document(
                file_content="Test content",
                prompt_template=prompt_template,
                response_model=MockResponse,
            )
        assert excinfo.value.error_type == AIErrorType.RATE_LIMIT

    async def test_process_document_exception_handling(self, mock_ai_client):
        mock_ai_client.generate_text.side_effect = Exception("Test exception")
        prompt_template = PromptTemplate(
            template="Summarize: {content}", required_variables=["content"]
        )
        with pytest.raises(DocumentProcessingError) as excinfo:
            await process_document(
                file_content="Test content",
                prompt_template=prompt_template,
                response_model=MockResponse,
            )
        assert "Failed to process document" in str(excinfo.value)


class TestHelperFunctions:
    @pytest.fixture
    async def mock_ai_client(self):
        mock_client = AsyncMock()
        with patch("app.core.document_processing.get_ai_client", return_value=mock_client):
            yield mock_client

    @pytest.fixture
    async def mock_ai_response(self):
        mock_response = AsyncMock()
        mock_response.content = '{"result": "test_result"}'
        return mock_response

    async def test_make_ai_request_success(self, mock_ai_client, mock_ai_response):
        mock_ai_client.generate_text.return_value = mock_ai_response
        result = await _make_ai_request(
            prompt="Test prompt", model="test_model", max_tokens=100, temperature=0.5
        )
        assert result == "test_result"

    async def test_make_ai_request_ai_error(self, mock_ai_client):
        mock_ai_client.generate_text.side_effect = AIError(error_type=AIErrorType.RATE_LIMIT)
        with pytest.raises(AIError) as excinfo:
            await _make_ai_request(
                prompt="Test prompt", model="test_model", max_tokens=100, temperature=0.5
            )
        assert excinfo.value.error_type == AIErrorType.RATE_LIMIT

    def test_parse_ai_response_success(self):
        ai_response = '{"result": "test_result"}'
        result = _parse_ai_response(ai_response, MockResponse)
        assert isinstance(result, MockResponse)
        assert result.result == "test_result"
