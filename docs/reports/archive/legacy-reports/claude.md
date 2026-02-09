# 📚 PROJECT KNOWLEDGE BASE INDEX (CRITICAL CONTEXT)

This file is the single source of truth for standards and workflow. **DO NOT** use detailed information from this file; **ALWAYS** consult the indexed reference documents and skills when performing complex tasks.

---

## 1. 🏗️ CORE ARCHITECTURE & STACK

| Component          | Stack/Language                                                            | Key Requirement                                                                      |
| :----------------- | :------------------------------------------------------------------------ | :----------------------------------------------------------------------------------- |
| **Frontend**       | React 18.2.0 + TypeScript 5.0+ (Vite).                                    | **Styling:** Tailwind/Emotion (Legacy). **M3 Migration uses CSS Modules (See 3.5).** |
| **Backend**        | Python **(3.10-3.12)** / FastAPI / Genkit (Node.js 20).                   | **Type Safety:** **CRITICAL** TS interfaces $\leftrightarrow$ Pydantic models.       |
| **Database/Cache** | Firebase Cloud Firestore (Primary DB and cache collection `redis_cache`). | **Caching:** Firestore-backed TTL (1 hr default) instead of Redis.                   |
| **MUI Version**    | Material-UI **v5.16.14** (Targeting migration to M3 Expressive).          | **Status:** Migration Readiness $\approx$ 12%. **Tokens:** See Section 3.5.          |

---

## 2. 🚨 AGENT WORKFLOW HYGIENE (Efficiency Rules)

These rules are non-negotiable for maintaining high context quality and low operational cost.

- **R1: Context Clearing:** Use the **`/clear`** command after **every 1-3 messages** or upon task completion to prevent context bloat and ensure Claude receives **fresh context**.
- **R2: Planning Mandate:** For any task involving **more than one file** or a core architectural change, the agent **MUST** generate an implementation plan before modifying any code.
- **R3: Output Control:** **YOU MUST** minimize all conversational filler and status updates. When providing code, output **ONLY the code block** (no introductory or concluding commentary).

---

## 3. 🛑 CRITICAL CONSTRAINTS & DEVELOPMENT GUIDELINES

- **Paths:** All paths must be **relative** (start with `./`).
- **Commit Messages:** **MUST** use Conventional Commits (e.g., `feat:`, `fix:`, `chore:`).
- **Testing:** Frontend (Jest), Backend (pytest), E2E (Playwright). **NEVER** merge without passing CI.
- **M3 Anti-Slop:** Aesthetic score **MUST** be $\geq 80$. Do not use generic fonts (Inter, Roboto, Arial).
- **Error Handling:** All async functions **MUST** include robust `try...catch` blocks.

---

## 3.5 🎨 DESIGN TOKEN SYSTEM (Dual Architecture)

| System                 | Token Source                                    | Status                                                                         | Critical Rule                                                 |
| :--------------------- | :---------------------------------------------- | :----------------------------------------------------------------------------- | :------------------------------------------------------------ |
| **Electric Alchemist** | `./frontend/src/theme/tokens.json` (184 tokens) | ✅ Production (30 components)                                                  | **Solid State:** NO shadows, border-based elevation.          |
| **M3 Expressive**      | `./design-system/tokens.json` (342 tokens)      | ✅ 75-80% (Infrastructure 100%, 89+ components migrated, 92% token compliance) | **Auto-gen CSS:** NEVER edit `m3-design-tokens.css` directly. |

### Quick Commands

| Task                  | Command                                       | Documentation                                     |
| :-------------------- | :-------------------------------------------- | :------------------------------------------------ |
| **Build M3 Tokens**   | `python3 ./scripts/build-m3-tokens.py`        | `docs/design/M3_EXPRESSIVE_DESIGN_SYSTEM.md`      |
| **Validate Tokens**   | `python3 ./scripts/validate-design-tokens.py` | `docs/design/DESIGN_SYSTEM_OVERVIEW.md`           |
| **All-in-One Update** | `./scripts/update-design-system.sh`           | `docs/design/ELECTRIC_ALCHEMIST_DESIGN_SYSTEM.md` |

