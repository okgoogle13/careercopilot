# CareerCopilot

CareerCopilot is an AI-powered career application assistant designed to help job seekers streamline their application process. It provides intelligent document generation, ATS optimization, and proactive application management. This tool is particularly helpful for those transitioning into new career fields, such as from finance to social work.

## 🎯 Features

- **AI-Powered Document Generation**: Create tailored resumes, cover letters, and Key Selection Criteria (KSC) responses.
- **ATS Optimization**: Analyze and score your resume against job descriptions to ensure it passes through Applicant Tracking Systems.
- **Keyword Analysis**: Get recommendations for keywords to include in your resume.
- **Authentic Voice Generation**: The AI learns your writing style to generate documents that sound like you.
- **Proactive Job Management**: Monitor your Gmail for job opportunities and get reminders for application deadlines.
- **Professional Branding**: Choose from a variety of professional themes to create consistent and beautifully formatted documents.
- **Application Tracking**: Keep track of all your job applications in one place.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Python, FastAPI
- **Database**: Firebase Firestore, Pinecone (for vector storage)
- **AI Services**: Google Gemini, OpenAI, Anthropic
- **Cloud Services**: Firebase, Google Cloud Run
- **Authentication**: Firebase Authentication

## 🏛️ Architecture Overview

The system is built with a modern, scalable architecture using a React frontend, a FastAPI backend on Google Cloud Run, and Firebase for database and authentication.

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Web     │    │   FastAPI        │    │   Firebase      │
│   Frontend      │◄──►│   Backend        │◄──►│   Services      │
│                 │    │   (Cloud Run)    │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                       │
         │                        │              ┌────────┴────────┐
         │                        │              │                 │
         │                        │         Firestore        Cloud Storage
         │                        │              │                 │
         │                        │              │            ┌────┴────┐
         │                        │              │            │         │
         │              ┌─────────┴──────────┐   │        User Docs  Templates
         │              │                    │   │                     │
         │              │   Genkit AI        │   │                     │
         │              │   Workflows        │   │                     │
         │              │                    │   │                     │
         │              └────────────────────┘   │                     │
         │                        │              │                     │
         │                        │              │                     │
    ┌────┴────┐          ┌────────┴──────────────┴──────┐              │
    │         │          │                              │              │
Gmail API  Calendar API  │        AI Services          │              │
    │         │          │                              │              │
    │         │          │  Gemini │ Langextract │ RAG  │              │
    └─────────┘          └─────────────────────────────┘              │
                                   │                                   │
                              Vector Store                              │
                            (Firestore/JSON)                           │
```

For a more detailed explanation of the architecture, please see the [Solution Design Document](./docs/solution-design.md).

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.9 or higher)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/careercopilot.git
    cd careercopilot
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

### Configuration

1.  **Set up Firebase and Google Cloud:**
    This project requires extensive setup of Firebase, Google Cloud, and various third-party services. For detailed instructions, please follow the [SETUP_GUIDE.md](./SETUP_GUIDE.md). This guide will walk you through creating projects, enabling APIs, and getting the necessary API keys and service account credentials.

2.  **Configure environment variables:**
    -   **Backend:** The backend uses environment variables for configuration. You will need to set these up in your local environment or in your cloud run service.
    -   **Frontend:** Copy the example environment file and fill in the required values:
        ```bash
        cp frontend/.env.example frontend/.env
        ```
        You will need to add your Firebase configuration to this file.

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd backend
    uvicorn app.main:app --reload
    ```
    The backend will be available at `http://localhost:8000`.

2.  **Start the frontend development server:**
    ```bash
    cd frontend
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.

## 🧪 Running Tests

To run the backend tests, navigate to the `backend` directory and run pytest:

```bash
cd backend
pytest
```

## ☁️ Deployment

The application is designed to be deployed to Google Cloud Run. The `SETUP_GUIDE.md` file contains detailed instructions for deploying the application to a staging or production environment.

## 🙌 Contributing

Contributions are welcome! If you have a feature request or have found a bug, please open an issue.

---
*This README was generated by an AI assistant.*
