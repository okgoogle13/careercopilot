import { Button, Input, Textarea } from '@careercopilot/ui';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  Download,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../../components/shared/PageHeader';
import { api } from '../../services/api';
import { genkitApi } from '../../services/genkit';
import { exportToPdf } from '../../utils/exportEngine';
import { KrDarkSpring, staggerContainer } from '../../design/tokens/motion-presets';

export function KSCGenerator() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Form State
  const [jobUrl, setJobUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [criteria, setCriteria] = useState('');
  const [star, setStar] = useState({
    situation: '',
    task: '',
    action: '',
    result: '',
  });
  const [response, setResponse] = useState('');

  // Load draft on mount
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await api.getKSCDraft();
        if (draft) {
          setCriteria(draft.criteria);
          setStar(draft.star);
          setStep(draft.step);
          toast.info('Resumed your draft response');
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadDraft();
  }, []);

  // Save draft whenever state changes
  useEffect(() => {
    if (isInitialLoading) return;
    
    const saveDraft = async () => {
      await api.saveKSCDraft({
        criteria,
        star,
        step,
      });
    };
    saveDraft();
  }, [criteria, star, step, isInitialLoading]);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleAnalyzeUrl = async () => {
    if (!jobUrl) return;
    setIsAnalyzing(true);
    try {
      const result = await genkitApi.analyzeJobFromUrl({ url: jobUrl });

      if (result.analysis_success) {
        if (result.job_details.essential_criteria?.length) {
          setCriteria(result.job_details.essential_criteria.join('\n\n'));
          toast.success('Selection criteria extracted successfully!');
        } else if (result.job_details.full_description) {

          setCriteria(result.job_details.full_description);
          toast.success('Job description extracted (please manually refine criteria)');
        } else {
          toast.error('No criteria found. Please enter manually.');
        }
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

      const generatePromise = genkitApi
        .generateKSCResponse(criteria, star, userProfile)
        .then((refinedStar) => {
          return generateExpertResponse(criteria, refinedStar);
        });

      toast.promise(generatePromise, {
        loading: 'Applying APS ILS Standards...',
        success: 'KSC Response generated with professional competency frameworks!',
        error: 'Generation failed. Please try again.',
      });

      const finalResponse = await generatePromise;
      setResponse(finalResponse);
      setStep(3);
    } catch (error) {
      console.error('KSC Generation Error:', error);
      toast.error('Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      await exportToPdf('ksc-response-content', 'KSC_Response.pdf');
      toast.success('KSC Response downloaded as PDF!');
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    }
  };

  const resetForm = async () => {
    setCriteria('');
    setStar({ situation: '', task: '', action: '', result: '' });
    setResponse('');
    setStep(1);
    await api.clearKSCDraft();
    toast.success('Form reset and draft cleared');
  };

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="p-6 md:p-12 max-w-5xl mx-auto"
    >
      <PageHeader
        title="KSC Generator"
        highlightedWord="Wizard"
        description="Craft perfect selection criteria responses using the STAR method"
      />

      {/* Progress Stepper */}
      <motion.div
        transition={KrDarkSpring}
        className="flex items-center justify-center mb-8 gap-4"
      >
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                step >= s
                  ? 'bg-primary text-on-primary shadow-elevation-2 scale-110'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-1 mx-2 rounded-full transition-colors duration-500 ${
                  step > s ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              />
            )}
          </div>
        ))}
      </motion.div>

      {/* Main Card */}
      <motion.div
        transition={KrDarkSpring}
        className="bg-surface-container rounded-leaf p-8 border border-outline-variant shadow-elevation-1 relative overflow-hidden"
      >
        <AnimatePresence>
          {/* Step 1: Criteria Input */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={KrDarkSpring}
              className="space-y-6"
            >
              <h2 className="text-title-large font-display font-bold text-on-surface">
                Target Selection Criteria
              </h2>

              {/* URL Import Section */}
              <div className="p-4 bg-secondary-container/20 rounded-tech border border-secondary-container">
                <label className="block text-on-surface mb-2 text-label-large font-bold font-body">
                  Import from URL (Optional)
                </label>
                <div className="flex gap-2">
                  <Input
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="Paste job listing URL..."
                    className="bg-surface font-body"
                  />
                  <Button
                    onClick={handleAnalyzeUrl}
                    disabled={!jobUrl || isAnalyzing}
                    className="bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary whitespace-nowrap rounded-pebble"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Scanning...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" /> Extract Criteria
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-body-small text-on-surface-variant mt-2 font-body">
                  We'll automatically find and extract the key selection criteria from the job page.
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-outline-variant" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-surface px-2 text-on-surface-variant font-body">Or enter manually</span>
                </div>
              </div>

              <div>
                <label className="block text-on-surface mb-3 text-label-large font-bold font-body">
                  Paste Selection Criteria
                </label>
                <Textarea
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  placeholder="e.g. Demonstrated ability to lead complex projects..."
                  className="bg-surface-container-high border-outline-variant text-on-surface rounded-tech resize-none h-48 focus:ring-primary focus:border-primary font-body text-body-medium"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={!criteria.trim()}
                  className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary rounded-pebble px-8 h-12 flex items-center gap-2 font-bold transition-all shadow-sm"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: STAR Method */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={KrDarkSpring}
              className="space-y-6"
            >
              <h2 className="text-title-large font-display font-bold text-on-surface">Step 2: The STAR Method</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-primary font-bold text-label-large font-body">S — Situation</label>
                  <Textarea
                    value={star.situation}
                    onChange={(e) => setStar({ ...star, situation: e.target.value })}
                    placeholder="Describe the context or challenge..."
                    className="bg-surface-container-high border-outline-variant text-on-surface rounded-tech h-32 focus:ring-secondary focus:border-secondary font-body"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-secondary font-bold text-label-large font-body">T — Task</label>
                  <Textarea
                    value={star.task}
                    onChange={(e) => setStar({ ...star, task: e.target.value })}
                    placeholder="What was your responsibility?"
                    className="bg-surface-container-high border-outline-variant text-on-surface rounded-tech h-32 focus:ring-secondary focus:border-secondary font-body"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-tertiary font-bold text-label-large font-body">A — Action</label>
                  <Textarea
                    value={star.action}
                    onChange={(e) => setStar({ ...star, action: e.target.value })}
                    placeholder="What specific steps did you take?"
                    className="bg-surface-container-high border-outline-variant text-on-surface rounded-tech h-32 focus:ring-tertiary focus:border-tertiary font-body"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-error font-bold text-label-large font-body">R — Result</label>
                  <Textarea
                    value={star.result}
                    onChange={(e) => setStar({ ...star, result: e.target.value })}
                    placeholder="What was the outcome? Quantify if possible."
                    className="bg-surface-container-high border-outline-variant text-on-surface rounded-tech h-32 focus:ring-error focus:border-error font-body"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  onClick={handleBack}
                  variant="text"
                  className="text-on-surface-variant hover:text-on-surface rounded-pebble px-6 font-body"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={!star.situation || !star.task || !star.action || !star.result || loading}
                  className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary rounded-pebble px-8 h-12 flex items-center gap-2 font-bold shadow-elevation-1 transition-all group"
                >
                  <Sparkles className={`w-5 h-5 ${loading ? 'animate-pulse text-tertiary' : 'group-hover:rotate-12 transition-transform'}`} />
                  {loading ? 'Honing Response...' : 'Generate KSC'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={KrDarkSpring}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-title-large font-display font-bold text-on-surface flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-tertiary" /> Generated Response
                </h2>
                <div className="flex gap-2">
                  <Button
                    onClick={resetForm}
                    variant="text"
                    className="text-on-surface-variant hover:text-error rounded-pebble font-body"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> New
                  </Button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                id="ksc-response-content"
                className="bg-surface-container-low rounded-tech p-6 text-on-surface whitespace-pre-wrap border border-outline-variant shadow-inner font-body text-body-medium leading-relaxed"
              >
                {response}
              </motion.div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  onClick={handleDownloadPdf}
                  variant="outlined"
                  className="border-tertiary text-tertiary hover:bg-tertiary hover:text-on-tertiary rounded-pebble px-8 h-12 flex items-center gap-2 font-bold font-body"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(response);
                    toast.success('Copied to clipboard');
                  }}
                  className="bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary rounded-pebble px-8 h-12 flex items-center gap-2 font-bold shadow-sm font-body"
                >
                  <Copy className="w-4 h-4" /> Copy to Clipboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// EXPERT RESPONSE GENERATOR - Brain Transplant from MiniMe
