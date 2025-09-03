import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../utils/test-utils';
import { AIServicesPage } from '../../../pages/AIServicesPage';
import { JobMatchingComponent } from '../JobMatchingComponent';
import { ContentOptimizationComponent } from '../ContentOptimizationComponent';
import { apiClient } from '../../../utils/apiClient';
import { mockJobMatchingResult, mockContentOptimizationResult } from '../../../utils/mockData';

// Mock the API client
jest.mock('../../../utils/apiClient');
const mockedApiClient = jest.mocked(apiClient);

// Mock toast notifications
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
}));

describe('AI Services Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Full AI Services Page Flow', () => {
    it('should navigate between different AI services', async () => {
      render(<AIServicesPage />);

      // Should start with overview
      expect(screen.getByText('AI-Powered Career Services')).toBeInTheDocument();
      expect(screen.getByText(/leverage advanced ai technology/i)).toBeInTheDocument();

      // Navigate to Job Matching
      const jobMatchingTab = screen.getByRole('tab', { name: /job matching/i });
      fireEvent.click(jobMatchingTab);

      expect(screen.getByText('AI-Powered Job Matching')).toBeInTheDocument();
      expect(screen.getByText('Job Preferences')).toBeInTheDocument();

      // Navigate to Content Optimization
      const optimizationTab = screen.getByRole('tab', { name: /optimization/i });
      fireEvent.click(optimizationTab);

      expect(screen.getByText('AI Content Optimization')).toBeInTheDocument();
      expect(screen.getByText('Optimization Settings')).toBeInTheDocument();

      // Navigate to Resume Intelligence
      const intelligenceTab = screen.getByRole('tab', { name: /intelligence/i });
      fireEvent.click(intelligenceTab);

      expect(screen.getByText('Resume Intelligence Analysis')).toBeInTheDocument();

      // Navigate to Cover Letters
      const coverLetterTab = screen.getByRole('tab', { name: /cover letters/i });
      fireEvent.click(coverLetterTab);

      expect(screen.getByText('AI Cover Letter Generator')).toBeInTheDocument();
    });

    it('should handle service card clicks to navigate', async () => {
      render(<AIServicesPage />);

      // Click on job matching service card
      const jobMatchingCard = screen.getByText('AI Job Matching').closest('[role="button"]');
      if (jobMatchingCard) {
        fireEvent.click(jobMatchingCard);
      }

      expect(screen.getByText('AI-Powered Job Matching')).toBeInTheDocument();
    });
  });

  describe('End-to-End Job Matching Flow', () => {
    it('should complete a full job matching workflow', async () => {
      mockedApiClient.post.mockResolvedValue(mockJobMatchingResult);

      render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

      // Fill in job preferences
      const jobTypeSelect = screen.getByLabelText(/job type/i);
      fireEvent.change(jobTypeSelect, { target: { value: 'full-time' } });

      const experienceSelect = screen.getByLabelText(/experience level/i);
      fireEvent.change(experienceSelect, { target: { value: 'senior-level' } });

      const locationInput = screen.getByLabelText(/location preference/i);
      fireEvent.change(locationInput, { target: { value: 'San Francisco, CA' } });

      const salaryMinInput = screen.getByLabelText(/min salary/i);
      fireEvent.change(salaryMinInput, { target: { value: '120000' } });

      const salaryMaxInput = screen.getByLabelText(/max salary/i);
      fireEvent.change(salaryMaxInput, { target: { value: '180000' } });

      // Submit job matching request
      const submitButton = screen.getByRole('button', { name: /find job matches/i });
      fireEvent.click(submitButton);

      // Wait for API call to complete
      await waitFor(() => {
        expect(mockedApiClient.post).toHaveBeenCalledWith('/ai-career/job-matching', {
          document_id: 'test-resume-123',
          preferences: {
            job_type: 'full-time',
            experience_level: 'senior-level',
            location_preference: 'San Francisco, CA',
            salary_range: {
              min: 120000,
              max: 180000
            }
          }
        });
      });

      // Verify results are displayed
      await waitFor(() => {
        expect(screen.getByText('Analysis Summary')).toBeInTheDocument();
        expect(screen.getByText('Senior Frontend Developer')).toBeInTheDocument();
        expect(screen.getByText('Full Stack Engineer')).toBeInTheDocument();
        expect(screen.getByText('Tech Lead - Frontend')).toBeInTheDocument();
      });

      // Check analysis metrics
      expect(screen.getByText('247')).toBeInTheDocument(); // jobs analyzed
      expect(screen.getByText('74.3%')).toBeInTheDocument(); // avg match score
      expect(screen.getByText('3')).toBeInTheDocument(); // matches found

      // Verify skills are displayed
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('GraphQL')).toBeInTheDocument();

      // Test job interaction
      const viewDetailsButtons = screen.getAllByText('View Details');
      expect(viewDetailsButtons).toHaveLength(3);

      const applyButtons = screen.getAllByText('Apply Now');
      expect(applyButtons).toHaveLength(3);
    });

    it('should handle job matching API errors', async () => {
      mockedApiClient.post.mockRejectedValue(new Error('API Error: Rate limit exceeded'));

      render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

      const submitButton = screen.getByRole('button', { name: /find job matches/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedApiClient.post).toHaveBeenCalled();
      });

      // Should not display results on error
      expect(screen.queryByText('Analysis Summary')).not.toBeInTheDocument();
    });
  });

  describe('End-to-End Content Optimization Flow', () => {
    it('should complete a full content optimization workflow', async () => {
      mockedApiClient.post.mockResolvedValue(mockContentOptimizationResult);

      render(<ContentOptimizationComponent contentType="resume" />);

      // Fill in content and settings
      const contentTextarea = screen.getByPlaceholderText(/paste your resume, cover letter/i);
      const resumeContent = 'John Doe\nSoftware Engineer\nExperienced developer with React skills...';
      fireEvent.change(contentTextarea, { target: { value: resumeContent } });

      const targetRoleInput = screen.getByLabelText(/target role/i);
      fireEvent.change(targetRoleInput, { target: { value: 'Senior Software Engineer' } });

      const targetCompanyInput = screen.getByLabelText(/target company/i);
      fireEvent.change(targetCompanyInput, { target: { value: 'Google' } });

      // Select optimization goals
      const atsCheckbox = screen.getByRole('checkbox', { name: /ats optimization/i });
      const keywordCheckbox = screen.getByRole('checkbox', { name: /keyword enhancement/i });
      const readabilityCheckbox = screen.getByRole('checkbox', { name: /readability improvement/i });

      expect(atsCheckbox).toBeChecked(); // should be checked by default
      expect(keywordCheckbox).toBeChecked(); // should be checked by default

      fireEvent.click(readabilityCheckbox); // add readability

      // Submit optimization request
      const optimizeButton = screen.getByRole('button', { name: /optimize content/i });
      fireEvent.click(optimizeButton);

      // Wait for API call
      await waitFor(() => {
        expect(mockedApiClient.post).toHaveBeenCalledWith('/ai-career/content-optimization', {
          content: resumeContent,
          content_type: 'resume',
          target_role: 'Senior Software Engineer',
          target_company: 'Google',
          target_industry: undefined,
          optimization_goals: ['ats_optimization', 'keyword_enhancement', 'readability']
        });
      });

      // Should automatically switch to results tab
      await waitFor(() => {
        const resultsTab = screen.getByRole('tab', { name: /optimized content/i });
        expect(resultsTab).toHaveAttribute('data-state', 'active');
      });

      // Verify optimized content is displayed
      expect(screen.getByText('Optimized Content')).toBeInTheDocument();
      expect(screen.getByText(/John Doe\nSenior Software Engineer/)).toBeInTheDocument();

      // Check copy and download buttons
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();

      // Switch to analysis tab
      const analysisTab = screen.getByRole('tab', { name: /analysis & metrics/i });
      fireEvent.click(analysisTab);

      // Verify metrics are displayed
      expect(screen.getByText('Content Metrics')).toBeInTheDocument();
      expect(screen.getByText('89%')).toBeInTheDocument(); // readability
      expect(screen.getByText('94%')).toBeInTheDocument(); // ats score
      expect(screen.getByText('92%')).toBeInTheDocument(); // impact score

      // Check keyword density section
      expect(screen.getByText('Keyword Density')).toBeInTheDocument();
      expect(screen.getByText('react')).toBeInTheDocument();
      expect(screen.getByText('node.js')).toBeInTheDocument();
    });

    it('should validate required fields before submission', async () => {
      render(<ContentOptimizationComponent />);

      // Try to submit without content
      const optimizeButton = screen.getByRole('button', { name: /optimize content/i });
      fireEvent.click(optimizeButton);

      // Should not make API call
      expect(mockedApiClient.post).not.toHaveBeenCalled();

      // Add content and try again
      const contentTextarea = screen.getByPlaceholderText(/paste your resume, cover letter/i);
      fireEvent.change(contentTextarea, { target: { value: 'Test content' } });

      fireEvent.click(optimizeButton);

      // Should make API call now
      await waitFor(() => {
        expect(mockedApiClient.post).toHaveBeenCalled();
      });
    });
  });

  describe('API Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      mockedApiClient.post.mockRejectedValue(new Error('Network Error'));

      render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

      const submitButton = screen.getByRole('button', { name: /find job matches/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedApiClient.post).toHaveBeenCalled();
      });

      // Component should handle error without crashing
      expect(screen.getByText('AI-Powered Job Matching')).toBeInTheDocument();
      expect(screen.queryByText('Analysis Summary')).not.toBeInTheDocument();
    });

    it('should handle API timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      mockedApiClient.post.mockRejectedValue(timeoutError);

      render(<ContentOptimizationComponent />);

      const contentTextarea = screen.getByPlaceholderText(/paste your resume, cover letter/i);
      fireEvent.change(contentTextarea, { target: { value: 'Test content' } });

      const optimizeButton = screen.getByRole('button', { name: /optimize content/i });
      fireEvent.click(optimizeButton);

      await waitFor(() => {
        expect(mockedApiClient.post).toHaveBeenCalled();
      });

      // Should handle timeout gracefully
      expect(screen.getByText('AI Content Optimization')).toBeInTheDocument();
    });

    it('should handle invalid response format', async () => {
      mockedApiClient.post.mockResolvedValue({ invalid: 'response' });

      render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

      const submitButton = screen.getByRole('button', { name: /find job matches/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedApiClient.post).toHaveBeenCalled();
      });

      // Should handle invalid response without crashing
      expect(screen.getByText('AI-Powered Job Matching')).toBeInTheDocument();
    });
  });

  describe('Component State Management', () => {
    it('should maintain form state during API calls', async () => {
      // Mock slow API response
      mockedApiClient.post.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockJobMatchingResult), 1000))
      );

      render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

      // Fill in form
      const jobTypeSelect = screen.getByLabelText(/job type/i);
      fireEvent.change(jobTypeSelect, { target: { value: 'contract' } });

      const locationInput = screen.getByLabelText(/location preference/i);
      fireEvent.change(locationInput, { target: { value: 'Remote' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /find job matches/i });
      fireEvent.click(submitButton);

      // Form values should be preserved during loading
      expect(jobTypeSelect).toHaveValue('contract');
      expect(locationInput).toHaveValue('Remote');

      // Button should be disabled
      expect(screen.getByRole('button', { name: /finding matches/i })).toBeDisabled();
    });

    it('should clear loading state on API error', async () => {
      mockedApiClient.post.mockRejectedValue(new Error('API Error'));

      render(<ContentOptimizationComponent />);

      const contentTextarea = screen.getByPlaceholderText(/paste your resume, cover letter/i);
      fireEvent.change(contentTextarea, { target: { value: 'Test content' } });

      const optimizeButton = screen.getByRole('button', { name: /optimize content/i });
      fireEvent.click(optimizeButton);

      // Should show loading state
      expect(screen.getByText(/optimizing/i)).toBeInTheDocument();

      // Wait for error
      await waitFor(() => {
        expect(mockedApiClient.post).toHaveBeenCalled();
      });

      // Loading state should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/optimizing/i)).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /optimize content/i })).not.toBeDisabled();
      });
    });
  });
});
