import {
  ArrowLeft,
  AutoAwesome as Sparkles,
  MessageSharp as MessageSquare,
  PlayArrow as Play,
  Mic,
  MicOff,
  Replay as RotateCcw,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
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
        return 'bg-blue-500/10 text-blue-500';
      case 'situational':
        return 'bg-green-500/10 text-green-500';
      case 'technical':
        return 'bg-purple-500/10 text-purple-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div sx={{
      minHeight: "100vh",
      "bg-background": true,
      p: 4
    }}>
      <div sx={{
      "max-w-6xl": true,
      "mx-auto": true
    }}>
        {/* Header */}
        <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      mb: 8
    }}>
          <Button variant="text" size="small" onClick={onBack}>
            <ArrowLeft sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
            Back to Career Hub
          </Button>
        </div>

        <div sx={{
      textAlign: "center",
      mb: 8
    }}>
          <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      mb: 4
    }}>
            <Sparkles sx={{
      "w-8": true,
      "h-8": true,
      "text-primary": true
    }} />
            <h1 sx={{
      typography: h3,
      fontWeight: 600
    }}>AI Interview Preparation</h1>
          </div>
          <p sx={{
      "text-muted-foreground": true,
      typography: h6
    }}>
            Practice with AI-powered mock interviews tailored to community support roles.
          </p>
        </div>

        {!currentQuestion ? (
          /* Question Category Selection */
          <div sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-3": true },
      gap: 6,
      "max-w-4xl": true,
      "mx-auto": true
    }}>
            {questionCategories.map((category) => (
              <Card
                key={category.id}
                sx={{
      p: 6,
      border: 2,
      "border-border": true,
      '&:hover': { "border-primary": true },
      cursor: "pointer",
      "transition-all": true,
      "duration-200": true,
      '&:hover': { boxShadow: 4 },
      "group": true
    }}
                onClick={() => handleSelectCategory(category.id)}
              >
                <div sx={{
      textAlign: "center",
      "space-y-4": true
    }}>
                  <div sx={{
      p: 4,
      "bg-primary/10": true,
      borderRadius: 1rem,
      "w-fit": true,
      "mx-auto": true,
      "group-hover:scale-110": true,
      "transition-transform": true,
      "duration-200": true
    }}>
                    <MessageSquare sx={{
      "w-8": true,
      "h-8": true,
      "text-primary": true
    }} />
                  </div>

                  <div>
                    <h3 sx={{
      typography: h5,
      fontWeight: 600,
      mb: 2
    }}>{category.title}</h3>
                    <p sx={{
      "text-muted-foreground": true,
      typography: body1,
      "leading-relaxed": true
    }}>
                      {category.description}
                    </p>
                  </div>

                  <Button sx={{
      width: "100%",
      "bg-primary": true,
      '&:hover': { "bg-primary/90": true },
      "group-hover:bg-primary/90": true
    }}>
                    <Play sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
                    Start Practice
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Interview Practice Interface */
          <div sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('lg')]: { "grid-cols-3": true },
      gap: 8
    }}>
            {/* Main Practice Area */}
            <div sx={{
      [theme.breakpoints.up('lg')]: { "col-span-2": true },
      "space-y-6": true
    }}>
              {/* Question Card */}
              <Card sx={{
      p: 6
    }}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 4
    }}>
                  <div sx={{
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
                  </div>
                  <Button variant="outlined" size="small" onClick={handleNewQuestion}>
                    <RotateCcw sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
                    New Question
                  </Button>
                </div>

                <div sx={{
      mb: 4
    }}>
                  <h3 sx={{
      typography: body1,
      fontWeight: 500,
      "text-muted-foreground": true,
      mb: 2
    }}>
                    {currentQuestion.category}
                  </h3>
                  <h2 sx={{
      typography: h5,
      fontWeight: 600,
      "leading-relaxed": true
    }}>
                    {currentQuestion.question}
                  </h2>
                </div>

                {/* Recording Controls */}
                <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      mb: 6,
      p: 4,
      "bg-card": true,
      borderRadius: 0.5rem
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
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
                        Start Recording
                      </>
                    )}
                  </Button>
                  {isRecording && (
                    <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      color: "red.500"
    }}>
                      <div sx={{
      "w-2": true,
      "h-2": true,
      bgcolor: "red.500",
      borderRadius: 9999px,
      "animate-pulse": true
    }} />
                      <span sx={{
      typography: body1
    }}>Recording...</span>
                    </div>
                  )}
                  <span sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Or type your answer below</span>
                </div>

                {/* Answer Input */}
                <div sx={{
      "space-y-4": true
    }}>
                  <label sx={{
      typography: body1,
      fontWeight: 500
    }}>Your Answer</label>
                  <Textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here using the STAR method (Situation, Task, Action, Result)..."
                    sx={{
      h: "150px",
      "resize-none": true
    }}
                  />
                  <div sx={{
      display: "flex",
      gap: 3
    }}>
                    <Button
                      onClick={handleGenerateTips}
                      disabled={isGeneratingTips || !userAnswer.trim()}
                      sx={{
      "bg-primary": true,
      '&:hover': { "bg-primary/90": true }
    }}
                    >
                      {isGeneratingTips ? (
                        <>
                          <Sparkles sx={{
      "w-4": true,
      "h-4": true,
      mr: 2,
      "animate-pulse": true
    }} />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles sx={{
      "w-4": true,
      "h-4": true,
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
                  </div>
                </div>
              </Card>

              {/* Sample Answer */}
              {showSampleAnswer && currentQuestion.sampleAnswer && (
                <Card sx={{
      p: 6,
      "bg-green-500/5": true,
      "border-green-500/20": true
    }}>
                  <h3 sx={{
      fontWeight: 600,
      mb: 3,
      color: "green.700"
    }}>Sample Answer</h3>
                  <p sx={{
      typography: body1,
      "leading-relaxed": true,
      "text-muted-foreground": true
    }}>
                    {currentQuestion.sampleAnswer}
                  </p>
                </Card>
              )}

              {/* AI Feedback (shown after analysis) */}
              {isGeneratingTips && (
                <Card sx={{
      p: 6,
      "bg-primary/5": true,
      "border-primary/20": true
    }}>
                  <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      mb: 3
    }}>
                    <Sparkles sx={{
      "w-5": true,
      "h-5": true,
      "text-primary": true,
      "animate-pulse": true
    }} />
                    <h3 sx={{
      fontWeight: 600,
      "text-primary": true
    }}>AI Feedback</h3>
                  </div>
                  <div sx={{
      "space-y-2": true,
      typography: body1
    }}>
                    <p>
                      • <strong>Structure:</strong> Good use of STAR method, clear sequence of
                      events
                    </p>
                    <p>
                      • <strong>Impact:</strong> Consider quantifying the results more specifically
                    </p>
                    <p>
                      • <strong>Skills demonstrated:</strong> Shows empathy, adaptability, and
                      client-centered approach
                    </p>
                    <p>
                      • <strong>Suggestion:</strong> Add more detail about the specific strategies
                      you used
                    </p>
                  </div>
                </Card>
              )}
            </div>
            {/* Tips Sidebar */}
            <div sx={{
      "space-y-6": true
    }}>
              <Card sx={{
      p: 6
    }}>
                <h3 sx={{
      fontWeight: 600,
      mb: 4
    }}>Tips for this Question</h3>
                <ul sx={{
      "space-y-2": true
    }}>
                  {currentQuestion.tips.map((tip, index) => (
                    <li key={index} sx={{
      typography: body1,
      display: "flex",
      alignItems: "flex-start",
      gap: 2
    }}>
                      <div sx={{
      "w-1.5": true,
      "h-1.5": true,
      "bg-primary": true,
      borderRadius: 9999px,
      mt: 2,
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
                <h3 sx={{
      fontWeight: 600,
      mb: 4
    }}>STAR Method</h3>
                <div sx={{
      "space-y-3": true
    }}>
                  <div>
                    <h4 sx={{
      fontWeight: 500,
      typography: body1
    }}>Situation</h4>
                    <p sx={{
      typography: body2,
      "text-muted-foreground": true
    }}>Set the context</p>
                  </div>
                  <div>
                    <h4 sx={{
      fontWeight: 500,
      typography: body1
    }}>Task</h4>
                    <p sx={{
      typography: body2,
      "text-muted-foreground": true
    }}>Describe your responsibility</p>
                  </div>
                  <div>
                    <h4 sx={{
      fontWeight: 500,
      typography: body1
    }}>Action</h4>
                    <p sx={{
      typography: body2,
      "text-muted-foreground": true
    }}>Explain what you did</p>
                  </div>
                  <div>
                    <h4 sx={{
      fontWeight: 500,
      typography: body1
    }}>Result</h4>
                    <p sx={{
      typography: body2,
      "text-muted-foreground": true
    }}>Share the outcome</p>
                  </div>
                </div>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
