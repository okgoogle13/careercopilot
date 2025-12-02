/**
 * ELECTRIC ALCHEMIST: TEST KITCHEN
 * Version: 4.2
 *
 * Comprehensive showcase of the Electric Alchemist Design System:
 * - Deep Violet Void background with dot grid
 * - Poly-Body Typography (4 tiers)
 * - Electric Button (5 variants)
 * - Electric Card (Bento layout, Pop-Out graphics)
 * - Tactile Press physics
 */

import * as React from 'react';
import { ElectricButton, ElectricCard, PopOutGraphic } from '../components/electric';

export function ElectricAlchemistTestKitchen() {
  return (
    <div className="architectural-shell min-h-screen p-8">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-hologram mb-4">Electric Alchemist</h1>
        <p className="text-hero text-hero-lg">Design System v4.2</p>
        <p className="text-ai mt-4 max-w-2xl mx-auto">
          A Solid State Expressive design system featuring Poly-Body typography,
          Tactile Press physics, and Bento card layouts.
        </p>
      </header>

      {/* Typography Showcase */}
      <section className="mb-16">
        <h2 className="text-hero mb-8">Poly-Body Typography Matrix</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tier 1: Hologram */}
          <ElectricCard variant="hero">
            <div className="text-data mb-2">TIER 1: HOLOGRAM</div>
            <div className="text-hologram">Magic ✨</div>
            <p className="text-ai mt-4">
              Nabla Color Font - Hyper-expressive gamification layer
            </p>
          </ElectricCard>

          {/* Tier 2: Hero */}
          <ElectricCard variant="default">
            <div className="text-data mb-2">TIER 2: HERO</div>
            <div className="text-hero">ARCHITECTURAL</div>
            <p className="text-ai mt-4">
              Roboto Flex - Ultra-Wide, Tall Caps, Heavy Weight
            </p>
          </ElectricCard>

          {/* Tier 3: Voice (Human) */}
          <ElectricCard variant="default">
            <div className="text-data mb-2">TIER 3A: HUMAN VOICE</div>
            <p className="text-human">
              This is the human voice tier. It uses Roboto Serif with optical
              correction for dark mode reading comfort.
            </p>
            <p className="text-ai mt-4">
              Roboto Serif - Content flow, user input
            </p>
          </ElectricCard>

          {/* Tier 3: Voice (AI) */}
          <ElectricCard variant="default">
            <div className="text-data mb-2">TIER 3B: AI VOICE</div>
            <p className="text-ai">
              This is the AI voice tier. Efficient, narrow width, optimized for
              system responses and UI labels.
            </p>
            <p className="text-ai mt-4">
              Roboto Flex - System output, UI labels
            </p>
          </ElectricCard>

          {/* Tier 4: Data */}
          <ElectricCard variant="default">
            <div className="text-data mb-2">TIER 4: DATA / SYSTEM</div>
            <div className="text-data">
              TIMESTAMP: 2025-11-23T15:30:00Z
              <br />
              STATUS: ACTIVE
              <br />
              BUILD: v4.2.0
            </div>
            <p className="text-ai mt-4">
              Roboto Flex Lo-Fi - Hover for glitch effect (weight jumps to 600)
            </p>
          </ElectricCard>
        </div>
      </section>

      {/* Button Showcase */}
      <section className="mb-16">
        <h2 className="text-hero mb-8">Electric Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <ElectricButton variant="default" size="sm">
            Default Small
          </ElectricButton>
          <ElectricButton variant="default" size="md">
            Default Medium
          </ElectricButton>
          <ElectricButton variant="default" size="lg">
            Default Large
          </ElectricButton>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          <ElectricButton variant="default">Primary</ElectricButton>
          <ElectricButton variant="secondary">Secondary</ElectricButton>
          <ElectricButton variant="outline">Outline</ElectricButton>
          <ElectricButton variant="ghost">Ghost</ElectricButton>
          <ElectricButton variant="tertiary">Tertiary Accent</ElectricButton>
        </div>

        <div className="mt-6">
          <ElectricButton variant="default" disabled>
            Disabled State
          </ElectricButton>
        </div>
      </section>

      {/* Card Showcase */}
      <section className="mb-16">
        <h2 className="text-hero mb-8">Bento Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Standard Card */}
          <ElectricCard variant="default">
            <h3 className="text-hero text-hero-sm mb-4">STANDARD CARD</h3>
            <p className="text-human">
              Surface Container Low background with outline variant border.
              Standard padding: 24px.
            </p>
            <div className="text-data mt-4">CATEGORY: UTILITY</div>
          </ElectricCard>

          {/* Interactive Card */}
          <ElectricCard variant="default" interactive>
            <h3 className="text-hero text-hero-sm mb-4">INTERACTIVE</h3>
            <p className="text-human">
              Hover to feel the Tactile Press physics (scale 0.98). Tap for
              scale 0.95.
            </p>
            <div className="text-data mt-4">HOVER ME ↗</div>
          </ElectricCard>

          {/* Hero Card with Pop-Out */}
          <ElectricCard
            variant="hero"
            interactive
            popOutGraphic={
              <PopOutGraphic>
                <div className="text-6xl">🚀</div>
              </PopOutGraphic>
            }
          >
            <h3 className="text-hero text-hero-sm text-hero-irregular mb-4">
              POP-OUT CARD
            </h3>
            <p className="text-ai">
              Primary Container background with gradient scrim. Notice the
              irregular rotation on the title.
            </p>
            <div className="text-data mt-4">STATUS: FEATURED</div>
          </ElectricCard>
        </div>
      </section>

      {/* Color Palette */}
      <section className="mb-16">
        <h2 className="text-hero mb-8">Deep Violet Void Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-card bg-surface border border-outline-variant">
            <div className="text-data mb-2">SURFACE</div>
            <div className="text-ai">#141218</div>
          </div>
          <div className="p-6 rounded-card bg-surface-container-low border border-outline-variant">
            <div className="text-data mb-2">CONTAINER LOW</div>
            <div className="text-ai">#1D1B20</div>
          </div>
          <div className="p-6 rounded-card bg-surface-container border border-outline-variant">
            <div className="text-data mb-2">CONTAINER</div>
            <div className="text-ai">#211F26</div>
          </div>
          <div className="p-6 rounded-card bg-surface-container-high border border-outline-variant">
            <div className="text-data mb-2">CONTAINER HIGH</div>
            <div className="text-ai">#2B2930</div>
          </div>
          <div className="p-6 rounded-card bg-primary-container text-on-primary-container border border-primary-container">
            <div className="text-data mb-2">PRIMARY</div>
            <div className="text-ai">#EADDFF</div>
          </div>
          <div className="p-6 rounded-card bg-tertiary-container text-on-tertiary border border-tertiary-container">
            <div className="text-data mb-2">TERTIARY</div>
            <div className="text-ai">#FFD8E4</div>
          </div>
        </div>
      </section>

      {/* Motion Physics */}
      <section className="mb-16">
        <h2 className="text-hero mb-8">Motion Physics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ElectricCard variant="default">
            <h3 className="text-hero text-hero-sm mb-4">TACTILE PRESS</h3>
            <p className="text-human mb-4">
              Buttons and interactive cards press <em>in</em> instead of
              lifting up. Hover: scale 0.98, Tap: scale 0.95.
            </p>
            <ElectricButton variant="default">Try Me</ElectricButton>
          </ElectricCard>

          <ElectricCard variant="default">
            <h3 className="text-hero text-hero-sm mb-4">POP-OUT PARALLAX</h3>
            <p className="text-human mb-4">
              Graphics physically break the card boundary. Hover for y: -15,
              rotate: 5deg, scale: 1.1.
            </p>
            <PopOutGraphic>
              <div className="text-4xl bg-tertiary-container rounded-full p-4">
                ⚡
              </div>
            </PopOutGraphic>
          </ElectricCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center mt-16">
        <div className="text-data">
          ELECTRIC ALCHEMIST DESIGN SYSTEM v4.2
        </div>
        <div className="text-ai mt-2">
          Solid State Expressive | Poly-Body Matrix
        </div>
      </footer>
    </div>
  );
}

export default ElectricAlchemistTestKitchen;
