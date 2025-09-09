# AI Services Integration Examples

This document provides practical examples for integrating AI-powered career services into the CareerCopilot frontend application.

## Quick Start Integration

### 1. Basic Setup

Add the AI Services route to your application:

```tsx
// App.tsx
import { lazy } from 'react';

const AIServicesPage = lazy(() => import('./pages/AIServicesPage'));

// In your Routes component:
<Route
  path="/ai-services"
  element={
    <ErrorBoundary>
      <AIServicesPage />
    </ErrorBoundary>
  }
/>
```

### 2. Navigation Integration

Add AI Services to your sidebar navigation:

```tsx
// Sidebar.tsx
import { Sparkles } from 'lucide-react';

const menuItems = [
  // ... other menu items
  { id: 'ai-services', label: 'AI Services', icon: Sparkles, path: '/ai-services' },
];
```

## Component Usage Examples

### Job Matching Component

```tsx
import { JobMatchingComponent } from '../components/AIServices';
import { useState } from 'react';

const JobMatchingExample = () => {
  const [selectedResume, setSelectedResume] = useState('');

  return (
    <JobMatchingComponent
      resumeDocumentId={selectedResume}
      onJobSelected={(jobId) => {
        // Handle job selection - could navigate to job details
        console.log('Selected job:', jobId);
        // navigate(`/jobs/${jobId}`);
      }}
    />
  );
};
```

### Content Optimization Component

```tsx
import { ContentOptimizationComponent } from '../components/AIServices';

const OptimizationExample = () => {
  return (
    <ContentOptimizationComponent
      initialContent="John Doe\nSoftware Engineer\n..."
      contentType="resume"
    />
  );
};
```

### Resume Intelligence Component

```tsx
import { ResumeIntelligenceComponent } from '../components/AIServices';

const IntelligenceExample = () => {
  return (
    <ResumeIntelligenceComponent
      resumeDocumentId="user-resume-123"
      initialResumeContent="Fallback resume content if document not found"
    />
  );
};
```

### Cover Letter Generation Component

```tsx
import { CoverLetterGenerationComponent } from '../components/AIServices';

const CoverLetterExample = () => {
  return (
    <CoverLetterGenerationComponent
      resumeDocumentId="user-resume-123"
      initialJobDescription="Software Engineer position at Google..."
      initialCompanyName="Google"
      initialPositionTitle="Senior Software Engineer"
    />
  );
};
```

## Advanced Integration Patterns

### 1. Context-Aware Integration

Share data between components using React Context:

```tsx
// contexts/AIServicesContext.tsx
import { createContext, useContext, useState } from 'react';

interface AIServicesContextType {
  selectedResume: string;
  setSelectedResume: (id: string) => void;
  optimizedContent: string;
  setOptimizedContent: (content: string) => void;
}

const AIServicesContext = createContext<AIServicesContextType | null>(null);

export const AIServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedResume, setSelectedResume] = useState('');
  const [optimizedContent, setOptimizedContent] = useState('');

  return (
    <AIServicesContext.Provider value={{
      selectedResume,
      setSelectedResume,
      optimizedContent,
      setOptimizedContent,
    }}>
      {children}
    </AIServicesContext.Provider>
  );
};

export const useAIServices = () => {
  const context = useContext(AIServicesContext);
  if (!context) {
    throw new Error('useAIServices must be used within AIServicesProvider');
  }
  return context;
};
```

### 2. Progressive Enhancement

Gradually enable AI features based on user engagement:

```tsx
import { useEffect, useState } from 'react';
import { aiServices } from '../services/aiServices';

const ProgressiveAIIntegration = () => {
  const [aiEnabled, setAIEnabled] = useState(false);
  const [userEngagement, setUserEngagement] = useState(0);

  useEffect(() => {
    // Enable AI features after user has uploaded documents
    if (userEngagement > 2) {
      setAIEnabled(true);
    }
  }, [userEngagement]);

  return (
    <div>
      {aiEnabled ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-blue-900">🎉 AI Features Unlocked!</h3>
          <p className="text-blue-700 mt-1">
            Access our AI-powered job matching and content optimization tools.
          </p>
          <button
            onClick={() => navigate('/ai-services')}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try AI Services
          </button>
        </div>
      ) : null}
      {/* Regular content */}
    </div>
  );
};
```

### 3. Error Boundary Integration

Graceful error handling for AI services:

```tsx
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { AIServicesErrorFallback } from '../components/AIServices/ErrorFallback';

const AIServicesWithErrorHandling = () => {
  return (
    <ErrorBoundary
      fallback={AIServicesErrorFallback}
      onError={(error) => {
        console.error('AI Services Error:', error);
        // Report to error tracking service
      }}
    >
      <AIServicesPage />
    </ErrorBoundary>
  );
};

// ErrorFallback component
const AIServicesErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        AI Services Temporarily Unavailable
      </h2>
      <p className="text-gray-600 mb-4">
        We're experiencing technical difficulties with our AI services.
        Please try again in a few moments.
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
};
```

