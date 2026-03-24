# Unified User Journey and Feature Document: CareerCopilot

## 1. Unified Product Vision

CareerCopilot is an advanced, AI-driven career management platform designed to give job seekers an asymmetric advantage in the modern hiring landscape. By synthesizing the raw, generative AI power of the **Prototype** with the robust, scalable architecture and striking "Kerala Rage" design system of the **Working Repository**, the unified product delivers a seamless, end-to-end application pipeline.

**Key Specifications & Features:**

* **Frontend Architecture:** React 18+, heavily utilizing `Zustand` for global state (theme, user session, strictness modes) and `TanStack Query` for asynchronous data fetching, caching, and mutation.
* **Design System (Kerala Rage / KrSolidarity):** A highly opinionated, dark-mode-exclusive M3-based UI. It utilizes semantic archetypes (`Strike` for primary actions, `Placard` for content framing, `Scaffold` for inputs) and advanced Framer Motion physics (`typeSpringSlam`, `dragSettle`) to create a tactile, street-art-inspired aesthetic.
* **Backend & AI Integration:** A centralized API client layer (`apiClient.ts`) interfacing with a Python/FastAPI backend. AI capabilities are powered by Google Genkit/Gemini, orchestrating complex workflows like 4-Quadrant Resume Audits, STAR-method KSC generation, and autonomous job scouting.
* **Data Persistence:** Firebase Auth for identity, Firebase Storage for raw assets, and pgvector (via backend) for semantic career data retrieval and RAG (Retrieval-Augmented Generation) pipelines.

---

## 2. The Optimal User Journey

The unified platform guides the user through a highly structured, tactical pipeline—from initial data ingestion to final application tracking.

* **Step 1: Induction & Ingestion (The Foundation)**
  * The user enters the `KrDarkOnboarding` flow. After login, they encounter a 'Choose Your Path' screen to immediately define if they want to set up their profile or jump straight into a quick job application.
  * Using the **Smart Ingestion** module, the user uploads their master resume (PDF/DOCX). The backend parses this into a structured `CareerDatabase` (vectorized for AI retrieval).
  * If the user skips ingestion to minimize friction, the Dashboard surfaces a dismissible 'Getting Started' checklist incentivizing document uploads with clear benefit callouts (e.g., 'Upload your resume to unlock ATS scoring').
  * *Extension:* The user installs the **Chrome Extension**, enabling them to clip job descriptions directly from external job boards (Seek, LinkedIn) into their CareerCopilot pipeline.
* **Step 2: Reconnaissance & Scouting (The Lookout)**
  * The user navigates to the **Job Scout / Lookout Feed**. Here, jobs clipped via the Chrome Extension or found via autonomous scouting are queued. If the queue is empty, an illustrated empty state prompts the user to trigger a job search or email scan.
  * Alternatively, the user utilizes a prominent 'Paste Job URL' quick-action on the Dashboard to target a specific role directly.
  * The user reviews high-level match scores and selects a target role to pursue.
* **Step 3: Intelligence & Strategy (The Audit)**
  * The user runs the **4-Quadrant ATS Analysis** against the target job. A 'Your Documents' summary widget is displayed so the user knows exactly what context the AI is using for this analysis.
  * If the system detects a government-related job posting during analysis, it dynamically triggers a 'Government Application detected: Generate KSC responses' call-to-action.
  * The system outputs a detailed audit: Hard Skills Match, Soft Skills & Verbs, Quantifiable Impact, and ATS Readability.
* **Step 4: The Generation Workbench (The Forge)**
  * **Resume Tailoring:** The user enters the `DocumentWorkbench`. Clear step counters (e.g., Step 2 of 3) and estimated time labels guide the process. The AI proposes specific, line-by-line rewrites of their resume bullets to match the job description.
  * **Cover Letter & KSC:** The user generates a tailored Cover Letter and 'Key Selection Criteria (KSC) — Government Applications' responses using guided STAR-method prompts. A 'Context used: X documents' badge clarifies AI provenance. If unsatisfied, a 'Regenerate with different style' quick action allows rapid pivoting.
  * Following their first successful document generation, the system introduces a 'Teach the AI your voice' prompt to build a custom voice profile.
  * **Image Studio:** The user generates or edits professional headshots or portfolio assets using Gemini Flash Image models directly within the platform.
