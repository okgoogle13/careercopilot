import React, { useState } from 'react';
import { EnhancedInput } from './ui/enhanced-input';
import { DatePicker, DateRangePicker } from './ui/date-picker';
import { TimePicker } from './ui/time-picker';
import { Autocomplete, AutocompleteOption } from './ui/autocomplete';
import { TagInput } from './ui/tag-input';
import { FileUpload, FileUploadFile } from './ui/file-upload';
import { PhoneInput } from './ui/phone-input';
import { RangeSlider } from './ui/range-slider';
import { Pagination } from './ui/aurora-pagination';
import { Stepper, Step } from './ui/stepper';
import { ToastProvider, useToast } from './ui/aurora-toast';
import { ConfirmationDialog } from './ui/confirmation-dialog';
import { BottomSheet } from './ui/bottom-sheet';
import { ShimmerSkeleton, SkeletonCard, SkeletonListItem } from './ui/shimmer-skeleton';
import { EmptyState } from './ui/empty-state';
import { ErrorState } from './ui/error-state';
import {
  User,
  Mail,
  CreditCard,
  FileText,
  Search,
  FolderOpen,
  RefreshCw,
  Inbox,
  CheckCircle2,
} from 'lucide-react';

const ShowcaseSection: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="mb-12">
    <h2 className="text-2xl text-[var(--on-surface)] mb-2">{title}</h2>
    {description && <p className="text-[var(--on-surface-variant)] mb-6">{description}</p>}
    <div className="space-y-6">{children}</div>
  </div>
);

const DemoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border-2 border-[var(--glass-border)]">
    <h3 className="text-lg text-[var(--on-surface)] mb-4">{title}</h3>
    {children}
  </div>
);

