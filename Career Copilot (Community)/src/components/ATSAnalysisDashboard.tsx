import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowLeft, Upload, CheckCircle, AlertTriangle, XCircle, Eye, Download, Check, X, Brain, BarChart3, Target, Sparkles, TrendingUp } from "lucide-react";

interface ATSAnalysisDashboardProps {
  onBack: () => void;
  onNext?: () => void;
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
      name: "Keyword Optimization",
      score: 89,
      status: 'good',
      suggestions: ["Add more social services terminology", "Include community outreach keywords"]
    },
    {
      name: "Format & Structure",
      score: 95,
      status: 'good',
      suggestions: ["Excellent formatting consistency"]
    },
    {
      name: "Content Quality",
      score: 82,
      status: 'good',
      suggestions: ["Quantify client impact with numbers", "Add more action verbs", "Include recent volunteer work"]
    },
    {
      name: "ATS Compatibility",
      score: 83,
      status: 'good',
      suggestions: ["Use standard section headers", "Reduce special characters", "Add more relevant certifications"]
    }
  ],
  keywordMatches: {
    matched: ["Community Support", "Case Management", "Crisis Intervention", "Mental Health", "Client Advocacy", "Team Collaboration"],
    missing: ["Peer Support", "Recovery Programs", "Group Facilitation", "Documentation", "Risk Assessment", "Cultural Competency"]
  },
  formatIssues: [
    "Consider adding volunteer experience section",
    "Include relevant certifications prominently",
    "Ensure consistent date formatting"
  ]
};

