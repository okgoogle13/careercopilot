#!/usr/bin/env python3
"""
generate_ux_process_map.py

Generates a high-level UX process map for CareerCopilot.
Outputs Mermaid-based diagrams and structured UX documentation to
docs/UX_PROCESS_MAP.md.

Usage:
    python3 scripts/generate_ux_process_map.py
"""

from __future__ import annotations

import sys
from pathlib import Path


# ---------------------------------------------------------------------------
# Diagram: 5-Phase Overview
# ---------------------------------------------------------------------------

PHASE_OVERVIEW_DIAGRAM = """\
flowchart LR
    D(["🌐 DISCOVERY\nLanding Page"])
    A(["🔑 ACTIVATION\nSign Up · Login\nOnboarding"])
    S(["📂 SETUP\nCareer Ingestion\nProfile"])
    W(["🔄 CORE LOOP\nFind · Analyse\nGenerate · Track"])
    R(["⚙️ REFINEMENT\nSettings\nVoice Profile"])

    D -->|"CTA: Get Started"| A
    A -->|"Domain selected"| S
    S -->|"Docs uploaded"| W
    W <-->|"Iterate"| W
    W -->|"Review preferences"| R
    R -->|"Back to work"| W

    style D fill:#D4A84B,color:#1A1714,stroke:#D4A84B
    style A fill:#3B5268,color:#F5F0E8,stroke:#6B9FC8
    style S fill:#2A3B2A,color:#F5F0E8,stroke:#6B7F6E
    style W fill:#F14714,color:#F5F0E8,stroke:#F14714
    style R fill:#1A1714,color:#D4A84B,stroke:#A39B8F
"""

# ---------------------------------------------------------------------------
# Diagram: Navigation Architecture
# ---------------------------------------------------------------------------

NAVIGATION_DIAGRAM = """\
flowchart TD
    subgraph Public["🌐 Public (No Auth Required)"]
        LAND["/\nLanding Page"]
        AUTH["/auth\nAuthentication (Login/Register)"]
    end

    subgraph EntryFlow["🚀 Entry Flow"]
        OB["/onboarding\nDomain Selection"]
    end

    subgraph Hub["🏠 Hub"]
        DASH["/dashboard\nDashboard\n— Activity overview · Quick actions"]
    end

    subgraph Discover["🔭 Discover & Find Jobs"]
        LOOK["/lookout\nLookout\n— Browse / search job listings"]
    end

    subgraph Generate["✍️ Generate Documents"]
        ANA["/analysis\nAnalysis Workbench\n— ATS Score · Gap Analysis · Company Research"]
        GEN["/generation\nGeneration Workbench\n— Cover Letter · KSC · Multi-step generation"]
        DOCS["/docs\nDocs\n— Resume builder · Version history"]
    end

    subgraph Track["📋 Track & Manage"]
        APPS["/applications\nApplications\n— Kanban board · Status updates"]
        APPLY["/apply\nApply\n— Current application context"]
        PROF["/profile\nProfile\n— Career summary · Skills · Ingestion"]
    end

    subgraph Settings["⚙️ Settings & Admin"]
        SET["/settings\nSettings\n— Notifications · Integrations · Account"]
    end

    LAND -->|"Get Started"| AUTH
    AUTH --> OB
    OB --> DASH
    AUTH --> DASH

    DASH --> LOOK
    DASH --> ANA
    DASH --> GEN
    DASH --> DOCS
    DASH --> APPS
    DASH --> PROF
    DASH --> SET

    LOOK -->|"Select role"| ANA
    ANA -->|"Generate materials"| GEN
    GEN -->|"Optimise doc"| DOCS
    GEN -->|"Track application"| APPS
    DOCS -->|"Track application"| APPS
    APPLY --> APPS

    style Public fill:#1A1714,color:#F5F0E8,stroke:#A39B8F
    style EntryFlow fill:#2A3B2A,color:#F5F0E8,stroke:#6B7F6E
    style Hub fill:#1A1714,color:#D4A84B,stroke:#D4A84B
    style Discover fill:#1A1F2A,color:#F5F0E8,stroke:#6B9FC8
    style Generate fill:#1A1714,color:#F5F0E8,stroke:#F14714
    style Track fill:#2A1F0B,color:#F5F0E8,stroke:#D4A84B
    style Settings fill:#1A1714,color:#A39B8F,stroke:#A39B8F
"""

