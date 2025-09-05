#!/usr/bin/env python3
"""
Test script to verify secure configuration is working.
"""

from app.core.secure_config import settings


def test_config():
    """Test and display configuration values."""
    print("\n=== Testing Secure Configuration ===\n")

    # Display basic settings
    print("Basic Settings:")
    print(f"Environment: {settings.ENV}")
    print(f"Debug Mode: {settings.DEBUG}")
    print(f"Log Level: {settings.LOG_LEVEL}")

    # Display database settings
    print("\nDatabase Settings:")
    print(f"Database URL: {settings.DATABASE_URL}")
    print(f"Redis URL: {settings.REDIS_URL}")

    # Display security settings (masked)
    print("\nSecurity Settings:")
    print(f"Secret Key: {'*' * 8} (hidden)" if settings.SECRET_KEY else "Secret Key: Not set")
    print(f"Algorithm: {settings.ALGORITHM}")

    # Display AI settings (masked)
    print("\nAI Settings:")
    print(
        f"Gemini API Key: {'*' * 8} (hidden)"
        if settings.GEMINI_API_KEY
        else "Gemini API Key: Not set"
    )
    print(
        f"OpenAI API Key: {'*' * 8} (hidden)"
        if settings.OPENAI_API_KEY
        else "OpenAI API Key: Not set"
    )

    # Display feature flags
    print("\nFeature Flags:")
    print(f"Enable AI Features: {settings.ENABLE_AI_FEATURES}")
    print(f"Enable Multi-Agent: {settings.ENABLE_MULTI_AGENT}")
    print(f"Enable ML Analysis: {settings.ENABLE_ML_ANALYSIS}")

    print("\n=== Configuration Test Complete ===\n")


if __name__ == "__main__":
    test_config()
