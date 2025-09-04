#!/usr/bin/env python3

import os
import sys

# Add backend to path
sys.path.insert(0, 'backend')

# Test OpenAI
try:
    import openai
    client = openai.OpenAI(api_key="YOUR_OPENAI_API_KEY")
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Hello!"}],
        max_tokens=10
    )
    print("✅ OpenAI test successful:", response.choices[0].message.content)
except Exception as e:
    print("❌ OpenAI test failed:", str(e))

# Test Anthropic
try:
    import anthropic
    client = anthropic.Anthropic(api_key="YOUR_ANTHROPIC_API_KEY")
    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=10,
        messages=[{"role": "user", "content": "Hello!"}]
    )
    print("✅ Anthropic test successful:", response.content[0].text)
except Exception as e:
    print("❌ Anthropic test failed:", str(e))

print("\n🔐 Secret Manager Integration Available:")
print("- Enhanced secrets.py module with Google Secret Manager")
print("- setup-secrets.py script for automated secret configuration")
print("- .env.production.secure template without hardcoded credentials")

print("\n🚀 Next Steps:")
print("1. Configure Google Secret Manager secrets")
print("2. Update Docker deployment to use secret integration")
print("3. Test full production deployment")
