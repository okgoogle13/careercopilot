#!/usr/bin/env python3
"""
Interactive script to set up secrets in Google Cloud Secret Manager.
"""
import json
import sys
from getpass import getpass

from google.api_core.exceptions import AlreadyExists
from google.cloud import secretmanager


def create_secret(project_id, secret_id, secret_value):
    """Create a new secret in Google Cloud Secret Manager."""
    client = secretmanager.SecretManagerServiceClient()
    parent = f"projects/{project_id}"

    try:
        # Create the secret
        client.create_secret(
            request={
                "parent": parent,
                "secret_id": secret_id,
                "secret": {"replication": {"automatic": {}}},
            }
        )
        print(f"✅ Created secret: {secret_id}")
    except AlreadyExists:
        print(f"ℹ️  Secret {secret_id} already exists, adding new version...")
    except Exception as e:
        print(f"❌ Failed to create secret {secret_id}: {e}")
        return False

    try:
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
        print(f"✅ Added version: {response.name.split('/')[-1]}")
        return True
    except Exception as e:
        print(f"❌ Failed to add version to secret {secret_id}: {e}")
        return False


def get_secret_value(prompt, is_sensitive=False):
    """Get secret value from user input."""
    if is_sensitive:
        return getpass(prompt)
    return input(prompt)


def main():
    print("\n🔐 CareerCopilot Secret Manager Setup 🔐")
    print("=" * 40)

    # Get project ID
    project_id = input("\nEnter your Google Cloud project ID: ").strip()
    if not project_id:
        print("❌ Project ID is required")
        sys.exit(1)

    print("\nℹ️  Required secrets will be marked with (*)")
    print("   Press Enter to skip optional secrets\n")

    # Define required secrets
    required_secrets = {
        "SECRET_KEY": "A secure secret key for JWT tokens",
        "GEMINI_API_KEY": "Google Gemini API key",
        "DATABASE_URL": "Database connection URL",
    }

    # Define optional secrets
    optional_secrets = {
        "REDIS_URL": "Redis connection URL (default: redis://localhost:6379/0)",
        "OPENAI_API_KEY": "OpenAI API key",
        "ANTHROPIC_API_KEY": "Anthropic API key",
        "SENDGRID_API_KEY": "SendGrid API key for email",
        "GOOGLE_CLIENT_SECRETS_JSON": "Google OAuth client secrets (JSON)",
    }

    # Process required secrets
    print("\n=== Required Secrets ===")
    for secret_id, description in required_secrets.items():
        value = get_secret_value(f"{description} (*): ", is_sensitive=True)
        if not value:
            print(f"❌ {secret_id} is required. Please provide a value.")
            sys.exit(1)
        create_secret(project_id, secret_id, value)

    # Process optional secrets
    print("\n=== Optional Secrets ===")
    for secret_id, description in optional_secrets.items():
        value = get_secret_value(f"{description}: ", is_sensitive=True)
        if value:
            create_secret(project_id, secret_id, value)

    print("\n✅ Secret setup complete!")
    print("\nNext steps:")
    print("1. Update your deployment configuration to use the secrets")
    print("2. Ensure your service account has the 'Secret Manager Secret Accessor' role")
    print("3. Test the configuration using: python test_config.py\n")


if __name__ == "__main__":
    main()
