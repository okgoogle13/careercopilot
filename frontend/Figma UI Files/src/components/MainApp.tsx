import React, { useState } from 'react';
import { AppShell } from './AppShell';
import { DashboardView } from './DashboardView';
import { DocumentsView } from './DocumentsView';
import { OpportunitiesView } from './OpportunitiesView';
import { ApplicationsView } from './ApplicationsView';
import { AnalysisView } from './AnalysisView';

type TabValue = 'dashboard' | 'documents' | 'opportunities' | 'applications' | 'analysis';

interface MainAppProps {
  onSettingsClick?: () => void;
  onCreateDocument?: () => void;
}

export function MainApp({ 
  onSettingsClick,
  onCreateDocument 
}: MainAppProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('dashboard');

  const handleTabChange = (tab: TabValue) => {
    setActiveTab(tab);
  };

  const handleCreateDocument = () => {
    // Navigate to documents tab when creating a new document
    setActiveTab('documents');
    onCreateDocument?.();
  };

  const handleNavigateToOpportunities = () => {
    setActiveTab('opportunities');
  };

  const handleNavigateToApplications = () => {
    setActiveTab('applications');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onCreateDocument={handleCreateDocument}
            onViewAnalytics={() => setActiveTab('analysis')}
            onNavigateToOpportunities={handleNavigateToOpportunities}
            onNavigateToApplications={handleNavigateToApplications}
          />
        );
      
      case 'documents':
        return (
          <DocumentsView
            onCreateDocument={onCreateDocument}
          />
        );
      
      case 'opportunities':
        return (
          <OpportunitiesView
            onAnalyzeJob={() => console.log('Analyze job')}
          />
        );
      
      case 'applications':
        return (
          <ApplicationsView
            onAddApplication={() => console.log('Add application')}
          />
        );
      
      case 'analysis':
        return (
          <AnalysisView
            onAnalyzeDocument={() => console.log('Analyze document')}
          />
        );
      
      default:
        return <DashboardView onCreateDocument={handleCreateDocument} />;
    }
  };

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onSettingsClick={onSettingsClick}
    >
      {renderTabContent()}
    </AppShell>
  );
}
