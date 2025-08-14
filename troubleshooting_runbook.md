# Troubleshooting Runbook

This runbook is a quick reference guide for diagnosing and resolving common issues with the Career Copilot application.

---

### Common Error: User sees a CORS error in the browser console

*   **Symptom:** The frontend fails to fetch data from the backend, and the browser's developer console shows an error related to "Cross-Origin Resource Sharing."
*   **Likely Cause:** The Cloud Run service is not configured to allow requests from the Firebase Hosting frontend URL. This is common when the backend is redeployed or its URL changes.
*   **Solution:**
    1.  Go to the **Cloud Run** service for the environment in question (staging or production) in the Google Cloud Console.
    2.  Edit the service and go to the **"Security"** tab.
    3.  Ensure that **"Allow all traffic"** is selected for ingress control.
    4.  The FastAPI backend code has a `CORSMiddleware` configuration in `main.py`. Verify that the `origins` list includes the correct frontend URL (e.g., `https://your-staging-site.web.app`). Redeploy the backend if you change this code.

---

### Common Error: Backend returns HTTP 500 errors

*   **Symptom:** Users report generic "An error occurred" messages, or API calls fail with a 500 Internal Server Error status code.
*   **First Places to Check:**
    1.  **Cloud Logging:**
        *   Navigate to **Cloud Logging > Logs Explorer** in the Google Cloud Console.
        *   Query for logs from your Cloud Run service (`careercopilot-backend` or `careercopilot-backend-staging`).
        *   Filter for **"Severity" = "ERROR"**. Look for Python stack traces or explicit error messages.
    2.  **Error Reporting:**
        *   Navigate to the **Error Reporting** service. It automatically groups similar errors. This is the fastest way to see the most frequent exceptions occurring in the backend. Click on an error group to see its stack trace and history.

---

### Common Error: User can't log in

*   **Symptom:** A user tries to log in or sign up, but is redirected back to the login page or sees an "Authentication failed" error.
*   **Troubleshooting Steps:**
    1.  **Check Firebase Authentication:**
        *   Go to the **Firebase Console > Authentication** section.
        *   Check the "Users" tab to see if the user's account exists and is enabled.
        *   Check the "Sign-in method" tab to ensure the provider (e.g., Email/Password, Google) is enabled.
    2.  **Inspect API Logs:**
        *   Use **Cloud Logging** to inspect the logs for the `/auth/verify-token` endpoint on the backend.
        *   A common issue is the frontend sending an expired or invalid Firebase ID token. The logs should provide details on why the token verification failed.
    3.  **Check Browser Console:** Look for any specific error messages in the browser's developer console. It might point to an issue with the Firebase SDK on the client-side.

---

### Escalation Path

If you have gone through the steps above and cannot resolve the issue within 30 minutes, follow this path:

1.  **Notify the Lead Developer:** Create a high-priority ticket in the project's issue tracker (e.g., Jira, GitHub Issues) and assign it to the tech lead.
2.  **Post in the Team Chat:** Post a summary of the issue, what you've tried, and a link to the ticket in the team's engineering Slack/Discord channel.
3.  **Initiate a Rollback (if critical):** If the issue is critical (e.g., causing a full outage in production), the tech lead may decide to roll back to a previous stable deployment via the Google Cloud Run console's "Revisions" tab.
