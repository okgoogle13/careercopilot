# Testing & Test Automation Strategy

## Current Test Coverage

**Last Updated:** 2025-11-14

| Layer                       | Current Coverage                    | Target | Status               |
| --------------------------- | ----------------------------------- | ------ | -------------------- |
| **Frontend Components**     | 17% (22/128 components tested)      | 50%    | 🟡 Needs Improvement |
| **Backend APIs**            | 85% (comprehensive pytest coverage) | 95%    | 🟢 Good              |
| **E2E Flows**               | 90% (7 Playwright tests, 722 lines) | 95%    | 🟢 Good              |
| **Storybook Documentation** | 2.3% (3/128 components)             | 40%    | 🔴 Critical          |

## Testing Skills & Tools

### Jest Test Scaffolder (`jest-test-scaffolder`)

**Purpose:** Generate React component and hook tests with auto-detected props

**Capabilities:**

- Generate component tests using `@testing-library/react` + `userEvent` patterns
- Auto-detect component props and generate test cases
- Include edge case coverage and accessibility tests
- Templates: `component.test.tsx.tpl`, `hook.test.tsx.tpl`

**Usage:**

```bash
"Use jest-test-scaffolder to create tests for Button component"
"Generate hook tests for useUserData hook"
```

### API Integration Test Scaffolder (`api-integration-test-scaffolder`)

**Purpose:** Generate backend integration tests with comprehensive scenarios

**Capabilities:**

- Generate tests for success, validation, auth, and error scenarios
- Mock Firebase Auth and Genkit flows
- Include performance assertions and load testing
- Database transaction testing

**Usage:**

```bash
"Use api-integration-test-scaffolder to create tests for user endpoints"
"Generate integration tests for notification system"
```

### Storybook Scaffolder (`storybook-scaffolder`)

**Purpose:** Generate `.stories.tsx` files with variant stories and interaction tests

**Capabilities:**

- Auto-extract component names and props
- Generate variant stories for different states
- Include interaction tests and accessibility checks
- Auto-generate controls and documentation

**Usage:**

```bash
"Use storybook-scaffolder to create stories for Card component"
"Generate interaction tests for Form components"
```

### Webapp Testing (`webapp-testing`)

**Purpose:** Generate Playwright E2E tests for user journeys

**Capabilities:**

- Generate end-to-end tests for critical user flows
- Include mobile and desktop variants
- Performance and accessibility testing
- Visual regression testing

**Reference:** `.claude/skills/webapp-testing/REFERENCE/careercopilot-selectors.md`

**Usage:**

```bash
"Use webapp-testing to create E2E tests for user registration flow"
"Generate Playwright tests for job search functionality"
```

### Testing Specialist Subagent (`testing-specialist`)

**Purpose:** Orchestrate test generation for all layers with coverage analysis

**Capabilities:**

- Coordinates test generation across frontend, backend, and E2E
- Integrates with fullstack-integration-specialist for API testing
- Provides coverage analysis and gap identification
- Manages test suite optimization and maintenance

**Integration:**

- Works with `test-runner` for execution
- Collaborates with `code-reviewer` for quality assurance
- Uses `frontend-backend-mapper` for integration testing

## Test Commands Reference

### Frontend Testing (Jest)

```bash
# Run all tests
yarn test

# Watch mode for development
yarn test:watch

# Generate coverage report
yarn test:coverage

# Run specific test file
yarn test Button.test.tsx

# Run tests in CI mode
yarn test:ci
```

### Backend Testing (pytest)

```bash
# Run all backend tests
pytest backend/app/tests/

# Run with coverage
pytest backend/app/tests/ --cov

# Run specific test module
pytest backend/app/tests/test_auth.py

# Run with verbose output
pytest backend/app/tests/ -v

# Run performance tests
pytest backend/app/tests/performance/ --benchmark-only
```

### E2E Testing (Playwright)

```bash
# Run all E2E tests
yarn test:e2e

# Run with browser UI (headed mode)
yarn test:e2e:headed

# Run specific test file
yarn test:e2e user-registration.spec.ts

# Run on specific browser
yarn test:e2e --project=chromium

# Generate HTML report
yarn test:e2e --reporter=html
```

### Storybook Testing

```bash
# Start Storybook development server
yarn storybook

# Build Storybook for production
yarn build-storybook

# Run Storybook tests
yarn test:storybook

# Run accessibility tests
yarn test:a11y
```

## Test Organization

### Directory Structure

```
frontend/
├── src/
│   ├── __tests__/
│   │   ├── components/     # Component tests
│   │   ├── hooks/          # Hook tests
│   │   ├── utils/          # Utility tests
│   │   └── integration/    # Integration tests
│   └── stories/            # Storybook stories
backend/
├── app/
│   └── tests/
│       ├── unit/           # Unit tests
│       ├── integration/    # API integration tests
│       ├── e2e/           # End-to-end tests
│       └── performance/    # Performance tests
tests/
├── e2e/                   # Playwright E2E tests
└── fixtures/              # Test data and mocks
```

