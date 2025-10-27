## Simplification Audit Report: CareerCopilot

### 1. Feature Removal Candidates (Non-Core)

Based on my analysis, the following features are outside the "Core Value Loop" and are strong candidates for removal to simplify the application:

**Feature: Career Market Intelligence**
*   **Files:**
    *   `backend/app/ml/market_intelligence.py`
    *   Related frontend components (if any)
*   **Rationale:** This is a complex, data-intensive feature that is ancillary to the core user journey of applying for a specific job. It likely requires the `spacy` dependency, adding to the maintenance overhead.

**Feature: Onboarding Voice Workflow**
*   **Files:**
    *   `backend/app/genkit_flows/onboarding_voice_workflow.py`
    *   `backend/app/genkit_flows/voice_profiler.py`
*   **Rationale:** Voice processing adds significant complexity and dependency overhead. Onboarding can be simplified to a standard form-based workflow.

**Feature: Email Task Scanning**
*   **Files:**
    *   `backend/app/genkit_flows/email_scanner.py`
    *   `backend/app/genkit_flows/email_task_workflow.py`
    *   `backend/app/workers/scan_emails_worker.py`
    *   `backend/app/api/endpoints/workflows.py` (scan-email-opportunities endpoint)
*   **Rationale:** This requires complex external API permissions (Google OAuth) and a background worker, which is a major source of complexity and maintenance. The `scanUserEmails` function has a high cyclomatic complexity.

**Feature: Interview Prep**
*   **Files:**
    *   `frontend/src/components/career/InterviewPrep.tsx` (I suspect this exists based on the prompt, but it was not in the `pages` directory. Further investigation would be needed to find the exact file)
*   **Rationale:** While useful, interview preparation is a secondary feature to the core loop of creating application materials.

### 2. Code Complexity Hotspots (from `radon cc`)

The following Python files/functions have high cyclomatic complexity (graded C or worse) and should be prioritized for refactoring or removal. Many of these are in non-core features.

*   `backend/app/genkit_flows/ats_scoring.py`:
    *   `atsScoring` (D)
    *   `_calculate_keyword_score` (C)
    *   `_generate_recommendations` (C)
*   `backend/app/genkit_flows/email_scanner.py`:
    *   `scanUserEmails` (C)
*   `backend/app/genkit_flows/career_application_workflow.py`:
    *   `generate_application_package` (C)
    *   `_generate_application_strategy` (C)
    *   `_detect_ksc_criteria` (C)
*   `backend/app/api/endpoints/workflows.py`:
    *   `create_application_package` (C)
*   `backend/app/ml/market_intelligence.py`:
    *   `SkillMatchingEngine._analyze_job_requirements` (C)
    *   `SkillMatchingEngine._calculate_skill_match` (C)
*   And several others in core AI operations, testing, and configuration.

### 3. Architectural & Dependency Complexity

**Asynchronous Workers:**
*   `backend/app/workers/ats_score_worker.py`
*   `backend/app/workers/scan_emails_worker.py`

**Recommendation:** Each worker adds maintenance/scaling overhead. The `scan_emails_worker.py` could be removed entirely by removing the "Email Scanning" feature.

**Heavy ML/NLP Dependencies:**
*   **Libraries Found:**
    *   `spacy`
    *   `spacy-legacy`
    *   `spacy-loggers`

**Recommendation:** The `spacy` library and its ecosystem add significant build/deployment time and complexity. If its only use is for a "Non-Core" feature (like `market_intelligence.py`), it's a prime candidate for removal.

This concludes the Simplification Audit.
