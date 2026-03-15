/**
 * Voice Profile Management Section
 *
 * Container component for voice profile feature.
 * Provides heading, description, and integration point for all voice profile components.
 */

import { Wand2 } from 'lucide-react';
import { VoiceProfileCreationPanel } from './VoiceProfileCreationPanel';

export interface VoiceProfileManagementSectionProps {
  onProfileCreated?: () => void;
}

/**
 * Full voice profile management section for the profile page.
 * Includes heading, description, and creation panel.
 */
export function VoiceProfileManagementSection({
  onProfileCreated,
}: VoiceProfileManagementSectionProps) {
  return (
    <section className="space-y-6 w-full">
      {/* Section Header */}
      <div className="flex items-baseline gap-3">
        <div className="flex items-center gap-2">
          <Wand2
            className="w-5 h-5"
            style={{ color: 'var(--sys-color-solidarityRed-base)' }}
          />
          <h2
            style={{ color: 'var(--sys-color-paperWhite-base)' }}
            className="font-display text-2xl font-bold uppercase tracking-tight"
          >
            VOICE PROFILE
          </h2>
        </div>
        <div
          className="flex-1 h-px opacity-20"
          style={{ backgroundColor: 'var(--sys-color-concreteGrey-base)' }}
        />
      </div>

      {/* Description */}
      <p
        style={{ color: 'var(--sys-color-concreteGrey-base)' }}
        className="font-primary text-sm opacity-70 leading-relaxed max-w-prose"
      >
        Your voice profile captures your writing style, tone, and vocabulary level. This information
        helps us personalize generated content (cover letters, resumes, etc.) to match your
        authentic professional voice.
      </p>

      {/* Voice Profile Creation Panel */}
      <VoiceProfileCreationPanel onSuccess={onProfileCreated} />
    </section>
  );
}