export function ATSAnalysisDashboard({ onBack, onNext }: ATSAnalysisDashboardProps) {
  const [analysisResult] = useState<AnalysisResult>(mockAnalysisResult);
  const [selectedProfile, setSelectedProfile] = useState("Community Support Worker - Nishant Dougall");

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-brand-primary";
    if (score >= 60) return "text-brand-secondary";
    return "text-error";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-primary/10 border-primary/20";
    if (score >= 60) return "bg-secondary/10 border-secondary/20";
    return "bg-error/10 border-error/20";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-brand-primary icon-interactive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-brand-secondary icon-interactive" />;
      case 'poor':
        return <XCircle className="w-4 h-4 text-error icon-interactive" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">ATS Analysis</h1>
            <p className="text-muted-foreground">AI-powered resume optimization insights</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border/50">
            <Upload className="w-4 h-4 mr-2" />
            Upload Resume
          </Button>
          <Button variant="outline" className="border-border/50">
            <Eye className="w-4 h-4 mr-2" />
            View Original
          </Button>
          <Button variant="outline" className="border-border/50">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          {onNext && (
            <Button 
              className="btn-primary-cta"
              onClick={onNext}
            >
              Choose Template
            </Button>
          )}
        </div>
      </div>

      {/* Overall Score Hero Section */}
      <Card className="card-aurora glass p-8 bg-gradient-to-br from-primary/15 via-tertiary/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-xl glow-primary">
                <Brain className="w-6 h-6 text-brand-primary icon-interactive" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gradient-primary">AI Analysis Complete</h3>
                <p className="text-muted-foreground">Your resume has been optimized for ATS systems</p>
              </div>
            </div>
            
            <div className="flex items-baseline gap-4">
              <span className="text-9xl font-bold text-brand-primary ats-score-pulse" style={{ fontSize: '8rem', lineHeight: '0.9' }}>
                {analysisResult.overallScore}%
              </span>
              <span className="text-muted-foreground text-xl">ATS Score</span>
            </div>
            
            <div className="space-y-3 max-w-md">
              <Progress value={analysisResult.overallScore} className="h-6" />
              <p className="text-base text-muted-foreground">
                {analysisResult.overallScore >= 80 ? "Excellent! Your resume is highly optimized for ATS systems." :
                 analysisResult.overallScore >= 60 ? "Good foundation with room for strategic improvements." :
                 "Needs optimization to pass ATS filtering effectively."}
              </p>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <div className="relative">
              <div className={`w-48 h-48 rounded-full flex items-center justify-center border-4 ${getScoreBg(analysisResult.overallScore)} border`}>
                <div className="text-center">
                  <BarChart3 className={`w-16 h-16 ${getScoreColor(analysisResult.overallScore)} mx-auto mb-2 icon-interactive`} />
                  <p className="text-base text-muted-foreground font-medium">Optimization</p>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-primary to-tertiary rounded-full flex items-center justify-center pulse-ai">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <Badge className="bg-primary/10 text-brand-primary border-primary/20 border">
              AI Analyzed
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="card-aurora glass p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-primary icon-interactive" />
              <span className="text-gradient-primary">Keywords</span>
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <p className="font-medium text-foreground text-sm">{selectedProfile}</p>
                <p className="text-xs text-muted-foreground mt-1">Last analyzed: 2 hours ago</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-lg font-bold text-brand-primary">{analysisResult.keywordMatches.matched.length}</p>
                  <p className="text-xs text-muted-foreground">Matched</p>
                </div>
                <div className="text-center p-3 bg-error/5 rounded-lg border border-error/10">
                  <p className="text-lg font-bold text-error">{analysisResult.keywordMatches.missing.length}</p>
                  <p className="text-xs text-muted-foreground">Missing</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="card-aurora glass p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-tertiary icon-interactive" />
              <span className="text-gradient-tertiary">Actionable Insights</span>
            </h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-sm border-primary/20 hover:bg-primary/10">
                <Brain className="w-4 h-4 mr-2 icon-interactive" />
                Optimize for Job
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm border-secondary/20 hover:bg-secondary/10">
                <Eye className="w-4 h-4 mr-2 icon-interactive" />
                Generate Cover Letter
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm border-tertiary/20 hover:bg-tertiary/10">
                <Download className="w-4 h-4 mr-2 icon-interactive" />
                Export Optimized
              </Button>
            </div>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="card-aurora glass p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-primary icon-interactive" />
              <span className="text-gradient-primary">Category Breakdown</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysisResult.categories.map((category, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(category.status)}
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Badge className={`${getScoreBg(category.score)} border font-semibold`}>
                      {category.score}%
                    </Badge>
                  </div>
                  <Progress value={category.score} className="h-2" />
                  <div className="space-y-2">
                    {category.suggestions.map((suggestion, suggestionIndex) => (
                      <div key={suggestionIndex} className="flex items-start gap-2 text-sm">
                        <div className="w-1 h-1 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="card-aurora glass p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-primary icon-interactive" />
              <span className="text-gradient-primary">Keyword Analysis</span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Matched Keywords */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-primary/20">
                  <CheckCircle className="w-5 h-5 text-brand-primary icon-interactive" />
                  <h4 className="font-medium text-brand-primary">
                    Matched ({analysisResult.keywordMatches.matched.length})
                  </h4>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {analysisResult.keywordMatches.matched.map((keyword, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                      <Check className="w-4 h-4 text-brand-primary flex-shrink-0 icon-interactive" />
                      <span className="text-brand-primary font-medium text-sm">{keyword}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-error/20">
                  <XCircle className="w-5 h-5 text-error icon-interactive" />
                  <h4 className="font-medium text-brand-secondary">
                    Missing ({analysisResult.keywordMatches.missing.length})
                  </h4>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {analysisResult.keywordMatches.missing.map((keyword, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-error/5 border border-error/10 hover:bg-error/10 transition-colors">
                      <X className="w-4 h-4 text-error flex-shrink-0 icon-interactive" />
                      <span className="text-error font-medium text-sm">{keyword}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="card-aurora glass p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gradient-aurora icon-interactive" />
              <span className="text-gradient-aurora">AI Optimization Suggestions</span>
            </h3>
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-brand-primary icon-interactive" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-brand-primary">High Impact</h4>
                      <Badge className="bg-primary/10 text-brand-primary border-primary/20 border text-xs">+15 points</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add "Peer Support" and "Recovery Programs" to your skills section as they appear frequently in community support job postings.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-5 bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-brand-secondary icon-interactive" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-brand-secondary">Medium Impact</h4>
                      <Badge className="bg-secondary/10 text-brand-secondary border-secondary/20 border text-xs">+8 points</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Quantify your client impact with specific numbers and outcomes to improve content quality score.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-5 bg-gradient-to-r from-tertiary/10 to-tertiary/5 border border-tertiary/20 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-tertiary/20 rounded-lg">
                    <Eye className="w-5 h-5 text-brand-tertiary icon-interactive" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-brand-tertiary">Format Enhancement</h4>
                      <Badge className="bg-tertiary/10 text-brand-tertiary border-tertiary/20 border text-xs">+3 points</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Consider highlighting any mental health first aid or crisis intervention certifications more prominently.
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