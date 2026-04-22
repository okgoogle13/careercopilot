import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { Placard } from '../../components/ui/Placard';
import { Strike } from '../../components/ui/Strike';

// Simplified types for the production feature
interface VoiceProfile {
  id: string;
  tone: string;
  formality: string;
  commonPhrases: string[];
  structuralPatterns: string;
  constraints: string[];
  isDefault: boolean;
}

// Sub-components extracted from prototype logic

function StatusBadge({
  children,
  variant = 'info',
}: {
  children: React.ReactNode;
  variant?: string;
}) {
  const colors =
    variant === 'success'
      ? 'text-[var(--sys-color-kr-activistSmokeGreen-base)]'
      : 'text-[var(--sys-color-worker-ash-base)]';
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border border-current ${colors}`}
    >
      {children}
    </span>
  );
}

function M3Button({ children, variant, onClick, className }: any) {
  const baseClass = 'px-4 py-1.5 rounded-full text-xs font-bold transition-all';
  const variants: Record<string, string> = {
    tonal:
      'bg-[var(--sys-color-charcoalBackground-steps-4)] text-[var(--sys-color-worker-ash-base)] hover:brightness-125',
    outlined:
      'border border-[var(--kr-color-concrete-grey-steps-0)] text-[var(--sys-color-worker-ash-base)] hover:bg-white/5',
    filled: 'bg-[var(--sys-color-solidarityRed-base)] text-white shadow-lg',
  };
  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${variants[variant] || variants.outlined} ${className}`}
    >
      {children}
    </button>
  );
}

export function VoiceProfileSection({
  voiceProfiles = [],
  onSave,
  onReset,
  isLoading = false,
  error = null,
}: {
  voiceProfiles?: VoiceProfile[];
  onSave: (sample: string) => Promise<void>;
  onReset: () => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const activeProfile = voiceProfiles.find((p) => p.isDefault) || voiceProfiles[0];

  const handleSave = async () => {
    await onSave(inputValue);
    setIsEditing(false);
  };

  return (
    <div className="bg-[var(--sys-color-charcoalBackground-steps-2)] p-8 rounded-[32px] border border-[var(--kr-color-concrete-grey-steps-0)] shadow-sm">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-[22px] leading-[28px] font-bold type-solidarityProtest text-[var(--sys-color-paperWhite-base)] mb-2">
            Authentic voice
          </h3>
          <p className="text-[var(--sys-color-worker-ash-base)] text-sm">
            {activeProfile && !isEditing
              ? 'Your voice profile is active and being used to calibrate generated documents.'
              : 'Calibrate the AI to mirror your natural writing style, ensuring consistency across all career documents.'}
          </p>
        </div>
      </div>

      {activeProfile && !isEditing ? (
        <Placard className="p-6 border-[var(--sys-color-inkGold-base)]/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-[var(--sys-color-inkGold-base)]">
              Verified authentic voice
            </h4>
            <StatusBadge variant="success">Active Profile</StatusBadge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider mb-1">
                  Tone & Formality
                </p>
                <p className="text-sm text-[var(--sys-color-paperWhite-base)] font-medium">
                  {activeProfile.tone} • {activeProfile.formality}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider mb-1">
                  Common Phrases
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeProfile.commonPhrases.map((phrase, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-[var(--sys-color-charcoalBackground-steps-4)] rounded text-[10px] text-[var(--sys-color-worker-ash-base)] font-mono"
                    >
                      "{phrase}"
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider mb-1">
                  Structural Patterns
                </p>
                <p className="text-xs text-[var(--sys-color-worker-ash-base)] leading-relaxed font-mono">
                  {activeProfile.structuralPatterns}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-[var(--kr-color-concrete-grey-steps-0)]">
            <M3Button
              variant="tonal"
              onClick={() => setIsEditing(true)}
            >
              Refine voice
            </M3Button>
            <M3Button
              variant="outlined"
              onClick={onReset}
            >
              Reset profile
            </M3Button>
          </div>
        </Placard>
      ) : (
        <div className="space-y-6">
          <Placard className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-[var(--sys-color-worker-ash-base)] opacity-60 mb-2 block font-bold uppercase tracking-wider">
                  Source writing sample
                </label>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Paste a cover letter or professional summary. This sample defines your AI tone."
                  className="w-full bg-[var(--sys-color-charcoalBackground-steps-3)] border border-[var(--kr-color-concrete-grey-steps-0)] text-[var(--sys-color-paperWhite-base)] p-4 rounded-xl font-medium text-sm focus:outline-none focus:border-[var(--sys-color-inkGold-base)] transition-all min-h-[150px]"
                />
              </div>
              <Strike
                onClick={handleSave}
                disabled={isLoading || !inputValue.trim()}
              >
                {isLoading ? 'Analyzing patterns...' : 'Calibrate voice'}
              </Strike>
            </div>
          </Placard>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-[var(--sys-color-kr-charcoalRed-base)]/20 border border-[var(--sys-color-solidarityRed-base)]/30 rounded-xl"
            >
              <p className="text-xs text-[var(--sys-color-solidarityRed-base)] font-bold">
                {error}
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
