import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { AnalysisCardSkeleton } from './ui/LoadingStates';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Download,
} from 'lucide-react';

interface ATSAnalysisDashboardProps {
  onBack: () => void;
}

interface UserProfile {
  name: string;
  experience: string[];
  skills: string[];
  education: string;
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

async function getATSAnalysis(jobDescription: string, userProfile: UserProfile): Promise<AnalysisResult> {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `
Analyze the following resume/profile against this job description for ATS compatibility.

Job Description:
${jobDescription}

User Profile:
${JSON.stringify(userProfile, null, 2)}

Provide a detailed ATS analysis in the following JSON format:
{
  "overallScore": (number 0-100),
  "categories": [
    {
      "name": "Keyword Optimization",
      "score": (number 0-100),
      "status": "good" | "warning" | "poor",
      "suggestions": ["suggestion1", "suggestion2"]
    },
    {
      "name": "Format & Structure", 
      "score": (number 0-100),
      "status": "good" | "warning" | "poor",
      "suggestions": ["suggestion1", "suggestion2"]
    }
  ],
  "keywordMatches": {
    "matched": ["keyword1", "keyword2"],
    "missing": ["keyword3", "keyword4"]
  },
  "formatIssues": ["issue1", "issue2"]
}

Focus on ATS compatibility, keyword matching, and formatting suggestions.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error('No response from Gemini API');
    }

    // Extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini API');
    }

    const analysisResult = JSON.parse(jsonMatch[0]);
    return analysisResult;
    
  } catch (error) {
    console.error('Error getting ATS analysis:', error);
    throw error;
  }
}


export function ATSAnalysisDashboard({ onBack }: ATSAnalysisDashboardProps) {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [selectedProfile] = useState(
    'Community Support Worker - Nishant Dougall'
  );

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description first.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock user profile data - in a real app this would come from props or context
      const userProfile = {
        name: selectedProfile,
        experience: ['Community Support', 'Case Management', 'Crisis Intervention'],
        skills: ['Mental Health', 'Client Advocacy', 'Team Collaboration'],
        education: 'Bachelor\'s in Social Work'
      };
      
      const result = await getATSAnalysis(jobDescription, userProfile);
      setAnalysisResult(result);
      toast.success('Analysis completed successfully!');
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to analyze resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Job Description Input */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Job Description</h2>
        <Textarea
          placeholder="Paste the job description here to analyze your resume compatibility..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={6}
          className="mb-4"
        />
        <Button 
          onClick={handleAnalyze}
          disabled={isLoading || !jobDescription.trim()}
          className="bg-primary hover:bg-primary/90"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Resume'}
        </Button>
      </Card>

      {/* Analysis Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <AnalysisCardSkeleton key={index} />
          ))}
        </div>
      ) : analysisResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Selection & Overall Score */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="font-medium mb-4">Selected Profile</h3>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium text-foreground">{selectedProfile}</p>
              <p className="text-sm text-muted-foreground">
                Last analyzed: 2 hours ago
              </p>
            </div>
          </Card>

          <Card className="p-6 text-center">
            <h3 className="font-medium mb-4">Overall ATS Score</h3>
            <div className="space-y-4">
              <div
                className={`text-4xl font-bold ${getScoreColor(analysisResult.overallScore)}`}
              >
                {analysisResult.overallScore}%
              </div>
              <Progress
                value={analysisResult.overallScore}
                className="w-full"
              />
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
                    <span
                      className={`font-bold ${getScoreColor(category.score)}`}
                    >
                      {category.score}%
                    </span>
                  </div>
                  <Progress value={category.score} className="w-full" />
                  <div className="ml-6">
                    {category.suggestions.map((suggestion, suggestionIndex) => (
                      <div
                        key={suggestionIndex}
                        className="text-sm text-muted-foreground mb-1"
                      >
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
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-2">
                    Matched Keywords (
                    {analysisResult.keywordMatches.matched.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywordMatches.matched.map(
                      (keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-green-400/10 text-green-400 border-green-400/20"
                        >
                          {keyword}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-400 mb-2">
                    Missing Keywords (
                    {analysisResult.keywordMatches.missing.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywordMatches.missing.map(
                      (keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-red-400/10 text-red-400 border-red-400/20"
                        >
                          {keyword}
                        </Badge>
                      )
                    )}
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
                      Add "Peer Support" and "Recovery Programs" to your skills
                      section as they appear frequently in community support job
                      postings.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-400">
                      Medium Impact
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Quantify your client impact with specific numbers and
                      outcomes to improve content quality score.
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
                      Consider highlighting any mental health first aid or
                      crisis intervention certifications more prominently.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Enter a job description above and click "Analyze Resume" to get started.
          </p>
        </div>
      )}
    </div>
  );
}
