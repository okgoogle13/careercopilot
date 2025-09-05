# CareerCopilot

> AI-powered career management platform built with modern web technologies

## 🏗️ Architecture

**Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
**Backend**: Python + FastAPI + SQLAlchemy + Alembic
**Functions**: Firebase Functions v2 + TypeScript
**Database**: PostgreSQL + Firebase Firestore
**AI/ML**: Google AI Platform + Anthropic Claude + OpenAI
**Infrastructure**: Google Cloud Platform + Firebase

## 📁 Project Structure

```
careercopilot/
├── 📱 frontend/           # React TypeScript SPA
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API clients
│   │   └── utils/         # Utility functions
│   ├── public/           # Static assets
│   └── tests/            # Frontend tests
├── 🐍 backend/           # Python FastAPI backend
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core utilities
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic
│   │   └── tests/        # Backend tests
│   ├── migrations/       # Database migrations
│   └── requirements.in   # Python dependencies
├── ⚡ functions/         # Firebase Functions
│   └── src/              # TypeScript functions
├── 📚 docs/              # Documentation
│   ├── setup/           # Setup guides
│   ├── deployment/      # Deployment docs
│   └── development/     # Development docs
└── 🛠️ scripts/           # Utility scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ & Yarn 4+
- Python 3.12+ & pip
- Firebase CLI
- Google Cloud SDK

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repo-url>
   cd careercopilot
   yarn install
   cd backend && pip install -r requirements.txt
   ```

2. **Start development servers:**
   ```bash
   # Frontend (React)
   yarn dev

   # Backend (FastAPI)
   cd backend && uvicorn app.main:app --reload

   # Functions (Firebase)
   yarn dev:functions
   ```

3. **Access applications:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Functions: http://localhost:5001

## 📋 Available Scripts

### Root Level
```bash
yarn dev              # Start frontend development
yarn build            # Build all workspaces
yarn lint             # Lint all code
yarn test             # Run tests
yarn clean            # Clean build artifacts
```

### Frontend
```bash
yarn dev              # Start dev server
yarn build            # Build for production
yarn test             # Run Jest tests
yarn lint             # ESLint check
yarn type-check       # TypeScript check
```

### Functions
```bash
yarn serve            # Start emulator
yarn build            # Compile TypeScript
yarn deploy           # Deploy to Firebase
yarn lint             # ESLint check
```

### Backend
```bash
uvicorn app.main:app --reload    # Start dev server
alembic upgrade head             # Run migrations
pytest                          # Run tests
```

## 🔧 Configuration

### Environment Variables

**Frontend** (`.env`):
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_API_BASE_URL=http://localhost:8000
```

**Backend** (`.env`):
```bash
DATABASE_URL=postgresql://user:pass@localhost/db
FIREBASE_PROJECT_ID=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=path/to/key.json
```

**Functions** (Firebase Secrets):
```bash
firebase functions:secrets:set API_KEY
firebase functions:secrets:set DATABASE_URL
```

## 🏗️ Build & Deploy

### Development
```bash
yarn dev              # Start all services
```

### Production
```bash
yarn build            # Build frontend & functions
cd backend && pip install -r requirements.txt
# Deploy using your preferred method
```

## 📖 Documentation

- [Setup Guide](docs/setup/) - Complete setup instructions
- [API Documentation](docs/api/) - Backend API reference
- [Deployment Guide](docs/deployment/) - Production deployment
- [Contributing](docs/contributing/) - Development guidelines

## 🛠️ Tech Stack Details

### Frontend Dependencies
- **UI Framework**: React 19 with hooks & concurrent features
- **Styling**: Tailwind CSS + Radix UI components
- **Build Tool**: Vite for fast development & optimal builds
- **Routing**: React Router v7
- **Forms**: React Hook Form + Zod validation
- **State**: React Context + Custom hooks
- **Testing**: Jest + Testing Library + Playwright

### Backend Dependencies
- **Framework**: FastAPI with automatic OpenAPI docs
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Migrations**: Alembic for schema management
- **AI/ML**: Google AI Platform + Anthropic + OpenAI
- **Auth**: Firebase Authentication integration
- **Validation**: Pydantic models
- **Testing**: Pytest with fixtures

### Functions Dependencies
- **Runtime**: Firebase Functions v2 (Node.js 20)
- **Language**: TypeScript with strict mode
- **Secrets**: Firebase Secret Manager integration
- **Params**: Modern params subpackage for configuration

## 📄 License

UNLICENSED - Private project

---

> Built with ❤️ by the CareerCopilot Team
