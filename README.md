# CareerPilot Application

... (existing README content) ...

## Dependency Management

This project uses a combination of tools to manage dependencies effectively and keep them up-to-date.

### Python Dependencies

Python dependencies are managed using `pip-tools` with the following files:
- `requirements.in` - Main dependencies
- `requirements-dev.in` - Development dependencies
- `requirements.txt` - Pinned production dependencies (generated)
- `requirements-dev.txt` - Pinned development dependencies (generated)

#### Updating Python Dependencies

1. Edit the appropriate `.in` file to update package versions
2. Regenerate the `.txt` files:
   ```bash
   cd backend
   pip-compile requirements.in
   pip-compile requirements-dev.in
   ```
3. Install the updated dependencies:
   ```bash
   pip install -r requirements.txt -r requirements-dev.txt
   ```

### Node.js Dependencies

Node.js dependencies are managed using `npm` with `npm-check-updates` for updates.

#### Updating Node.js Dependencies

1. Check for outdated packages:
   ```bash
   cd frontend
   npx npm-check-updates
   ```

2. Update packages:
   ```bash
   npx npm-check-updates -u
   npm install
   ```

### Automated Dependency Updates with Renovate

This project uses [Renovate](https://docs.renovatebot.com/) to automatically:
- Create pull requests for dependency updates
- Group related updates
- Run tests before merging
- Follow semantic versioning rules

#### Renovate Configuration

- Updates minor and patch versions automatically
- Requires manual approval for major version updates
- Runs updates weekly (Monday mornings AEST)
- Groups development dependencies separately

### Useful Scripts

- `scripts/check-updates.sh` - Check for outdated dependencies
- `scripts/update-dependencies.sh` - Update all dependencies (interactive)

### Security Scanning

Dependencies are automatically scanned for vulnerabilities using:
- `npm audit` for Node.js packages
- `safety check` for Python packages

---

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
