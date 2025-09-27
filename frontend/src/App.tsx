/**
 * @file App.tsx
 * @description This is the root component of the CareerCopilot application.
 * It functions as a master state machine, managing the overall UI flow and
 * orchestrating the display of different features and components based on user
 * interaction and state. This component is crucial for understanding the
 * application's architecture and user journey.
 *
 * The component uses a `currentView` state to control which feature is displayed.
 * It lazy-loads components to optimize initial load time. A comprehensive set of
 * state handlers (`handle...` functions) manages transitions between different views,
 * simulating a multi-page application experience within a single-page app.
 *
 * A full demo navigation sidebar is included to showcase all available views
 * and states of the application, as depicted in the project wireframes.
 */
import { useState, Suspense, lazy } from 'react';
import { Box, Typography, Chip } from '@mui/material';
// Advanced Sidebar System imports
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarInset,
} from './components/ui/sidebar';
import { Button } from './components/ui/button';

// Lazy-loaded components for better performance
const Dashboard = lazy(() => import('./components/features/dashboard/Dashboard').then(module => ({ default: module.Dashboard })));
const ResumeBuilder = lazy(() => import('./components/features/Documents/ResumeBuilder').then(module => ({ default: module.ResumeBuilder })));
const ATSAnalysisDashboard = lazy(() => import('./components/features/Analysis/ATSAnalysisDashboard').then(module => ({ default: module.ATSAnalysisDashboard })));
const TemplateSelector = lazy(() => import('./components/features/Documents/TemplateSelector').then(module => ({ default: module.TemplateSelector })));
const DocumentPreview = lazy(() => import('./components/features/Documents/DocumentPreview').then(module => ({ default: module.DocumentPreview })));
const LoadingStates = lazy(() => import('./components/features/common/LoadingStates').then(module => ({ default: module.LoadingStates })));
const ComponentLibrary = lazy(() => import('./components/features/demo/ComponentLibrary').then(module => ({ default: module.ComponentLibrary })));
const StateDemoShowcase = lazy(() => import('./components/features/demo/StateDemoShowcase').then(module => ({ default: module.StateDemoShowcase })));
const AnimatedShowcase = lazy(() => import('./components/features/demo/AnimatedShowcase').then(module => ({ default: module.AnimatedShowcase })));
const Auth = lazy(() => import('./components/features/auth/Auth').then(module => ({ default: module.Auth })));
const UploadResume = lazy(() => import('./components/features/Documents/UploadResume').then(module => ({ default: module.UploadResume })));
const ProfileEditor = lazy(() => import('./components/features/profile/ProfileEditor').then(module => ({ default: module.ProfileEditor })));
const DocumentTypeSelector = lazy(() => import('./components/features/Documents/DocumentTypeSelector').then(module => ({ default: module.DocumentTypeSelector })));
const JobInput = lazy(() => import('./components/features/opportunities/JobInput').then(module => ({ default: module.JobInput })));
const CareerGrowthHub = lazy(() => import('./components/features/opportunities/CareerGrowthHub').then(module => ({ default: module.CareerGrowthHub })));
const JobMatching = lazy(() => import('./components/features/opportunities/JobMatching').then(module => ({ default: module.JobMatching })));
const CareerIntelligence = lazy(() => import('./components/features/opportunities/CareerIntelligence').then(module => ({ default: module.CareerIntelligence })));
const InterviewPrep = lazy(() => import('./components/features/opportunities/InterviewPrep').then(module => ({ default: module.InterviewPrep })));
const Settings = lazy(() => import('./components/features/dashboard/Settings').then(module => ({ default: module.Settings })));
const MUITest = lazy(() => import('./components/features/demo/MUITest').then(module => ({ default: module.MUITest })));

import { AppTab, DashboardTab, DocumentType, Profile as SharedProfile, Template } from './types';
import {
  Navigation,
  RemoveRedEye as Eye,
  Description as FileText,
  HourglassEmpty as Loader2,
  BarChart as BarChart3,
  Dashboard as Layout,
  Layers,
  PlayArrow as Play,
  AutoAwesome as Sparkles,
  Settings as SettingsIcon,
  People as Users,
  TrendingUp,
  Chat as MessageSquare,
  Upload,
  GpsFixed as Target,
  Login as LogIn,
  Menu as MenuIcon,
} from '@mui/icons-material';

