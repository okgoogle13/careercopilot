from pydantic import BaseSettings

class Settings(BaseSettings):
    # Add settings here
    CLOUD_REGION: str = "us-central1"

settings = Settings()
