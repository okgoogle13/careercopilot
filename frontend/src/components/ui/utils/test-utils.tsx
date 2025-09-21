import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Create a theme instance for testing
const theme = createTheme({
  // Add your theme configuration here
  palette: {
    mode: 'light',
  },
});

// Mock the AI services module
export const mockAiServices = {
  generateCoverLetter: jest.fn(),
  generateTailoredResume: jest.fn(),
  generateKscResponses: jest.fn(),
  generateSingleKscResponse: jest.fn(),
  detectKscCriteria: jest.fn(),
};

// Mock all AI services before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Custom render function that wraps components with MUI providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Common test data
export const mockJobDescription = `
Software Engineer - Frontend
Company: Tech Corp
Location: Remote

We are looking for a skilled Frontend Developer with experience in React, TypeScript, and modern web technologies.

Requirements:
- 3+ years of React experience
- TypeScript proficiency
- Experience with testing frameworks
- Strong communication skills
`;

export const mockGeneratedCoverLetter = `
Dear Hiring Manager,

I am excited to apply for the Frontend Developer position at Tech Corp. With over 3 years of experience in React and TypeScript, I am confident I would be a valuable addition to your team.

My expertise includes:
- Building scalable React applications
- Writing type-safe code with TypeScript
- Implementing comprehensive test suites

I look forward to discussing how I can contribute to your team.

Best regards,
[Your Name]
`;

export const mockGeneratedResume = `
John Doe
Frontend Developer

EXPERIENCE
- Senior Frontend Developer at Previous Company (2021-2024)
  * Built React applications using TypeScript
  * Implemented testing strategies with Jest and React Testing Library
  * Collaborated with cross-functional teams

SKILLS
- React, TypeScript, JavaScript
- Testing (Jest, React Testing Library)
- Modern CSS and Styling
`;

export const mockJob = {
  id: 'job-1',
  jobTitle: 'Frontend Developer',
  company: 'Tech Corp',
  location: 'Remote',
  applicationUrl: 'https://example.com/apply',
  requirements: ['React', 'TypeScript', 'Testing'],
};
