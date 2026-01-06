# backend/app/core/prompts/schemas.py

from typing import List, Literal
from pydantic import BaseModel, Field


class CriticalIssue(BaseModel):
    """Represents a deployment-blocking issue."""
    category: Literal["build", "security", "deployment"] = Field(
        description="Classification of the critical issue"
    )
    file: str = Field(description="Path to the affected file")
    line: str = Field(description="Line range (e.g., '10-15' or '42')")
    title: str = Field(description="Short, actionable title")
    description: str = Field(description="Detailed explanation of the risk")
    fix: str = Field(description="Concrete fix instructions with code examples")


class RedundancyIssue(BaseModel):
    """Represents a DRY (Don't Repeat Yourself) violation."""
    file: str
    lines: str
    severity: Literal["low", "medium", "high"]
    pattern: str = Field(description="What code/logic is being repeated")
    suggestion: str = Field(description="Refactoring recommendation")
    example_code: str | None = Field(
        default=None,
        description="Optional code snippet showing the improved version"
    )


class OptimizationWin(BaseModel):
    """Represents a performance or efficiency improvement opportunity."""
    file: str
    lines: str
    type: Literal["performance", "bundle_size", "caching", "memory"]
    current_behavior: str = Field(description="Description of current inefficiency")
    improvement: str = Field(description="What changes and why it's better")
    estimated_impact: str = Field(
        description="Quantified benefit (e.g., '2x faster', '-30% bundle size')"
    )


class AuditSummary(BaseModel):
    """High-level summary of the audit results."""
    total_critical: int = Field(ge=0)
    total_refactoring: int = Field(ge=0)
    total_optimizations: int = Field(ge=0)
    deployment_ready: bool
    blocker_summary: str | None = Field(
        default=None,
        description="One-line explanation if not deployment-ready"
    )


class CIAuditResponse(BaseModel):
    """Complete structured response from the CI Auditor."""
    critical_issues: List[CriticalIssue] = Field(default_factory=list)
    redundancy_report: List[RedundancyIssue] = Field(default_factory=list)
    optimization_wins: List[OptimizationWin] = Field(default_factory=list)
    summary: AuditSummary

    def has_blockers(self) -> bool:
        """Returns True if any critical issues were found."""
        return len(self.critical_issues) > 0

    def get_priority_issues(self, top_n: int = 5) -> List[RedundancyIssue]:
        """Returns the top N redundancy issues by severity."""
        severity_order = {"high": 3, "medium": 2, "low": 1}
        sorted_issues = sorted(
            self.redundancy_report,
            key=lambda x: severity_order.get(x.severity, 0),
            reverse=True
        )
        return sorted_issues[:top_n]

    def to_markdown(self) -> str:
        """Generates a Markdown-formatted report for PR comments or docs."""
        lines = ["# 🔍 CI/CD Audit Report\n"]
        
        # Summary section
        lines.append(f"**Deployment Ready**: {'✅ Yes' if self.summary.deployment_ready else '❌ No'}\n")
        lines.append(f"- **Critical Issues**: {self.summary.total_critical}")
        lines.append(f"- **Refactoring Opportunities**: {self.summary.total_refactoring}")
        lines.append(f"- **Optimization Wins**: {self.summary.total_optimizations}\n")
        
        if self.summary.blocker_summary:
            lines.append(f"⛔ **Blocker**: {self.summary.blocker_summary}\n")
        
        # Critical issues
        if self.critical_issues:
            lines.append("## ⛔ Critical Issues\n")
            for issue in self.critical_issues:
                lines.append(f"### {issue.title}")
                lines.append(f"**File**: `{issue.file}` (Line {issue.line})")
                lines.append(f"**Category**: {issue.category.upper()}")
                lines.append(f"\n{issue.description}\n")
                lines.append(f"**Fix**:\n```\n{issue.fix}\n```\n")
        
        # Redundancy report
        if self.redundancy_report:
            lines.append("## 🔄 DRY Violations\n")
            for redundancy in self.get_priority_issues():
                severity_emoji = {"high": "🔴", "medium": "🟡", "low": "🟢"}
                lines.append(f"### {severity_emoji[redundancy.severity]} {redundancy.file} (Lines {redundancy.lines})")
                lines.append(f"**Pattern**: {redundancy.pattern}")
                lines.append(f"**Suggestion**: {redundancy.suggestion}\n")
                if redundancy.example_code:
                    lines.append(f"```\n{redundancy.example_code}\n```\n")
        
        # Optimizations
        if self.optimization_wins:
            lines.append("## ⚡ Optimization Wins\n")
            for opt in self.optimization_wins:
                lines.append(f"### {opt.file} (Lines {opt.lines})")
                lines.append(f"**Type**: {opt.type}")
                lines.append(f"**Impact**: {opt.estimated_impact}")
                lines.append(f"\n{opt.improvement}\n")
        
        return "\n".join(lines)


class QuickScanIssue(BaseModel):
    """Lightweight schema for quick triage scans."""
    file: str
    line: str
    severity: Literal["BLOCKER", "CRITICAL", "WARNING"]
    issue: str
    fix: str


class QuickScanResponse(BaseModel):
    """Response schema for quick CI gate checks."""
    issues: List[QuickScanIssue]
    
    def has_blockers(self) -> bool:
        return any(i.severity == "BLOCKER" for i in self.issues)
    
    def to_slack_blocks(self) -> List[dict]:
        """Generates Slack Block Kit JSON for notifications."""
        blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "🚨 Quick Scan Results" if self.has_blockers() else "✅ Quick Scan Clear"
                }
            }
        ]
        
        for issue in self.issues:
            emoji = {"BLOCKER": "⛔", "CRITICAL": "🔴", "WARNING": "⚠️"}
            blocks.append({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"{emoji[issue.severity]} *{issue.file}:{issue.line}*\n{issue.issue}\n_Fix: {issue.fix}_"
                }
            })
        
        return blocks
