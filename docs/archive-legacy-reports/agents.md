# CareerCopilot Codebase Agents

This document provides a comprehensive overview of the CareerCopilot codebase, structured as a set of "agents" that represent the different components of the application. This guide is intended for use by the Jules AI to understand the architecture, technology stack, and key interaction points within the project.

---

## 🎨 Frontend Agent

**Purpose**: Manages the user interface and all client-side logic.

**Tech Stack**:

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI v5
- **Styling**: Emotion, Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **API Client**: Axios
- **Testing**: Jest, React Testing Library

**Key Directories**:

- `frontend/src/components`: Reusable UI components.
- `frontend/src/pages`: Top-level page components.
- `frontend/src/api`: Services for interacting with the backend.

**Core Commands**:

- `yarn dev`: Starts the Vite development server.
- `yarn build`: Builds the production-ready application.
- `yarn test` or `yarn test:frontend`: Runs all Jest unit tests.
- `yarn lint`: Lints the frontend codebase.
- `yarn storybook`: Starts the Storybook server.

**Interaction Patterns**:

- **To start development**: Run `yarn dev` in the `frontend` directory.
- **To create a new component**: Add a new file under `frontend/src/components/` and a corresponding story in `stories/`.
- **To run tests**: Use `yarn test`.

---

## 🐍 Backend Agent

**Purpose**: Manages all server-side logic, including the API, AI flows, and database interactions.

**Tech Stack**:

- **Framework**: Python 3.11 with FastAPI
- **Database**: Firestore
- **Authentication**: Firebase Auth
- **Caching**: Firestore
- **Background Tasks**: Celery
- **AI Orchestration**: Genkit
- **Data Validation**: Pydantic
- **Testing**: Pytest

**Key Directories**:

- `backend/app/api/endpoints`: FastAPI endpoint definitions.
- `backend/app/models`: Pydantic data models and schemas.
- `backend/app/genkit_flows`: Genkit AI flow definitions.
- `backend/app/core`: Core application logic, including configuration and caching.
- `backend/app/tests`: Pytest tests for the backend.

**Core Commands**:

- `uvicorn app.main:app --reload`: Starts the backend development server.
- `pytest` or `yarn test:backend`: Runs all backend tests.
- `mypy backend/app`: Runs static type checking.
- `source venv/bin/activate`: Activates the Python virtual environment.

**Interaction Patterns**:

- **To start development**: Run `uvicorn app.main:app --reload` in the `backend` directory.
- **To create a new API endpoint**: Add a new file in `backend/app/api/endpoints/`, define Pydantic models in `backend/app/models/`, and register the new router.
- **To run tests**: Run `pytest` in the `backend` directory.

---

## ☁️ Firebase Functions Agent

**Purpose**: Manages serverless functions for specific backend tasks, often used with Firebase emulators for local development.

**Tech Stack**:

- **Runtime**: Node.js 20
- **Language**: TypeScript
- **Testing**: Jest

**Key Directories**:

- `functions/src`: Source code for all Firebase Functions.

**Core Commands**:

- `yarn serve` or `yarn dev:functions`: Starts the Firebase emulators.
- `npm run lint` (from `functions/` dir): Lints the functions codebase.
- `npm run build` (from `functions/` dir): Compiles the TypeScript code.
- `yarn test:functions`: Runs the functions tests.

**Interaction Patterns**:

- **To start local development**: Run `yarn serve` from the `functions` directory to start the emulators.
- **To create a new function**: Add a new file in `functions/src/` and export the function.

---

## 🧪 Testing Infrastructure Agent

**Purpose**: Provides a unified interface for running tests across the entire application.

**Components & Commands**:

- **Run All Tests**: `yarn test:all`
- **Frontend Unit Tests (Jest)**: `yarn test:frontend`
- **Backend Tests (Pytest)**: `yarn test:backend`
- **Firebase Functions Tests (Jest)**: `yarn test:functions`
- **End-to-End Tests (Playwright)**: `yarn test:e2e`

**Interaction Patterns**:

- **To run all tests for the entire project**: Use `yarn test:all` from the root directory.
- **To add a new E2E test**: Create a new `.spec.js` file in `frontend/tests/`.

---

## 🚀 Deployment & DevOps Agent

**Purpose**: Manages the building, deployment, and monitoring of the application.

**Tech Stack**:

- **CI/CD**: GitHub Actions
- **Hosting**: Firebase Hosting & Functions
- **Monitoring**: Firebase Performance Monitoring, Google Cloud Logging
- **Error Tracking**: Sentry

**Key Files & Scripts**:

- `.github/workflows/ci.yml`: The main CI/CD workflow.
- `firebase.json`: Firebase configuration file.
- `yarn build`: Builds both the frontend and functions for production.
- `firebase deploy`: Deploys the application to Firebase.

