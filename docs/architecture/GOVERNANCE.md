# GOVERNANCE.md

## Project Overview
**CareerCopilot** is a personal, AI-assisted platform. This document defines the repository structure and rules to ensure consistency among human and AI agents.

## Repository Structure Constraints

- `ai/`: Root directory for all AI configurations, prompts, and shared flows.
    - `ai/flows/`: Core AI orchestration and Genkit flow definitions.
    - `ai/prompts/`: Textual prompt templates, categorized by system (e.g., `backend`, `functions`, `system`).
    - `ai/config/`: AI routing, safety settings, and environment-agnostic configurations.
- `backend/`: Python FastAPI application.
    - `backend/app/genkit_flows`: Imports shared flows from `ai/flows/backend`.
    - `backend/app/prompts`: Imports shared prompts from `ai/prompts/backend`.
- `frontend/`: React/Vite application.
- `docs/`: Reference documentation and historical reports.
- `scripts/`: Maintenance and utility scripts.
    - `scripts/maintenance/`: Active maintenance scripts and migration tools.
- `_archive/`: Historical assets and legacy material.
    - `_archive/legacy-assets/`: Purged UI assets from the legacy `assets/` folders.
    - `_archive/docs/`: Historical reports and handover documents.

## AI Asset Rules
1. **Prompts**: No hardcoded prompts in source code. All prompts must reside in `ai/prompts/`.
2. **Flows**: Logic for complex AI interactions must be defined in `ai/flows/` and called by the respective service (Backend/Functions).
3. **Registry**: Always update `MODEL_REGISTRY.md` when adding or retiring AI models/flows.
4. **Environment**: Use secret management for all sensitive AI keys.

## Agent Behavior
- Agents must use `git mv` for refactoring.
- Documentation must be updated alongside architectural changes.
- Critical logic additions must include corresponding tests.
