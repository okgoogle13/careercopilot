# 🚀 DEPLOYMENT WORKFLOW & ARTIFACTS

## Overview

Deployment is fully automated via the primary shell script, ensuring consistency across Staging and Production in the `us-central1` region.

## Key Deployment Commands

- **Deploy Staging:** `./scripts/deploy.sh staging`
- **Deploy Production:** `./scripts/deploy.sh production` (Requires safety prompt confirmation).
- **Test Deployment:** `./scripts/test-deployment.sh` (Runs validation checks without deploying).
- **Build All:** `yarn build` (Builds both frontend and functions).

## Artifacts & Locations

- **Staging URL:** `https://careercopilot-staging.web.app`
- **Production URL:** `https://careercopilot-468811.web.app`
- **Image Registry:** `us-central1-docker.pkg.dev/PROJECT_ID/careercopilot`
