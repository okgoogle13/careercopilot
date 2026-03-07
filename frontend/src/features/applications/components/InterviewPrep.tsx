import { LensArea } from '@/components/ui/Lens';
import { Pebble } from '@/components/ui/Pebble';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';
import { Stone } from '@/components/ui/Stone';
import { ArrowLeft, Loader2, MessageSquare, Mic, MicOff, RotateCcw, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

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
    color: 'var(--color-leaf-base)', // #60A5FA
  },
  {
    id: 'situational',
    title: 'Situational Questions',
    description: 'Hypothetical scenarios to assess problem-solving skills',
    color: 'var(--color-ink-base)', // #86EFAC
  },
  {
    id: 'technical',
    title: 'Technical Questions',
    description: 'Role-specific questions about skills and knowledge',
    color: 'var(--color-flower-base)', // #F472B6
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

const getDifficultyVariant = (difficulty: string): 'success' | 'warning' | 'error' | 'neutral' => {
  switch (difficulty) {
    case 'Easy':
      return 'success';
    case 'Medium':
      return 'warning';
    case 'Hard':
      return 'error';
    default:
      return 'neutral';
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
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-base)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Pebble
            variant="ghost"
            iconLeft={<ArrowLeft size={16} />}
            onClick={onBack}
            className="mb-6"
          >
            Back to Career Hub
          </Pebble>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Sparkles
                size={32}
                className="text-[var(--color-flower-base)]"
              />
              <h1 className="text-display-medium font-bold text-[var(--color-text-primary)]">
                Interview Preparation
              </h1>
            </div>
            <p className="text-body-large text-[var(--color-text-secondary)]">
              Practice with AI-powered mock interviews tailored to your target roles.
            </p>
          </div>
        </div>

        {!currentQuestion ? (
          <>
            {/* Question CategoriesGrid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {questionCategories.map((category) => (
                <Stone
                  key={category.id}
                  elevation="flat"
                  className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-leaf-base)] group"
                  onClick={() => handleSelectCategory(category.id)}
                >
                  <div className="p-6 flex flex-col items-center text-center h-full">
                    <div
                      className="w-16 h-16 rounded-placard flex items-center justify-center mb-4 transition-colors group-hover:scale-110 duration-300"
                      style={{ backgroundColor: `${category.color}20` }} /* 20 = 12% opacity hex */
                    >
                      <MessageSquare
                        size={32}
                        style={{ color: category.color }}
                      />
                    </div>
                    <h3 className="text-display-small font-bold text-[var(--color-text-primary)] mb-2">
                      {category.title}
                    </h3>
                    <p className="text-body-medium text-[var(--color-text-secondary)]">
                      {category.description}
                    </p>
                  </div>
                </Stone>
              ))}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Question Panel */}
            <div className="lg:col-span-2">
              <Stone className="mb-6">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge
                        label={currentQuestion.type}
                        variant="neutral"
                        className="capitalize"
                      />
                      <StatusBadge
                        label={currentQuestion.category}
                        variant="neutral"
                        className="border-dashed"
                      />
                      <StatusBadge
                        label={currentQuestion.difficulty}
                        variant={getDifficultyVariant(currentQuestion.difficulty)}
                        className="font-semibold"
                      />
                    </div>
                    <Pebble
                      variant="ghost"
                      size="sm"
                      iconLeft={<RotateCcw size={14} />}
                      onClick={handleNewQuestion}
                    >
                      New Question
                    </Pebble>
                  </div>

                  <h2 className="text-display-small font-semibold text-[var(--color-text-primary)] mb-8 leading-tight">
                    {currentQuestion.question}
                  </h2>

                  {/* Answer Input */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-label-large font-bold text-[var(--color-text-primary)]">
                        Your Answer
                      </span>
                      <Pebble
                        variant={isRecording ? 'secondary' : 'ghost'}
                        size="sm"
                        iconLeft={isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                        onClick={toggleRecording}
                        className={
                          isRecording
                            ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            : ''
                        }
                      >
                        {isRecording ? 'Stop Recording' : 'Voice Answer'}
                      </Pebble>
                    </div>
                    <LensArea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type or record your answer here..."
                      rows={8}
                      className="w-full font-serif"
                    />
                  </div>

                  {/* Sample Answer */}
                  {currentQuestion.sampleAnswer && (
                    <div className="mt-4">
                      <Pebble
                        variant="secondary"
                        onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                        className="w-full justify-center mb-4"
                      >
                        {showSampleAnswer ? 'Hide' : 'Show'} Sample Answer
                      </Pebble>

                      {showSampleAnswer && (
                        <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-leaf-base)] rounded-pebble p-4 animate-in fade-in slide-in-from-top-2">
                          <span className="text-label-small font-bold text-[var(--color-leaf-base)] block mb-1">
                            SAMPLE ANSWER
                          </span>
                          <p className="text-body-medium text-[var(--color-text-secondary)] leading-relaxed">
                            {currentQuestion.sampleAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Stone>

              <Pebble
                variant="primary"
                className="w-full justify-center py-4 text-lg"
                iconLeft={
                  isGeneratingTips ? (
                    <Loader2
                      className="animate-spin"
                      size={20}
                    />
                  ) : (
                    <Sparkles size={20} />
                  )
                }
                onClick={handleGenerateTips}
                disabled={isGeneratingTips || !userAnswer}
              >
                {isGeneratingTips ? 'Analyzing Answer...' : 'Get AI Feedback'}
              </Pebble>
            </div>

            {/* Tips Panel */}
            <div className="lg:col-span-1">
              <Stone className="lg:sticky lg:top-6 bg-[var(--color-surface-container)]">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4 text-[var(--color-flower-base)]">
                    <Sparkles size={20} />
                    <h3 className="text-body-large font-bold text-[var(--color-text-primary)]">
                      Answer Tips
                    </h3>
                  </div>

                  <div className="flex flex-col gap-3">
                    {currentQuestion.tips.map((tip, index) => (
                      <div
                        key={index}
                        className="flex gap-3 items-start p-2 rounded-stone hover:bg-[var(--color-surface-base)] transition-colors"
                      >
                        <div className="w-2 h-2 rounded-sentry bg-[var(--color-leaf-base)] mt-2 flex-shrink-0" />
                        <p className="text-body-medium text-[var(--color-text-secondary)] leading-relaxed">
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Stone>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPrep;
