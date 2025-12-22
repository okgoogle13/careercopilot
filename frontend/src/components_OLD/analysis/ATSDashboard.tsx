import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, TrendingUp, Info, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AnalysisSection {
    score: number;
    status: 'good' | 'warning' | 'poor';
}

export interface ATSDashboardProps {
    overallScore: number;
    sections: {
        keywords: AnalysisSection;
        formatting: AnalysisSection;
        experience: AnalysisSection;
        skills: AnalysisSection;
    };
    insights?: { type: string, message: string }[];
}

const getStatusColor = (status: 'good' | 'warning' | 'poor') => {
    switch (status) {
        case 'good': return 'text-green-500';
        case 'warning': return 'text-yellow-500';
        case 'poor': return 'text-red-500';
        default: return 'text-muted-foreground';
    }
};

const getStatusBg = (status: 'good' | 'warning' | 'poor') => {
    switch (status) {
        case 'good': return 'bg-green-500/10 border-green-500/20';
        case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
        case 'poor': return 'bg-red-500/10 border-red-500/20';
        default: return 'bg-muted';
    }
};

export const ATSDashboard: React.FC<ATSDashboardProps> = ({ overallScore, sections, insights }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Score Hero */}
            <Card className="lg:col-span-1 bg-gradient-to-br from-surface-container to-surface-container-high border-primary/10">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
                    <div className="relative mb-6">
                        {/* Simple CSS Circle for now */}
                        <div className="w-48 h-48 rounded-full border-8 border-surface-container-low flex items-center justify-center relative">
                            <div
                                className="absolute inset-0 rounded-full border-8 border-transparent border-t-primary border-r-primary transform -rotate-45"
                                style={{ strokeDasharray: 283, strokeDashoffset: 283 * (1 - overallScore / 100) }} // Simplified visual 
                            />
                            <div className="flex flex-col items-center">
                                <span className="text-6xl font-heading font-black text-foreground">{overallScore}</span>
                                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-1">ATS Score</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-muted-foreground font-body max-w-[250px]">
                        Your resume is highly optimized for Applicant Tracking Systems.
                    </p>
                </CardContent>
            </Card>

            {/* Breakdown */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="font-heading text-xl">Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Render Category Rows */}
                    {[
                        { label: 'Keyword Optimization', data: sections.keywords, icon: TrendingUp },
                        { label: 'Formatting & Structure', data: sections.formatting, icon: Info },
                        { label: 'Experience Impact', data: sections.experience, icon: CheckCircle2 },
                        { label: 'Skills Match', data: sections.skills, icon: AlertCircle },
                    ].map((item) => (
                        <div key={item.label}>
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <item.icon className={cn("h-4 w-4", getStatusColor(item.data.status))} />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                <span className={cn("font-bold", getStatusColor(item.data.status))}>
                                    {item.data.score}/100
                                </span>
                            </div>
                            <Progress value={item.data.score} className="h-2" />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Insights Panel */}
            {insights && (
                <Card className="lg:col-span-3 bg-surface-container/30">
                    <CardHeader>
                        <CardTitle className="font-heading text-lg flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            AI Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        {insights.map((insight, idx) => (
                            <div key={idx} className="flex gap-3 p-4 rounded-lg bg-surface border border-border">
                                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm text-foreground">{insight.type}</p>
                                    <p className="text-sm text-muted-foreground">{insight.message}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

        </div>
    );
};
