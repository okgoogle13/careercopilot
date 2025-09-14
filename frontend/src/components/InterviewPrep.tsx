import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Sparkles, MessageSquare, Play, Mic, MicOff, RotateCcw } from 'lucide-react';

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
    const questionsInCategory = sampleQuestions.filter(q => q.type === categoryId);
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
    <div className='min-h-screen bg-background p-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <Button variant='ghost' size='sm' onClick={onBack}>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Career Hub
          </Button>
        </div>

        <div className='text-center mb-8'>
          <div className='flex items-center justify-center gap-2 mb-4'>
            <Sparkles className='w-8 h-8 text-primary' />
            <h1 className='text-3xl font-semibold'>AI Interview Preparation</h1>
          </div>
          <p className='text-muted-foreground text-lg'>
            Practice with AI-powered mock interviews tailored to community support roles.
          </p>
        </div>

        {!currentQuestion ? (
          /* Question Category Selection */
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto'>
            {questionCategories.map(category => (
              <Card
                key={category.id}
                className='p-6 border-2 border-border hover:border-primary cursor-pointer transition-all duration-200 hover:shadow-lg group'
                onClick={() => handleSelectCategory(category.id)}
              >
                <div className='text-center space-y-4'>
                  <div className='p-4 bg-primary/10 rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform duration-200'>
                    <MessageSquare className='w-8 h-8 text-primary' />
                  </div>

                  <div>
                    <h3 className='text-xl font-semibold mb-2'>{category.title}</h3>
                    <p className='text-muted-foreground text-sm leading-relaxed'>
                      {category.description}
                    </p>
                  </div>

                  <Button className='w-full bg-primary hover:bg-primary/90 group-hover:bg-primary/90'>
                    <Play className='w-4 h-4 mr-2' />
                    Start Practice
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Interview Practice Interface */
          <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
            {/* Main Practice Area */}
            <div className='xl:col-span-2 space-y-6'>
              {/* Question Card */}
              <Card className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    <Badge className={getTypeColor(currentQuestion.type)}>
                      {currentQuestion.type}
                    </Badge>
                    <Badge
                      variant='outline'
                      className={getDifficultyColor(currentQuestion.difficulty)}
                    >
                      {currentQuestion.difficulty}
                    </Badge>
                  </div>
                  <Button variant='outline' size='sm' onClick={handleNewQuestion}>
                    <RotateCcw className='w-4 h-4 mr-2' />
                    New Question
                  </Button>
                </div>

                <div className='mb-4'>
                  <h3 className='text-sm font-medium text-muted-foreground mb-2'>
                    {currentQuestion.category}
                  </h3>
                  <h2 className='text-xl font-semibold leading-relaxed'>
                    {currentQuestion.question}
                  </h2>
                </div>

                {/* Recording Controls */}
                <div className='flex items-center gap-4 mb-6 p-4 bg-card rounded-lg'>
                  <Button
                    variant={isRecording ? 'destructive' : 'outline'}
                    size='sm'
                    onClick={toggleRecording}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className='w-4 h-4 mr-2' />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className='w-4 h-4 mr-2' />
                        Start Recording
                      </>
                    )}
                  </Button>
                  {isRecording && (
                    <div className='flex items-center gap-2 text-red-500'>
                      <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse' />
                      <span className='text-sm'>Recording...</span>
                    </div>
                  )}
                  <span className='text-sm text-muted-foreground'>Or type your answer below</span>
                </div>

                {/* Answer Input */}
                <div className='space-y-4'>
                  <label className='text-sm font-medium'>Your Answer</label>
                  <Textarea
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                    placeholder='Type your answer here using the STAR method (Situation, Task, Action, Result)...'
                    className='min-h-[150px] resize-none'
                  />
                  <div className='flex gap-3'>
                    <Button
                      onClick={handleGenerateTips}
                      disabled={isGeneratingTips || !userAnswer.trim()}
                      className='bg-primary hover:bg-primary/90'
                    >
                      {isGeneratingTips ? (
                        <>
                          <Sparkles className='w-4 h-4 mr-2 animate-pulse' />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className='w-4 h-4 mr-2' />
                          Get AI Feedback
                        </>
                      )}
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                    >
                      {showSampleAnswer ? 'Hide' : 'Show'} Sample Answer
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Sample Answer */}
              {showSampleAnswer && currentQuestion.sampleAnswer && (
                <Card className='p-6 bg-green-500/5 border-green-500/20'>
                  <h3 className='font-semibold mb-3 text-green-700'>Sample Answer</h3>
                  <p className='text-sm leading-relaxed text-muted-foreground'>
                    {currentQuestion.sampleAnswer}
                  </p>
                </Card>
              )}

              {/* AI Feedback (shown after analysis) */}
              {isGeneratingTips && (
                <Card className='p-6 bg-primary/5 border-primary/20'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Sparkles className='w-5 h-5 text-primary animate-pulse' />
                    <h3 className='font-semibold text-primary'>AI Feedback</h3>
                  </div>
                  <div className='space-y-2 text-sm'>
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
            <div className='space-y-6'>
              <Card className='p-6'>
                <h3 className='font-semibold mb-4'>Tips for this Question</h3>
                <ul className='space-y-2'>
                  {currentQuestion.tips.map((tip, index) => (
                    <li key={index} className='text-sm flex items-start gap-2'>
                      <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0' />
                      {tip}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className='p-6'>
                <h3 className='font-semibold mb-4'>STAR Method</h3>
                <div className='space-y-3'>
                  <div>
                    <h4 className='font-medium text-sm'>Situation</h4>
                    <p className='text-xs text-muted-foreground'>Set the context</p>
                  </div>
                  <div>
                    <h4 className='font-medium text-sm'>Task</h4>
                    <p className='text-xs text-muted-foreground'>Describe your responsibility</p>
                  </div>
                  <div>
                    <h4 className='font-medium text-sm'>Action</h4>
                    <p className='text-xs text-muted-foreground'>Explain what you did</p>
                  </div>
                  <div>
                    <h4 className='font-medium text-sm'>Result</h4>
                    <p className='text-xs text-muted-foreground'>Share the outcome</p>
                  </div>
                </div>
              </Card>

              <Button variant='outline' className='w-full' onClick={() => setCurrentQuestion(null)}>
                Choose Different Category
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
