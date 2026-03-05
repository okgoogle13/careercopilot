"""
Tests for NLP Model Manager - Comprehensive
"""

import sys
from unittest.mock import MagicMock

# Mock heavy modules before they are imported by the code under test if necessary
# but here we also need to mock them for THIS test file to even load.
sys.modules["transformers"] = MagicMock()
sys.modules["spacy"] = MagicMock()

import time
import unittest.mock as mock

import psutil
import pytest
from fastapi.testclient import TestClient

from app.core.nlp_model_manager import NLPModelManager
from app.monitoring.nlp_metrics import (
    NLP_REQUEST_DURATION,
    track_model_load_time,
    track_model_memory_usage,
    track_nlp_duration,
    track_nlp_request,
    track_tokens_processed,
)


# Mocking dependencies
@pytest.fixture
def mock_spacy_load():
    """Mock spacy.load to return a dummy model."""
    with mock.patch("spacy.load") as mock_load:
        yield mock_load


@pytest.fixture
def mock_transformers_pipeline():
    """Mock transformers.pipeline to return a dummy pipeline."""
    with mock.patch("transformers.pipeline") as mock_pipeline:
        yield mock_pipeline


@pytest.fixture
def nlp_model_manager():
    """Fixture to provide an instance of NLPModelManager and reset its state."""
    # Reset singleton state
    NLPModelManager._instance = None
    manager = NLPModelManager()
    manager._models = {}
    manager._initialized = True
    return manager


class TestNLPModelManagerInitialization:
    """Tests for NLPModelManager initialization."""

    def test_singleton_pattern(self):
        """Test that the NLPModelManager is a singleton."""
        # Ensure clean state
        NLPModelManager._instance = None
        manager1 = NLPModelManager()
        manager2 = NLPModelManager()
        assert manager1 is manager2

    def test_initialized_flag(self):
        """Test that the _initialized flag prevents re-initialization."""
        NLPModelManager._instance = None
        manager = NLPModelManager()
        # Initial state
        assert manager._initialized is True


class TestModelLoadingAndCaching:
    """Tests for model loading and caching functionality."""

    def test_load_spacy_model_success(self, nlp_model_manager, mock_spacy_load):
        """Test successful loading of a spaCy model."""
        mock_model = mock.MagicMock()
        mock_spacy_load.return_value = mock_model
        model = nlp_model_manager.load_model("en_core_web_sm", "spacy")
        assert model is mock_model
        mock_spacy_load.assert_called_once_with("en_core_web_sm")

    def test_load_transformers_model_success(self, nlp_model_manager, mock_transformers_pipeline):
        """Test successful loading of a transformers model."""
        mock_pipeline_result = mock.MagicMock()
        mock_transformers_pipeline.return_value = mock_pipeline_result
        model = nlp_model_manager.load_model(
            "distilbert-base-uncased-finetuned-sst-2-english", "transformers"
        )
        assert model is mock_pipeline_result
        mock_transformers_pipeline.assert_called_once_with(
            "text-classification", model="distilbert-base-uncased-finetuned-sst-2-english"
        )

    def test_load_model_caching(self, nlp_model_manager, mock_spacy_load):
        """Test that the model is cached and not reloaded."""
        mock_model = mock.MagicMock()
        mock_spacy_load.return_value = mock_model
        model1 = nlp_model_manager.load_model("en_core_web_sm", "spacy")
        model2 = nlp_model_manager.load_model("en_core_web_sm", "spacy")
        assert model1 is model2
        mock_spacy_load.assert_called_once_with("en_core_web_sm")

    def test_force_reload_model(self, nlp_model_manager, mock_spacy_load):
        """Test that force_reload reloads the model."""
        mock_model1 = mock.MagicMock()
        mock_model2 = mock.MagicMock()
        mock_spacy_load.side_effect = [mock_model1, mock_model2]
        model1 = nlp_model_manager.load_model("en_core_web_sm", "spacy")
        model2 = nlp_model_manager.load_model("en_core_web_sm", "spacy", force_reload=True)
        assert model1 is not model2
        assert mock_spacy_load.call_count == 2

    def test_unsupported_model_type(self, nlp_model_manager):
        """Test that an unsupported model type raises a ValueError."""
        with pytest.raises(ValueError):
            nlp_model_manager.load_model("en_core_web_sm", "invalid_type")


class TestNLPOperationTracking:
    """Tests for NLP operation tracking with metrics."""

    @mock.patch("app.core.nlp_model_manager.track_nlp_request")
    @mock.patch("app.core.nlp_model_manager.NLP_REQUEST_DURATION")
    def test_track_nlp_operation_success(
        self, mock_nlp_duration, mock_nlp_request, nlp_model_manager
    ):
        """Test successful tracking of NLP operation."""

        @nlp_model_manager.track_nlp_operation("test_endpoint")
        def test_function():
            return {"result": "success", "tokens_processed": 100}

        result = test_function()

        mock_nlp_request.assert_called_once()
        mock_nlp_duration.labels(endpoint="test_endpoint", model="default").observe.assert_called()

    @mock.patch("app.core.nlp_model_manager.track_nlp_request")
    @mock.patch("app.core.nlp_model_manager.NLP_REQUEST_DURATION")
    def test_track_nlp_operation_error(
        self, mock_nlp_duration, mock_nlp_request, nlp_model_manager
    ):
        """Test tracking of NLP operation with an error."""

        @nlp_model_manager.track_nlp_operation("test_endpoint")
        def test_function():
            raise ValueError("Test error")

        with pytest.raises(ValueError) as exc_info:
            test_function()

        mock_nlp_request.assert_called_once()
        mock_nlp_duration.labels(endpoint="test_endpoint", model="default").observe.assert_called()
        assert "Test error" in str(exc_info.value)
