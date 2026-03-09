# CareerCopilot — User Journey Analysis

> **Generated:** 2026-03-09  
> **Scope:** Onboarding, core resume/cover-letter/ATS flows, export  
> **Diagram:** [`docs/diagrams/user-journey.mmd`](../diagrams/user-journey.mmd)

---

## 1. Current End-to-End User Journey

### 1.1 Journey Summary (First Touch → Successful Outcome)

| Stage | Screen / Route | Key Code Location |
|-------|---------------|-------------------|
| Landing | `/` `LandingPage` | `frontend/src/features/landing/LandingPage.tsx` |
| Registration | `/register` `Register` | `frontend/src/features/auth/Register.tsx` |
| Login | `/login` `Login` | `frontend/src/features/auth/Login.tsx` |
| Onboarding — domain selection | `/onboarding` `OnboardingPage` | `frontend/src/features/onboarding/OnboardingPage.tsx` |
| Resume upload & extraction | `/career/ingest` `IngestionPage` | `frontend/src/pages/IngestionPage.tsx` |
| Profile validation | `ValidationDashboard` | `frontend/src/features/onboarding/components/ValidationDashboard.tsx` |
| Main hub | `/dashboard` `Dashboard` | `frontend/src/features/dashboard/Dashboard.tsx` |
| ATS analysis | `/analysis` `AnalysisPage` | `frontend/src/pages/AnalysisPage.tsx` |
| Cover letter | `/cover-letter-generator` `CoverLetterGenerator` | `frontend/src/features/applications/CoverLetterGenerator.tsx` |
| KSC responses | `/ksc-generator` `KSCGenerator` | `frontend/src/features/ksc-generator/KSCGenerator.tsx` |
| Export / share | Inline within generators | `exportToPdf()`, copy-to-clipboard |

### 1.2 Auth & Session

- **Technology:** Firebase Authentication (email/password) via `AuthContext` (`frontend/src/context/AuthContext.tsx`).
- **Offline/demo mode:** `?demo=true` query param bypasses auth for public demos (`App.tsx` lines 171–279, `ProtectedLayout`).
- **Guard:** `ProtectedLayout` wraps all authenticated routes and redirects to `/login` when unauthenticated.

### 1.3 Onboarding Step Details

1. **`Register.tsx`** — collects display name, email, and password. On success, immediately navigates to `/onboarding`.
2. **`OnboardingPage.tsx`** ("Choosing the Soil") — presents 9 domain cards (Social Work, Healthcare, Education, Government, Community Services, Non-Profit, Mental Health, Disability Services, Youth Support). User must select one; the "Fertilize Selection" CTA navigates to `/career/ingest`.
3. **`IngestionPage.tsx`** ("Deposit Identity") — multi-stage file upload (PDF/DOCX). Stages: `idle → uploading → extracting → processing → embedding → complete`. On completion, renders `ValidationDashboard` for the user to review and edit extracted career data.
4. **`Dashboard`** ("Solidarity Hub") — metrics hub with three primary CTAs: *Deposit KrMotif*, *View Archive*, *Automated Synthesis*. Shows a 2×2 grid of recent synthesis cards each with a "Generate Artifacts →" link.

### 1.4 Core AI Feature Flows

#### ATS Scoring (`/analysis`)
- User pastes resume text and a job description (or URL) into `AnalysisPage`.
- Calls `POST /api/v1/analysis/ats-score` → returns overall score (0–100), category breakdown, and matched/missing keywords.
- Results rendered in `SkillBreakdownCard` with category pills and keyword chips.
- User can trigger `POST /api/v1/analysis/strategy` to get an optimised resume.

#### Cover Letter Generator (`/cover-letter-generator`)
- 4-step wizard in `CoverLetterGenerator.tsx`:
  1. Job details (URL auto-fill via `genkitApi.analyzeJobFromUrl()`).
  2. Company insights (name, culture, values).
  3. Final touches (tone, special instructions).
  4. Generated result with copy/PDF export.

