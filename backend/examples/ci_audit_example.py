# Example Integration: CI Auditor with Genkit
# File: backend/examples/ci_audit_example.py

"""
Demonstrates how to integrate CIAuditorPrompts with Google Genkit for automated code reviews.

This example shows:
1. Basic file-based audit
2. PR-triggered audit via GitHub webhook
3. Quick pre-commit scan
4. Slack notification integration
"""

import asyncio
from pathlib import Path

# Genkit imports (install with: pip install genkit genkit-plugin-google-genai)
from genkit import genkit
from genkit_plugin_google_genai import google_genai

# CareerCopilot CI Auditor
from app.core.prompts import CIAuditorPrompts, CIAuditResponse, CodeAuditRequest

# Initialize Genkit with Gemini 3.0 Flash
genkit.configure(plugins=[google_genai()], log_level="info")

# Define the audit flow
audit_flow = genkit.define_flow(name="code_audit_flow", fn=lambda request: perform_audit(request))


async def perform_audit(request: CodeAuditRequest) -> CIAuditResponse:
    """
    Main audit function that orchestrates the LLM-based code review.

    Args:
        request: CodeAuditRequest with file paths and context

    Returns:
        Structured CIAuditResponse with findings categorized by severity
    """
    # Step 1: Read file contents
    file_contents = {}
    for file_path in request.file_paths:
        try:
            path = Path(file_path)
            if path.exists():
                file_contents[file_path] = path.read_text()
            else:
                print(f"⚠️  File not found: {file_path}")
        except Exception as e:
            print(f"❌ Error reading {file_path}: {e}")

    # Step 2: Build prompts
    system_prompt = CIAuditorPrompts.build_system_prompt()
    user_prompt = CIAuditorPrompts.build_review_prompt(request)

    # Append actual file contents to the prompt
    user_prompt += "\n\n---\n## File Contents\n\n"
    for filepath, content in file_contents.items():
        user_prompt += f"### {filepath}\n```\n{content}\n```\n\n"

    # Step 3: Call Genkit with structured output
    response = await genkit.generate(
        model="gemini-2.0-flash",
        prompt=user_prompt,
        config={
            "temperature": 0.1,  # Low temperature for consistent, factual analysis
            "max_output_tokens": 4096,
            "system_instruction": system_prompt,
        },
        output_schema=CIAuditResponse.model_json_schema(),  # Enforce JSON schema
    )

    # Step 4: Parse and validate response
    audit_result = CIAuditResponse.model_validate_json(response.text)

    return audit_result


# ------------------------------------------------------------------------------
# Example 1: Audit PR files
# ------------------------------------------------------------------------------
async def audit_pull_request(pr_files: list[str]):
    """Audits all files changed in a GitHub PR."""
    request = CodeAuditRequest(
        file_paths=pr_files,
        tech_stack="React 18 / Python FastAPI / Google Cloud",
        deployment_target="Cloud Run + Firebase Hosting",
        focus_area="Deployment safety and build integrity",
    )

    result = await perform_audit(request)

    # Generate Markdown report for PR comment
    markdown_report = result.to_markdown()

    # Post to GitHub (pseudo-code)
    # github_client.create_pr_comment(pr_number=123, body=markdown_report)

    print(markdown_report)

    return result


