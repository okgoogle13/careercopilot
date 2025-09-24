import { useState } from 'react';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  DollarSign,
  Clock,
  ExternalLink,
  Heart,
  Star,
} from '@mui/icons-material';
import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
} from '@mui/material';

interface JobMatchingProps {
  onBack: () => void;
}

interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  matchPercentage: number;
  salaryRange: string;
  postedDate: string;
  description: string;
  keyRequirements: string[];
  benefits: string[];
  isRemote: boolean;
  isFavorited: boolean;
}

export function JobMatching({ onBack }: JobMatchingProps) {
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const jobMatches: JobMatch[] = [
    {
      id: '1',
      title: 'Senior Community Support Worker',
      company: 'Community Care Australia',
      location: 'Brisbane, QLD',
      matchPercentage: 94,
      salaryRange: '$65,000 - $75,000',
      postedDate: '2 days ago',
      description:
        'Join our passionate team providing support to individuals with disabilities in community settings.',
      keyRequirements: [
        'Certificate IV in Disability',
        '5+ years experience',
        "Valid driver's license",
      ],
      benefits: ['Professional development', 'Health insurance', 'Flexible hours'],
      isRemote: false,
      isFavorited: false,
    },
    {
      id: '2',
      title: 'Mental Health Peer Worker',
      company: 'Queensland Health',
      location: 'Gold Coast, QLD',
      matchPercentage: 87,
      salaryRange: '$60,000 - $70,000',
      postedDate: '5 days ago',
      description:
        'Support individuals with lived experience of mental health challenges in their recovery journey.',
      keyRequirements: ['Lived experience', 'Peer work certification', 'Communication skills'],
      benefits: ['Government benefits', 'Training opportunities', 'Career progression'],
      isRemote: true,
      isFavorited: true,
    },
    {
      id: '3',
      title: 'Community Outreach Coordinator',
      company: 'Mental Health Foundation',
      location: 'Sydney, NSW',
      matchPercentage: 82,
      salaryRange: '$55,000 - $65,000',
      postedDate: '1 week ago',
      description:
        'Coordinate community programs and build partnerships to support mental health initiatives.',
      keyRequirements: ["Bachelor's degree", 'Community engagement', 'Project management'],
      benefits: ['Salary sacrifice', 'Professional development', 'Work-life balance'],
      isRemote: false,
      isFavorited: false,
    },
  ];

  const handleGenerateInsights = async (jobId: string) => {
    setIsGeneratingInsights(true);
    setSelectedJob(jobId);

    // Simulate AI analysis
    setTimeout(() => {
      setIsGeneratingInsights(false);
    }, 2000);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 80) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getMatchBgColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500/10';
    if (percentage >= 80) return 'bg-yellow-500/10';
    return 'bg-orange-500/10';
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="text" size="small" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Career Hub
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-semibold">AI Job Matching</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Discover roles that perfectly match your skills, experience, and career goals.
          </p>
        </div>

        {/* Job Matches */}
        <div className="space-y-6">
          {jobMatches.map((job) => (
            <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Job Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        {job.isFavorited && <Heart className="w-5 h-5 text-red-500 fill-current" />}
                      </div>
                      <p className="text-lg text-muted-foreground">{job.company}</p>

                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salaryRange}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.postedDate}
                        </div>
                        {job.isRemote && <Badge variant="secondary">Remote Available</Badge>}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">{job.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Key Requirements</h4>
                      <ul className="space-y-1">
                        {job.keyRequirements.map((req, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Benefits</h4>
                      <ul className="space-y-1">
                        {job.benefits.map((benefit, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Match Score & Actions */}
                <div className="lg:w-80 space-y-4">
                  <Card className={`p-4 ${getMatchBgColor(job.matchPercentage)} border-0`}>
                    <div className="text-center">
                      <div
                        className={`text-3xl font-bold ${getMatchColor(job.matchPercentage)} mb-2`}
                      >
                        {job.matchPercentage}%
                      </div>
                      <p className="text-sm font-medium mb-3">Match Score</p>
                      <Progress value={job.matchPercentage} className="w-full" />
                      <div className="flex items-center justify-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(job.matchPercentage / 20)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </Card>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => handleGenerateInsights(job.id)}
                      disabled={isGeneratingInsights && selectedJob === job.id}
                    >
                      {isGeneratingInsights && selectedJob === job.id ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                          Generating Insights...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Get AI Insights
                        </>
                      )}
                    </Button>

                    <Button variant="outlined" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Job
                    </Button>

                    <Button variant="outlined" className="w-full">
                      <Heart
                        className={`w-4 h-4 mr-2 ${job.isFavorited ? 'text-red-500 fill-current' : ''}`}
                      />
                      {job.isFavorited ? 'Saved' : 'Save Job'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI Insights (shown when generated) */}
              {isGeneratingInsights && selectedJob === job.id && (
                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    <h4 className="font-medium text-primary">AI-Generated Insights</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      • <strong>Strong match:</strong> Your Community Support Worker experience
                      aligns perfectly with this role
                    </p>
                    <p>
                      • <strong>Salary competitive:</strong> This position offers 15% above market
                      average for your experience level
                    </p>
                    <p>
                      • <strong>Growth opportunity:</strong> Company has promoted 78% of CSWs to
                      senior roles within 2 years
                    </p>
                    <p>
                      • <strong>Recommendation:</strong> Highlight your crisis intervention skills
                      and community engagement experience
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outlined" size="large">
            Load More Matches
          </Button>
        </div>
      </div>
    </div>
  );
}
