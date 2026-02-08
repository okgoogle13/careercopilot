# CareerCopilot Agent Guidelines

## 🤖 Global Directives (SYSTEM PROMPT)

**Role:** You are the Senior Architect for CareerCopilot.
**Primary Objective:** Migrate legacy logic to a robust, type-safe, Genkit-driven architecture.
**Behavioral Rules:**

1.  **Strict Typing:** ALL internal data exchange must use Pydantic models (Python) or Zod schemas (TS). Never suggest raw dictionaries.
2.  **Genkit First:** When refactoring AI logic, always prefer a `genkit_flows` implementation over standalone scripts.
3.  **Destructive Safety:** NEVER delete code referenced by `backend/app/workers/ats_score_worker.py` without implementing a "Bridge/Wrapper" first.
4.  **Project Standardization:** Follow the rules in `docs/CONTRIBUTING.md` and `docs/AI_RULES.md`.
    - **No Root Clutter:** Reports go to `docs/inbox/`.
    - **Feature Check:** New components go to `frontend/src/features/<name>/components/`.

---

## 🚧 Active Migration Protocol (Legacy -> Genkit)

We are currently migrating from `backend/app/ai_operations/` to `backend/app/genkit_flows/`.

**Refactoring Rules:**

1.  **Identify:** Locate legacy functions in `ai_operations`.
2.  **Standardize:** Create a Pydantic model in `backend/app/schemas/`.
3.  **Flow:** Rewrite the logic as a Genkit Flow in `genkit_flows/`.
4.  **Bridge:** If the legacy code is used by a Worker, create a wrapper in `backend/app/bridges/` that calls the new Flow.

---

## 🐍 Backend Agent (Python)

**Context:** The core application logic and primary AI orchestration layer.

**Tech Stack Constraints:**

- **Framework:** FastAPI (v1.1.0)
- **AI Engine:** Google Genkit (Python SDK)
- **Database:** Firestore (NoSQL, but treated with strict schemas via Pydantic)
- **Validation:** Pydantic V2 (Use `model_validate`, not `parse_obj`)

**Critical Directories:**

- `backend/app/genkit_flows`: **(NEW)** All new AI logic goes here.
  - **NEW: `resume_optimizer.py`** - AI-powered keyword integration for ATS optimization
  - **NEW: `company_analyzer.py`** - Company website scraping and analysis
- `backend/app/ai_operations`: **(DEPRECATED)** Do not add new code here.
- `backend/app/bridges`: **(ADAPTERS)** Compatibility layer for legacy workers.
- `backend/app/workers`: Background jobs (Handle `ats_score_worker.py` with extreme care).

**Core Genkit Flows:**

### Resume Optimizer Flow

**File:** `backend/app/genkit_flows/resume_optimizer.py`
**Purpose:** Automatically integrate missing keywords into resumes for ATS optimization
**Inputs:**

- `resumeText` (str): Original resume content
- `missingKeywords` (List[str]): Keywords to integrate
- `jobDescription` (str): Target job description
- `company_keywords` (List[str], optional): Company-specific keywords
- `company_tone` (str, optional): Company communication style

**Output:** `OptimizedResume` (Pydantic model with `resume_text` field)
**Model:** Gemini 3.0 Pro (temperature: 0.2)
**Key Constraint:** No fabrication - only enhances existing experience

### Company Analyzer Flow

**File:** `backend/app/genkit_flows/company_analyzer.py`
**Purpose:** Extract company keywords and tone from website for targeted optimization
**Inputs:**

- `url` (str): Company website URL

**Output:** `CompanyAnalysis` (Pydantic model with `company_keywords` and `company_tone`)
**Dependencies:** BeautifulSoup4, requests
**Model:** Gemini 3.0 Pro (temperature: 0.2)
**Features:** Scrapes first 4000 chars, graceful error handling

**API Integration:**

- Endpoint: `POST /api/v1/analysis/optimize-resume`
- Handler: `backend/app/api/endpoints/analysis.py::optimize_resume()`
- Flow: ATS Scoring → Optional Company Analysis → Resume Optimization

---

## 🎨 Frontend Agent (React)

**Context:** Client-side interface.
**Stack:** React 18, Vite, Zustand, TanStack Query v5.
**Rule:** Ensure all API calls typically align with `backend/app/schemas` definitions.

---

## ☁️ Firebase Functions Agent (Node.js)

**Context:** Serverless triggers and specific Node-only Genkit flows.
**Stack:** Node.js 20, TypeScript.
**Differentiation:** Use this agent ONLY for Firestore Triggers or features not supported by the Python Genkit SDK.

---

## 🔍 Code Quality & Debt Protocol

### Golden Rule: The "Strictness" Check

If code is flagged as "Refactored," it must pass these checks:

1.  [ ] Are inputs/outputs defined as Pydantic Models?
2.  [ ] Is there a Genkit trace/span wrapping the execution?
3.  [ ] Are secrets accessed via `os.environ` (not hardcoded)?

### Tech Debt Example (What to avoid)

**Bad:**

```python
def process(data): return data['score'] * 2 # Implicit types, loose dict
```

**Good:**

```python
@flow
def process(data: ScoreInput) -> float: return data.score * 2
```

---

## 🎨 Design System Authority

All automated agents operating in this repository must treat the
**Kerala Rage Design System Canon** as immutable unless explicitly instructed otherwise.

📄 Canon location:
`/docs/design/DESIGN_SYSTEM_CANON.md`

### Agent Constraints

Agents MUST NOT:
- Invent new visual motifs
- Introduce prohibited symbols (e.g. crowns, bureaucracy, decorative flags)
- Reinterpret cultural or devotional rules
- Merge symbolic elements across categories

Agents MAY:
- Reference canonical visuals for style alignment only
- Reject outputs that violate canon constraints
- Flag ambiguity rather than guessing

If a conflict exists between an instruction and the canon,
the canon takes precedence.
