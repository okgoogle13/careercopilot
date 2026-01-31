import { Button, Input, Textarea } from '@careercopilot/ui';
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

export function CoverLetterGenerator() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyValues, setCompanyValues] = useState('');
  const [instructions, setInstructions] = useState('');
  const [style, setStyle] = useState('professional');

  const [generatedLetter, setGeneratedLetter] = useState<string>('');

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

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
        highlightedWord="Genius"
        description="Create tailored, high-impact cover letters in seconds"
      />

      {/* Progress Stepper */}
      <div className="flex items-center justify-center mb-8 gap-4">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className="flex items-center"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
                step >= s
                  ? 'bg-primary text-on-primary shadow-elevation-1'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
            {s < 4 && (
              <div
                className={`w-12 h-1 mx-2 rounded-full ${
                  step > s ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-surface-container rounded-leaf p-8 border border-outline-variant shadow-elevation-1 relative overflow-hidden">
        {/* Step 1: Job Details */}
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-primary w-6 h-6" />
              <h2 className="text-title-large font-bold text-on-surface">Job Details</h2>
            </div>

            <div>
              <label className="block text-on-surface mb-3 text-label-large font-bold">
                Paste Job Description
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="bg-surface-container-high border-outline-variant text-on-surface rounded-tech resize-none h-64 focus:ring-primary focus:border-primary font-body text-body-medium"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                disabled={!jobDescription.trim()}
                className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary rounded-pebble px-8 h-12 flex items-center gap-2 font-bold transition-all shadow-sm"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Company Info */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
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
                className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary rounded-pebble px-8 h-12 flex items-center gap-2 font-bold"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Customization */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
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
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`p-4 rounded-tech border-2 capitalize font-bold transition-all ${
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
                  placeholder="e.g. Emphasize my leadership experience, keep it under 300 words..."
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
                onClick={handleGenerate}
                disabled={loading}
                className="bg-tertiary-container text-on-tertiary-container hover:bg-tertiary hover:text-on-tertiary rounded-pebble px-8 h-12 flex items-center gap-2 font-bold shadow-elevation-1"
              >
                <Sparkles className="w-5 h-5" />
                {loading ? 'Generating...' : 'Generate Letter'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Result */}
        {step === 4 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
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
              className="bg-surface-container-low rounded-tech p-8 text-on-surface whitespace-pre-wrap border border-outline-variant shadow-inner font-serif text-body-large leading-relaxed max-h-[600px] overflow-y-auto"
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
                className="bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary"
              >
                <Copy className="w-4 h-4 mr-2" /> Copy Text
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
