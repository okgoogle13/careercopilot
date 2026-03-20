# Feature Implementation Audit Checklist

**Date:** 2026-03-21
**Status:** Draft audit control artifact
**Source requirements:**
- `docs/archive/solution-design.md`
- `docs/archive/technical-requirements.md`
**Current authority for implementation truth:**
- runtime truth: `frontend/src/App.tsx` and routed feature/page surfaces
- design truth: `frontend/src/screens/**/*.wireframe.xml` with paired screen TSX
- capability truth: mounted backend endpoints under `backend/app/api/endpoints/`
- active migration controls: `control/route-matrix.md`, `control/route-matrix.json`, `control/gap-map.md`, `control/gap-map.json`, `control/status.md`

## How To Use This Checklist

Use this checklist when auditing whether shipped or in-flight implementation still matches the archived requirements set.

For each requirement cluster:
1. Confirm the owning route and runtime surface still match the route matrix.
2. Confirm backend capability still exists and remains mounted.
3. Record evidence from runtime truth, capability truth, tests, and active control docs.
4. Mark each item as one of:
   - `in_sync`
   - `partial`
   - `deferred`
   - `superseded`
   - `missing`
5. If the archived requirement conflicts with current product direction, record that explicitly instead of silently forcing the codebase back toward legacy assumptions.

## Requirements Traceability Matrix

| Requirement Cluster | Archived IDs | Solution Design Stories | Primary Routes / Owners | Current Audit Status | Audit Note |
| --- | --- | --- | --- | --- | --- |
| Auth & profile lifecycle | `REQ-1.1.1` to `REQ-1.1.5` | Epic 1, Stories 1.1 to 1.3 | `/login`, `/register`, `/onboarding`, `/welcome`, `/profile`, `/settings`, `/career/ingest`, `/documents` | `partial` | Auth entry and onboarding surfaces exist, but `/login`, `/register`, and `/welcome` remain planned merge routes in the active route matrix. |
| Document generation | `REQ-1.2.1` to `REQ-1.2.5` | Epic 2, Story 4.3 | `/cover-letter-generator`, `/ksc-generator`, `/documents`, `/apply/quick`, `/analysis` | `partial` | Cover letter, KSC, redline, and PDF/export surfaces exist; resume-tailoring and variation ownership should be checked against current backend contracts rather than legacy Firestore-era endpoints. |
| ATS analysis & optimization | `REQ-1.3.1` to `REQ-1.3.4` | Epic 3 | `/analysis`, support from `/apply/quick` | `partial` | ATS scoring, keyword-style guidance, and recommendations are live; iteration-over-iteration score tracking should be verified explicitly in runtime and API evidence. |
| Proactive job management | `REQ-1.4.1` to `REQ-1.4.4` | Epic 5.1 | `/opportunities`, `/job-queue`, `/apply/quick` | `deferred` | Current capability truth centers on job listings workbench and workflow generation; Gmail monitoring, Calendar creation, and push/email notifications are not yet closed as live product truth. |
| Theme & branding management | `REQ-1.5.1` to `REQ-1.5.4` | Epic 4.1 to 4.3 | cross-route, design-system-owned | `superseded` | Archived multi-theme requirements conflict with current KR Solidarity dark-only design canon; treat this as a product decision mismatch, not an implementation bug. |
| Performance | `REQ-2.1.1` to `REQ-2.1.5` | Performance targets in solution design | all AI and API-backed routes | `partial` | Targets remain useful as audit gates, but they need fresh evidence from current test and monitoring output. |
| Scalability & reliability | `REQ-2.2.1` to `REQ-2.3.4` | Architecture, monitoring, deployment sections | backend/platform-owned | `partial` | Audit against current Cloud Run/Postgres/Firebase hosting reality, not the legacy Firestore-first architecture text. |
| Security & privacy | `REQ-2.4.1` to `REQ-2.4.5` | Security & Privacy section | all authenticated routes and backend endpoints | `partial` | JWT auth, HTTPS, storage hygiene, and privacy controls remain required; APP/GDPR statements need current policy evidence. |
| Usability & accessibility | `REQ-2.5.1` to `REQ-2.5.4`, Section 8.3 | UX requirements and accessibility requirements | all user-facing routes | `partial` | Responsive behavior, progress feedback, actionable errors, keyboard support, and contrast should be checked route by route. |

