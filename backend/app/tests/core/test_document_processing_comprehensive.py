"""Compatibility tests for document processing helpers."""

import pytest
from pydantic import BaseModel

from app.core.document_processing import (
    DocumentProcessingError,
    PromptTemplate,
    _parse_ai_response,
    process_document,
)


class _Result(BaseModel):
    score: int


def test_prompt_template_formats_json_instruction():
    template = PromptTemplate(template="Analyze {content}", required_variables=["content"])
    formatted = template.format(content="resume")
    assert "Analyze resume" in formatted
    assert "valid JSON" in formatted


def test_parse_ai_response_accepts_wrapped_json():
    result = _parse_ai_response('prefix {"score": 7} suffix', _Result)
    assert result.score == 7


@pytest.mark.asyncio
async def test_process_document_rejects_short_content():
    with pytest.raises(DocumentProcessingError):
        await process_document(
            "short",
            PromptTemplate(template="{content}", required_variables=["content"]),
            _Result,
        )
