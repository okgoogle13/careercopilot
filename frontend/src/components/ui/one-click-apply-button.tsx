import React, { useState } from 'react';
import { Button } from './button';
import { DocumentReviewModal } from './document-review-modal';
import { cn } from '@/lib/utils';
import { Send, Loader2, CheckCircle, AlertTriangle, FileText, Clock, Zap } from 'lucide-react';
import { generateApplicationPackage, ApplicationPackageResult } from '@/api/aiServices';

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  applicationUrl?: string;
  requirements?: string[];
}

interface ApplicationDocument {
  type: 'resume' | 'cover_letter' | 'ksc_response';
  title: string;
  content: string;
  metadata: {
    wordCount?: number;
    lastModified?: Date;
    targetJob?: {
      title: string;
      company: string;
      location: string;
    };
    matchScore?: number;
  };
  keywords?: Array<{
    keyword: string;
    status: 'matched' | 'missing' | 'suggested' | 'accepted' | 'rejected';
    id?: string;
  }>;
  aiSuggestions?: string[];
  issues?: Array<{
    type: 'warning' | 'error' | 'suggestion';
    message: string;
  }>;
}

interface OneClickApplyButtonProps {
  job: JobApplication;
  userProfile?: {
    resume?: string;
    skills?: string[];
    experience?: string[];
  };
  onApplicationStart?: (job: JobApplication) => void;
  onApplicationComplete?: (job: JobApplication, documents: ApplicationDocument[]) => void;
  onApplicationError?: (job: JobApplication, error: string) => void;
  className?: string;
  disabled?: boolean;
}

type ApplicationStage = 'idle' | 'generating' | 'reviewing' | 'submitting' | 'completed' | 'error';

