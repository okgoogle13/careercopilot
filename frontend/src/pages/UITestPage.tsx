import React, { useState } from 'react';
import {
  Dashboard,
  ATSAnalysisDashboard,
  ResumeBuilder,
  Sidebar,
} from '../components';

const UITestPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentView(tab === 'ats-analysis' ? 'ats-analysis' : 'dashboard');
  };

  const handleCreateProfile = () => {
    setCurrentView('resume-builder');
  };

  const handleEditProfile = () => {
    setCurrentView('resume-builder');
  };

  const handleBack = () => {
    setCurrentView('dashboard');
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'ats-analysis':
        return <ATSAnalysisDashboard onBack={handleBack} />;
      case 'resume-builder':
        return <ResumeBuilder onBack={handleBack} />;
      case 'dashboard':
      default:
        return (
          <Dashboard
            onCreateProfile={handleCreateProfile}
            onEditProfile={handleEditProfile}
          />
        );
    }
  };

  return (
    <div className="h-screen bg-background text-foreground flex dark">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
};

export default UITestPage;
