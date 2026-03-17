# `/tracker` Readiness & Environment Checklist

This checklist defines the required environment state to finalize the `/tracker` (Step 3a) closeout. The route logic is verified; only environment convergence remains.

## Required Environment Variables (Backend)

Run the backend with these variables to enable authorized Firebase/Firestore access:

```bash
# Core project identity
export FIREBASE_PROJECT_ID="careercopilot-468811"
export GOOGLE_CLOUD_PROJECT="careercopilot-468811"

# Credentials (path to local service account JSON)
# Must have roles: roles/datastore.user, roles/firebaseauth.admin
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account.json"

# API Port (ensure axiosInstance in frontend targets this)
export PORT=8001
```

## Discovery Evidence (2026-03-16)

- **Target Project**: `careercopilot-468811` (Production-linked).
- **Test Token Source**: Generated via Firebase Client SDK (frontend) or `gcloud auth print-identity-token` (if audience matches).
- **Verified Endpoint**: `GET http://localhost:8001/api/applications/`
- **Auth State**: Success observed on `:8001` with real project ID; failures on `:8000` due to missing config.

## Steps to Close Step 3a

1.  [ ] **Restore Backend**: Start `uvicorn` on `:8001` with the vars listed above.
2.  [ ] **Frontend Build**: Run `(cd frontend && vite build)` to ensure canonical assets.
3.  [ ] **Auth Capture**:
    -   Log in via the frontend `/login` or `/auth` flow.
    -   Verify the ID token is present in `idToken` state (see `AuthContext.tsx`).
4.  [ ] **Board Verification**:
    -   Navigate to `/tracker`.
    -   Confirm "LOADING TRACKER BOARD..." clears and displays data.
    -   If Firestore is empty, add one test application via `POST /api/applications/` or Firebase Console.
5.  [ ] **Final Evidence**:
    -   Capture `tracker-board-populated.png`.
    -   Capture `tracker-board-api-200.json`.
6.  [ ] **Promotion**: Update `status.md` Step 3a to `COMPLETE`.

## Local Debugging Tips

-   If `GET /api/applications/` stalls: Check if the service account has `roles/datastore.user` or if the Firebase project has a "default" Firestore database initialized.
-   If `401 Unauthorized`: verify `FIREBASE_PROJECT_ID` matches the token's `aud` claim.
