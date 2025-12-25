import { useState } from 'react';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Sparkles, Copy, X } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';

export function KSCGenerator() {
  const [criteria, setCriteria] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);

    // Mock AI generation
    setTimeout(() => {
      setResponse(
        `Based on the selection criteria you provided, here's a tailored response:\n\n${criteria}\n\nI have demonstrated extensive experience in this area through my work at...\n\n[AI-generated content would appear here]`
      );
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500 ease-spring">
      {/* Header */}
      <PageHeader
        title="KSC Generator"
        highlightedWord="Generator"
        description="Generate tailored responses to key selection criteria"
      />

      {/* Card */}
      <div
        className="bg-surface-container rounded-tech p-8 border border-outline-variant shadow-elevation-1"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--sys-color-primary) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundBlendMode: 'overlay',
          backgroundPosition: '0 0',
          opacity: 0.95
        }}
      >
        <div className="space-y-6 relative z-10">
          {/* Input Section */}
          <div>
            <label className="block text-on-surface mb-3 text-label-large font-medium">Selection Criteria</label>
            <Textarea
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              placeholder="Paste the key selection criteria from the job posting here..."
              rows={10}
              className="bg-surface-container-high border-outline-variant text-on-surface rounded-leaf resize-none focus:ring-primary focus:border-primary font-body text-body-medium"
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!criteria.trim() || loading}
            className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary rounded-pebble px-8 h-12 flex items-center gap-2 font-bold transition-all duration-short-2 ease-spring shadow-sm hover:shadow-elevation-1 w-full md:w-auto justify-center"
          >
            <Sparkles className="w-5 h-5" />
            {loading ? 'Generating...' : 'Generate Response'}
          </Button>

          {/* Response Section */}
          {response && (
            <div className="mt-8 pt-8 border-t border-outline-variant animate-in slide-in-from-bottom-4 duration-500 ease-spring">
              <label className="block text-on-surface mb-3 text-label-large font-medium">Generated Response</label>
              <div className="bg-surface-container-low rounded-leaf p-6 text-on-surface whitespace-pre-wrap border border-outline-variant shadow-inner">
                {response}
              </div>
              <div className="flex gap-4 mt-4">
                <Button
                  onClick={() => navigator.clipboard.writeText(response)}
                  variant="outline"
                  className="rounded-pebble px-6 border-outline text-on-surface hover:bg-surface-container-high hover:text-primary transition-all gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy to Clipboard
                </Button>
                <Button
                  onClick={() => setResponse('')}
                  variant="ghost"
                  className="rounded-pebble px-6 text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-all gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
