import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, SkipForward } from 'lucide-react';
import { Button } from '../ui';

interface TourStep {
  id: string;
  title: string;
  description: string;
  element?: string; // CSS selector
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void; // Action to perform when step is shown
  optional?: boolean; // Can be skipped
}

interface Tour {
  id: string;
  title: string;
  description: string;
  steps: TourStep[];
}

interface TourGuideProps {
  tourId: string;
  onComplete: () => void;
}

const tours: Record<string, Tour> = {
  'dashboard-overview': {
    id: 'dashboard-overview',
    title: 'Welcome to Your Dashboard',
    description: 'Let\'s take a quick tour of your CareerCopilot dashboard',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to CareerCopilot!',
        description: 'This is your main dashboard where you can manage all your career documents and profiles. Let\'s explore the key features.',
        position: 'bottom',
      },
      {
        id: 'create-profile',
        title: 'Create Profile Variations',
        description: 'Click here to create different versions of your profile optimized for specific job types or industries.',
        element: 'button[aria-label*="Create"], .create-profile-btn',
        position: 'bottom',
      },
      {
        id: 'profile-cards',
        title: 'Your Profile Variations',
        description: 'Each card represents a different version of your professional profile. You can edit, delete, or create variations from here.',
        element: '.profile-card, [data-testid="profile-card"]',
        position: 'top',
      },
      {
        id: 'navigation',
        title: 'Main Navigation',
        description: 'Use the navigation bar to access different sections: Documents, Analysis, Opportunities, and Settings.',
        element: 'nav, .navbar, [role="navigation"]',
        position: 'bottom',
      },
    ],
  },
  
  'profile-editor-tour': {
    id: 'profile-editor-tour',
    title: 'Profile Editor Guide',
    description: 'Learn how to create and edit comprehensive professional profiles',
    steps: [
      {
        id: 'sections-overview',
        title: 'Profile Sections',
        description: 'Your profile is organized into sections. Each section focuses on a different aspect of your professional background.',
        element: '.profile-sections, .section-nav',
        position: 'right',
      },
      {
        id: 'personal-info',
        title: 'Personal Information',
        description: 'Start with your basic contact information and professional details. This forms the foundation of all your documents.',
        element: '[data-section="personal"], .personal-info-section',
        position: 'right',
      },
      {
        id: 'experience',
        title: 'Work Experience',
        description: 'Add your work history with detailed descriptions and achievements. Use action verbs and quantify your accomplishments.',
        element: '[data-section="experience"], .experience-section',
        position: 'right',
      },
      {
        id: 'skills',
        title: 'Skills & Certifications',
        description: 'List your technical skills, soft skills, and certifications. These are crucial for ATS keyword matching.',
        element: '[data-section="skills"], .skills-section',
        position: 'right',
      },
      {
        id: 'targeting',
        title: 'Job Targeting',
        description: 'Specify target roles and keywords. This helps optimize your profile for specific job applications.',
        element: '[data-section="targeting"], .targeting-section',
        position: 'right',
      },
      {
        id: 'auto-save',
        title: 'Auto-Save Feature',
        description: 'Your changes are automatically saved. Look for the "Unsaved changes" indicator to see when changes are pending.',
        element: '.unsaved-indicator, [data-testid="save-status"]',
        position: 'bottom',
      },
    ],
  },
  
  'document-generation-tour': {
    id: 'document-generation-tour',
    title: 'Document Generation Tour',
    description: 'Learn how to generate optimized resumes and cover letters',
    steps: [
      {
        id: 'job-description',
        title: 'Job Description Input',
        description: 'Paste the complete job posting here. Our AI will analyze the requirements and optimize your documents accordingly.',
        element: 'textarea[placeholder*="job description"], .job-description-input',
        position: 'top',
      },
      {
        id: 'ats-analysis',
        title: 'ATS Analysis',
        description: 'Get an instant compatibility score before generating your documents. This helps ensure your application will pass ATS filters.',
        element: '.ats-analysis-card, [data-testid="ats-analysis"]',
        position: 'left',
      },
      {
        id: 'template-selection',
        title: 'Template Selection',
        description: 'Choose from professional templates designed for different industries and career levels.',
        element: '.template-selector, .template-gallery',
        position: 'top',
      },
      {
        id: 'preview',
        title: 'Live Preview',
        description: 'See how your document will look before downloading. You can make adjustments and regenerate as needed.',
        element: '.document-preview, [data-testid="preview"]',
        position: 'left',
      },
    ],
  },
};

