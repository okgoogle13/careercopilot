import { useState, lazy, Suspense } from "react";
import { ThemeWrapper } from "./components/ThemeWrapper";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";

// Lazy load components to improve initial load time
const Dashboard = lazy(() =>
  import("./components/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const Auth = lazy(() => import("./components/Auth").then((m) => ({ default: m.Auth })));
const UploadResume = lazy(() =>
  import("./components/UploadResume").then((m) => ({ default: m.UploadResume })),
);
const ProfileEditor = lazy(() =>
  import("./components/ProfileEditor").then((m) => ({ default: m.ProfileEditor })),
);
const DocumentTypeSelector = lazy(() =>
  import("./components/DocumentTypeSelector").then((m) => ({ default: m.DocumentTypeSelector })),
);
const JobInput = lazy(() => import("./components/JobInput").then((m) => ({ default: m.JobInput })));
const ATSAnalysisDashboard = lazy(() =>
  import("./components/ATSAnalysisDashboard").then((m) => ({ default: m.ATSAnalysisDashboard })),
);
const TemplateSelector = lazy(() =>
  import("./components/TemplateSelector").then((m) => ({ default: m.TemplateSelector })),
);
const ResumeBuilder = lazy(() =>
  import("./components/ResumeBuilder").then((m) => ({ default: m.ResumeBuilder })),
);
const DocumentPreview = lazy(() =>
  import("./components/DocumentPreview").then((m) => ({ default: m.DocumentPreview })),
);
const CareerGrowthHub = lazy(() =>
  import("./components/CareerGrowthHub").then((m) => ({ default: m.CareerGrowthHub })),
);
const JobMatching = lazy(() =>
  import("./components/JobMatching").then((m) => ({ default: m.JobMatching })),
);
const CareerIntelligence = lazy(() =>
  import("./components/CareerIntelligence").then((m) => ({ default: m.CareerIntelligence })),
);
const InterviewPrep = lazy(() =>
  import("./components/InterviewPrep").then((m) => ({ default: m.InterviewPrep })),
);
const Settings = lazy(() => import("./components/Settings").then((m) => ({ default: m.Settings })));
const LoadingStates = lazy(() =>
  import("./components/LoadingStates").then((m) => ({ default: m.LoadingStates })),
);
const ComponentLibrary = lazy(() =>
  import("./components/ComponentLibrary").then((m) => ({ default: m.ComponentLibrary })),
);
const DesignTokenExample = lazy(() =>
  import("./components/examples/DesignTokenExample").then((m) => ({
    default: m.DesignTokenExample,
  })),
);
const AnimatedShowcase = lazy(() =>
  import("./components/AnimatedShowcase").then((m) => ({ default: m.AnimatedShowcase })),
);
const StateDemoShowcase = lazy(() =>
  import("./components/StateDemoShowcase").then((m) => ({ default: m.StateDemoShowcase })),
);
const StandardizedLoadingStatesDemo = lazy(
  () => import("./components/StandardizedLoadingStatesDemo"),
);
const AuroraShowcase = lazy(() =>
  import("./components/AuroraShowcase").then((m) => ({ default: m.AuroraShowcase })),
);
const ComplexComponentsShowcase = lazy(() =>
  import("./components/ComplexComponentsShowcase").then((m) => ({
    default: m.ComplexComponentsShowcase,
  })),
);
const M3ColorSystemShowcase = lazy(() =>
  import("./components/M3ColorSystemShowcase").then((m) => ({ default: m.M3ColorSystemShowcase })),
);

import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
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
  Palette,
} from "lucide-react";

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span>Loading...</span>
    </div>
  </div>
);

// Complete view types matching the wireframe
type View =
  | "auth"
  | "upload-resume"
  | "profile-editor"
  | "dashboard"
  | "dashboard-empty"
  | "document-type-selector"
  | "job-input"
  | "ats-analysis"
  | "template-selector"
  | "resume-builder"
  | "document-preview"
  | "career-growth-hub"
  | "job-matching"
  | "career-intelligence"
  | "interview-prep"
  | "settings"
  | "loading-states"
  | "component-library"
  | "design-tokens"
  | "state-demo"
  | "animated-showcase"
  | "standardized-loading"
  | "aurora-showcase"
  | "complex-components"
  | "m3-colors";

