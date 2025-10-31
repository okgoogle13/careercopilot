import { ArrowLeft } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import React from 'react';

import { ButtonComponentsSection } from '../../library/ButtonComponentsSection';
import { CardComponentsSection } from '../../library/CardComponentsSection';
import { DemoLinksSection } from '../../library/DemoLinksSection';
import { DisplayComponentsSection } from '../../library/DisplayComponentsSection';
import { FormComponentsSection } from '../../library/FormComponentsSection';
import { InteractiveComponentsSection } from '../../library/InteractiveComponentsSection';
import { LayoutComponentsSection } from '../../library/LayoutComponentsSection';
import { UsageGuidelinesSection } from '../../library/UsageGuidelinesSection';
import { TooltipProvider } from '../../ui/tooltip';

interface ComponentLibraryProps {
  onBack: () => void;
  onNavigateToAnimated?: () => void;
}

export function ComponentLibrary({ onBack, onNavigateToAnimated }: ComponentLibraryProps) {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="text" size="small" onClick={onBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </div>
            <h1 className="mb-2">Career Copilot Component Library</h1>
            <p className="text-muted-foreground">
              A comprehensive design system showcasing all reusable components used throughout the
              Career Copilot platform
            </p>
          </div>

          <div className="space-y-12">
            <CardComponentsSection />
            <ButtonComponentsSection />
            <FormComponentsSection />
            <DisplayComponentsSection />
            <InteractiveComponentsSection />
            <LayoutComponentsSection />
            <DemoLinksSection onNavigateToAnimated={onNavigateToAnimated} />
            <UsageGuidelinesSection />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
