from __future__ import annotations

from pathlib import Path
from unittest.mock import AsyncMock

import pytest

from app.ai.document_processor import DocumentChunk, DocumentProcessor
from app.core.ai_error_handling import AIError


class _PdfPlumberCtx:
    def __init__(self, pages):
        self.pages = pages

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False


class _PdfPlumberPage:
    def __init__(self, text: str):
        self._text = text

    def extract_text(self) -> str:
        return self._text


class _PdfiumPage:
    def __init__(self, text: str):
        self._text = text

    def get_text(self) -> str:
        return self._text


class _PdfiumDoc:
    def __init__(self, pages: list[_PdfiumPage]):
        self._pages = pages

    def __len__(self) -> int:
        return len(self._pages)

    def __getitem__(self, idx: int) -> _PdfiumPage:
        return self._pages[idx]


def _make_chunks(text: str, page_num: int, base_meta: dict[str, str]) -> list[DocumentChunk]:
    return [
        DocumentChunk(
            text=text,
            metadata={**base_meta, "page_number": str(page_num)},
            page_number=page_num,
        )
    ]


def test_detect_content_type_variants() -> None:
    processor = DocumentProcessor()
    assert processor._detect_content_type(Path("a.PDF")) == "application/pdf"
    assert processor._detect_content_type(Path("a.md")) == "text/plain"
    assert processor._detect_content_type(Path("a.markdown")) == "text/plain"
    assert processor._detect_content_type(Path("a.htm")) == "text/html"
    assert processor._detect_content_type(Path("a.bin")) == "text/plain"


def test_chunk_text_empty_and_whitespace_normalization() -> None:
    processor = DocumentProcessor(config={"chunk_size": 20, "chunk_overlap": 5})
    assert processor._chunk_text("   ", {"x": "1"}) == []

    chunks = processor._chunk_text("Hello\n\nWorld\tAgain", {"source": "x"})
    assert len(chunks) == 1
    assert chunks[0].text == "Hello World Again"
    assert chunks[0].metadata["chunk_number"] == "1"


def test_chunk_text_sentence_boundary_and_overlap() -> None:
    processor = DocumentProcessor(config={"chunk_size": 30, "chunk_overlap": 8})
    text = "First sentence. Second sentence is longer. Third sentence here."

    chunks = processor._chunk_text(text, {"source": "resume"})
    assert len(chunks) >= 2
    assert "First sentence." in chunks[0].text
    assert chunks[0].chunk_number == 1
    assert chunks[1].chunk_number == 2


@pytest.mark.asyncio
async def test_process_text_sets_incrementing_chunk_numbers() -> None:
    processor = DocumentProcessor()
    processor._chunk_text = lambda text, meta: [
        DocumentChunk(text="a", metadata=meta.copy()),
        DocumentChunk(text="b", metadata=meta.copy()),
    ]

    chunks = await processor._process_text("x", {"source": "s"})
    assert [c.metadata["chunk_number"] for c in chunks] == [1, 2]


