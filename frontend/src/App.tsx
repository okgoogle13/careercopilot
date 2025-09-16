import { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton
} from '@mui/material';
import theme from './theme/theme';

// Import components (keeping existing imports)
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ResumeBuilder } from './components/ResumeBuilder';
import { ATSAnalysisDashboard } from './components/ATSAnalysisDashboard';
import { TemplateSelector } from './components/TemplateSelector';
import { DocumentPreview } from './components/DocumentPreview';
import { LoadingStates } from './components/LoadingStates';
import { ComponentLibrary } from './components/ComponentLibrary';
import { StateDemoShowcase } from './components/StateDemoShowcase';
import { AnimatedShowcase } from './components/AnimatedShowcase';

// New components for the complete user flow
import { Auth } from './components/Auth';
import { UploadResume } from './components/UploadResume';
import { ProfileEditor } from './components/ProfileEditor';
import { DocumentTypeSelector } from './components/DocumentTypeSelector';
import { JobInput } from './components/JobInput';
import { CareerGrowthHub } from './components/CareerGrowthHub';
import { JobMatching } from './components/JobMatching';
import { CareerIntelligence } from './components/CareerIntelligence';
import { InterviewPrep } from './components/InterviewPrep';
import { Settings } from './components/Settings';
import { MUITest } from './components/MUITest';

import {
  Navigation,
  Eye,
  FileText,
  Loader2,
  BarChart3,
  Layout,
  Layers,
  Play,
  Sparkles,
  Settings as SettingsIcon,
  Users,
  TrendingUp,
  MessageSquare,
  Upload,
  Target,
  LogIn,
  Menu as MenuIcon,
} from 'lucide-react';

// Complete view types matching the wireframe
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

type Tab = 'dashboard' | 'ats-analysis';

interface Profile {
  id: string;
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  avatarColor: string;
}

interface UserState {
  isAuthenticated: boolean;
  hasUploadedDocuments: boolean;
  hasCompletedProfile: boolean;
  hasDocuments: boolean;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [currentView, setCurrentView] = useState<View>('auth');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<{
    id: string;
    name: string;
    type: 'resume' | 'cover-letter';
  } | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<
    'resume' | 'cover-letter' | 'selection-criteria' | null
  >(null);
  const [showDemoNav, setShowDemoNav] = useState(true);
  const [demoNavOpen, setDemoNavOpen] = useState(false);

  // User state to track onboarding progress
  const [userState, setUserState] = useState<UserState>({
    isAuthenticated: false,
    hasUploadedDocuments: false,
    hasCompletedProfile: false,
    hasDocuments: false,
  });

  // Auth flow
  const handleLogin = () => {
    setUserState({ ...userState, isAuthenticated: true });
    setCurrentView('upload-resume');
  };

  // Onboarding flow
  const handleUploadComplete = () => {
    setUserState({ ...userState, hasUploadedDocuments: true });
    setCurrentView('profile-editor');
  };

  const handleProfileComplete = () => {
    setUserState({ ...userState, hasCompletedProfile: true, hasDocuments: false });
    setCurrentView('dashboard-empty');
  };

  // Document creation flow
  const handleCreateFirstDocument = () => {
    setCurrentView('document-type-selector');
  };

  const handleDocumentTypeSelection = (type: 'resume' | 'cover-letter' | 'selection-criteria') => {
    setSelectedDocumentType(type);
    setCurrentView('job-input');
  };

  const handleJobAnalysis = (jobData: { url?: string; description?: string }) => {
    console.log('Analyzing job:', jobData);
    setCurrentView('ats-analysis');
  };

  const handleATSAnalysisComplete = () => {
    setCurrentView('template-selector');
  };

  const handleTemplateSelection = (templateId: string, type: 'resume' | 'cover-letter') => {
    const templateNames: Record<string, string> = {
      'modern-minimal': 'Modern Minimal',
      'executive-pro': 'Executive Pro',
      'creative-portfolio': 'Creative Portfolio',
      'ats-optimized': 'ATS Optimized',
      'cover-professional': 'Professional Cover',
      'cover-modern': 'Modern Cover',
    };

    setSelectedTemplate({
      id: templateId,
      name: templateNames[templateId] || 'Unknown Template',
      type,
    });
    setCurrentView('resume-builder');
  };

  const handleDocumentComplete = () => {
    setCurrentView('document-preview');
  };

  const handleDocumentSaved = () => {
    setUserState({ ...userState, hasDocuments: true });
    setCurrentView('dashboard');
  };

