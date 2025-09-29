import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Grid,
  IconButton,
} from '@mui/material';
import {
  PlayArrow as Play,
  Square,
  Refresh as RotateCcw,
  Lightbulb,
  ChatBubble as MessageSquare,
  Schedule as Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
} from '@mui/icons-material';

interface InterviewQuestion {
  id: string;
  category: 'behavioral' | 'technical' | 'situational' | 'company';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  tips: string[];
  keyPoints: string[];
  followUpQuestions?: string[];
}

interface InterviewPrepProps {
  jobTitle?: string;
  company?: string;
  interviewType?: string;
}

const sampleQuestions: InterviewQuestion[] = [
  {
    id: '1',
    category: 'behavioral',
    difficulty: 'medium',
    question:
      'Tell me about a time when you had to work with a difficult team member. How did you handle the situation?',
    tips: [
      'Use the STAR method (Situation, Task, Action, Result)',
      'Focus on your problem-solving approach',
      'Show empathy and professionalism',
      'Highlight positive outcomes',
    ],
    keyPoints: [
      'Communication skills',
      'Conflict resolution',
      'Team collaboration',
      'Leadership potential',
    ],
    followUpQuestions: [
      'What would you do differently next time?',
      'How did this experience change your approach to teamwork?',
    ],
  },
  {
    id: '2',
    category: 'technical',
    difficulty: 'hard',
    question:
      'Explain the difference between SQL and NoSQL databases. When would you choose one over the other?',
    tips: [
      'Start with basic definitions',
      'Give concrete examples of each type',
      'Discuss use cases and trade-offs',
      'Mention scalability considerations',
    ],
    keyPoints: [
      'Database knowledge',
      'System design thinking',
      'Decision-making process',
      'Understanding of trade-offs',
    ],
  },
  {
    id: '3',
    category: 'situational',
    difficulty: 'medium',
    question:
      'If you were given a project with a tight deadline and limited resources, how would you prioritize tasks?',
    tips: [
      'Discuss your prioritization framework',
      'Mention stakeholder communication',
      'Show flexibility and adaptability',
      'Highlight project management skills',
    ],
    keyPoints: [
      'Time management',
      'Priority setting',
      'Resource allocation',
      'Stakeholder management',
    ],
  },
];

const categories = [
  { value: 'all', label: 'All Questions' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'technical', label: 'Technical' },
  { value: 'situational', label: 'Situational' },
  { value: 'company', label: 'Company-Specific' },
];