export const TourGuide: React.FC<TourGuideProps> = ({ tourId, onComplete }) => {
  const tour = tours[tourId];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tour) {
      onComplete();
      return;
    }

    // Mark tour as started
    const tourStartedKey = `tour_started_${tourId}`;
    localStorage.setItem(tourStartedKey, new Date().toISOString());

    // Show the tour with a slight delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, [tour, tourId, onComplete]);

  useEffect(() => {
    if (!tour || !isVisible) return;

    const currentStep = tour.steps[currentStepIndex];
    
    // Execute step action if any
    if (currentStep.action) {
      currentStep.action();
    }

    // Find and highlight the target element
    if (currentStep.element) {
      const element = document.querySelector(currentStep.element) as HTMLElement;
      if (element) {
        setHighlightedElement(element);
        
        // Scroll element into view
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });

        // Calculate tooltip position
        const updatePosition = () => {
          const rect = element.getBoundingClientRect();
          const tooltipRect = tooltipRef.current?.getBoundingClientRect();
          
          if (!tooltipRect) return;

          let top = 0;
          let left = 0;

          switch (currentStep.position || 'top') {
            case 'top':
              top = rect.top - tooltipRect.height - 16;
              left = rect.left + (rect.width - tooltipRect.width) / 2;
              break;
            case 'bottom':
              top = rect.bottom + 16;
              left = rect.left + (rect.width - tooltipRect.width) / 2;
              break;
            case 'left':
              top = rect.top + (rect.height - tooltipRect.height) / 2;
              left = rect.left - tooltipRect.width - 16;
              break;
            case 'right':
              top = rect.top + (rect.height - tooltipRect.height) / 2;
              left = rect.right + 16;
              break;
          }

          // Keep tooltip within viewport
          const padding = 16;
          top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));
          left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));

          setTooltipPosition({ top, left });
        };

        requestAnimationFrame(updatePosition);
        window.addEventListener('resize', updatePosition);
        return () => window.removeEventListener('resize', updatePosition);
      }
    } else {
      setHighlightedElement(null);
      // Position tooltip in center of screen for steps without target elements
      setTooltipPosition({
        top: window.innerHeight / 2 - 150,
        left: window.innerWidth / 2 - 200,
      });
    }
  }, [tour, currentStepIndex, isVisible]);

  const nextStep = () => {
    if (currentStepIndex < tour.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const skipTour = () => {
    const tourSkippedKey = `tour_skipped_${tourId}`;
    localStorage.setItem(tourSkippedKey, new Date().toISOString());
    completeTour();
  };

  const completeTour = () => {
    const tourCompletedKey = `tour_completed_${tourId}`;
    localStorage.setItem(tourCompletedKey, new Date().toISOString());
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skipTour();
      } else if (e.key === 'ArrowRight') {
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        prevStep();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex]);

  if (!tour || !isVisible) return null;

  const currentStep = tour.steps[currentStepIndex];

  return createPortal(
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-75 z-40 transition-opacity duration-300" />
      
      {/* Spotlight highlight for target element */}
      {highlightedElement && (
        <div
          className="fixed z-45 pointer-events-none transition-all duration-300"
          style={{
            top: highlightedElement.getBoundingClientRect().top - 4,
            left: highlightedElement.getBoundingClientRect().left - 4,
            width: highlightedElement.getBoundingClientRect().width + 8,
            height: highlightedElement.getBoundingClientRect().height + 8,
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.6), 0 0 0 9999px rgba(0, 0, 0, 0.75)',
            borderRadius: '4px',
          }}
        />
      )}

      {/* Tour tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-50 max-w-md bg-white rounded-lg shadow-2xl p-6 transition-all duration-300 animate-scale-in"
        style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
        role="dialog"
        aria-labelledby="tour-title"
        aria-describedby="tour-description"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 id="tour-title" className="text-lg font-semibold text-gray-900">
              {currentStep.title}
            </h3>
            <p className="text-sm text-gray-500">
              Step {currentStepIndex + 1} of {tour.steps.length}
            </p>
          </div>
          <button
            onClick={skipTour}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Skip tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / tour.steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <p id="tour-description" className="text-gray-700 mb-6 leading-relaxed">
          {currentStep.description}
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="flex items-center gap-1 text-gray-500"
            >
              <SkipForward className="w-4 h-4" />
              Skip Tour
            </Button>
          </div>

          <Button
            onClick={nextStep}
            size="sm"
            className="flex items-center gap-1"
          >
            {currentStepIndex === tour.steps.length - 1 ? 'Finish' : 'Next'}
            {currentStepIndex < tour.steps.length - 1 && (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Use <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">←</kbd> / 
            <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs mx-1">→</kbd> to navigate • 
            <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Esc</kbd> to skip
          </p>
        </div>
      </div>
    </>,
    document.body
  );
};