# 🧪 TESTING WORKFLOW & COVERAGE STANDARDS

## Overview

The project uses a three-tier testing strategy: Unit (Jest/Pytest) -> Integration (Pytest/E2E Playwright). Test Coverage is currently 17% (Frontend) and 85% (Backend).

## Essential Commands

- **Run Frontend Tests:** `yarn test`
- **Generate Frontend Coverage:** `yarn test:coverage`
- **Run Backend Tests:** `pytest backend/app/tests/`
- **Run E2E Flows:** `yarn test:e2e`

## Testing Skills

- **Jest Test Scaffolder** (`jest-test-scaffolder`): Generate React component and hook tests.
- **API Integration Test Scaffolder** (`api-integration-test-scaffolder`): Generate complex backend integration tests.

## Coverage Targets

| Component           | Current | Target |
| :------------------ | :------ | :----- |
| Frontend Components | 17%     | 50%    |
| Backend APIs        | 85%     | 95%    |
| E2E User Flows      | 90%     | 95%    |
