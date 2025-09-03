import React from 'react';
import { Progress } from './progress';
import { Badge } from './badge';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Keyword {
  term: string;
  found: boolean;
  frequency: number;
  importance: 'high' | 'medium' | 'low';
}

interface ATSScoreData {
  overallScore: number;
  breakdown: {
    keywords: number;
    formatting: number;
    experience: number;
    education: number;
    skills: number;
  };
  recommendations: string[];
  matchedKeywords: Keyword[];
  missingKeywords: Keyword[];
  improvement?: {
    previousScore?: number;
    trend: 'up' | 'down' | 'stable';
  };
}

interface ATSScoreDisplayProps {
  data: ATSScoreData;
  className?: string;
  showDetailed?: boolean;
}

const ATSScoreDisplay: React.FC<ATSScoreDisplayProps> = ({
  data,
  className,
  showDetailed = true,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-6 w-6 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
    return <XCircle className="h-6 w-6 text-red-600" />;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Overall Score Card */}
      <Card className={cn('border-2', getScoreBgColor(data.overallScore))}>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            {getScoreIcon(data.overallScore)}
          </div>
          <CardTitle className="text-2xl">ATS Compatibility Score</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-4">
            <span className={cn('text-6xl font-bold', getScoreColor(data.overallScore))}>
              {data.overallScore}
            </span>
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant={data.overallScore >= 80 ? 'default' : data.overallScore >= 60 ? 'secondary' : 'destructive'}>
              {getScoreLabel(data.overallScore)}
            </Badge>
            {data.improvement && data.improvement.previousScore && (
              <div className="flex items-center gap-1 text-sm">
                {getTrendIcon(data.improvement.trend)}
                <span className={cn(
                  'font-medium',
                  data.improvement.trend === 'up' ? 'text-green-600' :
                  data.improvement.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                )}>
                  {data.improvement.trend === 'up' ? '+' : data.improvement.trend === 'down' ? '-' : ''}
                  {Math.abs(data.overallScore - data.improvement.previousScore)} points
                </span>
              </div>
            )}
          </div>
          <Progress
            value={data.overallScore}
            className="w-full max-w-md mx-auto"
          />
        </CardContent>
      </Card>

      {showDetailed && (
        <>
          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(data.breakdown).map(([category, score]) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={cn('font-bold', getScoreColor(score))}>
                      {score}%
                    </span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Keywords Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Matched Keywords */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Matched Keywords ({data.matchedKeywords.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {data.matchedKeywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-green-50 rounded-md border border-green-200"
                    >
                      <span className="font-medium text-green-800">
                        {keyword.term}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          {keyword.importance}
                        </Badge>
                        <span className="text-sm text-green-600">
                          {keyword.frequency}x
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Missing Keywords */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Missing Keywords ({data.missingKeywords.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {data.missingKeywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-red-50 rounded-md border border-red-200"
                    >
                      <span className="font-medium text-red-800">
                        {keyword.term}
                      </span>
                      <Badge variant="outline" className="text-red-700 border-red-300">
                        {keyword.importance}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Improvement Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-yellow-50 rounded-md border border-yellow-200"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-800 text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-yellow-800">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ATSScoreDisplay;