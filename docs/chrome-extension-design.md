# CareerCopilot Chrome Extension - Solution Design

## 1. Introduction & Vision

This document outlines the design for a Chrome browser extension to complement the CareerCopilot platform.

**Vision:** To empower users to seamlessly capture and organize their job search efforts directly from their browser. While browsing job boards, company websites, or professional networks like LinkedIn, users can instantly save Jobs, Contacts, and Companies to their CareerCopilot account without context switching, significantly streamlining the job tracking process.

This extension will be a key value-add, rivaling popular tools like the Teal Chrome Extension and integrating deeply with the existing CareerCopilot backend and frontend.

## 2. Core Features & User Experience

### 2.1. Feature Summary

- **One-Click Job Saving:** Save job postings from popular job boards (e.g., LinkedIn, Indeed, company career pages).
- **Intelligent Data Parsing:** Automatically extract key details from the page: Job Title, Company Name, Location, Salary, Job Description, and Application URL.
- **Contact & Company Bookmarking:** Save key contacts (recruiters, hiring managers) and target companies for networking and research.
- **In-Context Management:** A sidebar or modal UI allows users to edit parsed data, add notes, set application status, and assign contacts to jobs before saving.
- **Seamless Authentication:** Automatically uses the active login session from the CareerCopilot web app.

### 2.2. User Experience (UX) Flow

1.  **Installation & Onboarding:** The user installs the extension from the Chrome Web Store. On first use, the extension popup will direct them to log in to the CareerCopilot web app if they are not already authenticated.
2.  **Browsing a Job Site:** The user navigates to a job posting on a site like LinkedIn.
3.  **Initiating a Save:** A CareerCopilot logo/button is injected onto the page. The user clicks this button.
4.  **Data Capture & Review:**
    *   A sidebar or modal slides into view.
    *   A loading spinner is shown while the content script parses the page for data.
    *   The form in the sidebar is pre-filled with the extracted Job Title, Company, etc.
    *   The user can review and edit any field.
    *   The user can add personal notes, set the initial application status (e.g., "Saved", "Applied"), and link an existing or new contact.
5.  **Saving:** The user clicks "Save Job".
6.  **Confirmation:** The data is sent to the CareerCopilot backend via an API call. The UI shows a success message and an option to "View in CareerCopilot", which links directly to the newly created job record in the main web application.

## 3. Technical Architecture

The extension will be built with a modern tech stack that mirrors the main frontend application for consistency and code re-use where possible. A new directory, `chrome-extension/`, will be created in the root of the repository.

```
careercopilot/
├── 📱 frontend/
├── 🐍 backend/
├── ⚡ functions/
├── 🌐 chrome-extension/   # New directory for the extension
│   ├── src/
│   │   ├── background/ # Background service worker
│   │   ├── content/    # Content scripts for page interaction
│   │   ├── popup/      # UI for the browser action popup
│   │   └── sidebar/    # The main UI for saving jobs
│   ├── public/
│   └── vite.config.ts
└── 📚 docs/
```

### 3.1. Components

-   **Background Script (`background/`):** A service worker that runs in the background.
    -   **Responsibilities:**
        -   Manages authentication state and token refreshing with the backend.
        -   Handles all communication with the CareerCopilot API.
        -   Listens for messages from content scripts and the popup.
        -   Manages context menus.

-   **Content Scripts (`content/`):** JavaScript/TypeScript files injected into web pages.
    -   **Responsibilities:**
        -   Inject the "Save to CareerCopilot" button onto supported job sites.
        -   Parse job, contact, and company data from the page's DOM when a save is initiated.
        -   Inject the sidebar UI into the page.
        -   Communicate with the background script to send parsed data and receive instructions.

-   **Popup UI (`popup/`):** A small React application shown when the user clicks the extension icon in the Chrome toolbar.
    -   **Responsibilities:**
        -   Show authentication status.
        -   Provide a shortcut to the CareerCopilot dashboard.
        -   Offer quick stats (e.g., "5 jobs saved this week").
        -   Display a button to manually trigger the save sidebar if the in-page button fails to load.

