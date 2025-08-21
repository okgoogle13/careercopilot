# 🛡️ CareerCopilot Security Scripts

Comprehensive security automation scripts for API key rotation, verification, and security auditing.

## 📋 Overview

This security toolkit provides automated scripts to handle compromised API keys and maintain security best practices for the CareerCopilot project.

## 🚀 Quick Start

### Emergency Response (Compromised Keys)
```bash
./scripts/security-manager.sh
# Choose option 7 for emergency revocation
# Then choose option 1 for full rotation
```

### Regular Security Maintenance
```bash
./scripts/security-manager.sh
# Choose option 1 for full security rotation
```

## 📁 Scripts Overview

### 🎯 Main Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `security-manager.sh` | Master script with interactive menu | Always start here |
| `rotate-api-keys.sh` | Complete API key rotation process | When keys are compromised |
| `verify-rotation.sh` | Verify rotation was successful | After rotating keys |
| `security-audit.sh` | Comprehensive security assessment | Monthly security reviews |
| `update-github-secrets.sh` | Update GitHub repository secrets | After key rotation |

### 🔧 Making Scripts Executable

```bash
chmod +x scripts/*.sh
```

## 📖 Detailed Script Guide

### 1. 🎛️ Security Manager (`security-manager.sh`)
**Interactive master script with menu-driven interface**

Features:
- Full security rotation workflow
- Individual script execution
- Security status dashboard
- Emergency revocation procedures
- Help and documentation

```bash
./scripts/security-manager.sh
```

### 2. 🔄 API Key Rotation (`rotate-api-keys.sh`)
**Guided process for rotating all API keys**

What it does:
- Opens service consoles in your browser
- Guides you through key revocation
- Prompts for new API keys with validation
- Creates properly formatted .env files
- Updates .gitignore to protect secrets

Services covered:
- 🔥 Firebase (Web API Key + Config)
- 🤖 OpenAI (GPT API)
- 🧠 Anthropic (Claude API)
- ☁️ Google/Gemini (AI API)
- 🔍 Perplexity (Optional)
- 📊 Pinecone (Optional)

```bash
./scripts/rotate-api-keys.sh
```

### 3. ✅ Security Verification (`verify-rotation.sh`)
**Validates that rotation was successful**

Checks:
- ❌ No old/compromised keys in codebase
- ✅ Environment files properly configured
- 🔒 Git repository security (no tracked secrets)
- 📝 API key format validation
- 🌐 Basic connectivity tests

```bash
./scripts/verify-rotation.sh
```

### 4. 🛡️ Security Audit (`security-audit.sh`)
**Comprehensive security assessment with scoring**

Audit areas:
- 📁 Environment file security
- 🔐 Git repository protection
- 📦 Dependency security
- 🔥 Firebase configuration
- 🌐 API security practices
- 🚀 Production readiness

Generates:
- Security score (0-100%)
- Detailed report file
- Prioritized recommendations

```bash
./scripts/security-audit.sh
```

### 5. 🔐 GitHub Secrets Update (`update-github-secrets.sh`)
**Updates CI/CD secrets automatically**

Requirements:
- GitHub CLI (`gh`) installed
- Authenticated with GitHub

Updates:
- All API keys as repository secrets
- Environment configuration
- CI/CD specific variables

```bash
./scripts/update-github-secrets.sh
```

## 🚨 Emergency Procedures

### If API Keys Are Actively Being Misused:

1. **Immediate Response** (< 5 minutes):
   ```bash
   ./scripts/security-manager.sh
   # Choose option 7: Emergency Key Revocation
   ```

2. **Complete Rotation** (15-30 minutes):
   ```bash
   ./scripts/security-manager.sh
   # Choose option 1: Full Security Rotation
   ```

3. **Monitor and Verify** (24-48 hours):
   - Check billing dashboards for unexpected charges
   - Monitor API usage for suspicious activity
   - Run security audit daily for first week

## ⚙️ Configuration

### Customizing Compromised Key Patterns

Edit `verify-rotation.sh` and `security-audit.sh`:

```bash
COMPROMISED_PATTERNS=(
    "AIzaSyDtSTUen"      # Your specific Firebase key
    "sk-proj-dU-hIGOA"   # Your specific OpenAI key
    "sk-ant-api03-3_b3PD" # Your specific Anthropic key
    # Add your compromised patterns here
)
```

### Environment File Locations

Default locations:
- Frontend: `frontend/.env`
- Backend: `backend/.env`

Modify script paths if your structure differs.

## 📊 Security Best Practices

### After Rotation:

1. **Enable 2FA** on all service accounts
2. **Set usage limits** and billing alerts
3. **Monitor dashboards** daily for first week
4. **Update documentation** with new procedures
5. **Schedule regular audits** (monthly)

### Prevention:

1. **Never commit** `.env` files
2. **Use secrets management** in production
3. **Regular dependency updates**
4. **Code scanning** enabled in GitHub
5. **Branch protection** rules enforced

## 🔍 Troubleshooting

### Common Issues:

**Script Permission Denied:**
```bash
chmod +x scripts/*.sh
```

**GitHub CLI Not Authenticated:**
```bash
gh auth login
```

**Environment File Not Found:**
```bash
# Ensure you're in the project root
ls frontend/.env
```

**Old Keys Still in Git History:**
```bash
# Consider using BFG Repo-Cleaner or git filter-branch
# Or rotate keys again with new patterns
```

## 📈 Security Scoring

The security audit assigns points for good practices:

- **80-100%**: Excellent security ✅
- **60-79%**: Good security 😊
- **40-59%**: Needs improvement ⚠️
- **0-39%**: Critical issues 🚨

## 🤝 Contributing

When adding new API services:

1. Update `rotate-api-keys.sh` with new service
2. Add validation patterns to verification scripts
3. Update GitHub secrets script
4. Test full rotation workflow
5. Update this documentation

## 📞 Support

For security incidents:
1. Run emergency procedures first
2. Check logs in generated audit reports
3. Review GitHub repository security settings
4. Consider professional security consultation for major breaches

---

**Remember**: Security is an ongoing process, not a one-time task. Regular audits and proactive monitoring are essential for maintaining a secure application.

🛡️ **Stay secure!**
