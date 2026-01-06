import { useState, useEffect } from 'react';
import { FileText, ChevronDown, ChevronUp, CheckCircle, AlertCircle } from 'lucide-react';

interface ResumeManagerProps {
    onResumeChange: (resumeText: string) => void;
    initialResume?: string;
}

const MAX_RESUME_LENGTH = 4000; // Match backend limit

export const ResumeManager = ({ onResumeChange, initialResume = '' }: ResumeManagerProps) => {
    const [resumeText, setResumeText] = useState<string>(initialResume);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Load resume from chrome.storage.local on mount
    useEffect(() => {
        chrome.storage.local.get(['resumeText', 'resumeLastSaved'], (result) => {
            if (result.resumeText) {
                setResumeText(result.resumeText);
                onResumeChange(result.resumeText);
            }
            if (result.resumeLastSaved) {
                setLastSaved(new Date(result.resumeLastSaved));
            }

            // Auto-expand if no resume exists
            if (!result.resumeText) {
                setIsExpanded(true);
            }
        });
    }, []);

    // Save to storage with debounce effect
    const saveToStorage = async (text: string) => {
        setIsSaving(true);
        const savedAt = new Date();

        await chrome.storage.local.set({
            resumeText: text,
            resumeLastSaved: savedAt.toISOString()
        });

        setLastSaved(savedAt);
        setIsSaving(false);
    };

    // Handle text change
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setResumeText(newText);
        onResumeChange(newText);
    };

    // Handle blur (auto-save)
    const handleBlur = () => {
        if (resumeText !== initialResume) {
            saveToStorage(resumeText);
        }
    };

    // Handle clear
    const handleClear = async () => {
        setResumeText('');
        onResumeChange('');
        await chrome.storage.local.remove(['resumeText', 'resumeLastSaved']);
        setLastSaved(null);
    };

    // Calculate status
    const hasResume = resumeText.length > 0;
    const isOverLimit = resumeText.length > MAX_RESUME_LENGTH;
    const characterCount = resumeText.length;
    const percentage = Math.min((characterCount / MAX_RESUME_LENGTH) * 100, 100);

    // Status badge color
    const statusBadgeColor = hasResume
        ? 'bg-green-100 text-green-800 border-green-300'
        : 'bg-gray-100 text-gray-600 border-gray-300';

    const statusIcon = hasResume
        ? <CheckCircle className="w-3.5 h-3.5" />
        : <AlertCircle className="w-3.5 h-3.5" />;

    const statusText = hasResume ? 'Saved' : 'Empty';

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {/* Accordion Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 flex items-center justify-between group"
            >
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-gray-800">Resume Context</span>

                    {/* Status Badge */}
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${statusBadgeColor}`}>
                        {statusIcon}
                        {statusText}
                    </span>

                    {/* Character Count Preview (when collapsed) */}
                    {!isExpanded && hasResume && (
                        <span className="text-xs text-gray-500 font-mono">
                            {Math.round(characterCount / 1000)}K chars
                        </span>
                    )}
                </div>

                {/* Chevron Icon */}
                <div className="transform transition-transform duration-200 group-hover:scale-110">
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                </div>
            </button>

            {/* Accordion Content */}
            {isExpanded && (
                <div className="p-4 bg-white border-t border-gray-100">
                    {/* Instructions */}
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 leading-relaxed">
                            <strong>💡 Tip:</strong> Paste your resume here for personalized job fit analysis.
                            This will be saved locally and included with each analysis request.
                        </p>
                    </div>

                    {/* Textarea */}
                    <textarea
                        value={resumeText}
                        onChange={handleTextChange}
                        onBlur={handleBlur}
                        placeholder="Paste your resume text here (plain text or minimal formatting)...&#10;&#10;Example:&#10;Jane Smith&#10;Melbourne, VIC | jane@email.com&#10;&#10;Experience:&#10;- Senior Financial Analyst at ABC Corp (2019-2024)&#10;- Budget management and stakeholder coordination..."
                        className={`w-full h-64 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical font-mono text-sm transition-colors ${isOverLimit ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                    />

                    {/* Footer: Stats and Actions */}
                    <div className="mt-3 flex items-center justify-between">
                        {/* Left: Character Count */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-mono ${isOverLimit ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                                    {characterCount.toLocaleString()} / {MAX_RESUME_LENGTH.toLocaleString()} characters
                                </span>
                                {isOverLimit && (
                                    <span className="text-xs text-red-600 font-medium">
                                        ⚠️ Exceeds limit (will be truncated)
                                    </span>
                                )}
                            </div>

                            {/* Progress Bar */}
                            <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${percentage < 70 ? 'bg-green-500' :
                                            percentage < 90 ? 'bg-yellow-500' :
                                                'bg-red-500'
                                        }`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>

                            {/* Last Saved */}
                            {lastSaved && (
                                <span className="text-xs text-gray-500">
                                    {isSaving ? (
                                        <span className="text-indigo-600">💾 Saving...</span>
                                    ) : (
                                        <>Last saved: {lastSaved.toLocaleTimeString()}</>
                                    )}
                                </span>
                            )}
                        </div>

                        {/* Right: Clear Button */}
                        {hasResume && (
                            <button
                                onClick={handleClear}
                                className="px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-300 rounded-md font-medium transition-colors"
                            >
                                Clear Resume
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
