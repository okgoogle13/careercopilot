/**
 * Voice Profile Management Section
 *
 * Container component for the voice profile feature on /profile.
 * Canonical owner of voice_profile_capture affordances.
 */

import { Wand2 } from 'lucide-react';
import { VoiceProfileCreationPanel } from './VoiceProfileCreationPanel';

export interface VoiceProfileManagementSectionProps {
  onProfileCreated?: () => void;
}

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

      {/* Section Description — Reflection register: calm, grounded, trust-heavy */}
      <p
        style={{ color: 'var(--sys-color-concreteGrey-base)' }}
        className="font-primary text-sm opacity-70 leading-relaxed max-w-prose"
      >
        The way you write is already yours. Sharing a piece of it here means the documents we build
        together will sound like you — not like everyone else.
      </p>

      <VoiceProfileCreationPanel onSuccess={onProfileCreated} />
    </section>
  );
}
