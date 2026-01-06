# backend/app/core/prompts/ci_auditor.py

from typing import List, Optional
from pydantic import BaseModel, Field

class CodeAuditRequest(BaseModel):
    """Structure for passing context to the AI Auditor."""
    file_paths: List[str] = Field(
        description="List of file paths to audit (relative or absolute)"
    )
    tech_stack: str = Field(
        default="React 18 / Python FastAPI",
        description="Primary technology stack of the application"
    )
    deployment_target: str = Field(
        default="Google Cloud Run",
        description="Target deployment platform (e.g., Cloud Run, Vercel, AWS Lambda)"
    )
    focus_area: Optional[str] = Field(
        default=None,
        description="Specific audit focus (e.g., 'security', 'performance', 'DRY violations')"
    )
    
class CIAuditorPrompts:
    """
    Centralized prompt logic for Pre-Deployment Code Reviews.
    Used by ApplicationAgent to critique user portfolios or internal PRs.
    
    Design Philosophy:
    - Production-oriented: Prioritize stability over innovation
    - Actionable: Provide specific line numbers and refactoring steps
    - Ruthless: Flag even minor technical debt that could compound
    """

    @staticmethod
    def build_system_prompt() -> str:
        """
        Returns the foundational system-level instructions for the auditor agent.
        This sets the persona and quality bar for all audits.
        """
        return (
            "You are a Principal DevOps Engineer and Lead Solutions Architect with 15+ years "
            "of experience in production systems at scale. Your code reviews are legendary for "
            "catching subtle bugs before they reach production.\n\n"
            
            "**Mission**: Perform ruthless pre-flight code audits focused on deployment readiness, "
            "production stability, security, and long-term maintainability.\n\n"
            
            "**Rules**:\n"
            "1. Be specific: Provide exact line numbers, file paths, and code examples\n"
            "2. Be actionable: Offer concrete refactoring suggestions, not generic advice\n"
            "3. Prioritize safety: Any issue that could break production is CRITICAL\n"
            "4. Think compounding debt: Flag patterns that will multiply as the codebase grows\n"
            "5. Challenge assumptions: Question hardcoded values, missing error handling, and implicit dependencies\n\n"
            
            "**What NOT to do**:\n"
            "- Do NOT provide superficial 'looks good' assessments\n"
            "- Do NOT ignore issues because 'it currently works'\n"
            "- Do NOT skip security issues, even if they seem unlikely to be exploited\n"
            "- Do NOT accept 'we'll fix it later' technical debt without flagging it\n\n"
            
            "Your output should be structured JSON that categorizes findings by severity."
        )

    @staticmethod
    def build_review_prompt(context: CodeAuditRequest) -> str:
        """
        Generates the main audit prompt with contextual parameters.
        
        Args:
            context: CodeAuditRequest with file paths and deployment context
            
        Returns:
            Formatted prompt string ready for LLM consumption
        """
        focus_area = context.focus_area if context.focus_area else "General Production Readiness"
        
        return f"""
# DEPLOYMENT READINESS REVIEW

## Context Parameters
- **Tech Stack**: {context.tech_stack}
- **Deployment Target**: {context.deployment_target}
- **Files Under Review**: {', '.join(context.file_paths)}
- **Primary Focus**: {focus_area}

---

## Analysis Objectives

### 1️⃣ **DRY (Don't Repeat Yourself) Violations**
**Goal**: Identify repeated logic blocks, hardcoded configuration, and abstraction opportunities.

**Specific checks**:
- [ ] Scan for duplicate code blocks (>5 lines repeated 2+ times)
- [ ] Identify hardcoded URLs, API endpoints, or environment-specific values not in env vars
- [ ] Flag magic numbers/strings without constants/enums
- [ ] Detect repeated CSS/styling that should be design tokens or utility classes
- [ ] Find component patterns that should be extracted into shared hooks or utilities

**Output format**: For each violation, provide:
- `file`: Filename
- `lines`: Line range (e.g., "45-67")
- `severity`: "low" | "medium" | "high"
- `pattern`: What's being repeated
- `suggestion`: Concrete refactoring approach with example code

---

### 2️⃣ **CI/CD & Build Integrity**
**Goal**: Validate build reproducibility, deployment safety, and infrastructure-as-code quality.

**Dockerfile-specific checks**:
- [ ] ❌ Verify base images use pinned versions (not `:latest` tags)
- [ ] ❌ Check for non-root user execution (security best practice)
- [ ] ❌ Validate multi-stage builds separate dev/test/prod dependencies
- [ ] ❌ Ensure `HEALTHCHECK` directives exist for production containers
- [ ] ❌ Look for missing `.dockerignore` patterns that bloat image size
- [ ] ❌ Detect hardcoded secrets or credentials in ENV/ARG directives

**GitHub Actions YAML checks**:
- [ ] ❌ Verify Node/Python/Docker versions match across all jobs and Dockerfiles
- [ ] ❌ Flag missing caching strategies (npm/pip/Docker layer caches)
- [ ] ❌ Detect dangerous patterns: `|| true`, `continue-on-error: true` without justification
- [ ] ❌ Check for overly broad permissions (`write-all`, `contents: write` when read-only suffices)
- [ ] ❌ Validate secret references use GitHub Secrets, not env vars
- [ ] ❌ Ensure workflows have concurrency controls and timeouts

**package.json / pyproject.toml checks**:
- [ ] ❌ Verify dependency versions are pinned or use lockfiles
- [ ] ❌ Check for deprecated packages or EOL versions (e.g., Node < 18)
- [ ] ❌ Detect missing `engines` field specifying Node/npm versions
- [ ] ❌ Flag scripts with `--force` or `--ignore-scripts` that bypass safety checks

**Output format**: For each risk, provide:
- `category`: "dockerfile" | "workflow" | "dependencies" | "security"
- `file`: Filename
- `issue`: Description of the problem
- `impact`: What breaks if this isn't fixed (build failure, security vulnerability, etc.)
- `fix`: Exact code change or configuration update needed

---

### 3️⃣ **Logic & Performance**
**Goal**: Identify synchronous blocking, inefficient algorithms, and potential race conditions.

**React/Frontend checks**:
- [ ] ⚡ Detect unnecessary re-renders (missing `useMemo`/`useCallback` on expensive computations)
- [ ] ⚡ Flag inline function definitions in JSX (creates new reference every render)
- [ ] ⚡ Identify large bundle imports (should use tree-shaking or dynamic imports)
- [ ] ⚡ Check for missing lazy loading on routes or large components
- [ ] ⚡ Validate async operations use proper loading/error states

**Python/Backend checks**:
- [ ] ⚡ Detect blocking I/O in async functions (should use `asyncio` equivalents)
- [ ] ⚡ Flag N+1 query patterns in database access
- [ ] ⚡ Identify missing connection pooling or database indexes
- [ ] ⚡ Check for synchronous external API calls without timeouts
- [ ] ⚡ Validate proper exception handling (no bare `except:` clauses)

**Output format**: For each issue, provide:
- `file`: Filename
- `lines`: Line range
- `type`: "blocking_io" | "n_plus_one_query" | "unnecessary_render" | "missing_timeout"
- `current_code`: Snippet of problematic code
- `optimized_code`: Improved implementation
- `performance_gain`: Estimated improvement (e.g., "50% faster", "reduces API calls by 10x")

---

## 🎯 Output Schema

Return a **valid JSON object** with the following structure:

```json
{{
  "critical_issues": [
    {{
      "category": "build" | "security" | "deployment",
      "file": "path/to/file.ext",
      "line": "10-15",
      "title": "Short title of the issue",
      "description": "Detailed explanation of why this is critical",
      "fix": "Specific code change or action required"
    }}
  ],
  "redundancy_report": [
    {{
      "file": "path/to/file.ext",
      "lines": "20-35",
      "severity": "low" | "medium" | "high",
      "pattern": "What's being repeated",
      "suggestion": "Concrete refactoring approach",
      "example_code": "Optional code snippet showing the fix"
    }}
  ],
  "optimization_wins": [
    {{
      "file": "path/to/file.ext",
      "lines": "40-50",
      "type": "performance" | "bundle_size" | "caching",
      "current_behavior": "Description of current inefficiency",
      "improvement": "What changes and why it's faster",
      "estimated_impact": "Quantified benefit (e.g., '2x faster', '-30% bundle size')"
    }}
  ],
  "summary": {{
    "total_critical": 0,
    "total_refactoring": 0,
    "total_optimizations": 0,
    "deployment_ready": true | false,
    "blocker_summary": "One-line explanation if not deployment-ready"
  }}
}}
```

---

## 📚 Example Analysis

**Input**: `useCareerIngestion.ts`

**Output**:
```json
{{
  "critical_issues": [
    {{
      "category": "deployment",
      "file": "useCareerIngestion.ts",
      "line": "35",
      "title": "Hardcoded API endpoint",
      "description": "The endpoint '/api/v1/ingest' is hardcoded, which will break when deploying to different environments (staging/production) with different API URLs.",
      "fix": "Use environment variable: `const API_URL = import.meta.env.VITE_API_URL || '/api/v1'; fetch(`${{API_URL}}/ingest`, ...)`"
    }}
  ],
  "redundancy_report": [],
  "optimization_wins": [
    {{
      "file": "useCareerIngestion.ts",
      "lines": "28",
      "type": "performance",
      "current_behavior": "Auth token is fetched synchronously on every form submission, adding 200-500ms latency",
      "improvement": "Prefetch token on component mount and cache it in state. Only refetch if expired.",
      "estimated_impact": "Reduces submission latency by ~300ms (2x faster perceived performance)"
    }}
  ],
  "summary": {{
    "total_critical": 1,
    "total_refactoring": 0,
    "total_optimizations": 1,
    "deployment_ready": false,
    "blocker_summary": "Hardcoded API endpoint will fail in non-local environments"
  }}
}}
```

---

Now **perform the audit** on the provided files and return structured JSON following the schema above.
"""

    @staticmethod
    def build_quick_scan_prompt(file_count: int, tech_stack: str) -> str:
        """
        Generates a lighter-weight prompt for quick triage scans.
        Useful for pre-commit hooks or CI gate checks that need <30s execution.
        
        Args:
            file_count: Number of files being scanned
            tech_stack: Primary technology (React, Python, etc.)
            
        Returns:
            Streamlined prompt focusing on critical blockers only
        """
        return f"""
# QUICK TRIAGE SCAN ({file_count} files - {tech_stack})

**Objective**: Identify CRITICAL BLOCKERS ONLY. Skip optimizations and minor refactoring.

**Focus Areas**:
1. ❌ **Build-Breaking Issues**: Version mismatches, missing dependencies, malformed config
2. ⛔ **Security Vulnerabilities**: Exposed secrets, SQL injection vectors, XXE attacks
3. 🔥 **Production Killers**: Race conditions, unhandled promise rejections, missing error boundaries

**Output**: JSON array of critical issues only:
```json
[
  {{
    "file": "path/to/file",
    "line": "42",
    "severity": "BLOCKER",
    "issue": "One-sentence description",
    "fix": "One-sentence fix"
  }}
]
```

**Time limit**: 30 seconds. If you find >3 blockers, stop and return those.
"""

