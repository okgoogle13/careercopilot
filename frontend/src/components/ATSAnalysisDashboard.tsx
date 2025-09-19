import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';

import { Progress } from './ui/progress';
import { DashboardTab } from '../types';
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Download,
  Check,
  X,
} from 'lucide-react';

interface ATSAnalysisDashboardProps {
  onContinue?: () => void;
  onBack: () => void;
  onNext?: () => void;
  activeTab?: DashboardTab;
  onTabChange?: (tab: DashboardTab) => void;
}

interface AnalysisResult {
  overallScore: number;
  categories: {
    name: string;
    score: number;
    status: 'good' | 'warning' | 'poor';
    suggestions: string[];
  }[];
  keywordMatches: {
    matched: string[];
    missing: string[];
  };
  formatIssues: string[];
}

const mockAnalysisResult: AnalysisResult = {
  overallScore: 87,
  categories: [
    {
      name: 'Keyword Optimization',
      score: 89,
      status: 'good',
      suggestions: ['Add more social services terminology', 'Include community outreach keywords'],
    },
    {
      name: 'Format & Structure',
      score: 95,
      status: 'good',
      suggestions: ['Excellent formatting consistency'],
    },
    {
      name: 'Content Quality',
      score: 82,
      status: 'good',
      suggestions: [
        'Quantify client impact with numbers',
        'Add more action verbs',
        'Include recent volunteer work',
      ],
    },
    {
      name: 'ATS Compatibility',
      score: 83,
      status: 'good',
      suggestions: [
        'Use standard section headers',
        'Reduce special characters',
        'Add more relevant certifications',
      ],
    },
  ],
  keywordMatches: {
    matched: [
      'Community Support',
      'Case Management',
      'Crisis Intervention',
      'Mental Health',
      'Client Advocacy',
      'Team Collaboration',
    ],
    missing: [
      'Peer Support',
      'Recovery Programs',
      'Group Facilitation',
      'Documentation',
      'Risk Assessment',
      'Cultural Competency',
    ],
  },
  formatIssues: [
    'Consider adding volunteer experience section',
    'Include relevant certifications prominently',
    'Ensure consistent date formatting',
  ],
};

export function ATSAnalysisDashboard({
  onContinue,
  onBack,
  onNext,
  activeTab,
  onTabChange,
}: ATSAnalysisDashboardProps) {
  const [analysisResult] = useState<AnalysisResult>(mockAnalysisResult);
  const selectedProfile = 'Community Support Worker - Nishant Dougall';

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'poor':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-foreground">ATS Analysis</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload Resume
          </Button>
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            View Original
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          {onNext && (
            <Button className="bg-primary hover:bg-primary/90" onClick={onNext}>
              Choose Template
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Selection & Overall Score */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="font-medium mb-4">Selected Profile</h3>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium text-foreground">{selectedProfile}</p>
              <p className="text-sm text-muted-foreground">Last analyzed: 2 hours ago</p>
            </div>
          </Card>

          <Card className="p-6 text-center">
            <h3 className="font-medium mb-4">Overall ATS Score</h3>
            <div className="space-y-4">
              <div className={`text-4xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                {analysisResult.overallScore}%
              </div>
              <Progress value={analysisResult.overallScore} className="w-full" />
              <div className="text-sm text-muted-foreground">
                {analysisResult.overallScore >= 80
                  ? 'Great! Your resume is well-optimized.'
                  : analysisResult.overallScore >= 60
                    ? 'Good foundation, room for improvement.'
                    : 'Needs significant optimization for ATS systems.'}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Optimize for Job Description
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Generate Cover Letter
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Export Optimized Resume
              </Button>
            </div>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-medium mb-4">Category Breakdown</h3>
            <div className="space-y-4">
              {analysisResult.categories.map((category, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(category.status)}
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className={`font-bold ${getScoreColor(category.score)}`}>
                      {category.score}%
                    </span>
                  </div>
                  <Progress value={category.score} className="w-full" />
                  <div className="ml-6">
                    {category.suggestions.map((suggestion, suggestionIndex) => (
                      <div key={suggestionIndex} className="text-sm text-muted-foreground mb-1">
                        • {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-medium mb-4">Keyword Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matched Keywords Column */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <h4 className="font-medium text-green-400">
                      Matched Keywords ({analysisResult.keywordMatches.matched.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {analysisResult.keywordMatches.matched.map((keyword, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-lg bg-green-400/5 border border-green-400/10"
                      >
                        <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
                        <span className="text-green-400 text-sm">{keyword}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords Column */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <h4 className="font-medium text-red-400">
                      Missing Keywords ({analysisResult.keywordMatches.missing.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {analysisResult.keywordMatches.missing.map((keyword, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-lg bg-red-400/5 border border-red-400/10"
                      >
                        <X className="w-3 h-3 text-red-400 flex-shrink-0" />
                        <span className="text-red-400 text-sm">{keyword}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-medium mb-4">Format Issues</h3>
              <div className="space-y-2">
                {analysisResult.formatIssues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{issue}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-medium mb-4">Optimization Suggestions</h3>
            <div className="space-y-3">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary">High Impact</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add "Peer Support" and "Recovery Programs" to your skills section as they
                      appear frequently in community support job postings.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-400">Medium Impact</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Quantify your client impact with specific numbers and outcomes to improve
                      content quality score.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-400/10 border border-blue-400/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-400">Low Impact</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Consider highlighting any mental health first aid or crisis intervention
                      certifications more prominently.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
