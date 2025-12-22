import React from 'react';
import { ATSDashboard, ATSDashboardProps } from '@/components/analysis/ATSDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload } from 'lucide-react';

export default function Analysis() {
    // Mock Data
    const mockAnalysisData: ATSDashboardProps = {
        overallScore: 85,
        sections: {
            keywords: { score: 92, status: 'good' },
            formatting: { score: 100, status: 'good' },
            experience: { score: 78, status: 'warning' },
            skills: { score: 85, status: 'good' },
        },
        insights: [
            { type: 'Strength', message: 'Strong use of action verbs in the experience section.' },
            { type: 'Optimization', message: 'Consider adding "React Native" to your skills to match more job descriptions.' },
            { type: 'Formatting', message: 'Excellent readability and consistent layout.' },
        ]
    };

    return (
        <div className="relative">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-2 text-[#E6E1E5] tracking-tight leading-[1.1]">
                        Performance <span className="font-light italic text-[#D0BCFF]">Analysis</span>
                    </h1>
                    <p className="text-[#CAC4D0]">Track your job search performance and get insights</p>
                </div>
                <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Version
                </Button>
            </div>

            {/* Dashboard */}
            <ATSDashboard {...mockAnalysisData} />
        </div>
    );
}
