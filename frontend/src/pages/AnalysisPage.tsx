import React, { useState } from 'react';
import { EvidenceUploader } from '@/components/EvidenceUploader';
import { Box, Typography, TextField, Button, Card, Alert, CircularProgress, Chip, Divider, Avatar } from '@mui/material';
import { toast } from 'sonner';
import { Sparkles, Building, Globe, Target, MessageCircle, Heart } from 'lucide-react';

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

interface CorporateProfile {
    name: string;
    mission_statement: string;
    core_values: string[];
    strategic_focus: string;
    communication_style: string;
    known_for: string;
}

interface StrategyResult {
    job_details: any;
    corporate_profile: CorporateProfile | null;
    optimized_resume: {
        resume_text: string;
    };
    strategy_summary: string;
    gap_analysis?: {
        missing_skills: string[];
        evidence_found: string[];
        strategy_advice: string;
    };
}

export const AnalysisPage: React.FC = () => {
    // Inputs
    const [jobUrl, setJobUrl] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [resumeText, setResumeText] = useState('');

    // Results
    const [atsResult, setAtsResult] = useState<AtsResult | null>(null);
    const [strategyResult, setStrategyResult] = useState<StrategyResult | null>(null);

    // Loading States
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);

    const handleAnalysis = async () => {
        if (!resumeText || !jobDescription) {
            toast.error('Please enter both resume text and job description');
            return;
        }

        setIsAnalyzing(true);
        setAtsResult(null);

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

    const handleHolisticStrategy = async () => {
        if (!jobUrl || !resumeText) {
            toast.error('Please provide a Job URL and Resume Text');
            return;
        }

        setIsGeneratingStrategy(true);
        setStrategyResult(null);

        try {
            const response = await fetch('/api/v1/analysis/strategy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    job_url: jobUrl,
                    resume_text: resumeText,
                    missing_keywords: atsResult?.missing_keywords || []
                })
            });

            if (!response.ok) throw new Error('Strategy Generation failed');

            const result = await response.json();
            setStrategyResult(result);
            toast.success('Strategy Generated!');

            // Auto-fill JD if scraping worked
            if (result.job_details) {
                const jdText = `Company: ${result.corporate_profile?.name || 'Unknown'}\nRole: ${result.job_details.role_title}\nTasks: ${(result.job_details.key_responsibilities || []).join(', ')}`;
                setJobDescription(jdText);
            }

        } catch (error) {
            toast.error('Strategy generation failed. Please check the URL.');
            console.error(error);
        } finally {
            setIsGeneratingStrategy(false);
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
                    fontFamily: 'var(--sys-type-display-family)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}
            >
                <Sparkles size={32} color="var(--sys-color-primary)" />
                Application Intelligence
            </Typography>

            {/* NEW: Evidence Uploader */}
            <Box sx={{ mb: 4 }}>
                <EvidenceUploader />
            </Box>

            {/* Input Section */}
            <Card sx={{
                p: 3,
                mb: 3,
                borderRadius: 'var(--sys-shape-pebble)',
                boxShadow: 'var(--sys-elevation-level1)',
                backgroundColor: 'var(--sys-color-surface-container-low)'
            }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'var(--sys-color-primary)' }}>
                    Step 1: Input Details
                </Typography>

                <TextField
                    fullWidth
                    label="Job Listing URL (Recommended for Deep Research)"
                    placeholder="https://linkedin.com/jobs/view/..."
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 'var(--sys-shape-corner-large)',
                        }
                    }}
                />

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

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                    <div className="h-px bg-outline-variant flex-1"></div>
                    <span className="text-on-surface-variant text-sm font-bold opacity-50">OR MANUAL ENTRY</span>
                    <div className="h-px bg-outline-variant flex-1"></div>
                </Box>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Manual Job Description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job description if URL is not available..."
                    sx={{
                        mb: 2,
                        opacity: jobUrl ? 0.6 : 1,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 'var(--sys-shape-corner-large)',
                        }
                    }}
                />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleHolisticStrategy}
                        disabled={isGeneratingStrategy || !jobUrl || !resumeText}
                        sx={{
                            borderRadius: 'var(--sys-shape-corner-full)',
                            px: 4,
                            py: 1.5,
                            backgroundColor: 'var(--sys-color-tertiary)',
                            color: 'var(--sys-color-on-tertiary)',
                            transition: 'all 0.2s',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                backgroundColor: 'var(--sys-color-tertiary-container)',
                            }
                        }}
                    >
                        {isGeneratingStrategy ? <CircularProgress size={24} color="inherit" /> : '🚀 Generate Holistic Strategy'}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={handleAnalysis}
                        disabled={isAnalyzing || !resumeText || !jobDescription}
                        sx={{
                            borderRadius: 'var(--sys-shape-corner-full)',
                            px: 4,
                            py: 1.5,
                            borderColor: 'var(--sys-color-outline)',
                            color: 'var(--sys-color-on-surface)',
                            '&:hover': {
                                backgroundColor: 'var(--sys-color-surface-container-high)',
                            }
                        }}
                    >
                        {isAnalyzing ? <CircularProgress size={24} /> : 'Quick ATS Check'}
                    </Button>
                </Box>
            </Card >

            {/* Strategy Results */}
            {
                strategyResult && strategyResult.corporate_profile && (
                    <Box sx={{ mb: 4, animation: 'fadeIn 0.5s ease-out' }}>

                        {/* Strategy Summary Banner */}
                        <Alert icon={<Target className="w-5 h-5" />} severity="info" sx={{ mb: 3, borderRadius: '16px' }}>
                            <Typography variant="subtitle2" fontWeight="bold">Strategy Applied</Typography>
                            {strategyResult.strategy_summary}
                        </Alert>

                        {/* Corporate Intelligence Card */}
                        <Card sx={{
                            p: 0,
                            mb: 3,
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: 'var(--sys-elevation-level2)',
                            backgroundColor: 'var(--sys-color-surface-container)',
                            border: '1px solid var(--sys-color-outline-variant)'
                        }}>
                            <Box sx={{
                                p: 3,
                                background: 'linear-gradient(135deg, var(--sys-color-primary-container) 0%, var(--sys-color-surface-container) 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <Building className="w-8 h-8 text-primary" />
                                <Box>
                                    <Typography variant="h5" fontWeight="bold" color="var(--sys-color-on-surface)">
                                        {strategyResult.corporate_profile.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.7, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                        Corporate Intelligence
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ p: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>

                                {/* Mission */}
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'var(--sys-color-tertiary)' }}>
                                        <Globe size={18} />
                                        <Typography variant="subtitle2" fontWeight="bold">Mission</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {strategyResult.corporate_profile.mission_statement}
                                    </Typography>
                                </Box>

                                {/* Communication Style */}
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'var(--sys-color-secondary)' }}>
                                        <MessageCircle size={18} />
                                        <Typography variant="subtitle2" fontWeight="bold">Communication Style</Typography>
                                    </Box>
                                    <Chip label={strategyResult.corporate_profile.communication_style} size="small" sx={{ bgcolor: 'var(--sys-color-secondary-container)' }} />
                                </Box>

                                {/* Values */}
                                <Box sx={{ gridColumn: '1 / -1' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'var(--sys-color-error)' }}>
                                        <Heart size={18} />
                                        <Typography variant="subtitle2" fontWeight="bold">Core Values</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {strategyResult.corporate_profile.core_values.map((val, idx) => (
                                            <Chip key={idx} label={val} size="small" variant="outlined" />
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
                    </Box>
                )
            }

            {/* Results Section (ATS or Strategy Optimized Resume) */}
            {
                (strategyResult || atsResult) && (
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
                            {strategyResult ? strategyResult.optimized_resume.resume_text : ''}
                        </Typography>

                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    navigator.clipboard.writeText(strategyResult ? strategyResult.optimized_resume.resume_text : '');
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
                )
            }
        </Box >
    );
};