#### KSC Generator (`/ksc-generator`)
- 3-step wizard in `KSCGenerator.tsx`:
  1. Selection criteria (URL extraction or manual paste).
  2. STAR method inputs (Situation, Task, Action, Result).
  3. APS ILS-aligned response with export options.
- Draft auto-save via `api.saveKSCDraft()`.

### 1.5 Export & Sharing
- PDF export: `exportToPdf()` used in both `CoverLetterGenerator` and `KSCGenerator`.
- Copy-to-clipboard available on all generated outputs.
- Documents accessible via `/documents` for past artefacts.

---

## 2. Onboarding Experience Evaluation

### 2.1 Strengths
- Clear sequential flow: Register → Domain → Ingest → Dashboard.
- Domain selection provides meaningful early context (9 professional sectors).
- File upload provides visual progress (5 stages with descriptive labels).
- `ValidationDashboard` reduces risk of incorrect AI profile data.

### 2.2 Identified Onboarding Weaknesses

#### W1 — No value proposition before or during registration
**Code location:** `Register.tsx`, `OnboardingPage.tsx`  
**Diagram node:** `REGISTER`, `ONBOARDING`  
A new user who arrives at `/register` sees a form immediately but receives no explanation of *what CareerCopilot does*, *who it is for*, or *what they will achieve* by registering. The landing page has a hero, but after clicking "Register" the context vanishes entirely. The onboarding page title ("Choosing the Soil") and domain card labels use domain-specific metaphors that may confuse users unfamiliar with the Kerala Rage design vocabulary.

#### W2 — No onboarding progress indicator
**Code location:** `OnboardingPage.tsx`, `IngestionPage.tsx`, `Dashboard.tsx`  
**Diagram nodes:** `ONBOARDING` → `INGEST` → `STAGE_COMP` → `DASHBOARD`  
There is no "Step 2 of 3" or progress stepper shown across the onboarding sequence. A user completing domain selection has no signal that uploading a resume is next, and someone on the ingestion page has no awareness of how many more steps remain before they reach the hub.

#### W3 — IngestionPage has no fallback for skipping
**Code location:** `IngestionPage.tsx`, routing in `App.tsx`  
**Diagram nodes:** `INGEST`, `STAGE_COMP`  
There is no "Skip for now" or "I'll add my resume later" option. If a user does not have a file available, they are blocked from reaching the Dashboard. The compliance note at the bottom of the page does not substitute for an escape hatch.

#### W4 — Dashboard empty/cold-start state is not differentiated from active state
**Code location:** `Dashboard.tsx` (Recent Synthesis grid, Metric bar)  
**Diagram node:** `DASHBOARD`  
The Dashboard renders mock/static data (calibration scores of 92, 85, 78, 88; "2m ago" timestamps) regardless of whether the user has any real data. A brand-new user who has just ingested their first resume sees the same layout as an experienced user. There is no empty state that explains the grid, no first-run checklist to guide the user to their first "aha moment", and no CTA pointing them specifically towards the most impactful next action.

#### W5 — Sidebar navigation labels use internal jargon
**Code location:** `frontend/src/layouts/Sidebar.tsx`  
**Diagram node:** `SIDEBAR`  
Navigation items such as "Opportunities" and "Asset Library" are not self-explanatory to a new user. The label "Analysis" does not communicate "ATS Score your resume against a job ad". First-time users have to explore to discover features.

#### W6 — Cover letter and KSC generators are discovery-dead-ends
**Code location:** `CoverLetterGenerator.tsx`, `KSCGenerator.tsx`  
**Diagram nodes:** `CL`, `KSC`  
Users reach the generators via the sidebar, but after generating a document there is no prompt to "Now run your ATS analysis" or "Save this to your Documents". Each tool is a standalone island with no suggested next step contextualising how the tools relate to each other.

#### W7 — No analytics or funnel visibility
**Code location:** `main.tsx` (Sentry only), no Segment/GA/Mixpanel events  
**Diagram:** No telemetry nodes represented  
Only Sentry error tracking is implemented. There are no custom analytics events for key activation milestones (domain selected, first resume uploaded, first ATS score run, first cover letter generated). Product teams cannot measure funnel drop-off or optimise the onboarding journey.

