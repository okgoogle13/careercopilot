import { useState } from 'react';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Sparkles, Copy, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';

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
    // Mock AI Generation
    setTimeout(() => {
      setResponse(
        `# Key Selection Criteria Response\n\n**Criteria:** ${criteria}\n\n**Situation:**\n${star.situation}\n\n**Task:**\n${star.task}\n\n**Action:**\n${star.action}\n\n**Result:**\n${star.result}\n\n---\n\nBased on your STAR inputs, here is a professional response:\n\nIn my previous role as a [Role], I demonstrated this capability when ${star.situation.toLowerCase()}. Use 'The Leaf' identity to guide your response...`
      );
      setLoading(false);
      setStep(3);
    }, 2000);
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
                variant="ghost"
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
                  variant="ghost"
                  className="text-on-surface-variant hover:text-error rounded-pebble"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> New
                </Button>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-tech p-6 text-on-surface whitespace-pre-wrap border border-outline-variant shadow-inner font-body text-body-medium leading-relaxed">
              {response}
            </div>

            <div className="flex justify-end pt-4">
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
