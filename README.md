# CareerCopilot

**CareerCopilot** is an AI-powered career management platform designed to help you streamline your job search, manage your resumes and applications, and automate repetitive tasks. This monorepo contains the code for the CareerCopilot frontend, backend, and serverless functions.

## Features

- **AI-Powered Resume Builder:** Create and tailor your resume for specific job applications.
- **Job Application Tracker:** Keep track of all your job applications in one place.
- **Automated Application Filler:** (Coming Soon) Automatically fill out job applications.
- **Interview Preparation Assistant:** (Coming Soon) Get help preparing for interviews with AI-powered mock interviews and feedback.

## Architecture

CareerCopilot is a monorepo that consists of three main components:

- **Frontend:** A React application built with Vite and Material-UI.
- **Backend:** A Python API built with FastAPI.
- **Functions:** Serverless functions for Firebase that handle backend logic.

The application is hosted on Firebase, with the frontend on Firebase Hosting, the backend logic in Firebase Functions, and the data stored in Firestore.

## Technologies

| Category            | Technology                           |
| ------------------- | ------------------------------------ |
| **Frontend**        | React, Vite, Material-UI, TypeScript |
| **Backend**         | Python, FastAPI                      |
| **Serverless**      | Firebase Functions                   |
| **Database**        | Firestore                            |
| **Hosting**         | Firebase Hosting                     |
| **Testing**         | Jest, Playwright                     |
| **Package Manager** | Yarn                                 |

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [Yarn](https://yarnpkg.com/) (v4 or later)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Python](https://www.python.org/) (v3.12 or later)

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
