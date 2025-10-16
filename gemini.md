# Gemini Agent Onboarding Guide

This document provides a comprehensive guide for AI agents, particularly those powered by Gemini, to effectively contribute to the CareerCopilot project. It consolidates instructions from multiple sources to offer a unified set of guidelines, conventions, and operational procedures.

---

## 1. Copilot Instructions (`.github/copilot-instructions.md`)

This section outlines the fundamental architecture, key conventions, and essential commands for navigating the CareerCopilot repository.

### Big Picture

-   **Frontend**: React + TypeScript (Vite) located in the `frontend/` directory. The development server can be started with `yarn dev`.
-   **Functions**: Firebase Functions (Node.js 20 with TypeScript) are in the `functions/` workspace.
-   **Backend**: A FastAPI and Python-based backend resides in `backend/app/`.
-   **AI Orchestration**: Google Genkit serves as the primary framework for AI flows. Key files include `backend/app/core/genkit_init.py` for initialization and `backend/app/genkit_flows/` for all AI logic.

### AI Agent Implementation

-   New or modified Genkit flows should be placed in `backend/app/genkit_flows/`.
-   Utilize the provided decorators (`@simple_genkit_flow`, `@async_genkit_flow`) to streamline flow registration and reduce boilerplate code.

### Key Repository Conventions

-   **Genkit Usage**: All AI operations must use Genkit. The `ENABLE_GENKIT_FLOWS=true` environment variable enables these flows.
-   **API Keys**: Gemini and Google AI API keys are managed through environment variables (e.g., `GEMINI_API_KEY`) and Google Secret Manager in production. Do not hard-code keys.
-   **Standardized I/O**: AI agent inputs and outputs must adhere to the schema defined in `agents.md`.
-   **Asynchronous Patterns**: Backend flows should be asynchronous to avoid blocking calls.
-   **API-First Frontend**: The frontend must interact with the backend via APIs and should not directly access Firestore.

### Common Commands

-   **Root Dev Server**: `yarn dev`
-   **Functions Emulator**: `yarn dev:functions`
-   **Builds**: `yarn build` (for all), `yarn build:frontend`, `yarn build:functions`
-   **Linting/Formatting**: `yarn lint`, `yarn format`
-   **Backend Tests**: `pytest backend/app/tests/`
-   **Genkit Verification**: `ENABLE_GENKIT_FLOWS=true python3 verify_genkit.py`

---

## 2. Project Commands and Notes (`CLAUDE.md`)

This section details project-specific commands, configuration management, and deployment workflows.

### Configuration Management

-   **Production Secrets**: Use `scripts/setup-production-secrets.py` for interactive setup and `scripts/production-secrets-validator.py` for validation.
-   **Development Setup**: Run `./setup-api-keys.sh` for local development.
-   **Genkit Verification**: Test the Genkit integration with `ENABLE_GENKIT_FLOWS=true python3 verify_genkit.py`.

### Deployment Workflow

-   **Main Script**: The `./scripts/deploy.sh` script handles deployments to various environments (`staging`, `production`, `frontend`, `functions`, `backend`, `all`).
-   **Test Deployment**: Before deploying, run `./scripts/test-deployment.sh` to validate dependencies, builds, and configurations.

### Infrastructure

-   **Primary Region**: All services, including Firebase, Cloud Run, and Firestore, are configured for `us-central1`.
-   **Docker Registry**: The registry URL is `us-central1-docker.pkg.dev/PROJECT_ID/careercopilot`. Authenticate using `gcloud auth configure-docker`.

### Testing Framework

-   **Frontend**: Jest and React Testing Library for unit tests (`yarn test`), and Playwright for E2E tests (`npx playwright test`).
-   **Backend**: `pytest` for unit and integration tests (`pytest backend/app/tests/`).
-   **CI/CD**: The `.github/workflows/ci.yml` workflow automates all testing, with parallel execution for faster feedback.

---

## 3. Agent-Specific Guidelines (`agents.md`)

This section provides explicit do's and don'ts, standardized I/O formats, and safety permissions for AI agents.

### Core Principles

-   **Do**: Use Firebase v9, Google Genkit, and standardized I/O formats. Prioritize small, focused agents with robust error handling.
-   **Don't**: Avoid using `localStorage`, hard-coding API keys, creating monolithic agents, or accessing Firestore directly from the frontend.

### Safety and Permissions

-   **Allowed without Prompt**: Reading files, running linters/tests on individual files, and deploying single Firebase functions.
-   **Ask First**: Installing new dependencies, modifying security rules, deleting user data, or deploying an entire project.

### Standardized I/O Formats

-   **Input**:
    ```json
    {
        "user_profile": {},
        "job_description": "",
        "document_type": "",
        "optimization_level": ""
    }
    ```
-   **Output**:
    ```json
    {
        "success": true,
        "content": {},
        "confidence_score": 0.9,
        "suggestions": [],
        "metadata": {},
        "error": ""
    }
    ```

### Genkit Flow Pattern

-   All flows should follow a standard structure: validate input, process with an AI model, format the output, and return a standardized response.
-   Implement `try...except` blocks for robust error handling.

### Domain Knowledge: Community Services

-   **Target Users**: Individuals transitioning into social work, community services, government, and non-profit roles.
-   **Key Document Requirements**: Familiarity with Key Selection Criteria (KSC), STAR methodology, and mission-aligned language is crucial.

### AI Model Usage

-   **Gemini 1.5 Flash**: Use for high-volume tasks like document generation and ATS scoring.
-   **Gemini 1.5 Pro**: Reserve for complex reasoning, strategic analysis, and multi-step workflows.