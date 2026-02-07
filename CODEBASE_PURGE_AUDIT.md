# Codebase Purge Audit (Firebase/GCP → Supabase)

Date: 2026-02-07
Repo: okgoogle13/careercopilot
Scope: Entire repository (frontend/, backend/, scripts/, config files). Excludes build artifacts and vendor dirs.
Protected exclusions: BaseMixin, Supabase-aligned SQLAlchemy models.

## Summary
- Multiple Firebase/GCP code paths remain active in functions/ and backend/ (imports, configs, and dependency declarations), indicating migration remnants.
- Archived and legacy documentation/scripts remain in the tree and appear detached from the main runtime flow.
- Duplicate/versioned configs and backup artifacts exist (tailwind config variants, backup folders, “working” Dockerfile).
- No unambiguous dead dependencies or unreachable logic were confirmed with current limited search coverage.

## 1. Orphaned files (no inbound references in main app flow)

### 1.1 scripts/_archived/test_firebase_secrets.py
- Path/Location: scripts/_archived/test_firebase_secrets.py
- Redundancy Type: Orphaned/Archived script
- Impact Rating: Low
- Rationale: Located in an archived folder and appears to be a standalone Firebase secrets test script unrelated to the active Supabase flow.
- Evidence: https://github.com/okgoogle13/careercopilot/blob/293021ff87ab2437b766d1e0e554a6664d188299/scripts/_archived/test_firebase_secrets.py#L22-L115

### 1.2 archive/legacy_folders/.archive/old-audits-2025-11-17/COMPONENT_INVENTORY_OLD.md
- Path/Location: archive/legacy_folders/.archive/old-audits-2025-11-17/COMPONENT_INVENTORY_OLD.md
- Redundancy Type: Orphaned/Legacy documentation
- Impact Rating: Low
- Rationale: Legacy audit artifact stored under archive/legacy_folders, not referenced by build/runtime paths.
- Evidence: https://github.com/okgoogle13/careercopilot/blob/293021ff87ab2437b766d1e0e554a6664d188299/archive/legacy_folders/.archive/old-audits-2025-11-17/COMPONENT_INVENTORY_OLD.md#L1-L61

## 2. Duplicate / Versioned Files

### 2.1 Tailwind config variants
- Path/Location: 
  - frontend/tailwind.config 2.ts
  - frontend/tailwind.config 3.ts
  - frontend/tailwind.config 4.ts
  - frontend/tailwind.config 5.ts
  - frontend/tailwind.config.js
  - frontend/tailwind.config.ts
- Redundancy Type: Duplicate/versioned config variants
- Impact Rating: Medium
- Rationale: Multiple numbered Tailwind configs suggest versioned copies alongside the primary config(s). Consolidation reduces confusion and drift.
- Evidence: Directory listing shows multiple tailwind config variants under frontend/.

### 2.2 Setup keychain secrets duplicate
- Path/Location:
  - scripts/setup-keychain-secrets.sh
  - scripts/setup-keychain-secrets 2.sh
- Redundancy Type: Duplicate/versioned script
- Impact Rating: Low
- Rationale: “ 2” suffix indicates a copy or versioned variant; suggests potential redundancy.
- Evidence: Directory listing shows both scripts in scripts/.

### 2.3 Dockerfile.yarn-final-working
- Path/Location: frontend/Dockerfile.yarn-final-working
- Redundancy Type: Duplicate/working copy
- Impact Rating: Low
- Rationale: “final-working” indicates an alternate Dockerfile alongside frontend/Dockerfile.
- Evidence: https://github.com/okgoogle13/careercopilot/blob/develop/frontend/Dockerfile.yarn-final-working

### 2.4 Frontend backup directory
- Path/Location: frontend/.backup-20260203-1408/
- Redundancy Type: Backup directory
- Impact Rating: Medium
- Rationale: Timestamped backup directory likely duplicates source files; consider archiving outside repo.
- Evidence: https://github.com/okgoogle13/careercopilot/tree/develop/frontend/.backup-20260203-1408

## 3. Migration Remnants (Firebase/GCP)

### 3.1 Firebase Admin SDK usage in Functions
- Path/Location:
  - functions/src/firebase.ts
  - functions/src/middleware/auth.middleware.ts
  - functions/src/types/global.d.ts
  - functions/src/types/firebase.d.ts
  - functions/src/types/job_listing.ts
  - functions/src/index.ts
