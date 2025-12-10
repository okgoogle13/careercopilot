import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
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
        <AppLayout>
            <div className="min-h-screen bg-surface p-6 md:p-8">
                <div className="mx-auto max-w-[1200px] space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-3xl font-heading font-bold text-foreground">Resume Analysis</h1>
                                <p className="text-muted-foreground font-body">Deep dive into your resume's ATS performance.</p>
                            </div>
                        </div>
                        <Button>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload New Version
                        </Button>
                    </div>

                    {/* Dashboard */}
                    <ATSDashboard {...mockAnalysisData} />

                </div>
            </div>
        </AppLayout>
    );
}
