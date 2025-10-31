#!/bin/bash

# This script generates the entire test suite for the CareerCopilot frontend.
# It creates all necessary directories, test files, and mock setups.
# Execute this script from the `frontend` directory.

echo "🚀 Starting CareerCopilot Test Suite Generation..."

# --- 1. CREATE DIRECTORY STRUCTURE ---
echo "📁 Creating directory structure..."
mkdir -p tests
mkdir -p src/tests/mocks
mkdir -p src/__mocks__/@/api
mkdir -p src/pages/__tests__
mkdir -p src/components/features/Ksc/__tests__
mkdir -p src/components/ui/Button/__tests__

# --- 2. SETUP MOCK SERVICE WORKER (MSW) FOR E2E/COMPONENT TESTING ---
echo "🌐 Setting up MSW mock server and handlers..."

# Create the MSW server setup
cat <<'EOF' > src/tests/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers);
EOF

# Create the MSW request handlers
cat <<'EOF' > src/tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

const API_BASE_URL = '/api'; // Assuming a proxy is set up for API calls

export const handlers = [
  // Mock for KSC Generation
  http.post(`${API_BASE_URL}/generate-ksc`, async ({ request }) => {
    const body = await request.json();
    if (!body.jobDescription || !body.resumeText || !body.criteria.length) {
      return new HttpResponse(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return HttpResponse.json({
      kscResponses: body.criteria.map((c, index) => ({
        criterion: c.text,
        response: `This is a mock AI-generated response for criterion ${index + 1}. It demonstrates strong skills in alignment with the job description and resume provided.`,
      })),
    });
  }),

  // Mock for User Settings
  http.get(`${API_BASE_URL}/user/settings`, () => {
    return HttpResponse.json({
      userId: 'user-123',
      email: 'test@example.com',
      theme: 'dark',
      notifications: {
        newOpportunities: true,
        analysisComplete: true,
      },
    });
  }),

  // Mock for Opportunities
  http.get(`${API_BASE_URL}/opportunities`, () => {
    return HttpResponse.json([
      { id: 'opp-1', title: 'Senior Frontend Developer', company: 'TechCorp', status: 'Applied' },
      { id: 'opp-2', title: 'Lead Test Automation Engineer', company: 'Innovate LLC', status: 'Interviewing' },
    ]);
  }),

  // Mock for Documents
  http.get(`${API_BASE_URL}/documents`, () => {
    return HttpResponse.json([
        { id: 'doc-1', name: 'Master_Resume_v3.pdf', type: 'resume', uploadedAt: new Date().toISOString() },
        { id: 'doc-2', name: 'Cover_Letter_TechCorp.docx', type: 'cover_letter', uploadedAt: new Date().toISOString() },
    ]);
  }),
];
EOF

# --- 3. UPDATE JEST SETUP AND MOCKS ---
echo "🔧 Configuring Jest setup and manual mocks..."

# Update/Overwrite setupTests.ts to include MSW server setup
cat <<'EOF' > src/setupTests.ts
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// MSW setup for Jest
import { server } from './tests/mocks/server';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

// Mock window.matchMedia for Material-UI components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
EOF

# Update/Overwrite the manual Jest mock for aiServices
cat <<'EOF' > src/__mocks__/@/api/aiServices.ts
export const generateKsc = jest.fn().mockResolvedValue({
  kscResponses: [
    {
      criterion: 'Demonstrated expertise in React and TypeScript.',
      response: 'Mock response: Successfully developed and deployed several large-scale applications using React and TypeScript, improving performance by 20%.',
    },
    {
      criterion: 'Experience with test automation frameworks.',
      response: 'Mock response: Led the implementation of a comprehensive testing suite using Jest and Playwright, achieving 95% code coverage.',
    },
  ],
});

export const analyzeResume = jest.fn().mockResolvedValue({
  analysisId: 'analysis-mock-123',
  summary: 'This is a mock analysis summary.',
  suggestions: ['Add more quantifiable achievements.', 'Tailor the skills section to the job description.'],
});

// Add other mocked functions from aiServices.ts as needed
export const streamKscResponse = jest.fn();
EOF

# --- 4. CREATE JEST UNIT/INTEGRATION TESTS ---
echo "🧪 Generating Jest unit and integration tests..."

# Test for KscGeneratorPage (Priority)
cat <<'EOF' > src/pages/__tests__/KscGeneratorPage.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KscGeneratorPage from '../KscGeneratorPage';
import { generateKsc } from '@/api/aiServices';

// Mock the entire aiServices module
jest.mock('@/api/aiServices');

// Mock child components to isolate the page logic
jest.mock('@/components/features/Documents/ResumeSelector', () => ({
  __esModule: true,
  default: ({ onResumeSelect }) => (
    <div>
      <button onClick={() => onResumeSelect('Mock resume text content.')}>
        Select Mock Resume
      </button>
    </div>
  ),
}));

describe('KscGeneratorPage', () => {
  const mockGenerateKsc = generateKsc as jest.Mock;

  beforeEach(() => {
    // Clear mock history before each test
    mockGenerateKsc.mockClear();
  });

  it('renders the main heading and initial components', () => {
    render(<KscGeneratorPage />);
    expect(screen.getByRole('heading', { name: /KSC Generator/i })).toBeInTheDocument();
    expect(screen.getByText(/Job Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Selection Criteria/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate KSC Responses/i })).toBeDisabled();
  });

  it('enables the generate button only when all required fields are filled', async () => {
    const user = userEvent.setup();
    render(<KscGeneratorPage />);

    const generateButton = screen.getByRole('button', { name: /Generate KSC Responses/i });
    expect(generateButton).toBeDisabled();

    // 1. Fill job description
    await user.type(screen.getByLabelText(/Paste Job Description/i), 'Senior Developer role.');
    expect(generateButton).toBeDisabled();

    // 2. Select a resume
    await user.click(screen.getByRole('button', { name: /Select Mock Resume/i }));
    expect(generateButton).toBeDisabled();

    // 3. Add a criterion
    await user.type(screen.getByLabelText(/Enter a key selection criterion/i), 'Experience with React.');
    await user.click(screen.getByRole('button', { name: /Add Criterion/i }));

    // Now the button should be enabled
    await waitFor(() => {
      expect(generateButton).toBeEnabled();
    });
  });

  it('calls the generateKsc API with correct data on form submission', async () => {
    const user = userEvent.setup();
    render(<KscGeneratorPage />);

    // Fill form
    await user.type(screen.getByLabelText(/Paste Job Description/i), 'Senior Developer role.');
    await user.click(screen.getByRole('button', { name: /Select Mock Resume/i }));
    await user.type(screen.getByLabelText(/Enter a key selection criterion/i), 'Experience with React.');
    await user.click(screen.getByRole('button', { name: /Add Criterion/i }));

    // Submit
    const generateButton = screen.getByRole('button', { name: /Generate KSC Responses/i });
    await user.click(generateButton);

    // Assertions
    expect(mockGenerateKsc).toHaveBeenCalledTimes(1);
    expect(mockGenerateKsc).toHaveBeenCalledWith({
      jobDescription: 'Senior Developer role.',
      resumeText: 'Mock resume text content.',
      criteria: [{ id: expect.any(String), text: 'Experience with React.' }],
    });
  });

  it('displays the generated KSC responses after a successful API call', async () => {
    const user = userEvent.setup();
    render(<KscGeneratorPage />);

    // Fill form and submit
    await user.type(screen.getByLabelText(/Paste Job Description/i), 'Senior Developer role.');
    await user.click(screen.getByRole('button', { name: /Select Mock Resume/i }));
    await user.type(screen.getByLabelText(/Enter a key selection criterion/i), 'Demonstrated expertise in React and TypeScript.');
    await user.click(screen.getByRole('button', { name: /Add Criterion/i }));
    await user.click(screen.getByRole('button', { name: /Generate KSC Responses/i }));

    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText(/Generated Responses/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Successfully developed and deployed/)).toBeInTheDocument();
  });

  it('displays an error message if the API call fails', async () => {
    mockGenerateKsc.mockRejectedValueOnce(new Error('API Error'));
    const user = userEvent.setup();
    render(<KscGeneratorPage />);

    // Fill form and submit
    await user.type(screen.getByLabelText(/Paste Job Description/i), 'Senior Developer role.');
    await user.click(screen.getByRole('button', { name: /Select Mock Resume/i }));
    await user.type(screen.getByLabelText(/Enter a key selection criterion/i), 'Test criterion');
    await user.click(screen.getByRole('button', { name: /Add Criterion/i }));
    await user.click(screen.getByRole('button', { name: /Generate KSC Responses/i }));

    // Wait for error message
    expect(await screen.findByText(/An error occurred while generating responses./i)).toBeInTheDocument();
  });
});
EOF

