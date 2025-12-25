import { TrendingUp, Award, Target } from 'lucide-react';
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
import pileaPlant from '../../assets/images/pilea-plant.jpg';
import { MetricCard } from '../../components/shared/MetricCard';
import { KeywordTag } from '../../components/shared/KeywordTag';
import { PageHeader } from '../../components/shared/PageHeader';
import { ChartPane } from '../../components/shared/ChartPane';

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
  return (
    <div className="p-6 md:p-12 max-w-7xl relative animate-in fade-in zoom-in-95 duration-500 ease-spring">
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
        {/* Header */}
        <PageHeader
          title="Performance Analysis"
          highlightedWord="Analysis"
          description="Track your job search performance and get insights"
        />

        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            icon={Award}
            label="App ATS Score"
            value="87%"
            iconColor="text-primary"
            variant="outlined"
          />
          <MetricCard
            icon={TrendingUp}
            label="Applications"
            value="90"
            iconColor="text-secondary"
            variant="outlined"
          />
          <MetricCard
            icon={Target}
            label="Success Rate"
            value="45%"
            iconColor="text-tertiary"
            variant="outlined"
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
      </div>
    </div>
  );
}
