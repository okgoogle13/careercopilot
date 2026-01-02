# CareerCopilot Clipper - Chrome Extension

## Overview
One-click job saving from Seek, Jora, and EthicalJobs directly to your CareerCopilot dashboard. Replaces the manual workflow of copying URLs to Google Tasks.

## Installation

### Step 1: Load Extension in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `frontend/extension/` folder from this repository

### Step 2: Verify Backend is Running
Ensure your CareerCopilot backend is running on `http://localhost:8000`

```bash
cd backend
../.venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Usage

1. **Navigate** to a job listing on:
   - seek.com.au
   - ethicaljobs.com.au
   - au.jora.com
   
2. **Click** the CareerCopilot Clipper extension icon in your browser toolbar

3. **Add notes** (optional): e.g., "Referral from Sarah"

4. **Click** "Clip Job to Dashboard"

5. **Success!** The job is now queued for processing

## How It Works

```
┌─────────────────┐
│ Job Listing     │
│ (Seek/Jora)     │
└────────┬────────┘
         │
         │ 1. Click Extension
         ▼
┌─────────────────┐
│ Chrome Extension│
│ - Captures URL  │
│ - Adds Notes    │
└────────┬────────┘
         │
         │ 2. POST /api/ingest/clip
         ▼
┌─────────────────┐
│ Backend API     │
│ - Queue Job     │
│ - Return Status │
└────────┬────────┘
         │
         │ 3. Background Processing
         ▼
┌─────────────────┐
│ JobScout Agent  │
│ - Playwright    │
│ - Flash Sidekick│
│ - Extract Data  │
└────────┬────────┘
         │
         │ 4. Create Task/Event
         ▼
┌─────────────────┐
│ Google Workspace│
│ - Task Created  │
│ - Event Scheduled│
└─────────────────┘
```

## Files

- **manifest.json**: Extension configuration and permissions
- **popup.html**: User interface for the extension
- **popup.js**: Communication logic with backend API

## API Endpoint

**POST** `http://localhost:8000/api/ingest/clip`

**Request Body:**
```json
{
  "url": "https://www.seek.com.au/job/12345",
  "notes": "Referral from Sarah",
  "source": "browser_extension"
}
```

**Response:**
```json
{
  "status": "accepted",
  "message": "Job sent to CareerCopilot."
}
```

## Troubleshooting

### Extension not appearing?
- Verify Developer mode is enabled
- Check that you selected the correct folder (`frontend/extension/`)
- Refresh the extensions page

### "Failed to reach localhost:8000"?
- Ensure backend server is running
- Check server logs for errors
- Verify CORS settings allow localhost

### Jobs not processing?
- Check backend logs: `backend/app/api/ingest.py`
- Look for `[*] INGESTION STARTED` messages
- Verify JobScout agent is initialized

## Development Roadmap

### Phase 1: Basic Clipping ✅
- [x] Chrome extension scaffold
- [x] API endpoint `/api/ingest/clip`
- [x] Background task queuing

### Phase 2: Full Integration (Next)
- [ ] Connect JobScout agent for scraping
- [ ] Extract job metadata using Genkit
- [ ] Create Google Tasks automatically
- [ ] Add Calendar events for deadlines

### Phase 3: Intelligence
- [ ] Auto-match against user profile
- [ ] Generate tailored resume snippets
- [ ] Suggest KSC responses
- [ ] Track application progress

## Permissions

The extension requires:
- **activeTab**: Read current tab URL
- **scripting**: Inject content if needed (future)
- **host_permissions**: Access to job sites and localhost API

## Security

- All communication is localhost-only (no external servers)
- No data is stored in the extension itself
- Backend handles all authentication and storage
- HTTPS required for production deployments
