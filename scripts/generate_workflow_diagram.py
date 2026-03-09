now #!/usr/bin/env python3
"""
generate_workflow_diagram.py

Generates Mermaid flowchart diagrams for the CareerCopilot user workflow.
Outputs Mermaid syntax to both stdout and docs/WORKFLOW_DIAGRAM.md.

Usage:
    python3 scripts/generate_workflow_diagram.py
"""

from __future__ import annotations

import sys
from pathlib import Path


# ---------------------------------------------------------------------------
# Diagram definitions (Mermaid syntax)
# ---------------------------------------------------------------------------

USER_JOURNEY_DIAGRAM = """\
flowchart TD
    A([👤 User Visits CareerCopilot]) --> B{Authenticated?}

    B -- No --> C[/Login · Sign Up/]
    C --> D[(Firebase Auth)]
    D --> E([✅ Session Established])
    B -- Yes --> E

    E --> F[🏠 Dashboard]

    F --> G[📄 Upload Prior Artifacts]
    F --> H[🔍 Paste Job URL]
    F --> I[📝 Paste Resume Text]
    F --> JS[🔭 Job Scout / Email Scan]

    G --> J[📥 POST /api/ingest/artifacts/upload]
    J --> K[(IngestionService\nParse + Chunk)]
    K --> L[(VectorStore\npgvector Career Artifacts)]

    G --> SI[🧠 POST /api/smart-ingestion/upload-and-tag\nAuto-tag + Extract Entities]
    SI --> L

    H --> M[🤖 POST /api/genkit/job/analyze-url]
    M --> N[📊 Unified Job Analysis\nRole + Requirements]
    N --> O[🏢 Company Context]

    JS --> JSA[POST /api/v1/job-scout/search\nDiscover Opportunities]
    JS --> ESC[POST /api/workflows/scan-email-opportunities\nScan Gmail Inbox]
    JSA --> OPP[(Opportunities Store)]
    ESC --> OPP

    I --> P{Choose Next Action}
    N --> P
    L -. Reference prior artifacts .-> P
    OPP -. Opportunity data .-> P

    P --> Q[✍️ POST /api/genkit/resume/optimize]
    P --> R[🛠️ POST /api/analysis/optimize-resume]
    P --> S[📝 POST /api/genkit/cover-letter/generate]
    P --> T[🎯 POST /api/genkit/ksc/generate]
    P --> U[🔎 POST /api/genkit/company/context]
    P --> AUD[🩺 POST /api/resume-audit/evaluate\nATS + Gap Analysis]
    P --> PKG[📦 POST /api/workflows/generate-application\nFull Application Package]

    Q --> V[📄 Updated Resume Draft]
    R --> V
    S --> W[📨 Tailored Cover Letter]
    T --> X[✅ STAR KSC Responses]
    U --> Y[🏛️ Employer Research Notes]
    O --> Y
    AUD --> AUR[📋 Audit Report\nScore + Suggestions]
    PKG --> FPKG[📦 Resume + Cover Letter + KSC]

    V --> Z[👀 Review · Edit · Reuse]
    W --> Z
    X --> Z
    Y --> Z
    AUR --> Z
    FPKG --> Z

    Z --> AA[📬 Submit Application]
    AA --> AB[📋 Track Progress\nPOST /api/applications]
    AB --> AC([🎯 Interview Pipeline])

    style A fill:#D4A84B,color:#1A1714,stroke:#D4A84B
    style AC fill:#6B7F6E,color:#F5F0E8,stroke:#6B7F6E
    style D fill:#1A1714,color:#D4A84B,stroke:#A39B8F
    style L fill:#1A1714,color:#D4A84B,stroke:#A39B8F
    style OPP fill:#1A1714,color:#D4A84B,stroke:#A39B8F
    style Z fill:#1A1714,color:#D4A84B,stroke:#A39B8F
"""