**Interaction Patterns**:

- **To deploy the application**: Run `yarn build` then `firebase deploy`.
- **To monitor the application**: Use the Firebase Console and Sentry dashboard.

---

## 🎨 Design System Agent

**Purpose**: Manages the visual design and branding of the application.

**Components**:

- **Design Tokens**: A centralized `design-system/tokens.json` file that defines colors, typography, spacing, etc.
- **Build Scripts**: Scripts to convert tokens into CSS variables and Tailwind CSS configuration.

**Key Scripts**:

- `scripts/update-design-system.sh`: A script that validates the design tokens and builds the frontend assets.
- `scripts/validate-design-tokens.py`: Validates the schema and WCAG compliance of the tokens.

**Interaction Patterns**:

- **To update the design system**: Modify the `design-system/tokens.json` file and run `scripts/update-design-system.sh`.
- **To use design tokens in components**: Use the generated CSS custom properties (e.g., `var(--sys-color-primary)`).

---

## 🔍 TECHNICAL DEBT AUDIT PROTOCOL

This file defines the expected format, tone, and scoring rules for autonomous audit reports. All final output must strictly follow the format of the provided example.

### 1.1 GOLDEN EXAMPLE: TECHNICAL DEBT FINDING

**File:** `backend/src/controllers/user_auth.py`
**Snippet:**

```python
def check_password(user, password):
    # TODO: Refactor using bcrypt
    if user.password == password:
        return True
    return False
```

| Field                   | Value                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Issue Type**          | High-Risk Security Debt (Weak Hashing)                                                                                          |
| **Location**            | `backend/src/controllers/user_auth.py:55`                                                                                       |
| **Risk Score**          | 9/10                                                                                                                            |
| **Effort Score**        | Medium (Requires new dependency + refactor of 2 files)                                                                          |
| **Proposed Fix**        | Implement standard, modern hashing (e.g., bcrypt) using environment variable for salt. Deprecate current plain-text comparison. |
| **Affected Components** | User authentication, password storage                                                                                           |
| **Technical Impact**    | Security vulnerability, potential data breach                                                                                   |
| **Business Impact**     | High - Compromises user account security                                                                                        |
| **Recommended Actions** | 1. Add bcrypt dependency<br>2. Update password hashing logic<br>3. Add migration for existing passwords<br>4. Update tests      |

**Expected Tone:** Professional, concise, and focused on maintainability and security.

### 1.2 SCORING GUIDELINES

**Risk Score (1-10):**

- 9-10: Critical security issues, data loss risks
- 7-8: Major functionality or performance issues
- 5-6: Moderate issues affecting maintainability
- 3-4: Minor issues, low impact
- 1-2: Cosmetic or very minor issues

**Effort Score:**

- Low: <1 day of work
- Medium: 1-3 days of work
- High: >3 days of work

### 1.3 AUDIT SCOPE

- **Code Quality**: Identify complex methods, duplicated code, and anti-patterns
- **Security**: Find potential vulnerabilities and security risks
- **Performance**: Locate bottlenecks and inefficient operations
- **Maintainability**: Spot areas that need refactoring or documentation

### 1.4 OUTPUT FORMAT

Each finding must include:

- Clear, descriptive title
- Exact file path and line numbers
- Risk and effort scores
- Detailed impact analysis
- Step-by-step remediation plan

### 1.5 PRIORITIZATION

1. Security vulnerabilities (especially authentication/authorization)
2. Data integrity issues
3. Performance bottlenecks
4. Code quality and maintainability
5. Documentation gaps

### 1.6 ROUTING STRATEGY

**Delegation Strategy:**

- Use the Jules web interface with the provided delegation prompt
- Jules will automatically read AGENTS.md for the golden example format
- Focus on high-risk issues (Risk Score 8-10) as specified in the prompt
- Output will be generated as TECHNICAL_DEBT_AUDIT.md in the repository root
- The audit should be exhaustive but prioritize security and performance critical issues

### 1.7 FINAL DELEGATION PROMPT

```text
You are the Technical Debt Auditor. Your task is to perform an **Exhaustive Technical Debt Audit** across the entire 'careercopilot' repository.

**Instructions:**
1.  **Analyze** the entire codebase for excessive complexity, unhandled errors, and inconsistent patterns.
2.  **Format:** Your final output MUST strictly adhere to the exact structure, tone, and scoring criteria demonstrated in the "GOLDEN EXAMPLE: TECHNICAL DEBT FINDING" section of the **AGENTS.md** file.
3.  **Scope:** Prioritize security and high-risk performance issues (Risk Score 8-10).
4.  **Output:** Generate a single, comprehensive `TECHNICAL_DEBT_AUDIT.md` report in the root of the repository.

Proceed with planning this massive audit now.
```