# Smoke tests for other pages
cat <<'EOF' > src/pages/__tests__/DashboardPage.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardPage from '../DashboardPage';

describe('DashboardPage', () => {
  it('renders the dashboard heading', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /Dashboard/i })).toBeInTheDocument();
  });
});
EOF

cat <<'EOF' > src/pages/__tests__/SettingsPage.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import SettingsPage from '../SettingsPage';

describe('SettingsPage', () => {
  it('renders the settings heading', () => {
    render(<SettingsPage />);
    expect(screen.getByRole('heading', { name: /Settings/i })).toBeInTheDocument();
  });
});
EOF

cat <<'EOF' > src/pages/__tests__/OpportunitiesPage.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import OpportunitiesPage from '../OpportunitiesPage';

describe('OpportunitiesPage', () => {
  it('renders the opportunities heading', () => {
    render(<OpportunitiesPage />);
    expect(screen.getByRole('heading', { name: /Job Opportunities/i })).toBeInTheDocument();
  });
});
EOF

cat <<'EOF' > src/pages/__tests__/DocumentsPage.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import DocumentsPage from '../DocumentsPage';

describe('DocumentsPage', () => {
  it('renders the documents heading', () => {
    render(<DocumentsPage />);
    expect(screen.getByRole('heading', { name: /My Documents/i })).toBeInTheDocument();
  });
});
EOF

