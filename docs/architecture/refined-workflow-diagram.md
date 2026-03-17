# CareerCopilot: Refined User Workflow (v6.1)

This diagram reflects the fixes for UX issues UX-01 through UX-12, introducing the **Application Workspace** as a central hub for individual job pursuits.

```mermaid
flowchart TD
    %% Entry Points
    START([🆕 User Discovery]) --> LAND[Landing Page
    /
    — Social proof + Benefits]

    LAND --> REG[Register / Login]

    subgraph Activation["🚀 Activation & Choice"]
        REG --> OB[Onboarding
        /onboarding
        — Domain selection]

        OB --> CHOICE{Choose Path}

        CHOICE -->|"Setup Profile"| ING[Career Ingestion
        /career/ingest
        — Upload docs]

        CHOICE -->|"Apply Now"| WS[Application Workspace
        — Paste URL / Job Queue]

        ING --> DASH[Dashboard
        — checklist: 'Complete Setup']

        WS --> DASH
    end

    subgraph Discovery["🔭 Discover & Find"]
        DASH --> LOOK[Lookout / Opportunities
        /opportunities
        — Empty state: 'Start Search']

        DASH --> JQ[Job Queue
        /job-queue
        — AI-surfaced roles]

        LOOK -->|"Select Role"| WS
        JQ -->|"Select Role"| WS
        DASH -->|"Paste URL"| WS
    end

    subgraph Workspace["🏗️ Application Workspace (New Hub)"]
        WS[/analysis — Workspace View
        Unified hub for specific role/]

        WS -->|"ATS Context"| ANA[Analysis Workbench
        — Keyword Gaps · Context Badge]

        WS -->|"Drafting"| GEN{Document Generator}

        GEN --> CL[Cover Letter
        /cover-letter-generator
        — Step Counter · Context Badge]

        GEN --> KSC[KSC Generator
        /ksc-generator
        — Gov labeling · STAR steps]

        GEN --> RES[Resume Optimizer
        /documents]

        CL & KSC & RES -->|"Export / Save"| WS
    end

    subgraph Track["📋 Track & Management"]
        WS -->|"Update Status"| TRK[Application Tracker
        /tracker
        — Links back to Workspace]

        TRK --> DASH
    end

    %% Styles
    style START fill:#D4A84B,color:#1A1714,stroke:#D4A84B
    style WS fill:#F14714,color:#F5F0E8,stroke:#F14714
    style Activation fill:#2A3B2A,color:#F5F0E8,stroke:#6B7F6E
    style Discovery fill:#1A1F2A,color:#F5F0E8,stroke:#6B9FC8
    style Workspace fill:#1A1714,color:#F5F0E8,stroke:#F14714
    style Track fill:#2A1F0B,color:#F5F0E8,stroke:#D4A84B
```

### Key Journey Improvements:
1.  **Unified Workspace**: `/analysis` now acts as the focus point for a specific job, linking all generated assets and tracking status.
2.  **Contextual Awareness**: Indicators on generator pages show exactly which documents informed the AI output.
3.  **Active Guidance**: The Dashboard now features a "Getting Started" checklist to prevent "empty hub" paralysis.
4.  **Clarity**: KSC is explicitly labeled as a Government Application tool.
