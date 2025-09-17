# 🔐 CareerCopilot Secrets Management Guide

This document outlines the secure management of secrets, API keys, and sensitive configuration for the CareerCopilot application.

## 🚨 Security Principles

1. **Never commit secrets to Git**
2. **Use environment-specific configurations**
3. **Rotate secrets regularly**
4. **Use least-privilege access**
5. **Monitor secret usage**

## 📁 File Structure

```
careercopilot/
├── .env.template                    # Template with placeholder values
├── .env.production                  # Production secrets (NEVER COMMIT)
├── .gitignore                       # Ensures secrets are not committed
├── firebase-staging-key.json        # Staging service account (NEVER COMMIT)
├── firebase-prod-key.json           # Production service account (NEVER COMMIT)
├── frontend/
│   ├── .env                         # Current environment (development)
│   ├── .env.development             # Development configuration
│   ├── .env.production              # Production configuration (NEVER COMMIT)
│   └── .env.example                 # Public template
└── backend/
    ├── .env                         # Current environment
    ├── .env.development             # Development configuration
    └── .env.production              # Production configuration (NEVER COMMIT)
```

## 🔑 Secret Categories

### 1. Firebase/Google Cloud Credentials

- **Service Account Keys**: JSON files for authentication
- **Project IDs**: Firebase project identifiers
- **API Keys**: Client-side Firebase configuration

### 2. AI Service API Keys

- **OpenAI API Key**: For GPT models
- **Anthropic API Key**: For Claude models
- **Gemini API Key**: For Google AI models
- **Perplexity API Key**: For search-augmented AI

### 3. Database Credentials

- **Connection Strings**: Database URLs with credentials
- **User/Password**: Database authentication

### 4. External Service Keys

- **Search APIs**: SERP API keys
- **Vector Database**: Pinecone credentials
- **Monitoring**: Grafana credentials

## 🛠️ Setup Instructions

### 1. Initial Setup

```bash
# Copy the template to create your environment files
cp .env.template backend/.env.development
cp .env.template .env.production

# Edit the files with your actual values
# NEVER commit files with real secrets
```

### 2. Development Environment

```bash
# Switch to development environment
./scripts/switch-to-development.sh

# Validate configuration
./scripts/validate-environment.sh
```

### 3. Production Environment

```bash
# Switch to production environment (with safety checks)
./scripts/switch-to-production.sh

# Validate configuration
./scripts/validate-environment.sh production
```

## 🔒 Security Best Practices

### 1. Service Account Key Management

- **Create separate service accounts** for each environment
- **Use minimal required permissions**
- **Rotate keys regularly** (every 90 days)
- **Store keys outside of the repository**

### 2. API Key Security

- **Use environment variables** instead of hardcoding
- **Implement rate limiting** to prevent abuse
- **Monitor usage** for unusual patterns
- **Rotate keys periodically**

### 3. Environment Isolation

- **Separate Firebase projects** for staging and production
- **Different service accounts** for each environment
- **Isolated databases** to prevent data leakage

## 📊 Environment Configuration Matrix

| Component        | Development               | Staging                   | Production             |
| ---------------- | ------------------------- | ------------------------- | ---------------------- |
| Firebase Project | careercopilot-staging     | careercopilot-staging     | careercopilot-468811   |
| Service Account  | firebase-staging-key.json | firebase-staging-key.json | firebase-prod-key.json |
| Database         | Local SQLite              | Staging Firestore         | Production Firestore   |
| API Keys         | Development keys          | Staging keys              | Production keys        |

## 🚀 Deployment Security

### Pre-deployment Checklist

- [ ] All secrets properly configured
- [ ] No hardcoded credentials in code
- [ ] Environment validation passes
- [ ] Service accounts have minimal permissions
- [ ] API keys are valid and not expired

### Production Deployment

- [ ] Use production credentials only
- [ ] Enable monitoring and alerting
- [ ] Implement proper logging (without secrets)
- [ ] Set up secret rotation schedule

## 🔧 Tools and Scripts

### Environment Management

- `./scripts/switch-to-development.sh` - Switch to development
- `./scripts/switch-to-production.sh` - Switch to production
- `./scripts/validate-environment.sh` - Validate configuration

### Deployment

- `./scripts/deploy-staging.sh` - Deploy to staging
- `./scripts/deploy-production.sh` - Deploy to production (with safety checks)

## 🚨 Incident Response

### If Secrets Are Compromised:

1. **Immediately revoke** the compromised credentials
2. **Generate new secrets** with different values
3. **Update all environments** with new credentials
4. **Review logs** for unauthorized usage
5. **Document the incident** and lessons learned

### If Secrets Are Accidentally Committed:

1. **Remove secrets** from the repository immediately
2. **Revoke compromised credentials**
3. **Use git history rewriting** to remove secrets from history
4. **Generate new secrets**
5. **Update all team members**

## 📞 Emergency Contacts

| Service      | Action                  | Contact              |
| ------------ | ----------------------- | -------------------- |
| Firebase     | Revoke service accounts | Firebase Console     |
| OpenAI       | Revoke API keys         | OpenAI Platform      |
| Anthropic    | Revoke API keys         | Anthropic Console    |
| Google Cloud | Revoke credentials      | Google Cloud Console |

## 🔍 Monitoring and Auditing

### Recommended Monitoring:

- API usage patterns
- Authentication failures
- Unusual access patterns
- Service account activities
- Cost anomalies

### Regular Audits:

- Review service account permissions
- Audit API key usage
- Check for unused credentials
- Validate environment configurations
- Update team access as needed

## 📚 Additional Resources

- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Google Cloud IAM Best Practices](https://cloud.google.com/iam/docs/using-iam-securely)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
