import React, { useState, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Badge } from '../ui/badge';
import { aiServices, ContentOptimizationRequest, ContentOptimizationResult } from '../../services/aiServices';
import toast from 'react-hot-toast';
import {
  FileText,
  TrendingUp,
  Target,
  CheckCircle,
  AlertTriangle,
  Copy,
  Download,
  RefreshCw
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface ContentOptimizationComponentProps {
  initialContent?: string;
  contentType?: 'resume' | 'cover_letter' | 'linkedin' | 'portfolio';
}

export const ContentOptimizationComponent: React.FC<ContentOptimizationComponentProps> = ({
  initialContent = '',
  contentType = 'resume',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [results, setResults] = useState<ContentOptimizationResult | null>(null);
  const [activeTab, setActiveTab] = useState('input');
  const [optimizationSettings, setOptimizationSettings] = useState({
    content_type: contentType,
    target_role: '',
    target_company: '',
    target_industry: '',
    optimization_goals: ['ats_optimization', 'keyword_enhancement'] as Array<'ats_optimization' | 'keyword_enhancement' | 'readability' | 'impact_statements' | 'structure'>,
  });

  const handleOptimization = useCallback(async () => {
    if (!content.trim()) {
      toast.error('Please enter content to optimize');
      return;
    }

    setIsLoading(true);
    try {
      const request: ContentOptimizationRequest = {
        content: content.trim(),
        content_type: optimizationSettings.content_type,
        target_role: optimizationSettings.target_role || undefined,
        target_company: optimizationSettings.target_company || undefined,
        target_industry: optimizationSettings.target_industry || undefined,
        optimization_goals: optimizationSettings.optimization_goals,
      };

      const result = await aiServices.optimizeContent(request);
      setResults(result);
      setActiveTab('results');
      toast.success('Content optimized successfully!');
    } catch (error) {
      console.error('Content optimization error:', error);
      toast.error('Failed to optimize content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [content, optimizationSettings]);

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const optimizationGoalLabels = {
    ats_optimization: 'ATS Optimization',
    keyword_enhancement: 'Keyword Enhancement',
    readability: 'Readability Improvement',
    impact_statements: 'Impact Statements',
    structure: 'Structure & Format',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          AI Content Optimization
        </h2>
        <p className="text-gray-600">
          Optimize your resume, cover letter, and professional content with AI
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">Input & Settings</TabsTrigger>
          <TabsTrigger value="results" disabled={!results}>
            Optimized Content
          </TabsTrigger>
          <TabsTrigger value="analysis" disabled={!results}>
            Analysis & Metrics
          </TabsTrigger>
        </TabsList>

        {/* Input Tab */}
        <TabsContent value="input" className="space-y-6">
          {/* Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Optimization Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <select
                  value={optimizationSettings.content_type}
                  onChange={(e) => setOptimizationSettings(prev => ({
                    ...prev,
                    content_type: e.target.value as typeof prev.content_type
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="resume">Resume</option>
                  <option value="cover_letter">Cover Letter</option>
                  <option value="linkedin">LinkedIn Profile</option>
                  <option value="portfolio">Portfolio</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Role
                </label>
                <input
                  type="text"
                  value={optimizationSettings.target_role}
                  onChange={(e) => setOptimizationSettings(prev => ({ ...prev, target_role: e.target.value }))}
                  placeholder="e.g. Software Engineer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Company
                </label>
                <input
                  type="text"
                  value={optimizationSettings.target_company}
                  onChange={(e) => setOptimizationSettings(prev => ({ ...prev, target_company: e.target.value }))}
                  placeholder="e.g. Google"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Industry
                </label>
                <input
                  type="text"
                  value={optimizationSettings.target_industry}
                  onChange={(e) => setOptimizationSettings(prev => ({ ...prev, target_industry: e.target.value }))}
                  placeholder="e.g. Technology"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optimization Goals
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(optimizationGoalLabels).map(([key, label]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={optimizationSettings.optimization_goals.includes(key as any)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setOptimizationSettings(prev => ({
                            ...prev,
                            optimization_goals: [...prev.optimization_goals, key as any]
                          }));
                        } else {
                          setOptimizationSettings(prev => ({
                            ...prev,
                            optimization_goals: prev.optimization_goals.filter(g => g !== key)
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </Card>

          {/* Content Input */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Content to Optimize</h3>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Paste your resume, cover letter, or other professional content here..."
            />
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {content.length} characters
              </div>
              <Button
                onClick={handleOptimization}
                disabled={isLoading || !content.trim()}
                className="flex items-center"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Target className="mr-2 h-4 w-4" />
                    Optimize Content
                  </>
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results">
          {results && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Optimized Content</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyToClipboard(results.optimized_content)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {results.optimized_content}
                  </pre>
                </div>
              </Card>

              {/* Improvements */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Improvements Made ({results.improvements.length})
                </h3>
                <div className="space-y-4">
                  {results.improvements.map((improvement, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary" className="mb-2">
                          {improvement.type}
                        </Badge>
                        <div className="text-right">
                          <span className="text-sm font-medium text-green-600">
                            +{improvement.impact_score} Impact
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-red-600">Before: </span>
                          <span className="text-sm">{improvement.original}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-green-600">After: </span>
                          <span className="text-sm">{improvement.improved}</span>
                        </div>
                        <div className="text-sm text-gray-600 italic">
                          {improvement.reason}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis">
          {results && (
            <div className="space-y-6">
              {/* Metrics */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Content Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-lg ${getScoreBackground(results.metrics.readability_score)}`}>
                    <div className={`text-2xl font-bold ${getScoreColor(results.metrics.readability_score)}`}>
                      {results.metrics.readability_score}%
                    </div>
                    <div className="text-sm text-gray-600">Readability Score</div>
                  </div>
                  <div className={`p-4 rounded-lg ${getScoreBackground(results.metrics.ats_score)}`}>
                    <div className={`text-2xl font-bold ${getScoreColor(results.metrics.ats_score)}`}>
                      {results.metrics.ats_score}%
                    </div>
                    <div className="text-sm text-gray-600">ATS Score</div>
                  </div>
                  <div className={`p-4 rounded-lg ${getScoreBackground(results.metrics.impact_score)}`}>
                    <div className={`text-2xl font-bold ${getScoreColor(results.metrics.impact_score)}`}>
                      {results.metrics.impact_score}%
                    </div>
                    <div className="text-sm text-gray-600">Impact Score</div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-100">
                    <div className="text-2xl font-bold text-blue-600">
                      {Object.keys(results.metrics.keyword_density).length}
                    </div>
                    <div className="text-sm text-gray-600">Keywords Found</div>
                  </div>
                </div>
              </Card>

              {/* Keyword Density */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Keyword Density</h3>
                <div className="space-y-2">
                  {Object.entries(results.metrics.keyword_density)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 10)
                    .map(([keyword, density]) => (
                      <div key={keyword} className="flex items-center justify-between">
                        <span className="text-sm">{keyword}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${Math.min(density * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">
                            {(density * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>

              {/* Suggestions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Additional Suggestions
                </h3>
                <div className="space-y-2">
                  {results.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start text-sm">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentOptimizationComponent;
