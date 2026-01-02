# Phase 6: Ghostwriter Agent - Quick Start Guide

## 🎯 What's New?

CareerCopilot can now **auto-generate personalized cover letters** using AI! The Ghostwriter Agent combines your resume with job details to create compelling application materials in seconds.

## ⚡ Quick Start (3 Steps)

### 1. Add Your Resume

```bash
# Edit this file and replace with your actual resume
nano user_profile/resume.md
```

See `user_profile/README.md` for formatting guidelines.

### 2. Test the Ghostwriter

```bash
# Run the smoke test
.venv/bin/python scripts/test_ghostwriter.py
```

This will generate a sample cover letter and verify everything works.

### 3. Use in the UI

1. Open CareerCopilot: `http://localhost:3000`
2. Go to **Job Queue**
3. Click **"Analyze with JobScout"** on a job
4. Once analyzed, click **"Draft Application"**
5. Review and copy the generated cover letter! 📋

## 📁 What Was Added

```
careercopilot-1/
├── user_profile/              # NEW: Your resume storage
│   ├── README.md              # Setup instructions
│   └── resume.md              # Your resume goes here
│
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   └── ghostwriter.py         # NEW: Cover letter agent
│   │   ├── api/
│   │   │   └── ingest.py              # UPDATED: Added /draft endpoint
│   │   └── services/
│   │       └── google_workspace.py    # UPDATED: Added create_doc()
│
├── frontend/
│   └── src/
│       └── pages/
│           └── JobQueue.tsx           # UPDATED: Draft button + dialog
│
├── scripts/
│   └── test_ghostwriter.py            # NEW: Smoke test script
│
└── docs/
    └── PHASE_6_GHOSTWRITER_COMPLETE.md # NEW: Full documentation
```

## 🔌 API Endpoints

### Generate Cover Letter

```bash
POST /api/ingest/{job_id}/draft

# Example
curl -X POST http://localhost:8000/api/ingest/1/draft
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "cover_letter": "Dear Hiring Manager...",
    "word_count": 287,
    "character_count": 1453
  }
}
```

### Create Google Doc (Optional)

```bash
POST /api/ingest/{job_id}/draft?create_google_doc=true
```

Requires `credentials.json` in project root.

## 🧪 Testing

### Backend Unit Test

```bash
cd backend
../.venv/bin/python -m app.agents.ghostwriter
```

### Full Smoke Test

```bash
.venv/bin/python scripts/test_ghostwriter.py
```

### Integration Test

1. Ensure backend is running: `cd backend && ../.venv/bin/uvicorn app.main:app --reload`
2. Ensure frontend is running: `cd frontend && npm run dev`
3. Navigate to Job Queue
4. Click "Draft Application" on an analyzed job

## 🎨 UI Features

- **Smart Button** - Only shows "Draft Application" for analyzed jobs
- **Loading Feedback** - Spinner during generation (~5-15 seconds)
- **Clean Dialog** - Easy-to-read preview of the cover letter
- **One-Click Copy** - Copy entire letter to clipboard instantly
- **Error Handling** - Clear messages if something goes wrong

## 🔧 Configuration

### Required: Add Your Resume

```bash
# 1. Open the file
nano user_profile/resume.md

# 2. Delete the template
# 3. Paste your actual resume (Markdown format)
# 4. Save (Ctrl+X, Y, Enter)
```

### Optional: Google Docs Integration

If you want cover letters auto-saved to Google Docs:

1. Copy `credentials.json.EXAMPLE` to `credentials.json`
2. Add your Google Cloud service account credentials
3. Ensure Google Docs API is enabled in GCP
4. Modify frontend to pass `create_google_doc=true`

## 💡 Tips for Best Results

1. **Resume Quality** - More detailed resume = better cover letters
2. **Job Analysis** - Always run JobScout first for accurate data
3. **Review Before Sending** - AI is smart but not perfect - always proofread!
4. **Customize Further** - Use the generated letter as a strong starting point

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| "No resume found" | Add your resume to `user_profile/resume.md` |
| "Job must be analyzed first" | Click "Analyze with JobScout" before drafting |
| Cover letter seems generic | Ensure resume is detailed and job has been analyzed |
| Button doesn't appear | Refresh the page or check job status is `ready_to_apply` |

## 📚 Documentation

For complete details, see:
- **Full Docs:** `docs/PHASE_6_GHOSTWRITER_COMPLETE.md`
- **User Guide:** `user_profile/README.md`
- **Code:** `backend/app/agents/ghostwriter.py`

## 🚀 Next Steps

Now that you have automated cover letter generation, consider:

1. **Phase 7:** Application Tracking & Analytics
2. **Phase 8:** Email Campaign Automation
3. **Phase 9:** Interview Preparation Assistant
4. **Phase 10:** Offer Negotiation & Comparison

---

**Status:** ✅ Phase 6 Complete - Ghostwriter Agent is Live!

**Questions?** Check the full documentation or review the code comments.
