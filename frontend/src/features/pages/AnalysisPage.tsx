/**
 * ELECTRIC ALCHEMIST: ANALYSIS PAGE (Enhanced)
 *
 * Analysis page using Electric Alchemist Design System v4.4.
 */

import React, { useState } from 'react';
import {
  BarChart2 as Analytics,
  FileText as Assessment,
  BarChart,
  CheckCircle,
  FileText as Description,
  PieChart as DonutLarge,
  Download,
  AlertCircle as Error,
  Info,
  MoreVertical as MoreVert,
  PieChart,
  RefreshCw as Refresh,
  GraduationCap as School,
  Share2 as Share,
  LineChart as ShowChart,
  Gauge as Speed,
  Repeat as Timeline,
  TrendingUp,
  Eye as Visibility,
  AlertTriangle as Warning,
  Briefcase as Work,
} from 'lucide-react';
import { Container, Card, Badge, Grid, Tabs, Progress, Alert } from '@/components';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnalysisReport {
  id: string;
  documentName: string;
  type: 'resume' | 'cover-letter' | 'ksc';
  atsScore: number;
  analysisDate: string;
  status: 'completed' | 'pending' | 'failed';
  insights: {
    keywords: number;
    skills: number;
    experience: number;
    education: number;
  };
  recommendations: string[];
}

interface AnalysisPageProps {
  isEmpty?: boolean;
  onRunAnalysis?: () => void;
  onViewReport?: (report: AnalysisReport) => void;
}

