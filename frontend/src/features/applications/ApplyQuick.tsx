import { Button, Input, Textarea } from '@careercopilot/ui';
import type { AnalyzeJobFromUrlResponse } from '@/types/masterResume';
import { JobAnalysisResultsPanel } from '@/features/applications/components/JobAnalysisResultsPanel';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workflowService } from '@/api/workflowService';

export function ApplyQuick() {
  const navigate = useNavigate();
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeJobFromUrlResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const jdPreview = useMemo(() => {
    const text = jobDescription.trim();
    if (!text) return 'Live JD preview will appear here as you type.';
    return text;
  }, [jobDescription]);

  const handleAnalyze = async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = await workflowService.quickApply({
        jobDescription: jobDescription || 'No description provided.',
        jobUrl: jobUrl.trim() || undefined,
      });
      setResult(payload as AnalyzeJobFromUrlResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run quick apply.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-asphalt-black-darkest p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-ink-gold/70">
            [ QUICK APPLY ]
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-black text-paper-white tracking-tight">
            Apply Quick
          </h1>
          <p className="font-primary text-concrete-grey">
            Paste a job URL or job description to generate ATS preview + tailored pack from your
            master context.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="rounded-placard border border-concrete-grey/20 bg-asphalt-black/65 p-6 space-y-5"
          >
            <div>
              <label className="block text-label-large text-on-surface mb-2">Job URL</label>
              <Input
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://company.com/careers/role"
                className="bg-surface-container-high"
              />
            </div>
            <div>
              <label className="block text-label-large text-on-surface mb-2">Job Description</label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the role description"
                className="h-56 bg-surface-container-high border-outline-variant"
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={loading || (!jobUrl.trim() && !jobDescription.trim())}
              className="w-full h-12 rounded-strike font-black uppercase tracking-wide"
              style={{
                backgroundColor: 'var(--sys-color-solidarityRed-base)',
                color: 'var(--sys-color-charcoalBackground-base)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing role
                </>
              ) : (
                <>
                  Analyze & Build Pack <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
            {error && <p className="text-solidarity-red text-sm">{error}</p>}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24, delay: 0.06 }}
            className="rounded-placard border border-ink-gold/22 bg-asphalt-black/55 p-6"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-gold mb-3">
              Live JD Preview
            </p>
            <pre className="font-primary text-sm text-paper-white/90 whitespace-pre-wrap leading-relaxed min-h-[220px] max-h-[320px] overflow-auto">
              {jdPreview}
            </pre>
          </motion.section>
        </div>

        {result && (
          <JobAnalysisResultsPanel
            result={result}
            onNavigateToTracker={() => navigate('/tracker')}
          />
        )}
      </div>
    </div>
  );
}

export default ApplyQuick;
