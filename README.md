# CareerPilot Application

... (existing README content) ...

## Proactive Job Management Setup

The application includes a feature to proactively scan connected user Gmail accounts for new job opportunities. This is handled by a scheduled job that triggers a protected API endpoint.

### Setting up the Scheduled Job

To enable the automated, hourly email scan, you need to configure a **Cloud Scheduler** job in your Google Cloud project.

1.  **Navigate to Cloud Scheduler:** In the Google Cloud Console, go to the Cloud Scheduler section.
2.  **Create a New Job:**
    *   **Name:** `hourly-email-scan`
    *   **Description:** Triggers the global email scan for all connected users every hour.
    *   **Frequency:** `0 * * * *` (This is a cron expression for "at minute 0 of every hour").
    *   **Timezone:** Select your preferred timezone.
3.  **Configure the Execution:**
    *   **Target type:** `HTTP`
    *   **URL:** `https://<YOUR_APP_URL>/api/v1/integrations/trigger-global-scan` (Replace `<YOUR_APP_URL>` with your deployed application's URL).
    *   **HTTP method:** `POST`
    *   **Headers:**
        *   Add a new header.
        *   **Header name:** `X-Scheduler-Secret`
        *   **Header value:** The value you have set for the `SCHEDULER_SECRET` environment variable in your backend configuration.
    *   **Auth header:** For an internal service, you might also configure IAP or a service account for authentication. For this implementation, the secret key provides the primary layer of protec[...]  

Once created and enabled, this Cloud Scheduler job will call your API endpoint every hour, which will then process all connected users, ensuring that their job opportunities are always up-to-date.

## CI/CD Pipeline Test - Staging
# Test comment for CI trigger

## Dependency Management with Renovate

This repository uses [Renovate](https://github.com/renovatebot/renovate) to automate dependency updates. The configuration is located in the `renovate.json` file.

### Setup

To enable Renovate, you need to install the Renovate GitHub App on your repository.

1.  Go to the [Renovate GitHub App page](https://github.com/apps/renovate).
2.  Click "Install" and select the repository you want to enable Renovate for.
3.  Once installed, Renovate will automatically open a pull request to onboard itself. After that, it will start creating pull requests for dependency updates based on the configuration in `renovate.json`.