# ---------------------------------------------------------------------------
# Diagram: Core Application Loop
# ---------------------------------------------------------------------------

CORE_LOOP_DIAGRAM = """\
flowchart TD
    START([🎯 Target Role Identified])

    subgraph Find["🔭 Phase 1 · LOOKOUT"]
        F1[Browse /lookout or Dashboard]
        F2{Opportunity\npromising?}
        F3[Paste job URL manually]
        F4[AI analyses job listing\nunified_job_analyzer.py]
    end

    subgraph Analyse["📊 Phase 2 · ANALYSE"]
        A1[/analysis — ATS Score\nKeyword match · Gap report/]
        A2{Score\nacceptable?}
        A3[Review missing keywords\n+ company context]
    end

    subgraph Generate["✍️ Phase 3 · GENERATE"]
        G1{Document\nneeded?}
        G2[Generation Workbench\n/generation]
        G3[STAR KSC Response\n/generation]
        G4[Docs / Resume Builder\n/docs]
        G5[Review + Edit + Export]
    end

    subgraph Track["📋 Phase 4 · APPLICATIONS"]
        T1[Update /applications\nTracker]
        T2[Update status\nApplied · Interview · Offer]
        T3{Outcome?}
        T4([🎉 Offer Received])
        T5[Refine strategy\nfor next role]
    end

    START --> F1
    F1 --> F2
    F2 -- No --> F1
    F2 -- Yes --> F4
    F3 --> F4
    F4 --> A1
    A1 --> A2
    A2 -- Too low --> A3
    A3 --> G1
    A2 -- Acceptable --> G1
    G1 --> G2
    G1 --> G3
    G1 --> G4
    G2 --> G5
    G3 --> G5
    G4 --> G5
    G5 --> T1
    T1 --> T2
    T2 --> T3
    T3 -- Offer --> T4
    T3 -- Rejected / No response --> T5
    T5 --> START

    style START fill:#D4A84B,color:#1A1714,stroke:#D4A84B
    style T4 fill:#48DA8B,color:#1A1714,stroke:#48DA8B
    style Find fill:#1A1F2A,color:#F5F0E8,stroke:#6B9FC8
    style Analyse fill:#1A1714,color:#F5F0E8,stroke:#D4A84B
    style Generate fill:#1A1714,color:#F5F0E8,stroke:#F14714
    style Track fill:#2A1F0B,color:#F5F0E8,stroke:#D4A84B
"""

# ---------------------------------------------------------------------------
# Diagram: Onboarding Flow
# ---------------------------------------------------------------------------

ONBOARDING_FLOW_DIAGRAM = """\
flowchart TD
    NEW([🆕 New User]) --> LAND[Landing Page\nValue proposition · Social proof]
    LAND --> REG[Register\nEmail + Password]
    REG --> DOMAIN[Select Domain\nSocial Work · Healthcare · Education\nGovernment · Community · Non-Profit\nMental Health · Disability · Youth]
    DOMAIN --> UPLOAD{Have existing\ndocuments?}
    UPLOAD -- Yes --> ING[Career Ingestion\nUpload Resume / Cover Letters / KSC\nAuto-tag + Extract entities]
    UPLOAD -- Skip for now --> DASH
    ING --> VALIDATE[Validation Dashboard\nReview extracted career history]
    VALIDATE --> DASH[Dashboard\nPersonalised welcome + quick-start prompts]

    RETURN([🔁 Returning User]) --> LOGIN[Login]
    LOGIN --> DASH

    style NEW fill:#D4A84B,color:#1A1714,stroke:#D4A84B
    style RETURN fill:#3B5268,color:#F5F0E8,stroke:#6B9FC8
    style DASH fill:#F14714,color:#F5F0E8,stroke:#F14714
"""

# ---------------------------------------------------------------------------
# Diagram: User Emotion Journey
# ---------------------------------------------------------------------------

