import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { CheckCircle, Clock, AlertCircle, Pause, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface AIProgressStep {
  id: string;
  label: string;
  description?: string;
  estimatedDuration: number; // in seconds
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  errorMessage?: string;
}

interface AIProgressIndicatorProps {
  steps: AIProgressStep[];
  currentStepId: string;
  onCancel?: () => void;
  onRetry?: (stepId: string) => void;
  showTimeRemaining?: boolean;
  allowCancel?: boolean;
  compact?: boolean;
}

export const AIProgressIndicator: React.FC<AIProgressIndicatorProps> = ({
  steps,
  currentStepId,
  onCancel,
  onRetry,
  showTimeRemaining = true,
  allowCancel = true,
  compact = false,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    // Reset timer when current step changes
    if (currentStepId) {
      setStartTime(new Date());
      setElapsedTime(0);
    }
  }, [currentStepId]);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStepId);
  };

  const getTimeRemaining = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex === -1) return 0;

    const currentStep = steps[currentIndex];
    const remainingInCurrentStep = Math.max(0, currentStep.estimatedDuration - elapsedTime);
    
    const remainingSteps = steps.slice(currentIndex + 1);
    const remainingStepsTime = remainingSteps.reduce((acc, step) => acc + step.estimatedDuration, 0);
    
    return remainingInCurrentStep + remainingStepsTime;
  };

  const getTotalProgress = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const currentStepIndex = getCurrentStepIndex();
    
    if (currentStepIndex === -1) return 0;
    
    const currentStepProgress = Math.min(elapsedTime / steps[currentStepIndex].estimatedDuration, 1);
    const totalProgress = (completedSteps + currentStepProgress) / steps.length * 100;
    
    return Math.min(totalProgress, 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getStepIcon = (step: AIProgressStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStepStatusColor = (step: AIProgressStep) => {
    switch (step.status) {
      case 'completed':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'in_progress':
        return 'text-blue-700 font-medium';
      default:
        return 'text-gray-500';
    }
  };

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Clock className="h-5 w-5 text-blue-600" />
              <div className="absolute -inset-1 border-2 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                Processing... ({Math.round(getTotalProgress())}%)
              </div>
              {showTimeRemaining && (
                <div className="text-xs text-gray-500">
                  ~{formatTime(getTimeRemaining())} remaining
                </div>
              )}
            </div>
          </div>
          
          {allowCancel && onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getTotalProgress()}%` }}
            />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Processing</h3>
          <p className="text-sm text-gray-600 mt-1">
            Analyzing your information with advanced AI models
          </p>
        </div>
        
        {allowCancel && onCancel && (
          <Button variant="outline" size="sm" onClick={onCancel}>
            <Pause className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
      </div>

      {/* Progress Overview */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">
            Overall Progress ({Math.round(getTotalProgress())}%)
          </span>
          {showTimeRemaining && (
            <span className="text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              ~{formatTime(getTimeRemaining())} remaining
            </span>
          )}
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
            style={{ width: `${getTotalProgress()}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Detailed Steps */}
      <div className="space-y-4">
        {steps.map((step, _index) => {
          const isActive = step.id === currentStepId;
          const isCompleted = step.status === 'completed';
          const hasError = step.status === 'error';
          
          return (
            <div
              key={step.id}
              className={`
                flex items-start space-x-3 p-3 rounded-lg transition-all duration-200
                ${isActive ? 'bg-blue-50 border border-blue-200' : ''}
                ${hasError ? 'bg-red-50 border border-red-200' : ''}
                ${isCompleted ? 'bg-green-50 border border-green-200' : ''}
              `}
            >
              {/* Step Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getStepIcon(step)}
              </div>
              
              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-medium ${getStepStatusColor(step)}`}>
                    {step.label}
                  </h4>
                  
                  {isActive && showTimeRemaining && (
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(Math.max(0, step.estimatedDuration - elapsedTime))}
                    </div>
                  )}
                </div>
                
                {step.description && (
                  <p className="text-xs text-gray-600 mt-1">
                    {step.description}
                  </p>
                )}
                
                {/* Error Message */}
                {hasError && step.errorMessage && (
                  <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs">
                    <div className="flex items-start justify-between">
                      <span className="text-red-800">{step.errorMessage}</span>
                      {onRetry && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRetry(step.id)}
                          className="text-red-600 hover:text-red-700 h-auto p-1 ml-2"
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Progress Bar for Current Step */}
                {isActive && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(elapsedTime / step.estimatedDuration * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Messages */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center text-xs text-gray-500">
          <AlertCircle className="h-3 w-3 mr-1" />
          Please keep this tab open while processing...
        </div>
      </div>
    </Card>
  );
};

// Hook for managing AI progress state
export const useAIProgress = (initialSteps: Omit<AIProgressStep, 'status'>[]) => {
  const [steps, setSteps] = useState<AIProgressStep[]>(
    initialSteps.map(step => ({ ...step, status: 'pending' as const }))
  );
  const [currentStepId, setCurrentStepId] = useState<string>(initialSteps[0]?.id || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const startProcessing = () => {
    setIsProcessing(true);
    setIsCancelled(false);
    setCurrentStepId(steps[0]?.id || '');
  };

  const completeStep = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status: 'completed' as const } : step
    ));
    
    const currentIndex = steps.findIndex(step => step.id === stepId);
    const nextStep = steps[currentIndex + 1];
    
    if (nextStep) {
      setCurrentStepId(nextStep.id);
      setSteps(prev => prev.map(step => 
        step.id === nextStep.id ? { ...step, status: 'in_progress' as const } : step
      ));
    } else {
      setIsProcessing(false);
    }
  };

  const failStep = (stepId: string, errorMessage: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status: 'error' as const, errorMessage } 
        : step
    ));
    setIsProcessing(false);
  };

  const retryStep = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status: 'in_progress' as const, errorMessage: undefined } 
        : step
    ));
    setCurrentStepId(stepId);
    setIsProcessing(true);
  };

  const cancelProcessing = () => {
    setIsCancelled(true);
    setIsProcessing(false);
  };

  return {
    steps,
    currentStepId,
    isProcessing,
    isCancelled,
    startProcessing,
    completeStep,
    failStep,
    retryStep,
    cancelProcessing,
  };
};

export default AIProgressIndicator;