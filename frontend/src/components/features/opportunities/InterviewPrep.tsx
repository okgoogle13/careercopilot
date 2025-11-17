import {
  ArrowLeft,
  AutoAwesome as Sparkles,
  MessageSharp as MessageSquare,
  PlayArrow as Play,
  Mic,
  MicOff,
  Replay as RotateCcw,
} from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import {
  Button,
  Card,
} from '@mui/material';
import { useState } from 'react';

import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';

interface InterviewPrepProps {
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

export function InterviewPrep({ onBack }: InterviewPrepProps) {
  const theme = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isGeneratingTips, setIsGeneratingTips] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const questionCategories = [
    {
      id: 'behavioral',
      title: 'Behavioral Questions',
      description: 'Questions about past experiences and how you handled situations',
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
    {
      id: 'situational',
      title: 'Situational Questions',
      description: 'Hypothetical scenarios to assess problem-solving skills',
      color: 'bg-green-500/10 text-green-500 border-green-500/20',
    },
    {
      id: 'technical',
      title: 'Technical Questions',
      description: 'Role-specific questions about skills and knowledge',
      color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    },
  ];

  const sampleQuestions: Question[] = [
    {
      id: '1',
      type: 'behavioral',
      question:
        'Tell me about a time when you had to deal with a difficult client or situation. How did you handle it?',
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
      question:
        'How would you approach working with a client who has multiple complex needs and limited support networks?',
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
      question:
        'What strategies would you use to support someone experiencing a mental health crisis?',
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

  const handleSelectCategory = (categoryId: string) => {
    const questionsInCategory = sampleQuestions.filter((q) => q.type === categoryId);
    if (questionsInCategory.length > 0) {
      const randomQuestion =
        questionsInCategory[Math.floor(Math.random() * questionsInCategory.length)];
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
    // In a real app, this would start/stop voice recording
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'behavioral':
        return 'bg-blue-100 text-blue-800';
      case 'situational':
        return 'bg-green-100 text-green-800';
      case 'technical':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      p: 4
    }}>
      <Box>
        {/* Header */}
        <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      mb: 8
    }}>
          <Button variant="text" size="small" onClick={onBack}>
            <ArrowLeft sx={{
      mr: 2
    }} />
            Back to Career Hub
          </Button>
        </Box>

        <Box sx={{
      textAlign: "center",
      mb: 8
    }}>
          <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      mb: 4
    }}>
            <Sparkles />
            <Typography variant="h3" sx={{
      fontWeight: 600
    }}>AI Interview Preparation</Typography>
          </Box>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Practice with AI-powered mock interviews tailored to community support roles.
          </Typography>
        </Box>

        {!currentQuestion ? (
          /* Question Category Selection */
          <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
      gap: 6,}}>
            {questionCategories.map((category) => (
              <Card
                key={category.id}
                sx={{
      p: 6,
      border: 2,
      borderColor: 'grey.200',
      transition: 'all 0.3s',
      '&:hover': {
        boxShadow: 4,
        transform: 'translateY(-4px)',
        borderColor: 'primary.main',
      },
      cursor: "pointer",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    }}
                onClick={() => handleSelectCategory(category.id)}
              >
                <Box sx={{
      p: 4,
      borderRadius: "1rem",
      mb: 4,
      display: 'inline-flex',
      bgcolor: category.color.split(' ')[0],
      color: category.color.split(' ')[1],
    }}>
                    <MessageSquare sx={{ fontSize: '2.5rem' }} />
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" sx={{
      fontWeight: 600,
      mb: 2
    }}>{category.title}</Typography>
                    <Typography sx={{
      typography: "body1",
      color: 'text.secondary',
      mb: 4
    }}>
                      {category.description}
                    </Typography>
                  </Box>

                  <Button sx={{
      width: "100%",
      mt: 'auto',
      '&:hover': { bgcolor: 'primary.dark' },}}>
                    <Play sx={{
      mr: 2
    }} />
                    Start Practice
                  </Button>
              </Card>
            ))}
          </Box>
        ) : (
          /* Interview Practice Interface */
          <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
      gap: 8
    }}>
            {/* Main Practice Area */}
            <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6,}}>
              {/* Question Card */}
              <Card sx={{
      p: 6
    }}>
                <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 4
    }}>
                  <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
                    <Badge className={getTypeColor(currentQuestion.type)}>
                      {currentQuestion.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getDifficultyColor(currentQuestion.difficulty)}
                    >
                      {currentQuestion.difficulty}
                    </Badge>
                  </Box>
                  <Button variant="outlined" size="small" onClick={handleNewQuestion}>
                    <RotateCcw sx={{
      mr: 2,
      fontSize: '1rem'
    }} />
                    New Question
                  </Button>
                </Box>

                <Box sx={{
      mb: 4
    }}>
                  <Typography sx={{
      typography: "body1",
      fontWeight: 500,
      color: 'text.secondary',
      mb: 2
    }}>
                    {currentQuestion.category}
                  </Typography>
                  <Typography variant="h5" sx={{
      fontWeight: 600,}}>
                    {currentQuestion.question}
                  </Typography>
                </Box>

                {/* Recording Controls */}
                <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      mb: 6,
      p: 4,
      bgcolor: 'grey.50',
      borderRadius: "0.5rem"
    }}>
                  <Button
                    variant={isRecording ? 'contained' : 'outlined'}
                    color={isRecording ? 'error' : 'primary'}
                    size="small"
                    onClick={toggleRecording}
                  >
                    {isRecording ? (
                      <>
                        <MicOff sx={{
      mr: 1
    }} />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic sx={{
      mr: 1
    }} />
                        Start Recording
                      </>
                    )}
                  </Button>
                  {isRecording && (
                    <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      color: "red.500"
    }}>
                      <Box sx={{
      width: 8,
      height: 8,
      bgcolor: "red.500",
      borderRadius: "9999px",
      animation: 'pulse 1.5s infinite'
    }} />
                      <Typography sx={{
      typography: "body1"
    }}>Recording...</Typography>
                    </Box>
                  )}
                  <Typography sx={{
      typography: "body1",
      color: 'text.secondary'
    }}>Or type your answer below</Typography>
                </Box>

                {/* Answer Input */}
                <Box>
                  <Typography component="label" sx={{
      typography: "body1",
      fontWeight: 500,
      mb: 1,
      display: 'block'
    }}>Your Answer</Typography>
                  <Textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here using the STAR method (Situation, Task, Action, Result)..."
                    sx={{
      minHeight: "150px",
      mb: 2
    }}
                  />
                  <Box sx={{
      display: "flex",
      gap: 3
    }}>
                    <Button
                      onClick={handleGenerateTips}
                      disabled={isGeneratingTips || !userAnswer.trim()}
                      sx={{
      '&:hover': { bgcolor: 'primary.dark' }
    }}
                    >
                      {isGeneratingTips ? (
                        <>
                          <Sparkles sx={{
      mr: 2,
      animation: 'spin 1s linear infinite'
    }} />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles sx={{
      mr: 2
    }} />
                          Get AI Feedback
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                    >
                      {showSampleAnswer ? 'Hide' : 'Show'} Sample Answer
                    </Button>
                  </Box>
                </Box>
              </Card>

              {/* Sample Answer */}
              {showSampleAnswer && currentQuestion.sampleAnswer && (
                <Card sx={{
      p: 6,
      bgcolor: 'green.50'
    }}>
                  <Typography variant="h6" sx={{
      fontWeight: 600,
      mb: 3,
      color: "green.700"
    }}>Sample Answer</Typography>
                  <Typography sx={{
      typography: "body1",
      whiteSpace: 'pre-wrap'
    }}>
                    {currentQuestion.sampleAnswer}
                  </Typography>
                </Card>
              )}

              {/* AI Feedback (shown after analysis) */}
              {isGeneratingTips && (
                <Card sx={{
      p: 6,}}>
                  <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      mb: 3
    }}>
                    <Sparkles sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" sx={{
      fontWeight: 600,}}>AI Feedback</Typography>
                  </Box>
                  <Box sx={{
      typography: "body1",
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
                    <Typography>
                      • <strong>Structure:</strong> Good use of STAR method, clear sequence of
                      events
                    </Typography>
                    <Typography>
                      • <strong>Impact:</strong> Consider quantifying the results more specifically
                    </Typography>
                    <Typography>
                      • <strong>Skills demonstrated:</strong> Shows empathy, adaptability, and
                      client-centered approach
                    </Typography>
                    <Typography>
                      • <strong>Suggestion:</strong> Add more detail about the specific strategies
                      you used
                    </Typography>
                  </Box>
                </Card>
              )}
            </Box>
            {/* Tips Sidebar */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Card sx={{
      p: 6
    }}>
                <Typography variant="h6" sx={{
      fontWeight: 600,
      mb: 4
    }}>Tips for this Question</Typography>
                <ul sx={{
      p: 0,
      m: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }}>
                  {currentQuestion.tips.map((tip, index) => (
                    <li key={index} sx={{
      typography: "body1",
      display: "flex",
      alignItems: "flex-start",
      gap: 2
    }}>
                      <Box sx={{
      width: 8,
      height: 8,
      borderRadius: "9999px",
      bgcolor: 'primary.main',
      mt: '6px',
      flexShrink: 0
    }} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card sx={{
      p: 6
    }}>
                <Typography variant="h6" sx={{
      fontWeight: 600,
      mb: 4
    }}>STAR Method</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography sx={{
      fontWeight: 500,
      typography: "body1"
    }}>Situation</Typography>
                    <Typography sx={{
      typography: "body2",
      color: 'text.secondary'
    }}>Set the context</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{
      fontWeight: 500,
      typography: "body1"
    }}>Task</Typography>
                    <Typography sx={{
      typography: "body2",
      color: 'text.secondary'
    }}>Describe your responsibility</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{
      fontWeight: 500,
      typography: "body1"
    }}>Action</Typography>
                    <Typography sx={{
      typography: "body2",
      color: 'text.secondary'
    }}>Explain what you did</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{
      fontWeight: 500,
      typography: "body1"
    }}>Result</Typography>
                    <Typography sx={{
      typography: "body2",
      color: 'text.secondary'
    }}>Share the outcome</Typography>
                  </Box>
                </Box>
              </Card>

              <Button
                variant="outlined"
                sx={{
      width: "100%"
    }}
                onClick={() => setCurrentQuestion(null)}
              >
                Choose Different Category
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}