/** Represents all possible views/screens in the application, used for routing. */
type View =
  | 'auth'
  | 'upload-resume'
  | 'profile-editor'
  | 'dashboard'
  | 'dashboard-empty'
  | 'document-type-selector'
  | 'job-input'
  | 'ats-analysis'
  | 'template-selector'
  | 'resume-builder'
  | 'document-preview'
  | 'career-growth-hub'
  | 'job-matching'
  | 'career-intelligence'
  | 'interview-prep'
  | 'settings'
  | 'loading-states'
  | 'component-library'
  | 'state-demo'
  | 'animated-showcase'
  | 'mui-test';

/** Represents the main navigation tabs of the application. */
type Tab = AppTab;

/** Defines the structure for a user profile within the App component's state. */
interface Profile {
  id: string;
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  avatarColor: string;
}

/** Tracks the user's onboarding and overall progress through the application. */
interface UserState {
  isAuthenticated: boolean;
  hasUploadedDocuments: boolean;
  hasCompletedProfile: boolean;
  hasDocuments: boolean;
}

/**
 * The root component for the application, acting as a central state manager and view router.
 * It controls the entire user flow, from authentication and onboarding to document creation
 * and dashboard interaction. It does not accept any props.
 * @returns {JSX.Element} The rendered App component.
 */
