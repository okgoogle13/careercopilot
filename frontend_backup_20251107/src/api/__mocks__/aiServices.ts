// Mock implementation of AI services for testing
import { jest } from '@jest/globals';

export const generateKSC = jest.fn(() => Promise.resolve({ ksc: 'Generated KSC' }));
export const generateResume = jest.fn(() => Promise.resolve({ resume: 'Generated Resume' }));

export default {
  generateCoverLetter,
  generateTailoredResume,
};
