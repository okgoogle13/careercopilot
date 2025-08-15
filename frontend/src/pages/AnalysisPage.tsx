import React, { useState, useEffect, FormEvent } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import toast from 'react-hot-toast';

// --- Type Definitions ---
interface KeywordPlacementSuggestion {
    keyword: string;
    suggested_location: string;
    example_sentence: string;
}

interface AtsResult {
    overallScore: number;
    breakdown: {
        keywordScore: number;
        semanticScore: number;
        formattingScore: number;
    };
    matchedKeywords: string[];
    missingKeywords: string[];
    recommendations: string[];
    keyword_placement_suggestions?: KeywordPlacementSuggestion[];
}

const AnalysisPage: React.FC = () => {
    // --- State ---
    const [documents, setDocuments] = useState<any[]>([]);
    const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');
    const [jobDescription, setJobDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [analysisResult, setAnalysisResult] = useState<AtsResult | null>(null);
    const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
    const [optimizedResume, setOptimizedResume] = useState<string | null>(null);


    // --- Effects ---
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchDocuments(user);
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchDocuments = async (user: User) => {
        try {
            const token = await user.getIdToken();
            const response = await fetch('/api/v1/documents', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('Failed to fetch documents.');
            const data = await response.json();
            setDocuments(data);
            if (data.length > 0) {
                setSelectedDocumentId(data[0].id);
            }
        } catch (err) {
            toast.error("Could not load your documents.");
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers ---
    const handleAnalysis = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedDocumentId || !jobDescription) {
            toast.error("Please select a resume and paste a job description.");
            return;
        }

        setIsAnalyzing(true);
        setAnalysisResult(null);
        setOptimizedResume(null); // Reset optimizer on new analysis
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) { toast.error("Authentication error."); setIsAnalyzing(false); return; }

        try {
            const token = await user.getIdToken();
            const response = await fetch(`/api/v1/analysis/ats-score/${selectedDocumentId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ job_description: jobDescription }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Analysis request failed.');
            }
            const result: AtsResult = await response.json();
            setAnalysisResult(result);
            toast.success('Analysis complete!');
        } catch (err: any) {
            toast.error(`Analysis failed: ${err.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleOptimizeResume = async () => {
        if (!selectedDocumentId || !jobDescription) {
            toast.error("Could not find the job description or selected resume to optimize.");
            return;
        }
        setIsOptimizing(true);
        setOptimizedResume(null);
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) { toast.error("Authentication error."); setIsOptimizing(false); return; }

        try {
            const token = await user.getIdToken();
            const response = await fetch(`/api/v1/analysis/optimize-resume/${selectedDocumentId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ job_description: jobDescription }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Resume optimization failed.');
            }
            const data = await response.json();
            setOptimizedResume(data.optimized_text);
            toast.success("Your resume has been optimized!");
        } catch (err: any) {
            toast.error(`Optimization failed: ${err.message}`);
        } finally {
            setIsOptimizing(false);
        }
    };

    // --- Render Functions ---
    const renderResults = () => {
        if (!analysisResult) return null;

        const hasMissingKeywords = analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0;

        return (
            <div id="results-area" className="bg-white shadow-md rounded-lg p-6 animate-fade-in mt-8">
                <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
                
                <div className="flex justify-center mb-6">
                    <div className="relative w-48 h-48">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
                            <path className="text-blue-500" strokeDasharray={`${analysisResult.overallScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" strokeLinecap="round"></path>
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <span className="text-4xl font-bold">{analysisResult.overallScore}</span>
                            <span className="block text-sm">Overall Score</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-3">Score Breakdown</h3>
                        <ul className="space-y-2">
                            <li className="flex justify-between"><span>Keyword Match:</span> <strong>{analysisResult.breakdown.keywordScore.toFixed(1)}%</strong></li>
                            <li className="flex justify-between"><span>Semantic Relevance:</span> <strong>{analysisResult.breakdown.semanticScore.toFixed(1)}%</strong></li>
                            <li className="flex justify-between"><span>Formatting Compliance:</span> <strong>{analysisResult.breakdown.formattingScore.toFixed(1)}%</strong></li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-xl font-semibold mb-3">Top Recommendations</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            {analysisResult.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-3">Matched Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                            {analysisResult.matchedKeywords.map((kw, i) => <span key={i} className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">{kw}</span>)}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-3">Missing Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                            {analysisResult.missingKeywords.map((kw, i) => <span key={i} className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">{kw}</span>)}
                        </div>
                    </div>
                </div>

                {analysisResult.keyword_placement_suggestions && analysisResult.keyword_placement_suggestions.length > 0 && (
                    <div className="mt-8 pt-6 border-t">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Keyword Placement Suggestions</h3>
                        <div className="space-y-4">
                            {analysisResult.keyword_placement_suggestions.map((suggestion, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h4 className="font-bold text-lg text-gray-900">
                                        Keyword: <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-1 rounded-md">{suggestion.keyword}</span>
                                    </h4>
                                    <p className="mt-2 text-sm text-gray-600">
                                        <span className="font-semibold">Suggested Location:</span> {suggestion.suggested_location}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-800 bg-gray-100 p-2 rounded-md border-l-4 border-gray-300">
                                        <span className="font-semibold">Example:</span> "{suggestion.example_sentence}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- Resume Optimizer Section --- */}
                <div className="mt-8 pt-6 border-t">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">Automated Resume Tailoring</h3>
                    {hasMissingKeywords ? (
                        <>
                            <p className="mb-4 text-gray-600">Your resume is missing some keywords. Let our AI tailor it for you in one click.</p>
                            <button onClick={handleOptimizeResume} disabled={isOptimizing} className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105">
                                {isOptimizing ? 'Tailoring Your Resume...' : 'Auto-Tailor My Resume'}
                            </button>
                        </>
                    ) : (
                        <p className="text-green-600 font-semibold">Great news! Your resume already contains all the key skills from the job description.</p>
                    )}

                    {isOptimizing && <div className="mt-4 text-center">Optimizing... Please wait.</div>}

                    {optimizedResume && (
                        <div className="mt-6 animate-fade-in">
                            <h4 className="text-xl font-semibold mb-3">Your Optimized Resume:</h4>
                            <textarea
                                readOnly
                                value={optimizedResume}
                                className="w-full h-96 p-4 border rounded-md bg-gray-50 font-mono text-sm"
                            />
                            <button onClick={() => toast.success("Save functionality coming soon!")} className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Save Optimized Resume
                            </button>
                            {/* Save Optimized Resume button removed until functionality is implemented */}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">ATS Resume Score</h1>
            <p className="text-center text-gray-600 mb-8">Select your resume and paste a job description to get an instant ATS score and actionable feedback.</p>
            
            <form onSubmit={handleAnalysis} className="bg-white shadow-md rounded-lg p-6 mb-8">
                 <div className="mb-4">
                    <label htmlFor="resume-select" className="block text-gray-700 font-bold mb-2">1. Select Your Resume</label>
                    <select id="resume-select" value={selectedDocumentId} onChange={(e) => setSelectedDocumentId(e.target.value)} className="shadow border rounded w-full py-2 px-3" required>
                        {documents.map(doc => (<option key={doc.id} value={doc.id}>{doc.originalFilename}</option>))}
                    </select>
                </div>
                <div className="mb-6">
                    <label htmlFor="job-description" className="block text-gray-700 font-bold mb-2">2. Paste Job Description</label>
                    <textarea id="job-description" rows={10} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" required placeholder="Paste the full job description here..."></textarea>
                </div>
                <div className="text-center">
                    <button type="submit" disabled={isAnalyzing} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105">
                        {isAnalyzing ? 'Analyzing...' : 'Get My Score'}
                    </button>
                </div>
            </form>

            {renderResults()}
        </div>
    );
};

export default AnalysisPage;
