# CareerCopilot v1.0 - User Manual

**Welcome to CareerCopilot!** 🚀
Your AI-powered assistant for managing job applications efficiently.

---

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Initial Setup](#initial-setup)
3. [Daily Usage](#daily-usage)
4. [Workflow Guide](#workflow-guide)
5. [Troubleshooting](#troubleshooting)
6. [Advanced Configuration](#advanced-configuration)

---

## 🚀 Quick Start

**TL;DR - One Command to Rule Them All:**

```bash
python run_copilot.py
```

That's it! This will:
- ✅ Check your environment
- ✅ Start the backend server
- ✅ Start the frontend UI
- ✅ Open your browser to the job queue

Press `Ctrl+C` to stop everything.

---

## 🔧 Initial Setup

### Prerequisites

Before using CareerCopilot, ensure you have:

1. **Python 3.10+** installed
2. **Node.js 18+** and Yarn 4 installed
3. **Your resume** prepared in Markdown format

### Step 1: Install Dependencies

```bash
# Install Python dependencies
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt

# Install Node dependencies
cd frontend
yarn install
cd ..
```

### Step 2: Add Your Resume

1. Open `user_profile/resume.md`
2. Replace the template with your actual resume
3. Use Markdown formatting (see template for examples)

**Example structure:**
```markdown
# John Doe
Senior Software Engineer | Melbourne, VIC

## Experience
### Senior Developer at CompanyX (2020-Present)
- Built scalable microservices...

## Skills
- Python, TypeScript, React
- Cloud: AWS, GCP

## Education
Bachelor of Computer Science - University of Melbourne (2016)
```

### Step 3: (Optional) Add Google Workspace Credentials

**To enable Calendar, Tasks, and Google Docs integration:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable APIs:
   - Google Calendar API
   - Google Tasks API
   - Google Docs API
4. Create Service Account credentials
5. Download the JSON key file
6. Save as `credentials.json` in the project root

**Without this file:** Calendar and Tasks features will be disabled (app still works!)

### Step 4: (Optional) Add Firebase Credentials

**To enable data persistence (jobs saved forever):**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Go to Project Settings → Service Accounts
5. Click "Generate new private key"
6. Download the JSON file
7. Save as `firebase_credentials.json` in the project root

**Without this file:** Jobs are saved in-memory (lost on restart)

---

## 💼 Daily Usage

### Starting CareerCopilot

```bash
# From project root directory:
python run_copilot.py
```

**What happens:**
1. ✅ Environment check runs automatically
2. 🔌 Backend API starts (http://localhost:8000)
3. 🎨 Frontend UI starts (http://localhost:5173)
4. 🌐 Browser opens to job queue

### Stopping CareerCopilot

Press `Ctrl+C` in the terminal where you started it.

**Everything shuts down gracefully:**
- Backend server stopped
- Frontend server stopped
- All processes cleaned up

---

## 📋 Workflow Guide

### The Complete Job Application Flow

#### 1. **Clip a Job** 📎

**Option A: Using Browser Extension** (Coming soon)
- Click CareerCopilot extension icon
- Job URL automatically captured

**Option B: Manual Entry** (Current method)
- Copy job URL from job board
- Use API directly or wait for UI:
  ```bash
  curl -X POST http://localhost:8000/api/ingest/clip \
    -H "Content-Type: application/json" \
    -d '{"url": "https://example.com/job", "notes": "Referral from Jane"}'
  ```

**Result:** Job appears in your queue with status "Pending Analysis"

---

#### 2. **Analyze the Job** 🔍

**In the UI:**
1. Navigate to http://localhost:5173/job-queue
2. Find your clipped job (shows "Pending Analysis")
3. Click **"Analyze with JobScout"** button
4. Wait 10-30 seconds while AI extracts:
   - Job title
   - Company name
   - Salary range
   - Application deadline
   - Key requirements

**Result:** Job card updates with extracted information, status changes to "Ready to Apply"

**Behind the scenes:**
- JobScout Agent scrapes the job page
- Gemini AI extracts structured data
- Information saves to database (if Firestore enabled)

---

#### 3. **Draft  Cover Letter** ✍️

**In the UI:**
1. Find your analyzed job (status: "Ready to Apply")
2. Click **"Draft Application"** button
3. Wait 20-40 seconds while Ghostwriter Agent:
   - Loads your resume from `user_profile/resume.md`
   - Combines it with job details
   - Generates tailored cover letter (350 words)
4. Cover letter appears in a modal dialog

**Features:**
- ✅ Highlights your matching skills
- ✅ Addresses specific requirements
- ✅ Professional yet enthusiastic tone
- ✅ Australian English spelling
- ✅ Company and role-specific

**Actions:**
- Click **"Copy to Clipboard"** - Paste into your application
- (Optional) Click "Create Google Doc" - Saves to Google Drive

---

#### 4. **Apply to the Job** 🎯

**Manual steps (you do this):**
1. Copy the generated cover letter
2. Customize it if needed (add personal touches)
3. Go to the company's application page
4. Paste your cover letter
5. Attach resume and other documents
6. Submit!

**Track your application:**
- Mark as "Applied" in CareerCopilot (feature coming soon)
- Add notes about the application
- Set reminders for follow-up

---

### Tips for Best Results

#### Resume Quality
- ✅ **Be specific:** Include concrete achievements with metrics
- ✅ **Use keywords:** Mirror industry terminology
- ✅ **Keep updated:** Review and refresh monthly
- ❌ **Avoid:** Generic buzzwords without context

#### Job Analysis
- ✅ **Use original URLs:** Direct links to job postings work best
- ✅ **Wait for completion:** Don't click analyze multiple times
- ⚠️ **Note:** Some job boards block scraping (use manual entry)

#### Cover Letters
- ✅ **Review AI output:** Always read before sending
- ✅ **Personalize:** Add specific anecdotes or examples
- ✅ **Adjust tone:** Modify for company culture
- ⚠️ **Remember:** AI is a starting point, you're the expert

---

## 🔧 Troubleshooting

### Common Issues

#### "Pre-flight check failed"

**Symptoms:** `run_copilot.py` exits with errors

**Solutions:**
```bash
# Check what's missing:
python tools/doctor.py

# Common fixes:
# 1. Missing resume
nano user_profile/resume.md  # Add your resume

# 2. Missing node_modules
cd frontend && yarn install && cd ..

# 3. Missing virtual environment
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

---

#### "Backend failed to start"

**Symptoms:** Error message about uvicorn or port 8000

**Solutions:**
```bash
# 1. Check if port 8000 is in use
lsof -i :8000  # Kill conflicting process

# 2. Check Python dependencies
source .venv/bin/activate
pip install -r backend/requirements.txt

# 3. Check for errors manually
cd backend
../.venv/bin/uvicorn app.main:app --reload
# Read error message
```

---

#### "Frontend failed to start"

**Symptoms:** Error about yarn or node_modules

**Solutions:**
```bash
# 1. Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
yarn install

# 2. Check Node version
node --version  # Should be 18+
yarn --version

# 3. Try running manually
yarn dev
# Read error message
```

---

#### "Jobs not saving between restarts"

**This is expected if you don't have `firebase_credentials.json`!**

**To fix (enable persistence):**
1. Add Firebase credentials (see Setup Step 4)
2. Restart CareerCopilot
3. Check storage status: http://localhost:8000/api/ingest/storage/status
4. Should show `"mode": "firestore"`

---

#### "Analyze button does nothing"

**Reasons:**
- Network timeout
- Job page blocks scraping
- Invalid URL

**Solutions:**
1. Check browser console for errors (F12)
2. Try a different job URL
3. Check backend logs in terminal
4. Verify job URL is accessible

---

#### "Cover letter is generic"

**This means your resume needs work!**

**Fixes:**
1. Add more specific achievements to `user_profile/resume.md`
2. Include metrics and numbers
3. Add relevant skills matching the job
4. Be more specific about technologies/tools used

---

## 🚀 Advanced Configuration

### Environment Variables

Create `.env` files for custom configuration:

**`backend/.env`:**
```bash
# API Configuration
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///data/careercopilot.db

# Google Services
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json

# Optional
ENV=development
LOG_LEVEL=INFO
```

**`frontend/.env`:**
```bash
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
# Add other Vite vars here
```

---

### Custom Ports

**Change backend port:**
```bash
# Edit run_copilot.py, line with uvicorn:
# Change --port 8000 to --port 8080
```

**Change frontend port:**
```bash
# Edit frontend/vite.config.ts:
server: {
  port: 3000  // Change from 5173
}
```

---

### Running Without the Launcher

**Manual startup (for debugging):**

```bash
# Terminal 1: Backend
cd backend
source ../.venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
yarn dev

# Open browser manually:
# http://localhost:5173/job-queue
```

---

## 📊 Monitoring & Logs

### Health Checks

```bash
# Backend health
curl http://localhost:8000/health

# Storage status
curl http://localhost:8000/api/ingest/storage/status

# API documentation
# Open: http://localhost:8000/docs
```

### Viewing Logs

**Backend logs:**
- Shown in terminal where `run_copilot.py` was started
- Or if running manually, in the uvicorn terminal

**Frontend logs:**
- Browser console (F12 → Console tab)
- Or terminal if running `yarn dev` manually

**Common log patterns:**
- `✓` - Success
- `[!]` - Warning (non-critical)
- `[ERROR]` - Something failed (check details)

---

## 📚 Additional Resources

### Documentation
- **Full Architecture:** `docs/PROJECT_ARCHITECTURE.md`
- **Phase 6 Features:** `docs/PHASE_6_GHOSTWRITER_COMPLETE.md`
- **Data Persistence:** `docs/DATA_PERSISTENCE_FIX_COMPLETE.md`
- **Firebase Setup:** `docs/FIREBASE_CREDENTIALS_SETUP.md`
- **MVP Analysis:** `docs/MVP_GAP_ANALYSIS.md`

### Getting Help

1. **Check logs** - Most issues show errors in terminal
2. **Run doctor** - `python tools/doctor.py`
3. **Read error messages** - They're usually specific
4. **Check documentation** - See above links

---

## 🎉 Success Checklist

You're using CareerCopilot effectively if:

- [x] Resume is in `user_profile/resume.md` and detailed
- [x] Launcher starts without errors (`python run_copilot.py`)
- [x] Jobs appear in queue after clipping
- [x] JobScout extracts accurate information
- [x] Ghostwriter generates tailored cover letters
- [x] You're customizing AI output before sending
- [x] You're tracking applications effectively

---

## 🚀 Quick Reference

### Essential Commands

| Action | Command |
|--------|---------|
| **Start Everything** | `python run_copilot.py` |
| **Check Environment** | `python tools/doctor.py` |
| **Stop Everything** | `Ctrl+C` |
| **View API Docs** | http://localhost:8000/docs |
| **Open Job Queue** | http://localhost:5173/job-queue |

### Key Endpoints

| URL | Purpose |
|-----|---------|
| http://localhost:5173/job-queue | Main application UI |
| http://localhost:8000/docs | API documentation |
| http://localhost:8000/health | Health check |
| http://localhost:8000/api/ingest/storage/status | Data persistence status |

---

## 📝 Version Information

**Version:** 1.0.0
**Release Date:** January 1, 2026
**Mode:** Single-User
**Status:** Production Ready ✅

---

**Happy job hunting! May your applications be many and your offers be better! 🎯✨**
