# Data Persistence Fix - Verification Checklist

Use this checklist to verify the implementation is working correctly.

---

## ✅ Pre-Deployment Checklist

### 1. Dependencies Installed
```bash
cd backend
../.venv/bin/pip list | grep firebase
```
**Expected:** `firebase-admin 6.5.0` (or similar)

- [ ] Firebase Admin SDK installed

---

### 2. Files Exist
```bash
ls -lh backend/app/core/firebase_config.py
ls -lh backend/app/services/job_store.py  
ls -lh backend/app/api/ingest.py
```
**Expected:** All files exist

- [ ] `firebase_config.py` exists
- [ ] `job_store.py` exists  
- [ ] `ingest.py` modified with Firestore

---

### 3. Imports Work
```bash
cd backend
../.venv/bin/python -c "from app.core.firebase_config import get_firestore_client; from app.services.job_store import get_job_store; print('✓ Imports OK')"
```
**Expected:** `✓ Imports OK`

- [ ] Imports successful

---

### 4. Server Starts
```bash
# Start server (or check existing)
# cd backend && ../.venv/bin/uvicorn app.main:app --reload
```

Check logs for:
```
[Firestore] No firebase_credentials.json found...  (OK for dev)
[JobStore] Using in-memory storage...              (OK for dev)
[JobStore] Initialized with Firestore...           (OK for production)
```

- [ ] Server starts without errors
- [ ] Firestore initialization logs visible

---

### 5. Storage Status Endpoint
```bash
curl http://localhost:8000/api/ingest/storage/status
```

**Expected (dev mode):**
```json
{
  "status": "ok",
  "storage": {
    "mode": "in-memory",
    "collection": "N/A",
    "in_memory_count": 0,
    "firestore_available": false
  }
}
```

**Expected (production with credentials):**
```json
{
  "status": "ok",
  "storage": {
    "mode": "firestore",
    "collection": "jobs",
    "in_memory_count": 0,
    "firestore_available": true
  }
}
```

- [ ] Endpoint returns storage status
- [ ] Mode is correct for environment

---

## ✅ Functional Testing

### 6. Clip a Job
```bash
curl -X POST http://localhost:8000/api/ingest/clip \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/test-job",
    "source": "test",
    "notes": "Persistence test"
  }'
```

**Expected:**
```json
{
  "status": "accepted",
  "message": "Job sent to CareerCopilot.",
  "storage_mode": "in-memory"  // or "firestore"
}
```

- [ ] Job clip accepted
- [ ] Storage mode returned

---

### 7. Retrieve Queue
```bash
curl http://localhost:8000/api/ingest/queue
```

**Expected:**
```json
[
  {
    "id": "...",
    "title": "Pending Analysis",
    "company": "Unknown",
    "url": "https://example.com/test-job",
    "status": "pending_analysis",
    "date_clipped": "2026-01-01T...",
    "notes": "Persistence test"
  }
]
```

- [ ] Job appears in queue
- [ ] All fields present

---

### 8. Test Persistence (Production Only)

**Only if using Firestore:**

```bash
# 1. Clip a job (as above)
# 2. Note the job ID
# 3. Restart the server
# 4. Retrieve queue again

curl http://localhost:8000/api/ingest/queue
```

**Expected:** Same job still in queue ✅

- [ ] Data persists across restart (Firestore mode)
- [ ] Data lost on restart (in-memory mode - expected)

---

### 9. Analyze a Job
```bash
# Get job ID from queue
JOB_ID="1"  # Replace with actual ID

curl -X POST http://localhost:8000/api/ingest/$JOB_ID/analyze
```

**Expected:**
```json
{
  "status": "success",
  "message": "Analyzed ... at ...",
  "data": { ... },
  "storage_mode": "in-memory"  // or "firestore"
}
```

- [ ] Analysis updates job
- [ ] Title and company extracted
- [ ] Status changes to "ready_to_apply"

---

### 10. Draft Cover Letter
```bash
curl -X POST http://localhost:8000/api/ingest/$JOB_ID/draft
```

**Expected:**
```json
{
  "status": "success",
  "data": {
    "cover_letter": "Dear Hiring Manager...",
    "word_count": 250,
    "character_count": 1500,
    "storage_mode": "firestore"
  }
}
```

- [ ] Cover letter generated
- [ ] Cover letter saved (check queue again)

---

### 11. Verify Cover Letter Persisted
```bash
curl http://localhost:8000/api/ingest/queue
```

**Expected:** Job now has `cover_letter` field with content

- [ ] Cover letter in job data
- [ ] `cover_letter_generated_at` timestamp present

---

## ✅ Firebase Production Testing

**Only complete if using Firebase credentials:**

### 12. Add Firebase Credentials
```bash
# 1. Download service account key from Firebase Console
# 2. Copy to project root as firebase_credentials.json

ls -lh firebase_credentials.json
```

