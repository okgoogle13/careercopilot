import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../utils/test-utils';
import { ContentOptimizationComponent } from '../ContentOptimizationComponent';
import { aiServices } from '../../../services/aiServices';
import { mockContentOptimizationResult } from '../../../utils/mockData';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('../../../services/aiServices');
jest.mock('react-hot-toast');

const mockedAiServices = jest.mocked(aiServices);
const mockedToast = jest.mocked(toast);

describe('ContentOptimizationComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders content optimization interface correctly', () => {
    render(<ContentOptimizationComponent />);

    expect(screen.getByText('AI Content Optimization')).toBeInTheDocument();
    expect(
      screen.getByText('Optimize your resume, cover letter, and professional content with AI')
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /input & settings/i })).toBeInTheDocument();
  });

  it('renders optimization settings form', () => {
    render(<ContentOptimizationComponent />);

    expect(screen.getByText('Optimization Settings')).toBeInTheDocument();
    expect(screen.getByLabelText(/content type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target industry/i)).toBeInTheDocument();
    expect(screen.getByText('Optimization Goals')).toBeInTheDocument();
  });

  it('renders content input textarea', () => {
    render(<ContentOptimizationComponent />);

    expect(screen.getByText('Content to Optimize')).toBeInTheDocument();
    const textarea = screen.getByPlaceholderText(/paste your resume, cover letter/i);
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('shows error when no content is provided', async () => {
    render(<ContentOptimizationComponent />);

    const optimizeButton = screen.getByRole('button', { name: /optimize content/i });
    fireEvent.click(optimizeButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith('Please enter content to optimize');
    });

    expect(mockedAiServices.optimizeContent).not.toHaveBeenCalled();
  });

  it('handles successful content optimization', async () => {
    mockedAiServices.optimizeContent.mockResolvedValue(mockContentOptimizationResult);

    render(<ContentOptimizationComponent />);

    // Fill in content
    const textarea = screen.getByPlaceholderText(/paste your resume, cover letter/i);
    fireEvent.change(textarea, {
      target: { value: 'John Doe\nSoftware Engineer\nExperienced developer...' },
    });

    // Set target role
    const targetRoleInput = screen.getByLabelText(/target role/i);
    fireEvent.change(targetRoleInput, { target: { value: 'Senior Software Engineer' } });

    const optimizeButton = screen.getByRole('button', { name: /optimize content/i });
    fireEvent.click(optimizeButton);

    // Check loading state
    expect(screen.getByText(/optimizing/i)).toBeInTheDocument();

    // Wait for results
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /optimized content/i })).not.toBeDisabled();
    });

    expect(mockedToast.success).toHaveBeenCalledWith('Content optimized successfully!');
    expect(mockedAiServices.optimizeContent).toHaveBeenCalledWith({
      content: 'John Doe\nSoftware Engineer\nExperienced developer...',
      content_type: 'resume',
      target_role: 'Senior Software Engineer',
      target_company: undefined,
      target_industry: undefined,
      optimization_goals: ['ats_optimization', 'keyword_enhancement'],
    });
  });

  it('updates optimization settings correctly', () => {
    render(<ContentOptimizationComponent />);

    const contentTypeSelect = screen.getByLabelText(/content type/i);
    fireEvent.change(contentTypeSelect, { target: { value: 'cover_letter' } });

    const targetCompanyInput = screen.getByLabelText(/target company/i);
    fireEvent.change(targetCompanyInput, { target: { value: 'Google' } });

    const targetIndustryInput = screen.getByLabelText(/target industry/i);
    fireEvent.change(targetIndustryInput, { target: { value: 'Technology' } });

    expect(contentTypeSelect).toHaveValue('cover_letter');
    expect(targetCompanyInput).toHaveValue('Google');
    expect(targetIndustryInput).toHaveValue('Technology');
  });

  it('handles optimization goal checkboxes correctly', () => {
    render(<ContentOptimizationComponent />);

    // Find readability checkbox and check it
    const readabilityCheckbox = screen.getByRole('checkbox', { name: /readability improvement/i });
    fireEvent.click(readabilityCheckbox);

    expect(readabilityCheckbox).toBeChecked();

    // Uncheck ATS optimization
    const atsCheckbox = screen.getByRole('checkbox', { name: /ats optimization/i });
    fireEvent.click(atsCheckbox);

    expect(atsCheckbox).not.toBeChecked();
  });

  it('displays character count', () => {
    render(<ContentOptimizationComponent />);

    const textarea = screen.getByPlaceholderText(/paste your resume, cover letter/i);
    fireEvent.change(textarea, { target: { value: 'Test content' } });

    expect(screen.getByText('12 characters')).toBeInTheDocument();
  });

  it('switches to results tab after optimization', async () => {
    mockedAiServices.optimizeContent.mockResolvedValue(mockContentOptimizationResult);

    render(<ContentOptimizationComponent />);

    const textarea = screen.getByPlaceholderText(/paste your resume, cover letter/i);
    fireEvent.change(textarea, { target: { value: 'Test content for optimization' } });

    const optimizeButton = screen.getByRole('button', { name: /optimize content/i });
    fireEvent.click(optimizeButton);

    await waitFor(() => {
      // Check that the active tab switched to results
      const resultsTab = screen.getByRole('tab', { name: /optimized content/i });
      expect(resultsTab).toHaveAttribute('data-state', 'active');
    });
  });

  it('displays optimized content with copy button', async () => {
    mockedAiServices.optimizeContent.mockResolvedValue(mockContentOptimizationResult);

    render(<ContentOptimizationComponent />);

    const textarea = screen.getByPlaceholderText(/paste your resume, cover letter/i);
    fireEvent.change(textarea, { target: { value: 'Test content' } });

    const optimizeButton = screen.getByRole('button', { name: /optimize content/i });
    fireEvent.click(optimizeButton);

    await waitFor(() => {
      expect(screen.getByText('Optimized Content')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
    });

    // Check that optimized content is displayed
    expect(screen.getByText(/John Doe\nSenior Software Engineer/)).toBeInTheDocument();
  });

  it('displays improvements made', async () => {
    mockedAiServices.optimizeContent.mockResolvedValue(mockContentOptimizationResult);

    render(<ContentOptimizationComponent />);

    const textarea = screen.getByPlaceholderText(/paste your resume, cover letter/i);
    fireEvent.change(textarea, { target: { value: 'Test content' } });

    const optimizeButton = screen.getByRole('button', { name: /optimize content/i });
    fireEvent.click(optimizeButton);

    await waitFor(() => {
      expect(screen.getByText(/Improvements Made \(4\)/i)).toBeInTheDocument();
      expect(screen.getByText('Impact Quantification')).toBeInTheDocument();
      expect(screen.getByText('Keyword Enhancement')).toBeInTheDocument();
      expect(screen.getByText('+9 Impact')).toBeInTheDocument();
    });
  });

  it('displays metrics in analysis tab', async () => {
    mockedAiServices.optimizeContent.mockResolvedValue(mockContentOptimizationResult);

    render(<ContentOptimizationComponent />);

    const textarea = screen.getByPlaceholderText(/paste your resume, cover letter/i);
    fireEvent.change(textarea, { target: { value: 'Test content' } });

    const optimizeButton = screen.getByRole('button', { name: /optimize content/i });
    fireEvent.click(optimizeButton);

    await waitFor(() => {
      const analysisTab = screen.getByRole('tab', { name: /analysis & metrics/i });
      fireEvent.click(analysisTab);
    });

    expect(screen.getByText('Content Metrics')).toBeInTheDocument();
    expect(screen.getByText('89%')).toBeInTheDocument(); // readability score
    expect(screen.getByText('94%')).toBeInTheDocument(); // ats score
    expect(screen.getByText('92%')).toBeInTheDocument(); // impact score
    expect(screen.getByText('Keyword Density')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    const errorMessage = 'Optimization service unavailable';
    mockedAiServices.optimizeContent.mockRejectedValue(new Error(errorMessage));

    render(<ContentOptimizationComponent />);

    const textarea = screen.getByPlaceholderText(/paste your resume, cover letter/i);
    fireEvent.change(textarea, { target: { value: 'Test content' } });

    const optimizeButton = screen.getByRole('button', { name: /optimize content/i });
    fireEvent.click(optimizeButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith(
        'Failed to optimize content. Please try again.'
      );
    });
  });

  it('has proper accessibility attributes', () => {
    render(<ContentOptimizationComponent />);

    // Check form labels
    const contentTypeSelect = screen.getByLabelText(/content type/i);
    expect(contentTypeSelect).toBeInTheDocument();

    const targetRoleInput = screen.getByLabelText(/target role/i);
    expect(targetRoleInput).toBeInTheDocument();

    // Check textarea accessibility
    const textarea = screen.getByPlaceholderText(/paste your resume, cover letter/i);
    expect(textarea).toHaveAttribute('rows', '20');

    // Check button accessibility
    const optimizeButton = screen.getByRole('button', { name: /optimize content/i });
    expect(optimizeButton).toBeInTheDocument();
  });

  it('initializes with props correctly', () => {
    const initialContent = 'Initial resume content';
    render(
      <ContentOptimizationComponent initialContent={initialContent} contentType='cover_letter' />
    );

    const textarea = screen.getByDisplayValue(initialContent);
    expect(textarea).toBeInTheDocument();

    const contentTypeSelect = screen.getByLabelText(/content type/i);
    expect(contentTypeSelect).toHaveValue('cover_letter');
  });
});
