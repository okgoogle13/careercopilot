# Solution Requirements & Technical Specification

**Program:** PR126 frontend source-of-truth migration
**Status:** Draft canonical baseline
**Updated:** 2026-03-24
**Purpose:** Restore a single business-and-technical baseline for feature scope, ownership, and traceability while preserving the migration program's stricter execution authority model.

## Why This Exists

The older solution-design and technical-requirements documents were archived because they mixed durable product intent with assumptions that no longer match repo truth. They remain useful as input, but they cannot safely drive implementation without reconciliation.

Examples of drift in the archived set:

- multi-theme document requirements conflict with KR Solidarity dark-only canon
- Firestore is described as the primary database, while current runtime truth is Postgres with Firestore limited to legacy paths
- OpenAI and Anthropic fallback assumptions conflict with the current Genkit/Gemini-only runtime posture
- Gmail and Calendar automation appear as baseline requirements even though they are still deferred in active controls
- voice-profile ownership drifted from legacy settings-oriented framing to the current canonical `/profile` owner

This document revives the missing baseline-spec function without reopening those stale assumptions as execution truth.

## Authority Model

This document is the canonical **baseline requirements and traceability** artifact.

It is **not** the execution override.

Authority order remains:

1. Runtime truth: `frontend/src/App.tsx`, `frontend/src/features/**`, `frontend/src/pages/**`
2. Design truth: `frontend/src/screens/**/*.wireframe.xml` with paired screen TSX
3. Capability truth: mounted endpoints under `backend/app/api/endpoints/`
4. Route-level contracts: `contracts/*.xml`
5. Baseline spec and traceability: this document
6. Support artifacts: route matrix, gap map, inventories, advisory analyses

Rule: if this document disagrees with runtime, design, or capability truth, fix this document or record the discrepancy explicitly. Do not silently force the codebase back toward stale requirements.

## Source Inputs

- `docs/archive/solution-design.md`
- `docs/archive/technical-requirements.md`
- `docs/# Unified User Journey and Feature Docum.md`
- `control/blueprint.md`
- `control/status.md`
- `control/requirements-audit-checklist.md`
- `control/route-matrix.json`
- `control/gap-map.json`
- `contracts/*.xml`

## Document Rules

### Requirement Status Labels

- `implemented`
- `implemented_deferred_verification`
- `partial`
- `planned`
- `deferred`
- `superseded`

### Requirement ID Scheme

- `FR-AUTH-*` for authentication and profile lifecycle
- `FR-INGEST-*` for ingestion
- `FR-VOICE-*` for voice profile
- `FR-ANALYSIS-*` for audit and ATS analysis
- `FR-DOCS-*` for generation and document review
- `FR-TRACK-*` for application tracking
- `FR-JOBS-*` for opportunity discovery and job orchestration
- `NFR-*` for non-functional requirements

### Traceability Contract

Every in-scope requirement in this document must map to:

1. a canonical frontend owner
2. a backend capability or an explicit deferred marker
3. an implementation status
4. at least one evidence source, test, contract, or blocker note

## Product Scope Summary

CareerCopilot is an AI-assisted application workflow product for job seekers in community services, government, and adjacent mission-driven roles.

The current target product scope is:

- ingest user career artifacts and normalize them into reusable structured context
- analyze jobs and resumes for fit, gaps, and ATS readiness
- generate and refine application materials
- preserve user voice and personalization signals for downstream drafting
- track applications and related artifacts through a canonical workflow

Deferred or non-baseline items must be labeled as such rather than described as shipped capability.

## Current Canonical User Journey

### 1. Onboarding and Setup

- User authenticates and reaches the canonical runtime shell.
- Onboarding and profile setup may lead into ingestion, but `/welcome` and some auth-adjacent surfaces are still planned merge surfaces rather than final locked routes.

### 2. Ingestion and Profile Foundation