# ------------------------------------------------------------------------------
# Usage Example for ApplicationAgent / Jules Integration:
# ------------------------------------------------------------------------------
"""
from app.core.prompts.ci_auditor import CIAuditorPrompts, CodeAuditRequest

# Example 1: Full audit for PR review
request = CodeAuditRequest(
    file_paths=[
        "frontend/src/App.tsx",
        ".github/workflows/deploy.yml",
        "backend/Dockerfile"
    ],
    tech_stack="React 18 / Python FastAPI",
    deployment_target="Google Cloud Run",
    focus_area="CI/CD pipeline integrity"
)

system_prompt = CIAuditorPrompts.build_system_prompt()
user_prompt = CIAuditorPrompts.build_review_prompt(request)

# Pass to Genkit or LangChain:
# response = await genkit_model.generate(
#     model="gemini-2.0-flash",
#     context=[{"role": "system", "content": system_prompt}],
#     prompt=user_prompt,
#     output_schema=CIAuditResponse  # Define in separate schema file
# )

# Example 2: Quick pre-commit scan
quick_prompt = CIAuditorPrompts.build_quick_scan_prompt(
    file_count=5,
    tech_stack="TypeScript React"
)
# response = await genkit_model.generate(prompt=quick_prompt, max_tokens=500)
"""
