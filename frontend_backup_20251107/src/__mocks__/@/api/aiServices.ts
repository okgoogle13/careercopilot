import { jest } from '@jest/globals';

// Types
export interface KSCResponse {
  criterion: string;
  response: string;
}

export interface GenerateCoverLetterResponse {
  kscResponses: KSCResponse[];
  coverLetter: string;
  suggestions: string[];
}

export interface ResumeAnalysis {
  analysisId: string;
  summary: string;
  suggestions: string[];
  strengths: string[];
  areasForImprovement: string[];
  skills: string[];
  experience: string[];
  education: string[];
}

// Mock implementations
export const generateCoverLetter = jest.fn(
  async (): Promise<GenerateCoverLetterResponse> => ({
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
    coverLetter: 'Mock generated cover letter content...',
    suggestions: [
      'Add more quantifiable achievements.',
      'Tailor the skills section to the job description.',
    ],
  })
);

export const analyzeResume = jest.fn(
  async (): Promise<ResumeAnalysis> => ({
    analysisId: 'analysis-mock-123',
    summary: 'This is a mock analysis summary.',
    suggestions: [
      'Add more quantifiable achievements.',
      'Tailor the skills section to the job description.',
    ],
    strengths: [
      'Strong technical skills in React and TypeScript',
      'Good project management experience',
    ],
    areasForImprovement: [
      'Could include more metrics in work experience',
      'Consider adding a skills proficiency section',
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    experience: ['5+ years of frontend development'],
    education: ['Bachelor of Science in Computer Science'],
  })
);

// Mock other AI services
export const generateTailoredResume = jest.fn().mockResolvedValue({
  success: true,
  message: 'Resume tailored successfully',
  downloadUrl: '/mock-download/resume.pdf',
});

export const generateCustomSection = jest.fn().mockResolvedValue({
  success: true,
  content: 'Mock generated custom section content...',
  suggestions: ['Consider adding more details about your leadership experience'],
});

// Add other mocked functions from aiServices.ts as needed
export const streamKscResponse = jest.fn();
