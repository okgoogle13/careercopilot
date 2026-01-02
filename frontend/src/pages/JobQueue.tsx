import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Button,
    Grid,
    Box,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton
} from '@mui/material';
import { PageHeader } from '../components/shared/PageHeader';
import { Sparkles, ExternalLink, CheckCircle, Clock, Play, FileText, Copy, X } from 'lucide-react';

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
        color: 'warning' as const,
        icon: Clock,
    },
    ready_to_apply: {
        label: 'Ready to Apply',
        color: 'success' as const,
        icon: CheckCircle,
    },
    applied: {
        label: 'Applied',
        color: 'default' as const,
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
    const [coverLetterJob, setCoverLetterJob] = useState<{ title: string; company: string } | null>(null);
    const [showCoverLetterDialog, setShowCoverLetterDialog] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/ingest/queue');

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

            const response = await fetch(`http://localhost:8000/api/ingest/${jobId}/analyze`, {
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

        } catch (err) {
            console.error('Error analyzing job:', err);
            setError(err instanceof Error ? err.message : 'Failed to analyze job');
        } finally {
            setAnalyzingJobId(null);
        }
    };

    const handleDraft = async (jobId: string, jobTitle: string, company: string) => {
        try {
            setDraftingJobId(jobId);
            setError(null);

            const response = await fetch(`http://localhost:8000/api/ingest/${jobId}/draft`, {
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

        } catch (err) {
            console.error('Error drafting cover letter:', err);
            setError(err instanceof Error ? err.message : 'Failed to generate cover letter');
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
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="p-6 md:p-12 max-w-7xl animate-in fade-in duration-500">
            <PageHeader
                title="Incoming Job Queue"
                highlightedWord="Queue"
                description="Jobs clipped from your browser extension, ready for analysis"
            />

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {jobs.length === 0 && !error ? (
                <Box sx={{
                    textAlign: 'center',
                    py: 10,
                    opacity: 0.6
                }}>
                    <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <Typography variant="h5" gutterBottom>
                        No jobs in queue
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Use the Chrome extension to clip jobs from Seek, Jora, or EthicalJobs
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {jobs.map((job) => {
                        const StatusIcon = statusConfig[job.status].icon;

                        return (
                            <Grid item xs={12} md={6} lg={4} key={job.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                        },
                                        bgcolor: 'background.paper',
                                        borderRadius: 2,
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        {/* Status Chip */}
                                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Chip
                                                icon={<StatusIcon className="w-4 h-4" />}
                                                label={statusConfig[job.status].label}
                                                color={statusConfig[job.status].color}
                                                size="small"
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(job.date_clipped)}
                                            </Typography>
                                        </Box>

                                        {/* Job Info */}
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            sx={{
                                                fontWeight: 700,
                                                color: 'text.primary',
                                                mb: 1
                                            }}
                                        >
                                            {job.title}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 2 }}
                                        >
                                            {job.company}
                                        </Typography>

                                        {/* Notes */}
                                        {job.notes && (
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    p: 1.5,
                                                    bgcolor: 'action.hover',
                                                    borderRadius: 1,
                                                    fontStyle: 'italic',
                                                    mb: 2
                                                }}
                                            >
                                                "{job.notes}"
                                            </Typography>
                                        )}

                                        {/* Actions */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 'auto' }}>
                                            {/* Analyze Button */}
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={analyzingJobId === job.id ? <CircularProgress size={16} color="inherit" /> : <Play className="w-4 h-4" />}
                                                onClick={() => handleAnalyze(job.id)}
                                                disabled={job.status !== 'pending_analysis' || analyzingJobId === job.id}
                                                fullWidth
                                                sx={{
                                                    bgcolor: 'primary.main',
                                                    '&:hover': {
                                                        bgcolor: 'primary.dark',
                                                    },
                                                }}
                                            >
                                                {analyzingJobId === job.id ? 'Analyzing...' : 'Analyze with JobScout'}
                                            </Button>

                                            {/* Draft Application Button - Only show if analyzed */}
                                            {job.status === 'ready_to_apply' && (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    color="secondary"
                                                    startIcon={draftingJobId === job.id ? <CircularProgress size={16} color="inherit" /> : <FileText className="w-4 h-4" />}
                                                    onClick={() => handleDraft(job.id, job.title, job.company)}
                                                    disabled={draftingJobId === job.id}
                                                    fullWidth
                                                >
                                                    {draftingJobId === job.id ? 'Drafting...' : 'Draft Application'}
                                                </Button>
                                            )}

                                            {/* View Job Button */}
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                href={job.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                startIcon={<ExternalLink className="w-4 h-4" />}
                                                fullWidth
                                            >
                                                View Job
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Cover Letter Dialog */}
            <Dialog
                open={showCoverLetterDialog}
                onClose={handleCloseCoverLetterDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6">Cover Letter</Typography>
                        {coverLetterJob && (
                            <Typography variant="body2" color="text.secondary">
                                {coverLetterJob.title} at {coverLetterJob.company}
                            </Typography>
                        )}
                    </Box>
                    <IconButton onClick={handleCloseCoverLetterDialog} size="small">
                        <X className="w-5 h-5" />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                        p: 2,
                        bgcolor: 'background.default',
                        borderRadius: 1
                    }}>
                        {coverLetter}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCopy} startIcon={<Copy className="w-4 h-4" />} variant="contained">
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </Button>
                    <Button onClick={handleCloseCoverLetterDialog} variant="outlined">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
