/**
 * Voice Profile Status Card
 *
 * Displays the current voice profile characteristics (tone, vocabulary level)
 * or indicates when no profile exists yet.
 */

import { Zap } from 'lucide-react';

export interface VoiceProfileStatusCardProps {
  tone?: string;
  vocabularyLevel?: string;
  createdAt?: string;
  loading?: boolean;
}

/**
 * Card showing current voice profile characteristics or empty state.
 *
 * @param tone - The identified tone of the user's writing
 * @param vocabularyLevel - The assessed vocabulary sophistication
 * @param createdAt - When the voice profile was created
 * @param loading - Whether profile is being loaded
 */
export function VoiceProfileStatusCard({
  tone,
  vocabularyLevel,
  createdAt,
  loading = false,
}: VoiceProfileStatusCardProps) {
  const hasProfile = tone && vocabularyLevel;

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: 'var(--sys-color-charcoalBackground-steps-2)',
          borderColor: 'var(--sys-color-concreteGrey-base)',
          borderRadius: 'var(--sys-shape-placardTorn01)',
        }}
        className="p-6 border-2 border-opacity-20"
      >
        <div
          style={{
            color: 'var(--sys-color-solidarityRed-base)',
            animation: 'pulse 2s infinite',
          }}
          className="text-sm font-mono uppercase tracking-widest"
        >
          Loading profile...
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div
        style={{
          backgroundColor: 'var(--sys-color-charcoalBackground-steps-1)',
          borderColor: 'var(--sys-color-concreteGrey-base)',
          borderRadius: 'var(--sys-shape-placardTorn01)',
        }}
        className="p-6 border-2 border-dashed border-opacity-30 text-center"
      >
        <div className="flex justify-center mb-4">
          <Zap
            className="w-6 h-6"
            style={{ color: 'var(--sys-color-concreteGrey-base)' }}
          />
        </div>
        <p
          style={{ color: 'var(--sys-color-concreteGrey-base)' }}
          className="text-sm font-mono uppercase tracking-widest opacity-70"
        >
          No Voice Profile Yet
        </p>
        <p
          style={{ color: 'var(--sys-color-paperWhite-base)' }}
          className="text-xs mt-2 opacity-60 font-primary leading-relaxed"
        >
          Submit a writing sample below to create your voice profile.
        </p>
      </div>
    );
  }

  // Has profile - display characteristics
  return (
    <div
      style={{
        backgroundColor: 'var(--sys-color-charcoalBackground-steps-2)',
        borderColor: 'var(--sys-color-inkGold-base)',
        borderRadius: 'var(--sys-shape-placardTorn01)',
      }}
      className="p-6 border-2 border-opacity-30"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Zap
          className="w-5 h-5"
          style={{ color: 'var(--sys-color-solidarityRed-base)' }}
        />
        <h3
          style={{ color: 'var(--sys-color-paperWhite-base)' }}
          className="font-display text-lg font-bold uppercase tracking-tight"
        >
          Your Voice Profile
        </h3>
      </div>

      {/* Profile attributes */}
      <div className="space-y-4">
        {/* Tone */}
        <div>
          <label
            style={{ color: 'var(--sys-color-concreteGrey-base)' }}
            className="block text-xs font-mono uppercase tracking-widest mb-2 opacity-70"
          >
            Writing Tone
          </label>
          <p
            style={{ color: 'var(--sys-color-inkGold-base)' }}
            className="font-primary text-base font-medium"
          >
            {tone}
          </p>
        </div>

        {/* Vocabulary Level */}
        <div>
          <label
            style={{ color: 'var(--sys-color-concreteGrey-base)' }}
            className="block text-xs font-mono uppercase tracking-widest mb-2 opacity-70"
          >
            Vocabulary Level
          </label>
          <p
            style={{ color: 'var(--sys-color-signalGreen-base)' }}
            className="font-primary text-base font-medium"
          >
            {vocabularyLevel}
          </p>
        </div>

        {/* Created date */}
        {createdAt && (
          <div className="pt-4 border-t border-concreteGrey/20">
            <p
              style={{ color: 'var(--sys-color-concreteGrey-base)' }}
              className="text-xs opacity-50 font-mono"
            >
              Created {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