---

## 3. Diagram Coverage Gaps

| Gap | Description |
|-----|-------------|
| Settings / Profile routes | `/settings` and `/profile` exist in routing but are not shown in the Mermaid diagram's core flow (they are sidebar-accessible utilities). |
| Job Scout autonomous flow | `/opportunities` is represented but the autonomous job-search loop (background agent) is not modelled. |
| Application Tracker | `/tracker` is sidebar-accessible but not connected to the post-generation export flow in the diagram. |
| Error recovery paths | Only ingestion errors are shown; auth failures, API failures in generators, and network errors are not modelled. |

---

## 4. Prioritised UX Recommendations

### 🔴 HIGH — H1: Welcome / Value-Proposition Screen

**Area:** Onboarding flow  
**Priority:** High  
**Description:**  
Insert a full-screen or modal welcome step immediately after the user completes registration (between `Register.tsx` and `OnboardingPage.tsx`) or embed it as the first card of `OnboardingPage.tsx`.  

Content:
- Headline: *"Land the job you actually want."*
- 3 short benefit bullets:
  1. Upload your resume once — AI extracts and organises your career history.
  2. Paste any job ad and get a tailored cover letter in under a minute.
  3. Nail Key Selection Criteria responses with guided STAR prompts.
- Single CTA: *"Get started →"* navigates to domain selection.

**Rationale:** Without a value proposition, users arriving via organic search or referral links do not understand the product before they are asked to make decisions (domain selection). This increases bounce and reduces completion of the ingestion step.

**Implementation notes:**
- Create `frontend/src/features/onboarding/WelcomeScreen.tsx` (new component).
- Add route `/welcome` or render it as a conditional first step in `OnboardingPage.tsx` gated on `user.isNewUser` flag.
- Mark `isNewUser = false` in user profile after the welcome screen is dismissed.

---

### 🔴 HIGH — H2: Onboarding Progress Stepper

**Area:** Onboarding flow  
**Priority:** High  
**Description:**  
Add a visible step indicator across the 3–4 onboarding screens (Welcome → Domain Selection → Resume Upload → Dashboard).

Example copy:
- Step 1 of 3 — Choose your field
- Step 2 of 3 — Upload your resume
- Step 3 of 3 — Your hub is ready!

**Rationale:** Users who cannot see an end point abandon multi-step flows at higher rates. A stepper reduces anxiety, sets expectations, and signals completion proximity.

**Implementation notes:**
- Create `frontend/src/features/onboarding/OnboardingProgress.tsx` (new component, reusable stepper).
- Integrate into `OnboardingPage.tsx` and `IngestionPage.tsx`.
- Pass `currentStep` and `totalSteps` as props.

---

### 🔴 HIGH — H3: Dashboard First-Run Checklist / Activation Checklist

**Area:** Dashboard empty state / activation  
**Priority:** High  
**Description:**  
Replace the static mock data grid on a new user's first visit with an activation checklist. After the user completes each item, mark it as done and surface the next action.

Checklist items:
- [ ] Upload your resume *(links to `/career/ingest`)*
- [ ] Run your first ATS score *(links to `/analysis`)*
- [ ] Generate a tailored cover letter *(links to `/cover-letter-generator`)*
- [ ] Create your first KSC response *(links to `/ksc-generator`)*

Show completion percentage (e.g. "2 of 4 complete").

**Rationale:** First-time users see metrics and "Generate Artifacts" CTAs that have no context. A checklist drives them sequentially toward the core activation loop, and each item completed increases retention probability.

**Implementation notes:**
- Create `frontend/src/features/dashboard/OnboardingChecklist.tsx`.
- Persist checklist state in user profile (backend) or `localStorage` as a fallback.
- Conditionally render checklist vs. full dashboard metrics based on `activationComplete` flag.
- Add a "Dismiss" option once all 4 items are complete.

---