### Test Naming Conventions

**Component Tests:** `ComponentName.test.tsx`
**Hook Tests:** `useHookName.test.tsx`
**API Tests:** `test_endpoint_name.py`
**E2E Tests:** `user-journey.spec.ts`

## Coverage Strategy

### Frontend Coverage Goals

**Priority Components (High Impact):**

1. Authentication components (Login, Register, Profile)
2. Core UI components (Button, Card, Form, Modal)
3. Business logic components (JobCard, SearchResults, Dashboard)
4. Navigation components (Header, Sidebar, Breadcrumb)

**Coverage Targets:**

- **Critical Path Components:** 90%+
- **UI Components:** 80%+
- **Utility Functions:** 95%+

### Backend Coverage Goals

**Priority Areas:**

1. Authentication and authorization
2. Core business logic (job matching, recommendations)
3. Database operations and transactions
4. External API integrations

**Coverage Targets:**

- **API Endpoints:** 95%+
- **Business Logic:** 90%+
- **Database Operations:** 85%+

### E2E Coverage Goals

**Critical User Journeys:**

1. User registration and login
2. Job search and application
3. Profile management
4. Email notifications
5. Admin dashboard operations

**Coverage Targets:**

- **Critical Paths:** 100%
- **Secondary Flows:** 80%+
- **Edge Cases:** 60%+

## Test Data Management

### Fixtures and Mocks

**Frontend Fixtures:**

```typescript
// __tests__/fixtures/user.ts
export const mockUser = {
  id: "test-user-123",
  email: "test@example.com",
  name: "Test User",
};
```

**Backend Fixtures:**

```python
# tests/fixtures/user_data.py
TEST_USER = {
    "id": "test-user-123",
    "email": "test@example.com",
    "name": "Test User"
}
```

### Database State Management

**Test Database Setup:**

- Use separate test database
- Clean state between tests
- Seed with consistent test data
- Rollback transactions after tests

## Continuous Integration

### GitHub Actions Integration

**Test Pipeline:**

1. **Linting and Formatting** - Fast feedback
2. **Unit Tests** - Frontend and backend
3. **Integration Tests** - API contracts
4. **E2E Tests** - Critical user journeys
5. **Coverage Reports** - Quality gates

**Quality Gates:**

- Frontend coverage > 50%
- Backend coverage > 85%
- All critical tests must pass
- No security vulnerabilities

### Performance Testing

**Frontend Performance:**

- Bundle size analysis
- Lighthouse CI integration
- Component render performance
- Memory leak detection

**Backend Performance:**

- API response time benchmarks
- Database query optimization
- Load testing for critical endpoints
- Memory and CPU usage monitoring

## Troubleshooting

### Common Issues

**Flaky Tests:**

- Identify race conditions
- Improve test isolation
- Add proper waits and timeouts
- Use deterministic test data

**Slow Tests:**

- Optimize database operations
- Use test doubles for external services
- Parallelize test execution
- Implement test caching

**Coverage Gaps:**

- Identify untested code paths
- Prioritize critical business logic
- Use mutation testing for quality
- Automate coverage reporting

### Debug Commands

```bash
# Debug specific test
yarn test --testNamePattern="should render button"

# Debug with VS Code
yarn test --runInBand

# Check test coverage for specific file
yarn test:coverage -- Button.tsx

# Run tests with verbose output
pytest backend/app/tests/ -v -s
```

## Best Practices

### Test Writing Guidelines

1. **Arrange, Act, Assert** pattern
2. **Descriptive test names** that explain the behavior
3. **One assertion per test** when possible
4. **Test edge cases** and error conditions
5. **Use test doubles** for external dependencies
6. **Keep tests fast** and reliable
7. **Maintain test independence**

### Mock Strategy

1. **Mock external services** (APIs, databases)
2. **Use contract tests** for integrations
3. **Keep mocks consistent** with real behavior
4. **Document mock behavior** clearly
5. **Update mocks with API changes**

### Code Review Guidelines

1. **Review test coverage** for new features
2. **Check test quality** and maintainability
3. **Verify test isolation** and independence
4. **Ensure performance** test inclusion
5. **Validate accessibility** test coverage

## Future Enhancements

### Planned Improvements

1. **Visual Regression Testing** - Automated UI comparison
2. **Contract Testing** - API contract validation
3. **Mutation Testing** - Test quality assessment
4. **Performance Benchmarking** - Automated performance tracking
5. **Test Analytics** - Coverage and quality metrics

### Tool Upgrades

1. **Jest 29+** - Latest features and performance
2. **Playwright** - Enhanced E2E capabilities
3. **Vitest** - Faster unit test execution
4. **Storybook** - Improved testing integration
5. **Coverage Tools** - Advanced reporting and analysis