- `/career/ingest` owns the canonical upload-to-save ingestion workflow.
- Resume and source documents become reusable context for analysis and generation.
- `/profile` owns voice-profile management and identity-adjacent profile refinement.

### 3. Analysis and Strategy

- `/analysis` owns the resume-audit and ATS-style evaluation workflow.
- `/apply/quick` hosts the current canonical job-analysis result surface for immediate execution flows.

### 4. Document Generation and Review

- `/documents` owns redline/review workflow and document-workbench-style refinement.
- `/cover-letter-generator` and `/ksc-generator` remain canonical generation routes for their specialized outputs.

### 5. Application Execution and Tracking

- `/tracker` owns application CRUD, status changes, detail, and archive behavior.
- `/opportunities` and `/job-queue` support opportunity discovery and queue-style intake.

## Feature Baseline and Ownership

| Capability | Business Outcome | Frontend Owner | Backend Capability | Current State |
| --- | --- | --- | --- | --- |
| Auth and session lifecycle | secure user access and account continuity | `/login`, `/register`, `/onboarding`, `/profile`, `/settings` | mounted auth endpoints and auth dependencies | partial, with merge-surface cleanup still pending |
| Smart ingestion | convert uploaded source files into reusable structured context | `/career/ingest` | `/api/v1/ingest` | complete |
| Voice profile | capture and manage user writing-style signals for authentic downstream drafting | `/profile` | authenticated `GET/POST /api/v1/auth/voice-profile` | complete with deferred env verification |
| Resume audit and ATS analysis | evaluate fit, gaps, and improvement opportunities against target roles | `/analysis` | analysis and resume-audit endpoints | complete |
| Job analysis quick surface | provide one canonical result surface for current job-analysis flows | `/apply/quick` | job-analysis related endpoints and flows | complete |
| Redline and review | provide document comparison, markup, and revision workflow | `/documents` | document review and export capabilities | complete |
| Cover letter generation | generate tailored letters using job and profile context | `/cover-letter-generator` | generation endpoints / flows | complete |
| KSC generation | generate STAR-oriented government responses | `/ksc-generator` | generation endpoints / flows | complete |
| Application tracking | track application lifecycle and related artifacts | `/tracker` | applications CRUD endpoints | complete with deferred env verification |
| Opportunity discovery | surface and organize jobs for pursuit | `/opportunities`, `/job-queue` | jobs / queue capabilities | complete with some legacy automation still deferred |

## Functional Requirements Traceability Matrix

