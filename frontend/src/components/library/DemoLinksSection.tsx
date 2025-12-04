/**
 * ELECTRIC ALCHEMIST: DEMO LINKS SECTION
 *
 * Documentation section with links to interactive demos.
 */

import React from 'react';
import { Sparkles, Play } from 'lucide-react';
import { Button } from '@/components';
import { Card } from '@/components';
import { ComponentSection } from './ComponentDemo';

interface DemoLinksSectionProps {
  onNavigateToAnimated?: () => void;
}

export function DemoLinksSection({ onNavigateToAnimated }: DemoLinksSectionProps) {
  return (
    <ComponentSection
      title="Interactive Demos"
      description="Explore advanced component functionality with interactive demonstrations."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-container rounded-[8px]">
                <Sparkles className="h-6 w-6 text-on-primary-container" />
              </div>
              <div>
                <h3 className="text-hero text-base font-medium text-on-surface mb-1">
                  Animated Components
                </h3>
                <p className="text-human text-sm text-on-surface-variant">
                  Explore smooth animations and micro-interactions
                </p>
              </div>
            </div>
            <Button onClick={onNavigateToAnimated}>Explore</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary-container rounded-[8px]">
                <Play className="h-6 w-6 text-on-secondary" />
              </div>
              <div>
                <h3 className="text-hero text-base font-medium text-on-surface mb-1">
                  State Management Demo
                </h3>
                <p className="text-human text-sm text-on-surface-variant">
                  Simulate loading states and error scenarios
                </p>
              </div>
            </div>
            <Button variant="outline">Launch Demo</Button>
          </div>
        </Card>
      </div>
    </ComponentSection>
  );
}

export default DemoLinksSection;

