import { Button, Input, Textarea } from '@careercopilot/ui';
import { API_ENDPOINTS } from '@/config/api';
import { auth } from '@/config/firebase';
import type { AnalyzeJobFromUrlResponse } from '@/types/masterResume';
import { motion } from 'framer-motion';
import { ArrowRight, Link2, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const USE_MOCK = import.meta.env?.VITE_USE_MOCK_API !== 'false';

async function getAuthToken(): Promise<string> {
  if (USE_MOCK) return 'dev-token';
  const user = auth.currentUser;
  if (!user) return '';
  return user.getIdToken();
}

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
      const token = await getAuthToken();
      const response = await fetch(API_ENDPOINTS.analyzeJobFromUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: jobUrl || undefined,
          job_description: jobDescription || undefined,
        }),
      });
      if (!response.ok) {
        throw new Error('Quick apply analysis failed.');
      }
      const data = (await response.json()) as AnalyzeJobFromUrlResponse;
      setResult(data);
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
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-placard border border-ink-gold/22 bg-asphalt-black/50 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-gold/80">
                  ATS Preview
                </p>
                <p className="text-5xl font-black text-paper-white mt-2 tabular-nums">
                  {result.ats_preview.score}
                </p>
              </div>
              <div className="rounded-placard border border-concrete-grey/20 bg-asphalt-black/50 p-5 md:col-span-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-concrete-grey">
                  Target
                </p>
                <p className="font-display text-2xl text-paper-white">{result.job_title}</p>
                <p className="font-primary text-concrete-grey">{result.company_name}</p>
              </div>
            </div>

            <div className="rounded-placard border border-concrete-grey/18 bg-asphalt-black/55 p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-gold mb-4">
                Chunk Match Visualization
              </p>
              <div className="space-y-3">
                {result.chunk_matches.map((match) => (
                  <div
                    key={match.chunk_id}
                    className="border border-concrete-grey/15 rounded-megaphone p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-primary text-paper-white font-semibold">{match.label}</p>
                      <span className="font-mono text-xs text-ink-gold tabular-nums">
                        {(match.score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-concrete-grey mt-2">
                      terms: {match.matched_terms.join(', ') || 'none'}
                    </p>
                    <p className="font-primary text-sm text-paper-white/75 mt-2">{match.snippet}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-placard border border-ink-gold/20 bg-asphalt-black/55 p-6 space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-gold">
                Export Pack
              </p>
              <p className="font-primary text-concrete-grey text-sm">
                Resume, cover letter, and KSC artifacts are generated for this role. Continue to
                tracker to manage your application stage.
              </p>
              <Button
                onClick={() => navigate('/tracker')}
                className="rounded-strike font-bold uppercase tracking-wide"
              >
                Go To Tracker <Link2 className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ApplyQuick;
