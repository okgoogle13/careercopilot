import json
import os

try:
    from google.cloud import firestore
    from google.oauth2 import service_account

    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False


def get_firestore_client():
    if not FIREBASE_AVAILABLE:
        print("Warning: Firebase/Firestore not available - running in limited mode")
        return None

    try:
        credentials_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")

        if credentials_json:
            # Use environment-based credentials
            credentials_dict = json.loads(credentials_json)
            credentials = service_account.Credentials.from_service_account_info(credentials_dict)
            return firestore.Client(credentials=credentials, project=credentials_dict["project_id"])
        else:
            # Fall back to default credentials (file-based)
            return firestore.Client()
    except Exception as e:
        print(f"Warning: Could not initialize Firestore client: {e}")
        return None


db = get_firestore_client()
