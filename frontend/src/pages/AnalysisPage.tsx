import {
  Analytics,
  Assessment,
  BarChart,
  CheckCircle,
  Description,
  DonutLarge,
  Download,
  Error,
  Info,
  MoreVert,
  PieChart,
  Refresh,
  School,
  Share,
  ShowChart,
  Speed,
  Timeline,
  TrendingUp,
  Visibility,
  Warning,
  Work,
} from '@mui/icons-material';
import React, { useState } from 'react';
import Grid from '@/components/ui/GridCompat';

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analysis-tabpanel-${index}`}
      aria-labelledby={`analysis-tab-${index}`}
      {...other}
    >
      {value === index && <div className="py-3">{children}</div>}
    </div>
  );
}

interface AnalysisPageProps {
  isEmpty?: boolean;
  onRunAnalysis?: () => void;
  onViewReport?: (report: AnalysisReport) => void;
}

export function AnalysisPage({ isEmpty = false, onRunAnalysis, onViewReport }: AnalysisPageProps) {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReport, setSelectedReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, report: AnalysisReport) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRunAnalysis?.();
    }, 2000);
  };

  // Sample data
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
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (reportStatus: AnalysisReport['status']) => {
    switch (reportStatus) {
      case 'completed':
        return <CheckCircle className="text-green-500" />;
      case 'pending':
        return <Warning className="text-yellow-500" />;
      case 'failed':
        return <Error className="text-red-500" />;
      default:
        return <Info />;
    }
  };

  const getTypeIcon = (reportType: AnalysisReport['type']) => {
    switch (reportType) {
      case 'resume':
        return <Description className="text-primary-500" />;
      case 'cover-letter':
        return <Work className="text-secondary-500" />;
      case 'ksc':
        return <School className="text-info-500" />;
      default:
        return <Description />;
    }
  };

  if (isEmpty) {
    return (
      <div className="container mx-auto max-w-lg py-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="p-6 rounded-lg bg-white border border-gray-200 max-w-md">
            <div className="mb-4">
              <Analytics className="w-20 h-20 text-primary-500 mb-2" />
              <h1 className="text-2xl font-semibold mb-2">No Analysis Available</h1>
              <p className="text-gray-600 mb-4">
                Upload documents and run ATS analysis to get detailed insights and recommendations
                for your job applications.
              </p>
            </div>

            <button
              className="px-4 py-2 text-lg font-semibold rounded-full bg-primary-500 text-white flex items-center gap-2"
              onClick={onRunAnalysis}
            >
              <Assessment />
              Run First Analysis
            </button>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">What gets analyzed:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <div className="px-2 py-1 text-xs rounded-full bg-gray-100">ATS Score</div>
                <div className="px-2 py-1 text-xs rounded-full bg-gray-100">Keyword Match</div>
                <div className="px-2 py-1 text-xs rounded-full bg-gray-100">Skills Gap</div>
                <div className="px-2 py-1 text-xs rounded-full bg-gray-100">Recommendations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl py-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-semibold">Document Analysis</h1>
          <button
            className="px-4 py-2 rounded-full bg-primary-500 text-white flex items-center gap-2"
            onClick={handleRunAnalysis}
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
            ) : (
              <Assessment />
            )}
            {loading ? 'Analyzing...' : 'Run New Analysis'}
          </button>
        </div>
        <p className="text-gray-600">
          Comprehensive ATS scoring and optimization recommendations for your documents
        </p>
      </div>

      {/* Analysis Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Speed className="text-primary-500 mr-1" />
            <h3 className="text-lg font-semibold">85%</h3>
          </div>
          <p className="text-sm text-gray-600">Average ATS Score</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <TrendingUp className="text-green-500 mr-1" />
            <h3 className="text-lg font-semibold">+12%</h3>
          </div>
          <p className="text-sm text-gray-600">Score Improvement</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Timeline className="text-yellow-500 mr-1" />
            <h3 className="text-lg font-semibold">15</h3>
          </div>
          <p className="text-sm text-gray-600">Documents Analyzed</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <CheckCircle className="text-blue-500 mr-1" />
            <h3 className="text-lg font-semibold">8</h3>
          </div>
          <p className="text-sm text-gray-600">Optimized Documents</p>
        </div>
      </div>

      {/* Analysis Tabs */}
      <div className="border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <div className="flex px-3">
            <button
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                tabValue === 0 ? 'border-b-2 border-primary-500' : ''
              }`}
              onClick={() => setTabValue(0)}
            >
              <Timeline />
              Recent Analysis
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                tabValue === 1 ? 'border-b-2 border-primary-500' : ''
              }`}
              onClick={() => setTabValue(1)}
            >
              <ShowChart />
              Performance Trends
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                tabValue === 2 ? 'border-b-2 border-primary-500' : ''
              }`}
              onClick={() => setTabValue(2)}
            >
              <DonutLarge />
              Insights
            </button>
          </div>
        </div>

        {/* Recent Analysis Tab */}
        <TabPanel value={tabValue} index={0}>
          <div className="px-3">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm font-semibold text-gray-600">
                    <th className="p-2">Document</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">ATS Score</th>
                    <th className="p-2">Analysis Date</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center">
                          {getTypeIcon(report.type)}
                          <div className="ml-2">
                            <p className="font-semibold">{report.documentName}</p>
                            <p className="text-xs text-gray-500">
                              {report.insights.keywords} keywords • {report.insights.skills} skills
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="px-2 py-1 text-xs rounded-full bg-gray-100 capitalize">
                          {report.type.replace('-', ' ')}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center min-w-[100px]">
                          <div className="w-full mr-1">
                            <div className="h-1.5 rounded-full bg-gray-200">
                              <div
                                className={`h-1.5 rounded-full ${getScoreColor(report.atsScore)}`}
                                style={{ width: `${report.atsScore}%` }}
                              />
                            </div>
                          </div>
                          <p className="text-sm font-semibold min-w-[40px]">
                            {report.atsScore}%
                          </p>
                        </div>
                      </td>
                      <td className="p-2">
                        <p className="text-sm text-gray-600">{report.analysisDate}</p>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center">
                          {getStatusIcon(report.status)}
                          <p
                            className={`ml-1 text-sm capitalize ${
                              report.status === 'completed'
                                ? 'text-green-500'
                                : report.status === 'pending'
                                ? 'text-yellow-500'
                                : 'text-red-500'
                            }`}
                          >
                            {report.status}
                          </p>
                        </div>
                      </td>
                      <td className="p-2">
                        <button
                          className="p-1 rounded-full hover:bg-gray-100"
                          onClick={(e) => handleMenuOpen(e, report)}
                        >
                          <MoreVert />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabPanel>

        {/* Performance Trends Tab */}
        <TabPanel value={tabValue} index={1}>
          <div className="px-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Score Trends</h3>
                <div className="flex items-center justify-center h-48">
                  <BarChart className="w-16 h-16 text-primary-500" />
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Average score improved by 12% over last month
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Document Types</h3>
                <div className="flex items-center justify-center h-48">
                  <PieChart className="w-16 h-16 text-secondary-500" />
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Resume: 60% • Cover Letters: 30% • KSC: 10%
                </p>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Insights Tab */}
        <TabPanel value={tabValue} index={2}>
          <div className="px-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 space-y-2">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <h4 className="font-semibold">Strong Performance Areas</h4>
                  <p className="text-sm">
                    Your documents excel in keyword optimization and technical skills presentation.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <h4 className="font-semibold">Areas for Improvement</h4>
                  <p className="text-sm">
                    Consider adding more quantifiable achievements and industry-specific
                    certifications.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <h4 className="font-semibold">Trending Keywords</h4>
                  <p className="text-sm">
                    Current high-value keywords: "cloud computing", "agile methodology", "data
                    analysis"
                  </p>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 text-sm rounded-full border hover:bg-gray-100 flex items-center gap-2">
                    <Refresh />
                    Re-analyze All
                  </button>
                  <button className="w-full px-4 py-2 text-sm rounded-full border hover:bg-gray-100 flex items-center gap-2">
                    <Download />
                    Export Report
                  </button>
                  <button className="w-full px-4 py-2 text-sm rounded-full border hover:bg-gray-100 flex items-center gap-2">
                    <Share />
                    Share Insights
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </div>

      {/* Report Menu */}
      {anchorEl && (
        <div
          className="absolute bg-white rounded-md shadow-lg border"
          style={{
            top: anchorEl.getBoundingClientRect().bottom,
            right: 0,
          }}
        >
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => {
              handleMenuClose();
              onViewReport?.(selectedReport!);
            }}
          >
            <Visibility />
            View Report
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
            onClick={handleMenuClose}
          >
            <Refresh />
            Re-analyze
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
            onClick={handleMenuClose}
          >
            <Download />
            Download
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
            onClick={handleMenuClose}
          >
            <Share />
            Share
          </button>
        </div>
      )}
    </div>
  );
}
