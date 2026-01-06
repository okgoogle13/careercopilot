import { useState, useEffect } from 'react';
import { JobData, JobAnalysisResponse, JobAnalysisRequest } from '../types';
import JobInfo from './JobInfo';
import AnalysisResult from './AnalysisResult';
import StatusMessage from './StatusMessage';
import { LoadingSpinner } from './shared/LoadingSpinner';
import { ATSScoreCircle } from './shared/ATSScoreCircle';
import { ResumeManager } from './ResumeManager';

const JobAnalyzer = () => {
    const [jobData, setJobData] = useState<JobData | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [score, setScore] = useState<number>(0);
    const [resumeText, setResumeText] = useState<string>('');
    const [savedJobId, setSavedJobId] = useState<string | null>(null);
    const [jobSaved, setJobSaved] = useState<boolean>(false);
    const [deadlineFound, setDeadlineFound] = useState<string | null>(null);
    const [status, setStatus] = useState<{
        type: 'idle' | 'loading' | 'success' | 'error';
        message: string;
    }>({ type: 'idle', message: '' });

    // Resume text is managed by ResumeManager component
    const handleResumeChange = (text: string) => {
        setResumeText(text);
    };

    const calculateScore = (analysisText: string): number => {
        // Calculate a score based on analysis content
        // Look for positive indicators in the text
        const positiveKeywords = [
            'strong match',
            'excellent',
            'great fit',
            'highly qualified',
            'perfect',
            'ideal',
            'recommended',
            'well-suited',
        ];
        const negativeKeywords = [
            'not connected',
            'error',
            'failed',
            'missing',
            'unavailable',
            'mock',
        ];

        const lowerText = analysisText.toLowerCase();

        // Count positive and negative matches
        const positiveCount = positiveKeywords.filter((kw) => lowerText.includes(kw)).length;
        const negativeCount = negativeKeywords.filter((kw) => lowerText.includes(kw)).length;

        // If it's a mock/error message, return 0
        if (negativeCount > 0) {
            return 0;
        }

        // Calculate score: 60 base + up to 40 bonus points
        const bonusPoints = Math.min(positiveCount * 10, 40);
        return Math.min(60 + bonusPoints, 100);
    };

    const handleScrapeJob = async () => {
        try {
            setStatus({ type: 'loading', message: 'Scraping job data from page...' });

            // Get the active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (!tab.id) {
                throw new Error('No active tab found');
            }

            // Send message to content script to extract job data
            const response = await chrome.tabs.sendMessage(tab.id, {
                type: 'EXTRACT_JOB_DATA',
            });

            if (response.success) {
                setJobData(response.data);
                setAnalysis(null); // Clear previous analysis
                setScore(0); // Reset score
                setStatus({ type: 'success', message: 'Job data extracted successfully!' });
                setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
            } else {
                throw new Error(response.error || 'Failed to extract job data');
            }
        } catch (error) {
            console.error('Scraping error:', error);
            setStatus({
                type: 'error',
                message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            });
        }
    };

    const handleAnalyzeJob = async () => {
        if (!jobData) {
            setStatus({ type: 'error', message: 'No job data available. Please scrape a job first.' });
            return;
        }

        try {
            setStatus({ type: 'loading', message: 'Analyzing job posting with AI...' });

            // Prepare payload with resume context if available
            const payload: JobAnalysisRequest = {
                title: jobData.title,
                company: jobData.company,
                description: jobData.description,
                location: jobData.location,
                employmentType: jobData.employmentType,
                datePosted: jobData.datePosted,
                salary: jobData.salary,
                url: jobData.url,
                source: jobData.source,
                resume_text: resumeText || undefined, // Include resume if available
            };

            // Send to backend API
            const response = await fetch('http://localhost:8000/api/chrome-extension/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const result: JobAnalysisResponse = await response.json();

            // Display analysis result and calculate score
            setAnalysis(result.markdown_analysis);
            setScore(calculateScore(result.markdown_analysis));
            setSavedJobId(result.job_id || null);
            setJobSaved(result.job_saved || false);
            setDeadlineFound(result.deadline_found || null);

            // Show success message
            const successMessage = result.job_saved
                ? 'Analysis complete! Job saved to dashboard.'
                : 'Analysis complete!';
            setStatus({ type: 'success', message: successMessage });
            setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
        } catch (error) {
            console.error('Analysis error:', error);
            const errorMessage =
                error instanceof Error && error.message.includes('Failed to fetch')
                    ? 'Cannot connect to backend. Make sure the Python API is running on http://localhost:8000'
                    : `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`;

            setStatus({ type: 'error', message: errorMessage });
        }
    };

    const handleClearAnalysis = () => {
        setAnalysis(null);
        setScore(0);
        setSavedJobId(null);
        setJobSaved(false);
        setDeadlineFound(null);
        setStatus({ type: 'idle', message: '' });
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl mx-auto">
            <StatusMessage status={status} />

            {!jobData ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-600 mb-6">
                        Navigate to a job posting and click "Scrape Job Data" to begin
                    </p>
                    <button
                        onClick={handleScrapeJob}
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Scrape Job Data
                    </button>
                </div>
            ) : (
                <>
                    <JobInfo jobData={jobData} />

                    {/* Resume Manager Component */}
                    <div className="mt-6 mb-6">
                        <ResumeManager
                            onResumeChange={handleResumeChange}
                            initialResume={resumeText}
                        />
                    </div>

                    {/* Loading State with Beautiful Spinner */}
                    {status.type === 'loading' && status.message.includes('Analyzing') && (
                        <div className="mt-8 mb-8">
                            <LoadingSpinner
                                size="lg"
                                variant="wave"
                                color="#667eea"
                                message="Consulting AI Agent..."
                            />
                        </div>
                    )}

                    {/* Analysis Complete - Show Score and Results */}
                    {analysis && status.type !== 'loading' && (
                        <div className="mt-8 space-y-6 animate-in fade-in duration-500">
                            {/* Job Saved Badge */}
                            {jobSaved && savedJobId && (
                                <div className="flex justify-center mb-4">
                                    <a
                                        href={`http://localhost:3000/dashboard/jobs/${savedJobId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300 rounded-lg text-green-800 hover:bg-green-200 transition-colors duration-200 group"
                                    >
                                        <svg
                                            className="w-5 h-5 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span className="text-sm font-semibold">
                                            Job Saved to Dashboard
                                        </span>
                                        <svg
                                            className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform duration-200"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            )}

                            {/* Calendar Reminder Badge */}
                            {deadlineFound && (
                                <div className="flex justify-center mb-4 -mt-2">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
                                        <svg
                                            className="w-5 h-5 text-blue-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm font-semibold">Reminder Set!</span>
                                            <span className="text-xs opacity-75">Deadline: {deadlineFound}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Score Circle - The Crown Jewel */}
                            {score > 0 && (
                                <div className="flex justify-center mb-6">
                                    <ATSScoreCircle score={score} size={140} animated={true} />
                                </div>
                            )}

                            {/* Analysis Content */}
                            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                <div className="px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                        🤖 AI Agent Insights
                                    </h3>
                                </div>
                                <div className="p-4">
                                    <AnalysisResult analysis={analysis} />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleClearAnalysis}
                                    className="flex-1 px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Clear & Scan New Job
                                </button>
                                <button
                                    onClick={handleScrapeJob}
                                    className="px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Refresh Data
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Analyze Button (only show when no analysis) */}
                    {!analysis && status.type !== 'loading' && (
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleAnalyzeJob}
                                disabled={status.type === 'loading'}
                                className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                Analyze Job Fit
                            </button>
                            <button
                                onClick={handleScrapeJob}
                                className="px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                            >
                                Refresh Data
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default JobAnalyzer;
