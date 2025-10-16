# AGENTS.md

### Do

- use Firebase v9 modular SDK format
- use Google Genkit for all AI workflows and flows
- use Gemini 1.5 Flash for high-volume tasks, Gemini 1.5 Pro for complex analysis
- use Langextract for document parsing and text extraction
- use Firestore for data persistence, Cloud Storage for file storage
- use FastAPI for backend with async/await patterns
- use React with TypeScript for frontend
- use standardized input/output formats for all AI agents
- default to small, focused AI agents with single responsibilities
- include confidence scores and error handling in all AI responses
- use proper Firebase security rules and authentication
- use environment variables for API keys and sensitive config

### Don't

- do not use localStorage or sessionStorage in artifacts (not supported)
- do not hard-code API keys or sensitive data
- do not create monolithic AI agents - keep them focused
- do not skip error handling on AI operations
- do not use Firebase v8 legacy SDK
- do not bypass authentication on protected routes
- do not store sensitive user data in client-side state
- do not use direct Firestore access from frontend (API-only)

### Commands

# Type check specific files

npx tsc --noEmit src/backend/agents/document_generator.py
npx tsc --noEmit src/components/DocumentGeneration/TemplateSelector.tsx

# Format specific files

npx prettier --write src/backend/agents/_.py
npx prettier --write src/components/\*\*/_.tsx

# Lint specific files

npx eslint --fix src/components/\*_/_.tsx
npx ruff check src/backend/agents/\*.py

# Test specific agents

pytest tests/agents/test_document_generator.py
npm test src/components/DocumentGeneration/TemplateSelector.test.tsx

# Firebase deployment

firebase deploy --only functions:generateTailoredResume
firebase deploy --only hosting

Note: Always test AI agents before deployment. Use single-file commands for faster iteration.

### Safety and permissions

Allowed without prompt:

- read files, list Firebase collections
- type check, format, lint individual files
- run unit tests for specific components/agents
- deploy individual Firebase functions
- analyze documents with Langextract
- generate documents with existing profiles

Ask first:

- npm install new dependencies
- modify Firebase security rules
- delete user data or documents
- modify Firestore indexes
- deploy entire Firebase project
- change AI model configurations
- modify authentication settings

### Project structure

Backend:

- see `src/backend/main.py` for FastAPI setup and routes
- see `src/backend/agents/` for all AI agents and Genkit flows
- see `src/backend/services/` for Firebase integrations
- see `firebase.json` for Firebase configuration

Frontend:

- see `src/App.tsx` for React app structure and routing
- see `src/components/` for all React components
- see `src/services/` for API clients and Firebase SDK usage
- see `src/types/` for TypeScript interfaces

AI Agents:

- see `src/backend/agents/document_generator.py` for resume/cover letter generation
- see `src/backend/agents/ats_optimizer.py` for ATS scoring and optimization
- see `src/backend/agents/resume_parser.py` for document parsing with Langextract

### Good and bad examples

Good patterns:

- copy `src/backend/agents/document_generator.py` for new AI agents
- copy `src/components/DocumentGeneration/TemplateSelector.tsx` for complex UI components
- forms: follow `src/components/ProfileForm.tsx` pattern
- API calls: use `src/services/apiClient.ts` - do not fetch directly in components
- Firebase auth: use `src/hooks/useAuth.ts` hook pattern

Bad patterns:

- avoid `src/legacy/` components - these use outdated patterns
- avoid direct Firestore queries in React components
- avoid synchronous operations in AI agents - use async/await

### API patterns

Document Generation:

- generate resume: `POST /api/resumes/tailored` using profile + job description
- generate cover letter: `POST /api/cover-letters/generate` with company research
- parse uploaded resume: `POST /api/documents/parse` with file upload

AI Analysis:

- ATS scoring: `POST /api/analysis/ats-score` with resume + job description
- keyword analysis: `POST /api/analysis/keywords` for gap identification
- get recommendations: `GET /api/analysis/recommendations` for improvements

