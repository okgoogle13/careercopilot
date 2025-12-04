/**
 * ELECTRIC ALCHEMIST: JOB MATCHING FEATURE
 *
 * AI-powered job matching with match scores and insights.
 */

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, MapPin, DollarSign, Clock, ExternalLink, Heart, Star } from 'lucide-react';
import { Button } from '@/components';
import { Card } from '@/components';
import { Badge } from '@/components/electric';
import { Progress } from '@/components/electric';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
      description: 'Join our passionate team providing support to individuals with disabilities in community settings.',
      keyRequirements: ['Certificate IV in Disability', '5+ years experience', "Valid driver's license"],
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
      description: 'Support individuals with lived experience of mental health challenges in their recovery journey.',
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
      description: 'Coordinate community programs and build partnerships to support mental health initiatives.',
      keyRequirements: ["Bachelor's degree", 'Community engagement', 'Project management'],
      benefits: ['Salary sacrifice', 'Professional development', 'Work-life balance'],
      isRemote: false,
      isFavorited: false,
    },
  ];

  const handleGenerateInsights = async (jobId: string) => {
    setIsGeneratingInsights(true);
    setSelectedJob(jobId);
    setTimeout(() => {
      setIsGeneratingInsights(false);
    }, 2000);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'text-primary';
    if (percentage >= 80) return 'text-secondary';
    return 'text-tertiary';
  };

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Career Hub
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-hero text-4xl font-bold text-on-surface">
              AI Job Matching
            </h1>
          </div>
          <p className="text-human text-lg text-on-surface-variant">
            Discover roles that perfectly match your skills, experience, and career goals.
          </p>
        </div>

        <div className="space-y-4">
          {jobMatches.map((job) => (
            <Card key={job.id} className="p-6" variant="interactive">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-hero text-2xl font-semibold text-on-surface">
                          {job.title}
                        </h3>
                        {job.isFavorited && <Heart className="h-5 w-5 text-error fill-error" />}
                      </div>
                      <p className="text-hero text-lg text-on-surface-variant mb-2">
                        {job.company}
                      </p>
                      <div className="flex items-center gap-4 text-human text-sm text-on-surface-variant">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salaryRange}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.postedDate}
                        </div>
                        {job.isRemote && <Badge variant="secondary">Remote Available</Badge>}
                      </div>
                    </div>
                  </div>

                  <p className="text-human text-base text-on-surface-variant my-4">
                    {job.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-hero text-sm font-medium text-on-surface mb-2">
                        Key Requirements
                      </h4>
                      <ul className="space-y-1">
                        {job.keyRequirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2 text-human text-sm text-on-surface-variant">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-hero text-sm font-medium text-on-surface mb-2">
                        Benefits
                      </h4>
                      <ul className="space-y-1">
                        {job.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2 text-human text-sm text-on-surface-variant">
                            <span className="h-2 w-2 rounded-full bg-secondary" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Card className="p-4 border-outline-variant text-center">
                    <p className={cn('text-hero text-4xl font-bold mb-2', getMatchColor(job.matchPercentage))}>
                      {job.matchPercentage}%
                    </p>
                    <p className="text-human text-base font-medium text-on-surface-variant mb-3">
                      Match Score
                    </p>
                    <Progress value={job.matchPercentage} className="mb-2" />
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-4 w-4',
                            i < Math.round(job.matchPercentage / 20)
                              ? 'text-tertiary fill-tertiary'
                              : 'text-outline-variant'
                          )}
                        />
                      ))}
                    </div>
                  </Card>

                  <Button
                    onClick={() => handleGenerateInsights(job.id)}
                    disabled={isGeneratingInsights && selectedJob === job.id}
                    className="w-full"
                  >
                    {isGeneratingInsights && selectedJob === job.id ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Generating Insights...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Get AI Insights
                      </>
                    )}
                  </Button>

                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full Job
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Heart className={cn('h-4 w-4 mr-2', job.isFavorited && 'fill-error text-error')} />
                    {job.isFavorited ? 'Saved' : 'Save Job'}
                  </Button>
                </div>
              </div>

              {isGeneratingInsights && selectedJob === job.id && (
                <Card className="mt-6 p-4 border-outline-variant bg-surface-container-low">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h4 className="text-hero text-base font-medium text-on-surface">
                      AI-Generated Insights
                    </h4>
                  </div>
                  <div className="space-y-2 text-human text-base text-on-surface-variant">
                    <p>• <strong>Strong match:</strong> Your Community Support Worker experience aligns perfectly with this role</p>
                    <p>• <strong>Salary competitive:</strong> This position offers 15% above market average for your experience level</p>
                    <p>• <strong>Growth opportunity:</strong> Company has promoted 78% of CSWs to senior roles within 2 years</p>
                    <p>• <strong>Recommendation:</strong> Highlight your crisis intervention skills and community engagement experience</p>
                  </div>
                </Card>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Matches
          </Button>
        </div>
      </div>
    </div>
  );
}

export default JobMatching;

