/**
 * ELECTRIC ALCHEMIST: USAGE GUIDELINES SECTION
 *
 * Documentation section with usage guidelines and best practices.
 */

import React from 'react';
import { Card } from '@/components/ui';
import { ComponentSection } from './ComponentDemo';

export function UsageGuidelinesSection() {
  return (
    <ComponentSection
      title="Usage Guidelines"
      description="Best practices and guidelines for using components effectively"
    >
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-hero text-base font-medium text-on-surface mb-3">
              Color System
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-primary-container" />
                <span className="text-human text-sm text-on-surface">
                  Primary - Actions & Branding
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-error-container" />
                <span className="text-human text-sm text-on-surface">
                  Error - Errors & Warnings
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-tertiary-container" />
                <span className="text-human text-sm text-on-surface">
                  Tertiary - Expressive Accents
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-hero text-base font-medium text-on-surface mb-3">
              Typography
            </h4>
            <div className="space-y-2">
              <p className="text-hero text-lg text-on-surface">Hero - Headings</p>
              <p className="text-human text-base text-on-surface">Human - Body Text</p>
              <p className="text-data text-sm text-on-surface-variant uppercase">
                DATA - SYSTEM TEXT
              </p>
              <p className="text-ai text-sm text-on-surface">AI - UI Labels</p>
            </div>
          </div>
        </div>
      </Card>
    </ComponentSection>
  );
}

export default UsageGuidelinesSection;

