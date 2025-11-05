import { ArrowLeft } from '@mui/icons-material';
import { Box } from '@mui/material';
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
      <div sx={{
      minHeight: "100vh",
      "bg-background": true,
      p: 6
    }}>
        <div sx={{
      "max-w-7xl": true,
      "mx-auto": true
    }}>
          {/* Header */}
          <div sx={{
      mb: 8
    }}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      mb: 4
    }}>
              <Button variant="text" size="small" onClick={onBack} sx={{
      gap: 2
    }}>
                <ArrowLeft sx={{
      "w-4": true,
      "h-4": true
    }} />
                Back to Dashboard
              </Button>
            </div>
            <h1 sx={{
      mb: 2
    }}>Career Copilot Component Library</h1>
            <p sx={{
      "text-muted-foreground": true
    }}>
              A comprehensive design system showcasing all reusable components used throughout the
              Career Copilot platform
            </p>
          </div>

          <div sx={{
      "space-y-12": true
    }}>
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
