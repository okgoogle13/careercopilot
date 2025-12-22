/**
 * ELECTRIC ALCHEMIST: JOB INPUT FEATURE
 *
 * Job input form with tabs for URL or text description.
 */

import React, { useState } from 'react';
import { ArrowLeft, Link as LinkIcon, FileText, ExternalLink, Loader2 } from 'lucide-react';
import { Button, Card, ElectricInput as Input, ElectricTextarea as Textarea, Tabs } from '@/components/electric';
import { motion } from 'framer-motion';

interface JobInputProps {
  documentType?: 'resume' | 'cover-letter' | 'selection-criteria';
  onAnalyze: (jobData: { url?: string; description?: string }) => void;
  onBack: () => void;
}

export function JobInput({ documentType, onAnalyze, onBack }: JobInputProps) {
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('url');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      onAnalyze({
        url: activeTab === 'url' ? jobUrl : undefined,
        description: activeTab === 'text' ? jobDescription : undefined,
      });
    }, 2000);
  };

  const isValidInput = () => {
    if (activeTab === 'url') {
      return (
        jobUrl.trim().length > 0 &&
        (jobUrl.includes('http') || jobUrl.includes('www'))
      );
    }
    return jobDescription.trim().length > 50;
  };

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-hero text-4xl font-bold text-on-surface mb-4">
            Analyze the Job
          </h1>
          <p className="text-human text-lg text-on-surface-variant">
            Provide the job details so we can optimize your document for maximum impact.
          </p>
        </div>

        <Card className="p-8">
          <Tabs
            defaultTab={activeTab}
            onChange={setActiveTab}
            tabs={[
              {
                id: 'url',
                label: 'Job URL',
                content: (
                  <div>
                    <label className="text-human text-base font-medium text-on-surface mb-2 block">
                      Job Posting URL
                    </label>
                    <div className="relative">
                      <Input
                        type="url"
                        placeholder="https://example.com/job-posting"
                        value={jobUrl}
                        onChange={(e) => setJobUrl(e.target.value)}
                        className="pr-12"
                      />
                      <ExternalLink className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant pointer-events-none" />
                    </div>
                    <p className="text-human text-sm text-on-surface-variant mt-2">
                      We'll automatically extract the job requirements and qualifications
                    </p>
                    {jobUrl && (
                      <Card className="mt-4 p-4 border-outline">
                        <p className="text-human text-sm text-on-surface">
                          ✓ Valid job URL detected
                        </p>
                      </Card>
                    )}
                  </div>
                )
              },
              {
                id: 'text',
                label: 'Job Description',
                content: (
                  <div>
                    <label className="text-human text-base font-medium text-on-surface mb-2 block">
                      Job Description
                    </label>
                    <Textarea
                      placeholder="Paste the complete job description here, including requirements, responsibilities, and qualifications..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      rows={8}
                      className="min-h-[200px]"
                    />
                    <p className="text-human text-sm text-on-surface-variant mt-2">
                      {jobDescription.length}/50 characters minimum
                    </p>
                    {jobDescription.length >= 50 && (
                      <Card className="mt-4 p-4 border-outline">
                        <p className="text-human text-sm text-on-surface">
                          ✓ Job description looks good
                        </p>
                      </Card>
                    )}
                  </div>
                )
              }
            ]}
          />

          <div className="flex justify-center mt-8">
            <Button
              onClick={handleAnalyze}
              disabled={!isValidInput() || isAnalyzing}
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Job...
                </>
              ) : (
                'Analyze with AI'
              )}
            </Button>
          </div>
        </Card>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <FileText className="h-6 w-6 text-primary" />,
              title: 'Keyword Extraction',
              description: 'Identify critical keywords and phrases',
            },
            {
              icon: <FileText className="h-6 w-6 text-secondary" />,
              title: 'ATS Optimization',
              description: 'Ensure your document passes ATS systems',
            },
            {
              icon: <FileText className="h-6 w-6 text-tertiary" />,
              title: 'Match Analysis',
              description: 'Calculate your compatibility score',
            },
          ].map((feature, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-high mx-auto mb-3">
                {feature.icon}
              </div>
              <h3 className="text-hero text-lg font-semibold text-on-surface mb-1">
                {feature.title}
              </h3>
              <p className="text-human text-sm text-on-surface-variant">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobInput;

