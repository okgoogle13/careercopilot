# AGENTS.md

Career Copilot is an AI-powered job application assistant built with React, FastAPI, Google Genkit, and Firestore. This document guides AI models and coding agents on project conventions, workflows, dependencies, code style, testing, security, and boundaries.

**Note**: This file complements README.md by providing detailed context for AI agents and coding assistants across multiple platforms (GitHub Copilot, OpenAI Codex, Claude, etc.).

## Quick Commands

### Testing & Validation

```bash
# Run all tests
cd frontend && yarn test
cd backend && pytest backend/app/tests/

# Type check
cd frontend && yarn type-check
cd backend && mypy backend/

# Format & lint
cd frontend && yarn lint:fix
cd backend && ruff check --fix backend/
```

### Backend AI Agents

```bash
# Run specific agent tests
pytest backend/app/tests/agents/test_document_generator.py -v

# Test Genkit flows locally
ENABLE_GENKIT_FLOWS=true pytest backend/app/tests/agents/ -v

# Run backend dev server
uvicorn backend.app.main:app --reload
```

### Frontend Components

```bash
# Test specific component
cd frontend && yarn test DocumentGeneration.test.tsx

# Build & preview
cd frontend && yarn build && yarn preview

# Run end-to-end tests
cd frontend && npx playwright test
```

### Deployment

```bash
# Pre-flight checks
./scripts/test-deployment.sh

# Deploy to staging (requires confirmation)
./scripts/deploy.sh staging

# Deploy to production (requires confirmation)
./scripts/deploy.sh production
```

## Project Overview

**Stack**: React 18 + TypeScript · FastAPI · Google Genkit · Firestore · GCP
**Frontend**: `frontend/` (Vite, Tailwind v4, Zustand, TanStack Query)
**Backend**: `backend/` (FastAPI, SQLAlchemy, async/await)
**Design System**: Northcote Curio (M3 variant with Australian botanical palette)
**Target Users**: Transitioning to social work, community services, government/nonprofit roles

## Key Technologies

| Layer                  | Tech                                             | Rationale                                                |
| ---------------------- | ------------------------------------------------ | -------------------------------------------------------- |
| AI Orchestration       | Google Genkit                                    | Native Gemini 1.5 integration, multi-model support       |
| LLM – High Volume      | Gemini 1.5 Flash                                 | Document generation, ATS optimization, parsing           |
| LLM – Complex Analysis | Gemini 1.5 Pro                                   | Company research, multi-step workflows, QA               |
| Document Parsing       | Langextract                                      | Structured resume/document extraction                    |
| Backend API            | FastAPI                                          | Type safety, async-first, auto OpenAPI docs              |
| Frontend               | React 18 + TS                                    | Component-driven, strict typing, Northcote design tokens |
| State Management       | Zustand                                          | Lightweight, no boilerplate                              |
| Data Fetching          | TanStack Query                                   | Server state, caching, sync                              |
| Data Persistence       | Firestore                                        | Real-time, Firebase auth integration                     |
| File Storage           | Cloud Storage                                    | Scalable uploads and generated document storage          |
| Hosting                | Cloud Run (backend), Firebase Hosting (frontend) | Serverless, auto-scaling                                 |

## Project Structure

