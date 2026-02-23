#!/usr/bin/env python3
"""
Firebase Configuration Setup Script.

This script sets up Firebase configuration secrets specifically,
ensuring all Firebase-related environment variables are properly configured.
"""

import json
import os
import sys
from pathlib import Path

# Add the backend directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from google.cloud import secretmanager
from google.oauth2 import service_account


class FirebaseConfigManager:
    """Manages Firebase-specific configuration setup."""

    def __init__(self, project_id="careercopilot-468811"):
        self.project_id = project_id
        self.client = self._get_secret_manager_client()

        # Firebase-specific secrets configuration
        self.firebase_secrets = [
            {
                "id": "firebase-project-id",
                "description": "Firebase Project ID",
                "default": project_id,
                "env_var": "FIREBASE_PROJECT_ID",
            },
            {
                "id": "firebase-storage-bucket",
                "description": "Firebase Storage Bucket",
                "default": f"{project_id}.appspot.com",
                "env_var": "FIREBASE_STORAGE_BUCKET",
            },
            {
                "id": "firebase-database-url",
                "description": "Firebase Realtime Database URL",
                "default": f"https://{project_id}-default-rtdb.firebaseio.com/",
                "env_var": "FIREBASE_DATABASE_URL",
            },
            {
                "id": "firebase-auth-domain",
                "description": "Firebase Auth Domain",
                "default": f"{project_id}.firebaseapp.com",
                "env_var": "VITE_FIREBASE_AUTH_DOMAIN",
            },
            {
                "id": "firebase-api-key",
                "description": "Firebase Web API Key",
                "default": "",
                "env_var": "VITE_FIREBASE_API_KEY",
                "required": True,
            },
            {
                "id": "firebase-messaging-sender-id",
                "description": "Firebase Messaging Sender ID",
                "default": "",
                "env_var": "VITE_FIREBASE_MESSAGING_SENDER_ID",
            },
            {
                "id": "firebase-app-id",
                "description": "Firebase App ID",
                "default": "",
                "env_var": "VITE_FIREBASE_APP_ID",
                "required": True,
            },
        ]

    def _get_secret_manager_client(self):
        """Initialize Secret Manager client."""
        try:
            credentials_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
            if credentials_json:
                credentials_dict = json.loads(credentials_json)
                credentials = service_account.Credentials.from_service_account_info(
                    credentials_dict
                )
                return secretmanager.SecretManagerServiceClient(credentials=credentials)

            cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
            if cred_path and os.path.exists(cred_path):
                return secretmanager.SecretManagerServiceClient()

            return secretmanager.SecretManagerServiceClient()

        except Exception as e:
            print(f"❌ Error initializing Secret Manager client: {e}")
            sys.exit(1)

    def create_or_update_secret(self, secret_id, secret_value):
        """Create or update a secret in Secret Manager."""
        try:
            # Try to create the secret first
            try:
                secret = self.client.create_secret(
                    request={
                        "parent": f"projects/{self.project_id}",
                        "secret_id": secret_id,
                        "secret": {"replication": {"automatic": {}}},
                    }
                )
                print(f"  ✓ Created secret '{secret_id}'")
                secret_path = secret.name
            except Exception:
                # Secret already exists
                secret_path = f"projects/{self.project_id}/secrets/{secret_id}"
                print(f"  ✓ Secret '{secret_id}' already exists")

            # Add the secret version
            response = self.client.add_secret_version(
                request={
                    "parent": secret_path,
                    "payload": {"data": secret_value.encode("UTF-8")}
                }
            )
            print(f"  ✅ Updated '{secret_id}' with new value")
            return True

        except Exception as e:
            print(f"  ❌ Failed to create/update secret '{secret_id}': {e}")
            return False

    def setup_firebase_secrets(self):
        """Set up all Firebase configuration secrets."""
        print("🔥 Firebase Configuration Setup")
        print("================================")
        print(f"Project ID: {self.project_id}")
        print()

        # First, check if Firebase project config file exists
        firebase_config_file = Path(f"firebase-prod-key.json")
        if firebase_config_file.exists():
            print("📋 Found Firebase service account key file")
            with open(firebase_config_file) as f:
                firebase_creds = json.load(f)

            # Set up Firebase credentials JSON secret
            self.create_or_update_secret(
                "firebase-credentials-json",
                json.dumps(firebase_creds)
            )
        else:
            print("⚠️  Firebase service account key file not found")
            print("   Make sure firebase-prod-key.json exists in the project root")

        print("\n📝 Setting up Firebase configuration secrets...")

        # Set up each Firebase configuration secret
        success_count = 0
        for config in self.firebase_secrets:
            secret_id = config["id"]
            description = config["description"]
            default_value = config["default"]
            required = config.get("required", False)

            if default_value:
                # Use default value
                if self.create_or_update_secret(secret_id, default_value):
                    success_count += 1
                print(f"    Using default: {default_value}")
            else:
                # Prompt for value
                print(f"\n📝 {description}")
                if required:
                    value = input(f"Enter {description} (required): ")
                    if not value.strip():
                        print(f"❌ {description} is required")
                        continue
                else:
                    value = input(f"Enter {description} (optional): ")
                    if not value.strip():
                        print(f"  ⏭️  Skipping optional: {secret_id}")
                        continue

                if self.create_or_update_secret(secret_id, value):
                    success_count += 1

        print(f"\n🎉 Successfully configured {success_count} Firebase secrets!")
        return True

    def generate_env_file(self, env_type="production"):
        """Generate environment file with Firebase configuration."""
        env_file = Path(f".env.{env_type}")

        print(f"\n📄 Generating {env_file} file...")

        env_content = [
            f"# Firebase Configuration - {env_type.title()}",
            f"# Generated on {os.popen('date').read().strip()}",
            "",
            "# Firebase Configuration",
            f"FIREBASE_PROJECT_ID={self.project_id}",
            f"GOOGLE_CLOUD_PROJECT={self.project_id}",
            f"GCP_PROJECT_ID={self.project_id}",
            "",
            "# Firebase Web App Configuration (from Firebase Console)",
            "# Get these values from Firebase Console > Project Settings > Your apps",
        ]

        for config in self.firebase_secrets:
            env_var = config["env_var"]
            description = config["description"]
            default_value = config["default"]

            if default_value:
                env_content.append(f"{env_var}={default_value}")
            else:
                env_content.append(f"# {env_var}=  # {description}")

        env_content.extend([
            "",
            "# Secret Manager Configuration",
            "USE_SECRET_MANAGER=true",
            f"GOOGLE_APPLICATION_CREDENTIALS=firebase-prod-key.json",
            "",
            "# Environment",
            f"ENVIRONMENT={env_type}",
            "DEBUG=false" if env_type == "production" else "DEBUG=true",
            "",
        ])

        try:
            with open(env_file, 'w') as f:
                f.write('\n'.join(env_content))
            print(f"✅ Generated {env_file}")
            return True
        except Exception as e:
            print(f"❌ Failed to generate {env_file}: {e}")
            return False

    def validate_firebase_setup(self):
        """Validate Firebase configuration."""
        print("\n🔍 Validating Firebase setup...")

        errors = []

        # Check service account key file
        firebase_key_file = Path("firebase-prod-key.json")
        if not firebase_key_file.exists():
            errors.append("Firebase service account key file not found")
        else:
            try:
                with open(firebase_key_file) as f:
                    creds = json.load(f)
                if creds.get("project_id") != self.project_id:
                    errors.append(f"Service account project ID mismatch: {creds.get('project_id')} != {self.project_id}")
                else:
                    print("  ✅ Firebase service account key - OK")
            except Exception as e:
                errors.append(f"Invalid Firebase service account key: {e}")

        # Check secrets in Secret Manager
        for config in self.firebase_secrets:
            secret_id = config["id"]
            required = config.get("required", False)

            try:
                secret_path = f"projects/{self.project_id}/secrets/{secret_id}/versions/latest"
                response = self.client.access_secret_version(request={"name": secret_path})
                if response.payload.data:
                    print(f"  ✅ {secret_id} - OK")
                else:
                    if required:
                        errors.append(f"Required secret '{secret_id}' is empty")
                    else:
                        print(f"  ⚠️  {secret_id} - Empty (optional)")
            except Exception:
                if required:
                    errors.append(f"Required secret '{secret_id}' not found")
                else:
                    print(f"  ⚠️  {secret_id} - Not found (optional)")

        if errors:
            print(f"\n❌ Validation errors:")
            for error in errors:
                print(f"  - {error}")
            return False

        print("\n✅ Firebase configuration validated successfully!")
        return True


def main():
    """Main function."""
    import argparse

    parser = argparse.ArgumentParser(description="Set up Firebase configuration for CareerCopilot")
    parser.add_argument("--project-id", default="careercopilot-468811",
                       help="Firebase Project ID")
    parser.add_argument("--validate", action="store_true",
                       help="Only validate existing configuration")
    parser.add_argument("--generate-env", action="store_true",
                       help="Generate environment file")
    parser.add_argument("--env-type", default="production",
                       choices=["production", "staging", "development"],
                       help="Environment type for env file generation")

    args = parser.parse_args()

    manager = FirebaseConfigManager(args.project_id)

    success = True

    if args.validate:
        success = manager.validate_firebase_setup()
    else:
        success = manager.setup_firebase_secrets()

        if success and args.generate_env:
            success = manager.generate_env_file(args.env_type)

        if success:
            print("\n✅ Next steps:")
            print("1. Update your web app Firebase configuration values")
            print("2. Get API key and App ID from Firebase Console")
            print("3. Test Firebase connectivity")

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
