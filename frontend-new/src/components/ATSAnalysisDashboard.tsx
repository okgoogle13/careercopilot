import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Target, CheckCircle, AlertCircle, TrendingUp, FileText, Users, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ATSScoreCircle } from './library/ATSScoreCircle';

interface ATSAnalysisDashboardProps {
  onBack?: () => void;
  onNext?: () => void;
}

export function ATSAnalysisDashboard({ onBack, onNext }: ATSAnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'insights'>('overview');

  // Mock data - in real app this would come from props or API
  const analysisData = {
    overallScore: 85,
    keywordMatches: 12,
    totalKeywords: 15,
    sections: {
      formatting: 92,
      keywords: 78,
      experience: 88,
      skills: 85
    },
    matchedKeywords: [
      'Community Services', 'Case Management', 'Crisis Intervention',
      'Mental Health Support', 'Program Coordination', 'Client Assessment',
      'Documentation', 'Multidisciplinary Team', 'Advocacy', 'Resource Coordination',
      'Trauma-Informed Care', 'Cultural Competency'
    ],
    missingKeywords: [
      'Data Management', 'Quality Assurance', 'Risk Assessment'
    ],
    insights: [
      {
        type: 'strength' as const,
        title: 'Strong Experience Match',
        description: 'Your community services experience aligns perfectly with job requirements'
      },
      {
        type: 'improvement' as const,
        title: 'Add Technical Skills',
        description: 'Include specific database management and reporting software experience'
      },
      {
        type: 'opportunity' as const,
        title: 'Highlight Leadership',
        description: 'Emphasize your program coordination and team leadership experience'
      }
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/10';
    if (score >= 60) return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Job Analysis
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              onClick={onNext}
              className="flex items-center gap-2"
            >
              Continue to Templates
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gradient-aurora">
            ATS Compatibility Analysis
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your resume has been analyzed for compatibility with Applicant Tracking Systems.
            Here's how well it matches the job requirements.
          </p>
        </div>

        {/* Main Score Section - Enhanced Size */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Overall Score - Made Larger and More Prominent */}
          <div className="lg:col-span-1">
            <Card className="card-aurora p-8 text-center">
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Target className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold">Overall ATS Score</h2>
                </div>

                {/* Enlarged Score Circle */}
                <div className="flex justify-center">
                  <div className="relative">
                    <ATSScoreCircle
                      score={analysisData.overallScore}
                      size="large"
                      className="w-48 h-48" // Increased from default size
                    />
                    {/* Enhanced pulsing score text overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`text-5xl font-bold pulsing-score-text ${getScoreColor(analysisData.overallScore)}`}>
                          {analysisData.overallScore}%
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          ATS Compatible
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getScoreBgColor(analysisData.overallScore)}`}>
                  <CheckCircle className={`w-4 h-4 ${getScoreColor(analysisData.overallScore)}`} />
                  <span className={`font-medium ${getScoreColor(analysisData.overallScore)}`}>
                    Excellent Match
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  Your resume is well-optimized for ATS systems and matches {analysisData.keywordMatches} of {analysisData.totalKeywords} key requirements.
                </p>
              </div>
            </Card>
          </div>

          {/* Score Breakdown */}
          <div className="lg:col-span-2">
            <Card className="card-surface p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Score Breakdown
              </h3>

              <div className="grid grid-cols-2 gap-6">
                {Object.entries(analysisData.sections).map(([section, score]) => (
                  <div key={section} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {section.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                        {score}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          score >= 80 ? 'bg-green-500' :
                          score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Detailed Analysis Tabs */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 p-1 bg-muted rounded-lg w-fit">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'keywords', label: 'Keywords', icon: Target },
              { id: 'insights', label: 'Insights', icon: Lightbulb }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-surface p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Strengths
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Excellent Formatting</p>
                      <p className="text-sm text-muted-foreground">Clean structure that ATS can easily parse</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Strong Experience Match</p>
                      <p className="text-sm text-muted-foreground">Your background aligns well with job requirements</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Relevant Skills Listed</p>
                      <p className="text-sm text-muted-foreground">Key competencies are clearly highlighted</p>
                    </div>
                  </li>
                </ul>
              </Card>

              <Card className="card-surface p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Missing Keywords</p>
                      <p className="text-sm text-muted-foreground">3 important terms not found in your resume</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Technical Skills Section</p>
                      <p className="text-sm text-muted-foreground">Could benefit from more specific software mentions</p>
                    </div>
                  </li>
                </ul>
              </Card>
            </div>
          )}

          {activeTab === 'keywords' && (
            <div className="space-y-6">
              {/* Keywords Section with Primary Color */}
              <Card className="card-surface p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                  <Target className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                  Keyword Analysis
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-green-600 mb-3">
                      Matched Keywords ({analysisData.matchedKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.matchedKeywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-yellow-600 mb-3">
                      Missing Keywords ({analysisData.missingKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.missingKeywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-4">
              {/* Insights Section with Secondary Color */}
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-secondary)' }}>
                <Lightbulb className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
                Actionable Insights
              </h3>

              {analysisData.insights.map((insight, index) => (
                <Card key={index} className="card-surface p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'strength' ? 'bg-green-500/10' :
                      insight.type === 'improvement' ? 'bg-yellow-500/10' :
                      'bg-blue-500/10'
                    }`}>
                      {insight.type === 'strength' && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {insight.type === 'improvement' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                      {insight.type === 'opportunity' && <TrendingUp className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{insight.title}</h4>
                      <p className="text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-8 border-t border-border">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Job Analysis
          </Button>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Ready to create an optimized resume?
            </div>
            <Button
              onClick={onNext}
              className="flex items-center gap-2 btn-primary-cta"
            >
              Choose Template
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