- [ ] Credentials file exists
- [ ] File is valid JSON
- [ ] Contains `project_id` field

---

### 13. Restart with Credentials
```bash
# Restart server
# Check logs for:
```

**Expected logs:**
```
[Firestore] Firebase Admin SDK initialized successfully
[Firestore] Firestore client connected and ready
[JobStore] Initialized with Firestore (collection: jobs)
```

- [ ] Firestore initialization successful
- [ ] No errors in logs

---

### 14. Verify Firestore Mode
```bash
curl http://localhost:8000/api/ingest/storage/status
```

**Expected:**
```json
{
  "storage": {
    "mode": "firestore",
    "firestore_available": true
  }
}
```

- [ ] Mode is "firestore"
- [ ] firestore_available is true

---

### 15. Check Firebase Console
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Look for `jobs` collection

**Expected:** Collection exists, documents visible

- [ ] Jobs collection exists in Firestore
- [ ] Test jobs visible in console
- [ ] All fields present

---

## ✅ Edge Case Testing

### 16. Invalid Credentials (Optional)
```bash
# Temporarily rename credentials
mv firebase_credentials.json firebase_credentials.json.bak

# Restart server
# Should fall back to in-memory mode

# Restore
mv firebase_credentials.json.bak firebase_credentials.json
```

- [ ] Gracefully falls back to in-memory
- [ ] Warning logged
- [ ] Server doesn't crash

---

### 17. Multi-User Filtering (Optional)
```bash
curl -X POST http://localhost:8000/api/ingest/clip \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/job1", "user_id": "user123"}'

curl -X POST http://localhost:8000/api/ingest/clip \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/job2", "user_id": "user456"}'

# Filter by user
curl http://localhost:8000/api/ingest/queue?user_id=user123
```

**Expected:** Only jobs for user123 returned

- [ ] Multi-user filtering works
- [ ] `user_id` field saved correctly

---

## ✅ Final Verification

### 18. All Endpoints Work
- [ ] `POST /api/ingest/clip` - Job saved
- [ ] `GET /api/ingest/queue` - Jobs retrieved
- [ ] `POST /api/ingest/{id}/analyze` - Analysis saved
- [ ] `POST /api/ingest/{id}/draft` - Cover letter saved
- [ ] `GET /api/ingest/storage/status` - Status returned

---

### 19. No Breaking Changes
- [ ] Frontend can still clip jobs
- [ ] Frontend can still retrieve queue
- [ ] Frontend "Analyze" button works
- [ ] Frontend "Draft" button works
- [ ] All Phase 6 features functional

---

### 20. Documentation Complete
- [ ] `DATA_PERSISTENCE_FIX_COMPLETE.md` exists
- [ ] `FIREBASE_CREDENTIALS_SETUP.md` exists
- [ ] `DATA_PERSISTENCE_SUMMARY.md` exists
- [ ] All documentation accurate

---

## 🎯 Success Criteria

**Minimum (Dev Mode):**
- ✅ All imports work
- ✅ Server starts
- ✅ In-memory storage functional
- ✅ All CRUD operations work
- ✅ No errors in logs

**Production (Firestore Mode):**
- ✅ Firebase credentials loaded
- ✅ Firestore connection established
- ✅ Data persists across restart
- ✅ Jobs visible in Firebase Console
- ✅ All operations use Firestore

**Full Success:**
- ✅ All 20 checklist items passed
- ✅ Zero breaking changes
- ✅ Documentation complete
- ✅ Ready for deployment

---

## 📊 Scorecard

Total items: **20**

Passed: _____ / 20

**Rating:**
- 20/20 = 🟢 Perfect - Deploy immediately
- 18-19/20 = 🟡 Good - Minor fixes needed
- 15-17/20 = 🟠 Fair - Review failures
- <15/20 = 🔴 Issues - Debug required

---

## 🐛 If Tests Fail

**Common Issues:**

1. **Imports fail:** Check virtual environment activated
2. **Server won't start:** Check syntax errors in new files
3. **Storage status returns error:** Check endpoint routing
4. **Jobs not persisting:** Verify storage mode is "firestore"
5. **Firestore connection fails:** Check credentials file path

**Debug Commands:**
```bash
# Check Python path
cd backend && ../.venv/bin/python -c "import sys; print(sys.path)"

# Test imports individually
../.venv/bin/python -c "from app.core.firebase_config import get_firestore_client"
../.venv/bin/python -c "from app.services.job_store import get_job_store"

# Check server logs
# Look for error messages with "[Firestore]" or "[JobStore]" prefix
```

---

**Once all checks pass:** ✅ **DEPLOYMENT READY**

Proceed to: Priority 2 - Authentication Enforcement