## Custom Hooks for AI Services

### 1. AI Services Hook

```tsx
// hooks/useAIServices.ts
import { useState, useCallback } from 'react';
import { aiServices } from '../services/aiServices';
import toast from 'react-hot-toast';

export const useAIServices = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeAIService = useCallback(async (
    serviceCall: () => Promise<any>,
    successMessage?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const result = await serviceCall();
      if (successMessage) {
        toast.success(successMessage);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI service failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const jobMatching = useCallback((request) => {
    return executeAIService(
      () => aiServices.getJobMatching(request),
      'Job matching complete!'
    );
  }, [executeAIService]);

  const contentOptimization = useCallback((request) => {
    return executeAIService(
      () => aiServices.optimizeContent(request),
      'Content optimized successfully!'
    );
  }, [executeAIService]);

  return {
    loading,
    error,
    jobMatching,
    contentOptimization,
    // Add other AI services as needed
  };
};
```

### 2. Resume Data Hook

```tsx
// hooks/useResumeData.ts
import { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';

export const useResumeData = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await apiClient.get('/documents?type=resume');
        setResumes(data);
        if (data.length > 0 && !selectedResume) {
          setSelectedResume(data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch resumes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [selectedResume]);

  return {
    resumes,
    selectedResume,
    setSelectedResume,
    loading,
  };
};
```

## Performance Optimization

### 1. Lazy Loading Components

```tsx
// Lazy load AI service components
const LazyJobMatching = lazy(() =>
  import('../components/AIServices/JobMatchingComponent')
);

const LazyContentOptimization = lazy(() =>
  import('../components/AIServices/ContentOptimizationComponent')
);

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <LazyJobMatching resumeDocumentId={resumeId} />
</Suspense>
```

### 2. Memoized AI Service Results

```tsx
import { useMemo } from 'react';

const MemoizedAIResults = ({ results, analysisType }) => {
  const processedResults = useMemo(() => {
    return processAIResults(results, analysisType);
  }, [results, analysisType]);

  return <AIResultsDisplay results={processedResults} />;
};
```

## Testing Examples

### 1. Component Testing

```tsx
// __tests__/JobMatchingComponent.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { JobMatchingComponent } from '../components/AIServices';
import * as aiServices from '../services/aiServices';

jest.mock('../services/aiServices');

describe('JobMatchingComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders job matching form', () => {
    render(<JobMatchingComponent resumeDocumentId="test-resume-id" />);

    expect(screen.getByText('AI-Powered Job Matching')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /find job matches/i })).toBeInTheDocument();
  });

  it('handles successful job matching', async () => {
    const mockResults = {
      matches: [{ job_id: '1', title: 'Software Engineer', match_score: 85 }],
      analysis: { total_jobs_analyzed: 100, avg_match_score: 75 }
    };

    (aiServices.aiServices.getJobMatching as jest.Mock).mockResolvedValue(mockResults);

    render(<JobMatchingComponent resumeDocumentId="test-resume-id" />);

    fireEvent.click(screen.getByRole('button', { name: /find job matches/i }));

    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('85% Match')).toBeInTheDocument();
    });
  });
});
```

### 2. API Service Testing

```tsx
// __tests__/aiServices.test.ts
import { aiServices } from '../services/aiServices';
import { apiClient } from '../utils/apiClient';

jest.mock('../utils/apiClient');

describe('AI Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls job matching API correctly', async () => {
    const mockRequest = {
      document_id: 'test-id',
      preferences: { job_type: 'full-time' }
    };

    const mockResponse = { matches: [], analysis: {} };
    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await aiServices.getJobMatching(mockRequest);

    expect(apiClient.post).toHaveBeenCalledWith('/ai-career/job-matching', mockRequest);
    expect(result).toEqual(mockResponse);
  });
});
```

## Deployment Configuration

### Environment Variables

```bash
# .env.production
VITE_API_BASE_URL=https://api.careercopilot.com
VITE_AI_FEATURES_ENABLED=true
VITE_GENKIT_ENDPOINT=https://genkit.careercopilot.com
```

### Feature Flags

```tsx
// utils/featureFlags.ts
export const FEATURE_FLAGS = {
  AI_SERVICES_ENABLED: import.meta.env.VITE_AI_FEATURES_ENABLED === 'true',
  JOB_MATCHING_BETA: import.meta.env.VITE_JOB_MATCHING_BETA === 'true',
  CONTENT_OPTIMIZATION_ENABLED: true,
};

// Usage
import { FEATURE_FLAGS } from '../utils/featureFlags';

const ConditionalAIFeatures = () => {
  if (!FEATURE_FLAGS.AI_SERVICES_ENABLED) {
    return <ComingSoonBanner />;
  }

  return <AIServicesPage />;
};
```

This completes the comprehensive frontend integration for AI-powered career services!