export default function App() {
  /** State for the main application tab (e.g., Dashboard, ATS Analysis). */
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  /** State for the sub-tabs within the main dashboard view. */
  const [dashboardActiveTab, setDashboardActiveTab] = useState<DashboardTab>('documents');
  /** The master state that determines which component/view is currently rendered. */
  const [currentView, setCurrentView] = useState<View>('auth');
  /** State to hold the profile being edited. */
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  /** State for the currently selected document template. */
  const [selectedTemplate, setSelectedTemplate] = useState<{ id: string; name: string; type: 'resume' | 'cover-letter'; } | null>(null);
  /** State for the type of document being created. */
  const [selectedDocumentType, setSelectedDocumentType] = useState<'resume' | 'cover-letter' | 'selection-criteria' | null>(null);
  /** State to control the visibility of the demo navigation sidebar. */
  const [showDemoNav, setShowDemoNav] = useState(true);
  /** State for the open/closed status of the mobile demo navigation. */
  const [demoNavOpen, setDemoNavOpen] = useState(false);
  /** State to track user's progress through key application milestones. */
  const [userState, setUserState] = useState<UserState>({
    isAuthenticated: false,
    hasUploadedDocuments: false,
    hasCompletedProfile: false,
    hasDocuments: false,
  });

  /** Handles successful login, transitioning the user to the document upload step. */
  const handleLogin = () => {
    setUserState({ ...userState, isAuthenticated: true });
    setCurrentView('upload-resume');
  };

  /** Handles completion of the initial document upload, moving to the profile editor. */
  const handleUploadComplete = () => {
    setUserState({ ...userState, hasUploadedDocuments: true });
    setCurrentView('profile-editor');
  };

  /** Handles completion of the profile, showing the empty dashboard state. */
  const handleProfileComplete = () => {
    setUserState({ ...userState, hasCompletedProfile: true, hasDocuments: false });
    setCurrentView('dashboard-empty');
  };

  /** Initiates the flow for a new user to create their first document. */
  const handleCreateFirstDocument = () => {
    setCurrentView('document-type-selector');
  };

  /**
   * Sets the type of document to be created and moves to the job input view.
   * @param type - The type of document selected by the user.
   */
  const handleDocumentTypeSelection = (type: 'resume' | 'cover-letter' | 'selection-criteria') => {
    setSelectedDocumentType(type);
    setCurrentView('job-input');
  };

  /**
   * Receives job data and transitions to the ATS analysis view.
   * @param jobData - An object containing the job URL or description.
   */
  const handleJobAnalysis = (jobData: { url?: string; description?: string }) => {
    console.log('Analyzing job:', jobData);
    setCurrentView('ats-analysis');
  };

  /** Moves from ATS analysis to the template selector view. */
  const handleATSAnalysisComplete = () => {
    setCurrentView('template-selector');
  };

  /**
   * Sets the chosen template and moves to the resume builder/editor.
   * @param templateId - The ID of the selected template.
   * @param type - The type of document the template is for.
   */
  const handleTemplateSelection = (templateId: string, type: 'resume' | 'cover-letter') => {
    const templateNames: Record<string, string> = {
      'modern-minimal': 'Modern Minimal',
      'executive-pro': 'Executive Pro',
      'creative-portfolio': 'Creative Portfolio',
      'ats-optimized': 'ATS Optimized',
      'cover-professional': 'Professional Cover',
      'cover-modern': 'Modern Cover',
    };
    setSelectedTemplate({ id: templateId, name: templateNames[templateId] || 'Unknown Template', type });
    setCurrentView('resume-builder');
  };

  /** Moves from the editor to the document preview screen. */
  const handleDocumentComplete = () => {
    setCurrentView('document-preview');
  };

  /** Marks that the user has saved a document and returns to the main dashboard. */
  const handleDocumentSaved = () => {
    setUserState({ ...userState, hasDocuments: true });
    setCurrentView('dashboard');
  };

  /**
   * Handles main navigation tab changes.
   * @param tab - The tab that was clicked.
   */
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'ats-analysis') {
      setCurrentView('ats-analysis');
    } else {
      setCurrentView('dashboard');
    }
  };

  /**
   * Handles dashboard sub-tab changes.
   * @param tab - The dashboard tab that was clicked.
   */
  const handleDashboardTabChange = (tab: DashboardTab) => {
    setDashboardActiveTab(tab);
  };

  /** Initiates the flow to create a new document from the dashboard. */
  const handleCreateNewDocument = () => {
    setCurrentView('document-type-selector');
  };

  /**
   * Navigates to the editor to edit a specific profile/document.
   * @param profile - The profile data to be edited.
   */
  const handleEditProfile = (profile: Profile) => {
    setCurrentView('resume-builder');
    setSelectedProfile(profile);
  };

  /**
   * Navigates to a specific feature within the Career Growth Hub.
   * @param feature - The career growth feature to navigate to.
   */
  const handleCareerGrowthNavigation = (feature: 'job-matching' | 'career-intelligence' | 'interview-prep') => {
    setCurrentView(feature);
  };

  /** Resets relevant state and navigates back to the main dashboard view. */
  const handleBackToDashboard = () => {
    setCurrentView(userState.hasDocuments ? 'dashboard' : 'dashboard-empty');
    setActiveTab('dashboard');
    setSelectedProfile(null);
    setSelectedTemplate(null);
    setSelectedDocumentType(null);
  };

  /** Navigates back to the Career Growth Hub. */
  const handleBackToCareerHub = () => setCurrentView('career-growth-hub');

  /** Navigates back to the template selection screen. */
  const handleBackToTemplates = () => {
    setCurrentView('template-selector');
    setSelectedTemplate(null);
  };

  /** Navigates back to the job input screen. */
  const handleBackToJobInput = () => setCurrentView('job-input');

  /** Navigates back to the document type selection screen. */
  const handleBackToDocumentType = () => {
    setCurrentView('document-type-selector');
    setSelectedDocumentType(null);
  };

  /** Navigates back to the document upload screen. */
  const handleBackToUpload = () => setCurrentView('upload-resume');

  /** Navigates back to the authentication screen. */
  const handleBackToAuth = () => setCurrentView('auth');

  /** An array defining all the views available in the demo navigation sidebar. */
  const demoViews = [
    { id: 'auth', label: 'Authentication', icon: LogIn, description: 'Login and signup screens' },
    { id: 'upload-resume', label: 'Upload Documents', icon: Upload, description: 'Document upload onboarding' },
    { id: 'profile-editor', label: 'Profile Editor', icon: Users, description: 'AI-powered profile creation' },
    { id: 'dashboard-empty', label: 'Dashboard (Empty)', icon: BarChart3, description: 'First-time user dashboard' },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'Profile management dashboard' },
    { id: 'document-type-selector', label: 'Document Type', icon: FileText, description: 'Choose document type to create' },
    { id: 'job-input', label: 'Job Analysis', icon: Target, description: 'Job URL or description input' },
    { id: 'ats-analysis', label: 'ATS Analysis', icon: BarChart3, description: 'AI-powered resume scoring' },
    { id: 'template-selector', label: 'Template Selector', icon: Layout, description: 'Resume & cover letter templates' },
    { id: 'resume-builder', label: 'Document Editor', icon: FileText, description: 'AI-enhanced document editing' },
    { id: 'document-preview', label: 'Document Preview', icon: Eye, description: 'Preview and export documents' },
    { id: 'career-growth-hub', label: 'Career Growth Hub', icon: TrendingUp, description: 'AI career growth tools' },
    { id: 'job-matching', label: 'Job Matching', icon: Target, description: 'AI-powered job recommendations' },
    { id: 'career-intelligence', label: 'Career Intelligence', icon: TrendingUp, description: 'Career insights and analytics' },
    { id: 'interview-prep', label: 'Interview Prep', icon: MessageSquare, description: 'AI interview practice' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, description: 'Account and preferences' },
    { id: 'loading-states', label: 'Loading States', icon: Loader2, description: 'Various loading animations' },
    { id: 'component-library', label: 'Component Library', icon: Layers, description: 'Complete design system' },
    { id: 'animated-showcase', label: 'Animated Components', icon: Sparkles, description: 'Advanced animations' },
    { id: 'state-demo', label: 'State Demo', icon: Play, description: 'Interactive demos' },
    { id: 'mui-test', label: 'MUI Test', icon: Sparkles, description: 'MUI component showcase' },
  ];

  /**
   * Handles navigation from the demo sidebar, setting the current view.
   * @param viewId - The ID of the view to navigate to.
   */
  const handleDemoNavigation = (viewId: string) => {
    if (viewId === 'dashboard' && !userState.hasDocuments) {
      setUserState({ ...userState, hasDocuments: true });
    }
    if (viewId === 'template-selector' || viewId === 'document-preview') {
      setSelectedTemplate({ id: 'modern-minimal', name: 'Modern Minimal', type: 'resume' });
    }
    setCurrentView(viewId as View);
    if (viewId === 'ats-analysis') {
      setActiveTab('ats-analysis');
    } else if (viewId === 'dashboard' || viewId === 'dashboard-empty') {
      setActiveTab('dashboard');
    }
    setDemoNavOpen(false);
  };

  /**
   * Gets the metadata for the currently active view.
   * @returns {object} The metadata object for the current view.
   */
  const getCurrentViewInfo = () => {
    return demoViews.find((view) => view.id === currentView) || demoViews[0];
  };

  /**
   * Renders the appropriate component based on the `currentView` state.
   * This acts as the main router for the application's content.
   * @returns {JSX.Element} The component corresponding to the current view.
   */
  const renderContent = () => {
    switch (currentView) {
      case 'auth': return <Auth onLogin={handleLogin} />;
      case 'upload-resume': return <UploadResume onNext={handleUploadComplete} onBack={handleBackToAuth} />;
      case 'profile-editor': return <ProfileEditor onNext={handleProfileComplete} onBack={handleBackToUpload} />;
      case 'dashboard-empty': return <Dashboard isEmpty={true} onCreateDocument={handleCreateFirstDocument} onEditProfile={handleEditProfile} onTabChange={handleDashboardTabChange} activeTab={dashboardActiveTab} />;
      case 'dashboard': return <Dashboard isEmpty={false} onCreateDocument={handleCreateNewDocument} onEditProfile={handleEditProfile} onTabChange={handleDashboardTabChange} activeTab={dashboardActiveTab} onCareerGrowthClick={() => setCurrentView('career-growth-hub')} />;
      case 'document-type-selector': return <DocumentTypeSelector onSelect={handleDocumentTypeSelection} onBack={handleBackToDashboard} />;
      case 'job-input': return <JobInput documentType={selectedDocumentType!} onAnalyze={handleJobAnalysis} onBack={handleBackToDocumentType} />;
      case 'ats-analysis': return <ATSAnalysisDashboard onNext={handleATSAnalysisComplete} onBack={handleBackToJobInput} />;
      case 'template-selector': return <TemplateSelector documentType={selectedDocumentType === 'selection-criteria' ? 'resume' : selectedDocumentType!} onSelect={handleTemplateSelection} onBack={handleBackToJobInput} />;
      case 'resume-builder': return <ResumeBuilder template={selectedTemplate!} onComplete={handleDocumentComplete} onBack={handleBackToTemplates} editingProfile={selectedProfile} />;
      case 'document-preview': return <DocumentPreview documentId="preview-doc" onBack={() => setCurrentView('resume-builder')} onEdit={() => setCurrentView('resume-builder')} onSave={handleDocumentSaved} documentType={selectedTemplate?.type || 'resume'} templateName={selectedTemplate?.name || 'Unknown'} />;
      case 'career-growth-hub': return <CareerGrowthHub onNavigate={handleCareerGrowthNavigation} onBack={handleBackToDashboard} />;
      case 'job-matching': return <JobMatching onBack={handleBackToCareerHub} />;
      case 'career-intelligence': return <CareerIntelligence onBack={handleBackToCareerHub} />;
      case 'interview-prep': return <InterviewPrep onBack={handleBackToCareerHub} />;
      case 'settings': return <Settings onBack={handleBackToDashboard} />;
      case 'loading-states': return <LoadingStates onBack={handleBackToDashboard} />;
      case 'component-library': return <ComponentLibrary onBack={handleBackToDashboard} />;
      case 'state-demo': return <StateDemoShowcase onBack={handleBackToDashboard} />;
      case 'animated-showcase': return <AnimatedShowcase onBack={handleBackToDashboard} />;
      case 'mui-test': return <MUITest onBack={handleBackToDashboard} />;
      default: return <Dashboard isEmpty={false} onCreateDocument={handleCreateNewDocument} onEditProfile={handleEditProfile} onTabChange={handleDashboardTabChange} activeTab={dashboardActiveTab} />;
    }
  };

  const currentViewInfo = getCurrentViewInfo();

  return (
    <SidebarProvider defaultOpen={showDemoNav}>
        <Sidebar collapsible="icon" variant="sidebar">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <Typography variant="h6" className="font-semibold">
                Demo Navigation
              </Typography>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {demoViews.map((view) => {
                const Icon = view.icon;
                return (
                  <SidebarMenuItem key={view.id}>
                    <SidebarMenuButton
                      isActive={currentView === view.id}
                      onClick={() => handleDemoNavigation(view.id)}
                      tooltip={view.label}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{view.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter>
            <div className="p-2">
              {showDemoNav ? (
                <Button
                  variant="ghost"
                  onClick={() => setShowDemoNav(false)}
                  className="w-full justify-start"
                >
                  Hide Navigation
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => setShowDemoNav(true)}
                  className="w-full justify-start"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Show Navigation
                </Button>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          {/* Top Header Bar */}
          {showDemoNav && (
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="flex items-center gap-2 flex-1">
                <Typography variant="h6" className="font-medium">
                  {currentViewInfo.label}
                </Typography>
                <Chip
                  label={currentViewInfo.description}
                  size="small"
                  sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
                />
              </div>
            </header>
          )}

          {/* Content Area */}
          <div className="flex flex-1 flex-col gap-4 p-4">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <Typography variant="body2" color="text.secondary">
                      Loading...
                    </Typography>
                  </div>
                </div>
              }
            >
              {renderContent()}
            </Suspense>
          </div>

          {/* Show Demo Nav Button (when hidden) */}
          {!showDemoNav && (
            <div className="fixed bottom-6 right-6 z-50">
              <Button
                variant="default"
                onClick={() => setShowDemoNav(true)}
                className="rounded-full px-6 py-3"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Demo Navigation
              </Button>
            </div>
          )}
        </SidebarInset>
      </SidebarProvider>
  );
}
