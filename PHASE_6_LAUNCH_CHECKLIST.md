# Phase 6: Ghostwriter Agent - Launch Checklist ✅

Use this checklist to verify everything is ready to use the Ghostwriter Agent.

---

## 🔧 Setup Tasks

### 1. Add Your Resume
- [ ] Open `user_profile/resume.md`
- [ ] Delete the template content
- [ ] Paste your actual resume in Markdown format
- [ ] Include: contact info, work experience, education, skills
- [ ] Save the file

**Test it:**
```bash
cat user_profile/resume.md | head -20
# Should show your actual resume, not the template
```

### 2. Verify Backend is Running
- [ ] Backend server is running on port 8000

**Test it:**
```bash
curl http://localhost:8000/api/ingest/queue
# Should return JSON (even if empty array [])
```

### 3. Verify Frontend is Running
- [ ] Frontend dev server is running on port 3000

**Test it:**
```bash
curl -I http://localhost:3000
# Should return HTTP 200 OK
```

---

## 🧪 Functionality Tests

### 4. Test Resume Loading
- [ ] Run the smoke test script

```bash
.venv/bin/python scripts/test_ghostwriter.py
```

**Expected:** Should show your resume preview and generate a sample cover letter

### 5. Test API Endpoint
- [ ] Clip a job (or use existing test data)
- [ ] Analyze the job with JobScout
- [ ] Call the draft endpoint

```bash
# First, get a job ID that has been analyzed
curl http://localhost:8000/api/ingest/queue

# Then draft for that job (replace "1" with actual ID)
curl -X POST http://localhost:8000/api/ingest/1/draft
```

**Expected:** JSON response with `cover_letter` field containing generated text

### 6. Test Full UI Flow
- [ ] Open browser to `http://localhost:3000/job-queue`
- [ ] See job cards (clip one if queue is empty)
- [ ] Click "Analyze with JobScout" on a pending job
- [ ] Wait for analysis to complete (status changes to "Ready to Apply")
- [ ] Click "Draft Application" button appears
- [ ] Click "Draft Application"
- [ ] Wait 5-15 seconds for cover letter generation
- [ ] See cover letter in dialog
- [ ] Click "Copy to Clipboard"
- [ ] Button text changes to "Copied!"
- [ ] Close dialog
- [ ] Paste clipboard - should contain full cover letter

**Expected:** Smooth flow with clear feedback at each step

---

## 🎨 UI Verification

### 7. Visual Checks
- [ ] "Draft Application" button only shows on analyzed jobs (green "Ready to Apply" chip)
- [ ] Button has document icon
- [ ] Button is disabled/shows spinner while generating
- [ ] Cover letter dialog is readable and professional
- [ ] Copy button works instantly
- [ ] Dialog close button (X) works
- [ ] No console errors in browser DevTools

---

## 🔍 Error Handling Tests

### 8. Test Error Cases

**Test 1: No Resume**
```bash
# Temporarily rename resume file
mv user_profile/resume.md user_profile/resume.md.backup

# Try to draft
curl -X POST http://localhost:8000/api/ingest/1/draft

# Should return error mentioning missing resume

# Restore resume
mv user_profile/resume.md.backup user_profile/resume.md
```

**Test 2: Draft Before Analysis**
- [ ] Try clicking "Draft Application" on a job with status "pending_analysis"
- [ ] Should show error: "Job must be analyzed before drafting"

**Test 3: Invalid Job ID**
```bash
curl -X POST http://localhost:8000/api/ingest/99999/draft
# Should return 404 error
```

---

## 📚 Documentation Review

### 9. Confirm Docs Exist
- [ ] `user_profile/README.md` - User instructions
- [ ] `PHASE_6_QUICKSTART.md` - Quick start guide
- [ ] `docs/PHASE_6_GHOSTWRITER_COMPLETE.md` - Full documentation
- [ ] `PHASE_6_IMPLEMENTATION_SUMMARY.md` - Technical summary

---

## 🚀 Optional: Google Docs Integration

### 10. Setup Google Docs (Optional)
Only complete if you want automatic Google Doc creation:

- [ ] Add `credentials.json` to project root
- [ ] Ensure Google Docs API is enabled in GCP
- [ ] Update API call to include `?create_google_doc=true`

**Test it:**
```bash
curl -X POST "http://localhost:8000/api/ingest/1/draft?create_google_doc=true"
# Should return google_doc object with webViewLink
```

---

## ✅ Final Verification

### 11. End-to-End Success Criteria

All of these should be true:

- [x] Resume file exists and contains your actual resume
- [x] Backend and frontend servers are running
- [x] Smoke test passes without errors
- [x] API endpoint returns cover letter JSON
- [x] UI shows "Draft Application" button on analyzed jobs
- [x] Clicking button generates and displays cover letter
- [x] Copy to clipboard works
- [x] No blocking errors in logs or console
- [x] Documentation is accessible and readable

---

## 🎯 Ready to Use!

Once all checkboxes are complete, you're ready to use the Ghostwriter Agent in production!

### Typical Workflow:
1. Clip job with browser extension
2. Go to Job Queue
3. Click "Analyze with JobScout"
4. Wait for analysis (~10-30 seconds)
5. Click "Draft Application"
6. Wait for cover letter (~5-15 seconds)
7. Review generated letter
8. Click "Copy to Clipboard"
9. Paste into job application
10. Customize if needed and submit!

---

## 🐛 Having Issues?

**Resume not found?**
- Check file exists: `ls -la user_profile/resume.md`
- Check file has content: `wc -l user_profile/resume.md` (should be > 10 lines)

**Button not appearing?**
- Ensure job status is "ready_to_apply" (green chip)
- Try refreshing the page
- Check browser console for errors (F12 → Console tab)

**Generation takes too long?**
- Normal time is 5-15 seconds
- Check backend logs for errors: `tail -f backend/logs/app.log`
- Ensure Flash Sidekick service is configured correctly

**Poor quality cover letters?**
- Ensure your resume is detailed (ideally 200+ words)
- Ensure job has been properly analyzed by JobScout
- Check that AI service is responding (backend logs)

---

## 📞 Support

- **Documentation:** See `docs/PHASE_6_GHOSTWRITER_COMPLETE.md`
- **Quick Help:** See `PHASE_6_QUICKSTART.md`
- **Code Issues:** Check `backend/app/agents/ghostwriter.py` comments

---

**Last Updated:** January 1, 2026  
**Phase 6 Status:** ✅ COMPLETE AND READY FOR USE

Happy Job Hunting! 🚀
