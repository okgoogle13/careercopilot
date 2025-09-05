#!/usr/bin/env python3
"""
Script to set up secrets in Google Cloud Secret Manager.

This script helps you create and update secrets in Google Cloud Secret Manager.
"""
import json
import sys

from google.api_core.exceptions import AlreadyExists
from google.cloud import secretmanager


def create_secret(project_id: str, secret_id: str, secret_value: str):
    """Create a new secret in Google Cloud Secret Manager."""
    client = secretmanager.SecretManagerServiceClient()

    # Create the parent project path
    parent = f"projects/{project_id}"

    # Create the secret
    try:
        client.create_secret(
            request={
                "parent": parent,
                "secret_id": secret_id,
                "secret": {"replication": {"automatic": {}}},
            }
        )
        print(f"Created secret: {secret_id}")
    except AlreadyExists:
        print(f"Secret {secret_id} already exists, updating...")
    except Exception as e:
        print(f"Failed to create secret {secret_id}: {e}")
        return

    # Add the secret version
    secret_name = f"projects/{project_id}/secrets/{secret_id}"

    # Convert non-string values to JSON strings
    if not isinstance(secret_value, str):
        secret_value = json.dumps(secret_value)

    # Add the secret version
    response = client.add_secret_version(
        request={
            "parent": secret_name,
            "payload": {"data": secret_value.encode("UTF-8")},
        }
    )

    print(f"Added version: {response.name}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python setup_secrets.py <project_id>")
        sys.exit(1)

    project_id = sys.argv[1]

    # Define the secrets to create
    secrets = {
        # Database
        "DATABASE_URL": "sqlite:///data/careercopilot-dev.db",
        "REDIS_URL": "redis://localhost:6379/0",
        # Authentication
        "SECRET_KEY": "generate-a-secure-secret-key-here",
        "ALGORITHM": "HS256",
        # Google Cloud
        "GOOGLE_CLOUD_PROJECT": project_id,
        "GCP_PROJECT_ID": project_id,
        # AI Services
        "GEMINI_API_KEY": "your-gemini-api-key",
        "OPENAI_API_KEY": "your-openai-api-key",
        "ANTHROPIC_API_KEY": "your-anthropic-api-key",
        # Email
        "SENDGRID_API_KEY": "your-sendgrid-api-key",
    }

    # Create each secret
    for secret_id, secret_value in secrets.items():
        print(f"\nProcessing secret: {secret_id}")
        create_secret(project_id, secret_id, secret_value)


if __name__ == "__main__":
    main()