* **Step 5: Deployment & Tracking (The Kanban)**
  * The finalized artifacts are exported (PDF/DOCX) or copied to the clipboard.
  * The application is moved to the **Kanban Tracker**, where the user monitors state transitions (Applied → Interviewing → Offer).
  * Clicking an application opens a dedicated 'Application Detail' unified workspace housing the job description, the specific resume version used, the cover letter, and tracking status all in one place.
  * Back on the Dashboard, a mini score-trend chart visualizes ATS scores across their last 5 applications. Mobile users experience an optimized bottom navigation prioritizing 'Find', 'Generate', and 'Track'.
  * The user utilizes the **Interview Prep** module to practice AI-generated behavioral and technical questions based on the specific job description.

---

## 3. Feature Synergy Map

This section maps how the raw functional capabilities of the Prototype are elevated by the enterprise-grade architecture of the Working Repository, categorized by the five journey phases.

### Phase 1: Induction & Ingestion

* **Onboarding Path Bifurcation & Dashboard Checklist**
  * *Working Repo Synergy:* Utilizes the established `KrDarkOnboarding` shell and Zustand `userStore` to manage first-time user states.
  * *UX Fix:* Implements a 'Choose Your Path' screen after login to clearly separate profile setup from immediate application generation (UX-13).
  * *UX Fix:* Adds a dismissible 'Getting Started' checklist on the Dashboard for users who skip ingestion, ensuring they aren't left without contextual guidance (UX-02, Direction 1).
  * *API / Flow:* `GET /api/v1/user/master-status`, `PATCH /api/v1/career-database` | Flow: `user_initialization_flow`

### Phase 2: Reconnaissance & Scouting

* **Chrome Extension Job Clipping ➡️ The Lookout / Job Queue**
  * *Prototype Logic:* `background.ts` and `content.ts` extract raw DOM text from job boards.
  * *Working Repo Synergy:* The clipped data is sent to the backend and immediately hydrated into the `JobQueue.tsx` via `TanStack Query`. It appears as a `Placard` card in the UI, triggering the `useKrDarkData` feed for real-time alerts.
  * *UX Fix:* Adds an illustrated empty state to the Opportunities and Job Queue screens prompting the user to search or run an email scan when no jobs exist (UX-04).
  * *API / Flow:* `GET /api/v1/ingest/queue`, `POST /api/v1/job-scout/search` | Flow: `autonomous_job_scouting_flow`
* **Manual Entry vs. Discovery Modes**
  * *Working Repo Synergy:* Enhances the Dashboard to act as a dual-purpose command center.
  * *UX Fix:* Introduces a prominent 'Paste Job URL' quick-action on the Dashboard for targeted hunting, while keeping the 'Discovery' tab for broader browsing (Direction 4).
  * *API / Flow:* `POST /api/v1/flows/analyze-job-from-url` | Flow: `analyzeJobFromUrl`

### Phase 3: Intelligence & Strategy

* **Contextual Intelligence & Data Provenance**
  * *Working Repo Synergy:* Leverages the `AnalysisWorkbench` to execute the 4-Quadrant Resume Audit.
  * *UX Fix:* Surfaces a 'Your Documents' summary widget within the Analysis page to clarify the tight data dependency between the user's ingested career history and the AI's output (UX-05).
  * *UX Fix:* Contextually surfaces a 'Government Application detected: Generate KSC responses' CTA directly within the Job Analysis view when public sector roles are identified (Direction 2).
  * *API / Flow:* `POST /api/v1/resume-audit/evaluate`, `POST /api/v1/analysis/ats-score` | Flow: `matchAnalysisFlow`

### Phase 4: Generation Workbench

