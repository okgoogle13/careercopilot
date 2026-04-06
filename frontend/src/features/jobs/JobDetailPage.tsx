import { jobService, type JobAnalysis, type JobListing } from '@/api/jobService';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, ExternalLink, Zap } from 'lucide-react';

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [listing, setListing] = useState<JobListing | null>(null);
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No job ID provided.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const [job, jobAnalysis] = await Promise.allSettled([
          jobService.getJob(id!),
          jobService.advancedJobAnalysis(id!),
        ]);

        if (cancelled) return;

        setListing(job.status === 'fulfilled' ? job.value : null);
        setAnalysis(jobAnalysis.status === 'fulfilled' ? jobAnalysis.value : null);

        if (job.status === 'rejected' && jobAnalysis.status === 'rejected') {
          setError('Could not load job details. It may no longer be available.');
        }
      } catch {
        if (!cancelled) setError('Failed to load job.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleQuickApply = () => {
    navigate(`/apply?jobId=${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--sys-color-charcoalBackground-base)] flex items-center justify-center">
        <p className="font-mono text-sm uppercase tracking-widest text-[var(--sys-color-worker-ash-base)]/60 animate-pulse">
          Decrypting job signal…
        </p>
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div className="min-h-screen bg-[var(--sys-color-charcoalBackground-base)] flex flex-col items-center justify-center gap-4">
        <p className="font-mono text-sm text-[var(--sys-color-solidarityRed-base)]">{error}</p>
        <button
          onClick={() => navigate('/opportunities')}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--sys-color-inkGold-base)] hover:opacity-75 transition-opacity"
        >
          <ArrowLeft size={13} /> Back to intercepts
        </button>
      </div>
    );
  }

  const title = listing?.title ?? 'Unknown Role';
  const company = listing?.company ?? 'Unknown Company';
  const location = listing?.location;
  const salary = listing?.salary
    ? `${listing.salary.currency} ${listing.salary.min.toLocaleString()}–${listing.salary.max.toLocaleString()}`
    : null;
  const description = listing?.description ?? '';
  const requirements = listing?.requirements ?? [];

  return (
    <div className="min-h-screen bg-[var(--sys-color-charcoalBackground-base)] p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back nav */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--sys-color-worker-ash-base)]/50 hover:text-[var(--sys-color-worker-ash-base)] transition-colors"
        >
          <ArrowLeft size={12} /> Back
        </button>

        {/* Header */}
        <header className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--sys-color-inkGold-base)]/70">
            [ JOB DETAIL ]
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-black text-[var(--sys-color-paperWhite-base)] tracking-tight uppercase">
            {title}
          </h1>
          <p className="font-mono text-sm text-[var(--sys-color-worker-ash-base)]/60 uppercase tracking-wider">
            {company}
            {location ? ` · ${location}` : ''}
            {salary ? ` · ${salary}` : ''}
          </p>
        </header>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleQuickApply}
            className="flex items-center gap-2 px-6 py-3 font-black uppercase tracking-wide text-sm bg-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-charcoalBackground-base)] hover:opacity-90 transition-opacity"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            <Zap size={14} /> Quick Apply
          </button>
          <button
            onClick={() => navigate('/opportunities')}
            className="flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-wide text-sm border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-worker-ash-base)] hover:border-[var(--sys-color-inkGold-base)]/50 transition-colors"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            <Bookmark size={14} /> Save
          </button>
          {listing?.url && (
            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-wide text-sm border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-worker-ash-base)] hover:border-[var(--sys-color-inkGold-base)]/50 transition-colors"
              style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
            >
              <ExternalLink size={14} /> View Original
            </a>
          )}
        </div>

        {/* Description */}
        {description && (
          <section
            className="border border-[var(--sys-color-outline-variant)] bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 space-y-3"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--sys-color-inkGold-base)]">
              Job Description
            </h2>
            <p className="text-sm text-[var(--sys-color-worker-ash-base)] leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          </section>
        )}

        {/* Requirements */}
        {requirements.length > 0 && (
          <section
            className="border border-[var(--sys-color-outline-variant)] bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 space-y-3"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--sys-color-inkGold-base)]">
              Requirements
            </h2>
            <ul className="space-y-2">
              {requirements.map((req, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[var(--sys-color-worker-ash-base)]"
                >
                  <span className="mt-1 w-1 h-1 rounded-full shrink-0 bg-[var(--sys-color-solidarityRed-base)]" />
                  {req}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Analysis */}
        {analysis && (
          <section
            className="border border-[var(--sys-color-inkGold-base)]/25 bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 space-y-4"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--sys-color-inkGold-base)]">
              AI Analysis
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {analysis.keyRequirements.length > 0 && (
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--sys-color-worker-ash-base)]/50 mb-2">
                    Key Requirements
                  </p>
                  <ul className="space-y-1">
                    {analysis.keyRequirements.slice(0, 5).map((r, i) => (
                      <li
                        key={i}
                        className="text-xs text-[var(--sys-color-worker-ash-base)]"
                      >
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.technicalSkills.length > 0 && (
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--sys-color-worker-ash-base)]/50 mb-2">
                    Technical Skills
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {analysis.technicalSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 text-[9px] font-mono uppercase border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-worker-ash-base)]/70"
                        style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Bottom CTA repeat */}
        <div className="pt-4 border-t border-[var(--sys-color-outline-variant)]">
          <button
            onClick={handleQuickApply}
            className="flex items-center gap-2 px-8 py-4 font-black uppercase tracking-wide text-sm bg-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-charcoalBackground-base)] hover:opacity-90 transition-opacity"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            <Zap size={14} /> Apply to This Role
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobDetailPage;
