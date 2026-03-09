import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Organisms
import { Dashboard } from '../features/dashboard/Dashboard';
import { ApplicationTracker } from '../features/applications/ApplicationTracker';

// Atoms
import { Strike, Placard, Pebble, KeralaRageButton } from '../components/ui';

// JSON reports
import summaryData from '../../reports/summary.json';

const meta = {
  title: 'System/KR Solidarity Design System Phase 4',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic parsing of the JSON for the dashboard widget
const totalComponents = summaryData.totalComponents;
const migrated = summaryData.migrationSummary.migrated;
// We'll hardcode or mock the expressive ratios for the panel since summary.json doesn't export them perfectly yet
const atomsExpressive = '9/12';
const moleculesPlanned = '15';
const organismsHero = '2/5';

export const Phase4Showcase: Story = {
  render: () => (
    <div className="min-h-screen bg-[var(--sys-color-charcoalBackground-base)] text-[var(--sys-color-paperWhite-base)] p-8 font-primary">
      <header className="mb-12 border-b border-[var(--sys-color-concreteGrey-base)]/20 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-black text-[var(--sys-color-inkGold-base)] uppercase tracking-tighter mb-2">
            KR Solidarity Frontend Pipeline
          </h1>
          <p className="text-lg text-[var(--sys-color-concreteGrey-base)] font-field-note italic">
            Phase 4: Expressive rendering & Hero integration
          </p>
        </div>

        {/* Migration Status Panel */}
        <Placard
          elevation="raised"
          className="p-6 bg-[var(--sys-color-charcoalBackground-steps-1)] border-[var(--sys-color-inkGold-base)]/30 min-w-[300px]"
        >
          <h3 className="font-annotation text-xs uppercase tracking-[0.3em] text-[var(--sys-color-protestMetalBlue-base)] mb-4">
            Pipeline Analytics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-sm font-bold text-white/70">Atoms Expressive</span>
              <span className="font-mono text-[var(--sys-color-signalGreen-base)]">
                {atomsExpressive} done
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-sm font-bold text-white/70">Molecules</span>
              <span className="font-mono text-[var(--sys-color-stencilYellow-base)]">
                {moleculesPlanned} planned
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-sm font-bold text-white/70">Hero Organisms</span>
              <span className="font-mono text-[var(--sys-color-solidaritySmokeOrange-base)]">
                {organismsHero} done
              </span>
            </div>
            <div className="pt-2">
              <span className="block text-[10px] uppercase font-annotation text-white/40 tracking-widest text-right">
                Base Migration: {migrated}/{totalComponents} (100%)
              </span>
            </div>
          </div>
        </Placard>
      </header>

      <section className="space-y-16">
        <div>
          <h2 className="text-2xl font-bloom font-bold uppercase mb-6 text-[var(--sys-color-concreteGrey-base)]">
            Design Tokens (Atoms)
          </h2>
          <div className="flex flex-wrap gap-6 p-8 bg-black/20 rounded-xl border border-white/5 items-center">
            <Strike>Strike Button</Strike>
            <Pebble>Pebble Button</Pebble>
            <KeralaRageButton text="KeralaRage Primary" />
            <Placard
              elevation="floating"
              className="p-4 w-64 text-center"
            >
              Placard Floating Container
            </Placard>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bloom font-bold uppercase mb-6 text-[var(--sys-color-concreteGrey-base)]">
            Showcase: Dashboard Hero
          </h2>
          <div className="h-[800px] border-2 border-[var(--sys-color-inkGold-base)]/20 rounded-3xl overflow-hidden relative shadow-2xl">
            <Dashboard />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bloom font-bold uppercase mb-6 text-[var(--sys-color-concreteGrey-base)]">
            Showcase: Application Tracker Hero
          </h2>
          <div className="h-[800px] border-2 border-[var(--sys-color-kr-activistSmokeGreen-base)]/20 rounded-3xl overflow-hidden relative shadow-2xl">
            <ApplicationTracker />
          </div>
        </div>
      </section>
    </div>
  ),
};