### Critical Token Rules

- **R1: No Hardcoding:** **NEVER** hardcode colors/spacing. Use tokens only (`bg-primary-container` or `var(--md-sys-color-primary-50)`).
- **R2: No Mixing:** **NEVER** mix Electric + M3 tokens in same component. Choose one system per component.
- **R3: Auto-Gen Files:** **NEVER** edit generated files (`m3-design-tokens.css`, `tailwind-m3-patch.js`). Regenerate via scripts.
- **R4: WCAG Compliance:** All color combinations **MUST** pass AA/AAA contrast validation (auto-checked by `validate-design-tokens.py`).

---

## 4. ⚙️ ESSENTIAL COMMAND & ARCHITECTURAL INDEX

| Area               | Quick Start Command                       | Detailed Documentation                           |
| :----------------- | :---------------------------------------- | :----------------------------------------------- |
| **Testing**        | `yarn test` / `pytest backend/app/tests/` | **`docs/development/TESTING_WORKFLOW.md`**       |
| **Deployment**     | `./scripts/deploy.sh staging`             | **`docs/infrastructure/DEPLOYMENT_WORKFLOW.md`** |
| **Secrets Setup**  | `./scripts/setup-secrets.sh` (unified)    | **`docs/infrastructure/SECRETS_MANAGEMENT.md`**  |
| **M3 Migration**   | `./scripts/prepare-for-migration.sh`      | **`docs/development/MIGRATION_PREP_STATUS.md`**  |
| **Backend Arch**   | `(See files in backend/app)`              | **`docs/architecture/BACKEND_STRUCTURE.md`**     |
| **AI Agents**      | `mcp-orchestrator` & `gemini-wrapper`     | **`docs/architecture/AI_AGENTS_AND_SKILLS.md`**  |
| **Jules Protocol** | `cat tasks.txt \| while ...`              | **`docs/development/JULES_PROTOCOL_GUIDE.md`**   |

---

## 5. 📊 STATUS OVERVIEW

- **Test Coverage:** Frontend 17%, Backend 85%, E2E 90% (Target: 50% / 95% / 95%).
- **M3 Readiness:** 75-80% (Infrastructure 100%, 89+ components migrated, 92% token compliance).

---

## 6. 🧩 FRONTEND COMPONENT ARCHITECTURE (STRICT)

**Source of Truth:** `frontend/src/components/`

We use a 3-namespace strategy. Do NOT create components outside these folders:

1.  **`electric/`** (Production System)
    - **Status:** Stable, Production-Ready.
    - **Use for:** All primary UI elements (Buttons, Cards, Inputs).
    - **Styling:** Tailwind + Framer Motion.
    - **Imports:** `import { Button } from '@/components/electric'` (No "Electric" prefix).

2.  **`m3-expressive/`** (Migration Target)
    - **Status:** In-Progress / Experimental.
    - **Use for:** Components being actively migrated to Material Design 3.
    - **Styling:** CSS Modules + Design Tokens.
    - **Imports:** `import { M3Button } from '@/components/m3-expressive'`.

3.  **`custom/`** (Domain Specific)
    - **Status:** Feature-Specific.
    - **Use for:** Complex, business-logic-heavy components (e.g., `ApplicationTracker`, `ResumeBuilder`).
    - **Imports:** `import { ApplicationTracker } from '@/components/custom'`.

**⛔ DO NOT USE:**

- `@/components/ui` (Deprecated & Deleted)
- `@/components/design-system` (Deprecated & Deleted)
- Do not re-introduce "Electric" prefixes in component names (e.g. use `<Button>`, not `<ElectricButton>`).

---
