import os

try:
    from google.cloud import secretmanager
    from google.api_core.exceptions import NotFound

    _HAS_SECRETMANAGER = True
except Exception:
    secretmanager = None
    NotFound = Exception
    _HAS_SECRETMANAGER = False

# Get the project ID from the environment
GCP_PROJECT_ID = os.getenv("GCP_PROJECT_ID")

# If google-cloud-secret-manager is available, create a real client; otherwise
# provide a lightweight fallback that raises clear errors at runtime.
if _HAS_SECRETMANAGER:
    client = secretmanager.SecretManagerServiceClient()
else:

    class _FallbackClient:
        def __getattr__(self, name):
            def _err(*a, **k):
                raise RuntimeError(
                    "google-cloud-secretmanager not installed in this environment"
                )

            return _err

    client = _FallbackClient()


def save_user_secret(user_id: str, secret_name: str, secret_value: str) -> str:
    """
    Saves a user-specific secret to Google Cloud Secret Manager.
    Returns the resource name of the secret version.
    """
    if not GCP_PROJECT_ID:
        raise ValueError("GCP_PROJECT_ID environment variable not set.")

    secret_id = f"careercopilot-{secret_name}-{user_id}"

    try:
        secret = client.create_secret(
            request={
                "parent": f"projects/{GCP_PROJECT_ID}",
                "secret_id": secret_id,
                "secret": {"replication": {"automatic": {}}},
            }
        )
        parent = secret.name
    except Exception:  # AlreadyExists
        parent = client.secret_path(GCP_PROJECT_ID, secret_id)

    response = client.add_secret_version(
        request={"parent": parent, "payload": {"data": secret_value.encode("UTF-8")}}
    )
    return response.name


def get_user_secret(user_id: str, secret_name: str, version: str = "latest") -> str:
    """
    Retrieves a user-specific secret from Google Cloud Secret Manager.
    """
    if not GCP_PROJECT_ID:
        raise ValueError("GCP_PROJECT_ID environment variable not set.")

    secret_id = f"careercopilot-{secret_name}-{user_id}"
    name = f"projects/{GCP_PROJECT_ID}/secrets/{secret_id}/versions/{version}"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")


def delete_user_secret(user_id: str, secret_name: str):
    """
    Deletes a secret and all its versions for a user.
    """
    if not GCP_PROJECT_ID:
        raise ValueError("GCP_PROJECT_ID environment variable not set.")

    secret_id = f"careercopilot-{secret_name}-{user_id}"
    secret_path = client.secret_path(GCP_PROJECT_ID, secret_id)

    try:
        # Delete the secret itself. This will automatically delete all versions.
        client.delete_secret(request={"name": secret_path})
    except NotFound:
        # If the secret doesn't exist, we can consider it a success.
        print(f"Secret {secret_id} not found, nothing to delete.")
        pass
    except Exception as e:
        print(f"Error deleting secret {secret_id}: {e}")
        # Re-raise the exception to be handled by the calling function
        raise e
