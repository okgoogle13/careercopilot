import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, ProgressBar, Modal } from '../components/ui';
import { CheckCircle, ArrowRight, ArrowLeft, Upload, Target, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<{ onNext: () => void; onComplete: (data: any) => void }>;
}

const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [onboardingData, setOnboardingData] = useState<any>({});
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to CareerCopilot',
      description: 'Your AI-powered career companion',
      icon: Sparkles,
      component: WelcomeStep,
    },
    {
      id: 'profile-setup',
      title: 'Set Up Your Profile',
      description: 'Tell us about your professional background',
      icon: Target,
      component: ProfileSetupStep,
    },
    {
      id: 'document-upload',
      title: 'Upload Your Resume',
      description: 'Let our AI analyze your existing resume',
      icon: Upload,
      component: DocumentUploadStep,
    },
    {
      id: 'preferences',
      title: 'Customize Your Experience',
      description: 'Set your preferences and goals',
      icon: CheckCircle,
      component: PreferencesStep,
    },
  ];

  useEffect(() => {
    // Check if user has already completed onboarding
    const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${user?.uid}`);
    if (hasCompletedOnboarding) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = (stepId: string, data: any) => {
    setCompletedSteps(prev => new Set(prev).add(stepId));
    setOnboardingData(prev => ({ ...prev, [stepId]: data }));
    handleNext();
  };

  const completeOnboarding = async () => {
    try {
      // Save onboarding completion
      localStorage.setItem(`onboarding_completed_${user?.uid}`, 'true');

      // Save onboarding data to backend
      if (Object.keys(onboardingData).length > 0) {
        await fetch('/api/v1/users/onboarding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user?.getIdToken()}`,
          },
          body: JSON.stringify(onboardingData),
        });
      }

      toast.success('Welcome to CareerCopilot! Let\'s get started.');
      navigate('/');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to save your preferences, but you can continue using the app.');
      navigate('/');
    }
  };

  const handleSkipOnboarding = () => {
    setShowSkipConfirmation(true);
  };

  const confirmSkip = () => {
    localStorage.setItem(`onboarding_completed_${user?.uid}`, 'true');
    navigate('/');
    toast('You can always set up your profile later in Settings.');
  };

  const currentStepData = steps[currentStep];
  const StepComponent = currentStepData.component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">CareerCopilot</h1>
          </div>
          <p className="text-lg text-gray-600">Let's get you set up for career success</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
          </div>
          <ProgressBar value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = index === currentStep;
            const isPast = index < currentStep;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isCurrent
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : isPast
                        ? 'bg-gray-300 border-gray-300 text-gray-600'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className="text-xs text-gray-600 mt-2 text-center max-w-20">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-colors ${
                      isPast || isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Main Content */}
        <Card className="p-8 bg-white shadow-xl">
          <div className="text-center mb-6">
            <currentStepData.icon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
            <p className="text-gray-600">{currentStepData.description}</p>
          </div>

          <StepComponent
            onNext={handleNext}
            onComplete={(data) => handleStepComplete(currentStepData.id, data)}
          />

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={handleSkipOnboarding}
                className="text-gray-500"
              >
                Skip for now
              </Button>
            </div>

            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
              disabled={currentStep === steps.length - 1}
            >
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Skip Confirmation Modal */}
        <Modal isOpen={showSkipConfirmation} onClose={() => setShowSkipConfirmation(false)}>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Skip Onboarding?</h3>
            <p className="text-gray-600 mb-6">
              You can always set up your profile and preferences later, but completing the setup now will give you a better experience.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowSkipConfirmation(false)}>
                Continue Setup
              </Button>
              <Button onClick={confirmSkip}>
                Skip for Now
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

// Individual Step Components
const WelcomeStep: React.FC<{ onNext: () => void; onComplete: (data: any) => void }> = ({
  _onNext,
  onComplete,
}) => {
  return (
    <div className="text-center py-8">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Transform Your Job Search with AI
        </h3>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium mb-2">Smart Profile Building</h4>
            <p className="text-sm text-gray-600">
              Create tailored profiles for different roles
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium mb-2">AI-Powered Analysis</h4>
            <p className="text-sm text-gray-600">
              Get ATS scores and optimization suggestions
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium mb-2">Document Generation</h4>
            <p className="text-sm text-gray-600">
              Generate resumes, cover letters, and KSC responses
            </p>
          </div>
        </div>
        <Button onClick={() => onComplete({ welcomed: true })} size="lg" className="px-8">
          Let's Get Started
        </Button>
      </div>
    </div>
  );
};