* **Tailored Resume View (Inline AI Polishing) ➡️ Document Workbench**
  * *Prototype Logic:* `TailoredResumeView.tsx` allows users to see line-by-line AI suggestions for resume bullets and click "Apply" or "Discard".
  * *Working Repo Synergy:* This interaction is rehoused inside the `DocumentWorkbench.tsx` shell. The "Apply/Discard" actions are wired to `useMutation` hooks to instantly update the user's `CareerDatabase` in the backend, while rendering with the `Strike` (button) and `StatusBadge` KR design tokens.
  * *UX Fix:* Adds clear step counters (e.g., "Step 2 of 3") and estimated time labels to all multi-step generation flows to eliminate progress opacity (UX-01).
  * *UX Fix:* Injects a 'Context used: X documents' badge on all generated outputs to prove grounding data was applied (UX-06).
  * *UX Fix:* Adds a 'Regenerate with different style/tone' quick action immediately below the output for frictionless iteration (UX-11).
  * *API / Flow:* `POST /api/v1/documents/optimize-content` | Flow: `optimizeResumeFlow`
* **KSC Generator Refinement & Voice Profiling**
  * *Working Repo Synergy:* Integrates the KSC generation logic into the formal Document Workbench.
  * *UX Fix:* Relabels the tool to 'Key Selection Criteria (KSC) — Government Applications' and adds an explanatory tooltip for users unfamiliar with AU/NZ government hiring standards (UX-03).
  * *UX Fix:* Introduces a 'Teach the AI your voice' prompt immediately after the user's first successful document generation, porting them to the Voice Profile setup in Settings (Direction 3).
  * *API / Flow:* `POST /api/v1/documents/generate-ksc-response`, `POST /api/v1/auth/voice-profile` | Flow: `generateKSCResponseFlow`
* **Cover Letter Specific Metrics ➡️ Analysis Results Shell**
  * *Prototype Logic:* `CoverLetterSpecificMetrics.tsx` calculates granular scores (Keyword Placement, Narrative Quality, Personalization, Tone).
  * *Working Repo Synergy:* These metrics are integrated into the `AnalysisWorkbench.tsx` and `CoverLetterGenerator.tsx`. They will be visualized using the Working Repo's sophisticated `MetricCard.tsx` and `AuditDial.tsx` (SVG radial progress bars).
  * *API / Flow:* `POST /api/v1/documents/generate-cover-letter` | Flow: `generateCoverLetterFlow`
* **Image Studio ➡️ Asset Library / Profile**
  * *Prototype Logic:* `ImageStudio.tsx` uses `@google/genai` to generate/edit images via prompts.
  * *Working Repo Synergy:* The raw Genkit browser calls are moved to the backend and exposed via `apiClient.ts`. The UI is ported into the `AssetLibrary.tsx` or a new `KrDarkDesigner` view, utilizing the `ScaffoldInput` for prompting and `Placard` for image framing.
  * *API / Flow:* `POST /api/v1/assets/generate-image` | Flow: `generate_image_flash`

### Phase 5: Deployment & Tracking

* **Unified Application Workspace & Global Tracking**
  * *Working Repo Synergy:* Extends the existing `KanbanTracker` and `DashboardOverview` shells.
  * *UX Fix:* Upgrades the Application Tracker to link back to the specific source documents (resume version, generated cover letter) utilized for that specific application, creating a unified 'Application Detail' workspace (UX-07, Direction 5).
  * *UX Fix:* Adds a mini score-trend chart to the Dashboard summarizing ATS scores across the user's last 5 applications (UX-09).
  * *UX Fix:* Updates the Settings page to include an 'Integrations' section showing Gmail scan and Job Scout connection status and last sync times (UX-08).
  * *UX Fix:* Optimizes mobile navigation to strictly prioritize 'Find', 'Generate', and 'Track' core loop actions in the bottom bar (UX-10).
  * *API / Flow:* `GET /api/v1/applications/`, `PUT /api/v1/applications/{id}` | Flow: `application_tracking_sync`

---

## 4. Deprecated Features

To maintain a clean, maintainable codebase, the following redundant elements will be safely discarded during the merge:

* **🗑️ Prototype Generic UI Components (`src/components/ui/*`)**
  * *Why:* Components like `<PrimaryButton>`, `<Card>`, and `<TextInput>` violate the strict Kerala Rage design system. They are entirely superseded by `<Strike>`, `<Placard>`, and `<ScaffoldInput>`.