- Redundancy Type: Migration remnants (Firebase Admin, Firestore, Firebase Auth)
- Impact Rating: High
- Rationale: Active Firebase Admin imports and Firestore usage indicate the Functions layer still relies on Firebase after Supabase migration.
- Evidence:
  - https://github.com/okgoogle13/careercopilot/blob/293021ff87ab2437b766d1e0e554a6664d188299/functions/src/firebase.ts#L1-L13
  - https://github.com/okgoogle13/careercopilot/blob/293021ff87ab2437b766d1e0e554a6664d188299/functions/src/middleware/auth.middleware.ts#L1-L74
  - https://github.com/okgoogle13/careercopilot/blob/293021ff87ab2437b766d1e0e554a6664d188299/functions/src/types/global.d.ts#L1-L11
  - https://github.com/okgoogle13/careercopilot/blob/293021ff87ab2437b766d1e0e554a6664d188299/functions/src/types/firebase.d.ts#L1-L11
  - https://github.com/okgoogle13/careercopilot/blob/293021ff87ab2437b766d1e0e554a6664d188299/functions/src/types/job_listing.ts#L1-L47
  - https://github.com/okgoogle13/careercopilot/blob/293021ff87ab2437b766d1e0e554a6664d188299/functions/src/index.ts#L1-L125

### 3.2 Firebase/GCP dependencies in Functions package.json
- Path/Location: functions/package.json
- Redundancy Type: Migration remnants (Firebase/GCP npm packages)
- Impact Rating: Medium
- Rationale: Firebase Admin, Firebase Functions, @genkit-ai/firebase, and Google Cloud packages remain in the Functions dependency graph.
- Evidence: https://github.com/okgoogle13/careercopilot/blob/293021ff87ab2437b766d1e0e554a6664d188299/functions/package.json#L1-L61

### 3.3 Firebase authentication in backend core
- Path/Location: backend/app/core/security.py
- Redundancy Type: Migration remnant (Firebase auth verification)
- Impact Rating: High
- Rationale: Firebase ID token verification remains in the backend security layer despite Supabase adoption.
- Evidence:
  - https://github.com/okgoogle13/careercopilot/blob/293021ff87ab2437b766d1e0e554a6664d188299/backend/app/core/security.py#L1-L103
  - https://github.com/okgoogle13/careercopilot/blob/293021ff87ab2437b766d1e0e554a6664d188299/backend/app/core/security.py#L85-L202

### 3.4 Firebase secrets and configuration helpers
- Path/Location: backend/app/core/secret_manager.py
- Redundancy Type: Migration remnant (Firebase/GCP secret manager handling)
- Impact Rating: Medium
- Rationale: Firebase-specific secret retrieval remains active.
- Evidence: https://github.com/okgoogle13/careercopilot/blob/293021ff87ab2437b766d1e0e554a6664d188299/backend/app/core/secret_manager.py#L119-L202

### 3.5 Firebase/GCP validation and secrets scripts
- Path/Location:
  - scripts/firebase-config-validator.py
  - scripts/save-aws-ses-secrets.py
- Redundancy Type: Migration remnants (Firebase/GCP tooling)
- Impact Rating: Medium
- Rationale: Scripts explicitly validate Firebase config or use Google Secret Manager.
- Evidence:
  - https://github.com/okgoogle13/careercopilot/blob/293021ff87ab2437b766d1e0e554a6664d188299/scripts/firebase-config-validator.py#L1-L110
  - https://github.com/okgoogle13/careercopilot/blob/293021ff87ab2437b766d1e0e554a6664d188299/scripts/save-aws-ses-secrets.py#L1-L102

### 3.6 GCP dependency declarations in backend requirements
- Path/Location:
  - backend/requirements.in
  - backend/requirements.txt
- Redundancy Type: Migration remnants (google-cloud-secret-manager, google-cloud-storage)
- Impact Rating: Medium
- Rationale: GCP dependencies remain pinned in backend requirements.
- Evidence:
  - https://github.com/okgoogle13/careercopilot/blob/293021ff87ab2437b766d1e0e554a6664d188299/backend/requirements.in#L1-L69
  - https://github.com/okgoogle13/careercopilot/blob/293021ff87ab2437b766d1e0e554a6664d188299/backend/requirements.txt#L97-L189

### 3.7 Cloud Storage tests still reference GCS
- Path/Location: backend/tests/unit/core/test_cloud_storage.py
- Redundancy Type: Migration remnant (GCS test surface)
- Impact Rating: Medium
- Rationale: Tests still import google.cloud.storage while core client now uses Supabase Storage.
- Evidence: https://github.com/okgoogle13/careercopilot/blob/293021ff87ab2437b766d1e0e554a6664d188299/backend/tests/unit/core/test_cloud_storage.py#L1-L97

## 4. Dead Dependencies (zero references)
- No unambiguous dead dependencies found with current limited search coverage. Further full import-indexing recommended.

## 5. Unreachable Logic
- No unambiguous unreachable logic identified with current limited search coverage.

Protected items intentionally excluded