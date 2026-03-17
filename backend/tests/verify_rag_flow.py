import os
import sys
from unittest.mock import MagicMock, patch

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# --- MOCKING DEPENDENCIES ---
mock_genkit = MagicMock()
mock_genkit.flow = lambda output_schema: lambda func: func
sys.modules["genkit"] = mock_genkit
sys.modules["genkit.plugins"] = MagicMock()
sys.modules["genkit.plugins.googleai"] = MagicMock()
sys.modules["google.generativeai"] = MagicMock()

# Mock Pydantic
from pydantic import BaseModel


class GapAnalysisResult(BaseModel):
    missing_skills: list
    evidence_found: list
    strategy_advice: str


# Mock VectorStore Service
mock_vs_module = MagicMock()
sys.modules["app.services.vector_store"] = mock_vs_module

# --- IMPORT FLOW ---
# We need to patch the internal generation call inside the flow
with patch("app.genkit_flows.gap_hunter.gemini_pro") as mock_gemini:
    from app.genkit_flows.gap_hunter import gap_hunter_flow

    # --- SETUP TEST DATA ---
    # Mock Gemini Response for Gap ID
    mock_gemini_response = MagicMock()
    mock_gemini_response.text.return_value = "Python, Leadership"
    mock_gemini.generate.return_value = mock_gemini_response

    # Mock VectorStore Instance and Query
    mock_vs_instance = MagicMock()
    mock_vs_module.VectorStore.return_value = mock_vs_instance

    # Mock Query Results (Evidence Found)
    mock_vs_instance.query_similar.return_value = [
        {
            "content": "Led a team of 5 developers using Python.",
            "metadata": {"source_type": "ksc_response"},
        }
    ]

    print("--- Starting Gap Hunter Verification ---")

    # --- EXECUTE ---
    result = gap_hunter_flow(resume_text="Junior Dev", job_description="Looking for Python Lead")

    # --- ASSERTIONS ---
    print("\n[Check 1] Gemini called for Gap ID?")
    mock_gemini.generate.assert_called_once()
    print("PASS")

    print("\n[Check 2] VectorStore queried for missing skills?")
    # Should be queried for "Python" and "Leadership" (from our mock response)
    assert mock_vs_instance.query_similar.call_count == 2
    print("PASS")

    print("\n[Check 3] Result contains evidence?")
    # We mocked one result returning, so we expect evidence for both calls ideally,
    # but our logic appends whatever comes back.
    print(f"Evidence Found: {result.evidence_found}")
    assert len(result.evidence_found) > 0
    assert "ksc_response" in result.evidence_found[0]
    print("PASS")

    print("\n--- RAG VERIFICATION SUCCESSFUL ---")