* **🗑️ Prototype Direct Genkit Calls (`src/genkit/*`)**
  * *Why:* Executing AI models directly in the browser exposes API keys and prevents centralized logging/caching. This logic is superseded by the Working Repo's `frontend/src/api/aiServices.ts` and backend endpoints.
* **🗑️ Prototype Flat Layouts (`AppShell.tsx`, `WorkspaceLayout.tsx`)**
  * *Why:* The Working Repo utilizes advanced, context-aware layout shells (`KrDarkShell.tsx`, `LaboratoryShell.tsx`, `MigratedRouteLayout.tsx`) that handle complex z-indexing, atmospheric background effects, and global navigation docks.
* **🗑️ Prototype Local State Data Fetching**
  * *Why:* Standard `useState` and `useEffect` chains for API calls in the prototype will be discarded in favor of the Working Repo's `TanStack Query` implementation, ensuring proper loading states, error boundaries, and cache invalidation.

---

## 5. Technical Architecture

### System Architecture Overview

CareerCopilot operates on a modern, decoupled client-server architecture deployed on Google Cloud Platform (GCP). The frontend is a static React Single Page Application (SPA) that communicates with a containerized Python/FastAPI backend. Authentication and AI orchestration are managed via Firebase services.

```text
+---------------------------------------------------------+
|                    CLIENT TIER                          |
|  +-----------------+  +------------------------------+  |
|  | Web Browser     |  | Chrome Extension (Scout)     |  |
|  | (React / Vite)  |  | (Content/Background scripts) |  |
|  +--------+--------+  +---------------+--------------+  |
+-----------|---------------------------|-----------------+
            | HTTPS / REST              | HTTPS / REST
+-----------v---------------------------v-----------------+
|                 API GATEWAY & LOAD BALANCING            |
|                 (Google Cloud Load Balancer)            |
+-----------+---------------------------+-----------------+
            |                           |
+-----------v-----------+   +-----------v---------------+
|    AUTH SERVICE       |   |      BACKEND TIER         |
|  (Firebase Auth)      |   |   (Python / FastAPI)      |
| JWT Issue & Validate  |   |   Cloud Run (Serverless)  |
+-----------+-----------+   +-----------+---------------+
            |                           |
+-----------v---------------------------v-----------------+
|                    DATA & AI TIER                       |
|  +-----------------+  +------------------------------+  |
|  |   Firestore     |  | Google Genkit / Gemini AI    |  |
|  | (NoSQL DB)      |  | (Model Orchestration)        |  |
|  +-----------------+  +------------------------------+  |
|  +-----------------+  +------------------------------+  |
|  | Cloud Storage   |  | pgvector (Cloud SQL)         |  |
|  | (Raw Assets)    |  | (Semantic RAG Search)        |  |
|  +-----------------+  +------------------------------+  |
+---------------------------------------------------------+
```

### Tech Stack

* **Frontend:** React 18+, TypeScript, Vite, TanStack Query (React Query), Zustand (State), Framer Motion (Animation), Recharts (Data Viz).
* **Backend:** Python 3.11+, FastAPI, Google Cloud Run (Serverless).
* **AI Layer:** Firebase Genkit, Google Gemini (Flash & Pro models).
* **Infrastructure & Database:** Google Cloud Platform (GCP), Firebase Auth, Cloud Firestore (NoSQL), Cloud Storage (Blobs), Cloud SQL with pgvector (Embeddings).

### Full API Specification (Domain Grouped)

* **Auth & Profile Domain (`/api/v1/auth`, `/api/v1/profiles`)**
  * `POST /login` - Issue session token.
  * `POST /register` - Create user identity.
  * `GET /me` - Retrieve current profile.
  * `POST /voice-profile` - Submit writing samples for Voice Profile training.
  * `PATCH /career-database` - Update structured master resume vectors.
* **Ingestion & Documents Domain (`/api/v1/ingest`, `/api/v1/documents`)**
  * `POST /ingest/artifacts/upload` - Upload raw PDF/DOCX for parsing.
  * `POST /generate-cover-letter` - Generate a tailored cover letter.
  * `POST /generate-ksc-response` - Generate STAR method KSC answers.
  * `POST /optimize-content` - Granular rewrite suggestions for resume bullets.
  * `GET /{documentId}/download` - Export to PDF/DOCX.
