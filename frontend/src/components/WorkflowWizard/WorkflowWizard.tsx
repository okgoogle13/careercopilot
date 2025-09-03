import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, ProgressBar, LoadingSpinner } from '../ui';
import {
  CheckCircle, ArrowRight, ArrowLeft, X, Clock, AlertCircle,
  FileText, Target, Sparkles, RefreshCw,
  Download, Share2, Eye, Plus, Briefcase, GraduationCap,
  Trash2, Award
} from 'lucide-react';
import toast from 'react-hot-toast';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  type: 'form' | 'upload' | 'review' | 'action' | 'confirmation';
  required: boolean;
  estimatedTime: number; // minutes
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<WorkflowStepProps>;
  validation?: (data: any) => string | null;
  dependencies?: string[]; // step IDs that must be completed first
}

interface WorkflowStepProps {
  data: any;
  onDataChange: (updates: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

interface Workflow {
  id: string;
  title: string;
  description: string;
  category: 'document_creation' | 'job_application' | 'profile_setup' | 'analysis';
  estimatedTime: number; // total minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: WorkflowStep[];
  prerequisites?: string[];
  outcomes: string[];
}

interface WorkflowWizardProps {
  workflowId: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: any) => void;
  initialData?: any;
}

const WorkflowWizard: React.FC<WorkflowWizardProps> = ({
  workflowId,
  isOpen,
  onClose,
  onComplete,
  initialData = {},
}) => {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>(initialData);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  // Load workflow definition
  useEffect(() => {
    const loadWorkflow = async () => {
      setLoading(true);
      try {
        const workflowDef = getWorkflowDefinition(workflowId);
        setWorkflow(workflowDef);
        setStartTime(new Date());
      } catch {
        toast.error('Failed to load workflow');
        onClose();
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadWorkflow();
    }
  }, [workflowId, isOpen, onClose]);

  const currentStep = workflow?.steps[currentStepIndex];
  const progress = workflow ? ((currentStepIndex + 1) / workflow.steps.length) * 100 : 0;
  const hasUnsavedData = Object.keys(stepData).length > 0;

  const handleNext = async () => {
    if (!workflow || !currentStep) return;

    // Validate current step
    if (currentStep.validation) {
      const error = currentStep.validation(stepData[currentStep.id]);
      if (error) {
        toast.error(error);
        return;
      }
    }

    // Mark step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep.id]));

    if (currentStepIndex < workflow.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      await completeWorkflow();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleStepDataChange = (stepId: string, updates: any) => {
    setStepData(prev => ({
      ...prev,
      [stepId]: { ...prev[stepId], ...updates },
    }));
  };

  const completeWorkflow = async () => {
    if (!workflow || !startTime) return;

    setProcessing(true);
    try {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      const result = {
        workflowId: workflow.id,
        completedAt: endTime,
        duration,
        data: stepData,
        steps: workflow.steps.map(step => ({
          id: step.id,
          completed: completedSteps.has(step.id),
          data: stepData[step.id],
        })),
      };

      // Log completion for analytics
      await logWorkflowCompletion(result);

      onComplete(result);
      toast.success(`${workflow.title} completed successfully!`);
      onClose();
    } catch (error) {
      console.error('Error completing workflow:', error);
      toast.error('Failed to complete workflow');
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedData) {
      setShowConfirmExit(true);
    } else {
      onClose();
    }
  };

  const confirmExit = () => {
    setShowConfirmExit(false);
    onClose();
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Modal>
    );
  }

  if (!workflow) {
    return null;
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="xl" closeOnBackdropClick={false}>
        <div className="max-h-screen overflow-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{workflow.title}</h2>
                <p className="text-gray-600 mt-1">{workflow.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {workflow.estimatedTime} min
                  </span>
                  <span className="capitalize">{workflow.difficulty}</span>
                  <span>Step {currentStepIndex + 1} of {workflow.steps.length}</span>
                </div>
              </div>
              <Button variant="ghost" onClick={handleClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
              </div>
              <ProgressBar value={progress} />
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6">
            {currentStep && (
              <WorkflowStepRenderer
                step={currentStep}
                workflow={workflow}
                stepIndex={currentStepIndex}
                data={stepData[currentStep.id] || {}}
                onDataChange={(updates) => handleStepDataChange(currentStep.id, updates)}
                onNext={handleNext}
                onPrevious={handlePrevious}
                processing={processing}
              />
            )}
          </div>
        </div>
      </Modal>

      {/* Exit Confirmation */}
      <Modal isOpen={showConfirmExit} onClose={() => setShowConfirmExit(false)}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900">Exit Workflow?</h3>
          </div>
          <p className="text-gray-600 mb-6">
            You have unsaved progress in this workflow. Are you sure you want to exit?
            Your progress will be lost.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowConfirmExit(false)}>
              Continue Working
            </Button>
            <Button onClick={confirmExit} className="bg-red-500 hover:bg-red-600">
              Exit Without Saving
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// Step Renderer Component
const WorkflowStepRenderer: React.FC<{
  step: WorkflowStep;
  workflow: Workflow;
  stepIndex: number;
  data: any;
  onDataChange: (updates: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  processing: boolean;
}> = ({ step, workflow, stepIndex, data, onDataChange, onNext, onPrevious, processing }) => {
  const StepIcon = step.icon;
  const StepComponent = step.component;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <StepIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">{step.description}</p>

        {step.estimatedTime > 0 && (
          <div className="flex items-center justify-center gap-1 mt-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            Estimated time: {step.estimatedTime} minutes
          </div>
        )}
      </div>

      {/* Step Component */}
      <Card className="p-8 mb-8">
        <StepComponent
          data={data}
          onDataChange={onDataChange}
          onNext={onNext}
          onPrevious={onPrevious}
          isFirst={stepIndex === 0}
          isLast={stepIndex === workflow.steps.length - 1}
        />
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {stepIndex > 0 && (
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={processing}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {step.required && (
            <span className="text-sm text-gray-500">* Required step</span>
          )}

          <Button
            onClick={onNext}
            disabled={processing}
            className="flex items-center gap-2"
          >
            {processing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : stepIndex === workflow.steps.length - 1 ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            {processing
              ? 'Processing...'
              : stepIndex === workflow.steps.length - 1
              ? 'Complete Workflow'
              : 'Continue'
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

// Workflow Definitions
const getWorkflowDefinition = (workflowId: string): Workflow => {
  const workflows: Record<string, Workflow> = {
    'complete-job-application': {
      id: 'complete-job-application',
      title: 'Complete Job Application',
      description: 'Generate a tailored resume and cover letter for a specific job posting',
      category: 'job_application',
      estimatedTime: 25,
      difficulty: 'intermediate',
      outcomes: [
        'Tailored resume optimized for the job',
        'Personalized cover letter',
        'ATS compatibility analysis',
        'Application tracking setup'
      ],
      steps: [
        {
          id: 'job-details',
          title: 'Enter Job Details',
          description: 'Provide information about the job you\'re applying for',
          type: 'form',
          required: true,
          estimatedTime: 3,
          icon: Target,
          component: JobDetailsStep,
          validation: (data) => {
            if (!data.jobTitle) return 'Job title is required';
            if (!data.company) return 'Company name is required';
            if (!data.jobDescription) return 'Job description is required';
            return null;
          },
        },
        {
          id: 'profile-selection',
          title: 'Select Profile',
          description: 'Choose which profile to use as the base for your application',
          type: 'form',
          required: true,
          estimatedTime: 2,
          icon: FileText,
          component: ProfileSelectionStep,
          validation: (data) => {
            if (!data.selectedProfile) return 'Please select a profile';
            return null;
          },
        },
        {
          id: 'customization',
          title: 'Customize Content',
          description: 'Review and customize your resume content for this specific job',
          type: 'form',
          required: false,
          estimatedTime: 10,
          icon: Sparkles,
          component: CustomizationStep,
        },
        {
          id: 'template-selection',
          title: 'Choose Template',
          description: 'Select a professional template for your documents',
          type: 'form',
          required: true,
          estimatedTime: 3,
          icon: Eye,
          component: TemplateSelectionStep,
          validation: (data) => {
            if (!data.selectedTemplate) return 'Please select a template';
            return null;
          },
        },
        {
          id: 'review',
          title: 'Review & Generate',
          description: 'Review your application materials before final generation',
          type: 'review',
          required: true,
          estimatedTime: 5,
          icon: CheckCircle,
          component: ReviewStep,
        },
        {
          id: 'completion',
          title: 'Download Documents',
          description: 'Your application materials are ready for download',
          type: 'confirmation',
          required: false,
          estimatedTime: 2,
          icon: Download,
          component: CompletionStep,
        },
      ],
    },

    'setup-career-profile': {
      id: 'setup-career-profile',
      title: 'Career Profile Setup',
      description: 'Create a comprehensive professional profile from scratch',
      category: 'profile_setup',
      estimatedTime: 45,
      difficulty: 'beginner',
      outcomes: [
        'Complete professional profile',
        'Optimized skill keywords',
        'Professional summary',
        'Ready for document generation'
      ],
      steps: [
        {
          id: 'basic-info',
          title: 'Basic Information',
          description: 'Enter your personal and contact information',
          type: 'form',
          required: true,
          estimatedTime: 5,
          icon: FileText,
          component: BasicInfoStep,
          validation: (data) => {
            if (!data.fullName) return 'Full name is required';
            if (!data.email) return 'Email is required';
            return null;
          },
        },
        {
          id: 'work-experience',
          title: 'Work Experience',
          description: 'Add your work history and achievements',
          type: 'form',
          required: true,
          estimatedTime: 20,
          icon: Briefcase,
          component: WorkExperienceStep,
        },
        {
          id: 'education',
          title: 'Education',
          description: 'Add your educational background',
          type: 'form',
          required: true,
          estimatedTime: 10,
          icon: GraduationCap,
          component: EducationStep,
        },
        {
          id: 'skills',
          title: 'Skills & Qualifications',
          description: 'List your technical skills, soft skills, and certifications',
          type: 'form',
          required: true,
          estimatedTime: 8,
          icon: Award,
          component: SkillsStep,
        },
        {
          id: 'summary',
          title: 'Professional Summary',
          description: 'Create a compelling professional summary',
          type: 'form',
          required: true,
          estimatedTime: 2,
          icon: Sparkles,
          component: SummaryStep,
        },
      ],
    },
  };

  const workflow = workflows[workflowId];
  if (!workflow) {
    throw new Error(`Workflow ${workflowId} not found`);
  }

  return workflow;
};

// Individual Step Components
const JobDetailsStep: React.FC<WorkflowStepProps> = ({ data, onDataChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Title *
        </label>
        <input
          type="text"
          value={data.jobTitle || ''}
          onChange={(e) => onDataChange({ jobTitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Senior Software Engineer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            value={data.company || ''}
            onChange={(e) => onDataChange({ company: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Tech Corp"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Application Deadline
          </label>
          <input
            type="date"
            value={data.deadline || ''}
            onChange={(e) => onDataChange({ deadline: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Description *
        </label>
        <textarea
          value={data.jobDescription || ''}
          onChange={(e) => onDataChange({ jobDescription: e.target.value })}
          rows={12}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-vertical"
          placeholder="Paste the complete job description here..."
        />
        <p className="text-xs text-gray-500 mt-2">
          💡 Tip: Include the full job posting for better keyword matching and ATS optimization.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job URL (Optional)
        </label>
        <input
          type="url"
          value={data.jobUrl || ''}
          onChange={(e) => onDataChange({ jobUrl: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="https://company.com/jobs/123"
        />
      </div>
    </div>
  );
};

const ProfileSelectionStep: React.FC<WorkflowStepProps> = ({ data, onDataChange }) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock loading profiles - in reality this would fetch from API
    setTimeout(() => {
      setProfiles([
        { id: '1', name: 'Software Engineer Profile', lastUpdated: '2024-01-15', completeness: 95 },
        { id: '2', name: 'Full Stack Developer', lastUpdated: '2024-01-10', completeness: 88 },
        { id: '3', name: 'Tech Lead Profile', lastUpdated: '2024-01-08', completeness: 92 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">
        Select the profile that best matches the job you're applying for. This will be used as the
        foundation for generating your tailored resume and cover letter.
      </p>

      {profiles.map((profile) => (
        <Card
          key={profile.id}
          className={`p-4 cursor-pointer transition-all border-2 ${
            data.selectedProfile === profile.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onDataChange({ selectedProfile: profile.id })}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{profile.name}</h3>
              <p className="text-sm text-gray-600">
                Last updated: {new Date(profile.lastUpdated).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {profile.completeness}% complete
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${profile.completeness}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}

      {profiles.length === 0 && (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No profiles found. Create a profile first to continue.</p>
          <Button className="mt-4">Create New Profile</Button>
        </div>
      )}
    </div>
  );
};

// Missing step components implementation
const BasicInfoStep: React.FC<WorkflowStepProps> = ({ data, onDataChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={data.fullName || ''}
            onChange={(e) => onDataChange({ fullName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={data.email || ''}
            onChange={(e) => onDataChange({ email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={data.phone || ''}
            onChange={(e) => onDataChange({ phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => onDataChange({ location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="City, State"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          LinkedIn Profile
        </label>
        <input
          type="url"
          value={data.linkedin || ''}
          onChange={(e) => onDataChange({ linkedin: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="https://linkedin.com/in/yourprofile"
        />
      </div>
    </div>
  );
};

const WorkExperienceStep: React.FC<WorkflowStepProps> = ({ data, onDataChange }) => {
  const experiences = data.experiences || [];

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: ['']
    };
    onDataChange({ experiences: [...experiences, newExp] });
  };

  const updateExperience = (id: number, updates: any) => {
    const updated = experiences.map((exp: any) =>
      exp.id === id ? { ...exp, ...updates } : exp
    );
    onDataChange({ experiences: updated });
  };

  const removeExperience = (id: number) => {
    const filtered = experiences.filter((exp: any) => exp.id !== id);
    onDataChange({ experiences: filtered });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Work Experience</h3>
        <Button onClick={addExperience} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No work experience added yet. Click "Add Experience" to get started.</p>
        </div>
      )}

      {experiences.map((exp: any, index: number) => (
        <Card key={exp.id} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium">Experience #{index + 1}</h4>
            <Button
              onClick={() => removeExperience(exp.id)}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Company Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Job Title"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={exp.current}
              />
              <label className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, {
                    current: e.target.checked,
                    endDate: e.target.checked ? '' : exp.endDate
                  })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Current position</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your role and responsibilities..."
            />
          </div>
        </Card>
      ))}
    </div>
  );
};

const EducationStep: React.FC<WorkflowStepProps> = ({ data, onDataChange }) => {
  const education = data.education || [];

  const addEducation = () => {
    const newEd = {
      id: Date.now(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: ''
    };
    onDataChange({ education: [...education, newEd] });
  };

  const updateEducation = (id: number, updates: any) => {
    const updated = education.map((ed: any) =>
      ed.id === id ? { ...ed, ...updates } : ed
    );
    onDataChange({ education: updated });
  };

  const removeEducation = (id: number) => {
    const filtered = education.filter((ed: any) => ed.id !== id);
    onDataChange({ education: filtered });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Education</h3>
        <Button onClick={addEducation} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {education.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No education added yet. Click "Add Education" to get started.</p>
        </div>
      )}

      {education.map((ed: any, index: number) => (
        <Card key={ed.id} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium">Education #{index + 1}</h4>
            <Button
              onClick={() => removeEducation(ed.id)}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Institution *
              </label>
              <input
                type="text"
                value={ed.institution}
                onChange={(e) => updateEducation(ed.id, { institution: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="University Name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degree *
                </label>
                <select
                  value={ed.degree}
                  onChange={(e) => updateEducation(ed.id, { degree: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select degree</option>
                  <option value="High School">High School Diploma</option>
                  <option value="Associate">Associate Degree</option>
                  <option value="Bachelor">Bachelor's Degree</option>
                  <option value="Master">Master's Degree</option>
                  <option value="Doctorate">Doctorate</option>
                  <option value="Certificate">Certificate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field of Study
                </label>
                <input
                  type="text"
                  value={ed.field}
                  onChange={(e) => updateEducation(ed.id, { field: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Computer Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="month"
                  value={ed.startDate}
                  onChange={(e) => updateEducation(ed.id, { startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="month"
                  value={ed.endDate}
                  onChange={(e) => updateEducation(ed.id, { endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GPA (optional)
                </label>
                <input
                  type="text"
                  value={ed.gpa}
                  onChange={(e) => updateEducation(ed.id, { gpa: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="3.8"
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

const SkillsStep: React.FC<WorkflowStepProps> = ({ data, onDataChange }) => {
  const skills = data.skills || { technical: [], soft: [], languages: [], certifications: [] };

  const addSkill = (category: string) => {
    const newSkills = { ...skills };
    newSkills[category] = [...(newSkills[category] || []), ''];
    onDataChange({ skills: newSkills });
  };

  const updateSkill = (category: string, index: number, value: string) => {
    const newSkills = { ...skills };
    newSkills[category][index] = value;
    onDataChange({ skills: newSkills });
  };

  const removeSkill = (category: string, index: number) => {
    const newSkills = { ...skills };
    newSkills[category].splice(index, 1);
    onDataChange({ skills: newSkills });
  };

  const SkillSection = ({ title, category, placeholder }: { title: string, category: string, placeholder: string }) => (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">{title}</h4>
        <Button onClick={() => addSkill(category)} variant="outline" size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {(skills[category] || []).map((skill: string, index: number) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={skill}
              onChange={(e) => updateSkill(category, index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder={placeholder}
            />
            <Button
              onClick={() => removeSkill(category, index)}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {(skills[category] || []).length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No {title.toLowerCase()} added yet.
          </p>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <SkillSection
        title="Technical Skills"
        category="technical"
        placeholder="e.g., JavaScript, Python, React"
      />
      <SkillSection
        title="Soft Skills"
        category="soft"
        placeholder="e.g., Leadership, Communication, Problem Solving"
      />
      <SkillSection
        title="Languages"
        category="languages"
        placeholder="e.g., English (Native), Spanish (Fluent)"
      />
      <SkillSection
        title="Certifications"
        category="certifications"
        placeholder="e.g., AWS Certified Developer, PMP"
      />
    </div>
  );
};

const SummaryStep: React.FC<WorkflowStepProps> = ({ data, onDataChange }) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Professional Summary</h3>
        <p className="text-blue-800 text-sm">
          Write a compelling 2-3 sentence summary that highlights your key strengths, experience, and career goals.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Summary *
        </label>
        <textarea
          value={data.summary || ''}
          onChange={(e) => onDataChange({ summary: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-vertical"
          placeholder="Experienced software engineer with 5+ years developing scalable web applications. Proven track record of leading cross-functional teams and delivering high-quality solutions. Passionate about leveraging technology to solve complex business problems."
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            Aim for 50-150 words that capture your professional identity.
          </p>
          <span className="text-xs text-gray-400">
            {data.summary ? data.summary.split(' ').length : 0} words
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Career Objective (optional)
        </label>
        <textarea
          value={data.objective || ''}
          onChange={(e) => onDataChange({ objective: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-vertical"
          placeholder="Seeking a senior software engineering role where I can apply my expertise in full-stack development to build innovative solutions..."
        />
      </div>
    </div>
  );
};

const CustomizationStep: React.FC<WorkflowStepProps> = ({ data, onDataChange }) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">AI Customization Suggestions</h3>
        <p className="text-blue-800 text-sm">
          Based on the job description, here are our AI-powered suggestions for optimizing your profile:
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Skills to Emphasize</h4>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Node.js', 'AWS'].map((skill) => (
              <span key={skill} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Keywords to Include</h4>
          <div className="flex flex-wrap gap-2">
            {['Agile', 'Scrum', 'DevOps', 'Microservices'].map((keyword) => (
              <span key={keyword} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.applyAiSuggestions ?? true}
            onChange={(e) => onDataChange({ applyAiSuggestions: e.target.checked })}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm text-gray-700">Apply AI suggestions automatically</span>
        </label>
      </div>
    </div>
  );
};

const TemplateSelectionStep: React.FC<WorkflowStepProps> = ({ data, onDataChange }) => {
  const templates = [
    { id: 'professional', name: 'Professional', preview: '/api/placeholder/200/250' },
    { id: 'modern', name: 'Modern', preview: '/api/placeholder/200/250' },
    { id: 'creative', name: 'Creative', preview: '/api/placeholder/200/250' },
  ];

  return (
    <div>
      <p className="text-gray-600 mb-6">
        Choose a template that matches the company culture and industry standards.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all border-2 ${
              data.selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onDataChange({ selectedTemplate: template.id })}
          >
            <div className="p-4">
              <div className="aspect-[4/5] bg-gray-100 rounded mb-3 overflow-hidden">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-center">{template.name}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ReviewStep: React.FC<WorkflowStepProps> = ({ data, onDataChange: _onDataChange }) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold text-green-900">Ready to Generate</h3>
        </div>
        <p className="text-green-800 text-sm">
          All required information has been collected. Review the summary below and click "Complete Workflow" to generate your documents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Job Details</h4>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="font-medium text-gray-700">Position:</dt>
              <dd className="text-gray-600">{data.jobDetails?.jobTitle}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Company:</dt>
              <dd className="text-gray-600">{data.jobDetails?.company}</dd>
            </div>
            {data.jobDetails?.deadline && (
              <div>
                <dt className="font-medium text-gray-700">Deadline:</dt>
                <dd className="text-gray-600">{new Date(data.jobDetails.deadline).toLocaleDateString()}</dd>
              </div>
            )}
          </dl>
        </Card>

        <Card className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Generation Settings</h4>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="font-medium text-gray-700">Profile:</dt>
              <dd className="text-gray-600">Software Engineer Profile</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Template:</dt>
              <dd className="text-gray-600 capitalize">{data.templateSelection?.selectedTemplate}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">AI Optimization:</dt>
              <dd className="text-gray-600">
                {data.customization?.applyAiSuggestions ? 'Enabled' : 'Disabled'}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
};

const CompletionStep: React.FC<WorkflowStepProps> = ({ data: _data, onDataChange: _onDataChange }) => {
  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-500" />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Documents Generated Successfully!</h3>
        <p className="text-gray-600">
          Your tailored resume and cover letter have been generated and are ready for download.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
        <Button className="flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Download Resume
        </Button>
        <Button variant="outline" className="flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Download Cover Letter
        </Button>
      </div>

      <div className="flex items-center justify-center gap-4 pt-4 border-t">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Preview
        </Button>
      </div>
    </div>
  );
};

// Analytics logging function
const logWorkflowCompletion = async (result: any) => {
  try {
    await fetch('/api/v1/analytics/workflow-completion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    });
  } catch (error) {
    console.error('Failed to log workflow completion:', error);
  }
};

export default WorkflowWizard;