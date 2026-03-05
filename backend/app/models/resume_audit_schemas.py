from typing import List, Optional

from pydantic import BaseModel, Field


class Violation(BaseModel):
    ruleId: str = Field(..., description="The RKL rule ID, e.g., 'L1.L1.002'")
    severity: str = Field(..., description="Severity level: error, warning, or info")
    message: str = Field(..., description="Description of the violation")
    location: Optional[str] = Field(None, description="Where in the resume the violation occurs")


class AuditResult(BaseModel):
    overallScore: float = Field(..., description="Overall score from 0-100")
    scanSimulation: str = Field(..., description="Simulation of a 10-second recruiter scan")
    violations: List[Violation] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)


class AuditRequest(BaseModel):
    resumeText: str
    jobDescription: Optional[str] = None
    strictnessMode: str = "moderate"


class AuditResponse(BaseModel):
    success: bool
    data: AuditResult
    meta: dict