EMOTION_JOURNEY_DIAGRAM = """\
journey
    title CareerCopilot User Emotion Journey
    section Discovery
      See landing page: 4: Career Switcher, Migrant Professional
      Understand product value: 3: Career Switcher, Migrant Professional
      Decide to sign up: 4: Career Switcher, Migrant Professional
    section Activation
      Complete registration: 3: Career Switcher, Migrant Professional
      Select career domain: 5: Career Switcher, Migrant Professional
    section Setup
      Upload existing documents: 2: Career Switcher, Migrant Professional
      Review extracted career data: 3: Career Switcher, Migrant Professional
      Confirm career history is accurate: 4: Career Switcher, Migrant Professional
    section Core Loop - Find
      Browse opportunity feed: 4: Career Switcher, Migrant Professional
      Identify a promising role: 5: Career Switcher, Migrant Professional
    section Core Loop - Analyse
      Run ATS score: 3: Career Switcher, Migrant Professional
      See keyword gaps identified: 3: Career Switcher, Migrant Professional
      Read company context summary: 4: Career Switcher, Migrant Professional
    section Core Loop - Generate
      Generate cover letter draft: 5: Career Switcher, Migrant Professional
      Edit and personalise the draft: 4: Career Switcher, Migrant Professional
      Generate KSC responses: 5: Migrant Professional
      Export final documents: 5: Career Switcher, Migrant Professional
    section Track
      Log application in tracker: 4: Career Switcher, Migrant Professional
      Receive interview invitation: 5: Career Switcher, Migrant Professional
"""

# ---------------------------------------------------------------------------
# Generator
# ---------------------------------------------------------------------------

SCREEN_INVENTORY = """\
| # | Route | Screen Name | Emotional Register | Status | Primary User Goal |
|---|---|---|---|---|---|
| 01 | `/` | Landing | **Defiance** | ✅ Live | Understand value and sign up |
| 02 | `/auth` | Auth | **Trust** | ✅ Live | Authenticate securely |
| 03 | `/onboarding` | Onboarding | **Possibility** | ✅ Live | Set career domain and context |
| 04 | `/dashboard` | Dashboard | **Altitude** | ✅ Live | Overview of activity and quick-start actions |
| 05 | `/lookout` | Lookout / Feed | **Discovery** | ✅ Live | Browse and filter job listings |
| 06 | `/analysis` | Analysis Workbench | **Revelation** | ✅ Live | ATS score, gap analysis, company research |
| 07 | `/generation` | Generation Workbench | **Craft** | ✅ Live | Draft tailored cover letters and KSC |
| 08 | `/docs` | Docs / Resume Builder | **Craft** | ✅ Live | Build and manage resume versions |
| 09 | `/applications` | Applications Tracker | **Control** | ✅ Live | Track application statuses on a Kanban board |
| 10 | `/apply` | Project Context | **Focus** | ✅ Live | Current application focal point |
| 11 | `/profile` | Profile / Ingestion | **Gravity** | ✅ Live | Manage career summary and document ingestion |
| 12 | `/settings` | Settings | **Archive Vault** | ✅ Live | Notifications, integrations, account preferences |
| 13 | `/style-guide` | Style Guide | **Foundation** | 🧪 Dev | Component library and token audit |
| 14 | `/design-sidekick` | Design Sidekick | **Vision** | 🧪 Dev| Visual compliance and AI generation |
"""

USER_STORY_MAP = """\
| Phase | Persona | "I want to…" | Screen(s) | API / Flow |
|---|---|---|---|---|
| Discovery | All | Understand what CareerCopilot does and who it's for | `/` | — |
| Activation | All | Create an account and tell the app my career focus | `/auth` → `/onboarding` | Firebase Auth |
| Setup | All | Load my existing career documents so the AI has context | `/profile` | `POST /api/ingest/artifacts/upload` |
| Setup | Migrant Professional | See that my overseas experience is understood and correctly labelled | `/profile` | `POST /api/smart-ingestion/upload-and-tag` |
| Find | All | Browse job listings relevant to my domain and location | `/lookout` | `POST /api/v1/job-scout/search` |
| Find | All | Have the app automatically surface relevant jobs from my email | `/dashboard` | `POST /api/workflows/scan-email-opportunities` |
| Find | All | Paste a job URL and get an instant structured summary | `/analysis` | `POST /api/genkit/job/analyze-url` |
| Analyse | All | Know how well my resume matches this specific job's requirements | `/analysis` | `POST /api/resume-audit/evaluate` |
| Analyse | All | See exactly which keywords I'm missing from the job description | `/analysis` | `POST /api/analysis/optimize-resume` |
| Analyse | Migrant Professional | Understand what the employer's culture and values are | `/analysis` | `POST /api/genkit/company/context` |
| Generate | All | Get a first draft of my cover letter tailored to this role | `/generation` | `POST /api/genkit/cover-letter/generate` |
| Generate | Migrant Professional | Get step-by-step help writing Key Selection Criteria responses | `/generation` | `POST /api/genkit/ksc/generate` |
| Generate | All | Optimise my resume for this specific role | `/docs` | `POST /api/genkit/resume/optimize` |
| Generate | All | Export my final documents as PDF | `/generation` · `/docs` | Export Engine |
| Track | All | Record where I am in the application process for each job | `/applications` | `POST /api/applications` |
| Track | All | Update the status when I hear back from the employer | `/applications` | Kanban board |
| Refine | All | Teach the app my writing voice so outputs sound like me | `/settings` · `/profile` | Voice Profile (AI) |
| Refine | All | See my overall job search progress and activity over time | `/dashboard` | Dashboard metrics |
"""