AI_FLOW_DIAGRAM = """\
flowchart LR
    subgraph Input["📥 User Input"]
        ART[Artifact Files\nResume / Cover Letter / KSC]
        RES[Resume Text / Candidate Profile]
        URL[Job URL]
        JD[Job Description]
        EMAIL[Gmail Inbox]
    end

    subgraph Ingestion["🔄 Ingestion Layer"]
        APII[/POST /api/ingest/artifacts/upload/]
        SIAPI[/POST /api/smart-ingestion/upload-and-tag/]
        ING[IngestionService\npdfminer · python-docx]
        SMART[smart_ingestion.py\nAuto-tag + Entity Extract]
        VS[(VectorStore\npgvector)]
    end

    subgraph Discovery["🔭 Discovery Layer"]
        SCOUT[/POST /api/v1/job-scout/search/]
        ESCAN[/POST /api/workflows/scan-email-opportunities/]
        JLE[job_listing_extractor.py]
        ESCF[email_scanner.py]
        OPP[(Opportunities Store)]
    end

    subgraph Analysis["🧭 Analysis + Genkit Endpoints"]
        direction TB
        JAPI[/POST /api/genkit/job/analyze-url/]
        JOB[unified_job_analyzer.py]
        CC[company_context.py]
        CORP[company_analyzer.py]
        ROPT[/POST /api/genkit/resume/optimize/]
        AOPT[/POST /api/analysis/optimize-resume/]
        RO[resume_optimizer.py]
        RIP[resume_intelligence_pipeline.py]
        CLAPI[/POST /api/genkit/cover-letter/generate/]
        CL[smart_cover_letter_system.py]
        KAPI[/POST /api/genkit/ksc/generate/]
        KSC[ksc_generator.py]
        CAPI[/POST /api/genkit/company/context/]
        AUDIT[/POST /api/resume-audit/evaluate/]
        ATS[ats_scoring.py]
        GAP[gap_hunter.py]
    end

    subgraph Orchestration["⚙️ Workflow Orchestration"]
        WAPI[/POST /api/workflows/generate-application/]
        APW[career_application_workflow.py]
        APW2[application_preparation_workflow.py]
    end

    subgraph Output["📤 Output"]
        JOUT[Structured Job Brief]
        OD[Optimized Resume]
        OCL[Cover Letter]
        OKSC[KSC Responses]
        OCTX[Company Research]
        OAUD[Audit Report + ATS Score]
        OPKG[Full Application Package]
    end

    ART --> APII --> ING --> VS
    ART --> SIAPI --> SMART --> VS
    EMAIL --> ESCAN --> ESCF --> OPP
    URL --> SCOUT --> JLE --> OPP
    URL --> JAPI --> JOB --> JOUT
    JAPI --> CC --> OCTX
    JAPI --> CORP
    JD --> ROPT
    JD --> AOPT
    JD --> CLAPI
    JD --> CAPI
    JD --> AUDIT
    RES --> ROPT --> RO --> OD
    RES --> AOPT --> RO
    RES --> CLAPI --> CL --> OCL
    RES --> KAPI --> KSC --> OKSC
    RES --> AUDIT --> ATS --> OAUD
    AUDIT --> GAP --> OAUD
    RES --> RIP
    JOUT --> ROPT
    JOUT --> CLAPI
    JOUT --> KAPI
    JOUT --> CAPI
    JOUT --> WAPI --> APW --> OPKG
    JOUT --> APW2
    APW2 --> APW
    CAPI --> CC
    CORP --> OCTX
    VS -. Retrieval context .-> RO
    VS -. Retrieval context .-> CL
    VS -. Retrieval context .-> KSC
    VS -. Retrieval context .-> APW
    CC --> OCTX
    OPP -. Opportunity data .-> ROPT
    OPP -. Opportunity data .-> CLAPI

    style Analysis fill:#1A1714,color:#F5F0E8,stroke:#D4A84B
    style Ingestion fill:#1A1714,color:#F5F0E8,stroke:#A39B8F
    style Input fill:#2A1F0B,color:#F5F0E8,stroke:#D4A84B
    style Output fill:#0B2A1A,color:#F5F0E8,stroke:#6B7F6E
    style Discovery fill:#1A1F2A,color:#F5F0E8,stroke:#6B9FC8
    style Orchestration fill:#2A1A2A,color:#F5F0E8,stroke:#C86BC8
"""