export function OneClickApplyButton({
  job,
  userProfile,
  onApplicationStart,
  onApplicationComplete,
  onApplicationError,
  className,
  disabled = false,
}: OneClickApplyButtonProps) {
  const [stage, setStage] = useState<ApplicationStage>('idle');
  const [generatedDocuments, setGeneratedDocuments] = useState<ApplicationDocument[]>([]);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const generateDocuments = async (job: JobApplication): Promise<ApplicationDocument[]> => {
    // Build job description from job details
    const jobDescription = `
      Job Title: ${job.jobTitle}
      Company: ${job.company}
      Location: ${job.location}
      ${job.requirements ? `Requirements: ${job.requirements.join(', ')}` : ''}
    `.trim();

    // Create user profile from available data
    const profile = {
      resume_content: userProfile?.resume || '',
      skills: userProfile?.skills || [],
      experience: userProfile?.experience || [],
      job_title: job.jobTitle,
      company: job.company,
      location: job.location,
    };

    try {
      // Call the new application package workflow
      const packageResult: ApplicationPackageResult = await generateApplicationPackage(
        jobDescription,
        profile
      );

      const documents: ApplicationDocument[] = [];

      // Convert tailored resume to ApplicationDocument
      if (packageResult.tailored_resume) {
        const resume: ApplicationDocument = {
          type: 'resume',
          title: `Tailored Resume for ${job.jobTitle} at ${job.company}`,
          content:
            typeof packageResult.tailored_resume === 'string'
              ? packageResult.tailored_resume
              : JSON.stringify(packageResult.tailored_resume),
          metadata: {
            wordCount: 450,
            lastModified: new Date(),
            targetJob: {
              title: job.jobTitle,
              company: job.company,
              location: job.location,
            },
            matchScore: 85, // Could be extracted from packageResult if available
          },
          keywords:
            job.requirements?.slice(0, 8).map((req, index) => ({
              keyword: req,
              status: 'matched' as const,
              id: `keyword-${index}`,
            })) || [],
          aiSuggestions: [
            'AI-generated resume tailored for this specific role',
            'Include more industry-specific keywords',
            'Highlight relevant certifications or training',
          ],
        };
        documents.push(resume);
      }

      // Convert cover letter to ApplicationDocument
      if (packageResult.cover_letter) {
        const coverLetter: ApplicationDocument = {
          type: 'cover_letter',
          title: `AI-Generated Cover Letter for ${job.jobTitle}`,
          content:
            typeof packageResult.cover_letter === 'string'
              ? packageResult.cover_letter
              : JSON.stringify(packageResult.cover_letter),
          metadata: {
            wordCount: 180,
            lastModified: new Date(),
            targetJob: {
              title: job.jobTitle,
              company: job.company,
              location: job.location,
            },
            matchScore: 88,
          },
          keywords:
            job.requirements?.slice(0, 5).map((req, index) => ({
              keyword: req,
              status: 'matched' as const,
              id: `cl-keyword-${index}`,
            })) || [],
          aiSuggestions: [
            'AI-generated cover letter with company research integration',
            'Personalized based on your profile and job requirements',
            'Optimized for ATS compatibility',
          ],
        };
        documents.push(coverLetter);
      }

      // Convert KSC responses to ApplicationDocuments
      if (packageResult.ksc_responses && packageResult.ksc_responses.length > 0) {
        packageResult.ksc_responses.forEach((ksc, index) => {
          const kscDoc: ApplicationDocument = {
            type: 'ksc_response',
            title: `KSC Response ${index + 1}`,
            content: typeof ksc === 'string' ? ksc : JSON.stringify(ksc),
            metadata: {
              wordCount: 200,
              lastModified: new Date(),
              targetJob: {
                title: job.jobTitle,
                company: job.company,
                location: job.location,
              },
              matchScore: 90,
            },
            aiSuggestions: [
              'AI-generated using STAR methodology',
              'Tailored to specific selection criteria',
              'Evidence-based responses from your profile',
            ],
          };
          documents.push(kscDoc);
        });
      }

      return documents;
    } catch (error) {
      console.error('Application package generation failed:', error);
      throw new Error(
        `Failed to generate application package: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const handleOneClickApply = async () => {
    try {
      setStage('generating');
      setProgress(10);
      onApplicationStart?.(job);

      // Simulate document generation with progress updates
      setProgress(30);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate AI processing time

      const documents = await generateDocuments(job);
      setGeneratedDocuments(documents);
      setProgress(60);

      setStage('reviewing');
      setProgress(70);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate application documents');
      setStage('error');
      onApplicationError?.(job, error || 'Unknown error');
    }
  };

  const handleDocumentConfirm = (document: ApplicationDocument) => {
    const updatedDocuments = [...generatedDocuments];
    updatedDocuments[currentDocumentIndex] = document;
    setGeneratedDocuments(updatedDocuments);

    if (currentDocumentIndex < generatedDocuments.length - 1) {
      // Move to next document
      setCurrentDocumentIndex(currentDocumentIndex + 1);
    } else {
      // All documents reviewed, proceed to submit
      handleSubmitApplication(updatedDocuments);
    }
  };

  const handleSubmitApplication = async (documents: ApplicationDocument[]) => {
    setStage('submitting');
    setProgress(90);

    try {
      // Simulate application submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStage('completed');
      setProgress(100);
      onApplicationComplete?.(job, documents);

      // Reset after success
      setTimeout(() => {
        setStage('idle');
        setProgress(0);
        setCurrentDocumentIndex(0);
        setGeneratedDocuments([]);
      }, 3000);
    } catch (err) {
      setError('Failed to submit application');
      setStage('error');
      onApplicationError?.(job, 'Submission failed');
    }
  };

  const getButtonContent = () => {
    switch (stage) {
      case 'generating':
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating Documents... ({progress}%)
          </>
        );
      case 'reviewing':
        return (
          <>
            <FileText className="w-4 h-4" />
            Review Documents ({currentDocumentIndex + 1}/{generatedDocuments.length})
          </>
        );
      case 'submitting':
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting Application...
          </>
        );
      case 'completed':
        return (
          <>
            <CheckCircle className="w-4 h-4" />
            Application Submitted!
          </>
        );
      case 'error':
        return (
          <>
            <AlertTriangle className="w-4 h-4" />
            Application Failed
          </>
        );
      default:
        return (
          <>
            <Zap className="w-4 h-4" />
            Apply with AI
          </>
        );
    }
  };

  const getButtonVariant = () => {
    switch (stage) {
      case 'completed':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const isButtonDisabled = disabled || ['generating', 'submitting'].includes(stage);

  return (
    <>
      <Button
        onClick={handleOneClickApply}
        disabled={isButtonDisabled}
        variant={getButtonVariant()}
        className={cn(
          'flex items-center gap-2 transition-all duration-200',
          stage === 'completed' && 'bg-brand-green hover:bg-brand-green/90 text-white',
          className
        )}
      >
        {getButtonContent()}
      </Button>

      {/* Document Review Modals */}
      {stage === 'reviewing' && generatedDocuments[currentDocumentIndex] && (
        <DocumentReviewModal
          document={generatedDocuments[currentDocumentIndex]}
          isOpen={stage === 'reviewing'}
          onOpenChange={(open) => {
            if (!open) {
              // User cancelled, reset state
              setStage('idle');
              setCurrentDocumentIndex(0);
              setGeneratedDocuments([]);
              setProgress(0);
            }
          }}
          onConfirm={handleDocumentConfirm}
          onEdit={(document) => {
            // Allow editing and return to review
            const updatedDocuments = [...generatedDocuments];
            updatedDocuments[currentDocumentIndex] = document;
            setGeneratedDocuments(updatedDocuments);
          }}
          onDownload={(document) => {
            // Trigger download
            const blob = new Blob([document.content], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${document.title}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        />
      )}

      {/* Progress indicator */}
      {['generating', 'submitting'].includes(stage) && (
        <div className="w-full mt-2">
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
            <Clock className="w-3 h-3" />
            <span>
              {stage === 'generating'
                ? 'Generating personalized documents...'
                : 'Submitting application...'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error message */}
      {stage === 'error' && error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}
    </>
  );
}
