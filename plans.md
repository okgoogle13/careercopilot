# PLANS.md

Career Copilot architectural planning guide for AI agents and developers. This document captures design decisions, system architecture, and long-term roadmap to help agents understand project direction and make informed implementation choices.

**Complements**: `agents.md` (conventions & boundaries), `README.md` (user-facing overview), `CLAUDE.md` (Claude-specific instructions)

---

## Architecture Overview

### System Layers

```
┌─────────────────────────────────────────────────────────────────┐
│ Frontend Layer (React 18 + TypeScript + Northcote Curio)        │
│ ├─ Components: DocumentGeneration, AtsAnalyzer, ProfileForm    │
│ ├─ State: Zustand (global) + TanStack Query (server)           │
│ └─ Styling: Tailwind v4 + design tokens                        │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTP/JSON (port 5173)
┌────────────────────▼────────────────────────────────────────────┐
│ API Layer (FastAPI + async/await)                               │
│ ├─ /api/resumes/* → Genkit Document Generator                  │
│ ├─ /api/analysis/* → Genkit ATS Optimizer                      │
│ ├─ /api/documents/parse → Resume Parser (Langextract)          │
│ └─ /api/profiles/* → User Profile Management                   │
└────────────────────┬────────────────────────────────────────────┘
                     │ async context + Firebase auth
┌────────────────────▼────────────────────────────────────────────┐
│ AI & Business Logic (Genkit Flows)                              │
│ ├─ document_generator.py (Gemini 1.5 Flash)                    │
│ ├─ ats_optimizer.py (Gemini 1.5 Flash)                         │
│ ├─ resume_parser.py (Langextract + validation)                 │
│ └─ ksc_generator.py (Gemini 1.5 Pro for complex reasoning)     │
└────────────────────┬────────────────────────────────────────────┘
                     │ async I/O + cached contexts
┌────────────────────▼────────────────────────────────────────────┐
│ Data Layer                                                       │
│ ├─ Firestore (user profiles, documents, jobs)                  │
│ ├─ Cloud Storage (resume uploads, generated PDFs)              │
│ └─ Firebase Auth (user authentication & session)               │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Decisions & Rationale

| Component | Choice | Why | Alternative Considered |
|-----------|--------|-----|------------------------|
| **Frontend Framework** | React 18 | Large ecosystem, component reusability, TypeScript support | Vue, Svelte |
| **Build Tool** | Vite | Lightning-fast HMR, ES6 modules, minimal config | Webpack, Turbopack |
| **State Management** | Zustand | Minimal boilerplate, no prop drilling, easy testing | Redux, Recoil, Jotai |
| **Server State** | TanStack Query | Built-in caching, sync, background refetch | Redux, custom hooks |
| **Backend API** | FastAPI | Type-safe (Pydantic), auto OpenAPI docs, async-first | Django, Flask |
| **AI Orchestration** | Google Genkit | Multi-model support, streaming, structured output | LangChain, direct API |
| **LLM (High Volume)** | Gemini 1.5 Flash | 50x cheaper than Pro, < 5s latency, sufficient quality | GPT-4o, Claude 3.5 |
| **LLM (Complex)** | Gemini 1.5 Pro | Advanced reasoning, multi-step workflows, QA | GPT-4 Turbo, Claude Opus |
| **Document Parsing** | Langextract | Structured extraction, resume-specific patterns | PyPDF2, pdfplumber |
| **Data Persistence** | Firestore | Real-time updates, Firebase auth integration, scalability | PostgreSQL, MongoDB |
| **File Storage** | Cloud Storage | Native Firebase integration, resume versioning | S3, local filesystem |
| **Hosting** | Cloud Run + Firebase | Managed, serverless, automatic scaling, cost-effective | EC2, Heroku, Railway |
| **Design System** | Northcote Curio | Distinctive, botanical aesthetic, M3 compliant | Material Design, Shadcn |

---

## Core Data Models

### User Profile
```typescript
interface UserProfile {
  id: string;              // Firestore document ID
  uid: string;             // Firebase auth UID
  name: string;
  email: string;
  phone?: string;
  summary?: string;        // Professional summary
  experience: Experience[];
  skills: string[];
  education: Education[];
  certifications?: Certification[];
  voiceProfile?: {         // Derived from documents
    tone: string;          // "formal" | "conversational" | "technical"
    keyStrengths: string[];
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Generated Document
```typescript
interface GeneratedDocument {
  id: string;
  uid: string;
  profileId: string;
  jobId?: string;          // If for specific job
  type: "resume" | "cover_letter" | "ksc";
  content: string;         // Markdown or plain text
  metadata: {
    generatedAt: Timestamp;
    model: "gemini-1.5-flash" | "gemini-1.5-pro";
    processingTimeMs: number;
    tokensUsed: number;
    confidenceScore: number; // 0-1
  };
  atsScore?: {
    score: number;         // 0-100
    missingKeywords: string[];
    suggestions: string[];
  };
  storagePath: string;     // Cloud Storage path to PDF
}
```

### Job Opportunity
```typescript
interface JobOpportunity {
  id: string;
  uid: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  salary?: string;
  url?: string;
  savedAt: Timestamp;
  notes?: string;
  applicationsSubmitted: {
    resumeId: string;
    coverId?: string;
    submittedAt: Timestamp;
  }[];
}
```

---

## API Design Principles

### Request/Response Patterns

**All requests** include:
- `Content-Type: application/json` (or `multipart/form-data` for file uploads)
- `Authorization: Bearer <firebase-token>` (validated server-side)

**All responses** follow:
```json
{
  "success": boolean,
  "data": { /* operation result */ },
  "error": null | { "code": string, "message": string },
  "meta": {
    "timestamp": ISO-8601,
    "requestId": string
  }
}
```

**Error codes**:
- `400` – Validation error (missing fields, invalid type)
- `401` – Unauthenticated (expired token, missing auth)
- `403` – Unauthorized (accessing other user's data)
- `409` – Conflict (duplicate resource, constraint violation)
- `429` – Rate limited (too many AI requests)
- `500` – Server error (log requestId for debugging)

### Pagination

Large lists use cursor-based pagination:
```bash
GET /api/documents?limit=20&after=<cursor>

Response:
{
  "success": true,
  "data": {
    "items": [...],
    "nextCursor": "abc123" | null,
    "hasMore": boolean
  }
}
```

---

## AI Agent Design Patterns

### Genkit Flow Template

All flows follow this structure for consistency:

```python
from genkit import define_flow
from genkit.tools import tool
from backend.app.services.firebase_service import validate_user_data

@define_flow(name="document_generator")
async def generate_document(input_data: dict) -> dict:
    """
    Generate tailored resume with Gemini 1.5 Flash.

    Args:
        input_data: {
            "user_profile": {...},
            "job_description": str,
            "optimization_level": "balanced" | "aggressive"
        }

    Returns:
        {
            "success": bool,
            "content": str,
            "confidence_score": float,
            "suggestions": [str],
            "metadata": {...}
        }
    """

    # 1. VALIDATE
    errors = validate_user_data(input_data)
    if errors:
        return {
            "success": False,
            "error": f"Validation failed: {errors}",
            "confidence_score": 0.0
        }

    # 2. PREPARE
    profile = input_data["user_profile"]
    job_desc = input_data["job_description"]
    opt_level = input_data.get("optimization_level", "balanced")

    # 3. BUILD PROMPT
    prompt = f"""You are a professional resume writer for social work and community services roles.

    User Profile:
    {format_profile(profile)}

    Target Job:
    {job_desc}

    Optimization Level: {opt_level}
    - balanced: Natural, professional tone with ATS keywords
    - aggressive: Maximum ATS score, keyword-heavy

    Generate a tailored resume in Markdown format.
    Focus on: impact, mission alignment, STAR methodology examples.
    """

    # 4. GENERATE
    try:
        from genkit import generate

        result = await generate(
            model="gemini-1.5-flash",
            prompt=prompt,
            config={
                "temperature": 0.7,
                "maxOutputTokens": 2048
            }
        )

        content = result.text

        # 5. POST-PROCESS
        content = sanitize_markdown(content)
        confidence = calculate_confidence(profile, job_desc)

        return {
            "success": True,
            "content": content,
            "confidence_score": confidence,
            "suggestions": [
                "Add 2-3 quantifiable impact metrics",
                "Include specific community served",
                "Highlight trauma-informed practice examples"
            ],
            "metadata": {
                "model": "gemini-1.5-flash",
                "tokensUsed": result.usage.output_tokens,
                "processingTimeMs": result.processingTime
            }
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "confidence_score": 0.0,
            "content": None
        }
```

### Model Selection Strategy

**Use Gemini 1.5 Flash (default)**:
- Document generation (resume, cover letter)
- ATS optimization and scoring
- Keyword extraction
- Quick transformations
- Parsing with Langextract

**Escalate to Gemini 1.5 Pro** when:
- Multi-step reasoning (company research → tailored strategy)
- Complex analysis (comparing 5+ job requirements)
- Quality assurance of Flash output
- Non-routine business logic
- User explicitly requests "premium" analysis

**Decision logic**:
```python
def choose_model(task_type: str, complexity: str) -> str:
    if task_type in ["generation", "parsing", "ats"]:
        return "gemini-1.5-flash"
    if complexity == "high" or task_type == "research":
        return "gemini-1.5-pro"
    return "gemini-1.5-flash"  # default
```

---

## Performance & Scalability

### Target Response Times

| Operation | Target | Achieved | Strategy |
|-----------|--------|----------|----------|
| Resume generation | < 30s | ~15-20s | Stream + cache templates |
| ATS analysis | < 10s | ~5-8s | Incremental scoring |
| Document parsing | < 15s | ~8-12s | Parallel processing |
| Profile CRUD | < 2s | ~500ms | Firestore indexes |
| API response | < 500ms | ~200ms | Response compression |

### Caching Strategy

**Client-side (TanStack Query)**:
- Cache generated documents for 1 hour
- Revalidate on user profile update
- Stale-while-revalidate for ATS scores

**Server-side (Genkit)**:
- Cache resume templates (global, 7 days)
- Cache user voice profile (per user, 30 days)
- No caching for AI generation (freshness > speed)

**Database**:
- Firestore indexes on `uid`, `createdAt`, `type`
- Composite index for `uid + createdAt` queries
- No full-text search (Cloud Search planned Q2 2026)

---

## Security Architecture

### Authentication Flow

```
1. User logs in via Firebase UI
   ↓
2. Frontend stores ID token (HttpOnly cookie preferred)
   ↓
3. Every API request includes Authorization header
   ↓
4. FastAPI middleware validates token with Firebase SDK
   ↓
5. Extract uid, verify user owns resource
   ↓
6. Execute endpoint (user context available in request)
```

### Authorization Rules

**Firestore Security Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User can read/write own profile
    match /users/{uid}/profiles/{profileId} {
      allow read, write: if request.auth.uid == uid;
    }

    // User can read/write own documents
    match /users/{uid}/documents/{docId} {
      allow read, write: if request.auth.uid == uid;
    }

    // Templates are public read, admin write
    match /templates/{template} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

### Data Privacy

- No PII in logs (email, phone, name)
- Encrypt sensitive fields at rest (plan: Q1 2026)
- User data deleted on account deletion
- GDPR export available (plan: Q1 2026)
- No third-party data sharing

---

## Roadmap & Future Enhancements

### Q1 2026
- [ ] Encryption at rest (Firestore field-level encryption)
- [ ] GDPR data export endpoint
- [ ] Cover letter generation with company research (Pro model)
- [ ] KSC (Key Selection Criteria) generator for government roles
- [ ] Resume versioning (track edits over time)

### Q2 2026
- [ ] Full-text search (Cloud Search integration)
- [ ] Job matching algorithm (vector similarity)
- [ ] Interview prep module (mock Q&A)
- [ ] Salary negotiation guide
- [ ] Portfolio integration

### Q3 2026
- [ ] Mobile app (React Native)
- [ ] LinkedIn profile sync (import/export)
- [ ] Real-time collaboration (multiple profiles)
- [ ] Browser extension for job posting analysis
- [ ] Email notifications for job matches

### Future (Q4 2026+)
- Multi-language support (Spanish, French, Chinese)
- Voice resume (audio upload + transcription)
- Video interview coaching
- Accessibility audit integration
- Enterprise team accounts

---

## Development Philosophy

### Principles

1. **Ship incrementally** – Small PRs, frequent deploys, early user feedback
2. **Bias toward Flash** – Default to cheaper, faster model; escalate only when needed
3. **User data first** – Privacy by design, minimal collection, explicit consent
4. **Northcote identity** – Distinctive design, not generic Bootstrap/Material
5. **Test everything** – Unit tests, integration tests, e2e tests before merge
6. **Document decisions** – Why, not just what; update this file as you learn

### Definition of Done

A feature is "done" when:
- [ ] Code written and peer-reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] E2E tests passing (if user-facing)
- [ ] Type checking passes (TypeScript strict mode)
- [ ] Linting passes (Ruff, ESLint)
- [ ] Security review complete (no secrets, auth validated)
- [ ] Performance targets met (see "Performance & Scalability")
- [ ] Documentation updated (this file, agents.md, code comments)
- [ ] Deployed to staging and validated
- [ ] PR approved by at least 1 maintainer
- [ ] Merged to `develop`, staged for next production release

---

## Known Constraints & Gotchas

### Genkit & Firebase Context

**Problem**: Genkit flows run in Cloud Run, but lose Firebase context across async boundaries.

**Solution**: Pass `user_id` and `auth_token` explicitly through flow input; validate ownership in each step.

```python
# ❌ DON'T: Relies on implicit Firebase context
@define_flow(name="bad_flow")
async def bad_flow(profile_id: str):
    profile = firestore_client.collection("profiles").document(profile_id).get()
    # Error: No way to verify current user owns this profile

# ✅ DO: Explicit user context
@define_flow(name="good_flow")
async def good_flow(input_data: dict):
    user_id = input_data["uid"]
    profile_id = input_data["profile_id"]
    profile = await get_user_profile(user_id, profile_id)
    # Validates ownership inside get_user_profile()
```

### Firestore Query Limits

- Max 1000 documents per query (use pagination)
- No OR queries (use multiple queries or full-text search)
- No LIKE operator (use Cloud Search for full-text)

### AI Model Limitations

**Gemini 1.5 Flash**:
- Context window: 1M tokens (plenty for resumes)
- JSON output less reliable than text
- Temperature > 1.0 causes less diverse output

**Langextract**:
- Assumes Western resume format
- May fail on non-English PDFs
- Returns partial data on parsing error (handle gracefully)

---

## Debugging & Troubleshooting Guide

### "No such document" errors in Genkit flow

**Cause**: User requesting data they don't own, or profile deleted.

**Fix**: Add defensive null checks, return meaningful error:

```python
if not profile:
    return {
        "success": False,
        "error": "Profile not found. Please create a profile first.",
        "confidence_score": 0.0
    }
```

### ATS scores wildly fluctuating

**Cause**: Different models or temperature settings between requests.

**Fix**: Use consistent model and config in Genkit flow. Cache results for 1 hour.

### Resume parsing only extracts first page

**Cause**: Langextract default limit or multi-column layout.

**Fix**: Increase max pages in config, preprocess PDFs to single-column.

### Firestore security rules rejected but user is logged in

**Cause**: Token expired or `uid` mismatch.

**Fix**: Check token refresh in useAuth hook; log `request.auth.uid` in rule error.

---

## Decision Log

### Why Northcote Curio over Material Design 3?

**Date**: 2025-10-15
**Decision**: Use Northcote Curio (botanical aesthetic) over Material Design 3
**Rationale**:
- Distinctive brand identity (not generic Material)
- Australian botanical palette aligns with community services ethos
- Supports dual modes (Gallery for users, Laboratory for tools)
- Justifiable to users: "Designed with care, not automation"

**Alternative Rejected**: Material Design 3 (too common, no memorable brand)

### Why Genkit over LangChain?

**Date**: 2025-09-20
**Decision**: Use Google Genkit over LangChain for AI orchestration
**Rationale**:
- Native Gemini 1.5 integration (no wrapper overhead)
- Cleaner streaming syntax
- Built-in structured output support
- Lighter dependency footprint
- Better Firebase integration

**Trade-off**: Less ecosystem integration (but sufficient for our use case)

### Why Zustand over Redux?

**Date**: 2025-08-05
**Decision**: Use Zustand for global state over Redux
**Rationale**:
- Minimal boilerplate (Redux verbose for this scale)
- Zustand + TanStack Query covers 99% of state needs
- Easier for new team members to understand
- Better DevX (no action/reducer/selector ceremony)

**When to revisit**: If team grows > 10 developers or state becomes too complex

---

## Review Checklist for Maintainers

When reviewing PRs, ensure they align with this plan:

- [ ] **Architecture**: Changes don't deviate from system layers without discussion
- [ ] **Data models**: Schemas match documented interfaces (or update this file)
- [ ] **API contracts**: Endpoints follow request/response patterns
- [ ] **Security**: Authorization rules enforced, no secrets in code
- [ ] **Performance**: Meets targets in "Performance & Scalability" section
- [ ] **AI usage**: Model choice justified (Flash vs Pro)
- [ ] **Error handling**: Standardized error response format
- [ ] **Documentation**: Updated agents.md, PLANS.md, or code comments
- [ ] **Tests**: Unit + integration tests cover happy path + error cases
- [ ] **Roadmap alignment**: Feature is on approved roadmap or explicitly discussed

---

## Contributing to PLANS.md

This file evolves as the project learns. When you:

1. **Make a significant design decision** → Add to "Decision Log" section
2. **Hit a constraint or gotcha** → Document in "Known Constraints & Gotchas"
3. **Discover a pattern that works** → Add to "Development Philosophy" or "AI Agent Design Patterns"
4. **Hit a bug or surprising behavior** → Document in "Debugging & Troubleshooting Guide"
5. **Ship a feature** → Update roadmap and move it to "✅ Completed"

Keep this file as a living artifact of team knowledge, not a static document.
