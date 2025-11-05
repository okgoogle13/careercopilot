---
name: project-health-checker
description: "Runs this project's full suite of validation and health checks. Use when 'something is wrong' or for a general checkup."
---
# Project Health Check Workflow

1.  Inform the user you are starting the full project health check.
2.  Run Validator: `python3 scripts/production-secrets-validator.py`
3.  Run Config Test: `python3 scripts/test-configuration.py`
4.  Run Genkit Verification: `python3 verify_genkit.py`
5.  Report a summary of all outputs.