const ShowcaseContent: React.FC = () => {
  const { addToast } = useToast();

  // Form Component States
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [date, setDate] = useState<Date>();
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();
  const [time, setTime] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [tags, setTags] = useState<string[]>(['React', 'TypeScript']);
  const [files, setFiles] = useState<FileUploadFile[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([20, 80]);

  // Autocomplete
  const countries: AutocompleteOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
  ];

  // Navigation States
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const steps: Step[] = [
    {
      label: 'Personal Info',
      description: 'Enter your details',
      icon: <User className="w-5 h-5" />,
    },
    { label: 'Contact', description: 'How to reach you', icon: <Mail className="w-5 h-5" /> },
    { label: 'Payment', description: 'Payment details', icon: <CreditCard className="w-5 h-5" /> },
    {
      label: 'Review',
      description: 'Confirm submission',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
  ];

  const handleEmailBlur = () => {
    if (email && !email.includes('@')) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const showToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: { title: 'Success!', description: 'Your action completed successfully.' },
      error: { title: 'Error!', description: 'Something went wrong. Please try again.' },
      warning: { title: 'Warning!', description: 'Please review this carefully.' },
      info: { title: 'Info', description: 'Here is some information you should know.' },
    };

    addToast({ type, ...messages[type] });
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl mb-4 bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)] bg-clip-text text-transparent">
            Aurora UI Components
          </h1>
          <p className="text-xl text-[var(--on-surface-variant)]">
            Complete Material 3 component library with glass morphism and Aurora theme
          </p>
        </div>

        {/* Batch 1: Complex Form Components */}
        <ShowcaseSection
          title="Batch 1: Complex Form Components"
          description="Advanced input components with Material 3 styling and Aurora effects"
        >
          <DemoCard title="Enhanced Input (Floating Label)">
            <div className="space-y-4">
              <EnhancedInput
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                error={emailError}
                helperText="We'll never share your email"
              />
              <EnhancedInput label="Password" type="password" placeholder="" />
              <EnhancedInput label="Disabled Input" value="Cannot edit this" disabled />
            </div>
          </DemoCard>

          <DemoCard title="Date Pickers">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--on-surface-variant)] mb-2">
                  Single Date
                </label>
                <DatePicker value={date} onChange={setDate} placeholder="Select a date" />
              </div>
              <div>
                <label className="block text-sm text-[var(--on-surface-variant)] mb-2">
                  Date Range
                </label>
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  placeholder="Select date range"
                />
              </div>
            </div>
          </DemoCard>

          <DemoCard title="Time Picker">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--on-surface-variant)] mb-2">
                  12-Hour Format
                </label>
                <TimePicker value={time} onChange={setTime} use24Hour={false} />
              </div>
              <div>
                <label className="block text-sm text-[var(--on-surface-variant)] mb-2">
                  24-Hour Format
                </label>
                <TimePicker value={time} onChange={setTime} use24Hour={true} />
              </div>
            </div>
          </DemoCard>

          <DemoCard title="Autocomplete">
            <Autocomplete
              options={countries}
              value={selectedCountry}
              onChange={setSelectedCountry}
              placeholder="Search countries..."
            />
          </DemoCard>

          <DemoCard title="Tag Input">
            <TagInput
              value={tags}
              onChange={setTags}
              placeholder="Type and press Enter..."
              maxTags={10}
            />
          </DemoCard>

          <DemoCard title="File Upload">
            <FileUpload
              value={files}
              onChange={setFiles}
              accept="image/*,.pdf,.doc,.docx"
              maxSize={5 * 1024 * 1024}
              maxFiles={5}
              multiple
            />
          </DemoCard>

          <DemoCard title="Phone Input">
            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              defaultCountry="US"
              placeholder="Enter phone number"
            />
          </DemoCard>

          <DemoCard title="Range Slider">
            <RangeSlider
              min={0}
              max={100}
              step={5}
              value={priceRange}
              onChange={setPriceRange}
              showLabels
              formatLabel={(v) => `$${v}`}
            />
          </DemoCard>
        </ShowcaseSection>

        {/* Batch 2: Navigation & Display Components */}
        <ShowcaseSection
          title="Batch 2: Navigation & Display Components"
          description="Navigation patterns and UI feedback components"
        >
          <DemoCard title="Pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={15}
              onPageChange={setCurrentPage}
              maxVisiblePages={7}
            />
          </DemoCard>

          <DemoCard title="Stepper / Wizard (Horizontal)">
            <div className="space-y-6">
              <Stepper
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
                clickableSteps
                orientation="horizontal"
              />
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="px-4 py-2 rounded-[var(--radius-lg)] bg-[var(--glass-bg)] border-2 border-[var(--glass-border)] text-[var(--on-surface)] disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  disabled={currentStep === steps.length - 1}
                  className="px-4 py-2 rounded-[var(--radius-lg)] bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)] text-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </DemoCard>

          <DemoCard title="Stepper / Wizard (Vertical)">
            <Stepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
              clickableSteps
              orientation="vertical"
            />
          </DemoCard>

          <DemoCard title="Toast Notifications">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => showToast('success')}
                className="px-4 py-2 rounded-[var(--radius-lg)] bg-green-500/20 border-2 border-green-500/30 text-green-500 hover:bg-green-500/30"
              >
                Success Toast
              </button>
              <button
                onClick={() => showToast('error')}
                className="px-4 py-2 rounded-[var(--radius-lg)] bg-red-500/20 border-2 border-red-500/30 text-red-500 hover:bg-red-500/30"
              >
                Error Toast
              </button>
              <button
                onClick={() => showToast('warning')}
                className="px-4 py-2 rounded-[var(--radius-lg)] bg-yellow-500/20 border-2 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/30"
              >
                Warning Toast
              </button>
              <button
                onClick={() => showToast('info')}
                className="px-4 py-2 rounded-[var(--radius-lg)] bg-[var(--primary)]/20 border-2 border-[var(--primary)]/30 text-[var(--primary)] hover:bg-[var(--primary)]/30"
              >
                Info Toast
              </button>
            </div>
          </DemoCard>

          <DemoCard title="Confirmation Dialog">
            <div className="space-y-3">
              <button
                onClick={() => setShowConfirmDialog(true)}
                className="px-4 py-2 rounded-[var(--radius-lg)] bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)] text-white"
              >
                Show Confirmation Dialog
              </button>

              <ConfirmationDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                title="Confirm Action"
                description="Are you sure you want to proceed with this action? This cannot be undone."
                confirmLabel="Confirm"
                cancelLabel="Cancel"
                onConfirm={() => {
                  addToast({
                    type: 'success',
                    title: 'Confirmed!',
                    description: 'Action completed successfully.',
                  });
                }}
                variant="default"
              />
            </div>
          </DemoCard>

          <DemoCard title="Bottom Sheet (Mobile Modal)">
            <button
              onClick={() => setShowBottomSheet(true)}
              className="px-4 py-2 rounded-[var(--radius-lg)] bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)] text-white"
            >
              Show Bottom Sheet
            </button>

            <BottomSheet
              open={showBottomSheet}
              onOpenChange={setShowBottomSheet}
              title="Bottom Sheet Title"
              description="This is a mobile-first modal component"
              showHandle
            >
              <div className="p-6 space-y-4">
                <p className="text-[var(--on-surface-variant)]">
                  Bottom sheets are great for mobile interfaces. You can drag them up and down, or
                  swipe down to dismiss.
                </p>
                <button
                  onClick={() => setShowBottomSheet(false)}
                  className="w-full px-4 py-2 rounded-[var(--radius-lg)] bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)] text-white"
                >
                  Close
                </button>
              </div>
            </BottomSheet>
          </DemoCard>
        </ShowcaseSection>

        {/* Batch 3: Reusable Page Patterns */}
        <ShowcaseSection
          title="Batch 3: Reusable Page Patterns"
          description="Common page states and loading patterns"
        >
          <DemoCard title="Shimmer Skeletons">
            <div className="space-y-4">
              <button
                onClick={() => setShowLoading(!showLoading)}
                className="px-4 py-2 rounded-[var(--radius-lg)] bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)] text-white"
              >
                {showLoading ? 'Hide' : 'Show'} Loading State
              </button>

              {showLoading ? (
                <div className="space-y-4">
                  <SkeletonCard />
                  <SkeletonListItem />
                  <SkeletonListItem />
                  <div className="grid grid-cols-3 gap-4">
                    <ShimmerSkeleton variant="circular" width={80} height={80} />
                    <ShimmerSkeleton variant="rectangular" height={80} />
                    <ShimmerSkeleton variant="text" lines={4} />
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--surface-container)] border-2 border-[var(--glass-border)]">
                  <p className="text-[var(--on-surface-variant)]">Actual content loaded</p>
                </div>
              )}
            </div>
          </DemoCard>

          <DemoCard title="Empty State">
            <EmptyState
              icon={Inbox}
              title="No Documents Found"
              description="You haven't created any documents yet. Get started by creating your first document."
              action={{
                label: 'Create Document',
                onClick: () =>
                  addToast({
                    type: 'info',
                    title: 'Action Clicked',
                    description: 'Create document clicked',
                  }),
              }}
              secondaryAction={{
                label: 'Learn More',
                onClick: () =>
                  addToast({
                    type: 'info',
                    title: 'Action Clicked',
                    description: 'Learn more clicked',
                  }),
              }}
            />
          </DemoCard>

          <DemoCard title="Error State">
            <ErrorState
              title="Failed to Load Data"
              message="We couldn't load your data. This might be due to a network issue or server error."
              error={new Error('Network request failed')}
              showDetails
              onRetry={() =>
                addToast({
                  type: 'info',
                  title: 'Retrying...',
                  description: 'Attempting to reload data',
                })
              }
              onGoHome={() =>
                addToast({
                  type: 'info',
                  title: 'Going Home',
                  description: 'Redirecting to home page',
                })
              }
            />
          </DemoCard>
        </ShowcaseSection>
      </div>
    </div>
  );
};

export const NewComponentsShowcase: React.FC = () => {
  return (
    <ToastProvider>
      <ShowcaseContent />
    </ToastProvider>
  );
};