APPLICATION_WORKFLOW_DIAGRAM = """\
flowchart TD
    subgraph Prep["📋 Preparation"]
        JA[Job Analysis\nunified_job_analyzer.py]
        KD[KSC Detection\napplication_preparation_workflow.py]
        AR[Readiness Assessment]
    end

    subgraph Generation["✍️ Document Generation"]
        RO[Resume Optimizer\nresume_optimizer.py]
        CL[Cover Letter\nsmart_cover_letter_system.py]
        KSC[KSC Responses\nksc_generator.py]
        DG[Document Generator\ndocument_generator.py]
    end

    subgraph Intelligence["🔍 Intelligence Layer"]
        RIP[Resume Intelligence Pipeline\nresume_intelligence_pipeline.py]
        ATS[ATS Scoring\nats_scoring.py]
        GAP[Gap Hunter\ngap_hunter.py]
        SCO[Smart Content Optimizer\nsmart_content_optimizer.py]
    end

    subgraph Tracking["📊 Tracking"]
        APP[Applications Store\nPOST /api/applications]
        OPP[Opportunities Store\nPOST /api/opportunities]
    end

    START([🚀 Start: Job URL + Resume]) --> JA
    JA --> KD
    KD --> AR
    AR --> RO
    AR --> CL
    AR --> KSC
    RO --> ATS
    RO --> GAP
    ATS --> SCO
    GAP --> SCO
    SCO --> DG
    CL --> DG
    KSC --> DG
    RIP -. Career insights .-> RO
    RIP -. Career insights .-> CL
    DG --> PKG[📦 Complete Application Package]
    PKG --> APP
    APP --> OPP
    OPP --> END([🎯 Track + Follow Up])

    style START fill:#D4A84B,color:#1A1714,stroke:#D4A84B
    style END fill:#6B7F6E,color:#F5F0E8,stroke:#6B7F6E
    style Intelligence fill:#1A1714,color:#F5F0E8,stroke:#D4A84B
    style Generation fill:#1A1F2A,color:#F5F0E8,stroke:#6B9FC8
"""


# ---------------------------------------------------------------------------
# Generator
# ---------------------------------------------------------------------------