| Req ID | Requirement Statement | Primary Frontend Owner | Backend / Service Mapping | Archived Source | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| `FR-AUTH-001` | The system shall authenticate users and preserve account/session continuity across protected routes. | `/login`, `/register`, `/onboarding`, `/profile`, `/settings` | mounted auth endpoints and auth dependencies in `backend/app/api/endpoints/auth.py` | `REQ-1.1.1` | `partial` | `control/requirements-audit-checklist.md`, `control/route-matrix.json` |
| `FR-AUTH-002` | The system shall let users build and maintain a reusable profile foundation from uploaded career artifacts and account data. | `/career/ingest`, `/profile` | `/api/v1/ingest` plus profile/auth support services | `REQ-1.1.2`, `REQ-1.1.3` | `implemented` | `control/gap-map.json`, route owners in runtime truth |
| `FR-AUTH-003` | The system shall support route-owned profile management without collapsing `/profile` and `/settings` into one generic account page. | `/profile`, `/settings` | auth/profile service layer and contracts | draft journey doc plus migration control decisions | `implemented` | `contracts/build-contract-profile.xml`, account support-reference audit |
| `FR-INGEST-001` | The system shall provide one canonical upload-to-save ingestion workflow for source documents. | `/career/ingest` | `POST /api/v1/ingest` and related ingest handlers | solution design journey step 1 | `implemented` | `control/gap-map.json`, `control/status.md` |
| `FR-VOICE-001` | The system shall let users create and manage a voice profile from writing samples. | `/profile` | `GET/POST /api/v1/auth/voice-profile` | solution design story 2.4, `REQ-1.2.2` support dependency | `implemented_deferred_verification` | `contracts/build-contract-profile.xml`, `frontend/src/api/voiceProfileService.ts`, `control/status.md` blocker B8 |
| `FR-VOICE-002` | The system shall keep voice-profile ownership on `/profile` while `/settings` remains a secondary account surface only. | `/profile` | same capability as above | migration control decisions replacing legacy ambiguity | `implemented` | `control/gap-map.json`, `analysis/2026-03-16-support-reference-audit-account.md` |
| `FR-VOICE-003` | The system shall expose voice-profile state, submission, save, and update flows within the route-owned `/profile` experience. | `/profile` | voice profile service client and auth endpoint family | solution design story 2.4 | `implemented_deferred_verification` | `contracts/build-contract-profile.xml`, `frontend/src/features/profile/ProfileView.tsx` |
| `FR-ANALYSIS-001` | The system shall score resumes against target roles and surface actionable ATS-style analysis. | `/analysis` | analysis and resume-audit endpoint family | `REQ-1.3.1`, `REQ-1.3.2`, `REQ-1.3.3` | `implemented` | `control/requirements-audit-checklist.md`, `control/gap-map.json` |
| `FR-ANALYSIS-002` | The system shall provide one canonical result surface for current job-analysis flows. | `/apply/quick` | `POST /api/flows/analyze-job-from-url` | solution design phase 2 and 3 journey | `implemented` | `control/gap-map.json` `genkit_job_analysis` entry |
| `FR-DOCS-001` | The system shall generate tailored cover letters using user and job context. | `/cover-letter-generator` | generation endpoints and Genkit flows | `REQ-1.2.2` | `implemented` | route matrix, active generation routes |
| `FR-DOCS-002` | The system shall generate KSC responses for government-style applications. | `/ksc-generator` | generation endpoints and Genkit flows | `REQ-1.2.3` | `implemented` | route matrix, active generation routes |
| `FR-DOCS-003` | The system shall provide a canonical redline and document-review workflow. | `/documents` | document redline, review, and export capabilities | solution design workbench narrative | `implemented` | `control/gap-map.json`, `control/requirements-audit-checklist.md` |
| `FR-TRACK-001` | The system shall provide canonical application CRUD and status tracking. | `/tracker` | applications CRUD endpoints | solution design phase 5, `REQ-1.4` adjacent execution need | `implemented_deferred_verification` | `control/gap-map.json`, `control/status.md` blocker B5 |
| `FR-TRACK-002` | The system shall surface application detail as part of the canonical tracking workflow. | `/tracker` | applications CRUD plus tracker support components | solution design phase 5 | `implemented_deferred_verification` | tracker build contract and runtime owner |
| `FR-JOBS-001` | The system shall provide canonical opportunity discovery and queue-style intake surfaces. | `/opportunities`, `/job-queue` | jobs / queue backend capabilities | solution design phase 2 | `implemented` | route matrix and feature ownership |
| `FR-JOBS-002` | Gmail, Calendar, and notification automation shall remain explicitly deferred until capability truth and product ratification exist. | none as live canonical owner | not yet established as live capability truth | `REQ-1.4.1` to `REQ-1.4.4` | `deferred` | `control/requirements-audit-checklist.md`, `control/route-matrix.json` |

## Functional Requirements by Domain

### Auth and Profile Lifecycle

| Req ID | Requirement | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| `FR-AUTH-001` | Support authenticated entry and protected-route continuity. | auth routes + protected shell | `partial` | merge-surface cleanup is still pending for some auth-adjacent routes |
| `FR-AUTH-002` | Support reusable profile foundation from uploaded user artifacts. | `/career/ingest`, `/profile` | `implemented` | ingestion and profile are split canonical owners |
| `FR-AUTH-003` | Preserve account-surface ownership split between `/profile` and `/settings`. | `/profile`, `/settings` | `implemented` | prevents generic settings-page collapse |