export function AnalysisPage({ isEmpty = false, onRunAnalysis, onViewReport }: AnalysisPageProps) {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleRunAnalysis = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRunAnalysis?.();
    }, 2000);
  };

  const analysisReports: AnalysisReport[] = [
    {
      id: '1',
      documentName: 'Senior Software Developer Resume',
      type: 'resume',
      atsScore: 85,
      analysisDate: '2 hours ago',
      status: 'completed',
      insights: {
        keywords: 12,
        skills: 8,
        experience: 6,
        education: 3,
      },
      recommendations: [
        'Add more industry-specific keywords',
        'Quantify achievements with numbers',
        'Include relevant certifications',
      ],
    },
    {
      id: '2',
      documentName: 'Product Manager Cover Letter',
      type: 'cover-letter',
      atsScore: 92,
      analysisDate: '1 day ago',
      status: 'completed',
      insights: {
        keywords: 15,
        skills: 10,
        experience: 8,
        education: 2,
      },
      recommendations: [
        'Excellent keyword optimization',
        'Strong narrative flow',
        'Well-aligned with job requirements',
      ],
    },
    {
      id: '3',
      documentName: 'UX Designer KSC Response',
      type: 'ksc',
      atsScore: 78,
      analysisDate: '3 days ago',
      status: 'pending',
      insights: {
        keywords: 9,
        skills: 6,
        experience: 4,
        education: 2,
      },
      recommendations: [
        'Expand on specific methodologies',
        'Add portfolio references',
        'Include measurable outcomes',
      ],
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-primary';
    if (score >= 75) return 'bg-tertiary';
    return 'bg-error';
  };

  const getStatusIcon = (status: AnalysisReport['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'pending':
        return <Warning className="h-5 w-5 text-tertiary" />;
      case 'failed':
        return <Error className="h-5 w-5 text-error" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getTypeIcon = (type: AnalysisReport['type']) => {
    switch (type) {
      case 'resume':
        return <Description className="h-5 w-5 text-primary" />;
      case 'cover-letter':
        return <Work className="h-5 w-5 text-secondary" />;
      case 'ksc':
        return <School className="h-5 w-5 text-tertiary" />;
      default:
        return <Description className="h-5 w-5" />;
    }
  };

  if (isEmpty) {
    return (
      <Container size="lg">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-16">
          <Card variant="default" className="max-w-lg p-12">
            <Analytics className="h-20 w-20 text-primary mx-auto mb-4" />
            <h1 className="text-hero text-2xl font-semibold mb-2">No Analysis Available</h1>
            <p className="text-human text-base text-on-surface-variant mb-6">
              Upload documents and run ATS analysis to get detailed insights and recommendations
              for your job applications.
            </p>
            <Button variant="default" size="lg" onClick={onRunAnalysis} className="px-8">
              <Assessment className="h-5 w-5 mr-2" />
              Run First Analysis
            </Button>
            <div className="mt-6 pt-6 border-t border-outline-variant">
              <p className="text-data text-sm text-on-surface-variant mb-3">What gets analyzed:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline">ATS Score</Badge>
                <Badge variant="outline">Keyword Match</Badge>
                <Badge variant="outline">Skills Gap</Badge>
                <Badge variant="outline">Recommendations</Badge>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    );
  }

  const tabs = [
    {
      id: 'recent',
      label: 'Recent Analysis',
      icon: Timeline,
      content: (
        <div className="space-y-4">
          {analysisReports.map((report) => (
            <Card key={report.id} variant="default" className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {getTypeIcon(report.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-hero text-lg font-semibold">{report.documentName}</h3>
                      <Badge variant="outline" className="capitalize">
                        {report.type.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-data text-sm text-on-surface-variant mb-2">
                      {report.insights.keywords} keywords • {report.insights.skills} skills
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Progress value={report.atsScore} />
                      </div>
                      <span className="text-data text-sm font-semibold min-w-[40px]">
                        {report.atsScore}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(report.status)}
                  <Button variant="ghost" size="sm">
                    <MoreVert className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-data text-xs text-on-surface-variant">
                  {report.analysisDate}
                </span>
                <Button variant="outline" size="sm" onClick={() => onViewReport?.(report)}>
                  <Visibility className="h-4 w-4 mr-2" />
                  View Report
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: 'trends',
      label: 'Performance Trends',
      icon: ShowChart,
      content: (
        <Grid cols={2} gap="md">
          <Card variant="default" className="p-6">
            <h3 className="text-hero text-lg font-semibold mb-4">Score Trends</h3>
            <div className="flex items-center justify-center h-48">
              <BarChart className="h-16 w-16 text-primary" />
            </div>
            <p className="text-data text-sm text-center text-on-surface-variant">
              Average score improved by 12% over last month
            </p>
          </Card>
          <Card variant="default" className="p-6">
            <h3 className="text-hero text-lg font-semibold mb-4">Document Types</h3>
            <div className="flex items-center justify-center h-48">
              <PieChart className="h-16 w-16 text-secondary" />
            </div>
            <p className="text-data text-sm text-center text-on-surface-variant">
              Resume: 60% • Cover Letters: 30% • KSC: 10%
            </p>
          </Card>
        </Grid>
      ),
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: DonutLarge,
      content: (
        <Grid cols={3} gap="md">
          <Card variant="default" className="p-6 md:col-span-2 space-y-4">
            <Alert variant="default" className="bg-primary-container/20 border-primary-container">
              <h4 className="text-hero font-semibold mb-1">Strong Performance Areas</h4>
              <p className="text-human text-sm">
                Your documents excel in keyword optimization and technical skills presentation.
              </p>
            </Alert>
            <Alert variant="default" className="bg-tertiary-container/20 border-tertiary-container">
              <h4 className="text-hero font-semibold mb-1">Areas for Improvement</h4>
              <p className="text-human text-sm">
                Consider adding more quantifiable achievements and industry-specific certifications.
              </p>
            </Alert>
            <Alert variant="default" className="bg-secondary-container/20 border-secondary-container">
              <h4 className="text-hero font-semibold mb-1">Trending Keywords</h4>
              <p className="text-human text-sm">
                Current high-value keywords: "cloud computing", "agile methodology", "data analysis"
              </p>
            </Alert>
          </Card>
          <Card variant="default" className="p-6">
            <h3 className="text-hero text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Refresh className="h-4 w-4 mr-2" />
                Re-analyze All
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Share className="h-4 w-4 mr-2" />
                Share Insights
              </Button>
            </div>
          </Card>
        </Grid>
      ),
    },
  ];

  return (
    <Container size="xl">
      <div className="py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-hero text-3xl font-semibold">Document Analysis</h1>
            <Button
              variant="default"
              onClick={handleRunAnalysis}
              disabled={loading}
              className="px-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Assessment className="h-4 w-4 mr-2" />
                  Run New Analysis
                </>
              )}
            </Button>
          </div>
          <p className="text-human text-base text-on-surface-variant">
            Comprehensive ATS scoring and optimization recommendations for your documents
          </p>
        </div>

        {/* Analysis Summary Cards */}
        <Grid cols={4} gap="md" className="mb-6">
          <Card variant="default" className="p-6">
            <div className="flex items-center mb-2">
              <Speed className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-hero text-lg font-semibold">85%</h3>
            </div>
            <p className="text-data text-sm text-on-surface-variant">Average ATS Score</p>
          </Card>
          <Card variant="default" className="p-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-hero text-lg font-semibold">+12%</h3>
            </div>
            <p className="text-data text-sm text-on-surface-variant">Score Improvement</p>
          </Card>
          <Card variant="default" className="p-6">
            <div className="flex items-center mb-2">
              <Timeline className="h-5 w-5 text-tertiary mr-2" />
              <h3 className="text-hero text-lg font-semibold">15</h3>
            </div>
            <p className="text-data text-sm text-on-surface-variant">Documents Analyzed</p>
          </Card>
          <Card variant="default" className="p-6">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-hero text-lg font-semibold">8</h3>
            </div>
            <p className="text-data text-sm text-on-surface-variant">Optimized Documents</p>
          </Card>
        </Grid>

        {/* Analysis Tabs */}
        <Card variant="default" className="p-6">
          <Tabs tabs={tabs} defaultTab="recent" />
        </Card>
      </div>
    </Container>
  );
}

export default AnalysisPage;
