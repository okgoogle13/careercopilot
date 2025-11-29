# 📚 PROJECT KNOWLEDGE BASE INDEX (CRITICAL CONTEXT)

This file is the single source of truth for standards and workflow. **DO NOT** use detailed information from this file; **ALWAYS** consult the indexed reference documents and skills when performing complex tasks.

---

## 1. 🏗️ CORE ARCHITECTURE & STACK

| Component | Stack/Language | Key Requirement |
| :--- | :--- | :--- |
| **Frontend** | React 18.2.0 + TypeScript 5.0+ (Vite). | **Styling:** Tailwind CSS (utility-first) + Emotion (MUI theme). |
| **Backend** | Python **(3.10-3.12)** / FastAPI / Genkit (Node.js 20). | **Type Safety:** **CRITICAL** TS interfaces $\leftrightarrow$ Pydantic models. |
| **Database/Cache** | Firebase Cloud Firestore (Primary DB and cache collection `redis_cache`). | **Caching:** Firestore-backed TTL (1 hr default) instead of Redis. |
| **MUI Version** | Material-UI **v5.16.14** (Targeting migration to M3 Expressive). | **Status:** Migration Readiness $\approx$ 12% (Focus on `electric/` components). |

---

## 2. 🚨 AGENT WORKFLOW HYGIENE (Efficiency Rules)

These rules are non-negotiable for maintaining high context quality and low operational cost.

* **R1: Context Clearing:** Use the **`/clear`** command after **every 1-3 messages** or upon task completion to prevent context bloat and ensure Claude receives **fresh context**.
* **R2: Planning Mandate:** For any task involving **more than one file** or a core architectural change, the agent **MUST** generate an implementation plan before modifying any code.
* **R3: Output Control:** **YOU MUST** minimize all conversational filler and status updates. When providing code, output **ONLY the code block** (no introductory or concluding commentary).

---

## 3. 🛑 CRITICAL CONSTRAINTS & DEVELOPMENT GUIDELINES

* **Paths:** All paths must be **relative** (start with `./`).
* **Commit Messages:** **MUST** use Conventional Commits (e.g., `feat:`, `fix:`, `chore:`).
* **Testing:** Frontend (Jest), Backend (pytest), E2E (Playwright). **NEVER** merge without passing CI.
* **M3 Anti-Slop:** Aesthetic score **MUST** be $\geq 80$. Do not use generic fonts (Inter, Roboto, Arial).
* **Error Handling:** All async functions **MUST** include robust `try...catch` blocks.

---

## 4. ⚙️ ESSENTIAL COMMAND & ARCHITECTURAL INDEX

| Area | Quick Start Command | Detailed Documentation |
| :--- | :--- | :--- |
| **Testing** | `yarn test` / `pytest backend/app/tests/` | **`docs/development/TESTING_WORKFLOW.md`** |
| **Deployment** | `./scripts/deploy.sh staging` | **`docs/infrastructure/DEPLOYMENT_WORKFLOW.md`** |
| **Secrets Setup** | `./scripts/setup-secrets.sh` (unified) | **`docs/infrastructure/SECRETS_MANAGEMENT.md`** |
| **M3 Migration** | `./scripts/prepare-for-migration.sh` | **`docs/development/MIGRATION_PREP_STATUS.md`** |
| **Backend Arch** | `(See files in backend/app)` | **`docs/architecture/BACKEND_STRUCTURE.md`** |
| **AI Agents** | `mcp-orchestrator` & `gemini-wrapper` | **`docs/architecture/AI_AGENTS_AND_SKILLS.md`** |
| **Jules Protocol** | `cat tasks.txt \| while ...` | **`docs/development/JULES_PROTOCOL_GUIDE.md`** |

---

## 5. 📊 STATUS OVERVIEW

* **Test Coverage:** Frontend 17%, Backend 85%, E2E 90% (Target: 50% / 95% / 95%).
* **M3 Readiness:** 12% (Target: 70%).

***
