# 🚀 CareerCopilot

**Your AI-powered co-pilot for navigating the job market, from resume optimization to career strategy.**

CareerCopilot is a comprehensive platform designed to empower job seekers by leveraging cutting-edge AI. It goes beyond simple document creation, offering a suite of intelligent tools to analyze job descriptions, score resumes against applicant tracking systems (ATS), and provide personalized career insights.

---

### Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development Setup](#local-development-setup)
- [✅ Running Tests](#-running-tests)
- [📄 License](#-license)

---

## ✨ Key Features

- **🤖 AI-Powered ATS Analysis**: Get an instant, detailed score for your resume against any job description, with actionable feedback on keywords, semantics, and formatting.
- **✍️ Smart Document Editor**: Craft compelling resumes and cover letters with an AI-assistant that suggests improvements, optimizes content for specific roles, and helps you highlight your strengths.
- **🎯 Advanced Job Matching**: Discover opportunities that truly align with your skills and career goals using sophisticated matching algorithms.
- **🧠 Career Intelligence Hub**: Gain insights into market trends, identify skill gaps, and receive personalized recommendations for your career growth.
- **🎤 Personalized Onboarding**: Create a unique "voice profile" during onboarding by providing documents, allowing the AI to understand your personal style and tone for more authentic document generation.

---

## 🛠️ Tech Stack

The application is built with a modern, robust, and scalable technology stack.

- **Frontend**:
  - **Framework**: React 19 with Vite
  - **Language**: TypeScript
  - **UI Library**: Material-UI (MUI) for a comprehensive component system.
  - **Styling**: Styled-components via MUI's `styled` API.
  - **Testing**: Jest, React Testing Library & Playwright for end-to-end tests.

- **Backend**:
  - **Framework**: FastAPI (Python) for high-performance APIs.
  - **Language**: Python 3.12+
  - **Database**: PostgreSQL (production) & SQLite (development).
  - **ORM**: SQLAlchemy with Alembic for database migrations.
  - **Async Tasks**: Celery with Redis for background job processing.
  - **Testing**: Pytest.

- **AI & Machine Learning**:
  - **Orchestration**: Google Genkit for building and managing AI flows.
  - **Models**: Google Gemini family of models.
  - **Infrastructure**: Google AI Platform.

- **Infrastructure & DevOps**:
  - **Containerization**: Docker & Docker Compose.
  - **Authentication**: Firebase Authentication.
  - **Serverless**: Firebase Functions for event-driven background tasks.
  - **Hosting**: Google Cloud Platform & Firebase.

---

## 📁 Project Structure

The repository is a monorepo containing distinct packages for each part of the application:

```
careercopilot/
├── 📱 frontend/      # The React single-page application (Vite + MUI)
├── 🐍 backend/       # The Python FastAPI server, database logic, and AI flows
├── ⚡ functions/     # Serverless functions for background tasks (e.g., user cleanup)
├── 📚 docs/          # Project documentation
└── 🛠️ scripts/       # Helper scripts for development and operations
```

---

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

- **Node.js**: v18+
- **Yarn**: v4+
- **Python**: v3.12+
- **Docker & Docker Compose**: Latest stable versions
- **Firebase CLI**: For managing Firebase services.
- **Google Cloud SDK**: For interacting with GCP services.

### Local Development Setup

1.  **Clone the Repository**
    ```bash
    git clone <your-repo-url>
    cd careercopilot
    ```

2.  **Set Up Environment Variables**
    This project uses `.env` files for managing environment variables.
    - In the `backend/` directory, copy `env.example` to `.env` and fill in the required values (e.g., database URL, API keys).
    - In the `frontend/` directory, copy `.env.example` to `.env`.

3.  **Install Backend Dependencies**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

4.  **Install Frontend Dependencies**
    ```bash
    cd ../frontend
    yarn install
    ```

5.  **Launch Services**
    - **Run the Backend Server**:
      ```bash
      # From the /backend directory
      uvicorn app.main:app --reload
      ```
    - **Run the Frontend Development Server**:
      ```bash
      # From the /frontend directory
      yarn dev
      ```

6.  **Access the Applications**
    - **Frontend**: [http://localhost:5173](http://localhost:5173)
    - **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ✅ Running Tests

To ensure code quality and stability, run the test suites for both the frontend and backend.

### Backend Tests

From the `backend/` directory, run Pytest:
```bash
pytest
```

### Frontend Tests

From the `frontend/` directory, run Jest for unit/integration tests and Playwright for end-to-end tests:
```bash
# Run unit and component tests
yarn test

# Run end-to-end tests
yarn playwright test
```

---

## 📄 License

This is a private project and is not licensed for reuse or distribution.