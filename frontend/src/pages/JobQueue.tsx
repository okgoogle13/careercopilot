import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { PageHeader } from '../components/shared/PageHeader';
import { M3ErrorAlert } from '../components/shared/M3ErrorAlert';
import { M3Card, M3CardHeader, M3CardContent, M3CardActions } from '../components/ui/M3Card';
import { M3Button, M3IconButton } from '../components/ui/M3Button';
import { StatusBadge } from '../components/ui/StatusBadge/StatusBadge';
import { Sparkles, ExternalLink, CheckCircle, Clock, Play, FileText, Copy, X } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { toast } from 'sonner';

interface JobQueueItem {
    id: string;
    title: string;
    company: string;
    url: string;
    status: 'pending_analysis' | 'ready_to_apply' | 'applied';
    date_clipped: string;
    notes?: string;
}

const statusConfig = {
    pending_analysis: {
        label: 'Pending Analysis',
        variant: 'neutral' as const,
        icon: Clock,
    },
    ready_to_apply: {
        label: 'Ready to Apply',
        variant: 'secondary' as const,
        icon: CheckCircle,
    },
    applied: {
        label: 'Applied',
        variant: 'primary' as const,
        icon: CheckCircle,
    },
};

/**
 * JobQueue Page - M3 Refactored
 * 
 * Displays clipped jobs from the browser extension with AI analysis capabilities.
 * Now using M3-compliant components (M3Card, M3Button, StatusBadge) instead of MUI defaults.
 * 
 * **M3 Compliance:**
 * - ✅ M3Card with pebble shape variant
 * - ✅ M3Button with filled/outlined/text variants
 * - ✅ StatusBadge with semantic color tokens
 * - ✅ M3 spacing and typography scale
 * - ✅ M3 motion with spring easing
 */