cat <<'EOF' > src/pages/__tests__/AnalysisPage.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import AnalysisPage from '../AnalysisPage';

describe('AnalysisPage', () => {
  it('renders the analysis heading', () => {
    render(<AnalysisPage />);
    expect(screen.getByRole('heading', { name: /Analysis Dashboard/i })).toBeInTheDocument();
  });
});
EOF

# Test for a feature component
cat <<'EOF' > src/components/features/Ksc/__tests__/KscCriteriaInput.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// This is a hypothetical component used by KscGeneratorPage
const KscCriteriaInput = ({ onAddCriterion }) => {
  const [value, setValue] = React.useState('');

  const handleAdd = () => {
    if (value.trim()) {
      onAddCriterion(value);
      setValue('');
    }
  };

  return (
    <div>
      <input
        aria-label="Criterion Input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

describe('KscCriteriaInput', () => {
  it('calls onAddCriterion with the input value when add button is clicked', async () => {
    const user = userEvent.setup();
    const handleAddCriterion = jest.fn();
    render(<KscCriteriaInput onAddCriterion={handleAddCriterion} />);

    const input = screen.getByLabelText('Criterion Input');
    const addButton = screen.getByRole('button', { name: /Add/i });

    await user.type(input, 'New criterion text');
    await user.click(addButton);

    expect(handleAddCriterion).toHaveBeenCalledTimes(1);
    expect(handleAddCriterion).toHaveBeenCalledWith('New criterion text');
    expect(input).toHaveValue('');
  });

  it('does not call onAddCriterion if the input is empty', async () => {
    const user = userEvent.setup();
    const handleAddCriterion = jest.fn();
    render(<KscCriteriaInput onAddCriterion={handleAddCriterion} />);

    await user.click(screen.getByRole('button', { name: /Add/i }));

    expect(handleAddCriterion).not.toHaveBeenCalled();
  });
});
EOF

# Test for a UI component
cat <<'EOF' > src/components/ui/Button/__tests__/Button.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@mui/material'; // Assuming MUI Button is the base

describe('Button', () => {
  it('renders with the correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /Click Me/i })).toBeInTheDocument();
  });

  it('calls the onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    await user.click(screen.getByRole('button', { name: /Click Me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is true', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click Me</Button>);

    const button = screen.getByRole('button', { name: /Click Me/i });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
EOF

# --- 5. CREATE PLAYWRIGHT E2E TESTS ---
echo "🎭 Generating Playwright E2E tests..."

# E2E Test for KscGeneratorPage (Priority)
cat <<'EOF' > tests/ksc-generator.spec.js
const { test, expect } = require('@playwright/test');

test.describe('KSC Generator Page E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API endpoint before navigating
    await page.route('/api/generate-ksc', async (route) => {
      const json = {
        kscResponses: [
          {
            criterion: 'Experience with Playwright.',
            response: 'This is an E2E mock response for the Playwright criterion.',
          },
        ],
      };
      await route.fulfill({ json });
    });

    await page.goto('/ksc-generator');
  });

  test('should allow a user to fill the form, generate, and see results', async ({ page }) => {
    // Wait for the main heading to be visible
    await expect(page.getByRole('heading', { name: 'KSC Generator' })).toBeVisible();

    const generateButton = page.getByRole('button', { name: 'Generate KSC Responses' });
    await expect(generateButton).toBeDisabled();

    // 1. Fill in the job description
    await page.getByLabel('Paste Job Description').fill('Test Job Description for Playwright.');

    // 2. Mock resume selection (assuming a button click loads the resume)
    // In a real test, this might involve file upload. Here we simplify.
    await page.getByLabel('Select Resume').selectOption({ label: 'My Main Resume.pdf' });

    // 3. Add a selection criterion
    await page.getByLabel('Enter a key selection criterion').fill('Experience with Playwright.');
    await page.getByRole('button', { name: 'Add Criterion' }).click();
    await expect(page.getByText('Experience with Playwright.')).toBeVisible();

    // 4. Check if the button is now enabled and click it
    await expect(generateButton).toBeEnabled();
    await generateButton.click();

    // 5. Assert that the results are displayed
    await expect(page.getByRole('heading', { name: 'Generated Responses' })).toBeVisible();
    await expect(page.getByText('This is an E2E mock response for the Playwright criterion.')).toBeVisible();
  });

  test('should show a validation error if a field is missing', async ({ page }) => {
    // Only fill one field
    await page.getByLabel('Paste Job Description').fill('Test Job Description.');

    // Try to add an empty criterion
    await page.getByRole('button', { name: 'Add Criterion' }).click();

    // Assert that no criterion was added and the generate button is still disabled
    await expect(page.locator('.criterion-list-item')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Generate KSC Responses' })).toBeDisabled();
  });
});
EOF

# Placeholder E2E tests for other pages
cat <<'EOF' > tests/dashboard.spec.js
const { test, expect } = require('@playwright/test');

test('Dashboard Page should load correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByText('Welcome back, user!')).toBeVisible(); // Example text
});
EOF

cat <<'EOF' > tests/settings.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the settings API endpoint
    await page.route('/api/user/settings', async (route) => {
      const json = {
        userId: 'user-123',
        email: 'test@example.com',
        theme: 'dark',
        notifications: { newOpportunities: true, analysisComplete: false },
      };
      await route.fulfill({ json });
    });
    await page.goto('/settings');
  });

  test('should display user settings correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByLabel('Email')).toHaveValue('test@example.com');
    await expect(page.getByLabel('Theme')).toHaveValue('dark');
    await expect(page.getByLabel('New Opportunity Notifications')).toBeChecked();
    await expect(page.getByLabel('Analysis Complete Notifications')).not.toBeChecked();
  });
});
EOF

echo "✅ Test suite generation complete!"
echo "You can now run your tests:"
echo "  - For Jest: yarn test"
echo "  - For Playwright: yarn playwright test"