* **Analysis & Strategy Domain (`/api/v1/analysis`, `/api/v1/flows`)**
  * `POST /analyze-job-from-url` - Extract metadata and requirements from a job board URL.
  * `POST /ats-score` - Run 4-Quadrant Resume Audit.
  * `POST /strategy` - Generate holistic application strategy and missing keywords.
* **Job Scout & Tracking Domain (`/api/v1/job-scout`, `/api/v1/applications`)**
  * `POST /search` - Autonomous opportunity reconnaissance.
  * `GET /queue` - Retrieve clipped jobs pending analysis.
  * `GET /` - List all tracked applications.
  * `POST /` - Create new tracked application.
  * `PUT /{applicationId}` - Update application state (e.g., move Kanban column).

---

## 6. Data Architecture

### Cloud Firestore Schema

The NoSQL schema is optimized for document-centric, user-isolated queries.

* **`users` Collection:**
  * `uid` (Primary Key)
  * `email`, `displayName`, `createdAt`, `preferences` (Theme, Notification settings).
  * `onboardingState` (e.g., `hasCompletedIngestion`, `userSegment`).
* **`profiles` Collection (Career Database):**
  * `profileId`, `userId` (Foreign Key).
  * `Personal_Information` (Name, contact, location).
  * `Career_Entries` (Array of past jobs, titles, dates).
  * `Structured_Achievements` (Array of parsed STAR bullets).
  * `Master_Skills_Inventory` (Array of hard/soft skills).
  * `Voice_Profile` (Extracted tone, syntax complexity).
* **`documents` Collection (Asset Library):**
  * `documentId`, `userId`, `type` (`resume`, `cover_letter`, `ksc`).
  * `status` (`draft`, `analyzed`, `final`).
  * `storageUri` (Pointer to Cloud Storage blob).
  * `metadata` (Size, parsed text chunks, original formatting).
* **`applications` Collection (Tracker):**
  * `applicationId`, `userId`.
  * `jobTitle`, `companyName`, `location`, `appliedDate`.
  * `status` (`draft`, `applied`, `interviewing`, `offer`, `rejected`, `archived`).
  * `linkedDocuments` (Array of `documentId`s used for this application).

### Cloud Storage Structure

Raw files and generated exports are stored hierarchically.

* `/users/{userId}/uploads/raw/` - Initial unparsed resumes.
* `/users/{userId}/assets/images/` - Headshots generated/edited via Image Studio.
* `/users/{userId}/exports/` - Finalized, tailored PDFs and DOCX files ready for download.

---

## 7. Genkit Flows & Firebase Functions Catalogue

### Genkit AI Flows

* **`parseJobFlow`**: Extracts `JobTitle`, `Key_Responsibilities`, `Required_Skills` from raw JD text.
* **`analyzeJobFromUrl`**: Scrapes external job boards, bypasses bot-protection, and feeds into `parseJobFlow`.
* **`matchAnalysisFlow` (4-Quadrant Audit)**: Compares `CareerDatabase` vectors against `JobAnalysis` to output ATS scores, missing keywords, and readability metrics.
* **`optimizeResumeFlow`**: Applies the "Google XYZ Formula" to rewrite resume bullets contextually.
* **`generateCoverLetterFlow`**: Synthesizes `Voice_Profile`, `JobAnalysis`, and `CareerDatabase` into a formatted, stylized cover letter.
* **`generateKSCResponseFlow`**: Forces output into the STAR format, strictly applying APS/ILS standards for public sector roles.
* **`generate_image_flash`**: Interacts with Gemini Flash models for portfolio/headshot generation within the Image Studio.

### Firebase Functions

* **Auth Triggers:** `onUserCreate` (initializes empty `profiles` and `settings` docs).
* **Storage Triggers:** `onFileUpload` (triggers asynchronous `pdfminer` text extraction when a raw resume is uploaded).
* **Callable Functions (HTTPS):** All frontend-to-backend API endpoints (e.g., `generate_application_pack`, `sync_kanban_state`).
* **Scheduled Functions (CRON):** `autonomous_job_scout` (runs daily to scan linked emails or boards for matches based on user preferences).

