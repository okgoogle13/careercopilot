import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InterviewPrep } from './InterviewPrep';
import { vi } from 'vitest';

describe('InterviewPrep', () => {
  const mockOnBack = vi.fn();
  
  const mockQuestions = [
    {
      id: '1',
      type: 'behavioral',
      question: 'Tell me about a time you faced a difficult challenge at work.',
      category: 'Behavioral',
      difficulty: 'Medium',
      sampleAnswer: 'In my previous role, I encountered a situation where...',
      tips: ['Use the STAR method', 'Be specific about your actions', 'Highlight what you learned'],
    },
    {
      id: '2',
      type: 'technical',
      question: 'Explain how React works under the hood.',
      category: 'Technical',
      difficulty: 'Hard',
      sampleAnswer: 'React uses a virtual DOM to optimize rendering...',
      tips: ['Mention the virtual DOM', 'Explain reconciliation', 'Talk about component lifecycle'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the interview preparation interface', () => {
    render(<InterviewPrep onBack={mockOnBack} questions={mockQuestions} />);
    
    // Check main sections
    expect(screen.getByText('Interview Preparation')).toBeInTheDocument();
    expect(screen.getByText('Behavioral Questions')).toBeInTheDocument();
    expect(screen.getByText('Technical Questions')).toBeInTheDocument();
    expect(screen.getByText('Situational Questions')).toBeInTheDocument();
  });

  it('displays a question when selected', async () => {
    render(<InterviewPrep onBack={mockOnBack} questions={mockQuestions} />);
    
    // Click on the first question
    const questionButton = screen.getByText(mockQuestions[0].question);
    fireEvent.click(questionButton);
    
    // Check if the question is displayed
    await waitFor(() => {
      expect(screen.getByText(mockQuestions[0].question)).toBeInTheDocument();
      expect(screen.getByLabelText('Your Answer')).toBeInTheDocument();
    });
  });

  it('shows sample answer when toggled', async () => {
    render(<InterviewPrep onBack={mockOnBack} questions={mockQuestions} />);
    
    // Select a question
    const questionButton = screen.getByText(mockQuestions[0].question);
    fireEvent.click(questionButton);
    
    // Toggle sample answer
    const toggleButton = screen.getByText('Show Sample Answer');
    fireEvent.click(toggleButton);
    
    // Check if sample answer is shown
    await waitFor(() => {
      expect(screen.getByText(mockQuestions[0].sampleAnswer!)).toBeInTheDocument();
      expect(screen.getByText('Hide Sample Answer')).toBeInTheDocument();
    });
  });

  it('allows typing an answer', async () => {
    render(<InterviewPrep onBack={mockOnBack} questions={mockQuestions} />);
    
    // Select a question
    const questionButton = screen.getByText(mockQuestions[0].question);
    fireEvent.click(questionButton);
    
    // Type an answer
    const answerTextarea = screen.getByLabelText('Your Answer');
    const testAnswer = 'This is my test answer.';
    fireEvent.change(answerTextarea, { target: { value: testAnswer } });
    
    // Check if the answer is updated
    expect(answerTextarea).toHaveValue(testAnswer);
  });

  it('starts and stops recording', async () => {
    // Mock the MediaRecorder API
    const mockMediaRecorder = {
      start: vi.fn(),
      stop: vi.fn(),
      ondataavailable: null,
      onstop: null,
      state: 'inactive',
      stream: { getTracks: () => [{ stop: vi.fn() }] },
    } as unknown as MediaRecorder;
    
    global.MediaRecorder = vi.fn().mockImplementation(() => mockMediaRecorder);
    
    render(<InterviewPrep onBack={mockOnBack} questions={mockQuestions} />);
    
    // Start recording
    const recordButton = screen.getByRole('button', { name: /start recording/i });
    fireEvent.click(recordButton);
    
    // Check if recording started
    expect(mockMediaRecorder.start).toHaveBeenCalled();
    expect(screen.getByText('Stop Recording')).toBeInTheDocument();
    
    // Stop recording
    fireEvent.click(recordButton);
    
    // Simulate the onstop event
    if (mockMediaRecorder.onstop) {
      mockMediaRecorder.onstop(new Event('stop'));
    }
    
    // Check if recording stopped
    await waitFor(() => {
      expect(mockMediaRecorder.stop).toHaveBeenCalled();
      expect(screen.getByText('Start Recording')).toBeInTheDocument();
    });
  });

  it('calls onBack when clicking the back button', () => {
    render(<InterviewPrep onBack={mockOnBack} questions={mockQuestions} />);
    
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
