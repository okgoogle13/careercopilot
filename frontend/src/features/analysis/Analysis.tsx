import { useState } from 'react';
import {
  TrendingUp, Award, Target, Sparkles, Download, ExternalLink, Link2,
  Loader2, Shield, CheckCircle2, BookOpen, AlertCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';
import pileaPlant from '../../assets/images/pilea-plant.jpg';
import { MetricCard } from '../../components/shared/MetricCard';
import { KeywordTag } from '../../components/shared/KeywordTag';
import { PageHeader } from '../../components/shared/PageHeader';
import { ChartPane } from '../../components/shared/ChartPane';
import { ImpactEnhancements } from '../../components/shared/ImpactEnhancements';
import { Button } from '@careercopilot/ui';
import { Textarea } from '@careercopilot/ui';
import { useAnalysis } from '../../hooks/useAnalysis';
import { exportToPdf } from '../../utils/exportEngine';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ATSScoreDataPoint {
  month: string;
  score: number;
}

interface ApplicationStatusData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface KeywordMatchData {
  keyword: string;
  rate: number;
}

// ============================================================================
// MOCK DATA - Replace with API calls
// ============================================================================

const ATS_SCORE_DATA: ATSScoreDataPoint[] = [
  { month: 'Jan', score: 82 },
  { month: 'Feb', score: 83 },
  { month: 'Mar', score: 84 },
  { month: 'Apr', score: 85 },
  { month: 'May', score: 86 },
  { month: 'Jun', score: 87 },
];

// Map token colors for Recharts (must be hex)
const CHART_COLORS = {
  primary: '#D1C4E9',   // primary-80
  secondary: '#C7FFF4', // secondary-80
  tertiary: '#FFD9E8',  // tertiary-80
  error: '#FFB4AB',     // error-80
  surface: '#1C1B1F',   // surface-container-low
  onSurface: '#E6E1E5', // neutral-90
  grid: '#484649',      // neutral-30
  heroHighlight: '#D0BCFF', // Electric Violet for hero moment
};

const APPLICATION_STATUS_DATA: ApplicationStatusData[] = [
  { name: 'Applied', value: 40, color: CHART_COLORS.primary },
  { name: 'Interviewing', value: 30, color: CHART_COLORS.secondary },
  { name: 'Rejected', value: 20, color: CHART_COLORS.error },
  { name: 'Offered', value: 10, color: '#FFD700' }, // Gold for offer
];

// ... (keep keyword data)

const KEYWORD_MATCH_DATA: KeywordMatchData[] = [
  { keyword: 'React.js', rate: 5 },
  { keyword: 'TypeScript', rate: 2 },
  { keyword: 'JavaScript', rate: 4 },
  { keyword: 'Node.js', rate: 3 },
  { keyword: 'Python', rate: 2 },
];

const MATCHED_KEYWORDS: string[] = [
  'Community Support',
  'Case Management',
  'Communication',
  'Market Health',
  'Documentation',
  'Accessibility',
  'Accommodation',
  'Data Monitoring',
];

const MISSING_KEYWORDS: string[] = [
  'React.js',
  'Typescript',
  'Learning Programs',
  'Node.js',
  'Data Analysis',
  'Jira',
  'Mentorship',
];

// ============================================================================
// COMPONENT
// ============================================================================

export function Analysis() {
  const { analyzeDocument, analyzeJobUrl, analyzing, result, jobAnalysis } = useAnalysis();
  const [documentText, setDocumentText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [showInputs, setShowInputs] = useState(true);
  const [loadingJobUrl, setLoadingJobUrl] = useState(false);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      setUrlError('');
      return true;
    } catch {
      setUrlError('Please enter a valid URL (e.g., https://seek.com.au/job/...)');
      return false;
    }
  };

  const handleAnalyzeJobUrl = async () => {
    if (!jobUrl) {
      toast.error('Please provide a job URL');
      return;
    }

    if (!validateUrl(jobUrl)) {
      return;
    }

    setLoadingJobUrl(true);
    try {
      const analysis = await analyzeJobUrl(jobUrl);
      toast.success('Job analysis complete! Verified sources extracted.');
      // Auto-populate job description from analysis
      setJobDescription(analysis.keywords.join(', ') + '\n\n' +
        'Requirements: ' + analysis.minimumRequirements.join(', '));
    } catch (error) {
      toast.error('Failed to analyze job URL. Please try again.');
      console.error(error);
    } finally {
      setLoadingJobUrl(false);
    }
  };

  const handleAnalyze = async () => {
    if (!documentText || !jobDescription) {
      toast.error('Please provide both resume and job description');
      return;
    }

    toast.promise(
      analyzeDocument(documentText, jobDescription),
      {
        loading: 'Analyzing with 4-Quadrant Intelligence...',
        success: 'Analysis complete! Check your scores below.',
        error: 'Analysis failed. Please try again.',
      }
    );
    setShowInputs(false);
  };

  const handleDownloadAnalysis = async () => {
    try {
      await exportToPdf('analysis-content', 'Career_Analysis_Report.pdf');
      toast.success('Analysis report downloaded!');
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  // Get scores from result or use defaults
  const scores = result?.score || {
    overall: 87,
    hardSkills: 85,
    softSkills: 78,
    impact: 92,
    atsReadability: 88,
  };

  // Determine hero quadrant (highest score)
  const quadrantScores = [
    { name: 'Hard Skills', value: scores.hardSkills },
    { name: 'Soft Skills', value: scores.softSkills },
    { name: 'Impact', value: scores.impact },
    { name: 'ATS', value: scores.atsReadability },
  ];
  const heroQuadrant = quadrantScores.reduce((max, q) =>
    q.value > max.value ? q : max
  );

  return (
    <div id="analysis-content" className="p-6 md:p-12 max-w-7xl relative animate-in fade-in zoom-in-95 duration-500 ease-spring">
      {/* Pilea Plant Decoration - Bottom Left Corner */}
      <div className="fixed bottom-0 left-0 lg:left-[280px] md:left-[72px] pointer-events-none w-[300px] z-[1] opacity-55 scale-x-[-1]">
        <img
          src={pileaPlant}
          alt=""
          className="w-full h-auto mix-blend-screen"
          style={{
            WebkitMaskImage:
              'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.35) 8%, rgba(0,0,0,0.65) 18%, rgba(0,0,0,0.85) 28%, black 40%)',
            maskImage:
              'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.35) 8%, rgba(0,0,0,0.65) 18%, rgba(0,0,0,0.85) 28%, black 40%)',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header with Actions */}
        <div className="flex items-center justify-between mb-8">
          <PageHeader
            title="Performance Analysis"
            highlightedWord="Analysis"
            description="AI-powered 4-Quadrant Intelligence System"
          />
          <Button
            onClick={handleDownloadAnalysis}
            variant="outlined"
            className="rounded-pebble px-6"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Intelligence Trigger UI */}
        {showInputs && (
          <div className="bg-surface-container rounded-leaf p-8 border border-outline-variant shadow-elevation-1 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-title-large font-bold text-on-surface">
                Run Intelligence Audit
              </h2>
            </div>

            {/* Job URL Intelligence Extractor */}
            <div className="mb-6 bg-surface-container-low rounded-tech p-6 border border-outline">
              <label className="block text-label-large font-bold text-on-surface mb-3">
                🔗 Job URL (Optional - Australian Sector Intelligence)
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => {
                    setJobUrl(e.target.value);
                    if (urlError) setUrlError('');
                  }}
                  placeholder="https://seek.com.au/job/..."
                  className={`flex-1 bg-surface-container-high rounded-tech px-4 py-3 text-on-surface border focus:outline-none ${urlError ? 'border-tertiary focus:border-tertiary' : 'border-outline-variant focus:border-primary'}`}
                />
                <Button
                  onClick={handleAnalyzeJobUrl}
                  disabled={loadingJobUrl || !jobUrl}
                  className="bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary rounded-pebble px-6 font-bold min-w-[180px]"
                >
                  {loadingJobUrl ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    'Extract Intelligence'
                  )}
                </Button>
              </div>
              {urlError && (
                <p className="text-tertiary text-label-small mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {urlError}
                </p>
              )}
              {jobAnalysis && jobUrl && !urlError && !loadingJobUrl && (
                <div className="flex items-center gap-2 mt-2 text-secondary">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-label-small font-bold">
                    Intelligence extracted successfully
                  </span>
                </div>
              )}
              <p className="text-body-small text-on-surface-variant mt-2">
                Automatically extract keywords, requirements, and Australian sector compliance (APS, AASW, WWCC, NDIS) from job posting URLs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-label-large font-bold text-on-surface mb-3">
                  Your Resume / Profile
                </label>
                <Textarea
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Paste your resume content here..."
                  className="min-h-[200px] bg-surface-container-high rounded-tech"
                />
              </div>
              <div>
                <label className="block text-label-large font-bold text-on-surface mb-3">
                  Target Job Description
                </label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="min-h-[200px] bg-surface-container-high rounded-tech"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary rounded-pebble px-8 h-12 font-bold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {analyzing ? 'Analyzing...' : 'Analyze with AI'}
              </Button>
            </div>
          </div>
        )}

        {/* 4-Quadrant Metric Cards with Hero Highlighting */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={Award}
            label="Hard Skills Match"
            value={`${scores.hardSkills}%`}
            iconColor={heroQuadrant.name === 'Hard Skills' ? 'text-[#D0BCFF]' : 'text-primary'}
            variant={heroQuadrant.name === 'Hard Skills' ? 'filled' : 'outlined'}
          />
          <MetricCard
            icon={TrendingUp}
            label="Soft Skills & Verbs"
            value={`${scores.softSkills}%`}
            iconColor={heroQuadrant.name === 'Soft Skills' ? 'text-[#D0BCFF]' : 'text-secondary'}
            variant={heroQuadrant.name === 'Soft Skills' ? 'filled' : 'outlined'}
          />
          <MetricCard
            icon={Target}
            label="Quantifiable Impact"
            value={`${scores.impact}%`}
            iconColor={heroQuadrant.name === 'Impact' ? 'text-[#D0BCFF]' : 'text-tertiary'}
            variant={heroQuadrant.name === 'Impact' ? 'filled' : 'outlined'}
          />
          <MetricCard
            icon={Award}
            label="ATS Readability"
            value={`${scores.atsReadability}%`}
            iconColor={heroQuadrant.name === 'ATS' ? 'text-[#D0BCFF]' : 'text-error'}
            variant={heroQuadrant.name === 'ATS' ? 'filled' : 'outlined'}
          />
        </div>

        {/* ATS Score Over Time */}
        <ChartPane
          title="ATS Score Over Time"
          className="mb-8"
        >
          <ResponsiveContainer
            width="100%"
            height={280}
          >
            <LineChart data={ATS_SCORE_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.grid}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke={CHART_COLORS.onSurface}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke={CHART_COLORS.onSurface}
                axisLine={false}
                tickLine={false}
                domain={[75, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: CHART_COLORS.surface,
                  border: '1px solid #484649',
                  borderRadius: '12px',
                  color: CHART_COLORS.onSurface,
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke={CHART_COLORS.primary}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.primary, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartPane>

        {/* Bottom Row: Application Status + Keyword Match Rate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Application Status Donut Chart */}
          <ChartPane title="Application Status">
            <ResponsiveContainer
              width="100%"
              height={280}
            >
              <PieChart>
                {/* @ts-ignore */}
                <Pie
                  data={APPLICATION_STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {APPLICATION_STATUS_DATA.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="rgba(0,0,0,0)"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: CHART_COLORS.surface,
                    border: '1px solid #484649',
                    borderRadius: '12px',
                    color: CHART_COLORS.onSurface,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartPane>

          {/* Keyword Match Rate Bar Chart */}
          <ChartPane title="Keyword Match Rate">
            <ResponsiveContainer
              width="100%"
              height={280}
            >
              <BarChart data={KEYWORD_MATCH_DATA}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_COLORS.grid}
                  vertical={false}
                />
                <XAxis
                  dataKey="keyword"
                  stroke={CHART_COLORS.onSurface}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke={CHART_COLORS.onSurface}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: CHART_COLORS.surface,
                    border: '1px solid #484649',
                    borderRadius: '12px',
                    color: CHART_COLORS.onSurface,
                  }}
                />
                <Bar
                  dataKey="rate"
                  radius={[8, 8, 0, 0]}
                >
                  {KEYWORD_MATCH_DATA.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? CHART_COLORS.primary : CHART_COLORS.secondary}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartPane>
        </div>

        {/* Keyword Analysis Section */}
        <ChartPane title="Keyword Analysis">
          {/* Matched Keywords */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-on-surface-variant">Matched</span>
              <span className="text-xs text-on-secondary-container bg-secondary-container px-2 py-1 rounded-pebble uppercase tracking-wider font-mono font-bold">
                {MATCHED_KEYWORDS.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {MATCHED_KEYWORDS.map((keyword, index) => (
                <KeywordTag
                  key={index}
                  keyword={keyword}
                  variant="matched"
                />
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-on-surface-variant">Missing</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {MISSING_KEYWORDS.map((keyword, index) => (
                <KeywordTag
                  key={index}
                  keyword={keyword}
                  variant="missing"
                />
              ))}
            </div>
          </div>
        </ChartPane>

        {/* Verified Sources - Citations from Google Search Grounding */}
        {jobAnalysis?.sources && (
          <div className="mt-8 bg-surface-container rounded-tech p-8 border border-outline-variant shadow-elevation-1">
            <div className="flex items-center gap-3 mb-6">
              <Link2 className="w-6 h-6 text-tertiary" />
              <h2 className="text-title-large font-bold text-on-surface">
                Verified Sources
              </h2>
            </div>

            {jobAnalysis.sources.length > 0 ? (
              <>
                <p className="text-body-medium text-on-surface-variant mb-6">
                  These sources were automatically discovered via Google Search grounding and verified for Australian sector compliance.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobAnalysis.sources.map((source, index) => (
                    <a
                      key={index}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-surface-container-low rounded-tech p-4 border border-outline hover:border-primary hover:bg-surface-container transition-all duration-short-2 ease-spring group block"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded-pebble bg-primary-container text-on-primary-container text-label-small font-bold">
                              {source.uri.includes('seek.com.au') ? 'SEEK' :
                                source.uri.includes('linkedin.com') ? 'LinkedIn' :
                                  source.uri.includes('.gov.au') ? 'Government' : 'Web'}
                            </span>
                          </div>
                          <h3 className="text-body-large font-bold text-on-surface group-hover:text-primary mb-2 line-clamp-2">
                            {source.title}
                          </h3>
                          <p className="text-body-small text-on-surface-variant truncate">
                            {source.uri}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-on-surface-variant group-hover:text-primary flex-shrink-0 mt-1" />
                      </div>
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-6 bg-surface-container-low rounded-tech border border-outline-variant border-dashed">
                <Link2 className="w-12 h-12 text-on-surface-variant mx-auto mb-4 opacity-50" />
                <h3 className="text-title-medium font-bold text-on-surface mb-2">
                  No Verified Sources Found
                </h3>
                <p className="text-body-medium text-on-surface-variant max-w-md mx-auto">
                  Google Search grounding analyzed the URL but couldn't verify specific external citations.
                </p>
              </div>
            )}

            {/* Australian Sector Insights */}
            {jobAnalysis.sectorInsights && (
              <div className="mt-6 bg-tertiary-container/20 rounded-pebble p-4 border-l-4 border-tertiary">
                <h4 className="text-label-large font-bold text-on-tertiary-container mb-3 flex items-center gap-2">
                  🇦🇺 Australian Sector Intelligence
                </h4>

                {jobAnalysis.sectorInsights.framework && (
                  <div className="mb-2">
                    <span className="text-label-small font-bold text-on-tertiary-container uppercase tracking-wider">
                      Framework:
                    </span>
                    <span className="text-body-medium text-on-tertiary-container ml-2">
                      {jobAnalysis.sectorInsights.framework}
                    </span>
                  </div>
                )}

                {jobAnalysis.sectorInsights.compliance && jobAnalysis.sectorInsights.compliance.length > 0 && (
                  <div className="mb-2">
                    <span className="text-label-small font-bold text-on-tertiary-container uppercase tracking-wider">
                      Compliance:
                    </span>
                    <span className="text-body-medium text-on-tertiary-container ml-2">
                      {jobAnalysis.sectorInsights.compliance.join(', ')}
                    </span>
                  </div>
                )}

                {jobAnalysis.sectorInsights.standards && jobAnalysis.sectorInsights.standards.length > 0 && (
                  <div>
                    <span className="text-label-small font-bold text-on-tertiary-container uppercase tracking-wider">
                      Standards:
                    </span>
                    <span className="text-body-medium text-on-tertiary-container ml-2">
                      {jobAnalysis.sectorInsights.standards.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Impact Enhancements Section - The Quantifier */}
        {result?.quantifiers && result.quantifiers.length > 0 && (
          <div className="mt-8">
            <ImpactEnhancements suggestions={result.quantifiers} />
          </div>
        )}
      </div>
    </div>
  );
}
