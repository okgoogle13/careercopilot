import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../test-utils';
import { InterviewPrep } from './InterviewPrep';

describe('InterviewPrep', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the interview preparation interface', () => {
    render(<InterviewPrep onBack={mockOnBack} />);
    
    expect(screen.getByText('AI Interview Preparation')).toBeInTheDocument();
    expect(screen.getByText('Behavioral Questions')).toBeInTheDocument();
    expect(screen.getByText('Technical Questions')).toBeInTheDocument();
    expect(screen.getByText('Situational Questions')).toBeInTheDocument();
  });

  it('displays a question when a category is selected', async () => {
    render(<InterviewPrep onBack={mockOnBack} />);
    
    const behavioralButton = screen.getByText('Behavioral Questions');
    fireEvent.click(behavioralButton);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type your answer here using the STAR method (Situation, Task, Action, Result)...')).toBeInTheDocument();
    });
  });

  it('shows sample answer when toggled', async () => {
    render(<InterviewPrep onBack={mockOnBack} />);
    
    const behavioralButton = screen.getByText('Behavioral Questions');
    fireEvent.click(behavioralButton);
    
    await waitFor(() => {
      const toggleButton = screen.getByRole('button', { name: /Show Sample Answer/i });
      fireEvent.click(toggleButton);
    });
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Hide Sample Answer/i })).toBeInTheDocument();
    });
  });

  it('allows typing an answer', async () => {
    render(<InterviewPrep onBack={mockOnBack} />);
    
    const behavioralButton = screen.getByText('Behavioral Questions');
    fireEvent.click(behavioralButton);
    
    await waitFor(() => {
      const answerTextarea = screen.getByPlaceholderText('Type your answer here using the STAR method (Situation, Task, Action, Result)...');
      const testAnswer = 'This is my test answer.';
      fireEvent.change(answerTextarea, { target: { value: testAnswer } });
      expect(answerTextarea).toHaveValue(testAnswer);
    });
  });

  it('starts and stops recording', async () => {
    render(<InterviewPrep onBack={mockOnBack} />);

    const behavioralButton = screen.getByText('Behavioral Questions');
    fireEvent.click(behavioralButton);

    await waitFor(() => {
        const recordButton = screen.getByRole('button', { name: /Start Recording/i });
        fireEvent.click(recordButton);
    });


    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Stop Recording/i })).toBeInTheDocument();
    });
  });

  it('calls onBack when clicking the back button', () => {
    render(<InterviewPrep onBack={mockOnBack} />);
    
    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});