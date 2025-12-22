/**
 * ELECTRIC ALCHEMIST: ATS ANALYSIS DASHBOARD
 *
 * Dashboard for displaying ATS analysis results.
 */

import React from 'react';
import { Card, Button, Badge } from '@/components';
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export interface AnalysisResult {
    overallScore: number;
    keywordMatches: number;
    totalKeywords: number;
    sections: {
        formatting: number;
        keywords: number;
        experience: number;
        skills: number;
    };
    matchedKeywords: string[];
    missingKeywords: string[];
    insights: {
        type: string;
        title: string;
        description: string;
    }[];
}

interface ATSAnalysisDashboardProps {
    data: AnalysisResult;
    onBackToJobAnalysis?: () => void;
    onContinueToTemplates?: () => void;
}

export const ATSAnalysisDashboard: React.FC<ATSAnalysisDashboardProps> = ({
    data,
    onBackToJobAnalysis,
    onContinueToTemplates,
}) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <Button variant="outline" onClick={onBackToJobAnalysis}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Job
                </Button>
                <Button onClick={onContinueToTemplates}>
                    Continue to Templates
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Card */}
                <Card className="p-6 md:col-span-1 text-center">
                    <h3 className="text-hero text-lg font-semibold mb-4">Overall Score</h3>
                    <div className="text-6xl font-bold text-primary mb-2">{data.overallScore}</div>
                    <p className="text-human text-sm text-on-surface-variant">ATS Compatibility</p>
                </Card>

                {/* Breakdown */}
                <Card className="p-6 md:col-span-2">
                    <h3 className="text-hero text-lg font-semibold mb-4">Score Breakdown</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(data.sections).map(([key, score]) => (
                            <div key={key} className="text-center">
                                <div className="text-xl font-bold text-on-surface mb-1">{score}%</div>
                                <div className="text-xs text-on-surface-variant capitalize">{key}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Keywords */}
                <Card className="p-6">
                    <h3 className="text-hero text-lg font-semibold mb-4">Keywords</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium mb-2 text-green-600 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-1" /> Matched ({data.matchedKeywords.length})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {data.matchedKeywords.map((keyword) => (
                                    <Badge key={keyword} variant="outline" className="border-green-200 bg-green-50 text-green-700">
                                        {keyword}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-2 text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" /> Missing ({data.missingKeywords.length})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {data.missingKeywords.map((keyword) => (
                                    <Badge key={keyword} variant="outline" className="border-red-200 bg-red-50 text-red-700">
                                        {keyword}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Insights */}
                <Card className="p-6">
                    <h3 className="text-hero text-lg font-semibold mb-4">Insights</h3>
                    <div className="space-y-4">
                        {data.insights.map((insight, index) => (
                            <div key={index} className="p-4 rounded-lg bg-surface-container">
                                <h4 className="text-base font-medium mb-1">{insight.title}</h4>
                                <p className="text-sm text-on-surface-variant">{insight.description}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};
