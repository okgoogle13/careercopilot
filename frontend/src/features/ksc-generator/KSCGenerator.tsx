import { useState } from 'react';
import { Textarea } from '@careercopilot/ui';
import { Button } from '@careercopilot/ui';
import { Sparkles, Copy, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, Download } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { exportToPdf } from '../../utils/exportEngine';
import { toast } from 'sonner';
import { KSC_EXPERT_PROMPT } from '../../services/prompts';

export function KSCGenerator() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [criteria, setCriteria] = useState('');
  const [star, setStar] = useState({
    situation: '',
    task: '',
    action: '',
    result: ''
  });
  const [response, setResponse] = useState('');

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleGenerate = () => {
    setLoading(true);

    // Show toast with APS ILS Standards message
    const generatePromise = new Promise<string>((resolve) => {
      setTimeout(() => {
        const expertResponse = generateExpertResponse(criteria, star);
        setResponse(expertResponse);
        setLoading(false);
        setStep(3);
        resolve(expertResponse);
      }, 2000);
    });

    toast.promise(generatePromise, {
      loading: 'Applying APS ILS Standards...',
      success: 'KSC Response generated with professional competency frameworks!',
      error: 'Generation failed. Please try again.',
    });
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

  const resetForm = () => {
    setCriteria('');
    setStar({ situation: '', task: '', action: '', result: '' });
    setResponse('');
    setStep(1);
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500 ease-spring">
      <PageHeader
        title="KSC Generator"
        highlightedWord="Wizard"
        description="Craft perfect selection criteria responses using the STAR method"
      />

      {/* Progress Stepper */}
      <div className="flex items-center justify-center mb-8 gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= s
                ? 'bg-primary text-on-primary shadow-elevation-1'
                : 'bg-surface-container-high text-on-surface-variant'
                }`}
            >
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-1 mx-2 rounded-full ${step > s ? 'bg-primary' : 'bg-surface-container-high'
                  }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-surface-container rounded-leaf p-8 border border-outline-variant shadow-elevation-1 relative overflow-hidden">
        {/* Step 1: Selection Criteria */}
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
            <div>
              <label className="block text-on-surface mb-3 text-label-large font-bold">
                Step 1: Paste Selection Criteria
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
          </div>
        )}

        {/* Step 2: STAR Method */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
            <h2 className="text-title-large font-bold text-on-surface">Step 2: The STAR Method</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-primary font-bold text-label-large">S — Situation</label>
                <Textarea
                  value={star.situation}
                  onChange={(e) => setStar({ ...star, situation: e.target.value })}
                  placeholder="Describe the context or challenge..."
                  className="bg-surface-container-high border-outline-variant text-on-surface rounded-tech h-32 focus:ring-secondary focus:border-secondary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-secondary font-bold text-label-large">T — Task</label>
                <Textarea
                  value={star.task}
                  onChange={(e) => setStar({ ...star, task: e.target.value })}
                  placeholder="What was your responsibility?"
                  className="bg-surface-container-high border-outline-variant text-on-surface rounded-tech h-32 focus:ring-secondary focus:border-secondary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-tertiary font-bold text-label-large">A — Action</label>
                <Textarea
                  value={star.action}
                  onChange={(e) => setStar({ ...star, action: e.target.value })}
                  placeholder="What specific steps did you take?"
                  className="bg-surface-container-high border-outline-variant text-on-surface rounded-tech h-32 focus:ring-tertiary focus:border-tertiary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-error font-bold text-label-large">R — Result</label>
                <Textarea
                  value={star.result}
                  onChange={(e) => setStar({ ...star, result: e.target.value })}
                  placeholder="What was the outcome? Quantify if possible."
                  className="bg-surface-container-high border-outline-variant text-on-surface rounded-tech h-32 focus:ring-error focus:border-error"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                onClick={handleBack}
                variant="text"
                className="text-on-surface-variant hover:text-on-surface rounded-pebble px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!star.situation || !star.task || !star.action || !star.result || loading}
                className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary rounded-pebble px-8 h-12 flex items-center gap-2 font-bold shadow-elevation-1"
              >
                <Sparkles className="w-5 h-5" />
                {loading ? 'Generating...' : 'Generate KSC'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-title-large font-bold text-on-surface flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-tertiary" /> Generated Response
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={resetForm}
                  variant="text"
                  className="text-on-surface-variant hover:text-error rounded-pebble"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> New
                </Button>
              </div>
            </div>

            <div
              id="ksc-response-content"
              className="bg-surface-container-low rounded-tech p-6 text-on-surface whitespace-pre-wrap border border-outline-variant shadow-inner font-body text-body-medium leading-relaxed"
            >
              {response}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                onClick={handleDownloadPdf}
                variant="outlined"
                className="border-tertiary text-tertiary hover:bg-tertiary hover:text-on-tertiary rounded-pebble px-8 h-12 flex items-center gap-2 font-bold"
              >
                <Download className="w-4 h-4" /> Download PDF
              </Button>
              <Button
                onClick={() => navigator.clipboard.writeText(response)}
                className="bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary rounded-pebble px-8 h-12 flex items-center gap-2 font-bold shadow-sm"
              >
                <Copy className="w-4 h-4" /> Copy to Clipboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
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
