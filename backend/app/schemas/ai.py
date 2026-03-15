from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class AIRequestModel(BaseModel):
    """Modernized AI request structure for Genkit flows"""

    prompt: str = Field(..., description="The input prompt for the AI")
    service_name: str = Field(..., description="Name of the service requesting AI")
    user_id: str = Field(..., description="ID of the user requesting AI")
    model_name: str = Field("gemini-3.0-flash", description="AI model to use")
    temperature: float = Field(0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(1000, gt=0)
    context: dict[str, Any] = Field(default_factory=dict)
    system_prompt: str | None = None


class AIResponseModel(BaseModel):
    """Standardized AI response structure for Genkit flows"""

    content: str = Field(..., description="The generated AI content")
    model_used: str = Field(..., description="The exact model used for generation")
    tokens_used: dict[str, int] = Field(default_factory=lambda: {"input": 0, "output": 0})
    response_time_ms: float = Field(0.0)
    cached: bool = Field(False)
    metadata: dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class SalaryAnalysisResponse(BaseModel):
    salary_range: str
    negotiation_tips: list[str]
    market_comparison: str


class SkillsAnalysisResponse(BaseModel):
    top_skills: list[dict[str, Any]]
    trending_skills: list[str]
    development_plan: list[str]


class InterviewPrepResponse(BaseModel):
    questions: list[str]
    suggested_answers: list[str]
    candidate_questions: list[str]


class CompanyResearchResponse(BaseModel):
    talking_points: list[str]
    application_strategy: str


class CareerIntelligenceRequest(BaseModel):
    prompt_type: str = Field(
        ..., description="Type of prompt (salary_analysis, skills_analysis, etc.)"
    )
    task_prompt: str = Field(..., description="Specific task description")
    user_id: str = Field(..., description="User ID")
    context_data: dict[str, Any] = Field(default_factory=dict)


class LlmRequest(BaseModel):
    """Structured input for the Genkit-backed LLM service."""

    prompt: str = Field(..., description="The input prompt for the LLM")
    service_name: str | None = Field(None, description="Service invoking the LLM")
    task_type: str | None = Field(None, description="Task type for routing or caching")
    user_id: str | None = Field(None, description="User identifier for caching context")
    model_name: str = Field("gemini-3.0-flash", description="Preferred model name")
    temperature: float = Field(0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(1000, gt=0)
    context: dict[str, Any] = Field(default_factory=dict)
    system_prompt: str | None = None


class LlmResponse(BaseModel):
    """Structured output from the Genkit-backed LLM service."""

    content: str = Field(..., description="Generated model output")
    model_used: str = Field(..., description="Actual model used for generation")
    tokens_used: float = Field(0.0, description="Estimated tokens used")
    cached: bool = Field(False, description="Whether the response was served from cache")
    metadata: dict[str, Any] = Field(default_factory=dict)
    error: str | None = Field(None, description="Error details if generation failed")