// ============================================================================

interface STARInput {
  situation: string;
  task: string;
  action: string;
  result: string;
}

/**
 * Generate expert KSC response using:
 * - APS Integrated Leadership System (ILS) standards
 * - STAR methodology
 * - Australian Social Work context
 */
function generateExpertResponse(criteria: string, star: STARInput): string {
  const { situation, task, action, result } = star;

  return `# Key Selection Criteria Response

      ## Addressing the Criterion
      **"${criteria}"**

      ---

      ## Professional Response

      I have consistently demonstrated this capability throughout my career in social services, particularly during my work in child protection and community mental health settings.

      ### Situation
      ${situation}

      ### Task
      ${task}

      ### Action
      ${action}

      My approach aligned with the APS Integrated Leadership System (ILS) principles, particularly:
      - **Shapes Strategic Thinking:** Anticipating long-term impacts and systemic considerations
      - **Achieves Results:** Delivering measurable outcomes within resource constraints
      - **Cultivates Productive Working Relationships:** Building trust with stakeholders across the service system
      - **Exemplifies Personal Drive and Integrity:** Maintaining professional standards under pressure
      - **Communicates with Influence:** Tailoring messaging for diverse audiences

      ### Result
      ${result}

      ---

      ## Alignment with Australian Social Work Standards

      This experience demonstrates my commitment to:
      - **Evidence-based practice:** Utilizing data and research to inform decision-making
      - **Cultural competency:** Recognizing and responding to diverse community needs
      - **Ethical practice:** Adhering to AASW Code of Ethics in challenging circumstances
      - **Professional accountability:** Maintaining compliance with WWCC, CPD, and regulatory requirements

      ### Quantifiable Outcomes
      ${extractQuantifiableMetrics(result)}

      ---

      *This response demonstrates the capability through concrete examples while maintaining alignment with sector-specific competency frameworks and professional standards.*
      `;
}

/**
 * Extract or suggest quantifiable metrics from the result
 */
function extractQuantifiableMetrics(result: string): string {
  const hasNumbers = /\d+/.test(result);

  if (hasNumbers) {
    return `The outcomes included specific measurable achievements detailed above, demonstrating tangible impact.`;
  }

  return `*Consider adding quantifiable metrics such as:*
      - **Client outcomes:** Number of individuals/families supported
      - **Efficiency gains:** Percentage reduction in processing time or waitlists
      - **Stakeholder engagement:** Number of partnerships established or meetings facilitated
      - **Compliance:** Percentage improvement in documentation compliance or audit outcomes`;
}