---

## 8. Non-Functional Requirements & SLAs

* **Performance:**
  * Document Generation (Resume/Cover Letter): **< 30 seconds**.
  * ATS Analysis & Scoring: **< 10 seconds**.
  * Standard API Endpoint Latency: **p95 < 2 seconds**.
  * Frontend First Contentful Paint (FCP): **< 1.5 seconds**.
* **Scalability:**
  * Support for **100 concurrent users** actively running AI generation tasks.
  * Database scaling up to **10,000 active career profiles**.
  * Cloud Storage capacity limits set to handle up to **1TB of raw PDF/DOCX assets**.
* **Reliability:**
  * Target Uptime: **99.5%** (excluding scheduled maintenance).
  * Backup Strategy: **24-hour automated snapshots** of Firestore and pgvector instances.
  * Recovery Time Objective (RTO): **15 minutes** for critical database restoration.
* **Security:**
  * Data in transit encrypted via **HTTPS/TLS 1.3**.
  * Data at rest encrypted via Google Cloud **AES-256**.
  * Authentication secured via Firebase **JWT** with strict 1-hour expiry and rotation.
  * Strict adherence to **Australian Privacy Principles (APP)** for handling personal career data.
* **Compliance:**
  * Frontend UI strictly adheres to **WCAG 2.1 AA** accessibility standards (Color contrast, ARIA landmarks, reduced-motion fallbacks).
  * Architecture meets foundational **GDPR**, **SOC 2**, and **ISO 27001** compliance requirements for data handling and auditing.

---

## 9. Deployment & CI/CD

CareerCopilot employs a modern, automated deployment pipeline using Google Cloud Build.

* **Three-Tier Environment Strategy:**
  * **Development (`dev`):** For feature testing. Mocks AI endpoints to save costs.
  * **Staging (`staging`):** Exact mirror of production for QA and integration testing.
  * **Production (`prod`):** Live user environment.
* **CI/CD Pipeline (Cloud Build):**
  * Push to `main` triggers automated testing (Jest, React Testing Library).
  * Frontend is compiled via Vite and deployed to Firebase Hosting.
  * Backend FastAPI is containerized (Docker) and pushed to Google Artifact Registry.
* **Deployment Strategy:**
  * **Blue-Green Deployment** via Cloud Run traffic splitting ensures zero-downtime updates and safe rollback capabilities.
* **Infrastructure as Code (IaC):**
  * Managed entirely via **Terraform**, ensuring environment parity and automated provisioning of IAM roles, Cloud SQL instances, and Storage buckets.
* **Monitoring & Observability Stack:**
  * **GCP Cloud Monitoring & Logging:** Tracks container health, API latency, and Cloud Run scaling events.
  * **GCP Cloud Trace:** Identifies bottlenecks in the Genkit/Gemini LLM chain.
  * **Sentry:** Integrated into the React frontend for real-time error tracking and session replay.

---

## 10. Success Criteria & Metrics

The success of the unified CareerCopilot platform is measured across three core pillars:

* **Technical SLAs (System Health):**
  * 100% adherence to defined performance SLAs (e.g., sub-30s doc generation).
  * Zero P0 (critical severity) layout slop or accessibility (WCAG) violations on core flow screens.
* **User Experience (UX) Metrics:**
  * **Tangible Value:** Users see an average **≥ 20% improvement** in their ATS match scores after using the Generation Workbench.
  * **Satisfaction:** Customer Satisfaction (CSAT) score of **≥ 4.5/5** for AI-generated artifacts.
  * **Usability:** A Task Completion Rate of **≥ 90%** for the core loop (Upload Resume → Analyze Job → Generate Application → Add to Kanban).
* **Business & Growth Metrics:**
  * **Adoption:** Acquire **500 active users** within the first 6 months of launch.
  * **Volume:** Successfully process and generate **10,000 application documents** in Year 1.
  * **Efficiency:** Maintain LLM and Cloud infrastructure costs at **< $10 per active user per month** through optimized caching and prompt engineering.
