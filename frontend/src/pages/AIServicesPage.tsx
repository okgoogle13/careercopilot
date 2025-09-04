import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/Card';
import {
  JobMatchingComponent,
  ContentOptimizationComponent,
  ResumeIntelligenceComponent,
  CoverLetterGenerationComponent,
} from '../components/AIServices';
import { Brain, Briefcase, FileText, Sparkles, Target, TrendingUp, Star, Zap } from 'lucide-react';

const AIServicesPage: React.FC = () => {
  const [selectedResume, setSelectedResume] = useState<string>('');
  const [activeService, setActiveService] = useState('overview');

  const services = [
    {
      id: 'job-matching',
      title: 'AI Job Matching',
      icon: Briefcase,
      description:
        'Find jobs that perfectly match your skills and experience with intelligent matching algorithms.',
      features: ['Skill-based matching', 'Salary insights', 'Gap analysis', 'Industry trends'],
      color: 'bg-blue-500',
    },
    {
      id: 'content-optimization',
      title: 'Content Optimization',
      icon: Target,
      description:
        'Optimize your resume, cover letters, and professional content for maximum impact.',
      features: [
        'ATS optimization',
        'Keyword enhancement',
        'Readability improvement',
        'Impact statements',
      ],
      color: 'bg-green-500',
    },
    {
      id: 'resume-intelligence',
      title: 'Resume Intelligence',
      icon: Brain,
      description: 'Get deep insights into your career trajectory and market positioning.',
      features: [
        'Career progression',
        'Skills analysis',
        'Market positioning',
        'Growth recommendations',
      ],
      color: 'bg-purple-500',
    },
    {
      id: 'cover-letter',
      title: 'Smart Cover Letters',
      icon: FileText,
      description: 'Generate personalized cover letters with company research and insights.',
      features: ['Company research', 'Personalization', 'Multiple tones', 'Industry insights'],
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='flex justify-center items-center mb-4'>
            <div className='p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full'>
              <Sparkles className='h-8 w-8 text-white' />
            </div>
          </div>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>AI-Powered Career Services</h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Leverage advanced AI technology to accelerate your career growth with intelligent job
            matching, content optimization, and personalized career insights.
          </p>
        </div>

        <Tabs value={activeService} onValueChange={setActiveService}>
          <TabsList className='grid w-full grid-cols-5 mb-8'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='job-matching'>Job Matching</TabsTrigger>
            <TabsTrigger value='content-optimization'>Optimization</TabsTrigger>
            <TabsTrigger value='resume-intelligence'>Intelligence</TabsTrigger>
            <TabsTrigger value='cover-letter'>Cover Letters</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value='overview'>
            <div className='space-y-8'>
              {/* Feature Cards */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {services.map(service => (
                  <Card
                    key={service.id}
                    className='p-6 hover:shadow-lg transition-shadow cursor-pointer'
                    onClick={() => setActiveService(service.id)}
                  >
                    <div className='flex flex-col items-center text-center space-y-4'>
                      <div className={`p-3 rounded-full ${service.color} text-white`}>
                        <service.icon className='h-6 w-6' />
                      </div>
                      <h3 className='text-lg font-semibold text-gray-900'>{service.title}</h3>
                      <p className='text-sm text-gray-600'>{service.description}</p>
                      <div className='space-y-1'>
                        {service.features.map((feature, index) => (
                          <div key={index} className='flex items-center text-xs text-gray-500'>
                            <Star className='h-3 w-3 mr-1 text-yellow-400' />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Benefits Section */}
              <Card className='p-8'>
                <h2 className='text-2xl font-bold text-center text-gray-900 mb-6'>
                  Why Choose AI-Powered Career Services?
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                  <div className='text-center'>
                    <div className='flex justify-center mb-4'>
                      <div className='p-3 bg-blue-100 rounded-full'>
                        <Zap className='h-6 w-6 text-blue-600' />
                      </div>
                    </div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>Lightning Fast</h3>
                    <p className='text-gray-600'>
                      Get instant insights and recommendations powered by advanced AI models trained
                      on millions of career data points.
                    </p>
                  </div>
                  <div className='text-center'>
                    <div className='flex justify-center mb-4'>
                      <div className='p-3 bg-green-100 rounded-full'>
                        <Target className='h-6 w-6 text-green-600' />
                      </div>
                    </div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>Hyper-Personalized</h3>
                    <p className='text-gray-600'>
                      Every recommendation is tailored to your unique background, skills, and career
                      goals for maximum relevance and impact.
                    </p>
                  </div>
                  <div className='text-center'>
                    <div className='flex justify-center mb-4'>
                      <div className='p-3 bg-purple-100 rounded-full'>
                        <TrendingUp className='h-6 w-6 text-purple-600' />
                      </div>
                    </div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                      Data-Driven Results
                    </h3>
                    <p className='text-gray-600'>
                      Make informed career decisions backed by real-time market data, industry
                      trends, and proven success patterns.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Getting Started */}
              <Card className='p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'>
                <div className='text-center'>
                  <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                    Ready to Get Started?
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    Upload your resume or select from your documents to begin using our AI-powered
                    services.
                  </p>
                  <div className='flex justify-center space-x-4'>
                    <button
                      onClick={() => setActiveService('job-matching')}
                      className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                      Start Job Matching
                    </button>
                    <button
                      onClick={() => setActiveService('resume-intelligence')}
                      className='px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
                    >
                      Analyze Resume
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Job Matching Tab */}
          <TabsContent value='job-matching'>
            <JobMatchingComponent
              resumeDocumentId={selectedResume}
              onJobSelected={jobId => {
                console.log('Selected job:', jobId);
                // Handle job selection
              }}
            />
          </TabsContent>

          {/* Content Optimization Tab */}
          <TabsContent value='content-optimization'>
            <ContentOptimizationComponent contentType='resume' />
          </TabsContent>

          {/* Resume Intelligence Tab */}
          <TabsContent value='resume-intelligence'>
            <ResumeIntelligenceComponent resumeDocumentId={selectedResume} />
          </TabsContent>

          {/* Cover Letter Tab */}
          <TabsContent value='cover-letter'>
            <CoverLetterGenerationComponent resumeDocumentId={selectedResume} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIServicesPage;
