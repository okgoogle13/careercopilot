/**
 * ELECTRIC ALCHEMIST: HERO BANNER COMPONENT
 *
 * Hero banner section using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeatureHighlights } from './FeatureHighlights';

interface HeroBannerProps {
  onGetStarted?: () => void;
  onWatchDemo?: () => void;
}

export function HeroBanner({ onGetStarted, onWatchDemo }: HeroBannerProps) {
  return (
    <div className="py-20">
      <div className="max-w-6xl mx-auto">
        {/* Main Hero Content */}
        <div className="text-center mb-16 bg-[var(--color-surface-container-low)] lg:p-12 p-8 rounded-leaf border border-[var(--color-border)] relative overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none"></div>
          <h1 className="text-hero text-4xl md:text-6xl font-bold mb-6 relative z-10">
            Land Your Dream Job with AI
          </h1>

          <p className="text-human text-xl md:text-2xl text-on-surface-variant mb-8">
            Create compelling applications, track your progress, and ace your interviews
            with our AI-powered career copilot
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="default" size="lg" onClick={onGetStarted} className="px-8 py-3">
              Get Started Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>

            <Button variant="outline" size="lg" onClick={onWatchDemo} className="px-8 py-3">
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Feature Highlights */}
        <FeatureHighlights />
      </div>
    </div>
  );
}

export default HeroBanner;

