# CareerCopilot 🚀

**CareerCopilot** is an AI-powered career management platform featuring a **Dual-Engine Architecture** (FastAPI + React) that helps users streamline their job search, manage resumes, and automate career tracking.

## ✨ Key Features

- **Profile Ingestion Engine**: Upload PDFs/IDFs, extract data via Google Genkit, and structure career history.
- **Resume Optimizer** ✨ NEW: AI-powered keyword integration for ATS optimization with company-specific tailoring.
- **Company Analyzer** ✨ NEW: Analyze company websites to extract keywords and communication tone for targeted resumes.
- **Validation Dashboard**: Review and edit AI-extracted career data with Northcote Curio M3 Expressive UI.
- **Dual-Engine AI**: Leveraging Gemini 3.0 Flash (Speed) and Gemini 3.0 Pro (Reasoning).
- **Automated UAT**: Full end-to-end testing suite with Playwright.
- **Chrome Extension**: Intelligent job capture with auto-deadline extraction and calendar reminders.

## 🏗️ Architecture

### Frontend (`/frontend`)

- **Core**: React 18, TypeScript, Vite
- **State**: React Context + Hooks
- **Testing**: Playwright (E2E), Jest (Unit)

### Design System

- **UI System**: Northcote Contemporary Australian Design System on top of MUI v5 and Material 3 Expressive
- **Visual Identity**: Dark UI anchored in Asphalt Black (`#1A1714`) with Paper White (`#F5F0E8`) for high-contrast text
- **Core Palette**: Wattle Gold (`#D4A84B`) for primary actions, Waratah Red (`#C45C4B`) for urgency, Ochre Earth (`#B8733D`) and Concrete Grey (`#A39B8F`) as structural neutrals, Gum Leaf Green (`#6B7F6E`) as a growth accent
- **Tokens**: Centralised in `design-system/tokens.json` and exposed via CSS variables in `design-system/northcote.css` (color, shape, elevation, motion)
- **Aesthetic**: Peter Drew–influenced street art energy, Material 3 Expressive motion, Australian endemic species as living symbols (Kookaburra, Waratah, Banksia, Eucalyptus), anti‑colonial and contemporary (no Victorian cabinet / specimen framing)

### Backend (`/backend`)

- **Core**: FastAPI (Python 3.12+)
- **AI Orchestration**: Google Genkit + Gemini 3.0
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
- Docker Desktop (Optional, for containerized run)

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

- Google Gemini 3.0 Pro (AI optimization)
- BeautifulSoup4 (company website scraping)
- Genkit (AI flow orchestration)

**Design:**

- Northcote Curio M3 Expressive design system
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

````

### Option B: Docker Compose
```bash
docker compose up --build
````

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
