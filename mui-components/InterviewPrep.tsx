import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  TextField,
  Container,
  Grid,
  alpha,
  CircularProgress,
} from '@mui/material';
import { ArrowLeft, Sparkles, MessageSquare, Play, Mic, MicOff, RotateCcw } from 'lucide-react';

export interface InterviewPrepProps {
  onBack: () => void;
}

interface Question {
  id: string;
  type: 'behavioral' | 'technical' | 'situational';
  question: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  sampleAnswer?: string;
  tips: string[];
}

const questionCategories = [
  {
    id: 'behavioral',
    title: 'Behavioral Questions',
    description: 'Questions about past experiences and how you handled situations',
    color: '#60A5FA',
  },
  {
    id: 'situational',
    title: 'Situational Questions',
    description: 'Hypothetical scenarios to assess problem-solving skills',
    color: '#86EFAC',
  },
  {
    id: 'technical',
    title: 'Technical Questions',
    description: 'Role-specific questions about skills and knowledge',
    color: '#F472B6',
  },
];

const sampleQuestions: Question[] = [
  {
    id: '1',
    type: 'behavioral',
    question: 'Tell me about a time when you had to deal with a difficult client or situation. How did you handle it?',
    category: 'Conflict Resolution',
    difficulty: 'Medium',
    tips: [
      'Use the STAR method (Situation, Task, Action, Result)',
      'Focus on your problem-solving approach',
      'Highlight your communication skills',
      'Show empathy and understanding',
    ],
    sampleAnswer:
      'In my role as a Community Support Worker, I encountered a client who was resistant to participating in their support plan activities. I recognized that their behavior might be stemming from fear or past negative experiences. I took time to listen to their concerns, validated their feelings, and worked collaboratively to modify the plan to better suit their comfort level. As a result, they became more engaged and achieved their goals within the revised timeframe.',
  },
  {
    id: '2',
    type: 'situational',
    question: 'How would you approach working with a client who has multiple complex needs and limited support networks?',
    category: 'Case Management',
    difficulty: 'Hard',
    tips: [
      'Demonstrate holistic thinking',
      'Show understanding of person-centered care',
      'Mention collaboration with other services',
      'Emphasize building trust and rapport',
    ],
  },
  {
    id: '3',
    type: 'technical',
    question: 'What strategies would you use to support someone experiencing a mental health crisis?',
    category: 'Crisis Intervention',
    difficulty: 'Hard',
    tips: [
      'Mention de-escalation techniques',
      'Reference relevant frameworks or models',
      'Show understanding of safety protocols',
      'Demonstrate knowledge of referral pathways',
    ],
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return '#86EFAC';
    case 'Medium':
      return '#FDE047';
    case 'Hard':
      return '#FFB4AB';
    default:
      return '#94A3B8';
  }
};

