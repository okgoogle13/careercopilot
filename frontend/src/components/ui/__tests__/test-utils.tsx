import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

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

// Custom render function that can be extended with providers if needed
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options });

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
