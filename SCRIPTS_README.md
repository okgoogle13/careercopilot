# Scripts Organization

## Root Scripts (Quick Access)
These scripts are kept in the root for convenience:

- **setup-api-keys.sh** - Interactive local development setup (frequently used)
- **setup-agent-infrastructure.sh** - M3 Design System infrastructure setup
- **audit.sh** - Quick project audit
- **cleanup.sh** - Quick cleanup operations
- **readiness.sh** - Deployment readiness check
- **UI_setup.sh** - UI component setup

## scripts/ Directory
All other scripts are organized in `scripts/` directory:

### Deployment
- `deploy.sh` - Main deployment script (staging/production)
- `deploy-staging.sh` - Deploy to staging
- `deploy-production.sh` - Deploy to production

### Configuration
- `setup-everything.sh` - Complete project setup
- `setup-firebase.sh` - Firebase configuration
- `setup-aws-ses-secrets.sh` - AWS SES email service setup
- `validate-environment.sh` - Environment validation

### Development
- `typescript-check.sh` - TypeScript validation
- `lint-autofix.sh` - Auto-fix linting issues
- `frontend-deployment-readiness.sh` - Frontend validation

### Design System
- `build-design-tokens.py` - Generate CSS from tokens.json
- `validate-design-tokens.py` - Validate token schema
- `update-design-system.sh` - Full design system update

### Security & Secrets
- `manage_firebase_secrets.sh` - Firebase secret management
- `rotate-api-keys.sh` - API key rotation
- `validate-security.sh` - Security audit

## Archived Scripts
One-off or historical scripts in `.archive/`:
- `merge_pr84_into_pr83.sh` - Specific PR merge (historical)
- `strategic_audit_report.md` - Audit report (historical)

## Usage

**Quick development setup:**
```bash
./setup-api-keys.sh
```

**Deploy to production:**
```bash
./scripts/deploy.sh production
```

**Update design system:**
```bash
./scripts/update-design-system.sh
```

**Run full project audit:**
```bash
./audit.sh
```