```
backend/
├── app/
│   ├── main.py                    # FastAPI setup, middleware, routes
│   ├── api/endpoints/             # API route handlers (resumes, cover-letters, analysis, profiles)
│   ├── services/                  # Firebase SDK, authentication, document operations
│   ├── agents/                    # AI agents using Genkit flows
│   │   ├── document_generator.py  # Resume/cover letter generation
│   │   ├── ats_optimizer.py       # ATS scoring, keyword matching
│   │   ├── resume_parser.py       # Document parsing with Langextract
│   │   └── ksc_generator.py       # Key Selection Criteria for government roles
│   ├── genkit_flows/              # Genkit @define_flow definitions
│   └── tests/                     # Unit & integration tests

frontend/
├── src/
│   ├── components/                # React components (Northcote Curio compliant)
│   │   ├── DocumentGeneration/    # Resume/cover letter generation UI
│   │   ├── AtsAnalyzer/           # ATS scoring interface
│   │   ├── ProfileForm/           # User profile input
│   │   └── ui/                    # Design system components
│   ├── pages/                     # Route pages
│   ├── services/                  # API client (apiClient.ts), Firebase SDK usage
│   ├── hooks/                     # useAuth, useProfile, custom hooks
│   ├── types/                     # TypeScript interfaces & contracts
│   └── tests/                     # Jest, Playwright e2e tests

design-system/
└── tokens.json                    # Northcote Curio design tokens (colors, typography, spacing)
```

## Standards & Patterns

### Do

- ✅ Use Firebase v9 modular SDK (`import { doc } from 'firebase/firestore'`)
- ✅ Use Google Genkit for all AI workflows via `@define_flow` decorators
- ✅ Route high-volume tasks to Gemini 1.5 Flash (document generation, ATS scoring, parsing)
- ✅ Route complex reasoning to Gemini 1.5 Pro (company research, career strategy)
- ✅ Use Langextract exclusively for resume/document parsing
- ✅ Implement standardized I/O for all AI agents (see API Contracts section)
- ✅ Include confidence scores (0-1) and error details in all AI responses
- ✅ Use async/await in FastAPI endpoints and Genkit flows
- ✅ Use TypeScript strict mode (`tsconfig.json: "strict": true`)
- ✅ Apply Northcote Curio design tokens for all UI (no hardcoded colors)
- ✅ Validate all AI agent inputs before processing
- ✅ Test AI agents with sample user data before deployment
- ✅ Use environment variables for API keys, model configs, and secrets

### Don't

- ❌ Do NOT use Firebase v8 legacy SDK
- ❌ Do NOT hard-code API keys or secrets in code
- ❌ Do NOT create monolithic agents—keep to single responsibility
- ❌ Do NOT skip error handling in AI operations
- ❌ Do NOT use localStorage/sessionStorage in generated artifacts
- ❌ Do NOT bypass authentication on protected routes
- ❌ Do NOT store sensitive user data in client-side Zustand state
- ❌ Do NOT query Firestore directly from React components (use API layer only)
- ❌ Do NOT commit sensitive files (`.env.local`, API credentials)
- ❌ Do NOT use Inter, Roboto, or Arial fonts (use Fraunces, Caveat, Work Sans from Northcote)

## Git Workflow & Safety Boundaries

### ✅ Always OK (no permission needed)

- Read files, run tests, type check, lint, format
- Analyze code quality, create documentation
- Run backend/frontend dev servers locally
- Review existing agents, components, flows
- Write unit tests for components & agents
- Update non-sensitive config (e.g., model names)
- Create feature branches and commits (with clear messages)

### 🤔 Ask First

- Install new npm/pip dependencies
- Modify Firebase security rules or Firestore indexes
- Change Genkit flow structure or AI model selection
- Update environment variable requirements
- Delete user data, documents, or collections
- Modify authentication settings
- Deploy to staging or production
- Make breaking changes to API contracts

### 🚫 Never

- **Commit secrets, API keys, credentials** (CRITICAL – check `.gitignore` for `.env.local`, `credentials.json`, `.firebase-key`)
- Modify `.gitignore` to allow secret files (defeats security)
- Force-push to `main` or `develop` (destroys history and collaboration)
- Delete or reset `git history` (unrecoverable for other developers)
- Hard-code secrets in environment setup or configuration files
- Bypass authentication checks or security rules
- Access user data outside authorized endpoints (violates privacy)
- Query Firestore directly from frontend code (centralize in API layer)
- Store user passwords in plain text (always hash with bcrypt, use Firebase Auth)
- Log sensitive data (PII, API keys, auth tokens) to console or files

