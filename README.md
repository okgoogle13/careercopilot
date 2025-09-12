
🚀 CareerCopilot
> An AI-powered platform to help you manage your career search, built with a modern web stack.
> 
## 🏗️ Architecture
 * Frontend: React 19, TypeScript, Vite, Tailwind CSS
 * Backend: Python, FastAPI, SQLAlchemy
 * Database: PostgreSQL
 * Cloud Functions: Firebase Functions
 * AI/ML: Google AI Platform
 * Infrastructure: Docker, Google Cloud Platform, Firebase
## 📁 Project Structure
The repository is organized as a monorepo with distinct packages for each part of the application.
careercopilot/
├── 📱 frontend/      # The React single-page application
├── 🐍 backend/       # The Python FastAPI server and database logic
├── ⚡ functions/     # Serverless functions for background tasks
├── 📚 docs/          # Project documentation
└── 🛠️ scripts/       # Helper scripts for development

## 🚀 Quick Start
Prerequisites
 * Node.js (v18+) & Yarn (v4+)
 * Python (v3.12+) & Pip
 * Docker & Docker Compose
 * Firebase CLI & Google Cloud SDK
Local Development Setup
 * Clone the repository:
   git clone <your-repo-url>
cd careercopilot

 * Install all dependencies:
   This command will install dependencies for the root, frontend, and functions packages.
   yarn install

 * Install backend dependencies:
   pip install -r backend/requirements.txt

 * Launch all services with Docker:
   This is the simplest way to get everything running.
   docker-compose up --build

 * Access the applications:
   * Frontend: http://localhost:5173
   * Backend API Docs: http://localhost:8000/docs
## 🔧 Configuration
Copy the example environment files and fill in your local configuration details.
 * Frontend: cp frontend/.env.example frontend/.env
 * Backend: cp backend/.env.example backend/.env
## 🛠️ Tech Stack & Key Libraries
Frontend
 * UI Framework: React 19
 * Styling: Tailwind CSS with Radix UI for accessible components
 * Build Tool: Vite
 * Routing: React Router
 * Forms: React Hook Form with Zod for validation
 * Testing: Jest, React Testing Library & Playwright
Backend
 * Framework: FastAPI for high-performance APIs
 * Database ORM: SQLAlchemy
 * Schema Migrations: Alembic
 * Authentication: Firebase Authentication
 * Data Validation: Pydantic
 * Testing: Pytest
Cloud Functions
 * Runtime: Firebase Functions v2 on Node.js 20
 * Language: TypeScript
 * Secrets Management: Firebase Secret Manager
## 📄 License
This is a private project and is not licensed for reuse or distribution.
