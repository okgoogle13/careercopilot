import React, { useState } from 'react';
import { Button } from './button';
import { DocumentReviewModal } from './document-review-modal';
import { cn } from '@/lib/utils';
import {
  Send,
  Loader2,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Zap
} from 'lucide-react';

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
  disabled = false
}: OneClickApplyButtonProps) {
  const [stage, setStage] = useState<ApplicationStage>('idle');
  const [generatedDocuments, setGeneratedDocuments] = useState<ApplicationDocument[]>([]);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const mockGenerateDocuments = async (job: JobApplication): Promise<ApplicationDocument[]> => {
    // Simulate AI document generation
    const documents: ApplicationDocument[] = [];

    // Generate tailored resume
    const resume: ApplicationDocument = {
      type: 'resume',
      title: `Resume for ${job.jobTitle} at ${job.company}`,
      content: `<h1>John Doe</h1><p>Professional ${job.jobTitle} with expertise in relevant skills</p><h2>Experience</h2><p>Previous roles demonstrating ${job.requirements?.slice(0, 3).join(', ')} capabilities</p>`,
      metadata: {
        wordCount: 450,
        lastModified: new Date(),
        targetJob: {
          title: job.jobTitle,
          company: job.company,
          location: job.location
        },
        matchScore: Math.floor(Math.random() * 20) + 75 // 75-95% match
      },
      keywords: job.requirements?.slice(0, 8).map((req, index) => ({
        keyword: req,
        status: Math.random() > 0.7 ? 'matched' : 'suggested' as const,
        id: `keyword-${index}`
      })) || [],
      aiSuggestions: [
        'Consider adding specific metrics to quantify your achievements',
        'Include more industry-specific keywords',
        'Highlight relevant certifications or training'
      ]
    };
    documents.push(resume);

    // Generate cover letter
    const coverLetter: ApplicationDocument = {
      type: 'cover_letter',
      title: `Cover Letter for ${job.jobTitle}`,
      content: `<p>Dear Hiring Manager,</p><p>I am writing to express my interest in the ${job.jobTitle} position at ${job.company}. With my background in relevant experience, I am excited about the opportunity to contribute to your team.</p><p>My experience includes ${job.requirements?.slice(0, 2).join(' and ')}, which aligns well with your requirements.</p><p>Thank you for your consideration.</p><p>Best regards,<br>John Doe</p>`,
      metadata: {
        wordCount: 180,
        lastModified: new Date(),
        targetJob: {
          title: job.jobTitle,
          company: job.company,
          location: job.location
        },
        matchScore: Math.floor(Math.random() * 15) + 80 // 80-95% match
      },
      keywords: job.requirements?.slice(0, 5).map((req, index) => ({
        keyword: req,
        status: Math.random() > 0.6 ? 'matched' : 'suggested' as const,
        id: `cl-keyword-${index}`
      })) || [],
      aiSuggestions: [
        'Personalize the opening paragraph with specific company details',
        'Add a compelling call-to-action in the closing',
        'Include specific examples of relevant achievements'
      ]
    };
    documents.push(coverLetter);

    return documents;
  };

  const handleOneClickApply = async () => {
    try {
      setStage('generating');
      setProgress(10);
      onApplicationStart?.(job);

      // Simulate document generation with progress updates
      setProgress(30);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI processing time

      const documents = await mockGenerateDocuments(job);
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
      await new Promise(resolve => setTimeout(resolve, 2000));

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
          stage === 'completed' && 'bg-green-600 hover:bg-green-700',
          stage === 'error' && 'bg-red-600 hover:bg-red-700',
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
              {stage === 'generating' ? 'Generating personalized documents...' : 'Submitting application...'}
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
