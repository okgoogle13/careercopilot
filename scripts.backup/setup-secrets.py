#!/usr/bin/env python3
"""
Setup script to create secrets in Google Secret Manager for production deployment.
Run this script to securely store all application credentials.
"""

import json
import os
import sys
from getpass import getpass

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../backend'))

from google.cloud import secretmanager
from google.oauth2 import service_account

PROJECT_ID = "careercopilot-468811"

def get_secret_manager_client():
    """Initialize Secret Manager client with proper authentication."""
    try:
        # Use service account credentials from environment
        credentials_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
        if credentials_json:
            credentials_dict = json.loads(credentials_json)
            credentials = service_account.Credentials.from_service_account_info(
                credentials_dict
            )
            return secretmanager.SecretManagerServiceClient(credentials=credentials)
        else:
            # Fall back to default application credentials
            return secretmanager.SecretManagerServiceClient()
    except Exception as e:
        print(f"Error initializing Secret Manager client: {e}")
        return None

def create_secret_if_not_exists(client, secret_id):
    """Create a secret if it doesn't already exist."""
    try:
        secret_path = f"projects/{PROJECT_ID}/secrets/{secret_id}"
        client.get_secret(request={"name": secret_path})
        print(f"✓ Secret '{secret_id}' already exists")
        return secret_path
    except Exception:
        # Secret doesn't exist, create it
        try:
            secret = client.create_secret(
                request={
                    "parent": f"projects/{PROJECT_ID}",
                    "secret_id": secret_id,
                    "secret": {"replication": {"automatic": {}}},
                }
            )
            print(f"✓ Created secret '{secret_id}'")
            return secret.name
        except Exception as e:
            print(f"✗ Failed to create secret '{secret_id}': {e}")
            return None

def add_secret_version(client, secret_path, secret_value):
    """Add a new version to an existing secret."""
    try:
        response = client.add_secret_version(
            request={
                "parent": secret_path,
                "payload": {"data": secret_value.encode("UTF-8")}
            }
        )
        return response.name
    except Exception as e:
        print(f"✗ Failed to add secret version: {e}")
        return None

def main():
    """Main setup function."""
    print("🔐 CareerCopilot Secret Manager Setup")
    print("=====================================")

    client = get_secret_manager_client()
    if not client:
        print("❌ Failed to initialize Secret Manager client")
        return False

    # Define secrets to create
    secrets_config = [
        {
            "id": "openai-api-key",
            "description": "OpenAI API Key",
            "required": True,
            "example": "sk-proj-..."
        },
        {
            "id": "anthropic-api-key",
            "description": "Anthropic API Key",
            "required": True,
            "example": "sk-ant-api03-..."
        },
        {
            "id": "gemini-api-key",
            "description": "Google Gemini API Key",
            "required": True,
            "example": "AIzaSy..."
        },
        {
            "id": "jwt-secret-key",
            "description": "JWT Secret Key for authentication",
            "required": True,
            "example": "your-super-secret-jwt-key"
        },
        {
            "id": "db-password",
            "description": "Database password",
            "required": True,
            "example": "your-secure-db-password"
        },
        {
            "id": "redis-password",
            "description": "Redis password",
            "required": True,
            "example": "your-redis-password"
        },
        {
            "id": "perplexity-api-key",
            "description": "Perplexity API Key (optional)",
            "required": False,
            "example": "pplx-..."
        }
    ]

    print(f"Setting up secrets for project: {PROJECT_ID}")
    print()

    # Create and populate secrets
    for secret_config in secrets_config:
        secret_id = secret_config["id"]
        description = secret_config["description"]
        required = secret_config["required"]
        example = secret_config["example"]

        print(f"📝 {description}")

        # Create secret if it doesn't exist
        secret_path = create_secret_if_not_exists(client, secret_id)
        if not secret_path:
            if required:
                print(f"❌ Failed to create required secret: {secret_id}")
                return False
            else:
                continue

        # Get secret value from user
        if required:
            secret_value = getpass(f"Enter {description} ({example}): ")
            if not secret_value.strip():
                print(f"❌ {description} is required")
                return False
        else:
            secret_value = getpass(f"Enter {description} (optional, {example}): ")
            if not secret_value.strip():
                print(f"⏭️  Skipping optional secret: {secret_id}")
                continue

        # Add secret version
        version_name = add_secret_version(client, secret_path, secret_value)
        if version_name:
            print(f"✅ Added value for '{secret_id}'")
        else:
            if required:
                print(f"❌ Failed to add value for required secret: {secret_id}")
                return False

        print()

    print("🎉 Secret Manager setup complete!")
    print()
    print("Next steps:")
    print("1. Update your deployment to use Secret Manager")
    print("2. Set environment variable: GCP_PROJECT_ID=careercopilot-468811")
    print("3. Ensure GOOGLE_APPLICATION_CREDENTIALS_JSON is set")
    print("4. Test your deployment")

    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