### 🟡 MEDIUM — M1: IngestionPage "Skip for now" Escape Hatch

**Area:** Onboarding flow  
**Priority:** Medium  
**Description:**  
Add a secondary action beneath the upload form: *"I don't have my resume ready — skip for now →"*. Navigates directly to `/dashboard`. Persist a reminder banner on the dashboard prompting the user to complete ingestion.

**Rationale:** Blocking users from reaching the dashboard until they upload a file creates a hard drop-off point. Some users may want to explore the tool before committing to the upload.

**Implementation notes:**
- Add `skipIngestion()` handler in `IngestionPage.tsx` that calls `navigate('/dashboard')`.
- Store `hasCompletedIngestion: false` in user profile.
- Show dismissible banner in `Dashboard.tsx`: *"Add your resume to unlock personalised insights."*

---

### 🟡 MEDIUM — M2: Helpful Empty States in Documents, Analysis, Applications

**Area:** Empty states across feature pages  
**Priority:** Medium  
**Description:**  
Each feature page (`/documents`, `/analysis`, `/tracker`) should show a purpose-built empty state when no data exists, rather than a blank page or generic "No items found" message.

Examples:
- `/documents` empty: *"Your generated documents will appear here. Start with a cover letter →"* (CTA to `/cover-letter-generator`)
- `/analysis` empty: *"Paste your resume and a job ad to see how well they match. Your ATS score appears here."*
- `/tracker` empty: *"Track every job you apply to. Add your first application →"*

**Rationale:** Empty pages are demotivating and imply the tool is broken. Contextual empty states explain the purpose of the screen and provide a clear, immediate action.

**Implementation notes:**
- Create a shared `EmptyState` component in `frontend/src/components/ui/EmptyState.tsx` with props: `icon`, `title`, `description`, `ctaLabel`, `ctaHref`.
- Import and render in `Documents.tsx`, `AnalysisPage.tsx`, `ApplicationTracker.tsx` when data arrays are empty.

---

### 🟡 MEDIUM — M3: Contextual "Next Step" Prompts After AI Generation

**Area:** AI Generation & Iteration → Export  
**Priority:** Medium  
**Description:**  
After a user successfully generates a cover letter or KSC response, show a "What's next?" prompt linking to related actions:
- After cover letter: *"Run an ATS check on your resume for this role →"* (links to `/analysis` pre-filled with the same job description).
- After ATS analysis: *"Now generate a tailored cover letter →"* (links to `/cover-letter-generator` with job URL pre-filled).
- After KSC: *"Save this to Documents →"*.

**Rationale:** Each AI tool is currently an island. Prompting users to the next logical step in the application workflow increases feature discovery, session depth, and overall value delivered.

**Implementation notes:**
- Add a `PostGenerationCTA` component rendered in the result step of `CoverLetterGenerator.tsx` (Step 4) and `KSCGenerator.tsx` (Step 3).
- Pass job description URL/text as query params when navigating to the next tool.

---

### 🟡 MEDIUM — M4: Improved Sidebar Labels

**Area:** Navigation  
**Priority:** Medium  
**Description:**  
Update sidebar navigation labels to plain-language descriptions:

| Current | Proposed |
|---------|----------|
| Analysis | ATS Score & Optimise |
| Opportunities | Job Scout |
| Asset Library | *(consider removing or relabelling to "Templates")* |
| Documents | My Documents |

**Rationale:** Jargon labels ("Analysis", "Opportunities", "Asset Library") require exploration to understand. Plain-language labels reduce cognitive load for new users.

**Implementation notes:**
- Update `frontend/src/layouts/Sidebar.tsx` nav item labels.
- No routing changes required.

---

### 🟢 LOW — L1: Role / JTBD Self-Segmentation in Onboarding

**Area:** Onboarding flow  
**Priority:** Low  
**Description:**  
Extend the domain selection step with a secondary segmentation question: *"What best describes your situation?"*
- 🎓 Recent graduate entering the workforce
- 🔄 Changing careers or sectors
- 📈 Senior professional seeking advancement
- 🌏 Migrant / international applicant

