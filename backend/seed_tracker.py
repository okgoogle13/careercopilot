import os
from datetime import datetime

from app.core.firebase import get_firestore, initialize_firebase

# Ensure project ID is set
os.environ["FIREBASE_PROJECT_ID"] = "careercopilot-468811"
os.environ["GOOGLE_CLOUD_PROJECT"] = "careercopilot-468811"


def seed():
    print("Seeding Firestore with test applications...")
    initialize_firebase()
    db = get_firestore()
    if not db:
        print("Failed to get Firestore client")
        return

    # Use a fixed test user ID (the one from setup-test-user.js if it worked, or a mock one)
    user_id = "test_uid_123"

    apps_col = db.collection("applications")

    test_apps = [
        {
            "userId": user_id,
            "jobTitle": "Senior AI Agent",
            "companyName": "Antigravity Inc",
            "jobDescription": "Build awesome coding agents.",
            "status": "applied",
            "appliedDate": datetime.utcnow().isoformat(),
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat(),
        },
        {
            "userId": user_id,
            "jobTitle": "Principal Engineer",
            "companyName": "CloudOps Solutions",
            "jobDescription": "Optimize cloud infrastructure.",
            "status": "interviewing",
            "appliedDate": datetime.utcnow().isoformat(),
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat(),
        },
    ]

    for app_data in test_apps:
        res = apps_col.add(app_data)
        print(f"Added application: {res[1].id}")


if __name__ == "__main__":
    seed()
