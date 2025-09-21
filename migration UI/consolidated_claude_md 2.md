# CareerCopilot Developer Guide

## Overview
CareerCopilot is an AI-powered career application assistant built with React, MUI, Firebase, and Google Cloud Platform. This guide covers MUI migration, Genkit AI integration, and development workflows.

## MUI Migration & Genkit Integration Plan

### Phase 0: Strategy & Acceptance Criteria

#### Acceptance Criteria
• **Performance**: Lighthouse scores ≥90 (Performance, Accessibility)
• **API SLOs**: Error rate <0.1%, p95 latency <500ms
• **Feature Flags**: All new features deployed behind feature flags
• **Bundle Budget**: Size increase <10%, LCP <2.5s

#### Rollback Plan
• **Target**: <15 minutes to redeploy previous stable version
• **Procedure**: Document merge revert and stable version redeployment
• **Monitoring**: Real-time SLO tracking for immediate rollback triggers

### Phase 1: Preparation

#### Task 1.1: Dependency Audit
```bash
# Add MUI and AI packages
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled zod

# Security audit and patching
npm audit
npm audit fix --audit-level critical
```

#### Task 1.2: Technical Strategy
• **Feature Flags**: Implement for all UI/AI features
• **Secrets Management**: API keys via environment variables only
• **Performance Budget**: Monitor bundle size and Core Web Vitals

### Phase 2: Development

#### Task 2.1: MUI Theme Implementation
```typescript
// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';
import { colors } from '../styles/colors';

export const theme = createTheme({
  palette: {
    primary: { main: colors.primary },
    secondary: { main: colors.secondary },
    background: { 
      default: colors.background.primary,
      paper: colors.background.secondary 
    }
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700 },
    body1: { fontSize: '1rem', lineHeight: 1.5 }
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none' }
      }
    }
  }
});
```

#### Task 2.2: Genkit Flow Implementation
```typescript
// src/flows/mainFlow.ts
import { defineFlow } from '@genkit-ai/flow';
import { z } from 'zod';

const ChatInputSchema = z.object({
  message: z.string().min(1).max(1000),
  context: z.object({
    userId: z.string(),
    sessionId: z.string()
  })
});

const ChatOutputSchema = z.object({
  response: z.string(),
  confidence: z.number().min(0).max(1),
  suggestions: z.array(z.string()).optional()
});

export const mainFlow = defineFlow({
  name: 'chat',
  inputSchema: ChatInputSchema,
  outputSchema: ChatOutputSchema,
  authPolicy: 'required'
}, async (input) => {
  // AI processing logic
  return {
    response: "Generated response",
    confidence: 0.95,
    suggestions: ["Follow-up suggestion"]
  };
});
```

#### Task 2.3: Component Migration
```typescript
// src/App.tsx
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import { useFeatureFlag } from './hooks/useFeatureFlag';

function App() {
  const isMuiEnabled = useFeatureFlag('mui-migration');
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isMuiEnabled ? <NewMuiApp /> : <LegacyApp />}
    </ThemeProvider>
  );
}
```

#### Task 2.4: UI State Management
```typescript
// src/components/ChatInput.tsx
import { CircularProgress, Alert, Box } from '@mui/material';

const ChatStates = {
  Empty: () => <Box>Start a conversation...</Box>,
  Loading: () => <CircularProgress size={24} />,
  Success: ({ data }) => <Box>{data.response}</Box>,
  Error: ({ error }) => <Alert severity="error">{error.message}</Alert>
};
```

### Phase 3: Quality Assurance

#### Task 3.1: Code Quality
```bash
# Format and lint all changed files
eslint --fix src/**/*.{ts,tsx}
prettier --write src/**/*.{ts,tsx}

# Type checking
tsc --noEmit
```

#### Task 3.2: Test Suite Updates
```typescript
// Component tests with MUI theme
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '../theme/theme';

const renderWithTheme = (component) => 
  render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);

// E2E tests for AI chat flow
describe('AI Chat Flow', () => {
  it('completes full conversation workflow', () => {
    cy.visit('/chat');
    cy.get('[data-testid="chat-input"]').type('Hello AI');
    cy.get('[data-testid="send-button"]').click();
    cy.get('[data-testid="chat-response"]').should('be.visible');
  });
});
```

#### Task 3.3: Accessibility Audit
```bash
# Automated accessibility testing
npm run a11y-test

# Manual checks
# - Keyboard navigation
# - Screen reader compatibility
# - WCAG 2.1 AA compliance
```

### Phase 4: CI/CD Pipeline Updates

```yaml
# .github/workflows/ci.yml additions
- name: Lint
  run: npm run lint

- name: Security Audit
  run: npm audit --audit-level critical

- name: Performance Budget Check
  run: npm run build && npm run analyze-bundle

- name: Accessibility Tests
  run: npm run a11y-test
```

### Phase 5: Release & Monitoring

#### Phased Rollout Strategy
• **Stage 1**: Deploy with feature flag OFF
• **Stage 2**: Enable for internal users (testing)
• **Stage 3**: Canary release (1% → 10% → 100%)
• **Stage 4**: Full rollout with monitoring

## AI Architecture & Integration

### Core AI Stack
• **Primary AI**: Google Genkit AI framework
• **Models**: Gemini 1.5 Flash (fast tasks), Gemini 1.5 Pro (complex analysis)
• **Document Processing**: Langextract for resume parsing
• **Vector Storage**: Firestore/JSON for RAG implementation
• **External AI**: Claude integration for enhanced analysis

