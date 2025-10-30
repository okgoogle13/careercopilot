import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Stepper } from '../ui/stepper';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { FileUpload } from '../ui/file-upload';
import {
  CheckCircle2,
  Upload,
  FileText,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  ArrowRight,
  Flag,
} from 'lucide-react';
import { useProfileCompletion } from '../../hooks/useProfileCompletion';

export interface OnboardingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
  skipAllowed?: boolean;
}

export function OnboardingWizard({
  open,
  onOpenChange,
  onComplete,
  skipAllowed = true,
}: OnboardingWizardProps) {
  const {
    profile,
    onboardingStatus,
    isLoading,
    completionPercentage,
    updateProfile,
    completeOnboardingStep,
    skipOnboarding,
    completeOnboarding,
  } = useProfileCompletion();

  const [formData, setFormData] = useState({
    fullName: profile?.personalInfo?.fullName || '',
    email: profile?.email || '',
    phone: profile?.personalInfo?.phone || '',
    summary: profile?.professionalSummary || '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = [
    { label: 'Welcome', description: 'Get started with CareerCopilot' },
    { label: 'Upload', description: 'Import your resume' },
    { label: 'Review', description: 'Review your profile' },
    { label: 'Complete', description: 'All set!' },
  ];

  const currentStepIndex = steps.findIndex(
    (s) => s.label.toLowerCase() === onboardingStatus.currentStep.replace('welcome', 'Welcome').replace('upload', 'Upload').replace('review', 'Review').replace('complete', 'Complete')
  );

  const handleNext = async () => {
    await completeOnboardingStep(onboardingStatus.currentStep);
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        summary: `Experienced professional with a proven track record of delivering results. Strong background in ${formData.fullName ? 'your field' : 'various industries'} with expertise in key areas. Passionate about continuous learning and innovation.`,
      }));
      setIsGenerating(false);
    }, 1500);
  };

  const handleSaveProfile = async () => {
    if (profile) {
      await updateProfile({
        ...profile,
        personalInfo: {
          ...profile.personalInfo,
          fullName: formData.fullName,
          phone: formData.phone,
        },
        email: formData.email,
        professionalSummary: formData.summary,
      });
    }
    await handleNext();
  };

  const handleComplete = async () => {
    await completeOnboarding();
    onComplete?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Welcome to CareerCopilot</DialogTitle>
          <DialogDescription>
            Let's set up your profile to get started
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Profile Setup Progress</span>
            <span className="text-sm text-muted-foreground">
              {completionPercentage}%
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Stepper */}
        <div className="mt-6 mb-6">
          <Stepper
            steps={steps}
            currentStep={Math.max(0, currentStepIndex)}
            orientation="horizontal"
          />
        </div>

        {/* Step 1: Welcome */}
        {onboardingStatus.currentStep === 'welcome' && (
          <div className="space-y-6">
            <Card className="p-8 text-center space-y-4 bg-gradient-to-br from-primary/10 to-tertiary/10 border-primary/20">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Welcome to CareerCopilot! 🚀
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your AI-powered career assistant is ready to help you land your dream job. Let's set up your profile in just a few steps.
                </p>
                <ul className="space-y-2 text-sm text-left max-w-sm mx-auto">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <span>AI-optimized resumes and cover letters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <span>Job application tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <span>ATS optimization tips</span>
                  </li>
                </ul>
              </div>
            </Card>

            <div className="text-center text-xs text-muted-foreground">
              This should take about 5-10 minutes
            </div>
          </div>
        )}

        {/* Step 2: Upload */}
        {onboardingStatus.currentStep === 'upload' && (
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Upload Your Resume</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll extract your information to populate your profile
                  </p>
                </div>
              </div>

              <FileUpload
                accept=".pdf,.doc,.docx"
                multiple={true}
                onFilesSelected={(files) => setUploadedFiles(files)}
                maxSize={10 * 1024 * 1024} // 10MB
              />

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected Files:</p>
                  {uploadedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg"
                    >
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <p className="text-xs text-muted-foreground text-center">
              Don't have a resume handy? You can skip this and manually enter your information.
            </p>
          </div>
        )}

        {/* Step 3: Review & Edit */}
        {onboardingStatus.currentStep === 'review' && (
          <div className="space-y-6">
            {/* Personal Info */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Personal Information</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Full Name *
                  </label>
                  <Input
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">
                    Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">
                    Phone *
                  </label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </Card>

            {/* Professional Summary */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Professional Summary</h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateSummary}
                  disabled={isGenerating}
                  className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </div>

              <Textarea
                placeholder="Tell us about your professional background..."
                value={formData.summary}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    summary: e.target.value,
                  }))
                }
                className="min-h-24"
              />
            </Card>
          </div>
        )}

        {/* Step 4: Complete */}
        {onboardingStatus.currentStep === 'complete' && (
          <div className="space-y-6">
            <Card className="p-8 text-center space-y-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-green-200 dark:border-green-800">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  You're All Set! 🎉
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your profile is ready to go. Start creating AI-powered resumes and tracking your job applications.
                </p>
              </div>

              {/* What's Next */}
              <div className="pt-4 space-y-3 text-left">
                <h4 className="font-semibold text-sm">Next Steps:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-3">
                    <Flag className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Create your first AI-optimized resume</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Flag className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Start tracking job applications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Flag className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Get ATS optimization tips</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        )}

        {/* Footer */}
        <DialogFooter className="mt-6 flex gap-2">
          {onboardingStatus.currentStep !== 'welcome' && (
            <Button
              variant="outline"
              onClick={() => {
                // Go to previous step
                const stepOrder = ['welcome', 'upload', 'review', 'complete'];
                const currentIndex = stepOrder.indexOf(
                  onboardingStatus.currentStep
                );
                if (currentIndex > 0) {
                  completeOnboardingStep(
                    stepOrder[currentIndex - 1] as any
                  );
                }
              }}
            >
              Back
            </Button>
          )}

          {skipAllowed &&
            onboardingStatus.currentStep !== 'complete' && (
              <Button variant="ghost" onClick={skipOnboarding}>
                Skip
              </Button>
            )}

          {onboardingStatus.currentStep === 'complete' ? (
            <Button onClick={handleComplete} className="ml-auto">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          ) : onboardingStatus.currentStep === 'review' ? (
            <Button
              onClick={handleSaveProfile}
              disabled={!formData.fullName || !formData.email || !formData.phone}
              className="ml-auto"
            >
              Save & Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleNext} className="ml-auto">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
