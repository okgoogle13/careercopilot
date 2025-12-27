# CareerCopilot 🚀

**CareerCopilot** is an AI-powered career management platform featuring a **Dual-Engine Architecture** (FastAPI + React) that helps users streamline their job search, manage resumes, and automate career tracking.

## ✨ Key Features

- **Profile Ingestion Engine**: Upload PDFs/IDFs, extract data via Google Genkit, and structure career history.
- **Validation Dashboard**: Review and edit AI-extracted career data with "Electric Alchemist" UI.
- **Dual-Engine AI**: Leveraging Gemini Flash 2.5 (Speed) and Pro 2.5 (Reasoning).
- **Automated UAT**: Full end-to-end testing suite with Playwright.

## 🏗️ Architecture

### Frontend (`/frontend`)
- **Core**: React 18, TypeScript, Vite
- **UI System**: Material-UI (MUI v5) + "Electric Alchemist" Theme
- **State**: React Context + Hooks
- **Testing**: Playwright (E2E), Vitest (Unit)

### Backend (`/backend`)
- **Core**: FastAPI (Python 3.12+)
- **AI Orchestration**: Google Genkit + Gemini 2.5
- **Database**: Firestore (NoSQL)
- **Auth**: Firebase Authentication

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js v18+ & npm
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
npm install
```

### 3. Environment Config
Create `.env` files in `backend/` and `frontend/` (see `.env.example`).
**Required Keys:** `GEMINI_API_KEY`, `FIREBASE_CREDENTIALS`

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
npm run dev
# App running at http://localhost:5173
```

### Option B: Docker Compose
```bash
docker compose up --build
```

---

## 🧪 Testing Scope

### Automated UAT (End-to-End)
We use Playwright for full verification of the Ingestion Flow.

```bash
# Run all UAT scenarios
cd frontend
npx playwright test

# Run specific test
npx playwright test -g "UAT-004"
```

### Unit Tests
```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && npm run test
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
3. Run UAT tests (`npm run test:e2e`)
4. Open a Pull Request

---
**License**: Unlicensed / Private
