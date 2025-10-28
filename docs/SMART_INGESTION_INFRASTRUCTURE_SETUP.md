# Smart Ingestion Infrastructure Setup

## ✅ Setup Complete!

All infrastructure components for the Smart Ingestion feature have been successfully configured.

---

## Infrastructure Components

### 1. **Google Cloud Storage**

**Bucket:** `careercopilot-468811.firebasestorage.app`
**Region:** `us-central1`
**Purpose:** Store uploaded career documents (resumes, KSC, voice samples)

**Folder Structure:**

```
gs://careercopilot-468811.firebasestorage.app/
├── temp_ingestions/          # Temporary uploads during ingestion workflow
│   └── {user_id}/
│       └── {timestamp}_{filename}
│
└── user_assets/              # Permanent storage after successful ingestion
    └── {user_id}/
        └── {timestamp}_{filename}
```

**Verification:**

```bash
gcloud storage ls gs://careercopilot-468811.firebasestorage.app/ --recursive
```

---

### 2. **Firestore Database**

**Database:** `(default)` (FIRESTORE_NATIVE)
**Region:** `us-central1`
**Purpose:** Store extracted structured career data

**Collection Structure:**

```
users/
  {user_id}/
    assetLibrary/
      {asset_id}/
        - documentType: "resume" | "ksc" | "voice"
        - extractedData: { ... MasterCareerProfile or VoiceProfile ... }
        - tags:
            roleType: string
            subsectors: string[]
        - metadata:
            fileName: string
            fileType: string
            uploadDate: timestamp
            storageUri: string
            fileSizeBytes: number
        - schemaVersion: "v4"
        - createdAt: timestamp
        - updatedAt: timestamp
        - userId: string
```

**Verification:**

```bash
gcloud firestore databases list --project=careercopilot-468811
```

---

### 3. **IAM Permissions**

**Backend Service Account:** `867091085935-compute@developer.gserviceaccount.com`
_(Compute Engine default service account)_

**Granted Roles:**

- ✅ `roles/storage.objectAdmin` - Full access to Cloud Storage objects
- ✅ `roles/secretmanager.secretAccessor` - Read secrets from Secret Manager
- ✅ `roles/editor` - Project-level editor access

**Command Used:**

```bash
gcloud projects add-iam-policy-binding careercopilot-468811 \
  --member="serviceAccount:867091085935-compute@developer.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"
```

**Verification:**

```bash
gcloud projects get-iam-policy careercopilot-468811 \
  --flatten="bindings[].members" \
  --filter="bindings.members:867091085935-compute@developer.gserviceaccount.com" \
  --format="table(bindings.role)"
```

---

## Security Configuration

### Firestore Security Rules

**⚠️ ACTION REQUIRED:** Add these security rules to Firestore to ensure proper data isolation:

**Path:** Firebase Console → Firestore Database → Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Asset Library - User can only access their own assets
    match /users/{userId}/assetLibrary/{assetId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId
                    && request.resource.data.userId == userId;
      allow update: if request.auth != null && request.auth.uid == userId
                    && resource.data.userId == userId;
      allow delete: if request.auth != null && request.auth.uid == userId
                    && resource.data.userId == userId;
    }

    // ... your other rules ...
  }
}
```

**Deploy Rules:**

```bash
firebase deploy --only firestore:rules --project=careercopilot-468811
```

---

### Cloud Storage Security Rules

**⚠️ ACTION REQUIRED:** Configure Storage security rules:

**Path:** Firebase Console → Storage → Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Temporary ingestion files - user can only upload to their own folder
    match /temp_ingestions/{userId}/{fileName} {
      allow create: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && request.auth.uid == userId;
      // Backend service account can read/delete
      allow read, delete: if true; // Backend has storage.objectAdmin
    }

    // Permanent user assets - user can only access their own files
    match /user_assets/{userId}/{fileName} {
      allow read: if request.auth != null && request.auth.uid == userId;
      // Backend service account can write/move files here
      allow write: if true; // Backend has storage.objectAdmin
    }
  }
}
```

**Deploy Rules:**

```bash
firebase deploy --only storage --project=careercopilot-468811
```

---

## Environment Configuration

### Required Environment Variables

Ensure these variables are set in your backend deployment:

**For Local Development (`.env.local`):**

```bash
# Genkit AI
ENABLE_GENKIT_FLOWS=true
GEMINI_API_KEY=<your-gemini-api-key>

# Google Cloud
GOOGLE_CLOUD_PROJECT=careercopilot-468811
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Firebase
FIREBASE_PROJECT_ID=careercopilot-468811
```

**For Production (Cloud Run Environment Variables):**

```bash
ENABLE_GENKIT_FLOWS=true
GOOGLE_CLOUD_PROJECT=careercopilot-468811
```

**Secrets (Google Cloud Secret Manager):**

- `GEMINI_API_KEY` - Already configured ✅
- Firebase credentials - Already configured ✅

---

## Deployment Checklist

### Pre-Deployment

- [x] Cloud Storage bucket exists with folder structure
- [x] IAM permissions granted to backend service account
- [x] Firestore database is configured
- [ ] Firestore security rules deployed
- [ ] Storage security rules deployed
- [ ] Environment variables configured

### Post-Deployment Testing

1. **Test Upload Endpoint:**

```bash
curl -X POST https://your-backend-url/api/v1/ingestion/upload-and-tag \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -F "file=@sample_resume.pdf"
```

2. **Test Extract Endpoint:**