Use the response to personalise dashboard copy, example job descriptions, and suggested features.

**Rationale:** The current 9-domain selector captures *what sector* but not *where the user is in their career*. JTBD segmentation enables targeted guidance (e.g. a recent grad is directed to KSC guides, a senior professional to the optimisation flow).

**Implementation notes:**
- Add a second step to `OnboardingPage.tsx` with 4 segmentation cards.
- Store `userSegment` in user profile.
- Use segment in `Dashboard.tsx` to show contextual welcome copy.

---

### 🟢 LOW — L2: Analytics Event Instrumentation

**Area:** Telemetry  
**Priority:** Low  
**Description:**  
Add custom analytics events at key activation milestones. Minimum recommended events:

| Event | Trigger |
|-------|---------|
| `onboarding_domain_selected` | Domain card selected in `OnboardingPage` |
| `resume_ingestion_started` | File upload initiated in `IngestionPage` |
| `resume_ingestion_completed` | Stage reaches `complete` |
| `ats_score_run` | ATS analysis submitted in `AnalysisPage` |
| `cover_letter_generated` | Step 4 rendered in `CoverLetterGenerator` |
| `ksc_generated` | Step 3 rendered in `KSCGenerator` |
| `document_exported` | PDF downloaded or copied |

**Rationale:** Without funnel telemetry, there is no data-driven basis for prioritising UX improvements. Instrumentation enables measurement of onboarding completion rates, feature adoption, and export conversion.

**Implementation notes:**
- Integrate a lightweight analytics library (Posthog or Google Analytics 4).
- Create a `useAnalytics()` hook in `frontend/src/hooks/useAnalytics.ts`.
- Call from each component at the appropriate lifecycle event.

---

## 5. Files Inspected

| File | Purpose |
|------|---------|
| `frontend/src/App.tsx` | Route definitions and layout structure |
| `frontend/src/context/AuthContext.tsx` | Firebase auth state management |
| `frontend/src/features/auth/Login.tsx` | Login form and redirect logic |
| `frontend/src/features/auth/Register.tsx` | Registration form and post-auth redirect |
| `frontend/src/features/onboarding/OnboardingPage.tsx` | Domain selection — onboarding step 1 |
| `frontend/src/pages/IngestionPage.tsx` | Resume upload and extraction — onboarding step 2 |
| `frontend/src/features/onboarding/components/ValidationDashboard.tsx` | Profile review — onboarding step 3 |
| `frontend/src/features/dashboard/Dashboard.tsx` | Main hub — post-onboarding home |
| `frontend/src/layouts/Sidebar.tsx` | Navigation structure |
| `frontend/src/pages/AnalysisPage.tsx` | ATS scoring and resume optimisation |
| `frontend/src/features/applications/CoverLetterGenerator.tsx` | 4-step cover letter wizard |
| `frontend/src/features/ksc-generator/KSCGenerator.tsx` | 3-step KSC wizard |
| `frontend/src/main.tsx` | App entry point and Sentry initialisation |
| `backend/app/api/router.py` | FastAPI endpoint registration |
| `docs/diagrams/user-journey.mmd` | *(created by this analysis)* |

---

## 6. Summary: Top 3 High-Priority Recommendations

1. **H1 — Welcome / Value-Proposition Screen** (`WelcomeScreen.tsx`): Add a pre-domain-selection screen that explains what CareerCopilot does, who it is for, and what the user will achieve. Eliminates the context vacuum a new user experiences after registering.

2. **H2 — Onboarding Progress Stepper** (`OnboardingProgress.tsx`): Add a "Step X of Y" indicator spanning the onboarding sequence so users know how many steps remain and do not abandon mid-flow.

3. **H3 — Dashboard First-Run Activation Checklist** (`OnboardingChecklist.tsx`): Replace the static mock-data grid shown to new users with a 4-item activation checklist (upload resume → ATS score → cover letter → KSC). Each item links to the relevant tool and marks itself complete when done.