const ProfileSetupStep: React.FC<{ onNext: () => void; onComplete: (data: any) => void }> = ({
  onComplete,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    targetRoles: [] as string[],
    experience: 'entry' as 'entry' | 'mid' | 'senior' | 'executive',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const roleOptions = [
    'Software Engineer',
    'Data Analyst',
    'Product Manager',
    'Marketing Specialist',
    'Sales Representative',
    'Community Services Worker',
    'Healthcare Professional',
    'Other',
  ];

  const toggleRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="City, State/Country"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Experience Level
        </label>
        <select
          value={formData.experience}
          onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value as any }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="entry">Entry Level (0-2 years)</option>
          <option value="mid">Mid Level (3-5 years)</option>
          <option value="senior">Senior Level (6-10 years)</option>
          <option value="executive">Executive Level (10+ years)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Roles (select all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {roleOptions.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => toggleRole(role)}
              className={`text-sm px-3 py-2 rounded-lg border transition-colors ${
                formData.targetRoles.includes(role)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={!formData.fullName || !formData.email}
          className="w-full"
        >
          Continue to Document Upload
        </Button>
      </div>
    </form>
  );
};

const DocumentUploadStep: React.FC<{ onNext: () => void; onComplete: (data: any) => void }> = ({
  onComplete,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    // Allow skipping after 10 seconds
    const timer = setTimeout(() => setCanSkip(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadedFile(file);
      toast.success('Resume uploaded successfully!');
      onComplete({ uploadedFile: file.name, hasResume: true });
    } catch {
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    onComplete({ hasResume: false });
  };

  return (
    <div className="text-center">
      {!uploadedFile ? (
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Upload Your Current Resume
            </p>
            <p className="text-gray-600 mb-4">
              Our AI will analyze your resume and help optimize it for better results
            </p>
            <div className="space-y-3">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
                id="resume-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="resume-upload"
                className={`inline-flex items-center px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors ${
                  isUploading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </label>
              <p className="text-xs text-gray-500">
                Supports PDF, DOC, and DOCX files up to 10MB
              </p>
            </div>
          </div>

          {canSkip && (
            <div className="pt-4">
              <p className="text-gray-600 mb-3">
                Don't have a resume ready? No problem!
              </p>
              <Button variant="outline" onClick={handleSkip}>
                Skip and Create Profile Manually
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-900">Resume Uploaded!</h3>
          <p className="text-gray-600">
            Your resume "{uploadedFile.name}" has been uploaded and analyzed.
          </p>
          <Button onClick={() => onComplete({ uploadedFile: uploadedFile.name, hasResume: true })}>
            Continue to Preferences
          </Button>
        </div>
      )}
    </div>
  );
};

const PreferencesStep: React.FC<{ onNext: () => void; onComplete: (data: any) => void }> = ({
  onComplete,
}) => {
  const [preferences, setPreferences] = useState({
    theme: 'professional',
    notifications: true,
    autoSave: true,
    jobAlerts: true,
    industries: [] as string[],
  });

  const themes = [
    { id: 'professional', name: 'Professional', description: 'Clean and traditional' },
    { id: 'modern', name: 'Modern', description: 'Contemporary design' },
    { id: 'creative', name: 'Creative', description: 'Bold and expressive' },
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Marketing',
    'Sales',
    'Community Services',
    'Non-profit',
  ];

  const toggleIndustry = (industry: string) => {
    setPreferences(prev => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter(i => i !== industry)
        : [...prev.industries, industry],
    }));
  };

  const handleComplete = () => {
    onComplete(preferences);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Your Theme</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setPreferences(prev => ({ ...prev, theme: theme.id }))}
              className={`p-4 border rounded-lg text-left transition-colors ${
                preferences.theme === theme.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">{theme.name}</div>
              <div className="text-sm text-gray-600">{theme.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Industries of Interest</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {industries.map((industry) => (
            <button
              key={industry}
              onClick={() => toggleIndustry(industry)}
              className={`text-sm px-3 py-2 rounded-lg border transition-colors ${
                preferences.industries.includes(industry)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          {[
            { key: 'notifications', label: 'Email notifications', description: 'Get updates about your applications' },
            { key: 'autoSave', label: 'Auto-save documents', description: 'Automatically save your work' },
            { key: 'jobAlerts', label: 'Job opportunity alerts', description: 'Get notified about new job matches' },
          ].map((item) => (
            <label key={item.key} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences[item.key as keyof typeof preferences] as boolean}
                onChange={(e) => setPreferences(prev => ({ ...prev, [item.key]: e.target.checked }))}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">{item.label}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleComplete} className="w-full">
          Complete Setup
        </Button>
      </div>
    </div>
  );
};

export default OnboardingPage;