# ------------------------------------------------------------------------------
# Example 2: Pre-commit quick scan
# ------------------------------------------------------------------------------
async def quick_scan_staged_files(staged_files: list[str]):
    """Fast triage scan for pre-commit hook (target: <30s execution)."""
    quick_prompt = CIAuditorPrompts.build_quick_scan_prompt(
        file_count=len(staged_files), tech_stack="TypeScript React"
    )

    # Append file contents
    file_data = ""
    for file_path in staged_files:
        if Path(file_path).exists():
            file_data += f"\n### {file_path}\n```\n{Path(file_path).read_text()}\n```\n"

    response = await genkit.generate(
        model="gemini-2.0-flash-lite",  # Use lite model for speed
        prompt=quick_prompt + file_data,
        config={
            "temperature": 0,
            "max_output_tokens": 1024,  # Keep response small
        },
    )

    # Parse lightweight response
    import json

    issues = json.loads(response.text)

    for issue in issues:
        severity_emoji = {"BLOCKER": "⛔", "CRITICAL": "🔴", "WARNING": "⚠️"}
        print(f"{severity_emoji[issue['severity']]} {issue['file']}:{issue['line']}")
        print(f"   {issue['issue']}")
        print(f"   Fix: {issue['fix']}\n")

    # Block commit if blockers found
    has_blockers = any(i["severity"] == "BLOCKER" for i in issues)
    if has_blockers:
        print("❌ Commit blocked due to critical issues. Fix blockers and try again.")
        exit(1)


# ------------------------------------------------------------------------------
# Example 3: Full codebase audit (scheduled job)
# ------------------------------------------------------------------------------
async def weekly_codebase_audit():
    """Comprehensive audit of critical files, run weekly via cron."""
    critical_files = [
        ".github/workflows/ci.yml",
        ".github/workflows/deploy.yml",
        "backend/Dockerfile",
        "frontend/package.json",
        "backend/requirements.txt",
    ]

    request = CodeAuditRequest(
        file_paths=critical_files,
        tech_stack="Full-stack React + FastAPI",
        deployment_target="GCP Cloud Run",
        focus_area="CI/CD pipeline and dependency management",
    )

    result = await perform_audit(request)

    # Send Slack notification if issues found
    if result.has_blockers():
        # Pseudo-code for Slack webhook
        # slack_client.post_message(
        #     channel="#deployments",
        #     text=f"⚠️ Weekly audit found {result.summary.total_critical} critical issues!",
        #     attachments=[{
        #         "color": "danger",
        #         "text": result.to_markdown()
        #     }]
        # )
        print("🚨 Slack notification sent: Critical issues detected")

    # Save report to file
    report_path = Path("audit_reports") / f"audit_{asyncio.get_event_loop().time()}.md"
    report_path.parent.mkdir(exist_ok=True)
    report_path.write_text(result.to_markdown())

    print(f"✅ Audit report saved to {report_path}")

    return result


# ------------------------------------------------------------------------------
# Example 4: GitHub Actions integration
# ------------------------------------------------------------------------------
def github_actions_main():
    """
    Entry point for GitHub Actions workflow.

    Usage in .github/workflows/code-audit.yml:

    ```yaml
    - name: Run AI Code Audit
      run: |
        python backend/examples/ci_audit_example.py
      env:
        GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        PR_FILES: ${{ steps.changed-files.outputs.all_changed_files }}
    ```
    """
    import os
    import sys

    # Get changed files from GitHub Actions env
    pr_files = os.getenv("PR_FILES", "").split()
    if not pr_files:
        print("No files to audit. Exiting.")
        sys.exit(0)

    # Run audit
    result = asyncio.run(audit_pull_request(pr_files))

    # Fail workflow if blockers found
    if not result.summary.deployment_ready:
        print(f"\n❌ AUDIT FAILED: {result.summary.blocker_summary}")
        sys.exit(1)

    print("\n✅ Audit passed! No deployment blockers found.")
    sys.exit(0)


# ------------------------------------------------------------------------------
# CLI entry point
# ------------------------------------------------------------------------------
if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python ci_audit_example.py <file1> <file2> ...")
        sys.exit(1)

    files_to_audit = sys.argv[1:]

    request = CodeAuditRequest(
        file_paths=files_to_audit,
        tech_stack="React 18 / Python FastAPI",
        deployment_target="Google Cloud Run",
    )

    result = asyncio.run(perform_audit(request))
    print(result.to_markdown())

    # Exit with error code if blockers found
    sys.exit(0 if result.summary.deployment_ready else 1)