## Route-Focused Audit Checklist

### 1. Auth & Onboarding

- [ ] `/login` matches current auth entry requirements and real auth flow, not a prototype shell.
- [ ] `/register` supports current profile bootstrap expectations and does not depend on deprecated contracts.
- [ ] `/onboarding` owns current welcome gate and voice/profile capture entry where required.
- [ ] `/welcome` is either promoted to current truth or explicitly documented as deferred.
- [ ] Evidence captured:
  - runtime owner from `App.tsx`
  - current UI feature surface
  - auth dependency / endpoint / service-client mapping
  - route-matrix status

### 2. Profile, Documents, and Ingestion

- [ ] `/profile` is the canonical voice-profile owner.
- [ ] `/settings` remains secondary account configuration only.
- [ ] `/career/ingest` owns active ingestion flow and uses `/api/v1/ingest`.
- [ ] `/documents` owns redline/review workflow and PDF/export evidence.
- [ ] Profile variation/version-history requirements are explicitly mapped to current runtime surfaces or marked deferred.
- [ ] Evidence captured:
  - canonical route owner
  - backend capability
  - support/reference surfaces
  - file storage / upload flow

### 3. Generation & Analysis

- [ ] `/cover-letter-generator` maps to the live cover-letter generation contract.
- [ ] `/ksc-generator` maps to the live KSC generation contract.
- [ ] `/analysis` maps to resume audit, ATS scoring, and recommendations.
- [ ] Persisted audit history and iteration evidence are verified if `REQ-1.3.4` is still expected.
- [ ] Any resume-tailoring or resume-variation requirement is mapped to a current route or recorded as a gap.
- [ ] Evidence captured:
  - endpoint(s)
  - test coverage
  - persisted-history support
  - export/output surfaces

### 4. Applications & Jobs

- [ ] `/tracker` remains the canonical CRUD owner; only environment verification is still pending.
- [ ] `/apply/quick` remains the execution owner for job analysis + workflow generation.
- [ ] `/opportunities` remains discovery/support, not the execution owner for job analysis.
- [ ] `/job-queue` remains queue/worklist-only unless product truth changes.
- [ ] Gmail monitoring / Calendar reminder / notifications requirements are either proven or explicitly marked deferred/superseded.
- [ ] Evidence captured:
  - route ownership
  - backend capability
  - current workflow contract
  - environment or auth blockers

## Cross-Cutting Audit Checklist

### Design-System / Branding Requirements

- [ ] Confirm whether archived multi-theme requirements are intentionally superseded by KR Solidarity dark-only canon.
- [ ] Verify document export surfaces still preserve current design tokens and typography.
- [ ] Record any requirement/doc conflict in the audit result rather than forcing both to read as true.

### Security / Privacy / Retention

- [ ] Verify authenticated API-only access remains true for protected user data.
- [ ] Verify temporary file cleanup behavior or document the current retention mechanism.
- [ ] Verify current privacy controls against Australian Privacy Principles and current storage architecture.

### Performance / Reliability / Accessibility

- [ ] Capture current evidence for document generation time, ATS response time, and general API latency.
- [ ] Capture current evidence for mobile/desktop responsiveness on canonical routes.
- [ ] Capture current evidence for progress indicators, actionable errors, keyboard navigation, and contrast.

## Legacy-Requirement Disposition Notes

These archived requirements should not be treated as automatically canonical without product-owner confirmation:

- `REQ-1.4.1` to `REQ-1.4.4`
  - Gmail monitoring, Calendar integration, and notification automation are not yet established as live capability truth in the active migration controls.
- `REQ-1.5.1` to `REQ-1.5.4`
  - 8-10 professional themes conflict with the current KR Solidarity dark-only canon.
- Technical stack assumptions in the archived docs
  - Firestore as primary database, OpenAI fallback, Anthropic fallback, and multi-theme PDF architecture conflict with the current repo-level AGENTS guidance and runtime stack.

## Immediate Follow-On Traceability Actions

- [ ] Execute this checklist route family by route family and record outcomes in a new audit report.
- [ ] Ratify whether archived proactive-job-management requirements remain in scope.
- [ ] Ratify whether archived multi-theme requirements are superseded by KR Solidarity.
- [ ] If ratified as superseded, update product-facing requirements docs so future audits do not inherit false drift.
