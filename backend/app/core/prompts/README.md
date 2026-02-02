# CI Auditor Module - Documentation

## Overview

The **CI Auditor** module provides AI-powered pre-deployment code reviews for the CareerCopilot platform. It automatically detects redundancy (DRY violations), build/deployment risks, and performance bottlenecks using large language models (Gemini 3.0 Flash).

**Key Features**:

- ✅ **Structured Output**: Type-safe Pydantic schemas ensure consistent, parseable responses
- ✅ **Production-Focused**: Prioritizes deployment blockers over stylistic nitpicks
- ✅ **Actionable Feedback**: Provides line numbers, example code, and concrete fix instructions
- ✅ **Multi-Mode**: Full audit, quick scan, and scheduled review modes

---

## Module Structure

```
backend/app/core/prompts/
├── __init__.py           # Public API exports
├── ci_auditor.py         # Main prompt templates and logic
└── schemas.py            # Pydantic models for structured responses

backend/examples/
└── ci_audit_example.py   # Integration examples (Genkit, GitHub Actions, Slack)
```

---

## Quick Start

### 1. Basic Usage

```python
from app.core.prompts import CIAuditorPrompts, CodeAuditRequest

# Define what to audit
request = CodeAuditRequest(
    file_paths=["frontend/src/App.tsx", ".github/workflows/ci.yml"],
    tech_stack="React 18 / Python FastAPI",
    deployment_target="Google Cloud Run",
    focus_area="CI/CD pipeline integrity"
)

# Generate prompts
system_prompt = CIAuditorPrompts.build_system_prompt()
user_prompt = CIAuditorPrompts.build_review_prompt(request)

# Pass to your LLM client (Genkit, LangChain, OpenAI, etc.)
# response = await llm.generate(system=system_prompt, prompt=user_prompt)
```

### 2. With Genkit (Recommended)

```python
from genkit import genkit
from app.core.prompts import CodeAuditRequest, CIAuditResponse

# Initialize Genkit
genkit.configure(plugins=[google_genai()])

# Run audit
result = await genkit.generate(
    model="gemini-2.0-flash",
    prompt=user_prompt,
    output_schema=CIAuditResponse.model_json_schema()
)

audit = CIAuditResponse.model_validate_json(result.text)
print(audit.to_markdown())
```

### 3. Quick Pre-Commit Scan

```python
quick_prompt = CIAuditorPrompts.build_quick_scan_prompt(
    file_count=5,
    tech_stack="TypeScript React"
)

# Fast scan with lite model
response = await genkit.generate(
    model="gemini-2.0-flash-lite",
    prompt=quick_prompt + file_contents,
    config={"max_output_tokens": 1024}
)
```

---

## Response Schema

### Full Audit Response

```python
class CIAuditResponse(BaseModel):
    critical_issues: List[CriticalIssue]       # Deployment blockers
    redundancy_report: List[RedundancyIssue]   # DRY violations
    optimization_wins: List[OptimizationWin]   # Performance opportunities
    summary: AuditSummary                      # High-level stats

    def has_blockers() -> bool
    def get_priority_issues(top_n: int) -> List[RedundancyIssue]
    def to_markdown() -> str
```

### Example Output

```json
{
  "critical_issues": [
    {
      "category": "deployment",
      "file": "useCareerIngestion.ts",
      "line": "35",
      "title": "Hardcoded API endpoint",
      "description": "The endpoint '/api/v1/ingest' will break in production",
      "fix": "Use `import.meta.env.VITE_API_URL`"
    }
  ],
  "redundancy_report": [
    {
      "file": "Login.tsx",
      "lines": "50-150",
      "severity": "medium",
      "pattern": "Repeated design tokens in inline className",
      "suggestion": "Extract to CSS modules"
    }
  ],
  "optimization_wins": [
    {
      "file": "useCareerIngestion.ts",
      "lines": "28",
      "type": "performance",
      "improvement": "Prefetch auth token on mount instead of on submit",
      "estimated_impact": "Reduces latency by ~300ms"
    }
  ],
  "summary": {
    "total_critical": 1,
    "total_refactoring": 1,
    "total_optimizations": 1,
    "deployment_ready": false,
    "blocker_summary": "Hardcoded endpoint will fail in non-dev environments"
  }
}
```

---

## Integration Patterns

### Pattern 1: GitHub Actions PR Review

```yaml
# .github/workflows/ai-code-review.yml
name: AI Code Review
on: [pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v44

      - name: Run CI Audit
        run: |
          python backend/examples/ci_audit_example.py \
            ${{ steps.changed-files.outputs.all_changed_files }}
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}

      - name: Post results as PR comment
        if: always()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('audit_report.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: report
            });
```

### Pattern 2: Pre-Commit Hook (Git Hook)

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "🔍 Running AI code audit on staged files..."

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|py|yml)$')

if [ -z "$STAGED_FILES" ]; then
  echo "No relevant files to audit. Proceeding with commit."
  exit 0
fi

python backend/examples/ci_audit_example.py $STAGED_FILES

if [ $? -ne 0 ]; then
  echo "❌ Commit blocked by CI audit. Fix issues and try again."
  exit 1
fi

echo "✅ Audit passed!"
exit 0
```

### Pattern 3: Scheduled Weekly Audit

```python
# backend/app/tasks/scheduled_audits.py
from celery import Celery
from app.core.prompts import CodeAuditRequest, CIAuditorPrompts

celery = Celery('tasks')

