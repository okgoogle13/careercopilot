/**
 * ELECTRIC ALCHEMIST: KSC GENERATOR PAGE
 *
 * KSC Generator page using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { Container, Card, Textarea } from '@/components';
import { Button } from '@/components/ui/button';
import { generateSingleKscResponse } from '../../api/aiServices';

export function KscGeneratorPage() {
  const [jobDescription, setJobDescription] = React.useState('');
  const [criterion, setCriterion] = React.useState('');
  const [response, setResponse] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = async () => {
    if (!jobDescription.trim() || !criterion.trim()) {
      setError('Please provide both the Job Description and the Selection Criterion.');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const result = await generateSingleKscResponse(criterion, jobDescription);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="lg">
      <div className="py-8 space-y-8">
        <div>
          <h1 className="text-hero text-3xl font-semibold mb-2">KSC Generator</h1>
          <p className="text-human text-on-surface-variant">Generate tailored responses to key selection criteria based on the job description.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card variant="default" className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-human text-sm font-medium text-on-surface">Job Description (Context)</label>
                <Textarea
                  placeholder="Paste the full job description here..."
                  rows={8}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-human text-sm font-medium text-on-surface">Target Selection Criterion</label>
                <Textarea
                  placeholder="e.g. 'Demonstrated ability to lead a team...'"
                  rows={4}
                  value={criterion}
                  onChange={(e) => setCriterion(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-3 bg-error-container text-on-error-container text-sm rounded-md">
                  {error}
                </div>
              )}

              <Button
                variant="default"
                onClick={handleGenerate}
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Generating Response...' : 'Generate Response'}
              </Button>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <Card variant="tertiary" className="p-6 h-full min-h-[400px] flex flex-col">
              <h3 className="text-hero text-lg font-medium mb-4">Generated Response</h3>

              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-surface-container-highest rounded w-3/4"></div>
                  <div className="h-4 bg-surface-container-highest rounded w-full"></div>
                  <div className="h-4 bg-surface-container-highest rounded w-5/6"></div>
                  <div className="h-4 bg-surface-container-highest rounded w-full"></div>
                  <div className="h-4 bg-surface-container-highest rounded w-2/3"></div>
                </div>
              ) : response ? (
                <div className="prose prose-sm text-human text-on-surface whitespace-pre-wrap">
                  {response}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-on-surface-variant text-sm text-center italic">
                  Enter details and click generate to see the AI response here.
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default KscGeneratorPage;

