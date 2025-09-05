#!/usr/bin/env python3
"""
Production Secrets Setup Script for CareerCopilot.

This script sets up all required secrets in Google Cloud Secret Manager
for production deployment with proper validation and error handling.
"""

import json
import os
import sys
from getpass import getpass
from pathlib import Path

# Add the backend directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from google.cloud import secretmanager
from google.oauth2 import service_account


class ProductionSecretsManager:
    """Manages the setup of production secrets in Google Cloud Secret Manager."""

    def __init__(self):
        self.project_id = "careercopilot-468811"
        self.client = self._get_secret_manager_client()

        # Define all required secrets with their descriptions
        self.secrets_config = [
            {
                "id": "openai-api-key",
                "description": "OpenAI API Key",
                "required": True,
                "example": "sk-proj-...",
                "validation": lambda x: x.startswith("sk-") and len(x) > 20,
            },
            {
                "id": "anthropic-api-key",
                "description": "Anthropic Claude API Key",
                "required": True,
                "example": "sk-ant-api03-...",
                "validation": lambda x: x.startswith("sk-ant-") and len(x) > 20,
            },
            {
                "id": "gemini-api-key",
                "description": "Google Gemini API Key",
                "required": True,
                "example": "AIzaSy...",
                "validation": lambda x: x.startswith("AIzaSy") and len(x) > 20,
            },
            {
                "id": "jwt-secret-key",
                "description": "JWT Secret Key for authentication",
                "required": True,
                "example": "your-super-secure-jwt-key-256-bits",
                "validation": lambda x: len(x) >= 32,
            },
            {
                "id": "database-url",
                "description": "Database connection URL",
                "required": True,
                "example": "postgresql://user:pass@host:5432/db",
                "validation": lambda x: x.startswith(("postgresql://", "sqlite:///")),
            },
            {
                "id": "redis-password",
                "description": "Redis password",
                "required": True,
                "example": "your-secure-redis-password",
                "validation": lambda x: len(x) >= 16,
            },
            {
                "id": "sendgrid-api-key",
                "description": "SendGrid API key for email service",
                "required": False,
                "example": "SG.xxxx...",
                "validation": lambda x: x.startswith("SG.") and len(x) > 20,
            },
            {
                "id": "perplexity-api-key",
                "description": "Perplexity API Key (optional)",
                "required": False,
                "example": "pplx-...",
                "validation": lambda x: x.startswith("pplx-") and len(x) > 10,
            },
            {
                "id": "firebase-credentials-json",
                "description": "Firebase Admin SDK credentials JSON",
                "required": True,
                "example": '{"type": "service_account", ...}',
                "validation": self._validate_firebase_json,
                "file_input": True,
            },
            {
                "id": "firebase-project-id",
                "description": "Firebase project ID",
                "required": True,
                "example": "careercopilot-468811",
                "validation": lambda x: len(x) > 5 and "-" in x,
            },
            {
                "id": "firebase-storage-bucket",
                "description": "Firebase storage bucket",
                "required": True,
                "example": "careercopilot-468811.appspot.com",
                "validation": lambda x: x.endswith(".appspot.com"),
            },
        ]

    def _get_secret_manager_client(self):
        """Initialize Secret Manager client with proper authentication."""
        try:
            # Try to use service account credentials from environment
            credentials_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
            if credentials_json:
                credentials_dict = json.loads(credentials_json)
                credentials = service_account.Credentials.from_service_account_info(
                    credentials_dict
                )
                return secretmanager.SecretManagerServiceClient(credentials=credentials)

            # Check if credentials file exists
            cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
            if cred_path and os.path.exists(cred_path):
                return secretmanager.SecretManagerServiceClient()

            # Try default application credentials
            return secretmanager.SecretManagerServiceClient()

        except Exception as e:
            print(f"❌ Error initializing Secret Manager client: {e}")
            print("\nTroubleshooting:")
            print("1. Set GOOGLE_APPLICATION_CREDENTIALS environment variable")
            print("2. Run 'gcloud auth application-default login'")
            print("3. Ensure you have Secret Manager access permissions")
            sys.exit(1)

    def _validate_firebase_json(self, value):
        """Validate Firebase credentials JSON."""
        try:
            data = json.loads(value)
            required_fields = ["type", "project_id", "private_key", "client_email"]
            return all(field in data for field in required_fields)
        except json.JSONDecodeError:
            return False

    def create_secret_if_not_exists(self, secret_id):
        """Create a secret if it doesn't already exist."""
        try:
            secret_path = f"projects/{self.project_id}/secrets/{secret_id}"
            self.client.get_secret(request={"name": secret_path})
            print(f"  ✓ Secret '{secret_id}' already exists")
            return secret_path
        except Exception:
            try:
                secret = self.client.create_secret(
                    request={
                        "parent": f"projects/{self.project_id}",
                        "secret_id": secret_id,
                        "secret": {"replication": {"automatic": {}}},
                    }
                )
                print(f"  ✓ Created secret '{secret_id}'")
                return secret.name
            except Exception as e:
                print(f"  ✗ Failed to create secret '{secret_id}': {e}")
                return None

    def add_secret_version(self, secret_path, secret_value):
        """Add a new version to an existing secret."""
        try:
            response = self.client.add_secret_version(
                request={
                    "parent": secret_path,
                    "payload": {"data": secret_value.encode("UTF-8")}
                }
            )
            return response.name
        except Exception as e:
            print(f"  ✗ Failed to add secret version: {e}")
            return None

    def get_secret_value_interactively(self, secret_config):
        """Get secret value from user with validation."""
        secret_id = secret_config["id"]
        description = secret_config["description"]
        required = secret_config["required"]
        example = secret_config["example"]
        validation = secret_config["validation"]
        file_input = secret_config.get("file_input", False)

        print(f"\n📝 {description}")
        print(f"   Required: {'Yes' if required else 'No'}")
        print(f"   Example: {example}")

        if file_input:
            # Handle file input (like Firebase JSON)
            file_path = input(f"Enter path to {description} file (or press Enter to skip): ")
            if not file_path.strip():
                if required:
                    print(f"❌ {description} is required")
                    return None
                return ""

            try:
                with open(file_path.strip(), 'r') as f:
                    secret_value = f.read().strip()
            except Exception as e:
                print(f"❌ Error reading file: {e}")
                return None
        else:
            # Handle regular text input
            if "password" in secret_id.lower() or "key" in secret_id.lower():
                secret_value = getpass(f"Enter {description}: ")
            else:
                secret_value = input(f"Enter {description}: ")

        if not secret_value.strip():
            if required:
                print(f"❌ {description} is required")
                return None
            return ""

        # Validate the secret value
        if validation and not validation(secret_value):
            print(f"❌ Invalid format for {description}")
            print(f"   Expected format similar to: {example}")
            return None

        return secret_value

    def setup_all_secrets(self):
        """Set up all production secrets interactively."""
        print("🔐 CareerCopilot Production Secrets Setup")
        print("==========================================")
        print(f"Project ID: {self.project_id}")
        print()

        success_count = 0
        total_required = sum(1 for s in self.secrets_config if s["required"])

        for secret_config in self.secrets_config:
            secret_id = secret_config["id"]
            required = secret_config["required"]

            # Create secret if it doesn't exist
            secret_path = self.create_secret_if_not_exists(secret_id)
            if not secret_path:
                if required:
                    print(f"❌ Failed to create required secret: {secret_id}")
                    return False
                continue

            # Get secret value from user
            secret_value = self.get_secret_value_interactively(secret_config)
            if secret_value is None:
                if required:
                    print(f"❌ Failed to get value for required secret: {secret_id}")
                    return False
                continue

            if not secret_value:
                print(f"  ⏭️  Skipping optional secret: {secret_id}")
                continue

            # Add secret version
            version_name = self.add_secret_version(secret_path, secret_value)
            if version_name:
                print(f"  ✅ Added value for '{secret_id}'")
                if required:
                    success_count += 1
            else:
                if required:
                    print(f"❌ Failed to add value for required secret: {secret_id}")
                    return False

        print(f"\n🎉 Successfully configured {success_count}/{total_required} required secrets!")
        return success_count == total_required

    def validate_existing_secrets(self):
        """Validate that all required secrets exist and are accessible."""
        print("🔍 Validating existing secrets...")

        missing_secrets = []
        for secret_config in self.secrets_config:
            if not secret_config["required"]:
                continue

            secret_id = secret_config["id"]
            try:
                secret_path = f"projects/{self.project_id}/secrets/{secret_id}/versions/latest"
                response = self.client.access_secret_version(request={"name": secret_path})
                if response.payload.data:
                    print(f"  ✅ {secret_id} - OK")
                else:
                    print(f"  ❌ {secret_id} - Empty")
                    missing_secrets.append(secret_id)
            except Exception as e:
                print(f"  ❌ {secret_id} - Missing or inaccessible")
                missing_secrets.append(secret_id)

        if missing_secrets:
            print(f"\n❌ Missing required secrets: {', '.join(missing_secrets)}")
            return False

        print("\n✅ All required secrets are configured!")
        return True


def main():
    """Main function."""
    import argparse

    parser = argparse.ArgumentParser(description="Set up production secrets for CareerCopilot")
    parser.add_argument("--validate", action="store_true",
                       help="Only validate existing secrets, don't create new ones")
    parser.add_argument("--project-id", default="careercopilot-468811",
                       help="GCP Project ID (default: careercopilot-468811)")

    args = parser.parse_args()

    manager = ProductionSecretsManager()
    manager.project_id = args.project_id

    if args.validate:
        success = manager.validate_existing_secrets()
    else:
        success = manager.setup_all_secrets()
        if success:
            print("\n✅ Next steps:")
            print("1. Deploy your application with environment variable:")
            print(f"   export GCP_PROJECT_ID={args.project_id}")
            print("2. Set USE_SECRET_MANAGER=true in production")
            print("3. Test your deployment")

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