```bash
curl -X POST https://your-backend-url/api/v1/ingestion/extract-and-save \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "temp_ingestions/user123/1234567890_resume.pdf",
    "confirmedTags": {
      "roleType": "Software Engineer",
      "subsectors": ["Technology", "SaaS"]
    },
    "documentType": "resume"
  }'
```

3. **Verify Firestore Data:**

```bash
# Using gcloud
gcloud firestore export gs://careercopilot-468811-backup --collection-ids=assetLibrary

# Or in Firebase Console
# Navigate to: Firestore Database → users → {your_uid} → assetLibrary
```

4. **Verify Cloud Storage:**

```bash
# Check uploaded files
gcloud storage ls gs://careercopilot-468811.firebasestorage.app/user_assets/ --recursive

# Check if temp files are cleaned up
gcloud storage ls gs://careercopilot-468811.firebasestorage.app/temp_ingestions/ --recursive
```

---

## Monitoring & Logging

### Cloud Storage Metrics

**Console:** Cloud Storage → Buckets → careercopilot-468811.firebasestorage.app → Monitoring

**Key Metrics:**

- Total storage used
- Number of objects
- Request counts (GET, PUT, DELETE)

### Firestore Metrics

**Console:** Firestore → Usage

**Key Metrics:**

- Document reads/writes
- Storage size
- Index performance

### Backend Logs

**Cloud Run Logs:**

```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=careercopilot-backend AND textPayload=~'ingestion'" \
  --limit=50 \
  --format=json
```

**Filter by Smart Ingestion:**

```bash
gcloud logging read "resource.type=cloud_run_revision AND (textPayload=~'upload-and-tag' OR textPayload=~'extract-and-save')" \
  --limit=20
```

---

## Cost Estimation

### Storage Costs (per month)

**Cloud Storage:**

- Storage: ~$0.02/GB
- Class A operations (writes): $0.05/10,000 operations
- Class B operations (reads): $0.004/10,000 operations

**Example:** 100 users uploading 5 documents/month (~2MB each):

- Storage: 1GB = $0.02
- Operations: ~500 writes + 2000 reads = ~$0.03
- **Total: ~$0.05/month**

**Firestore:**

- Document writes: $0.18/100,000 writes
- Document reads: $0.06/100,000 reads
- Storage: $0.18/GB

**Example:** 100 users, 5 documents/month:

- Writes: 500 documents = ~$0.001
- Reads: 2000 reads = ~$0.001
- Storage: ~0.01GB = ~$0.002
- **Total: ~$0.004/month**

**Gemini API (gemini-1.5-pro):**

- Input: $1.25/million tokens
- Output: $5.00/million tokens

**Example:** 500 document ingestions/month:

- Average input: 2000 tokens/doc = 1M tokens = $1.25
- Average output: 500 tokens/doc = 250K tokens = $1.25
- **Total: ~$2.50/month**

**Grand Total: ~$2.56/month** (for 100 active users)

---

## Troubleshooting

### Common Issues

#### 1. "Storage service not available"

**Cause:** Firebase not initialized correctly
**Fix:**

```python
# Check backend logs
from app.core.firebase import get_storage
bucket = get_storage()
if not bucket:
    print("Firebase Storage not initialized")
```

#### 2. "Permission denied" errors

**Cause:** Missing IAM permissions
**Fix:**

```bash
# Re-grant storage permissions
gcloud projects add-iam-policy-binding careercopilot-468811 \
  --member="serviceAccount:867091085935-compute@developer.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"
```

#### 3. "Genkit model not available"

**Cause:** `ENABLE_GENKIT_FLOWS` not set or `GEMINI_API_KEY` missing
**Fix:**

```bash
# Check environment variables
gcloud run services describe careercopilot-backend \
  --region=us-central1 \
  --format="value(spec.template.spec.containers[0].env)"

# Update if needed
gcloud run services update careercopilot-backend \
  --region=us-central1 \
  --set-env-vars="ENABLE_GENKIT_FLOWS=true"
```

#### 4. "Firestore document not found"

**Cause:** Collection path incorrect or permissions issue
**Fix:**

- Verify path: `users/{user_id}/assetLibrary/{asset_id}`
- Check Firestore security rules are deployed
- Verify user is authenticated

---

## Cleanup (if needed)

### Remove Uploaded Files

```bash
# Delete all temp files older than 7 days
gcloud storage rm -r gs://careercopilot-468811.firebasestorage.app/temp_ingestions/**
```

### Remove Firestore Documents

```bash
# Use Firebase Console or gcloud firestore delete
# Navigate to: Firestore → users → {user_id} → assetLibrary
```

### Revoke Permissions (if needed)

```bash
gcloud projects remove-iam-policy-binding careercopilot-468811 \
  --member="serviceAccount:867091085935-compute@developer.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"
```

---

## References

- **API Documentation:** See `/api/v1/docs` (FastAPI Swagger UI)
- **Schema Documentation:** `backend/app/models/master_profile_schema.py`
- **Genkit Flows:** `backend/app/genkit_flows/smart_ingestion.py`
- **Router:** `backend/app/api/routers/ingestion.py`

---

## Support

For issues or questions:

1. Check backend logs: `gcloud logging read "resource.type=cloud_run_revision"`
2. Review Firestore data: Firebase Console → Firestore
3. Check Storage files: Firebase Console → Storage
4. Consult code documentation in source files

---

**Last Updated:** 2025-01-27
**Setup By:** Claude Code Assistant
**Project:** CareerCopilot Smart Ingestion Feature
