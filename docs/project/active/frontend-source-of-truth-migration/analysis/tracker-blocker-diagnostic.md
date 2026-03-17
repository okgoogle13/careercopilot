
# Blocker Diagnostic Packet: /tracker Firestore Connectivity

## Status
- **Seeding**: SUCCESS (via REST API)
- **Local Backend**: BLOCKED (Hangs on gRPC connectivity)
- **Secret Manager**: VERIFIED (Secrets exist and are fetchable)

## Evidence
- `gcloud firestore databases list` confirms both `(default)` and `production` databases exist.
- `gcloud firestore indexes composite list --database='(default)'` succeeds.
- Python `google-auth` hangs during token refresh for Service Account credentials in the local macOS environment.
- Python `google-cloud-firestore` (gRPC) hangs during client initialization or first document access.
- **REST API Workaround**: `curl` with Bearer token from `gcloud auth print-access-token` successfully added documents to `projects/careercopilot-468811/databases/(default)/documents/applications`.

## Environment Variables Used for Successful REST Seed
- `GOOGLE_CLOUD_PROJECT`: `careercopilot-468811`
- `DATABASE_ID`: `(default)`
- `AUTH_TOKEN`: Obtained via `gcloud auth print-access-token`

## Recommendations for Next Agent
1. **gRPC Debugging**: Investigate `grpcio` and `google-cloud-firestore` compatibility on macOS with pyenv/shimmed Python 3.12.
2. **REST Client Fallback**: Consider modifying `backend/app/core/firebase.py` to use a REST-based Firestore client if gRPC persists in failing.
3. **Production Verification**: The issue appears environment-specific (macOS). Verify if the hang occurs in the target Cloud Run container.
