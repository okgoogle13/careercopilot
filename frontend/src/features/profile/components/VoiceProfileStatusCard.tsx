/**
 * Voice Profile Status Card
 *
 * Displays confirmation that a voice profile exists,
 * or a calm empty state when none has been established yet.
 */

import { Zap } from 'lucide-react';

export interface VoiceProfileStatusCardProps {
  profileSaved?: boolean;
  savedAt?: string;
  loading?: boolean;
}

export function VoiceProfileStatusCard({
  profileSaved = false,
  savedAt,
  loading = false,
}: VoiceProfileStatusCardProps) {
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
          Reading your voice...
        </div>
      </div>
    );
  }

  if (!profileSaved) {
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
          Your voice is not yet on record
        </p>
        <p
          style={{ color: 'var(--sys-color-paperWhite-base)' }}
          className="text-xs mt-2 opacity-60 font-primary leading-relaxed"
        >
          Share a piece of your writing below. Every word you choose is already part of who you are.
        </p>
      </div>
    );
  }

  // Profile confirmed saved
  return (
    <div
      style={{
        backgroundColor: 'var(--sys-color-charcoalBackground-steps-2)',
        borderColor: 'var(--sys-color-inkGold-base)',
        borderRadius: 'var(--sys-shape-placardTorn01)',
      }}
      className="p-6 border-2 border-opacity-30"
    >
      <div className="flex items-center gap-3 mb-4">
        <Zap
          className="w-5 h-5"
          style={{ color: 'var(--sys-color-solidarityRed-base)' }}
        />
        <h3
          style={{ color: 'var(--sys-color-paperWhite-base)' }}
          className="font-display text-lg font-bold uppercase tracking-tight"
        >
          Voice on Record
        </h3>
      </div>

      <p
        style={{ color: 'var(--sys-color-concreteGrey-base)' }}
        className="font-primary text-sm opacity-80 leading-relaxed"
      >
        Your writing has been read and kept. Generated documents will carry the weight of your own
        voice, not a template's.
      </p>

      {savedAt && (
        <div className="mt-4 pt-4 border-t border-concreteGrey/20">
          <p
            style={{ color: 'var(--sys-color-concreteGrey-base)' }}
            className="text-xs opacity-50 font-mono"
          >
            Recorded {new Date(savedAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