### Ingestion

| Req ID | Requirement | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| `FR-INGEST-001` | Provide one canonical upload-to-save ingestion flow. | `/career/ingest` | `implemented` | `/api/v1/ingest` is the only canonical contract |

### Voice Profile

| Req ID | Requirement | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| `FR-VOICE-001` | Create and retrieve a user voice profile from writing samples. | `/profile` | `implemented_deferred_verification` | route complete; env-backed GET/POST verification pending |
| `FR-VOICE-002` | Keep voice-profile ownership on `/profile`, not `/settings`. | `/profile` | `implemented` | route ownership is contract-locked |
| `FR-VOICE-003` | Expose create, save, error, and update states in the route-owned voice workflow. | `/profile` | `implemented_deferred_verification` | frontend mounted; live-path verification pending |

### Analysis and Strategy

| Req ID | Requirement | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| `FR-ANALYSIS-001` | Provide canonical resume-audit and ATS evaluation. | `/analysis` | `implemented` | persisted-history evidence still tracked separately |
| `FR-ANALYSIS-002` | Provide one canonical job-analysis results surface. | `/apply/quick` | `implemented` | `/opportunities` is reference/support, not execution owner |

### Documents and Generation

| Req ID | Requirement | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| `FR-DOCS-001` | Generate tailored cover letters. | `/cover-letter-generator` | `implemented` | current canonical route |
| `FR-DOCS-002` | Generate KSC responses. | `/ksc-generator` | `implemented` | government use case retained |
| `FR-DOCS-003` | Provide route-owned redline and review workflow. | `/documents` | `implemented` | no separate top-level redline route |

### Tracking and Jobs

| Req ID | Requirement | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| `FR-TRACK-001` | Track application lifecycle through canonical CRUD. | `/tracker` | `implemented_deferred_verification` | env blocker remains |
| `FR-TRACK-002` | Show application detail and status workflows within tracker ownership. | `/tracker` | `implemented_deferred_verification` | route-level components are mounted |
| `FR-JOBS-001` | Surface discovery and job-intake queue workflows. | `/opportunities`, `/job-queue` | `implemented` | automation sub-capabilities are not all live |
| `FR-JOBS-002` | Keep Gmail/Calendar/notification workflow automation deferred until ratified. | none live | `deferred` | important requirement, not current shipped scope |

## Voice Profile Capability Definition

### Business Description

The voice-profile feature lets a user teach CareerCopilot how they naturally write so generated application materials can stay aligned with their tone, phrasing, and professional style.

### Frontend Description

- Canonical owner: `/profile`
- Runtime owner: `ProfileView`
- Route-owned support components:
  - `VoiceProfileManagementSection`
  - `VoiceProfileCreationPanel`
  - `VoiceSampleSubmissionForm`
  - `VoiceProfileStatusCard`
- User-facing responsibilities:
  - show whether a voice profile exists
  - allow writing-sample submission or replacement
  - show load, success, and error states
  - keep the workflow embedded inside `/profile`

`/settings` is a secondary account surface only and must not claim this capability.

### Backend Description

- Capability: `voice_profile_capture`
- Authenticated endpoint family: `GET/POST /api/v1/auth/voice-profile`
- Service purpose:
  - accept user writing samples
  - derive tone, style, vocabulary level, and preferred phrasing
  - return the current profile for downstream document generation and personalization

### Current Caveat

The feature is implemented and route ownership is resolved, but live environment verification remains blocked by the local Firebase/auth readiness issue recorded in `control/status.md`.

## Endpoint and Route Mapping