type Tab = "dashboard" | "ats-analysis";

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
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [currentView, setCurrentView] = useState<View>("auth");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<{
    id: string;
    name: string;
    type: "resume" | "cover-letter";
  } | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<
    "resume" | "cover-letter" | "selection-criteria" | null
  >(null);
  const [showDemoNav, setShowDemoNav] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    setCurrentView("upload-resume");
  };

  // Onboarding flow
  const handleUploadComplete = () => {
    setUserState({ ...userState, hasUploadedDocuments: true });
    setCurrentView("profile-editor");
  };

  const handleProfileComplete = () => {
    setUserState({ ...userState, hasCompletedProfile: true, hasDocuments: false });
    setCurrentView("dashboard-empty");
  };

  // Document creation flow
  const handleCreateFirstDocument = () => {
    setCurrentView("document-type-selector");
  };

  const handleDocumentTypeSelection = (type: "resume" | "cover-letter" | "selection-criteria") => {
    setSelectedDocumentType(type);
    setCurrentView("job-input");
  };

  const handleJobAnalysis = (jobData: { url?: string; description?: string }) => {
    console.log("Analyzing job:", jobData);
    setCurrentView("ats-analysis");
  };

  const handleATSAnalysisComplete = () => {
    setCurrentView("template-selector");
  };

  const handleTemplateSelection = (templateId: string, type: "resume" | "cover-letter") => {
    const templateNames: Record<string, string> = {
      "modern-minimal": "Modern Minimal",
      "executive-pro": "Executive Pro",
      "creative-portfolio": "Creative Portfolio",
      "ats-optimized": "ATS Optimized",
      "cover-professional": "Professional Cover",
      "cover-modern": "Modern Cover",
    };

    setSelectedTemplate({
      id: templateId,
      name: templateNames[templateId] || "Unknown Template",
      type,
    });
    setCurrentView("resume-builder");
  };

  const handleDocumentComplete = () => {
    setCurrentView("document-preview");
  };

  const handleDocumentSaved = () => {
    setUserState({ ...userState, hasDocuments: true });
    setCurrentView("dashboard");
  };

  // Dashboard navigation
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "ats-analysis") {
      setCurrentView("ats-analysis");
    } else {
      setCurrentView("dashboard");
    }
  };

  const handleCreateNewDocument = () => {
    setCurrentView("document-type-selector");
  };

  const handleEditProfile = (profile: Profile) => {
    setCurrentView("resume-builder");
    setSelectedProfile(profile);
  };

  // Career growth navigation
  const handleCareerGrowthNavigation = (
    feature: "job-matching" | "career-intelligence" | "interview-prep",
  ) => {
    switch (feature) {
      case "job-matching":
        setCurrentView("job-matching");
        break;
      case "career-intelligence":
        setCurrentView("career-intelligence");
        break;
      case "interview-prep":
        setCurrentView("interview-prep");
        break;
    }
  };

  // Back navigation handlers
  const handleBackToDashboard = () => {
    setCurrentView(userState.hasDocuments ? "dashboard" : "dashboard-empty");
    setActiveTab("dashboard");
    setSelectedProfile(null);
    setSelectedTemplate(null);
    setSelectedDocumentType(null);
  };

  const handleBackToCareerHub = () => {
    setCurrentView("career-growth-hub");
  };

  const handleBackToTemplates = () => {
    setCurrentView("template-selector");
    setSelectedTemplate(null);
  };

  const handleBackToJobInput = () => {
    setCurrentView("job-input");
  };

  const handleBackToDocumentType = () => {
    setCurrentView("document-type-selector");
    setSelectedDocumentType(null);
  };

  const handleBackToUpload = () => {
    setCurrentView("upload-resume");
  };

  const handleBackToAuth = () => {
    setCurrentView("auth");
  };

  // Demo navigation - essential wireframe views (reduced for performance)
  const demoViews = [
    { id: "auth", label: "Authentication", icon: LogIn, description: "Login and signup screens" },
    {
      id: "upload-resume",
      label: "Upload Documents",
      icon: Upload,
      description: "Document upload onboarding",
    },
    {
      id: "profile-editor",
      label: "Profile Editor",
      icon: Users,
      description: "AI-powered profile creation",
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      description: "Profile management dashboard",
    },
    {
      id: "document-type-selector",
      label: "Document Type",
      icon: FileText,
      description: "Choose document type to create",
    },
    {
      id: "job-input",
      label: "Job Analysis",
      icon: Target,
      description: "Job URL or description input",
    },
    {
      id: "ats-analysis",
      label: "ATS Analysis",
      icon: BarChart3,
      description: "AI-powered resume scoring",
    },
    {
      id: "template-selector",
      label: "Template Selector",
      icon: Layout,
      description: "Resume & cover letter templates",
    },
    {
      id: "resume-builder",
      label: "Document Editor",
      icon: FileText,
      description: "AI-enhanced document editing",
    },
    {
      id: "document-preview",
      label: "Document Preview",
      icon: Eye,
      description: "Preview and export documents",
    },
    {
      id: "career-growth-hub",
      label: "Career Growth Hub",
      icon: TrendingUp,
      description: "AI career growth tools",
    },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      description: "Account and preferences",
    },
    {
      id: "component-library",
      label: "Component Library",
      icon: Layers,
      description: "Complete design system",
    },
  ];

  const handleDemoNavigation = (viewId: string) => {
    // Reset state appropriately for demo
    if (viewId === "dashboard" && !userState.hasDocuments) {
      setUserState({ ...userState, hasDocuments: true });
    }
    if (viewId === "template-selector" || viewId === "document-preview") {
      setSelectedTemplate({ id: "modern-minimal", name: "Modern Minimal", type: "resume" });
    }

    setCurrentView(viewId as View);

    // Set appropriate tab for certain views
    if (viewId === "ats-analysis") {
      setActiveTab("ats-analysis");
    } else if (viewId === "dashboard" || viewId === "dashboard-empty") {
      setActiveTab("dashboard");
    }
  };

  const getCurrentViewInfo = () => {
    const currentViewData = demoViews.find((view) => view.id === currentView);
    return currentViewData || demoViews[0];
  };

  const renderContent = () => {
    return (
      <Suspense fallback={<LoadingFallback />}>
        {(() => {
          switch (currentView) {
            case "auth":
              return <Auth onLogin={handleLogin} />;

            case "upload-resume":
              return <UploadResume onNext={handleUploadComplete} onBack={handleBackToAuth} />;

            case "profile-editor":
              return <ProfileEditor onNext={handleProfileComplete} onBack={handleBackToUpload} />;

            case "dashboard-empty":
              return (
                <Dashboard
                  onCreateProfile={handleCreateFirstDocument}
                  onEditProfile={handleEditProfile}
                  isEmpty={true}
                />
              );

            case "dashboard":
              return (
                <Dashboard
                  onCreateProfile={handleCreateNewDocument}
                  onEditProfile={handleEditProfile}
                  onNavigateToCareerGrowth={() => setCurrentView("career-growth-hub")}
                  onNavigateToSettings={() => setCurrentView("settings")}
                />
              );

            case "document-type-selector":
              return (
                <DocumentTypeSelector
                  onSelectType={handleDocumentTypeSelection}
                  onBack={handleBackToDashboard}
                />
              );

            case "job-input":
              return <JobInput onAnalyze={handleJobAnalysis} onBack={handleBackToDocumentType} />;

            case "ats-analysis":
              return (
                <ATSAnalysisDashboard
                  onBack={handleBackToJobInput}
                  onNext={handleATSAnalysisComplete}
                />
              );

            case "template-selector":
              return (
                <TemplateSelector
                  onBack={handleBackToDashboard}
                  onSelectTemplate={handleTemplateSelection}
                />
              );

            case "resume-builder":
              return (
                <ResumeBuilder
                  onBack={selectedTemplate ? handleBackToTemplates : handleBackToDashboard}
                  onNext={handleDocumentComplete}
                  profileName={selectedProfile?.name}
                />
              );

            case "document-preview":
              return (
                <DocumentPreview
                  onBack={handleBackToTemplates}
                  onEdit={() => setCurrentView("resume-builder")}
                  onSave={handleDocumentSaved}
                  documentType={selectedTemplate?.type || "resume"}
                  templateName={selectedTemplate?.name || "Modern Minimal"}
                />
              );

            case "career-growth-hub":
              return (
                <CareerGrowthHub
                  onNavigate={handleCareerGrowthNavigation}
                  onBack={handleBackToDashboard}
                />
              );

            case "job-matching":
              return <JobMatching onBack={handleBackToCareerHub} />;

            case "career-intelligence":
              return <CareerIntelligence onBack={handleBackToCareerHub} />;

            case "interview-prep":
              return <InterviewPrep onBack={handleBackToCareerHub} />;

            case "settings":
              return <Settings onBack={handleBackToDashboard} />;

            case "loading-states":
              return <LoadingStates onBack={handleBackToDashboard} />;

            case "component-library":
              return (
                <ComponentLibrary
                  onBack={handleBackToDashboard}
                  onNavigateToAnimated={() => setCurrentView("animated-showcase")}
                  onNavigateToComplex={() => setCurrentView("complex-components")}
                  onNavigateToM3Colors={() => setCurrentView("m3-colors")}
                />
              );

            case "design-tokens":
              return <DesignTokenExample />;

            case "animated-showcase":
              return <AnimatedShowcase onBack={() => setCurrentView("component-library")} />;

            case "state-demo":
              return <StateDemoShowcase onBack={() => setCurrentView("component-library")} />;

            case "standardized-loading":
              return (
                <StandardizedLoadingStatesDemo onBack={() => setCurrentView("component-library")} />
              );

            case "aurora-showcase":
              return <AuroraShowcase onBack={() => setCurrentView("component-library")} />;

            case "complex-components":
              return (
                <ComplexComponentsShowcase onBack={() => setCurrentView("component-library")} />
              );

            case "m3-colors":
              return <M3ColorSystemShowcase onBack={() => setCurrentView("component-library")} />;

            default:
              return (
                <Dashboard
                  onCreateProfile={handleCreateNewDocument}
                  onEditProfile={handleEditProfile}
                />
              );
          }
        })()}
      </Suspense>
    );
  };

  // Get current view info for display
  const currentViewInfo = getCurrentViewInfo();
  const CurrentViewIcon = currentViewInfo.icon;

  // Only show sidebar for authenticated views
  const showSidebar =
    userState.isAuthenticated && !["auth", "upload-resume", "profile-editor"].includes(currentView);
  const showNavbar =
    userState.isAuthenticated && !["auth", "upload-resume", "profile-editor"].includes(currentView);

  return (
    <ThemeWrapper defaultMode="dark" enableGlassMorphism={true} enableAnimations={true}>
      <div className="h-screen bg-background text-foreground flex">
        {showSidebar && (
          <Sidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        )}
        <div className="flex-1 flex flex-col relative">
          {showNavbar && (
            <Navbar
              onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
              onSearch={(query) => console.log("Search:", query)}
              onProfileClick={() => setCurrentView("settings")}
              onSettingsClick={() => setCurrentView("settings")}
              notificationCount={3}
              showMobileMenu={showSidebar}
            />
          )}
          <div className="flex-1 overflow-auto">{renderContent()}</div>
        </div>

        {/* Enhanced Demo Navigation */}
        {showDemoNav && (
          <div className="fixed bottom-4 right-4 z-50">
            <Card className="bg-card border-border shadow-xl max-w-sm">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-medium text-card-foreground">
                      Wireframe Navigator
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDemoNav(false)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-md">
                    <CurrentViewIcon className="w-3 h-3 text-primary" />
                    <div>
                      <p className="text-xs font-medium text-primary">{currentViewInfo.label}</p>
                      <p className="text-xs text-muted-foreground">{currentViewInfo.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto">
                  <p className="text-xs text-muted-foreground mb-2">Complete User Flow:</p>
                  {demoViews.slice(0, 10).map((view) => {
                    const ViewIcon = view.icon;
                    return (
                      <Button
                        key={view.id}
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start gap-2 h-8 text-xs ${
                          currentView === view.id
                            ? "bg-primary/20 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                        onClick={() => handleDemoNavigation(view.id)}
                      >
                        <ViewIcon className="w-3 h-3" />
                        {view.label}
                        {currentView === view.id && (
                          <Badge variant="secondary" className="ml-auto h-4 px-1 text-xs">
                            Current
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                  {demoViews.length > 10 && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">More views available...</p>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">Career Copilot user journey demo</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Show Demo Nav Button when hidden */}
        {!showDemoNav && (
          <Button
            className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 p-0 bg-primary hover:bg-primary/90"
            onClick={() => setShowDemoNav(true)}
          >
            <Navigation className="w-5 h-5" />
          </Button>
        )}
      </div>
    </ThemeWrapper>
  );
}
