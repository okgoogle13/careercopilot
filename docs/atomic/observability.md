# Observability Cheat Sheet

**Goal:** Know where logs and health signals live.

## Backend

- Logging config: `backend/app/core/loguru_config.py`
- Health checks: search for `/health` or health endpoints in `backend/app/api/`

## Frontend

- Browser console for runtime errors
- Playwright reports: `frontend/playwright-report/`

## CI / Builds

- `gh run view <run-id> --log`

