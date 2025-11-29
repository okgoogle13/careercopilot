# 🔐 SECRETS MANAGEMENT SYSTEM

## Overview
Secrets are managed through a unified system covering GitHub Secrets, GCP Secret Manager, and AWS SES credentials. The central script handles all setup and validation.

## Unified Scripts
* **Unified Setup:** `./scripts/setup-secrets.sh` (Interactive, handles all platforms).
* **Validation:** `./scripts/validate-secrets.sh` (Ensures all production secrets are valid).
* **Key Platforms:** `github`, `gcp`, `aws-ses`.

## Critical Dependencies
* **AWS SES:** Uses Gmail sender (62k emails/month limit). Setup requires specific credentials configured via `./scripts/setup-aws-ses-secrets.sh` (now part of unified script).

## Related Documentation
* `docs/AWS_SES_SETUP.md` (Detailed email service guide).
* `docs/SECRETS_QUICK_REFERENCE.md` (Command cheat sheet).