const difficulties = [
  { value: 'all', label: 'All Levels' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export function InterviewPrep({
  jobTitle = 'Software Engineer',
  company = 'Tech Company',
  interviewType = 'Technical Interview',
}: InterviewPrepProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const filteredQuestions = sampleQuestions.filter((q) => {
    const categoryMatch = selectedCategory === 'all' || q.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsTimerRunning(true);
    setTimer(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsTimerRunning(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setShowFeedback(false);
      setTimer(0);
      setIsTimerRunning(false);
      setIsRecording(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setUserAnswer('');
      setShowFeedback(false);
      setTimer(0);
      setIsTimerRunning(false);
      setIsRecording(false);
    }
  };

  const handleGetFeedback = () => {
    setShowFeedback(true);
  };

  const handleReset = () => {
    setUserAnswer('');
    setShowFeedback(false);
    setTimer(0);
    setIsTimerRunning(false);
    setIsRecording(false);
  };

  if (!currentQuestion) {
    return (
      <Box className="text-center py-8">
        <Typography variant="h6" color="text.secondary">
          No questions found for the selected filters.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => {
            setSelectedCategory('all');
            setSelectedDifficulty('all');
          }}
          className="mt-4"
        >
          Reset Filters
        </Button>
      </Box>
    );
  }

  return (
    <Box className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="text-2xl font-bold mb-2">
          Interview Preparation
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Practice for your {interviewType} at {company}
        </Typography>
      </Box>

      {/* Filters and Progress */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              label="Difficulty"
            >
              {difficulties.map((diff) => (
                <MenuItem key={diff.value} value={diff.value}>
                  {diff.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box className="flex items-center gap-2 h-full">
            <Typography variant="body2" color="text.secondary">
              Progress: {currentQuestionIndex + 1} of {filteredQuestions.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              className="flex-1 h-2 rounded-full"
            />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        {/* Question Panel */}
        <Grid item xs={12} lg={8}>
          <Card className="h-full">
            <CardContent className="p-6">
              {/* Question Header */}
              <Box className="flex items-center justify-between mb-4">
                <Box className="flex items-center gap-2">
                  <Chip
                    label={currentQuestion.category}
                    size="small"
                    className="bg-blue-100 text-blue-800"
                  />
                  <Chip
                    label={currentQuestion.difficulty}
                    size="small"
                    className={
                      currentQuestion.difficulty === 'easy'
                        ? 'bg-green-100 text-green-800'
                        : currentQuestion.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }
                  />
                </Box>

                <Box className="flex items-center gap-2">
                  <Box className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock sx={{ fontSize: 16 }} />
                    <span>{formatTime(timer)}</span>
                  </Box>
                </Box>
              </Box>

              {/* Question */}
              <Typography variant="h6" className="font-semibold mb-6">
                {currentQuestion.question}
              </Typography>

              {/* Answer Input */}
              <Box className="mb-6">
                <Typography variant="subtitle2" className="font-medium mb-3">
                  Your Answer:
                </Typography>
                <TextField
                  multiline
                  rows={8}
                  fullWidth
                  placeholder="Type your answer here or use the record button to practice speaking..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  variant="outlined"
                />
              </Box>

              {/* Recording Controls */}
              <Box className="flex items-center justify-between mb-6">
                <Box className="flex items-center gap-2">
                  <Button
                    variant={isRecording ? 'contained' : 'outlined'}
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    startIcon={
                      isRecording ? <MicOff sx={{ fontSize: 16 }} /> : <Mic sx={{ fontSize: 16 }} />
                    }
                    className={isRecording ? 'bg-red-500 hover:bg-red-600' : ''}
                  >
                    {isRecording ? 'Stop Recording' : 'Record Answer'}
                  </Button>

                  {isRecording && (
                    <Alert severity="info" className="flex-1">
                      Recording in progress... Speak clearly and take your time.
                    </Alert>
                  )}
                </Box>

                <Box className="flex gap-2">
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    startIcon={<RotateCcw sx={{ fontSize: 16 }} />}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleGetFeedback}
                    disabled={!userAnswer.trim() && !isRecording}
                    className="bg-primary hover:bg-primary/90"
                    startIcon={<ChatBubble as MessageSquare sx={{ fontSize: 16 }} />}
                  >
                    Get AI Feedback
                  </Button>
                </Box>
              </Box>

              {/* AI Feedback */}
              {showFeedback && (
                <Alert severity="success" className="mb-6">
                  <Typography variant="subtitle2" className="font-semibold mb-2">
                    AI Feedback:
                  </Typography>
                  <Typography variant="body2" className="mb-2">
                    Good structure using the STAR method! Your answer demonstrates strong
                    problem-solving skills. Consider adding more specific metrics or outcomes to
                    strengthen your response.
                  </Typography>
                  <Box className="flex items-center gap-1 mt-2">
                    <Star sx={{ fontSize: 16 }} className="text-yellow-500" />
                    <Star sx={{ fontSize: 16 }} className="text-yellow-500" />
                    <Star sx={{ fontSize: 16 }} className="text-yellow-500" />
                    <Star sx={{ fontSize: 16 }} className="text-yellow-500" />
                    <Star sx={{ fontSize: 16 }} className="text-gray-300" />
                    <Typography variant="caption" className="ml-2">
                      4/5 - Strong answer with room for improvement
                    </Typography>
                  </Box>
                </Alert>
              )}

              {/* Navigation */}
              <Box className="flex justify-between">
                <Button
                  variant="outlined"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  startIcon={<ChevronLeft sx={{ fontSize: 16 }} />}
                >
                  Previous
                </Button>

                <Button
                  variant="contained"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === filteredQuestions.length - 1}
                  endIcon={<ChevronRight sx={{ fontSize: 16 }} />}
                  className="bg-primary hover:bg-primary/90"
                >
                  Next Question
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tips & Guidance Panel */}
        <Grid item xs={12} lg={4}>
          <Card className="h-full">
            <CardContent className="p-6">
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                className="mb-4"
              >
                <Tab label="Tips" />
                <Tab label="Key Points" />
              </Tabs>

              {activeTab === 0 && (
                <Box>
                  <Box className="flex items-center gap-2 mb-4">
                    <Lightbulb sx={{ fontSize: 20 }} className="text-yellow-500" />
                    <Typography variant="h6" className="font-semibold">
                      Interview Tips
                    </Typography>
                  </Box>
                  <Box className="space-y-3">
                    {currentQuestion.tips.map((tip, index) => (
                      <Box key={index} className="flex items-start gap-2">
                        <Box className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <Typography variant="body2" color="text.secondary">
                          {tip}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" className="font-semibold mb-4">
                    Key Points to Address
                  </Typography>
                  <Box className="space-y-2">
                    {currentQuestion.keyPoints.map((point, index) => (
                      <Chip
                        key={index}
                        label={point}
                        size="small"
                        variant="outlined"
                        className="mr-2 mb-2"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Follow-up Questions */}
              {currentQuestion.followUpQuestions && (
                <Box className="mt-6 pt-6 border-t border-gray-200">
                  <Typography variant="subtitle2" className="font-semibold mb-3">
                    Potential Follow-up Questions:
                  </Typography>
                  <Box className="space-y-2">
                    {currentQuestion.followUpQuestions.map((followUp, index) => (
                      <Typography
                        key={index}
                        variant="caption"
                        className="block p-2 bg-gray-50 rounded text-gray-600"
                      >
                        {followUp}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
