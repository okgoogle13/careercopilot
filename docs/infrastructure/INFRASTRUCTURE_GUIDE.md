# Infrastructure & Configuration Guide

## Core Configuration Files

### Environment Configuration

- `.env.local` - Local development environment (not committed)
- `.env.production` - Production template
- `backend/app/core/config.py` - Centralized configuration
- `backend/app/core/secure_config.py` - Secret Manager integration
- `backend/app/core/firestore_cache.py` - Firestore cache (instead of Redis)
- `backend/app/core/genkit_init.py` - Genkit initialization
- `verify_genkit.py` - Genkit health check

### Frontend Development & Build Commands

#### Development

```bash
yarn dev                    # Start Vite development server
yarn storybook              # Start Storybook development server
```

#### Building & Validation

```bash
yarn build                  # TypeScript compilation + Vite production build
yarn preview                # Preview production build locally
yarn build-storybook        # Build Storybook for production
```

#### Linting & Formatting

```bash
yarn lint                   # Run ESLint (entire project)
yarn lint:fix               # Auto-fix ESLint issues
yarn lint:ci                # CI-friendly linting
yarn format                 # Format with Prettier
yarn format:check           # Check formatting without changes
# Pre-commit hooks enabled via husky
```

#### Deployment Readiness

```bash
./scripts/frontend-deployment-readiness.sh    # Full TypeScript, build, tests, linting, security validation
./scripts/typescript-check.sh                 # TypeScript type checking
./scripts/vite-bundle-analyzer.sh             # Bundle analysis and optimization
# See scripts/frontend-commands.md for more details
```

## Backend Development

### Python Environment

```bash
# Virtual environment setup
python3 -m venv venv
source venv/bin/activate    # Activate venv
deactivate                  # Deactivate
```

### NLP Performance Optimization

- **Setup**: `./backend/setup_nlp.sh` - Install spaCy and download models
- **Test**: `python backend/test_nlp_optimization.py` - Benchmark performance improvements
- **Health Check**: `curl http://localhost:8080/nlp/health` - Monitor NLP model status
- **Performance**: 50-100x faster resume parsing (2500ms → 30ms per request)
- **Configuration**: Set `ENABLE_NLP_PRELOAD=true` to enable model caching
- **Documentation**: See `docs/NLP_OPTIMIZATION_GUIDE.md` for complete details

## AI Services Integration

### Frontend API Client

**Location**: `frontend/src/api/aiServices.ts`

**Available Services:**
- `generateKscResponses(jobDescription)` - Generate Key Selection Criteria responses
- `detectKscCriteria(jobDescription)` - Detect KSC criteria from job descriptions
- `generateSingleKscResponse(criterion, jobDescription, userProfile?)` - Generate single KSC response
- `generateCoverLetter(jobDescription, tone)` - Generate tailored cover letters
- `generateTailoredResume(jobDescription, userProfileId)` - Generate personalized resumes

**Components:**
- `CoverLetterGenerator.tsx` - Interactive cover letter generation with tone selection
- `TailoredResumeGenerator.tsx` - Resume generation with job description tailoring
- Both components include full API integration, loading states, and error handling

## Genkit AI Framework

### Configuration

- **Enable Flows**: Set `ENABLE_GENKIT_FLOWS=true` to enable Genkit flows
- **Initialization**: `backend/app/core/genkit_init.py` handles startup and flow registration
- **Health Monitoring**: Genkit health checks integrated into application status
- **API Key**: Requires `GEMINI_API_KEY` environment variable for Google AI integration
- **Verification**: Use `ENABLE_GENKIT_FLOWS=true python3 verify_genkit.py` to test integration

## Additional Tools and Utilities

### Environment Switching

```bash
./scripts/switch-to-development.sh    # Switch to development environment
./scripts/switch-to-production.sh     # Switch to production environment
```

### Security & Updates

```bash
./scripts/rotate-api-keys.sh          # Rotate API keys securely
./scripts/check-updates.sh            # Check for dependency updates
./scripts/update-dependencies.sh      # Update project dependencies
```

### Testing & Monitoring

```bash
./scripts/test-vector-search.py       # Test Vertex AI Vector Search functionality
./scripts/test-docker-registry.sh     # Test Docker registry configuration
./scripts/firebase-config-validator.py # Validate Firebase configuration
```

### Setup & Configuration

```bash
./scripts/setup-everything.sh          # Complete project setup script
./scripts/setup-careercopilot-firebase.sh  # Firebase-specific setup
python3 scripts/test-configuration.py  # Validate environment configuration
```

## Test Infrastructure

### Configuration Files

- `frontend/jest.config.mjs` - Jest ES module config with ts-jest
- `frontend/playwright.config.ts` - Playwright E2E configuration
- `backend/pytest.ini`, `backend/pyproject.toml` - Backend test config
- `frontend/src/setupTests.ts` - Firebase mocks, Material-UI theme, ResizeObserver

### CI/CD Pipeline

**Location**: `.github/workflows/ci.yml`

**Features:**
- Parallel test execution: Frontend (Jest), Backend (pytest), E2E (Playwright)
- Coverage reporting to Codecov
- Security scanning (Bandit, CodeQL)
- Type checking (mypy)
- Artifacts: Coverage reports, E2E screenshots, security reports

## Current Project Status

### Frontend Architecture