**Security Gotchas**:

- Pre-commit hooks verify no secrets leak; if hook fails, fix issues and recommit (never skip with `--no-verify`)
- Genkit flows inherit Firebase context; always validate user ownership of data before returning results
- Firestore security rules are the primary defense; misconfigured rules expose user data to public read

## Token Efficiency & MCP Delegation

### MCP Routing Overview (Authoritative)

Use MCP servers to keep context small, reduce latency, and avoid heavy local parsing. When in doubt, **route to the smallest capable MCP tool** rather than doing large reads or complex analysis inline.

**MCP configuration reference:** `/Users/okgoogle13/.gemini/antigravity/mcp_config.json` (current Gemini config). For Claude Desktop setup, see `CLAUDE_DESKTOP_MCP_CONFIG.md`.

**Primary MCP servers used in this repo:**
- **flash-sidekick**: fast analysis over large code/data, batching, and search grounding.
- **design-system-sidekick**: Northcote Curio design validation, token extraction, and visual compliance checks.
- **docker** (when enabled): containerized checks or reproductions that must run in Docker.
- **playwright** (when enabled): UI verification and browser-based checks.

If a task is both large and visual (e.g., "audit multiple UI screens and check token compliance"), **split**: use flash-sidekick for bulk file/context extraction and design-system-sidekick for visual validation.

### Flash Sidekick Mandatory Routing

For tasks involving bulk data, ALWAYS delegate to flash-sidekick MCP server:

| Operation           | Direct (Claude) Cost | Delegated (Flash) Cost | Savings |
| ------------------- | -------------------- | ---------------------- | ------- |
| Read 10 files       | ~50K tokens          | ~2K tokens             | 96%     |
| Grep + read matches | ~30K tokens          | ~1K tokens             | 97%     |
| Generate tests      | ~20K tokens          | ~1K tokens             | 95%     |

### Delegation Rules (Enforced)

```python
# Pseudo-code for agent behavior
if file_lines > 500:
    use flash_sidekick.quick_summarize(file)
elif files_to_analyze > 3:
    use flash_sidekick.batch_file_analysis(files)
elif task == "code_quality":
    use flash_sidekick.analyze_code_quality(code)
elif task == "git_history":
    use flash_sidekick.consult_pro(query)
```

### Design System Sidekick Routing

Use **design-system-sidekick** whenever a task requires **visual validation**, **token extraction**, or **Northcote Curio compliance**. This includes:
- Validating newly generated assets (e.g., wallpaper, motifs, specimens).
- Checking a UI screenshot for palette, density, or typographic compliance.
- Extracting or comparing design tokens from visuals.
- Suggesting prompt refinements for asset regeneration.

If the task involves **code-only styling changes** (e.g., Tailwind classes, token mapping in CSS/TS), use flash-sidekick for bulk reads and analysis, then apply changes locally.

### MCP Task Routing Matrix (Practical)

| Task type | Use MCP server | Notes |
| --- | --- | --- |
| Read many files, summarize, find patterns | flash-sidekick | Prefer batch tools; avoid large local reads. |
| Code quality scan or lint-like review | flash-sidekick | Use analyze_code_quality for findings. |
| Git history or blame analysis | flash-sidekick | Use consult_pro for compact history summaries. |
| Visual compliance or asset validation | design-system-sidekick | Use validate_asset_compliance and related tools. |
| Token extraction from imagery | design-system-sidekick | Use extract_visual_design_tokens. |
| UI regression screenshots or flows | playwright (if configured) | Use for browser-based checks only. |
| Container-only reproduction | docker (if configured) | Do not use unless explicitly needed. |

### MCP Failure Handling

If an MCP server is unavailable:
1. Note it explicitly.
2. Offer a fallback approach (local read, smaller scope, or partial summary).
3. Ask whether to proceed with reduced coverage.

