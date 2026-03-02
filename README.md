# CareerCopilot 🚀

<<<<<<< HEAD
**CareerCopilot** is an AI-powered career management platform featuring a **Dual-Engine Architecture** (FastAPI + React) that helps users streamline their job search, manage resumes, and automate career tracking.

## ✨ Key Features

- **Profile Ingestion Engine**: Upload PDFs/IDFs, extract data via Google Genkit, and structure career history.
- **Resume Optimizer** ✨ NEW: AI-powered keyword integration for ATS optimization with company-specific tailoring.
- **Company Analyzer** ✨ NEW: Analyze company websites to extract keywords and communication tone for targeted resumes.
- **Validation Dashboard**: Review and edit AI-extracted career data with  M3 Expressive UI.
- **Dual-Engine AI**: Leveraging Gemini Flash (Speed) and Gemini Pro (Reasoning).
- **Automated UAT**: Full end-to-end testing suite with Playwright.
- **Chrome Extension**: Intelligent job capture with auto-deadline extraction and calendar reminders.

## 🏗️ Architecture

### Frontend (`/frontend`)
- **Core**: React 18, TypeScript, Vite
- **UI System**: Material-UI (MUI v5) +  M3 Expressive Design System
- **Design Tokens**:  token system (color, shape, elevation, motion)
- **State**: React Context + Hooks
- **Testing**: Playwright (E2E), Jest (Unit)

### Backend (`/backend`)
- **Core**: FastAPI (Python 3.12+)
- **AI Orchestration**: Google Genkit + Gemini 2.5
- **Database**: Firestore (NoSQL)
- **Auth**: Firebase Authentication

### Chrome Extension (`/chrome-extension`)
- **Core**: React, Vite, CRXJS
- **Features**: Universal Scraper, Resume Context, AI Analysis, Calendar Integration

---

## 🚀 Quick Start Guide

### **🎯 One-Click Launch (v1.0)**

```bash
# That's it! One command starts everything:
python3 run_copilot.py
```

