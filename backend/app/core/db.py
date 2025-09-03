import json
import os

from google.cloud import firestore
from google.oauth2 import service_account


def get_firestore_client():
    credentials_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")

    if credentials_json:
        # Use environment-based credentials
        credentials_dict = json.loads(credentials_json)
        credentials = service_account.Credentials.from_service_account_info(credentials_dict)
        return firestore.Client(credentials=credentials, project=credentials_dict["project_id"])
    else:
        # Fall back to default credentials (file-based)
        return firestore.Client()


db = get_firestore_client()
