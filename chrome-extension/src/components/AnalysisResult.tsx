import { useEffect, useRef } from 'react';

interface AnalysisResultProps {
    analysis: string;
}

const AnalysisResult = ({ analysis }: AnalysisResultProps) => {
    const resultRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to analysis result when it appears
        if (resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [analysis]);

    return (
        <div ref={resultRef} className="mt-6 bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-primary-600 mb-3">AI Analysis</h3>
            <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                    {analysis}
                </pre>
            </div>
        </div>
    );
};

export default AnalysisResult;