-   **Sidebar/Modal UI (`sidebar/`):** The primary user interface, also a React application.
    -   **Responsibilities:**
        -   Display the form for saving/editing a Job, Contact, or Company.
        -   Handle user input and validation.
        -   Communicate with the content script (and by extension, the background script) to perform the save action.

### 3.2. Proposed Tech Stack

-   **Language:** TypeScript
-   **UI Framework:** React
-   **Build Tool:** Vite (configured for building a Chrome extension)
-   **Styling:** Tailwind CSS (to potentially share styles/themes with the main app)

## 4. Backend API & Data Model Additions

The extension requires new, dedicated API endpoints for creating records manually. These should be added to the FastAPI backend.

### 4.1. New API Endpoints

These endpoints should be added to new or existing router files in `backend/app/api/v1/`.

1.  **Create Job Opportunity:** A new endpoint is required in `opportunities.py`.
    -   **Endpoint:** `POST /api/v1/opportunities`
    -   **Request Body:** A Pydantic model matching the `JobOpportunity` structure, but with all fields optional except what's essential (e.g., `title`, `company`, `sourceUrl`).
    -   **Action:** Creates a new `JobOpportunity` document in the user's Firestore collection with `source: 'manual'`.
    -   **Response:** The newly created opportunity object, including its ID.

2.  **Create Contact:** A new router file `contacts.py` should be created.
    -   **Endpoint:** `POST /api/v1/contacts`
    -   **Request Body:** A Pydantic model for a `Contact`.
    -   **Action:** Creates a new `Contact` document.
    -   **Response:** The newly created contact object.

3.  **Create Company:** A new router file `companies.py` should be created.
    -   **Endpoint:** `POST /api/v1/companies`
    -   **Request Body:** A Pydantic model for a `Company`.
    -   **Action:** Creates a new `Company` document.
    -   **Response:** The newly created company object.

### 4.2. New Data Models

The following data models need to be defined for Firestore and as Pydantic schemas for the API.

**Contact Model:**
```javascript
{
  "id": "string",
  "userId": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "linkedinUrl": "string",
  "companyId": "string", // Link to a company
  "notes": "string",
  "created": "timestamp"
}
```

**Company Model:**
```javascript
{
  "id": "string",
  "userId": "string",
  "name": "string",
  "website": "string",
  "linkedinUrl": "string",
  "location": "string",
  "notes": "string",
  "created": "timestamp"
}
```
The existing `JobOpportunity` model is sufficient, but we will now use it with `source: 'manual'`.

## 5. Authentication

The extension will not handle its own login flow. It will rely on the user being logged into the main CareerCopilot web application.

1.  **Token Acquisition:** The background script will use `chrome.cookies.get()` to access the authentication cookie (containing the JWT) set by the web app.
2.  **API Requests:** All API requests made from the background script to the CareerCopilot backend will include the JWT in the `Authorization: Bearer <token>` header.
3.  **Session Expiry:** If an API call returns a 401 Unauthorized status, the extension will know the session has expired. The popup and sidebar UI will update to show a "Please log in" message, directing the user to the web app.

## 6. Development & Deployment Plan

1.  **Directory Setup:** Create the `chrome-extension/` directory and scaffold a new React/TypeScript project using Vite.
2.  **Backend Development:** Implement the new API endpoints and data models in the FastAPI backend.
3.  **Extension UI:** Develop the React components for the popup and sidebar.
4.  **Content & Background Scripts:** Write the logic for page interaction, data parsing, and API communication.
5.  **Testing:** Test the extension on target websites (LinkedIn, Indeed, etc.).
6.  **Deployment:** The extension will be packaged and submitted to the Chrome Web Store for review and publishing. The build process will be integrated into the root `package.json` scripts.