### Session Budget Protocol

1. **Start of session**: Estimate task complexity
2. **At 75% budget**: Stop, summarize progress, propose continuation
3. **Never**: Push through expensive operations to "finish"

## API Contracts

### Document Generation

```python
# POST /api/resumes/tailored
Request:
{
    "user_profile": {
        "name": str,
        "email": str,
        "experience": list[dict],
        "skills": list[str]
    },
    "job_description": str,
    "optimization_level": "balanced" | "aggressive"  # ATS optimization intensity
}

Response:
{
    "success": bool,
    "content": str,  # Generated resume markdown
    "confidence_score": float,  # 0-1
    "metadata": {
        "processing_time_ms": int,
        "tokens_used": int,
        "model": "gemini-1.5-flash"
    },
    "suggestions": [str]  # Actionable improvements
}
```

### AI Analysis

```python
# POST /api/analysis/ats-score
Request: { "resume": str, "job_description": str }

Response:
{
    "success": bool,
    "score": float,  # 0-100 ATS match percentage
    "confidence_score": float,  # 0-1 confidence in score
    "missing_keywords": [str],
    "suggestions": [str],
    "metadata": { "model": "gemini-1.5-flash" }
}
```

### Resume Parsing

```python
# POST /api/documents/parse
Request: FormData with file upload

Response:
{
    "success": bool,
    "profile": {
        "name": str,
        "email": str,
        "phone": str,
        "experience": [dict],
        "skills": [str],
        "education": [dict]
    },
    "confidence_score": float,
    "metadata": { "file_name": str, "pages": int }
}
```

## Genkit Flow Patterns

All AI agents must follow this structure:

```python
from genkit import define_flow

@define_flow(name="resume_generator")
async def generate_resume(input_data: dict) -> dict:
    # 1. Validate input schema
    if not input_data.get("user_profile"):
        return {"success": False, "error": "Missing user_profile"}

    # 2. Build prompt with context
    prompt = f"""Generate a tailored resume...
    Profile: {input_data['user_profile']}
    Job: {input_data['job_description']}
    """

    # 3. Call LLM (Flash for generation, Pro for analysis)
    try:
        result = await generate(
            model="gemini-1.5-flash",
            prompt=prompt,
            config={"temperature": 0.7}
        )

        # 4. Return standardized response
        return {
            "success": True,
            "content": result.text,
            "confidence_score": 0.92,
            "suggestions": [],
            "metadata": {"model": "gemini-1.5-flash"}
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "content": None,
            "confidence_score": 0.0
        }
```

## Code Examples

### Good: Focused Agent with Error Handling

See [backend/app/agents/document_generator.py](backend/app/agents/document_generator.py) for the reference pattern. One clear responsibility, standardized I/O, proper error handling.

### Good: API Route

See [backend/app/api/endpoints/resumes.py](backend/app/api/endpoints/resumes.py). Async FastAPI endpoint calling Genkit flow, input validation, response serialization.

### Good: React Component with Northcote Tokens

See [frontend/src/components/DocumentGeneration/DocumentGeneration.tsx](frontend/src/components/DocumentGeneration/DocumentGeneration.tsx). Uses design tokens, no hardcoded colors, TypeScript strict mode, integrates TanStack Query.

### Good: useAuth Hook

See [frontend/src/hooks/useAuth.ts](frontend/src/hooks/useAuth.ts). Wraps Firebase auth, updates Zustand state, handles token refresh.

### Bad: Direct Firestore in Component

❌ Avoid fetching Firestore directly in React components. Routes allow centralized auth, error handling, logging.

### Bad: Monolithic Agent

❌ Avoid agents doing document generation + ATS analysis + parsing. Each should have one responsibility.

## Testing

### Unit Tests - Backend Agents

