import React, { useState, useEffect } from 'react';
import { Card, Button, LoadingSpinner } from '../ui';
import ProgressBar from '../ui/ProgressBar';
import { 
  Target, AlertTriangle, CheckCircle, 
  RefreshCw, Lightbulb, Zap, Eye, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ATSAnalysisResult {
  score: number;
  maxScore: number;
  breakdown: {
    keywordMatch: { score: number; maxScore: number; details: string[] };
    formatting: { score: number; maxScore: number; details: string[] };
    content: { score: number; maxScore: number; details: string[] };
    sections: { score: number; maxScore: number; details: string[] };
  };
  recommendations: {
    id: string;
    type: 'critical' | 'important' | 'suggestion';
    category: 'keywords' | 'formatting' | 'content' | 'structure';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'low' | 'medium' | 'high';
    before?: string;
    after?: string;
    keywords?: string[];
    implemented?: boolean;
  }[];
  missingKeywords: string[];
  presentKeywords: string[];
  suggestions: {
    addKeywords: string[];
    removeContent: string[];
    improveFormatting: string[];
    enhanceContent: string[];
  };
  competitorAnalysis?: {
    averageScore: number;
    topPerformers: number;
    yourRanking: number;
    totalAnalyzed: number;
  };
}

interface ATSFeedbackLoopProps {
  documentId: string;
  jobDescription?: string;
  onOptimizationComplete?: (newScore: number) => void;
  className?: string;
}

export const ATSFeedbackLoop: React.FC<ATSFeedbackLoopProps> = ({
  documentId,
  jobDescription,
  onOptimizationComplete,
  className = ''
}) => {
  const [analysisResult, setAnalysisResult] = useState<ATSAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [selectedRecommendations, setSelectedRecommendations] = useState<Set<string>>(new Set());
  const [optimizationHistory, setOptimizationHistory] = useState<{
    timestamp: Date;
    scoreBefore: number;
    scoreAfter: number;
    changes: string[];
  }[]>([]);
  const [showDetailedView, setShowDetailedView] = useState(false);

  useEffect(() => {
    performATSAnalysis();
  }, [documentId, jobDescription]);

  const performATSAnalysis = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis result
      const mockResult: ATSAnalysisResult = {
        score: 72,
        maxScore: 100,
        breakdown: {
          keywordMatch: { 
            score: 18, 
            maxScore: 25, 
            details: ['Missing 7 key technical terms', 'Good industry keyword coverage', 'Role-specific terms need improvement']
          },
          formatting: { 
            score: 23, 
            maxScore: 25, 
            details: ['Clean, ATS-friendly format', 'Proper section headers', 'Good use of bullet points']
          },
          content: { 
            score: 20, 
            maxScore: 25, 
            details: ['Strong achievement statements', 'Quantified results present', 'Could use more specific metrics']
          },
          sections: { 
            score: 11, 
            maxScore: 25, 
            details: ['Missing skills section', 'Education section could be enhanced', 'Contact info complete']
          }
        },
        recommendations: [
          {
            id: '1',
            type: 'critical',
            category: 'keywords',
            title: 'Add Missing Technical Keywords',
            description: 'Your resume is missing several key technical terms that appear frequently in the job description. Adding these will significantly improve your ATS score.',
            impact: 'high',
            effort: 'low',
            keywords: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL'],
            before: 'Developed web applications using modern JavaScript frameworks',
            after: 'Developed scalable web applications using React, Node.js, and TypeScript, deployed on AWS with Docker containers',
            implemented: false
          },
          {
            id: '2',
            type: 'important',
            category: 'structure',
            title: 'Add Dedicated Skills Section',
            description: 'A clearly labeled skills section helps ATS systems categorize your expertise and improves keyword matching.',
            impact: 'high',
            effort: 'medium',
            implemented: false
          },
          {
            id: '3',
            type: 'suggestion',
            category: 'content',
            title: 'Quantify More Achievements',
            description: 'Add specific numbers and percentages to more of your accomplishments to stand out.',
            impact: 'medium',
            effort: 'medium',
            before: 'Improved system performance',
            after: 'Improved system performance by 40%, reducing page load time from 3.2s to 1.9s',
            implemented: false
          },
          {
            id: '4',
            type: 'suggestion',
            category: 'keywords',
            title: 'Include Soft Skills Keywords',
            description: 'Modern ATS systems also look for soft skills mentioned in job descriptions.',
            impact: 'medium',
            effort: 'low',
            keywords: ['leadership', 'collaboration', 'problem-solving', 'communication'],
            implemented: false
          }
        ],
        missingKeywords: [
          'React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL',
          'leadership', 'agile', 'scrum', 'collaboration', 'microservices'
        ],
        presentKeywords: [
          'JavaScript', 'HTML', 'CSS', 'Git', 'REST API', 'Database', 'Web Development',
          'Problem Solving', 'Team Work', 'Full Stack'
        ],
        suggestions: {
          addKeywords: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
          removeContent: ['Outdated technology references', 'Overly generic statements'],
          improveFormatting: ['Add consistent bullet point style', 'Ensure proper date formatting'],
          enhanceContent: ['Add more quantified achievements', 'Include recent project outcomes']
        },
        competitorAnalysis: {
          averageScore: 68,
          topPerformers: 85,
          yourRanking: 65,
          totalAnalyzed: 100
        }
      };

      setAnalysisResult(mockResult);
    } catch (error) {
      toast.error('Failed to analyze document');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRecommendation = (recommendationId: string) => {
    setSelectedRecommendations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recommendationId)) {
        newSet.delete(recommendationId);
      } else {
        newSet.add(recommendationId);
      }
      return newSet;
    });
  };

  const handleOptimizeDocument = async () => {
    if (!analysisResult || selectedRecommendations.size === 0) return;

    setOptimizing(true);
    try {
      // Simulate optimization process
      await new Promise(resolve => setTimeout(resolve, 3000));

      const selectedRecs = analysisResult.recommendations.filter(rec => 
        selectedRecommendations.has(rec.id)
      );

      // Calculate score improvement
      const scoreImprovement = selectedRecs.reduce((total, rec) => {
        const impact = rec.impact === 'high' ? 8 : rec.impact === 'medium' ? 5 : 2;
        return total + impact;
      }, 0);

      const newScore = Math.min(100, analysisResult.score + scoreImprovement);
      
      // Update optimization history
      setOptimizationHistory(prev => [{
        timestamp: new Date(),
        scoreBefore: analysisResult.score,
        scoreAfter: newScore,
        changes: selectedRecs.map(rec => rec.title)
      }, ...prev]);

      // Update analysis result
      setAnalysisResult(prev => prev ? {
        ...prev,
        score: newScore,
        recommendations: prev.recommendations.map(rec => 
          selectedRecommendations.has(rec.id) 
            ? { ...rec, implemented: true }
            : rec
        )
      } : null);

      setSelectedRecommendations(new Set());
      toast.success(`Document optimized! Score improved from ${analysisResult.score} to ${newScore}`);
      
      if (onOptimizationComplete) {
        onOptimizationComplete(newScore);
      }
    } catch {
      toast.error('Optimization failed. Please try again.');
    } finally {
      setOptimizing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Analyzing document for ATS compatibility...</p>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Analysis Failed</h3>
        <p className="text-muted-foreground mb-4">
          We couldn't analyze your document. Please try again.
        </p>
        <Button onClick={performATSAnalysis} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Retry Analysis
        </Button>
      </Card>
    );
  }

  const pendingRecommendations = analysisResult.recommendations.filter(rec => !rec.implemented);
  const implementedRecommendations = analysisResult.recommendations.filter(rec => rec.implemented);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">ATS Optimization Feedback</h2>
          <p className="text-muted-foreground">
            Improve your resume's ATS compatibility with AI-powered suggestions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowDetailedView(!showDetailedView)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {showDetailedView ? 'Simple View' : 'Detailed View'}
          </Button>
          <Button
            onClick={performATSAnalysis}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Re-analyze
          </Button>
        </div>
      </div>

      {/* Current Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Current ATS Score</h3>
            <p className="text-muted-foreground">
              Based on keyword matching, formatting, and content analysis
            </p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getScoreColor(analysisResult.score)}`}>
              {analysisResult.score}
              <span className="text-xl text-muted-foreground">/{analysisResult.maxScore}</span>
            </div>
            <div className={`text-lg font-medium ${getScoreColor(analysisResult.score)}`}>
              Grade: {getScoreGrade(analysisResult.score)}
            </div>
          </div>
        </div>
        <ProgressBar 
          value={(analysisResult.score / analysisResult.maxScore) * 100} 
          className="h-3"
        />
        
        {analysisResult.competitorAnalysis && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Competitive Analysis</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Your Score</div>
                <div className="font-semibold">{analysisResult.score}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Average Score</div>
                <div className="font-semibold">{analysisResult.competitorAnalysis.averageScore}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Top 10%</div>
                <div className="font-semibold">{analysisResult.competitorAnalysis.topPerformers}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Your Ranking</div>
                <div className="font-semibold">#{analysisResult.competitorAnalysis.yourRanking}</div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Score Breakdown */}
      {showDetailedView && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(analysisResult.breakdown).map(([category, data]) => (
              <div key={category} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h4>
                  <span className="text-lg font-bold">
                    {data.score}/{data.maxScore}
                  </span>
                </div>
                <ProgressBar value={(data.score / data.maxScore) * 100} className="h-2 mb-2" />
                <ul className="text-xs text-muted-foreground space-y-1">
                  {data.details.map((detail, index) => (
                    <li key={index}>• {detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Optimization Recommendations */}
      {pendingRecommendations.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Optimization Recommendations
              </h3>
              <p className="text-muted-foreground">
                Select recommendations to apply automatic optimizations
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setSelectedRecommendations(new Set(pendingRecommendations.map(r => r.id)))}
                variant="outline"
                size="sm"
              >
                Select All
              </Button>
              <Button
                onClick={() => setSelectedRecommendations(new Set())}
                variant="outline"
                size="sm"
              >
                Clear All
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {pendingRecommendations.map(recommendation => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                selected={selectedRecommendations.has(recommendation.id)}
                onToggle={() => handleToggleRecommendation(recommendation.id)}
                detailed={showDetailedView}
              />
            ))}
          </div>

          {selectedRecommendations.size > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">
                    Ready to optimize with {selectedRecommendations.size} recommendations
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Estimated score improvement: +{pendingRecommendations
                      .filter(rec => selectedRecommendations.has(rec.id))
                      .reduce((total, rec) => total + (rec.impact === 'high' ? 8 : rec.impact === 'medium' ? 5 : 2), 0)} points
                  </p>
                </div>
                <Button
                  onClick={handleOptimizeDocument}
                  disabled={optimizing}
                  className="flex items-center gap-2"
                >
                  {optimizing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Apply Optimizations
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Implemented Recommendations */}
      {implementedRecommendations.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Applied Optimizations
          </h3>
          <div className="space-y-3">
            {implementedRecommendations.map(recommendation => (
              <div key={recommendation.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-900">{recommendation.title}</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                    {recommendation.impact} impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Keywords Analysis */}
      {showDetailedView && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Missing Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {analysisResult.missingKeywords.map(keyword => (
                <span
                  key={keyword}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-green-600">Present Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {analysisResult.presentKeywords.map(keyword => (
                <span
                  key={keyword}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Optimization History */}
      {optimizationHistory.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Optimization History</h3>
          <div className="space-y-3">
            {optimizationHistory.map((entry, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    Score improved from {entry.scoreBefore} to {entry.scoreAfter} 
                    <span className="text-green-600 ml-2">
                      (+{entry.scoreAfter - entry.scoreBefore} points)
                    </span>
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {entry.timestamp.toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Changes applied:</strong> {entry.changes.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

// Recommendation Card Component
const RecommendationCard: React.FC<{
  recommendation: ATSAnalysisResult['recommendations'][0];
  selected: boolean;
  onToggle: () => void;
  detailed: boolean;
}> = ({ recommendation, selected, onToggle, detailed }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'important': return 'border-yellow-200 bg-yellow-50';
      case 'suggestion': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'important': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'suggestion': return <Lightbulb className="w-4 h-4 text-blue-600" />;
      default: return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
      selected ? 'border-primary bg-primary/5' : getTypeColor(recommendation.type)
    }`} onClick={onToggle}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="mt-1"
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getTypeIcon(recommendation.type)}
            <h4 className="font-medium">{recommendation.title}</h4>
            <span className="text-xs px-2 py-1 rounded capitalize bg-white/50">
              {recommendation.type}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              recommendation.impact === 'high' ? 'bg-red-100 text-red-700' :
              recommendation.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {recommendation.impact} impact
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            {recommendation.description}
          </p>

          {detailed && (
            <>
              {recommendation.before && recommendation.after && (
                <div className="space-y-2 mb-3">
                  <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                    <strong>Before:</strong> {recommendation.before}
                  </div>
                  <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                    <strong>After:</strong> {recommendation.after}
                  </div>
                </div>
              )}

              {recommendation.keywords && (
                <div className="mb-3">
                  <div className="text-sm font-medium mb-1">Keywords to add:</div>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.keywords.map(keyword => (
                      <span key={keyword} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Impact: {recommendation.impact}</span>
            <span>Effort: {recommendation.effort}</span>
            <span>Category: {recommendation.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSFeedbackLoop;