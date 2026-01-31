# DOC-002: Architecture Schema ("The Machinery")

**Document ID:** DOC-002-ARCH
**Version:** 2.0 (Northcote Curio Edition)
**Status:** DEFINITIVE
**Context:** The mechanical underpinnings of the Field Station. How the "Gallery" (Frontend) talks to the "Archive" (Backend) and the "Naturalist" (AI).

---

## 1. System Topology

We employ a **Hybrid Intelligence Architecture**:

*   **The Gallery (Frontend):** *React 19, Vite, Tailwind.*
    The user-facing conservatory. Renders the "Northcote Curio" aesthetic.
    *   *Role:* Presentation, Animation, User Interaction.
    *   *Hosting:* Firebase Hosting.

*   **The Archive (Database):** *Supabase (PostgreSQL).*
    The iron-clad vault for user data.
    *   *Role:* Persistence, Auth, Real-time subscriptions.
    *   *Schema:* Relational (Users, Resumes, Analyses).

*   **The Naturalist (AI Engine):** *Google Genkit + Gemini 1.5 Pro.*
    The intelligence that dissects the specimens.
    *   *Role:* Resume Parsing, Gap Analysis, Career Strategy.
    *   *Deployment:* Cloud Run (Serverless).

---

## 2. The Data Schema ("The Ledger")

*Strictly typed PostgreSQL tables managed via Supabase.*

### A. Core Entities

#### `users` (The Explorer)
Identity and preference settings.
*   `id`: UUID (Primary Key)
*   `email`: String
*   `mode_preference`: "Gallery" | "Laboratory" (Default: "Gallery")

#### `resumes` (The Specimen)
The raw biological material provided by the user.
*   `id`: UUID
*   `user_id`: UUID (FK)
*   `file_url`: String (Storage Path)
*   `parsed_data`: JSONB (The "Golden Record" - Full extraction)
*   `created_at`: Timestamp

#### `analyses` (The Dissection)
The AI's breakdown of the specimen.
*   `id`: UUID
*   `resume_id`: UUID (FK)
*   `status`: "processing" | "complete" | "failed"
*   `quadrant_scores`: JSONB (Hard, Soft, Quant, ATS)
*   `recommendations`: JSONB (Improvement actions)

---

## 3. Intelligence Flows ("The Thought Process")

### Flow A: The Ingestion (Resume Parsing)
1.  **User** uploads PDF to "The Tray" (Supabase Storage).
2.  **Edge Function** triggers `ingestResume` flow.
3.  **Genkit** (Gemini 1.5) reads PDF buffer.
4.  **Gemini** extracts structured JSON (Skills, History, Education).
5.  **Genkit** saves result to `resumes.parsed_data`.

### Flow B: The Audit (Gap Analysis)
1.  **User** requests analysis on a specific job description.
2.  **Genkit** compares `resumes.parsed_data` vs. Job Description.
3.  **Gemini** generates "Strategic Advice" and "Score Cards."
4.  **Result** saved to `analyses` table.

---

## 4. Security & Permissions

*   **Row Level Security (RLS):** Enabled on ALL tables. Users can only see their own biological specimens.
*   **Auth:** Supabase Auth (Email/Password + OAuth).
*   **API Security:** All Genkit endpoints require Bearer Token validation.