```python
# backend/app/tests/agents/test_document_generator.py
import pytest
from backend.app.agents.document_generator import generate_resume

@pytest.mark.asyncio
async def test_generate_resume_success():
    result = await generate_resume({
        "user_profile": {"name": "Alice", "experience": []},
        "job_description": "Software Engineer"
    })
    assert result["success"] == True
    assert len(result["content"]) > 0
    assert 0 <= result["confidence_score"] <= 1
```

### Unit Tests - React Components

```bash
cd frontend && yarn test DocumentGeneration.test.tsx --coverage
```

### E2E Tests

```bash
cd frontend && npx playwright test tests/e2e/document-workflow.spec.ts
```

### Firebase Emulator for Security Rules

```bash
firebase emulators:start
# Tests run against local emulator, no live data affected
```

## Performance Targets

- Document generation: < 30 seconds
- ATS analysis: < 10 seconds
- Resume parsing: < 15 seconds
- API response times: < 2 seconds (excluding AI processing)

Include timing in agent metadata for monitoring.

## PR Checklist

- [ ] Tests pass: `cd frontend && yarn test` and `cd backend && pytest`
- [ ] Type check passes: `yarn type-check` and `mypy backend/`
- [ ] Linting passes: `yarn lint` and `ruff check backend/`
- [ ] Code follows Northcote design system (if UI changes)
- [ ] AI agent I/O matches documented contracts
- [ ] No secrets committed (check `.gitignore`)
- [ ] Commit message format: `feat(scope): description` or `fix(scope): description`
- [ ] If Firebase changes: tested with emulator

## When Stuck

- **Ambiguous requirements**: Ask clarifying questions about user intent or technical approach
- **Complex workflows**: Propose a plan before implementation; create draft PR for early feedback
- **AI quality issues**: Add failing test reproducing the issue, then modify prompt/model to fix
- **Performance problems**: Profile with monitoring; avoid speculative optimizations
- **Firestore/auth issues**: Use emulator locally; check security rules

## Agent & Codex Compatibility

This AGENTS.md file is compatible with:

- **GitHub Copilot** – Provides context for Copilot chat and inline suggestions
- **OpenAI Codex** – Structured per Codex AGENTS.md conventions with environment setup, testing, and style guidance
- **Claude Code** – Full AI agent support with boundary specifications and workflow documentation
- **agents.md standard** – Follows the open agents.md specification for cross-platform compatibility

**For Codex users**: The document is organized for optimal parsing. Run tests with commands listed in "Quick Commands" section. Update this file if project structure or conventions change.

## Domain Knowledge: Community Services

Target users transitioning into:

- Social work roles
- Community services positions
- Government/public sector jobs
- Nonprofit organizations

Key document requirements:

- **KSC (Key Selection Criteria)** responses for government job applications
- **Mission-aligned language** for nonprofit applications
- **STAR methodology** for behavioral examples (Situation, Task, Action, Result)
- **Cultural competency & trauma-informed practice** emphasis
- Community impact and social justice alignment

## Code Style & Conventions

### Python Backend

- **Formatter**: Ruff format (configured in `pyproject.toml`)
- **Linter**: Ruff check (replace legacy Black/Flake8)
- **Type checking**: mypy strict mode
- **Docstring style**: Google-style docstrings with parameter types
- **Async/await**: Required for all I/O operations (FastAPI routes, Genkit flows)
- **Error handling**: Always return standardized `{"success": bool, "error": str}` responses

### TypeScript Frontend

- **Mode**: `tsconfig.json: "strict": true` (required, no `any` types)
- **Formatter**: Prettier (configured in `.prettierrc`)
- **Linter**: ESLint with TypeScript parser
- **Component style**: Functional components with hooks
- **Styling**: Tailwind CSS with Northcote Curio design tokens only (no hardcoded colors)
- **State management**: Zustand for global state, TanStack Query for server state
- **File naming**: PascalCase for components, camelCase for utilities

### Genkit Flows

