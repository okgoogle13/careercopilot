import React, { useState, useEffect } from 'react';
import { Settings, FileText, Briefcase, Target, BarChart3, Layout } from 'lucide-react';
import { Button } from './ui/button';
import { CareerCopilotLogo } from './CareerCopilotLogo';

type TabValue = 'dashboard' | 'documents' | 'opportunities' | 'applications' | 'analysis';

interface AppShellProps {
  children?: React.ReactNode;
  activeTab?: TabValue;
  onTabChange?: (tab: TabValue) => void;
  onSettingsClick?: () => void;
}

export function AppShell({
  children,
  activeTab = 'dashboard',
  onTabChange,
  onSettingsClick,
}: AppShellProps) {
  const handleTabClick = (tab: TabValue) => {
    onTabChange?.(tab);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-background)' }}>
      {/* Top Bar - Minimal & Bold */}
      <header
        className="sticky top-0 z-50 border-b transition-all duration-300"
        style={{
          background: 'var(--surface-container)',
          borderColor: 'rgba(167, 139, 250, 0.1)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <CareerCopilotLogo />
            <div className="flex flex-col">
              <span
                className="font-semibold tracking-tight"
                style={{
                  color: 'var(--on-surface)',
                  fontSize: '1.25rem',
                }}
              >
                CareerCopilot
              </span>
              <span className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                AI-Powered Career Assistant
              </span>
            </div>
          </div>

          {/* Settings Icon Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className="rounded-full transition-all duration-300 hover:scale-110"
            style={{
              color: 'var(--on-surface-variant)',
            }}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Tabs Navigation - Sticky Below Top Bar */}
      <div
        className="sticky top-[73px] z-40 border-b"
        style={{
          background: 'var(--surface-container)',
          borderColor: 'rgba(167, 139, 250, 0.1)',
        }}
      >
        <div className="px-6">
          <div className="flex items-center h-14 gap-1">
            <button
              onClick={() => handleTabClick('dashboard')}
              className="flex items-center gap-2 px-6 h-full border-b-2 transition-all duration-300 bg-transparent cursor-pointer"
              style={{
                borderColor: activeTab === 'dashboard' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'dashboard' ? 'var(--primary)' : 'var(--on-surface-variant)',
                background: activeTab === 'dashboard' ? 'rgba(167, 139, 250, 0.05)' : 'transparent',
              }}
            >
              <Layout className="w-4 h-4" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => handleTabClick('documents')}
              className="flex items-center gap-2 px-6 h-full border-b-2 transition-all duration-300 bg-transparent cursor-pointer"
              style={{
                borderColor: activeTab === 'documents' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'documents' ? 'var(--primary)' : 'var(--on-surface-variant)',
                background: activeTab === 'documents' ? 'rgba(167, 139, 250, 0.05)' : 'transparent',
              }}
            >
              <FileText className="w-4 h-4" />
              <span className="font-medium">Documents</span>
            </button>

            <button
              onClick={() => handleTabClick('opportunities')}
              className="flex items-center gap-2 px-6 h-full border-b-2 transition-all duration-300 bg-transparent cursor-pointer"
              style={{
                borderColor: activeTab === 'opportunities' ? 'var(--primary)' : 'transparent',
                color:
                  activeTab === 'opportunities' ? 'var(--primary)' : 'var(--on-surface-variant)',
                background:
                  activeTab === 'opportunities' ? 'rgba(167, 139, 250, 0.05)' : 'transparent',
              }}
            >
              <Briefcase className="w-4 h-4" />
              <span className="font-medium">Opportunities</span>
            </button>

            <button
              onClick={() => handleTabClick('applications')}
              className="flex items-center gap-2 px-6 h-full border-b-2 transition-all duration-300 bg-transparent cursor-pointer"
              style={{
                borderColor: activeTab === 'applications' ? 'var(--primary)' : 'transparent',
                color:
                  activeTab === 'applications' ? 'var(--primary)' : 'var(--on-surface-variant)',
                background:
                  activeTab === 'applications' ? 'rgba(167, 139, 250, 0.05)' : 'transparent',
              }}
            >
              <Target className="w-4 h-4" />
              <span className="font-medium">Applications</span>
            </button>

            <button
              onClick={() => handleTabClick('analysis')}
              className="flex items-center gap-2 px-6 h-full border-b-2 transition-all duration-300 bg-transparent cursor-pointer"
              style={{
                borderColor: activeTab === 'analysis' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'analysis' ? 'var(--primary)' : 'var(--on-surface-variant)',
                background: activeTab === 'analysis' ? 'rgba(167, 139, 250, 0.05)' : 'transparent',
              }}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