| Capability | Canonical Route Owner | Backend Interface | Current Notes |
| --- | --- | --- | --- |
| Smart ingestion | `/career/ingest` | `/api/v1/ingest` | canonical upload-to-save flow |
| Voice profile | `/profile` | `GET/POST /api/v1/auth/voice-profile` | implemented, env verification pending |
| Resume audit | `/analysis` | analysis and resume-audit endpoints | implemented |
| Job analysis | `/apply/quick` | `POST /api/flows/analyze-job-from-url` | canonical execution owner |
| Documents redline | `/documents` | document redline/review/export capability family | implemented |
| Applications CRUD | `/tracker` | applications CRUD endpoints | implemented, env verification pending |

## Traceability Rules

Each baseline feature entry should be traceable across these layers:

| Layer | Evidence Type |
| --- | --- |
| Business requirement | capability row in this document |
| Route ownership | `control/route-matrix.json` |
| Component ownership | `control/gap-map.json` and `contracts/*.xml` |
| Runtime truth | reachable route and mounted feature/page |
| Capability truth | mounted backend endpoint or Genkit-backed service |
| Verification | tests, validator output, or documented blocker in `control/status.md` |

Minimum traceability expectation for any major feature:

1. one named business capability
2. one canonical route owner
3. one backend capability owner or an explicit deferred status
4. one current implementation state
5. one source of verification evidence or blocker record

## Deferred and Out-of-Scope Requirements

These items remain important but are not current baseline shipped scope:

- Gmail and Calendar workflow orchestration
- notification automation that depends on those integrations
- multi-theme document branding
- any requirement that assumes Firestore is the primary live application database
- any fallback-model requirement that conflicts with current Genkit/Gemini configuration

These should remain visible in planning discussions, but they should not be written as live scope until product and engineering ratify them.

## Archived-to-Current Disposition

| Archived Requirement Set | Current Disposition | Reason |
| --- | --- | --- |
| `REQ-1.4.1` to `REQ-1.4.4` proactive job automation | `deferred` | current capability truth and product ratification are incomplete |
| `REQ-1.5.1` to `REQ-1.5.4` multi-theme branding | `superseded` | conflicts with KR Solidarity dark-only canon |
| Firestore-primary data assumptions | `superseded` | current repo truth uses Postgres as the primary live store with Firestore limited to legacy scope |
| OpenAI / Anthropic fallback assumptions | `superseded` | current runtime posture is Genkit/Gemini without fallback as execution truth |

## Non-Functional Baseline

The active baseline retains these categories from the archived requirements set, but they must be validated against current architecture before being used as acceptance gates:

- performance
- scalability and reliability
- security and privacy
- usability and accessibility

### Non-Functional Traceability

| Req ID | Requirement Category | Baseline Statement | Current Status | Evidence Source |
| --- | --- | --- | --- | --- |
| `NFR-001` | Performance | document generation, ATS analysis, and API latency targets remain important baseline expectations | `partial` | repo-root `AGENTS.md`, `control/requirements-audit-checklist.md` |
| `NFR-002` | Reliability and scalability | hosting, persistence, and recovery expectations remain in scope but require current-platform validation | `partial` | `control/requirements-audit-checklist.md` |
| `NFR-003` | Security and privacy | authenticated API-only access, storage hygiene, and privacy compliance remain baseline expectations | `partial` | repo-root `AGENTS.md`, `control/requirements-audit-checklist.md` |
| `NFR-004` | Usability and accessibility | responsive layout, actionable errors, progress states, and accessibility remain baseline expectations | `partial` | `control/requirements-audit-checklist.md` |

Use `control/requirements-audit-checklist.md` to record whether each category is:

- `in_sync`
- `partial`
- `deferred`
- `superseded`
- `missing`

## Document Maintenance Rules

- Update this document when product scope, route ownership, or backend capability ownership changes.
- Do not use this document to hide unresolved drift; record mismatches explicitly.
- Keep execution detail in `control/blueprint.md`, `control/workflow.md`, and route-level contracts.
- Keep PM status in `control/status.md` and `control/pm/dashboard.md`.
- Keep this document focused on baseline requirements, ownership, and traceability.
