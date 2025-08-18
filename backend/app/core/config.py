try:
    # pydantic v2 moved BaseSettings to pydantic-settings
    from pydantic_settings import BaseSettings
except Exception:
    try:
        from pydantic import BaseSettings  # type: ignore
    except Exception:
        # Minimal fallback for test environments without pydantic
        class BaseSettings:  # type: ignore
            def __init__(self, **kwargs):
                for k, v in kwargs.items():
                    setattr(self, k, v)


class Settings(BaseSettings):
    # Add settings here
    CLOUD_REGION: str = "us-central1"
    # Defaults required by app.main
    PROJECT_NAME: str = "careercopilot"
    API_V1_STR: str = "/api/v1"
    BACKEND_CORS_ORIGINS: list = []


settings = Settings()
