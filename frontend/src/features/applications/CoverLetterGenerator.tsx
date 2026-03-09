import { Button, Input, Textarea } from '@careercopilot/ui';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Building,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  RefreshCw,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/shared/PageHeader';
import { api } from '../../services/api';
import { genkitApi } from '../../services/genkit';
import { exportToPdf } from '../../utils/exportEngine';

const stepMotionProps = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.22, ease: 'easeOut' as const },
};

export function CoverLetterGenerator() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [jobUrl, setJobUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyValues, setCompanyValues] = useState('');
  const [instructions, setInstructions] = useState('');
  const [style, setStyle] = useState('professional');

  const [generatedLetter, setGeneratedLetter] = useState<string>('');

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleAnalyzeUrl = async () => {
    if (!jobUrl) return;
    setIsAnalyzing(true);
    try {
      const result = await genkitApi.analyzeJobFromUrl({ url: jobUrl });

      if (result.analysis_success) {
        setJobDescription(
          result.job_details.full_description || result.job_details.key_responsibilities.join('\n')
        );

        if (result.job_details.company_name) {
          setCompanyName(result.job_details.company_name);
        }

        if (result.company_context?.core_values?.length) {
          setCompanyValues(result.company_context.core_values.join(', '));
        }

        toast.success('Job details extracted successfully!');
      } else {
        toast.error('Could not extract details from this URL.');
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to analyze URL. Please check the link.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const userProfile = await api.getUserProfile();

      // Combine static profile with dynamic form data
      const requestData = {
        candidate_profile: userProfile,
        job_description: jobDescription,
        company_info: {
          name: companyName,
          values: companyValues,
        },
        style: style,
        special_instructions: instructions,
      };

      const result = await genkitApi.generateCoverLetter(requestData);

      setGeneratedLetter(result.letter_content);
      setStep(4);
      toast.success('Cover Letter generated successfully!');
    } catch (error) {
      console.error('Cover Letter Generation Error:', error);
      toast.error('Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      await exportToPdf('cover-letter-content', 'Cover_Letter.pdf');
      toast.success('Cover Letter downloaded as PDF!');
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    }
  };

  const resetForm = () => {
    setJobDescription('');
    setCompanyName('');
    setCompanyValues('');
    setInstructions('');
    setGeneratedLetter('');
    setStep(1);
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500 ease-spring">
      <PageHeader
        title="Cover Letter Generator"
        highlightedWord="Workbench"
        description="Create role-specific cover letters with clear, guided steps."
      />

      {/* Progress Stepper */}
      <div className="flex items-center justify-center mb-8 gap-4">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className="flex items-center"
          >
            <div
              className={`w-10 h-10 rounded-march flex items-center justify-center font-bold text-lg transition-colors ${
                step >= s
                  ? 'bg-primary text-on-primary shadow-elevation-1'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
            {s < 4 && (
              <div
                className={`w-12 h-1 mx-2 rounded-march ${
                  step > s ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="mb-6 text-center text-label-small font-mono uppercase tracking-wider text-on-surface-variant">
        Step {step} of 4 · Estimated time: {step < 4 ? '2–4 min' : 'Complete'}
      </p>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 210, damping: 24 }}
        className="bg-surface-container rounded-placard p-8 border border-outline-variant shadow-elevation-1 relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {/* Step 1: Job Details */}
          {step === 1 && (
            <motion.div
              key="step-1"
              {...stepMotionProps}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-primary w-6 h-6" />
                <h2 className="text-title-large font-bold text-on-surface">Job Details</h2>
              </div>

              {/* URL Import Section */}
              <div className="p-4 bg-secondary-container/20 rounded-megaphone border border-secondary-container">
                <label className="block text-on-surface mb-2 text-label-large font-bold">
                  Import from URL (Optional)
                </label>
                <div className="flex gap-2">
                  <Input
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="Paste a job listing URL (LinkedIn, Seek, Indeed)..."
                    className="bg-surface"
                  />
                  <Button
                    onClick={handleAnalyzeUrl}
                    disabled={!jobUrl || isAnalyzing}
                    className="bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary whitespace-nowrap"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Scanning...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" /> Extract Details
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-body-small text-on-surface-variant mt-2">
                  Scanning a URL will automatically fill the job description and company details
                  below.
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-outline-variant" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-surface px-2 text-on-surface-variant">Or enter manually</span>
                </div>
              </div>

              <div>
                <label className="block text-on-surface mb-3 text-label-large font-bold">
                  Paste Job Description
                </label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="bg-surface-container-high border-outline-variant text-on-surface rounded-scaffold resize-none h-64 focus:ring-primary focus:border-primary font-body text-body-medium"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={!jobDescription.trim()}
                  className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary rounded-strike px-8 h-12 flex items-center gap-2 font-bold transition-all shadow-sm"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Company Info */}
          {step === 2 && (
            <motion.div
              key="step-2"
              {...stepMotionProps}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <Building className="text-secondary w-6 h-6" />
                <h2 className="text-title-large font-bold text-on-surface">Company Insights</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-on-surface mb-2 text-label-large font-bold">
                    Company Name
                  </label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="bg-surface-container-high"
                  />
                </div>

                <div>
                  <label className="block text-on-surface mb-2 text-label-large font-bold">
                    Company Values / Culture (Optional)
                  </label>
                  <Textarea
                    value={companyValues}
                    onChange={(e) => setCompanyValues(e.target.value)}
                    placeholder="e.g. Innovation, Sustainability, Customer Obsession..."
                    className="bg-surface-container-high border-outline-variant h-32"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  onClick={handleBack}
                  variant="text"
                  className="text-on-surface-variant hover:text-on-surface"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!companyName.trim()}
                  className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary rounded-strike px-8 h-12 flex items-center gap-2 font-bold"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Customization */}
          {step === 3 && (
            <motion.div
              key="step-3"
              {...stepMotionProps}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <Settings className="text-tertiary w-6 h-6" />
                <h2 className="text-title-large font-bold text-on-surface">Final Touches</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-on-surface mb-3 text-label-large font-bold">
                    Tone & Style
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['professional', 'bold', 'creative'].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setStyle(s)}
                        aria-pressed={style === s}
                        className={`p-4 rounded-scaffold border-2 capitalize font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sys-color-inkGold-base)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sys-color-charcoalBackground-base)] ${
                          style === s
                            ? 'border-primary bg-primary-container text-on-primary-container'
                            : 'border-outline-variant hover:border-outline'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-on-surface mb-2 text-label-large font-bold">
                    Special Instructions (Optional)
                  </label>
                  <Textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Emphasize stakeholder engagement and keep under 300 words."
                    className="bg-surface-container-high border-outline-variant h-32 rounded-scaffold"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  onClick={handleBack}
                  variant="text"
                  className="text-on-surface-variant hover:text-on-surface"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="bg-tertiary-container text-on-tertiary-container hover:bg-tertiary hover:text-on-tertiary rounded-strike px-8 h-12 flex items-center gap-2 font-bold shadow-elevation-1"
                >
                  <Sparkles className="w-5 h-5" />
                  {loading ? 'Generating...' : 'Generate Cover Letter'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Result */}
          {step === 4 && (
            <motion.div
              key="step-4"
              {...stepMotionProps}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-title-large font-bold text-on-surface flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-tertiary" /> Your Cover Letter
                </h2>
                <div className="flex gap-2">
                  <Button
                    onClick={resetForm}
                    variant="text"
                    className="text-on-surface-variant hover:text-error"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> New
                  </Button>
                </div>
              </div>

              <div
                id="cover-letter-content"
                aria-live="polite"
                className="bg-surface-container-low rounded-megaphone p-8 text-on-surface whitespace-pre-wrap border border-outline-variant shadow-inner font-serif text-body-large leading-relaxed max-h-[600px] overflow-y-auto"
              >
                {generatedLetter}
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  onClick={handleDownloadPdf}
                  variant="outlined"
                  className="border-tertiary text-tertiary hover:bg-tertiary hover:text-on-tertiary"
                >
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLetter);
                    toast.success('Copied to clipboard');
                  }}
                  aria-label="Copy generated cover letter text"
                  className="bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary"
                >
                  <Copy className="w-4 h-4 mr-2" /> Copy Text
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