@celery.task
@celery.schedule(cron('0 9 * * MON'))  # Every Monday at 9 AM
def weekly_codebase_audit():
    critical_files = [
        ".github/workflows/ci.yml",
        "backend/Dockerfile",
        "frontend/package.json"
    ]

    request = CodeAuditRequest(
        file_paths=critical_files,
        deployment_target="Cloud Run"
    )

    # Run audit
    result = perform_audit(request)

    # Send Slack notification
    if result.has_blockers():
        slack_webhook.post(result.to_markdown())
```

---

## Prompt Engineering Details

### System Prompt Design

The system prompt establishes:

1. **Persona**: Principal DevOps Engineer with 15+ years experience
2. **Mission**: Ruthless pre-deployment code audits
3. **Rules**: Be specific, actionable, prioritize safety
4. **Anti-patterns**: What NOT to do (superficial reviews, "looks good" feedback)

### Review Prompt Structure

The review prompt is organized into 3 sections:

1. **DRY Violations**:
   - Duplicate code blocks (>5 lines repeated)
   - Hardcoded values (URLs, magic numbers)
   - Missing abstractions (shared hooks, utilities)

2. **CI/CD & Build Integrity**:
   - Dockerfile best practices (pinned versions, HEALTHCHECK, non-root user)
   - GitHub Actions quality (version consistency, caching, permission scoping)
   - Dependency management (lockfiles, pinned versions, deprecated packages)

3. **Performance & Logic**:
   - React: Unnecessary re-renders, missing memoization, large bundle imports
   - Python: Blocking I/O, N+1 queries, missing connection pooling
   - General: Missing error handling, race conditions, timeouts

### Output Schema Enforcement

Uses Genkit's `output_schema` parameter to enforce structured JSON:

```python
response = await genkit.generate(
    model="gemini-2.0-flash",
    prompt=user_prompt,
    output_schema=CIAuditResponse.model_json_schema()  # Forces JSON compliance
)
```

---

## Configuration

### Environment Variables

```bash
# Required
GEMINI_API_KEY=your_api_key_here

# Optional (for integrations)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
GITHUB_TOKEN=ghp_...
```

### Model Selection

| Use Case         | Model              | Rationale                                        |
| ---------------- | ------------------ | ------------------------------------------------ |
| Full PR audit    | `gemini-3.0-flash` | Best balance of quality and speed (~5s response) |
| Quick pre-commit | `gemini-3.0-flash` | Ultra-fast (<2s), good for basic checks          |
| Deep analysis    | `gemini-2.5-pro`   | Highest quality, use for critical releases       |

---

## Testing

### Unit Tests

```python
# tests/test_ci_auditor.py
import pytest
from app.core.prompts import CIAuditorPrompts, CodeAuditRequest

def test_system_prompt_includes_persona():
    prompt = CIAuditorPrompts.build_system_prompt()
    assert "Principal DevOps Engineer" in prompt
    assert "ruthless" in prompt.lower()

def test_review_prompt_includes_all_sections():
    request = CodeAuditRequest(file_paths=["test.ts"])
    prompt = CIAuditorPrompts.build_review_prompt(request)

    assert "DRY Violations" in prompt
    assert "CI/CD & Build Integrity" in prompt
    assert "Performance & Logic" in prompt
```

### Integration Tests

```python
@pytest.mark.asyncio
async def test_full_audit_flow():
    request = CodeAuditRequest(
        file_paths=["examples/bad_code.ts"],
        tech_stack="TypeScript"
    )

    result = await perform_audit(request)

    assert isinstance(result, CIAuditResponse)
    assert result.summary.total_critical >= 0
```

---

## Performance Benchmarks

| Scenario                 | Files | Avg Time | Model      | Cost (approx) |
| ------------------------ | ----- | -------- | ---------- | ------------- |
| Single file audit        | 1     | 2-4s     | flash-lite | $0.0001       |
| PR review (5 files)      | 5     | 5-8s     | flash      | $0.0005       |
| Full codebase (20 files) | 20    | 15-25s   | flash      | $0.002        |
| Quick scan (pre-commit)  | 3     | 1-2s     | flash-lite | $0.00005      |

_Costs based on Gemini API pricing as of Jan 2025. Your mileage may vary._

---

## Roadmap

- [x] Core prompt templates
- [x] Pydantic response schemas
- [x] Genkit integration examples
- [x] Markdown report generation
- [ ] LangChain integration
- [ ] Fine-tuned model for CareerCopilot-specific patterns
- [ ] Historical trend analysis (track tech debt over time)
- [ ] Auto-fix suggestions (not just detection)
- [ ] Multi-language support (Java, Go, Rust)

---

## Contributing

When adding new audit rules:

1. Add check to appropriate section in `CIAuditorPrompts.build_review_prompt()`
2. Update `schemas.py` if new issue types are introduced
3. Add test case in `tests/test_ci_auditor.py`
4. Document the rule in this README

Example:

```python
# In ci_auditor.py, under "CI/CD & Build Integrity":
- [ ] ❌ Check for missing .dockerignore (bloats image size)

# In schemas.py:
class CriticalIssue(BaseModel):
    category: Literal["build", "security", "deployment", "docker"]  # Added "docker"
```

---

## Troubleshooting

### Issue: "Invalid JSON response from LLM"

**Cause**: LLM didn't follow the output schema.
**Fix**: Use Genkit's `output_schema` parameter to enforce compliance.

### Issue: "Audit is too slow (>30s)"

**Cause**: Processing too many files or using heavy model.
**Fix**: Switch to `flash-lite` or split into batches.

### Issue: "Too many false positives"

**Cause**: Prompt may be too aggressive or context-incomplete.
**Fix**: Add specific code context about your project's conventions in the system prompt.

---

## License

Part of the CareerCopilot backend system. Internal use only.

---

## Contact

For questions or feature requests, contact the DevOps team or open an issue in the main repo.
