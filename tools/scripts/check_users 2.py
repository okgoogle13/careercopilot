#!/usr/bin/env python3
"""
Quick script to check for existing users in the database
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.core.database import db_config
from app.models.database import User
from sqlalchemy.orm import Session

def check_users():
    """Check for existing users in the database"""
    print("=" * 60)
    print("Checking for existing users...")
    print("=" * 60)
    
    try:
        # Create session
        db: Session = db_config.SessionLocal()
        
        # Query all users
        users = db.query(User).all()
        
        if not users:
            print("\n❌ No users found in database")
            print("\nYou need to register a new account:")
            print("  1. Go to http://localhost:5173/register")
            print("  2. Fill in the registration form")
            print("  3. Create your account")
        else:
            print(f"\n✅ Found {len(users)} user(s) in database:\n")
            for user in users:
                print(f"  Email: {user.email}")
                print(f"  Name: {user.name}")
                print(f"  ID: {user.id}")
                print(f"  Created: {getattr(user, 'created_at', 'N/A')}")
                print()
            
            print("\n💡 Note: The backend currently accepts ANY password for existing users")
            print("   (temporary development bypass)")
            print("\nYou can login with:")
            print(f"  Email: {users[0].email}")
            print("  Password: (any password will work)")
        
        db.close()
        
    except Exception as e:
        print(f"\n❌ Error checking database: {e}")
        print("\nDatabase might not be initialized. Try running the backend first.")
        return False
    
    return True

if __name__ == "__main__":
    check_users()






