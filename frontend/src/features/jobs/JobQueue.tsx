import { Megaphone, Strike, StatusBadge, Placard, type StatusBadgeVariant } from '@/components/ui';
import { KanbanCard } from '@/components/KanbanCard';
import { m3Toast } from '@/utils/toast';
import { CheckCircle, Clock, Copy, ExternalLink, FileText, Play, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { KrErrorAlert } from '@/components/shared/KrErrorAlert';
import { API_ENDPOINTS } from '@/config/api';
import { LayeredHero } from '@/components/kerala-rage/LayeredHero';
import { loadHeroRegistry } from '@/design/hero/heroRegistry';
import { composeHero } from '@/lib/composeHero';
import type { SolidarityManifest } from '@/design/hero/heroTypes';
interface JobQueueItem {
  id: string;
  title: string;
  company: string;
  url: string;
  status: 'pending_analysis' | 'ready_to_apply' | 'applied';
  date_clipped: string;
  notes?: string;
}

const MOCK_JOB_QUEUE: JobQueueItem[] = [
  {
    id: 'mock-001',
    title: 'Community Services Coordinator',
    company: 'Union House',
    url: 'https://example.org/jobs/community-services-coordinator',
    status: 'pending_analysis',
    date_clipped: new Date().toISOString(),
    notes: 'Mocked visual-audit card state',
  },
  {
    id: 'mock-002',
    title: 'Family Support Practitioner',
    company: 'Care Collective',
    url: 'https://example.org/jobs/family-support-practitioner',
    status: 'ready_to_apply',
    date_clipped: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    notes: 'Mocked ready state',
  },
  {
    id: 'mock-003',
    title: 'Youth Case Worker',
    company: 'Northside Services',
    url: 'https://example.org/jobs/youth-case-worker',
    status: 'applied',
    date_clipped: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    notes: 'Mocked applied state',
  },
];

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
  const [heroData, setHeroData] = useState<{
    layers: any[];
    typography: any;
    animation: any;
    zIndexMap: any;
  } | null>(null);

  useEffect(() => {
    async function loadHero() {
      try {
        const [manifest, registry] = await Promise.all([
          fetch('/assets/kerala-rage-kr-solidarity-manifest.json').then((r) => r.json()),
          loadHeroRegistry(),
        ]);

        const result = composeHero(
          manifest as SolidarityManifest,
          registry,
          'layered-solidarity-hero'
        );

        if (result.valid) {
          setHeroData({
            layers: result.resolvedLayers,
            typography: result.typography,
            animation: result.animation,
            zIndexMap: result.zIndexMap,
          });
        }
      } catch (error) {
        console.error('Failed to load job queue hero:', error);
      }
    }
    loadHero();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const isOfflineAudit =
      import.meta.env.VITE_OFFLINE_MODE === 'true' || import.meta.env.VITE_USE_MOCK_API === 'true';

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
      if (isOfflineAudit) {
        setJobs(MOCK_JOB_QUEUE);
        setError(null);
      } else {
        setError('Failed to load job queue. Ensure backend is running.');
      }
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
        <div
          role="status"
          data-testid="job-queue-loader"
          className="w-12 h-12 border-4 border-[var(--sys-color-inkGold)]/20 border-t-[var(--sys-color-inkGold)] rounded-march animate-spin"
        />
        <p className="font-mono text-xs tracking-widest text-[var(--sys-color-concreteGrey)] uppercase">
          Synchronizing Queue
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen p-8">
      <header className="mb-12">
        <h1 className="font-display text-6xl font-black text-paper-white tracking-tighter uppercase leading-none">
          Intelligence <span className="text-ink-gold">Pipeline</span>
        </h1>
        <p className="font-primary text-lg text-concrete-grey opacity-70 mt-4 italic">
          "Synthesize clipped opportunities into tactical application strategies."
        </p>
      </header>
      {heroData && (
        <div className="absolute top-0 right-0 w-[400px] h-full pointer-events-none opacity-10 mask-gradient-to-left">
          <LayeredHero
            layers={heroData.layers}
            typography={{ ...heroData.typography, headline: '', supporting: '' }}
            animation={{ ...heroData.animation, scroll_behavior: 'none' }}
            zIndexMap={heroData.zIndexMap}
            className="h-full"
          />
        </div>
      )}

      {error && (
        <KrErrorAlert
          message={error}
          onRetry={fetchJobs}
          onDismiss={() => setError(null)}
          retryLabel="Refresh Data"
        />
      )}

      {jobs.length === 0 && !error ? (
        <div className="text-center py-32 opacity-60">
          <div className="w-20 h-20 bg-[var(--sys-color-charcoalBackground)] rounded-march flex items-center justify-center mx-auto mb-6 border border-[var(--sys-color-concreteGrey)]/20">
            <Sparkles className="w-10 h-10 text-[var(--sys-color-concreteGrey)]" />
          </div>
          <h3 className="font-display text-3xl mb-2 text-[var(--sys-color-paperWhite)]">
            Empty Pipeline
          </h3>
          <p className="font-primary text-lg text-[var(--sys-color-concreteGrey)]">
            Clip opportunities from Seek or LinkedIn to populate your queue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {jobs.map((job) => {
            const isAnalyzing = analyzingJobId === job.id;
            const isDrafting = draftingJobId === job.id;
            const statusMeta = statusConfig[job.status];
            const StatusIcon = statusMeta.icon;

            return (
              <Placard
                key={job.id}
                className="border-concrete-grey/20 bg-asphalt-black/45 p-0 overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-concrete-grey/15 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <StatusIcon className="h-4 w-4 text-ink-gold" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-concrete-grey">
                        Queue Item
                      </p>
                      <p className="font-display text-xl text-paper-white">{job.title}</p>
                    </div>
                  </div>
                  <StatusBadge
                    variant={statusMeta.variant}
                    label={statusMeta.label}
                  />
                </div>

                <div className="space-y-4 px-5 py-5">
                  <div>
                    <p className="text-sm font-semibold text-worker-ash">{job.company}</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-concrete-grey">
                      {formatDate(job.date_clipped)}
                    </p>
                  </div>

                  <KanbanCard
                    id={job.id}
                    title={job.title}
                    description={job.notes || job.company}
                    status={statusMeta.label}
                    priority="medium"
                    dueDate={formatDate(job.date_clipped)}
                    onSelect={() => {
                      if (job.status === 'pending_analysis') {
                        void handleAnalyze(job.id);
                      } else if (job.status === 'ready_to_apply') {
                        void handleDraft(job.id, job.title, job.company);
                      }
                    }}
                  />

                  <div className="flex flex-wrap gap-3 pt-2">
                    {job.status === 'pending_analysis' ? (
                      <Strike
                        onClick={() => {
                          void handleAnalyze(job.id);
                        }}
                        disabled={isAnalyzing}
                        iconLeft={<Play className="w-4 h-4" />}
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                      </Strike>
                    ) : null}

                    {job.status === 'ready_to_apply' ? (
                      <Strike
                        onClick={() => {
                          void handleDraft(job.id, job.title, job.company);
                        }}
                        disabled={isDrafting}
                        iconLeft={<FileText className="w-4 h-4" />}
                      >
                        {isDrafting ? 'Drafting...' : 'Draft Cover Letter'}
                      </Strike>
                    ) : null}

                    <Strike
                      variant="ghost"
                      onClick={() => window.open(job.url, '_blank', 'noopener,noreferrer')}
                      iconLeft={<ExternalLink className="w-4 h-4" />}
                    >
                      Open Listing
                    </Strike>
                  </div>
                </div>
              </Placard>
            );
          })}
        </div>
      )}

      <Megaphone
        open={showCoverLetterDialog}
        onClose={() => setShowCoverLetterDialog(false)}
        title="Strategic Cover Letter"
        maxWidth="2xl"
      >
        <div className="space-y-6">
          {coverLetterJob && (
            <div className="p-4 bg-[var(--sys-color-inkGold)]/10 rounded-megaphone border border-[var(--sys-color-inkGold)]/20">
              <p className="font-primary text-sm text-[var(--sys-color-inkGold)]">
                Optimized for <span className="font-bold">{coverLetterJob.title}</span> at{' '}
                <span className="font-bold">{coverLetterJob.company}</span>
              </p>
            </div>
          )}

          <div className="bg-[var(--sys-color-asphaltBlack)] p-8 rounded-megaphone border border-[var(--sys-color-concreteGrey)]/10 shadow-inner">
            <pre className="font-primary text-base text-[var(--sys-color-paperWhite)]/90 whitespace-pre-wrap leading-relaxed">
              {coverLetter}
            </pre>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Strike
              variant="ghost"
              onClick={() => setShowCoverLetterDialog(false)}
            >
              Refine Later
            </Strike>
            <Strike
              variant="primary"
              iconLeft={<Copy className="w-4 h-4" />}
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Secure to Clipboard'}
            </Strike>
          </div>
        </div>
      </Megaphone>
    </div>
  );
}
