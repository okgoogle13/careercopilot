import React from 'react';
import { Card } from '@/components/ui/ElectricCard';
import { Button } from '@/components/ui/Button';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-hero text-4xl">Electric Alchemist Design System</h1>
          <p className="text-human text-lg max-w-2xl mx-auto">
            Visual verification of the core components with Tactile Press physics and Deep Violet Void aesthetics.
          </p>
        </div>

        {/* Button Grid */}
        <div className="space-y-6">
          <h2 className="text-hero text-2xl">Button Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="default">Default Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Small Button</Button>
            <Button size="lg">Large Button</Button>
            <Button variant="link">Link Button</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>

        {/* Card Grid */}
        <div className="space-y-6">
          <h2 className="text-hero text-2xl">Card Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Default Card */}
            <Card>
              <h3 className="text-hero text-xl mb-2">Default Card</h3>
              <p className="text-human">
                A standard Bento card with the Deep Violet Void background and tactile physics disabled.
              </p>
            </Card>

            {/* Interactive Card */}
            <Card variant="interactive">
              <h3 className="text-hero text-xl mb-2">Interactive Card</h3>
              <p className="text-human">
                This card has Tactile Press physics - try hovering and clicking to feel the press-in effect.
              </p>
            </Card>

            {/* Card with Pop-out Graphic */}
            <Card 
              variant="interactive"
              popOutGraphic={
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-on-primary-container text-2xl">✦</span>
                </div>
              }
            >
              <h3 className="text-hero text-xl mb-2">Hero Card</h3>
              <p className="text-human">
                Features a pop-out graphic that animates on hover with parallax effects.
              </p>
            </Card>

            {/* Data Card */}
            <Card variant="interactive">
              <h3 className="text-data text-sm uppercase tracking-wider mb-2">Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-data">Performance</span>
                  <span className="text-data hover:animate-glitch">98.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-data">Efficiency</span>
                  <span className="text-data hover:animate-glitch">92.1%</span>
                </div>
              </div>
            </Card>

            {/* Hologram Card */}
            <Card variant="interactive">
              <div className="text-center space-y-4">
                <div className="text-hologram text-6xl">⚡</div>
                <h3 className="text-hero text-xl">Power Mode</h3>
                <p className="text-human text-sm">
                  Activating the Electric Alchemist transformation sequence.
                </p>
              </div>
            </Card>

            {/* Content-heavy Card */}
            <Card variant="interactive">
              <h3 className="text-hero text-xl mb-3">Typography Test</h3>
              <div className="space-y-3">
                <p className="text-human">
                  This demonstrates the <span className="text-data">four-tier</span> typography system in action.
                </p>
                <div className="text-data text-xs">
                  <div>• Hologram: Expressive elements</div>
                  <div>• Hero: Architectural headers</div>
                  <div>• Human: Content flow</div>
                  <div>• Data: System metadata</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Combined Demo */}
        <div className="space-y-6">
          <h2 className="text-hero text-2xl">Combined Components</h2>
          <Card variant="interactive">
            <div className="space-y-4">
              <h3 className="text-hero text-xl">Dashboard Preview</h3>
              <p className="text-human">
                A preview of how cards and buttons work together in a real interface.
              </p>
              <div className="flex gap-3 pt-4">
                <Button variant="default">Primary Action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