UX_PRIORITIES = """\
## UX Priorities & Open Issues

### 🔴 Critical
| ID | Issue | Affected Screen(s) | Suggested Fix |
|---|---|---|---|
| UX-01 | No clear progress indicator during multi-step generation flows | Generation Workbench | Add a step counter (Step 2 of 3) and estimated time label |
| UX-02 | New users hit the Dashboard with no contextual guidance if they skip ingestion | `/dashboard` | Add a dismissible "Getting Started" checklist |
| UX-03 | "KSC Generator" label is opaque to users unfamiliar with Australian government applications | Navigation, `/generation` | Relabel as "Key Selection Criteria (KSC)" within the tools menu |
| UX-04 | No empty state on the Lookout when no jobs have been fetched yet | `/lookout` | Add an illustrated empty state with a search prompt |

### 🟡 High
| ID | Issue | Affected Screen(s) | Suggested Fix |
|---|---|---|---|
| UX-05 | Profile and Analysis are separate routes but share a tight data dependency | `/profile`, `/analysis` | Surface "Your Context" status on the Analysis page |
| UX-13 | Path bifurcation: Users need a clear choice between profile setup and immediate job application | Dashboard / Onboarding | Implement a 'Choose Your Path' screen after login/onboarding |

### 🟢 Enhancement
| ID | Issue | Affected Screen(s) | Suggested Fix |
|---|---|---|---|
2. **KSC visibility**: The KSC Generator is a differentiating feature for government/community services roles but is buried in the navigation. Should it be surfaced more prominently when a government role is detected?
3. **Voice profile**: The voice profile feature (Settings) teaches the AI a user's writing style. This is a power feature — should it be surfaced earlier in onboarding or only in Settings?
4. **Opportunity discovery vs manual entry**: Is the primary entry point for the core loop (a) browsing Opportunities/Job Queue, or (b) pasting a job URL directly into Analysis? Understanding this informs where to place the strongest CTA on the Dashboard.
5. **Tracker–Generator link**: Should clicking a card in the Application Tracker open the associated documents directly, or navigate to a dedicated "Application Detail" view? An Application Detail view would unify the tracker and generation steps.
"""


