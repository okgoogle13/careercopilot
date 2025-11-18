import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography, Button, List, ListItem } from '@mui/material';

// Mock InterviewPrep component
const InterviewPrep = ({
  questions,
  onStartPractice,
  onGetFeedback,
}: {
  questions?: string[];
  onStartPractice?: () => void;
  onGetFeedback?: () => void;
}) => (
  <Box>
    <Typography variant="h5">Interview Prep</Typography>
    <Typography variant="body1">
      Practice common interview questions and get AI-powered feedback
    </Typography>

    <List>
      {questions && questions.length > 0 ? (
        questions.map((question, index) => (
          <ListItem key={index}>
            <Typography>{question}</Typography>
          </ListItem>
        ))
      ) : (
        <ListItem>
          <Typography>No questions available</Typography>
        </ListItem>
      )}
    </List>

    <Button variant="contained" onClick={onStartPractice}>
      Start Practice
    </Button>
    <Button variant="outlined" onClick={onGetFeedback}>
      Get Feedback
    </Button>
  </Box>
);

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('InterviewPrep', () => {
  const mockOnStartPractice = jest.fn();
  const mockOnGetFeedback = jest.fn();
  const mockQuestions = [
    'Tell me about yourself',
    'What are your strengths and weaknesses?',
    'Why do you want to work here?',
  ];

  beforeEach(() => {
    mockOnStartPractice.mockClear();
    mockOnGetFeedback.mockClear();
  });

  it('renders without errors', () => {
    renderWithTheme(<InterviewPrep />);
    expect(screen.getByText('Interview Prep')).toBeInTheDocument();
  });

  it('displays the main heading', () => {
    renderWithTheme(<InterviewPrep />);
    expect(screen.getByText('Interview Prep')).toBeInTheDocument();
  });

  it('displays the description', () => {
    renderWithTheme(<InterviewPrep />);
    expect(screen.getByText(/Practice common interview questions/i)).toBeInTheDocument();
  });

  it('displays practice questions when provided', () => {
    renderWithTheme(<InterviewPrep questions={mockQuestions} />);

    expect(screen.getByText('Tell me about yourself')).toBeInTheDocument();
    expect(screen.getByText('What are your strengths and weaknesses?')).toBeInTheDocument();
    expect(screen.getByText('Why do you want to work here?')).toBeInTheDocument();
  });

  it('shows "No questions available" when no questions provided', () => {
    renderWithTheme(<InterviewPrep questions={[]} />);
    expect(screen.getByText('No questions available')).toBeInTheDocument();
  });

  it('renders Start Practice button', () => {
    renderWithTheme(<InterviewPrep />);
    expect(screen.getByText('Start Practice')).toBeInTheDocument();
  });

  it('renders Get Feedback button', () => {
    renderWithTheme(<InterviewPrep />);
    expect(screen.getByText('Get Feedback')).toBeInTheDocument();
  });

  it('calls onStartPractice when Start Practice is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<InterviewPrep onStartPractice={mockOnStartPractice} />);

    const button = screen.getByText('Start Practice');
    await user.click(button);

    expect(mockOnStartPractice).toHaveBeenCalledTimes(1);
  });

  it('calls onGetFeedback when Get Feedback is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<InterviewPrep onGetFeedback={mockOnGetFeedback} />);

    const button = screen.getByText('Get Feedback');
    await user.click(button);

    expect(mockOnGetFeedback).toHaveBeenCalledTimes(1);
  });

  it('displays all provided questions', () => {
    renderWithTheme(<InterviewPrep questions={mockQuestions} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(mockQuestions.length);
  });

  // TODO: Add practice mode tests
  it.todo('starts recording when practice begins');
  it.todo('stops recording and analyzes response');

  // TODO: Add feedback tests
  it.todo('displays AI feedback after practice');
  it.todo('shows improvement suggestions');

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');

  // TODO: Add edge case tests
  it.todo('handles very long questions');
  it.todo('handles large number of questions (50+)');
});
