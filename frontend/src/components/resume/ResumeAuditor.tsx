import React, { useState } from 'react';
import { auditResume } from '../../services/resumeAuditService';
import { useResumeRulesStore } from '../../stores/useResumeRulesStore';

export const ResumeAuditor: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { strictnessMode, setAuditResult, setStrictness } = useResumeRulesStore();

  const handleAudit = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await auditResume({
        resumeText,
        jobDescription: jobDescription || undefined,
        strictnessMode,
      });

      setAuditResult(result);
      console.log('[Audit Complete]', result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Audit failed';
      setError(message);
      console.error('[Audit Error]', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tech-card p-lg bg-asphalt-black border border-concrete-grey-dark">
      {/* Header */}
      <div className="flex justify-between items-center mb-md">
        <h2 className="text-display-kr-dark">Resume Audit</h2>

        {/* Strictness Toggle */}
        <div className="flex gap-xs">
          {(['strict', 'moderate', 'light'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setStrictness(mode)}
              className={`btn-pebble text-xs px-sm py-xs ${
                strictnessMode === mode
                  ? 'bg-ink-gold text-asphalt-black'
                  : 'bg-asphalt-black-light text-concrete-grey-light'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Resume Input */}
      <div className="mb-md">
        <label className="text-body-medium text-concrete-grey-light mb-xs block">
          Resume Text *
        </label>
        <textarea
          className="w-full min-h-[300px] p-md bg-asphalt-black-light text-body text-concrete-grey-lightest border border-concrete-grey-dark rounded-stone font-mono text-sm"
          placeholder="Paste your resume text here (minimum 100 characters)..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
        <p className="text-xs text-concrete-grey-dark mt-xs">{resumeText.length} characters</p>
      </div>

      {/* Job Description Input (Optional) */}
      <div className="mb-md">
        <label className="text-body-medium text-concrete-grey-light mb-xs block">
          Job Description (optional)
        </label>
        <textarea
          className="w-full min-h-[150px] p-md bg-asphalt-black-light text-body text-concrete-grey-lightest border border-concrete-grey-dark rounded-stone font-mono text-sm"
          placeholder="Paste target job description for keyword optimization..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="border-l-4 border-solidarity-crimson pl-md py-sm mb-md bg-asphalt-black-light">
          <p className="text-body-medium text-solidarity-crimson">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleAudit}
        disabled={loading || resumeText.length < 100}
        className={`btn-pebble w-full py-md text-body-bold ${
          loading || resumeText.length < 100
            ? 'bg-concrete-grey-dark text-concrete-grey cursor-not-allowed'
            : 'bg-ink-gold text-asphalt-black hover:bg-ink-gold-light'
        }`}
      >
        {loading ? 'Analyzing Resume...' : 'Audit Resume'}
      </button>
    </div>
  );
};