def build_markdown(
    phase_overview: str,
    nav_diagram: str,
    onboarding_flow: str,
    core_loop: str,
    emotion_journey: str,
    screen_inventory: str,
    user_story_map: str,
    ux_priorities: str,
) -> str:
    """Compose the full docs/UX_PROCESS_MAP.md content."""
    return f"""\
# CareerCopilot – UX Process Map

> Generated by `scripts/generate_ux_process_map.py`.
> Use this document to organise UX sprints, map user journeys, and identify design priorities.
> Render diagrams with any Mermaid-compatible viewer (GitHub, mermaid.live, VS Code extension).

---

## Target Audience

CareerCopilot serves people moving into or within the **community services sector** in Australia —
specifically migrants, people of colour, career-changers, and re-entrants who face systemic barriers
in a job market not built for them.

### User Personas

| Persona | Description | Key Pain Points | Differentiating Need |
|---|---|---|---|
| **The Career Switcher** | Experienced professional moving from another sector into social work, healthcare, or education | Doesn't know how to translate their existing experience into community-services language | Resume reframing + KSC help |
| **The Migrant Professional** | Trained overseas; navigating Australian job conventions (KSC, selection criteria, APS roles) | Unfamiliar with KSC format, uncertain about cultural tone in applications | KSC generator + company context |
| **The Re-Entrant** | Returning after a career gap (parenting, illness, relocation) | Needs to explain and bridge the gap; low confidence | ATS scoring + gap analysis |
| **The Sector First-Timer** | Recent graduate entering community services directly | Limited work history; needs to frame academic and volunteer experience effectively | Voice profile + AI coaching |

---

## 1. Five-Phase Overview

Every user journey passes through five phases. The core loop (Phase 4) repeats for every job application.

```mermaid
{phase_overview.strip()}
```

---

## 2. Navigation Architecture

All screens and their transitions. Solid arrows are primary flows; dashed arrows are secondary paths.

```mermaid
{nav_diagram.strip()}
```

---

## 3. Onboarding Flow (First-Time Users)

```mermaid
{onboarding_flow.strip()}
```

### Onboarding Steps Detail

| Step | Screen | User Action | System Response | Exit Condition |
|---|---|---|---|---|
| 1 | Landing (`/`) | Reads value proposition, clicks "Get Started" | — | CTA click |
| 2 | Register (`/register`) | Enters email + password (or OAuth) | Firebase account created; JWT issued | Account created |
| 3 | Onboarding (`/onboarding`) | Selects career domain (e.g. Social Work) | Domain stored to profile | Selection confirmed |
| 4 | Career Ingestion (`/career/ingest`) | Uploads resume, cover letter, or KSC documents | AI parses, auto-tags, embeds into VectorStore | ≥1 document processed **or** user skips |
| 5 | Validation Dashboard | Reviews extracted career history | Highlights missing or ambiguous data | User confirms |
| 6 | Dashboard (`/dashboard`) | Sees personalised welcome and quick-start prompts | Dashboard loads with contextual CTAs | — |

---

## 4. Core Application Loop

This loop repeats for every job the user applies for.

```mermaid
{core_loop.strip()}
```

### Loop Step Detail

| Phase | Screen | User Goal | Key Input | AI/System Output |
|---|---|---|---|---|
| **Find** | `/opportunities`, `/job-queue` | Identify a relevant role | Browse feed or paste URL | Structured job brief (role, requirements, company) |
| **Analyse** | `/analysis` | Know how well they match | Resume + job description | ATS score, keyword gap, company context |
| **Generate** | `/cover-letter-generator`, `/ksc-generator`, `/documents` | Create tailored application materials | Job brief + resume context | Draft cover letter / KSC responses / optimised resume |
| **Review** | Same generators | Personalise the AI output | In-page edit | Edited document ready for export |
| **Track** | `/tracker` | Record the application | Application details | Kanban card with status |

---

## 5. User Emotion Journey

Emotional register at each stage. Higher score = more positive / confident feeling.

```mermaid
{emotion_journey.strip()}
```

**Key insight**: Emotion dips during Setup (uploading documents is tedious) and during Analysis
(seeing keyword gaps can feel discouraging). These are the two highest-risk drop-off points.
Design should acknowledge effort and reframe gaps as *actionable*, not critical.

---

## 6. Screen Inventory

{screen_inventory.strip()}

---

## 7. User Story Map

Maps user goals to the screens and API calls that fulfill them, organised by journey phase.

{user_story_map.strip()}

---

{ux_priorities.strip()}
"""


def main() -> None:
    markdown = build_markdown(
        phase_overview=PHASE_OVERVIEW_DIAGRAM,
        nav_diagram=NAVIGATION_DIAGRAM,
        onboarding_flow=ONBOARDING_FLOW_DIAGRAM,
        core_loop=CORE_LOOP_DIAGRAM,
        emotion_journey=EMOTION_JOURNEY_DIAGRAM,
        screen_inventory=SCREEN_INVENTORY,
        user_story_map=USER_STORY_MAP,
        ux_priorities=UX_PRIORITIES,
    )

    repo_root = Path(__file__).resolve().parent.parent
    output_path = repo_root / "docs" / "UX_PROCESS_MAP.md"
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
    print(f"✅  UX process map written to: {rel}")
    print(f"    Lines: {len(markdown.splitlines())}")
    print()
    print("Diagrams included:")
    print("  1. Five-Phase Overview")
    print("  2. Navigation Architecture")
    print("  3. Onboarding Flow")
    print("  4. Core Application Loop")
    print("  5. User Emotion Journey")
    print()
    print("Sections included:")
    print("  - Target Audience & Personas")
    print("  - Screen Inventory (14 screens)")
    print("  - User Story Map")
    print("  - UX Priorities & Open Issues")


if __name__ == "__main__":
    main()