User Profile:

- create profile: `POST /api/profiles` with structured user data
- update profile: `PUT /api/profiles/{id}` for profile modifications
- list profiles: `GET /api/profiles` for user's profile variations

### AI agent conventions

Input format for all agents:

```python
{
    "user_profile": dict,     # Always include full user context
    "job_description": str,   # When relevant to job applications
    "document_type": str,     # For generation agents
    "optimization_level": str # For analysis agents
}
```

Output format for all agents:

```python
{
    "success": bool,
    "content": str | dict,           # Generated content or analysis
    "confidence_score": float,       # 0-1 confidence in result
    "suggestions": list,             # Actionable recommendations
    "metadata": dict,                # Processing details
    "error": str                     # If success is false
}
```

### Firebase specific guidance

Firestore collections:

- `/users/{uid}/profiles/{profileId}` for user profiles
- `/users/{uid}/documents/{docId}` for generated documents
- `/users/{uid}/jobs/{jobId}` for job opportunities
- `/templates/` for document templates (global)

Cloud Storage structure:

- `/users/{uid}/uploads/` for user-uploaded documents
- `/users/{uid}/generated/` for AI-generated documents
- `/templates/` for template assets and previews

Security rules:

- all user data requires authentication
- users can only access their own data
- templates are publicly readable but admin-writable

### Genkit flow patterns

Standard flow structure:

```python
@define_flow(name="agent_name")
async def agent_flow(input_data: dict) -> dict:
    # 1. Validate input
    # 2. Process with AI model
    # 3. Format output
    # 4. Return standardized response
```

Error handling:

```python
try:
    result = await generate(model=gemini15Flash, prompt=prompt)
    return {"success": True, "content": result.text}
except Exception as e:
    return {"success": False, "error": str(e)}
```

### PR checklist

- format and type check: all files green
- unit tests: green for modified agents/components
- AI agent tests: validate input/output formats
- Firebase security rules: tested with emulator
- environment variables: properly configured
- diff: small and focused with clear commit message format `feat(scope): description`

### When stuck

- ask clarifying questions about user requirements or technical approach
- propose a plan for complex AI workflows before implementing
- create draft PR with implementation notes for review
- do not make large speculative changes to AI models or Firebase structure

### Test-first mode for AI agents

When adding new AI agents:

- write test cases with sample inputs/outputs first
- implement agent to pass tests
- validate with real user data before deployment

When fixing AI output quality:

- add failing test that reproduces the issue
- modify prompt or model configuration to fix
- ensure all existing tests still pass

### Document processing guidelines

Resume parsing with Langextract:

- always validate extracted data before saving to profile
- handle parsing failures gracefully with partial data
- preserve original document metadata for reference

Document generation:

- use consistent template structure across all document types
- include ATS optimization in all generated documents
- maintain user's authentic voice through voice profiling

### Community services domain knowledge

Target users are transitioning into:

- social work roles
- community services positions
- government/public sector jobs
- nonprofit organizations

Key document requirements:

- Key Selection Criteria (KSC) responses for government jobs
- mission-aligned language for nonprofit applications
- STAR methodology for behavioral examples
- cultural competency and trauma-informed practice emphasis

### AI model usage patterns

Use Gemini 1.5 Flash for:

- document generation (resumes, cover letters)
- ATS optimization and scoring
- keyword extraction and matching
- quick analysis tasks

Use Gemini 1.5 Pro for:

- complex reasoning (company research synthesis)
- strategic analysis (career transition planning)
- quality assurance of generated content
- multi-step workflow orchestration

### Performance targets

AI agent response times:

- document generation: < 30 seconds
- ATS analysis: < 10 seconds
- resume parsing: < 15 seconds
- recommendations: < 5 seconds

Always include performance monitoring in agent implementations.