def build_markdown(user_journey: str, ai_flow: str, app_workflow: str) -> str:
    """Compose the full docs/WORKFLOW_DIAGRAM.md content."""
    return f"""\
# CareerCopilot – Workflow Diagrams

> Generated by `scripts/generate_workflow_diagram.py`.
> Render with any Mermaid-compatible viewer (GitHub, mermaid.live, VS Code extension).

---

## 1. User Journey

End-to-end user journey: artifact ingestion, job discovery, analysis, and targeted document drafting.

```mermaid
{user_journey.strip()}
```

---

## 2. AI Flow Architecture

How live API endpoints connect ingestion, Genkit flows, discovery, and generated outputs.

```mermaid
{ai_flow.strip()}
```

---

## 3. Application Workflow Orchestration

Detailed view of the automated application package generation pipeline.

```mermaid
{app_workflow.strip()}
```

---

## Key Components

| Component | File | Responsibility |
|---|---|---|
| Ingestion API | `backend/app/api/endpoints/ingest.py` | Upload career artifacts for parsing |
| Smart Ingestion API | `backend/app/api/endpoints/smart_ingestion.py` | Auto-tag and extract entities from uploads |
| Ingestion Service | `backend/app/services/ingestion.py` | Parse PDF/DOCX/TXT and chunk content |
| Smart Ingestion Flow | `backend/app/genkit_flows/smart_ingestion.py` | Context tagging and resume/KSC extraction |
| Genkit API | `backend/app/api/endpoints/genkit.py` | Expose modular AI drafting endpoints |
| Analysis API | `backend/app/api/endpoints/analysis.py` | Resume optimization endpoint |
| Workflows API | `backend/app/api/endpoints/workflows.py` | Application package generation + email scan |
| Resume Audit API | `backend/app/api/endpoints/resume_audit.py` | ATS evaluation and gap analysis endpoint |
| Job Scout API | `backend/app/api/endpoints/job_scout.py` | Discover job opportunities from search |
| Applications API | `backend/app/api/endpoints/applications.py` | Track submitted applications |
| Opportunities API | `backend/app/api/endpoints/opportunities.py` | Manage tracked opportunities |
| Job Analyzer | `backend/app/genkit_flows/unified_job_analyzer.py` | Extract structured job details from URLs |
| Job Listing Extractor | `backend/app/genkit_flows/job_listing_extractor.py` | Parse job listings from URLs or text |
| Resume Optimizer | `backend/app/genkit_flows/resume_optimizer.py` | Refine resume content against job context |
| Resume Intelligence | `backend/app/genkit_flows/resume_intelligence_pipeline.py` | Comprehensive resume analysis and insights |
| Smart Cover Letter | `backend/app/genkit_flows/smart_cover_letter_system.py` | Draft tailored cover letters |
| KSC Generator | `backend/app/genkit_flows/ksc_generator.py` | Draft STAR-format KSC responses |
| Company Context | `backend/app/genkit_flows/company_context.py` | Generate employer research context |
| Company Analyzer | `backend/app/genkit_flows/company_analyzer.py` | Analyze company websites and culture |
| ATS Scoring | `backend/app/genkit_flows/ats_scoring.py` | Score resume against ATS criteria |
| Gap Hunter | `backend/app/genkit_flows/gap_hunter.py` | Identify skill and experience gaps |
| Smart Content Optimizer | `backend/app/genkit_flows/smart_content_optimizer.py` | Optimize content for specific roles |
| Application Workflow | `backend/app/genkit_flows/career_application_workflow.py` | Orchestrate full application package |
| Preparation Workflow | `backend/app/genkit_flows/application_preparation_workflow.py` | Detect KSC requirements and assess readiness |
| Document Generator | `backend/app/genkit_flows/document_generator.py` | Generate final formatted documents |
| Email Scanner | `backend/app/genkit_flows/email_scanner.py` | Scan Gmail for job opportunities |
| Vector Store | `backend/app/services/vector_store.py` | Store and retrieve prior career artifacts |
"""


def main() -> None:
    user_journey = USER_JOURNEY_DIAGRAM
    ai_flow = AI_FLOW_DIAGRAM
    app_workflow = APPLICATION_WORKFLOW_DIAGRAM

    markdown = build_markdown(user_journey, ai_flow, app_workflow)

    # Resolve repo root relative to this script's location
    repo_root = Path(__file__).resolve().parent.parent
    output_path = repo_root / "docs" / "WORKFLOW_DIAGRAM.md"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        output_path.write_text(markdown, encoding="utf-8")
    except OSError as exc:
        print(
            f"❌  Failed to write {output_path}: {exc}\n"
            "    Check file permissions and available disk space.",
            file=sys.stderr,
        )
        sys.exit(1)

    rel = output_path.relative_to(repo_root)
    print(f"✅  Workflow diagram written to: {rel}")
    print()
    print("--- User Journey (Mermaid) ---")
    print(user_journey)
    print("--- AI Flow Architecture (Mermaid) ---")
    print(ai_flow)
    print("--- Application Workflow Orchestration (Mermaid) ---")
    print(app_workflow)


if __name__ == "__main__":
    main()
