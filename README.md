# CareerCopilot

**CareerCopilot** is an AI-powered career management platform designed to help you streamline your job search, manage your resumes and applications, and automate repetitive tasks. This monorepo contains the code for the CareerCopilot frontend, backend, and serverless functions.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/careercopilot.git
   cd careercopilot
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   yarn install
   
   # Install backend dependencies
   cd ../backend
   pip install -r requirements.txt
   ```

3. **Start development servers**
   ```bash
   # Start frontend (in frontend directory)
   yarn dev
   
   # Start backend (in backend directory)
   uvicorn app.main:app --reload
   ```

4. **Run tests**
   ```bash
   # Frontend tests
   cd frontend
   yarn test
   
   # Backend tests
   cd ../backend
   pytest
   ```

## ✨ Features

### Core Features
- **AI-Powered Resume Builder**
  - Create and tailor your resume for specific job applications
  - Get AI-powered suggestions for improvement
  - Export to multiple formats (PDF, DOCX)

- **Job Application Tracker**
  - Track all your job applications in one place
  - Set reminders for follow-ups
  - Monitor application status

- **UI Components**
  - Built with Material-UI v7
  - Fully responsive design
  - Accessible components
  - Dark/light theme support

### Coming Soon
- **Automated Application Filler**
  - Automatically fill out job applications
  - Save time on repetitive tasks

- **Interview Preparation Assistant**
  - AI-powered mock interviews
  - Personalized feedback
  - Common interview questions database

## 🏗️ Architecture

CareerCopilot follows a modern, component-based architecture with a clear separation of concerns.

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI v5
- **State Management**: React Context API
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Testing**: Jest, React Testing Library
- **E2E Testing**: Playwright
- **Styling**: Emotion, Tailwind CSS
- **Form Handling**: React Hook Form
- **API Client**: Axios

### Backend
- **Framework**: FastAPI (Python)
- **Database**: Firestore
- **Authentication**: Firebase Auth
- **API**: RESTful API design

### Infrastructure
- **Hosting**: Firebase Hosting
- **Serverless**: Firebase Functions
- **CI/CD**: GitHub Actions
- **Monitoring**: Firebase Performance Monitoring

## 🛠️ Technology Stack

### Frontend
| Category           | Technology                          |
|-------------------|-------------------------------------|
| Framework         | React 18                            |
| Language          | TypeScript                          |
| UI Library        | Material-UI v5                      |
| State Management  | React Context API                   |
| Routing           | React Router v6                     |
| Build Tool        | Vite                                |
| Testing           | Jest, React Testing Library         |
| E2E Testing       | Playwright                          |
| Styling           | Emotion, Tailwind CSS               |
| Form Handling     | React Hook Form                     |
| API Client        | Axios                              |

### Backend
| Category           | Technology                          |
|-------------------|-------------------------------------|
| Framework         | FastAPI (Python)                   |
| Database          | Firestore                          |
| Authentication    | Firebase Auth                      |
| Caching           | Firestore                          |
| Background Tasks  | Celery                             |
| Testing           | Pytest                             |

### DevOps
| Category           | Technology                          |
|-------------------|-------------------------------------|
| CI/CD             | GitHub Actions                      |
| Hosting           | Firebase Hosting & Functions       |
| Monitoring        | Firebase Monitoring                |
| Logging           | Google Cloud Logging               |
| Error Tracking    | Sentry                             |

## 📋 Prerequisites

### Development Environment
- [Node.js](https://nodejs.org/) (v18 or later)
- [Yarn](https://yarnpkg.com/) (v1.22.19 or later)
- [Python](https://www.python.org/) (v3.11 or later)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Docker](https://www.docker.com/) (for local development)

### Recommended Tools
- [VS Code](https://code.visualstudio.com/)
  - Extensions:
    - ESLint
    - Prettier
    - TypeScript Hero
    - Material Icon Theme

### Environment Variables
Create a `.env` file in the project root with the following variables:

```env
# Frontend
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Backend
DATABASE_URL=sqlite:///./careercopilot.db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/careercopilot/careercopilot.git
    cd careercopilot
    ```

2.  **Install dependencies:**

    ```bash
    yarn install
    ```

3.  **Set up environment variables:**

    Navigate to the `functions` directory and create a `.env` file. You will need to add the following environment variables:

    ```
    GCLOUD_PROJECT=<your-gcloud-project>
    FIREBASE_CONFIG=<your-firebase-config>
    ```

    _Note: The `FIREBASE_CONFIG` variable is auto-populated in a production environment._

4.  **Install Python dependencies:**

    ```bash
    pip install -r backend/requirements.txt
    ```

## Usage

To run the application in a development environment, you will need to run the frontend and the Firebase emulators in separate terminals.

**Terminal 1: Start the frontend**

```bash
yarn dev
```

**Terminal 2: Start the Firebase emulators**

```bash
cd functions
yarn serve
```

## Testing

This project includes unit tests, integration tests, and end-to-end tests.

- **Run all tests:**

  ```bash
  yarn test:all
  ```

- **Run frontend tests:**

  ```bash
  yarn test:frontend
  ```

- **Run backend tests:**

  ```bash
  yarn test:backend
  ```

- **Run Firebase Functions tests:**

  ```bash
  yarn test:functions
  ```

- **Run end-to-end tests:**

  ```bash
  yarn test:e2e
  ```

## Deployment

The application is deployed to Firebase.

1.  **Build the frontend and functions:**

    ```bash
    yarn build
    ```

2.  **Deploy to Firebase:**

    ```bash
    firebase deploy
    ```

## Available Scripts

| Script               | Description                                       |
| -------------------- | ------------------------------------------------- |
| `yarn dev`           | Starts the frontend development server.           |
| `yarn dev:functions` | Starts the Firebase emulators.                    |
| `yarn build`         | Builds the frontend and functions for production. |
| `yarn lint`          | Lints the frontend and functions code.            |
| `yarn test`          | Runs the frontend tests.                          |
| `yarn test:all`      | Runs all tests.                                   |
| `yarn start`         | Starts the frontend in preview mode.              |

## Contributing

Contributions are welcome! Please see our [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the [UNLICENSED](LICENSE) license.This is a test change to trigger the workflows.
