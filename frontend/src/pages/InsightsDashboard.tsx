import React, { useState, useEffect } from 'react';
import { Card, Button, LoadingSpinner, ProgressBar } from '../components/ui';
import { HelpButton } from '../components/HelpSystem';
import { 
  TrendingUp, Calendar, FileText, Target, Award, Clock, 
  BarChart3, PieChart, Activity, Zap, AlertTriangle,
  CheckCircle, ArrowUp, ArrowDown, Download, Share2,
  RefreshCw, Filter, Eye, Users, Globe
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface DashboardData {
  overview: {
    totalProfiles: number;
    documentsGenerated: number;
    averageAtsScore: number;
    applicationsTracked: number;
    successRate: number;
  };
  activityTrend: Array<{
    date: string;
    documents: number;
    applications: number;
    atsScore: number;
  }>;
  documentTypes: Array<{
    type: string;
    count: number;
    avgScore: number;
  }>;
  atsScoreDistribution: Array<{
    range: string;
    count: number;
  }>;
  industryInsights: Array<{
    industry: string;
    avgScore: number;
    applications: number;
  }>;
  skillsAnalysis: Array<{
    skill: string;
    frequency: number;
    impact: number;
  }>;
  timeSpentAnalysis: Array<{
    activity: string;
    minutes: number;
  }>;
  recentAchievements: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    type: 'milestone' | 'improvement' | 'goal';
    value?: number;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: 'optimization' | 'content' | 'strategy' | 'skills';
    actionUrl?: string;
  }>;
}

const InsightsDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'documents' | 'applications' | 'atsScore'>('documents');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data - in reality this would come from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: DashboardData = {
        overview: {
          totalProfiles: 5,
          documentsGenerated: 47,
          averageAtsScore: 82,
          applicationsTracked: 23,
          successRate: 34.8,
        },
        activityTrend: [
          { date: '2024-01-01', documents: 2, applications: 1, atsScore: 75 },
          { date: '2024-01-02', documents: 3, applications: 2, atsScore: 78 },
          { date: '2024-01-03', documents: 1, applications: 0, atsScore: 80 },
          { date: '2024-01-04', documents: 4, applications: 2, atsScore: 85 },
          { date: '2024-01-05', documents: 2, applications: 1, atsScore: 82 },
          { date: '2024-01-06', documents: 3, applications: 3, atsScore: 88 },
          { date: '2024-01-07', documents: 2, applications: 1, atsScore: 84 },
        ],
        documentTypes: [
          { type: 'Resume', count: 28, avgScore: 84 },
          { type: 'Cover Letter', count: 15, avgScore: 79 },
          { type: 'KSC Response', count: 4, avgScore: 86 },
        ],
        atsScoreDistribution: [
          { range: '90-100', count: 8 },
          { range: '80-89', count: 18 },
          { range: '70-79', count: 15 },
          { range: '60-69', count: 4 },
          { range: '50-59', count: 2 },
        ],
        industryInsights: [
          { industry: 'Technology', avgScore: 87, applications: 12 },
          { industry: 'Healthcare', avgScore: 79, applications: 6 },
          { industry: 'Finance', avgScore: 85, applications: 5 },
        ],
        skillsAnalysis: [
          { skill: 'React', frequency: 85, impact: 92 },
          { skill: 'Python', frequency: 75, impact: 88 },
          { skill: 'AWS', frequency: 65, impact: 85 },
          { skill: 'Project Management', frequency: 80, impact: 78 },
          { skill: 'Leadership', frequency: 70, impact: 90 },
        ],
        timeSpentAnalysis: [
          { activity: 'Profile Editing', minutes: 420 },
          { activity: 'Document Generation', minutes: 180 },
          { activity: 'ATS Analysis', minutes: 95 },
          { activity: 'Template Selection', minutes: 65 },
        ],
        recentAchievements: [
          {
            id: '1',
            title: 'ATS Score Milestone',
            description: 'Achieved average ATS score above 80%',
            date: '2024-01-15',
            type: 'milestone',
            value: 82,
          },
          {
            id: '2',
            title: 'Document Generation Streak',
            description: 'Generated documents for 7 consecutive days',
            date: '2024-01-14',
            type: 'improvement',
            value: 7,
          },
          {
            id: '3',
            title: 'Profile Optimization',
            description: 'Improved profile completeness by 25%',
            date: '2024-01-12',
            type: 'improvement',
            value: 25,
          },
        ],
        recommendations: [
          {
            id: '1',
            title: 'Optimize Healthcare Keywords',
            description: 'Add more industry-specific keywords for healthcare positions to improve ATS scores.',
            priority: 'high',
            category: 'optimization',
            actionUrl: '/profile/editor',
          },
          {
            id: '2',
            title: 'Update Professional Summary',
            description: 'Your summary could be more impactful. Consider highlighting recent achievements.',
            priority: 'medium',
            category: 'content',
            actionUrl: '/profile/editor#summary',
          },
          {
            id: '3',
            title: 'Diversify Application Strategy',
            description: 'Consider applying to more mid-size companies to increase success rate.',
            priority: 'medium',
            category: 'strategy',
          },
        ],
      };
      
      setData(mockData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const exportData = () => {
    if (!data) return;
    
    const exportData = {
      overview: data.overview,
      timeRange,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-insights-${timeRange}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Data</h2>
          <Button onClick={loadDashboardData}>Retry</Button>
        </div>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Career Insights</h1>
                <p className="text-gray-600">Track your progress and optimize your job search strategy</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <HelpButton helpId="insights-dashboard" size="sm" />
              
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button
                variant="outline"
                onClick={exportData}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <OverviewCard
            title="Profiles Created"
            value={data.overview.totalProfiles}
            icon={Users}
            trend={+2}
            color="blue"
          />
          <OverviewCard
            title="Documents Generated"
            value={data.overview.documentsGenerated}
            icon={FileText}
            trend={+12}
            color="green"
          />
          <OverviewCard
            title="Average ATS Score"
            value={`${data.overview.averageAtsScore}%`}
            icon={Target}
            trend={+5}
            color="purple"
          />
          <OverviewCard
            title="Applications Tracked"
            value={data.overview.applicationsTracked}
            icon={Activity}
            trend={+8}
            color="orange"
          />
          <OverviewCard
            title="Success Rate"
            value={`${data.overview.successRate}%`}
            icon={Award}
            trend={+2.1}
            color="emerald"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Activity Trend Chart */}
          <Card className="col-span-12 lg:col-span-8 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Activity Trend</h3>
              <div className="flex items-center gap-2">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value as any)}
                  className="text-sm px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="documents">Documents</option>
                  <option value="applications">Applications</option>
                  <option value="atsScore">ATS Score</option>
                </select>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.activityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Quick Stats */}
          <Card className="col-span-12 lg:col-span-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Total Time Spent</span>
                </div>
                <span className="font-medium">
                  {Math.round(data.timeSpentAnalysis.reduce((acc, item) => acc + item.minutes, 0) / 60)}h
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Most Active Day</span>
                </div>
                <span className="font-medium">Monday</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Top Industry</span>
                </div>
                <span className="font-medium">Technology</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Profile Views</span>
                </div>
                <span className="font-medium">247</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Document Types */}
          <Card className="col-span-12 md:col-span-6 lg:col-span-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Types</h3>
            
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={data.documentTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="count"
                >
                  {data.documentTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {data.documentTypes.map((type, index) => (
                <div key={type.type} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{type.type}</span>
                  </div>
                  <span className="font-medium">{type.count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* ATS Score Distribution */}
          <Card className="col-span-12 md:col-span-6 lg:col-span-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ATS Score Distribution</h3>
            
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.atsScoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Skills Analysis */}
          <Card className="col-span-12 lg:col-span-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skills Impact</h3>
            
            <div className="space-y-3">
              {data.skillsAnalysis.slice(0, 5).map((skill) => (
                <div key={skill.skill} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{skill.skill}</span>
                    <span className="text-gray-500">{skill.impact}%</span>
                  </div>
                  <ProgressBar 
                    value={skill.impact} 
                    className="h-2"
                    color={skill.impact >= 85 ? 'green' : skill.impact >= 70 ? 'blue' : 'yellow'}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-12 gap-6">
          {/* Recent Achievements */}
          <Card className="col-span-12 lg:col-span-6 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            
            <div className="space-y-4">
              {data.recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.type === 'milestone' 
                      ? 'bg-yellow-100 text-yellow-600'
                      : achievement.type === 'improvement'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {achievement.type === 'milestone' && <Award className="w-4 h-4" />}
                    {achievement.type === 'improvement' && <TrendingUp className="w-4 h-4" />}
                    {achievement.type === 'goal' && <Target className="w-4 h-4" />}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(achievement.date).toLocaleDateString()}
                      </span>
                      {achievement.value && (
                        <span className="text-xs font-medium text-green-600">
                          +{achievement.value}{achievement.type === 'milestone' && achievement.title.includes('Score') ? '%' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Recommendations */}
          <Card className="col-span-12 lg:col-span-6 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
            
            <div className="space-y-4">
              {data.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    rec.priority === 'high'
                      ? 'bg-red-50 border-red-400'
                      : rec.priority === 'medium'
                      ? 'bg-yellow-50 border-yellow-400'
                      : 'bg-blue-50 border-blue-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{rec.title}</h4>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            rec.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : rec.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <span className="text-xs text-gray-500 capitalize">{rec.category}</span>
                    </div>
                    
                    {rec.actionUrl && (
                      <Button size="sm" variant="outline">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Overview Card Component
const OverviewCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend: number;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'emerald';
}> = ({ title, value, icon: Icon, trend, color }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
    emerald: 'text-emerald-600 bg-emerald-100',
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          trend >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(trend)}{typeof trend === 'number' && trend % 1 !== 0 ? '' : ''}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </Card>
  );
};

export default InsightsDashboard;