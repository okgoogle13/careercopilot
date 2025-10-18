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