export function JobQueue() {
    const [jobs, setJobs] = useState<JobQueueItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [analyzingJobId, setAnalyzingJobId] = useState<string | null>(null);
    const [draftingJobId, setDraftingJobId] = useState<string | null>(null);
    const [coverLetter, setCoverLetter] = useState<string | null>(null);
    const [coverLetterJob, setCoverLetterJob] = useState<{ title: string; company: string } | null>(null);
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

            const result = await response.json();
            console.log('Analysis result:', result);

            // Refresh the jobs list to show updated data
            await fetchJobs();

            // Success feedback
            toast.success('Job analyzed successfully! Ready to draft application.');

        } catch (err) {
            console.error('Error analyzing job:', err);
            const errorMsg = err instanceof Error ? err.message : 'Failed to analyze job';
            setError(errorMsg);
            toast.error(errorMsg);
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
            console.log('Draft result:', result);

            // Show the cover letter in a dialog
            setCoverLetter(result.data.cover_letter);
            setCoverLetterJob({ title: jobTitle, company: company });
            setShowCoverLetterDialog(true);

            // Success feedback
            toast.success('Cover letter generated! Review and copy when ready.');

        } catch (err) {
            console.error('Error drafting cover letter:', err);
            const errorMsg = err instanceof Error ? err.message : 'Failed to generate cover letter';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setDraftingJobId(null);
        }
    };

    const handleCopy = () => {
        if (coverLetter) {
            navigator.clipboard.writeText(coverLetter);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleCloseCoverLetterDialog = () => {
        setShowCoverLetterDialog(false);
        setCoverLetter(null);
        setCoverLetterJob(null);
        setCopied(false);
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
            <div className="flex justify-center items-center min-h-screen">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-12 max-w-7xl animate-in fade-in duration-500">
            <PageHeader
                title="Incoming Job Queue"
                highlightedWord="Queue"
                description="Jobs clipped from your browser extension, ready for analysis"
            />

            {/* Error Alert - M3 Styled with Retry */}
            {error && (
                <M3ErrorAlert
                    message={error}
                    onRetry={fetchJobs}
                    onDismiss={() => setError(null)}
                    retryLabel="Retry Loading"
                />
            )}

            {/* Empty State */}
            {jobs.length === 0 && !error ? (
                <div className="text-center py-20 opacity-60">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50 text-on-surface-variant" />
                    <h3 className="text-headline-large mb-2 text-on-surface">
                        No jobs in queue
                    </h3>
                    <p className="text-body-large text-on-surface-variant">
                        Use the Chrome extension to clip jobs from Seek, Jora, or EthicalJobs
                    </p>
                </div>
            ) : (
                /* Job Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => {
                        const StatusIcon = statusConfig[job.status].icon;
                        const isAnalyzing = analyzingJobId === job.id;
                        const isDrafting = draftingJobId === job.id;

                        return (
                            <M3Card
                                key={job.id}
                                variant="pebble"
                                elevation={1}
                                hoverable
                                padding="lg"
                                className="flex flex-col h-full"
                            >
                                {/* Card Header with Status Badge */}
                                <div className="flex justify-between items-start mb-4">
                                    <StatusBadge
                                        label={statusConfig[job.status].label}
                                        variant={statusConfig[job.status].variant}
                                        showDot
                                    />
                                    <span className="text-label-small font-mono text-on-surface-variant uppercase tracking-wide">
                                        {formatDate(job.date_clipped)}
                                    </span>
                                </div>

                                {/* Job Title & Company */}
                                <div className="mb-4 flex-1">
                                    <h3 className="text-title-large font-bold text-on-surface mb-2">
                                        {job.title}
                                    </h3>
                                    <p className="text-body-large text-on-surface-variant italic">
                                        {job.company}
                                    </p>

                                    {/* Notes (if present) */}
                                    {job.notes && (
                                        <div className="mt-3 p-3 bg-surface-container-high rounded-tech">
                                            <p className="text-body-medium text-on-surface-variant italic">
                                                "{job.notes}"
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2 mt-auto">
                                    {/* Analyze Button */}
                                    <M3Button
                                        variant="filled"
                                        color="primary"
                                        fullWidth
                                        size="medium"
                                        startIcon={isAnalyzing ? undefined : <Play className="w-4 h-4" />}
                                        onClick={() => handleAnalyze(job.id)}
                                        disabled={job.status !== 'pending_analysis' || isAnalyzing}
                                        loading={isAnalyzing}
                                    >
                                        {isAnalyzing ? 'Analyzing...' : 'Analyze with JobScout'}
                                    </M3Button>

                                    {/* Draft Application Button - Only if analyzed */}
                                    {job.status === 'ready_to_apply' && (
                                        <M3Button
                                            variant="filled"
                                            color="secondary"
                                            fullWidth
                                            size="medium"
                                            startIcon={isDrafting ? undefined : <FileText className="w-4 h-4" />}
                                            onClick={() => handleDraft(job.id, job.title, job.company)}
                                            disabled={isDrafting}
                                            loading={isDrafting}
                                        >
                                            {isDrafting ? 'Drafting...' : 'Draft Application'}
                                        </M3Button>
                                    )}

                                    {/* View Job Button */}
                                    <M3Button
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        size="medium"
                                        startIcon={<ExternalLink className="w-4 h-4" />}
                                        href={job.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Job
                                    </M3Button>
                                </div>
                            </M3Card>
                        );
                    })}
                </div>
            )}

            {/* Cover Letter Dialog - M3 Styled */}
            {showCoverLetterDialog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={handleCloseCoverLetterDialog}
                >
                    <M3Card
                        variant="tech"
                        elevation={4}
                        padding="none"
                        className="max-w-3xl w-full mx-4 max-h-[80vh] flex flex-col"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        {/* Dialog Header */}
                        <div className="flex justify-between items-start p-6 border-b border-outline-variant">
                            <div>
                                <h2 className="text-headline-large font-bold text-on-surface">
                                    Cover Letter
                                </h2>
                                {coverLetterJob && (
                                    <p className="text-body-large text-on-surface-variant mt-1">
                                        {coverLetterJob.title} at {coverLetterJob.company}
                                    </p>
                                )}
                            </div>
                            <M3IconButton
                                icon={<X className="w-5 h-5" />}
                                ariaLabel="Close dialog"
                                onClick={handleCloseCoverLetterDialog}
                                size="medium"
                            />
                        </div>

                        {/* Dialog Content */}
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="bg-surface-container-high p-4 rounded-tech">
                                <pre className="text-body-medium text-on-surface whitespace-pre-wrap font-mono">
                                    {coverLetter}
                                </pre>
                            </div>
                        </div>

                        {/* Dialog Actions */}
                        <div className="flex justify-end gap-3 p-6 border-t border-outline-variant">
                            <M3Button
                                variant="filled"
                                color="primary"
                                startIcon={<Copy className="w-4 h-4" />}
                                onClick={handleCopy}
                            >
                                {copied ? 'Copied!' : 'Copy to Clipboard'}
                            </M3Button>
                            <M3Button
                                variant="outlined"
                                color="primary"
                                onClick={handleCloseCoverLetterDialog}
                            >
                                Close
                            </M3Button>
                        </div>
                    </M3Card>
                </div>
            )}
        </div>
    );
}
