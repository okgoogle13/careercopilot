import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, Alert, CircularProgress, Chip } from '@mui/material';
import { toast } from 'sonner';

interface AtsResult {
    overallScore: number;
    categories: Array<{
        name: string;
        score: number;
        status: string;
        suggestions: string[];
    }>;
    matched_keywords: string[];
    missing_keywords: string[];
}

interface OptimizedResult {
    optimized_text: string;
}

export const AnalysisPage: React.FC = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [companyUrl, setCompanyUrl] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [atsResult, setAtsResult] = useState<AtsResult | null>(null);
    const [optimizedResume, setOptimizedResume] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);

    const handleAnalysis = async () => {
        if (!resumeText || !jobDescription) {
            toast.error('Please enter both resume text and job description');
            return;
        }

        setIsAnalyzing(true);
        setAtsResult(null);
        setOptimizedResume(null);

        try {
            const response = await fetch('/api/v1/analysis/ats-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resume_text: resumeText,
                    job_description: jobDescription
                })
            });

            if (!response.ok) throw new Error('Analysis failed');

            const result = await response.json();
            setAtsResult(result);
            toast.success('Analysis complete!');
        } catch (error) {
            toast.error('Analysis failed. Please try again.');
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleOptimize = async () => {
        if (!jobDescription) {
            toast.error('Please run analysis first');
            return;
        }

        setIsOptimizing(true);

        try {
            const response = await fetch('/api/v1/analysis/optimize-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    job_description: jobDescription,
                    company_url: companyUrl || undefined
                })
            });

            if (!response.ok) throw new Error('Optimization failed');

            const result: OptimizedResult = await response.json();
            setOptimizedResume(result.optimized_text);
            toast.success('Resume optimized!');
        } catch (error) {
            toast.error('Optimization failed. Please try again.');
            console.error(error);
        } finally {
            setIsOptimizing(false);
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 1400, mx: 'auto' }}>
            {/* Header */}
            <Typography
                variant="h3"
                sx={{
                    mb: 4,
                    fontWeight: 'var(--sys-type-weight-bold)',
                    color: 'var(--sys-color-on-surface)',
                    fontFamily: 'var(--sys-type-display-family)'
                }}
            >
                Resume Analysis & Optimization
            </Typography>

            {/* Input Section */}
            <Card sx={{
                p: 3,
                mb: 3,
                borderRadius: 'var(--sys-shape-pebble)',
                boxShadow: 'var(--sys-elevation-level1)',
                backgroundColor: 'var(--sys-color-surface-container-low)'
            }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'var(--sys-color-primary)' }}>
                    Step 1: Enter Your Information
                </Typography>

                <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Resume Text"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume content here..."
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 'var(--sys-shape-corner-large)',
                        }
                    }}
                />

                <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Job Description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 'var(--sys-shape-corner-large)',
                        }
                    }}
                />

                <TextField
                    fullWidth
                    label="Company Website (Optional)"
                    placeholder="https://company.com"
                    value={companyUrl}
                    onChange={(e) => setCompanyUrl(e.target.value)}
                    helperText="Add company URL for targeted optimization with company-specific keywords and tone"
                    sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 'var(--sys-shape-corner-large)',
                        }
                    }}
                />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        onClick={handleAnalysis}
                        disabled={isAnalyzing || !resumeText || !jobDescription}
                        sx={{
                            borderRadius: 'var(--sys-shape-corner-full)',
                            px: 4,
                            py: 1.5,
                            backgroundColor: 'var(--sys-color-primary)',
                            transition: 'all var(--sys-motion-duration-medium-1) var(--sys-motion-easing-expressive-spring)',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                backgroundColor: 'var(--sys-color-primary-container)',
                            }
                        }}
                    >
                        {isAnalyzing ? <CircularProgress size={24} /> : 'Analyze Resume'}
                    </Button>

                    {atsResult && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleOptimize}
                            disabled={isOptimizing}
                            sx={{
                                borderRadius: 'var(--sys-shape-corner-full)',
                                px: 4,
                                py: 1.5,
                                backgroundColor: 'var(--sys-color-secondary)',
                                transition: 'all var(--sys-motion-duration-medium-1) var(--sys-motion-easing-expressive-spring)',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    backgroundColor: 'var(--sys-color-secondary-container)',
                                }
                            }}
                        >
                            {isOptimizing ? <CircularProgress size={24} /> : '✨ Auto-Tailor Resume'}
                        </Button>
                    )}
                </Box>
            </Card>

            {/* Results Section */}
            {atsResult && (
                <Card sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 'var(--sys-shape-pebble)',
                    boxShadow: 'var(--sys-elevation-level2)',
                    backgroundColor: 'var(--sys-color-surface-container)'
                }}>
                    <Typography variant="h5" sx={{ mb: 2, color: 'var(--sys-color-on-surface)' }}>
                        ATS Analysis Results
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h2" sx={{
                            color: atsResult.overallScore >= 80 ? 'var(--sys-color-tertiary)' :
                                atsResult.overallScore >= 60 ? 'var(--sys-color-secondary)' :
                                    'var(--sys-color-error)',
                            fontWeight: 'var(--sys-type-weight-bold)'
                        }}>
                            {atsResult.overallScore}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Overall ATS Score
                        </Typography>
                    </Box>

                    {atsResult.missing_keywords && atsResult.missing_keywords.length > 0 && (
                        <Alert
                            severity="warning"
                            sx={{
                                mb: 2,
                                borderRadius: 'var(--sys-shape-corner-large)',
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Missing Keywords ({atsResult.missing_keywords.length})
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {atsResult.missing_keywords.map((keyword, idx) => (
                                    <Chip
                                        key={idx}
                                        label={keyword}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'var(--sys-color-error-container)',
                                            color: 'var(--sys-color-on-error-container)'
                                        }}
                                    />
                                ))}
                            </Box>
                        </Alert>
                    )}

                    {atsResult.matched_keywords && atsResult.matched_keywords.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--sys-color-tertiary)' }}>
                                Matched Keywords ({atsResult.matched_keywords.length})
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {atsResult.matched_keywords.slice(0, 10).map((keyword, idx) => (
                                    <Chip
                                        key={idx}
                                        label={keyword}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'var(--sys-color-tertiary-container)',
                                            color: 'var(--sys-color-on-tertiary-container)'
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </Card>
            )}

            {/* Optimized Resume Section */}
            {optimizedResume && (
                <Card sx={{
                    p: 3,
                    borderRadius: 'var(--sys-shape-tech)',
                    boxShadow: 'var(--sys-elevation-level3)',
                    backgroundColor: 'var(--sys-color-surface-container-high)'
                }}>
                    <Typography variant="h5" sx={{ mb: 2, color: 'var(--sys-color-primary)' }}>
                        ✨ Optimized Resume
                    </Typography>
                    <Typography
                        component="pre"
                        sx={{
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'var(--sys-type-body-family)',
                            fontSize: 'var(--sys-type-body-large-size)',
                            lineHeight: 1.6,
                            color: 'var(--sys-color-on-surface)',
                            backgroundColor: 'var(--sys-color-surface)',
                            p: 3,
                            borderRadius: 'var(--sys-shape-corner-large)',
                            border: '1px solid var(--sys-color-outline-variant)'
                        }}
                    >
                        {optimizedResume}
                    </Typography>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                navigator.clipboard.writeText(optimizedResume);
                                toast.success('Copied to clipboard!');
                            }}
                            sx={{
                                borderRadius: 'var(--sys-shape-corner-full)',
                                borderColor: 'var(--sys-color-primary)',
                                color: 'var(--sys-color-primary)'
                            }}
                        >
                            📋 Copy to Clipboard
                        </Button>
                    </Box>
                </Card>
            )}
        </Box>
    );
};
