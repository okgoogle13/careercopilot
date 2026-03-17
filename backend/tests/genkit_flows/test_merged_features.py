import os
import sys
from unittest.mock import MagicMock

# Add backend to sys.path so 'app' interactions work as expected
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# --- Global Mocking for Dependencies ---
# Mock 'genkit' and 'google.generativeai' BEFORE importing application modules
# This prevents ImportError when the environment is missing these packages or config.

mock_genkit = MagicMock()
mock_genkit.flow = MagicMock()  # Defines @genkit.flow decorator
mock_genkit.configure = MagicMock()
mock_genkit.model = MagicMock()


# Mock async_genkit_flow decorator logic
def async_flow_mock(*args, **kwargs):
    def decorator(func):
        async def wrapper(*f_args, **f_kwargs):
            return await func(*f_args, **f_kwargs)

        wrapper._original = func
        return wrapper

    return decorator


mock_decorator = MagicMock()
mock_decorator.async_genkit_flow = async_flow_mock

sys.modules["genkit"] = mock_genkit
sys.modules["genkit.model"] = MagicMock()
sys.modules["google.generativeai"] = MagicMock()

# Also mock flow_decorator module if it imports genkit heavily,
# but if we mocked genkit, flow_decorator might load fine.
# Let's mock 'app.genkit_flows.flow_decorator' to be safe and use our controlled decorator.
sys.modules["app.genkit_flows.flow_decorator"] = mock_decorator
# We shouldn't need backend.app.genkit_flows.flow_decorator if we import as app.*

# --- End Global Mocking ---

import unittest
from unittest.mock import mock_open, patch

# Now safe to import
# We need to mock 'builtins.open' because 'job_listing_extractor' reads a JSON file at module level

# Mock data usually found in prompt_templates.json
mock_prompts_json = '{"job_listing_extractor": {"template": "Extraction Prompt"}, "job_listing_advanced_analysis": {"template": "Advanced Prompt"}, "company_context": {"template": "Context Prompt"}}'

with patch("builtins.open", mock_open(read_data=mock_prompts_json)):
    # Import using 'app' package to match production code usage
    from app.genkit_flows.company_context import CompanyContext, generate_company_context
    from app.genkit_flows.resume_optimizer import OptimizedResume, optimize_resume

    # We import the modules under test. They will use the mocked genkit.
    from app.genkit_flows.unified_job_analyzer import analyze_job_from_url
    from app.models.schemas import JobListingDetails


class TestMergedFeatures(unittest.IsolatedAsyncioTestCase):

    @patch("app.genkit_flows.unified_job_analyzer.extract_job_listing_details_flow")
    @patch("app.genkit_flows.unified_job_analyzer.generate_company_context")
    async def test_unified_job_analyzer_success(
        self, mock_company_context_flow, mock_job_details_flow
    ):
        # Setup mocks
        mock_job_details = JobListingDetails(
            role_title="Software Engineer",
            company_name="Tech Corp",
            location="Remote",
            essential_criteria=["Python"],
            desirable_criteria=["Cloud"],
            key_responsibilities=["Code"],
            full_description="Full text",
            role_type="Other",
        )
        mock_job_details_flow.return_value = mock_job_details

        mock_company_context = CompanyContext(
            recent_achievements=["Launched X"],
            core_values=["Integrity"],
            recommended_tone="conversational",
            why_work_here_points=["Great team"],
            interview_questions=["How?"],
            cultural_insights="Fun",
        )
        mock_company_context_flow.return_value = mock_company_context

        # Execute
        result = await analyze_job_from_url("http://example.com")

        # Verify
        self.assertTrue(result.analysis_success)
        self.assertEqual(result.job_details.company_name, "Tech Corp")
        self.assertEqual(result.company_context.core_values, ["Integrity"])

    @patch("app.genkit_flows.resume_optimizer.get_model")
    async def test_resume_optimizer_flow(self, mock_get_model):
        mock_optimized = OptimizedResume(
            resume_text="Optimized Resume Content", keywords_integrated=["Java", "Cloud"]
        )

        mock_model_instance = MagicMock()
        # The code usually calls generate() synchronously but we are in async test case.
        # Actually, genkit flows are usually sync wrappers around async calls or vice versa.
        # But looking at resume_optimizer.py: "response = model.generate(...)" is SYNC.
        # So we use MagicMock, not AsyncMock.
        mock_model_instance.generate = MagicMock(
            return_value=MagicMock(
                text='{"resume_text": "Optimized Resume Content", "keywords_integrated": ["Java", "Cloud"]}'
            )
        )
        mock_get_model.return_value = mock_model_instance

        # Execute
        result = await optimize_resume(
            resume_text="Original Resume", missing_keywords=["Java"], job_description="Job Desc"
        )

        # Verify
        self.assertEqual(result.resume_text, "Optimized Resume Content")
        self.assertIn("Java", result.keywords_integrated)

    @patch("app.genkit_flows.company_context.get_model")
    async def test_company_context_flow(self, mock_get_model):
        # Mock Response
        # The flow parses JSON from model response text
        mock_response = MagicMock()
        mock_response.text = '{"recent_achievements": ["Launched AI"], "core_values": ["Innovation"], "recommended_tone": "conversational", "why_work_here_points": ["Growth"], "interview_questions": ["Q1"], "cultural_insights": "Agile"}'

        mock_model_instance = MagicMock()
        # SYNC call in company_context.py too
        mock_model_instance.generate = MagicMock(return_value=mock_response)
        mock_get_model.return_value = mock_model_instance

        # Execute
        result = await generate_company_context("Google", "Software Engineer")

        # Verify
        self.assertEqual(result.core_values, ["Innovation"])
        self.assertEqual(result.recommended_tone, "conversational")


if __name__ == "__main__":
    unittest.main()