### AI Agent System
All agents implemented as Genkit workflows in `/src/backend/agents/`:

#### Primary Agents
• **Document Generation** (`document_generator.py`) - Tailored resumes and cover letters
• **ATS Optimization** (`ats_optimizer.py`) - ATS compatibility optimization
• **Resume Parsing** (`resume_parser.py`) - Structured data extraction
• **Job Matching** (`job_matcher.py`) - Profile-job matching with RAG
• **Company Research** - Multi-source intelligence gathering

### Claude vs Gemini Usage

#### Use Claude for:
• Complex reasoning requiring multi-step analysis
• Creative writing for cover letters and personal statements
• Code review and debugging of AI workflows
• Strategic planning and architecture decisions
• User feedback analysis and product improvements

#### Use Gemini for:
• Document generation at scale
• ATS optimization and keyword matching
• Resume parsing and data extraction
• Real-time interactions requiring low latency
• Cost-sensitive operations with high volume

### AI Service Integration Patterns

#### Analysis and Feedback
```python
async def analyze_application_strategy(user_profile, job_market_data):
    analysis_prompt = f"""
    Analyze career transition strategy:
    Profile: {user_profile}
    Market: {job_market_data}
    
    Provide:
    • Strengths and gaps analysis
    • Skill development priorities
    • Application strategy recommendations
    • Career transition timeline
    """
    return await claude_completion(analysis_prompt)
```

#### Quality Assurance
```python
async def review_generated_document(document_content, job_description):
    review_prompt = f"""
    Review AI-generated resume:
    Resume: {document_content}
    Job: {job_description}
    
    Evaluate:
    • Job requirements relevance
    • Professional tone and clarity
    • ATS compatibility concerns
    • Improvement suggestions
    """
    return await claude_completion(review_prompt)
```

## Configuration Management

### Environment Setup
```bash
# Production secrets setup
python3 scripts/setup-production-secrets.py

# Local development setup
./setup-api-keys.sh

# Genkit verification
ENABLE_GENKIT_FLOWS=true python3 verify_genkit.py
```

### Key Configuration Files
• `.env.local` - Local development variables (not committed)
• `backend/app/core/config.py` - Centralized configuration
• `backend/app/core/genkit_init.py` - Genkit initialization
• `src/theme/theme.ts` - MUI theme configuration

### AI Service Configuration
```typescript
// Cost-conscious AI usage strategy
const AI_USAGE_STRATEGY = {
  document_generation: 'gemini_flash',  // High volume, low cost
  ats_optimization: 'gemini_flash',     // Standard processing
  complex_analysis: 'claude',           // High value, low frequency
  research_synthesis: 'gemini_pro',     // Balanced performance/cost
  quality_review: 'claude'              // Critical quality tasks
};
```

## Development Workflow

### Frontend Development
```bash
# Development server
yarn dev

# Build and analyze
yarn build
yarn preview

# Linting and formatting
yarn lint
yarn lint:fix
```

### Backend Development
```bash
# Activate Python environment
source venv/bin/activate

# Run backend server
python -m uvicorn app.main:app --reload

# Test AI flows
python -m pytest app/tests/
```

### Full Stack Testing
```bash
# Frontend tests
yarn test
yarn test:coverage

# Backend tests
pytest backend/app/tests/ --cov

# E2E tests
npx playwright test
```

## Deployment Pipeline

### Deployment Commands
```bash
# Staging deployment
./scripts/deploy.sh staging

# Production deployment
./scripts/deploy.sh production

# Frontend only
./scripts/deploy.sh frontend

# Functions only
./scripts/deploy.sh functions
```

### Environment URLs
• **Staging**: https://careercopilot-staging.web.app
• **Production**: https://careercopilot-468811.web.app

### Infrastructure Configuration
• **Primary Region**: `us-central1` (consistent across services)
• **Firebase Functions**: `us-central1`
• **Cloud Run Backend**: `us-central1`
• **Firestore Database**: `us-central1`

## Testing Strategy

### Test Coverage
• **Frontend**: Component rendering, user interactions, MUI theme integration
• **Backend**: AI flow logic, model mocking, output validation
• **Integration**: API endpoints, request/response validation
• **E2E**: Complete user workflows, accessibility, responsive design

### Performance Testing
• **Bundle Analysis**: `./scripts/vite-bundle-analyzer.sh`
• **Lighthouse Audits**: Automated performance scoring
• **API Load Testing**: SLO validation under load

## Monitoring & Quality Gates

### Performance Metrics
• **Lighthouse Scores**: Performance, Accessibility, Best Practices ≥90
• **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
• **API Performance**: Error rate <0.1%, p95 latency <500ms

### Quality Assurance
• **Code Quality**: ESLint, Prettier, TypeScript strict mode
• **Security**: npm audit, CodeQL analysis
• **Accessibility**: axe automated testing, manual keyboard/screen reader checks

## Troubleshooting

### Common Issues
• **MUI Theme**: Check ThemeProvider wrapping and theme imports
• **Genkit Flows**: Verify GEMINI_API_KEY and flow registration
• **Build Failures**: Check TypeScript errors and dependency compatibility
• **Performance**: Analyze bundle size and lazy loading implementation

### Debug Commands
```bash
# Check configuration
python3 scripts/test-configuration.py

# Validate Firebase setup
python3 scripts/firebase-config-validator.py

# Test AI integration
ENABLE_GENKIT_FLOWS=true python3 verify_genkit.py
```

---

**Note**: This guide should be updated as features evolve. Always test thoroughly before deployment, especially AI components handling user data.