@pytest.mark.asyncio
async def test_process_html_strips_script_style_and_delegates(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    processor = DocumentProcessor()
    captured: dict[str, str] = {}

    async def fake_process_text(text: str, metadata: dict[str, str]):
        captured["text"] = text
        return [DocumentChunk(text=text, metadata=metadata)]

    processor._process_text = fake_process_text

    html = b"<html><style>.x{}</style><script>alert(1)</script><body> A  <b>B</b> </body></html>"
    chunks = await processor._process_html(html, {"source": "html"})

    assert len(chunks) == 1
    assert captured["text"] == "A B"


@pytest.mark.asyncio
async def test_process_html_wraps_exceptions(monkeypatch: pytest.MonkeyPatch) -> None:
    processor = DocumentProcessor()
    monkeypatch.setattr(
        "app.ai.document_processor.BeautifulSoup",
        lambda *_: (_ for _ in ()).throw(RuntimeError("bad html")),
    )

    with pytest.raises(AIError, match="Failed to process HTML"):
        await processor._process_html(b"<html>", {})


@pytest.mark.asyncio
async def test_process_pdf_uses_pypdfium2_primary_path(monkeypatch: pytest.MonkeyPatch) -> None:
    processor = DocumentProcessor()
    base_meta = {"source": "pdf"}

    pages = [_PdfiumPage("Page one text"), _PdfiumPage("   "), _PdfiumPage("Page three text")]
    monkeypatch.setattr(
        "app.ai.document_processor.pypdfium2.PdfDocument", lambda _: _PdfiumDoc(pages)
    )

    def fake_chunk(text: str, metadata: dict[str, str]) -> list[DocumentChunk]:
        page_num = int(metadata["page_number"])
        return _make_chunks(text.strip(), page_num, metadata)

    processor._chunk_text = fake_chunk

    chunks = await processor._process_pdf(b"%PDF", base_meta)
    assert [c.page_number for c in chunks] == [1, 3]
    assert [c.metadata["chunk_number"] for c in chunks] == [1, 1]


@pytest.mark.asyncio
async def test_process_pdf_falls_back_to_pdfplumber(monkeypatch: pytest.MonkeyPatch) -> None:
    processor = DocumentProcessor()

    monkeypatch.setattr(
        "app.ai.document_processor.pypdfium2.PdfDocument",
        lambda _: (_ for _ in ()).throw(RuntimeError("pdfium failed")),
    )
    pages = [_PdfPlumberPage("Fallback one"), _PdfPlumberPage("Fallback two")]
    monkeypatch.setattr(
        "app.ai.document_processor.pdfplumber.open", lambda _: _PdfPlumberCtx(pages)
    )

    processor._chunk_text = lambda text, meta: [DocumentChunk(text=text, metadata=meta.copy())]

    chunks = await processor._process_pdf(b"%PDF", {"source": "pdf"})
    assert len(chunks) == 2
    assert chunks[0].page_number == 1
    assert chunks[1].page_number == 2


@pytest.mark.asyncio
async def test_process_pdf_fallback_skips_blank_pages(monkeypatch: pytest.MonkeyPatch) -> None:
    processor = DocumentProcessor()

    monkeypatch.setattr(
        "app.ai.document_processor.pypdfium2.PdfDocument",
        lambda _: (_ for _ in ()).throw(RuntimeError("pdfium failed")),
    )
    monkeypatch.setattr(
        "app.ai.document_processor.pdfplumber.open",
        lambda _: _PdfPlumberCtx([_PdfPlumberPage(" "), _PdfPlumberPage("Text")]),
    )

    processor._chunk_text = lambda text, meta: [DocumentChunk(text=text, metadata=meta.copy())]
    chunks = await processor._process_pdf(b"%PDF", {})
    assert len(chunks) == 1
    assert chunks[0].page_number == 2


@pytest.mark.asyncio
async def test_process_pdf_wraps_errors_when_both_extractors_fail(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    processor = DocumentProcessor()
    monkeypatch.setattr(
        "app.ai.document_processor.pypdfium2.PdfDocument",
        lambda _: (_ for _ in ()).throw(RuntimeError("pdfium failed")),
    )
    monkeypatch.setattr(
        "app.ai.document_processor.pdfplumber.open",
        lambda _: (_ for _ in ()).throw(RuntimeError("encrypted")),
    )

    with pytest.raises(AIError, match="Failed to process PDF"):
        await processor._process_pdf(b"%PDF", {})


@pytest.mark.asyncio
async def test_process_document_path_detects_content_type_and_routes(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    processor = DocumentProcessor()
    fake_file = Path("resume.pdf")

    monkeypatch.setattr(Path, "read_bytes", lambda _self: b"%PDF-bytes")
    monkeypatch.setattr(processor, "_detect_content_type", lambda _p: "application/pdf")
    processor._process_pdf = AsyncMock(return_value=[DocumentChunk(text="x", metadata={})])

    result = await processor.process_document(fake_file)
    assert len(result) == 1
    processor._process_pdf.assert_awaited_once()


@pytest.mark.asyncio
async def test_process_document_bytes_text_and_html_routes() -> None:
    processor = DocumentProcessor()
    processor._process_text = AsyncMock(return_value=[DocumentChunk(text="txt", metadata={})])
    processor._process_html = AsyncMock(return_value=[DocumentChunk(text="html", metadata={})])

    text_chunks = await processor.process_document(b"hello", content_type="text/plain")
    html_chunks = await processor.process_document(b"<p>x</p>", content_type="text/html")

    assert text_chunks[0].text == "txt"
    assert html_chunks[0].text == "html"


@pytest.mark.asyncio
async def test_process_document_markdown_route() -> None:
    processor = DocumentProcessor()
    processor._process_text = AsyncMock(return_value=[DocumentChunk(text="md", metadata={})])

    chunks = await processor.process_document(b"# Title", content_type="text/markdown")
    assert chunks[0].text == "md"


@pytest.mark.asyncio
async def test_process_document_unsupported_type_becomes_aierror() -> None:
    processor = DocumentProcessor()

    with pytest.raises(AIError, match="Unsupported content type"):
        await processor.process_document(b"x", content_type="application/x-zip")


@pytest.mark.asyncio
async def test_process_document_utf8_decode_failure_becomes_aierror() -> None:
    processor = DocumentProcessor()

    with pytest.raises(AIError, match="Failed to process document"):
        await processor.process_document(b"\xff\xfe", content_type="text/plain")


@pytest.mark.asyncio
async def test_process_document_defaults_metadata_when_none() -> None:
    processor = DocumentProcessor()

    async def fake_text(_text: str, metadata: dict[str, str]):
        return [DocumentChunk(text="ok", metadata=metadata)]

    processor._process_text = fake_text
    chunks = await processor.process_document(b"ok", metadata=None, content_type="text/plain")
    assert chunks[0].metadata == {}


@pytest.mark.asyncio
async def test_process_document_wraps_generic_exception_from_detection(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    processor = DocumentProcessor()
    monkeypatch.setattr(Path, "read_bytes", lambda _self: b"x")
    monkeypatch.setattr(
        processor, "_detect_content_type", lambda _p: (_ for _ in ()).throw(RuntimeError("boom"))
    )

    with pytest.raises(AIError, match="Failed to process document"):
        await processor.process_document("a.txt")
