from __future__ import annotations

from app.core.prompts import (
    CIAuditorPrompts,
    CodeAuditRequest,
    QuickScanIssue,
    QuickScanResponse,
)
from app.core.prompts.schemas import (
    AuditSummary,
    CIAuditResponse,
    CriticalIssue,
    OptimizationWin,
    RedundancyIssue,
)


def test_prompts_package_exports_expected_symbols() -> None:
    from app.core import prompts

    exported = set(prompts.__all__)
    assert "CIAuditorPrompts" in exported
    assert "CodeAuditRequest" in exported
    assert "CIAuditResponse" in exported


def test_ci_auditor_system_prompt_contains_key_sections() -> None:
    text = CIAuditorPrompts.build_system_prompt()
    assert "Principal DevOps Engineer" in text
    assert "Mission" in text
    assert "structured JSON" in text


def test_ci_auditor_review_prompt_uses_context_and_defaults() -> None:
    req = CodeAuditRequest(
        file_paths=["backend/app/main.py", "frontend/src/App.tsx"],
        tech_stack="FastAPI + React",
        deployment_target="Cloud Run",
    )
    text = CIAuditorPrompts.build_review_prompt(req)
    assert "FastAPI + React" in text
    assert "Cloud Run" in text
    assert "backend/app/main.py, frontend/src/App.tsx" in text
    assert "General Production Readiness" in text

    req_focus = CodeAuditRequest(file_paths=["a.py"], focus_area="security")
    text_focus = CIAuditorPrompts.build_review_prompt(req_focus)
    assert "security" in text_focus


def test_ci_audit_response_methods_and_markdown() -> None:
    response = CIAuditResponse(
        critical_issues=[
            CriticalIssue(
                category="security",
                file="backend/app/main.py",
                line="10-12",
                title="Hardcoded secret",
                description="Secret in source",
                fix="Move to env var",
            )
        ],
        redundancy_report=[
            RedundancyIssue(
                file="f1.py",
                lines="1-10",
                severity="low",
                pattern="duplicate logic",
                suggestion="extract helper",
            ),
            RedundancyIssue(
                file="f2.py",
                lines="20-30",
                severity="high",
                pattern="duplicate query",
                suggestion="shared repository",
                example_code="def repo(): pass",
            ),
        ],
        optimization_wins=[
            OptimizationWin(
                file="f3.py",
                lines="40-50",
                type="performance",
                current_behavior="n+1 queries",
                improvement="batch load",
                estimated_impact="3x faster",
            )
        ],
        summary=AuditSummary(
            total_critical=1,
            total_refactoring=2,
            total_optimizations=1,
            deployment_ready=False,
            blocker_summary="Fix secrets",
        ),
    )

    assert response.has_blockers() is True
    top = response.get_priority_issues(top_n=1)
    assert len(top) == 1
    assert top[0].severity == "high"

    md = response.to_markdown()
    assert "CI/CD Audit Report" in md
    assert "Critical Issues" in md
    assert "DRY Violations" in md
    assert "Optimization Wins" in md
    assert "Hardcoded secret" in md


def test_quick_scan_response_helpers() -> None:
    clear = QuickScanResponse(
        issues=[
            QuickScanIssue(
                file="a.py",
                line="1",
                severity="WARNING",
                issue="minor",
                fix="optional",
            )
        ]
    )
    assert clear.has_blockers() is False
    blocks = clear.to_slack_blocks()
    assert blocks[0]["text"]["text"] == "✅ Quick Scan Clear"

    blocked = QuickScanResponse(
        issues=[
            QuickScanIssue(
                file="b.py",
                line="2",
                severity="BLOCKER",
                issue="bad",
                fix="fix now",
            )
        ]
    )
    assert blocked.has_blockers() is True
    blocks2 = blocked.to_slack_blocks()
    assert blocks2[0]["text"]["text"] == "🚨 Quick Scan Results"
