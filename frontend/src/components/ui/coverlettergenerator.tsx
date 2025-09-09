import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/ui/editor";
import { generateCoverLetter } from "@/api/aiServices";

type ToneSetting = 'Formal' | 'Casual' | 'Enthusiastic';

export const CoverLetterGenerator: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [tone, setTone] = useState<ToneSetting>('Formal');

  const handleGenerateCoverLetter = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const coverLetter = await generateCoverLetter(jobDescription, tone.toLowerCase());
      setGeneratedCoverLetter(coverLetter);
    } catch (error) {
      console.error('Cover letter generation failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate cover letter');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className={cn(
        "container mx-auto p-8",
        "bg-background",
        "min-h-screen"
      )}
    >
      <div
        className={cn(
          "grid md:grid-cols-2 gap-8",
          "max-w-6xl mx-auto"
        )}
      >
        {/* Left Panel: Job Description */}
        <Card className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Job Description
          </h2>

          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to generate a tailored cover letter..."
            className="min-h-[450px]"
          />

          <div className="flex items-center gap-4">
            <label className="text-sm text-muted-foreground">
              Tone:
            </label>
            <Select value={tone} onValueChange={(val: ToneSetting) => setTone(val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {['Formal', 'Casual', 'Enthusiastic'].map((toneOption) => (
                  <SelectItem key={toneOption} value={toneOption}>
                    {toneOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerateCoverLetter}
            disabled={!jobDescription || isGenerating}
            className="w-full"
          >
            {isGenerating ? 'Generating Cover Letter...' : 'Generate Tailored Cover Letter'}
          </Button>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
              {error}
            </div>
          )}
        </Card>

        {/* Right Panel: Generated Cover Letter */}
        <Card className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Tailored Cover Letter
          </h2>

          <Editor
            value={generatedCoverLetter}
            onChange={setGeneratedCoverLetter}
            placeholder="Your tailored cover letter will appear here..."
            className="min-h-[450px]"
          />

          <div className="flex gap-4">
            <Button variant="secondary" className="flex-1">
              Download PDF
            </Button>
            <Button className="flex-1">
              Save Version
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
