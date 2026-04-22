"""Compatibility tests for ingestion service behavior."""

import importlib
import sys
import types

import pytest


@pytest.fixture
def ingestion_module(monkeypatch):
    fake_vs = types.ModuleType("app.services.vector_store")

    class _CareerArtifact:
        def __init__(self, content, source_type, source_filename):
            self.content = content
            self.source_type = source_type
            self.source_filename = source_filename

    class _VectorStore:
        def __init__(self):
            self.added = []

        def add_artifact(self, artifact, user_id="legacy_user"):
            self.added.append((artifact, user_id))

    fake_vs.CareerArtifact = _CareerArtifact
    fake_vs.VectorStore = _VectorStore
    monkeypatch.setitem(sys.modules, "app.services.vector_store", fake_vs)

    mod = importlib.import_module("app.services.ingestion")
    return importlib.reload(mod)


def test_semantic_chunking(ingestion_module):
    service = ingestion_module.IngestionService()
    chunks = service._semantic_chunking("one\n\ntwo\nthree", max_chunk_size=6)
    assert chunks
    assert all(isinstance(c, str) for c in chunks)


def test_parse_docx_without_dependency_raises(ingestion_module, monkeypatch):
    service = ingestion_module.IngestionService()
    monkeypatch.setattr(ingestion_module, "docx", None)
    with pytest.raises(RuntimeError):
        service._parse_docx(b"irrelevant")


def test_process_file_txt_adds_chunks(ingestion_module):
    service = ingestion_module.IngestionService()
    payload = ("A" * 60 + "\n" + "B" * 60).encode("utf-8")
    service.process_file(payload, "resume.txt", "resume", user_id="u1")
    assert len(service.vector_store.added) >= 1
