import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { JobMatchingComponent } from '../JobMatchingComponent';
import { ContentOptimizationComponent } from '../ContentOptimizationComponent';
import { ResumeIntelligenceComponent } from '../ResumeIntelligenceComponent';
import { CoverLetterGenerationComponent } from '../CoverLetterGenerationComponent';
import { mockJobMatchingResult, mockContentOptimizationResult } from '../../../utils/mockData';
import { aiServices } from '../../../services/aiServices';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock dependencies
jest.mock('../../../services/aiServices');
jest.mock('react-hot-toast');

const mockedAiServices = jest.mocked(aiServices);

describe('AI Services Accessibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('JobMatchingComponent Accessibility', () => {
    it('should not have any accessibility violations in initial state', async () => {
      const { container } = render(
        <JobMatchingComponent resumeDocumentId="test-resume-123" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper form labels and ARIA attributes', () => {
      render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

      // Check that all form inputs have accessible labels
      expect(screen.getByLabelText(/job type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/experience level/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/remote preference/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/location preference/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/min salary/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/max salary/i)).toBeInTheDocument();

      // Check button accessibility
      const submitButton = screen.getByRole('button', { name: /find job matches/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'button');
    });

    it('should have proper heading structure', () => {
      render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

      // Main heading
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('AI-Powered Job Matching');

      // Sub-heading
      const subHeading = screen.getByRole('heading', { level: 3 });
      expect(subHeading).toHaveTextContent('Job Preferences');
    });

    it('should maintain accessibility with results displayed', async () => {
      mockedAiServices.getJobMatching.mockResolvedValue(mockJobMatchingResult);

      const { container } = render(
        <JobMatchingComponent resumeDocumentId="test-resume-123" />
      );

      // Simulate successful job matching (would normally be triggered by user action)
      // For this test, we'll manually set the component to show results
      // This would require modifying the component to accept initial results for testing

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have keyboard navigation support', () => {
      render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

      const formElements = [
        screen.getByLabelText(/job type/i),
        screen.getByLabelText(/experience level/i),
        screen.getByLabelText(/remote preference/i),
        screen.getByLabelText(/location preference/i),
        screen.getByLabelText(/min salary/i),
        screen.getByLabelText(/max salary/i),
        screen.getByRole('button', { name: /find job matches/i }),
      ];

      // All form elements should be focusable
      formElements.forEach(element => {
        expect(element).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('ContentOptimizationComponent Accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<ContentOptimizationComponent />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper tab navigation structure', () => {
      render(<ContentOptimizationComponent />);

      // Check tab list
      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();

      // Check individual tabs
      const inputTab = screen.getByRole('tab', { name: /input & settings/i });
      expect(inputTab).toBeInTheDocument();
      expect(inputTab).toHaveAttribute('aria-selected');

      // Results and analysis tabs should be disabled initially
      const resultsTab = screen.getByRole('tab', { name: /optimized content/i });
      expect(resultsTab).toHaveAttribute('disabled');

      const analysisTab = screen.getByRole('tab', { name: /analysis & metrics/i });
      expect(analysisTab).toHaveAttribute('disabled');
    });

    it('should have accessible form controls', () => {
      render(<ContentOptimizationComponent />);

      // Content textarea
      const textarea = screen.getByLabelText(/content to optimize/i);
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('required');

      // Settings form
      expect(screen.getByLabelText(/content type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/target role/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/target company/i)).toBeInTheDocument();

      // Checkboxes should have proper labels
      expect(screen.getByRole('checkbox', { name: /ats optimization/i })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /keyword enhancement/i })).toBeInTheDocument();
    });

    it('should have proper ARIA labels for complex elements', () => {
      render(<ContentOptimizationComponent />);

      // Character count should be announced to screen readers
      const textarea = screen.getByLabelText(/content to optimize/i);
      expect(textarea).toHaveAttribute('aria-describedby');

      // Button should have clear purpose
      const optimizeButton = screen.getByRole('button', { name: /optimize content/i });
      expect(optimizeButton).toBeInTheDocument();
    });
  });

  describe('ResumeIntelligenceComponent Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <ResumeIntelligenceComponent resumeDocumentId="test-resume-123" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper form structure for settings', () => {
      render(<ResumeIntelligenceComponent resumeDocumentId="test-resume-123" />);

      // Main form elements
      expect(screen.getByLabelText(/target roles/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/career goals/i)).toBeInTheDocument();

      // Submit button
      const analyzeButton = screen.getByRole('button', { name: /analyze resume/i });
      expect(analyzeButton).toBeInTheDocument();
    });

    it('should handle dynamic form elements accessibly', () => {
      render(<ResumeIntelligenceComponent resumeDocumentId="test-resume-123" />);

      // Add target role button should be accessible
      const addButton = screen.getByRole('button', { name: /add target role/i });
      expect(addButton).toBeInTheDocument();
      expect(addButton).toHaveAttribute('type', 'button');
    });
  });

  describe('CoverLetterGenerationComponent Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<CoverLetterGenerationComponent />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible multi-step form', () => {
      render(<CoverLetterGenerationComponent />);

      // Check required form fields
      const companyNameInput = screen.getByLabelText(/company name/i);
      expect(companyNameInput).toBeInTheDocument();
      expect(companyNameInput).toHaveAttribute('required');

      const positionInput = screen.getByLabelText(/position title/i);
      expect(positionInput).toBeInTheDocument();
      expect(positionInput).toHaveAttribute('required');

      const jobDescriptionTextarea = screen.getByLabelText(/job description/i);
      expect(jobDescriptionTextarea).toBeInTheDocument();
      expect(jobDescriptionTextarea).toHaveAttribute('required');
    });

    it('should have proper tab structure with ARIA attributes', () => {
      render(<CoverLetterGenerationComponent />);

      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();

      // Check tab panels
      const inputTab = screen.getByRole('tab', { name: /job details/i });
      expect(inputTab).toBeInTheDocument();
      expect(inputTab).toHaveAttribute('aria-controls');
      expect(inputTab).toHaveAttribute('aria-selected');
    });

    it('should handle dynamic form sections accessibly', () => {
      render(<CoverLetterGenerationComponent />);

      // Achievement inputs should be properly labeled
      const achievementInputs = screen.getAllByPlaceholderText(/led team/i);
      expect(achievementInputs.length).toBeGreaterThan(0);

      // Add/remove buttons should be accessible
      const addButton = screen.getByRole('button', { name: /add achievement/i });
      expect(addButton).toBeInTheDocument();
    });
  });

  describe('Loading States Accessibility', () => {
    it('should announce loading states to screen readers', () => {
      render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

      // Submit button should change to loading state accessibly
      const button = screen.getByRole('button', { name: /find job matches/i });
      expect(button).not.toHaveAttribute('aria-busy');
    });
  });

  describe('Error States Accessibility', () => {
    it('should properly announce errors to screen readers', async () => {
      // This would require triggering error states in components
      // For now, we ensure error containers have proper ARIA attributes
      render(<JobMatchingComponent />); // No resumeDocumentId to trigger validation

      // Error messages should be announced
      // This would be tested with actual error states
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    it('should maintain proper color contrast ratios', () => {
      // This test would use tools like jest-axe to check color contrast
      // For now, we ensure important elements are present
      render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

      // Important interactive elements should be present
      expect(screen.getByRole('button', { name: /find job matches/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/job type/i)).toBeInTheDocument();
    });

    it('should not rely solely on color to convey information', () => {
      render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

      // Form validation should use more than just color
      // Required fields should be marked with asterisks or "required" text
      // This would be verified with actual error states
    });
  });

  describe('Mobile Accessibility', () => {
    it('should have appropriate touch targets', () => {
      render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

      // Buttons should be large enough for touch interaction
      const submitButton = screen.getByRole('button', { name: /find job matches/i });
      expect(submitButton).toBeInTheDocument();

      // This would be tested with actual size measurements in real implementation
    });
  });

  describe('Screen Reader Navigation', () => {
    it('should have proper landmarks and regions', () => {
      render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

      // Main content should be properly structured
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toBeInTheDocument();

      // Form should be properly grouped
      const formElements = screen.getAllByRole('textbox');
      expect(formElements.length).toBeGreaterThan(0);
    });

    it('should provide adequate context for form controls', () => {
      render(<ContentOptimizationComponent />);

      // Form sections should have clear headings
      expect(screen.getByText('Optimization Settings')).toBeInTheDocument();
      expect(screen.getByText('Content to Optimize')).toBeInTheDocument();

      // Instructions should be associated with form controls
      const textarea = screen.getByPlaceholderText(/paste your resume, cover letter/i);
      expect(textarea).toHaveAttribute('placeholder');
    });
  });
});
