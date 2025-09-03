import React from 'react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Card } from '../ui/Card';
import { Sparkles, Brain, Target, FileText } from 'lucide-react';

interface AILoadingStateProps {
  type: 'job-matching' | 'content-optimization' | 'resume-intelligence' | 'cover-letter';
  message?: string;
}

export const AILoadingState: React.FC<AILoadingStateProps> = ({ type, message }) => {
  const getIcon = () => {
    switch (type) {
      case 'job-matching': return <Target className="h-8 w-8" />;
      case 'content-optimization': return <Sparkles className="h-8 w-8" />;
      case 'resume-intelligence': return <Brain className="h-8 w-8" />;
      case 'cover-letter': return <FileText className="h-8 w-8" />;
      default: return <Sparkles className="h-8 w-8" />;
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'job-matching': return 'Analyzing your profile and matching with thousands of jobs...';
      case 'content-optimization': return 'Optimizing your content with AI-powered enhancements...';
      case 'resume-intelligence': return 'Generating deep insights about your career trajectory...';
      case 'cover-letter': return 'Crafting a personalized cover letter with company research...';
      default: return 'Processing your request...';
    }
  };

  const getEstimatedTime = () => {
    switch (type) {
      case 'job-matching': return '30-45 seconds';
      case 'content-optimization': return '15-30 seconds';
      case 'resume-intelligence': return '45-60 seconds';
      case 'cover-letter': return '30-45 seconds';
      default: return '30 seconds';
    }
  };

  return (
    <Card className="p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="animate-pulse text-blue-600">
            {getIcon()}
          </div>
          <div className="absolute -top-1 -right-1">
            <LoadingSpinner size="sm" className="text-blue-400" />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        AI Processing in Progress
      </h3>

      <p className="text-gray-600 mb-4 max-w-md mx-auto">
        {message || getDefaultMessage()}
      </p>

      <div className="text-sm text-gray-500">
        Estimated time: {getEstimatedTime()}
      </div>

      {/* Progress indicator */}
      <div className="mt-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Please don't close this window while processing...
      </div>
    </Card>
  );
};

// Skeleton loading components for different sections
export const JobMatchSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="p-6">
        <div className="animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="flex gap-1">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-6 w-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="flex gap-1">
                {[1, 2].map((j) => (
                  <div key={j} className="h-6 w-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export const ContentOptimizationSkeleton: React.FC = () => (
  <Card className="p-6">
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="flex gap-2">
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
        ))}
      </div>
    </div>
  </Card>
);

export const ResumeIntelligenceSkeleton: React.FC = () => (
  <div className="space-y-6">
    <Card className="p-6">
      <div className="animate-pulse">
        <div className="h-5 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>

    <Card className="p-6">
      <div className="animate-pulse">
        <div className="h-5 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  </div>
);

// Animated background for AI processing
export const AIProcessingBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-100 opacity-20 animate-pulse"></div>
      <div className="absolute top-40 -left-40 w-60 h-60 rounded-full bg-purple-100 opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 right-20 w-40 h-40 rounded-full bg-green-100 opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>

    <div className="relative z-10">
      {children}
    </div>
  </div>
);

export default AILoadingState;
