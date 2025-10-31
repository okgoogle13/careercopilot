export const generateKsc = jest.fn().mockResolvedValue({
  kscResponses: [
    {
      criterion: 'Demonstrated expertise in React and TypeScript.',
      response:
        'Mock response: Successfully developed and deployed several large-scale applications using React and TypeScript, improving performance by 20%.',
    },
    {
      criterion: 'Experience with test automation frameworks.',
      response:
        'Mock response: Led the implementation of a comprehensive testing suite using Jest and Playwright, achieving 95% code coverage.',
    },
  ],
});

export const analyzeResume = jest.fn().mockResolvedValue({
  analysisId: 'analysis-mock-123',
  summary: 'This is a mock analysis summary.',
  suggestions: [
    'Add more quantifiable achievements.',
    'Tailor the skills section to the job description.',
  ],
});

// Add other mocked functions from aiServices.ts as needed
export const streamKscResponse = jest.fn();
