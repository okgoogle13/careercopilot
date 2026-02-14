---
name: project-health-checker
description: 'Quick diagnostic tool (30s) running validation and health checks. Use
  for fast status checks. Related: audit-agent for comprehensive security and code
  quality audits.'
metadata:
  legacy_frontmatter:
    version: 1.0.0
    tags: []
---

## Purpose

A quick diagnostic tool (30s) that runs essential validation and health checks to ensure the project is in a consistent state.

## When to Use

- Before starting a new feature or refactor.
- After making configuration changes.
- To verify Genkit and production secret status quickly.

## Process

1. **Notification**: Inform the user you are starting the full project health check.
2. **Validator**: Run `python3 scripts/production-secrets-validator.py`.
3. **Config Test**: Run `python3 scripts/test-configuration.py`.
4. **Genkit Verification**: Run `python3 verify_genkit.py`.
5. **Reporting**: Provide a summary of all outputs.
