import React, { createContext, useContext, useState, useCallback } from 'react';
import { HelpTooltip } from './HelpTooltip';
import { HelpModal } from './HelpModal';
import { TourGuide } from './TourGuide';

interface HelpContextType {
  showHelp: (content: HelpContent, options?: HelpOptions) => void;
  showTour: (tourId: string) => void;
  dismissHelp: () => void;
  setHelpEnabled: (enabled: boolean) => void;
  isHelpEnabled: boolean;
}

interface HelpContent {
  id: string;
  title: string;
  description: string;
  type: 'tooltip' | 'modal' | 'inline';
  category?: 'feature' | 'troubleshooting' | 'guide';
  relatedLinks?: Array<{
    title: string;
    url: string;
  }>;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface HelpOptions {
  position?: 'top' | 'bottom' | 'left' | 'right';
  anchor?: HTMLElement;
  persistent?: boolean;
  showOnce?: boolean;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};

export const HelpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentHelp, setCurrentHelp] = useState<{
    content: HelpContent;
    options: HelpOptions;
  } | null>(null);
  const [activeTour, setActiveTour] = useState<string | null>(null);
  const [isHelpEnabled, setIsHelpEnabled] = useState(
    localStorage.getItem('help_enabled') !== 'false'
  );

  const showHelp = useCallback((content: HelpContent, options: HelpOptions = {}) => {
    if (!isHelpEnabled) return;

    // Check if this help should only be shown once
    if (options.showOnce) {
      const shownKey = `help_shown_${content.id}`;
      if (localStorage.getItem(shownKey)) return;
      localStorage.setItem(shownKey, 'true');
    }

    setCurrentHelp({ content, options });
  }, [isHelpEnabled]);

  const showTour = useCallback((tourId: string) => {
    if (!isHelpEnabled) return;
    setActiveTour(tourId);
  }, [isHelpEnabled]);

  const dismissHelp = useCallback(() => {
    setCurrentHelp(null);
    setActiveTour(null);
  }, []);

  const setHelpEnabledState = useCallback((enabled: boolean) => {
    setIsHelpEnabled(enabled);
    localStorage.setItem('help_enabled', enabled.toString());
    if (!enabled) {
      dismissHelp();
    }
  }, [dismissHelp]);

  return (
    <HelpContext.Provider
      value={{
        showHelp,
        showTour,
        dismissHelp,
        setHelpEnabled: setHelpEnabledState,
        isHelpEnabled,
      }}
    >
      {children}

      {/* Render help components */}
      {currentHelp && (
        <>
          {currentHelp.content.type === 'tooltip' && (
            <HelpTooltip
              content={currentHelp.content}
              options={currentHelp.options}
              onDismiss={dismissHelp}
            />
          )}
          {currentHelp.content.type === 'modal' && (
            <HelpModal
              content={currentHelp.content}
              options={currentHelp.options}
              onDismiss={dismissHelp}
            />
          )}
        </>
      )}

      {activeTour && (
        <TourGuide tourId={activeTour} onComplete={dismissHelp} />
      )}
    </HelpContext.Provider>
  );
};

// Help content database
export const helpContent = {
  // Dashboard help
  'dashboard-overview': {
    id: 'dashboard-overview',
    title: 'Dashboard Overview',
    description: 'Your dashboard shows all your profile variations. Each profile can be tailored for different types of jobs or industries.',
    type: 'tooltip' as const,
    category: 'feature' as const,
  },

  'profile-variations': {
    id: 'profile-variations',
    title: 'Profile Variations',
    description: 'Create different versions of your profile optimized for specific roles. For example, you might have one profile for "Software Engineer" positions and another for "Data Analyst" roles.',
    type: 'modal' as const,
    category: 'guide' as const,
    relatedLinks: [
      { title: 'Profile Editor Guide', url: '/help/profile-editor' },
      { title: 'Best Practices', url: '/help/best-practices' },
    ],
  },

  // Profile Editor help
  'profile-editor-sections': {
    id: 'profile-editor-sections',
    title: 'Profile Sections',
    description: 'Each section serves a specific purpose:\n\n• Personal Info: Contact details and basic information\n• Summary: Your professional elevator pitch\n• Experience: Work history with achievements\n• Education: Academic background\n• Skills: Technical and soft skills\n• Targeting: Keywords and target roles for optimization',
    type: 'modal' as const,
    category: 'guide' as const,
  },

  'auto-save': {
    id: 'auto-save',
    title: 'Auto-Save Feature',
    description: 'Your changes are automatically saved every 2 seconds. Look for the "Unsaved changes" indicator to see when changes are pending.',
    type: 'tooltip' as const,
    category: 'feature' as const,
  },

  // Analysis help
  'ats-analysis': {
    id: 'ats-analysis',
    title: 'ATS Analysis Explained',
    description: 'ATS (Applicant Tracking System) analysis checks how well your resume matches job requirements. Our AI analyzes:\n\n• Keyword matching (40%)\n• Semantic similarity (35%)\n• Format compatibility (25%)\n\nA score above 70% indicates good ATS compatibility.',
    type: 'modal' as const,
    category: 'guide' as const,
  },

  'keyword-optimization': {
    id: 'keyword-optimization',
    title: 'Keyword Optimization',
    description: 'Keywords are crucial for ATS systems. Include relevant keywords from job postings in your resume, but avoid keyword stuffing. Use them naturally in context.',
    type: 'tooltip' as const,
    category: 'guide' as const,
  },

  // Document Generation help
  'template-selection': {
    id: 'template-selection',
    title: 'Choosing the Right Template',
    description: 'Different templates work better for different industries:\n\n• Professional: Traditional industries (finance, law, healthcare)\n• Modern: Tech, startups, creative agencies\n• Creative: Design, marketing, entertainment\n\nConsider your industry and company culture when choosing.',
    type: 'modal' as const,
    category: 'guide' as const,
  },

  // General troubleshooting
  'upload-issues': {
    id: 'upload-issues',
    title: 'File Upload Issues',
    description: 'If you\'re having trouble uploading files:\n\n• Check file size (max 10MB)\n• Ensure file format is supported (PDF, DOC, DOCX)\n• Try refreshing the page\n• Clear browser cache if problems persist',
    type: 'modal' as const,
    category: 'troubleshooting' as const,
    actions: [
      {
        label: 'Clear Cache',
        action: () => {
          localStorage.clear();
          window.location.reload();
        },
      },
    ],
  },
};

// Hook for easy access to specific help content
export const useHelpContent = () => {
  const { showHelp } = useHelp();

  const showHelpFor = useCallback((contentId: keyof typeof helpContent, options?: HelpOptions) => {
    const content = helpContent[contentId];
    if (content) {
      showHelp(content, options);
    }
  }, [showHelp]);

  return { showHelpFor, helpContent };
};
