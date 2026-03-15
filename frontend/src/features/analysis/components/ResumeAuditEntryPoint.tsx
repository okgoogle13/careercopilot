import React, { useState } from 'react';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export interface ResumeAuditEntryPointProps {
  /** Called when audit completes with results */
  onAuditComplete?: (results: any) => void;
  /** Resume text to audit */
  resumeText: string;
  /** Job description for context */
  jobDescription?: string;
  /** Disabled state */
  disabled?: boolean;
}

export const ResumeAuditEntryPoint: React.FC<ResumeAuditEntryPointProps> = ({
  onAuditComplete,
  resumeText,
  jobDescription,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [strictnessMode, setStrictnessMode] = useState<'lenient' | 'moderate' | 'strict'>(
    'moderate'
  );

  const handleAudit = async () => {
    if (!resumeText) {
      toast.error('Please provide resume text for audit');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/resume-audit/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription: jobDescription || '',
          strictnessMode,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        onAuditComplete?.(data.data);
        toast.success('Resume audit complete!');
      } else {
        throw new Error('Invalid audit response');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      toast.error(`Audit failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-charcoal-background-steps-2 rounded-placardTorn01 p-6 border border-outline-variant shadow-elevation-1"
      style={{
        backgroundColor: 'var(--sys-color-charcoalBackground-base)',
        borderColor: 'var(--sys-color-outline-variant)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Shield
          className="w-6 h-6"
          style={{ color: 'var(--sys-color-kr-activistSmokeGreen-base)' }}
        />
        <h3
          className="text-title-large font-bold"
          style={{ color: 'var(--sys-color-on-surface)' }}
        >
          Resume Audit Evaluation
        </h3>
      </div>

      {/* Description */}
      <p
        className="text-body-medium mb-6"
        style={{ color: 'var(--sys-color-on-surface-variant)' }}
      >
        Evaluate your resume against RKL (Resume Knowledge Library) standards with AI-powered
        analysis. Get detailed scoring, violation detection, and personalized recommendations.
      </p>

      {/* Strictness Mode Selector */}
      <div
        className="mb-6 p-4 rounded-blockRiot01 bg-surface-container-low"
        style={{
          backgroundColor: 'var(--sys-color-surface-container-low)',
          borderRadius: 'var(--shape-blockRiot01)',
        }}
      >
        <label
          className="block text-label-medium font-bold mb-3"
          style={{ color: 'var(--sys-color-on-surface)' }}
        >
          Evaluation Strictness
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['lenient', 'moderate', 'strict'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setStrictnessMode(mode)}
              disabled={loading}
              className={`px-3 py-2 rounded-blockRiot01 font-bold text-label-small transition-all duration-short ${
                strictnessMode === mode ? 'ring-2' : ''
              }`}
              style={
                {
                  backgroundColor:
                    strictnessMode === mode
                      ? 'var(--sys-color-solidarityRed-base)'
                      : 'var(--sys-color-surface-container-high)',
                  color:
                    strictnessMode === mode
                      ? 'var(--sys-color-on-primary-container)'
                      : 'var(--sys-color-on-surface)',
                  borderRadius: 'var(--shape-blockRiot01)',
                  outline:
                    strictnessMode === mode
                      ? '2px solid var(--sys-color-solidarityRed-base)'
                      : 'none',
                } as React.CSSProperties
              }
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div
          className="mb-6 p-4 rounded-blockRiot01 flex gap-3 items-start"
          style={{
            backgroundColor: 'var(--sys-color-kr-charcoalRed-steps-0)',
            borderRadius: 'var(--shape-blockRiot01)',
          }}
        >
          <AlertCircle
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            style={{ color: 'var(--sys-color-kr-charcoalRed-base)' }}
          />
          <div>
            <p
              className="text-label-medium font-bold"
              style={{ color: 'var(--sys-color-kr-charcoalRed-base)' }}
            >
              Audit Error
            </p>
            <p
              className="text-body-small mt-1"
              style={{ color: 'var(--sys-color-kr-charcoalRed-steps-2)' }}
            >
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleAudit}
        disabled={loading || disabled || !resumeText}
        className="w-full px-6 py-3 rounded-blockRiot03 font-bold text-label-large transition-all duration-short flex items-center justify-center gap-2"
        style={{
          backgroundColor:
            disabled || !resumeText
              ? 'var(--sys-color-surface-container-high)'
              : 'var(--sys-color-solidarityRed-base)',
          color:
            disabled || !resumeText
              ? 'var(--sys-color-on-surface-variant)'
              : 'var(--sys-color-on-primary-container)',
          borderRadius: 'var(--shape-blockRiot03)',
          cursor: disabled || !resumeText ? 'not-allowed' : 'pointer',
          opacity: disabled || !resumeText ? 0.6 : 1,
        }}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Auditing...
          </>
        ) : (
          <>
            <Shield className="w-5 h-5" />
            Start RKL Evaluation
          </>
        )}
      </button>

      {/* Help Text */}
      <p
        className="text-body-small mt-4"
        style={{ color: 'var(--sys-color-on-surface-variant)' }}
      >
        Processing time typically 10-30 seconds. Results are securely stored and tied to your
        profile.
      </p>
    </div>
  );
};
