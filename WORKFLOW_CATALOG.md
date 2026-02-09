# WORKFLOW_CATALOG.md

## Core Workflows

### 1. Resume Analysis and Optimization
- **Goal**: Analyze a candidate resume against a job description and suggest keyword optimizations.
- **Trigger**: User uploads a resume and provides a job description URL.
- **Steps**:
    1. Unified Job Analyzer (`flow.job_analyzer`) scrapes job URL.
    2. Ingest (`prompt.ingestion`) flow extracts raw text.
    3. Resume Optimizer (`flow.resume_optimizer`) identifies missing keywords and suggests edits.
- **Human Points**: Approval of suggested resume edits.

### 2. Smart Cover Letter Generation
- **Goal**: Create a high-quality, tailored cover letter.
- **Trigger**: User requests generation after job analysis.
- **Steps**:
    1. Retrieve Company Context via `company_context.py`.
    2. Smart Cover Letter System (`flow.smart_cover_letter`) generates tailored letter.
- **Outputs**: Markdown formatted cover letter.

### 3. KSC (Key Selection Criteria) Generation
- **Goal**: Drafting STAR-formatted responses for job criteria.
- **Trigger**: Specific selection criteria input.
- **Steps**:
    1. KSC Generator (`flow.ksc_generator`) drafts responses from user experience snippets.
- **Flows**: `generateKscResponse`.
