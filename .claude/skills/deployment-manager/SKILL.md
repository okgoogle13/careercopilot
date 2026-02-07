---
name: deployment-manager
description: "Deploys the project to staging or production using this project's scripts. Use when asked to 'deploy' or 'push to staging'."
version: 1.0.0
tags: []
---

## Purpose

Deploys the project to staging or production using project-specific scripts, ensuring pre-deployment checks are passed.

## When to Use

- When asked to "deploy" or "push to staging/production".
- When verifying the readiness of a frontend or backend build for a specific environment.

## Process

1. **Target Selection**: Ask for the environment (e.g., `staging`, `production`, `frontend`).
2. **Pre-check**: Run `./scripts/test-deployment.sh` and report output.
3. **Confirmation**: Request user approval before final deployment.
4. **Execution**: Run `./scripts/deploy.sh {{TARGET}}`.
5. **Reporting**: Provide final output and URLs.
