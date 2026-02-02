import sys
import os
from unittest.mock import MagicMock

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# --- 1. SETUP MOCKS BEFORE IMPORTS ---
# Purpose: Test 'application_strategy_workflow.py' orchestration logic without 
# requiring real dependencies (Genkit, Playwright, API Keys) or their imports.

# Mock Genkit
mock_genkit = MagicMock()
mock_genkit.flow = lambda output_schema: lambda func: func  # Decorator passthrough
sys.modules['genkit'] = mock_genkit
sys.modules['genkit.plugins'] = MagicMock()
sys.modules['genkit.plugins.googleai'] = MagicMock()
mock_google_module = MagicMock()
mock_google_module.generativeai = MagicMock()
sys.modules['google'] = mock_google_module
sys.modules['google.generativeai'] = mock_google_module.generativeai
mock_pgvector_module = MagicMock()
mock_pgvector_sqlalchemy = MagicMock()
mock_pgvector_sqlalchemy.Vector = MagicMock()
mock_pgvector_module.sqlalchemy = mock_pgvector_sqlalchemy
sys.modules['pgvector'] = mock_pgvector_module
sys.modules['pgvector.sqlalchemy'] = mock_pgvector_sqlalchemy

# Mock Pydantic models for type safety/hints in the orchestrator
from pydantic import BaseModel

class CorporateProfile(BaseModel):
    name: str = "Test Corp"
    mission_statement: str = "Test Mission"
    core_values: list = []
    strategic_focus: str = "Test Focus"
    communication_style: str = "Test Style"
    known_for: str = "Test Quality"

class OptimizedResume(BaseModel):
    resume_text: str

class JobListingDetails(BaseModel):
    company_name: str
    role_title: str
    key_responsibilities: list

class GapAnalysisResult(BaseModel):
    evidence_found: list = []

# Create mocks for the project modules that create_application_strategy imports
mock_extractor_module = MagicMock()
mock_corp_intel_module = MagicMock()
mock_optimizer_module = MagicMock()
mock_gap_hunter_module = MagicMock()

# Define functions/classes on the module mocks
# 1. Job Listing Extractor
mock_extract_flow = MagicMock()
mock_extractor_module.extract_job_listing_details_flow = mock_extract_flow

# 2. Corporate Intelligence
mock_research_flow = MagicMock()
mock_corp_intel_module.research_company = mock_research_flow
mock_corp_intel_module.CorporateProfile = CorporateProfile

# 3. Resume Optimizer
mock_optimize_flow = MagicMock()
mock_optimizer_module.optimizeResume = mock_optimize_flow
mock_optimizer_module.OptimizedResume = OptimizedResume

# Inject into sys.modules so 'import app.genkit_flows.xxx' uses our mocks
sys.modules['app.genkit_flows.job_listing_extractor'] = mock_extractor_module
sys.modules['app.genkit_flows.corporate_intelligence'] = mock_corp_intel_module
sys.modules['app.genkit_flows.resume_optimizer'] = mock_optimizer_module
mock_gap_flow = MagicMock()
mock_gap_hunter_module.gap_hunter_flow = mock_gap_flow
mock_gap_hunter_module.GapAnalysisResult = GapAnalysisResult
sys.modules['app.genkit_flows.gap_hunter'] = mock_gap_hunter_module

# --- 2. IMPORT THE UNIT UNDER TEST ---
# Now verify the import works (it will see our sys.modules mocks)
try:
    from app.genkit_flows.application_strategy_workflow import create_application_strategy
except ImportError as e:
    print(f"FATAL: Import failed: {e}")
    sys.exit(1)

print("--- Starting Flow Verification (Logic Only) ---")

# --- 3. CONFIGURE RETURN VALUES ---
mock_extract_flow.return_value = JobListingDetails(
    company_name="Acme Corp",
    role_title="Senior Engineer",
    key_responsibilities=["Coding", "Deploying"]
)

mock_research_flow.return_value = CorporateProfile(
    name="Acme Corp",
    mission_statement="To empower engineers.",
    core_values=["Innovation", "Speed"],
    strategic_focus="Cloud Dominance",
    communication_style="Direct",
    known_for="Tech Excellence"
)

mock_optimize_flow.return_value = OptimizedResume(
    resume_text="Optimized Resume Content..."
)
mock_gap_flow.return_value = GapAnalysisResult(
    evidence_found=["Delivered direct impact via cloud migration"]
)

# --- 4. EXECUTE ---
try:
    result = create_application_strategy(
        job_url="http://example.com/job",
        resume_text="Original Resume",
        missing_keywords=["Cloud"]
    )
except Exception as e:
    print(f"FATAL: Execution failed: {e}")
    sys.exit(1)

# --- 5. ASSERTIONS ---
print("\n[Check 1] Job Extractor called?")
mock_extract_flow.assert_called_once()
print("PASS")

print("\n[Check 2] Research Company called with 'Acme Corp'?")
mock_research_flow.assert_called_with("Acme Corp")
print("PASS")

print("\n[Check 3] Resume Optimizer called with correct context?")
args, kwargs = mock_optimize_flow.call_args
# Verify the corporate_profile was passed
assert kwargs['corporate_profile'].name == "Acme Corp"
assert "Senior Engineer" in kwargs['jobDescription']
print("PASS")

print("\n[Check 4] Final Result Object?")
assert result.corporate_profile.name == "Acme Corp"
assert "Direct" in result.strategy_summary
print("PASS")

print("\n--- VERIFICATION SUCCESSFUL ---")
