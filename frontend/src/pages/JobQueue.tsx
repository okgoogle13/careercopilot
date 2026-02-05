import { Cabinet, Pebble, StatusBadge, Stone, type StatusBadgeVariant } from '@/components/ui';
import { m3Toast } from '@/utils/toast';
import { CheckCircle, Clock, Copy, ExternalLink, FileText, Play, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { M3ErrorAlert } from '../components/shared/M3ErrorAlert';
import { PageHeader } from '../components/shared/PageHeader';
import { API_ENDPOINTS } from '../config/api';

interface JobQueueItem {
  id: string;
  title: string;
  company: string;
  url: string;
  status: 'pending_analysis' | 'ready_to_apply' | 'applied';
  date_clipped: string;
  notes?: string;
}

const statusConfig: Record<
  JobQueueItem['status'],
  { label: string; variant: StatusBadgeVariant; icon: typeof Clock }
> = {
  pending_analysis: {
    label: 'Pending Analysis',
    variant: 'neutral' as const,
    icon: Clock,
  },
  ready_to_apply: {
    label: 'Ready to Apply',
    variant: 'info' as const,
    icon: CheckCircle,
  },
  applied: {
    label: 'Applied',
    variant: 'success' as const,
    icon: CheckCircle,
  },
};

export function JobQueue() {
  const [jobs, setJobs] = useState<JobQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyzingJobId, setAnalyzingJobId] = useState<string | null>(null);
  const [draftingJobId, setDraftingJobId] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [coverLetterJob, setCoverLetterJob] = useState<{ title: string; company: string } | null>(
    null
  );
  const [showCoverLetterDialog, setShowCoverLetterDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.jobQueue);

      if (!response.ok) {
        throw new Error('Failed to fetch job queue');
      }

      const data = await response.json();
      setJobs(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load job queue. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (jobId: string) => {
    try {
      setAnalyzingJobId(jobId);

      const response = await fetch(API_ENDPOINTS.analyzeJob(jobId), {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analysis failed');
      }

      await fetchJobs();
      m3Toast.success('Analysis Complete', 'Job ready for drafting.');
    } catch (err) {
      console.error('Error analyzing job:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to analyze job';
      setError(errorMsg);
      m3Toast.error('Analysis Failed', errorMsg);
    } finally {
      setAnalyzingJobId(null);
    }
  };

  const handleDraft = async (jobId: string, jobTitle: string, company: string) => {
    try {
      setDraftingJobId(jobId);
      setError(null);

      const response = await fetch(API_ENDPOINTS.draftCoverLetter(jobId), {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Cover letter generation failed');
      }

      const result = await response.json();
      setCoverLetter(result.data.cover_letter);
      setCoverLetterJob({ title: jobTitle, company: company });
      setShowCoverLetterDialog(true);
      m3Toast.success('Draft Generated', 'Review your application below.');
    } catch (err) {
      console.error('Error drafting cover letter:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to generate cover letter';
      setError(errorMsg);
      m3Toast.error('Drafting Failed', errorMsg);
    } finally {
      setDraftingJobId(null);
    }
  };

  const handleCopy = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      m3Toast.success('Copied', 'Cover letter copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-AU', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <div className="w-12 h-12 border-4 border-[var(--color-wattle-gold)]/20 border-t-[var(--color-wattle-gold)] rounded-full animate-spin" />
        <p className="font-annotation text-xs tracking-widest text-[var(--color-concrete-grey-dark)] uppercase">
          Synchronizing Queue
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Intelligence Pipeline"
        highlightedWord="Pipeline"
        description="Synthesize clipped opportunities into tactical application strategies."
      />

      {error && (
        <M3ErrorAlert
          message={error}
          onRetry={fetchJobs}
          onDismiss={() => setError(null)}
          retryLabel="Refresh Data"
        />
      )}

      {jobs.length === 0 && !error ? (
        <div className="text-center py-32 opacity-60">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Sparkles className="w-10 h-10 text-[var(--color-concrete-grey-dark)]" />
          </div>
          <h3 className="font-bloom text-3xl mb-2 text-[var(--color-paper-white)]">Empty Pipeline</h3>
          <p className="font-field-note text-lg text-[var(--color-concrete-grey-dark)]">
            Clip opportunities from Seek or LinkedIn to populate your queue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {jobs.map((job) => {
            const isAnalyzing = analyzingJobId === job.id;
            const isDrafting = draftingJobId === job.id;

            return (
              <Stone
                key={job.id}
                mode="laboratory"
                elevation="raised"
                className="flex flex-col h-full group p-0 overflow-hidden"
              >
                <div className="px-6 pt-6 flex justify-between items-start mb-6">
                  <StatusBadge
                    label={statusConfig[job.status].label}
                    variant={statusConfig[job.status].variant}
                    showDot
                  />
                  <span className="text-[10px] font-annotation text-[var(--color-concrete-grey-dark)] uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                    {formatDate(job.date_clipped)}
                  </span>
                </div>

                <div className="px-6 mb-6 flex-1">
                  <h3 className="font-bloom text-2xl font-bold text-[var(--color-paper-white)] mb-2 group-hover:text-[var(--color-wattle-gold)] transition-colors">
                    {job.title}
                  </h3>
                  <p className="font-field-note text-lg text-[var(--color-concrete-grey-dark)] italic">
                    {job.company}
                  </p>

                  {job.notes && (
                    <div className="mt-4 p-4 bg-white/5 rounded-stone border border-white/5">
                      <p className="font-field-note text-sm text-[var(--color-paper-white)]/70 italic">
                        "{job.notes}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="px-6 pb-6 flex flex-col gap-3 mt-auto">
                  <Pebble
                    variant="primary"
                    size="md"
                    iconLeft={!isAnalyzing && <Play className="w-4 h-4" />}
                    onClick={() => handleAnalyze(job.id)}
                    disabled={job.status !== 'pending_analysis' || isAnalyzing}
                    isLoading={isAnalyzing}
                    className="w-full"
                  >
                    {isAnalyzing ? 'Analyzing' : 'Analyze Intelligence'}
                  </Pebble>

                  {job.status === 'ready_to_apply' && (
                    <Pebble
                      variant="secondary"
                      size="md"
                      iconLeft={!isDrafting && <FileText className="w-4 h-4" />}
                      onClick={() => handleDraft(job.id, job.title, job.company)}
                      disabled={isDrafting}
                      isLoading={isDrafting}
                      className="w-full"
                    >
                      {isDrafting ? 'Drafting' : 'Synthesize Letter'}
                    </Pebble>
                  )}

                  <Pebble
                    variant="ghost"
                    size="md"
                    iconLeft={<ExternalLink className="w-4 h-4" />}
                    onClick={() => window.open(job.url, '_blank')}
                    className="w-full opacity-70 hover:opacity-100"
                  >
                    Inspect Source
                  </Pebble>
                </div>
              </Stone>
            );
          })}
        </div>
      )}

      <Cabinet
        open={showCoverLetterDialog}
        onClose={() => setShowCoverLetterDialog(false)}
        title="Strategic Cover Letter"
        maxWidth="2xl"
        variant="tech"
      >
        <div className="space-y-6">
          {coverLetterJob && (
            <div className="p-4 bg-[var(--color-wattle-gold)]/10 rounded-stone border border-[var(--color-wattle-gold)]/20">
              <p className="font-field-note text-sm text-[var(--color-wattle-gold)]">
                Optimized for <span className="font-bold">{coverLetterJob.title}</span> at{' '}
                <span className="font-bold">{coverLetterJob.company}</span>
              </p>
            </div>
          )}

          <div className="bg-white/5 p-8 rounded-stone border border-white/5 shadow-inner">
            <pre className="font-field-note text-base text-[var(--color-paper-white)]/90 whitespace-pre-wrap leading-relaxed">
              {coverLetter}
            </pre>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Pebble
              variant="ghost"
              onClick={() => setShowCoverLetterDialog(false)}
            >
              Refine Later
            </Pebble>
            <Pebble
              variant="primary"
              iconLeft={<Copy className="w-4 h-4" />}
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Secure to Clipboard'}
            </Pebble>
          </div>
        </div>
      </Cabinet>
    </div>
  );
}