**What happens:**
- ✅ Environment checks run automatically
- ✅ Backend API starts (http://localhost:8000)
- ✅ Frontend UI starts (http://localhost:5173)
- ✅ Browser opens to job queue
- ✅ Press Ctrl+C to stop everything

**See [`USER_MANUAL.md`](USER_MANUAL.md) for complete setup guide.**

---

### 1. Prerequisites
- Node.js v18+ & Yarn 4
- Python 3.12+ & pip
- Firebase CLI (`npm install -g firebase-tools`)
- Vercel account (for deployment) → [vercel.com](https://vercel.com)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/okgoogle13/careercopilot.git
cd careercopilot
```

**Backend Setup:**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

**Frontend Setup:**
```bash
cd frontend
yarn install
```

### 3. Environment Config
Create `.env` files in `backend/` and `frontend/` (see `.env.example`).
**Required Keys:** `GEMINI_API_KEY`, `FIREBASE_CREDENTIALS`

---

## 🎯 New Features: Resume Optimization

### Resume Optimizer
**Automatically optimize your resume for ATS systems with AI-powered keyword integration.**

**How to Use:**
1. Navigate to `/analysis` in the app
2. Paste your resume text
3. Paste the job description
4. (Optional) Add company website URL for targeted optimization
5. Click "Analyze Resume" to see ATS score and missing keywords
6. Click "✨ Auto-Tailor Resume" to get optimized version

**Features:**
- ✅ Natural keyword integration (no fabrication)
- ✅ Company-specific tone matching
- ✅ ATS score analysis with breakdown
- ✅ Missing vs matched keyword visualization
- ✅ Copy-to-clipboard functionality

**Powered by:**
- Google Gemini Pro (AI optimization)
- BeautifulSoup4 (company website scraping)
- Genkit (AI flow orchestration)

**Design:**
-  M3 Expressive design system
- Organic shapes (Pebble, Tech archetypes)
- Spring motion effects
- Sage Green + Soft Coral palette

---

## 🛠️ Running the App

### Option A: Manual Run (Recommended for Dev)

**Terminal 1 (Backend):**
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
# API running at http://localhost:8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
yarn dev
# App running at http://localhost:5173
```

**Terminal 3 (Chrome Extension):**
```bash
cd chrome-extension
yarn dev
# Load unpacked from 'chrome-extension/dist' in chrome://extensions
```
---

## 🧪 Testing Scope

### Automated UAT (End-to-End)
We use Playwright for full verification of the Ingestion Flow.

```bash
# Run all UAT scenarios
cd frontend
yarn test:e2e

# Run specific test
npx playwright test -g "UAT-004"
```

### Unit Tests
```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && yarn test
```

---

## 📂 Project Structure

```
careercopilot/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/             # REST Endpoints
│   │   ├── genkit_flows/    # AI Logic (Gemini)
│   │   └── core/            # Config & Utils
│   └── tests/               # Pytest Suites
├── frontend/                 # React Application
│   ├── src/
│   │   ├── features/        # Feature-based architecture
│   │   └── components/      # Shared MUI components
│   └── tests/e2e/           # Playwright UAT Scenarios
├── servers/                  # MCP Configs (Flash Sidekick)
├── scripts/                  # Automation Scripts (setup-uat.sh)
└── docs/                     # Project Documentation
```

## 🤝 Contributing
1. Create a feature branch (`feat/new-thing`)
2. Commit changes
3. Run UAT tests (`yarn test:e2e`)
4. Open a Pull Request

---
**License**: Unlicensed / Private
=======
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

CareerCopilot is an AI-powered career management platform designed to automate job extraction, analysis, and application drafting.

## 📄 Overview

- **Frontend**: Vite-based React application with modern UI components.
- **Backend API**: Python FastAPI service for AI analysis and data processing.
- **AI Engine**: Powered by Gemini Pro 2.0 (and Flash) for high-performance job analysis.
- **Infrastructure**: Fully containerized with Docker and modular architecture.

## 🚀 Quickstart

Start the entire application with a single command:

```bash
python3 run_copilot.py
```

### Accessing the Platform:
- **Frontend**: [http://localhost:5173/job-queue](http://localhost:5173/job-queue)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Interactive API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### Stop the Application:
Press `Ctrl+C` in the terminal.

## 🏗️ Architecture

- **Root**: Workspace management and cross-service orchestration.
- **`backend/`**: FastAPI server, job analysis flows (Genkit), and database logic.
- **`frontend/`**: Vite React app, design system, and user dashboard.
- **`functions/`**: Firebase Cloud Functions for background tasks.
- **`servers/`**: MCP (Model Context Protocol) servers for AI-IDE integration.

## 🔧 MCP Setup

This repository uses a unified MCP configuration for AI-assisted coding.

1. **Configure**: Use the unified config at `.antigravity/mcp.json`.
2. **Deploy**: Run the helper script to sync with Claude Desktop:
   ```bash
   ./scripts/antigravitymcpwrapper.sh deploy
   ```
3. **Validate**: Check your environment:
   ```bash
   ./scripts/antigravitymcpwrapper.sh validate
   ```

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server |
| `npm run build` | Build both frontend and functions |
| `npm run test` | Run frontend test suite |
| `python3 tools/doctor.py` | Run system health check |

## Git Lock Recovery

Use repo-local git wrappers to avoid stale lock and LFS filter failures:

```bash
./scripts/git-safe.sh preflight
./scripts/git-safe.sh add
./scripts/git-safe.sh commit -m "your message"
./scripts/git-safe.sh push origin <branch>
```

If git operations still fail, run:

```bash
./scripts/git-lock-diagnose.sh
./scripts/git-safe.sh repair
```

---
**Status**: ✅ PRODUCTION READY - v1.0.0
>>>>>>> restoration-KR-Rage-Figma-v2.0
