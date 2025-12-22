import { useState } from 'react';
import { TrendingUp, Award, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import pileaPlant from 'figma:asset/e947c2d20d6dda7622b4cd544ba71131af1a4d77.png';

export function Analysis() {
  // ATS Score Over Time Data
  const atsScoreData = [
    { month: 'Jan', score: 82 },
    { month: 'Feb', score: 83 },
    { month: 'Mar', score: 84 },
    { month: 'Apr', score: 85 },
    { month: 'May', score: 86 },
    { month: 'Jun', score: 87 },
  ];

  // Application Status Donut Data
  const statusData = [
    { name: 'Applied', value: 40, color: '#D0BCFF' },
    { name: 'Interviewing', value: 30, color: '#A8C5A3' },
    { name: 'Rejected', value: 20, color: '#E07A5F' },
    { name: 'Offered', value: 10, color: '#F4D06F' },
  ];

  // Keyword Match Rate Bar Data
  const keywordData = [
    { keyword: 'React.js', rate: 5 },
    { keyword: 'TypeScript', rate: 2 },
    { keyword: 'JavaScript', rate: 4 },
    { keyword: 'Node.js', rate: 3 },
    { keyword: 'Python', rate: 2 },
  ];

  // Keyword Analysis Tags
  const matchedKeywords = [
    'Community Support', 'Case Management', 'Communication', 'Market Health',
    'Documentation', 'Accessibility', 'Accommodation', 'Data Monitoring'
  ];

  const missingKeywords = [
    'React.js', 'Typescript', 'Learning Programs', 'Node.js',
    'Data Analysis', 'Jira', 'Mentorship'
  ];

  return (
    <div className="p-12 max-w-7xl relative">
      {/* Pilea Plant Decoration - Bottom Left Corner */}
      <div 
        className="fixed bottom-0 left-[280px] pointer-events-none"
        style={{
          width: '300px',
          zIndex: 1,
          transform: 'scaleX(-1)',
          opacity: 0.55
        }}
      >
        <img 
          src={pileaPlant} 
          alt="" 
          className="w-full h-auto"
          style={{
            mixBlendMode: 'screen',
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.35) 8%, rgba(0,0,0,0.65) 18%, rgba(0,0,0,0.85) 28%, black 40%)',
            maskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.35) 8%, rgba(0,0,0,0.65) 18%, rgba(0,0,0,0.85) 28%, black 40%)'
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="mb-2" style={{ fontSize: '4.5rem', lineHeight: '1.1', fontFamily: 'Roboto Flex, sans-serif', fontWeight: '800', fontStretch: '150%', color: '#E6E1E5' }}>
            Performance <span style={{ fontFamily: 'Roboto Serif, serif', fontStyle: 'italic', fontWeight: '300', color: '#D0BCFF' }}>Analysis</span>
          </h2>
          <p className="text-[#CAC4D0]">Track your job search performance and get insights</p>
        </div>

        {/* Top 3 Metric Cards - Outlined */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* App ATS Score */}
          <div className="bg-transparent border border-[#938F99] rounded-[28px] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#36343B] rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-[#D0BCFF]" />
              </div>
              <span className="text-[#CAC4D0]" style={{ fontFamily: 'Roboto Flex, sans-serif', fontStretch: '50%', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.7rem' }}>App ATS Score</span>
            </div>
            <p className="text-5xl text-[#E6E1E5]">87%</p>
          </div>

          {/* Applications */}
          <div className="bg-transparent border border-[#938F99] rounded-[28px] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#36343B] rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#A8C5A3]" />
              </div>
              <span className="text-[#CAC4D0]" style={{ fontFamily: 'Roboto Flex, sans-serif', fontStretch: '50%', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.7rem' }}>Applications</span>
            </div>
            <p className="text-5xl text-[#E6E1E5]">90</p>
          </div>

          {/* Success Rate */}
          <div className="bg-transparent border border-[#938F99] rounded-[28px] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#36343B] rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-[#E07A5F]" />
              </div>
              <span className="text-[#CAC4D0]" style={{ fontFamily: 'Roboto Flex, sans-serif', fontStretch: '50%', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.7rem' }}>Success Rate</span>
            </div>
            <p className="text-5xl text-[#E6E1E5]">45%</p>
          </div>
        </div>

        {/* ATS Score Over Time - Full Width Line Chart */}
        <div 
          className="bg-[#25232A] rounded-[28px] p-8 mb-8"
          style={{
            backgroundImage: 'radial-gradient(circle, #E6DEFF 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundBlendMode: 'overlay',
            backgroundPosition: '0 0'
          }}
        >
          <h4 className="text-[#E6E1E5] mb-6">ATS Score Over Time</h4>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={atsScoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2B2930" vertical={false} />
              <XAxis dataKey="month" stroke="#CAC4D0" axisLine={false} tickLine={false} />
              <YAxis stroke="#CAC4D0" axisLine={false} tickLine={false} domain={[75, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#36343B', 
                  border: 'none', 
                  borderRadius: '16px',
                  color: '#FFFFFF'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#D0BCFF" 
                strokeWidth={3}
                dot={{ fill: '#D0BCFF', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Row: Application Status + Keyword Match Rate */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Application Status Donut Chart */}
          <div 
            className="bg-[#25232A] rounded-[28px] p-8"
            style={{
              backgroundImage: 'radial-gradient(circle, #E6DEFF 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              backgroundBlendMode: 'overlay',
              backgroundPosition: '0 0'
            }}
          >
            <h4 className="text-[#E6E1E5] mb-6">Application Status</h4>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#36343B', 
                    border: 'none', 
                    borderRadius: '16px',
                    color: '#FFFFFF'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Keyword Match Rate Bar Chart */}
          <div 
            className="bg-[#25232A] rounded-[28px] p-8"
            style={{
              backgroundImage: 'radial-gradient(circle, #E6DEFF 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              backgroundBlendMode: 'overlay',
              backgroundPosition: '0 0'
            }}
          >
            <h4 className="text-[#E6E1E5] mb-6">Keyword Match Rate</h4>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={keywordData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2B2930" vertical={false} />
                <XAxis dataKey="keyword" stroke="#CAC4D0" axisLine={false} tickLine={false} />
                <YAxis stroke="#CAC4D0" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#36343B', 
                    border: 'none', 
                    borderRadius: '16px',
                    color: '#FFFFFF'
                  }}
                />
                <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                  {keywordData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#D0BCFF' : '#A8C5A3'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Keyword Analysis Section */}
        <div 
          className="bg-[#25232A] rounded-[28px] p-8"
          style={{
            backgroundImage: 'radial-gradient(circle, #E6DEFF 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundBlendMode: 'overlay',
            backgroundPosition: '0 0'
          }}
        >
          <h4 className="text-[#E6E1E5] mb-6">Keyword Analysis</h4>
          
          {/* Matched Keywords */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-[#CAC4D0]">Matched</span>
              <span className="text-xs text-[#A8C5A3] bg-[#36343B] px-2 py-1 rounded-full">26</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {matchedKeywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-[#36343B] rounded-full text-sm text-[#A8C5A3] border border-[#A8C5A3]/30"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-[#CAC4D0]">Missing</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-[#36343B] rounded-full text-sm text-[#CAC4D0]"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}