#!/usr/bin/env python3
"""
Create Test User via Firebase Admin SDK

This script creates a test user using the Firebase Admin SDK,
which uses the service account credentials already configured for the backend.

Usage:
    python3 scripts/create-test-user.py
"""

import os
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent.parent / 'backend'
sys.path.insert(0, str(backend_path))

import firebase_admin
from firebase_admin import auth, credentials

# Test user configuration
TEST_USER_EMAIL = "test@careercopilot.dev"
TEST_USER_PASSWORD = "TestPassword123!"
TEST_USER_DISPLAY_NAME = "E2E Test User"

def create_test_user():
    """Create or update test user in Firebase Authentication"""
    
    print("🔧 Setting up test user for E2E tests...\n")
    
    # Initialize Firebase Admin if not already initialized
    try:
        firebase_admin.get_app()
        print("✅ Firebase Admin SDK already initialized")
    except ValueError:
        # Load credentials from environment
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        if not cred_path:
            print("❌ Error: GOOGLE_APPLICATION_CREDENTIALS not set")
            print("   Please ensure backend/.env contains the path to service-account.json")
            sys.exit(1)
        
        if not os.path.exists(cred_path):
            print(f"❌ Error: Credentials file not found: {cred_path}")
            sys.exit(1)
        
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        print("✅ Firebase Admin SDK initialized")
    
    try:
        # Try to get existing user
        user = auth.get_user_by_email(TEST_USER_EMAIL)
        print(f"✅ Test user already exists: {TEST_USER_EMAIL}")
        print(f"   UID: {user.uid}")
        
        # Update password to ensure it matches
        auth.update_user(
            user.uid,
            password=TEST_USER_PASSWORD,
            display_name=TEST_USER_DISPLAY_NAME
        )
        print("✅ Test user password updated")
        
    except auth.UserNotFoundError:
        # Create new user
        print(f"Creating new test user: {TEST_USER_EMAIL}")
        user = auth.create_user(
            email=TEST_USER_EMAIL,
            password=TEST_USER_PASSWORD,
            display_name=TEST_USER_DISPLAY_NAME,
            email_verified=True
        )
        print(f"✅ Test user created successfully!")
        print(f"   UID: {user.uid}")
    
    print("\nTest User Credentials:")
    print(f"  Email: {TEST_USER_EMAIL}")
    print(f"  Password: {TEST_USER_PASSWORD}")
    print("\n⚠️  IMPORTANT: Keep these credentials secure!\n")
    print("📝 Next steps:")
    print("  1. Ensure frontend/.env.test contains:")
    print(f"     TEST_USER_EMAIL={TEST_USER_EMAIL}")
    print(f"     TEST_USER_PASSWORD={TEST_USER_PASSWORD}")
    print("  2. Run: npm run test:e2e:critical\n")

if __name__ == "__main__":
    try:
        create_test_user()
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
