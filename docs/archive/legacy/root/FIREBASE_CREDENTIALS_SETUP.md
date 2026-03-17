# Firebase Credentials Setup Guide

## Quick Start: Get Your Persistence Working

### Option 1: Production Mode (Recommended for Deployment)

1. **Get Firebase Credentials:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project (or create one)
   - Go to **Project Settings** (gear icon) → **Service Accounts**
   - Click **"Generate New Private Key"**
   - Download the JSON file

2. **Add to Project:**
   ```bash
   # Copy the downloaded file to project root
   cp ~/Downloads/your-project-xxxxx.json firebase_credentials.json

   # Verify it's in the right place
   ls firebase_credentials.json
   ```

3. **Restart Server:**
   ```bash
   cd backend
   ../.venv/bin/uvicorn app.main:app --reload
   ```

4. **Verify:**
   ```bash
   # Check storage status
   curl http://localhost:8000/api/ingest/storage/status

   # Should show:
   # "mode": "firestore"  ✅
   ```

### Option 2: Development Mode (No Credentials Needed)

**For local development/testing only:**

1. Don't add `firebase_credentials.json`
2. Start server normally
3. Data will use in-memory storage
4. **Warning:** Data lost on restart!

**You'll see this log:**
```
[Firestore] No firebase_credentials.json found. Persistence will use fallback mode.
[JobStore] Firestore unavailable. Using in-memory storage (data will not persist)
```

This is **OK for development** but **NOT for production**.

---

## Firebase Project Setup

### Create a New Firebase Project:

1. Go to https://console.firebase.google.com/
2. Click **"Add project"**
3. Enter project name: `careercopilot` (or your choice)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Enable Firestore Database:

1. In your project, go to **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Choose:
   - **Start mode:** Production mode (we'll add rules later)
   - **Location:** Choose closest to your users (e.g., `us-central1`)
4. Click **"Enable"**

### Get Service Account Key:

1. Go to **Project Settings** (gear icon ⚙️)
2. Click **"Service accounts"** tab
3. Select **"Firebase Admin SDK"**
4. Click **"Generate new private key"**
5. Confirm and download JSON file
6. Rename it to `firebase_credentials.json`
7. Move it to project root

---

## Security Rules (Important for Production)

### Basic Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Jobs collection - only authenticated users can read/write their own jobs
    match /jobs/{jobId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.user_id;
      allow create: if request.auth != null;
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**To apply these rules:**
1. Go to Firebase Console → Firestore Database
2. Click **"Rules"** tab
3. Paste the rules above
4. Click **"Publish"**

---

## Environment Variables (Optional)

Instead of using a file, you can use environment variables for Cloud deployment:

### For Google Cloud Run / App Engine:

```bash
# Set the JSON content as an environment variable
export GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type":"service_account", ...}'
```

Our code already checks for this in `main.py`:
```python
cred_json_str = settings.GOOGLE_APPLICATION_CREDENTIALS_JSON
if cred_json_str:
    cred_dict = json.loads(cred_json_str)
    cred = credentials.Certificate(cred_dict)
```

---

## Troubleshooting

### Problem: "Firestore init failed"

**Check:**
1. Is `firebase_credentials.json` in the project root?
2. Is the JSON file valid? (open it, should be valid JSON)
3. Does your Firebase project exist?
4. Is Firestore enabled in your project?

**Test:**
```python
import json
with open('firebase_credentials.json') as f:
    data = json.load(f)
    print("✓ Valid JSON")
    print(f"✓ Project ID: {data.get('project_id')}")
```

### Problem: "Permission denied"

**Firestore not enabled:**
- Go to Firebase Console → Firestore Database → Click "Create database"

**Security rules too strict:**
- Go to Firestore Rules
- For testing, use:
  ```javascript
  allow read, write: if true;  // WARNING: Only for testing!
  ```

### Problem: "Storage mode is 'in-memory' but I have credentials"

**Possible causes:**
1. Credentials file not found
2. Invalid JSON in credentials file
3. Initialization error (check logs)

**Debug:**
```bash
# Check if file exists
ls -lh firebase_credentials.json

# Check logs for errors
# Look for "[Firestore]" messages
```

---

## Testing Your Setup

### Test Script:

```python
# test_firestore.py
import asyncio
from app.services.job_store import get_job_store

async def test():
    store = get_job_store()
    print(f"Storage mode: {store.get_storage_mode()}")

    # Add a test job
    job_id = await store.add_job({
        "title": "Test Job",
        "company": "Test Co",
        "url": "https://example.com",
        "status": "pending_analysis"
    })

    print(f"✓ Job added: {job_id}")

    # Retrieve it
    job = await store.get_job(job_id)
    print(f"✓ Job retrieved: {job['title']}")

    # Update it
    await store.update_job(job_id, {"title": "Updated Job"})
    print("✓ Job updated")

    # Get all jobs
    all_jobs = await store.get_all_jobs()
    print(f"✓ Total jobs: {len(all_jobs)}")

if __name__ == "__main__":
    asyncio.run(test())
```

Run:
```bash
cd backend
../.venv/bin/python test_firestore.py
```

Expected output (Firestore mode):
```
Storage mode: firestore
✓ Job added: abc123def456
✓ Job retrieved: Test Job
✓ Job updated
✓ Total jobs: 1
```

---

## Cost Considerations

### Firestore Free Tier:
- **Stored data:** 1 GB free
- **Document reads:** 50,000/day free
- **Document writes:** 20,000/day free
- **Document deletes:** 20,000/day free

**For a single user clipping ~50 jobs/week:**
- Writes: ~50/week = well within free tier
- Reads: Maybe 500/week = well within free tier
- **Cost: $0/month** ✅

### If You Exceed Free Tier:
- Very cheap scaling: ~$0.06 per 100K reads
- For 100 users: Still likely < $5/month

---

## Alternative: Use SQLite Instead

If you don't want to use Firebase, you can use the SQLAlchemy database instead:

**See:** `backend/app/core/database.py` and `backend/app/models/database.py`

The project already has complete SQLite/PostgreSQL models set up. You would need to:

1. Create a new `SQLJobStore` class
2. Use SQLAlchemy sessions instead of Firestore
3. Update `ingest.py` to use the SQL store

This is documented in `docs/MVP_GAP_ANALYSIS.md` under "Database Layer".

---

## Next: Authentication Setup

Once you have persistence working, the next step is:

**Priority 2: Authentication Enforcement**
- Add Firebase Authentication
- Protect endpoints with auth middleware
- Filter jobs by authenticated user

See: `docs/MVP_GAP_ANALYSIS.md` for implementation guide.

---

**Questions?** Check `docs/DATA_PERSISTENCE_FIX_COMPLETE.md` for full documentation.
