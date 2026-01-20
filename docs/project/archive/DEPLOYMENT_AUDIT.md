# Pre-Flight Deployment Audit

## Phase 1: Debris Check (Cleanup)

### Leftover Debugging
* [ ] `frontend/src/config/api.ts`: `console.log('[API Config]', ENV_INFO);` -> **FIXED** (Commented out)
* [ ] `frontend/src/api/axiosConfig.ts`: `console.log` statements -> **FIXED** (Removed)
* [ ] `frontend/src/pages/JobQueue.tsx`: `console.log` statements -> **FIXED** (Removed)
* [ ] `frontend/src/pages/IngestionPage.tsx`: `console.log('Updated career data:', updatedData);` -> **FIXED** (Commented out)
* [ ] `frontend/src/features/applications/ApplicationTracker.tsx`: `console.log` statements -> **FIXED** (Commented out)
* [ ] `frontend/src/features/profile/ResumeUploader.tsx`: `console.log` statements -> **FIXED** (Removed)

### TODOs (Blockers)
* [ ] `backend/app/api/endpoints/document_export.py`: "TODO: Integrate with actual authentication middleware" -> **BLOCKER**
* [ ] `backend/app/api/endpoints/document_export.py`: "TODO: Implement actual batch export logic" -> **BLOCKER**
* [ ] `frontend/src/pages/IngestionPage.tsx`: "TODO: Persist to backend..." -> **BLOCKER** (Feature is incomplete)
* [ ] `frontend/src/features/applications/ApplicationTracker.tsx`: "TODO: Replace with actual API call" -> **BLOCKER** (Feature is incomplete)

### Dead Files
* [ ] `backend/app/ai_operations/job_analyzer.py`: **DELETED** (Debris)
* [ ] `backend/app/ai_operations/resume_analyzer.py`: **DELETED** (Debris)
* [ ] `backend/app/ai_operations/cover_letter_generator.py`: **DELETED** (Debris)
* [ ] `backend/app/ai_operations/ksc_generator.py`: **DELETED** (Debris)
* [ ] `backend/app/ai_operations/ats_scoring.py`: **KEEP** (Still used by `ats_score_worker.py`. Flagged as **Tech Debt**)

## Phase 2: Configuration Safety (Security)

### Secrets & Environment
* [ ] `.env.example`: Lists `VITE_FIREBASE_API_KEY`, etc. but backend uses `GOOGLE_APPLICATION_CREDENTIALS_JSON`. -> **ACTION REQUIRED**: Harmonize env var naming or documentation.
* [ ] `backend/app/core/secure_config.py`: Hardcoded fallback "insecure-default-secret-key". -> **SAFE** (Protected by logic that raises RuntimeError in production).
* [ ] `backend/app/main.py`: `allow_origins=["http://localhost:5173", "http://localhost:3000"]`. -> **CRITICAL SECURITY RISK / DEPLOYMENT BLOCKER**. Must be configurable via env var (e.g., `ALLOWED_ORIGINS`).

### CORS Policy
* [ ] Hardcoded `localhost` origins in `backend/app/main.py`. -> **BLOCKER**.

## Phase 3: Build Integrity (Correctness)

### Dependencies
* [ ] `backend/requirements.txt`: Generally clean, generated via `pip-tools`.
* [ ] `app.ai_operations` exclusions in `pyproject.toml` need to be updated since we deleted most files but kept `ats_scoring.py`.

### Genkit Flows (Type Safety)
* [ ] `backend/app/genkit_flows/resume_analyzer.py`: Returns `dict` (untyped). -> **CRITICAL**. Missing Pydantic model.
* [ ] `backend/app/genkit_flows/job_analyzer.py`: Returns `dict` (untyped). -> **CRITICAL**. Missing Pydantic model.
* [ ] `backend/app/genkit_flows/cover_letter_generator.py`: Returns `str` (untyped). -> **CRITICAL**. Missing Pydantic model.
* [ ] `backend/app/genkit_flows/email_scanner.py`: Untyped. -> **CRITICAL**. Missing Pydantic model.

## Summary of Actions Taken
1.  Removed/commented out console logs in frontend.
2.  Deleted dead files in `backend/app/ai_operations/`.