- **Framework**: React 18.2.0 + TypeScript 5.0+ with Vite 5.0
- **Styling**: Material-UI v5.18 with Emotion styling engine and Tailwind CSS utilities
- **Component Structure**: Organized component library with comprehensive UI components
  - `ui/` - Base UI components (29 components)
  - `library/` - Reusable business components (15 components)
  - `features/` - Feature-specific components
  - `career/` - Career management components
  - `documents/` - Document handling components
- **State Management**: React Hook Form for forms, React Context for global state
- **Testing**: Jest + React Testing Library with 15s timeout configuration
- **Development Tools**: Storybook for component development and documentation

### Backend & Functions

- **Firebase Functions**: Node.js 20 runtime with TypeScript
- **AI Framework**: Genkit 1.19.1 for AI flow orchestration
- **Dependencies**:
  - Firebase Admin SDK 13.5.0
  - Google AI integration via @genkit-ai/googleai
  - Google Cloud Secret Manager integration
- **Build Process**: TypeScript compilation with separate tsconfig.build.json

### Workspace Configuration

- **Package Manager**: Yarn 4.10.2 with workspace support
- **Workspaces**: Frontend and Functions as separate workspace packages
- **Node Version**: >=18.0.0 required
- **Linting**: Unified ESLint configuration across workspaces
- **Pre-commit**: Husky + lint-staged for automated code quality checks

## Deployment Workflow Scripts

### Production Deployment

```bash
# 1. Validate secrets
./scripts/validate-secrets.sh all production

# 2. Set up missing secrets
./scripts/setup-secrets.sh all production

# 3. Final validation
./scripts/validate-secrets.sh all production

# 4. Deploy
./scripts/deploy.sh production
```

### Staging Deployment

```bash
# 1. Setup staging secrets
./scripts/setup-secrets.sh all staging

# 2. Validate staging
./scripts/validate-secrets.sh all staging

# 3. Deploy staging
./scripts/deploy.sh staging
```

### AWS SES Setup

```bash
# 1. Setup AWS SES for all platforms
./scripts/setup-secrets.sh aws-ses all

# 2. Validate AWS SES configuration
./scripts/validate-secrets.sh aws-ses all

# 3. Test email sending
python3 -c "from backend.app.services.email_service import send_email; print(send_email('test@example.com', 'Test', '<h1>Test</h1>'))"
```

## Environment Variables

### Development Environment

```bash
# Firebase
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id

# Backend
REACT_APP_API_URL=http://localhost:8000
ENABLE_GENKIT_FLOWS=true
ENABLE_NLP_PRELOAD=true

# AI Services
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
```

### Production Environment

```bash
# Firebase (from Secret Manager)
FIREBASE_API_KEY=gcp-secret:firebase-api-key
FIREBASE_PROJECT_ID=gcp-secret:firebase-project-id

# Backend
REACT_APP_API_URL=https://api.careercopilot.app
ENABLE_GENKIT_FLOWS=true

# AI Services (from Secret Manager)
GEMINI_API_KEY=gcp-secret:gemini-api-key
OPENAI_API_KEY=gcp-secret:openai-api-key
ANTHROPIC_API_KEY=gcp-secret:anthropic-api-key
```

## Monitoring & Health Checks

### Application Health

```bash
# Backend health
curl http://localhost:8000/health

# NLP service health
curl http://localhost:8000/nlp/health

# Genkit flows health
ENABLE_GENKIT_FLOWS=true python3 verify_genkit.py
```

### Performance Monitoring

```bash
# Test database performance
python3 scripts/test-db-performance.py

# Monitor API response times
python3 scripts/monitor-api-performance.py

# Check bundle size
yarn vite-bundle-analyzer
```

## Security Configuration

### API Key Management

```bash
# Rotate all API keys
./scripts/rotate-api-keys.sh

# Check for exposed keys
./scripts/security-scan.sh

# Validate Firebase security rules
./scripts/validate-firebase-rules.sh
```

### Environment Security

```bash
# Validate environment configuration
python3 scripts/test-configuration.py

# Check for hardcoded secrets
grep -r "sk-\|AIzaSy\|GOCSPX" . --exclude-dir=.git --exclude-dir=node_modules

# Audit permissions
./scripts/audit-permissions.sh
```

## Troubleshooting

### Common Issues

1. **Build Failures**: Check TypeScript configuration and dependencies
2. **Test Timeouts**: Increase timeout values in Jest config
3. **Firebase Connection**: Validate Firebase configuration and API keys
4. **Genkit Issues**: Check API key and flow registration

### Debug Commands

```bash
# Check TypeScript compilation
yarn type-check

# Validate all configurations
./scripts/validate-all-configs.sh

# Test all services
./scripts/health-check-all.sh

# Debug specific issues
./scripts/debug-build-issues.sh
```

## Best Practices

### Development Workflow

1. **Environment Setup**: Use `./scripts/setup-everything.sh` for new developers
2. **Feature Development**: Create feature branches with proper naming
3. **Testing**: Write tests before deploying to staging
4. **Code Review**: Use pull requests for all changes
5. **Deployment**: Use automated deployment scripts

### Configuration Management

1. **Environment Variables**: Use different configs for dev/staging/prod
2. **Secrets Management**: Never commit secrets, use Secret Manager
3. **Dependency Updates**: Regular updates with security patches
4. **Performance Monitoring**: Regular performance audits
5. **Security Audits**: Monthly security reviews

### Infrastructure Maintenance

1. **Regular Backups**: Automated database and file backups
2. **Log Management**: Centralized logging and monitoring
3. **Resource Optimization**: Regular resource usage reviews
4. **Disaster Recovery**: Documented recovery procedures
5. **Capacity Planning**: Regular capacity assessments