export const InterviewPrep: React.FC<InterviewPrepProps> = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isGeneratingTips, setIsGeneratingTips] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleSelectCategory = (categoryId: string) => {
    const questionsInCategory = sampleQuestions.filter((q) => q.type === categoryId);
    if (questionsInCategory.length > 0) {
      const randomQuestion = questionsInCategory[Math.floor(Math.random() * questionsInCategory.length)];
      setCurrentQuestion(randomQuestion);
      setUserAnswer('');
      setShowSampleAnswer(false);
    }
  };

  const handleGenerateTips = async () => {
    setIsGeneratingTips(true);
    setTimeout(() => {
      setIsGeneratingTips(false);
    }, 2000);
  };

  const handleNewQuestion = () => {
    const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
    setCurrentQuestion(randomQuestion);
    setUserAnswer('');
    setShowSampleAnswer(false);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Button variant="text" startIcon={<ArrowLeft size={16} />} onClick={onBack} sx={{ color: 'text.secondary', mb: 4 }}>
            Back to Career Hub
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <Sparkles size={32} color="#A78BFA" />
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Roboto Flex", "Roboto", serif',
                  fontWeight: 700,
                }}
              >
                Interview Preparation
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
              Practice with AI-powered mock interviews tailored to your target roles.
            </Typography>
          </Box>
        </Box>

        {!currentQuestion ? (
          <>
            {/* Question Categories */}
            <Grid container spacing={3}>
              {questionCategories.map((category) => (
                <Grid item xs={12} md={4} key={category.id}>
                  <Card
                    sx={{
                      height: '100%',
                      bgcolor: 'surface.container',
                      border: 1,
                      borderColor: 'outline.variant',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: category.color,
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) => `0 8px 24px ${alpha(category.color, 0.12)}`,
                      },
                    }}
                    onClick={() => handleSelectCategory(category.id)}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 3,
                          bgcolor: (theme) => alpha(category.color, 0.12),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3,
                        }}
                      >
                        <MessageSquare size={32} color={category.color} />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: '"Roboto Flex", "Roboto", serif',
                          fontWeight: 700,
                          mb: 1.5,
                        }}
                      >
                        {category.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <Grid container spacing={3}>
            {/* Question Panel */}
            <Grid item xs={12} lg={8}>
              <Card
                sx={{
                  bgcolor: 'surface.container',
                  border: 1,
                  borderColor: 'outline.variant',
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <Chip label={currentQuestion.type} size="small" sx={{ textTransform: 'capitalize' }} />
                      <Chip label={currentQuestion.category} size="small" variant="outlined" />
                      <Chip
                        label={currentQuestion.difficulty}
                        size="small"
                        sx={{
                          bgcolor: (theme) => alpha(getDifficultyColor(currentQuestion.difficulty), 0.12),
                          color: getDifficultyColor(currentQuestion.difficulty),
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Button variant="text" startIcon={<RotateCcw size={16} />} onClick={handleNewQuestion} size="small">
                      New Question
                    </Button>
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: '"Roboto Flex", "Roboto", serif',
                      fontWeight: 600,
                      mb: 4,
                      lineHeight: 1.5,
                    }}
                  >
                    {currentQuestion.question}
                  </Typography>

                  {/* Answer Input */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Your Answer
                      </Typography>
                      <Button
                        variant={isRecording ? 'contained' : 'outlined'}
                        color={isRecording ? 'error' : 'inherit'}
                        size="small"
                        startIcon={isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                        onClick={toggleRecording}
                      >
                        {isRecording ? 'Stop Recording' : 'Voice Answer'}
                      </Button>
                    </Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={8}
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type or record your answer here..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'background.default',
                        },
                      }}
                    />
                  </Box>

                  {/* Sample Answer */}
                  {currentQuestion.sampleAnswer && (
                    <Box>
                      <Button variant="outlined" onClick={() => setShowSampleAnswer(!showSampleAnswer)} fullWidth sx={{ mb: 2 }}>
                        {showSampleAnswer ? 'Hide' : 'Show'} Sample Answer
                      </Button>
                      {showSampleAnswer && (
                        <Card
                          sx={{
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                            border: 1,
                            borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                              Sample Answer
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                              {currentQuestion.sampleAnswer}
                            </Typography>
                          </CardContent>
                        </Card>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>

              <Button
                variant="contained"
                fullWidth
                startIcon={isGeneratingTips ? <CircularProgress size={16} /> : <Sparkles size={16} />}
                onClick={handleGenerateTips}
                disabled={isGeneratingTips || !userAnswer}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                {isGeneratingTips ? 'Analyzing Answer...' : 'Get AI Feedback'}
              </Button>
            </Grid>

            {/* Tips Panel */}
            <Grid item xs={12} lg={4}>
              <Card
                sx={{
                  bgcolor: 'surface.container',
                  border: 1,
                  borderColor: 'outline.variant',
                  position: { lg: 'sticky' },
                  top: { lg: 24 },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Sparkles size={20} color="#A78BFA" />
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 700,
                      }}
                    >
                      Answer Tips
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {currentQuestion.tips.map((tip, index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            flexShrink: 0,
                            mt: 1,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                          {tip}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default InterviewPrep;