  // Dashboard navigation
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'ats-analysis') {
      setCurrentView('ats-analysis');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleCreateNewDocument = () => {
    setCurrentView('document-type-selector');
  };

  const handleEditProfile = (profile: Profile) => {
    setCurrentView('resume-builder');
    setSelectedProfile(profile);
  };

  // Career growth navigation
  const handleCareerGrowthNavigation = (
    feature: 'job-matching' | 'career-intelligence' | 'interview-prep'
  ) => {
    switch (feature) {
      case 'job-matching':
        setCurrentView('job-matching');
        break;
      case 'career-intelligence':
        setCurrentView('career-intelligence');
        break;
      case 'interview-prep':
        setCurrentView('interview-prep');
        break;
    }
  };

  // Back navigation handlers
  const handleBackToDashboard = () => {
    setCurrentView(userState.hasDocuments ? 'dashboard' : 'dashboard-empty');
    setActiveTab('dashboard');
    setSelectedProfile(null);
    setSelectedTemplate(null);
    setSelectedDocumentType(null);
  };

  const handleBackToCareerHub = () => {
    setCurrentView('career-growth-hub');
  };

  const handleBackToTemplates = () => {
    setCurrentView('template-selector');
    setSelectedTemplate(null);
  };

  const handleBackToJobInput = () => {
    setCurrentView('job-input');
  };

  const handleBackToDocumentType = () => {
    setCurrentView('document-type-selector');
    setSelectedDocumentType(null);
  };

  const handleBackToUpload = () => {
    setCurrentView('upload-resume');
  };

  const handleBackToAuth = () => {
    setCurrentView('auth');
  };

  // Demo navigation - comprehensive wireframe views
  const demoViews = [
    { id: 'auth', label: 'Authentication', icon: LogIn, description: 'Login and signup screens' },
    {
      id: 'upload-resume',
      label: 'Upload Documents',
      icon: Upload,
      description: 'Document upload onboarding',
    },
    {
      id: 'profile-editor',
      label: 'Profile Editor',
      icon: Users,
      description: 'AI-powered profile creation',
    },
    {
      id: 'dashboard-empty',
      label: 'Dashboard (Empty)',
      icon: BarChart3,
      description: 'First-time user dashboard',
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Profile management dashboard',
    },
    {
      id: 'document-type-selector',
      label: 'Document Type',
      icon: FileText,
      description: 'Choose document type to create',
    },
    {
      id: 'job-input',
      label: 'Job Analysis',
      icon: Target,
      description: 'Job URL or description input',
    },
    {
      id: 'ats-analysis',
      label: 'ATS Analysis',
      icon: BarChart3,
      description: 'AI-powered resume scoring',
    },
    {
      id: 'template-selector',
      label: 'Template Selector',
      icon: Layout,
      description: 'Resume & cover letter templates',
    },
    {
      id: 'resume-builder',
      label: 'Document Editor',
      icon: FileText,
      description: 'AI-enhanced document editing',
    },
    {
      id: 'document-preview',
      label: 'Document Preview',
      icon: Eye,
      description: 'Preview and export documents',
    },
    {
      id: 'career-growth-hub',
      label: 'Career Growth Hub',
      icon: TrendingUp,
      description: 'AI career growth tools',
    },
    {
      id: 'job-matching',
      label: 'Job Matching',
      icon: Target,
      description: 'AI-powered job recommendations',
    },
    {
      id: 'career-intelligence',
      label: 'Career Intelligence',
      icon: TrendingUp,
      description: 'Career insights and analytics',
    },
    {
      id: 'interview-prep',
      label: 'Interview Prep',
      icon: MessageSquare,
      description: 'AI interview practice',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
      description: 'Account and preferences',
    },
    {
      id: 'loading-states',
      label: 'Loading States',
      icon: Loader2,
      description: 'Various loading animations',
    },
    {
      id: 'component-library',
      label: 'Component Library',
      icon: Layers,
      description: 'Complete design system',
    },
    {
      id: 'animated-showcase',
      label: 'Animated Components',
      icon: Sparkles,
      description: 'Advanced animations',
    },
    { id: 'state-demo', label: 'State Demo', icon: Play, description: 'Interactive demos' },
    { id: 'mui-test', label: 'MUI Test', icon: Sparkles, description: 'MUI component showcase' },
  ];

  const handleDemoNavigation = (viewId: string) => {
    // Reset state appropriately for demo
    if (viewId === 'dashboard' && !userState.hasDocuments) {
      setUserState({ ...userState, hasDocuments: true });
    }
    if (viewId === 'template-selector' || viewId === 'document-preview') {
      setSelectedTemplate({ id: 'modern-minimal', name: 'Modern Minimal', type: 'resume' });
    }

    setCurrentView(viewId as View);

    // Set appropriate tab for certain views
    if (viewId === 'ats-analysis') {
      setActiveTab('ats-analysis');
    } else if (viewId === 'dashboard' || viewId === 'dashboard-empty') {
      setActiveTab('dashboard');
    }

    setDemoNavOpen(false);
  };

  const getCurrentViewInfo = () => {
    const currentViewData = demoViews.find((view) => view.id === currentView);
    return currentViewData || demoViews[0];
  };

  const renderContent = () => {
    switch (currentView) {
      case 'auth':
        return <Auth onLogin={handleLogin} />;

      case 'upload-resume':
        return <UploadResume onNext={handleUploadComplete} onBack={handleBackToAuth} />;

      case 'profile-editor':
        return <ProfileEditor onNext={handleProfileComplete} onBack={handleBackToUpload} />;

      case 'dashboard-empty':
        return (
          <Dashboard
            isEmpty={true}
            onCreateDocument={handleCreateFirstDocument}
            onTabChange={handleTabChange}
            activeTab={activeTab}
          />
        );

      case 'dashboard':
        return (
          <Dashboard
            isEmpty={false}
            onCreateDocument={handleCreateNewDocument}
            onEditProfile={handleEditProfile}
            onTabChange={handleTabChange}
            activeTab={activeTab}
            onCareerGrowthClick={() => setCurrentView('career-growth-hub')}
          />
        );

      case 'document-type-selector':
        return (
          <DocumentTypeSelector
            onSelect={handleDocumentTypeSelection}
            onBack={handleBackToDashboard}
          />
        );

      case 'job-input':
        return (
          <JobInput
            documentType={selectedDocumentType!}
            onAnalyze={handleJobAnalysis}
            onBack={handleBackToDocumentType}
          />
        );

      case 'ats-analysis':
        return (
          <ATSAnalysisDashboard
            onContinue={handleATSAnalysisComplete}
            onBack={handleBackToJobInput}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        );

      case 'template-selector':
        return (
          <TemplateSelector
            documentType={selectedDocumentType === 'selection-criteria' ? 'resume' : selectedDocumentType!}
            onSelect={handleTemplateSelection}
            onBack={handleBackToJobInput}
          />
        );

      case 'resume-builder':
        return (
          <ResumeBuilder
            template={selectedTemplate!}
            onComplete={handleDocumentComplete}
            onBack={handleBackToTemplates}
            editingProfile={selectedProfile}
          />
        );

      case 'document-preview':
        return (
          <DocumentPreview
            onBack={() => setCurrentView('resume-builder')}
            onEdit={() => setCurrentView('resume-builder')}
            onSave={handleDocumentSaved}
            documentType={selectedTemplate?.type || 'resume'}
            templateName={selectedTemplate?.name || 'Unknown'}
          />
        );

      case 'career-growth-hub':
        return <CareerGrowthHub onNavigate={handleCareerGrowthNavigation} onBack={handleBackToDashboard} />;

      case 'job-matching':
        return <JobMatching onBack={handleBackToCareerHub} />;

      case 'career-intelligence':
        return <CareerIntelligence onBack={handleBackToCareerHub} />;

      case 'interview-prep':
        return <InterviewPrep onBack={handleBackToCareerHub} />;

      case 'settings':
        return <Settings onBack={handleBackToDashboard} />;

      case 'loading-states':
        return <LoadingStates />;

      case 'component-library':
        return <ComponentLibrary />;

      case 'state-demo':
        return <StateDemoShowcase />;

      case 'animated-showcase':
        return <AnimatedShowcase />;

      case 'mui-test':
        return <MUITest />;

      default:
        return <Dashboard isEmpty={false} onCreateDocument={handleCreateNewDocument} onTabChange={handleTabChange} activeTab={activeTab} />;
    }
  };

  const currentViewInfo = getCurrentViewInfo();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
        {/* Demo Navigation Drawer */}
        <Drawer
          open={demoNavOpen}
          onClose={() => setDemoNavOpen(false)}
          sx={{
            width: 320,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 320,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Demo Navigation
            </Typography>
            <List>
              {demoViews.map((view) => {
                const Icon = view.icon;
                return (
                  <ListItem key={view.id} disablePadding>
                    <ListItemButton
                      selected={currentView === view.id}
                      onClick={() => handleDemoNavigation(view.id)}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                        <Icon size={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary={view.label}
                        secondary={view.description}
                        secondaryTypographyProps={{
                          sx: { color: 'text.secondary', fontSize: '0.75rem' }
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Top App Bar */}
          {showDemoNav && (
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  onClick={() => setDemoNavOpen(true)}
                  sx={{ mr: 2, color: 'text.primary' }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }}>
                  {currentViewInfo.label}
                </Typography>
                <Chip
                  label={currentViewInfo.description}
                  size="small"
                  sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
                />
                <Button
                  onClick={() => setShowDemoNav(false)}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  Hide Demo Nav
                </Button>
              </Toolbar>
            </AppBar>
          )}

          {/* Content Area */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {renderContent()}
          </Box>

          {/* Show Demo Nav Button (when hidden) */}
          {!showDemoNav && (
            <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
              <Button
                variant="contained"
                onClick={() => setShowDemoNav(true)}
                startIcon={<Navigation />}
                sx={{
                  borderRadius: 20,
                  px: 3,
                  py: 1,
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Demo Navigation
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}