- **Naming convention**: `@define_flow(name="snake_case_flow_name")`
- **Input validation**: Always validate input_data schema first
- **Model selection**: Default to Gemini 1.5 Flash; escalate to Pro for complex reasoning
- **Temperature config**: `{"temperature": 0.7}` for generation, `0.3` for analysis
- **Response format**: Always return standardized response with `success`, `content`, `confidence_score`, `metadata`

### Firebase & Security

- **SDK version**: Firebase v9 modular SDK only (no legacy SDK)
- **Auth**: Always check `request.auth != null` before user operations
- **Firestore queries**: Never expose raw queries from frontend (use API layer)
- **Secrets**: Store in Google Cloud Secret Manager or `.env.local` (never commit)

### Commit Messages

Format: `<type>(<scope>): <description>`

Examples:

- `feat(agents): Add KSC generator flow for government applications`
- `fix(frontend): Correct ATS score calculation in analysis component`
- `refactor(backend): Simplify resume parsing with Langextract`
- `test(agents): Add integration tests for cover letter generation`
- `docs(agents): Update API contract for document parsing endpoint`

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`

## Development Workflow

### Local Setup

```bash
# Install all dependencies
./scripts/setup-everything.sh

# Activate Python environment
source venv/bin/activate

# Set up local secrets
./setup-api-keys.sh

# Start frontend dev server (port 5173)
cd frontend && yarn dev

# Start backend dev server (port 8000)
uvicorn backend.app.main:app --reload
```

### Incremental Development

```bash
# Run specific agent tests while developing
pytest backend/app/tests/agents/test_document_generator.py -v --tb=short

# Type check just your changes
yarn type-check

# Lint and fix only modified files
yarn lint:fix
```

### Before Submitting PR

```bash
# Full validation
./scripts/test-deployment.sh

# Ensure all tests pass
cd frontend && yarn test && cd ../backend && pytest

# Check no secrets are committed
git diff HEAD --name-only | xargs git check-attr filter
```

## Firestore & Cloud Storage

### Collection Structure

- `/users/{uid}/profiles/{profileId}` — User profiles (skills, experience)
- `/users/{uid}/documents/{docId}` — Generated resumes, cover letters
- `/users/{uid}/jobs/{jobId}` — Saved job opportunities
- `/templates/` — Document templates (global, admin-writable)

### Cloud Storage Paths

- `/users/{uid}/uploads/` — User-uploaded documents
- `/users/{uid}/generated/` — AI-generated documents
- `/templates/` — Template assets and previews

### Security Rules

- All user data requires authentication (`request.auth != null`)
- Users can only access their own data (`request.auth.uid == resource.data.userId`)
- Templates are publicly readable, admin-writable only

## Genkit Model Selection

| Model            | Use Case                                     | Speed  | Cost | Quality   |
| ---------------- | -------------------------------------------- | ------ | ---- | --------- |
| Gemini 1.5 Flash | Document generation, ATS, keyword extraction | < 5s   | Low  | Good      |
| Gemini 1.5 Pro   | Company research, strategy, QA               | 10-20s | High | Excellent |

**Rule of thumb**: Default to Flash. Escalate to Pro only for complex reasoning or multi-step workflows.

## Environment Variables (Development)

```bash
# .env.local (never committed)
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_PROJECT_ID=careercopilot-468811
FIREBASE_EMULATOR_HOST=localhost:8080

ENABLE_GENKIT_FLOWS=true
ENABLE_NLP_PRELOAD=true

GEMINI_API_KEY=<your-key>
LANGEXTRACT_API_KEY=<your-key>
```

## Deployment

### Staging

```bash
./scripts/deploy.sh staging
# https://careercopilot-staging.web.app
```

### Production

```bash
./scripts/deploy.sh production
# https://careercopilot-468811.web.app
# (Requires confirmation prompt)
```

Pre-flight checks ensure no secrets leak, tests pass, and builds succeed.
