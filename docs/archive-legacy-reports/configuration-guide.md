# CareerCopilot Configuration Guide

This guide explains how to configure the CareerCopilot application for development and production environments, including API keys, database connections, Firebase integration, and Google Cloud Secret Manager.

## Table of Contents

- [Quick Start](#quick-start)
- [Configuration Overview](#configuration-overview)
- [Development Setup](#development-setup)
- [Production Setup](#production-setup)
- [Configuration Scripts](#configuration-scripts)
- [Environment Variables](#environment-variables)
- [Secret Manager Integration](#secret-manager-integration)
- [Firebase Configuration](#firebase-configuration)
- [Troubleshooting](#troubleshooting)

## Quick Start

### For Development

```bash
# Run the interactive setup script
./scripts/setup-secrets.sh

# Choose option 1 for local development
# Edit .env.local with your API keys
# Start the development server
yarn dev
```

### For Production

```bash
# Set up Google Cloud authentication
gcloud auth application-default login

# Configure production secrets
python3 scripts/setup-production-secrets.py

# Set up Firebase configuration
python3 scripts/setup-firebase-config.py

# Test the configuration
python3 scripts/test-configuration.py
```

## Configuration Overview

CareerCopilot uses a layered configuration system:

1. **Environment Variables** - Base configuration from `.env` files
2. **Google Cloud Secret Manager** - Production secrets (API keys, credentials)
3. **Firebase Configuration** - Authentication and database settings
4. **Application Settings** - Feature flags and performance tuning

### Configuration Hierarchy (highest to lowest priority):

1. Environment variables
2. `.env.local` (local development)
3. `.env.production` (production)
4. `.env` (base configuration)
5. Google Cloud Secret Manager (production only)
6. Default values in code

## Development Setup

### Prerequisites

- Node.js 18+ and Yarn 4+
- Python 3.9+
- Docker and Docker Compose (optional)

### Step 1: Environment File

Create or edit `.env.local`:

```bash
# CareerCopilot Development Configuration
ENVIRONMENT=development
DEBUG=true

# AI Service API Keys
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
GEMINI_API_KEY=your-gemini-api-key-here

# Database (SQLite for development)
DATABASE_URL=sqlite:///data/careercopilot-dev.db

# Firebase Configuration
FIREBASE_PROJECT_ID=careercopilot-468811
GCP_PROJECT_ID=careercopilot-468811

# Security (use a secure key for production)
SECRET_KEY=development-secret-key-change-for-production
```

### Step 2: Get API Keys

#### OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to `.env.local` as `OPENAI_API_KEY=sk-...`

#### Anthropic API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create a new API key
3. Add to `.env.local` as `ANTHROPIC_API_KEY=sk-ant-...`

#### Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `.env.local` as `GEMINI_API_KEY=AIzaSy...`

### Step 3: Test Development Setup

```bash
# Test configuration
python3 scripts/test-configuration.py

# Start development server
yarn dev
```

## Production Setup

### Prerequisites

- Google Cloud Project with Secret Manager API enabled
- Firebase project configured
- Service account with appropriate permissions

### Step 1: Google Cloud Setup

```bash
# Set your project
gcloud config set project careercopilot-468811

# Enable required APIs
gcloud services enable secretmanager.googleapis.com
gcloud services enable firestore.googleapis.com

# Create service account (if not exists)
gcloud iam service-accounts create careercopilot-sa \
    --description="CareerCopilot service account" \
    --display-name="CareerCopilot SA"

# Grant permissions
gcloud projects add-iam-policy-binding careercopilot-468811 \
    --member="serviceAccount:careercopilot-sa@careercopilot-468811.iam.gserviceaccount.com" \
    --role="roles/secretmanager.admin"
```

### Step 2: Set Up Production Secrets

```bash
# Interactive secrets setup
python3 scripts/setup-production-secrets.py

# Validate only (check existing secrets)
python3 scripts/setup-production-secrets.py --validate
```

This script will prompt you for:

- OpenAI API Key
- Anthropic API Key
- Google Gemini API Key
- JWT Secret Key (secure, 32+ characters)
- Database URL (PostgreSQL for production)
- Redis Password
- SendGrid API Key (optional)
- Firebase Admin SDK credentials

### Step 3: Firebase Configuration

```bash
# Set up Firebase secrets
python3 scripts/setup-firebase-config.py

# Generate production environment file
python3 scripts/setup-firebase-config.py --generate-env --env-type=production
```

### Step 4: Validate Production Setup

```bash
# Run comprehensive configuration test
python3 scripts/test-configuration.py

# Check specific components
python3 scripts/test-configuration.py --quick
```

## Configuration Scripts

### setup-api-keys.sh

Interactive script for basic configuration setup.

```bash
./scripts/setup-secrets.sh
```

Options:

1. Local Development - Set up environment variables
2. Production Setup - Configure Secret Manager
3. Test Configuration - Validate current setup
4. Skip setup

### setup-production-secrets.py

Comprehensive production secrets configuration.

```bash
python3 scripts/setup-production-secrets.py [options]

Options:
  --validate                Only validate existing secrets
  --project-id PROJECT_ID   GCP Project ID (default: careercopilot-468811)
```

### setup-firebase-config.py

Firebase-specific configuration setup.

```bash
python3 scripts/setup-firebase-config.py [options]

Options:
  --project-id PROJECT_ID   Firebase Project ID
  --validate               Only validate existing configuration
  --generate-env           Generate environment file
  --env-type {production,staging,development}
```

### test-configuration.py

Comprehensive configuration testing.

```bash
python3 scripts/test-configuration.py [options]

Options:
  --quick                  Run only quick tests
  --verbose               Enable verbose output
  --project-id PROJECT_ID  GCP Project ID
```

## Environment Variables

### Core Application Variables

| Variable         | Description             | Default                | Required |
| ---------------- | ----------------------- | ---------------------- | -------- |
| `ENVIRONMENT`    | Application environment | `development`          | No       |
| `DEBUG`          | Enable debug mode       | `true`                 | No       |
| `LOG_LEVEL`      | Logging level           | `INFO`                 | No       |
| `GCP_PROJECT_ID` | Google Cloud Project ID | `careercopilot-468811` | Yes      |

### AI Service Variables

| Variable             | Description              | Required |
| -------------------- | ------------------------ | -------- |
| `OPENAI_API_KEY`     | OpenAI API key           | Yes      |
| `ANTHROPIC_API_KEY`  | Anthropic Claude API key | Yes      |
| `GEMINI_API_KEY`     | Google Gemini API key    | Yes      |
| `PERPLEXITY_API_KEY` | Perplexity API key       | No       |

### Database Variables

| Variable         | Description             | Default                    |
| ---------------- | ----------------------- | -------------------------- |
| `DATABASE_URL`   | Database connection URL | SQLite local file          |
| `REDIS_URL`      | Redis connection URL    | `redis://localhost:6379/0` |
| `REDIS_PASSWORD` | Redis password          | None                       |

### Firebase Variables

| Variable                    | Description               | Required         |
| --------------------------- | ------------------------- | ---------------- |
| `FIREBASE_PROJECT_ID`       | Firebase project ID       | Yes              |
| `FIREBASE_STORAGE_BUCKET`   | Storage bucket name       | Yes              |
| `FIREBASE_CREDENTIALS_JSON` | Service account JSON      | Yes (production) |
| `VITE_FIREBASE_API_KEY`     | Frontend Firebase API key | Yes              |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain      | Yes              |
| `VITE_FIREBASE_APP_ID`      | Firebase app ID           | Yes              |

### Security Variables

| Variable                      | Description            | Default            |
| ----------------------------- | ---------------------- | ------------------ |
| `SECRET_KEY`                  | JWT secret key         | Development key    |
| `JWT_SECRET_KEY`              | JWT secret key (alias) | Same as SECRET_KEY |
| `ALGORITHM`                   | JWT algorithm          | `HS256`            |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration       | `1440` (24h)       |

## Secret Manager Integration

### Production Secret Names

The application uses these secret names in Google Cloud Secret Manager:

- `openai-api-key`
- `anthropic-api-key`
- `gemini-api-key`
- `perplexity-api-key` (optional)
- `jwt-secret-key`
- `database-url`
- `redis-password`
- `sendgrid-api-key` (optional)
- `firebase-credentials-json`
- `firebase-project-id`
- `firebase-storage-bucket`

### Secret Manager Configuration

Environment variables control Secret Manager usage:

```bash
# Enable Secret Manager (production only by default)
USE_SECRET_MANAGER=true

# Or automatically enabled when ENVIRONMENT=production
ENVIRONMENT=production
```

### Access Patterns

1. **Development**: Environment variables only
2. **Production**: Secret Manager with environment variable fallback
3. **Testing**: Environment variables with optional Secret Manager

## Firebase Configuration

### Service Account Setup

1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Save as `firebase-prod-key.json` in project root
4. Add to Secret Manager as `firebase-credentials-json`

### Web App Configuration

1. Go to Firebase Console → Project Settings → Your Apps
2. Copy configuration values
3. Add to environment variables with `VITE_` prefix

### Required Firebase Secrets

```bash
# Backend (Secret Manager)
firebase-credentials-json      # Service account JSON
firebase-project-id           # Project ID
firebase-storage-bucket       # Storage bucket

# Frontend (Environment Variables)
VITE_FIREBASE_API_KEY         # Web API key
VITE_FIREBASE_AUTH_DOMAIN     # Auth domain
VITE_FIREBASE_PROJECT_ID      # Project ID
VITE_FIREBASE_STORAGE_BUCKET  # Storage bucket
VITE_FIREBASE_MESSAGING_SENDER_ID  # Messaging sender ID
VITE_FIREBASE_APP_ID          # App ID
```

## Troubleshooting

### Common Issues

#### "Secret Manager not available"

**Problem**: Application can't access Google Cloud Secret Manager
**Solutions**:

1. Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable
2. Run `gcloud auth application-default login`
3. Ensure service account has Secret Manager permissions

#### "Firebase initialization failed"

**Problem**: Firebase can't initialize
**Solutions**:

1. Check `firebase-prod-key.json` exists and is valid
2. Verify Firebase project ID matches
3. Ensure Firebase APIs are enabled

#### "API key invalid format"

**Problem**: AI service API keys are rejected
**Solutions**:

1. Verify API key format:
   - OpenAI: starts with `sk-`
   - Anthropic: starts with `sk-ant-`
   - Gemini: starts with `AIzaSy`
2. Check for extra spaces or characters
3. Regenerate API key if needed

#### "Database connection failed"

**Problem**: Can't connect to database
**Solutions**:

1. For SQLite: ensure directory exists (`mkdir -p data`)
2. For PostgreSQL: verify connection string format
3. Check database server is running

### Configuration Validation

Always run the configuration test after making changes:

```bash
python3 scripts/test-configuration.py
```

### Debug Mode

Enable debug mode for detailed error messages:

```bash
DEBUG=true
LOG_LEVEL=DEBUG
```

### Reset Configuration

To start over with configuration:

```bash
# Remove local environment file
rm .env.local

# Delete all secrets (careful!)
# python3 scripts/delete-all-secrets.py --confirm

# Run setup again
./scripts/setup-secrets.sh
```

## Security Best Practices

### Development

- Use separate API keys for development
- Never commit API keys to version control
- Use `.env.local` for sensitive local configuration
- Rotate API keys regularly

### Production

- Use Google Cloud Secret Manager for all secrets
- Enable audit logging for secret access
- Use least-privilege IAM roles
- Monitor secret usage and access patterns
- Implement secret rotation policies

### General

- Use strong, unique JWT secret keys (32+ characters)
- Enable HTTPS in production
- Validate all configuration on startup
- Log configuration errors but not secret values

## Support

If you encounter issues:

1. Run `python3 scripts/test-configuration.py` for diagnostics
2. Check the application logs for detailed error messages
3. Verify all required environment variables are set
4. Ensure Google Cloud permissions are correct
5. Review this guide for common solutions
